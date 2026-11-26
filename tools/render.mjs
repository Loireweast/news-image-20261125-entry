// Render tools/scene.html to entry.png using headless Chrome over the
// DevTools pipe (stdio fds 3/4, NUL-terminated JSON frames; loopback is
// blocked in this environment, so no websocket port is used).
// Usage: node tools/render.mjs [scene.html path] [output png path]
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const scenePath = resolve(process.argv[2] ?? `${here}/scene.html`);
const outPath = resolve(process.argv[3] ?? `${here}/../entry.png`);

const policyPath = "/tmp/render-test/webgl-policy.txt";
mkdirSync("/tmp/render-test", { recursive: true });
writeFileSync(policyPath, "hatch-webgl-allowed-domains-v1\n");
const policySha = createHash("sha256").update(readFileSync(policyPath)).digest("hex");

const chrome = "/opt/meta-chromium/chrome";
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--no-first-run",
  "--remote-debugging-pipe",
  "--allow-file-access-from-files",
  "--force-device-scale-factor=1",
  "--hide-scrollbars",
  "--window-size=1024,1024",
  `--hatch-webgl-allowed-domains-file=${policyPath}`,
  `--hatch-webgl-allowed-domains-sha256=${policySha}`,
  "about:blank",
];

const child = spawn(chrome, args, {
  stdio: ["ignore", "pipe", "pipe", "pipe", "pipe"],
});
const toChrome = child.stdio[3]; // parent writes -> chrome fd 3
const fromChrome = child.stdio[4]; // chrome fd 4 -> parent reads

let nextId = 1;
const pending = new Map();
const events = [];
let buf = Buffer.alloc(0);

function send(method, params = {}, sessionId) {
  const id = nextId++;
  const msg = { id, method, params };
  if (sessionId) msg.sessionId = sessionId;
  toChrome.write(JSON.stringify(msg) + "\0");
  return new Promise((resolvePromise, rejectPromise) => {
    pending.set(id, { resolvePromise, rejectPromise });
  });
}

function waitForEvent(predicate, timeoutMs = 30000) {
  return new Promise((resolvePromise, rejectPromise) => {
    const timer = setTimeout(() => rejectPromise(new Error("timed out waiting for event")), timeoutMs);
    const check = () => {
      const idx = events.findIndex(predicate);
      if (idx >= 0) {
        clearTimeout(timer);
        resolvePromise(events.splice(idx, 1)[0]);
      } else {
        setTimeout(check, 25);
      }
    };
    check();
  });
}

fromChrome.on("data", (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  let nul;
  while ((nul = buf.indexOf(0)) >= 0) {
    const frame = buf.subarray(0, nul).toString("utf8");
    buf = buf.subarray(nul + 1);
    if (!frame.trim()) continue;
    let msg;
    try {
      msg = JSON.parse(frame);
    } catch {
      continue;
    }
    if (msg.id !== undefined && pending.has(msg.id)) {
      const { resolvePromise, rejectPromise } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) rejectPromise(new Error(`CDP ${msg.error.message}`));
      else resolvePromise(msg.result);
    } else if (msg.method) {
      events.push(msg);
    }
  }
});

child.stderr.on("data", () => {}); // keep stderr drained, ignore noise

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  await send("Browser.getVersion");
  const { targetId } = await send("Target.createTarget", {
    url: `file://${scenePath}`,
  });
  const { sessionId } = await send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  await send("Page.enable", {}, sessionId);
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1024,
    height: 1024,
    deviceScaleFactor: 1,
    mobile: false,
  }, sessionId);
  await send("Page.navigate", { url: `file://${scenePath}` }, sessionId);
  await waitForEvent((e) => e.method === "Page.loadEventFired" && e.sessionId === sessionId);
  await sleep(600);
  const { data } = await send("Page.captureScreenshot", { format: "png" }, sessionId);
  writeFileSync(outPath, Buffer.from(data, "base64"));
  console.log(`wrote ${outPath}`);
} finally {
  try { await send("Browser.close"); } catch {}
  await sleep(300);
  child.kill("SIGKILL");
}
