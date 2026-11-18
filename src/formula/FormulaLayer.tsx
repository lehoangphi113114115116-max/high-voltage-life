import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {motionProgress} from '../illustration/motion';
import {colors, technicalFont} from '../theme';
import catalog from './catalog.json';

type Formula = {
  id:keyof typeof catalog;startFrame:number;endFrame:number;
  cues:{frame:number;term:number}[];
};

const FormulaCard = ({formula}: {formula:Formula}) => {
  const frame=useCurrentFrame();
  const duration=formula.endFrame-formula.startFrame;
  const fade=Math.min(9,Math.floor(duration/3));
  const opacity=motionProgress(frame,0,fade)*(1-motionProgress(frame,duration-fade,duration));
  const current=formula.cues.filter(cue=>cue.frame<=frame+formula.startFrame).at(-1);
  const math=catalog[formula.id];
  const highlight=(term:number)=>current?.term===term?colors.yellow:colors.white;
  return <div title={math.scope} style={{position:'absolute',left:260,top:397,width:560,height:150,
    display:'grid',placeContent:'center',textAlign:'center',borderRadius:18,background:colors.navy,color:colors.white,
    border:`2px solid ${colors.technicalBlue}88`,boxShadow:'0 8px 26px #00000044',opacity,
    transform:`translateY(${(1-opacity)*9}px)`}}>
    <svg aria-label={`${math.left} = ${math.right.join('')}`} role="img" width="550" height="76" viewBox="0 0 550 76">
      <text x="275" y="59" textAnchor="middle" fontFamily="Cambria Math, Georgia, serif" fontSize="61" fontWeight="700" fill={colors.white}>
        <tspan fill={highlight(0)}>{math.left}</tspan>{' = '}
        {math.right.map((symbol,i)=><tspan key={i} fill={i===1?colors.white:highlight(i===0?1:2)}>{symbol}</tspan>)}
      </text>
    </svg>
    <div style={{font:`600 23px ${technicalFont}`,paddingBottom:8}}>{math.units}</div>
  </div>;
};

export const FormulaLayer = ({formulas}: {formulas?:Formula[]}) => <AbsoluteFill style={{pointerEvents:'none'}}>
  {formulas?.filter(formula=>Object.hasOwn(catalog,formula.id)&&formula.endFrame>formula.startFrame)
    .map(formula=><Sequence key={`${formula.id}-${formula.startFrame}`} from={formula.startFrame}
      durationInFrames={formula.endFrame-formula.startFrame}><FormulaCard formula={formula}/></Sequence>)}
</AbsoluteFill>;
