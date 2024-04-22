#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init.ts";
import { add } from "./commands/add.ts";

async function main() {
  const program = new Command()
    .name("design-system-cli")
    .description("add components and dependencies to your apps");

  program.addCommand(init).addCommand(add);
  program.parse();
}

main();
