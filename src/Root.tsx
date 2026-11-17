import {Composition} from 'remotion';
import {LineDifferential87LDemo} from './compositions/LineDifferential87LDemo';
import {AutonomousExplainer} from './compositions/AutonomousExplainer';
import {HighVoltageLife} from './HighVoltageLife';
import currentVideo from './generated/current-video.json';
import {NaturalBirdDemo} from './compositions/NaturalBirdDemo';
import {PowerJourney} from './compositions/PowerJourney';

export const RemotionRoot = () => {
  return (
    <>
      <Composition id="HVL-POWER-JOURNEY-15S" component={PowerJourney} durationInFrames={450} fps={30} width={1080} height={1920}/>
      <Composition id="HVL-NATURAL-BIRD-15S" component={NaturalBirdDemo} durationInFrames={450} fps={30} width={1080} height={1920}/>
      <Composition id="HVL-MOTION-PREVIEW" component={AutonomousExplainer} defaultProps={{motionPreview: true}} durationInFrames={520} fps={30} width={1080} height={1920} />
      <Composition
        id="HIGH-VOLTAGE-LIFE"
        component={HighVoltageLife}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HV-LIFE-87L-DEMO"
        component={LineDifferential87LDemo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HVL-AUTONOMOUS-EXPLAINER"
        component={AutonomousExplainer}
        durationInFrames={currentVideo.durationInFrames}
        fps={currentVideo.fps}
        width={currentVideo.width}
        height={currentVideo.height}
      />
    </>
  );
};
