#!/usr/bin/env node
import { runCommand } from "./commands";
import { CliError } from "./project";

runCommand(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    if (error instanceof CliError) {
      console.error(`error: ${error.message}`);
      process.exitCode = error.exitCode;
      return;
    }
    console.error(error instanceof Error ? `error: ${error.message}` : String(error));
    process.exitCode = 1;
  });
