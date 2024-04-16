import path from "path";
import { promises as fs } from "fs";
import { Project } from "ts-morph";
import { filterExistingPath } from "../utils/filterExistingPath.js";

const buildRegistry = async (component, componentPath, registryPath) => {
  const absoluteComponentPath = path.resolve(componentPath);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(absoluteComponentPath);

  const dependencies = [];

  sourceFile.getImportDeclarations().forEach((importDeclaration) => {
    const module = importDeclaration.getModuleSpecifier().getLiteralValue();

    if (filterExistingPath(module)) {
      dependencies.push(module);
    }
  });

  const filePath = `${registryPath}/${component}.json`;

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
};

buildRegistry(process.argv[2], process.argv[3], process.argv[4]).catch(
  (error) => {
    console.error("An error occurred:", error);
    process.exit(1);
  }
);
