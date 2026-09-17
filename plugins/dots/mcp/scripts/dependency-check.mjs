import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
const results=[];for(const [name,version] of Object.entries(pkg.dependencies)){try{require.resolve(name==='@modelcontextprotocol/sdk'?`${name}/server/index.js`:name);results.push({name,requestedVersion:version,installed:true});}catch{results.push({name,requestedVersion:version,installed:false});}}
console.log(JSON.stringify({node:process.version,lockfilePresent:fs.existsSync(new URL('../package-lock.json',import.meta.url)),dependencies:results},null,2));
if(results.some(r=>!r.installed))process.exitCode=2;
