import { execa } from "execa";

export const installDependencies = async (
  packageManager,
  dependencies,
  cwd,
  onSuccess
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
    }

    onSuccess();
  } catch (error) {
    console.error("Error installing dependencies:", error);
  }
};
