import { execa } from "execa";

export const installDependencies = async (
  packageManager: "yarn" | "pnpm" | "bun" | "npm",
  dependencies: string[],
  cwd: string,
  onSuccess: () => void
) => {
  try {
    if (dependencies?.length) {
      await execa(
        packageManager,
        [packageManager === "npm" ? "install" : "add", ...dependencies],
        {
          cwd,
        }
      );

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } else {
      onSuccess();
    }
  } catch (error) {
    console.error("Error installing dependencies:", error);
  }
};
