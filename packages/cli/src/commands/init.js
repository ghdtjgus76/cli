import { Command } from "commander";
import { existsSync, accessSync } from "fs";
import path from "path";
import { z } from "zod";
import { getNearestPackageJson } from "../utils/getNearestPackageJson.js";

const projectDependencies = ["@pandacss/dev"];

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
  .action((opts) => {
    const options = initOptionSchema.parse(opts);

    const cwd = path.resolve(options.cwd);

    if (!existsSync(cwd)) {
      console.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const packageJsonPath = getNearestPackageJson(cwd);

    if (packageJsonPath) {
      const pandaCssPath = path.join(
        path.dirname(packageJsonPath),
        "node_modules",
        "@pandacss",
        "dev",
        "package.json"
      );

      if (existsSync(pandaCssPath)) {
        console.log("@pandacss/dev is installed at:", pandaCssPath);
      } else {
        console.error(
          "You need to install '@pandacss/dev' to use this command"
        );
      }
    } else {
      console.error(
        "node_modules or package.json not found in the current directory or its parent directories"
      );
    }
  });

program.parse();
