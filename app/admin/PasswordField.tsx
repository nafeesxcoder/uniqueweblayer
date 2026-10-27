"use client";

import { useId, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * A password box you can look inside.
 *
 * Typing a long password blind is how a sign-in fails three times over a
 * mistyped character — and the longer the password, the worse it gets. The eye
 * is off by default, so nothing is on screen until you ask for it.
 *
 * The toggle sits outside the tab order: tabbing from the password box should
 * reach the submit button, not a decoration. It is still reachable and
 * announced for a screen reader through its label.
 */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete = "current-password",
  minLength,
  placeholder,
  required = true,
}: {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
  minLength?: number;
  placeholder?: string;
  required?: boolean;
}) {
  const generated = useId();
  const inputId = id || generated;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-medium text-gray-400"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          placeholder={placeholder}
          required={required}
          /*
           * Room on the right so the longest password never runs under the eye.
           * Left at 16px rather than text-sm on purpose: iOS zooms the page in
           * on any input smaller than that, and it does not zoom back out.
           */
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-base text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-500 transition hover:text-gray-300"
        >
          {visible ? (
            <FaEyeSlash className="h-4 w-4" />
          ) : (
            <FaEye className="h-4 w-4" />
          )}
        </button>
      </div>

      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
