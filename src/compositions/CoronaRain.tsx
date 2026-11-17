import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Cloud,EnergyWire,GridTower,Tree,ParallaxLayer,motionProgress,MaterialSurface} from '../illustration';
import {Rain,FieldLines,CoronaGlow,WaterDrop,PressureWaves} from '../components/CoronaWeather';
import {Karaoke} from './AutonomousExplainer';
import {FootageLayer,type FootagePlan} from '../footage/FootageLayer';
import data from '../generated/corona-rain.json';

const Landscape = ({wet=1,safety=false}: {wet?:number;safety?:boolean}) => {
  const f=useCurrentFrame();
  return <>
    <ParallaxLayer cameraX={f*.22} depth={.1}><Cloud x={170} y={460} scale={1.5}/><Cloud x={780} y={490} scale={1.7}/></ParallaxLayer>
    <g opacity={wet*.35}><rect width="1080" height="1920" fill="#4d6685"/></g>
    <ParallaxLayer cameraX={Math.sin(f/120)*35} depth={.3}>
      <path d="M -100 1310 Q 300 1000 650 1260 Q 950 1020 1300 1260 V 1650 H -100 Z" fill="#74a786"/>
      <g transform="translate(0 290)"><GridTower x={130}/><GridTower x={950}/></g>
      {[760,850,940].map((y,i)=><g key={y}><EnergyWire x1={50} y1={y} x2={1030} y2={y} sag={65} energized/>
        {wet>.1&&[.27,.54,.78].map((p,j)=>{
          const cy=y+2*p*(1-p)*65;
          return <g key={p}><WaterDrop x={50+p*980} y={cy+3} size={.09}/><CoronaGlow x={50+p*980} y={cy+11} strength={wet*.8} scale={.7}/></g>;
        })}
      </g>)}
    </ParallaxLayer>
    <path d="M 0 1400 Q 400 1320 1080 1410 V 1920 H 0 Z" fill="#4c945c"/>
    <ParallaxLayer cameraX={Math.sin(f/100)*30} depth={.7}><Tree x={70} y={1470}/><Tree x={1020} y={1490}/></ParallaxLayer>
    <Rain strength={wet}/>
    {safety&&<g><path d="M 200 1500 L 880 1500" stroke="#f5c55a" strokeWidth="6" strokeDasharray="14 18"/><text x="540" y="1552" textAnchor="middle" fill="#fff4c8" fontSize="30" fontWeight="800">GIỮ KHOẢNG CÁCH AN TOÀN</text></g>}
  </>;
};
const Macro = ({mode}: {mode:string}) => {
  const f=useCurrentFrame();
  return <g transform={`translate(${Math.sin(f/130)*9} 0)`}>
    <g opacity=".25"><Cloud x={100} y={710}/><Cloud x={900} y={1260}/></g>
    <MaterialSurface x={100} y={840} width={880} height={120} radius={50}/>
    <EnergyWire x1={110} y1={900} x2={970} y2={900} sag={0}/>
    <WaterDrop x={540} y={960} size={1.15}/>
    {mode==='field'&&<><FieldLines x={290} y={900} radius={90}/><FieldLines x={790} y={900} radius={90}/></>}
    {['droplet','ion','sound','contrast'].includes(mode)&&<FieldLines x={540} y={1075} radius={32} intensity={mode==='droplet'?1:.35}/>}
    {['ion','sound','contrast'].includes(mode)&&<CoronaGlow x={540} y={1080} scale={2.2} strength={.8}/>}
    {mode==='ion'&&Array.from({length:14},(_,i)=>{
      const phase=((f*.012+i*.137)%1),a=i*2.399;
      return <circle key={i} cx={540+Math.cos(a)*(38+phase*80)} cy={1080+Math.sin(a)*(22+phase*55)} r={i%3===0?5:3} fill={i%2?'#b895e5':'#e0efff'} opacity={Math.sin(phase*Math.PI)*.8}/>;
    })}
    {mode==='sound'&&<><PressureWaves x={540} y={1080}/><text x="540" y="1450" fontSize="34" textAnchor="middle" fill="#735c34">XUNG ÁP SUẤT → SÓNG ÂM</text></>}
    {mode==='contrast'&&<><rect x="190" y="1385" width="700" height="80" rx="18" fill="#eff6ef"/><text x="540" y="1438" textAnchor="middle" fontSize="32" fontWeight="800" fill="#294557">CỤC BỘ · KHÔNG BẮC CẦU HAI PHA</text></>}
    <text x="540" y="740" fontSize="30" textAnchor="middle" fill="#294557">{mode==='field'?'ĐIỆN TRƯỜNG':mode==='droplet'?'TẬP TRUNG Ở ĐẦU GIỌT NƯỚC':'VÙNG KHÔNG KHÍ SÁT DÂY'}</text>
    <text x="540" y="1530" fontSize="22" textAnchor="middle" fill="#587080">Phóng đại minh họa · Ánh sáng corona được tăng để dễ quan sát</text>
  </g>;
};
const Bundle = () => <>
  <text x="540" y="700" textAnchor="middle" fontSize="32" fill="#294557">GIẢM TẬP TRUNG ĐIỆN TRƯỜNG</text>
  <FieldLines x={270} y={1030} radius={75}/><circle cx="270" cy="1030" r="54" fill="#93a7ad" stroke="#e1eded" strokeWidth="8"/>
  <FieldLines x={770} y={1030} radius={145} intensity={.55}/>
  {[-1,1].flatMap(x=>[-1,1].map(y=><circle key={`${x}-${y}`} cx={770+x*60} cy={1030+y*60} r="27" fill="#93a7ad" stroke="#e1eded" strokeWidth="5"/>))}
  <text x="270" y="1260" textAnchor="middle" fontSize="28" fill="#294557">DÂY ĐƠN</text><text x="770" y="1260" textAnchor="middle" fontSize="28" fill="#294557">BÓ DÂY PHÂN PHA</text>
  <text x="540" y="1440" textAnchor="middle" fontSize="22" fill="#587080">Sơ đồ định tính · Không theo tỷ lệ điện trường thực</text>
</>;
const Scene = ({scene,index}: {scene:typeof data.scenes[number];index:number}) => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=index===0?1:motionProgress(f,scene.startFrame-12,scene.startFrame+12);
  const exit=index===data.scenes.length-1?1:1-motionProgress(f,scene.endFrame-12,scene.endFrame+12);
  const wet=scene.mode==='rain'?motionProgress(f,scene.startFrame,scene.startFrame+3*fps):1;
  return <AbsoluteFill style={{opacity:index%2?enter*exit:exit,clipPath:index%2===0&&index>0?`inset(0 ${(1-enter)*100}% 0 0)`:undefined,background:'linear-gradient(#8bc9e5,#e3f1ed)',overflow:'hidden'}}>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920">
      {['rain','safety'].includes(scene.mode)?<Landscape wet={wet} safety={scene.mode==='safety'}/>:scene.mode==='bundle'?<Bundle/>:<Macro mode={scene.mode}/>}
    </svg>
    <div style={{position:'absolute',top:165,left:70,right:70,fontSize:50,lineHeight:1.14,fontWeight:900,color:'#173c51'}}>{scene.title}</div>
    <div style={{position:'absolute',top:310,left:70,fontSize:23,letterSpacing:2,color:'#476b7a'}}>{String(index+1).padStart(2,'0')} / {String(data.scenes.length).padStart(2,'0')}</div>
  </AbsoluteFill>;
};
export const CoronaRain = () => {
  const f=useCurrentFrame();
  return <AbsoluteFill style={{fontFamily:'Arial, sans-serif',background:'#9acbe0',overflow:'hidden'}}>
    <Audio src={staticFile(data.audioPath)}/>
    {data.scenes.map((s,i)=>f>=s.startFrame-15&&f<=s.endFrame+15?<Scene key={s.id} scene={s} index={i}/>:null)}
    <div style={{position:'absolute',left:70,top:70,padding:'12px 18px',borderRadius:8,background:'#0a1626',color:'#f5b921',fontSize:23,fontWeight:800,letterSpacing:2}}>HIGH VOLTAGE LIFE</div>
    <FootageLayer plan={data.footage as unknown as FootagePlan}/>
    <Karaoke words={data.karaoke}/>
  </AbsoluteFill>;
};
