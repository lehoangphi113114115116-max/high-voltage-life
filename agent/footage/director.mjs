import {footagePolicy,analyzeFootageNeed,verifyLicense,matchesSubject} from './policy.mjs';
import {chooseFootageLayout} from './layout.mjs';
import {searchCommons} from './commons.mjs';
import {prepareFootageAsset} from './download.mjs';

/** Runs before Remotion. A failed search leaves the original artwork in place. */
export const directFootage = async ({topic,scenes,fps=30,layout,root=process.cwd(),policy:overrides={}},deps={}) => {
  const search=deps.search??searchCommons, prepare=deps.prepare??prepareFootageAsset;
  const policy={...footagePolicy,...overrides};
  const clips=[],decisions=[];
  const used=new Set();
  for(const scene of scenes){
    const decision={sceneId:scene.id,status:'svg-only'};
    decisions.push(decision);
    if (scene.formula || scene.visualDirection?.shot?.renderer==='breaker-contact-3d') {
      decision.reason='technical-artwork-has-priority';
      continue;
    }
    const need=analyzeFootageNeed(topic,scene.text);
    const sceneLayout=scene.footageLayout??layout;
    const candidates=sceneLayout?.candidates;
    const slot=chooseFootageLayout({...sceneLayout,candidates:candidates?[...candidates.filter(r=>r.side!==clips.at(-1)?.layout.side),...candidates]:undefined});
    const available=(scene.endFrame-scene.startFrame)/fps;
    if(!need||!slot||available<policy.minSceneSeconds||clips.length>=policy.maxClips){
      decision.reason=!need?'no-precise-physical-subject':!slot?'no-safe-layout':'duration-or-clip-budget';
      continue;
    }
    decision.reason='no-relevant-rights-verified-media';
    for (const kind of policy.mediaKinds) {
      try {
        const results=await search(need,{kind});
        const candidate=results.find(c=>(c.kind??'video')===kind&&!used.has(c.pageId)&&verifyLicense(c.info)&&matchesSubject(c,need));
        if(!candidate) continue;
        const seconds=Math.min(policy.maxSeconds,available-.34,kind==='video'?(candidate.info.duration??Infinity):Infinity);
        const asset=await prepare({...candidate,kind},{root,seconds});
        if(!asset.rightsVerified) throw new Error('Unverified rights');
        const startFrame=scene.startFrame+Math.ceil(.17*fps);
        clips.push({id:asset.id,kind,sceneId:scene.id,startFrame,endFrame:startFrame+Math.floor(seconds*fps),layout:slot,src:asset.localPath,
          trimBefore:0,objectFit:'contain',objectPosition:'50% 50%',color:{brightness:1,contrast:1.02,saturate:.95},rights:asset,
          contentMatch:{subject:need.id,query:need.query.replace(/filetype:video$/u,kind==='image'?'filetype:bitmap':'filetype:video'),title:candidate.title,basis:'strict-title-anchor-and-description-rules',visualReview:'not-automatically-verified'}});
        used.add(candidate.pageId);
        Object.assign(decision,{status:'selected',assetId:asset.id,kind});
        delete decision.reason;
        break;
      } catch(error) {decision.reason=String(error.message).slice(0,500);}
    }
  }
  return {version:1,provider:policy.provider,clips,decisions,policy,requiresEditorialReview:clips.length>0};
};
