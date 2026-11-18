import {footagePolicy,verifyLicense,matchesSubject,kindForMime} from './policy.mjs';
import {requestJson} from './network.mjs';
const api='https://commons.wikimedia.org/w/api.php';
export const searchCommons = async (need,{request=requestJson,kind='video'}={}) => {
  const query=new URLSearchParams({action:'query',format:'json',generator:'search',gsrnamespace:'6',gsrlimit:'10',gsrsearch:need.query.replace(/filetype:video$/u, kind === 'image' ? 'filetype:bitmap' : 'filetype:video'),prop:'imageinfo',iiprop:'url|extmetadata|mime|size'});
  const json=await request(`${api}?${query}`);
  if(json.error) throw new Error(`Commons API ${json.error.code}`);
  return Object.values(json.query?.pages??{}).sort((a,b)=>a.index-b.index).flatMap(page=>{
    const info=page.imageinfo?.[0];
    if(!info || kindForMime(info.mime)!==kind || !Number.isFinite(info.size+info.width+info.height)
      || info.size>footagePolicy.maxDownloadBytes || info.width<footagePolicy.minWidth || info.height<240
      || (kind==='video' && (!Number.isFinite(info.duration) || info.duration<2))) return [];
    const candidate={title:page.title,pageId:page.pageid,kind,info};
    const rights=verifyLicense(info);
    return rights&&matchesSubject(candidate,need)?[{...candidate,rights}]:[];
  });
};
