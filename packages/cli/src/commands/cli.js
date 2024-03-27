import { Command } from "commander";
import readline from "readline";
import { existsSync } from "fs";

const program = new Command();

const getDirectory = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("the path to add the component to ", (answer) => {
    // 디렉토리 존재 여부 체크
    if (existsSync(answer)) {
      console.log(`디렉토리: ${answer}`);
    } else {
      console.error(`The path ${answer} does not exist. Please try again.`);
      process.exit(1);
    }

    rl.close();
  });
};

export const add = program
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .action(() => {
    getDirectory();
  });

program.parse();
