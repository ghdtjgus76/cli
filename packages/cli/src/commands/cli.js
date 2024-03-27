import { Command } from "commander";
import { existsSync } from "fs";

const program = new Command();

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

    console.log(path);
  });

program.parse();
