import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);

// curl inherits the Cloud proxy/CA environment; Node fetch may bypass it.
export const requestJson = async url => {
  const parsed=new URL(url);
  if(parsed.protocol!=='https:'||parsed.hostname!=='commons.wikimedia.org') throw new Error('Unsupported metadata host');
  try {
    const {stdout}=await exec('curl',['--fail','--silent','--show-error','--proto','=https','--max-time','20','--max-filesize','2097152','--user-agent','HighVoltageLife-FootageDirector/1.0',url],{timeout:23000,maxBuffer:3*1024*1024});
    return JSON.parse(stdout);
  }catch(error){throw new Error(`commons.wikimedia.org request failed: ${String(error.stderr??error.message).slice(0,300)}`);}
};
export const downloadMedia = async (url,path,maxBytes) => {
  const parsed=new URL(url);
  if(parsed.protocol!=='https:'||parsed.hostname!=='upload.wikimedia.org') throw new Error('Unsupported media host');
  try {
    await exec('curl',['--fail','--silent','--show-error','--proto','=https','--max-time','30','--max-filesize',String(maxBytes),'--output',path,url],{timeout:33000,maxBuffer:1024*1024});
  }catch(error){throw new Error(`upload.wikimedia.org download failed: ${String(error.stderr??error.message).slice(0,300)}`);}
};
