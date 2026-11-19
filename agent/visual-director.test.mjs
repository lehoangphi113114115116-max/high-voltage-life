import assert from 'node:assert/strict';
import test from 'node:test';
import defaults from './visual-defaults.json' with {type:'json'};
import {buildStoryboard} from './storyboard.mjs';

const plan = (narration, visual, config=defaults) => {
  const text = narration.split(/\s+/u);
  const words = text.map((word,index)=>({text:word,startMs:index*230,endMs:(index+1)*230}));
  return buildStoryboard(words,30,config,{
    topic:'Máy cắt tại trạm biến áp',
    research:{claims:[{narration,visual,citations:[{sourceId:'manual'}]}]},
  })[0].visualDirection;
};

test('plan a richer context backdrop without assuming new substation equipment',()=>{
  const direction = plan('Đây là khung cảnh sân trạm biến áp.', 'abstract');
  assert.equal(direction.shot.subject,'abstract');
  assert.equal(direction.shot.renderer,'parallax');
  assert.equal(direction.detail.setting,'substation');
  assert.equal(direction.detail.foregroundTravel,defaults.sceneDetail.foregroundTravel);
});
test('keep the cutaway on the evidence-backed path and apply the camera profile',()=>{
  const text = 'Trong mặt cắt, tiếp điểm tách dọc trục.';
  assert.equal(plan(text,'abstract').shot.renderer,'parallax');
  const direction = plan(text,'breaker');
  assert.equal(direction.shot.renderer,'breaker-contact-3d');
  assert.equal(direction.detail.cutawaySweep,defaults.sceneDetail.cutawaySweep);
});
test('skip new scene settings for legacy visual defaults',()=>{
  const {sceneDetail,...legacy}=defaults;
  const direction=plan('Ở nhà máy có nhiều thiết bị.', 'abstract', legacy);
  assert.equal(direction.detail,undefined);
});
