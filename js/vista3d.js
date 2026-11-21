/* Motor 3D em canvas 2D: projeção em perspetiva leve, algoritmo do pintor e sombreamento.
   Sem WebGL nem bibliotecas, para abrir em qualquer browser e funcionar offline. */
(function () {
  const { add, sub, mul, dot, cross, len, nrm, clamp } = CM;

  function cssVar(n, f) { const v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function rgb(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a == null ? 1 : a) + ')'; }
  function hexRgb(h) {
    if (Array.isArray(h)) return h;
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  window.hexRgb = hexRgb;

  class Vista3D {
    constructor(host, opts = {}) {
      this.opts = Object.assign({ ext: 1.6, alvo: [0, 0, 0], yaw: 0.7, pitch: 0.42, dica: 'Arrasta para rodar · pinça ou Ctrl + roda para zoom' }, opts);
      this.cam = { yaw: this.opts.yaw, pitch: this.opts.pitch, zoom: 1 };
      this.el = document.createElement('div');
      this.el.className = 'vista';
      this.el.innerHTML = '<canvas></canvas><div class="vdica"></div><div class="vbtns"><button type="button" data-z="1" aria-label="Aproximar">+</button><button type="button" data-z="-1" aria-label="Afastar">−</button><button type="button" data-r aria-label="Repor a vista">↺</button></div>';
      this.el.querySelector('.vdica').textContent = this.opts.dica;
      host.appendChild(this.el);
      this.cv = this.el.querySelector('canvas');
      this.ctx = this.cv.getContext('2d');
      this.cena = null;
      this.prims = [];
      this.rot = [];
      this.pend = false;
      this.toque = null;
      this._eventos();
      this.ro = new ResizeObserver(() => this.tamanho());
      this.ro.observe(this.el);
      this.tamanho();
    }
    destruir() { this.ro.disconnect(); this.el.remove(); }
    tamanho() {
      const dpr = window.devicePixelRatio || 1;
      const r = this.el.getBoundingClientRect();
      this.W = Math.max(50, r.width);
      this.H = Math.max(50, r.height);
      this.cv.width = Math.round(this.W * dpr);
      this.cv.height = Math.round(this.H * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.desenhar();
    }
    definirCena(fn) { this.cena = fn; this.pedir(); }
    pedir() {
      if (this.pend) return;
      this.pend = true;
      requestAnimationFrame(() => { this.pend = false; this.desenhar(); });
    }
    repor() { this.cam.yaw = this.opts.yaw; this.cam.pitch = this.opts.pitch; this.cam.zoom = 1; this.pedir(); }
    vistaDe(yaw, pitch) { this.cam.yaw = yaw; this.cam.pitch = pitch; this.pedir(); }

    /* ---------- projeção ---------- */
    _view(p) {
      const q = sub(p, this.opts.alvo);
      const ca = Math.cos(this.cam.yaw), sa = Math.sin(this.cam.yaw), cb = Math.cos(this.cam.pitch), sb = Math.sin(this.cam.pitch);
      const u = -q[0] * sa + q[1] * ca, d = q[0] * ca + q[1] * sa;
      return [u, q[2] * cb - d * sb, d * cb + q[2] * sb];
    }
    _vec(v) { // rotação sem translação
      const ca = Math.cos(this.cam.yaw), sa = Math.sin(this.cam.yaw), cb = Math.cos(this.cam.pitch), sb = Math.sin(this.cam.pitch);
      const u = -v[0] * sa + v[1] * ca, d = v[0] * ca + v[1] * sa;
      return [u, v[2] * cb - d * sb, d * cb + v[2] * sb];
    }
    proj(p) {
      const q = this._view(p);
      const F = this.opts.ext * 7;
      const s = F / (F - q[2]);
      const K = (Math.min(this.W, this.H * 1.25) / (2.25 * this.opts.ext)) * this.cam.zoom;
      return [this.W / 2 + q[0] * s * K, this.H / 2 - q[1] * s * K, q[2]];
    }
    /* ponto do plano z = z0 que aparece no pixel (sx, sy) (Newton em 2D) */
    noPlano(sx, sy, z0 = 0) {
      let x = this.opts.alvo[0], y = this.opts.alvo[1];
      for (let i = 0; i < 30; i++) {
        const p = this.proj([x, y, z0]);
        const ex = p[0] - sx, ey = p[1] - sy;
        if (Math.hypot(ex, ey) < 0.05) break;
        const h = 1e-4;
        const px = this.proj([x + h, y, z0]), py = this.proj([x, y + h, z0]);
        const a = (px[0] - p[0]) / h, b = (py[0] - p[0]) / h, c = (px[1] - p[1]) / h, d = (py[1] - p[1]) / h;
        const det = a * d - b * c;
        if (Math.abs(det) < 1e-9) return null;
        x -= (d * ex - b * ey) / det;
        y -= (-c * ex + a * ey) / det;
      }
      return [x, y];
    }

    /* ---------- interação ---------- */
    _eventos() {
      const cv = this.cv;
      const pts = new Map();
      let ini = null, mov = 0, pinch = null;
      cv.addEventListener('pointerdown', (e) => {
        cv.setPointerCapture(e.pointerId);
        pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 1) { ini = [e.clientX, e.clientY]; mov = 0; }
        if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: this.cam.zoom }; }
      });
      cv.addEventListener('pointermove', (e) => {
        if (!pts.has(e.pointerId)) return;
        const prev = pts.get(e.pointerId);
        pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 2 && pinch) {
          const [a, b] = [...pts.values()];
          this.cam.zoom = clamp(pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d, 0.4, 4);
          this.pedir();
          mov = 99;
          return;
        }
        const dx = e.clientX - prev[0], dy = e.clientY - prev[1];
        mov += Math.abs(dx) + Math.abs(dy);
        if (mov < 4) return;
        this.cam.yaw -= dx * 0.009;
        this.cam.pitch = clamp(this.cam.pitch + dy * 0.008, -1.45, 1.52);
        this.pedir();
      });
      const fim = (e) => {
        if (!pts.has(e.pointerId)) return;
        pts.delete(e.pointerId);
        if (pts.size < 2) pinch = null;
        if (pts.size === 0 && mov < 4 && this.aoTocar && ini) {
          const r = cv.getBoundingClientRect();
          this.aoTocar(e.clientX - r.left, e.clientY - r.top);
        }
      };
      cv.addEventListener('pointerup', fim);
      cv.addEventListener('pointercancel', fim);
      cv.addEventListener('wheel', (e) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        this.cam.zoom = clamp(this.cam.zoom * Math.exp(-e.deltaY * 0.01), 0.4, 4);
        this.pedir();
      }, { passive: false });
      this.el.querySelector('.vbtns').addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.r !== undefined) this.repor();
        else { this.cam.zoom = clamp(this.cam.zoom * (b.dataset.z === '1' ? 1.2 : 1 / 1.2), 0.4, 4); this.pedir(); }
      });
    }

    /* ---------- construção da cena ---------- */
    _c() {
      const V = this;
      const P = this.prims, R = this.rot;
      const ext = this.opts.ext;
      const C = {
        ext,
        cor: (n, f) => cssVar(n, f),
        linha(a, b, o = {}) {
          const n = o.n || 8;
          for (let i = 0; i < n; i++) P.push({ t: 's', pts: [add(a, mul(sub(b, a), i / n)), add(a, mul(sub(b, a), (i + 1) / n))], o });
        },
        curva(pts, o = {}) { for (let i = 0; i < pts.length - 1; i++) if (pts[i] && pts[i + 1]) P.push({ t: 's', pts: [pts[i], pts[i + 1]], o }); },
        param(g, a, b, n, o) { const pts = []; for (let i = 0; i <= n; i++) pts.push(g(a + ((b - a) * i) / n)); C.curva(pts, o); },
        poli(pts, o = {}) { P.push({ t: 'p', pts, o }); },
        ponto(p, o = {}) { P.push({ t: 'd', pts: [p], o }); if (o.rot) R.push({ p, txt: o.rot, cor: o.cor, dx: 9, dy: -9, tam: o.tam }); },
        texto(p, txt, o = {}) { R.push(Object.assign({ p, txt }, o)); },
        seta(o0, v, o = {}) {
          const L = len(v);
          if (L < 1e-9) return;
          const hl = Math.min((o.cab || 0.13) * ext, 0.4 * L);
          const base = add(o0, mul(v, (L - hl) / L)), tip = add(o0, v);
          C.linha(o0, base, Object.assign({}, o, { larg: o.larg || 2.6, n: 6 }));
          P.push({ t: 'h', pts: [base, tip], o });
          if (o.rot) R.push({ p: add(tip, mul(nrm(v), 0.09 * ext)), txt: o.rot, cor: o.cor, tam: o.tam });
        },
        eixos(o = {}) {
          const c = o.cor || cssVar('--eixo', '#8a909a');
          const X = o.x || [-1.3, 1.3], Y = o.y || [-1.3, 1.3], Z = o.z || [-1.1, 1.4];
          const r = { larg: 1.2, cor: c, n: 10 };
          C.linha([X[0], 0, 0], [X[1], 0, 0], r); C.linha([0, Y[0], 0], [0, Y[1], 0], r); C.linha([0, 0, Z[0]], [0, 0, Z[1]], r);
          const h = 0.08 * ext;
          P.push({ t: 'h', pts: [[X[1] - h, 0, 0], [X[1], 0, 0]], o: { cor: c, peq: 1 } });
          P.push({ t: 'h', pts: [[0, Y[1] - h, 0], [0, Y[1], 0]], o: { cor: c, peq: 1 } });
          P.push({ t: 'h', pts: [[0, 0, Z[1] - h], [0, 0, Z[1]]], o: { cor: c, peq: 1 } });
          const nm = o.nomes || ['x', 'y', 'z'];
          R.push({ p: [X[1] + 0.07 * ext, 0, 0], txt: nm[0], cor: c, it: 1 }, { p: [0, Y[1] + 0.07 * ext, 0], txt: nm[1], cor: c, it: 1 }, { p: [0, 0, Z[1] + 0.07 * ext], txt: nm[2], cor: c, it: 1 });
        },
        /* superfície paramétrica g(u, v) */
        sup(g, u0, u1, v0, v1, nu, nv, o = {}) {
          const G = [];
          for (let i = 0; i <= nu; i++) { G.push([]); for (let j = 0; j <= nv; j++) G[i].push(g(u0 + ((u1 - u0) * i) / nu, v0 + ((v1 - v0) * j) / nv)); }
          for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
            const q = [G[i][j], G[i + 1][j], G[i + 1][j + 1], G[i][j + 1]];
            if (q.some((p) => !p || p.some((x) => !isFinite(x)))) continue;
            const u = u0 + ((u1 - u0) * (i + 0.5)) / nu, v = v0 + ((v1 - v0) * (j + 0.5)) / nv;
            P.push({ t: 'p', pts: q, o: Object.assign({}, o, { cor: o.corF ? o.corF(u, v, q) : o.cor }) });
          }
        },
        /* gráfico z = f(x, y) recortado a [zmin, zmax] e ao domínio dom(x, y) */
        grafico(f, x0, x1, y0, y1, n, o = {}) {
          const zmin = o.zmin == null ? -Infinity : o.zmin, zmax = o.zmax == null ? Infinity : o.zmax;
          C.sup((x, y) => {
            if (o.dom && !o.dom(x, y)) return null;
            const z = f(x, y);
            if (!isFinite(z) || z < zmin - 1e-9 || z > zmax + 1e-9) return null;
            return [x, y, z];
          }, x0, x1, y0, y1, n, n, o);
        },
        plano(p, N, h, o = {}) {
          const n = nrm(N);
          let e1 = Math.abs(n[2]) < 0.9 ? nrm(cross(n, [0, 0, 1])) : nrm(cross(n, [1, 0, 0]));
          const e2 = cross(n, e1);
          const m = o.m || 6;
          for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) {
            const a0 = -h + (2 * h * i) / m, a1 = -h + (2 * h * (i + 1)) / m, b0 = -h + (2 * h * j) / m, b1 = -h + (2 * h * (j + 1)) / m;
            const pt = (a, b) => add(p, add(mul(e1, a), mul(e2, b)));
            P.push({ t: 'p', pts: [pt(a0, b0), pt(a1, b0), pt(a1, b1), pt(a0, b1)], o: Object.assign({ alfa: 0.28, plano: 1 }, o) });
          }
        },
        caixa(a, b, o = {}) { // paralelepípedo [a, b] alinhado com os eixos
          const [x0, y0, z0] = a, [x1, y1, z1] = b;
          const f = [
            [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
            [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]],
            [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]],
          ];
          f.forEach((q) => P.push({ t: 'p', pts: q, o }));
        },
      };
      return C;
    }

    desenhar() {
      if (!this.W) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.W, this.H);
      this.prims = [];
      this.rot = [];
      if (!this.cena) return;
      try { this.cena(this._c()); } catch (e) { console.error(e); }
      const L = nrm([-0.35, 0.55, 0.75]);
      const fundo = cssVar('--surface', '#fff'), tinta = cssVar('--ink', '#1b2420');
      const D = [];
      for (const p of this.prims) {
        const q = p.pts.map((x) => this.proj(x));
        if (q.some((r) => !isFinite(r[0]) || !isFinite(r[1]))) continue;
        let z = 0;
        q.forEach((r) => (z += r[2]));
        z /= q.length;
        D.push({ p, q, z: z + (p.o.vies || 0) * this.opts.ext + (p.t === 's' ? 0.004 : p.t === 'p' ? 0 : 0.01) * this.opts.ext });
      }
      D.sort((a, b) => a.z - b.z);
      for (const d of D) {
        const { p, q } = d, o = p.o;
        if (p.t === 'p') {
          let c = hexRgb(o.cor || [120, 150, 220]);
          let a = o.alfa == null ? 0.9 : o.alfa;
          if (!o.plano && o.sombra !== false && p.pts.length >= 3) {
            const N = nrm(cross(sub(p.pts[1], p.pts[0]), sub(p.pts[2], p.pts[0])));
            const nv = this._vec(N);
            const k = 0.55 + 0.45 * Math.abs(dot(nv, L));
            const tras = nv[2] < 0;
            if (tras && o.corTras) c = hexRgb(o.corTras);
            c = c.map((x) => Math.round(clamp(x * k + (tras && !o.corTras ? 18 : 0), 0, 255)));
          }
          ctx.beginPath();
          q.forEach((r, i) => (i ? ctx.lineTo(r[0], r[1]) : ctx.moveTo(r[0], r[1])));
          ctx.closePath();
          ctx.fillStyle = rgb(c, a);
          ctx.fill();
          if (o.malha !== false) {
            ctx.strokeStyle = o.contorno || (o.plano ? rgb(c, Math.min(1, a + 0.25)) : 'rgba(0,0,0,0.13)');
            if (o.contorno === 'mesma') ctx.strokeStyle = rgb(c, a);
            ctx.lineWidth = o.plano ? 0.6 : 0.5;
            ctx.stroke();
          }
        } else if (p.t === 's') {
          ctx.save();
          ctx.strokeStyle = o.cor || tinta;
          ctx.globalAlpha = o.alfa == null ? 1 : o.alfa;
          ctx.lineWidth = o.larg || 1.6;
          ctx.lineCap = 'round';
          if (o.trac) ctx.setLineDash(o.trac);
          ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); ctx.stroke();
          ctx.restore();
        } else if (p.t === 'h') {
          const [b, t] = q;
          const ang = Math.atan2(t[1] - b[1], t[0] - b[0]);
          const L2 = Math.max(o.peq ? 8 : 10, Math.min(16, Math.hypot(t[0] - b[0], t[1] - b[1]) * 1.25));
          const w = L2 * 0.45;
          ctx.save();
          ctx.globalAlpha = o.alfa == null ? 1 : o.alfa;
          ctx.fillStyle = o.cor || tinta;
          ctx.beginPath();
          ctx.moveTo(t[0], t[1]);
          ctx.lineTo(t[0] - L2 * Math.cos(ang) + w * Math.sin(ang), t[1] - L2 * Math.sin(ang) - w * Math.cos(ang));
          ctx.lineTo(t[0] - L2 * Math.cos(ang) - w * Math.sin(ang), t[1] - L2 * Math.sin(ang) + w * Math.cos(ang));
          ctx.closePath(); ctx.fill();
          ctx.restore();
        } else if (p.t === 'd') {
          ctx.beginPath();
          ctx.arc(q[0][0], q[0][1], o.r || 5, 0, 7);
          ctx.fillStyle = o.cor || tinta;
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = fundo;
          ctx.stroke();
        }
      }
      // rótulos por cima de tudo
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const r of this.rot) {
        const q = this.proj(r.p);
        if (!isFinite(q[0])) continue;
        ctx.font = (r.it ? 'italic ' : '') + (r.peso || 600) + ' ' + (r.tam || 14) + 'px ' + (r.it ? 'Georgia, serif' : 'IBM Plex Sans, system-ui, sans-serif');
        const x = q[0] + (r.dx || 0), y = q[1] + (r.dy || 0);
        ctx.lineWidth = 4;
        ctx.strokeStyle = fundo;
        ctx.lineJoin = 'round';
        ctx.strokeText(r.txt, x, y);
        ctx.fillStyle = r.cor || tinta;
        ctx.fillText(r.txt, x, y);
      }
    }
  }
  window.Vista3D = Vista3D;
})();
