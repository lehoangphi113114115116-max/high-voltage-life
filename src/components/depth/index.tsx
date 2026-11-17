import {interpolate, useCurrentFrame} from 'remotion';
import {colors, technicalFont} from '../../theme';

export const DepthGrid = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.7) % 80;
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, opacity: 0.32}}>
      <defs>
        <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.technicalBlue} stopOpacity="0" />
          <stop offset="0.55" stopColor={colors.technicalBlue} stopOpacity="0.18" />
          <stop offset="1" stopColor={colors.technicalBlue} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {Array.from({length: 15}, (_, i) => (
        <path key={`h-${i}`} d={`M 0 ${1180 + i * 58 + shift} L 1080 ${1180 + i * 58 + shift}`} stroke="url(#gridFade)" strokeWidth="2" />
      ))}
      {Array.from({length: 13}, (_, i) => {
        const x = i * 90;
        return <path key={`v-${i}`} d={`M 540 1020 L ${x} 1920`} stroke={colors.technicalBlue} strokeOpacity="0.22" strokeWidth="2" />;
      })}
    </svg>
  );
};

export const TransmissionPole = ({x, scale = 1, opacity = 1}: {x: number; scale?: number; opacity?: number}) => (
  <g transform={`translate(${x} 0) scale(${scale})`} opacity={opacity}>
    <path d="M -78 1080 L -32 480 L 32 480 L 78 1080 Z" fill="#102b45" stroke={colors.technicalBlue} strokeWidth="5" />
    <path d="M -145 520 L 145 520 M -108 660 L 108 660" stroke={colors.technicalBlue} strokeWidth="14" strokeLinecap="round" />
    <path d="M -52 1050 L 48 510 M 52 1050 L -48 510" stroke="#24445f" strokeWidth="7" />
    {[-110, 0, 110].map((dx) => <circle key={dx} cx={dx} cy="550" r="12" fill={colors.yellow} />)}
  </g>
);

export const BirdIllustration = ({x = 535, y = 680, danger = false}: {x?: number; y?: number; danger?: boolean}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 9) * 5;
  const glow = danger ? colors.arcOrange : colors.technicalBlue;
  return (
    <g transform={`translate(${x} ${y + bob})`} style={{filter: `drop-shadow(0 22px 20px rgba(0,0,0,.45)) drop-shadow(0 0 12px ${glow}55)`}}>
      <defs>
        <linearGradient id="birdBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3c36a" />
          <stop offset="0.55" stopColor="#b86b2e" />
          <stop offset="1" stopColor="#532d22" />
        </linearGradient>
      </defs>
      <ellipse cx="0" cy="0" rx="88" ry="64" fill="url(#birdBody)" />
      <path d="M -22 -4 C -8 6, 26 52, 70 30 C 36 4, 18 -18, -22 -4 Z" fill="#73402c" opacity="0.9" />
      <circle cx="66" cy="-43" r="38" fill="#d99042" />
      <circle cx="77" cy="-53" r="6" fill="#071725" />
      <path d="M 101 -44 L 140 -32 L 101 -24 Z" fill={colors.yellow} />
      <path d="M -78 3 L -145 -15 L -88 29 Z" fill="#5b3428" />
      <path d="M -32 52 L -26 94 M 30 52 L 36 94" stroke="#db9a4c" strokeWidth="8" strokeLinecap="round" />
      <path d="M -41 94 L -12 94 M 22 94 L 52 94" stroke="#db9a4c" strokeWidth="7" strokeLinecap="round" />
    </g>
  );
};

export const PotentialDiagram = ({danger = false}: {danger?: boolean}) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 30, [0, 15, 29], [0.45, 1, 0.45]);
  return (
    <g>
      <rect x="120" y="1080" width="840" height="330" rx="30" fill="rgba(7,23,37,.88)" stroke={danger ? colors.arcOrange : colors.technicalBlue} strokeWidth="4" />
      <text x="160" y="1140" fill={colors.yellow} fontFamily={technicalFont} fontSize="25" fontWeight="900" letterSpacing="3">SƠ ĐỒ HIỆU ĐIỆN THẾ</text>
      <line x1="195" y1="1280" x2="885" y2="1280" stroke={colors.technicalBlue} strokeWidth="8" />
      <circle cx="350" cy="1280" r="18" fill={colors.yellow} />
      <circle cx="730" cy="1280" r="18" fill={danger ? colors.arcOrange : colors.yellow} opacity={pulse} />
      <text x="350" y="1240" textAnchor="middle" fill={colors.white} fontFamily={technicalFont} fontSize="28" fontWeight="800">V₁</text>
      <text x="730" y="1240" textAnchor="middle" fill={colors.white} fontFamily={technicalFont} fontSize="28" fontWeight="800">V₂</text>
      <text x="540" y="1360" textAnchor="middle" fill={danger ? colors.arcOrange : colors.green} fontFamily={technicalFont} fontSize="38" fontWeight="900">
        {danger ? 'ΔV LỚN → CÓ DÒNG QUA CƠ THỂ' : 'ΔV = V₁ − V₂ ≈ 0 V'}
      </text>
    </g>
  );
};
