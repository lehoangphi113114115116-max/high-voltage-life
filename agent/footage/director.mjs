import {footagePolicy,analyzeFootageNeed,verifyLicense,matchesSubject} from './policy.mjs';
import {chooseFootageLayout} from './layout.mjs';
import {searchCommons} from './commons.mjs';
import {prepareFootageAsset} from './download.mjs';

/** Runs before Remotion; failure is recorded, not replaced with unrelated B-roll. */
export const directFootage = async ({topic,scenes,fps=30,layout,root=process.cwd()},deps={}) => {
  const search=deps.search??searchCommons, prepare=deps.prepare??prepareFootageAsset;
  const clips=[],decisions=[];const used=new Set();
  for(const scene of scenes){
    const decision={sceneId:scene.id,status:'svg-only'};
    const need=analyzeFootageNeed(topic,scene.text);
    const sceneLayout=scene.footageLayout??layout;
    const candidatesForLayout=sceneLayout?.candidates;
    const slot=chooseFootageLayout({...sceneLayout,candidates:candidatesForLayout?[...candidatesForLayout.filter(r=>r.side!==clips.at(-1)?.layout.side),...candidatesForLayout]:undefined});
    const available=(scene.endFrame-scene.startFrame)/fps;
    if(!need||!slot||available<footagePolicy.minSceneSeconds||clips.length>=footagePolicy.maxClips){decision.reason=!need?'no-precise-physical-subject':!slot?'no-safe-layout':'duration-or-clip-budget';decisions.push(decision);continue;}
    try {
      const candidates=await search(need);
      const candidate=candidates.find(c=>!used.has(c.pageId)&&verifyLicense(c.info)&&matchesSubject(c,need));
      if(!candidate){decision.reason='no-relevant-rights-verified-video';decisions.push(decision);continue;}
      const seconds=Math.min(footagePolicy.maxSeconds,available-.2);
      const asset=await prepare(candidate,{root,seconds});
      if(!asset.rightsVerified) throw new Error('Unverified rights');
      const startFrame=scene.startFrame+Math.round(.1*fps);
      clips.push({id:asset.id,sceneId:scene.id,startFrame,endFrame:startFrame+Math.floor(seconds*fps),layout:slot,src:asset.localPath,trimBefore:0,objectFit:'contain',objectPosition:'50% 50%',color:{brightness:1,contrast:1.02,saturate:.95},rights:asset,contentMatch:{subject:need.id,query:need.query,title:candidate.title,basis:'strict-title-anchor-and-description-rules',visualReview:'not-automatically-verified'}});
      used.add(candidate.pageId);decision.status='selected';decision.assetId=asset.id;
    }catch(error){decision.reason=String(error.message).slice(0,500);}
    decisions.push(decision);
  }
  return {version:1,provider:footagePolicy.provider,clips,decisions,policy:footagePolicy,requiresEditorialReview:clips.length>0};
};
