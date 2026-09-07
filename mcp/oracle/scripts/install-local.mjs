#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const home=process.env.ORACLE_REPO_MCP_HOME??path.join(os.homedir(),'Library','Application Support','Oracle Repo MCP');
await fs.access(path.join(root,'dist','cli.js'));
await fs.access(path.join(root,'native','keychain-helper'),fs.constants.X_OK);
await fs.mkdir(home,{recursive:true,mode:0o700});
await fs.writeFile(path.join(home,'installation.json'),JSON.stringify({node:process.execPath,packageRoot:root},null,2)+'\n',{mode:0o600});
const bin=path.join(home,'bin');
await fs.mkdir(bin,{recursive:true,mode:0o700});
const command=path.join(bin,'oracle-repo');
const quote=value=>"'"+value.replaceAll("'", "'\\''")+"'";
await fs.writeFile(command,`#!/bin/sh\nexec ${quote(process.execPath)} ${quote(path.join(root,'dist','cli.js'))} "$@"\n`,{mode:0o700});
await fs.chmod(command,0o700);
console.log(JSON.stringify({installed:true,packageRoot:root,skill:'dots:oracle',command,path_directory:bin}));
