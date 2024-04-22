import path from "path";
import { existsSync } from "fs";
import chalk from "chalk";
import { execa } from "execa";
import ora from "ora";

export const runInitPandacss = async (
  packageJsonPath: string,
  packageManager: "yarn" | "pnpm" | "bun" | "npm",
  cwd: string
) => {
  const styledSystemPath = path.join(
    path.dirname(packageJsonPath),
    "styled-system"
  );

  if (existsSync(styledSystemPath)) {
    console.log(
      `${chalk.green(
        "Success!"
      )} Project initialization completed. You may now add components.`
    );
    process.exit(1);
  } else {
    console.log("You need to run 'panda init' to use this command");

    const initSpinner = ora(`Running panda init...`).start();
    try {
      await execa(packageManager, ["panda", "init"], { cwd });

      initSpinner.succeed(`panda init runned successfully.\n`);

      console.log(
        `${chalk.green(
          "Success!"
        )} Project initialization completed. You may now add components.`
      );
      process.exit(1);
    } catch (error) {
      console.error("Error running panda init", error);
    }
  }
};
