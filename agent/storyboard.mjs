import {chooseSceneRenderer} from './visual-director.mjs';

// Scene boundaries come from narrated sentences, not a fixed scene count.
export const buildStoryboard = (words, fps = 30, visualDefaults = null, context = {}) => {
  const groups = [];
  let sentence = [];
  for (const word of words) {
    sentence.push(word);
    const elapsed = word.endMs - sentence[0].startMs;
    if (/[.!?]$/u.test(word.text) || (elapsed >= 3200 && /[,;:]$/u.test(word.text)) || elapsed >= 6200) {
      groups.push(sentence); sentence = [];
    }
  }
  if (sentence.length) groups.push(sentence);
  const claimSpans = [];
  const claims = context.research?.claims ?? [];
  const claimWords = claims.map(claim => claim.narration.trim().replace(/(?<![.!?])$/u, '.').split(/\s+/u));
  if (claimWords.flat().join(' ') === words.map(word => word.text).join(' ')) {
    let offset = 0;
    for (const [index, tokens] of claimWords.entries()) {
      claimSpans.push({claim: claims[index], index, from: offset, to: offset + tokens.length});
      offset += tokens.length;
    }
  }
  let wordOffset = 0;
  let previousShot;
  return groups.map((group, index) => {
    const text = group.map((word) => word.text).join(' ');
    const mode = /nguy hiểm|khác điện thế|nối đất/iu.test(text) ? 'danger'
      : /điện trở|sụt áp/iu.test(text) ? 'wire-detail'
      : /chênh lệch|dòng điện|cực thấp/iu.test(text) ? 'principle' : 'depth';
    const bird = context.category === 'electricity-in-life' && /chim.*dây điện|dây điện.*chim/iu.test(context.topic ?? '');
    const comparison = /chênh lệch|điện thế|sụt áp/iu.test(text);
    const breaker = /máy cắt|sf6/iu.test(context.topic ?? '') && /mở tiếp điểm|tiếp điểm tách|tách tiếp điểm/iu.test(text)
      && !/không (?:được |thể )?(?:mở tiếp điểm|để tiếp điểm tách|tách tiếp điểm)/iu.test(text);
    const relay = /\b87l\b|so lệch đường dây/iu.test(context.topic ?? '') && /rơ le|tín hiệu|so lệch/iu.test(text);
    const support = claimSpans.find(span => span.from <= wordOffset && wordOffset + group.length <= span.to);
    wordOffset += group.length;
    const candidate = bird ? 'bird' : breaker ? 'breaker' : relay ? 'relay' : 'conductor';
    const subject = context.research && support?.claim.visual !== candidate ? 'abstract' : candidate;
    const action = subject === 'abstract' ? 'illustrate' : bird ? (mode === 'danger' ? 'compare-paths' : index === 0 ? 'land' : 'perch')
      : breaker ? 'open-contacts' : relay ? 'relay-signal' : 'trace-energy';
    const phase = comparison && !breaker && !relay ? 'diagram' : previousShot?.framing === 'wide' || breaker ? 'detail' : 'wide';
    const framing = bird && index === 0 ? 'wide'
      : phase === 'diagram' && previousShot?.framing === 'diagram' ? 'detail' : phase;
    const transition = !previousShot ? 'none' : previousShot.framing === framing ? 'match-cut'
      : framing === 'diagram' ? 'directional-reveal' : 'cross-dissolve';
    const cue = group.find(word => /^(mở|tách)[,.;]?$/iu.test(word.text));
    const shot = {subject, action, framing, transition,
      actionFrame: breaker && cue ? Math.round(cue.startMs * fps / 1000) : undefined,
      technicalCue: subject !== 'abstract' && framing === 'diagram' ? 'potential' : null};
    const renderer = subject === 'abstract' ? 'parallax' : chooseSceneRenderer({shot, text, policy: visualDefaults?.sceneRenderers});
    previousShot = shot;
    return {id: `sentence-${index}`, text, mode,
      startFrame: Math.round(group[0].startMs * fps / 1000),
      endFrame: Math.ceil(group.at(-1).endMs * fps / 1000),
      transition: index % 2 ? 'cross-dissolve' : 'directional-reveal',
      camera: mode === 'depth' ? 'parallax-dolly' : mode === 'wire-detail' ? 'macro-track' : 'diagram-push',
      ...(visualDefaults ? {visualDirection: {
        ...(visualDefaults.storytelling === 'visual-first-scientific-explainer' ? {shot: {...shot, renderer}} : {}),
        ...(context.research ? {technicalEvidence: {
          claimIndex: support?.index ?? null,
          sourceIds: support?.claim.citations.map(cite => cite.sourceId) ?? [],
          depiction: 'principle-illustration',
        }} : {}),
        style: visualDefaults.style,
        styleName: visualDefaults.styleName,
        illustrationSystem: visualDefaults.illustrationSystem,
        footageDirector: visualDefaults.footageDirector,
        primaryVisuals: visualDefaults.primaryVisuals,
        componentArchitecture: visualDefaults.componentArchitecture,
        actionDirection: visualDefaults.actionDirection,
        depthDirection: visualDefaults.depthDirection,
        electricalAnimation: visualDefaults.electricalAnimation,
        palette: visualDefaults.palette.scene,
        brandScope: visualDefaults.palette.brandScope,
        lighting: visualDefaults.lighting,
        objectAnimationRequired: visualDefaults.motion.objectAnimationRequired,
        maxUnmotivatedStillSeconds: visualDefaults.motion.maxUnmotivatedStillSeconds,
        onScreenText: ['karaoke', 'essential-technical-labels'],
        representation: renderer === 'breaker-contact-3d' ? 'schematic-3D' : renderer === 'svg' ? 'animated-2D' : 'depth-illustration',
        formulaPolicy: mode === 'principle' || mode === 'wire-detail' ? 'only-if-needed-for-this-sentence' : 'omit',
        footage: {status: 'optional-only-if-topic-requires', policy: visualDefaults.footage.selection, assets: [], requireVerifiedRights: true, fallback: 'original-animation'},
        synchronizeTo: 'scene-narration-timestamps',
      }} : {}),
    };
  });
};
