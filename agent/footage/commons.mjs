import {footagePolicy,verifyLicense,matchesSubject} from './policy.mjs';
import {requestJson} from './network.mjs';
const api='https://commons.wikimedia.org/w/api.php';
export const searchCommons = async (need,{request=requestJson}={}) => {
  const query=new URLSearchParams({action:'query',format:'json',generator:'search',gsrnamespace:'6',gsrlimit:'10',gsrsearch:need.query,prop:'imageinfo',iiprop:'url|extmetadata|mime|size'});
  const json=await request(`${api}?${query}`);
  if(json.error) throw new Error(`Commons API ${json.error.code}`);
  return Object.values(json.query?.pages??{}).sort((a,b)=>a.index-b.index).flatMap(page=>{
    const info=page.imageinfo?.[0];
    if(!info||!['video/webm','video/ogg','video/mp4'].includes(info.mime)||!Number.isFinite(info.size+info.width+info.duration)||info.size>footagePolicy.maxDownloadBytes||info.width<footagePolicy.minWidth||info.duration<2) return [];
    const candidate={title:page.title,pageId:page.pageid,info};
    const rights=verifyLicense(info);
    return rights&&matchesSubject(candidate,need)?[{...candidate,rights}]:[];
  });
};
