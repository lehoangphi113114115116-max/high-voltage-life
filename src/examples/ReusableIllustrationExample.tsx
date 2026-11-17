import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Cloud, EnergyWire, Tree, Transformer, IllustrationScene, ParallaxLayer, SceneReveal, ContactSwitch, Smoke, motionProgress, illustrationTokens as tokens} from '../illustration';

/** Unregistered source example: no preview or render generated. */
export const ReusableIllustrationExample = () => {
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  const camera=motionProgress(frame,0,8*fps)*80;
  const opening=motionProgress(frame,4*fps,5*fps);
  return <IllustrationScene
    background={<><rect width="1080" height="1920" fill={tokens.nature.sky}/><ParallaxLayer cameraX={camera} depth={tokens.depth.background}><Cloud x={250} y={300}/><Cloud x={850} y={380}/></ParallaxLayer></>}
    midground={<ParallaxLayer cameraX={camera} depth={tokens.depth.midground}><Transformer x={400} label="MÁY BIẾN ÁP"/><EnergyWire x1={435} y1={590} x2={900} y2={590} energized={opening<.01}/></ParallaxLayer>}
    foreground={<ParallaxLayer cameraX={camera} depth={tokens.depth.foreground}><Tree x={920} y={1000}/></ParallaxLayer>}
    technicalOverlay={<><ContactSwitch x={400} y={1100} opening={opening} arcActive={opening>.1&&opening<.8}/><Smoke x={100} y={1000} active={false}/></>}
    labels={<SceneReveal boundarySeconds={3} kind="wipe"><div style={{position:'absolute',top:80,left:80,color:tokens.brand.navy,fontSize:38,fontFamily:tokens.font}}>MINH HỌA NGUYÊN LÝ</div></SceneReveal>}
  />;
};
