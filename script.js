gsap.registerPlugin(ScrollTrigger);

/* ===== المواد الخمس (عدّلها لتطابق برنامجكم) ===== */
const U=(id)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
const subjects=[
 {icon:"🎨",title:"التصميم الغرافيكي",img:U("photo-1561070791-2526d30994b5"),
  desc:"التصميم الغرافيكي هو لغة الرسالة البصرية. يتعلم الطالب كيف يختار الألوان والخطوط ويبني التكوين ليوصل الفكرة بوضوح ويصنع هوية لا تُنسى للعلامة أو المؤسسة.",
  list:["مبادئ التصميم: التوازن والتباين والتسلسل","الألوان والطباعة العربية واللاتينية","تصميم الشعارات والهويات البصرية","تصميم الملصقات والمنشورات"],
  career:["وكالات الإعلان","الشركات الناشئة والمتاجر الإلكترونية","العمل الحر على منصات التصميم","الصحافة والنشر"],
  tools:["Photoshop","Illustrator","Figma","Canva"]},
 {icon:"🎞️",title:"المونتاج والموشن غرافيك",img:U("photo-1574717024653-61fd2cf4d44d"),
  desc:"هنا تتحول اللقطات والرسوم إلى قصة متحركة. يتعلم الطالب بناء الإيقاع واختيار الانتقالات وإضافة النصوص والمؤثرات لإنتاج فيديوهات احترافية للإعلانات والقنوات والتعليم.",
  list:["أسس المونتاج وبناء الإيقاع","الرسوم المتحركة والمؤثرات البصرية","النصوص المتحركة والانتقالات","تصحيح الألوان وتصدير الفيديو"],
  career:["القنوات التلفزيونية واليوتيوب","شركات الإنتاج والإعلان","الفيديوهات التعليمية والتعريفية","صناعة الأفلام القصيرة"],
  tools:["Premiere Pro","After Effects","DaVinci Resolve","CapCut"]},
 {icon:"📷",title:"التصوير والإنتاج السمعي البصري",img:U("photo-1516035069371-29a1b244cc32"),
  desc:"فن التقاط الصورة والفيديو والصوت. يتعلم الطالب الإضاءة وتكوين الكادر وإعدادات الكاميرا وتسجيل الصوت النقي، وهي الخام الذي يقوم عليه كل محتوى جيد.",
  list:["التصوير الفوتوغرافي والفيديو","الإضاءة وتكوين الكادر","تسجيل الصوت ومعالجته","إدارة موقع التصوير والفريق"],
  career:["الاستوديوهات والتغطيات الإعلامية","تصوير المنتجات للمتاجر","التوثيق والمناسبات","الإنتاج التلفزيوني"],
  tools:["كاميرا DSLR","الهاتف الذكي","Lightroom","Audition"]},
 {icon:"✍️",title:"كتابة المحتوى والسيناريو",img:U("photo-1455390582262-044cdead277a"),
  desc:"قبل الصورة هناك الفكرة. تعلّم هذه المادة صياغة النص والسيناريو والستوري بورد، وكيف تُحكى القصة الرقمية بأسلوب يشدّ الجمهور ويناسب كل منصة.",
  list:["كتابة السيناريو والستوري بورد","الكتابة للويب ولمنصات التواصل","السرد القصصي وبناء الشخصيات","التحرير اللغوي والعناوين الجذابة"],
  career:["المواقع الإخبارية","وكالات المحتوى والتسويق","كتابة سيناريوهات الإعلانات","التعليم الإلكتروني"],
  tools:["Notion","Google Docs","Storyboarder","Final Draft"]},
 {icon:"📣",title:"التسويق الرقمي وإدارة المنصات",img:U("photo-1460925895917-afdab827c52f"),
  desc:"المحتوى الجيد يحتاج أن يصل إلى الناس. تدرّب هذه المادة الطالب على النشر وجدولة المحتوى والإعلانات الممولة وقراءة الأرقام لتحسين النتائج وبناء علامة قوية.",
  list:["إدارة الصفحات وجدولة المحتوى","الإعلانات الممولة وقياس النتائج","تحسين الظهور في محركات البحث","تحليل الجمهور والأداء"],
  career:["إدارة منصات المؤسسات","التجارة الإلكترونية","الوكالات التسويقية","إطلاق المشاريع الخاصة"],
  tools:["Meta Business Suite","Google Analytics","Search Console","Buffer"]}
];

/* خلفيات الطوابق */
document.querySelectorAll(".floor").forEach(f=>{
  f.querySelector(".bg").style.backgroundImage=`url(${f.dataset.bg})`;
});

/* الأبواب */
const row=document.getElementById("doorsRow");
subjects.forEach((s,i)=>{
  const d=document.createElement("div");d.className="door";
  d.innerHTML=`<div class="frame"><img src="${s.img}" alt="${s.title}" onerror="this.style.display='none'"></div><div class="leaf"><span>${s.icon}</span><small>${s.title}</small></div>`;
  d.onclick=()=>openDoor(i,d);row.appendChild(d);
});

/* أزرار المصعد */
const floors=[...document.querySelectorAll(".floor")];
const panel=document.getElementById("buttons");
floors.forEach(f=>{
  const b=document.createElement("button");b.textContent=f.dataset.floor;b.title=f.dataset.name;
  b.onclick=()=>f.scrollIntoView({behavior:"smooth"});panel.appendChild(b);
});

/* ===== تأثير المصعد عند تغيّر الطابق ===== */
let current=null;
const no=document.getElementById("floorNo"),nm=document.getElementById("floorName"),ar=document.getElementById("arrow");
function setFloor(f,instant){
  const n=+f.dataset.floor;
  if(current===n)return;
  const goingDown=current===null||n<current;
  const apply=()=>{no.textContent=n;nm.textContent=f.dataset.name;ar.textContent=goingDown?"▼":"▲";
    panel.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.textContent==n))};
  current=n;
  if(instant){apply();return}
  gsap.timeline()
    .to("#elevDoors .l",{x:0,duration:.35,ease:"power2.in"})
    .to("#elevDoors .r",{x:0,duration:.35,ease:"power2.in"},0)
    .add(apply)
    .to("body",{x:3,duration:.04,repeat:7,yoyo:true})
    .to("body",{x:0,duration:.05})
    .to("#elevDoors .l",{x:"-101%",duration:.7,ease:"power3.out"},"+=.1")
    .to("#elevDoors .r",{x:"101%",duration:.7,ease:"power3.out"},"<");
}

window.addEventListener("load",()=>{
  setFloor(floors[0],true);

  gsap.timeline()
    .to("#loader",{opacity:0,duration:.8,delay:.6,onComplete:()=>document.getElementById("loader").remove()})
    .from(".cover",{scale:3.5,opacity:0,duration:2,ease:"power4.out"},"-=.3")
    .from(".cover .rise",{y:60,opacity:0,stagger:.18,duration:.8},"-=1.4");

  floors.forEach((f,i)=>{
    /* انتقال المصعد */
    ScrollTrigger.create({trigger:f,start:"top 55%",end:"bottom 55%",onToggle:s=>s.isActive&&setFloor(f)});
    /* برالاكس: الخلفية تتحرك أبطأ = شعور النزول */
    gsap.fromTo(f.querySelector(".bg"),{yPercent:-9,scale:1.18},{yPercent:9,scale:1,ease:"none",
      scrollTrigger:{trigger:f,start:"top bottom",end:"bottom top",scrub:true}});
    /* زوم أوت: المحتوى يظهر من بعيد ثم زوم إن عند المغادرة */
    if(i>0){
      gsap.fromTo(f.querySelector(".box"),{scale:.7},{scale:1,ease:"none",
        scrollTrigger:{trigger:f,start:"top 85%",end:"top 25%",scrub:1}});
      gsap.from(f.querySelectorAll(".rise"),{y:90,opacity:0,stagger:.14,duration:.9,ease:"power3.out",
        scrollTrigger:{trigger:f,start:"top 55%"}});
    }
    if(i<floors.length-1)
      gsap.to(f.querySelector(".box"),{scale:1.3,opacity:0,ease:"power2.in",
        scrollTrigger:{trigger:f,start:"bottom 55%",end:"bottom 5%",scrub:1}});
  });

  gsap.from(".door",{y:120,opacity:0,rotationX:30,stagger:.14,ease:"power3.out",scrollTrigger:{trigger:"#doorsFloor",start:"top 40%"}});
  gsap.from(".chips span",{scale:0,opacity:0,stagger:.06,ease:"back.out(2)",scrollTrigger:{trigger:".chips",start:"top 75%"}});
  document.querySelectorAll(".counters strong").forEach(el=>{
    const o={v:0};
    gsap.to(o,{v:+el.dataset.n,duration:2,onUpdate:()=>el.textContent=Math.round(o.v),scrollTrigger:{trigger:el,start:"top 85%"}});
  });
});

/* كابلات المصعد تتحرك مع التمرير */
const cab=document.getElementById("cables");
addEventListener("scroll",()=>{cab.style.backgroundPositionY=`${-scrollY*1.4}px`},{passive:true});

/* ===== الدخول إلى الباب: زوم إن ثم الغرفة ===== */
const room=document.getElementById("room"),world=document.getElementById("world");
let busy=false,savedY=0;
function openDoor(i,door){
  if(busy)return;busy=true;
  const s=subjects[i],wr=world.getBoundingClientRect(),dr=door.getBoundingClientRect();
  gsap.set(world,{transformOrigin:`${dr.left+dr.width/2-wr.left}px ${dr.top+dr.height/2-wr.top}px`});
  gsap.to(door.querySelector(".leaf"),{rotationY:-95,duration:.6,ease:"power2.inOut"});
  gsap.to(world,{scale:16,duration:1.3,delay:.25,ease:"power3.in",onComplete:()=>{
    rImg.src=s.img;rIcon.textContent=s.icon;rTitle.textContent=s.title;rDesc.textContent=s.desc;
    rList.innerHTML=s.list.map(t=>`<li>${t}</li>`).join("");
    rCareer.innerHTML=s.career.map(t=>`<li>${t}</li>`).join("");
    rTools.innerHTML=s.tools.map(t=>`<span>${t}</span>`).join("");
    savedY=scrollY;room.style.display="block";room.scrollTop=0;document.body.style.overflow="hidden";
    gsap.fromTo(room,{scale:.3,opacity:0},{scale:1,opacity:1,duration:1,ease:"power3.out"});
    gsap.from(".room-body li,.room-body .chips span",{y:30,opacity:0,stagger:.06,delay:.6});
    gsap.set(world,{scale:1});gsap.set(".leaf",{rotationY:0});busy=false;
  }});
}
/* الخروج: زوم أوت */
document.getElementById("back").onclick=()=>{
  gsap.to(room,{scale:2.4,opacity:0,duration:.7,ease:"power3.in",onComplete:()=>{
    room.style.display="none";gsap.set(room,{clearProps:"all"});document.body.style.overflow="";scrollTo(0,savedY);
    gsap.fromTo(world,{scale:.3,opacity:0},{scale:1,opacity:1,duration:1,ease:"power3.out",clearProps:"transform,opacity"});
  }});
};
