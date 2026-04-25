// 마이페이지
const MyPage = ({ go, user, cart }) => {
  const data = window.WANGSADEUL_DATA;
  const grades = window.WSD_STORES?.grades || [];
  const grade = grades.find((item) => item.id === user?.gradeId);
  const upcomingLecture = data.lectures?.[0];
  const upcomingTour = data.tours?.[0];
  const communityPosts = window.WSD_COMMUNITY?.listPosts?.() || data.posts || [];
  const recentPost = communityPosts.find((post) => post.authorId === user?.id || post.author === user?.name) || communityPosts[0];
  const bookmarkedPosts = user
    ? (window.WSD_COMMUNITY?.listBookmarkedPosts?.(user.id) || [])
    : [];
  const notifications = user
    ? (window.WSD_COMMUNITY?.listNotifications?.(user.id) || [])
    : [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const myLectureRegs = user
    ? (window.WSD_LECTURES?.listMyRegistrations?.(user.id) || [])
    : [];
  const myOrders = user
    ? (window.WSD_BOOK_ORDERS?.listMine?.(user.id) || [])
    : [];
  const orderStatusLabel = (s) => ({
    pending_payment: '입금 대기',
    paid: '입금 확인 · 발송 준비',
    shipped: '배송중',
    delivered: '배송 완료',
    cancelled: '취소됨',
  }[s] || s);
  const orderStatusTone = (s) => ({
    pending_payment: 'var(--ink-2)',
    paid: 'var(--gold)',
    shipped: 'var(--gold)',
    delivered: 'var(--gold)',
    cancelled: 'var(--danger)',
  }[s] || 'var(--ink-2)');

  const goToPost = (postId) => {
    try { sessionStorage.setItem('wsd_pending_post_id', String(postId)); } catch {}
    go('community');
  };
  const goToLecture = (lectureId) => {
    try { sessionStorage.setItem('wsd_pending_lecture_id', String(lectureId)); } catch {}
    go('lectures');
  };
  const lectureStatusLabel = (s) => ({
    pending_payment: '입금 대기',
    confirmed: '참가 확정',
    waitlist: '대기자',
    cancelled: '취소됨',
  }[s] || s);
  const lectureStatusTone = (s) => ({
    confirmed: 'var(--gold)',
    waitlist: 'var(--ink-2)',
    cancelled: 'var(--danger)',
    pending_payment: 'var(--ink-2)',
  }[s] || 'var(--ink-2)');

  if (!user) {
    return (
      <div className="section" style={{ minHeight: "calc(100vh - 72px)", display: "grid", placeItems: "center" }}>
        <div className="card" style={{ maxWidth: 520, textAlign: "center", padding: 40 }}>
          <div className="mono gold" style={{ fontSize: 11, letterSpacing: "0.24em", marginBottom: 12 }}>MY PAGE</div>
          <h1 className="ko-serif" style={{ fontSize: 28, marginBottom: 14 }}>로그인이 필요합니다</h1>
          <p className="dim" style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
            마이페이지에서는 계정 정보, 예정된 강연과 답사, 주문 상태를 확인할 수 있습니다.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <button type="button" className="btn btn-gold" onClick={() => go("login")}>로그인</button>
            <button type="button" className="btn" onClick={() => go("home")}>홈으로</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <SectionHead
          eyebrow="MY PAGE · 회원 정보"
          title={<><span className="accent">{user.name}</span> 님의 서재</>}
          subtitle="왕사들에서의 계정 상태, 예정된 프로그램, 최근 활동을 한 곳에서 확인합니다."
          action={<button type="button" className="btn btn-small" onClick={() => go("community")}>커뮤니티로 이동</button>}
        />

        <div className="grid grid-2" style={{ alignItems: "start", marginBottom: 32 }}>
          <div className="card card-gold">
            <div className="mono gold" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 }}>ACCOUNT</div>
            <h3 className="ko-serif" style={{ fontSize: 22, marginBottom: 16 }}>{user.name}</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="dim">이메일</span>
                <span>{user.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="dim">회원 등급</span>
                <span className="gold">{grade?.label || user.gradeId || "미설정"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="dim">권한</span>
                <span>{user.isAdmin ? "관리자" : "일반 회원"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="dim">가입 시각</span>
                <span>{user.joinedAt ? new Date(user.joinedAt).toLocaleDateString("ko-KR") : "미기록"}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="mono gold" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 }}>PROFILE</div>
            <h3 className="ko-serif" style={{ fontSize: 22, marginBottom: 16 }}>등록 정보</h3>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="dim">전화번호</span>
                <span>{user.profile?.phone || "미입력"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="dim">생년월일</span>
                <span>{user.profile?.birthdate || "미입력"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="dim">관심 분야</span>
                <span>{user.profile?.interest || "미선택"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="dim">마케팅 수신</span>
                <span>{user.consents?.marketing ? "동의" : "미동의"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginBottom: 32 }}>
          <article className="card">
            <div className="mono dim-2" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 }}>MY LECTURES</div>
            <h3 className="ko-serif" style={{ fontSize: 20, marginBottom: 10 }}>
              내 신청 강연 <span className="dim-2 mono" style={{ fontSize: 12 }}>{myLectureRegs.length}건</span>
            </h3>
            {myLectureRegs.length === 0 ? (
              <>
                <p className="dim" style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>아직 신청한 강연이 없습니다. 강연 페이지에서 신청해 보세요.</p>
                <button type="button" className="btn btn-small" onClick={() => go("lectures")}>강연 일정 보기</button>
              </>
            ) : (
              <>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, marginBottom: 14 }}>
                  {myLectureRegs.slice(0, 4).map((r) => (
                    <li key={r.id}>
                      <button type="button" onClick={() => goToLecture(r.lectureId)}
                        style={{
                          all: 'unset', cursor: 'pointer', width: '100%',
                          padding: '10px 12px',
                          borderLeft: `2px solid ${lectureStatusTone(r.status)}`,
                          background: 'rgba(212,175,55,0.04)',
                        }}>
                        <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}>
                          {r.lecture?.topic || '강연'}
                        </div>
                        <div className="mono dim-2" style={{ fontSize: 10, letterSpacing: '0.1em' }}>
                          {r.lecture?.next || ''} · {r.count}명 ·{' '}
                          <span style={{ color: lectureStatusTone(r.status) }}>{lectureStatusLabel(r.status)}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                {myLectureRegs.length > 4 && (
                  <div className="dim-2 mono" style={{ fontSize: 11, textAlign: 'right', marginBottom: 8 }}>외 {myLectureRegs.length - 4}건</div>
                )}
                <button type="button" className="btn btn-small" onClick={() => go("lectures")}>강연 전체 보기</button>
              </>
            )}
          </article>

          <article className="card">
            <div className="mono dim-2" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 }}>UPCOMING TOUR</div>
            <h3 className="ko-serif" style={{ fontSize: 20, marginBottom: 10 }}>{upcomingTour?.title || "예정 답사 없음"}</h3>
            <p className="dim" style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
              {upcomingTour ? `${upcomingTour.next} · ${upcomingTour.price}` : "등록된 답사 일정이 없습니다."}
            </p>
            <button type="button" className="btn btn-small" onClick={() => go("tour")}>답사 프로그램 보기</button>
          </article>

          <article className="card">
            <div className="mono dim-2" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 }}>『왕의길』 ORDERS</div>
            <h3 className="ko-serif" style={{ fontSize: 20, marginBottom: 10 }}>
              내 주문 내역 <span className="dim-2 mono" style={{ fontSize: 12 }}>{myOrders.length}건</span>
            </h3>
            {myOrders.length === 0 ? (
              <>
                <p className="dim" style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>
                  {cart ? '결제 단계로 이동해 주문을 마무리하세요.' : '아직 주문 내역이 없습니다.'}
                </p>
                <button type="button" className="btn btn-small" onClick={() => go(cart ? "checkout" : "book")}>
                  {cart ? "주문 계속하기" : "책 보러 가기"}
                </button>
              </>
            ) : (
              <>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, marginBottom: 14 }}>
                  {myOrders.slice(0, 4).map((o) => (
                    <li key={o.id}
                      style={{
                        padding: '10px 12px',
                        borderLeft: `2px solid ${orderStatusTone(o.status)}`,
                        background: 'rgba(212,175,55,0.04)',
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                        <span className="mono dim-2" style={{ fontSize: 10, letterSpacing: '0.16em' }}>{o.orderNo}</span>
                        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: orderStatusTone(o.status) }}>{orderStatusLabel(o.status)}</span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                        『왕의길』 · {o.version === 'KR' ? '국문판' : '영문판'} × {o.qty} · <span className="gold">{o.total.toLocaleString()}원</span>
                      </div>
                      {o.tracking && (
                        <div className="dim-2 mono" style={{ fontSize: 10, marginTop: 4 }}>송장 {o.tracking}</div>
                      )}
                    </li>
                  ))}
                </ul>
                {myOrders.length > 4 && (
                  <div className="dim-2 mono" style={{ fontSize: 11, textAlign: 'right', marginBottom: 8 }}>외 {myOrders.length - 4}건</div>
                )}
                <button type="button" className="btn btn-small" onClick={() => go("book")}>책 정보 다시 보기</button>
              </>
            )}
          </article>
        </div>

        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <article className="card">
            <div className="mono gold" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 }}>RECENT ACTIVITY</div>
            <h3 className="ko-serif" style={{ fontSize: 22, marginBottom: 12 }}>최근 커뮤니티 활동</h3>
            {recentPost ? (
              <>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <span className="pill">{recentPost.category}</span>
                  <span className="mono dim-2" style={{ fontSize: 10 }}>{recentPost.date}</span>
                </div>
                <p style={{ fontSize: 15, marginBottom: 8 }}>{recentPost.title}</p>
                <p className="dim" style={{ fontSize: 13, lineHeight: 1.8 }}>
                  댓글 {recentPost.replies}개 · 조회 {recentPost.views}회
                </p>
              </>
            ) : (
              <p className="dim">아직 활동 내역이 없습니다.</p>
            )}
          </article>

          <article className="card">
            <div className="mono gold" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 }}>NEXT STEP</div>
            <h3 className="ko-serif" style={{ fontSize: 22, marginBottom: 12 }}>추천 동선</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <button type="button" className="btn btn-small" onClick={() => go("home")}>메인 홈에서 강연 일정 확인</button>
              <button type="button" className="btn btn-small" onClick={() => go("column")}>뱅기노자 칼럼 읽기</button>
              <button type="button" className="btn btn-small" onClick={() => go("community")}>커뮤니티 참여하기</button>
            </div>
          </article>
        </div>

        <div className="grid grid-2" style={{ alignItems: "start", marginTop: 32 }}>
          <article className="card">
            <div className="mono gold" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 }}>BOOKMARKS</div>
            <h3 className="ko-serif" style={{ fontSize: 22, marginBottom: 12 }}>북마크한 글 <span className="dim-2 mono" style={{ fontSize: 12 }}>{bookmarkedPosts.length}건</span></h3>
            {bookmarkedPosts.length === 0 ? (
              <p className="dim" style={{ fontSize: 13, lineHeight: 1.8 }}>커뮤니티 글 상세에서 ☆ 북마크 버튼을 눌러 보관할 수 있어요.</p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
                {bookmarkedPosts.slice(0, 8).map((post) => (
                  <li key={post.id}>
                    <button type="button" onClick={() => goToPost(post.id)}
                      style={{
                        all: 'unset', cursor: 'pointer', width: '100%',
                        padding: '10px 12px', borderLeft: '2px solid var(--gold-dim)',
                        background: 'rgba(212,175,55,0.04)',
                      }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                        <span className="pill" style={{ fontSize: 9 }}>{post.category}</span>
                        <span className="mono dim-2" style={{ fontSize: 10 }}>{post.date}</span>
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{post.title}</div>
                    </button>
                  </li>
                ))}
                {bookmarkedPosts.length > 8 && (
                  <li className="dim-2 mono" style={{ fontSize: 11, textAlign: 'right' }}>외 {bookmarkedPosts.length - 8}건</li>
                )}
              </ul>
            )}
          </article>

          <article className="card">
            <div className="mono gold" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 10 }}>NOTIFICATIONS</div>
            <h3 className="ko-serif" style={{ fontSize: 22, marginBottom: 12 }}>
              알림 <span className="dim-2 mono" style={{ fontSize: 12 }}>{notifications.length}건</span>
              {unreadCount > 0 && <span className="gold mono" style={{ fontSize: 11, marginLeft: 8 }}>· 안 읽음 {unreadCount}</span>}
            </h3>
            {notifications.length === 0 ? (
              <p className="dim" style={{ fontSize: 13, lineHeight: 1.8 }}>아직 받은 알림이 없습니다. 내가 작성한 글에 댓글이 달리면 여기에서 확인할 수 있어요.</p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
                {notifications.slice(0, 6).map((n) => (
                  <li key={n.id}>
                    <button type="button" onClick={() => {
                        window.WSD_COMMUNITY.markNotificationRead(user.id, n.id);
                        if (n.postId) goToPost(n.postId);
                      }}
                      style={{
                        all: 'unset', cursor: 'pointer', width: '100%',
                        padding: '10px 12px',
                        borderLeft: '2px solid ' + (n.read ? 'var(--line)' : 'var(--gold)'),
                        background: n.read ? 'transparent' : 'rgba(212,175,55,0.04)',
                      }}>
                      <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}>
                        <span className="gold">{n.fromName}</span>
                        <span className="dim"> · {n.message || '새 알림'}</span>
                      </div>
                      {n.postTitle && (
                        <div className="dim" style={{ fontSize: 12, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          ▸ {n.postTitle}
                        </div>
                      )}
                      <div className="mono dim-2" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.1em' }}>
                        {new Date(n.createdAt).toLocaleString('ko-KR')}
                      </div>
                    </button>
                  </li>
                ))}
                {notifications.length > 6 && (
                  <li className="dim-2 mono" style={{ fontSize: 11, textAlign: 'right' }}>외 {notifications.length - 6}건</li>
                )}
              </ul>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { MyPage });
