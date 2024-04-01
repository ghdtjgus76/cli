import { Command } from "commander";
import { existsSync } from "fs";
import path from "path";
import { z } from "zod";
import ora from "ora";
import { getNearestPackageJson } from "../utils/getNearestPackageJson.js";
import { getPackageManager } from "../utils/getPackageManager.js";
import { installDependencies } from "../utils/installDependencies.js";

const initOptionSchema = z.object({
  cwd: z.string(),
});

const program = new Command();

export const init = program
  .name("init")
  .description("initialize your project and install dependencies")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (opts) => {
    const options = initOptionSchema.parse(opts);
    const cwd = path.resolve(options.cwd);

    if (!existsSync(cwd)) {
      console.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const packageJsonPath = getNearestPackageJson(cwd);

    if (packageJsonPath) {
      const packageManager = await getPackageManager(cwd);
      const pandaCssPath = path.join(
        path.dirname(packageJsonPath),
        "node_modules",
        "@pandacss",
        "dev",
        "package.json"
      );

      if (!existsSync(pandaCssPath)) {
        console.log("You need to install '@pandacss/dev' to use this command");

        const installSpinner = ora(`Installing... @pandacss/dev\n`).start();
        installDependencies(
          packageManager,
          ["@pandacss/dev"],
          cwd,
          async () => {
            installSpinner.succeed(`@pandacss/dev installed successfully.\n`);

            runInitPandacss(packageJsonPath, packageManager, cwd);
          }
        );
      } else {
        runInitPandacss(packageJsonPath, packageManager, cwd);
      }
    }
  });

program.parse();
