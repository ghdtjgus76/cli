import { Command } from "commander";
import { promises as fs } from "fs";
import { Project } from "ts-morph";
import { filterExistingPath } from "../utils/filterExistingPath.js";
import { z } from "zod";
import path from "path";

const deployRegistryOptionSchema = z.object({
  component: z.string(),
  path: z.string(),
});

const program = new Command();

export const deployRegistry = program
  .name("deployRegistry")
  .description("deploy component registry file")
  .argument("component", "the component to deploy registry")
  .requiredOption("-p, --path <path>", "the path of the component")
  .action(async (component, opts) => {
    const options = deployRegistryOptionSchema.parse({
      component,
      ...opts,
    });

    const componentPath = path.resolve(options.path);

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(componentPath);

    const dependencies = [];

    sourceFile.getImportDeclarations().forEach((importDeclaration) => {
      const module = importDeclaration.getModuleSpecifier().getLiteralValue();

      if (filterExistingPath(module)) {
        dependencies.push(module);
      }
    });

    const filePath = `${component}.json`;

    const fileContent = {
      name: `${component}`,
      dependencies,
      files: [
        {
          name: `${component}.tsx`,
          content: sourceFile.getText(),
        },
      ],
    };
    const stringifiedFileContent = JSON.stringify(fileContent);

    await fs.writeFile(filePath, stringifiedFileContent);
  });

program.parse();
