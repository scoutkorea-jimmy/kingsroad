// 대한민국 광역시도 인터랙티브 지도 컴포넌트
// 경로 데이터: window.KOREA_REGIONS (components/KoreaMapData.js 에 정의)

const KoreaMap = ({ onSelect, selected }) => {
  const [hovered, setHovered] = React.useState(null);
  const regions = window.KOREA_REGIONS || [];

  return (
    <div style={{position:'relative', width:'100%'}}>
      <svg
        viewBox="0 0 524 631"
        style={{width:'100%', height:'auto', display:'block', overflow:'visible'}}
        aria-label="대한민국 광역시도 지도">
        <defs>
          <filter id="map-shadow" x="-8%" y="-8%" width="116%" height="116%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1B4FA0" floodOpacity="0.18"/>
          </filter>
        </defs>

        {regions.map(r => {
          const isHovered  = hovered === r.id;
          const isSelected = selected === r.id;
          const isActive   = isHovered || isSelected;
          return (
            <g key={r.id}>
              <path
                d={r.path}
                fill={isSelected ? '#1B4FA0' : isHovered ? '#DBEAFE' : '#EFF6FF'}
                stroke={isActive ? '#2563EB' : '#93C5FD'}
                strokeWidth={isActive ? 1.5 : 0.8}
                style={{cursor:'pointer', transition:'fill 0.15s ease, stroke 0.15s ease'}}
                filter={isActive ? 'url(#map-shadow)' : undefined}
                onClick={() => onSelect && onSelect(r)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                role="button"
                aria-label={r.fullname}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect && onSelect(r); }
                }}
              />
              <text
                x={r.cx} y={r.cy}
                textAnchor="middle"
                fontSize={r.id === 'sejong' ? 6 : (r.id === 'incheon' || r.id === 'gwangju' || r.id === 'daejeon' || r.id === 'ulsan') ? 7.5 : 9}
                fill={isSelected ? '#FFFFFF' : isHovered ? '#1E40AF' : '#334155'}
                fontFamily="var(--font-sans)"
                fontWeight={isActive ? '700' : '400'}
                style={{pointerEvents:'none', userSelect:'none', transition:'fill 0.15s ease'}}
              >{r.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

Object.assign(window, { KoreaMap });
