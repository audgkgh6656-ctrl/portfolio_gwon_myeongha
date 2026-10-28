# Portfolio V11 — 반응형 인트로 수정 완료

## 시작
`index.html`을 열면 스크롤 인트로 → 태블릿 메인입니다.
영상이 없을 때는 기본 애니메이션이 나타납니다.

## 영상 교체
1. `assets` 폴더에 `intro.mp4`를 넣으세요.
2. `index.html`의 `<source src="assets/intro.mp4" ...>`와 파일명이 일치하는지 확인하세요.
3. 권장: 1920×1080, MP4 H.264, 30fps.
4. `style.css`의 `#introVideo`가 반응형 화면 채우기(`object-fit:cover`)를 담당합니다.
5. `style.css`의 `.intro-scroll { height:500vh }`를 조정하면 스크롤 진행 속도가 바뀝니다.
6. 스크롤 완료 후에는 **ENTER PORTFOLIO 버튼만** 나타납니다. 버튼 위치는 `.intro-end a`의 `transform:translateY(50px)`로 조정하세요.

## 직접 수정
- `index.html`: 인트로 영상 경로, 메인 문구
- `style.css`: 인트로·메인·공통 스타일
- `script.js`: 스크롤 재생, 필터, 프로젝트 모달 정보
- `about.html`, `about.css`: 모노크롬 About, 프로필 및 정보
- `portfolio.html`: 프로젝트 카드
- `contact.html`, `resume.html`: 기타 페이지

이전 패키지에서 누락됐던 CSS/JS 파일도 포함했습니다.
개인 정보 및 학력/자격증/경력 날짜는 실제 내용으로 검토하여 수정하세요.

## V12 태블릿 확대
PC에서 메인 태블릿을 더 크게 보이도록 변경했습니다. `style.css` 맨 아래의 `.tablet { width: min(1520px, 96vw); }`에서 크기를 조정할 수 있습니다. 인트로와 서브페이지는 변경하지 않았습니다.


V13 changes:
- The area behind the tablet is now white.
- The large YOUR NAME heading is removed from the tablet dashboard.
- The menu tiles occupy more of the available tablet screen space.
- Intro video and subpages remain unchanged.


V15: portfolio.html updated to 4-column white layout based on supplied wireframe. Edit cards in portfolio.html, filter behavior and modal data in script.js, and visual styles in portfolio-page.css. Breakpoints: 4 columns desktop, 3 tablet, 2 mobile, 1 narrow phone. Gray squares are image placeholders.

V16
- About page updated based on sketch: centered heading, portrait + introduction, gray area with 2-column info cards, tools row, scroll reveal.
- Edit copy and dates directly in about.html; profile photo: assets/profile-placeholder.svg.
- Replace assets/intro.mp4 with your own MP4. Video fills desktop and mobile using object-fit:cover (may crop edges). To prevent cropping, add class video-contain to <section id="intro" class="intro-scroll"> in index.html.
- If the new video has a different duration, the scrub logic uses its loaded metadata. Use MP4 H.264 for broad browser compatibility. No video is bundled.

V18: Resume content implemented in resume.html with white background and editable placeholders. Shared typography/navigation in shared-pages.css across Portfolio/About/Contact/Resume. Resume layout in resume.css. Put a real PDF at assets/resume.pdf to enable the download button. Existing intro and tablet home unchanged.

V19: Portfolio project popup is now a wide 1160px long-scroll editorial detail view. Edit section text and replace gray image placeholders in portfolio.html; project title/category/intro data is in script.js. Scroll inside popup; close with ×, bottom button, backdrop, or Escape.

V20: Unified page heading typography across Portfolio, About, Contact, Resume; Pretendard font sitewide. Edit typography.css to change title size. Pretendard loads from a public CDN, requiring internet; Korean system font fallback is provided.


V22 — Creative Tools card slider
- The Creative Tools card on index.html and home.html now cycles through four images.
- Replace assets/slide-01.svg to slide-04.svg with your own files, OR change the four img src attributes in index.html and home.html to .jpg/.png/.webp files.
- Images crop to fill the card (object-fit: cover). Adjust in style.css.
- Automatic slide change: 4000ms in script.js. Previous/next arrows and dots work by click. Pause on hover or keyboard focus.
- Original intro, other tiles and subpages are unchanged.

V23: Creative Tools slider now auto-advances every 3 seconds. Only four simple white/green pagination dots; arrows and dark background bar removed. Edit images in index.html and home.html.
