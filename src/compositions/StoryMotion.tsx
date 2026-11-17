import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BirdIllustration, TransmissionPole} from '../components/depth';
import {colors, technicalFont} from '../theme';

export type MotionScene = {id: string; text: string; mode: string; startFrame: number; endFrame: number; transition: string; camera: string};
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

export const StoryMotion = ({scenes}: {scenes: MotionScene[]}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>{scenes.map((scene, index) => {
    if (frame < scene.startFrame - 15 || frame > scene.endFrame + 15) return null;
    const age = frame - scene.startFrame;
    const enter = index === 0 ? 1 : ease(frame, scene.startFrame - 12, scene.startFrame + 12);
    const exit = index === scenes.length - 1 ? 1 : 1 - ease(frame, scene.endFrame - 12, scene.endFrame + 12);
    const depth = scene.mode === 'depth';
    const macro = scene.mode === 'wire-detail';
    const danger = scene.mode === 'danger';
    const dolly = ease(age, 0, scene.endFrame - scene.startFrame);
    return <AbsoluteFill key={scene.id} style={{opacity: scene.transition === 'cross-dissolve' ? enter * exit : exit, clipPath: scene.transition === 'directional-reveal' ? `inset(0 ${(1-enter)*100}% 0 0)` : undefined, background: 'radial-gradient(ellipse at 55% 40%, #1b4261, #0a1626 72%)'}}>
      <svg width="1080" height="1500" viewBox="0 0 1080 1500" style={{position:'absolute', top: 140}}>
        <defs><linearGradient id={`wire-${index}`}><stop stopColor="#38617a"/><stop offset=".5" stopColor="#deefff"/><stop offset="1" stopColor="#38617a"/></linearGradient></defs>
        {depth ? <>
          <g transform={`translate(${-dolly*60} 80) scale(.75)`} opacity=".25"><TransmissionPole x={210}/><TransmissionPole x={1260}/></g>
          <g transform={`translate(${540-(1+dolly*.35)*540} ${-dolly*210}) scale(${1+dolly*.35})`}>
            <TransmissionPole x={80} scale={.8} opacity={.5}/><TransmissionPole x={1010} scale={.8} opacity={.5}/>
            <path d="M -100 825 Q 540 790 1180 825" stroke={`url(#wire-${index})`} strokeWidth="13" fill="none"/>
            <BirdIllustration x={535} y={710}/>
            <path d={`M 510 690 Q ${550+Math.sin(age/9)*20} ${720-Math.sin(age/9)*15} 580 740`} stroke="#e5b76c" strokeWidth="12" fill="none"/>
          </g>
          <text x="540" y="1080" textAnchor="middle" fill={colors.technicalBlue} fontSize="32">HAI CHÂN · CÙNG MỘT DÂY DẪN</text>
        </> : <>
          <g transform={`translate(${540-(1+dolly*.08)*540} ${-dolly*25}) scale(${1+dolly*.08})`}>
            <rect x="90" y="390" width="900" height="710" rx="32" fill="#071a2b" stroke="#9fd8ff44" strokeWidth="2"/>
            <text x="140" y="460" fill={colors.technicalBlue} fontSize="25" letterSpacing="4">{macro ? 'CẬN CẢNH ĐOẠN DÂY' : 'SƠ ĐỒ NGUYÊN LÝ'}</text>
            <path d="M 130 800 L 950 800" stroke={`url(#wire-${index})`} strokeWidth={macro ? 24 : 8} fill="none"/>
            {macro ? <g>
              <path d="M 260 530 L 310 780 M 820 530 L 770 780 M 270 786 L 350 786 M 730 786 L 810 786" stroke="#e5b76c" strokeWidth="22" fill="none" strokeLinecap="round"/>
              <path d="M 310 890 L 310 915 L 770 915 L 770 890" stroke={colors.technicalBlue} strokeWidth="3" fill="none"/>
              <text x="540" y="590" textAnchor="middle" fill="white" fontSize="35">HAI ĐIỂM TIẾP XÚC</text>
              <circle cx={310+((age*2)%460)} cy="800" r="26" fill="none" stroke={colors.yellow} strokeWidth="3"/>
            </g> : <path d="M 310 800 L 310 620 Q 540 490 770 620 L 770 800" fill="none" stroke={danger ? colors.arcOrange : colors.technicalBlue} strokeWidth="7" strokeDasharray="12 10" strokeDashoffset={-age*2}/>}
            {[310,770].map((x,i)=><g key={x}><circle cx={x} cy="800" r={16+Math.sin(age/10+i)*3} fill={colors.yellow}/><text x={x} y="870" textAnchor="middle" fill="white" fontSize="35">V{i ? '₂' : '₁'}</text></g>)}
            {Array.from({length:9},(_,i)=><circle key={i} cx={140+((age*3+i*90)%800)} cy="800" r="7" fill={colors.yellow}/>)}
            {!macro && <text x="540" y="690" textAnchor="middle" fill="white" fontSize="30">CƠ THỂ CHIM</text>}
            <text x="540" y="970" textAnchor="middle" fill={colors.yellow} fontSize="48" fontWeight="900">{macro ? 'R dây nhỏ → ΔV ≈ 0' : danger ? 'ΔV lớn → nguy hiểm' : 'I = ΔV / R cơ thể'}</text>
            <text x="540" y="1035" textAnchor="middle" fill={colors.technicalBlue} fontSize="29">{macro ? 'Đoạn dây rất ngắn giữa hai chân' : 'ΔV gần bằng 0 → dòng qua chim rất nhỏ'}</text>
          </g>
        </>}
      </svg>
      <div style={{position:'absolute',left:70,top:400,fontFamily:technicalFont,fontSize:25,color:colors.yellow,letterSpacing:3}}>{String(index+1).padStart(2,'0')} / {depth ? 'QUAN SÁT' : macro ? 'PHÓNG ĐẠI' : 'GIẢI THÍCH'}</div>
    </AbsoluteFill>;
  })}</AbsoluteFill>;
};
