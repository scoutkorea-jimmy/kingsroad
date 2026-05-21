// v00.263.000 — 지난 투어/지난 강연 게시판 행 목록.
// 사용자 요청: "지난 투어/강연은 페이지 형태 말고 게시판 목록 형태 + 행 클릭 시 상세".
// 양 페이지 공통이라 DRY 원칙으로 컴포넌트 분리.
//
// 사용:
//   <PastBoardList items={toursPast} type="tour" onSelect={(id) => setPastDetailId(id)}/>
//   <PastBoardList items={lecturesPast} type="lecture" onSelect={(id) => setPastDetailId(id)}/>
//
// props:
//   items     — 정렬된 (startsAt DESC) 지난 항목 배열. 각 item: { id, title, subtitle, startsAt, capacity, group/format, ... }
//   type      — 'tour' | 'lecture' (라벨/접근성 용도)
//   onSelect  — (id) => void

const PastBoardList = ({ items = [], type = 'tour', onSelect }) => {
  const F = window.BGNJ_FMT;
  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '-';
      return F?.kstDate ? F.kstDate(d) : `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
    } catch { return '-'; }
  };
  const formatScale = (item) => {
    const capNum = Number(item?.capacity);
    if (Number.isFinite(capNum) && capNum > 0) return `${capNum}인 이하`;
    return item?.group || item?.format || '-';
  };
  const reviewsOf = (id) => {
    try {
      const store = type === 'tour' ? window.BGNJ_TOURS : window.BGNJ_LECTURES;
      const arr = store?.listReviews?.(id);
      return Array.isArray(arr) ? arr.length : 0;
    } catch { return 0; }
  };

  if (!items.length) {
    return (
      <div style={{padding:'60px 20px', textAlign:'center'}}>
        <p className="dim" style={{fontSize:14}}>지난 {type === 'tour' ? '답사' : '강연'}이 없습니다.</p>
      </div>
    );
  }

  const handleKey = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <div className="bgnj-past-board" role="list" aria-label={`지난 ${type === 'tour' ? '답사' : '강연'} 목록`}>
      {/* Header (데스크톱만) */}
      <div className="bgnj-past-row bgnj-past-head" aria-hidden="true">
        <span className="bgnj-past-col-date">일시</span>
        <span className="bgnj-past-col-title">제목</span>
        <span className="bgnj-past-col-scale">규모</span>
        <span className="bgnj-past-col-reviews">후기</span>
        <span className="bgnj-past-col-arrow"/>
      </div>
      {items.map((item) => {
        const id = item?.id;
        const reviews = reviewsOf(id);
        return (
          <div key={id}
            className="bgnj-past-row bgnj-past-item"
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(id)}
            onKeyDown={(e) => handleKey(e, id)}
            aria-label={`${item?.title || '제목 없음'} — 자세히 보기`}>
            <span className="bgnj-past-col-date mono">{formatDate(item?.startsAt)}</span>
            <span className="bgnj-past-col-title">
              <span className="bgnj-past-title-main">{item?.title || '제목 없음'}</span>
              {item?.subtitle && (
                <span className="bgnj-past-title-sub dim-2"> — {item.subtitle}</span>
              )}
            </span>
            <span className="bgnj-past-col-scale mono dim">{formatScale(item)}</span>
            <span className="bgnj-past-col-reviews mono dim">{reviews > 0 ? `후기 ${reviews}건` : '-'}</span>
            <span className="bgnj-past-col-arrow gold-2" aria-hidden="true">→</span>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { PastBoardList });
