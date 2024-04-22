import { Command } from "commander";
import { promises as fs } from "fs";
import { Project } from "ts-morph";
import { z } from "zod";
import path from "path";
import { filterExistingPath } from "../utils/filterExistingPath.ts";

const registryOptionSchema = z.object({
  component: z.string(),
  path: z.string(),
});

const program = new Command();

export const registry = program
  .name("registry")
  .description("create component registry file")
  .argument("component", "the component to create registry")
  .requiredOption("-p, --path <path>", "the path of the component")
  .action(async (component, opts) => {
    const options = registryOptionSchema.parse({
      component,
      ...opts,
    });

    const componentPath = path.resolve(options.path);

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(componentPath);

    const dependencies: string[] = [];

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
