import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import currentVideo from '../generated/current-video.json';
import {Karaoke} from './AutonomousExplainer';
import {technicalFont} from '../theme';

const smooth = (frame: number, from: number, to: number) => interpolate(frame, [from, to], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp', easing:Easing.inOut(Easing.cubic)});

// Local time remains on the original audio timeline; transitions do not retime speech.
export const NaturalBirdDemo = () => {
  const frame = useCurrentFrame();
  const diagram = smooth(frame, 146, 170);
  const macro = smooth(frame, 277, 301);
  const draw = smooth(frame, 165, 205);
  const focus = smooth(frame, 289, 440);
  const endFade = 1 - smooth(frame, 440, 449);
  return <AbsoluteFill style={{background:'#acd8ee',overflow:'hidden',fontFamily:technicalFont}}>
    <Audio src={staticFile(currentVideo.audioPath)} trimAfter={432} volume={f => interpolate(f,[0,3,426,432],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/>
    <AbsoluteFill style={{opacity:endFade}}>
      <Img src={staticFile('art/bird-natural.png')} style={{width:1080,height:1920,objectFit:'cover',scale:1.02+smooth(frame,0,158)*.08+macro*.47+focus*.06,transformOrigin:'50% 52%',translate:`${Math.sin(frame/100)*8}px ${-macro*100}px`}}/>
      {/* Foreground leaves move independently from the camera and background. */}
      <svg width="1080" height="1920" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <g transform={`translate(-15 1360) rotate(${Math.sin(frame/32)*2.2})`} opacity={.8*(1-diagram*.8)}>
          <path d="M 0 400 Q 90 200 190 160" stroke="#5b7735" strokeWidth="9" fill="none"/>
          {[0,1,2,3].map(i=><path key={i} d={`M ${i*38} ${340-i*45} Q ${i*38+10} ${250-i*45} ${i*38+90} ${285-i*45} Q ${i*38+65} ${350-i*45} ${i*38} ${340-i*45}`} fill={i%2?'#48892b':'#6ca33b'}/>)}
        </g>
      </svg>
      <AbsoluteFill style={{background:'rgba(222,239,236,.88)',opacity:diagram*(1-macro)}}/>
      <div style={{position:'absolute',left:70,right:70,top:500,height:850,opacity:diagram*(1-macro),translate:`0px ${(1-diagram)*50}px`,background:'rgba(249,252,249,.94)',borderRadius:36,boxShadow:'0 30px 90px #16394a33',border:'2px solid #ffffff'}}>
        <svg width="940" height="850" viewBox="0 0 940 850">
          <text x="470" y="92" textAnchor="middle" fill="#234557" fontSize="30" fontWeight="700">HAI ĐIỂM TIẾP XÚC</text>
          <path d="M 90 510 L 850 510" stroke="#71858a" strokeWidth="15"/>
          <path d="M 240 510 L 240 285 Q 470 170 700 285 L 700 510" pathLength="1" strokeDasharray="1" strokeDashoffset={1-draw} stroke="#b87940" strokeWidth="10" fill="none"/>
          <text x="470" y="335" textAnchor="middle" fill="#75492d" fontSize="33">Cơ thể chim</text>
          {[240,700].map((x,i)=><g key={x}><circle cx={x} cy="510" r="18" fill="#e5ad27"/><text x={x} y="585" textAnchor="middle" fill="#15394a" fontSize="43">V{i?'₂':'₁'}</text></g>)}
          {Array.from({length:9},(_,i)=><circle key={i} cx={100+(frame*3+i*85)%740} cy="510" r="7" fill="#d09a1b"/>)}
          <text x="470" y="710" textAnchor="middle" fill="#15394a" fontSize="56" fontWeight="800">I = ΔV / R</text>
          <text x="470" y="770" textAnchor="middle" fill="#4e6a71" fontSize="29">ΔV nhỏ → dòng qua chim rất nhỏ</text>
        </svg>
      </div>
      <div style={{position:'absolute',left:100,right:100,top:1320,opacity:macro,translate:`0px ${(1-macro)*30}px`,padding:'30px 36px',borderRadius:24,background:'#f4faf4ee',boxShadow:'0 16px 50px #173a4033'}}>
        <svg viewBox="0 0 880 130" width="100%" height="130">
          <path d="M 100 30 L 780 30" stroke="#7a8d92" strokeWidth="10"/>
          <circle cx={100+(frame*4)%680} cy="30" r="9" fill="#e3aa21"/>
          <path d="M 310 15 L 310 70 L 570 70 L 570 15" fill="none" stroke="#244a5b" strokeWidth="3"/>
          <text x="440" y="120" textAnchor="middle" fontSize="36" fontWeight="800" fill="#193e50">R dây nhỏ · ΔV ≈ 0</text>
        </svg>
      </div>
      <div style={{position:'absolute',top:70,left:65,padding:'12px 20px',borderRadius:10,fontSize:23,fontWeight:800,color:'#e6f5ff',background:'#0a1626d9',letterSpacing:2}}>HIGH VOLTAGE LIFE</div>
      <Karaoke untilMs={14703}/>
    </AbsoluteFill>
  </AbsoluteFill>;
};
