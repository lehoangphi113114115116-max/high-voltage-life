import {useId, type ReactNode} from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cloud, EnergyWire, GridTower, House, MaterialSurface, ParallaxLayer, SceneReveal, Transformer, Tree, loopPhase, motionProgress} from '../illustration';
import {Karaoke} from './AutonomousExplainer';
import media from '../generated/wind-preview.json';

const ink = '#153a4e';
const Rotor = ({angle}: {angle: number}) => {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return <g transform={`rotate(${angle})`}>
    <defs><linearGradient id={id}><stop stopColor="#9cbcca"/><stop offset=".55" stopColor="#f8ffff"/><stop offset="1" stopColor="#d2e8ec"/></linearGradient></defs>
    {[0,120,240].map(a => <g key={a} transform={`rotate(${a})`}>
      <path d="M -13 2 C -25 -70 -48 -150 -31 -232 Q -23 -278 -10 -292 C 1 -270 -4 -235 8 -187 Q 35 -68 15 4 Z" fill={`url(#${id})`} stroke="#769aaf" strokeWidth="3"/>
      <path d="M -13 -245 L -9 -276" stroke="#f17959" strokeWidth="9" strokeLinecap="round"/>
    </g>)}
    <circle r="29" fill="#e7f9f8" stroke="#83a8b5" strokeWidth="4"/><circle cx="-7" cy="-7" r="9" fill="#fff"/>
  </g>;
};

const Turbine = ({x,y,scale,angle}: {x:number;y:number;scale:number;angle:number}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <ellipse cx="46" cy="482" rx="145" ry="18" fill="#285841" opacity=".17"/>
  <path d="M -13 0 L 16 0 L 35 482 H -31 Z" fill="#f3fbf9" stroke="#82a8b7" strokeWidth="4"/>
  <path d="M 9 16 L 16 16 L 35 482 H 11 Z" fill="#b0cdd3"/>
  <MaterialSurface x={-20} y={-29} width={116} height={58} radius={19}/>
  <Rotor angle={angle}/>
</g>;

const Heading = ({children}: {children:ReactNode}) => <div style={{
  position:'absolute',left:88,right:88,top:205,
  fontFamily:'Arial, sans-serif',fontSize:59,fontWeight:850,lineHeight:1.06,
  letterSpacing:-1.5,color:ink,textWrap:'balance',
}}>{children}</div>;

const Grass = ({frame,y}: {frame:number;y:number}) => <g>
  {Array.from({length:29},(_,i)=>{
    const x=i*43-40;const h=30+(i*17)%78;const base=y+((i*53)%100)-50;
    const lean=22+Math.sin(frame*.13+i*.61)*15;
    return <g key={i} transform={`translate(${x} ${base})`}>
      <path d={`M 0 0 Q -12 ${-h*.55} ${lean} ${-h} M 0 0 Q 5 ${-h*.4} ${lean+19} ${-h*.63}`} fill="none" stroke={i%3?'#a9ce75':'#e1cb74'} strokeWidth={4+i%3} strokeLinecap="round"/>
      {i%5===0 && <circle cx={lean} cy={-h} r="6" fill="#f5bd65"/>}
    </g>;
  })}
</g>;

const Landscape = ({frame, seconds}: {frame:number;seconds:number}) => {
  const push=motionProgress(seconds,0,6.8);
  const approach=motionProgress(seconds,5.5,8);
  const mainX=520-235*approach;
  const zoom=1.13+.62*push-.78*approach;
  return <svg width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="wind-ridge" x2="0" y2="1"><stop stopColor="#a8c974"/><stop offset="1" stopColor="#679261"/></linearGradient>
    <linearGradient id="wind-meadow" x2="0" y2="1"><stop stopColor="#85b678"/><stop offset="1" stopColor="#285d53"/></linearGradient>
  </defs>
  <ParallaxLayer depth={.24} cameraX={frame*.33}>
    <circle cx="890" cy="480" r="125" fill="#fff6d3" opacity=".76"/>
    <Cloud x={210} y={690} scale={1.2}/><Cloud x={850} y={782} scale={1.12}/>
    <path d="M -180 1220 Q 125 1050 415 1190 Q 810 1000 1280 1230 V 1920 H -180 Z" fill="#a4caa2"/>
  </ParallaxLayer>
  <path d="M 0 1340 Q 400 1060 1080 1280 V 1920 H 0Z" fill="url(#wind-ridge)"/>
  <path d="M 0 1470 Q 530 1220 1080 1410 V 1920 H 0Z" fill="#639b67"/>
  <path d="M 0 1600 Q 510 1330 1080 1540 V 1920 H 0Z" fill="url(#wind-meadow)"/>
  <path d="M 0 1530 C 220 1460 551 1410 644 1303 C 710 1225 979 1238 1080 1288" fill="none" stroke="#cad2a0" strokeWidth="27" opacity=".65"/>
  <ParallaxLayer depth={.8} cameraX={frame*.38+push*70}>
    <Turbine x={744} y={875} scale={.47} angle={frame*1.25+38}/>
    <Turbine x={984} y={876} scale={.51} angle={frame*1.33+100}/>
    <Turbine x={880} y={982} scale={.73} angle={frame*1.35+48}/>
    <Turbine x={145} y={1030} scale={.72} angle={frame*1.5+80}/>
    <Tree x={45} y={1440}/><Tree x={1060} y={1450}/>
  </ParallaxLayer>
  <Turbine x={mainX} y={885+75*approach} scale={zoom} angle={frame*2.1+18}/>
  <ParallaxLayer depth={1.5} cameraX={frame*.26}><Grass frame={frame} y={1560}/><Grass frame={frame+12} y={1700}/></ParallaxLayer>
</svg>;
};

const FarmAndBladeShot = ({frame}: {frame:number}) => {
  const {fps}=useVideoConfig();
  const seconds=frame/fps;
  const wind=motionProgress(seconds,3.75,4.45);
  return <AbsoluteFill style={{background:'linear-gradient(165deg,#78c5ec,#f0f9e4 80%)'}}>
  <Landscape frame={frame} seconds={seconds}/>
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
    {Array.from({length:12},(_,i) => {
      const p=loopPhase(frame/fps,1.6,i*.17);
      const x=-130+p*1350; const y=590+i*68;
      return <g key={i} opacity={Math.sin(Math.PI*p)*.72*wind} stroke={i%2?'#faffff':'#c9f5f1'} fill="none" strokeWidth={i%2?6:4} strokeLinecap="round">
        <path d={`M ${x-120} ${y+22} q 60 -32 120 -22`}/><path d={`M ${x-20} ${y-12} l 20 12 -22 11`}/>
      </g>;
    })}
  </svg>
  <Heading>{seconds<4?'Điện gió được sản xuất như thế nào?':'Gió → rotor'}</Heading>
</AbsoluteFill>;
};

const CutawayShot = ({frame}: {frame:number}) => {
  const {fps}=useVideoConfig();
  const local=frame-7.4*fps;
  const pulse=.42+.4*Math.sin(local/7)**2;
  return <AbsoluteFill style={{background:'linear-gradient(145deg,#b9e7e8,#eef5dc 64%,#aed4bf)'}}>
    <Heading>Biến chuyển động<br/>thành điện</Heading>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
      <g transform={`translate(${74*(1-motionProgress(local,0,1.5*fps))} 0)`}>
        <path d="M 425 1100 H 585 L 631 1630 H 378 Z" fill="#d8e9e3" stroke="#91b4b5" strokeWidth="5"/>
        <path d="M 236 819 L 345 737 H 911 L 965 816 L 908 864 Z" fill="#f4fbf0" stroke="#a4c5c4" strokeWidth="5"/>
        <MaterialSurface x={225} y={819} width={718} height={328} radius={75}/>
        <rect x="255" y="853" width="635" height="249" rx="44" fill="#235365"/>
        <path d="M 215 977 H 644" stroke="#87b6c4" strokeWidth="41"/>
        <path d="M 228 972 H 660" stroke="#e8eef0" strokeWidth="10" strokeDasharray="18 27" strokeDashoffset={-frame*2.6}/>
        <path d="M 600 897 Q 729 863 841 908 V 1051 Q 721 1093 600 1056 Z" fill="#fcba71" stroke="#c8753d" strokeWidth="5"/>
        {[630,663,696,729,762,795].map(x=><path key={x} d={`M ${x} 899 Q ${x+25} 974 ${x} 1058`} stroke="#a34628" fill="none" strokeWidth="12"/>)}
        <circle cx="609" cy="976" r="82" fill="#3b7184" stroke="#e4f0dc" strokeWidth="10"/>
        <g transform={`rotate(${frame*2.1} 609 976)`} fill="#74cdd3">
          {[0,90,180,270].map(a=><rect key={a} transform={`rotate(${a} 609 976)`} x="590" y="921" width="38" height="43" rx="8"/>)}
        </g>
        <circle cx="609" cy="976" r="16" fill="#edf9ef"/>
        <g transform="translate(211 960) scale(.78 1.02)"><Rotor angle={frame*2.1+18}/></g>
        <g opacity={pulse}><EnergyWire x1={823} y1={1058} x2={820} y2={1504} sag={0}/></g>
        <path d="M 410 1000 V 1190 M 716 1070 V 1190" stroke="#456e78" strokeWidth="3"/>
        <g textAnchor="middle" fill={ink} fontFamily="Arial" fontWeight="750" fontSize="44"><text x="410" y="1245">Trục quay</text><text x="716" y="1245">Máy phát</text></g>
      </g>
      <text x="540" y="1550" textAnchor="middle" fill="#365b63" fontFamily="Arial" fontSize="32">Truyền động trực tiếp</text>
    </svg>
  </AbsoluteFill>;
};

const GridShot = ({frame}: {frame:number}) => {
  const {fps}=useVideoConfig();
  const age=frame-11.6*fps;
  const converted=motionProgress(age, .45*fps, 1.1*fps);
  const transformed=motionProgress(age, 1.35*fps, 2.15*fps);
  const lit=motionProgress(age, 3.05*fps, 3.8*fps);
  return <AbsoluteFill style={{background:'linear-gradient(145deg,#89cae8,#e9f3dc 70%)'}}>
    <Heading>Điện vào lưới</Heading>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
      <Cloud x={215} y={674}/><Cloud x={880} y={708} scale={.8}/>
      <path d="M 0 1040 Q 345 730 760 1020 Q 1010 870 1080 940 V 1920 H 0 Z" fill="#b7d2a2"/>
      <path d="M 0 1390 Q 570 960 1080 1260 V 1920 H 0 Z" fill="#86b681"/>
      <path d="M 0 1550 Q 430 1300 1080 1460 V 1920 H 0 Z" fill="#6da378"/>
      <ParallaxLayer depth={.6} cameraX={Math.max(age,0)*.23}>
        <path d="M 30 1420 Q 660 1310 1080 1460" stroke="#c6d2a7" strokeWidth="28" fill="none"/>
        <Turbine x={138} y={850} scale={.54} angle={frame*2.1+18}/>
        <g transform="translate(0 695)"><Transformer x={488} label=""/></g>
        <g transform="translate(200 765)"><GridTower x={525}/></g>
        <g transform="translate(682 1060) scale(.44)"><House x={280} active={lit}/><House x={660} active={lit}/></g>
        <MaterialSurface x={230} y={1130} width={153} height={133} radius={22}/>
        <rect x="247" y="1151" width="119" height="74" rx="11" fill="#184958"/>
        <path d="M 255 1189 Q 267 1160 279 1189 T 303 1189 T 327 1189 T 354 1189" stroke="#a0eee0" strokeWidth="4" fill="none" opacity={.2+.8*converted} strokeDasharray="12 5" strokeDashoffset={-frame*.85}/>
        <circle cx="342" cy="1244" r="6" fill="#f5b921" opacity={converted}/>
        <EnergyWire x1={138} y1={864} x2={138} y2={1110} sag={0}/>
        <EnergyWire x1={138} y1={1110} x2={230} y2={1188} sag={0}/>
        <EnergyWire x1={383} y1={1188} x2={433} y2={1285} sag={0} energized={converted>.4}/>
        <EnergyWire x1={523} y1={1285} x2={725} y2={1195} sag={23} energized={transformed>.4}/>
        <EnergyWire x1={725} y1={1195} x2={893} y2={1345} sag={20} energized={transformed>.4}/>
        <g fill={ink} textAnchor="middle" fontFamily="Arial" fontSize="32" fontWeight="750">
          <text x="310" y="1317">Bộ biến đổi</text><text x="504" y="1555">Máy biến áp</text>
        </g>
      </ParallaxLayer>
      <Tree x={39} y={1605}/><Tree x={1039} y={1570}/>
    </svg>
  </AbsoluteFill>;
};

export const WindPowerPreview = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const time=frame/fps;
  return <AbsoluteFill style={{overflow:'hidden',background:'#bae1de'}}>
    <Audio src={staticFile(media.audioPath)}/>
    {time<8.24 && <FarmAndBladeShot frame={frame}/>}
    {time>=7.76 && time<12.24 && <AbsoluteFill style={{clipPath:time<8.24?`circle(${motionProgress(time,7.76,8.24)*1950}px at 285px 960px)`:undefined}}><CutawayShot frame={frame}/></AbsoluteFill>}
    {time>=11.76 && <SceneReveal boundarySeconds={12} durationSeconds={.48} kind="wipe"><GridShot frame={frame}/></SceneReveal>}
    <Karaoke words={media.karaoke}/>
    <div style={{position:'absolute',top:99,left:88,background:'#153a4e',color:'#edfffe',padding:'12px 17px',borderRadius:9,font:'800 24px Arial',letterSpacing:2}}>HIGH VOLTAGE LIFE</div>
  </AbsoluteFill>;
};
