import {useCurrentFrame,useVideoConfig} from 'remotion';
import {loopPhase} from '../illustration/motion';

export const Rain = ({strength=1,depth=1}: {strength?:number;depth?:number}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <g opacity={strength*.5}>{Array.from({length:Math.round(62*depth)},(_,i)=>{
    const x=(i*137.3+47)%1160;
    const phase=loopPhase(f/fps,.7/depth,i*.137);
    const y=360+phase*1110;
    return <path key={i} d={`M ${x-phase*110} ${y} l -8 ${18*depth}`} stroke="#d8ecf3" strokeWidth={1.4*depth} strokeLinecap="round"/>;
  })}</g>;
};
export const FieldLines = ({x,y,radius=70,intensity=1}: {x:number;y:number;radius?:number;intensity?:number}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  const pulse=.65+.35*Math.cos(f/fps*Math.PI*2);
  return <g opacity={intensity*(.35+.25*pulse)}>{Array.from({length:18},(_,i)=>{const a=i*Math.PI*2/18;return <path key={i} d={`M ${x+Math.cos(a)*radius} ${y+Math.sin(a)*radius} L ${x+Math.cos(a)*(radius+65+pulse*20)} ${y+Math.sin(a)*(radius+65+pulse*20)}`} stroke="#64c7df" strokeWidth="3" strokeLinecap="round"/>;})}</g>;
};
/** Local, short discharges; never bridges phases or connects conductor to earth. */
export const CoronaGlow = ({x,y,strength=1,scale=1}: {x:number;y:number;strength?:number;scale?:number}) => {
  const f=useCurrentFrame();
  return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={strength}>
    <ellipse rx="29" ry="20" fill="#9361c8" opacity={.15+.07*Math.sin(f*.8)}/>
    {Array.from({length:7},(_,i)=>{
      const a=(i/7)*Math.PI*2;const flash=Math.max(0,Math.sin(f*.53+i*2.7));const r=7+flash*16;
      return <path key={i} d={`M ${Math.cos(a)*4} ${Math.sin(a)*4} l ${Math.cos(a)*r*.6} ${Math.sin(a)*r*.6} l ${Math.cos(a+.4)*r*.4} ${Math.sin(a+.4)*r*.4}`} stroke={i%2?'#7840ae':'#a15bd5'} strokeWidth="2.4" fill="none" opacity={.15+flash*.85}/>;
    })}
  </g>;
};
export const WaterDrop = ({x,y,size=1}: {x:number;y:number;size?:number}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  const phase=loopPhase(f/fps,2.8);
  return <g transform={`translate(${x} ${y}) scale(${size})`}>
    <path d={`M -27 0 Q -43 54 0 ${100+Math.sin(f/11)*5} Q 43 54 27 0 Z`} fill="#85c8e8" fillOpacity=".85" stroke="#d8f4fa" strokeWidth="3"/>
    <path d="M -17 12 Q -26 44 -5 62" fill="none" stroke="#ecfbff" strokeWidth="5" opacity=".65"/>
    {phase>.7&&<ellipse cx="0" cy={105+(phase-.7)*520} rx="7" ry="12" fill="#a8dfed" opacity={1-(phase-.7)/.3}/>}
  </g>;
};
export const PressureWaves = ({x,y}: {x:number;y:number}) => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  return <g>{[0,1,2,3].map(i=>{const phase=loopPhase(f/fps,2.2,i/4);return <circle key={i} cx={x} cy={y} r={35+phase*270} fill="none" stroke="#e3bd64" strokeWidth={3-phase*2} opacity={(1-phase)*.55}/>;})}</g>;
};
