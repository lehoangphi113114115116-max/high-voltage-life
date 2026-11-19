import test from 'node:test';
import assert from 'node:assert/strict';
import direction from '../config/narration-direction.json' with {type:'json'};
import {directNarration} from './voice-director.mjs';

test('choose roles per sentence while preserving technical names and caption text',()=>{
  const script='Bạn có biết vì sao rơ le phát tín hiệu? Hãy quan sát máy cắt SF6. Khi tín hiệu đến, máy cắt mở tiếp điểm. Hóa ra vỏ kim loại dẫn điện. Tóm lại hãy kiểm tra mạch trước.';
  const {beats}=directNarration(script,text=>text.replace('SF6','ét ép sáu'),direction);
  assert.deepEqual(beats.map(beat=>beat.role),['hook','phenomenon','explanation','discovery','conclusion']);
  assert.equal(beats.map(beat=>beat.displayText).join(' '),script);
  assert.match(beats[1].spokenText,/máy cắt ét ép sáu/u);
  assert.match(beats[3].spokenText,/^Hóa ra, /u);
  assert.ok(beats[3].pauseBeforeMs>beats[2].pauseAfterMs);
  assert.ok(beats[4].speedFactor<beats[1].speedFactor);
});
test('respect decimal points and wrapped terminology',()=>{
  const {beats}=directNarration('Điện áp là 22.5 kV ở máy\nbiến áp. Vì sao vậy?',text=>text,direction);
  assert.deepEqual(beats.map(beat=>beat.displayText),['Điện áp là 22.5 kV ở máy biến áp.','Vì sao vậy?']);
  assert.equal(beats[1].role,'question');
});
