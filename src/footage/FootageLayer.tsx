import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, technicalFont} from '../theme';

export type FootageClip = {
  kind?:'image'|'video';id:string;startFrame:number;endFrame:number;src:string;trimBefore:number;
  layout:{mode?:string;side?:string;x:number;y:number;width:number;height:number};
  objectFit?:'cover'|'contain';objectPosition?:string;
  color?:{brightness:number;contrast:number;saturate:number};
  rights:{rightsVerified:boolean;creator:string;license:string;sourceUrl:string;licenseUrl:string};
};
export type FootagePlan = {clips:FootageClip[]};
const Inset = ({clip}: {clip:FootageClip}) => {
  const frame=useCurrentFrame();
  const duration=clip.endFrame-clip.startFrame;
  const fade=Math.max(1,Math.min(10,Math.floor(duration/3)));
  const opacity=duration<3?1:interpolate(frame,[0,fade,duration-fade,duration],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const tone=clip.color??{brightness:1,contrast:1,saturate:1};
  const mediaStyle = {width:'100%',height:'100%',objectFit:clip.objectFit??'contain',objectPosition:clip.objectPosition??'50% 50%',
    filter:`brightness(${tone.brightness}) contrast(${tone.contrast}) saturate(${tone.saturate})`} as const;
  return <div title={`${clip.rights.creator} · ${clip.rights.license} · ${clip.rights.sourceUrl}`} style={{position:'absolute',left:clip.layout.x,top:clip.layout.y,width:clip.layout.width,height:clip.layout.height,borderRadius:12,overflow:'hidden',border:`1px solid ${colors.technicalBlue}88`,boxShadow:'0 8px 26px #00000044',background:colors.navy,opacity,translate:`${(1-opacity)*(clip.layout.side==='left'?-16:16)}px 0px`}}>
    {clip.kind==='image' ? <Img src={staticFile(clip.src)} alt="" style={mediaStyle}/> :
      <OffthreadVideo src={staticFile(clip.src)} trimBefore={clip.trimBefore} muted style={mediaStyle}/>}
    <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'3px 6px',fontFamily:technicalFont,fontSize:14,lineHeight:1.2,color:'#fff',background:'#0a1626d9'}}>{clip.rights.creator} · {clip.rights.license}</div>
  </div>;
};
/** Import in any composition; scene planner owns safe layout and narration timing. */
export const FootageLayer = ({plan}: {plan?:FootagePlan}) => <AbsoluteFill style={{pointerEvents:'none'}}>
  {plan?.clips.filter(c=>c.rights.rightsVerified&&c.endFrame>c.startFrame).map(c=><Sequence key={`${c.id}-${c.startFrame}`} from={c.startFrame} durationInFrames={c.endFrame-c.startFrame}><Inset clip={c}/></Sequence>)}
</AbsoluteFill>;
