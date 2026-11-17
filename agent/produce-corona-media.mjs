import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {directFootage} from './footage/director.mjs';
const script=JSON.parse(await readFile('agent/corona-script.json','utf8'));
const run='agent/runs/corona-rain';await mkdir(run,{recursive:true});
const audioDir='public/generated/corona-rain';await mkdir(audioDir,{recursive:true});
const call=(cmd,args)=>{const r=spawnSync(cmd,args,{encoding:'utf8',env:{...process.env,HF_HUB_OFFLINE:'1'},maxBuffer:16*1024*1024});if(r.status!==0)throw new Error(`${cmd}: ${r.stderr}`);return r.stdout;};
const scenes=[],words=[];let offset=0;
for(const [i,item] of script.entries()){
  const id=`corona-${item.id}`;
  const textPath=`${run}/${id}.txt`,manifest=`voice/output/${id}.manifest.json`,audio=`voice/output/${id}.wav`;
  await writeFile(textPath,item.text+'\n');
  call('node',['voice/scripts/prepare-script.mjs',textPath,manifest]);
  let report;
  try {report=JSON.parse(await readFile(`voice/output/${id}.report.json`,'utf8'));if(report.displayText!==item.text||report.voice!=='Thái Sơn')report=null;}catch{}
  if(!report){console.log(`TTS ${i+1}/${script.length}: ${item.id}`);console.log(call('.venv-tts/bin/python',['voice/python/synthesize_vieneu.py',manifest,audio]));report=JSON.parse(await readFile(`voice/output/${id}.report.json`,'utf8'));}
  call('node',['agent/prepare-power-journey.mjs',id,item.title,`${run}/chunk-data`]);
  const chunk=JSON.parse(await readFile(`${run}/chunk-data/${id}.json`,'utf8'));
  // 150ms tail per narration beat; timing uses actual measured audio duration.
  const duration=report.durationSeconds+.15;
  scenes.push({...item,startFrame:Math.round(offset*30),endFrame:Math.round((offset+duration)*30)});
  words.push(...chunk.karaoke.map(w=>({...w,startMs:w.startMs+Math.round(offset*1000),endMs:w.endMs+Math.round(offset*1000)})));
  const normalized=`${run}/${id}.wav`;
  call('ffmpeg',['-v','error','-y','-i',audio,'-af','apad=pad_dur=0.15','-ar','48000','-ac','1',normalized]);
  offset+=duration;
}
const durationInFrames=Math.ceil((offset+.5)*30);
if(durationInFrames<1800||durationInFrames>2700)throw new Error(`Duration ${durationInFrames/30}s outside 60–90s; adjust script, keep voice speed unchanged.`);
await writeFile(`${run}/audio-concat.txt`,script.map(s=>`file '${resolve(run,`corona-${s.id}.wav`)}'`).join('\n')+'\n');
call('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',`${run}/audio-concat.txt`,'-c:a','pcm_s16le',`${audioDir}/voice.wav`]);
const layout={reservedAreas:[{x:0,y:0,width:1080,height:380},{x:0,y:620,width:1080,height:960},{x:0,y:1580,width:1080,height:340}],candidates:[{mode:'inset',side:'right',x:680,y:390,width:320,height:180},{mode:'picture-in-picture',side:'left',x:80,y:390,width:320,height:180}]};
const footage=await directFootage({topic:'Vì sao đường dây điện cao áp phát ra tiếng rè khi trời mưa?',scenes,fps:30,layout});
const review=JSON.parse(await readFile('agent/corona-footage-review.json','utf8'));
footage.clips=footage.clips.filter(clip=>clip.id===review.assetId&&clip.rights.sha256===review.sha256).map(clip=>{
  const target=scenes.find(s=>s.id===review.targetScene);
  const startFrame=target.startFrame+3;
  return {...clip,sceneId:target.id,startFrame,endFrame:startFrame+150,contentMatch:{...clip.contentMatch,visualReview:review.status,reviewScope:review.scope}};
});
footage.requiresEditorialReview=false;
footage.decisions=footage.decisions.map(d=>d.assetId===review.assetId?{...d,status:'reviewed-context-relocated',targetScene:review.targetScene,reason:review.scope}:d);
const project={topic:'Vì sao đường dây điện cao áp phát ra tiếng rè rè khi trời mưa?',width:1080,height:1920,fps:30,durationInFrames,audioDuration:offset,voice:'Thái Sơn',audioPath:'generated/corona-rain/voice.wav',scenes,karaoke:words,footage};
await writeFile('src/generated/corona-rain.json',JSON.stringify(project,null,2)+'\n');
await writeFile(`${run}/footage-manifest.json`,JSON.stringify(footage,null,2)+'\n');
await writeFile(`${run}/footage-credits.txt`,footage.clips.map(c=>c.rights.attribution).join('\n')+'\n');
console.log(JSON.stringify({duration:durationInFrames/30,scenes:scenes.map(s=>({id:s.id,start:s.startFrame/30,end:s.endFrame/30})),footage:footage.decisions},null,2));
