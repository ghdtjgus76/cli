import { Command } from "commander";
import { promises as fs } from "fs";
import { Project } from "ts-morph";
import { filterExistingPath } from "../utils/filterExistingPath.js";

const program = new Command();

// TODO 1: 해당 컴포넌트 의존성 불러오기
// TODO 2: 컴포넌트 파일 내용 불러오기
export const deployRegistry = program
  .name("deployRegistry")
  .description("deploy component registry file")
  .argument("component", "the component to deploy registry")
  .action(async (component) => {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(
      `/Users/ghdtjgus/Desktop/design-system-cli/design-system-cli/packages/ui/components/${component}.tsx`
    );

    const dependencies = [];

    sourceFile.getImportDeclarations().forEach((importDeclaration) => {
      const module = importDeclaration.getModuleSpecifier().getLiteralValue();

      if (filterExistingPath(module)) {
        dependencies.push(module);
      }
    });

    console.log(dependencies);

    const filePath = `${component}.json`;

    const fileContent = {
      name: `${component}`,
      dependencies,
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
