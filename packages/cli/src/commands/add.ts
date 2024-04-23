import { Command } from "commander";
import { promises as fs, existsSync } from "fs";
import { z } from "zod";
import path from "path";
import ora from "ora";
import prompts from "prompts";
import { getPackageManager } from "../utils/getPackageManager.ts";
import { getComponentInfo } from "../utils/getComponentInfo.ts";
import { installDependencies } from "../utils/installDependencies.ts";
import { writeFileWithContent } from "../utils/writeFileWithContent.ts";
import { getRegistryInfo } from "../utils/getRegistryInfo.ts";
import { isInitialized } from "../utils/isInitialized.ts";

type RegistryInfoType = { name: string; dependencies: string[]; files: string };

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
      console.error(`The path does not exist. Please try again.`);
      process.exit(1);
    }

    isInitialized(options.path);

    const registryInfo = await getRegistryInfo();

    let selectedComponents = options.all
      ? registryInfo.map((info: RegistryInfoType) => info.name)
      : options.components;

    if (!options.components?.length && !options.all) {
      const { components } = await prompts({
        type: "multiselect",
        name: "components",
        message: "Which components would you like to add?",
        hint: "Space to select. A to toggle all. Enter to submit.",
        choices: registryInfo.map((info: RegistryInfoType) => ({
          title: info.name,
          value: info.name,
          selected: options.components?.includes(info.name),
        })),
      });

      selectedComponents = components;
    }

    if (!selectedComponents) {
      console.error(`No components selected.`);
      process.exit(1);
    }

    for (const component of selectedComponents) {
      const componentInfo = await getComponentInfo(component);

      if (!componentInfo) {
        console.error(`Error Finding ${component} component.`);
        process.exit(1);
      }

      const spinner = ora(`Installing... ${component}`).start();

      const file = componentInfo.files[0];
      const dir = path.join(options.path, "components", "designed-ui");
      const { content: fileContent, name: fileName } = file;
      const filePath = path.join(dir, fileName);
      const dependencies = componentInfo.dependencies;

      const packageManager = await getPackageManager(cwd);

      if (!existsSync(dir)) {
        try {
          await fs.mkdir(dir, { recursive: true });
          writeFileWithContent(filePath, fileContent);
          await installDependencies(
            packageManager,
            dependencies,
            options.path,
            () => {
              spinner.succeed(`${component} installed successfully!`);
            }
          );
        } catch (error) {
          console.error(`Error creating directory ${dir}:`, error);
          process.exit(1);
        }
      } else {
        writeFileWithContent(filePath, fileContent);
        await installDependencies(
          packageManager,
          dependencies,
          options.path,
          () => {
            spinner.succeed(`${component} installed successfully!`);
          }
        );
      }
    }
  });
