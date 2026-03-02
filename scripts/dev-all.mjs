import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPortFree = (port) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen({ port, host: "127.0.0.1" }, () => {
      server.close(() => resolve(true));
    });
  });

const findFreePort = async (startPort, maxTries = 50) => {
  let port = startPort;
  for (let i = 0; i < maxTries; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(port)) return port;
    port += 1;
  }
  throw new Error(
    `No free port found starting from ${startPort} within ${maxTries} attempts.`,
  );
};

const startProcess = (name, cwd, extraEnv = {}) => {
  const mergedEnv = {};
  for (const [key, value] of Object.entries(process.env)) {
    // Windows can include pseudo env keys like "=C:" which break spawn with EINVAL.
    if (!key || key.startsWith("=") || value == null) continue;
    mergedEnv[key] = String(value);
  }
  for (const [key, value] of Object.entries(extraEnv)) {
    if (!key || key.startsWith("=") || value == null) continue;
    mergedEnv[key] = String(value);
  }

  const isWin = process.platform === "win32";
  const child = isWin
    ? spawn("npm run dev", {
        cwd,
        stdio: "inherit",
        env: mergedEnv,
        shell: true,
      })
    : spawn(npmCmd, ["run", "dev"], {
        cwd,
        stdio: "inherit",
        env: mergedEnv,
      });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
};

const children = [];
const shutdown = () => {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);

const main = async () => {
  const backendBase = Number(process.env.BACKEND_PORT || 3000);
  const customerBase = Number(process.env.CUSTOMER_PORT || 5173);
  const adminBase = Number(process.env.ADMIN_PORT || 5174);

  const backendPort = await findFreePort(backendBase);
  const customerPort = await findFreePort(customerBase);
  const adminPort = await findFreePort(adminBase);
  const apiTarget = `http://localhost:${backendPort}`;

  console.log("\nStarting all apps with resolved ports:");
  console.log(`Backend         : ${backendPort}`);
  console.log(`CustomerFrontend: ${customerPort}`);
  console.log(`Frontend(Admin) : ${adminPort}`);
  console.log(`API Target      : ${apiTarget}\n`);

  children.push(
    startProcess("backend", path.join(rootDir, "Backend"), {
      PORT: String(backendPort),
    }),
  );

  // Give backend a brief head-start before frontends begin proxying.
  await sleep(700);

  children.push(
    startProcess("customer", path.join(rootDir, "CustomerFrontend"), {
      VITE_DEV_PORT: String(customerPort),
      VITE_API_TARGET: apiTarget,
    }),
  );

  children.push(
    startProcess("admin", path.join(rootDir, "Frontend"), {
      VITE_DEV_PORT: String(adminPort),
      VITE_API_TARGET: apiTarget,
    }),
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
