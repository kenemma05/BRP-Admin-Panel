// Neon PostgreSQL Configuration for BRP-Admin-Panel
import { neon } from '@neondatabase/serverless';

const configuredUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DATABASE_URL?.trim()) ||
  (typeof process !== 'undefined' && process.env?.DATABASE_URL?.trim()) ||
  "";

export const neonProjectConfig = {
  projectId: "steep-haze-58773380",
  projectName: "biotech-research-park",
  branchId: "br-crimson-math-zajtntw9",
  branchName: "production",
  databaseUrl: configuredUrl,
  authBaseUrl: "https://ep-red-pine-zahug5af.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth",
};

// Safe Neon SQL query client instance
let sqlInstance: any = null;
try {
  if (neonProjectConfig.databaseUrl && neonProjectConfig.databaseUrl.startsWith('postgres')) {
    sqlInstance = neon(neonProjectConfig.databaseUrl);
  }
} catch (err) {
  console.warn('Neon client initialization note:', err);
}

export const sql = sqlInstance;
