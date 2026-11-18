import catalog from '../src/formula/catalog.json' with {type:'json'};

const rules = [
  {id:'joule', test:text=>/tổn (?:thất|hao)|phát nhiệt/iu.test(text)&&/bình phương (?:của )?(?:cường độ )?dòng/iu.test(text),
    terms:[/tổn (?:thất|hao)|phát nhiệt/iu,/bình phương/iu,/điện trở/iu]},
  {id:'ohm', test:text=>/định luật (?:ôm|ohm)/iu.test(text)&&/điện áp|hiệu điện thế/iu.test(text)
    && /điện trở/iu.test(text)&&/dòng điện/iu.test(text),
    terms:[/điện áp|hiệu điện thế/iu,/điện trở/iu,/dòng điện/iu]},
  {id:'dc-power', test:text=>/công suất/iu.test(text)&&/một chiều không đổi|mạch một chiều ổn định/iu.test(text)
    && /điện áp nhân (?:với )?(?:cường độ )?dòng điện/iu.test(text),
    terms:[/công suất/iu,/điện áp/iu,/dòng điện/iu]},
];

export const directFormulas = ({scenes, words, research, fps, policy}) => {
  if (!policy?.enabled) return [];
  const cards = [];
  for (const scene of scenes) {
    if (cards.length >= policy.maxCards) break;
    const evidence = scene.visualDirection?.technicalEvidence;
    const claim = research?.claims?.[evidence?.claimIndex];
    const rule = rules.find(entry=>entry.test(scene.text));
    if (!rule || !claim?.citations?.length || cards.some(card=>card.id===rule.id)
      || scene.visualDirection?.shot?.renderer==='breaker-contact-3d') continue;
    const inScene = words.filter(word=>{
      const frame = Math.round(word.startMs*fps/1000);
      return frame>=scene.startFrame && frame<scene.endFrame;
    });
    const cues = rule.terms.flatMap((pattern,term)=>{
      const phrase = new RegExp(`^(?:${pattern.source})`, pattern.flags);
      const index = inScene.findIndex((_,i)=>phrase.test(inScene.slice(i,i+4).map(word=>word.text).join(' ')));
      return index<0 ? [] : [{term, frame:Math.round(inScene[index].startMs*fps/1000)}];
    }).sort((a,b)=>a.frame-b.frame);
    if (cues.length<2) continue;
    const startFrame = Math.max(scene.startFrame, cues[0].frame-Math.round(.18*fps));
    const endFrame = Math.min(scene.endFrame,startFrame+Math.floor(policy.maxSeconds*fps),cues.at(-1).frame+Math.round(1.2*fps));
    if (endFrame-startFrame<Math.ceil(1.6*fps) || cues.at(-1).frame>=endFrame) continue;
    cards.push({id:rule.id,sceneId:scene.id,startFrame,endFrame,cues,source:catalog[rule.id].source,
      sourceIds:[...new Set(claim.citations.map(cite=>cite.sourceId))]});
  }
  return cards;
};
