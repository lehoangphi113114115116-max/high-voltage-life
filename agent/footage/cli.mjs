import {readFile,writeFile} from 'node:fs/promises';
import {directFootage} from './director.mjs';
const [input,output]=process.argv.slice(2);
if(!input||!output) throw new Error('Usage: node agent/footage/cli.mjs project.json footage-manifest.json');
const project=JSON.parse(await readFile(input,'utf8'));
const plan=await directFootage({...project,layout:project.footageLayout});
await writeFile(output,JSON.stringify(plan,null,2)+'\n');
console.log(JSON.stringify({selected:plan.clips.length,decisions:plan.decisions}));
