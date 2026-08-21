#!/usr/bin/env node
// 뱅기노자 — 검색·AI 크롤러용 정적 페이지 생성 (v00.296)
//
// 왜 필요한가 (2026-08-21 실측):
//   ① bgnj.net/community · /column · /book · /tour … 홈을 뺀 모든 주소가 **HTTP 404** 였다.
//      GitHub Pages 는 없는 경로에 404.html 을 404 상태로 준다. sitemap.xml 에 적어 둔 10개가
//      전부 404 를 받고 있었으니, 색인이 되기는커녕 '죽은 링크 목록' 으로 신뢰만 깎였다.
//   ② 크롤러가 받는 HTML 본문이 231자였다 — "JavaScript로 렌더링됩니다" 가 전부.
//      구글봇은 JS 를 돌려 결국 보지만, **네이버봇(Yeti)과 AI 크롤러는 JS 를 돌리지 않는다.**
//      글 88편·칼럼 72편이 그들에게는 존재하지 않았다.
//
// 무엇을 하는가:
//   운영 API 에서 실제 콘텐츠를 받아, 주소마다 진짜 내용이 담긴 index.html 을 만든다.
//   내용은 <div id="root"> 안에 넣는다 — React 가 부팅하면서 그대로 덮어쓰므로
//   사람에게는 지금과 똑같은 SPA 이고, 크롤러에게만 읽을 것이 생긴다. 클로킹이 아니다(같은 내용).
//
// 실행: node tools/seo-build.mjs
//
// ⚠ 주의 — 인라인 <script> 를 새로 넣지 말 것.
//   index.html 의 CSP 는 인라인 스크립트 SHA-256 해시를 못 박아 두고 있다(csp-hashes.mjs).
//   새 인라인 스크립트를 넣으면 해시가 안 맞아 통째로 차단된다.
//   그래서 글 번호 같은 힌트는 <body data-bgnj-*> 속성으로 넘긴다.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://bgnj.net";
const API = "https://api.bgnj.net/api";

const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// 사용자가 쓴 HTML 을 그대로 심지 않는다. 텍스트만 뽑아 문단으로 다시 만든다.
// 정적 파일이라 우리가 만드는 것이지만, 남이 쓴 마크업을 통과시킬 이유가 없다.
const htmlToParagraphs = (html, limit = 4000) => {
  const text = String(html || "")
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, " ")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|h[1-6]|li|tr)\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, limit);
  return text.split(/\n{2,}/).filter(Boolean).map((p) => `<p>${esc(p.trim())}</p>`).join("\n");
};

const plain = (html, limit = 160) => {
  const t = String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return t.length > limit ? `${t.slice(0, limit - 1)}…` : t;
};

const getJson = async (url) => {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
};

// ── 템플릿 ────────────────────────────────────────────────────────────
// index.html 이 곧 템플릿이고, 홈은 그 자리에 덮어쓴다. 그래서 **먼저 원래 상태로 되돌린다.**
//   되돌리지 않으면 두 번째 실행부터 JSON-LD 가 겹겹이 쌓이고,
//   #root 정규식이 안 맞아 홈 내용이 갱신되지 않는다 — 오류도 없이 조용히.
//   (실제로 첫 판에서 그랬다: 재실행하니 ld+json 이 2 → 3 으로 늘었다.)
const normalize = (html) => html
  .replace(/<div id="root">[\s\S]*?<\/main>\s*<\/div>/i, '<div id="root"></div>')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, "")
  .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
  .replace(/<meta\s+property="og:url"[^>]*>\s*/gi, "");

const template = normalize(await fs.readFile(path.join(ROOT, "index.html"), "utf8"));

// 하위 경로(/community/98/)에서도 자산을 찾을 수 있게 상대경로를 절대경로로 바꾼다.
// 이걸 빼먹으면 /community/98/dist/app.js 를 찾아 화면이 통째로 안 뜬다.
const absolutize = (html) =>
  html.replace(/\b(src|href)="(?!https?:\/\/|\/\/|\/|#|data:|mailto:)([^"]+)"/g, '$1="/$2"');

const replaceTag = (html, re, value) => (re.test(html) ? html.replace(re, value) : html);

const buildPage = ({ pathname, title, description, bodyHtml, jsonLd, bodyAttrs = "", image }) => {
  let out = absolutize(template);
  const canonical = `${SITE}${pathname}`;

  out = replaceTag(out, /<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  out = replaceTag(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${esc(description)}">`);
  out = replaceTag(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${esc(title)}">`);
  out = replaceTag(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${esc(description)}">`);
  if (image) {
    out = replaceTag(out, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${esc(image)}">`);
  }

  // canonical + og:url — 없으면 새로 넣는다.
  const head = [
    `<link rel="canonical" href="${esc(canonical)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
  ].join("\n");
  out = out.replace(/<link\s+rel="canonical"[^>]*>/gi, "");
  out = out.replace(/<meta\s+property="og:url"[^>]*>/gi, "");
  out = out.replace(/<\/head>/i, `${head}\n<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`);

  if (bodyAttrs) out = out.replace(/<body>/i, `<body ${bodyAttrs}>`);
  // 크롤러용 내용은 #root 안에 — React 가 부팅하며 통째로 덮어쓴다.
  out = out.replace(/<div id="root"><\/div>/i, `<div id="root">\n<main id="seo-main">\n${bodyHtml}\n</main>\n</div>`);
  return out;
};

const write = async (pathname, html) => {
  const dir = path.join(ROOT, pathname.replace(/^\//, ""));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), html, "utf8");
};

// ── 데이터 수집 ───────────────────────────────────────────────────────
console.log("운영 API 에서 콘텐츠를 받는 중…");
const [postsRes, colsRes, booksRes, catsRes, toursRes, lecsRes] = await Promise.all([
  getJson(`${API}/posts`), getJson(`${API}/columns`), getJson(`${API}/books`),
  getJson(`${API}/categories`), getJson(`${API}/tours`).catch(() => ({ tours: [] })),
  getJson(`${API}/lectures`).catch(() => ({ lectures: [] })),
]);
const posts = postsRes.posts || [];
const columns = colsRes.columns || colsRes.userColumns || Object.values(colsRes)[0] || [];
const books = booksRes.books || [];
const categories = catsRes.categories || [];
const tours = toursRes.tours || [];
const lectures = lecsRes.lectures || [];
console.log(`  글 ${posts.length} · 칼럼 ${columns.length} · 책 ${books.length} · 게시판 ${categories.length}`);

const ORG = {
  "@type": "Organization",
  name: "뱅기노자",
  alternateName: "BANGINOJA",
  url: SITE,
  email: "contact@bgnj.net",
  description: "한국의 역사·문화·자연을 함께 여행하는 커뮤니티",
};

const urls = [];
const addUrl = (loc, lastmod, changefreq, priority) => urls.push({ loc, lastmod, changefreq, priority });

// ── 1) 홈 ────────────────────────────────────────────────────────────
{
  const recent = [...columns].slice(0, 10);
  const body = `
<h1>뱅기노자 — 뱅기 타고 한국을 느끼다</h1>
<p>한국의 역사·문화·자연을 함께 여행하는 커뮤니티입니다. 궁궐 답사, 지역 여행, 역사 칼럼, 그리고 함께 나누는 기록.</p>
<h2>바로가기</h2>
<ul>
  <li><a href="/column">뱅기노자 칼럼 (${columns.length}편)</a></li>
  <li><a href="/community">광장 — 함께 쓰는 기록 (${posts.length}편)</a></li>
  <li><a href="/book">뱅기노자 도서 (${books.length}권)</a></li>
  <li><a href="/tour">투어 프로그램</a></li>
  <li><a href="/lectures">강연</a></li>
</ul>
<h2>최근 칼럼</h2>
<ul>${recent.map((c) => `<li><a href="/column/${esc(c.id)}">${esc(c.title)}</a></li>`).join("\n")}</ul>`;
  await fs.writeFile(path.join(ROOT, "index.html"), buildPage({
    pathname: "/",
    title: "뱅기노자 — 뱅기 타고 한국을 느끼다",
    description: "한국의 역사·문화·자연을 함께 여행하는 커뮤니티. 궁궐 답사부터 지역 여행까지, 역사 칼럼과 기록을 나눕니다.",
    bodyHtml: body,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        { ...ORG, "@id": `${SITE}/#org` },
        {
          "@type": "WebSite", "@id": `${SITE}/#site`, url: SITE, name: "뱅기노자",
          inLanguage: "ko-KR", publisher: { "@id": `${SITE}/#org` },
        },
      ],
    },
  }), "utf8");
  addUrl(`${SITE}/`, new Date().toISOString().slice(0, 10), "daily", "1.0");
  console.log("  ✓ / (홈)");
}

// ── 2) 목록 페이지 ────────────────────────────────────────────────────
const listPages = [
  { p: "/column", title: `뱅기노자 칼럼 (${columns.length}편)`, desc: "역사와 도시를 읽는 뱅기노자의 칼럼.",
    items: columns.map((c) => ({ href: `/column/${c.id}`, title: c.title, sub: plain(c.excerpt || c.body, 100) })) },
  { p: "/community", title: `광장 — 함께 쓰는 기록 (${posts.length}편)`, desc: "회원들이 함께 남기는 답사기·감상문·소식.",
    items: posts.map((x) => ({ href: `/community/${x.id}`, title: x.title, sub: `${x.category || ""} · ${x.author || ""}` })) },
  { p: "/book", title: `뱅기노자 도서 (${books.length}권)`, desc: "뱅기노자가 짓고 엮은 책.",
    items: books.map((b) => ({ href: "/book", title: b.title, sub: b.subtitle || b.intro || "" })) },
  { p: "/tour", title: "투어 프로그램", desc: "뱅기노자와 함께 걷는 답사 프로그램.",
    items: tours.map((t) => ({ href: "/tour", title: t.title, sub: t.summary || t.description || "" })) },
  { p: "/lectures", title: "강연", desc: "뱅기노자 강연 일정과 기록.",
    items: lectures.map((l) => ({ href: "/lectures", title: l.title || l.topic, sub: l.venue || "" })) },
  { p: "/sleep", title: "자고 놀자 · 한켠", desc: "한켠에서 머물고 쉬어가는 공간." , items: [] },
  { p: "/faq", title: "자주 묻는 질문", desc: "가입·결제·강연·답사·책 주문 안내.", items: [] },
  { p: "/terms", title: "이용약관", desc: "뱅기노자 이용약관.", items: [] },
  { p: "/privacy", title: "개인정보 처리방침", desc: "뱅기노자 개인정보 처리방침.", items: [] },
];
for (const lp of listPages) {
  const body = `
<h1>${esc(lp.title)}</h1>
<p>${esc(lp.desc)}</p>
${lp.items.length ? `<ul>${lp.items.map((i) =>
  `<li><a href="${esc(i.href)}">${esc(i.title)}</a>${i.sub ? ` — ${esc(i.sub)}` : ""}</li>`).join("\n")}</ul>` : ""}
<p><a href="/">뱅기노자 홈</a></p>`;
  await write(lp.p, buildPage({
    pathname: lp.p,
    title: `${lp.title} — 뱅기노자`,
    description: lp.desc,
    bodyHtml: body,
    jsonLd: {
      "@context": "https://schema.org", "@type": "CollectionPage",
      name: lp.title, description: lp.desc, url: `${SITE}${lp.p}`,
      isPartOf: { "@id": `${SITE}/#site` }, publisher: { "@id": `${SITE}/#org` },
    },
  }));
  addUrl(`${SITE}${lp.p}`, new Date().toISOString().slice(0, 10), lp.items.length ? "daily" : "monthly", lp.items.length ? "0.9" : "0.4");
  console.log(`  ✓ ${lp.p} (${lp.items.length}건)`);
}

// ── 3) 글·칼럼 상세 ───────────────────────────────────────────────────
const detail = async ({ base, id, title, author, date, html, images, extra, attr }) => {
  const pathname = `${base}/${id}`;
  const imgs = (Array.isArray(images) ? images : []).slice(0, 5);
  const body = `
<article>
  <h1>${esc(title)}</h1>
  <p>${esc(author || "뱅기노자")}${date ? ` · ${esc(String(date).slice(0, 10))}` : ""}${extra ? ` · ${esc(extra)}` : ""}</p>
  ${imgs.map((im) => `<img src="${esc(im.dataUrl || im.src || "")}" alt="${esc(im.alt || im.name || title)}" loading="lazy">`).join("\n")}
  ${htmlToParagraphs(html)}
</article>
<p><a href="${esc(base)}">목록으로</a> · <a href="/">뱅기노자 홈</a></p>`;
  await write(pathname, buildPage({
    pathname, title: `${title} — 뱅기노자`,
    description: plain(html, 160) || title,
    image: imgs[0]?.dataUrl || imgs[0]?.src,
    bodyHtml: body,
    bodyAttrs: attr,
    jsonLd: {
      "@context": "https://schema.org", "@type": "Article",
      headline: title, author: { "@type": "Person", name: author || "뱅기노자" },
      datePublished: date || undefined, inLanguage: "ko-KR",
      image: imgs.map((im) => im.dataUrl || im.src).filter(Boolean),
      mainEntityOfPage: `${SITE}${pathname}`,
      publisher: { "@id": `${SITE}/#org` },
    },
  }));
  addUrl(`${SITE}${pathname}`, String(date || "").slice(0, 10) || new Date().toISOString().slice(0, 10), "monthly", "0.7");
};

for (const p of posts) {
  await detail({
    base: "/community", id: p.id, title: p.title, author: p.author,
    date: p.created_at || p.createdAt, html: (p.body && p.body.html) || p.body || "",
    images: p.images, extra: p.category, attr: `data-bgnj-post="${esc(p.id)}"`,
  });
}
console.log(`  ✓ /community/* (${posts.length}건)`);

for (const c of columns) {
  await detail({
    base: "/column", id: c.id, title: c.title, author: c.author_name || c.authorName,
    date: c.created_at || c.createdAt, html: c.body || c.excerpt || "",
    images: c.cover_url ? [{ dataUrl: c.cover_url, alt: c.title }] : [],
    extra: c.category, attr: `data-bgnj-column="${esc(c.id)}"`,
  });
}
console.log(`  ✓ /column/* (${columns.length}건)`);

// ── 4) sitemap.xml ───────────────────────────────────────────────────
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- tools/seo-build.mjs 가 자동 생성한다. 직접 고치지 말 것 — 다음 실행에 덮어쓴다. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
await fs.writeFile(path.join(ROOT, "sitemap.xml"), sitemap, "utf8");
console.log(`  ✓ sitemap.xml (${urls.length}개 주소)`);

console.log(`\n✅ 정적 페이지 ${urls.length}개 생성 완료.`);
