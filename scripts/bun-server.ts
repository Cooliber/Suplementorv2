#!/usr/bin/env bun

/**
 * Bun Native HTTP Server
 * Demonstrates Bun 1.3's native HTTP server capabilities
 * This is a test/development server using Bun.serve()
 */

import { Database } from "bun:sqlite";

// Create SQLite database for testing
const db = new Database(":memory:");
db.exec(`
  CREATE TABLE health_check (
    id INTEGER PRIMARY KEY,
    timestamp TEXT,
    status TEXT
  );
`);

// Insert test data
db.exec("INSERT INTO health_check (timestamp, status) VALUES (?, ?)", [
  new Date().toISOString(),
  "healthy"
]);

// Bun native HTTP server
const server = Bun.serve({
  port: 3001,
  hostname: "localhost",

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Health check endpoint
    if (url.pathname === "/health" && req.method === "GET") {
      const healthData = db.query("SELECT * FROM health_check ORDER BY id DESC LIMIT 1").get() as any;

      return Response.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        runtime: "bun",
        version: "1.3.0",
        database: healthData ? "connected" : "disconnected",
        lastHealthCheck: healthData?.timestamp
      });
    }

    // API test endpoint
    if (url.pathname === "/api/test" && req.method === "GET") {
      const performance = {
        startupTime: Date.now(),
        memoryUsage: process.memoryUsage(),
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        bunVersion: Bun.version
      };

      return Response.json({
        message: "Bun 1.3 HTTP Server Test",
        performance,
        sqlite: "enabled",
        timestamp: new Date().toISOString()
      });
    }

    // Root endpoint
    if (url.pathname === "/" && req.method === "GET") {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bun 1.3 Test Server</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
              .highlight { background: #f0f8ff; padding: 10px; border-radius: 5px; }
              code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <h1>🚀 Bun 1.3 HTTP Server</h1>
            <p>This server demonstrates Bun's native HTTP capabilities.</p>

            <div class="highlight">
              <h2>Features:</h2>
              <ul>
                <li>Native Bun.serve() API</li>
                <li>Built-in SQLite database</li>
                <li>TypeScript support</li>
                <li>High performance</li>
              </ul>
            </div>

            <h2>Endpoints:</h2>
            <ul>
              <li><code>GET /</code> - This page</li>
              <li><code>GET /health</code> - Health check with SQLite data</li>
              <li><code>GET /api/test</code> - Performance metrics</li>
            </ul>

            <p>Server running on: <code>http://localhost:3001</code></p>
            <p>Bun Version: <code>${Bun.version}</code></p>
          </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // 404 for unknown routes
    return new Response("Not Found", { status: 404 });
  },

  error(error: Error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log(`🚀 Bun 1.3 HTTP Server running at http://localhost:${server.port}`);
console.log(`📊 SQLite database: Connected`);
console.log(`⚡ Runtime: Bun ${Bun.version}`);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down Bun server...");
  server.stop();
  db.close();
  process.exit(0);
});

export default server;
