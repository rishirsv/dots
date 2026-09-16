import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync, cpSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
mkdirSync(root + '/native/rooted-fs/build', {recursive:true});
const headers = process.env.NODE_INCLUDE_DIR || resolve(dirname(process.execPath), '../include/node');
const args = ['-shared','-fPIC','-O2','-Wall','-Wextra','-Wno-unused-parameter','-I'+headers,root+'/native/rooted-fs/rooted.c','-o',root+'/native/rooted-fs/build/rooted.node'];
if (process.platform === 'darwin') args.push('-undefined','dynamic_lookup');
let p=spawnSync(process.env.CC || 'cc',args,{stdio:'inherit'}); if(p.status!==0) process.exit(p.status||1);
if(process.platform==='linux'){mkdirSync(root+'/native/parser-sandbox/build',{recursive:true});p=spawnSync(process.env.CC||'cc',['-O2',root+'/native/parser-sandbox/linux.c','-o',root+'/native/parser-sandbox/build/parser-sandbox'],{stdio:'inherit'});if(p.status!==0)process.exit(p.status||1);}
if(process.platform==='darwin'){mkdirSync(root+'/native/macos/build',{recursive:true});for(const [src,name,flags]of [['keychain.c','keychain',['-framework','Security','-framework','CoreFoundation']],['power.m','power',['-fobjc-arc','-fblocks','-framework','AppKit','-framework','Foundation']]]){p=spawnSync(process.env.CC||'clang',[root+'/native/macos/'+src,'-o',root+'/native/macos/build/'+name,...flags],{stdio:'inherit'});if(p.status!==0)process.exit(p.status||1);}}
p=spawnSync(process.env.TSC || 'tsc',['-p',root+'/tsconfig.json'],{stdio:'inherit',cwd:root});
if(p.status!==0) process.exit(p.status||1);
cpSync(root+'/migrations',root+'/dist/migrations',{recursive:true});
console.log('Portal TypeScript + descriptor-relative native helper built.');
