
/* V11 — 인트로 영상 스크롤 제어 + 포트폴리오 필터/모달 */
const intro=document.getElementById("intro");
if(intro){
 const video=document.getElementById("introVideo");
 const fallback=document.getElementById("fallback");
 let ready=false,requested=false;
 const update=()=>{
  const distance=Math.max(1,intro.offsetHeight-window.innerHeight);
  const progress=Math.max(0,Math.min(1,-intro.getBoundingClientRect().top/distance));
  intro.classList.toggle("done",progress>=0.985);
  if(ready&&!requested){
   const target=Math.max(0,Math.min(video.duration-0.03,progress*video.duration));
   if(Math.abs(video.currentTime-target)>0.035){
    requested=true;
    try{video.currentTime=target;}catch(e){requested=false;}
   }
  }else if(!ready){fallback.style.transform=`scale(${1+progress*.08})`;}
 };
 if(video){
  video.addEventListener("loadedmetadata",()=>{
   if(Number.isFinite(video.duration)&&video.duration>0){ready=true;fallback.style.display="none";update();}
  });
  video.addEventListener("seeked",()=>{requested=false;update()});
  video.addEventListener("error",()=>{ready=false;requested=false;fallback.style.display="grid"});
  video.pause();
 }
 window.addEventListener("scroll",update,{passive:true});
 window.addEventListener("resize",update);
 update();
}
const clock=document.getElementById("clock");
if(clock){
 const updateClock=()=>{clock.textContent=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Seoul",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date())};
 updateClock();setInterval(updateClock,60000);
}
const page=location.pathname.split("/").pop().replace(".html","");
document.querySelectorAll(".site-nav .nav-links a").forEach(a=>{
 if(a.dataset.page===page){a.classList.add("active");a.setAttribute("aria-current","page")}
});
const filters=document.querySelectorAll(".filter-bar [data-filter]");
filters.forEach(btn=>btn.addEventListener("click",()=>{
 const value=btn.dataset.filter.toLowerCase();
 filters.forEach(b=>{const active=b===btn;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active))});
 document.querySelectorAll(".work-card").forEach(card=>{card.hidden=value!=="all"&&card.dataset.category.toLowerCase()!==value});
}));
/* 모달 내용은 아래 projects 객체에서 수정 */
const projects={
 "01":{type:'Detail Page',title:'Product Detail Page',intro:'상품의 매력을 전달하는 상세페이지',tools:"Photoshop · Illustrator · Figma",role:"디자인",description:"이 영역에 프로젝트의 기획 의도와 작업 과정을 입력하세요.",visual:"warm"},
 "02":{type:'Web / UI Design',title:'Website Redesign',intro:'웹사이트 및 UI 리디자인',tools:"Photoshop · Illustrator · Figma",role:"디자인",description:"이 영역에 프로젝트의 기획 의도와 작업 과정을 입력하세요.",visual:"warm"},
 "03":{type:'Banner & Promotion',title:'Campaign Banner',intro:'프로모션 배너 디자인',tools:"Photoshop · Illustrator · Figma",role:"디자인",description:"이 영역에 프로젝트의 기획 의도와 작업 과정을 입력하세요.",visual:"warm"},
 "04":{type:'Photography',title:'Product Photography',intro:'제품 촬영과 이미지 보정',tools:"Photoshop · Illustrator · Figma",role:"디자인",description:"이 영역에 프로젝트의 기획 의도와 작업 과정을 입력하세요.",visual:"warm"},
 "05":{type:'Video & Motion',title:'Promotional Video',intro:'영상 콘텐츠 기획 및 편집',tools:"Photoshop · Illustrator · Figma",role:"디자인",description:"이 영역에 프로젝트의 기획 의도와 작업 과정을 입력하세요.",visual:"warm"},
 "06":{type:'Branding',title:'Brand Concept',intro:'브랜드 비주얼 콘셉트',tools:"Photoshop · Illustrator · Figma",role:"디자인",description:"이 영역에 프로젝트의 기획 의도와 작업 과정을 입력하세요.",visual:"warm"},
 "07":{type:'Detail Page',title:'Skincare Detail Page',intro:'화장품 상세페이지 프로젝트',tools:"Photoshop · Illustrator · Figma",role:"디자인",description:"이 영역에 프로젝트의 기획 의도와 작업 과정을 입력하세요.",visual:"warm"},
 "08":{type:'Web / UI Design',title:'App UI Concept',intro:'앱 UI 디자인 프로젝트',tools:"Photoshop · Illustrator · Figma",role:"디자인",description:"이 영역에 프로젝트의 기획 의도와 작업 과정을 입력하세요.",visual:"warm"}
};
const modal=document.getElementById("projectModal");
if(modal){
 const dialog=modal.querySelector(".project-modal");
 const close=()=>{modal.hidden=true;document.body.style.overflow="";};
 const open=id=>{
  const p=projects[id];if(!p)return;
  const set=(name,value)=>{const el=document.getElementById(name);if(el)el.textContent=value};
  set("modalCategory",p.type.toUpperCase());set("modalNumber",id);set("modalType",p.type);
  set("modalTitle",p.title);set("modalIntro",p.intro);set("modalWork",p.type);
  set("modalTools",p.tools);set("modalRole",p.role);set("modalDescription",p.description);
  document.getElementById("modalVisual").className="modal-hero visual "+p.visual;
  dialog.scrollTop=0;modal.hidden=false;document.body.style.overflow="hidden";dialog.focus();
 };
 document.querySelectorAll("[data-project]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();open(a.dataset.project)}));
 modal.querySelector(".modal-close").addEventListener("click",close);
 modal.querySelector(".modal-bottom-close").addEventListener("click",close);
 modal.addEventListener("click",e=>{if(e.target===modal)close()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)close()});
}

// V16: reveal About sections as they enter the viewport.
const reveals=document.querySelectorAll(".about-v16 .reveal");
if(reveals.length){
 if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}});
  },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
  reveals.forEach(el=>observer.observe(el));
 }else{reveals.forEach(el=>el.classList.add("visible"))}
}

// V22 — Creative Tools tile: 4-image carousel (auto advance every 3 seconds).
document.querySelectorAll('.tools-slider').forEach(slider=>{
 const slides=[...slider.querySelectorAll('.tools-slide')];
 const dots=[...slider.querySelectorAll('[data-slide]')];
 if(!slides.length)return;
 let current=0, timer=null;
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function show(index){
  current=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===current));
  dots.forEach((dot,i)=>{const active=i===current;dot.classList.toggle('is-active',active);if(active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
 }
 function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
 function start(){stop();if(!reduceMotion&&!document.hidden)timer=setInterval(()=>show(current+1),3000);}
 slider.querySelectorAll('[data-dir]').forEach(button=>button.addEventListener('click',()=>{show(current+(button.dataset.dir==='next'?1:-1));start();}));
 dots.forEach(dot=>dot.addEventListener('click',()=>{show(Number(dot.dataset.slide));start();}));
 slider.addEventListener('mouseenter',stop);
 slider.addEventListener('mouseleave',start);
 slider.addEventListener('focusin',stop);
 slider.addEventListener('focusout',e=>{if(!slider.contains(e.relatedTarget))start();});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 show(0);start();
});
