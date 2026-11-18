#!/usr/bin/env node
// Upload only: never invokes a renderer or a TTS engine.
import {readFile, writeFile, stat, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {basename, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export async function uploadVideo(file) {
  const required = ['HVL_DRIVE_CLIENT_ID','HVL_DRIVE_CLIENT_SECRET','HVL_DRIVE_REFRESH_TOKEN','HVL_DRIVE_FOLDER_ID'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) throw new Error(`Drive chưa được kết nối OAuth: thiếu ${missing.join(', ')}. MP4 được giữ nguyên; thử lại bằng node agent/drive-upload.mjs <file.mp4>.`);
  const folder = process.env.HVL_DRIVE_FOLDER_ID;
  const path = resolve(file);
  if (!path.toLowerCase().endsWith('.mp4')) throw new Error('Chỉ bàn giao MP4.');
  const size = (await stat(path)).size;
  if (!size) throw new Error('MP4 rỗng.');
  const bytes = await readFile(path);
  const md5 = createHash('md5').update(bytes).digest('hex');
  const auth = await fetch('https://oauth2.googleapis.com/token', {
    method:'POST', body:new URLSearchParams({client_id:process.env.HVL_DRIVE_CLIENT_ID,client_secret:process.env.HVL_DRIVE_CLIENT_SECRET,refresh_token:process.env.HVL_DRIVE_REFRESH_TOKEN,grant_type:'refresh_token'}), signal:AbortSignal.timeout(30000),
  });
  if (!auth.ok) throw new Error(`OAuth refresh thất bại HTTP ${auth.status}; không ghi token ra log.`);
  const {access_token} = await auth.json();
  if (!access_token) throw new Error('OAuth không trả access token.');
  const headers = {Authorization:`Bearer ${access_token}`};
  const api = async (url, options={}) => {
    const response = await fetch(url,{...options,headers:{...headers,...options.headers},signal:AbortSignal.timeout(180000)});
    if (!response.ok) throw new Error(`Drive API HTTP ${response.status}; MP4 vẫn ở ${path}.`);
    return response;
  };
  const base = 'https://www.googleapis.com/drive/v3';
  const parent = await (await api(`${base}/files/${encodeURIComponent(folder)}?fields=id,mimeType,trashed`)).json();
  if(parent.trashed || parent.mimeType!=='application/vnd.google-apps.folder') throw new Error('Thư mục Drive không hợp lệ hoặc chưa được chọn/cấp quyền qua Picker.');
  const assertPrivate = async id => {
    const permissions = await (await api(`${base}/files/${encodeURIComponent(id)}/permissions?fields=permissions(type)`)).json();
    if (permissions.permissions?.some(p=>p.type==='anyone'||p.type==='domain')) throw new Error('Thư mục/file có quyền public hoặc domain kế thừa; hãy đặt thư mục riêng tư trước khi upload.');
  };
  await assertPrivate(folder);
  // Reuse an earlier successful upload, including when the previous response was lost.
  const escape = s=>s.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  const q = `'${escape(folder)}' in parents and trashed = false and appProperties has { key='hvlMd5' and value='${md5}' }`;
  const matches = await (await api(`${base}/files?q=${encodeURIComponent(q)}&fields=files(id,size,md5Checksum,webViewLink,parents)`)).json();
  let uploaded = matches.files?.find(f=>f.md5Checksum===md5 && Number(f.size)===size);
  if (!uploaded) {
    const session = await api('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,size,md5Checksum,webViewLink,parents', {
      method:'POST', headers:{'Content-Type':'application/json','X-Upload-Content-Type':'video/mp4','X-Upload-Content-Length':String(size)},
      body:JSON.stringify({name:basename(path),parents:[folder],appProperties:{hvlMd5:md5}}),
    });
    const location = session.headers.get('location');
    if (!location || new URL(location).origin!=='https://www.googleapis.com') throw new Error('Resumable upload endpoint không hợp lệ.');
    uploaded = await (await api(location,{method:'PUT',headers:{'Content-Type':'video/mp4'},body:bytes})).json();
  }
  if(uploaded.md5Checksum!==md5 || Number(uploaded.size)!==size || !uploaded.parents?.includes(folder)) throw new Error('Xác minh checksum/kích thước/thư mục thất bại.');
  await assertPrivate(uploaded.id);
  const receipt = {status:'verified',file:path,id:uploaded.id,url:uploaded.webViewLink,bytes:size,md5,folder,verifiedAt:new Date().toISOString()};
  await mkdir(resolve('agent/runs/drive-delivery'),{recursive:true});
  await writeFile(resolve('agent/runs/drive-delivery',`${md5}.json`),JSON.stringify(receipt,null,2));
  return receipt;
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  try { if(!process.argv[2]) throw new Error('Usage: node agent/drive-upload.mjs <existing.mp4>'); console.log(JSON.stringify(await uploadVideo(process.argv[2]),null,2)); }
  catch(error){console.error(error.message);process.exitCode=1;}
}
