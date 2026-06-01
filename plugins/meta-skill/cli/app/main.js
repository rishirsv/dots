#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
const project_1 = require("./project");
(0, commands_1.runCommand)(process.argv.slice(2))
    .then((code) => {
    process.exitCode = code;
})
    .catch((error) => {
    if (error instanceof project_1.CliError) {
        console.error(`error: ${error.message}`);
        process.exitCode = error.exitCode;
        return;
    }
    console.error(error instanceof Error ? `error: ${error.message}` : String(error));
    process.exitCode = 1;
});
