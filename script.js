(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================
     ١) المتاهة: توليد + رسم الجدران + خيط يجد الطريق
     ===================================================== */
  const landing = $('#landing');
  const stage = $('#stage');
  const wallsCv = $('#walls');
  const threadCv = $('#thread');
  const door = $('#door');
  const wctx = wallsCv.getContext('2d');
  const tctx = threadCv.getContext('2d');

  const N = 1, E = 2, S = 4, W = 8;
  const DIRS = [
    [0, -1, N, S],
    [1, 0, E, W],
    [0, 1, S, N],
    [-1, 0, W, E],
  ];

  let raf = 0;
  let lastSize = { w: 0, h: 0 };
  let goalPx = { x: 0, y: 0 };

  function buildMaze() {
    cancelAnimationFrame(raf);
    door.classList.remove('on');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    lastSize = { w, h };

    for (const cv of [wallsCv, threadCv]) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    wctx.clearRect(0, 0, w, h);
    tctx.clearRect(0, 0, w, h);

    const cell = Math.max(34, Math.min(54, Math.round(Math.min(w, h) / 12)));
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const ox = (w - cols * cell) / 2;
    const oy = (h - rows * cell) / 2;

    // --- توليد المتاهة (Recursive Backtracker) ---
    const walls = new Uint8Array(cols * rows).fill(15);
    const seen = new Uint8Array(cols * rows);
    const order = [0];
    const stack = [0];
    seen[0] = 1;

    while (stack.length) {
      const c = stack[stack.length - 1];
      const x = c % cols;
      const y = (c / cols) | 0;
      const opts = [];
      for (const [dx, dy, a, b] of DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx]) {
          opts.push([nx, ny, a, b]);
        }
      }
      if (!opts.length) { stack.pop(); continue; }
      const [nx, ny, a, b] = opts[(Math.random() * opts.length) | 0];
      const n = ny * cols + nx;
      walls[c] &= ~a;
      walls[n] &= ~b;
      seen[n] = 1;
      order.push(n);
      stack.push(n);
    }

    // --- موضع الباب (الهدف) ---
    const narrow = w < 760;
    const gx = Math.min(cols - 1, Math.max(0, narrow ? cols >> 1 : Math.round(cols * 0.34)));
    const gy = Math.min(rows - 1, Math.max(0, narrow ? Math.round(rows * 0.3) : rows >> 1));
    const goal = gy * cols + gx;
    goalPx = { x: ox + (gx + 0.5) * cell, y: oy + (gy + 0.5) * cell };
    door.style.left = goalPx.x + 'px';
    door.style.top = goalPx.y + 'px';
    stage.style.setProperty('--mx', goalPx.x + 'px');
    stage.style.setProperty('--my', goalPx.y + 'px');
    document.documentElement.style.setProperty('--mx', goalPx.x + 'px');
    document.documentElement.style.setProperty('--my', goalPx.y + 'px');

    // --- حل المتاهة (BFS) من المدخل إلى الباب ---
    const prev = new Int32Array(cols * rows).fill(-1);
    const queue = [0];
    prev[0] = 0;
    for (let qi = 0; qi < queue.length && prev[goal] === -1; qi++) {
      const c = queue[qi];
      const x = c % cols;
      const y = (c / cols) | 0;
      for (const [dx, dy, a] of DIRS) {
        if (walls[c] & a) continue;
        const n = (y + dy) * cols + (x + dx);
        if (prev[n] === -1) { prev[n] = c; queue.push(n); }
      }
    }
    const path = [];
    for (let c = goal; ; c = prev[c]) {
      path.push([ox + ((c % cols) + 0.5) * cell, oy + (((c / cols) | 0) + 0.5) * cell]);
      if (c === 0) break;
    }
    path.reverse();
    // نبدأ الخيط من خارج الحافة العلوية اليسرى كأنه يدخل من المدخل
    path.unshift([path[0][0], oy - cell * 0.5]);

    const segLens = [];
    let total = 0;
    for (let i = 1; i < path.length; i++) {
      const d = Math.abs(path[i][0] - path[i - 1][0]) + Math.abs(path[i][1] - path[i - 1][1]);
      segLens.push(d);
      total += d;
    }

    // --- الرسم ---
    function styleWalls() {
      wctx.strokeStyle = '#4f8f66';
      wctx.lineWidth = 3;
      wctx.lineCap = 'round';
    }

    function drawCells(from, to) {
      wctx.beginPath();
      for (let i = from; i < to; i++) {
        const c = order[i];
        const x = c % cols;
        const y = (c / cols) | 0;
        const px = ox + x * cell;
        const py = oy + y * cell;
        const wl = walls[c];
        if (wl & N && !(c === 0)) { wctx.moveTo(px, py); wctx.lineTo(px + cell, py); }
        if (wl & W) { wctx.moveTo(px, py); wctx.lineTo(px, py + cell); }
        if (x === cols - 1 && wl & E) { wctx.moveTo(px + cell, py); wctx.lineTo(px + cell, py + cell); }
        if (y === rows - 1 && wl & S) { wctx.moveTo(px, py + cell); wctx.lineTo(px + cell, py + cell); }
      }
      wctx.stroke();
    }

    function drawThread(dist) {
      tctx.clearRect(0, 0, w, h);
      tctx.strokeStyle = '#e4572e';
      tctx.lineWidth = 4;
      tctx.lineCap = 'round';
      tctx.lineJoin = 'round';
      tctx.beginPath();
      tctx.moveTo(path[0][0], path[0][1]);
      let left = dist;
      let hx = path[0][0];
      let hy = path[0][1];
      for (let i = 1; i < path.length && left > 0; i++) {
        const len = segLens[i - 1];
        const t = Math.min(1, left / len);
        hx = path[i - 1][0] + (path[i][0] - path[i - 1][0]) * t;
        hy = path[i - 1][1] + (path[i][1] - path[i - 1][1]) * t;
        tctx.lineTo(hx, hy);
        left -= len;
      }
      tctx.stroke();
      // رأس الخيط
      const g = tctx.createRadialGradient(hx, hy, 0, hx, hy, 14);
      g.addColorStop(0, 'rgba(255, 220, 170, 1)');
      g.addColorStop(1, 'rgba(228, 87, 46, 0)');
      tctx.fillStyle = g;
      tctx.beginPath();
      tctx.arc(hx, hy, 14, 0, Math.PI * 2);
      tctx.fill();
    }

    styleWalls();

    if (reduceMotion) {
      drawCells(0, order.length);
      drawThread(total);
      door.classList.add('on');
      return;
    }

    let drawn = 0;
    let dist = 0;
    const perFrame = Math.max(6, Math.ceil(order.length / 80));
    const speed = Math.max(8, total / 260);

    function frame() {
      if (drawn < order.length) {
        const next = Math.min(order.length, drawn + perFrame);
        drawCells(drawn, next);
        drawn = next;
        raf = requestAnimationFrame(frame);
        return;
      }
      if (dist < total) {
        dist = Math.min(total, dist + speed);
        drawThread(dist);
        raf = requestAnimationFrame(frame);
        return;
      }
      door.classList.add('on');
    }
    raf = requestAnimationFrame(frame);
  }

  // ضوء الكشّاف: الجدران حول المؤشر أوضح
  let moveQueued = false;
  window.addEventListener('pointermove', (e) => {
    if (moveQueued || landing.hidden) return;
    moveQueued = true;
    requestAnimationFrame(() => {
      stage.style.setProperty('--mx', e.clientX + 'px');
      stage.style.setProperty('--my', e.clientY + 'px');
      moveQueued = false;
    });
  }, { passive: true });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (landing.hidden) return;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (w !== lastSize.w || Math.abs(h - lastSize.h) > 150) buildMaze();
    }, 250);
  });

  /* =====================================================
     ٢) الدخول إلى المتاهة والعودة منها
     ===================================================== */
  const chat = $('#chat');
  const input = $('#input');

  function enterMaze() {
    stage.style.transformOrigin = `${goalPx.x}px ${goalPx.y}px`;
    landing.classList.add('entering');
    const delay = reduceMotion ? 0 : 1100;
    setTimeout(() => {
      cancelAnimationFrame(raf);
      landing.hidden = true;
      chat.hidden = false;
      input.focus({ preventScroll: true });
    }, delay);
  }

  function backToEntrance() {
    chat.hidden = true;
    landing.hidden = false;
    landing.classList.remove('entering');
    stage.style.transform = '';
    buildMaze();
  }

  $('#enter').addEventListener('click', enterMaze);
  $('#back').addEventListener('click', backToEntrance);

  /* =====================================================
     ٣) الدردشة مع Gemini
     ===================================================== */
  const BOT_NAME = 'خيط';
  const DEFAULT_MODEL = 'gemini-2.5-flash';
  const SYSTEM_PROMPT =
    `أنت "${BOT_NAME}"، مساعد دردشة ودود يرشد المستخدم داخل متاهة من الأسئلة. ` +
    'أجب بالعربية الفصحى المبسطة ما لم يكتب المستخدم بلغة أخرى. ' +
    'كن واضحاً ومباشراً، وقسّم الإجابات المعقدة إلى خطوات قصيرة.';

  const log = $('#log');
  const form = $('#composer');
  const sendBtn = $('#send');
  const dlg = $('#settings');
  const keyInput = $('#key');
  const modelInput = $('#model');

  const store = {
    get(k) { try { return localStorage.getItem(k) || ''; } catch { return ''; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* التخزين غير متاح */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* التخزين غير متاح */ } },
  };

  const history = []; // { role: 'user' | 'model', text }
  let busy = false;

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // تنسيق بسيط وآمن: كتل الكود، الكود المضمّن، الخط العريض، الأسطر
  function format(text) {
    const parts = escapeHtml(text).split(/```(?:[a-zA-Z0-9_+-]*)\n?/);
    return parts.map((part, i) => {
      if (i % 2 === 1) return `<pre><code>${part.replace(/\n$/, '')}</code></pre>`;
      return part
        .replace(/`([^`\n]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }).join('');
  }

  function addMessage(kind, text) {
    const el = document.createElement('div');
    el.className = `msg ${kind}`;
    if (kind === 'user') el.textContent = text;
    else el.innerHTML = format(text);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function addTyping() {
    const el = document.createElement('div');
    el.className = 'msg bot';
    el.innerHTML = '<span class="typing" aria-label="خيط يكتب"><i></i><i></i><i></i></span>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function explainError(status, apiMessage) {
    if (status === 400 && /API key/i.test(apiMessage)) return 'المفتاح غير صالح. افتح الإعدادات وتأكد من نسخه كاملاً.';
    if (status === 400) return `رفض Gemini الطلب: ${apiMessage}`;
    if (status === 403) return 'المفتاح غير مصرّح له باستخدام هذا النموذج. تحقق من المفتاح في Google AI Studio.';
    if (status === 404) return 'لم يُعثر على النموذج. غيّر اسمه في الإعدادات، مثل gemini-2.5-flash.';
    if (status === 429) return 'تجاوزت حد الطلبات. انتظر قليلاً ثم أعد المحاولة.';
    if (status >= 500) return 'خوادم Gemini مشغولة الآن. أعد المحاولة بعد لحظات.';
    return apiMessage || 'تعذّر الاتصال. تحقق من الإنترنت ثم أعد المحاولة.';
  }

  async function askGemini() {
    const key = store.get('khayt.key');
    const model = store.get('khayt.model') || DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      }),
    });

    let data = null;
    try { data = await res.json(); } catch { /* ردّ غير JSON */ }

    if (!res.ok) {
      const err = new Error(explainError(res.status, data?.error?.message || ''));
      err.status = res.status;
      throw err;
    }

    const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
    if (!text) {
      const reason = data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason;
      throw new Error(reason ? `لم يُنتج النموذج ردّاً (السبب: ${reason}). جرّب صياغة أخرى.` : 'وصل ردّ فارغ. أعد المحاولة.');
    }
    return text;
  }

  async function send(text) {
    if (busy) return;

    if (!store.get('khayt.key')) {
      openSettings();
      return;
    }

    busy = true;
    sendBtn.disabled = true;
    history.push({ role: 'user', text });
    addMessage('user', text);
    input.value = '';
    autoGrow();
    const typing = addTyping();

    try {
      const reply = await askGemini();
      history.push({ role: 'model', text: reply });
      typing.remove();
      addMessage('bot', reply);
    } catch (err) {
      typing.remove();
      history.pop();               // لا نُبقي الرسالة الفاشلة في السجل
      input.value = text;          // نعيد النص ليعيد المستخدم الإرسال
      autoGrow();
      addMessage('error', err.message || 'حدث خطأ غير متوقع.');
      if (err.status === 400 || err.status === 403) openSettings();
    } finally {
      busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) send(text);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  function autoGrow() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 160) + 'px';
  }
  input.addEventListener('input', autoGrow);

  /* ---------- الإعدادات ---------- */
  function openSettings() {
    keyInput.value = store.get('khayt.key');
    modelInput.value = store.get('khayt.model');
    if (!dlg.open) dlg.showModal();
    keyInput.focus();
  }

  $('#open-settings').addEventListener('click', openSettings);

  $('#save-settings').addEventListener('click', () => {
    const key = keyInput.value.trim();
    const model = modelInput.value.trim();
    if (key) store.set('khayt.key', key);
    if (model) store.set('khayt.model', model); else store.del('khayt.model');
  });

  $('#clear-key').addEventListener('click', () => {
    store.del('khayt.key');
    keyInput.value = '';
    addMessage('bot', 'حذفتُ المفتاح من هذا المتصفح.');
  });

  /* ---------- البداية ---------- */
  addMessage('bot', `أنا ${BOT_NAME}. اسألني وسأمسك بيدك حتى المخرج.`);
  if (!store.get('khayt.key')) {
    addMessage('bot', 'قبل أن نبدأ، أضف مفتاح Gemini API من زر «الإعدادات».');
  }

  buildMaze();
})();
