import { Command } from "commander";
import { existsSync } from "fs";
import path from "path";
import { z } from "zod";
import ora from "ora";
import { execa } from "execa";
import chalk from "chalk";
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
          }
        );
      } else {
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
      }
    }
  });

program.parse();
