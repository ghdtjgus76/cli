import { Command } from "commander";
import { promises as fs } from "fs";

const program = new Command();

export const deployRegistry = program
  .name("deployRegistry")
  .description("deploy component registry file")
  .argument("component", "the component to deploy registry")
  .action(async (component) => {
    const filePath = `${component}.json`;

    const fileContent = {
      name: `${component}`,
      dependencies: ["dependency1"],
      files: [
        {
          name: `${component}.tsx`,
          content: "content",
        },
      ],
    };
    const stringifiedFileContent = JSON.stringify(fileContent);

    await fs.writeFile(filePath, stringifiedFileContent);
  });

program.parse();
