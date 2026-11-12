gsap.registerPlugin(ScrollTrigger);
const U=id=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
/* ===== المواد الخمس (عدّلها لتطابق البرنامج الرسمي) ===== */
const subjects=[
{icon:"🎨",title:"التصميم الغرافيكي",img:U("photo-1561070791-2526d30994b5"),desc:"لغة الرسالة البصرية: يتعلم الطالب الألوان والخطوط والتكوين ليوصل الفكرة بوضوح ويصنع هوية لا تُنسى للعلامة أو المؤسسة.",list:["مبادئ التصميم: التوازن والتباين","الطباعة العربية واللاتينية","الشعارات والهويات البصرية","الملصقات ومنشورات التواصل"],career:["وكالات الإعلان","المتاجر الإلكترونية","العمل الحر","الصحافة والنشر"],tools:["Photoshop","Illustrator","Figma","Canva"]},
{icon:"🎞️",title:"المونتاج والموشن غرافيك",img:U("photo-1574717024653-61fd2cf4d44d"),desc:"تتحول اللقطات والرسوم إلى قصة متحركة: بناء الإيقاع والانتقالات والنصوص المتحركة لإنتاج فيديوهات احترافية.",list:["أسس المونتاج والإيقاع","الرسوم المتحركة والمؤثرات","النصوص المتحركة والانتقالات","تصحيح الألوان والتصدير"],career:["القنوات واليوتيوب","شركات الإنتاج","الفيديو التعليمي","الأفلام القصيرة"],tools:["Premiere Pro","After Effects","DaVinci Resolve","CapCut"]},
{icon:"📷",title:"التصوير والإنتاج السمعي البصري",img:U("photo-1516035069371-29a1b244cc32"),desc:"فن التقاط الصورة والفيديو والصوت: الإضاءة والكادر وإعدادات الكاميرا وتسجيل الصوت النقي، وهي مادة كل محتوى جيد.",list:["التصوير الفوتوغرافي والفيديو","الإضاءة وتكوين الكادر","تسجيل الصوت ومعالجته","إدارة موقع التصوير"],career:["الاستوديوهات","تصوير المنتجات","التغطيات والمناسبات","الإنتاج التلفزيوني"],tools:["كاميرا DSLR","الهاتف الذكي","Lightroom","Audition"]},
{icon:"✍️",title:"كتابة المحتوى والسيناريو",img:U("photo-1455390582262-044cdead277a"),desc:"قبل الصورة هناك الفكرة: صياغة النص والسيناريو والستوري بورد وسرد القصة الرقمية بأسلوب يناسب كل منصة.",list:["السيناريو والستوري بورد","الكتابة للويب والتواصل","السرد وبناء الشخصيات","العناوين والتحرير اللغوي"],career:["المواقع الإخبارية","وكالات المحتوى","سيناريو الإعلانات","التعليم الإلكتروني"],tools:["Notion","Google Docs","Storyboarder"]},
{icon:"📣",title:"التسويق الرقمي وإدارة المنصات",img:U("photo-1460925895917-afdab827c52f"),desc:"المحتوى الجيد يحتاج أن يصل: النشر والجدولة والإعلانات الممولة وقراءة الأرقام لتحسين النتائج وبناء علامة قوية.",list:["إدارة الصفحات والجدولة","الإعلانات وقياس النتائج","تحسين الظهور في البحث","تحليل الجمهور والأداء"],career:["إدارة منصات المؤسسات","التجارة الإلكترونية","الوكالات التسويقية","المشاريع الخاصة"],tools:["Meta Business Suite","Google Analytics","Search Console"]}];

/* الأبواب */
const row=document.getElementById("doorsRow");
subjects.forEach((s,i)=>{const d=document.createElement("div");d.className="door";
 d.innerHTML=`<div class="frame"><img src="${s.img}" alt="" onerror="this.style.display='none'"></div><div class="leaf"><span>${s.icon}</span><small>${s.title}</small></div>`;
 d.onclick=()=>openDoor(i,d);row.appendChild(d)});


/* عدسة أصلية: جسم + 6 شفرات + زجاج */
function lensSVG(){let b="";for(let i=0;i<6;i++)b+=`<polygon class="bl" points="100,100 100,30 152,48" fill="url(#gL)" stroke="#062a0c" stroke-width="1.6" transform="rotate(${i*60} 100 100)"/>`;
 return `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="97" fill="url(#gB)"/><circle cx="100" cy="100" r="84" fill="#0a2e12" stroke="#d6ffb0" stroke-opacity=".55" stroke-width="2"/>${b}<circle cx="100" cy="100" r="26" fill="url(#gG)"/><ellipse cx="80" cy="62" rx="26" ry="11" fill="#fff" opacity=".35" transform="rotate(-30 80 62)"/></svg>`}
document.querySelectorAll(".lens-wrap").forEach(w=>w.innerHTML=lensSVG());
/* بتلات + شظايا */
const pet=document.getElementById("petals");
for(let i=0;i<18;i++){const p=document.createElement("i");p.className="petal";p.style.left=Math.random()*100+"%";pet.appendChild(p);
 gsap.to(p,{y:innerHeight+80,x:"+="+(Math.random()*160-80),rotation:Math.random()*540,duration:6+Math.random()*6,repeat:-1,delay:-Math.random()*10,ease:"none"})}
const polys=["0 0,55% 0,40% 45%,0 60%","55% 0,100% 0,100% 40%,60% 50%,40% 45%","0 60%,40% 45%,60% 50%,45% 100%,0 100%","60% 50%,100% 40%,100% 100%,45% 100%"];
const sh=document.getElementById("shards");
polys.forEach(p=>{const d=document.createElement("div");d.className="shard";d.style.clipPath=`polygon(${p})`;sh.appendChild(d)});

/* جمر */
document.querySelectorAll(".embers").forEach(c=>{const x=c.getContext("2d");let W,H,ps=[];
 const rs=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight||innerHeight};rs();addEventListener("resize",rs);
 for(let i=0;i<70;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.5+.5,v:Math.random()*1.2+.3,d:Math.random()*6});
 gsap.ticker.add(t=>{x.clearRect(0,0,W,H);ps.forEach(p=>{p.y-=p.v;p.x+=Math.sin(t+p.d)*.5;if(p.y<0){p.y=H;p.x=Math.random()*W}
  x.fillStyle=`rgba(255,${120+p.r*30|0},40,${.4+p.r/5})`;x.shadowColor="#ff8a1f";x.shadowBlur=10;x.beginPath();x.arc(p.x,p.y,p.r,0,6.3);x.fill()})})});

/* المؤشر + برالاكس الكرة */
const cur=document.getElementById("cursor"),qx=gsap.quickTo(cur,"x",{duration:.25}),qy=gsap.quickTo(cur,"y",{duration:.25});
gsap.set(".lens-wrap",{transformPerspective:900});
const rx=gsap.quickTo(".lens-wrap","rotationX",{duration:.9}),ry=gsap.quickTo(".lens-wrap","rotationY",{duration:.9});
addEventListener("mousemove",e=>{qx(e.clientX-11);qy(e.clientY-11);ry((e.clientX/innerWidth-.5)*40);rx(-(e.clientY/innerHeight-.5)*30)});
document.addEventListener("mouseover",e=>gsap.to(cur,{scale:e.target.closest(".door,button,a")?2.4:1,duration:.3}));

window.addEventListener("load",()=>{
 gsap.to("#loader",{yPercent:-100,duration:1,delay:.5,ease:"power4.inOut",onComplete:()=>document.getElementById("loader").remove()});
 gsap.from(".a .wd",{y:90,opacity:0,filter:"blur(22px)",stagger:.22,duration:1.3,delay:1.1,ease:"power4.out"});
 gsap.from(".lens-wrap",{scale:.2,rotation:-90,opacity:0,duration:2,delay:1,ease:"expo.out"});
 gsap.to(".lens-wrap",{y:"-=16",duration:2.6,yoyo:true,repeat:-1,ease:"sine.inOut"});

 /* الجدول الرئيسي: زوم إن/أوت بين المشاهد مع التمرير */
 const bt=document.getElementById("barTxt");
 const tl=gsap.timeline({scrollTrigger:{trigger:"#story",start:"top top",end:"+=4600",pin:true,scrub:1.2,
   onUpdate:s=>{const p=s.progress;bt.textContent=p<.2?"الفصل ١ — الوهم":p<.5?"الفصل ٢ — الحقيقة":p<.78?"الفصل ٣ — الصنعة":"الفصل ٤ — التخصص"}}});
 const out=(s,t)=>tl.to(s,{scale:1.7,opacity:0,filter:"blur(16px)",duration:1.1,ease:"power2.in"},t);
 const inn=(s,t)=>tl.fromTo(s,{scale:.75,opacity:0,filter:"blur(16px)"},{scale:1,opacity:1,filter:"blur(0px)",duration:1.1,ease:"power2.out"},t);
 tl.to(".a .lens-wrap",{scale:1.35,duration:1.2},0).to(".a .bl",{rotation:"+=32",svgOrigin:"100 100",duration:1.2},0).to(".a .w1",{y:-90,duration:1.2},0);
 out(".scene.a",1.2); inn(".scene.b",1.5);
 tl.from(".shard",{x:()=>gsap.utils.random(-900,900),y:()=>gsap.utils.random(-700,700),rotation:()=>gsap.utils.random(-80,80),scale:.2,opacity:0,stagger:.1,duration:1.3},1.5)
   .from(".b .lens-wrap",{rotation:140,scale:.3,duration:1.6,ease:"power3.out"},1.7)
   .from(".b .wd",{y:70,opacity:0,filter:"blur(20px)",stagger:.25,duration:1},2.2)
   .to(".b .bl",{rotation:"+=40",svgOrigin:"100 100",duration:1.6},2.2);
 out(".scene.b",3.9); inn(".scene.c",4.2);
 tl.from(".c .lens-wrap",{y:200,rotation:-120,duration:1.6,ease:"power3.out"},4.3)
   .from(".c .wd,.w4p",{y:70,opacity:0,filter:"blur(20px)",stagger:.25,duration:1},4.8)
   .to(".c .bl",{rotation:"+=50",svgOrigin:"100 100",duration:1.6},4.8);
 out(".scene.c",6.5); inn(".scene.d",6.9);
 tl.from(".tag,.idcard",{y:40,opacity:0,stagger:.3},7.6);

 /* الأقسام: الكلمة الضخمة خلف العناصر + ظهور */
 gsap.utils.toArray(".sec").forEach(s=>{
  gsap.from(s.querySelectorAll(".inner>*"),{y:90,opacity:0,stagger:.14,duration:1,ease:"power3.out",scrollTrigger:{trigger:s,start:"top 60%"}});
  const g=s.querySelector(".ghost");if(g)gsap.fromTo(g,{scale:.6},{scale:1.3,ease:"none",scrollTrigger:{trigger:s,start:"top bottom",end:"bottom top",scrub:1}});
 });
 gsap.from("article",{scale:.8,opacity:0,y:60,stagger:.1,scrollTrigger:{trigger:"#about",start:"top 40%"}});
 gsap.from(".door",{y:140,opacity:0,rotationX:35,stagger:.14,ease:"power3.out",scrollTrigger:{trigger:"#doors",start:"top 40%"}});
 document.querySelectorAll(".counters strong").forEach(el=>{const o={v:0};
  gsap.to(o,{v:+el.dataset.n,duration:2,onUpdate:()=>el.textContent=Math.round(o.v),scrollTrigger:{trigger:el,start:"top 90%"}})});
 ScrollTrigger.create({trigger:"#fields",start:"top 50%",end:"bottom 50%",onToggle:s=>s.isActive&&(bt.textContent="المجالات")});
 ScrollTrigger.create({trigger:"#horizons",start:"top 50%",end:"bottom 50%",onToggle:s=>s.isActive&&(bt.textContent="الآفاق")});
 ScrollTrigger.create({trigger:"#doors",start:"top 50%",end:"bottom 50%",onToggle:s=>s.isActive&&(bt.textContent="الأبواب الخمسة")});
});
document.getElementById("barBtn").onclick=()=>document.getElementById("about").scrollIntoView({behavior:"smooth"});

/* الدخول إلى الباب: زوم إن */
const room=document.getElementById("room"),world=document.getElementById("world");let busy=false,sy=0;
function openDoor(i,door){if(busy)return;busy=true;
 const s=subjects[i],wr=world.getBoundingClientRect(),dr=door.getBoundingClientRect();
 gsap.set(world,{transformOrigin:`${dr.left+dr.width/2-wr.left}px ${dr.top+dr.height/2-wr.top}px`});
 gsap.to(door.querySelector(".leaf"),{rotationY:-95,duration:.6});
 gsap.to(world,{scale:16,duration:1.3,delay:.25,ease:"power3.in",onComplete:()=>{
  rImg.src=s.img;rIcon.textContent=s.icon;rTitle.textContent=s.title;rDesc.textContent=s.desc;
  rList.innerHTML=s.list.map(t=>`<li>${t}</li>`).join("");rCareer.innerHTML=s.career.map(t=>`<li>${t}</li>`).join("");
  rTools.innerHTML=s.tools.map(t=>`<span>${t}</span>`).join("");
  sy=scrollY;room.style.display="block";room.scrollTop=0;document.body.style.overflow="hidden";
  gsap.fromTo(room,{scale:.3,opacity:0},{scale:1,opacity:1,duration:1,ease:"power3.out"});
  gsap.from(".room-body li,.room-body .chips span",{y:30,opacity:0,stagger:.06,delay:.6});
  gsap.set(world,{scale:1});gsap.set(".leaf",{rotationY:0});busy=false}})}
document.getElementById("back").onclick=()=>gsap.to(room,{scale:2.4,opacity:0,duration:.7,ease:"power3.in",onComplete:()=>{
 room.style.display="none";gsap.set(room,{clearProps:"all"});document.body.style.overflow="";scrollTo(0,sy);
 gsap.fromTo(world,{scale:.3,opacity:0},{scale:1,opacity:1,duration:1,ease:"power3.out",clearProps:"transform,opacity"})}});
