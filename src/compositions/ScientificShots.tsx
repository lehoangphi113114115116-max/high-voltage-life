import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BirdIllustration, Cloud, ContactSwitch, EnergyWire, GridTower, IllustrationScene, MaterialSurface, ParallaxLayer, Tree, motionProgress} from '../illustration';
import {RelaySymbol, SignalFlow} from '../components/technical';
import type {MotionScene} from './StoryMotion';

type Shot = {
  subject: 'bird' | 'breaker' | 'relay' | 'conductor';
  action: 'land' | 'perch' | 'compare-paths' | 'open-contacts' | 'relay-signal' | 'trace-energy';
  framing: 'wide' | 'detail' | 'diagram';
  transition: 'none' | 'match-cut' | 'directional-reveal' | 'cross-dissolve';
  actionFrame?: number;
  technicalCue: 'potential' | null;
};
export type ScientificScene = MotionScene & {visualDirection: {shot: Shot}};

const ShotArtwork = ({scene, frame, fps}: {scene: ScientificScene; frame: number; fps: number}) => {
  const {subject, framing, action, actionFrame, technicalCue} = scene.visualDirection.shot;
  const age = Math.max(0, frame - scene.startFrame);
  const move = motionProgress(age, 0, Math.max(1, scene.endFrame - scene.startFrame));
  const land = action === 'land' ? motionProgress(age, 0, Math.min(fps, Math.max(1, scene.endFrame - scene.startFrame))) : 1;
  const opening = motionProgress(frame, actionFrame ?? scene.startFrame, (actionFrame ?? scene.startFrame) + .45 * fps);
  const detail = framing === 'detail';
  const diagram = framing === 'diagram';
  const danger = action === 'compare-paths';
  const sky = diagram ? '#e0eff0' : '#84c6eb';
  return <AbsoluteFill style={{background: `linear-gradient(${sky}, #f1f5dc 72%, #77a677)`}}>
    <IllustrationScene
      background={!diagram && <ParallaxLayer cameraX={move * 65} depth={.3}>
        <Cloud x={180} y={620} scale={1.3}/><Cloud x={855} y={680}/>
        <path d="M -100 1350 Q 200 1000 570 1290 Q 900 1110 1200 1290 V 1920 H -100 Z" fill="#83ad8f"/>
        <path d="M -100 1500 Q 340 1270 610 1460 Q 940 1290 1200 1450 V 1920 H -100 Z" fill="#557e60"/>
      </ParallaxLayer>}
      midground={<g transform={detail ? `translate(${-190 - move * 40} -300) scale(1.4)` : undefined}>
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
      foreground={framing === 'wide' && <ParallaxLayer cameraX={move*55} depth={1}><Tree x={75} y={1470}/><Tree x={1030} y={1500}/></ParallaxLayer>}
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
  const duration = Math.min(.35*fps, (scene.endFrame - scene.startFrame)/3);
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
