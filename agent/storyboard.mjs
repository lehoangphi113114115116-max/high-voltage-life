// Scene boundaries come from narrated sentences, not a fixed scene count.
export const buildStoryboard = (words, fps = 30, visualDefaults = null) => {
  const groups = [];
  let sentence = [];
  for (const word of words) {
    sentence.push(word);
    if (/[.!?]$/u.test(word.text)) { groups.push(sentence); sentence = []; }
  }
  if (sentence.length) groups.push(sentence);
  return groups.map((group, index) => {
    const text = group.map((word) => word.text).join(' ');
    const mode = /nguy hiểm|khác điện thế|nối đất/iu.test(text) ? 'danger'
      : /điện trở|sụt áp/iu.test(text) ? 'wire-detail'
      : /chênh lệch|dòng điện|cực thấp/iu.test(text) ? 'principle' : 'depth';
    return {id: `sentence-${index}`, text, mode,
      startFrame: Math.round(group[0].startMs * fps / 1000),
      endFrame: Math.ceil(group.at(-1).endMs * fps / 1000),
      transition: index % 2 ? 'cross-dissolve' : 'directional-reveal',
      camera: mode === 'depth' ? 'parallax-dolly' : mode === 'wire-detail' ? 'macro-track' : 'diagram-push',
      ...(visualDefaults ? {visualDirection: {
        style: visualDefaults.style,
        palette: visualDefaults.palette.scene,
        brandScope: visualDefaults.palette.brandScope,
        lighting: visualDefaults.lighting,
        objectAnimationRequired: visualDefaults.motion.objectAnimationRequired,
        maxUnmotivatedStillSeconds: visualDefaults.motion.maxUnmotivatedStillSeconds,
        onScreenText: ['karaoke', 'essential-technical-labels'],
        representation: mode === 'principle' ? 'animated-2D' : 'depth-illustration',
        formulaPolicy: mode === 'principle' || mode === 'wire-detail' ? 'only-if-needed-for-this-sentence' : 'omit',
        footage: {status: mode === 'depth' ? 'consider-relevant-licensed-clip' : 'prefer-explanatory-animation', assets: [], requireVerifiedRights: true, fallback: 'original-animation'},
        synchronizeTo: 'scene-narration-timestamps',
      }} : {}),
    };
  });
};
