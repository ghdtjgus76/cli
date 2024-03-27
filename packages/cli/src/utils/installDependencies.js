export const installDependencies = async (
  packageManager,
  dependencies,
  cwd
) => {
  if (dependencies?.length) {
    await execa(
      packageManager,
      [packageManager === "npm" ? "install" : "add", ...dependencies],
      {
        cwd,
      }
    );
  }
};
