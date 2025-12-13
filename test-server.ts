// test-server.ts
import http from "node:http";
import os from "node:os";
import path from "node:path";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const requiredEnv = ["OPENAI_API_KEY", "SUPABASE_URL", "SUPABASE_ANON_KEY"] as const;

function mask(value: string | undefined): string {
  if (!value) return "(missing)";
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

const envReport = requiredEnv.map((k) => ({
  key: k,
  present: Boolean(process.env[k]),
  valuePreview: mask(process.env[k])
}));

const missing = envReport.filter((e) => !e.present).map((e) => e.key);

console.log("\n💎 CRYSTAL SYSTEM DIAGNOSTIC 💎");
console.log("--------------------------------");
console.log("Runtime:", process.version);
console.log("OS Platform:", process.platform);
console.log("Working Dir:", process.cwd());
console.table(envReport);

if (missing.length) {
  console.warn("\n⚠️  CRITICAL: Missing environment variables:", missing.join(", "));
  console.warn("Please check your .env file.");
} else {
  console.log("\n✅ Environment checks passed.");
}

const port = Number(process.env.PORT || 5055);
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ status: "Crystal Online", time: new Date() }, null, 2));
});

server.listen(port, () => {
  console.log(`\n🚀 Sanity Server running at http://localhost:${port}`);
  console.log("(Press Ctrl+C to stop)");
});