import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BirdIllustration, DepthGrid, PotentialDiagram, TransmissionPole} from '../components/depth';
import {AnimatedTransmissionLine, CurrentFlow, RelaySymbol, TechnicalLabel, Watermark} from '../components/technical';
import currentVideo from '../generated/current-video.json';
import {colors, technicalFont} from '../theme';
import {StoryMotion, type MotionScene} from './StoryMotion';
import {FootageLayer, type FootagePlan} from '../footage/FootageLayer';

type KaraokeWord = {text: string; startMs: number; endMs: number};
const videoData = currentVideo as unknown as Omit<typeof currentVideo, 'karaoke'> & {karaoke: KaraokeWord[]};

export const Karaoke = ({untilMs = Infinity, words: inputWords = videoData.karaoke}: {untilMs?: number; words?: KaraokeWord[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = (frame / fps) * 1000;
  const words = inputWords.filter(word => word.startMs < untilMs);
  const next = words.findIndex(word => word.startMs > now);
  const active = Math.max(0, next === -1 ? words.length - 1 : next - 1);
  const start = Math.max(0, active - 3);
  const visible = words.slice(start, start + 8);
  return (
    <div style={{position: 'absolute', left: 65, right: 65, bottom: 150, minHeight: 150, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '5px 12px', padding: '24px 28px', borderRadius: 24, background: 'rgba(5,15,27,.88)', border: `2px solid ${colors.technicalBlue}55`, boxShadow: '0 18px 60px rgba(0,0,0,.42)'}}>
      {visible.map((word, index) => {
        const absoluteIndex = start + index;
        const isActive = absoluteIndex === active && now >= word.startMs && now < word.endMs;
        const spoken = now >= word.endMs;
        return <span key={`${word.text}-${absoluteIndex}`} style={{fontFamily: technicalFont, fontSize: 38, lineHeight: 1.25, fontWeight: 900, color: isActive ? colors.yellow : spoken ? colors.technicalBlue : colors.white, textShadow: isActive ? `0 0 18px ${colors.yellow}` : 'none', transform: isActive ? 'scale(1.06)' : 'scale(1)'}}>{word.text}</span>;
      })}
    </div>
  );
};

const GenericElectricalScene = ({category}: {category: string}) => {
  const relay = category === 'relay-protection';
  return (
    <svg width="1080" height="1020" viewBox="0 0 1080 1020" style={{position: 'absolute', top: 420}}>
      <defs>
        <linearGradient id="equipmentFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#173f60" />
          <stop offset="1" stopColor="#091c30" />
        </linearGradient>
      </defs>
      <rect x="115" y="140" width="850" height="610" rx="34" fill="rgba(5,18,32,.72)" stroke={colors.technicalBlue} strokeOpacity=".45" strokeWidth="3" />
      <AnimatedTransmissionLine x1={175} x2={905} y={410} />
      <CurrentFlow x1={200} x2={880} y={410} speed={1.25} />
      {relay ? (
        <>
          <RelaySymbol x={230} y={270} station="ĐẦU A" active />
          <RelaySymbol x={850} y={270} station="ĐẦU B" active />
        </>
      ) : (
        <>
          <g transform="translate(250 190)">
            <path d="M 0 60 L 65 15 L 190 15 L 125 60 Z" fill="#27577a" />
            <rect x="0" y="60" width="125" height="180" rx="12" fill="url(#equipmentFace)" stroke={colors.technicalBlue} strokeWidth="4" />
            <path d="M 125 60 L 190 15 L 190 190 L 125 240 Z" fill="#071725" stroke={colors.technicalBlue} strokeWidth="3" />
            <circle cx="38" cy="115" r="18" fill={colors.yellow} />
            <circle cx="86" cy="115" r="18" fill={colors.arcOrange} />
          </g>
          <g transform="translate(650 190)">
            <path d="M 0 60 L 65 15 L 190 15 L 125 60 Z" fill="#27577a" />
            <rect x="0" y="60" width="125" height="180" rx="12" fill="url(#equipmentFace)" stroke={colors.technicalBlue} strokeWidth="4" />
            <path d="M 125 60 L 190 15 L 190 190 L 125 240 Z" fill="#071725" stroke={colors.technicalBlue} strokeWidth="3" />
            <circle cx="38" cy="115" r="18" fill={colors.green} />
            <circle cx="86" cy="115" r="18" fill={colors.yellow} />
          </g>
        </>
      )}
      <text x="540" y="570" textAnchor="middle" fill={colors.yellow} fontFamily={technicalFont} fontSize="31" fontWeight="900" letterSpacing="3">DÒNG ĐIỆN · ĐIỆN ÁP · LOGIC TÁC ĐỘNG</text>
      <text x="540" y="630" textAnchor="middle" fill={colors.white} fontFamily={technicalFont} fontSize="25" fontWeight="700">Sơ đồ kỹ thuật được chọn theo phân loại nội dung</text>
    </svg>
  );
};

export const AutonomousExplainer = ({motionPreview = false}: {motionPreview?: boolean}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = frame / durationInFrames;
  const diagram = progress > 0.22;
  const danger = progress > 0.76;
  const reveal = interpolate(frame, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const pan = interpolate(progress, [0, 1], [-22, 26]);
  const isBird = currentVideo.category === 'electricity-in-life' && currentVideo.topic.toLowerCase().includes('chim');
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, #173a58 0%, ${colors.navy} 54%, #050d18 100%)`, color: colors.white, overflow: 'hidden'}}>
      <Audio src={staticFile(currentVideo.audioPath)} />
      <DepthGrid />
      {motionPreview ? <StoryMotion scenes={(currentVideo.scenes as unknown as MotionScene[]).filter(scene => scene.startFrame < durationInFrames)} /> : isBird ? <div style={{position: 'absolute', inset: 0, transform: `translateX(${pan}px)`}}>
        <svg width="1080" height="1540" viewBox="0 0 1080 1540" style={{position: 'absolute', top: 190}}>
          <TransmissionPole x={105} scale={0.86} opacity={0.68} />
          <TransmissionPole x={975} scale={0.86} opacity={0.68} />
          <path d="M 0 770 Q 540 710 1080 770" fill="none" stroke="#07101a" strokeWidth="24" opacity=".5" />
          <path d="M 0 750 Q 540 690 1080 750" fill="none" stroke={colors.technicalBlue} strokeWidth="9" style={{filter: `drop-shadow(0 0 15px ${colors.technicalBlue}88)`}} />
          <CurrentFlow x1={0} x2={1080} y={750} controlY={690} count={12} radius={5} terminalPulse />
          <BirdIllustration y={655} danger={danger} />
          <circle cx="510" cy="746" r="12" fill={colors.yellow} />
          <circle cx="576" cy="744" r="12" fill={danger ? colors.arcOrange : colors.yellow} />
          {danger ? <path d="M 576 744 C 700 830, 820 910, 900 1020" fill="none" stroke={colors.arcOrange} strokeWidth="8" strokeDasharray="18 12" strokeDashoffset={-frame * 4} /> : null}
          {diagram ? <PotentialDiagram danger={danger} /> : null}
        </svg>
      </div> : <GenericElectricalScene category={currentVideo.category} />}
      <div style={{position: 'absolute', top: 86, left: 62, right: 62, opacity: reveal}}>
        <TechnicalLabel>{currentVideo.category.toUpperCase()} · TECHNICAL ILLUSTRATION</TechnicalLabel>
        <div style={{fontFamily: technicalFont, fontSize: 59, fontWeight: 950, lineHeight: 1.02, marginTop: 26, maxWidth: 950, textTransform: 'uppercase'}}>{currentVideo.headline}</div>
        <div style={{width: 230, height: 7, marginTop: 22, background: colors.yellow, boxShadow: `0 0 20px ${colors.yellow}`}} />
      </div>
      {isBird && !motionPreview ? <div style={{position: 'absolute', top: 950, left: 72, opacity: diagram ? 1 : 0, color: danger ? colors.arcOrange : colors.green, fontFamily: technicalFont, fontSize: 27, fontWeight: 900, letterSpacing: 2}}>
        {danger ? 'NGUY HIỂM: CHẠM HAI ĐIỆN THẾ KHÁC NHAU' : 'HAI CHÂN GẦN NHƯ CÙNG ĐIỆN THẾ'}
      </div> : null}
      <Karaoke />
      <Watermark />
      {!motionPreview && <FootageLayer plan={(currentVideo as unknown as {footage?:FootagePlan}).footage}/>}
    </AbsoluteFill>
  );
};
