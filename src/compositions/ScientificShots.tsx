import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BirdIllustration, Cloud, ContactCutaway, ContactSwitch, EnergyWire, GridTower, IllustrationScene, MaterialSurface, ParallaxLayer, Tree, motionProgress} from '../illustration';
import {RelaySymbol, SignalFlow} from '../components/technical';
import type {MotionScene} from './StoryMotion';

type Shot = {
  subject: 'bird' | 'breaker' | 'relay' | 'conductor' | 'abstract';
  action: 'land' | 'perch' | 'compare-paths' | 'open-contacts' | 'relay-signal' | 'trace-energy' | 'illustrate';
  framing: 'wide' | 'detail' | 'diagram';
  transition: 'none' | 'match-cut' | 'directional-reveal' | 'cross-dissolve';
  actionFrame?: number;
  renderer?: 'svg' | 'parallax' | 'breaker-contact-3d';
  technicalCue: 'potential' | null;
};
type SceneDetail = {
  setting: 'substation' | 'plant' | 'landscape';
  backgroundTravel: number;
  foregroundTravel: number;
  detailZoom: number;
  transitionSeconds: number;
  cutawaySweep: number;
};
export type ScientificScene = MotionScene & {
  visualDirection: {shot: Shot; technicalEvidence?: {depiction: string}; detail?: SceneDetail};
};

// Context silhouettes only: no invented equipment, ratings or connections.
const SiteScenery = ({setting}: {setting: SceneDetail['setting']}) => {
  if (setting === 'plant') return <g fill="#789d94" opacity=".72">
    <path d="M 86 1265 V 1117 L 211 1052 V 1117 L 322 1052 V 1117 H 459 V 1265 Z"/>
    <path d="M 119 1174 H 420 M 119 1203 H 420" stroke="#c9dfcb" strokeWidth="8" strokeDasharray="44 15"/>
  </g>;
  if (setting === 'substation') return <g opacity=".72">
    <path d="M 44 1348 L 210 1166 H 918 L 1062 1303 L 853 1365 Z" fill="#bfccc1" stroke="#769c98" strokeWidth="5"/>
    <path d="M 72 1320 L 253 1210 H 924 M 131 1285 V 1345 M 252 1192 V 1253 M 399 1192 V 1253 M 546 1192 V 1253 M 693 1192 V 1253 M 840 1192 V 1253" stroke="#6b918d" strokeWidth="6" fill="none"/>
  </g>;
  return <path d="M -80 1494 Q 250 1370 454 1415 T 1190 1381" fill="none" stroke="#b2c698" strokeWidth="22" opacity=".67"/>;
};

const ShotArtwork = ({scene, frame, fps}: {scene: ScientificScene; frame: number; fps: number}) => {
  const {shot, detail: direction} = scene.visualDirection;
  const {subject, framing, action, actionFrame, technicalCue, renderer} = shot;
  const age = Math.max(0, frame - scene.startFrame);
  const move = motionProgress(age, 0, Math.max(1, scene.endFrame - scene.startFrame));
  const land = action === 'land' ? motionProgress(age, 0, Math.min(fps, Math.max(1, scene.endFrame - scene.startFrame))) : 1;
  const opening = motionProgress(frame, actionFrame ?? scene.startFrame, (actionFrame ?? scene.startFrame) + .45 * fps);
  if (renderer === 'breaker-contact-3d') return <ContactCutaway opening={opening} cameraProgress={move} cameraSweep={direction?.cutawaySweep}/>;
  const useDepth = renderer ? renderer === 'parallax' : framing !== 'diagram';
  const detail = framing === 'detail';
  const diagram = framing === 'diagram';
  const danger = action === 'compare-paths';
  const sky = diagram ? '#e0eff0' : '#84c6eb';
  const cameraX = move * (direction?.backgroundTravel ?? 65);
  const closeup = direction
    ? `translate(${540 - move * 46} 960) scale(${1.12 + (direction.detailZoom - 1.12) * move}) translate(-540 -960)`
    : `translate(${-190 - move * 40} -300) scale(1.4)`;
  const subjectTransform = detail ? closeup : undefined;
  return <AbsoluteFill style={{background: `linear-gradient(${sky}, #f1f5dc 72%, #77a677)`}}>
    <IllustrationScene
      background={useDepth && <ParallaxLayer cameraX={cameraX} depth={.3}>
        <Cloud x={180} y={620} scale={1.3}/><Cloud x={855} y={680}/>
        {direction && <>
          <Cloud x={485} y={575} scale={.62}/>
          <path d="M -150 1190 Q 153 880 418 1115 T 1250 1000 V 1470 H -150Z" fill="#a2c2b1"/>
        </>}
        <path d="M -100 1350 Q 200 1000 570 1290 Q 900 1110 1200 1290 V 1920 H -100 Z" fill="#83ad8f"/>
        <path d="M -100 1500 Q 340 1270 610 1460 Q 940 1290 1200 1450 V 1920 H -100 Z" fill="#557e60"/>
      </ParallaxLayer>}
      midground={<>
        {direction && useDepth && <ParallaxLayer cameraX={cameraX} depth={.63}>
          <SiteScenery setting={direction.setting}/>
        </ParallaxLayer>}
        {subject !== 'abstract' && <g transform={subjectTransform}>
          {subject === 'breaker' ? <g transform="translate(220 960) scale(2.45)">
            <MaterialSurface x={-15} y={-56} width={290} height={112} radius={18}/>
            <ContactSwitch opening={opening}/>
          </g> : subject === 'relay' ? <g transform="translate(0 425)">
            <RelaySymbol x={250} y={520} station="ĐẦU A" active/>
            <RelaySymbol x={830} y={520} station="ĐẦU B" active/>
            <SignalFlow/>
          </g> : <>
            {framing === 'wide' && <g transform="translate(0 560)"><GridTower x={135}/><GridTower x={950}/></g>}
            <EnergyWire x1={-90} x2={1170} y1={990} y2={990} sag={0}/>
            {danger && <EnergyWire x1={-90} x2={1170} y1={878} y2={878} sag={0}/>}
            {subject === 'bird' && !diagram && <BirdIllustration x={535 - (1-land)*430} y={896 - (1-land)*180}/>}
            {subject === 'bird' && danger && !diagram && <path d="M 540 990 L 570 878" stroke="#c95427" strokeWidth="4" strokeDasharray="10 9"/>}
          </>}
        </g>}
      </>}
      foreground={useDepth && (framing === 'wide' || Boolean(direction)) && <ParallaxLayer cameraX={move*(direction?.foregroundTravel ?? 55)} depth={1}>
        <Tree x={75} y={1470}/><Tree x={1030} y={1500}/>
        {direction && <g transform="translate(200 655) scale(.54)" opacity=".8">
          <Tree x={160} y={1510}/><Tree x={1420} y={1550}/>
        </g>}
      </ParallaxLayer>}
      labels={scene.visualDirection.technicalEvidence && <div style={{position: 'absolute', top: '69%', width: '100%',
        textAlign: 'center', color: '#203e4f', font: '700 32px Arial'}}>Minh họa nguyên lý</div>}
      technicalOverlay={technicalCue === 'potential' && <g fontFamily="Arial" fontWeight="700" fill="#203e4f" textAnchor="middle">
        {subject === 'bird' && danger && <path d="M 350 990 Q 490 850 730 878" stroke="#c95427" strokeWidth="5" fill="none" strokeDasharray="14 8" strokeDashoffset={-age * 2}/>}
        {[350,730].map((x,i) => <g key={x} transform={`translate(${x} ${danger && i ? 878 : 990})`}>
          <circle r={12 + 2*Math.sin(age / 8)} fill={danger && i ? '#c95427' : '#f5b921'}/>
          <text y={-29} fontSize="33">{i ? 'V₂' : 'V₁'}</text>
        </g>)}
        <text x="540" y="1120" fontSize="44">{subject === 'bird' && !danger ? 'V₁ ≈ V₂' : 'ΔV = V₁ − V₂'}</text>
      </g>}
    />
  </AbsoluteFill>;
};

export const ScientificShots = ({scenes}: {scenes: ScientificScene[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Hold the last shot across pauses and over the outgoing side of a transition.
  let index = 0;
  while (index + 1 < scenes.length && scenes[index + 1].startFrame <= frame) index++;
  const scene = scenes[index];
  const previous = scenes[index - 1];
  const {transition} = scene.visualDirection.shot;
  const duration = Math.min((scene.visualDirection.detail?.transitionSeconds ?? .35)*fps, (scene.endFrame - scene.startFrame)/3);
  const blend = previous && duration > 0 && (transition === 'cross-dissolve' || transition === 'directional-reveal')
    ? motionProgress(frame, scene.startFrame, scene.startFrame + duration) : 1;
  return <>
    {blend < 1 && <ShotArtwork scene={previous} frame={frame} fps={fps}/>}
    <AbsoluteFill style={{
      opacity: transition === 'cross-dissolve' ? blend : 1,
      clipPath: transition === 'directional-reveal' ? `inset(0 ${(1-blend)*100}% 0 0)` : undefined,
    }}>
      <ShotArtwork scene={scene} frame={frame} fps={fps}/>
    </AbsoluteFill>
  </>;
};
