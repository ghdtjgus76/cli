import { Command } from "commander";
import { existsSync, mkdir } from "fs";
import { getPackageManager } from "../utils/getPackageManager.js";
import { getComponentInfos } from "../utils/getComponentInfos.js";
import { installDependencies } from "../utils/installDependencies.js";
import { writeFileWithContent } from "../utils/writeFileWithContent.js";

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
  .requiredOption(
    "-p, --path <path>",
    "the path to add the component to.",
    process.cwd()
  )
  .action(async (components, opts) => {
    const { cwd, path } = opts;

    if (!existsSync(path)) {
      console.error(`The path ${path} does not exist. Please try again.`);
      process.exit(1);
    }

    const componentInfos = getComponentInfos();

    components.slice(1).forEach(async (component) => {
      const targetComponentInfo = componentInfos.find(
        (componentInfo) => componentInfo.name === component
      );

      if (targetComponentInfo) {
        const file = targetComponentInfo.files[0];
        const dir = `${path}/${file.dir}`;
        const fileContent = file.content;
        const filePath = `${path}/${file.dir}/${file.name}`;
        const dependencies = targetComponentInfo.dependencies;

        const packageManager = await getPackageManager(cwd);

        if (!existsSync(dir)) {
          mkdir(dir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`Error creating directory ${dir}:`, error);
              process.exit(1);
            }

            writeFileWithContent(filePath, fileContent);
            installDependencies(packageManager, dependencies, path);
          });
        } else {
          writeFileWithContent(filePath, fileContent);
          installDependencies(packageManager, dependencies, path);
        }
      } else {
        console.error(`Error Finding ${component} component.`);
        process.exit(1);
      }
    });
  });

program.parse();
