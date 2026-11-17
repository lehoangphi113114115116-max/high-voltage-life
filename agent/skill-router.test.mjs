import assert from 'node:assert/strict';
import {selectAgentSkills} from './skill-router.mjs';

const ids = (routing) => routing.selected.map((skill) => skill.id);

const everyday = selectAgentSkills({
  topic: 'Vì sao chim đậu trên dây điện mà không bị giật?',
  category: 'electricity-in-life',
  visualMode: 'technical-depth-illustration',
});
assert.deepEqual(ids(everyday), ['social', 'scientific-critical-thinking']);

const equipment = selectAgentSkills({
  topic: 'Cấu tạo bên trong máy cắt SF6',
  category: 'high-voltage-equipment',
  visualMode: 'selective-2.5d-cutaway',
});
assert.deepEqual(ids(equipment), ['social', 'scientific-critical-thinking', 'anatomy']);
assert.equal(equipment.anatomyEvidenceReady, false);
assert.match(equipment.selected.at(-1).evidenceGate, /tài liệu kỹ thuật/u);
assert.equal(equipment.selected.at(-1).renderer, 'Remotion');

const relay = selectAgentSkills({
  topic: 'Nguyên lý bảo vệ so lệch đường dây 87L',
  category: 'relay-protection',
  visualMode: 'animated-2d-schematic',
});
assert.deepEqual(ids(relay), ['social', 'scientific-critical-thinking']);

console.log('Skill router: 3/3 tình huống đạt.');
