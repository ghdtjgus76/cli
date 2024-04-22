import path from "path";
import { existsSync } from "fs";
import chalk from "chalk";
import { getNearestPackageJson } from "./getNearestPackageJson.js";

export const isInitialized = (cwd: string) => {
  const packageJsonPath = getNearestPackageJson(cwd);

  if (packageJsonPath) {
    const pandaCssPath = path.join(
      path.dirname(packageJsonPath),
      "node_modules",
      "@pandacss",
      "dev",
      "package.json"
    );

    const styledSystemPath = path.join(
      path.dirname(packageJsonPath),
      "styled-system"
    );

    if (!existsSync(pandaCssPath) || !existsSync(styledSystemPath)) {
      console.error(
        `Configuration is missing. Please run ${chalk.green(`init`)} first.`
      );
      process.exit(1);
    }
  } else {
    console.error(
      "node_modules or package.json not found in the current directory or its parent directories"
    );
    process.exit(1);
  }
};
