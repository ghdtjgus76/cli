import { promises as fs, existsSync } from "fs";
import { Project } from "ts-morph";
import { filterExistingPath } from "../utils/filterExistingPath.js";

const buildRegistry = (componentName, dependencies) => {
  const fileContent = {
    name: componentName,
    dependencies,
    files: `${componentName}.tsx`,
  };

  return fileContent;
};

const buildComponentRegistries = async (componentDir, registryPath) => {
  if (!existsSync(componentDir) || !existsSync(registryPath)) {
    console.error(`The path does not exist. Please try again.`);
    process.exit(1);
  }

  const project = new Project();
  const componentFiles = await fs.readdir(componentDir);
  const registryFileContent = [];

  componentFiles.forEach(async (componentFile) => {
    const componentFilePath = componentDir + "/" + componentFile;
    const sourceFile = project.addSourceFileAtPath(componentFilePath);
    const componentDependencies = [];

    sourceFile.getImportDeclarations().forEach((importDeclaration) => {
      const module = importDeclaration.getModuleSpecifier().getLiteralValue();

      if (filterExistingPath(module)) {
        componentDependencies.push(module);
      }
    });

    const componentName = componentFile.split(".")[0];

    const componentRegistryFilePath = `${registryPath}/${componentName}.json`;

    const componentRegistryFileContent = {
      name: `${componentName}`,
      dependencies: componentDependencies,
      files: [
        {
          name: `${componentName}.tsx`,
          content: sourceFile.getText(),
        },
      ],
    };
    const stringifiedComponentFileContent = JSON.stringify(
      componentRegistryFileContent
    );

    const registryComponentFileContent = buildRegistry(
      componentName,
      componentDependencies
    );
    registryFileContent.push(registryComponentFileContent);

    await fs.writeFile(
      componentRegistryFilePath,
      stringifiedComponentFileContent
    );
  });

  await fs.writeFile(
    `${registryPath}/index.json`,
    JSON.stringify(registryFileContent)
  );
};

buildComponentRegistries(process.argv[2], process.argv[3]).catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
