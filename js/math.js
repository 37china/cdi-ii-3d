/* Contas partilhadas por todos os modelos. Sem dependências.
   Funciona no browser (window.CM) e no Node (require) para os testes. */
(function (raiz) {
  const CM = {};
  const PI = Math.PI;

  /* ---------- vetores ---------- */
  CM.add = (a, b) => a.map((x, i) => x + b[i]);
  CM.sub = (a, b) => a.map((x, i) => x - b[i]);
  CM.mul = (a, s) => a.map((x) => x * s);
  CM.dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  CM.cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  CM.len = (a) => Math.hypot(...a);
  CM.nrm = (a) => { const l = CM.len(a); return l < 1e-12 ? a.map(() => 0) : CM.mul(a, 1 / l); };
  CM.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  CM.lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- matrizes 2×2 ---------- */
  CM.det2 = (m) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
  CM.inv2 = (m) => {
    const d = CM.det2(m);
    if (Math.abs(d) < 1e-12) return null;
    return [[m[1][1] / d, -m[0][1] / d], [-m[1][0] / d, m[0][0] / d]];
  };
  CM.mxv = (m, v) => m.map((r) => CM.dot(r, v));
  CM.mxm = (a, b) => a.map((r) => b[0].map((_, j) => r.reduce((s, x, k) => s + x * b[k][j], 0)));

  /* Valores e vetores próprios da matriz simétrica [[a, b], [b, c]].
     Devolve l1 ≥ l2 e os vetores próprios unitários correspondentes. */
  CM.eigSim2 = (a, b, c) => {
    const m = (a + c) / 2, r = Math.hypot((a - c) / 2, b);
    const l1 = m + r, l2 = m - r;
    let v1;
    if (Math.abs(b) > 1e-12) v1 = CM.nrm([l1 - c, b]);
    else v1 = a >= c ? [1, 0] : [0, 1];
    const v2 = [-v1[1], v1[0]];
    return { l1, l2, v1, v2 };
  };

  /* ---------- derivadas numéricas ---------- */
  CM.grad = (f, x, y, h = 1e-5) => [(f(x + h, y) - f(x - h, y)) / (2 * h), (f(x, y + h) - f(x, y - h)) / (2 * h)];
  CM.hess = (f, x, y, h = 1e-4) => {
    const fxx = (f(x + h, y) - 2 * f(x, y) + f(x - h, y)) / (h * h);
    const fyy = (f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h);
    const fxy = (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) / (4 * h * h);
    return [[fxx, fxy], [fxy, fyy]];
  };
  /* Jacobiana de F: ℝ² → ℝᵐ (lista de m funções ou função que devolve vetor) */
  CM.jac = (F, x, y, h = 1e-6) => {
    const a = F(x + h, y), b = F(x - h, y), c = F(x, y + h), d = F(x, y - h);
    return a.map((_, i) => [(a[i] - b[i]) / (2 * h), (c[i] - d[i]) / (2 * h)]);
  };

  /* ---------- integração ---------- */
  CM.simpson = (f, a, b, n = 200) => {
    if (n % 2) n++;
    const h = (b - a) / n;
    let s = f(a) + f(b);
    for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
    return (s * h) / 3;
  };
  /* ∫_a^b ∫_{lo(x)}^{hi(x)} f(x, y) dy dx */
  CM.duplo = (f, a, b, lo, hi, n = 160) =>
    CM.simpson((x) => { const l = lo(x), u = hi(x); return u > l ? CM.simpson((y) => f(x, y), l, u, n) : 0; }, a, b, n);
  /* Soma de Riemann com o ponto médio numa grelha n × n sobre [a,b]×[c,d], contando só os pontos de A */
  CM.riemann = (dentro, f, a, b, c, d, n) => {
    const hx = (b - a) / n, hy = (d - c) / n;
    let s = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = a + (i + 0.5) * hx, y = c + (j + 0.5) * hy;
      if (dentro(x, y)) s += f(x, y) * hx * hy;
    }
    return s;
  };
  /* Integral de linha ∮ F · dr ao longo de g(t), t ∈ [a, b] */
  CM.linha = (F, g, a, b, n = 2000) => {
    const h = 1e-6;
    return CM.simpson((t) => {
      const p = g(t), q = g(t + h), r = g(t - h);
      const dg = [(q[0] - r[0]) / (2 * h), (q[1] - r[1]) / (2 * h)];
      const v = F(p[0], p[1]);
      return v[0] * dg[0] + v[1] * dg[1];
    }, a, b, n);
  };

  /* ---------- equações ---------- */
  CM.newton = (f, x0, it = 40) => {
    let x = x0;
    for (let i = 0; i < it; i++) {
      const h = 1e-7 * Math.max(1, Math.abs(x));
      const d = (f(x + h) - f(x - h)) / (2 * h);
      if (!isFinite(d) || Math.abs(d) < 1e-14) return NaN;
      const dx = f(x) / d;
      x -= dx;
      if (!isFinite(x)) return NaN;
      if (Math.abs(dx) < 1e-12) break;
    }
    return Math.abs(f(x)) < 1e-7 ? x : NaN;
  };
  CM.bissecao = (f, a, b, it = 80) => {
    let fa = f(a);
    for (let i = 0; i < it; i++) {
      const m = (a + b) / 2, fm = f(m);
      if (fa * fm <= 0) b = m; else { a = m; fa = fm; }
    }
    return (a + b) / 2;
  };

  /* Linhas de nível f = c por quadrados marchantes: devolve segmentos [[x,y],[x,y]] */
  CM.contorno = (f, x0, x1, y0, y1, nx, ny, c) => {
    const segs = [];
    const hx = (x1 - x0) / nx, hy = (y1 - y0) / ny;
    const V = [];
    for (let i = 0; i <= nx; i++) { V.push([]); for (let j = 0; j <= ny; j++) V[i].push(f(x0 + i * hx, y0 + j * hy) - c); }
    const it = (pa, pb, va, vb) => { const t = va / (va - vb); return [pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t]; };
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const p = [[x0 + i * hx, y0 + j * hy], [x0 + (i + 1) * hx, y0 + j * hy], [x0 + (i + 1) * hx, y0 + (j + 1) * hy], [x0 + i * hx, y0 + (j + 1) * hy]];
      const v = [V[i][j], V[i + 1][j], V[i + 1][j + 1], V[i][j + 1]];
      if (v.some((q) => !isFinite(q))) continue;
      const pts = [];
      for (let k = 0; k < 4; k++) {
        const a = v[k], b = v[(k + 1) % 4];
        if ((a < 0) !== (b < 0)) pts.push(it(p[k], p[(k + 1) % 4], a, b));
      }
      if (pts.length === 2) segs.push(pts);
      else if (pts.length === 4) { segs.push([pts[0], pts[1]]); segs.push([pts[2], pts[3]]); }
    }
    return segs;
  };

  /* ---------- formatação (ponto decimal, como nas teóricas) ---------- */
  CM.fmt = (x, d = 2) => {
    if (x === null || x === undefined || Number.isNaN(x)) return '—';
    if (!isFinite(x)) return x > 0 ? '∞' : '−∞';
    if (Math.abs(x) < 0.5 * Math.pow(10, -d)) x = 0;
    return x.toFixed(d).replace('-', '−');
  };
  CM.fmtC = (x, d = 3) => { // compacto: sem zeros à direita
    if (x === null || x === undefined || Number.isNaN(x)) return '—';
    if (Math.abs(x) < 0.5 * Math.pow(10, -d)) return '0';
    return String(+x.toFixed(d)).replace('-', '−');
  };
  CM.pt = (v, d = 2) => '(' + v.map((x) => CM.fmt(x, d)).join('; ') + ')';
  CM.ptC = (v, d = 3) => '(' + v.map((x) => CM.fmtC(x, d)).join('; ') + ')';
  CM.mat = (m, d = 2) => '[ ' + m.map((r) => r.map((x) => CM.fmtC(x, d)).join('  ')).join(' ; ') + ' ]';
  /* ângulo em múltiplos de π/12 quando possível */
  CM.fmtPi = (a) => {
    const k = a / (PI / 12);
    if (Math.abs(k - Math.round(k)) > 1e-6) return CM.fmt(a, 2);
    let n = Math.round(k), dd = 12;
    if (n === 0) return '0';
    const g = (p, q) => (q ? g(q, p % q) : Math.abs(p));
    const m = g(n, dd); n /= m; dd /= m;
    const s = n < 0 ? '−' : '';
    n = Math.abs(n);
    return s + (n === 1 ? '' : n) + 'π' + (dd === 1 ? '' : '/' + dd);
  };
  CM.graus = (a) => Math.round((a * 180) / PI) + '°';

  if (typeof module !== 'undefined' && module.exports) module.exports = CM;
  else raiz.CM = CM;
})(typeof window !== 'undefined' ? window : globalThis);
