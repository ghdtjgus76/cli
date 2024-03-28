import { Command } from "commander";
import { existsSync, mkdir } from "fs";
import { z } from "zod";
import path from "path";
import ora from "ora";
import prompts from "prompts";
import { getPackageManager } from "../utils/getPackageManager.js";
import { getComponentInfo } from "../utils/getComponentInfo.js";
import { installDependencies } from "../utils/installDependencies.js";
import { writeFileWithContent } from "../utils/writeFileWithContent.js";
import { getRegistryInfo } from "../utils/getRegistryInfo.js";

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  cwd: z.string(),
  all: z.boolean(),
  path: z.string(),
});

const program = new Command();

export const add = program
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-a, --all", "add all available components", false)
  .option(
    "-p, --path <path>",
    "the path to add the component to.",
    process.cwd()
  )
  .action(async (components, opts) => {
    const options = addOptionsSchema.parse({
      components,
      ...opts,
    });

    const cwd = path.resolve(options.cwd);

    if (!existsSync(options.path) || !existsSync(cwd)) {
      console.error(`The path ${path} does not exist. Please try again.`);
      process.exit(1);
    }

    const registryInfo = await getRegistryInfo();

    let selectedComponents = options.all
      ? registryInfo.map((info) => info.name)
      : options.components;

    if (!options.components?.length && !options.all) {
      const { components } = await prompts({
        type: "multiselect",
        name: "components",
        message: "Which components would you like to add?",
        hint: "Space to select. A to toggle all. Enter to submit.",
        choices: registryInfo.map((info) => ({
          title: info.name,
          value: info.name,
          selected: options.components?.includes(info.name),
        })),
      });

      selectedComponents = components;
    }

    selectedComponents?.forEach(async (component) => {
      const componentInfo = await getComponentInfo(component);

      if (!componentInfo) {
        console.error(`Error Finding ${component} component.`);
        process.exit(1);
      }

      const spinner = ora(`Installing... ${component}`).start();

      const file = componentInfo.files[0];
      const dir = path.join(options.path, "components", "ui");
      const { content: fileContent, name: fileName } = file;
      const filePath = path.join(dir, fileName);
      const dependencies = componentInfo.dependencies;

      const packageManager = await getPackageManager(cwd);

      if (!existsSync(dir)) {
        mkdir(dir, { recursive: true }, async (error) => {
          if (error) {
            console.error(`Error creating directory ${dir}:`, error);
            process.exit(1);
          }

          writeFileWithContent(filePath, fileContent);
          installDependencies(
            packageManager,
            dependencies,
            options.path,
            () => {
              spinner.succeed(`${component} installed successfully.`);
            }
          );
        });
      } else {
        writeFileWithContent(filePath, fileContent);
        installDependencies(packageManager, dependencies, options.path, () => {
          spinner.succeed(`${component} installed successfully.`);
        });
      }
    });
  });

program.parse();
