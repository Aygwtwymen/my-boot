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
const ox=gsap.quickTo("#orb","x",{duration:1}),oy=gsap.quickTo("#orb","y",{duration:1});
addEventListener("mousemove",e=>{qx(e.clientX-11);qy(e.clientY-11);ox((e.clientX-innerWidth/2)*.08);oy((e.clientY-innerHeight/2)*.08)});
document.addEventListener("mouseover",e=>gsap.to(cur,{scale:e.target.closest(".door,button,a")?2.4:1,duration:.3}));

window.addEventListener("load",()=>{
 gsap.to("#loader",{yPercent:-100,duration:1,delay:.5,ease:"power4.inOut",onComplete:()=>document.getElementById("loader").remove()});
 gsap.from(".w1,.w2",{scale:3,opacity:0,filter:"blur(30px)",duration:1.8,delay:1,ease:"power4.out"});
 gsap.to("#orb",{rotation:6,y:"-=18",duration:2.4,yoyo:true,repeat:-1,ease:"sine.inOut"});

 /* الجدول الرئيسي: زوم إن/أوت بين المشاهد مع التمرير */
 const bt=document.getElementById("barTxt");
 const tl=gsap.timeline({scrollTrigger:{trigger:"#story",start:"top top",end:"+=4200",pin:true,scrub:1,
   onUpdate:s=>{const p=s.progress;bt.textContent=p<.22?"الفصل ١ — الوهم":p<.5?"الفصل ٢ — الحقيقة":p<.78?"الفصل ٣ — الصنعة":"الفصل ٤ — التخصص"}}});
 tl.to(".scene.a .w1",{y:-120,scale:1.4,duration:1})
   .to(".scene.a",{scale:3,opacity:0,duration:1.2,ease:"power2.in"},1)
   .fromTo(".scene.b",{opacity:0,scale:.5},{opacity:1,scale:1,duration:1.2},1.3)
   .from(".shard",{x:()=>gsap.utils.random(-900,900),y:()=>gsap.utils.random(-700,700),rotation:()=>gsap.utils.random(-80,80),scale:.2,opacity:0,stagger:.1,duration:1.2},1.3)
   .from(".w3",{scale:4,opacity:0,duration:1},1.9)
   .to(".scene.b",{scale:2.8,opacity:0,duration:1.2,ease:"power2.in"},3.6)
   .fromTo(".scene.c",{opacity:0,scale:.6},{opacity:1,scale:1,duration:1.2},3.9)
   .from(".w4,.w4p",{y:80,opacity:0,stagger:.3,duration:1},4.3)
   .to(".scene.c",{scale:2.5,opacity:0,duration:1.2,ease:"power2.in"},6.2)
   .fromTo(".scene.d",{opacity:0,scale:.5},{opacity:1,scale:1,duration:1.4},6.6)
   .from(".tag,.idcard",{y:40,opacity:0,stagger:.3},7.4);

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
