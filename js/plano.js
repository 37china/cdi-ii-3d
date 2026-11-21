/* Plano 2D com eixos, regiões, linhas de nível, campos e pontos arrastáveis. */
(function () {
  function cssVar(n, f) { const v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }

  class Plano {
    constructor(host, opts = {}) {
      this.opts = Object.assign({ janela: [-2, 2, -2, 2], dica: 'Arrasta os pontos · arrasta o fundo para mover · pinça para zoom', grelha: true }, opts);
      this.el = document.createElement('div');
      this.el.className = 'vista plano';
      this.el.innerHTML = '<canvas></canvas><div class="vdica"></div><div class="vbtns"><button type="button" data-z="1" aria-label="Aproximar">+</button><button type="button" data-z="-1" aria-label="Afastar">−</button><button type="button" data-r aria-label="Repor a vista">↺</button></div>';
      this.el.querySelector('.vdica').textContent = this.opts.dica;
      host.appendChild(this.el);
      this.cv = this.el.querySelector('canvas');
      this.ctx = this.cv.getContext('2d');
      this.cena = null;
      this.alcas = [];
      this.pend = false;
      this.janela(this.opts.janela);
      this._eventos();
      this.ro = new ResizeObserver(() => this.tamanho());
      this.ro.observe(this.el);
      this.tamanho();
    }
    destruir() { this.ro.disconnect(); this.el.remove(); }
    janela(j) { this.j0 = j.slice(); this.c = [(j[0] + j[1]) / 2, (j[2] + j[3]) / 2]; this.zoom = 1; this.pedir(); }
    repor() { this.janela(this.j0); }
    tamanho() {
      const dpr = window.devicePixelRatio || 1;
      const r = this.el.getBoundingClientRect();
      this.W = Math.max(50, r.width); this.H = Math.max(50, r.height);
      this.cv.width = Math.round(this.W * dpr); this.cv.height = Math.round(this.H * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.desenhar();
    }
    get k() { // píxeis por unidade (mesma escala nos dois eixos)
      const j = this.j0;
      return Math.min(this.W / (j[1] - j[0]), this.H / (j[3] - j[2])) * 0.94 * this.zoom;
    }
    get kx() { return this.opts.livre ? (this.W / (this.j0[1] - this.j0[0])) * 0.94 * this.zoom : this.k; }
    get ky() { return this.opts.livre ? (this.H / (this.j0[3] - this.j0[2])) * 0.9 * this.zoom : this.k; }
    px(x, y) { return [this.W / 2 + (x - this.c[0]) * this.kx, this.H / 2 - (y - this.c[1]) * this.ky]; }
    mundo(sx, sy) { return [this.c[0] + (sx - this.W / 2) / this.kx, this.c[1] - (sy - this.H / 2) / this.ky]; }
    limites() { const a = this.mundo(0, this.H), b = this.mundo(this.W, 0); return [a[0], b[0], a[1], b[1]]; }
    definirCena(fn) { this.cena = fn; this.pedir(); }
    pedir() { if (this.pend) return; this.pend = true; requestAnimationFrame(() => { this.pend = false; this.desenhar(); }); }

    _eventos() {
      const cv = this.cv;
      const pts = new Map();
      let alca = null, pan = null, pinch = null, mov = 0;
      const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      cv.addEventListener('pointerdown', (e) => {
        cv.setPointerCapture(e.pointerId);
        pts.set(e.pointerId, [e.clientX, e.clientY]);
        mov = 0;
        if (pts.size === 2) { alca = null; pan = null; const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: this.zoom }; return; }
        const [sx, sy] = pos(e);
        const raio = e.pointerType === 'touch' ? 26 : 16;
        let melhor = null, dm = raio;
        for (const h of this.alcas) { const d = Math.hypot(h.sx - sx, h.sy - sy); if (d < dm) { dm = d; melhor = h; } }
        if (melhor) { alca = melhor; cv.style.cursor = 'grabbing'; }
        else pan = { s: [sx, sy], c: this.c.slice() };
      });
      cv.addEventListener('pointermove', (e) => {
        const [sx, sy] = pos(e);
        if (!pts.has(e.pointerId)) {
          let sobre = false;
          for (const h of this.alcas) if (Math.hypot(h.sx - sx, h.sy - sy) < 16) sobre = true;
          cv.style.cursor = sobre ? 'grab' : 'default';
          return;
        }
        const prev = pts.get(e.pointerId);
        pts.set(e.pointerId, [e.clientX, e.clientY]);
        mov += Math.abs(e.clientX - prev[0]) + Math.abs(e.clientY - prev[1]);
        if (pinch && pts.size === 2) {
          const [a, b] = [...pts.values()];
          this.zoom = Math.max(0.3, Math.min(6, pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d));
          this.pedir();
          return;
        }
        if (alca) { const w = this.mundo(sx, sy); alca.arr(w[0], w[1]); return; }
        if (pan) { this.c = [pan.c[0] - (sx - pan.s[0]) / this.kx, pan.c[1] + (sy - pan.s[1]) / this.ky]; this.pedir(); }
      });
      const fim = (e) => {
        if (!pts.has(e.pointerId)) return;
        pts.delete(e.pointerId);
        if (pts.size < 2) pinch = null;
        if (pts.size === 0) {
          if (!alca && mov < 4 && this.aoTocar) { const [sx, sy] = pos(e); const w = this.mundo(sx, sy); this.aoTocar(w[0], w[1]); }
          alca = null; pan = null; cv.style.cursor = 'default';
        }
      };
      cv.addEventListener('pointerup', fim);
      cv.addEventListener('pointercancel', fim);
      cv.addEventListener('wheel', (e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        this.zoom = Math.max(0.3, Math.min(6, this.zoom * Math.exp(-e.deltaY * 0.01)));
        this.pedir();
      }, { passive: false });
      this.el.querySelector('.vbtns').addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.r !== undefined) this.repor();
        else { this.zoom = Math.max(0.3, Math.min(6, this.zoom * (b.dataset.z === '1' ? 1.25 : 0.8))); this.pedir(); }
      });
    }

    _api() {
      const P = this, ctx = this.ctx;
      const tinta = cssVar('--ink', '#1b2420'), fundo = cssVar('--surface', '#fff'), mut = cssVar('--muted', '#5c6661'), linha = cssVar('--line', '#dce1da');
      const A = {
        cor: (n, f) => cssVar(n, f),
        limites: () => P.limites(),
        k: P.k,
        grelha() {
          const [x0, x1, y0, y1] = P.limites();
          const esc = (k) => [0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 50].find((s) => s * k > 38) || 50;
          const px_ = esc(P.kx), py_ = esc(P.ky);
          ctx.save(); ctx.strokeStyle = linha; ctx.lineWidth = 1;
          for (let x = Math.ceil(x0 / px_) * px_; x <= x1; x += px_) { const a = P.px(x, 0)[0]; ctx.beginPath(); ctx.moveTo(a, 0); ctx.lineTo(a, P.H); ctx.stroke(); }
          for (let y = Math.ceil(y0 / py_) * py_; y <= y1; y += py_) { const b = P.px(0, y)[1]; ctx.beginPath(); ctx.moveTo(0, b); ctx.lineTo(P.W, b); ctx.stroke(); }
          ctx.restore();
          return [px_, py_];
        },
        eixos(nomes = ['x', 'y']) {
          const [passo, passoY] = A.grelha();
          const o = P.px(0, 0);
          const eixo = cssVar('--eixo', '#8a909a');
          ctx.save(); ctx.strokeStyle = eixo; ctx.fillStyle = eixo; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(0, o[1]); ctx.lineTo(P.W, o[1]); ctx.moveTo(o[0], 0); ctx.lineTo(o[0], P.H); ctx.stroke();
          ctx.font = '11px IBM Plex Mono, ui-monospace, monospace';
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          const [x0, x1, y0, y1] = P.limites();
          const lx = Math.min(Math.max(o[1] + 4, 4), P.H - 16), ly = Math.min(Math.max(o[0] - 6, 22), P.W - 4);
          for (let x = Math.ceil(x0 / passo) * passo; x <= x1; x += passo) { if (Math.abs(x) < 1e-9) continue; const a = P.px(x, 0)[0]; ctx.fillText(CM.fmtC(x, 2), a, lx); }
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          for (let y = Math.ceil(y0 / passoY) * passoY; y <= y1; y += passoY) { if (Math.abs(y) < 1e-9) continue; const b = P.px(0, y)[1]; ctx.fillText(CM.fmtC(y, 2), ly, b); }
          ctx.font = 'italic 600 15px Georgia, serif';
          ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
          ctx.fillText(nomes[0], P.W - 8, Math.min(Math.max(o[1] - 4, 18), P.H - 4));
          ctx.textAlign = 'left'; ctx.textBaseline = 'top';
          ctx.fillText(nomes[1], Math.min(Math.max(o[0] + 6, 4), P.W - 20), 6);
          ctx.restore();
        },
        /* pinta os pontos onde dentro(x, y) é verdadeiro */
        regiao(dentro, cor, alfa = 0.28, res = 2) {
          const W = Math.ceil(P.W / res), H = Math.ceil(P.H / res);
          const img = ctx.createImageData(W, H);
          const c = hexRgb(cor);
          for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
            const w = P.mundo((i + 0.5) * res, (j + 0.5) * res);
            if (dentro(w[0], w[1])) { const k = 4 * (j * W + i); img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = Math.round(alfa * 255); }
          }
          A._img(img, W, H, res);
        },
        /* mapa de cores: val(x, y) → [r, g, b, a] */
        mapa(val, res = 3) {
          const W = Math.ceil(P.W / res), H = Math.ceil(P.H / res);
          const img = ctx.createImageData(W, H);
          for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
            const w = P.mundo((i + 0.5) * res, (j + 0.5) * res);
            const c = val(w[0], w[1]);
            if (!c) continue;
            const k = 4 * (j * W + i);
            img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = c[3] == null ? 255 : c[3];
          }
          A._img(img, W, H, res);
        },
        _img(img, W, H, res) {
          const o = document.createElement('canvas'); o.width = W; o.height = H;
          o.getContext('2d').putImageData(img, 0, 0);
          ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(o, 0, 0, W * res, H * res); ctx.restore();
        },
        curva(pts, o = {}) {
          ctx.save();
          ctx.strokeStyle = o.cor || tinta; ctx.lineWidth = o.larg || 2; ctx.globalAlpha = o.alfa == null ? 1 : o.alfa;
          ctx.lineJoin = 'round'; ctx.lineCap = 'round';
          if (o.trac) ctx.setLineDash(o.trac);
          ctx.beginPath();
          let novo = true;
          for (const p of pts) {
            if (!p || !isFinite(p[0]) || !isFinite(p[1])) { novo = true; continue; }
            const q = P.px(p[0], p[1]);
            if (novo) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]);
            novo = false;
          }
          if (o.fechar) ctx.closePath();
          if (o.encher) { ctx.fillStyle = o.encher; ctx.fill(); }
          ctx.stroke();
          ctx.restore();
        },
        param(g, a, b, n, o) { const pts = []; for (let i = 0; i <= n; i++) pts.push(g(a + ((b - a) * i) / n)); A.curva(pts, o); },
        funcao(f, o) { const [x0, x1] = P.limites(); const pts = []; const n = 400; for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n; pts.push([x, f(x)]); } A.curva(pts, o); },
        segs(segs, o = {}) {
          ctx.save(); ctx.strokeStyle = o.cor || tinta; ctx.lineWidth = o.larg || 2; ctx.globalAlpha = o.alfa == null ? 1 : o.alfa; ctx.lineCap = 'round';
          if (o.trac) ctx.setLineDash(o.trac);
          ctx.beginPath();
          for (const s of segs) { const a = P.px(...s[0]), b = P.px(...s[1]); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
          ctx.stroke(); ctx.restore();
        },
        nivel(f, c, o = {}) {
          const [x0, x1, y0, y1] = P.limites();
          const n = o.n || 140;
          A.segs(CM.contorno(f, x0, x1, y0, y1, n, Math.round((n * (y1 - y0)) / (x1 - x0)), c), o);
        },
        seta(o0, v, o = {}) {
          const a = P.px(o0[0], o0[1]), b = P.px(o0[0] + v[0], o0[1] + v[1]);
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (L < 0.5) return;
          const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
          const h = Math.min(o.cab || 11, L * 0.45), w = h * 0.5;
          ctx.save(); ctx.strokeStyle = ctx.fillStyle = o.cor || tinta; ctx.globalAlpha = o.alfa == null ? 1 : o.alfa;
          ctx.lineWidth = o.larg || 2.4; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - h * 0.7 * Math.cos(ang), b[1] - h * 0.7 * Math.sin(ang)); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(b[0], b[1]);
          ctx.lineTo(b[0] - h * Math.cos(ang) + w * Math.sin(ang), b[1] - h * Math.sin(ang) - w * Math.cos(ang));
          ctx.lineTo(b[0] - h * Math.cos(ang) - w * Math.sin(ang), b[1] - h * Math.sin(ang) + w * Math.cos(ang));
          ctx.closePath(); ctx.fill(); ctx.restore();
          if (o.rot) A.texto([o0[0] + v[0], o0[1] + v[1]], o.rot, { cor: o.cor, dx: 12 * Math.cos(ang), dy: 12 * Math.sin(ang) });
        },
        /* campo vetorial: setas numa grelha, normalizadas ao comprimento da célula */
        campo(F, o = {}) {
          const [x0, x1, y0, y1] = P.limites();
          const n = o.n || 17;
          const h = (x1 - x0) / n;
          const pts = [];
          let mx = 0;
          for (let x = x0 + h / 2; x < x1; x += h) for (let y = y0 + h / 2; y < y1; y += h) {
            const v = F(x, y);
            if (!v || !isFinite(v[0]) || !isFinite(v[1])) continue;
            const m = Math.hypot(v[0], v[1]);
            pts.push([x, y, v, m]);
            if (m > mx && m < 1e3) mx = m;
          }
          for (const [x, y, v, m] of pts) {
            if (m < 1e-9) continue;
            const len = o.normalizar ? h * 0.7 : h * 0.85 * Math.max(0.22, Math.min(1, m / mx));
            const u = [(v[0] / m) * len, (v[1] / m) * len];
            A.seta([x - u[0] / 2, y - u[1] / 2], u, { cor: o.cor || mut, larg: 1.3, cab: 6, alfa: o.alfa == null ? 0.85 : o.alfa });
          }
        },
        ponto(p, o = {}) {
          const q = P.px(p[0], p[1]);
          ctx.save();
          ctx.beginPath(); ctx.arc(q[0], q[1], o.r || (o.arr ? 7 : 5), 0, 7);
          ctx.fillStyle = o.oco ? fundo : (o.cor || tinta); ctx.fill();
          ctx.lineWidth = o.oco ? 2.2 : 2; ctx.strokeStyle = o.oco ? (o.cor || tinta) : fundo; ctx.stroke();
          if (o.arr) { ctx.beginPath(); ctx.arc(q[0], q[1], (o.r || 7) + 5, 0, 7); ctx.strokeStyle = o.cor || tinta; ctx.globalAlpha = 0.25; ctx.lineWidth = 2; ctx.stroke(); }
          ctx.restore();
          if (o.rot) A.texto(p, o.rot, { cor: o.cor, dx: o.dx == null ? 12 : o.dx, dy: o.dy == null ? -12 : o.dy });
          if (o.arr) P.alcas.push({ sx: q[0], sy: q[1], arr: o.arr });
        },
        disco(c, r, o = {}) {
          const q = P.px(c[0], c[1]);
          ctx.save(); ctx.beginPath(); ctx.ellipse(q[0], q[1], r * P.kx, r * P.ky, 0, 0, 7);
          if (o.encher) { ctx.fillStyle = o.encher; ctx.fill(); }
          ctx.strokeStyle = o.cor || tinta; ctx.lineWidth = o.larg || 1.8; if (o.trac) ctx.setLineDash(o.trac); ctx.stroke(); ctx.restore();
        },
        poli(pts, o = {}) { A.curva(pts, Object.assign({ fechar: true }, o)); },
        texto(p, txt, o = {}) {
          const q = P.px(p[0], p[1]);
          ctx.save();
          ctx.font = (o.it ? 'italic ' : '') + (o.peso || 600) + ' ' + (o.tam || 14) + 'px ' + (o.it ? 'Georgia, serif' : 'IBM Plex Sans, system-ui, sans-serif');
          ctx.textAlign = o.al || 'center'; ctx.textBaseline = 'middle';
          ctx.lineWidth = 4; ctx.strokeStyle = fundo; ctx.lineJoin = 'round';
          const x = q[0] + (o.dx || 0), y = q[1] + (o.dy || 0);
          ctx.strokeText(txt, x, y);
          ctx.fillStyle = o.cor || tinta; ctx.fillText(txt, x, y);
          ctx.restore();
        },
        ecra(fn) { ctx.save(); fn(ctx, P); ctx.restore(); },
        px: (x, y) => P.px(x, y),
      };
      return A;
    }

    desenhar() {
      if (!this.W) return;
      this.ctx.clearRect(0, 0, this.W, this.H);
      this.alcas = [];
      if (!this.cena) return;
      try { this.cena(this._api()); } catch (e) { console.error(e); }
    }
  }
  window.Plano = Plano;
})();
