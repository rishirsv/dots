#!/usr/bin/env node
import { runCli } from "./src/cli.ts";

runCli(process.argv.slice(2)).catch((error) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(String(error));
  }
  process.exit(1);
});
