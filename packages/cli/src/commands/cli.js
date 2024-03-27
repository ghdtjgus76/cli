import { Command } from "commander";

const program = new Command();

export const add = program
  .name("add")
  .description("add a component to your project")
  .argument("[components...]", "the components to add")
  .action(() => {
    console.log(1);
  });

program.parse();
