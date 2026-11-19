import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import manifest from './tool-manifest.json' with {type:'json'};
import {directTools, reviewRepository} from './tool-director.mjs';
import {selectAgentSkills} from './skill-router.mjs';

const sha='a'.repeat(40);
const repo={full_name:'airbnb/lottie-web',html_url:'https://github.com/airbnb/lottie-web',
  default_branch:'master',license:{spdx_id:'MIT'},pushed_at:new Date().toISOString()};
const pkg={name:'lottie-web',version:'5.12.0',dependencies:{},scripts:{prepare:'fixture-not-executed'}};
const tool=manifest.tools.lottie;
const responses = endpoint => {
  if (endpoint==='repos/airbnb/lottie-web') return repo;
  if (endpoint.endsWith('/commits/master')) return {sha};
  if (endpoint.endsWith(`/package.json?ref=${sha}`)) return {encoding:'base64',content:Buffer.from(JSON.stringify(pkg)).toString('base64')};
  if (endpoint.startsWith('advisories?')) return [];
  throw Error(endpoint);
};

test('use the selected renderer and active supplements without asking GitHub',async()=>{
  const root = await mkdtemp(join(tmpdir(),'hvl-tool-test-'));
  try {
    await writeFile(join(root,'package-lock.json'),'{"packages":{}}');
    const project={topic:'Khi nào dùng shader?',scenes:[{id:'cut',visualDirection:{shot:{renderer:'breaker-contact-3d'}}},
      {id:'math',text:'Lottie có phải là một thư viện không?',visualDirection:{shot:{renderer:'svg'}}}],
      formulas:[{sceneId:'math'}]};
    const plan=await directTools({root,project,manifest,request:async()=>assert.fail('Unexpected repository lookup')});
    assert.deepEqual(plan.scenes.map(scene=>scene.selected),[['remotion','three'],['remotion','svg','formula']]);
    const skills=selectAgentSkills({topic:project.topic,sceneTools:plan.scenes});
    assert.deepEqual(skills.sceneSkills[0].skills,['scientific-critical-thinking','anatomy']);
  } finally {await rm(root,{recursive:true,force:true});}
});

test('review a missing capability via bounded metadata and cache the pinned result',async()=>{
  const root = await mkdtemp(join(tmpdir(),'hvl-tool-test-'));
  try {
    await writeFile(join(root,'package-lock.json'),'{"packages":{}}');
    const project={scenes:[{id:'asset',toolRequirement:'Asset Lottie đã cấp phép'}]};
    const first=await directTools({root,project,manifest,request:async path=>responses(path)});
    assert.equal(first.reviews.lottie.sha,sha);
    assert.equal(first.reviews.lottie.status,'manual-review');
    assert.deepEqual(first.reviews.lottie.lifecycleScripts,['prepare']);
    assert.deepEqual(first.scenes[0].selected,['remotion','svg']);
    const second=await directTools({root,project,manifest,request:async()=>assert.fail('Review should be cached')});
    assert.deepEqual(second.reviews,first.reviews);
  } finally {await rm(root,{recursive:true,force:true});}
});

test('reject an archived repository without reading package files',async()=>{
  let requests=0;
  const result=await reviewRepository(tool,async()=>{requests++;return {...repo,archived:true};});
  assert.equal(result.status,'not-shortlisted');
  assert.equal(requests,1);
});
