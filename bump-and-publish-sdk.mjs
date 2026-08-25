#!/usr/bin/env node

/**
 * Interactive & Automated SDK Release Workflow:
 * Bumps version (patch, minor, major, custom, or keep current) and publishes to npm registry.
 *
 * Usage:
 *   npm run sdk:release
 *   npm run sdk:release -- patch
 *   npm run sdk:release -- minor
 *   npm run sdk:release -- -y
 *   node scripts/bump-and-publish-sdk.mjs [patch|minor|major|x.y.z] [--dry-run] [-y|--yes]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..", "..");
const sdkDir = path.join(rootDir, "packages", "botcast-sdk");

function parseArgs() {
  const args = process.argv.slice(2);
  let bumpType = null;
  let dryRun = false;
  let autoConfirm = false;

  for (const arg of args) {
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "-y" || arg === "--yes") {
      autoConfirm = true;
    } else if (
      ["patch", "minor", "major", "keep"].includes(arg) ||
      /^\d+\.\d+\.\d+/.test(arg)
    ) {
      bumpType = arg;
    }
  }

  return { bumpType, dryRun, autoConfirm };
}

function calculateVersions(currentVersion) {
  const parts = currentVersion.split(".").map(Number);
  let [major = 1, minor = 0, patch = 0] = parts;

  return {
    current: currentVersion,
    patch: `${major}.${minor}.${patch + 1}`,
    minor: `${major}.${minor + 1}.0`,
    major: `${major + 1}.0.0`,
  };
}

async function promptUserForVersion(currentVersion, initialBumpType) {
  const versions = calculateVersions(currentVersion);

  if (initialBumpType) {
    if (initialBumpType === "patch") return versions.patch;
    if (initialBumpType === "minor") return versions.minor;
    if (initialBumpType === "major") return versions.major;
    if (initialBumpType === "keep") return currentVersion;
    if (/^\d+\.\d+\.\d+/.test(initialBumpType)) return initialBumpType;
  }

  const rl = readline.createInterface({ input, output });

  try {
    console.log(
      `\x1b[36mCurrent SDK Version:\x1b[0m \x1b[33mv${currentVersion}\x1b[0m\n`,
    );
    console.log("How would you like to update the version?");
    console.log(
      `  \x1b[32m1)\x1b[0m Patch  (v${currentVersion} ➜ \x1b[32mv${versions.patch}\x1b[0m) [Recommended/Default]`,
    );
    console.log(
      `  \x1b[32m2)\x1b[0m Minor  (v${currentVersion} ➜ \x1b[32mv${versions.minor}\x1b[0m)`,
    );
    console.log(
      `  \x1b[32m3)\x1b[0m Major  (v${currentVersion} ➜ \x1b[32mv${versions.major}\x1b[0m)`,
    );
    console.log(
      `  \x1b[32m4)\x1b[0m Keep current version (\x1b[33mv${currentVersion}\x1b[0m)`,
    );
    console.log(`  \x1b[32m5)\x1b[0m Custom version (enter manually)\n`);

    const answer = (
      await rl.question("Select option [1-5] (default: 1): ")
    ).trim();

    let chosenVersion = versions.patch;

    if (answer === "2" || answer.toLowerCase() === "minor") {
      chosenVersion = versions.minor;
    } else if (answer === "3" || answer.toLowerCase() === "major") {
      chosenVersion = versions.major;
    } else if (answer === "4" || answer.toLowerCase() === "keep") {
      chosenVersion = currentVersion;
    } else if (answer === "5" || answer.toLowerCase() === "custom") {
      const custom = (
        await rl.question("Enter custom version (e.g. 1.2.0): ")
      ).trim();
      if (!/^\d+\.\d+\.\d+/.test(custom)) {
        console.log(
          "\x1b[31mInvalid version format, falling back to patch.\x1b[0m",
        );
        chosenVersion = versions.patch;
      } else {
        chosenVersion = custom;
      }
    } else {
      chosenVersion = versions.patch;
    }

    return chosenVersion;
  } finally {
    rl.close();
  }
}

async function promptForConfirmation(targetVersion, autoConfirm) {
  if (autoConfirm) {
    return true;
  }

  const rl = readline.createInterface({ input, output });

  try {
    const confirmAnswer = (
      await rl.question(
        `\nReady to build, test & publish \x1b[32mbotcast-sdk@${targetVersion}\x1b[0m to npm? (Y/n): `,
      )
    )
      .trim()
      .toLowerCase();
    const confirmed =
      confirmAnswer === "" || confirmAnswer === "y" || confirmAnswer === "yes";

    return confirmed;
  } finally {
    rl.close();
  }
}

async function main() {
  console.log(
    "\x1b[36m===================================================\x1b[0m",
  );
  console.log("\x1b[36m🚀 Botcast SDK Release & NPM Publisher\x1b[0m");
  console.log(
    "\x1b[36m===================================================\x1b[0m\n",
  );

  const {
    bumpType: initialBumpType,
    dryRun,
    autoConfirm,
  } = parseArgs();

  // 1. Read SDK package.json
  const sdkPkgPath = path.join(sdkDir, "package.json");
  if (!fs.existsSync(sdkPkgPath)) {
    throw new Error(`SDK package.json not found at ${sdkPkgPath}`);
  }

  const sdkPkg = JSON.parse(fs.readFileSync(sdkPkgPath, "utf8"));
  const currentVersion = sdkPkg.version;

  // 2. Ask user for desired version
  let targetVersion;
  if (autoConfirm && initialBumpType) {
    const versions = calculateVersions(currentVersion);
    if (initialBumpType === "patch") targetVersion = versions.patch;
    else if (initialBumpType === "minor") targetVersion = versions.minor;
    else if (initialBumpType === "major") targetVersion = versions.major;
    else if (initialBumpType === "keep") targetVersion = currentVersion;
    else targetVersion = initialBumpType;
  } else {
    targetVersion = await promptUserForVersion(currentVersion, initialBumpType);
  }

  console.log(
    `\n📌 Target Release: \x1b[32mv${targetVersion}\x1b[0m (Current: v${currentVersion})`,
  );

  // 3. Prompt for final confirmation
  const confirmed = await promptForConfirmation(targetVersion, autoConfirm);

  if (!confirmed) {
    console.log("\x1b[33m\nRelease cancelled by user.\x1b[0m");
    process.exit(0);
  }

  console.log("\n---------------------------------------------------");

  if (dryRun) {
    console.log(
      "\x1b[33m⚠️ Running in DRY RUN mode (no files modified, no publish)\x1b[0m",
    );
  } else {
    // 4. Update SDK package.json
    if (sdkPkg.version !== targetVersion) {
      sdkPkg.version = targetVersion;
      fs.writeFileSync(
        sdkPkgPath,
        JSON.stringify(sdkPkg, null, 2) + "\n",
        "utf8",
      );
      console.log(
        `✅ Updated packages/botcast-sdk/package.json to v${targetVersion}`,
      );
    }

    // 5. Update version badge in docs page if present
    const docsPagePath = path.join(rootDir, "src", "pages", "ApiDocsPage.tsx");
    if (fs.existsSync(docsPagePath)) {
      let docsContent = fs.readFileSync(docsPagePath, "utf8");
      const versionRegex =
        /<Badge color="red" variant="filled" size="sm">\s*v\d+\.\d+\.\d+\s*<\/Badge>/g;
      if (versionRegex.test(docsContent)) {
        docsContent = docsContent.replace(
          versionRegex,
          `<Badge color="red" variant="filled" size="sm">v${targetVersion}</Badge>`,
        );
        fs.writeFileSync(docsPagePath, docsContent, "utf8");
        console.log(
          `✅ Updated docs badge in ApiDocsPage.tsx to v${targetVersion}`,
        );
      }
    }
  }

  // 6. Build SDK bundle
  console.log("\n🛠️ Compiling SDK distribution bundles (ESM, CJS, Types)...");
  execSync("npm run build", { cwd: sdkDir, stdio: "inherit" });

  // 7. Run Test Suite
  console.log("\n🧪 Running test suite...");
  execSync("npm test", { cwd: sdkDir, stdio: "inherit" });

  // 8. Publish to npm
  if (!dryRun) {
    console.log("\n🚀 Publishing to npm registry (public access)...");
    const publishCmd = "npm publish --access public";

    try {
      execSync(publishCmd, { cwd: sdkDir, stdio: "inherit" });
      console.log(
        "\n\x1b[32m===================================================\x1b[0m",
      );
      console.log(
        `\x1b[32m🎉 Successfully published ${sdkPkg.name}@${targetVersion} to npm!\x1b[0m`,
      );
      console.log(
        `\x1b[32m🔗 View on npm: https://www.npmjs.com/package/${sdkPkg.name}\x1b[0m`,
      );
      console.log(
        "\x1b[32m===================================================\x1b[0m\n",
      );
    } catch (err) {
      console.error("\n\x1b[31m❌ Publish failed.\x1b[0m");
      process.exit(1);
    }
  } else {
    console.log(
      "\n\x1b[32m🎉 Dry-run build and verification passed successfully!\x1b[0m",
    );
  }
}

main().catch((err) => {
  console.error("\n\x1b[31m❌ Error:\x1b[0m", err.message);
  process.exit(1);
});
