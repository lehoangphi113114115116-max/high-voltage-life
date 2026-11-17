import {useId} from 'react';
import {illustrationTokens as tokens} from './tokens';

/** Unique IDs allow multiple SVG material instances within the same frame. */
export const MaterialSurface = ({x,y,width,height,material='steel',radius=10}: {
  x:number;y:number;width:number;height:number;material?:keyof typeof tokens.ramps;radius?:number;
}) => {
  const id=`material-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
  const ramp=tokens.ramps[material];
  return <g>
    <defs>
      <linearGradient id={id}><stop stopColor={ramp[0]}/><stop offset=".46" stopColor={ramp[1]}/><stop offset="1" stopColor={ramp[2]}/></linearGradient>
      <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="9" stdDeviation="10" floodColor="#07304c" floodOpacity=".25"/></filter>
    </defs>
    <rect x={x} y={y} width={width} height={height} rx={radius} fill={`url(#${id})`} stroke={ramp[2]} strokeWidth={tokens.stroke.outline} filter={`url(#${id}-shadow)`}/>
    <path d={`M ${x+radius} ${y+7} H ${x+width-radius}`} stroke={ramp[1]} strokeWidth="2" opacity=".6"/>
  </g>;
};
