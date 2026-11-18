import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {DoubleSide} from 'three';
import {motionProgress} from './motion';

const steel = '#83a9b6';
const copper = '#d98446';

const AxialCylinder = ({x, radius, length, color}: {x: number; radius: number; length: number; color: string}) =>
  <mesh position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
    <cylinderGeometry args={[radius, radius, length, 32]}/>
    <meshStandardMaterial color={color} roughness={.48} metalness={.32}/>
  </mesh>;

const Ring = ({x, radius, thickness, color}: {x: number; radius: number; thickness: number; color: string}) =>
  <mesh position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
    <torusGeometry args={[radius, thickness, 10, 48]}/>
    <meshStandardMaterial color={color} metalness={.24} roughness={.5}/>
  </mesh>;

/** Generic outer-rotor radial-flux topology based on NREL/TP-5000-75698 §5.
 * Geometry and animation are schematic, with no product dimensions, pole count or speed implied.
 */
export const WindDrivetrain = ({seconds}: {seconds: number}) => {
  const {width, height} = useVideoConfig();
  const reveal = motionProgress(seconds, .8, 3.1);
  const angle = seconds * .83;
  const view = motionProgress(seconds, 1, 14);
  return <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 48%, #edf9e6, #a7d6d8 65%, #70b4d7)'}}>
    <ThreeCanvas width={width} height={height} camera={{position:[0, .15, 10.4], fov:37}} dpr={1}>
      <ambientLight intensity={1.55}/><directionalLight position={[2, 4, 5]} intensity={2.65}/>
      <directionalLight position={[-4, 0, -2]} color="#acdfff" intensity={1.1}/>
      <group scale={.82 + .07 * view} rotation={[.12, -.31 + .57 * view, -.13 + .1 * view]} position={[.08,-.04,0]}>
        <mesh position={[.6, -1.75, -.23]}>
          <cylinderGeometry args={[.39, .51, 1.82, 28]}/>
          <meshStandardMaterial color="#e1eeea"/>
        </mesh>
        <mesh position={[.45, -.9, -.13]}>
          <boxGeometry args={[3.23,.23,1.45]}/>
          <meshStandardMaterial color="#567f8b"/>
        </mesh>
        <mesh position={[.51, reveal * 2.12, -.17]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.13,1.13,3.52,36,1,true,Math.PI/2,Math.PI]}/>
          <meshStandardMaterial color="#d3ece9" transparent opacity={.84 - .46 * reveal} side={DoubleSide} depthWrite={false}/>
        </mesh>
        <AxialCylinder x={.89} radius={.24} length={1.72} color="#345670"/>
        {[-.37, .43].map(x => <Ring key={x} x={x} radius={.365} thickness={.094} color="#d2e7e0"/>)}
        <group rotation={[angle, 0, 0]}>
          <AxialCylinder x={-1.03} radius={.23} length={2.37} color={steel}/>
          <mesh position={[-2.05,0,0]}><sphereGeometry args={[.43,24,16]}/><meshStandardMaterial color="#eef8ee"/></mesh>
          {[0, 1, 2].map(i => <group key={i} rotation={[i * Math.PI * 2 / 3, 0, 0]}>
            <mesh position={[-2, .92, 0]} rotation={[.06,0,.14]}>
              <boxGeometry args={[.2,1.28,.29]}/><meshStandardMaterial color="#d9f2e8"/>
            </mesh>
            <mesh position={[-2.04,1.61, .05]} rotation={[.12,0,.14]}>
              <boxGeometry args={[.13,.28,.2]}/><meshStandardMaterial color="#e87556"/>
            </mesh>
          </group>)}
          <AxialCylinder x={.20} radius={.86} length={.15} color="#668fa5"/>
          <Ring x={.44} radius={.93} thickness={.075} color="#4d7b9d"/>
          <Ring x={1.1} radius={.93} thickness={.075} color="#4d7b9d"/>
          {Array.from({length:12}, (_, i) => <group key={i} rotation={[i*Math.PI/6,0,0]}>
            <mesh position={[.77, .89, 0]}><boxGeometry args={[.67,.12,.24]}/>
              <meshStandardMaterial color={i%2 ? '#e37e48' : '#4593cb'}/></mesh>
          </group>)}
        </group>
        <Ring x={1.12} radius={.63} thickness={.077} color={copper}/>
        {Array.from({length:12}, (_,i) => <group key={i} rotation={[i*Math.PI/6,0,0]}>
          <mesh position={[.78,.62,0]}><boxGeometry args={[.66,.13,.19]}/>
            <meshStandardMaterial color={copper} metalness={.46} roughness={.42}/></mesh>
        </group>)}
      </group>
    </ThreeCanvas>
  </AbsoluteFill>;
};
