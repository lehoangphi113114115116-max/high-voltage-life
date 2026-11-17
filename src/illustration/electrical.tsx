import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CurrentFlow} from '../components/technical';
import {illustrationTokens as tokens} from './tokens';
import {loopPhase} from './motion';

/** Extracted from PowerJourney. One geometry drives both wire and particles. */
export const EnergyWire = ({x1,y1,x2,y2,sag=25,energized=true,reverse=false}: {
  x1:number;y1:number;x2:number;y2:number;sag?:number;energized?:boolean;reverse?:boolean;
}) => {
  const length=Math.hypot(x2-x1,y2-y1);
  if (length===0) return null;
  const angle=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
  return <g transform={`translate(${x1} ${y1}) rotate(${angle})`}>
    <path d={`M 0 0 Q ${length/2} ${sag} ${length} 0`} fill="none" stroke={tokens.material.wire} strokeWidth={tokens.stroke.conductor}/>
    {energized && <CurrentFlow x1={0} x2={length} y={0} controlY={sag} radius={4} count={Math.max(3,Math.round(length/70))} speed={.85} terminalPulse reverse={reverse}/>}
  </g>;
};

/** Conceptual arc effect only; caller supplies physically justified active window. */
export const Arc = ({x1,y1,x2,y2,active=false}: {x1:number;y1:number;x2:number;y2:number;active?:boolean}) => {
  const frame=useCurrentFrame();
  if (!active) return null;
  const dx=x2-x1, dy=y2-y1, length=Math.hypot(dx,dy);
  const nx=length?-dy/length:0, ny=length?dx/length:1;
  const jitter=Math.sin(frame*1.7)*5;
  const d=`M ${x1} ${y1} L ${x1+dx*.3+nx*jitter} ${y1+dy*.3+ny*jitter} L ${x1+dx*.65-nx*jitter} ${y1+dy*.65-ny*jitter} L ${x2} ${y2}`;
  return <g><path d={d} stroke={tokens.brand.arcOrange} strokeWidth="14" opacity=".18" fill="none"/><path d={d} stroke="#fff2ca" strokeWidth="3" fill="none"/></g>;
};

/** Generic switching symbol, NOT real SF6 construction or arc physics. */
export const ContactSwitch = ({x=0,y=0,opening=0,arcActive=false}: {x?:number;y?:number;opening?:number;arcActive?:boolean}) => {
  const open=Math.min(1,Math.max(0,opening));
  const movingX=100+open*75;
  return <g transform={`translate(${x} ${y})`}>
    <path d="M 0 0 L 100 0" stroke={tokens.material.copper} strokeWidth="12"/>
    <path d={`M ${movingX} 0 L 260 0`} stroke={tokens.material.metal} strokeWidth="12"/>
    <circle cx="100" cy="0" r="9" fill={tokens.material.copper}/><circle cx={movingX} cy="0" r="9" fill={tokens.material.metalLight}/>
    <Arc x1={100} y1={0} x2={movingX} y2={0} active={arcActive && open>.02 && open<.98}/>
  </g>;
};

export const Smoke = ({x,y,active=false}: {x:number;y:number;active?:boolean}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  if (!active) return null;
  return <g>{[0,1,2,3].map(i=>{const phase=loopPhase(frame/fps,3,i/4);return <ellipse key={i} cx={x+Math.sin(phase*4+i)*12} cy={y-phase*150} rx={12+phase*27} ry={15+phase*20} fill="#d4d9da" opacity={Math.sin(phase*Math.PI)*.35}/>;})}</g>;
};
