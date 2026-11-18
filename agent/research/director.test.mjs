import assert from 'node:assert/strict';
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {buildStoryboard} from '../storyboard.mjs';
import {researchTopic, validateResearch} from './director.mjs';

test('reuse a validated research record and fall back to principle artwork if a claim does not support the device', async () => {
  const fixture = JSON.parse(await readFile(new URL('./verified/39133755555a477a999ee6d39af664f29cc275f5fff3dd88d31e9d6d5f69153d.json', import.meta.url), 'utf8'));
  validateResearch(fixture);
  assert.throws(() => validateResearch({...fixture, claims: fixture.claims.map(claim => ({
    ...claim, citations: [claim.citations[0], claim.citations[0]],
  }))}), /nguồn độc lập/u);
  const root = await mkdtemp(join(tmpdir(), 'hvl-research-test-'));
  try {
    const researchPath = join(root, 'agent/research');
    const skillDir = join(root, '.agents/skills/scientific-critical-thinking');
    await mkdir(researchPath, {recursive: true});
    await mkdir(skillDir, {recursive: true});
    await writeFile(join(researchPath, 'SKILL.md'), 'Research instructions');
    await writeFile(join(root, 'agent/skills-manifest.json'), JSON.stringify({skills: [{id: 'scientific-critical-thinking'}]}));
    await writeFile(join(skillDir, 'SKILL.md'), 'Scientific evaluation instructions');
    const topic = 'Máy cắt điện hoạt động thế nào?';
    const claims = [{...fixture.claims[0], narration: 'Trong mặt cắt, tiếp điểm tách dọc trục.'}, fixture.claims[1]];
    const first = await researchTopic({root, topic, discover: async ({skill}) => {
      assert.match(skill, /Scientific evaluation/u);
      return {...fixture, claims};
    }});
    const cached = await researchTopic({root, topic, discover: async () => assert.fail('Unexpected lookup')});
    assert.deepEqual(cached, first);
    const words = claims.flatMap(claim => claim.narration.split(/\s+/u))
      .map((text, i) => ({text, startMs: i * 100, endMs: (i + 1) * 100}));
    const defaults = JSON.parse(await readFile(new URL('../visual-defaults.json', import.meta.url), 'utf8'));
    const scenes = buildStoryboard(words, 30, defaults, {topic, research: cached});
    assert.equal(scenes[0].visualDirection.shot.subject, 'abstract');
    assert.deepEqual(scenes[0].visualDirection.technicalEvidence.sourceIds, ['doe', 'stanford']);
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});
