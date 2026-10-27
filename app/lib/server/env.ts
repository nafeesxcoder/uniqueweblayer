import "server-only";

/**
 * Server-side configuration.
 *
 * Next loads .env.local automatically, so there is no dotenv call here. These
 * values have no NEXT_PUBLIC_ prefix, which means they never reach the browser
 * bundle — importing this file from a client component is a build error, and
 * `server-only` above makes that failure loud instead of silent.
 */

const bool = (value: string | undefined, fallback = false) => {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

const int = (value: string | undefined, fallback: number) => {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
};

export const env = {
  isProd: process.env.NODE_ENV === "production",

  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: int(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "uniqueweblayer",
    connectionLimit: int(process.env.DB_CONNECTION_LIMIT, 10),
  },

  admin: {
    email: process.env.ADMIN_EMAIL || "info@uniqueweblayer.com",
    password: process.env.ADMIN_PASSWORD || "",
    jwtSecret: process.env.JWT_SECRET || "",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: int(process.env.SMTP_PORT, 465),
    secure: bool(process.env.SMTP_SECURE, true),
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASSWORD || "",
    fromName: process.env.MAIL_FROM_NAME || "Unique Web Layer",
    fromAddress:
      process.env.MAIL_FROM_ADDRESS ||
      process.env.SMTP_USER ||
      "contact@uniqueweblayer.com",
    contactTo: process.env.CONTACT_TO_EMAIL || "info@uniqueweblayer.com",
    sendAutoReply: bool(process.env.SEND_AUTOREPLY, true),
  },
};