import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
// @ts-ignore - cors types issue
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";

const app = express();

// CORS configuration for split deployment (Netlify frontend + separate backend)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://www.lilhelper.ai',
    'https://lilhelper.ai',
    /\.netlify\.app$/,  // Allow Netlify preview domains
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

(async () => {
  // CREATE SERVER FIRST
  const server = createServer(app);

  // PASS BOTH ARGUMENTS IN CORRECT ORDER
  await registerRoutes(server, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = parseInt(process.env.PORT || "5000", 10);

  server.listen(PORT, () => {
    console.log(`✅ Crystal server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started: ${new Date().toISOString()}`);
  });
})();
