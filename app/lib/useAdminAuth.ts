"use client";

import { useCallback, useEffect, useState } from "react";
import { adminLogin, verifyAdminToken } from "./api";

const STORAGE_KEY = "uwl_admin_token";

/**
 * Admin session for the Add Project screen.
 *
 * The token lives in localStorage, so it survives a refresh but never leaves
 * this browser. Every write request is still authorised by the backend, so a
 * tampered localStorage value just produces a 401.
 */
export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // On mount, revive and re-validate any stored token.
  useEffect(() => {
    let cancelled = false;
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    if (!stored) {
      setChecking(false);
      return;
    }

    verifyAdminToken(stored)
      .then((data) => {
        if (cancelled) return;
        setToken(stored);
        setEmail(data.admin.email);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (userEmail: string, password: string) => {
    const data = await adminLogin(userEmail, password);
    localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setEmail(data.admin.email);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setEmail(null);
  }, []);

  return { token, email, checking, isAdmin: Boolean(token), login, logout };
}
