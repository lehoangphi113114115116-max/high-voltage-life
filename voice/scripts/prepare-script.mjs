import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";

const [, , inputArg, outputArg] = process.argv;
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
const spokenText = [...dictionary]
  .sort((a, b) => b.display.length - a.display.length)
  .reduce((text, entry) => {
    const source = entry.match === "regex" ? entry.display : escapeRegExp(entry.display);
    return text.replace(new RegExp(source, entry.flags ?? "giu"), entry.spoken);
  }, displayText);

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
      provider: "disabled",
      synthesisAllowed: false,
    },
    null,
    2,
  )}\n`,
);
console.log(`Đã tạo manifest cục bộ: ${outputPath}`);
