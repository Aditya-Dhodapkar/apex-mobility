import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

function parseDbUrl(dbUrl: string) {
  try {
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      port: url.port,
      database: url.pathname.slice(1),
      user: url.username,
      password: url.password,
    };
  } catch (err) {
    throw new Error("Invalid DATABASE_URL format");
  }
}

const parsed = parseDbUrl(process.env.DATABASE_URL);
console.log("Connecting to DB:", parsed.host, "on port", parsed.port);

const isCI = process.env.CI === "true";

const outputFolder = isCI ? "./migrations-ci" : "./migrations";

const schemaPath = process.env.SCHEMA_PATH || "./shared/schema.ts";

const dbDialect = process.env.DB_DIALECT || "postgresql";

if (!process.env.SCHEMA_PATH) {
  console.warn("Using fallback schema path:", schemaPath);
}

export const drizzleConfig = {
  out: outputFolder,
  schema: schemaPath,
  dialect: dbDialect,
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};

export default defineConfig({
  out: outputFolder,
  schema: schemaPath,
  dialect: dbDialect,
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

export function logDrizzleConfig() {
  console.log("Drizzle config:");
  console.log("Output folder:", outputFolder);
  console.log("Schema path:", schemaPath);
  console.log("Dialect:", dbDialect);
  console.log("CI mode:", isCI);
}