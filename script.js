(function () {
  var form = document.querySelector('.cform');
  if (form) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var status = form.querySelector('.cstatus'), btn = form.querySelector('.cbtn');
    btn.disabled = true; status.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (res.ok) { form.reset(); status.textContent = 'Thanks. Your message is on its way.'; }
        else { status.textContent = 'That didn’t send. Please try again.'; }
      })
      .catch(function () { status.textContent = 'That didn’t send. Please check your connection and try again.'; })
      .then(function () { btn.disabled = false; });
  });
  var tog = document.getElementById('navtog');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { if (tog) tog.checked = false; });
  });
  var map = { profile: 'profile', competencies: 'competencies', regulated: 'competencies', remit: 'competencies', disciplines: 'experience', experience: 'experience', approach: 'approach', education: 'education', download: 'education', contact: 'contact' };
  var links = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  function setActive(key) {
    Object.keys(links).forEach(function (k) {
      var on = k === key;
      links[k].classList.toggle('active', on);
      if (on) links[k].setAttribute('aria-current', 'true'); else links[k].removeAttribute('aria-current');
    });
  }
  var order = ['top','profile','competencies','regulated','remit','disciplines','experience','approach','education','download','contact'];
  var raf = null;
  function update() {
    var line = window.innerHeight * 0.35, current = null;
    order.forEach(function (id) { var el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= line) current = id; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contact';
    setActive(current ? (map[current] || null) : null);
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(function () { raf = null; update(); }); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
  (function () {
    var hero = document.getElementById('top');
    var paths = Array.prototype.slice.call(document.querySelectorAll('.hs-flex'));
    var node = document.querySelector('.hs-node');
    if (!hero || !paths.length || !node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var home = { x: 600, y: 318 }, cur = { x: 600, y: 318 }, tgt = { x: 600, y: 318 };
    var data = paths.map(function (p) { return { el: p, y0: +p.dataset.y0, y1: +p.dataset.y1, sp: +p.dataset.sp }; });
    function draw() {
      data.forEach(function (d) {
        var yc = cur.y + d.sp * 1.4;
        d.el.setAttribute('d', 'M-20,' + d.y0 + ' C260,' + d.y0 + ' ' + (cur.x - 200).toFixed(1) + ',' + (yc + 6).toFixed(1) + ' ' + cur.x.toFixed(1) + ',' + yc.toFixed(1) + ' S' + (cur.x + 460).toFixed(1) + ',' + (yc - 6 + d.sp * 3).toFixed(1) + ' 1200,' + d.y1);
      });
      node.setAttribute('cx', cur.x.toFixed(1)); node.setAttribute('cy', cur.y.toFixed(1));
    }
    var raf2 = null;
    function tick() {
      cur.x += (tgt.x - cur.x) * 0.08; cur.y += (tgt.y - cur.y) * 0.08; draw();
      raf2 = (Math.abs(tgt.x - cur.x) > 0.2 || Math.abs(tgt.y - cur.y) > 0.2) ? requestAnimationFrame(tick) : null;
    }
    function kick() { if (!raf2) raf2 = requestAnimationFrame(tick); }
    var pressed = false;
    function aim(e) {
      var r = hero.getBoundingClientRect();
      var fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      var fy = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      tgt.x = 380 + fx * 440; tgt.y = 250 + fy * 130; kick();
    }
    function goHome() { tgt.x = home.x; tgt.y = home.y; kick(); }
    hero.addEventListener('pointermove', function (e) { if (canHover && e.pointerType === 'mouse') aim(e); else if (pressed) aim(e); });
    hero.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('a, button, input, textarea, label')) return;
      pressed = true; node.setAttribute('r', '10'); aim(e);
    });
    function up() { if (!pressed) return; pressed = false; node.setAttribute('r', '7'); if (!canHover) goHome(); }
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    hero.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' || !pressed) goHome(); });
  })();
})();
