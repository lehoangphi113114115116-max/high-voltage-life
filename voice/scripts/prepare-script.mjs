import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";

const [, , inputArg, outputArg, mode] = process.argv;
if (!inputArg || !outputArg) {
  console.error("Cách dùng: npm run voice:prepare -- <script.txt> <manifest.json>");
  process.exit(1);
}

const root = process.cwd();
const dictionary = JSON.parse(
  await readFile(resolve(root, "voice/config/pronunciation.vi.json"), "utf8"),
);
const displayText = (await readFile(resolve(root, inputArg), "utf8")).trim();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pronunciation = [...dictionary]
  .sort((a, b) => b.display.length - a.display.length)
const pronounce = (value) => pronunciation.reduce((text, entry) => {
    const source = entry.match === "regex" ? entry.display : escapeRegExp(entry.display);
    return text.replace(new RegExp(source, entry.flags ?? "giu"), entry.spoken);
  }, value);
const spokenText = pronounce(displayText);

let narration;
if (mode === '--science-storytelling') {
  const direction = JSON.parse(await readFile(resolve(root, 'voice/config/narration-direction.json'), 'utf8'));
  const sentences = displayText.split(/(?<=[.!?…])\s+|\n+/u).map(text => text.trim()).filter(Boolean);
  let beats = sentences.map((text, index) => {
    const role = /\?$/u.test(text) ? 'hook'
      : /^(?:nguy hiểm|bất ngờ|ngay lúc đó|đột ngột|sự cố)/iu.test(text) ? 'climax'
      : /^(?:vì vậy|điểm mấu chốt|điều thú vị|hóa ra|chính vì thế)/iu.test(text) || (index === 1 && /\?$/u.test(sentences[0])) ? 'discovery'
      : 'explanation';
    return {role, displayText: text, spokenText: pronounce(text), ...direction.roles[role]};
  });
  // Keep adjacent explanation sentences in one inference to preserve phrasing.
  beats = beats.reduce((merged, beat) => {
    const previous = merged.at(-1);
    if (beat.role === 'explanation' && previous?.role === beat.role && previous.spokenText.length + beat.spokenText.length < 220) {
      previous.displayText += ' ' + beat.displayText;
      previous.spokenText += ' ' + beat.spokenText;
    } else merged.push(beat);
    return merged;
  }, []);
  narration = {profile: direction.profile, beats};
}

const outputPath = resolve(root, outputArg);
await mkdir(dirname(outputPath), {recursive: true});
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      version: 1,
      profileId: "high-voltage-life-vi",
      language: "vi-VN",
      displayText,
      spokenText,
      ...(narration ? {narration} : {}),
      provider: "disabled",
      synthesisAllowed: false,
    },
    null,
    2,
  )}\n`,
);
console.log(`Đã tạo manifest cục bộ: ${outputPath}`);
