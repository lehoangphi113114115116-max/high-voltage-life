import {useCurrentFrame} from 'remotion';

export const Cloud = ({x,y,scale=1}: {x:number;y:number;scale?:number}) => {
  const f=useCurrentFrame();
  return <g transform={`translate(${x+f*.13} ${y}) scale(${scale})`} fill="#fff" opacity=".86"><ellipse rx="90" ry="30"/><circle cx="-35" cy="-20" r="37"/><circle cx="24" cy="-35" r="49"/></g>;
};
export const Tree = ({x,y}: {x:number;y:number}) => {
  const f=useCurrentFrame();
  return <g transform={`translate(${x} ${y})`}><path d="M 0 0 L 0 -130" stroke="#88613c" strokeWidth="15"/><g transform={`rotate(${Math.sin(f/32+x)*1.5} 0 -80)`} fill="#3e9954"><ellipse cy="-150" rx="60" ry="86"/><ellipse cx="-28" cy="-130" rx="47" ry="60" fill="#67b954"/></g></g>;
};
export const PowerPlant = ({x}: {x:number}) => {
  const f=useCurrentFrame();
  return <g transform={`translate(${x} 0)`}>
    <path d="M -140 800 L -140 560 L 170 560 L 225 600 L 225 800 Z" fill="#9caeb4"/>
    <path d="M -140 560 L -90 510 L 225 550 L 170 560 Z" fill="#c8d6d6"/>
    <rect x="-140" y="560" width="310" height="240" rx="7" fill="#da8054"/>
    <rect x="-110" y="590" width="250" height="150" rx="12" fill="#143b50"/>
    {/* Stylized generator rotor, not a real machine cutaway. */}
    <circle cx="15" cy="665" r="55" fill="#345e6e" stroke="#a5c1bf" strokeWidth="7"/>
    <g transform={`rotate(${f*5} 15 665)`} fill="#e9bc54">{[0,90,180,270].map(a=><path key={a} transform={`rotate(${a} 15 665)`} d="M 15 655 L 5 618 Q 50 615 45 650 Z"/>)}</g>
    <circle cx="15" cy="665" r="12" fill="#d9e2dc"/>
    <rect x="-105" y="765" width="180" height="35" fill="#446575"/>
    <text x="15" y="850" fontSize="28" textAnchor="middle" fill="#234452">MÁY PHÁT</text>
  </g>;
};
export const Transformer = ({x,label}: {x:number;label:string}) => {
  const f=useCurrentFrame();
  return <g transform={`translate(${x} 0)`}>
    <path d="M -90 660 L -55 630 L 100 630 L 68 660 Z" fill="#c4d3ce"/>
    <path d="M 68 660 L 100 630 L 100 792 L 68 815 Z" fill="#687e82"/>
    <rect x="-90" y="660" width="160" height="155" rx="9" fill="#8fa6a3" stroke="#607b7c" strokeWidth="4"/>
    {[-66,-38,-10,18,46].map(p=><rect key={p} x={p} y="682" width="12" height="110" rx="4" fill="#bed0c8"/>)}
    {[-55,35].map(p=><g key={p}><path d={`M ${p} 660 L ${p} 590`} stroke="#47596b" strokeWidth="12"/>{[605,620,635].map(y=><ellipse key={y} cx={p} cy={y} rx="17" ry="5" fill="#b58255"/>)}<circle cx={p} cy="590" r="9" fill="#f5b921" opacity={.65+.25*Math.sin(f/10)}/></g>)}
    <text x="0" y="860" fontSize="28" fill="#234452" textAnchor="middle">{label}</text>
  </g>;
};
export const GridTower = ({x}: {x:number}) => <g transform={`translate(${x} 0)`} stroke="#687e8b" fill="none" strokeWidth="8"><path d="M -65 820 L -20 365 L 20 365 L 65 820 M -50 720 L 40 445 M 50 720 L -40 445 M -50 720 L 55 720 M -100 430 L 100 430 M -75 520 L 75 520"/><path d="M -80 430 L -80 470 M 80 430 L 80 470" stroke="#ac7f55" strokeWidth="13"/></g>;
export const House = ({x,active}: {x:number;active:number}) => {
  const f=useCurrentFrame();
  return <g transform={`translate(${x} 0)`}>
    <path d="M -160 630 L 0 510 L 180 630 L 180 805 L -160 805 Z" fill="#f7e4b8"/>
    <path d="M 0 510 L 180 630 L 240 595 L 65 485 Z" fill="#b25441"/>
    <path d="M -180 640 L 0 500 L 200 640" stroke="#ce6d45" strokeWidth="27" fill="none" strokeLinejoin="round"/>
    <rect x="-35" y="690" width="65" height="115" rx="4" fill="#82715e"/>
    {[-110,75].map(p=><g key={p}><rect x={p} y="670" width="62" height="73" rx="4" fill="#72b4cf"/>
      <rect x={p} y="670" width="62" height="73" rx="4" fill="#ffe18a" opacity={active}/><path d={`M ${p+31} 670 L ${p+31} 743 M ${p} 705 L ${p+62} 705`} stroke="#f9f3df" strokeWidth="5"/></g>)}
    <rect x="-166" y="733" width="30" height="42" rx="5" fill="#dce8db" stroke="#627e7d" strokeWidth="3"/>
    <circle cx="-151" cy="748" r="4" fill="#3aa477" opacity={active*(.7+.3*Math.sin(f/4))}/>
  </g>;
};
