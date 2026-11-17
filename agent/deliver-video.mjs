#!/usr/bin/env node
/**
 * Chuẩn hóa file MP4 đã render để bàn giao; không render lại.
 * Usage: node agent/deliver-video.mjs input.mp4 output.mp4
 */
import {execFileSync} from 'node:child_process';
import {existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';

const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg || !outputArg) {
  console.error('Usage: node agent/deliver-video.mjs <input.mp4> <output.mp4>');
  process.exit(2);
}
const input = resolve(inputArg);
const output = resolve(outputArg);
if (!existsSync(input)) throw new Error(`Không tìm thấy MP4: ${input}`);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', input, '-c', 'copy', '-movflags', '+faststart', output], {stdio: 'inherit'});
const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height,avg_frame_rate', '-of', 'json', output], {encoding: 'utf8'});
const metadata = JSON.parse(probe);
console.log(JSON.stringify({input, output, bytes: statSync(output).size, metadata}, null, 2));
