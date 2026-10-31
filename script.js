
/* V11 — 인트로 영상 스크롤 제어 + 포트폴리오 필터/모달 */
const intro = document.getElementById("intro");
if (intro) {
  const video = document.getElementById("introVideo");
  const fallback = document.getElementById("fallback");
  let ready = false, requested = false;
  const update = () => {
    const distance = Math.max(1, intro.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -intro.getBoundingClientRect().top / distance));
    intro.classList.toggle("done", progress >= 0.985);
    if (ready && !requested) {
      const target = Math.max(0, Math.min(video.duration - 0.03, progress * video.duration));
      if (Math.abs(video.currentTime - target) > 0.035) {
        requested = true;
        try { video.currentTime = target; } catch (e) { requested = false; }
      }
    } else if (!ready) { fallback.style.transform = `scale(${1 + progress * .08})`; }
  };
  if (video) {
    video.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(video.duration) && video.duration > 0) { ready = true; fallback.style.display = "none"; update(); }
    });
    video.addEventListener("seeked", () => { requested = false; update() });
    video.addEventListener("error", () => { ready = false; requested = false; fallback.style.display = "grid" });
    video.pause();
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}
const clock = document.getElementById("clock");
if (clock) {
  const updateClock = () => { clock.textContent = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()) };
  updateClock(); setInterval(updateClock, 60000);
}
const page = location.pathname.split("/").pop().replace(".html", "");
document.querySelectorAll(".site-nav .nav-links a").forEach(a => {
  if (a.dataset.page === page) { a.classList.add("active"); a.setAttribute("aria-current", "page") }
});
const filters = document.querySelectorAll(".filter-bar [data-filter]");
filters.forEach(btn => btn.addEventListener("click", () => {
  const value = btn.dataset.filter.toLowerCase();
  filters.forEach(b => { const active = b === btn; b.classList.toggle("selected", active); b.setAttribute("aria-pressed", String(active)) });
  document.querySelectorAll(".work-card").forEach(card => { card.hidden = value !== "all" && card.dataset.category.toLowerCase() !== value });
}));
// V16: reveal About sections as they enter the viewport.
const reveals = document.querySelectorAll(".about-v16 .reveal");
if (reveals.length) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target) } });
    }, { threshold: .12, rootMargin: "0px 0px -35px 0px" });
    reveals.forEach(el => observer.observe(el));
  } else { reveals.forEach(el => el.classList.add("visible")) }
}

// V22 — Creative Tools tile: 4-image carousel (auto advance every 3 seconds).
document.querySelectorAll('.tools-slider').forEach(slider => {
  const slides = [...slider.querySelectorAll('.tools-slide')];
  const dots = [...slider.querySelectorAll('[data-slide]')];
  if (!slides.length) return;
  let current = 0, timer = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => { const active = i === current; dot.classList.toggle('is-active', active); if (active) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
  }
  function stop() { if (timer !== null) { clearInterval(timer); timer = null; } }
  function start() { stop(); if (!reduceMotion && !document.hidden) timer = setInterval(() => show(current + 1), 3000); }
  slider.querySelectorAll('[data-dir]').forEach(button => button.addEventListener('click', () => { show(current + (button.dataset.dir === 'next' ? 1 : -1)); start(); }));
  dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.slide)); start(); }));
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', e => { if (!slider.contains(e.relatedTarget)) start(); });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  show(0); start();
});

document.querySelectorAll("img").forEach(img => {
  img.addEventListener("contextmenu", e => {
    e.preventDefault();
  });
});

// 프로젝트 썸네일 관리: 상세 모달 안의 data-* 속성만 수정하면 됩니다.
// 상세 모달 내부 HTML과 기존 페이지 기능은 변경하지 않습니다.
(() => {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;
  const labels = { detail: 'Detail Page', uiux: 'Web / UI Design', banner: 'Banner & Promotion', photography: 'Photography', video: 'Video & Motion', branding: 'Branding' };
  const modals = [...document.querySelectorAll('.modal-backdrop[data-auto-card]')];
  const seen = new Set();
  const items = [];
  modals.forEach((modal, index) => {
    if (!modal.id || seen.has(modal.id)) return;
    seen.add(modal.id);
    const category = modal.dataset.category || 'video';
    const title = modal.dataset.cardTitle || modal.querySelector('.project-modal-heading h2')?.textContent?.trim() || '새 프로젝트';
    const description = modal.dataset.cardDescription || '';
    const thumbnail = modal.dataset.thumbnail || '';
    let card = [...grid.querySelectorAll('.work-card')].find(c => c.querySelector('.project-preview')?.getAttribute('href') === '#' + modal.id);
    if (!card) {
      card = document.createElement('article');
      card.className = 'work-card';
      card.innerHTML = '<a class="project-preview"><div class="project-placeholder"></div></a><div class="project-category"></div><div class="project-title-row"><h2></h2><a>↗</a></div><p class="project-description"></p>';
    }
    card.dataset.category = category;
    const preview = card.querySelector('.project-preview');
    preview.href = '#' + modal.id;
    preview.setAttribute('aria-label', title + ' 프로젝트 자세히 보기');
    const placeholder = card.querySelector('.project-placeholder');
    placeholder.replaceChildren();
    if (thumbnail && !thumbnail.includes('새썸네일')) {
      const img = document.createElement('img');
      img.src = thumbnail;
      img.alt = title;
      placeholder.appendChild(img);
    }
    card.querySelector('.project-category').textContent = labels[category] || category;
    card.querySelector('.project-title-row h2').textContent = title;
    const arrow = card.querySelector('.project-title-row a');
    arrow.href = '#' + modal.id;
    arrow.setAttribute('aria-label', title + ' 자세히 보기');
    card.querySelector('.project-description').textContent = description;
    const order = Number(modal.dataset.order);
    items.push({ card, order: Number.isFinite(order) && order > 0 ? order : 9999, index });
  });
  items.sort((a, b) => a.order - b.order || a.index - b.index);
  items.forEach(({ card }) => grid.appendChild(card));
  const selected = document.querySelector('.filter-bar [data-filter].selected')?.dataset.filter || 'all';
  items.forEach(({ card }) => { card.hidden = selected !== 'all' && card.dataset.category !== selected; });
})();


// 모달을 닫으면 영상 재생 완전히 중지
function stopModalVideos() {
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    if (location.hash === `#${modal.id}`) return;

    modal.querySelectorAll("iframe").forEach(iframe => {
      const parent = iframe.parentNode;
      const next = iframe.nextSibling;
      const replacement = iframe.cloneNode(true);

      // 기존 iframe 제거 → 영상 재생 종료
      iframe.remove();

      // 새 iframe 삽입 → 다음에 열 때 정상 재생
      parent.insertBefore(replacement, next);
    });

    // HTML video 태그가 있다면 일시정지
    modal.querySelectorAll("video").forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

window.addEventListener("hashchange", stopModalVideos);