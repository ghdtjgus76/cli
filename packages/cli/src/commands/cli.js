import { Command } from "commander";
import { existsSync, readFileSync, writeFile, mkdir } from "fs";

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

    // 디렉토리가 존재하지 않는다면 에러 발생, 종료
    if (!existsSync(path)) {
      console.error(`The path ${path} does not exist. Please try again.`);
      process.exit(1);
    }

    components.forEach((component) => {
      const componentInfos = loadComponentInfos();

      const targetComponentInfo = componentInfos.find(
        (componentInfo) => componentInfo.name === component
      );

      if (targetComponentInfo) {
        const file = targetComponentInfo.files[0];
        const dir = `${path}/${file.dir}`;
        const filePath = `${path}/${file.dir}/${file.name}`;

        if (!existsSync(dir)) {
          mkdir(dir, { recursive: true }, (error) => {
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
          });
        } else {
          writeFile(filePath, file.content, (error) => {
            if (error) {
              console.error(`Error writing file ${filePath}:`, error);
            } else {
              console.log(`File ${filePath} has been written.`);
            }
          });
        }
      }
    });
  });

program.parse();
