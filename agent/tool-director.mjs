import {readFile, writeFile, mkdir, rename, mkdtemp, rm} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {join} from 'node:path';
import {promisify} from 'node:util';
import {planSceneTools} from './visual-director.mjs';

const exec = promisify(execFile);
const gh = async endpoint => JSON.parse((await exec('gh',['api',endpoint],{timeout:12000,maxBuffer:1024*1024})).stdout);
const permissiveLicenses = new Set(['MIT','Apache-2.0','BSD-2-Clause','BSD-3-Clause','ISC','0BSD','Unlicense']);
const week = 7 * 24 * 60 * 60 * 1000;

export async function inspectTools(root, manifest) {
  const lock = JSON.parse(await readFile(join(root,'package-lock.json'),'utf8'));
  return Object.fromEntries(await Promise.all(Object.entries(manifest.tools).map(async ([id,tool])=>{
    const packages = await Promise.all((tool.packages ?? (tool.package ? [tool.package] : [])).map(async name=>{
      const folder = join('node_modules',name);
      const locked = lock.packages[folder]?.version ?? null;
      const installed = await readFile(join(root,folder,'package.json'),'utf8')
        .then(data=>JSON.parse(data).version,error=>{if(error.code!=='ENOENT')throw error;return null;});
      return {name,locked,installed};
    }));
    const status = tool.repository
      ? packages.some(pkg=>pkg.installed) ? 'installed-needs-adapter-review' : 'candidate-only'
      : packages.every(pkg=>pkg.installed && pkg.installed===pkg.locked) ? 'integrated' : 'check-installed-versions';
    return [id,{status,packages}];
  })));
}

export async function reviewRepository(tool, request = gh, now = Date.now()) {
  const base = `repos/${tool.repository}`;
  const repo = await request(base);
  const license = repo.license?.spdx_id ?? null;
  const result = {repository:tool.repository,url:repo.html_url,license,pushedAt:repo.pushed_at,checkedAt:new Date(now).toISOString()};
  if (repo.full_name?.toLowerCase() !== tool.repository.toLowerCase() || repo.fork || repo.archived || repo.disabled
    || !Number.isFinite(Date.parse(repo.pushed_at)) || now-Date.parse(repo.pushed_at)>78*week || !permissiveLicenses.has(license)) {
    return {...result,status:'not-shortlisted',reason:'provenance-maintenance-or-license'};
  }
  const {sha} = await request(`${base}/commits/${encodeURIComponent(repo.default_branch)}`);
  if (!/^[a-f0-9]{40}$/u.test(sha)) throw new Error('GitHub did not provide an immutable commit');
  if (!tool.package) return {...result,sha,status:'manual-review',compatibility:tool.compatibility};
  const file = await request(`${base}/contents/${tool.packagePath ?? 'package.json'}?ref=${sha}`);
  if (file.encoding!=='base64') throw new Error('GitHub did not return package metadata');
  const pkg = JSON.parse(Buffer.from(file.content,'base64').toString('utf8'));
  if (pkg.name!==tool.package || !/^\d+\.\d+\.\d+(?:[-+.][\w.-]+)?$/u.test(pkg.version ?? '')) {
    return {...result,sha,status:'not-shortlisted',reason:'unverified-package-identity'};
  }
  const query = new URLSearchParams({ecosystem:'npm',affects:`${pkg.name}@${pkg.version}`,per_page:'10'});
  const advisories = await request(`advisories?${query}`);
  if (!Array.isArray(advisories)) throw new Error('GitHub did not return advisory results');
  return {...result,sha,package:pkg.name,version:pkg.version,compatibility:tool.compatibility,
    dependencies:pkg.dependencies??{},peerDependencies:pkg.peerDependencies??{},engines:pkg.engines??{},
    lifecycleScripts:['preinstall','install','postinstall','prepare'].filter(name=>Object.hasOwn(pkg.scripts??{},name)),
    advisories:advisories.map(advisory=>({id:advisory.ghsa_id,severity:advisory.severity,url:advisory.html_url})),
    status:advisories.length ? 'not-shortlisted' : 'manual-review'};
}

export async function directTools({root, project, manifest, request = gh}) {
  const inventory = await inspectTools(root,manifest);
  const formulas = new Set(project.formulas?.map(item=>item.sceneId));
  const insets = new Set(project.footage?.clips.map(item=>item.sceneId));
  const scenes = project.scenes.map(scene=>{
    const claimIndex = scene.visualDirection?.technicalEvidence?.claimIndex;
    return planSceneTools({scene,manifest,formula:formulas.has(scene.id),inset:insets.has(scene.id),
      visualReview:project.research?.claims[claimIndex]?.visualReview});
  });
  const reviews = {};
  let lookups = 0;
  const cache = join(root,'agent/runs/tool-reviews');
  for (const id of new Set(scenes.map(scene=>scene.repositoryNeed).filter(Boolean))) {
    const tool = manifest.tools[id];
    const file = join(cache,`${id}.json`);
    const previous = await readFile(file,'utf8').then(JSON.parse,()=>null);
    if (previous?.repository===tool.repository && Date.now()-Date.parse(previous.checkedAt)<week) {
      reviews[id]=previous;
      continue;
    }
    if (lookups>=manifest.maxRepositoryLookupsPerVideo) {
      reviews[id]={repository:tool.repository,status:'deferred'};
      continue;
    }
    lookups++;
    try {
      reviews[id] = await reviewRepository(tool,request);
      await mkdir(cache,{recursive:true});
      const staging = await mkdtemp(join(cache,'.review-'));
      try {
        const temporary = join(staging,'review.json');
        await writeFile(temporary,JSON.stringify(reviews[id],null,2)+'\n');
        await rename(temporary,file);
      } finally {await rm(staging,{recursive:true,force:true});}
    } catch {
      reviews[id]={repository:tool.repository,status:'metadata-unavailable'};
    }
  }
  return {version:manifest.version,engine:manifest.engine,inventory,scenes,reviews};
}
