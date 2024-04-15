import path from "path";
import { existsSync } from "fs";

export const filterExistingPath = (importPath) => {
  if (
    importPath.startsWith("@/") ||
    importPath.startsWith(".") ||
    importPath === "react" ||
    importPath === "lucide-react"
  ) {
    return false;
  }

  const absolutePath = path.resolve(importPath);
  return !existsSync(absolutePath);
};
