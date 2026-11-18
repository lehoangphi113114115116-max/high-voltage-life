import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';

const run = 'agent/runs/wind-100';
const output = 'public/generated/wind-100';
const boundaries = [0, 10, 23, 38, 53, 65, 78, 90, 100];
const call = (command, args) => execFileSync(command, args, {encoding: 'utf8', maxBuffer: 16 * 1024 * 1024});
await mkdir(run, {recursive: true});
await mkdir(output, {recursive: true});
const sections = (await readFile('agent/wind-100/script.txt', 'utf8')).trim().split(/\n\s*\n/u);
if (sections.length !== boundaries.length - 1) throw new Error('Script and scene boundaries disagree');
const groups = [];
for (const [index, section] of sections.entries()) {
  const rows = section.split('\n').flatMap(row => row.split(/(?<=[.!?])\s+/u));
  const beats = [];
  for (const row of rows) {
    await writeFile(`${run}/line.txt`, row);
    call('node', ['voice/scripts/prepare-script.mjs', `${run}/line.txt`, `${run}/line.json`, '--science-storytelling']);
    const data = JSON.parse(await readFile(`${run}/line.json`, 'utf8'));
    beats.push(...data.narration.beats);
  }
  groups.push({index, beats});
}
const beats = groups.flatMap(group => group.beats);
const raw = `${run}/raw.wav`;
const python = process.env.HVL_TTS_PYTHON ?? '.venv-tts/bin/python';
await writeFile(`${run}/manifest.json`, JSON.stringify({
  spokenText: beats.map(beat => beat.spokenText).join(' '), displayText: sections.join('\n\n'),
  narration: {profile: 'science-storytelling-v1', beats},
}));
call(python, ['voice/python/synthesize_vieneu.py', `${run}/manifest.json`, raw]);
const report = JSON.parse(await readFile(`${run}/raw.report.json`, 'utf8'));
if (report.voice !== 'Adam' || report.narration?.beats.length !== beats.length) throw new Error('Incorrect narration voice or beat count');

const karaoke = [];
const shots = [];
const filters = [];
let consumed = 0;
for (const {index, beats: group} of groups) {
  const measured = report.narration.beats.slice(consumed, consumed + group.length);
  consumed += group.length;
  const first = measured[0].startMs / 1000;
  const last = measured.at(-1).endMs / 1000;
  const start = boundaries[index] + (index === 0 ? .55 : .24);
  const available = boundaries[index + 1] - start - (index === 7 ? .65 : .37);
  const speed = Math.max(.86, (last - first) / available);
  filters.push(`[src${index}]atrim=start=${first}:end=${last},asetpts=PTS-STARTPTS,atempo=${speed.toFixed(8)},adelay=${Math.round(start * 1000)}:all=1[a${index}]`);
  const cues = [];
  for (const beat of measured) {
    const from = start + (beat.startMs / 1000 - first) / speed;
    const to = start + (beat.endMs / 1000 - first) / speed;
    cues.push(from);
    const words = beat.displayText.split(/\s+/u);
    const weights = words.map(word => Math.max(2, word.replace(/[^\p{L}\p{N}]/gu, '').length) + (/[.!?]$/u.test(word) ? 3 : /,$/u.test(word) ? 2 : 0));
    const total = weights.reduce((sum, value) => sum + value, 0);
    let wordTime = from;
    for (const [i, text] of words.entries()) {
      const end = wordTime + (to - from) * weights[i] / total;
      karaoke.push({text, startMs: Math.round(wordTime * 1000), endMs: Math.round(end * 1000)});
      wordTime = end;
    }
  }
  shots.push({start: boundaries[index], end: boundaries[index + 1], cues});
  console.log(`Cảnh ${index + 1}: Adam ${(last - first).toFixed(2)} s, atempo ${speed.toFixed(3)}×`);
}
const split = '[0:a]asplit=8' + shots.map((_, index) => `[src${index}]`).join('');
const mix = shots.map((_, index) => `[a${index}]`).join('') + 'amix=inputs=8:normalize=0,apad=whole_dur=100';
call('ffmpeg', ['-y', '-v', 'error', '-i', raw, '-filter_complex', [split, ...filters, mix].join(';'), '-ar', '48000', '-ac', '1', `${output}/adam.wav`]);
await writeFile(`${output}/timeline.json`, JSON.stringify({audio: 'generated/wind-100/adam.wav', shots, karaoke}, null, 2) + '\n');
