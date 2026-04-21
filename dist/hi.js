#!/usr/bin/env node
import { CustomEvent as NodeCustomEvent } from "node:util";
if (typeof globalThis.CustomEvent === "undefined") {
  globalThis.CustomEvent = NodeCustomEvent;
}
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { hostname, networkInterfaces, tmpdir } from "node:os";
import { join } from "node:path";
import { cac } from "cac";
import { execa, execaNode } from "execa";
const cli = cac("hi");
const PKG_JSON_OBJ = (() => {
  try {
    const pkgPath = join(process.cwd(), "package.json");
    return JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
  }
})();
async function getUpstreamRemote() {
  try {
    const { stdout } = await execa`git rev-parse --abbrev-ref --symbolic-full-name @{u}`;
    return stdout.split("/")[0] || "origin";
  } catch {
    return "origin";
  }
}
async function mm(updMaster) {
  console.log("\u{1F680} Syncing master...");
  await execa({
    stdio: "inherit",
    env: { GIT_TRACE: "1" }
  })`git fetch ${updMaster ? `${await getUpstreamRemote()} master:master` : ""}`;
  await execa({
    stdio: "inherit"
  })`git merge ${await getUpstreamRemote()}/master --no-verify --no-edit`;
  console.log("\u{1F389} DONE!");
}
cli.command(
  "mm",
  "[M]erge [M]aster: Update master branch to remote's, then merge into current branch"
).action(() => mm(true));
cli.command(
  "mmm",
  "[M]erge [M]aster [M]odified: Merge remote's master into current branch, without updating local master branch"
).action(() => mm(false));
const hasPackage = (name) => !!(PKG_JSON_OBJ?.dependencies?.[name] || PKG_JSON_OBJ?.devDependencies?.[name]);
cli.command("tt i18n", "I18n scan and sort").action(async () => {
  await execa({ stdio: "inherit" })`${hasPackage("@ies/starling-cli") ? "starling" : "pnpm dlx @ies/starling-cli"} scan -c ./starling.config.js --fallback --disable-browser`;
  await execaNode({ stdio: "inherit" })`./combine-lang.js`;
  await execa({
    stdio: "inherit"
  })`pnpm --package=json-sort-cli dlx sortjson ./src/lang`.catch();
});
cli.command("tt bam", "Update BAM code-gen").action(
  () => execa({ stdio: "inherit" })`${hasPackage("@byted-arch-fe/bam-code-generator") ? "bam" : "pnpm dlx @byted-arch-fe/bam-code-generator"} update`
);
cli.command("tschk", "My ts-check rules").action(async () => {
  console.log("\u{1F50D} Running custom tsc type-check...");
  const ignoredCodes = [
    "2322",
    // Type 'X' is not assignable to type 'Y'
    "2339",
    // Property 'X' does not exist on type 'Y'
    "2551",
    // Property 'X' does not exist on type 'Y'. Did you mean 'Z'?
    "6133",
    // 'X' is declared but its value is never read (Unused var)
    "6192",
    // All imports in 'X' are unused
    "18048"
    // 'X' is possibly 'null' or 'undefined'
  ];
  try {
    const { stdout } = await execa({
      reject: false,
      // 报错时不直接抛出异常
      stderr: "ignore"
    })`npx tsc --noEmit --emitDeclarationOnly false`;
    const filteredLines = stdout.split("\n").filter((line) => {
      if (!/error TS\d+?/.test(line)) return false;
      if (ignoredCodes.some((code) => line.includes(`TS${code}`))) return false;
      return true;
    });
    if (filteredLines.length > 0) {
      filteredLines.map(console.log);
      console.log("\n\u274C Type-check failed!");
      process.exit(1);
    } else {
      console.log("\u2705 Type-check passed!");
    }
  } catch (err) {
    console.error("\n\u274C Unexpected err when type-checking:", err);
    process.exit(1);
  }
});
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
cli.command("wup", "[W]ait for pkg publish, [U]pdate target repo, and [P]ush").option("-t, --target <path>", "Target repository path").option("-c, --cmdPrefix <prefix>", "Pkg install command prefix", {
  default: "pnpm add"
}).option("--timeout <limit>", "Timeout limit in seconds", { default: 300 }).example(`${cli.name} wup -t "/tmp/otherRepoPath" -c "emo add"`).example(`${cli.name} wup -t "/tmp/otherRepoPath" -c "rush add -p"`).action(
  async ({
    target,
    cmdPrefix,
    timeout
  }) => {
    if (!PKG_JSON_OBJ) {
      console.log("\u274C Unable to parse package.json!");
      process.exit(1);
    }
    const version = PKG_JSON_OBJ.version;
    const pkgName = `${PKG_JSON_OBJ.name}@${version}`;
    const SLEEP_INTERVAL = 1e4;
    const installCmd = `${cmdPrefix} "${pkgName}"`;
    console.log(`\u{1F680} Monitoring ${pkgName}...`);
    console.log(`\u{1F4C2} Target: ${target}`);
    console.log(`\u{1F6E0}  Install cmd: ${installCmd}`);
    try {
      console.log("\u{1F4E5} Pulling latest changes in target repo...");
      await execa({
        cwd: target,
        stdio: "inherit",
        env: { GIT_TRACE: "1" }
      })`git pull`;
      const startTime = Date.now();
      while (true) {
        const { exitCode } = await execa({
          reject: false,
          stdio: "inherit"
        })`npm view ${pkgName} version`;
        if (exitCode === 0) {
          console.log(`
\u2705 v${version} is live! Installing...`);
          try {
            await execa({ cwd: target, stdio: "inherit" })`${installCmd}`;
            console.log(`
\u{1F389} [SUCCESS] ${pkgName} installed!`);
            break;
          } catch {
            console.log(
              "\n\u26A0\uFE0F Registry updated but installation failed, retrying..."
            );
          }
        } else {
          process.stdout.write(".");
        }
        const elapsed = (Date.now() - startTime) / 1e3;
        if (elapsed >= timeout) {
          console.error(`
\u274C [ERROR] Timed out after ${timeout}s.`);
          process.exit(1);
        }
        await sleep(SLEEP_INTERVAL);
      }
      console.log("\u{1F4DD} Committing changes...");
      await execa({ stdio: "inherit" })`git commit -am 'chore: upd ${pkgName}`;
      console.log("\u{1F4E4} Pushing to remote...");
      await execa({ stdio: "inherit" })`git push`;
      console.log("\u{1F389} DONE!");
    } catch (error) {
      console.error("\n\u274C Task failed:", error);
      process.exit(1);
    }
  }
);
cli.command(
  "bm <targetBranch>",
  "[B]ranch [M]erge: merge current HEAD into target branch without switching"
).action(async (targetBranch) => {
});
cli.command("ips", "Show network interface IP addrs").action(() => {
  const ifs = networkInterfaces();
  const obj = Object.entries(ifs).map(([k, vs]) => ({
    [k]: vs?.map((v) => v.address)
  }));
  console.log(obj);
});
cli.command("mdns", "Show mdns hostname").action(() => {
  const n = hostname();
  console.log(n.toLowerCase().endsWith(".local") ? n : `${n}.local`);
});
cli.help();
cli.parse();
async function backgroundUpgrade() {
  const CACHE_FILE = join(tmpdir(), ".hi-tools", "last-upd-check.txt");
  const CHECK_INTERVAL = 24 * 60 * 60 * 1e3;
  const promises = [];
  const now = Date.now();
  try {
    const lastCheck = parseInt(await readFile(CACHE_FILE, "utf-8") || "0", 10);
    if (now - lastCheck < CHECK_INTERVAL) return;
  } catch (err) {
  }
  promises.push(writeFile(CACHE_FILE, now.toString()));
  const child = spawn(
    "pnpm",
    ["add", "-g", "https://github.com/jerryc05/hi-tools.git"],
    {
      detached: true,
      stdio: "ignore",
      windowsHide: true
      // 在 Windows 上隐藏控制台窗口
    }
  );
  child.unref();
  await Promise.allSettled(promises);
}
await backgroundUpgrade();
