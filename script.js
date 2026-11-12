gsap.registerPlugin(ScrollTrigger);

/* ===== المواد الخمس (عدّل المحتوى ليطابق برنامجكم الفعلي) ===== */
const subjects = [
  { icon:"🎨", title:"التصميم الغرافيكي", desc:"أساس الهوية البصرية: كيف توصل رسالتك بصريًا بالألوان والخطوط والتكوين.",
    list:["مبادئ التصميم والألوان والطباعة","تصميم الشعارات والهويات البصرية","تصميم الملصقات ومنشورات التواصل"], tools:["Photoshop","Illustrator","Canva","Figma"] },
  { icon:"🎞️", title:"المونتاج والموشن غرافيك", desc:"تحويل اللقطات والرسوم إلى قصة متحركة مؤثرة بإيقاع وانتقالات احترافية.",
    list:["أسس المونتاج وبناء الإيقاع","الرسوم المتحركة والمؤثرات البصرية","الانتقالات والنصوص المتحركة"], tools:["Premiere Pro","After Effects","DaVinci Resolve"] },
  { icon:"📷", title:"التصوير والإنتاج السمعي البصري", desc:"فن التقاط الصورة والفيديو والصوت: الإضاءة والكادر وجودة الصوت.",
    list:["التصوير الفوتوغرافي والفيديو","الإضاءة وتكوين الكادر","تسجيل الصوت والمعالجة"], tools:["كاميرا DSLR","الهاتف الذكي","Audition"] },
  { icon:"✍️", title:"كتابة المحتوى والسيناريو", desc:"قبل الصورة هناك الفكرة: تعلّم كتابة النص والسيناريو وسرد القصة الرقمية.",
    list:["كتابة السيناريو والستوري بورد","الكتابة للويب ولمنصات التواصل","السرد القصصي وبناء الجمهور"], tools:["Notion","Google Docs","Storyboarder"] },
  { icon:"📣", title:"التسويق الرقمي وإدارة المنصات", desc:"كيف يصل المحتوى للناس ويحقق نتائج: النشر، الإعلانات، وتحليل الأداء.",
    list:["إدارة الصفحات وجدولة المحتوى","الإعلانات الممولة وقياس النتائج","تحسين الظهور وبناء العلامة"], tools:["Meta Business","Google Analytics","CapCut"] }
];

/* ===== الأبواب ===== */
const row = document.getElementById("doorsRow");
subjects.forEach((s,i)=>{
  const d=document.createElement("div");
  d.className="door";
  d.innerHTML=`<div class="frame"><div class="glow"></div></div><div class="leaf"><span>${s.icon}</span><small>${s.title}</small></div>`;
  d.addEventListener("click",()=>openDoor(i,d));
  row.appendChild(d);
});

/* ===== النجوم في الخلفية ===== */
const cv=document.getElementById("stars"),cx=cv.getContext("2d");
let stars=[];
function sizeCv(){cv.width=innerWidth;cv.height=innerHeight;stars=Array.from({length:110},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.6+.3,v:Math.random()*.3+.05}))}
sizeCv();addEventListener("resize",sizeCv);
gsap.ticker.add(()=>{cx.clearRect(0,0,cv.width,cv.height);cx.fillStyle="#fff";
  stars.forEach(s=>{s.y+=s.v;if(s.y>cv.height)s.y=0;cx.globalAlpha=.3+s.r/3;cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.3);cx.fill()})});

/* ===== مقدمة: زوم أوت من قرب شديد ===== */
window.addEventListener("load",()=>{
  const tl=gsap.timeline();
  tl.to("#loader",{opacity:0,duration:.7,delay:.5,onComplete:()=>document.getElementById("loader").remove()})
    .from(".hero-inner",{scale:4,opacity:0,duration:2,ease:"power4.out"},"-=.2")
    .from("h1 span",{y:80,rotationX:-90,opacity:0,stagger:.2,duration:.9,ease:"back.out(1.7)"},"-=1.4")
    .from([".tag",".sub",".scroll-hint"],{y:30,opacity:0,stagger:.2},"-=.4");

  /* ===== زوم إن: الدخول داخل العنوان أثناء التمرير ===== */
  gsap.to(".hero-inner",{
    scale:12,opacity:0,ease:"power2.in",
    scrollTrigger:{trigger:"#hero",start:"top top",end:"+=1400",pin:true,scrub:1}
  });

  /* ===== زوم أوت: ظهور كل قسم من بعيد ===== */
  gsap.utils.toArray(".panel .wrap").forEach(w=>{
    gsap.fromTo(w,{scale:.4,opacity:0,y:120},{scale:1,opacity:1,y:0,ease:"power3.out",
      scrollTrigger:{trigger:w,start:"top 90%",end:"top 35%",scrub:1}});
    gsap.to(w,{scale:1.25,opacity:0,ease:"power2.in",
      scrollTrigger:{trigger:w,start:"bottom 45%",end:"bottom 5%",scrub:1}});
  });

  gsap.from(".cards article",{y:60,opacity:0,rotation:4,stagger:.12,scrollTrigger:{trigger:".cards",start:"top 80%"}});
  gsap.from(".chips span",{scale:0,opacity:0,stagger:.07,ease:"back.out(2)",scrollTrigger:{trigger:"#fields .chips",start:"top 80%"}});
  gsap.from(".door",{y:100,opacity:0,stagger:.15,ease:"power3.out",scrollTrigger:{trigger:"#doors",start:"top 60%"}});

  document.querySelectorAll(".counters strong").forEach(el=>{
    const o={v:0};
    gsap.to(o,{v:+el.dataset.n,duration:2,ease:"power1.out",onUpdate:()=>el.textContent=Math.round(o.v),
      scrollTrigger:{trigger:el,start:"top 85%"}});
  });
});

/* ===== فتح الباب: زوم إن داخل الباب ثم ظهور المادة ===== */
const room=document.getElementById("room"),world=document.getElementById("world");
let busy=false;
function openDoor(i,door){
  if(busy)return;busy=true;
  const s=subjects[i],wr=world.getBoundingClientRect(),dr=door.getBoundingClientRect();
  const ox=dr.left+dr.width/2-wr.left, oy=dr.top+dr.height/2-wr.top;
  gsap.set(world,{transformOrigin:`${ox}px ${oy}px`});
  gsap.to(door.querySelector(".leaf"),{rotationY:-95,duration:.6,ease:"power2.inOut"});
  gsap.to(world,{scale:18,duration:1.3,delay:.25,ease:"power3.in",onComplete:()=>{
    rIcon.textContent=s.icon;rTitle.textContent=s.title;rDesc.textContent=s.desc;
    rList.innerHTML=s.list.map(t=>`<li>${t}</li>`).join("");
    rTools.innerHTML=s.tools.map(t=>`<span>${t}</span>`).join("");
    room.style.display="grid";document.body.style.overflow="hidden";
    gsap.fromTo(".room-card",{scale:.3,opacity:0},{scale:1,opacity:1,duration:.9,ease:"power3.out"});
    gsap.from(".room-card li,.room-card .chips span",{x:-30,opacity:0,stagger:.08,delay:.5});
    gsap.set(world,{scale:1});gsap.set(".leaf",{rotationY:0});busy=false;
  }});
}

/* ===== الخروج: زوم أوت إلى الأبواب ===== */
document.getElementById("back").addEventListener("click",()=>{
  gsap.to(".room-card",{scale:2.5,opacity:0,duration:.7,ease:"power3.in",onComplete:()=>{
    room.style.display="none";document.body.style.overflow="";
    gsap.fromTo(world,{scale:.3,opacity:0},{scale:1,opacity:1,duration:1,ease:"power3.out",clearProps:"transform,opacity"});
  }});
});
