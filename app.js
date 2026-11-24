/* Cross Crossing Medical Centre, concept build. Booking is a front-end demo only. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
  const TZ = 'America/Port_of_Spain';

  /* ---------- data (from the clinic's own site; descriptions are general) ---------- */
  const SPECS = [
    { k: 'family', n: 'Family Practice', sub: 'Check-ups for every age', ic: 'ph-users-three', img: '1758691461957-474a7686e388',
      t: 'Everyday care for the whole family: check-ups, fevers and infections, long-term conditions, and a referral down the hall when you need a specialist.',
      c: ['Routine check-ups', 'Children and adults', 'Medicals', 'Referrals'] },
    { k: 'cardiology', n: 'Cardiology', sub: 'Heart and blood pressure', ic: 'ph-heartbeat', img: '1530026405186-ed1f139313f8',
      t: 'Assessment of chest pain, palpitations and high blood pressure, backed by echo, ECG, stress testing and Holter monitoring on site.',
      c: ['Chest pain', 'Blood pressure', 'Palpitations', 'Echo and ECG'] },
    { k: 'endocrinology', n: 'Endocrinology', sub: 'Diabetes, thyroid, hormones', ic: 'ph-drop', img: '1581594693702-fbdc51b2763b',
      t: 'Care for diabetes, thyroid and other hormone conditions, with blood work handled by the laboratory in the same building.',
      c: ['Diabetes', 'Thyroid', 'Hormones', 'Bone density'] },
    { k: 'internal', n: 'Internal Medicine', sub: 'Complex adult conditions', ic: 'ph-stethoscope', img: '1631217868264-e5b90bb7e133',
      t: 'For adults living with several long-term conditions at once, or symptoms that need a careful, joined-up work-up.',
      c: ['Long-term conditions', 'Second opinions', 'Diagnostic work-up'] },
    { k: 'occupational', n: 'Occupational Health', sub: 'Work medicals and fitness', ic: 'ph-hard-hat', img: '1612349317150-e413f6a5b16d',
      t: 'Pre-employment and periodic medicals, fitness-for-work checks and work injury follow-up for employers and their staff.',
      c: ['Pre-employment medicals', 'Fitness for work', 'Work injuries', 'Company accounts'] },
    { k: 'ortho', n: 'Orthopedic Surgery', sub: 'Bones, joints and injuries', ic: 'ph-bone', img: '1631563018856-81be9c118283',
      t: 'Fractures, sports injuries, back and joint pain. X-ray is on site, so most visits start and finish in one trip.',
      c: ['Fractures', 'Joint pain', 'Sports injuries', 'X-ray on site'] },
    { k: 'psych', n: 'Psychiatry', sub: 'Mental health care', ic: 'ph-brain', img: '1758691462863-9e1b8a863140',
      t: 'Confidential assessment and ongoing care for anxiety, depression, sleep problems and other mental health concerns.',
      c: ['Anxiety', 'Depression', 'Sleep', 'Confidential'] },
    { k: 'rheum', n: 'Rheumatology', sub: 'Arthritis and joints', ic: 'ph-hand', img: '1576091160550-2173dba999ef',
      t: 'Diagnosis and long-term care for arthritis, gout, lupus and other inflammatory joint and muscle conditions.',
      c: ['Arthritis', 'Gout', 'Lupus', 'Osteoporosis'] },
    { k: 'urology', n: 'Urology', sub: 'Kidney, bladder, prostate', ic: 'ph-gender-male', img: '1551076805-e1869033e561',
      t: 'Assessment and treatment for kidney stones, bladder problems and prostate health, with minor procedures in our surgical suites.',
      c: ['Prostate checks', 'Kidney stones', 'Bladder', 'Minor procedures'] },
  ];
  const TESTS = [
    { k: 'dexa', n: 'Bone density (DEXA)', ic: 'ph-person-simple', t: 'A low-dose scan that checks bone strength and osteoporosis risk.' },
    { k: 'sleep', n: 'Sleep study', ic: 'ph-moon-stars', t: 'An in-home study that looks for sleep apnoea while you sleep in your own bed.' },
    { k: 'echo', n: 'Echocardiogram', ic: 'ph-heart', t: 'An ultrasound of the heart that shows how it pumps and how the valves work.' },
    { k: 'ecg', n: 'Electrocardiogram', ic: 'ph-wave-sine', t: 'A quick, painless trace of your heart rhythm. Takes a few minutes.' },
    { k: 'lung', n: 'Lung function test', ic: 'ph-wind', t: 'Breathing tests for asthma, COPD and shortness of breath.' },
    { k: 'stress', n: 'Stress test', ic: 'ph-person-simple-run', t: 'Your heart is monitored while you exercise, to check how it copes with effort.' },
    { k: 'holter', n: 'Holter monitor', ic: 'ph-watch', t: 'A small recorder you wear at home to catch rhythm problems over a day or more.' },
    { k: 'lab', n: 'Laboratory tests', ic: 'ph-flask', t: 'Blood and urine tests processed by the laboratory on site.' },
    { k: 'xray', n: 'X-ray', ic: 'ph-scan', t: 'Imaging for chest, bones and joints, in the same building as your doctor.' },
  ];
  const OTHER = [
    { k: 'gp-visit', n: 'Doctor visit', ic: 'ph-first-aid' },
    { k: 'vacc', n: 'Vaccination', ic: 'ph-syringe' },
    { k: 'paeds', n: "Paediatric care", ic: 'ph-baby' },
    { k: 'womens', n: "Women's health", ic: 'ph-gender-female' },
  ];
  const ALL = {};
  [...SPECS, ...TESTS, ...OTHER].forEach(s => ALL[s.k] = s);

  /* ---------- theme ---------- */
  $('.theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('ccmc-theme', next); } catch (e) {}
    $('meta[name=theme-color]').content = next === 'dark' ? '#0D1412' : '#F3F5F4';
  });

  /* ---------- nav ---------- */
  const nav = $('.nav'), burger = $('.burger'), sheet = $('.sheet');
  const setMenu = open => { nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); sheet.setAttribute('aria-hidden', !open); };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('.sheet a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  const sentinel = document.createElement('div'); sentinel.style.cssText = 'position:absolute;top:8px;height:1px;width:1px';
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => nav.classList.toggle('scrolled', !e.isIntersecting)).observe(sentinel);

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  const observeRv = root => $$('.rv', root).forEach((el, i) => { el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms'; io.observe(el); });

  /* ---------- Trinidad clock ---------- */
  const tParts = (d = new Date()) => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' }).formatToParts(d).map(x => [x.type, x.value]));
    return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, wd: p.weekday };
  };
  const fmt12 = (h, m) => `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
  const tick = () => {
    const t = tParts();
    $$('.js-clock').forEach(el => el.textContent = fmt12(t.h, t.min));
    const ds = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    $$('.js-date').forEach(el => el.textContent = ds);
    // Clinic states it is open 24/7/365, so status is always open; computed so it can change if hours ever change.
    const open = true;
    $$('.js-open').forEach(el => el.textContent = open ? 'Open now' : 'Closed');
  };
  tick(); setInterval(tick, 15000);

  /* ---------- directory ---------- */
  const list = $('.dir-list'), pv = $('.dir-preview');
  list.innerHTML = SPECS.map((s, i) => `
    <div class="dir-row rv${i === 0 ? ' active' : ''}" data-k="${s.k}">
      <button class="dir-btn" type="button" role="tab" aria-selected="${i === 0}" aria-controls="dp-${s.k}">
        <i class="ph-light ${s.ic} ic"></i>
        <span class="nm">${s.n}<span class="sub">${s.sub}</span></span>
        <i class="ph-light ph-arrow-right chev"></i>
      </button>
      <div class="dir-panel" id="dp-${s.k}">
        <img src="${U(s.img, 800)}" alt="" loading="lazy">
        <p>${s.t}</p>
        <ul class="dp-chips">${s.c.map(c => `<li>${c}</li>`).join('')}</ul>
        <a class="btn btn-solid" href="#book" data-book="${s.k}">Book ${s.n} <span class="isle"><i class="ph-light ph-arrow-right"></i></span></a>
      </div>
    </div>`).join('');
  let swapT;
  const showSpec = (k, instant) => {
    const s = ALL[k];
    $$('.dir-row', list).forEach(r => { const on = r.dataset.k === k; r.classList.toggle('active', on); $('.dir-btn', r).setAttribute('aria-selected', on); });
    const apply = () => {
      const img = $('.pv-img img', pv); img.src = U(s.img, 1000); img.alt = s.n;
      $('.pv-title', pv).textContent = s.n; $('.pv-text', pv).textContent = s.t;
      $('.pv-chips', pv).innerHTML = s.c.map(c => `<li>${c}</li>`).join('');
      $('.pv-name', pv).textContent = s.n; $('.pv-book', pv).dataset.book = k;
      pv.classList.remove('swap');
    };
    clearTimeout(swapT);
    if (instant) return apply();
    pv.classList.add('swap'); swapT = setTimeout(apply, 220);
  };
  const isPhone = () => matchMedia('(max-width:767px)').matches;
  list.addEventListener('click', e => {
    const b = e.target.closest('.dir-btn'); if (!b) return;
    const row = b.closest('.dir-row');
    if (isPhone() && row.classList.contains('active')) { row.classList.remove('active'); b.setAttribute('aria-selected', false); return; }
    showSpec(row.dataset.k);
  });
  list.addEventListener('mouseover', e => {
    if (isPhone() || !matchMedia('(hover:hover)').matches) return;
    const row = e.target.closest('.dir-row'); if (row && !row.classList.contains('active')) showSpec(row.dataset.k);
  });
  showSpec(SPECS[0].k, true);
  // preload preview images on desktop so hovering feels instant
  if (!isPhone()) setTimeout(() => SPECS.forEach(s => { const i = new Image(); i.src = U(s.img, 1000); }), 2500);

  /* ---------- tests rail ---------- */
  const rail = $('.rail');
  rail.innerHTML = TESTS.map(t => `<li class="test"><i class="ph-light ${t.ic}"></i><h3>${t.n}</h3><p>${t.t}</p><button type="button" data-book="${t.k}">Book this test <i class="ph-light ph-arrow-right"></i></button></li>`).join('');
  const step = () => rail.querySelector('.test').getBoundingClientRect().width + 14;
  $('.rail-next').addEventListener('click', () => rail.scrollBy({ left: step() * 2, behavior: 'smooth' }));
  $('.rail-prev').addEventListener('click', () => rail.scrollBy({ left: -step() * 2, behavior: 'smooth' }));

  /* ---------- booking ---------- */
  const form = $('#book-form');
  const state = { step: 1, svc: null, day: null, slot: null, ref: '' };
  const groups = [
    ['Specialist consultation', SPECS],
    ['Tests and scans', TESTS],
    ['General care', OTHER],
  ];
  $('.svc-groups').innerHTML = groups.map(([h, arr]) => `
    <div class="svc-group"><h4>${h}</h4><div class="svc-list">
      ${arr.map(s => `<label class="opt"><input type="radio" name="svc" value="${s.k}"><span><i class="ph-light ${s.ic}"></i>${s.n}</span></label>`).join('')}
    </div></div>`).join('');

  const hash = str => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const now = tParts();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.UTC(now.y, now.m - 1, now.d + i, 12));
    return { iso: d.toISOString().slice(0, 10), d, i,
      wd: d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }),
      num: d.getUTCDate(),
      long: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) };
  });
  const daysEl = $('.days');
  daysEl.innerHTML = days.map(d => `<button type="button" class="day" role="option" aria-selected="false" data-iso="${d.iso}"><small>${d.i === 0 ? 'Today' : d.wd}</small><b>${d.num}</b></button>`).join('');

  const SLOT_TIMES = [];
  for (let h = 8; h <= 16; h++) for (const m of [0, 30]) if (!(h === 16 && m === 30)) SLOT_TIMES.push([h, m]);
  const renderSlots = () => {
    const d = days.find(x => x.iso === state.day);
    $('.js-day-label').textContent = d ? d.long : '';
    const t = tParts();
    let open = 0;
    const html = SLOT_TIMES.map(([h, m]) => {
      const id = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const past = d.i === 0 && (h * 60 + m) <= (t.h * 60 + t.min + 45);
      const taken = hash(state.day + (state.svc || '') + id) % 10 < 3;
      const dis = past || taken;
      if (!dis) open++;
      return `<button type="button" class="slot" role="option" data-t="${id}" aria-selected="${state.slot === id}" ${dis ? 'disabled' : ''} aria-label="${fmt12(h, m)}${dis ? ', unavailable' : ''}">${fmt12(h, m)}</button>`;
    }).join('');
    $('.slots').innerHTML = open ? html
      : `<p class="empty">No appointment times left today. Pick another day, or walk in: the clinic is open 24 hours.</p>`;
  };
  const pickDay = iso => {
    state.day = iso; state.slot = null;
    $$('.day', daysEl).forEach(b => b.setAttribute('aria-selected', b.dataset.iso === iso));
    renderSlots(); sync();
  };
  daysEl.addEventListener('click', e => { const b = e.target.closest('.day'); if (b) { pickDay(b.dataset.iso); hideErr('slot'); } });
  $('.slots').addEventListener('click', e => {
    const b = e.target.closest('.slot'); if (!b || b.disabled) return;
    state.slot = b.dataset.t;
    $$('.slot').forEach(x => x.setAttribute('aria-selected', x === b));
    hideErr('slot'); sync();
  });
  form.addEventListener('change', e => {
    if (e.target.name === 'svc') { state.svc = e.target.value; hideErr('service'); if (state.day) renderSlots(); state.slot = null; sync(); }
  });

  const showErr = k => { const el = $(`[data-err="${k}"]`); el.hidden = false; el.closest('.field')?.classList.add('bad'); };
  const hideErr = k => { const el = $(`[data-err="${k}"]`); if (el) { el.hidden = true; el.closest('.field')?.classList.remove('bad'); } };
  ['name', 'phone', 'email'].forEach(k => form.elements[k].addEventListener('input', () => hideErr(k)));

  const sync = () => {
    const set = (sel, v) => { const el = $(sel); el.textContent = v || 'Not chosen'; el.classList.toggle('empty', !v); };
    set('.js-s-svc', state.svc && ALL[state.svc].n);
    set('.js-s-day', state.day && days.find(d => d.iso === state.day).long);
    set('.js-s-time', state.slot && fmt12(+state.slot.slice(0, 2), +state.slot.slice(3)));
  };

  const validate = s => {
    if (s === 1 && !state.svc) { showErr('service'); return false; }
    if (s === 2 && !state.slot) { showErr('slot'); return false; }
    if (s === 3) {
      let ok = true;
      const f = form.elements;
      if (f.name.value.trim().length < 2) { showErr('name'); ok = false; }
      const digits = f.phone.value.replace(/\D/g, '');
      if (!(digits.length === 7 || digits.length === 10 || (digits.length === 11 && digits.startsWith('1')))) { showErr('phone'); ok = false; }
      if (f.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value)) { showErr('email'); ok = false; }
      if (!ok) form.querySelector('.field.bad input')?.focus();
      return ok;
    }
    return true;
  };

  const go = n => {
    state.step = n;
    $$('.pane', form).forEach(p => p.classList.toggle('is-on', +p.dataset.step === n));
    $$('.steps li').forEach((li, i) => { li.classList.toggle('on', i + 1 === n); li.classList.toggle('past', i + 1 < n); });
    $('.js-back').hidden = n === 1 || n === 4;
    $('.js-next').hidden = n === 4;
    $('.js-next').firstChild.textContent = n === 3 ? 'Confirm booking ' : 'Continue ';
    if (n === 2 && !state.day) pickDay(days[0].iso);
    if (n === 4) renderDone();
    const top = $('.console').getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * 0.5) $('.console').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  form.addEventListener('submit', e => { e.preventDefault(); if (validate(state.step)) go(state.step + 1); });
  $('.js-back').addEventListener('click', () => go(state.step - 1));

  const renderDone = () => {
    const f = form.elements;
    state.ref = 'CCMC-' + (hash(state.day + state.slot + f.name.value) % 90000 + 10000);
    $('.js-ref').textContent = state.ref;
    const d = days.find(x => x.iso === state.day);
    const rows = [
      ['Service', ALL[state.svc].n], ['When', `${d.long}, ${fmt12(+state.slot.slice(0, 2), +state.slot.slice(3))}`],
      ['Name', f.name.value.trim()], ['Phone', f.phone.value.trim()],
    ];
    $('.done-sum').innerHTML = rows.map(([a, b]) => `<div><dt>${a}</dt><dd></dd></div>`).join('');
    $$('.done-sum dd').forEach((dd, i) => dd.textContent = rows[i][1]); // textContent: no HTML injection from user input
    setTimeout(() => $('.done').focus({ preventScroll: true }), 50);
  };

  $('.js-ics').addEventListener('click', () => {
    const [Y, M, D] = state.day.split('-').map(Number);
    const [h, m] = state.slot.split(':').map(Number);
    const start = new Date(Date.UTC(Y, M - 1, D, h + 4, m)); // Trinidad is UTC-4, no daylight saving
    const end = new Date(start.getTime() + 30 * 60000);
    const z = dt => dt.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CCMC demo//EN', 'BEGIN:VEVENT',
      `UID:${state.ref}@ccmc-demo`, `DTSTAMP:${z(new Date())}`, `DTSTART:${z(start)}`, `DTEND:${z(end)}`,
      `SUMMARY:${ALL[state.svc].n} at Cross Crossing Medical Centre (demo)`,
      'LOCATION:Cross Crossing Medical Centre\\, Oliver Avenue\\, Cross Crossing\\, San Fernando',
      `DESCRIPTION:Reference ${state.ref}. Demo booking only. Call (868) 652-4411.`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = `ccmc-${state.ref}.ics`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  $('.js-restart').addEventListener('click', () => {
    form.reset(); Object.assign(state, { svc: null, day: null, slot: null });
    $$('.day').forEach(b => b.setAttribute('aria-selected', false)); $('.slots').innerHTML = '';
    sync(); go(1);
  });

  // "Book" buttons anywhere on the page preselect the service
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-book]'); if (!b) return;
    e.preventDefault();
    const k = b.dataset.book; const input = form.querySelector(`input[name=svc][value="${k}"]`);
    if (input) { input.checked = true; state.svc = k; state.slot = null; hideErr('service'); sync(); }
    go(1);
    $('#book').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  sync();

  /* ---------- phone dock hides over the booking console & footer CTAs ---------- */
  const dock = $('.dock');
  const vis = new Set();
  const dio = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)); dock.classList.toggle('hide', vis.size > 0); }, { threshold: 0.15 });
  [$('.console'), $('.final-ctas'), $('.hero-ctas')].forEach(el => dio.observe(el));

  observeRv(document);
})();
