#!/usr/bin/env node
import {copyFile, mkdir, readFile, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {selectAgentSkills} from './skill-router.mjs';
import {buildStoryboard} from './storyboard.mjs';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1];
};
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

const directContent = (input, profile) => {
  if (input.toLowerCase().includes('chim') && input.toLowerCase().includes('dây điện')) {
    return {
      headline: 'VÌ SAO CHIM ĐẬU TRÊN DÂY ĐIỆN KHÔNG BỊ GIẬT?',
      narration: 'Chim đậu trên một sợi dây điện thường không bị giật, vì hai chân của nó gần như cùng một điện thế. Dòng điện chỉ chạy mạnh qua cơ thể khi có chênh lệch điện áp giữa hai điểm tiếp xúc. Trên đoạn dây rất ngắn giữa hai chân chim, điện trở của dây nhỏ nên độ sụt áp gần như bằng không. Vì vậy, dòng điện đi qua cơ thể chim cực thấp. Nguy hiểm xuất hiện nếu chim đồng thời chạm vào dây khác điện thế, hoặc chạm dây điện và cột nối đất. Khi đó cơ thể tạo thành một đường dẫn, dòng điện có thể chạy qua và gây điện giật.',
      research: [
        'Dòng qua cơ thể phụ thuộc chênh lệch điện thế giữa hai điểm tiếp xúc: I = ΔV / R.',
        'Hai chân gần nhau trên cùng dây dẫn có ΔV rất nhỏ vì điện trở đoạn dây rất thấp.',
        'Chạm đồng thời hai điện thế khác nhau hoặc dây pha và đất tạo đường dẫn nguy hiểm.',
      ],
      scenes: [
        {id: 'hook', from: 0, to: 0.2, visual: 'Chim và đường dây có chiều sâu, câu hỏi mở đầu', camera: 'slow push-in'},
        {id: 'same-potential', from: 0.2, to: 0.52, visual: 'Hai chân trên cùng dây, V1 gần bằng V2', camera: 'technical close-up'},
        {id: 'voltage-difference', from: 0.52, to: 0.76, visual: 'Sơ đồ ΔV = V1 - V2 gần bằng 0', camera: 'diagram lock'},
        {id: 'danger', from: 0.76, to: 1, visual: 'Chạm hai điện thế khác nhau, đường dòng điện cảnh báo', camera: 'pull-back warning'},
      ],
    };
  }
  return {
    headline: input.toUpperCase(),
    narration: `${input} là một chủ đề cần được nhìn qua ba lớp: hiện tượng quan sát được, nguyên lý điện chi phối, và điều kiện vận hành an toàn. Trước hết, hãy xác định dòng điện đi theo đường nào và điện áp xuất hiện giữa những điểm nào. Tiếp theo, sơ đồ kỹ thuật giúp tách phần tử chính khỏi chi tiết không cần thiết. Cuối cùng, mọi kết luận phải được đối chiếu với thông số thiết bị và quy trình an toàn tại hiện trường. Cách phân tích này giúp biến một hiện tượng phức tạp thành chuỗi nguyên nhân và kết quả có thể kiểm chứng.`,
    research: ['Xác định đường dòng điện.', 'Xác định chênh lệch điện thế.', 'Đối chiếu thông số và điều kiện an toàn.'],
    scenes: [
      {id: 'hook', from: 0, to: 0.25, visual: profile.visual, camera: 'slow push-in'},
      {id: 'principle', from: 0.25, to: 0.62, visual: 'animated technical schematic', camera: 'diagram close-up'},
      {id: 'application', from: 0.62, to: 1, visual: 'technical summary and safety boundary', camera: 'wide summary'},
    ],
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

const buildKaraoke = (text, audioPath, duration) => {
  const words = text.split(/\s+/u).filter(Boolean);
  const intervals = speechIntervals(audioPath, duration);
  const activeDuration = intervals.reduce((sum, item) => sum + item.end - item.start, 0);
  const weights = words.map((word) => Math.max(1, word.replace(/[^\p{L}\p{N}]/gu, '').length) + (/[.!?]$/u.test(word) ? 4 : /[,;:]$/u.test(word) ? 2 : 0));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const activeToWall = (activeSecond) => {
    let remaining = activeSecond;
    for (const interval of intervals) {
      const length = interval.end - interval.start;
      if (remaining <= length) return interval.start + remaining;
      remaining -= length;
    }
    return duration;
  };
  let weightCursor = 0;
  return words.map((word, index) => {
    const startActive = (weightCursor / totalWeight) * activeDuration;
    weightCursor += weights[index];
    const endActive = (weightCursor / totalWeight) * activeDuration;
    return {text: word, startMs: Math.round(activeToWall(startActive) * 1000), endMs: Math.round(activeToWall(endActive) * 1000)};
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

for (const required of ['node_modules/.bin/remotion', '.venv-tts/bin/python', 'voice/python/synthesize_vieneu.py']) {
  if (!existsSync(resolve(root, required))) throw new Error(`Thiếu thành phần đã cài: ${required}`);
}

const slug = slugify(topic);
const runDir = resolve(root, 'agent/runs', slug);
const publicDir = resolve(root, 'public/generated/current');
await mkdir(runDir, {recursive: true});
await mkdir(publicDir, {recursive: true});

const profile = classify(topic);
const content = directContent(topic, profile);
const skillRouting = selectAgentSkills({topic, category: profile.id, visualMode: profile.visual});
const narrationPath = resolve(runDir, 'narration.txt');
const manifestPath = resolve(runDir, 'voice.manifest.json');
const audioPath = resolve(runDir, 'voice.wav');
await writeFile(narrationPath, `${content.narration}\n`, 'utf8');

run('node', ['voice/scripts/prepare-script.mjs', narrationPath, manifestPath]);
run('.venv-tts/bin/python', ['voice/python/synthesize_vieneu.py', manifestPath, audioPath]);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const audioDuration = probeDuration(audioPath);
const fps = 30;
const durationInFrames = Math.ceil((audioDuration + 0.35) * fps);
const karaoke = buildKaraoke(manifest.displayText, audioPath, audioDuration);
await copyFile(audioPath, resolve(publicDir, 'voice.wav'));

const project = {
  topic,
  category: profile.id,
  audience: profile.audience,
  depth: profile.depth,
  visualMode: profile.visual,
  skillRouting,
  headline: content.headline,
  narration: manifest.displayText,
  spokenNarration: manifest.spokenText,
  research: content.research,
  audioPath: 'generated/current/voice.wav',
  fps,
  width: 1080,
  height: 1920,
  durationInFrames,
  audioDurationMs: Math.round(audioDuration * 1000),
  scenes: buildStoryboard(karaoke, fps),
  karaoke,
};
await writeFile(resolve(runDir, 'project.json'), `${JSON.stringify(project, null, 2)}\n`);
await writeFile(resolve(root, 'src/generated/current-video.json'), `${JSON.stringify(project, null, 2)}\n`);

const output = resolve(root, 'out', `hvl-agent-${slug}.mp4`);
run('node_modules/.bin/remotion', ['render', 'src/index.ts', 'HVL-AUTONOMOUS-EXPLAINER', output, '--codec=h264', '--browser-executable=/usr/bin/chromium', '--jpeg-quality=95', '--crf=18', '--concurrency=1', '--is-production=false']);
const qc = qcVideo(output, durationInFrames);
const report = {status: 'passed', topic, output, audioDuration, durationInFrames, karaokeWords: karaoke.length, ...qc};
await writeFile(resolve(runDir, 'qc.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({status: 'completed', topic, category: profile.id, output, durationSeconds: durationInFrames / fps, qc: qc.checks}, null, 2));
