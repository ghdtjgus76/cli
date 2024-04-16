import { promises as fs, existsSync } from "fs";
import { Project } from "ts-morph";
import { filterExistingPath } from "../utils/filterExistingPath.js";

const buildRegistry = async (componentDir, registryPath) => {
  if (!existsSync(componentDir) || !existsSync(registryPath)) {
    console.error(`The path does not exist. Please try again.`);
    process.exit(1);
  }

  const project = new Project();
  const componentFiles = await fs.readdir(componentDir);
  componentFiles.forEach(async (componentFile) => {
    const componentFilePath = componentDir + "/" + componentFile;
    const sourceFile = project.addSourceFileAtPath(componentFilePath);

    const dependencies = [];

    sourceFile.getImportDeclarations().forEach((importDeclaration) => {
      const module = importDeclaration.getModuleSpecifier().getLiteralValue();

      if (filterExistingPath(module)) {
        dependencies.push(module);
      }
    });

    const componentName = componentFile.split(".")[0];

    const filePath = `${registryPath}/${componentName}.json`;

    const fileContent = {
      name: `${componentName}`,
      dependencies,
      files: [
        {
          name: `${componentName}.tsx`,
          content: sourceFile.getText(),
        },
      ],
    };
    const stringifiedFileContent = JSON.stringify(fileContent);

    await fs.writeFile(filePath, stringifiedFileContent);
  });
};

buildRegistry(process.argv[2], process.argv[3], process.argv[4]).catch(
  (error) => {
    console.error("An error occurred:", error);
    process.exit(1);
  }
);
