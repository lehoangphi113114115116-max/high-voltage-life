import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ReactNode} from 'react';
import {Karaoke} from './AutonomousExplainer';
import {Grass, Landscape, Rotor, Turbine} from './WindPowerPreview';
import {Cloud, EnergyWire, GridTower, House, MaterialSurface, ParallaxLayer, SceneReveal, Transformer, Tree, loopPhase, motionProgress} from '../illustration';
import {WindDrivetrain} from '../illustration/wind-drivetrain';

const ink = '#173e51';
const teal = '#47a6ad';
const sun = '#f7c556';
const orange = '#e88a56';

type Word = {text: string; startMs: number; endMs: number};
type Shot = {start: number; end: number; cues: number[]};
export type Wind100Props = {audio?: string; shots?: Shot[]; karaoke?: Word[]};
const boundaries = [0,10,23,38,53,65,78,90,100];
const visualShots = boundaries.slice(0,-1).map((start,i) => ({start,end:boundaries[i+1],cues:[]}));

const Canvas = ({children, background = 'linear-gradient(155deg,#8ccde8,#e8f6df 72%,#aed1ab)'}: {children:ReactNode; background?:string}) =>
  <AbsoluteFill style={{background}}><svg width="1080" height="1920" viewBox="0 0 1080 1920">{children}</svg></AbsoluteFill>;

const Label = ({x,y,children,small=false,opacity=1}: {x:number;y:number;children:ReactNode;small?:boolean;opacity?:number}) =>
  <text x={x} y={y} fill={ink} stroke="#ecf8ec" strokeWidth={small?2.5:3.5} paintOrder="stroke" fontFamily="Arial, sans-serif" fontWeight={750}
    opacity={opacity} fontSize={small?30:44} textAnchor="middle" dominantBaseline="middle">{children}</text>;

const Hills = ({t}: {t:number}) => <>
  <ParallaxLayer cameraX={t*9} depth={.22}><circle cx="930" cy="420" r="94" fill="#fff1be" opacity=".75"/>
    <Cloud x={180} y={525} scale={1.35}/><Cloud x={790} y={650} scale={1.1}/>
    <path d="M -120 1220 Q 128 813 388 1108 Q 748 783 1250 1110 V 1920 H -120Z" fill="#9dc5ae"/>
  </ParallaxLayer>
  <path d="M 0 1340 Q 570 1020 1080 1280 V 1920 H 0Z" fill="#86b786"/>
  <path d="M 0 1510 Q 640 1270 1080 1425 V 1920 H 0Z" fill="#619f79"/>
</>;

const Airflow = ({t,cues}: {t:number;cues:number[]}) => {
  const close = motionProgress(t, 1, 8);
  const force = motionProgress(t,cues[1]??4,(cues[1]??4)+1);
  const torque = motionProgress(t,cues[2]??8,(cues[2]??8)+.8);
  const angle = 22+t*59;
  const streams = [785,840,892,974,1044,1103];
  return <Canvas>
    <Hills t={t}/>
    <g opacity={.9-.65*close} transform={`translate(${718+160*close} 970) scale(${1.5+.4*close})`}><Rotor angle={angle}/></g>
    <g transform={`translate(${-73+104*close} ${-20+35*close})`}>
      {streams.map((y, i) => {
        const bend = y<970 ? -90 : 38;
        const d = `M -120 ${y} Q 215 ${y} 378 ${y+bend} T 1050 ${y}`;
        return <g key={y}>
          <path d={d} fill="none" stroke={i%2?'#e5ffff':'#4caebd'} strokeWidth={i%2?8:4} opacity=".48"/>
          <path d={d} fill="none" stroke={i%2?'#fff':'#1e8aab'} strokeWidth="7" strokeDasharray="27 108" strokeDashoffset={-t*(98+i*11)} opacity=".82"/>
        </g>;
      })}
      <path d="M 258 950 C 358 801 547 831 800 954 C 600 936 383 1036 258 950Z" fill="#edf7e8" stroke="#467b93" strokeWidth="6"/>
      <path d="M 263 950 C 415 963 582 940 798 954" fill="none" stroke="#9abdbb" strokeWidth="3"/>
      <g opacity={force}>
        <path d="M 497 920 V 684" stroke="#146b85" strokeWidth="12" strokeLinecap="round"/>
        <path d="M 475 715 L 497 680 L 519 715" fill="none" stroke="#146b85" strokeWidth="11" strokeLinejoin="round"/>
        <Label x={498} y={635}>Lực nâng</Label>
      </g>
    </g>
    <g opacity={torque} transform="translate(790 1310)">
      <circle r="124" fill="#ecf3df" opacity=".8"/>
      <g transform="scale(.38)"><Rotor angle={angle}/></g>
      <path d="M -95 47 A 106 106 0 1 1 96 42" fill="none" stroke={orange} strokeWidth="10"/>
      <path d="M 81 17 L 93 49 L 121 27" fill="none" stroke={orange} strokeWidth="10" strokeLinejoin="round"/>
      <Label x={0} y={164} small>Mô-men quay</Label>
    </g>
    <Label x={540} y={1170} small>Tiết diện cánh · minh họa</Label>
    <Grass frame={t*30} y={1650}/>
  </Canvas>;
};

const NacelleLabels = ({t,cues}: {t:number;cues:number[]}) => {
  const go = motionProgress(t,(cues[2]??5)-.1,(cues[2]??5)+.8);
  const magnets = motionProgress(t,(cues[3]??8)-.1,(cues[3]??8)+.8);
  return <>
    <WindDrivetrain seconds={t}/>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
      <Label x={540} y={517}>Truyền động trực tiếp</Label>
      <Label x={540} y={573} small>Mặt cắt minh họa · không theo tỉ lệ</Label>
      <g opacity={go}><path d="M 340 969 L 250 1145 V 1234" stroke={ink} strokeWidth="3" fill="none"/><Label x={250} y={1271} small>Trục chính</Label></g>
      <g opacity={magnets}><path d="M 661 947 L 807 1098 V 1176" stroke={ink} strokeWidth="3" fill="none"/><Label x={807} y={1210} small>Máy phát</Label></g>
    </svg>
  </>;
};

const Induction = ({t,cues}: {t:number;cues:number[]}) => {
  const rotor = t*54;
  const graph = motionProgress(t,cues[2]??5,(cues[2]??5)+.8);
  const alpha = Math.PI*rotor/180*2;
  const wave = Array.from({length:105},(_,i)=>`${i?'L':'M'} ${287+i*4.9} ${1300-67*Math.sin(alpha+(i-104)*.11)}`).join(' ');
  return <Canvas background="radial-gradient(ellipse at 45% 50%,#f4f9e6,#9ccfd1 76%,#81b7d5)">
    <g transform={`translate(${540-82*graph} 900) scale(${1-.13*graph})`}>
      <circle r="296" fill="#508499" opacity=".19" transform="translate(16 21)"/>
      <circle r="277" fill="#c2ded6" stroke="#759ea8" strokeWidth="7"/>
      <g transform={`rotate(${rotor})`}>
        <circle r="257" fill="none" stroke="#547f9a" strokeWidth="40"/>
        {[0,90,180,270].map((a,i)=><g key={a} transform={`rotate(${a})`}>
          <rect x="-49" y="-248" width="98" height="50" rx="12" fill={i%2?'#357caf':'#dc6947'}/>
          <text y="-216" fill="#fff" textAnchor="middle" fontFamily="Arial" fontSize="26" fontWeight="800">{i%2?'S':'N'}</text>
        </g>)}
        <path d="M 0 -195 Q -112 0 0 195 M 0 -195 Q 112 0 0 195" fill="none" stroke={teal} strokeWidth="5" strokeDasharray="10 11" opacity=".60"/>
      </g>
      <circle r="154" fill="#28566d" stroke="#577f91" strokeWidth="9"/>
      {Array.from({length:8},(_,i)=><g key={i} transform={`rotate(${i*45})`}>
        <rect x="-36" y="-190" width="72" height="58" rx="12" fill="#a95633"/>
        {[0,1,2,3,4].map(j=><rect key={j} x={-31+j*12} y="-195" width="9" height="64" rx="4" fill={i===2?'#ffcf69':'#df884a'}/>)}
      </g>)}
      <circle r="35" fill="#b7d5d7"/><circle r="17" fill="#466e85"/>
    </g>
    <Label x={540} y={494}>Cảm ứng điện từ</Label>
    <path d="M 705 881 H 801 L 871 836" fill="none" stroke={ink} strokeWidth="3"/>
    <Label x={884} y={797} small>Cuộn dây tĩnh</Label>
    <g opacity={graph}>
      <rect x="248" y="1201" width="581" height="207" rx="28" fill="#173e51"/>
      <path d="M 281 1300 H 805" stroke="#7095a4" strokeWidth="2"/>
      <path d={wave} fill="none" stroke="#89f4da" strokeWidth="7" strokeLinecap="round"/>
      <circle cx={287+104*4.9} cy={1300-67*Math.sin(alpha)} r="8" fill={sun}/>
      <Label x={540} y={1460} small>Điện áp cảm ứng · minh họa</Label>
    </g>
  </Canvas>;
};

const Converter = ({x,y,t}: {x:number;y:number;t:number}) => <g transform={`translate(${x} ${y})`}>
  <MaterialSurface x={-91} y={-62} width={182} height={124} radius={19}/>
  <rect x="-70" y="-36" width="140" height="65" rx="9" fill="#204b60"/>
  <path d="M -56 -1 q 12 -26 25 0 t 25 0 t 25 0 t 25 0" fill="none" stroke="#92f2d5" strokeWidth="5" strokeDasharray="18 5" strokeDashoffset={-t*25}/>
  <circle cx="62" cy="46" r="6" fill={sun}/>
</g>;

const MiniTransformer = ({x,y,label='',scale=1}: {x:number;y:number;label?:string;scale?:number}) =>
  <g transform={`translate(${x} ${y}) scale(${scale}) translate(0 -735)`}><Transformer x={0} label={label}/></g>;
const Pylon = ({x,y,scale=1}: {x:number;y:number;scale?:number}) =>
  <g transform={`translate(${x} ${y}) scale(${scale}) translate(0 -515)`}><GridTower x={0}/></g>;

const Collector = ({t,cues}: {t:number;cues:number[]}) => {
  const move = motionProgress(t,1,11);
  const collect = (cues[3]??8.1)-.5;
  return <Canvas><Hills t={t}/>
    <Label x={540} y={489}>Thu gom công suất</Label>
    <g transform={`translate(${22-45*move} 0)`}>
      {[{x:230,y:788},{x:500,y:773},{x:805,y:750}].map(({x,y},i)=><g key={x}>
        <Turbine x={x} y={y} scale={.7-i*.07} angle={t*(55-i*4)+i*59}/>
        <EnergyWire x1={x} y1={y+288-i*26} x2={x} y2={1119} sag={0}/>
        <Converter x={x} y={1134} t={t+i}/>
        <EnergyWire x1={x} y1={1193} x2={x} y2={1261} sag={0} energized={t>(cues[1]??3)}/>
        <MiniTransformer x={x} y={1290} scale={.49}/>
        <EnergyWire x1={x} y1={1325} x2={x} y2={1412} sag={0} energized={t>collect}/>
      </g>)}
      <EnergyWire x1={230} y1={1412} x2={500} y2={1412} sag={0} energized={t>collect}/>
      <EnergyWire x1={500} y1={1412} x2={805} y2={1412} sag={0} energized={t>collect}/>
      <EnergyWire x1={805} y1={1412} x2={1018} y2={1412} sag={0} energized={t>collect}/>
      {[230,500,805].map(x=><circle key={x} cx={x} cy="1412" r="8" fill={ink}/>)}
    </g>
    <Label x={540} y={1511} small>Cáp thu gom trung áp</Label>
    <Label x={756} y={1040} small opacity={motionProgress(t,cues[1]??3,(cues[1]??3)+1)}>Bộ biến đổi</Label>
    <Label x={769} y={1358} small opacity={motionProgress(t,cues[2]??6,(cues[2]??6)+1)}>MBA tua-bin</Label>
  </Canvas>;
};

const Substation = ({t,cues}: {t:number;cues:number[]}) => {
  const compare = motionProgress(t,cues[1]??4,(cues[1]??4)+1);
  const heat = motionProgress(t,cues[2]??9,(cues[2]??9)+1);
  return <Canvas><Hills t={t}/>
    <Label x={540} y={474}>Trạm nâng áp</Label>
    <g transform={`translate(${38-70*motionProgress(t,0,12)} 0)`}>
      <path d="M 191 1233 L 363 1050 H 864 L 973 1200 L 808 1295 H 251 Z" fill="#cee1be" stroke="#6e9491" strokeWidth="5"/>
      <path d="M 240 1245 H 880 L 930 1208 M 260 1220 V 1267 M 367 1220 V 1267 M 493 1220 V 1267 M 617 1220 V 1267 M 742 1220 V 1267 M 871 1220 V 1267" stroke="#80a3a0" strokeWidth="5"/>
      <EnergyWire x1={22} y1={1105} x2={433} y2={790} sag={28}/>
      <MiniTransformer x={529} y={1044} scale={1.75}/>
      <Pylon x={951} y={697} scale={1.1}/>
      <EnergyWire x1={590} y1={790} x2={950} y2={688} sag={31}/>
      <EnergyWire x1={950} y1={688} x2={1120} y2={627} sag={25}/>
      <Label x={156} y={1154} small>Thu gom</Label><Label x={865} y={622} small>Đấu nối</Label>
    </g>
    <g opacity={compare}>
      <rect x="163" y="1315" width="754" height="231" rx="28" fill="#d9eede" stroke="#8eb1a3" strokeWidth="3"/>
      <Label x={374} y={1374} small>CÙNG CÔNG SUẤT</Label>
      <path d="M 280 1465 H 811" stroke="#60858d" strokeWidth="10" strokeLinecap="round"/>
      {[0,1,2,3].map(i=><circle key={i} cx={280+531*loopPhase(t,2,i/4)} cy={1465} r={11-heat*5} fill="#d29b3b"/>)}
      <Label x={651} y={1374} small>Áp tăng · dòng giảm</Label>
    </g>
  </Canvas>;
};

const Topology = ({t,cues}: {t:number;cues:number[]}) => {
  const travel = motionProgress(t,.2,10);
  const flow = motionProgress(t,cues[2]??7,(cues[2]??7)+1);
  return <Canvas><Hills t={t}/>
    <Label x={540} y={429}>Từ nhà máy đến phụ tải</Label>
    <g transform={`translate(${24-42*travel} ${31-60*travel})`}>
      <EnergyWire x1={218} y1={825} x2={531} y2={775} sag={19}/>
      <EnergyWire x1={585} y1={743} x2={863} y2={712} sag={38}/>
      <EnergyWire x1={890} y1={743} x2={770} y2={1022} sag={35}/>
      <EnergyWire x1={720} y1={1088} x2={460} y2={1170} sag={24}/>
      <EnergyWire x1={412} y1={1170} x2={204} y2={1360} sag={22}/>
      <path d="M 854 730 L 1056 990 M 460 1187 L 753 1423" fill="none" stroke="#6b988d" strokeWidth="5" strokeDasharray="11 12" opacity={flow*.8}/>
      <Turbine x={190} y={695} scale={.5} angle={t*59}/>
      <MiniTransformer x={550} y={779} scale={.65}/>
      <Pylon x={871} y={719} scale={.58}/>
      <MiniTransformer x={740} y={1071} scale={.63}/>
      <Pylon x={425} y={1195} scale={.34}/>
      <g transform="translate(196 1384) scale(.46) translate(0 -680)"><House x={0} active={.8}/></g>
      <Label x={203} y={966} small>Nhà máy gió</Label><Label x={537} y={872} small>Nâng áp</Label>
      <Label x={888} y={941} small>Truyền tải</Label><Label x={744} y={1174} small>Hạ áp</Label>
      <Label x={440} y={1334} small>Phân phối</Label><Label x={204} y={1495} small>Phụ tải</Label>
    </g>
    <Label x={670} y={1534} small>Sơ đồ nguyên lý</Label>
  </Canvas>;
};

const Ending = ({t,frame}: {t:number;frame:number}) => {
  const zoom = 1.19-.24*motionProgress(t,.5,8);
  const lit = motionProgress(t,0,1.8);
  return <Canvas background="linear-gradient(157deg,#79abd7,#f6e7bb 72%,#d0d9a7)">
    <Hills t={t}/>
    <ParallaxLayer depth={.55} cameraX={t*11}>
      <Turbine x={140} y={826} scale={.6} angle={t*56}/>
      <Turbine x={370} y={883} scale={.43} angle={t*44+44}/>
      <Turbine x={1054} y={747} scale={.45} angle={t*51+97}/>
      <Pylon x={615} y={810} scale={.45}/>
      <MiniTransformer x={470} y={1075} scale={.42}/>
      <EnergyWire x1={382} y1={1012} x2={445} y2={1080} sag={12}/>
      <EnergyWire x1={485} y1={1030} x2={614} y2={808} sag={30}/>
      <MiniTransformer x={752} y={1020} scale={.42}/>
      <EnergyWire x1={614} y1={808} x2={722} y2={982} sag={33}/>
      <EnergyWire x1={766} y1={1020} x2={892} y2={1110} sag={20}/>
    </ParallaxLayer>
    <g transform={`translate(540 1200) scale(${zoom}) translate(-540 -1200)`}>
      <ellipse cx="570" cy="1366" rx="510" ry="90" fill="#416b62" opacity=".23"/>
      <g transform="translate(358 765) scale(.74)"><House x={0} active={lit}/><House x={-304} active={lit*.75}/></g>
      <path d="M 651 1355 V 1125 L 751 1072 V 1125 L 851 1072 V 1125 L 953 1084 V 1355Z" fill="#edd2a3" stroke="#986f58" strokeWidth="5"/>
      <path d="M 651 1125 L 751 1072 V 1125 L 851 1072 V 1125 L 953 1084" fill="none" stroke="#ce845f" strokeWidth="14" strokeLinejoin="round"/>
      {[706,791,876].map((x,i)=><g key={x}>
        <rect x={x-25} y="1178" width="52" height="79" rx="6" fill="#304e5d"/>
        <rect x={x-20} y="1183" width="42" height="69" rx="4" fill="#ffe395" opacity={lit}/>
        <g opacity={lit} transform={`translate(${x+1} 1217) rotate(${t*(65+i*13)})`}>
          <path d="M 0 -15 L 6 0 L 0 15 L -6 0Z M -14 0 L 0 -6 L 14 0 L 0 6 Z" fill="#bc8658"/>
        </g>
      </g>)}
    </g>
    <ParallaxLayer depth={1.3} cameraX={t*8}><Tree x={1032} y={1464}/><Tree x={54} y={1408}/><Grass frame={frame} y={1608}/></ParallaxLayer>
    <Label x={540} y={1496} small opacity={motionProgress(t,6,6.75)}>Gió → quay → điện → phụ tải</Label>
  </Canvas>;
};

const Scene = ({index,t,frame,cues}: {index:number;t:number;frame:number;cues:number[]}) => {
  if (index===0) return <AbsoluteFill style={{background:'linear-gradient(165deg,#78c5ec,#f0f9e4 80%)'}}>
    <Landscape frame={frame} seconds={t*.77}/>
    <div style={{position:'absolute',top:225,left:90,right:90,color:ink,font:'800 66px Arial',opacity:1-motionProgress(t,4.5,5.5)}}>Vì sao gió<br/>tạo ra điện?</div>
  </AbsoluteFill>;
  if (index===1) return <Airflow t={t} cues={cues}/>;
  if (index===2) return <NacelleLabels t={t} cues={cues}/>;
  if (index===3) return <Induction t={t} cues={cues}/>;
  if (index===4) return <Collector t={t} cues={cues}/>;
  if (index===5) return <Substation t={t} cues={cues}/>;
  if (index===6) return <Topology t={t} cues={cues}/>;
  return <Ending t={t} frame={frame}/>;
};

export const Wind100 = ({audio, shots = visualShots, karaoke = []}: Wind100Props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame/fps;
  const half = .28;
  const active = karaoke.some(word=>word.startMs<=t*1000 && word.endMs>t*1000);
  return <AbsoluteFill style={{background:'#a6d6d8',overflow:'hidden'}}>
    {audio && <Audio src={staticFile(audio)}/>}
    {shots.map(({start,end,cues},index)=>{
      if (t<start-half || t>=end+half) return null;
      const artwork = <Scene index={index} t={Math.max(0,t-start)} frame={frame} cues={cues.map(cue=>cue-start)}/>;
      return index===0 ? <AbsoluteFill key={start}>{artwork}</AbsoluteFill>
        : <SceneReveal key={start} boundarySeconds={start} durationSeconds={half*2} kind={index===2 || index===3?'dissolve':'wipe'}>{artwork}</SceneReveal>;
    })}
    {active && <Karaoke words={karaoke}/>}
    <div style={{position:'absolute',top:99,left:88,background:ink,color:'#edfffe',padding:'12px 17px',borderRadius:9,font:'800 24px Arial',letterSpacing:2}}>HIGH VOLTAGE LIFE</div>
  </AbsoluteFill>;
};
