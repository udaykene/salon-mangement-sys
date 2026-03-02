import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const runtimePortFile = path.resolve(process.cwd(), "../.runtime/backend-port.json");
  let discoveredTarget = "";
  try {
    if (fs.existsSync(runtimePortFile)) {
      const raw = fs.readFileSync(runtimePortFile, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed?.port) {
        discoveredTarget = `http://localhost:${parsed.port}`;
      }
    }
  } catch {
    discoveredTarget = "";
  }
  const apiProtocol = env.VITE_API_PROTOCOL || "http";
  const apiHost = env.VITE_API_HOST || "localhost";
  const apiPort = env.VITE_API_PORT || "3000";
  const apiTarget =
    env.VITE_API_TARGET ||
    discoveredTarget ||
    `${apiProtocol}://${apiHost}:${apiPort}`;
  const devPort = Number(env.VITE_DEV_PORT || 5174);

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: devPort,
      strictPort: false,
      proxy: {
        "/auth": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
