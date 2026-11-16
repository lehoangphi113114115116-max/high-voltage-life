import {Composition} from 'remotion';
import {HighVoltageLife} from './HighVoltageLife';

export const RemotionRoot = () => {
  return (
    <Composition
      id="HIGH-VOLTAGE-LIFE"
      component={HighVoltageLife}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
