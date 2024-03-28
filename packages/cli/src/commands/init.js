import { Command } from "commander";

const projectDependencies = ["@pandacss/dev"];

const initOptionSchema = z.object({
  cwd: z.string(),
});

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action((opts) => {
    const options = initOptionSchema.parse(opts);

    if (!existsSync(cwd)) {
      console.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }
  });
