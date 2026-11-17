import type {CSSProperties, ReactNode} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, technicalFont} from '../../theme';

export const TechnicalPanel = ({
  children,
  title,
  style,
}: {
  children: ReactNode;
  title?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: 'absolute',
      border: `3px solid ${colors.yellow}`,
      borderRadius: 22,
      backgroundColor: 'rgba(7, 22, 38, 0.82)',
      boxShadow: '0 0 44px rgba(13, 59, 92, 0.35), inset 0 0 28px rgba(159, 216, 255, 0.04)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {title ? (
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 26,
          color: colors.yellow,
          fontFamily: technicalFont,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 3,
        }}
      >
        {title}
      </div>
    ) : null}
    {children}
  </div>
);

export const TechnicalLabel = ({
  children,
  color = colors.technicalBlue,
  delay = 0,
  style,
}: {
  children: ReactNode;
  color?: string;
  delay?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        border: `2px solid ${color}`,
        borderRadius: 10,
        backgroundColor: `${color}12`,
        color,
        fontFamily: technicalFont,
        fontSize: 23,
        fontWeight: 800,
        letterSpacing: 1.5,
        opacity: interpolate(frame, [delay, delay + 0.35 * fps], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        scale: interpolate(frame, [delay, delay + 0.35 * fps], [0.82, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.spring({damping: 14}),
          output: 'perceptual-scale',
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const RelaySymbol = ({
  x,
  y,
  station,
  active = false,
  trip = false,
}: {
  x: number;
  y: number;
  station: string;
  active?: boolean;
  trip?: boolean;
}) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 30, [0, 15, 29], [0.35, 1, 0.35]);
  const color = trip ? colors.red : active ? colors.yellow : colors.technicalBlue;

  return (
    <g>
      <rect x={x - 62} y={y - 72} width="124" height="144" rx="16" fill="#0b223a" stroke={color} strokeWidth="4" />
      <rect x={x - 38} y={y - 42} width="76" height="42" rx="6" fill="#071725" stroke={color} strokeWidth="2" />
      <path d={`M ${x - 24} ${y - 21} L ${x - 8} ${y - 21} L ${x} ${y - 31} L ${x + 10} ${y - 10} L ${x + 24} ${y - 21}`} fill="none" stroke={color} strokeWidth="3" />
      <circle cx={x - 22} cy={y + 27} r="7" fill={active || trip ? color : colors.muted} opacity={active || trip ? pulse : 0.5} />
      <circle cx={x} cy={y + 27} r="7" fill={trip ? colors.red : colors.muted} opacity={trip ? pulse : 0.45} />
      <circle cx={x + 22} cy={y + 27} r="7" fill={colors.muted} opacity="0.45" />
      <text x={x} y={y + 58} textAnchor="middle" fill={colors.white} fontFamily={technicalFont} fontSize="22" fontWeight="800">87L</text>
      <text x={x} y={y - 92} textAnchor="middle" fill={color} fontFamily={technicalFont} fontSize="20" fontWeight="800" letterSpacing="2">{station}</text>
    </g>
  );
};

export const CurrentFlow = ({
  x1,
  x2,
  y,
  color = colors.yellow,
  reverse = false,
  speed = 1,
  opacity = 1,
  controlY = y,
  count = 7,
  radius = 5,
  terminalPulse = false,
}: {
  x1: number;
  x2: number;
  y: number;
  color?: string;
  reverse?: boolean;
  speed?: number;
  opacity?: number;
  controlY?: number;
  count?: number;
  radius?: number;
  terminalPulse?: boolean;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const particles = Math.max(1, Math.floor(count));
  const time = frame / fps;

  return (
    <g opacity={opacity}>
      {Array.from({length: particles}, (_, index) => {
        const cycle = ((time * speed / 3 + index / particles) % 1 + 1) % 1;
        const progress = reverse ? 1 - cycle : cycle;
        const x = x1 + progress * (x2 - x1);
        const particleY = y + 2 * progress * (1 - progress) * (controlY - y);
        const fade = Math.min(1, cycle * 16, (1 - cycle) * 16);
        return <g key={index} opacity={fade}>
          <circle cx={x} cy={particleY} r={radius * 2.6} fill={color} opacity=".12" />
          <circle cx={x} cy={particleY} r={radius} fill={color} />
        </g>;
      })}
      {terminalPulse ? [x1, x2].map((x, index) => <g key={index}>
        <circle cx={x} cy={y} r={radius * (2 + .4 * Math.sin(time * Math.PI * 2 - index))} fill={color} opacity={.12 + .08 * Math.sin(time * Math.PI * 2 - index)} />
        <circle cx={x} cy={y} r={radius * .7} fill={color} opacity={.6 + .3 * Math.sin(time * Math.PI * 2 - index)} />
      </g>) : null}
    </g>
  );
};

export const AnimatedTransmissionLine = ({
  x1 = 130,
  x2 = 950,
  y = 420,
  energized = true,
  faultX,
  tripped = false,
}: {
  x1?: number;
  x2?: number;
  y?: number;
  energized?: boolean;
  faultX?: number;
  tripped?: boolean;
}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const conductor = energized ? colors.technicalBlue : colors.muted;

  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke="#203d57" strokeWidth="12" strokeLinecap="round" />
      <line
        x1={x1}
        x2={x2}
        y1={y}
        y2={y}
        stroke={conductor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={x2 - x1}
        strokeDashoffset={(x2 - x1) * (1 - draw)}
      />
      {tripped ? (
        <>
          <rect x={x1 + 45} y={y - 18} width="54" height="36" fill={colors.navy} />
          <path d={`M ${x1 + 47} ${y + 10} L ${x1 + 94} ${y - 30}`} stroke={colors.red} strokeWidth="7" strokeLinecap="round" />
          <rect x={x2 - 99} y={y - 18} width="54" height="36" fill={colors.navy} />
          <path d={`M ${x2 - 94} ${y - 30} L ${x2 - 47} ${y + 10}`} stroke={colors.red} strokeWidth="7" strokeLinecap="round" />
        </>
      ) : null}
      {faultX ? (
        <g style={{filter: `drop-shadow(0 0 18px ${colors.arcOrange})`}}>
          <circle cx={faultX} cy={y} r={18 + 5 * Math.sin(frame * 0.6)} fill={colors.arcOrange} opacity="0.24" />
          <path d={`M ${faultX - 10} ${y - 58} L ${faultX + 8} ${y - 22} L ${faultX - 4} ${y - 22} L ${faultX + 14} ${y + 14}`} fill="none" stroke={colors.arcOrange} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  );
};

export const SignalFlow = ({active = true, trip = false}: {active?: boolean; trip?: boolean}) => {
  const frame = useCurrentFrame();
  const color = trip ? colors.red : colors.technicalBlue;

  return (
    <g opacity={active ? 1 : 0.35}>
      <path d="M 250 610 C 410 690, 670 690, 830 610" fill="none" stroke={color} strokeWidth="4" strokeDasharray="18 16" strokeDashoffset={-frame * 2} />
      <path d="M 805 595 L 832 610 L 805 625" fill="none" stroke={color} strokeWidth="4" />
      <path d="M 275 595 L 248 610 L 275 625" fill="none" stroke={color} strokeWidth="4" />
      <text x="540" y="688" textAnchor="middle" fill={color} fontFamily={technicalFont} fontSize="21" fontWeight="700" letterSpacing="2">KÊNH TRUYỀN BẢO VỆ</text>
    </g>
  );
};

export const ProtectionZone = ({active = false}: {active?: boolean}) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 36, [0, 18, 35], [0.2, 0.42, 0.2]);

  return (
    <g>
      <rect x="245" y="337" width="590" height="166" rx="28" fill={active ? colors.arcOrange : colors.technicalBlue} opacity={active ? pulse : 0.05} stroke={active ? colors.arcOrange : colors.technicalBlue} strokeWidth="3" strokeDasharray="12 10" />
      <text x="540" y="326" textAnchor="middle" fill={active ? colors.arcOrange : colors.green} fontFamily={technicalFont} fontSize="20" fontWeight="800" letterSpacing="3">VÙNG BẢO VỆ 87L</text>
    </g>
  );
};

export const TechnicalChart = ({fault = false}: {fault?: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = interpolate(frame, [0.4 * fps, 1.7 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const value = fault ? Math.round(rise * 86) : Math.round(rise * 4);

  return (
    <g>
      <line x1="130" y1="860" x2="930" y2="860" stroke={colors.muted} strokeWidth="3" />
      <line x1="130" y1="860" x2="130" y2="710" stroke={colors.muted} strokeWidth="3" />
      <line x1="130" y1="790" x2="930" y2="790" stroke={colors.yellow} strokeWidth="2" strokeDasharray="12 10" opacity="0.7" />
      <text x="145" y="780" fill={colors.yellow} fontFamily={technicalFont} fontSize="18" fontWeight="700">NGƯỠNG TÁC ĐỘNG</text>
      <path
        d={fault ? 'M 130 846 C 360 844, 500 842, 605 820 S 735 730, 930 714' : 'M 130 846 C 340 842, 550 850, 930 842'}
        fill="none"
        stroke={fault ? colors.arcOrange : colors.green}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="900"
        strokeDashoffset={900 * (1 - rise)}
      />
      <text x="130" y="900" fill={colors.technicalBlue} fontFamily={technicalFont} fontSize="20" fontWeight="800">IRES →</text>
      <text x="70" y="730" fill={colors.technicalBlue} fontFamily={technicalFont} fontSize="20" fontWeight="800" rotate="-90">IDIFF</text>
      <text x="930" y="748" textAnchor="end" fill={fault ? colors.arcOrange : colors.green} fontFamily={technicalFont} fontSize="28" fontWeight="900">{value}%</text>
    </g>
  );
};

export const Watermark = () => (
  <div
    style={{
      position: 'absolute',
      right: 72,
      bottom: 66,
      color: colors.yellow,
      fontFamily: technicalFont,
      fontSize: 22,
      fontWeight: 900,
      letterSpacing: 3,
    }}
  >
    HIGH VOLTAGE LIFE
  </div>
);
