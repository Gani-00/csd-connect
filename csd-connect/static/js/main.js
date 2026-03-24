/* CSD Connect v2 — Main JS */

// ── THEME ──────────────────────────────────
const root = document.documentElement;
const saved = localStorage.getItem("csd_theme") || "dark";
root.setAttribute("data-theme", saved);
function toggleTheme() {
  const t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", t);
  localStorage.setItem("csd_theme", t);
  const ico = document.getElementById("themeIcon");
  if (ico) ico.className = t === "dark" ? "fas fa-moon" : "fas fa-sun";
  showToast(t === "dark" ? "🌙 Dark mode" : "☀️ Light mode");
}
document.addEventListener("DOMContentLoaded", () => {
  const ico = document.getElementById("themeIcon");
  if (ico) ico.className = saved === "dark" ? "fas fa-moon" : "fas fa-sun";
});

// ── PARTICLES ──────────────────────────────
function initParticles() {
  const cv = document.getElementById("pcv");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const COLORS = ["#7c6bff","#ff6b9d","#00d4ff","#ffb347","#4ade80","#ff6b6b","#2dd4bf","#ffd700"];
  let W, H, pts = [];
  function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
  function mk() { return { x:Math.random()*W, y:Math.random()*H, r:Math.random()*2+0.5, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35, c:COLORS[Math.floor(Math.random()*COLORS.length)], a:Math.random()*.45+.08 }; }
  function init() { resize(); pts = Array.from({length:55},mk); }
  function draw() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c; ctx.globalAlpha=p.a; ctx.fill(); ctx.globalAlpha=1;
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
    });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<90){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=pts[i].c; ctx.globalAlpha=(1-d/90)*.07; ctx.lineWidth=0.5; ctx.stroke(); ctx.globalAlpha=1; }
    }
    requestAnimationFrame(draw);
  }
  init(); draw(); addEventListener("resize", init);
}

// ── CONFETTI ──────────────────────────────
function launchConfetti(n=80) {
  const clrs = ["#7c6bff","#ff6b9d","#ffd700","#4ade80","#00d4ff","#ff6b6b","#ffb347","#2dd4bf"];
  const shapes = ["■","●","▲","★","♦","✿"];
  for(let i=0;i<n;i++) setTimeout(()=>{
    const el = document.createElement("div");
    el.className="confetti";
    el.textContent=shapes[Math.floor(Math.random()*shapes.length)];
    el.style.cssText=`left:${Math.random()*100}vw;top:-20px;color:${clrs[Math.floor(Math.random()*clrs.length)]};font-size:${Math.random()*12+8}px;animation-duration:${Math.random()*2+1.5}s;animation-delay:${Math.random()*.5}s;`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),4000);
  },i*18);
}
window.launchConfetti=launchConfetti;

// ── TOAST ──────────────────────────────────
function showToast(msg,dur=2500){
  let t=document.getElementById("csd-toast");
  if(!t){t=document.createElement("div");t.id="csd-toast";t.className="toast";document.body.appendChild(t);}
  t.textContent=msg; t.classList.add("show");
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove("show"),dur);
}
window.showToast=showToast;

// ── MODAL ──────────────────────────────────
function openModal(id){document.getElementById(id)?.classList.add("open");document.body.style.overflow="hidden";}
function closeModal(id){document.getElementById(id)?.classList.remove("open");document.body.style.overflow="";}
window.openModal=openModal; window.closeModal=closeModal;
document.addEventListener("click",e=>{if(e.target.classList.contains("overlay")){e.target.classList.remove("open");document.body.style.overflow="";}});

// ── SCROLL REVEAL ──────────────────────────
function initReveal(){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("in");}),{threshold:0.1});
  document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
}

// ── PAGE TRANSITION ────────────────────────
function initPageTr(){
  document.querySelectorAll("a:not([target]):not([href^='#']):not([href^='javascript']):not([href^='mailto'])").forEach(a=>{
    a.addEventListener("click",e=>{
      const h=a.getAttribute("href");
      if(!h||h.startsWith("http")) return;
      e.preventDefault();
      document.body.style.opacity="0";
      document.body.style.transition="opacity 0.16s ease";
      setTimeout(()=>location.href=h,160);
    });
  });
  document.body.style.opacity="1";
  document.body.style.transition="opacity 0.22s ease";
}

// ── BIRTHDAY CHECK ─────────────────────────
function isBirthday(dateStr){
  if(!dateStr) return false;
  const t=new Date(), d=new Date(dateStr);
  return d.getMonth()===t.getMonth()&&d.getDate()===t.getDate();
}
window.isBirthday=isBirthday;

// ── PWA SERVICE WORKER ─────────────────────
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("/static/js/sw.js").catch(()=>{});
  });
}

// ── INIT ───────────────────────────────────
document.addEventListener("DOMContentLoaded",()=>{
  initParticles();
  initReveal();
  initPageTr();
  document.querySelectorAll(".reveal").forEach((el,i)=>{el.style.transitionDelay=`${i*.05}s`;});
});
