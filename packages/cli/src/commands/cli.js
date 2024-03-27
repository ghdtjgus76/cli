import { Command } from "commander";
import { existsSync, readFileSync, writeFile, mkdir } from "fs";
import { execa } from "execa";
import { getPackageManager } from "../utils/getPackageManager.js";

const program = new Command();

const loadComponentInfos = () => {
  try {
    const data = readFileSync(
      "/Users/ghdtjgus/Desktop/cli/cli/packages/registry/components.json",
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading components.json:", error);
    return [];
  }
};

export const add = program
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .requiredOption("-p, --path <path>", "the path to add the component to.")
  .action(async (components, opts) => {
    const path = opts.path;

    if (!existsSync(path)) {
      console.error(`The path ${path} does not exist. Please try again.`);
      process.exit(1);
    }

    components.forEach(async (component) => {
      const componentInfos = loadComponentInfos();

      const targetComponentInfo = componentInfos.find(
        (componentInfo) => componentInfo.name === component
      );

      if (targetComponentInfo) {
        const file = targetComponentInfo.files[0];
        const dir = `${path}/${file.dir}`;
        const filePath = `${path}/${file.dir}/${file.name}`;
        const dependencies = targetComponentInfo.dependencies;
        const cwd = opts.cwd;
        const packageManager = await getPackageManager(cwd);

        if (!existsSync(dir)) {
          mkdir(dir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`Error creating directory ${dir}:`, error);
              return;
            }

            writeFile(filePath, file.content, (error) => {
              if (error) {
                console.error(`Error writing file ${filePath}:`, error);
              } else {
                console.log(`File ${filePath} has been written.`);
              }
            });

            if (dependencies?.length) {
              console.log(packageManager, dependencies, cwd);
              await execa(
                packageManager,
                [packageManager === "npm" ? "install" : "add", ...dependencies],
                {
                  cwd,
                }
              );
            }
          });
        } else {
          writeFile(filePath, file.content, (error) => {
            if (error) {
              console.error(`Error writing file ${filePath}:`, error);
            } else {
              console.log(`File ${filePath} has been written.`);
            }
          });

          if (dependencies?.length) {
            await execa(
              packageManager,
              [packageManager === "npm" ? "install" : "add", ...dependencies],
              {
                cwd,
              }
            );
          }
        }
      }
    });
  });

program.parse();
