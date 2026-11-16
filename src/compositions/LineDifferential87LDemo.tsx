import type {ReactNode} from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  AnimatedTransmissionLine,
  CurrentFlow,
  ProtectionZone,
  RelaySymbol,
  SignalFlow,
  TechnicalChart,
  TechnicalLabel,
  TechnicalPanel,
  Watermark,
} from '../components/technical';
import {colors, technicalFont} from '../theme';

const Scene = ({children, enter = 0, exit}: {children: ReactNode; enter?: number; exit: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [enter, enter + 0.45 * fps, exit - 0.45 * fps, exit], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        scale: interpolate(frame, [enter, exit], [1.025, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Header = ({eyebrow, line1, line2}: {eyebrow: string; line1: string; line2: string}) => (
  <div style={{position: 'absolute', top: 104, left: 74, right: 74, textAlign: 'center'}}>
    <div
      style={{
        display: 'inline-block',
        padding: '7px 19px',
        border: `2px solid ${colors.yellow}`,
        borderRadius: 999,
        color: colors.yellow,
        fontFamily: technicalFont,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 2,
      }}
    >
      {eyebrow}
    </div>
    <div style={{marginTop: 18, color: colors.white, fontFamily: technicalFont, fontSize: 54, fontWeight: 900, lineHeight: 1.03}}>
      {line1}
      <br />
      <span style={{color: colors.yellow}}>{line2}</span>
    </div>
  </div>
);

const FooterNote = ({children, progress}: {children: ReactNode; progress: number}) => (
  <div style={{position: 'absolute', left: 72, right: 72, bottom: 116}}>
    <div
      style={{
        display: 'inline-block',
        maxWidth: 840,
        padding: '12px 18px',
        borderRadius: 9,
        backgroundColor: 'rgba(0, 0, 0, 0.56)',
        color: colors.white,
        fontFamily: technicalFont,
        fontSize: 25,
        fontWeight: 600,
        lineHeight: 1.35,
      }}
    >
      {children}
    </div>
    <div style={{height: 3, marginTop: 20, backgroundColor: '#294158'}}>
      <div style={{height: '100%', width: `${Math.max(3, Math.min(100, progress))}%`, backgroundColor: colors.yellow}} />
    </div>
  </div>
);

const Overview = () => (
  <Scene exit={105}>
    <Header eyebrow="BẢO VỆ ĐƯỜNG DÂY · 87L" line1="HAI ĐẦU CÙNG ĐO" line2="MỘT VÙNG CÙNG BẢO VỆ" />
    <TechnicalPanel style={{left: 58, top: 360, width: 964, height: 990}} title="SƠ ĐỒ NGUYÊN LÝ">
      <svg width="964" height="990" viewBox="0 0 1080 990">
        <ProtectionZone />
        <AnimatedTransmissionLine />
        <RelaySymbol x={190} y={420} station="TRẠM A" />
        <RelaySymbol x={890} y={420} station="TRẠM B" />
        <SignalFlow active />
        <text x="540" y="770" textAnchor="middle" fill={colors.white} fontFamily={technicalFont} fontSize="38" fontWeight="900">87L NHÌN TOÀN TUYẾN</text>
        <text x="540" y="818" textAnchor="middle" fill={colors.technicalBlue} fontFamily={technicalFont} fontSize="24" fontWeight="700">ĐO DÒNG · SO SÁNH · RA LỆNH ĐỒNG THỜI</text>
      </svg>
    </TechnicalPanel>
    <FooterNote progress={18}>Hai rơ le trao đổi số đo dòng điện ở hai đầu đường dây.</FooterNote>
  </Scene>
);

const CompareCurrents = () => (
  <Scene exit={150}>
    <Header eyebrow="01 · SO SÁNH HAI ĐẦU" line1="DÒNG VÀO BẰNG DÒNG RA" line2="IDIFF XẤP XỈ 0" />
    <TechnicalPanel style={{left: 58, top: 360, width: 964, height: 990}} title="TRẠNG THÁI BÌNH THƯỜNG">
      <svg width="964" height="990" viewBox="0 0 1080 990">
        <ProtectionZone />
        <AnimatedTransmissionLine />
        <RelaySymbol x={190} y={420} station="TRẠM A" active />
        <RelaySymbol x={890} y={420} station="TRẠM B" active />
        <CurrentFlow x1={270} x2={510} y={420} color={colors.yellow} />
        <CurrentFlow x1={570} x2={810} y={420} color={colors.yellow} reverse />
        <SignalFlow active />
        <TechnicalChart />
      </svg>
      <TechnicalLabel color={colors.green} delay={28} style={{position: 'absolute', left: 322, top: 740}}>✓ ỔN ĐỊNH · KHÔNG CẮT</TechnicalLabel>
    </TechnicalPanel>
    <FooterNote progress={47}>Trong vận hành bình thường, tổng dòng so lệch gần bằng không.</FooterNote>
  </Scene>
);

const InternalFault = () => (
  <Scene exit={135}>
    <Header eyebrow="02 · SỰ CỐ TRONG VÙNG" line1="DÒNG HAI ĐẦU CÙNG ĐỔ VỀ" line2="IDIFF VƯỢT NGƯỠNG" />
    <TechnicalPanel style={{left: 58, top: 360, width: 964, height: 990}} title="PHÁT HIỆN SỰ CỐ NỘI BỘ">
      <svg width="964" height="990" viewBox="0 0 1080 990">
        <ProtectionZone active />
        <AnimatedTransmissionLine faultX={540} />
        <RelaySymbol x={190} y={420} station="TRẠM A" active />
        <RelaySymbol x={890} y={420} station="TRẠM B" active />
        <CurrentFlow x1={270} x2={520} y={420} color={colors.arcOrange} speed={1.5} />
        <CurrentFlow x1={560} x2={810} y={420} color={colors.arcOrange} speed={1.5} reverse />
        <SignalFlow active trip />
        <TechnicalChart fault />
      </svg>
      <TechnicalLabel color={colors.arcOrange} delay={12} style={{position: 'absolute', left: 382, top: 236}}>⚡ ĐIỂM SỰ CỐ</TechnicalLabel>
      <TechnicalLabel color={colors.red} delay={48} style={{position: 'absolute', left: 350, top: 742}}>IDIFF &gt; NGƯỠNG TÁC ĐỘNG</TechnicalLabel>
    </TechnicalPanel>
    <FooterNote progress={76}>Sự cố trong vùng làm dòng so lệch tăng nhanh và kích hoạt bảo vệ.</FooterNote>
  </Scene>
);

const TripBothEnds = () => (
  <Scene exit={105}>
    <Header eyebrow="03 · TÁC ĐỘNG BẢO VỆ" line1="RƠ LE GỬI LỆNH TRIP" line2="CẮT ĐỒNG THỜI HAI ĐẦU" />
    <TechnicalPanel style={{left: 58, top: 360, width: 964, height: 990}} title="CÔ LẬP VÙNG SỰ CỐ">
      <svg width="964" height="990" viewBox="0 0 1080 990">
        <ProtectionZone active />
        <AnimatedTransmissionLine energized={false} faultX={540} tripped />
        <RelaySymbol x={190} y={420} station="TRẠM A" trip />
        <RelaySymbol x={890} y={420} station="TRẠM B" trip />
        <SignalFlow active trip />
        <text x="540" y="785" textAnchor="middle" fill={colors.white} fontFamily={technicalFont} fontSize="34" fontWeight="800">CẮT NHANH · CHỌN LỌC · HAI ĐẦU</text>
      </svg>
      <TechnicalLabel color={colors.red} delay={9} style={{position: 'absolute', left: 112, top: 510}}>TRIP A</TechnicalLabel>
      <TechnicalLabel color={colors.red} delay={16} style={{position: 'absolute', right: 112, top: 510}}>TRIP B</TechnicalLabel>
      <TechnicalLabel color={colors.yellow} delay={36} style={{position: 'absolute', left: 314, top: 772, fontSize: 30}}>87L · DƯỚI 1 CHU KỲ</TechnicalLabel>
    </TechnicalPanel>
    <FooterNote progress={100}>Hai máy cắt mở để cô lập nhanh phần tử nằm trong vùng bảo vệ.</FooterNote>
  </Scene>
);

export const LineDifferential87LDemo = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: colors.navy, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(159,216,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(159,216,255,0.025) 1px, transparent 1px), radial-gradient(circle at 50% 48%, ${colors.navyLight} 0%, ${colors.navy} 68%)`,
          backgroundSize: '54px 54px, 54px 54px, 100% 100%',
          translate: `${interpolate(frame, [0, durationInFrames], [0, -12])}px ${interpolate(frame, [0, durationInFrames], [0, -20])}px`,
          scale: interpolate(frame, [0, durationInFrames], [1, 1.025]),
        }}
      />

      <Sequence durationInFrames={105}>
        <Overview />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <CompareCurrents />
      </Sequence>
      <Sequence from={225} durationInFrames={135}>
        <InternalFault />
      </Sequence>
      <Sequence from={345} durationInFrames={105}>
        <TripBothEnds />
      </Sequence>

      <Watermark />
    </AbsoluteFill>
  );
};
