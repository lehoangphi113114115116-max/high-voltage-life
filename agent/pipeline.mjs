#!/usr/bin/env node
import {copyFile, mkdir, readFile, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import toolManifest from './tool-manifest.json' with {type:'json'};
import {directTools, inspectTools} from './tool-director.mjs';
import {selectAgentSkills} from './skill-router.mjs';
import {buildStoryboard} from './storyboard.mjs';
import {directFormulas} from './formula-director.mjs';
import {directFootage} from './footage/director.mjs';
import {autonomousFootageLayout} from './footage/layout.mjs';
import {researchTopic} from './research/director.mjs';
import {uploadVideo} from './drive-upload.mjs';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1];
};
if (args.includes('--tool-inventory')) {
  console.log(JSON.stringify(await inspectTools(root,toolManifest),null,2));
  process.exit(0);
}
const topic = valueAfter('--topic')?.trim();
if (!topic) {
  console.error('Cách dùng: npm run agent -- --topic "Chủ đề về điện"');
  process.exit(1);
}

const run = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`${command} thất bại (${result.status}).\n${result.stderr ?? ''}`);
  }
  return result.stdout ?? '';
};

const slugify = (text) => text
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/gi, 'd')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 64) || 'electrical-topic';

const classify = (input) => {
  const normalized = input.toLowerCase();
  const profiles = [
    {id: 'electricity-in-life', words: ['chim', 'điện giật', 'ổ cắm', 'sét', 'đời sống'], audience: 'đại chúng tò mò về điện', depth: 'giải thích trực quan', visual: 'technical-depth-illustration'},
    {id: 'high-voltage-equipment', words: ['máy cắt', 'sf6', 'máy biến áp', 'dao cách ly', 'thiết bị'], audience: 'sinh viên và kỹ thuật viên điện', depth: 'cấu tạo và nguyên lý', visual: 'selective-2.5d-cutaway'},
    {id: 'relay-protection', words: ['87l', 'rơ le', 'bảo vệ', 'so lệch', 'quá dòng'], audience: 'kỹ sư bảo vệ và sinh viên', depth: 'logic bảo vệ chuyên sâu', visual: 'animated-2d-schematic'},
    {id: 'electrical-safety', words: ['an toàn', 'khoảng cách', 'nối đất', 'điện áp bước'], audience: 'người làm việc gần hệ thống điện', depth: 'nguy cơ và hành động an toàn', visual: 'technical-depth-illustration'},
  ];
  return profiles.find((profile) => profile.words.some((word) => normalized.includes(word))) ?? {
    id: 'other-electrical', audience: 'người học kỹ thuật điện', depth: 'tổng quan có kiểm chứng', visual: 'animated-2d-schematic',
  };
};

const probeDuration = (path) => Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', path], {capture: true}).trim());

const speechIntervals = (audioPath, duration) => {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', audioPath, '-af', 'silencedetect=noise=-40dB:d=0.12', '-f', 'null', '-'], {cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024});
  const log = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const starts = [...log.matchAll(/silence_start: ([0-9.]+)/g)].map((match) => Number(match[1]));
  const ends = [...log.matchAll(/silence_end: ([0-9.]+)/g)].map((match) => Number(match[1]));
  const silences = starts.map((start, index) => ({start, end: ends[index] ?? duration}));
  const intervals = [];
  let cursor = 0;
  for (const silence of silences) {
    if (silence.start > cursor) intervals.push({start: cursor, end: silence.start});
    cursor = Math.max(cursor, silence.end);
  }
  if (cursor < duration) intervals.push({start: cursor, end: duration});
  return intervals.length ? intervals : [{start: 0, end: duration}];
};

const buildKaraoke = (text, intervals, duration) => {
  const words = text.split(/\s+/u).filter(Boolean);
  const activeDuration = intervals.reduce((sum, item) => sum + item.end - item.start, 0);
  const weights = words.map((word) => Math.max(1, word.replace(/[^\p{L}\p{N}]/gu, '').length) + (/[.!?]$/u.test(word) ? 4 : /[,;:]$/u.test(word) ? 2 : 0));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const activeToWall = (activeSecond, startOfWord = false) => {
    let remaining = activeSecond;
    for (const interval of intervals) {
      const length = interval.end - interval.start;
      if (remaining < length || (!startOfWord && remaining === length)) return interval.start + remaining;
      remaining -= length;
    }
    return duration;
  };
  let weightCursor = 0;
  return words.map((word, index) => {
    const startActive = (weightCursor / totalWeight) * activeDuration;
    weightCursor += weights[index];
    const endActive = (weightCursor / totalWeight) * activeDuration;
    return {text: word, startMs: Math.round(activeToWall(startActive, true) * 1000), endMs: Math.round(activeToWall(endActive) * 1000)};
  });
};

const qcVideo = (videoPath, expectedFrames) => {
  const raw = run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size,bit_rate', '-show_entries', 'stream=codec_name,codec_type,width,height,r_frame_rate,channels,sample_rate', '-of', 'json', videoPath], {capture: true});
  const probe = JSON.parse(raw);
  const video = probe.streams.find((stream) => stream.codec_type === 'video');
  const audio = probe.streams.find((stream) => stream.codec_type === 'audio');
  const checks = {
    h264: video?.codec_name === 'h264',
    dimensions: video?.width === 1080 && video?.height === 1920,
    fps: video?.r_frame_rate === '30/1',
    audio: audio?.codec_type === 'audio',
    duration: Number(probe.format.duration) >= expectedFrames / 30 - 0.15,
  };
  if (Object.values(checks).some((value) => !value)) throw new Error(`QC thất bại: ${JSON.stringify(checks)}`);
  return {checks, probe};
};

const sourceRecord = valueAfter('--research-file');
if (args.includes('--research-file') && (!sourceRecord || sourceRecord.startsWith('--'))) {
  throw new Error('--research-file cần đường dẫn đến hồ sơ đã kiểm chứng.');
}
const research = await researchTopic({
  root, topic, refresh: args.includes('--refresh-research'),
  recordPath: sourceRecord ? resolve(sourceRecord) : undefined,
});
if (args.includes('--research-only')) {
  console.log(JSON.stringify(research, null, 2));
  process.exit(0);
}
const content = {
  headline: topic.toLocaleUpperCase('vi'),
  narration: research.claims.map(claim => claim.narration.trim().replace(/(?<![.!?])$/u, '.')).join(' '),
};

for (const required of ['node_modules/.bin/remotion', '.venv-tts/bin/python', 'voice/python/synthesize_vieneu.py']) {
  if (!existsSync(resolve(root, required))) throw new Error(`Thiếu thành phần đã cài: ${required}`);
}

const slug = slugify(topic);
const runDir = resolve(root, 'agent/runs', slug);
const publicDir = resolve(root, 'public/generated/current');
await mkdir(runDir, {recursive: true});
await mkdir(publicDir, {recursive: true});

const profile = classify(topic);
const visualDefaults = JSON.parse(await readFile(resolve(root, 'agent/visual-defaults.json'), 'utf8'));
await writeFile(resolve(runDir, 'research.json'), `${JSON.stringify(research, null, 2)}\n`);
const narrationPath = resolve(runDir, 'narration.txt');
const manifestPath = resolve(runDir, 'voice.manifest.json');
const audioPath = resolve(runDir, 'voice.wav');
await writeFile(narrationPath, `${content.narration}\n`, 'utf8');

run('node', ['voice/scripts/prepare-script.mjs', narrationPath, manifestPath, '--science-storytelling']);
run('.venv-tts/bin/python', ['voice/python/synthesize_vieneu.py', manifestPath, audioPath]);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const audioDuration = probeDuration(audioPath);
const fps = 30;
const durationInFrames = Math.ceil((audioDuration + 0.35) * fps);
const voiceReport = JSON.parse(await readFile(resolve(runDir, 'voice.report.json'), 'utf8'));
const intervals = speechIntervals(audioPath, audioDuration);
const beats = voiceReport.narration?.beats;
const karaoke = beats?.length ? beats.flatMap(beat => {
  const start = beat.startMs / 1000;
  const end = Math.min(audioDuration, beat.endMs / 1000);
  const speech = intervals.map(part => ({start: Math.max(start, part.start), end: Math.min(end, part.end)}))
    .filter(part => part.end > part.start);
  return buildKaraoke(beat.displayText, speech.length ? speech : [{start, end}], end);
}) : buildKaraoke(manifest.displayText, intervals, audioDuration);
await copyFile(audioPath, resolve(publicDir, 'voice.wav'));

const project = {
  topic,
  category: profile.id,
  audience: profile.audience,
  depth: profile.depth,
  visualMode: profile.visual,
  visualDefaults,
  headline: content.headline,
  narration: manifest.displayText,
  spokenNarration: manifest.spokenText,
  research,
  audioPath: 'generated/current/voice.wav',
  fps,
  width: 1080,
  height: 1920,
  durationInFrames,
  audioDurationMs: Math.round(audioDuration * 1000),
  narrationTiming: {profile:voiceReport.narration?.profile, alignment:"estimated-words-on-final-wav", beats:beats??[]},
  scenes: buildStoryboard(karaoke, fps, visualDefaults, {topic, category: profile.id, research}),
  karaoke,
};
const insetLayout = autonomousFootageLayout(project.headline, false, project.scenes.some(scene => scene.visualDirection?.shot));
project.formulas = insetLayout ? directFormulas({scenes:project.scenes,words:karaoke,research,fps,policy:visualDefaults.formulaDirector}) : [];
const formulaScenes = new Set(project.formulas.map(card=>card.sceneId));
const mediaPolicy = visualDefaults.footageDirector;
project.footage = mediaPolicy?.enabled === false
  ? {version:1,clips:[],decisions:[],requiresEditorialReview:false}
  : await directFootage({
    topic,fps,root,layout:insetLayout,
    scenes:project.scenes.map(scene=>({...scene,formula:formulaScenes.has(scene.id)})),
    policy:{mediaKinds:mediaPolicy?.mediaKinds??['video'],maxClips:mediaPolicy?.maxClips??2,maxSeconds:mediaPolicy?.maxSecondsPerClip??5},
  });
project.toolPlan = await directTools({root,project,manifest:toolManifest});
project.skillRouting = selectAgentSkills({topic,category:profile.id,visualMode:profile.visual,sceneTools:project.toolPlan.scenes});
await writeFile(resolve(runDir,'tool-plan.json'),`${JSON.stringify(project.toolPlan,null,2)}\n`);
await writeFile(resolve(runDir,'footage-manifest.json'),`${JSON.stringify(project.footage,null,2)}\n`);
await writeFile(resolve(runDir,'footage-credits.txt'),project.footage.clips.map(c=>`${c.rights.attribution}\nModifications: ${c.rights.modifications}`).join('\n\n')+'\n');
await writeFile(resolve(runDir, 'project.json'), `${JSON.stringify(project, null, 2)}\n`);
await writeFile(resolve(root, 'src/generated/current-video.json'), `${JSON.stringify(project, null, 2)}\n`);

const output = resolve(root, 'out', `hvl-agent-${slug}.mp4`);
run('node_modules/.bin/remotion', ['render', 'src/index.ts', 'HVL-AUTONOMOUS-EXPLAINER', output, '--codec=h264', '--browser-executable=/usr/bin/chromium', '--jpeg-quality=95', '--crf=18', '--concurrency=1', ...(project.scenes.some(scene => scene.visualDirection?.shot?.renderer === 'breaker-contact-3d') ? ['--gl=swangle'] : []), '--is-production=false']);
const qc = qcVideo(output, durationInFrames);
const report = {status: 'passed', topic, output, audioDuration, durationInFrames, karaokeWords: karaoke.length, footage:{selected:project.footage.clips.length,requiresEditorialReview:project.footage.requiresEditorialReview,manifest:resolve(runDir,'footage-manifest.json'),credits:resolve(runDir,'footage-credits.txt')}, ...qc};
await writeFile(resolve(runDir, 'qc.json'), `${JSON.stringify(report, null, 2)}\n`);
if (process.env.HVL_DRIVE_ENABLED === '1') {
  try { console.log(JSON.stringify({delivery: await uploadVideo(output)})); }
  catch (error) { console.error(`Bàn giao Drive chưa thành công: ${error.message}`); process.exitCode = 1; }
}
console.log(JSON.stringify({status: 'completed', topic, category: profile.id, output, durationSeconds: durationInFrames / fps, qc: qc.checks}, null, 2));
