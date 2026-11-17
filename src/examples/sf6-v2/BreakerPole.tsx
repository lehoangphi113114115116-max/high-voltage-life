import {useCurrentFrame, useVideoConfig} from 'remotion';
import {MaterialSurface} from '../../illustration/material';

/** React extraction of the pole(x,index) object in breakerSvg.mjs, stylized only. */
export const BreakerPole = ({x,index=0}: {x:number;index?:number}) => {
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
  return <g transform={`translate(${x} 0)`}>
    <ellipse cy="876" rx="105" ry="24" fill="#112438" opacity=".25"/>
    <MaterialSurface x={-72} y={675} width={144} height={174}/>
    <rect x="-59" y="691" width="118" height="125" rx="11" fill="#a7c4cf" stroke="#587a8f" strokeWidth="2"/>
    <MaterialSurface x={-23} y={355} width={46} height={320} material="porcelain" radius={16}/>
    {Array.from({length:13},(_,j)=><ellipse key={j} cy={370+j*22} rx={j%2?58:66} ry="14" fill={j%2?'#d7e7e8':'#f5ffff'} stroke="#92afbd" strokeWidth="2"/>)}
    <rect x="-14" y="322" width="28" height="33" rx="4" fill="#668998"/>
    <ellipse cy="320" rx="31" ry="9" fill="#edc56d" stroke="#9c8258" strokeWidth="3"/>
    <rect x="-8" y="293" width="16" height="30" rx="3" fill="#b9d3d9"/>
    <circle cy="320" r="12" fill="#ffd452" opacity={.4+.25*Math.sin(t*2+index)}/>
  </g>;
};
