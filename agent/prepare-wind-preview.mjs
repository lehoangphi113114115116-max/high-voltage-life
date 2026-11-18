import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

const beats = [
  {id:'farm', at:.24, end:4, text:'Trên cánh đồng, những tua-bin đón gió để sản xuất điện.'},
  {id:'blades', at:4.16, end:8, text:'Luồng gió tạo lực nâng, làm ba cánh quạt quay cùng trục.'},
  {id:'generator', at:8.12, end:12, text:'Trục quay kéo máy phát trực tiếp, biến cơ năng thành điện năng.'},
  {id:'grid', at:12.12, end:18, text:'Điện qua bộ biến đổi, rồi máy biến áp. Lưới điện đưa công suất đến nơi sử dụng.'},
];
const run = 'agent/runs/wind-preview';
const assets = 'public/generated/wind-preview';
const call = (bin, args) => execFileSync(bin,args,{encoding:'utf8',env:{...process.env,HF_HUB_OFFLINE:'1'},maxBuffer:16*1024*1024});
await mkdir(run,{recursive:true});
await mkdir(assets,{recursive:true});
const words = [];
const mixInputs = [];
const mixFilters = [];
for (const [index,beat] of beats.entries()) {
  const id = `wind-preview-${beat.id}`;
  const textPath = `${run}/${id}.txt`;
  const manifest = `voice/output/${id}.manifest.json`;
  const audio = `voice/output/${id}.wav`;
  await writeFile(textPath,beat.text+'\n');
  call('node',['voice/scripts/prepare-script.mjs',textPath,manifest]);
  let report;
  try {report=JSON.parse(await readFile(`voice/output/${id}.report.json`,'utf8'));} catch {}
  if(report?.displayText!==beat.text || report?.voice!=='Thái Sơn'){
    call('.venv-tts/bin/python',['voice/python/synthesize_vieneu.py',manifest,audio]);
    report=JSON.parse(await readFile(`voice/output/${id}.report.json`,'utf8'));
  }
  if (report.voice!=='Thái Sơn' || !(report.durationSeconds>0) || beat.at+report.durationSeconds>beat.end-.08) {
    throw new Error(`${beat.id}: ${report.voice}, ${report.durationSeconds}s exceeds ${beat.end-beat.at-.08}s or mismatched voice`);
  }
  call('node',['agent/prepare-power-journey.mjs',id,beat.id,run]);
  const data=JSON.parse(await readFile(`${run}/${id}.json`,'utf8'));
  const offset=Math.round(beat.at*1000);
  words.push(...data.karaoke.map(word=>({...word,startMs:word.startMs+offset,endMs:word.endMs+offset})));
  mixInputs.push('-i',resolve(audio));
  mixFilters.push(`[${index}:a]aresample=48000,adelay=${offset}:all=1[a${index}]`);
  console.log(`${beat.id}: ${beat.at}s + ${report.durationSeconds}s · ${report.voice}`);
}
const inputs = beats.map((_,i)=>`[a${i}]`).join('');
call('ffmpeg',['-v','error','-y',...mixInputs,'-filter_complex',`${mixFilters.join(';')};${inputs}amix=inputs=4:normalize=0,apad=whole_dur=18`,'-ar','48000','-ac','1',`${assets}/voice.wav`]);
await writeFile('src/generated/wind-preview.json',JSON.stringify({audioPath:'generated/wind-preview/voice.wav',voice:'Thái Sơn',alignment:'estimated-words-on-measured-narration-beats',karaoke:words},null,2)+'\n');
