import {Composition} from 'remotion';
import {LineDifferential87LDemo} from './compositions/LineDifferential87LDemo';
import {HighVoltageLife} from './HighVoltageLife';

export const RemotionRoot = () => {
  return (
    <>
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
    </>
  );
};
