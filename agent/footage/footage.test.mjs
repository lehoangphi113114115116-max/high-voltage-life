import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyLicense,analyzeFootageNeed,matchesSubject} from './policy.mjs';
import {chooseFootageLayout,overlaps,autonomousFootageLayout} from './layout.mjs';
import {directFootage} from './director.mjs';

const info={url:'https://upload.wikimedia.org/wikipedia/commons/test.webm',descriptionurl:'https://commons.wikimedia.org/wiki/File:Wind_turbine.webm',extmetadata:{LicenseShortName:{value:'CC BY 4.0'},LicenseUrl:{value:'https://creativecommons.org/licenses/by/4.0/'},Artist:{value:'Example creator'},ImageDescription:{value:'Real wind turbine rotating.'}}};
const candidate={pageId:1,title:'File:Wind turbine rotating.webm',info,rights:verifyLicense(info)};
const scene={id:'wind',text:'Tua bin gió quay để phát điện.',startFrame:30,endFrame:150};
const layout={reservedAreas:[{x:0,y:600,width:1080,height:1320}],candidates:[{mode:'inset',side:'right',x:700,y:300,width:300,height:169}]};
test('license rejects NC/ND/SA, missing creators and license-name/URL mismatches',()=>{
  assert(verifyLicense(info));
  for(const variant of ['by-sa','by-nc','by-nd']) assert.equal(verifyLicense({...info,extmetadata:{...info.extmetadata,LicenseUrl:{value:`https://creativecommons.org/licenses/${variant}/4.0/`}}}),null);
  assert.equal(verifyLicense({...info,extmetadata:{...info.extmetadata,Artist:{value:''}}}),null);
});
test('no footage for abstract explanation or incidental equipment mentions',()=>{
  assert.equal(analyzeFootageNeed('SF6','Luồng khí SF6 khử ion.'),null);
  const need=analyzeFootageNeed('Máy biến áp','Máy biến áp nâng điện áp.');
  assert.equal(matchesSubject({title:"File:Jacob's Ladder.webm",info:{extmetadata:{ImageDescription:{value:'Built with an electrical transformer.'}}}},need),false);
  assert.equal(analyzeFootageNeed('Máy cắt SF6','Chênh lệch điện áp giữa hai điểm.'),null);
});
test('unknown/fully occupied layout never fetches or downloads clips',async()=>{
  let calls=0;
  const plan=await directFootage({topic:'Điện gió',scenes:[scene],layout:{...layout,reservedAreas:[{x:0,y:0,width:1080,height:1920}]}},{search:async()=>{calls++;return [candidate];}});
  assert.equal(calls,0);assert.equal(plan.clips.length,0);
  assert.equal(chooseFootageLayout({}),null);
  const known=autonomousFootageLayout('Điện gió');
  const slot=chooseFootageLayout(known);
  assert(slot);assert(!known.reservedAreas.some(p=>overlaps(slot,p)));
});
test('selected inset stays in narrated scene and preserves source/license record',async()=>{
  const plan=await directFootage({topic:'Điện gió',scenes:[scene],layout,fps:30},{search:async()=>[candidate],prepare:async()=>({...candidate.rights,id:'fixture',localPath:'generated/footage/fixture.mp4'})});
  assert.equal(plan.clips.length,1);
  const clip=plan.clips[0];assert(clip.startFrame>=scene.startFrame);assert(clip.endFrame<=scene.endFrame);
  assert.equal(clip.rights.creator,'Example creator');assert.equal(clip.rights.rightsVerified,true);
  assert(!layout.reservedAreas.some(p=>overlaps(clip.layout,p)));
});
test('HTTP failure and unapproved license gracefully preserve SVG',async()=>{
  const plan=await directFootage({topic:'Điện gió',scenes:[scene],layout},{search:async()=>{throw new Error('HTTP 503');}});
  assert.equal(plan.clips.length,0);assert.match(plan.decisions[0].reason,/503/);
  let downloads=0;
  const blocked={...candidate,info:{...info,extmetadata:{}}};
  const denied=await directFootage({topic:'Điện gió',scenes:[scene],layout},{search:async()=>[blocked],prepare:async()=>{downloads++;}});
  assert.equal(denied.clips.length,0);assert.equal(downloads,0);
});
