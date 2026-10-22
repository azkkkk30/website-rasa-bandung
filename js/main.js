(function () {
  'use strict';

  /* ------------------------------------------------------------------
     PENGATURAN FORMULIR
     - Di Netlify: biarkan kosong. Formulir otomatis dikenali (data-netlify).
     - Di GitHub Pages / Vercel / hosting lain: isi dengan endpoint Formspree,
       mis. 'https://formspree.io/f/xxxxxxx'
  ------------------------------------------------------------------ */
  var FORM_ENDPOINT = '';
  var EMAIL_CADANGAN = ''; // opsional: alamat email yang ditampilkan jika pengiriman gagal

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Tahun footer ---------- */
  var tahun = $('#tahun');
  if (tahun) tahun.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var menuBtn = $('#menu-btn');
  var menu = $('#menu-mobile');
  var menuIcon = $('#menu-icon');
  function setMenu(open) {
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    menuIcon.setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menu.classList.contains('hidden')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Kotak pencarian + chip: mengisi formulir lalu menggulir ke sana ---------- */
  var formKontak = $('#form-kontak');
  var pesan = $('#pesan');
  var kategoriSel = $('#kategori');
  var budgetSel = $('#budget');
  var chips = $$('[data-chip]');

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
    });
  });

  function pilihOpsi(sel, nilai) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === nilai || sel.options[i].text === nilai) { sel.selectedIndex = i; return true; }
    }
    return false;
  }

  function keFormulir(fokusId) {
    var target = $('#kontak');
    if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setTimeout(function () { var f = $(fokusId || '#nama'); if (f) f.focus({ preventScroll: true }); }, 450);
  }

  var formCari = $('#form-cari');
  if (formCari) {
    formCari.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = $('#cari').value.trim();
      var aktif = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
                       .map(function (c) { return c.getAttribute('data-chip'); });
      var bagian = [];
      if (q) bagian.push('Saya mencari: ' + q);
      if (aktif.length) bagian.push('Filter: ' + aktif.join(', '));
      if (bagian.length) pesan.value = bagian.join('. ') + '.';
      if (aktif.indexOf('Malam') > -1) pilihOpsi(kategoriSel, 'Kuliner Malam');
      else if (aktif.indexOf('Kaki lima') > -1) pilihOpsi(kategoriSel, 'Kaki Lima');
      if (aktif.indexOf('Rp25–50rb') > -1) pilihOpsi(budgetSel, 'Rp25.000–Rp50.000');
      keFormulir('#nama');
    });
  }

  /* ---------- Kategori populer: pilih kategori di formulir ---------- */
  $$('[data-kategori]').forEach(function (b) {
    b.addEventListener('click', function () {
      pilihOpsi(kategoriSel, b.getAttribute('data-kategori'));
      keFormulir('#nama');
    });
  });

  /* ---------- "Coba Filter Sekarang": ke kotak pencarian di atas ---------- */
  var ctaFilter = $('#cta-filter');
  if (ctaFilter) {
    ctaFilter.addEventListener('click', function (e) {
      e.preventDefault();
      var hero = $('#beranda');
      hero.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      setTimeout(function () { $('#cari').focus({ preventScroll: true }); }, 450);
    });
  }

  /* ---------- Validasi & pengiriman formulir ---------- */
  var status = $('#status-form');
  var kirim = $('#kirim');
  var teksKirim = kirim ? kirim.textContent : '';

  function tampilStatus(jenis, teks) {
    status.className = 'mt-4 rounded-[10px] px-4 py-3 text-sm font-semibold ' +
      (jenis === 'ok' ? 'bg-green-50 text-green-900 border border-green-700' : 'bg-red-50 text-red-900 border border-red-700');
    status.textContent = teks;
    status.classList.remove('hidden');
  }

  function pesanError(el) {
    var v = el.validity;
    if (el.id === 'nama') {
      if (v.valueMissing) return 'Nama wajib diisi.';
      if (v.tooShort) return 'Nama minimal 2 karakter.';
    }
    if (el.id === 'email') {
      if (v.valueMissing) return 'Email wajib diisi.';
      if (v.typeMismatch || v.patternMismatch) return 'Format email belum benar, contoh: nama@email.com.';
    }
    return el.validationMessage;
  }

  function cek(el) {
    var err = $('#err-' + el.id);
    if (!err) return true;
    var ok = el.checkValidity();
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    err.textContent = ok ? '' : pesanError(el);
    err.classList.toggle('hidden', ok);
    return ok;
  }

  if (formKontak) {
    var wajib = $$('input[required], textarea[required]', formKontak);
    wajib.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value !== '') cek(el); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') cek(el); });
    });

    formKontak.addEventListener('submit', function (e) {
      e.preventDefault();
      status.classList.add('hidden');

      var valid = true, pertama = null;
      wajib.forEach(function (el) { if (!cek(el)) { valid = false; if (!pertama) pertama = el; } });
      if (!valid) { pertama.focus(); return; }

      var data = new URLSearchParams(new FormData(formKontak));
      if (data.get('bot-field')) return; // jebakan spam: abaikan diam-diam

      kirim.disabled = true;
      kirim.textContent = 'Mengirim…';
      kirim.classList.add('opacity-70', 'cursor-wait');

      fetch(FORM_ENDPOINT || formKontak.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body: data.toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var nama = (data.get('nama') || '').split(' ')[0];
        formKontak.reset();
        pilihOpsi(budgetSel, 'Rp25.000–Rp50.000');
        tampilStatus('ok', 'Terima kasih' + (nama ? ', ' + nama : '') + '! Permintaanmu sudah kami terima. Rekomendasi akan dikirim ke email kamu.');
      }).catch(function () {
        var pesanGagal = 'Maaf, pengiriman belum berhasil. Coba lagi sebentar lagi';
        if (EMAIL_CADANGAN) {
          pesanGagal += ', atau kirim lewat email: ' + EMAIL_CADANGAN;
        }
        tampilStatus('err', pesanGagal + '.');
      }).then(function () {
        kirim.disabled = false;
        kirim.textContent = teksKirim;
        kirim.classList.remove('opacity-70', 'cursor-wait');
        status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    });
  }

  /* ---------- Dialog kebijakan privasi ---------- */
  var dlg = $('#dlg-privasi');
  var bukaP = $('#buka-privasi');
  var tutupP = $('#tutup-privasi');
  if (dlg && bukaP && tutupP) {
    bukaP.addEventListener('click', function () {
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    });
    tutupP.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }
})();
