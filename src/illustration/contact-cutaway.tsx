import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {DoubleSide} from 'three';
import {technicalFont} from '../theme';

type Props = {opening: number; cameraProgress: number; cameraSweep?: number};

export const ContactCutaway = ({opening, cameraProgress, cameraSweep}: Props) => {
  const detailed = cameraSweep !== undefined;
  const {width, height} = useVideoConfig();
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse, #e9f5f9, #86acbd)'}}>
    <ThreeCanvas width={width} height={height} camera={{position: [0, 0, detailed ? 11.8 : 8], fov: 36}}>
      <ambientLight intensity={1.4}/>
      <directionalLight position={[3, 4, 6]} intensity={2.2}/>
      {detailed && <directionalLight position={[-4, 2, -3]} intensity={1.15} color="#bce8ff"/>}
      <group rotation={[.12, -.28 + cameraProgress * (cameraSweep ?? .5), -.17]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[.61, .61, 3.45, detailed ? 64 : 48, 1, true, Math.PI / 2, Math.PI]}/>
          <meshStandardMaterial color="#7e9eaa" side={DoubleSide} metalness={detailed ? .36 : .25} roughness={detailed ? .42 : .52}/>
        </mesh>
        {[-1, 1].map(side => <mesh key={side}
          position={[side < 0 ? -.62 : .62 + opening * .76, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[.19, .19, 1.24, detailed ? 48 : 32]}/>
          <meshStandardMaterial color="#bf713d" metalness={.42} roughness={detailed ? .28 : .33}/>
        </mesh>)}
      </group>
    </ThreeCanvas>
    <div style={{position: 'absolute', top: '62%', width: '100%', textAlign: 'center', color: '#203e4f',
      font: `700 ${width * .04}px ${technicalFont}`, textShadow: '0 1px 3px #f5f8fb'}}>
      Mặt cắt nguyên lý · Minh họa
    </div>
  </AbsoluteFill>;
};
