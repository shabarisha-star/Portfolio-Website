// Enhanced front-end behavior: GSAP reveals, particles, cursor, loader, counters, magnetic buttons

/* Typing effect (keeps previous behavior) */
const roles = ["BCA Graduate","Software Developer","Python Developer","Full Stack Developer"];
let roleIndex = 0, charIndex = 0;
const typingText = document.getElementById("typing-text");
function typeEffect(){
    if(!typingText) return;
    if(charIndex < roles[roleIndex].length){
        typingText.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++; setTimeout(typeEffect, 80);
    } else { setTimeout(eraseEffect, 1400); }
}
function eraseEffect(){
    if(!typingText) return;
    if(charIndex > 0){
        typingText.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--; setTimeout(eraseEffect, 40);
    } else { roleIndex = (roleIndex + 1) % roles.length; setTimeout(typeEffect, 300); }
}

/* Loader hide + initial animations */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader){ gsap.to(loader, {autoAlpha:0, duration:0.6, pointerEvents:'none', onComplete:()=>loader.style.display='none'}); }
    // kick off typing
    typeEffect();
    initAnimations();
    initCounters();
});

/* GSAP scroll reveals */
function initAnimations(){
    if(typeof gsap !== 'undefined'){
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.reveal').forEach(elem=>{
            gsap.fromTo(elem, {y:30, autoAlpha:0}, {duration:0.8,y:0,autoAlpha:1, ease:'power3.out', scrollTrigger:{trigger:elem, start:'top 85%'}});
        });
        gsap.from('.hero h1', {y:20,autoAlpha:0,duration:0.9,delay:0.15});
        gsap.from('.hero .profile-image', {scale:0.96,autoAlpha:0,duration:1,delay:0.2});
        // smooth section transitions
        gsap.utils.toArray('section').forEach(sec=>{ ScrollTrigger.create({trigger:sec, start:'top 80%', onEnter:()=>sec.classList.add('in-view')}) });
    }
}

/* Animated counters */
function initCounters(){
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(el=>{
        const raw = el.dataset.target || '0';
        const target = raw.includes('.') ? parseFloat(raw) : parseInt(raw,10);
        let started = false;
        const obs = new IntersectionObserver(entries=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting && !started){
                    started = true; animateCount(el, target); obs.disconnect();
                }
            });
        },{threshold:0.6});
        obs.observe(el);
    });
}
function animateCount(el, to){
    const isFloat = String(el.dataset.target || '').includes('.');
    const dur = 1.6 * 1000; const start = performance.now();
    function tick(now){
        const t = Math.min((now-start)/dur,1);
        const eased = t; // linear -> could be eased
        const value = eased * to;
        el.textContent = isFloat ? value.toFixed(2) : Math.floor(value + 0.0001);
        if(t<1) requestAnimationFrame(tick); else el.textContent = isFloat ? Number(to).toFixed(2) : to;
    }
    requestAnimationFrame(tick);
}

/* Particles: lightweight canvas */
function initParticles(){
    const canvas = document.getElementById('particles');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w=canvas.width=innerWidth, h=canvas.height=innerHeight; window.addEventListener('resize',()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight});
    const particles=[]; const count = Math.max(18, Math.floor((w*h)/90000));
    for(let i=0;i<count;i++){particles.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2+0.6,dx:(Math.random()-0.5)*0.4,dy:(Math.random()-0.5)*0.4, hue:Math.random()*360})}
    function update(){ctx.clearRect(0,0,w,h);particles.forEach(p=>{p.x+=p.dx;p.y+=p.dy; if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0; ctx.beginPath(); const g=ctx.createRadialGradient(p.x,p.y,p.r, p.x,p.y,p.r*8); g.addColorStop(0, `hsla(${p.hue},90%,60%,0.18)`); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2); ctx.fill();}); requestAnimationFrame(update)}
    update();
}
initParticles();

/* Custom cursor and mouse-follow glow */
const cursor = document.getElementById('custom-cursor');
const glow = document.getElementById('mouse-glow');
let cx=0,cy=0,lx=0,ly=0;
window.addEventListener('mousemove', e=>{cx=e.clientX;cy=e.clientY; if(cursor) cursor.style.transform=`translate(${cx}px,${cy}px)`; if(glow) glow.style.transform=`translate(${cx}px,${cy}px)`});
// simple lerp for a small follow effect
function lerpCursor(){ lx += (cx - lx) * 0.12; ly += (cy - ly) * 0.12; if(cursor) cursor.style.left = lx+'px'; if(cursor) cursor.style.top = ly+'px'; if(glow) glow.style.left = lx+'px'; if(glow) glow.style.top = ly+'px'; requestAnimationFrame(lerpCursor)}
lerpCursor();

/* Magnetic buttons */
document.querySelectorAll('.magnetic').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
        const rect = btn.getBoundingClientRect(); const relX = e.clientX - rect.left - rect.width/2; const relY = e.clientY - rect.top - rect.height/2; btn.style.transform = `translate(${relX*0.18}px, ${relY*0.12}px) rotate(${relX*0.02}deg)`; btn.style.boxShadow = '0 10px 30px rgba(30,144,255,0.08)';
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform='translate(0,0)'; btn.style.boxShadow=''; });
});

/* Project card hover interactions */
document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('mousemove', e=>{
        const rect = card.getBoundingClientRect(); const relX = (e.clientX - rect.left - rect.width/2)/20; const relY = (e.clientY - rect.top - rect.height/2)/30; card.style.transform = `translate(${relX}px, ${relY}px)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
});

/* Nav smooth scrolling + active link */
document.querySelectorAll('.nav-links a').forEach(a=>{ a.addEventListener('click', (e)=>{ e.preventDefault(); const id = a.getAttribute('href'); document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'}); }); });

/* Reveal on scroll with GSAP fallback */
document.addEventListener('DOMContentLoaded', ()=>{
    const reveals = document.querySelectorAll('.reveal');
    if(typeof gsap !== 'undefined'){
        gsap.registerPlugin(ScrollTrigger);
        reveals.forEach(el=>{
            gsap.fromTo(el, {y:24,autoAlpha:0}, {y:0,autoAlpha:1,duration:0.9, ease:'power3.out', scrollTrigger:{trigger:el, start:'top 85%'}});
        });
    } else {
        const obs = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); }); },{threshold:0.12});
        reveals.forEach(r=>obs.observe(r));
    }
});

// Fallback reveal for elements with .fade-in
document.addEventListener('scroll', ()=>{ document.querySelectorAll('.fade-in').forEach(el=>{ const top = el.getBoundingClientRect().top; if(top < window.innerHeight - 80) el.classList.add('show'); }); });
