// HIGH VOLTAGE LIFE — self-contained SVG scene generator.
// Every moving object depends deterministically on `frame`.
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const fmt=x=>Number(x.toFixed(2));

export function breakerSvg(frame=0,fps=30){
  const t=frame/fps;
  const progressOpen=smooth((t-6)/2.6);
  const gap=progressOpen*165;
  const arcStrength=clamp((t-6.2)/0.55)*clamp((12.8-t)/1.4);
  const open=progressOpen>0.96;
  const pulse = 0.5+0.5*Math.sin(t*4.5);
  const enter = smooth((t-.2)/1);
  const flowFraction= 1-progressOpen;
  const camX=10*Math.sin(t*.25);
  const gasMist=Array.from({length:13},(_,i)=>{
     const u=(i/13+t*.28)%1;const y=1295+u*96;
     const x=405+u*390+Math.sin(i*2.2+t)*28;
     return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(3+u*5)}" fill="#72eef4" opacity="${fmt((.12+.23*(1-u))*(.3+.7*arcStrength))}" />`;
  }).join('');
  const sparks=Array.from({length:22},(_,i)=>{
    const u=((i*0.618+t*.65)%1);const v=((i*.382+t*.27)%1);
    const px=110+u*860;const py=615+Math.sin(u*Math.PI)*25+(v-.5)*32;
    const radius=2.2+(i%4)*.75;
    return `<circle cx="${fmt(px)}" cy="${fmt(py)}" r="${radius}" opacity="${fmt((.25+.65*pulse)*flowFraction)}" fill="${i%3===0?'#ffffff':'#ffd65e'}" />`;
  }).join('');
  const particles=Array.from({length:17},(_,i)=>{
    const a=((i/17+t*0.25)%1);
    return `<circle cx="${fmt(85+910*a)}" cy="${fmt(648-10*Math.sin(a*Math.PI))}" r="${i%3===0?8:5}" fill="#ffd452" opacity="${fmt((1-progressOpen)*(.65+.3*Math.sin(t*5+i)**2))}" filter="url(#goldGlow)"/>`;
  }).join('');
  const pole=(x,index)=>`<g transform="translate(${x} 0)">
    <ellipse cx="0" cy="876" rx="105" ry="24" fill="#112438" opacity=".4" />
    <rect x="-72" y="675" width="144" height="174" rx="18" fill="url(#steel)" stroke="#547b96" stroke-width="3" />
    <rect x="-59" y="691" width="118" height="125" rx="11" fill="#a7c4cf" stroke="#587a8f" stroke-width="2" />
    <rect x="-50" y="806" width="100" height="30" rx="6" fill="#355569" />
    <rect x="-33" y="780" width="66" height="14" rx="5" fill="#789aa7" />
    <rect x="-23" y="355" width="46" height="320" rx="16" fill="url(#porcelain)" stroke="#95b3bf" stroke-width="3" />
    ${Array.from({length:13},(_,j)=>`<ellipse cx="0" cy="${370+j*22}" rx="${j%2?58:66}" ry="14" fill="${j%2?'#d7e7e8':'#f5ffff'}" stroke="#92afbd" stroke-width="2"/>`).join('')}
    <rect x="-14" y="322" width="28" height="33" rx="4" fill="#668998"/>
    <ellipse cx="0" cy="320" rx="31" ry="9" fill="#edc56d" stroke="#9c8258" stroke-width="3" />
    <rect x="-8" y="293" width="16" height="30" rx="3" fill="#b9d3d9"/>
    <rect x="-68" y="660" width="136" height="17" rx="7" fill="#597f91" stroke="#a0c5ce" stroke-width="2"/>
    <g opacity="${fmt(.1+.12*Math.sin(t*2+index))}"><ellipse cx="0" cy="500" rx="88" ry="170" fill="url(#cyanHalo)"/></g>
  </g>`;
  // Technical cutaway: deliberately schematic, not manufacturer-specific.
  const fixedContactX=615;
  const movingTipX=615-gap;
  const sparkLines=Array.from({length:7},(_,i)=>{
    const x=movingTipX+15+(gap-45)*(i/7);
    const y=1334+Math.sin(t*14+i*2)*((i%2)?14:-13);
    return `<path d="M ${fmt(x)} ${fmt(y-18)} l 13 -11 l -6 21 l 18 -2" fill="none" stroke="${i%2?'#ffdc76':'#ffa05d'}" stroke-width="${i%3===0?7:4}" stroke-linecap="round" opacity="${fmt(arcStrength)}" filter="url(#arcGlow)"/>`;
  }).join('');
  const cutawayBox=`<g>
      <rect x="76" y="1095" width="928" height="470" rx="38" fill="#183950" stroke="#6392a8" stroke-width="4" />
      <rect x="94" y="1113" width="892" height="434" rx="27" fill="url(#chamber)" stroke="#a7d2dc" stroke-width="2" />
      <ellipse cx="540" cy="1332" rx="354" ry="144" fill="#7ac2d7" opacity=".075" />
      <rect x="185" y="1263" width="720" height="140" rx="64" fill="#294a59" stroke="#8eaeba" stroke-width="5"/>
      <rect x="212" y="1280" width="670" height="107" rx="48" fill="url(#chamberInside)" stroke="#406878" stroke-width="2"/>
      <rect x="${fmt(185-gap)}" y="1317" width="${fmt(400)}" height="34" rx="11" fill="url(#copper)" stroke="#ffdfaa" stroke-width="2" />
      <rect x="${fmt(movingTipX-22)}" y="1300" width="36" height="68" rx="8" fill="#fff2ca" stroke="#b07d43" stroke-width="3" />
      <rect x="${fixedContactX}" y="1310" width="240" height="47" rx="12" fill="url(#copper)" stroke="#ffdfaa" stroke-width="3"/>
      <rect x="${fixedContactX-4}" y="1304" width="28" height="60" rx="8" fill="#ffedba" stroke="#94653b" stroke-width="3"/>
      <g opacity="${fmt(arcStrength)}"><ellipse cx="${fmt((movingTipX+fixedContactX)/2)}" cy="1334" rx="${fmt(Math.max(12,gap/2))}" ry="60" fill="url(#arcRadiance)"/></g>
      ${gap>34?sparkLines:''}
      ${gasMist}
      <path d="M 268 1230 Q 360 1175 470 1225" stroke="#7af1eb" stroke-width="9" fill="none" opacity="${fmt(.12+.18*pulse)}" filter="url(#electricGlow)"/>
      <path d="M 250 1219 Q 360 1186 477 1223" fill="none" stroke="#c6f2f3" stroke-width="5" stroke-dasharray="11 23" opacity="${fmt(.45+.2*Math.sin(t*4))}" />
      <path d="M 820 1444 Q 707 1473 602 1436" fill="none" stroke="#c6f2f3" stroke-width="5" stroke-dasharray="11 23" opacity="${fmt(.45+.2*Math.sin(t*4))}" />
      <rect x="216" y="1144" width="200" height="52" rx="26" fill="#1e596a" stroke="#6ed9d8" stroke-width="2"/>
      <text x="316" y="1178" font-family="Noto Sans, DejaVu Sans, sans-serif" font-weight="bold" font-size="28" text-anchor="middle" fill="#f6ffff">BUỒNG CẮT</text>
      <g><circle cx="815" cy="1171" r="23" fill="#26566b" stroke="#89d5df" stroke-width="3"/><text x="815" y="1179" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="22" text-anchor="middle" fill="#f4ffff">SF₆</text></g>
    </g>`;
  const phase= t<6 ? 'DÒNG ĐIỆN ĐANG CHẠY' : t<9 ? 'TIẾP ĐIỂM TÁCH RA' : t<13 ? 'HỒ QUANG ĐƯỢC DẬP TẮT' : 'MẠCH ĐIỆN ĐÃ ĐƯỢC CÁCH LY';
  const timeline=smooth(t/18);
  const stateLabel=t<6?'ĐANG DẪN ĐIỆN':t<9?'MỞ TIẾP ĐIỂM':t<13?'DẬP HỒ QUANG':'ĐÃ CÔ LẬP';
  const statusColor=t<6?'#41d9ad':t<13?'#ffb84c':'#7cc5ff';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
   <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#76bfe1"/><stop offset=".5" stop-color="#c0e8f2"/><stop offset="1" stop-color="#f4ead0"/></linearGradient>
   <linearGradient id="grass" x2="0" y2="1"><stop stop-color="#5ea389"/><stop offset="1" stop-color="#367566"/></linearGradient>
   <linearGradient id="steel" x2="1" y2=".2"><stop stop-color="#7998a9"/><stop offset=".46" stop-color="#edf3f1"/><stop offset="1" stop-color="#456b80"/></linearGradient>
   <linearGradient id="porcelain" x2="1" y2="0"><stop stop-color="#668f9f"/><stop offset=".38" stop-color="#f0f9f6"/><stop offset=".77" stop-color="#d9f0ee"/><stop offset="1" stop-color="#739ba9"/></linearGradient>
   <linearGradient id="copper" x2="0" y2="1"><stop stop-color="#f8d58e"/><stop offset=".5" stop-color="#bf743d"/><stop offset="1" stop-color="#6d3e36"/></linearGradient>
   <linearGradient id="chamber" x2="0" y2="1"><stop stop-color="#21495d"/><stop offset="1" stop-color="#142d41"/></linearGradient>
   <linearGradient id="chamberInside" x2="0" y2="1"><stop stop-color="#102836"/><stop offset=".5" stop-color="#416e7c"/><stop offset="1" stop-color="#102836"/></linearGradient>
   <radialGradient id="arcRadiance"><stop stop-color="#fffbea" stop-opacity=".95"/><stop offset=".5" stop-color="#ffb254" stop-opacity=".7"/><stop offset="1" stop-color="#e65d44" stop-opacity="0"/></radialGradient>
   <radialGradient id="cyanHalo"><stop stop-color="#89e5eb" stop-opacity=".9"/><stop offset="1" stop-color="#89e5eb" stop-opacity="0"/></radialGradient>
   <linearGradient id="darkHeader" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#081d31"/><stop offset=".75" stop-color="#133c51"/><stop offset="1" stop-color="#0a2135"/></linearGradient>
   <linearGradient id="panelGlow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#204a65"/><stop offset="1" stop-color="#102a40"/></linearGradient>
   <linearGradient id="yellowElectric" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#ffd475"/><stop offset=".5" stop-color="#fff8c8"/><stop offset="1" stop-color="#ffb948"/></linearGradient>
   <filter id="softBlur"><feGaussianBlur stdDeviation="12"/></filter>
   <filter id="electricGlow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <filter id="goldGlow"><feGaussianBlur stdDeviation="5" /></filter>
   <filter id="arcGlow"><feGaussianBlur stdDeviation="2.4" /></filter>
   <filter id="shadow"><feDropShadow dx="0" dy="12" stdDeviation="17" flood-color="#07304c" flood-opacity=".28"/></filter>
   <clipPath id="frameClip"><rect x="0" y="0" width="1080" height="1920" /></clipPath>
  </defs>
  <g clip-path="url(#frameClip)">
    <rect width="1080" height="1920" fill="#ecf4f3"/>
    <rect width="1080" height="1920" fill="#10243b" opacity=".055"/>
    <rect width="1080" height="995" fill="url(#sky)"/>
    <g transform="translate(${fmt(-t*13)} ${fmt(Math.sin(t*.8)*3)})" fill="white" opacity=".65">
      <ellipse cx="185" cy="280" rx="130" ry="38"/><ellipse cx="252" cy="255" rx="76" ry="41"/>
      <ellipse cx="815" cy="229" rx="137" ry="34"/><ellipse cx="735" cy="212" rx="70" ry="37"/>
    </g>
    <circle cx="891" cy="289" r="124" fill="#fff0bc" opacity=".21" filter="url(#softBlur)"/>
    <circle cx="895" cy="287" r="72" fill="#ffdf93" opacity=".7"/>
    <path d="M0 850 Q310 775 610 850 T1080 800 V995 H0" fill="#80aeaa" opacity=".5"/>
    <path d="M0 890 Q240 842 520 889 T1080 847 V995 H0" fill="url(#grass)"/>
    <path d="M0 945 H1080 V1035 H0" fill="#aeb7a8"/>
    <path d="M0 997 H1080" stroke="#72918f" stroke-width="6"/>
    <g opacity=".7"><path d="M0 460 H1080 M0 550 H1080" stroke="#567d8c" stroke-width="3"/><path d="M115 440 L115 680 M966 440 L966 680" stroke="#507a8c" stroke-width="9"/></g>
    <rect x="0" y="0" width="1080" height="111" fill="url(#darkHeader)"/>
    <rect x="0" y="108" width="1080" height="3" fill="#f7bd4d" opacity=".9"/>
    <g transform="translate(67,39)">
      <path d="M0 0 L20 -16 L13 -2 L30 -2 L8 19 L16 4 L0 4 Z" fill="#ffd66d"/>
      <text x="45" y="11" fill="#f4f9fc" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="31" font-weight="900" letter-spacing="1.5">HIGH VOLTAGE <tspan fill="#ffcb53">LIFE</tspan></text>
    </g>
    <rect x="805" y="35" width="208" height="48" rx="24" fill="#244c60" stroke="#5c9da8" stroke-width="2"/>
    <circle cx="833" cy="58" r="7" fill="#67e3d5" opacity="${fmt(.58+.42*pulse)}"/>
    <text x="851" y="67" fill="#bdeae9" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="18" font-weight="800" letter-spacing="1">TECH SERIES</text>
    <g opacity="${fmt(enter)}">
      <rect x="66" y="153" width="269" height="47" rx="23" fill="#134b61"/>
      <text x="200" y="183" fill="#e5fcfe" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="20" font-weight="800" text-anchor="middle" letter-spacing="1">NGUYÊN LÝ HOẠT ĐỘNG</text>
      <text x="63" y="273" fill="#143349" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="69" font-weight="900" letter-spacing="-1.5">MÁY CẮT <tspan fill="#ce7c2c">SF₆</tspan></text>
      <text x="67" y="324" fill="#456b77" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="26" font-weight="500">Đóng – cắt dòng điện • Dập hồ quang</text>
    </g>
    <rect x="69" y="365" width="441" height="64" rx="22" fill="#f7faf8" stroke="#bed7d6" stroke-width="2" opacity=".94"/>
    <circle cx="101" cy="397" r="10" fill="${statusColor}" opacity="${fmt(.6+.4*pulse)}"/>
    <text x="125" y="407" fill="#1b4253" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="25" font-weight="800">${stateLabel}</text>
    <text x="925" y="395" fill="#31596a" font-family="Noto Sans, DejaVu Sans, sans-serif" text-anchor="end" font-size="22" font-weight="700">01 / CẤU TẠO</text>
    <g filter="url(#shadow)">
      <path d="M80 644 Q280 628 540 638 T995 636" fill="none" stroke="#48545d" stroke-width="15" stroke-linecap="round"/>
      <path d="M80 644 Q280 628 540 638 T995 636" fill="none" stroke="#e3ecf0" stroke-width="4"/>
      ${particles}
      ${sparks}
      ${pole(243,0)} ${pole(540,1)} ${pole(835,2)}
      <rect x="100" y="852" width="880" height="50" rx="13" fill="#456e7f" stroke="#a6c7cb" stroke-width="4" />
      <rect x="386" y="899" width="308" height="96" rx="13" fill="url(#steel)" stroke="#63889a" stroke-width="3"/>
      <rect x="419" y="922" width="121" height="43" rx="8" fill="#183c53"/>
      <circle cx="932" cy="877" r="13" fill="${statusColor}" opacity="${fmt(.6+.4*pulse)}" filter="url(#electricGlow)"/>
      <circle cx="625" cy="945" r="22" fill="#e5eee8" stroke="#73959f" stroke-width="5"/>
      <path d="M625 945 L638 933" stroke="#e7a95b" stroke-width="5"/>
      <rect x="70" y="888" width="920" height="21" fill="#d6e2df" opacity=".5"/>
    </g>
    <rect x="0" y="1010" width="1080" height="910" fill="url(#darkHeader)"/>
    <path d="M 0 1080 L1080 1080 M0 1510 L1080 1510" stroke="#44738b" opacity=".15" stroke-width="2"/>
    <path d="M0 1010 H1080" stroke="#f0b84d" stroke-width="8"/>
    <rect x="68" y="1033" width="9" height="45" rx="4" fill="#ffca65"/>
    <text x="100" y="1067" fill="#f1f8fb" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="35" font-weight="900" letter-spacing=".2">BÊN TRONG BUỒNG CẮT</text>
    <text x="988" y="1065" fill="#8ac8d5" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="20" text-anchor="end" font-weight="700">CUTAWAY VIEW</text>
    ${cutawayBox}
    <g><rect x="83" y="1589" width="914" height="99" rx="22" fill="url(#panelGlow)" stroke="#447e91" stroke-width="2"/>
      <path d="M 90 1598 L90 1677" stroke="${statusColor}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="129" cy="1641" r="16" fill="${t<6?'#66dca8':open?'#ffc25c':'#ff8658'}" />
      <text x="166" y="1653" fill="#f8fbff" font-family="Noto Sans, DejaVu Sans, sans-serif" font-weight="800" font-size="29">${phase}</text>
    </g>
    <text x="78" y="1749" fill="#9ed7e2" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="27">TIẾP ĐIỂM ĐỘNG</text>
    <path d="M280 1724 L${fmt(movingTipX-14)} 1400" stroke="#7ecad5" stroke-width="3" fill="none" />
    <text x="616" y="1749" fill="#e4c68e" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="27">TIẾP ĐIỂM TĨNH</text>
    <path d="M750 1717 L650 1407" stroke="#e4c68e" stroke-width="3" fill="none" />
    <rect x="70" y="1788" width="940" height="7" rx="3" fill="#2b4f66"/>
    <rect x="70" y="1788" width="${fmt(940*timeline)}" height="7" rx="3" fill="url(#yellowElectric)"/>
    <text x="72" y="1834" fill="#8fc7d8" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="21" font-weight="700">${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')} / 00:18</text>
    <rect x="68" y="1850" width="944" height="44" rx="12" fill="#17374c"/>
    <text x="540" y="1879" fill="#a8c6d2" font-family="Noto Sans, DejaVu Sans, sans-serif" font-size="19" text-anchor="middle">Minh họa nguyên lý • Không đại diện cho model máy cắt cụ thể</text>
  </g>
  </svg>`;
}
