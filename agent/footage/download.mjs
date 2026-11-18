import {mkdir,readFile,writeFile,rename,unlink,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {footagePolicy,verifyLicense,kindForMime} from './policy.mjs';
import {downloadMedia} from './network.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
export const prepareFootageAsset = async (candidate,{root=process.cwd(),seconds=5}={}) => {
  const verifiedRights=verifyLicense(candidate.info);
  if(!verifiedRights) throw new Error('Footage license verification failed before download');
  candidate={...candidate,rights:verifiedRights};
  const url=new URL(candidate.info.url);
  if(url.protocol!=='https:'||url.hostname!=='upload.wikimedia.org') throw new Error('Unsupported footage download host');
  url.search='';
  const id=hash(url.href).slice(0,20);
  const dir=resolve(root,'public/generated/footage');
  await mkdir(dir,{recursive:true});
  const kind = candidate.kind ?? kindForMime(candidate.info.mime) ?? 'video';
  const image = kind === 'image';
  const extension = image ? 'jpg' : 'mp4';
  const output=resolve(dir,`${id}.${extension}`), sidecar=resolve(dir,`${id}.json`);
  try {
    const cached=JSON.parse(await readFile(sidecar,'utf8'));
    const bytes=await readFile(output);
    if(cached.sourceMediaUrl===url.href&&cached.sha256===hash(bytes)&&(image || cached.trimDurationSeconds>=seconds)) return {...cached,...candidate.rights};
  } catch { /* Missing or invalid cache: bounded re-download. */ }
  const raw=resolve(dir,`${id}.download`), temp=resolve(dir,`${id}.tmp.${extension}`);
  try {
    await downloadMedia(url.href,raw,footagePolicy.maxDownloadBytes);
    if((await stat(raw)).size>footagePolicy.maxDownloadBytes) throw new Error('Footage exceeds size limit');
    const sourceSha256=hash(await readFile(raw));
    const transform = image
      ? ['-an','-frames:v','1','-vf',"scale=w='min(960,iw)':h=-2,setsar=1",'-q:v','3','-update','1']
      : ['-t',String(seconds),'-an','-vf',"scale=w='min(960,iw)':h=-2,setsar=1,fps=30",'-c:v','libx264','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart'];
    const result=spawnSync('ffmpeg',['-v','error','-y','-i',raw,...transform,temp],{encoding:'utf8',timeout:60000});
    if(result.status!==0) throw new Error(`Source clip preparation failed: ${(result.stderr??'').slice(0,300)}`);
    const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-show_entries','stream=codec_name,width,height','-of','json',temp],{encoding:'utf8',timeout:10000});
    if(probe.status!==0) throw new Error('Footage ffprobe failed');
    const info=JSON.parse(probe.stdout),duration=Number(info.format.duration);
    if (!info.streams?.[0]?.width || !info.streams[0].height) throw new Error('Source has no image stream');
    if(!image && (!Number.isFinite(duration) || duration<seconds-.1)) throw new Error('Source clip is shorter than planned inset');
    await rename(temp,output);
    const asset={id,kind,title:candidate.title,sourceMediaUrl:url.href,...candidate.rights,localPath:`generated/footage/${id}.${extension}`,sha256:hash(await readFile(output)),sourceSha256,trimStartSeconds:0,trimDurationSeconds:image?null:duration,bytes:(await stat(output)).size,probe:info};
    await writeFile(sidecar,JSON.stringify(asset,null,2)+'\n');
    return asset;
  } finally {await unlink(raw).catch(()=>{});await unlink(temp).catch(()=>{});}
};
