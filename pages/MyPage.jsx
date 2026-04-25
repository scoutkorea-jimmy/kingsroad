// 마이페이지
const MyPage = ({ go, user, cart }) => {
  const data = window.WANGSADEUL_DATA;
  const grades = window.WSD_STORES?.grades || [];
  const grade = grades.find((item) => item.id === user?.gradeId);
  const upcomingLecture = data.lectures?.[0];
  const upcomingTour = data.tours?.[0];
  const recentPost = data.posts?.find((post) => post.author === user?.name) || data.posts?.[0];

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
            <div className="mono dim-2" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 }}>UPCOMING LECTURE</div>
            <h3 className="ko-serif" style={{ fontSize: 20, marginBottom: 10 }}>{upcomingLecture?.topic || "예정 강연 없음"}</h3>
            <p className="dim" style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
              {upcomingLecture ? `${upcomingLecture.next} · ${upcomingLecture.venue}` : "등록된 강연 일정이 없습니다."}
            </p>
            <button type="button" className="btn btn-small" onClick={() => go("home")}>홈에서 일정 보기</button>
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
            <div className="mono dim-2" style={{ fontSize: 10, letterSpacing: "0.22em", marginBottom: 8 }}>ORDER STATUS</div>
            <h3 className="ko-serif" style={{ fontSize: 20, marginBottom: 10 }}>{cart ? "주문 진행 중" : "주문 없음"}</h3>
            <p className="dim" style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
              {cart ? `${cart.title} · ${cart.option} · ${cart.qty}권` : "현재 장바구니 또는 진행 중인 주문이 없습니다."}
            </p>
            <button type="button" className="btn btn-small" onClick={() => go(cart ? "checkout" : "book")}>
              {cart ? "주문 계속하기" : "책 보러 가기"}
            </button>
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
      </div>
    </div>
  );
};

Object.assign(window, { MyPage });
