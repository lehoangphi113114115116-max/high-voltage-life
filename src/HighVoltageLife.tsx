import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const TransmissionTower = ({x, height}: {x: number; height: number}) => {
  const top = 70;
  const bottom = top + height;

  return (
    <g stroke="#88A7C2" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M ${x} ${top} L ${x - 95} ${bottom} M ${x} ${top} L ${x + 95} ${bottom}`} />
      <path d={`M ${x - 70} ${top + 130} L ${x + 70} ${top + 130}`} />
      <path d={`M ${x - 48} ${top + 245} L ${x + 48} ${top + 245}`} />
      <path d={`M ${x - 83} ${bottom - 35} L ${x + 83} ${bottom - 35}`} />
      <path d={`M ${x - 68} ${top + 132} L ${x + 45} ${top + 242}`} />
      <path d={`M ${x + 68} ${top + 132} L ${x - 45} ${top + 242}`} />
      <path d={`M ${x - 98} ${top + 105} L ${x + 98} ${top + 105}`} />
    </g>
  );
};

const PowerGrid = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <Interactive.Svg
      name="Đường dây truyền tải"
      width="1080"
      height="900"
      viewBox="0 0 1080 900"
      style={{position: 'absolute', left: 0, bottom: 170}}
    >
      <defs>
        <filter id="electric-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        opacity={interpolate(frame, [0, 1 * fps], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })}
        style={{translate: `0px ${interpolate(frame, [0, 1 * fps], [80, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })}px`}}
      >
        <TransmissionTower x={190} height={620} />
        <TransmissionTower x={540} height={650} />
        <TransmissionTower x={890} height={620} />

        <g fill="none" strokeLinecap="round">
          <path d="M 92 175 Q 365 330 638 175 Q 812 280 988 175" stroke="#406680" strokeWidth="10" />
          <path d="M 92 250 Q 365 405 638 250 Q 812 355 988 250" stroke="#406680" strokeWidth="10" />
          <path d="M 92 325 Q 365 480 638 325 Q 812 430 988 325" stroke="#406680" strokeWidth="10" />

          <path
            d="M 92 175 Q 365 330 638 175 Q 812 280 988 175"
            stroke="#66F7FF"
            strokeWidth="8"
            strokeDasharray="95 90"
            strokeDashoffset={interpolate(frame, [0, 5 * fps], [0, -900], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.linear,
            })}
            filter="url(#electric-glow)"
          />
          <path
            d="M 92 250 Q 365 405 638 250 Q 812 355 988 250"
            stroke="#2DD4BF"
            strokeWidth="7"
            strokeDasharray="65 120"
            strokeDashoffset={interpolate(frame, [0, 5 * fps], [0, -900], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.linear,
            })}
            filter="url(#electric-glow)"
          />
          <path
            d="M 92 325 Q 365 480 638 325 Q 812 430 988 325"
            stroke="#FCD34D"
            strokeWidth="7"
            strokeDasharray="45 140"
            strokeDashoffset={interpolate(frame, [0, 5 * fps], [0, -900], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.linear,
            })}
            filter="url(#electric-glow)"
          />
        </g>
      </g>
    </Interactive.Svg>
  );
};

const Title = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <Interactive.Div
      name="Tiêu đề chính"
      style={{
        position: 'absolute',
        top: 250,
        left: 80,
        right: 80,
        color: '#F8FAFC',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 118,
        fontWeight: 800,
        lineHeight: 0.92,
        letterSpacing: 4,
        textAlign: 'center',
        opacity: interpolate(frame, [0, 0.7 * fps, durationInFrames - 15, durationInFrames - 1], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(frame, [0, 0.8 * fps], ['0px 60px', '0px 0px'], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      HIGH VOLTAGE
      <br />
      <span style={{color: '#66F7FF'}}>LIFE</span>
    </Interactive.Div>
  );
};

export const HighVoltageLife = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#06172D',
        overflow: 'hidden',
        opacity: interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 42%, rgba(25, 88, 122, 0.45), rgba(6, 23, 45, 0) 52%)',
        }}
      />
      <Title />
      <PowerGrid />
      <Interactive.Div
        name="Nhãn thử nghiệm"
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 90,
          color: '#88A7C2',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 8,
          textAlign: 'center',
        }}
      >
        CLOUD RENDER TEST
      </Interactive.Div>
    </AbsoluteFill>
  );
};
