// 일월오봉도 인터랙티브 와이어프레임 SVG
// Props: style (outline|filled|dashed), intensity (0..2), animate, interactive
const Ilwolobongdo = ({ lineStyle = "outline", intensity = 1, animate = true, interactive = true, className = "" }) => {
  const svgRef = React.useRef(null);
  const [mouse, setMouse] = React.useState({ x: 0.5, y: 0.5 });
  const [time, setTime] = React.useState(0);

  // Respect prefers-reduced-motion — WCAG 3.0 motion Outcome
  const [reduceMotion, setReduceMotion] = React.useState(
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const effectiveAnimate = animate && !reduceMotion;
  const effectiveInteractive = interactive && !reduceMotion;

  React.useEffect(() => {
    if (!effectiveAnimate) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      setTime((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [effectiveAnimate]);

  const handleMove = (e) => {
    if (!effectiveInteractive || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // Parallax offsets
  const px = (mouse.x - 0.5) * 2; // -1..1
  const py = (mouse.y - 0.5) * 2;

  // Five peaks definition. centerX, peakY, baseY, width
  // Arrangement: outer-left, inner-left, center (tallest), inner-right, outer-right
  const peaks = [
    { cx: 120, top: 280, base: 520, w: 170 },
    { cx: 310, top: 220, base: 520, w: 210 },
    { cx: 500, top: 140, base: 520, w: 260 }, // center
    { cx: 690, top: 220, base: 520, w: 210 },
    { cx: 880, top: 280, base: 520, w: 170 },
  ];

  const buildPeak = (p, offset = 0) => {
    const { cx, top, base, w } = p;
    const left = cx - w / 2;
    const right = cx + w / 2;
    // ridges create folded rock line
    const midY1 = top + (base - top) * 0.35;
    const midY2 = top + (base - top) * 0.65;
    const jitter = offset;
    return `M ${left} ${base}
            L ${left + w*0.18} ${midY2 + jitter*2}
            L ${left + w*0.3} ${midY1 + jitter}
            L ${left + w*0.42} ${midY2 - jitter*1.5}
            L ${cx - w*0.05} ${top + jitter}
            L ${cx + w*0.08} ${top + 8 + jitter*2}
            L ${cx + w*0.22} ${midY1 - jitter}
            L ${cx + w*0.35} ${midY2 + jitter*1.8}
            L ${cx + w*0.48} ${midY1 + jitter*1.2}
            L ${right} ${base} Z`;
  };

  // water lines at base
  const waterLines = Array.from({ length: 5 }, (_, i) => {
    const y = 530 + i * 14;
    const phase = time * 0.5 + i * 0.7;
    const amp = 4 + i * 1;
    const d = Array.from({ length: 40 }, (_, j) => {
      const x = j * 25;
      const yo = y + Math.sin(phase + j * 0.3) * amp;
      return `${j === 0 ? "M" : "L"} ${x} ${yo}`;
    }).join(" ");
    return d;
  });

  // pine trees (stylized, wireframe) at corners
  const pineTree = (x, baseY, size) => {
    const h = size;
    const w = size * 0.5;
    return (
      <g transform={`translate(${x}, ${baseY})`}>
        {/* trunk */}
        <line x1="0" y1="0" x2="0" y2={-h*0.9} className="ilwol-line" />
        <line x1="-2" y1="0" x2="-2" y2={-h*0.9} className="ilwol-line-2" />
        {/* branches */}
        {Array.from({ length: 4 }).map((_, i) => {
          const y = -h * (0.25 + i * 0.2);
          const bw = w * (1.1 - i * 0.22);
          return (
            <g key={i}>
              <path d={`M 0 ${y} Q ${-bw*0.6} ${y+4} ${-bw} ${y-6}`} className="ilwol-line" />
              <path d={`M 0 ${y} Q ${bw*0.6} ${y+4} ${bw} ${y-6}`} className="ilwol-line" />
              {/* pine needles as short ticks */}
              {Array.from({ length: 6 }).map((_, j) => (
                <line key={j}
                  x1={-bw * (0.3 + j*0.12)} y1={y - 2 - j}
                  x2={-bw * (0.3 + j*0.12) - 4} y2={y - 8 - j}
                  className="ilwol-line-2" />
              ))}
              {Array.from({ length: 6 }).map((_, j) => (
                <line key={j+'r'}
                  x1={bw * (0.3 + j*0.12)} y1={y - 2 - j}
                  x2={bw * (0.3 + j*0.12) + 4} y2={y - 8 - j}
                  className="ilwol-line-2" />
              ))}
            </g>
          );
        })}
      </g>
    );
  };

  // sun & moon positions w/ slight drift
  const sunPulse = 1 + Math.sin(time * 0.8) * 0.03;
  const moonPulse = 1 + Math.sin(time * 0.6 + 1) * 0.03;

  const peakOffsetY = py * 6;
  const peakOffsetX = px * 10;
  const celestialOffsetX = px * 18;
  const celestialOffsetY = py * 10;

  const fillStyle = lineStyle === "filled";
  const dashed = lineStyle === "dashed";

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 620"
      className={`ilwol-svg ${className}`}
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMove}
      role="img"
      aria-labelledby="ilwol-title ilwol-desc"
      style={{ '--intensity': intensity }}
    >
      <title id="ilwol-title">일월오봉도 와이어프레임</title>
      <desc id="ilwol-desc">
        조선 어좌 뒤에 놓였던 일월오봉도를 선화(線畫)로 재해석한 장식 일러스트.
        다섯 봉우리, 해와 달, 소나무, 물결이 그려져 있습니다.
      </desc>
      <defs>
        <linearGradient id="goldGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--gold-2)" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.2"/>
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="var(--gold-2)" stopOpacity={0.8 * intensity}/>
          <stop offset="70%" stopColor="var(--gold)" stopOpacity={0.1 * intensity}/>
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="#F5E6A8" stopOpacity={0.6 * intensity}/>
          <stop offset="70%" stopColor="var(--gold)" stopOpacity={0.08 * intensity}/>
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0"/>
        </radialGradient>
        {/* grid texture */}
        <pattern id="ilwolGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--gold-dim)" strokeOpacity="0.08" strokeWidth="0.5"/>
        </pattern>
      </defs>

      {/* subtle grid backdrop */}
      <rect x="0" y="0" width="1000" height="620" fill="url(#ilwolGrid)"/>

      {/* SKY — horizontal guide lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i}
          x1="0" y1={40 + i * 30}
          x2="1000" y2={40 + i * 30}
          className="ilwol-line-2"
          strokeOpacity={0.1 + i * 0.02}
          strokeDasharray={dashed ? "4 6" : "none"}
        />
      ))}

      {/* SUN (red in original; here gold) — left side, higher */}
      <g transform={`translate(${180 + celestialOffsetX}, ${100 + celestialOffsetY}) scale(${sunPulse})`}>
        <circle r="70" fill="url(#sunGlow)" />
        <circle r="38" className="ilwol-line" strokeWidth="1.25" />
        <circle r="38" fill={fillStyle ? "var(--gold)" : "none"} opacity={fillStyle ? 0.25 : 0} />
        {/* radial ticks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2 + time * 0.1;
          return (
            <line key={i}
              x1={Math.cos(a) * 44} y1={Math.sin(a) * 44}
              x2={Math.cos(a) * 52} y2={Math.sin(a) * 52}
              className="ilwol-line-2"
            />
          );
        })}
        <text x="0" y="5" textAnchor="middle" fill="var(--gold)"
          fontFamily="var(--font-serif)" fontSize="28" opacity="0.85">日</text>
      </g>

      {/* MOON (right side) */}
      <g transform={`translate(${820 + celestialOffsetX}, ${100 + celestialOffsetY}) scale(${moonPulse})`}>
        <circle r="60" fill="url(#moonGlow)" />
        <circle r="34" className="ilwol-line" strokeWidth="1.25"
          strokeDasharray={dashed ? "3 4" : "none"} />
        <circle r="34" fill={fillStyle ? "var(--gold-ink)" : "none"} opacity={fillStyle ? 0.15 : 0} />
        <text x="0" y="5" textAnchor="middle" fill="var(--gold-ink)"
          fontFamily="var(--font-serif)" fontSize="26" opacity="0.85">月</text>
      </g>

      {/* FIVE PEAKS */}
      <g transform={`translate(${peakOffsetX * 0.5}, ${peakOffsetY * 0.5})`}>
        {peaks.map((p, i) => {
          const depth = i === 2 ? 0 : Math.abs(i - 2);
          const parallaxY = peakOffsetY * (depth * 0.4);
          const parallaxX = peakOffsetX * (depth * 0.3) * (i < 2 ? -1 : i > 2 ? 1 : 0);
          const breath = Math.sin(time * 0.4 + i) * 2;
          const d = buildPeak(p, breath);
          return (
            <g key={i} transform={`translate(${parallaxX}, ${parallaxY})`}>
              {fillStyle && (
                <path d={d} fill="url(#goldGrad)" opacity={0.18 * intensity} />
              )}
              <path d={d}
                className="ilwol-line"
                strokeDasharray={dashed ? "3 5" : "none"}
                strokeWidth={i === 2 ? 1.25 : 1}
              />
              {/* inner ridge lines */}
              <path d={`M ${p.cx - p.w*0.1} ${p.base} L ${p.cx - p.w*0.05} ${p.top + 10 + breath}`}
                className="ilwol-line-2" strokeDasharray={dashed ? "2 4" : "none"} />
              <path d={`M ${p.cx + p.w*0.15} ${p.base} L ${p.cx + p.w*0.08} ${p.top + 12 + breath}`}
                className="ilwol-line-2" strokeDasharray={dashed ? "2 4" : "none"} />
            </g>
          );
        })}

        {/* Center peak marker — 五 */}
        <text x="500" y="175" textAnchor="middle" fill="var(--gold-2)"
          fontFamily="var(--font-serif)" fontSize="18" opacity="0.6"
          style={{ opacity: 0.5 + Math.sin(time * 0.6) * 0.15 }}>五</text>
      </g>

      {/* Waterfalls — two on sides of center peak */}
      {[420, 560].map((x, i) => (
        <g key={i}>
          {Array.from({ length: 3 }).map((_, j) => (
            <line key={j}
              x1={x + j * 4} y1="290"
              x2={x + j * 4} y2="520"
              className="ilwol-line-2"
              strokeDasharray="2 8"
              strokeDashoffset={-time * 40 - j * 8}
            />
          ))}
        </g>
      ))}

      {/* Pine trees */}
      {pineTree(100, 520, 110)}
      {pineTree(900, 520, 110)}
      {pineTree(200, 530, 70)}
      {pineTree(800, 530, 70)}

      {/* Water at the base */}
      <g transform="translate(0, 0)">
        {waterLines.map((d, i) => (
          <path key={i} d={d}
            className="ilwol-line-2"
            strokeOpacity={0.4 - i * 0.05}
            strokeDasharray={dashed ? "4 4" : "none"}
          />
        ))}
      </g>

      {/* Corner annotations — technical-drawing feel */}
      <g fontFamily="var(--font-mono)" fontSize="9" fill="var(--gold-dim)" opacity="0.7">
        <text x="20" y="30">日月五峯圖 · WIREFRAME</text>
        <text x="20" y="44">W.1000 × H.620</text>
        <text x="980" y="30" textAnchor="end">fig.01</text>
        <text x="980" y="44" textAnchor="end">rev.2026.04</text>
        <text x="20" y="605">· 五峯 · 日 · 月 · 松 · 水 ·</text>
        <text x="980" y="605" textAnchor="end">王사들 · wangsadeul</text>
      </g>

      {/* Crosshair that follows mouse */}
      {effectiveInteractive && (
        <g opacity="0.4" style={{ transition: 'opacity .3s' }}>
          <line x1={mouse.x * 1000} y1="0" x2={mouse.x * 1000} y2="620"
            stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="2 6" />
          <line x1="0" y1={mouse.y * 620} x2="1000" y2={mouse.y * 620}
            stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx={mouse.x * 1000} cy={mouse.y * 620} r="6"
            fill="none" stroke="var(--gold)" strokeWidth="0.8" />
          <circle cx={mouse.x * 1000} cy={mouse.y * 620} r="1.5" fill="var(--gold)" />
        </g>
      )}
    </svg>
  );
};

// Small ornamental mark — used as brand mark / section dividers
const IlwolMark = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M2 20 L6 10 L9 14 L12 4 L15 14 L18 10 L22 20 Z"
      stroke="currentColor" strokeWidth="1" strokeLinejoin="miter" fill="none"/>
    <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.8"/>
    <circle cx="18" cy="6" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.7"/>
  </svg>
);

Object.assign(window, { Ilwolobongdo, IlwolMark });
