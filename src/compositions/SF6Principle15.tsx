import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BreakerPole} from '../examples/sf6-v2/BreakerPole';
import {Cloud, MaterialSurface, EnergyWire, Arc, motionProgress, illustrationTokens as tokens} from '../illustration';
import {Karaoke} from './AutonomousExplainer';
import data from '../generated/sf6-principle.json';

export const SF6Principle15 = () => {
  const f=useCurrentFrame();const {fps}=useVideoConfig();
  const openingAt=data.scenes[1].startFrame;
  const gasAt=data.scenes[2].startFrame;
  const zeroAt=Math.round((data.karaoke.find(word=>word.text==='tắt;')?.startMs??10000)*fps/1000);
  const opening=motionProgress(f,openingAt,openingAt+fps);
  const gap=opening*150;
  const arc=f>openingAt+4 && f<zeroAt;
  const current=f<zeroAt;
  const gas=f>=gasAt&&f<zeroAt+12;
  const stage=f<openingAt?0:f<gasAt?1:f<zeroAt?2:3;
  const zoom=1+motionProgress(f,openingAt,zeroAt)*.025;
  return <AbsoluteFill style={{background:'#e9f2ee',fontFamily:tokens.font,overflow:'hidden'}}>
    <Audio src={staticFile('generated/sf6-principle/voice.wav')}/>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920">
      <defs><linearGradient id="sf6Sky" x2="0" y2="1"><stop stopColor="#76bfe1"/><stop offset="1" stopColor="#f4ead0"/></linearGradient></defs>
      <rect width="1080" height="1000" fill="url(#sf6Sky)"/>
      <Cloud x={150} y={300}/><Cloud x={780} y={260} scale={.8}/>
      <circle cx="900" cy="325" r="65" fill="#ffdf93" opacity=".8"/>
      <path d="M 0 870 Q 300 760 600 850 T 1080 810 V 1000 H 0 Z" fill="#73a98a"/>
      <path d="M 0 930 Q 350 835 700 910 T 1080 870 V 1030 H 0 Z" fill="#418d74"/>
      <rect y="940" width="1080" height="85" fill="#c5c6af"/>
      {/* Three stylized poles; phase conductors remain separate. */}
      {[250,540,830].map((x,i)=><g key={x}>
        <BreakerPole x={x} index={i}/>
        <EnergyWire x1={x-115} y1={240} x2={x} y2={293} sag={10} energized={current}/>
      </g>)}
      <MaterialSurface x={130} y={860} width={820} height={58}/>
      <rect y="1000" width="1080" height="920" fill="#102b40"/>
      <g transform={`translate(${540-zoom*540} ${1310-zoom*1310}) scale(${zoom})`}>
        <MaterialSurface x={75} y={1100} width={930} height={380} radius={35}/>
        <rect x="105" y="1130" width="870" height="320" rx="27" fill="#183c50"/>
        <rect x="150" y="1240" width="780" height="130" rx="60" fill="#355c69" stroke="#89acb5" strokeWidth="4"/>
        <g transform={`translate(${-gap} 0)`}><MaterialSurface x={160} y={1280} width={400} height={40} material="copper"/><rect x="540" y="1267" width="30" height="66" rx="6" fill="#fff0bf"/></g>
        <MaterialSurface x={570} y={1276} width={310} height={48} material="copper"/>
        <rect x="567" y="1268" width="25" height="65" rx="6" fill="#fff0bf"/>
        <Arc x1={570-gap} y1={1300} x2={570} y2={1300} active={arc}/>
        {gas && Array.from({length:14},(_,i)=>{const phase=((f-gasAt)/(fps*.9)+i/14)%1;return <circle key={i} cx={300+phase*460} cy={1235+Math.sin(phase*7+i)*38} r={3+phase*3} fill="#82e7e5" opacity={.6*(1-phase)}/>;})}
        <text x="540" y="1193" fontSize="30" textAnchor="middle" fill="#c6ebef">BUỒNG CẮT SF₆</text>
        {stage===3&&<text x="540" y="1420" textAnchor="middle" fill="#8eedd0" fontSize="35" fontWeight="800">i = 0 → HỒ QUANG TẮT</text>}
      </g>
      <text x="540" y="1555" textAnchor="middle" fill={stage===3?'#8eedd0':'#f5c86a'} fontSize="32" fontWeight="700">{['TIẾP ĐIỂM ĐÓNG','TIẾP ĐIỂM TÁCH RA','LÀM NGUỘI · KHỬ ION','PHỤC HỒI CÁCH ĐIỆN'][stage]}</text>
    </svg>
    <div style={{position:'absolute',top:65,left:65,padding:'13px 18px',borderRadius:9,background:'#102b40',fontSize:23,fontWeight:800,color:'#f5b921',letterSpacing:2}}>HIGH VOLTAGE LIFE</div>
    <div style={{position:'absolute',top:140,left:65,fontSize:60,fontWeight:900,color:'#15394d'}}>MÁY CẮT SF₆</div>
    <Karaoke words={data.karaoke}/>
    <div style={{position:'absolute',bottom:70,left:65,right:65,textAlign:'center',color:'#a5c9d5',fontSize:22}}>Minh họa nguyên lý · Chuyển động đã làm chậm</div>
  </AbsoluteFill>;
};
