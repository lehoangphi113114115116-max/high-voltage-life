import test from 'node:test';
import assert from 'node:assert/strict';
import {directFormulas} from './formula-director.mjs';

const line='Tổn hao phát nhiệt tăng theo bình phương dòng điện trên cùng điện trở.';
const scene={id:'heat',text:line,startFrame:0,endFrame:137,
  visualDirection:{technicalEvidence:{claimIndex:0},shot:{renderer:'svg'}}};
const words=line.split(' ').map((text,i)=>({text,startMs:i*260,endMs:(i+1)*260}));
const research={claims:[{citations:[{sourceId:'physics'},{sourceId:'grid'}]}]};
const policy={enabled:true,maxCards:2,maxSeconds:4.8};
test('plan the verified Joule-loss equation and cue specific terms',()=>{
  const result=directFormulas({scenes:[scene],words,research,fps:30,policy});
  assert.equal(result.length,1);
  assert.equal(result[0].id,'joule');
  assert.deepEqual(result[0].cues.map(cue=>cue.term),[0,1,2]);
  assert.ok(result[0].endFrame<=scene.endFrame);
  assert.deepEqual(result[0].sourceIds,['physics','grid']);
});
test('omit formula without scene evidence or a clear and applicable relation',()=>{
  for(const candidate of [scene,{...scene,text:'Công suất phụ thuộc điện áp và dòng điện xoay chiều.'}]) {
    const result=directFormulas({scenes:[candidate],words,fps:30,policy,research:candidate===scene?undefined:research});
    assert.deepEqual(result,[]);
  }
});
