import { Command } from "commander";
import readline from 'readline';

const program = new Command();

const getDirectory = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("type your folder path to add your component ", (answer) => {
    console.log(answer);
  })
}

export const add = program
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .action(() => {
    getDirectory();
  });

program.parse();