import { Command } from "commander";
import { existsSync } from "fs";
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
      console.log(packageJsonPath);
    } else {
      console.error(
        "node_modules or package.json not found in the current directory or its parent directories"
      );
    }
  });

program.parse();
