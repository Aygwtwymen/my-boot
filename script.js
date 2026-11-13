/* =========================================================
   script.js — الإنتاج الرقمي | بحث أيمن
   الأجزاء: 1) تمرير ناعم  2) خلفية Three.js  3) افتتاحية الواجهة
            4) انتقالات المشاهد 3D  5) تنقل وتقدّم  6) إمالة 3D
            7) قلب البطاقات  8) سوق العمل
   ========================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer  = window.matchMedia("(pointer: fine)").matches;
  const hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1) التمرير الناعم (Lenis) متزامن مع GSAP ---------- */
  let lenis = null;
  if (typeof Lenis !== "undefined" && hasGSAP && !reduceMotion) {
    lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // الروابط الداخلية (#section) تمرّر بسلاسة
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis ? lenis.scrollTo(target, { offset: 0 }) : target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- 2) الخلفية ثلاثية الأبعاد (Three.js) ---------- */
  const canvas = document.getElementById("bg3d");
  if (typeof THREE !== "undefined" && canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 9;

    // مجسمات سلكية ترمز لـ "المنتج الرقمي": بنية + حلقة + نجوم
    const mat = (c, o) => new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: o });
    const ico  = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), mat(0xff5c8a, 0.55));
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.34, 120, 12), mat(0x7cf0c9, 0.35));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.02, 8, 120), mat(0x3d4bff, 0.9));
    ring.rotation.x = Math.PI / 2.4;
    const group = new THREE.Group();
    group.add(ico, knot, ring);
    group.position.x = -2.2;            // يميل لليسار ليترك مساحة للنص العربي
    scene.add(group);

    const N = 500, pos = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 40;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xeef0ff, size: 0.04 }));
    scene.add(stars);

    const mouse = { x: 0, y: 0 };
    addEventListener("pointermove", (e) => {
      mouse.x = (e.clientX / innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / innerHeight - 0.5) * 2;
    });

    const resize = () => {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      group.position.x = innerWidth < 760 ? 0 : -2.2;
    };
    addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    (function loop() {
      const t = clock.getElapsedTime();
      const scroll = window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
      if (!reduceMotion) {
        ico.rotation.x = t * 0.15 + scroll * 6;
        ico.rotation.y = t * 0.2;
        knot.rotation.x = -t * 0.3;
        knot.rotation.y = t * 0.25 + scroll * 4;
        ring.rotation.z = t * 0.2;
        stars.rotation.y = t * 0.01;
      }
      // الكاميرا تتبع المؤشر والتمرير بنعومة (lerp)
      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.04;
      camera.position.z = 9 - scroll * 3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    })();
  }

  if (!hasGSAP) return;   // بقية التأثيرات تحتاج GSAP

  /* ---------- 3) افتتاحية الواجهة (لحظة واحدة منسّقة) ---------- */
  if (!reduceMotion) {
    gsap.from(".hero__title .line span", { yPercent: 115, rotationX: -40, duration: 1.2, stagger: 0.18, ease: "power4.out", delay: 0.2 });
    gsap.from(".hero__meta, .hero__fr, .hero__author, .hero__cta", { opacity: 0, y: 24, duration: 0.9, stagger: 0.12, delay: 0.8, ease: "power2.out" });

    // Parallax للطبقات المتداخلة: مع المؤشر ومع التمرير
    const blobs = document.querySelectorAll(".blob");
    blobs.forEach((b) => {
      gsap.to(b, { yPercent: 35 * (+b.dataset.depth * 10), scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
    });
    if (finePointer) {
      addEventListener("pointermove", (e) => {
        const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
        blobs.forEach((b) => gsap.to(b, { x: -x * 400 * b.dataset.depth, y: y * 400 * b.dataset.depth, duration: 1.2, ease: "power3.out", overwrite: "auto" }));
      });
    }
  }

  /* ---------- 4) انتقالات المشاهد ثلاثية الأبعاد ---------- */
  // كل مشهد: يدخل بميلان للأمام، ويخرج بالتراجع للخلف مع تصغير وتعتيم
  const scenes = gsap.utils.toArray(".scene");
  if (!reduceMotion) {
    scenes.forEach((sc, i) => {
      const inner = sc.querySelector(".scene__inner");
      if (i > 0) {
        gsap.from(inner, {
          rotationX: 14, y: 90, z: -120, opacity: 0, transformOrigin: "50% 0%", ease: "none",
          scrollTrigger: { trigger: sc, start: "top 92%", end: "top 35%", scrub: true }
        });
      }
      if (i < scenes.length - 1) {
        gsap.to(inner, {
          rotationX: -10, scale: 0.9, z: -200, opacity: 0.15, transformOrigin: "50% 100%", ease: "none",
          scrollTrigger: { trigger: sc, start: "bottom 80%", end: "bottom 5%", scrub: true }
        });
      }
    });
  }

  /* ---------- 5) شريط التقدم والنقاط الجانبية ---------- */
  gsap.to("#progressBar", { scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 } });

  const dots = document.querySelectorAll(".dots a");
  scenes.forEach((sc, i) => {
    ScrollTrigger.create({
      trigger: sc, start: "top 55%", end: "bottom 55%",
      onToggle: (self) => { if (self.isActive) dots.forEach((d, k) => d.classList.toggle("is-active", k === i)); }
    });
  });

  /* ---------- 6) تأثير الإمالة ثلاثية الأبعاد (3D tilt) ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const strength = el.classList.contains("card") ? 12 : 18;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const base = el.classList.contains("is-flipped") ? 180 : 0;   // نحافظ على حالة القلب
        el.style.transition = "transform .15s";
        el.style.transform = `perspective(900px) rotateX(${-py * strength}deg) rotateY(${base + px * strength}deg) translateZ(14px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transition = ""; el.style.transform = ""; });
    });
  }

  /* ---------- 7) قلب البطاقات ---------- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", flipped);
      card.style.transition = ""; card.style.transform = "";   // يعيد التحكم لـ CSS أثناء القلب
    });
  });

  /* ---------- 8) سوق العمل: تبويبات تفاعلية ---------- */
  const market = {
    startup: {
      title: "الشركات الناشئة",
      text: "تحتاج الشركات الناشئة فريقاً صغيراً متعدد المهارات: من يصمم الواجهة، ويبني الصفحة، ويصنع إعلان الفيديو. وخريج الإنتاج الرقمي مؤهل لذلك.",
      roles: ["مصمم UI/UX", "مطور واجهات", "مدير منتج مساعد", "صانع محتوى بصري"],
      fr: "Les start-up recherchent des profils polyvalents capables de concevoir, produire et publier."
    },
    agency: {
      title: "الوكالات الرقمية",
      text: "تعمل الوكالات على هويات العلامات والحملات والمواقع. يتنقل الخريج بين التصميم والمونتاج والتطوير حسب احتياج المشروع.",
      roles: ["مصمم جرافيك", "موشن ديزاينر", "مطور ويب", "مدير إبداعي مستقبلاً"],
      fr: "Les agences digitales mêlent identité visuelle, campagnes et sites web."
    },
    media: {
      title: "الإنتاج والمحتوى",
      text: "القنوات والمنصات والمؤسسات تحتاج فيديو وصوتاً ورسوماً متحركة بلغة عربية جذابة، ويغطي هذا المحور مهارات المونتاج والصوتيات.",
      roles: ["مونتير", "مهندس صوت", "رسام متحرك", "منتج محتوى رقمي"],
      fr: "Médias et plateformes ont besoin de vidéo, de son et d’animation de qualité."
    },
    free: {
      title: "العمل الحر وبناء مشروعك",
      text: "يتيح التخصص بيع الخدمات للعملاء داخل الجزائر وخارجها، أو إطلاق متجر أو منصة خاصة تجمع التصميم والتطوير والتسويق البصري.",
      roles: ["مستقل (Freelance)", "مؤسس متجر إلكتروني", "مصمم قوالب", "مدرّب رقمي"],
      fr: "Le freelancing et l’entrepreneuriat permettent de transformer ses compétences en activité."
    }
  };

  const panel = document.getElementById("panel");
  const $ = (id) => document.getElementById(id);
  const chips = document.querySelectorAll(".chip");

  function showSector(key) {
    const d = market[key];
    $("pTitle").textContent = d.title;
    $("pText").textContent = d.text;
    $("pFr").textContent = d.fr;
    $("pRoles").innerHTML = d.roles.map((r) => `<li>${r}</li>`).join("");
    if (!reduceMotion) {
      gsap.fromTo(panel, { rotationY: 18, opacity: 0, transformPerspective: 900 }, { rotationY: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
      gsap.from("#pRoles li", { y: 14, opacity: 0, stagger: 0.07, duration: 0.5, delay: 0.15 });
    }
  }
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-selected", c === chip); });
    showSector(chip.dataset.key);
  }));
  showSector("startup");

  // إعادة حساب المواضع بعد تحميل الخطوط والصور
  addEventListener("load", () => ScrollTrigger.refresh());
})();
