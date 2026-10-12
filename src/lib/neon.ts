// Neon PostgreSQL Configuration for BRP-Admin-Panel
import { neon } from '@neondatabase/serverless';

export const neonProjectConfig = {
  projectId: "steep-haze-58773380",
  projectName: "biotech-research-park",
  branchId: "br-crimson-math-zajtntw9",
  branchName: "production",
  databaseUrl: "postgresql://neondb_owner:npg_PqJybnf13pmk@ep-red-pine-zahug5af-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require",
  authBaseUrl: "https://ep-red-pine-zahug5af.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth",
};

// Safe Neon SQL query client instance
let sqlInstance: any = null;
try {
  if (neonProjectConfig.databaseUrl) {
    sqlInstance = neon(neonProjectConfig.databaseUrl);
  }
} catch (err) {
  console.warn('Neon client initialization note:', err);
}

export const sql = sqlInstance;
