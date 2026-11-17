import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Cloud, GridTower, House, PowerPlant, Transformer, Tree} from '../components/PowerJourneyObjects';
import {CurrentFlow} from '../components/technical';
import {Karaoke} from './AutonomousExplainer';
import data from '../generated/power-journey.json';

const smooth = (f:number,a:number,b:number) => interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.inOut(Easing.cubic)});
const Wire = ({x1,y1,x2,y2,sag=25}: {x1:number;y1:number;x2:number;y2:number;sag?:number}) => {
  const length=Math.hypot(x2-x1,y2-y1);
  const angle=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
  return <g transform={`translate(${x1} ${y1}) rotate(${angle})`}>
    <path d={`M 0 0 Q ${length/2} ${sag} ${length} 0`} fill="none" stroke="#4b6476" strokeWidth="7"/>
    <CurrentFlow x1={0} x2={length} y={0} controlY={sag} radius={4} count={Math.max(3,Math.round(length/70))} speed={.85} terminalPulse/>
  </g>;
};

export const PowerJourney = () => {
  const frame=useCurrentFrame();
  const a=data.scenes[1].startFrame;
  const b=data.scenes[2].startFrame;
  const travel=smooth(frame,a-14,a+14);
  const arrival=smooth(frame,b-14,b+14);
  const camera=travel*450+smooth(frame,a+30,b-14)*360+arrival*1080+frame*.035;
  const light=smooth(frame,b+90,b+120);
  const stage=frame>=b?2:frame>=a?1:0;
  return <AbsoluteFill style={{background:'linear-gradient(#7fc7ee 0%, #c3e8f6 65%, #e0edc4 100%)',fontFamily:'Arial, sans-serif',overflow:'hidden'}}>
    <Audio src={staticFile('generated/power-journey/voice.wav')}/>
    <svg width="1080" height="1540" viewBox="0 0 1080 1540" style={{position:'absolute',top:180}}>
      <circle cx="875" cy="170" r="73" fill="#ffe6a1"/>
      <g transform={`translate(${-camera*.1} 0)`}><Cloud x={140} y={200}/><Cloud x={700} y={310} scale={.8}/><Cloud x={1300} y={180} scale={1.2}/></g>
      <g transform={`translate(${-camera*.25} 0)`}><path d="M -100 1120 Q 170 750 450 1050 Q 750 670 1080 1080 Q 1350 760 1900 1050 L 2200 1540 L -100 1540 Z" fill="#8ab88b"/><path d="M -100 1180 Q 300 950 600 1160 Q 1050 850 1550 1160 Q 1900 900 2400 1200 L 2400 1540 L -100 1540 Z" fill="#6da477"/></g>
      <rect y="1160" width="1080" height="380" fill="#87bd69"/>
      <svg x="0" y="300" width="1080" height="1000" viewBox={`${camera} 0 1000 926`}>
        <path d="M -100 820 L 3100 820 L 3100 1000 L -100 1000 Z" fill="#94c778"/>
        <path d="M -100 835 L 3100 835" stroke="#e2ce9c" strokeWidth="25"/>
        <PowerPlant x={240}/><Transformer x={640} label="NÂNG ÁP"/>
        <GridTower x={1000}/><GridTower x={1450}/>
        <Transformer x={1910} label="HẠ ÁP"/>
        <House x={2520} active={light}/>
        <Wire x1={410} y1={665} x2={585} y2={590} sag={10}/>
        <Wire x1={675} y1={590} x2={920} y2={470}/>
        <Wire x1={920} y1={470} x2={1370} y2={470} sag={70}/>
        <Wire x1={1370} y1={470} x2={1855} y2={590} sag={35}/>
        <Wire x1={1945} y1={590} x2={2240} y2={650}/>
        <path d="M 2240 650 L 2240 820" stroke="#8c7051" strokeWidth="17"/>
        <Wire x1={2240} y1={650} x2={2354} y2={744} sag={8}/>
        <Tree x={50} y={825}/><Tree x={780} y={825}/><Tree x={1720} y={825}/><Tree x={2790} y={825}/>
      </svg>
      <g transform={`translate(${-camera*.45} 0)`}><ellipse cx="180" cy="1430" rx="320" ry="170" fill="#5a9b54"/><ellipse cx="1550" cy="1490" rx="460" ry="160" fill="#62a154"/></g>
    </svg>
    <div style={{position:'absolute',top:80,left:70,fontSize:24,fontWeight:800,letterSpacing:2,color:'#eaf6ff',background:'#0a1626',padding:'14px 20px',borderRadius:10}}>HIGH VOLTAGE LIFE</div>
    <div style={{position:'absolute',top:170,left:70,right:70,fontSize:55,fontWeight:900,color:'#173a50'}}>{['PHÁT ĐIỆN','TRUYỀN TẢI','ĐẾN NHÀ BẠN'][stage]}</div>
    <div style={{position:'absolute',left:70,right:70,top:278,display:'flex',gap:10}}>{[0,1,2].map(i=><div key={i} style={{height:7,flex:1,borderRadius:5,background:i<=stage?'#edb52c':'#ffffff88'}}/>)}</div>
    <Karaoke words={data.karaoke}/>
  </AbsoluteFill>;
};
