import path from "path";
import { existsSync } from "fs";

export const getNearestPackageJson = (cwd: string) => {
  let currentDir = cwd;

  while (true) {
    const packageJsonPath = path.join(currentDir, "package.json");

    if (existsSync(packageJsonPath)) {
      return packageJsonPath;
    }

    const parentDir = path.resolve(currentDir, "..");

    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  return null;
};
