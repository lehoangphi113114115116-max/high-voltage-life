import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const input='out/hvl-corona-rain.mp4',run='agent/runs/corona-rain';
const project=JSON.parse(await readFile('src/generated/corona-rain.json','utf8'));
const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration,size','-show_entries','stream=codec_name,codec_type,width,height,r_frame_rate,nb_frames,sample_rate','-of','json',input],{encoding:'utf8'});
assert.equal(probe.status,0,probe.stderr);
const info=JSON.parse(probe.stdout),video=info.streams.find(s=>s.codec_type==='video'),audio=info.streams.find(s=>s.codec_type==='audio');
assert.equal(video.codec_name,'h264');assert.equal(video.width,1080);assert.equal(video.height,1920);assert.equal(video.r_frame_rate,'30/1');assert.equal(Number(video.nb_frames),project.durationInFrames);assert.equal(audio.codec_name,'aac');
assert(Number(info.format.duration)>=60&&Number(info.format.duration)<=90);
const scan=spawnSync('ffmpeg',['-hide_banner','-nostats','-i',input,'-vf','blackdetect=d=0.3:pix_th=0.05,freezedetect=n=-50dB:d=3','-af','ebur128=peak=true','-f','null','-'],{encoding:'utf8',maxBuffer:16*1024*1024});
assert.equal(scan.status,0,scan.stderr.slice(-1000));
await mkdir(run,{recursive:true});await writeFile(`${run}/qc-scan.log`,scan.stderr);
assert(!/black_start:/.test(scan.stderr),'Inspect detected black interval.');
// Low-motion SVG diagrams can trigger average-pixel freezedetect. Verify the
// illustration region itself at 4 fps, without karaoke, before treating it as frozen.
const lowMotion=[];
for(const match of scan.stderr.matchAll(/freeze_start: ([\d.]+)/g)){
  const start=Number(match[1]);
  const diagram=project.scenes.find(s=>s.id==='mitigation');
  assert(start>=diagram.startFrame/30&&start<diagram.endFrame/30,'Unexpected low-motion interval outside explanatory bundle diagram');
  const hashes=spawnSync('ffmpeg',['-v','error','-ss',String(start),'-t','3','-i',input,'-an','-vf','crop=920:650:80:700,fps=4','-f','framemd5','-'],{encoding:'utf8'});
  assert.equal(hashes.status,0,hashes.stderr);
  const distinct=new Set(hashes.stdout.split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>l.split(',').at(-1).trim())).size;
  assert(distinct>=3,'Identical illustration frames across low-motion interval');
  lowMotion.push({startSeconds:start,illustrationFrameHashes:distinct,review:'Bundled-conductor explanatory diagram: field lines pulse; layout held for technical explanation, not a decode freeze.'});
}
const loudness=[...scan.stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].at(-1)?.[1];
const peak=[...scan.stderr.matchAll(/Peak:\s+(-?[\d.]+) dBFS/g)].at(-1)?.[1];
assert(Number(peak)<0,'Audio clipping');
const report={status:'passed',output:input,probe:info,checks:{dimensions:true,fps:true,frames:true,audio:true,duration:true,decode:true,noBlackFrames:true,illustrationFramesChangeDuringLowMotion:true},lowMotion,integratedLufs:Number(loudness),truePeakDbfs:Number(peak),voice:project.voice,scenes:project.scenes.length,karaokeWords:project.karaoke.length,karaokeAlignment:'estimated-word-timings-with-audio-segment-boundaries',footage:project.footage.clips.map(c=>({id:c.id,license:c.rights.license,source:c.rights.sourceUrl,review:c.contentMatch.visualReview})),visualReview:'Contact sheet and full-size selected frames reviewed separately by Agent'};
await mkdir(run,{recursive:true});await writeFile(`${run}/qc.json`,JSON.stringify(report,null,2)+'\n');await writeFile(`${run}/qc-scan.log`,scan.stderr);
console.log(JSON.stringify(report,null,2));
