import { Command } from "commander";

const program = new Command();

export const deployRegistry = program
  .name("deployRegistry")
  .description("deploy component registry file")
  .argument("component", "the component to deploy registry")
  .action();
