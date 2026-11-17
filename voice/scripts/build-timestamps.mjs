import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";

const [, , inputArg, outputArg] = process.argv;
if (!inputArg || !outputArg) {
  console.error("Cách dùng: npm run voice:timestamps -- <alignment.json> <karaoke.json>");
  process.exit(1);
}

const raw = JSON.parse(await readFile(resolve(process.cwd(), inputArg), "utf8"));

const fromWordAlignment = (data) =>
  data.words.map((word) => ({
    text: String(word.text ?? word.word),
    startMs: Math.round(word.startMs ?? Number(word.start) * 1000),
    endMs: Math.round(word.endMs ?? Number(word.end) * 1000),
    ...(word.confidence == null ? {} : {confidence: Number(word.confidence)}),
  }));

const fromCharacterAlignment = (data) => {
  const words = [];
  let current = null;
  data.characters.forEach((character, index) => {
    const startMs = Math.round(data.character_start_times_seconds[index] * 1000);
    const endMs = Math.round(data.character_end_times_seconds[index] * 1000);
    if (/\s/u.test(character)) {
      if (current) words.push(current);
      current = null;
      return;
    }
    if (!current) current = {text: character, startMs, endMs};
    else {
      current.text += character;
      current.endMs = endMs;
    }
  });
  if (current) words.push(current);
  return words;
};

const words = Array.isArray(raw.words)
  ? fromWordAlignment(raw)
  : Array.isArray(raw.characters) &&
      Array.isArray(raw.character_start_times_seconds) &&
      Array.isArray(raw.character_end_times_seconds)
    ? fromCharacterAlignment(raw)
    : null;

if (!words || words.some((word) => !Number.isFinite(word.startMs + word.endMs))) {
  throw new Error("Alignment không đúng định dạng word hoặc character được hỗ trợ.");
}
if (words.some((word) => word.endMs < word.startMs)) {
  throw new Error("Alignment có endMs nhỏ hơn startMs.");
}

const result = {
  version: 1,
  durationMs: words.at(-1)?.endMs ?? 0,
  words,
};
const outputPath = resolve(process.cwd(), outputArg);
await mkdir(dirname(outputPath), {recursive: true});
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Đã tạo timestamp karaoke: ${outputPath}`);
