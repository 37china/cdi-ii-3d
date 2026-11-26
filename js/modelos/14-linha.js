/* Modelos novos (v3), parte 2: integrais de linha e sólidos dados pelos limites de integração.
   escalar · trabalho · limites */
(function () {
  const PI = Math.PI;
  const fin = (v) => typeof v === 'number' && isFinite(v);
  const N = (x, d = 3) => (fin(x) ? TX.n(x, d) : '\\text{—}');
  const vetTex = (v, d = 3) => '(' + v.map((x) => N(x, d)).join(';\\,') + ')';
  const mistura = (a, b, t) => { const p = hexRgb(a), q = hexRgb(b); return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]; };
  const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
  const simpson = (f, a, b, n = 600) => { if (!(b > a)) return 0; const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h); return (s * h) / 3; };

  const CURVAS = [
    ['hélice', '(cos t; sen t; t/4)', '0', '2pi'], ['circunferência', '(cos t; sen t)', '0', '2pi'], ['parábola', '(t; t^2)', '-1', '1'],
    ['segmento', '(t; 1-t; 2t)', '0', '1'], ['cicloide', '(t - sen t; 1 - cos t)', '0', '2pi'], ['astroide', '(cos(t)^3; sen(t)^3)', '0', '2pi'],
  ];
  /* dados de uma curva escrita pelo aluno (em ℝ² ou ℝ³), com cache */
  function curva(M, cam) {
    let ck = null, cv = null;
    return (S) => {
      const k = JSON.stringify([S.g, S.ga, S.gb]);
      if (k === ck && cv) return cv;
      const c = cam(), n = M.F.g.n;
      const g = (t) => { const p = c.g(t); return n === 2 ? [p[0], p[1], 0] : p; };
      const d = (t) => { const p = c.d(t); return n === 2 ? [p[0], p[1], 0] : p; };
      let m = 0.3;
      for (let i = 0; i <= 200; i++) { const p = g(c.a + ((c.b - c.a) * i) / 200); p.forEach((x) => { if (fin(x)) m = Math.max(m, Math.abs(x)); }); }
      ck = k; cv = { g, d, a: c.a, b: c.b, n, s: 1.5 / m, tex: c.tex, plana: n === 2 };
      return cv;
    };
  }

  /* ======================= comprimento, massa, ∫ f ds ======================= */
  const escalar = {
    id: 'escalar', nome: 'Comprimento, massa e ∫f ds',
    montar(M) {
      const cor = M.cores();
      const P = M.plano({ janela: [0, 6.3, -0.2, 2], livre: true, nomeVista: 'Em função de t', dica: 'Área debaixo da curva laranja = integral' });
      const V = M.vista3d({ ext: 2, alvo: [0, 0, 0.3], yaw: -0.7, pitch: 0.45, nomeVista: 'Curva' });
      const cam = CDI.caminho(M, 'g', { dim: 0, valor: '(cos t; sen t; t/4)', a: '0', b: '2pi', exemplos: CURVAS, dica: 'Duas componentes para uma curva no plano, três para o espaço.' });
      M.funcao('rho', { rot: 'Densidade $f(x;y;z)=$', vars: ['x', 'y', 'z'], valor: '1', ajuda: false, exemplos: [['$1$ (comprimento)', '1'], ['$z$', 'z'], ['$x^2+y^2$', 'x^2+y^2'], ['$1+y$', '1+y'], ['$\\sqrt{x^2+y^2}$', 'sqrt(x^2+y^2)']] });
      M.barra('t', { rot: 'até $t$', cor: cor.n, min: 0, max: 1, valor: 1, nome: 'fração do caminho', fmt: (u) => { const D = dados(M.S); return CM.fmtC(D.a + (D.b - D.a) * u, 2); } });
      M.barra('n', { rot: 'segmentos', cor: cor.m, min: 1, max: 40, passo: 1, valor: 6, fmt: (x) => String(Math.round(x)), nome: 'número de segmentos da poligonal' });
      const dados = curva(M, cam);
      const rho = () => M.F.rho.f;
      const vel = (D) => (t) => Math.hypot(...D.d(t));
      const w = (D) => (t) => rho()(...D.g(t)) * Math.hypot(...D.d(t));
      let cj = null;
      M.cena(P, (G, S) => {
        const D = dados(S), sp = vel(D), wf = w(D), T = D.a + (D.b - D.a) * S.t;
        const kj = JSON.stringify([S.g, S.ga, S.gb, S.rho]);
        if (kj !== cj) { cj = kj; let lo = 0, hi = 0.1; for (let i = 0; i <= 200; i++) { const t = D.a + ((D.b - D.a) * i) / 200; [sp(t), wf(t)].forEach((v) => { if (fin(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }); } P.janela([D.a - 0.05 * (D.b - D.a), D.b + 0.05 * (D.b - D.a), lo - 0.1 * (hi - lo), hi * 1.12]); }
        const pts = [[D.a, 0]]; for (let i = 0; i <= 200; i++) { const t = D.a + ((T - D.a) * i) / 200; pts.push([t, wf(t)]); } pts.push([T, 0]);
        G.curva(pts, { cor: cor.u, encher: cor.u, alfa: 0.22, larg: 0.5, fechar: true });
        G.eixos(['t', '']);
        G.param((t) => [t, sp(t)], D.a, D.b, 300, { cor: cor.b, larg: 2, alfa: 0.85 });
        G.param((t) => [t, wf(t)], D.a, D.b, 300, { cor: cor.u, larg: 2.6 });
        G.curva([[T, 0], [T, wf(T)]], { cor: cor.n, larg: 2 });
      });
      M.cena(V, (C, S) => {
        const D = dados(S), s = D.s, f = rho(), T = D.a + (D.b - D.a) * S.t, n = Math.round(S.n);
        C.eixos({ x: [-1.7, 1.7], y: [-1.7, 1.7], z: [D.plana ? -0.2 : -1.6, 1.7], esc: [s, s, s] });
        const vs = []; for (let i = 0; i <= 60; i++) { const v = f(...D.g(D.a + ((D.b - D.a) * i) / 60)); if (fin(v)) vs.push(v); }
        const lo = Math.min(...vs), hi = Math.max(...vs), varia = hi - lo > 1e-9;
        for (let i = 0; i < 48; i++) {
          const t0 = D.a + ((D.b - D.a) * i) / 48, t1 = D.a + ((D.b - D.a) * (i + 1)) / 48, cm = f(...D.g((t0 + t1) / 2));
          C.param((t) => D.g(t).map((x) => s * x), t0, t1, 6, { cor: varia ? mistura(cor.b, cor.u, (cm - lo) / (hi - lo)) : cor.u, larg: 3.4, alfa: t0 <= T ? 1 : 0.35 });
        }
        if (D.plana) {
          const kz = 1.3 / Math.max(Math.abs(lo), Math.abs(hi), 1e-6);
          C.sup((u, v) => { const t = D.a + (T - D.a) * u, p = D.g(t), h = f(...p); return fin(h) ? [s * p[0], s * p[1], v * kz * h] : null; }, 0, 1, 0, 1, 160, 2, { alfa: 0.35, cor: cor.u });
        }
        const pol = []; for (let i = 0; i <= n; i++) pol.push(D.g(D.a + ((D.b - D.a) * i) / n).map((x) => s * x));
        C.curva(pol, { cor: cor.m, larg: 1.6 });
        pol.forEach((p) => C.ponto(p, { cor: cor.m, r: 2.5 }));
        const p = D.g(T), d = D.d(T), m = Math.hypot(...d);
        if (m > 1e-9) C.seta(p.map((x) => s * x), d.map((x) => (0.45 * x) / m), { cor: cor.n, larg: 2.4, rot: "$g'(t)$" });
        C.ponto(p.map((x) => s * x), { cor: cor.n, r: 5 });
      });
      M.leituras('Integrais ao longo de $g$', (S) => {
        const D = dados(S), f = rho(), sp = vel(D), T = D.a + (D.b - D.a) * S.t, n = Math.round(S.n);
        const L = simpson(sp, D.a, D.b), I = simpson(w(D), D.a, D.b), It = simpson(w(D), D.a, T);
        let pol = 0; for (let i = 0; i < n; i++) pol += CM.len(CM.sub(D.g(D.a + ((D.b - D.a) * (i + 1)) / n), D.g(D.a + ((D.b - D.a) * i) / n)));
        const cm = [0, 1, 2].map((j) => simpson((t) => D.g(t)[j] * f(...D.g(t)) * sp(t), D.a, D.b) / I);
        const Iz = simpson((t) => { const p = D.g(t); return (p[0] * p[0] + p[1] * p[1]) * f(...p) * sp(t); }, D.a, D.b);
        return [['comprimento $\\int_a^b\\|g\'(t)\\|\\,dt$', '$' + N(L, 4) + '$'], ['poligonal com ' + n + ' segmentos', '$' + N(pol, 4) + '$'], '—',
          ['$\\int_g f\\,ds$ (massa)', '$' + N(I, 4) + '$', 'forte'], ['até ao $t$ escolhido', '$' + N(It, 4) + '$'],
          ['centro de massa', '$' + vetTex(D.plana ? cm.slice(0, 2) : cm, 3) + '$'], ['momento de inércia em relação a $Oz$', '$' + N(Iz, 4) + '$'],
          'A poligonal nunca é mais comprida do que a curva e aproxima-a quando os segmentos encolhem: o comprimento é o supremo das poligonais.'];
      });
      M.texto('<b class="t">Integral de linha de um campo escalar</b>$$\\int_g f\\,ds=\\int_a^b f(g(t))\\,\\|g\'(t)\\|\\,dt.$$<p>Com $f=1$ é o comprimento. Com $f$ = densidade é a massa do fio. Não depende da parametrização nem do sentido em que se percorre a curva.</p>', 'nota');
      M.legenda([[cor.u, 'densidade alta / $f(g(t))\\|g\'(t)\\|$'], [cor.b, 'densidade baixa / $\\|g\'(t)\\|$'], [cor.m, 'poligonal'], [cor.n, 'ponto em $t$']]);
    },
  };

  /* ======================= trabalho ∫ F·dr ======================= */
  const CAMPOS = [['$(-y;\\,x)$', '(-y; x)'], ['$(y;\\,x)=\\nabla(xy)$', '(y; x)'], ['$(-y;\\,x;\\,z)$', '(-y; x; z)'], ['$(yz;\\,xz;\\,xy)$', '(yz; xz; xy)'], ['$(2xy;\\,x^2+z;\\,y)$', '(2xy; x^2+z; y)'], ['$\\frac{(-y;\\,x)}{x^2+y^2}$', '(-y/(x^2+y^2); x/(x^2+y^2))']];
  const trabalho = {
    id: 'trabalho', nome: 'Trabalho ∫F·dr',
    montar(M) {
      const cor = M.cores();
      const P = M.plano({ janela: [0, 6.3, -2, 2], livre: true, nomeVista: 'Em função de t', dica: 'Área com sinal debaixo de F(g(t))·g\'(t)' });
      const V = M.vista3d({ ext: 2, alvo: [0, 0, 0.2], yaw: -0.7, pitch: 0.45, nomeVista: 'Campo e caminho' });
      M.funcao('F', { rot: 'Campo $F=$', vars: ['x', 'y', 'z'], valor: '(-y; x; z)', exemplos: CAMPOS });
      const cam = CDI.caminho(M, 'g', { dim: 0, valor: '(cos t; sen t; t/4)', a: '0', b: '2pi', exemplos: CURVAS });
      M.funcao('phi', { rot: 'Potencial que propões (opcional): $\\varphi=$', vars: ['x', 'y', 'z'], valor: '', opcional: true, ajuda: false, exemplo: 'ex.: xyz', exemplos: [['$xy$', 'xy'], ['$xyz$', 'xyz'], ['$x^2y+yz$', 'x^2y+yz']] });
      M.barra('t', { rot: 'até $t$', cor: cor.n, min: 0, max: 1, valor: 1, nome: 'fração do caminho', fmt: (u) => { const D = dados(M.S); return CM.fmtC(D.a + (D.b - D.a) * u, 2); } });
      M.caixa('inv', { rot: 'Percorrer ao contrário', valor: false });
      const dados = curva(M, cam);
      const Fv = () => { const F = M.F.F; if (!F || F.n < 2) return () => [NaN, NaN, NaN]; return F.n === 2 ? (x, y) => { const v = F.f(x, y, 0); return [v[0], v[1], 0]; } : (x, y, z) => F.f(x, y, z); };
      /* integrando com o sentido escolhido: g̃(t) = g(a+b−t) */
      const integ = (S, D) => { const F = Fv(); return S.inv ? (t) => { const u = D.a + D.b - t; return -CM.dot(F(...D.g(u)), D.d(u)); } : (t) => CM.dot(F(...D.g(t)), D.d(t)); };
      const ponto = (S, D, t) => D.g(S.inv ? D.a + D.b - t : t);
      let cj = null;
      M.cena(P, (G, S) => {
        const D = dados(S), w = integ(S, D), T = D.a + (D.b - D.a) * S.t;
        const kj = JSON.stringify([S.g, S.ga, S.gb, S.F, S.inv]);
        if (kj !== cj) { cj = kj; let lo = -0.1, hi = 0.1; for (let i = 0; i <= 200; i++) { const v = w(D.a + ((D.b - D.a) * i) / 200); if (fin(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } } const m = 0.12 * (hi - lo); P.janela([D.a - 0.05 * (D.b - D.a), D.b + 0.05 * (D.b - D.a), lo - m, hi + m]); }
        const pts = [[D.a, 0]]; for (let i = 0; i <= 200; i++) { const t = D.a + ((T - D.a) * i) / 200; pts.push([t, w(t)]); } pts.push([T, 0]);
        G.curva(pts, { cor: cor.u, encher: cor.u, alfa: 0.22, larg: 0.5, fechar: true });
        G.eixos(['t', '']);
        G.param((t) => [t, w(t)], D.a, D.b, 300, { cor: cor.u, larg: 2.6 });
        G.curva([[T, 0], [T, w(T)]], { cor: cor.n, larg: 2 });
      });
      M.cena(V, (C, S) => {
        const D = dados(S), s = D.s, F = Fv(), T = D.a + (D.b - D.a) * S.t;
        C.eixos({ x: [-1.7, 1.7], y: [-1.7, 1.7], z: [D.plana ? -0.3 : -1.6, 1.7], esc: [s, s, s] });
        /* campo numa grelha à volta da curva */
        const L = 1.5 / s, nz = D.plana ? 1 : 4, pts = [];
        for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) for (let l = 0; l < nz; l++) pts.push([-L + (L * i) / 2, -L + (L * j) / 2, nz === 1 ? 0 : -L + ((2 * L) * l) / 3]);
        let mx = 1e-9; const vs = pts.map((q) => { const v = F(...q), m = Math.hypot(...v); if (fin(m) && m < 1e3) mx = Math.max(mx, m); return v; });
        pts.forEach((q, i) => { const v = vs[i], m = Math.hypot(...v); if (fin(m) && m > 1e-9) C.seta(q.map((x) => s * x), v.map((x) => (0.32 * x) / mx), { cor: cor.m, larg: 1.1 }); });
        C.param((t) => ponto(S, D, t).map((x) => s * x), D.a, T, 200, { cor: cor.n, larg: 3.6 });
        C.param((t) => ponto(S, D, t).map((x) => s * x), T, D.b, 200, { cor: cor.i, larg: 2, alfa: 0.45 });
        for (let i = 0; i <= 12; i++) { const t = D.a + ((D.b - D.a) * i) / 12, p = ponto(S, D, t), v = F(...p), m = Math.hypot(...v); if (fin(m) && m > 1e-9) C.seta(p.map((x) => s * x), v.map((x) => (0.4 * x) / mx), { cor: cor.u, larg: 2.2 }); }
        const p = ponto(S, D, T), u = S.inv ? D.a + D.b - T : T, d = CM.mul(D.d(u), S.inv ? -1 : 1), m = Math.hypot(...d);
        if (m > 1e-9) C.seta(p.map((x) => s * x), d.map((x) => (0.45 * x) / m), { cor: cor.n, larg: 2.6, rot: '$g\'(t)$' });
        C.ponto(ponto(S, D, D.a).map((x) => s * x), { cor: cor.i, r: 4.5, rot: '$A$' });
        C.ponto(ponto(S, D, D.b).map((x) => s * x), { cor: cor.i, r: 4.5, rot: '$B$', dx: -16 });
      });
      M.leituras('Trabalho', (S) => {
        const FF = M.F.F;
        if (!FF || FF.n < 2 || FF.n > 3) return ['O campo precisa de 2 ou 3 componentes.'];
        const D = dados(S), w = integ(S, D), T = D.a + (D.b - D.a) * S.t, F = Fv();
        const W = simpson(w, D.a, D.b, 1200), Wt = simpson(w, D.a, T, 1200), A = ponto(S, D, D.a), B = ponto(S, D, D.b), fechada = CM.len(CM.sub(A, B)) < 1e-6;
        /* campo fechado? (derivadas cruzadas numa grelha) */
        let rot = 0;
        for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) for (let l = 0; l < (FF.n === 3 ? 5 : 1); l++) {
          const p = [-1.3 + 0.65 * i + 0.013, -1.3 + 0.65 * j + 0.017, FF.n === 3 ? -1.3 + 0.65 * l + 0.011 : 0], h = 1e-5;
          const dd = (a, b) => { const q1 = p.slice(), q2 = p.slice(); q1[b] += h; q2[b] -= h; return (F(...q1)[a] - F(...q2)[a]) / (2 * h); };
          const vs = FF.n === 2 ? [dd(1, 0) - dd(0, 1)] : [dd(2, 1) - dd(1, 2), dd(0, 2) - dd(2, 0), dd(1, 0) - dd(0, 1)];
          if (vs.every(fin)) rot = Math.max(rot, ...vs.map(Math.abs));
        }
        const r = [['$\\int_g F\\cdot dr$', '$' + N(W, 4) + '$', 'forte'], ['até ao $t$ escolhido', '$' + N(Wt, 4) + '$'], ['$A=g(a)$', '$' + vetTex(D.plana ? A.slice(0, 2) : A, 2) + '$'], ['$B=g(b)$', '$' + vetTex(D.plana ? B.slice(0, 2) : B, 2) + '$'],
          ['maior derivada cruzada diferente', '$' + N(rot, 4) + '$', rot < 1e-3 ? 'forte' : '']];
        if (M.F.phi) {
          const phi = M.F.phi.f;
          let e = 0;
          for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) for (let l = 0; l < 5; l++) { const p = [-1.2 + 0.6 * i + 0.01, -1.2 + 0.6 * j + 0.02, FF.n === 3 ? -1.2 + 0.6 * l + 0.015 : 0], v = F(...p); const g = [0, 1, 2].map((k) => { const q1 = p.slice(), q2 = p.slice(); q1[k] += 1e-5; q2[k] -= 1e-5; return (phi(...q1) - phi(...q2)) / 2e-5; }); if (v.every(fin) && g.every(fin)) e = Math.max(e, ...[0, 1, FF.n === 3 ? 2 : 0].map((k) => Math.abs(v[k] - g[k]))); }
          r.push('—', ['$\\max|\\nabla\\varphi-F|$', '$' + N(e, 4) + '$', e < 1e-3 ? 'forte' : 'mau'], ['$\\varphi(B)-\\varphi(A)$', '$' + N(phi(...B) - phi(...A), 4) + '$']);
          r.push(e < 1e-3 ? '<b>$\\nabla\\varphi=F$.</b> Pelo teorema fundamental, o trabalho é $\\varphi(B)-\\varphi(A)$, seja qual for o caminho.' : '<b>$\\nabla\\varphi\\ne F$:</b> revê as derivadas parciais de $\\varphi$.');
        } else if (rot < 1e-3) r.push('O campo é <b>fechado</b> (derivadas cruzadas iguais). Num domínio simplesmente conexo é gradiente: experimenta propor um potencial $\\varphi$.');
        else r.push('O campo <b>não é fechado</b>, logo não é gradiente: o trabalho depende do caminho' + (fechada ? ' e, num caminho fechado, pode não ser $0$.' : '.'));
        if (S.inv) r.push('Ao contrário, o trabalho muda de sinal.');
        return r;
      });
      M.texto('<b class="t">Integral de linha de um campo vetorial</b>$$\\int_g F\\cdot dr=\\int_a^b F(g(t))\\cdot g\'(t)\\,dt.$$<p>Só conta a componente de $F$ na direção do movimento. Muda de sinal quando se inverte o sentido; não depende de mais nada na parametrização.</p>', 'nota');
      M.legenda([[cor.m, 'campo $F$'], [cor.u, '$F$ sobre o caminho / $F(g(t))\\cdot g\'(t)$'], [cor.n, 'parte já percorrida']]);
    },
  };

  /* ======================= sólido dado pelos limites de integração ======================= */
  const VV = ['x', 'θ'], VW = ['x', 'y', 'ρ', 'θ', 'φ'];
  const SIS = {
    cart: { u: 'x', v: ['y', 'x'], w: ['z', 'x;y'], ok: [['x'], ['x', 'y']], jac: () => 1, jtx: '', dif: 'dz\\,dy\\,dx', pt: (u, v, w) => [u, v, w], ev: (u, v) => [u, v, 0, 0, 0],
      inv: (x, y, z) => [[x, y, z]] },
    cil: { u: '\\theta', v: ['\\rho', '\\theta'], w: ['z', '\\rho;\\theta'], ok: [['θ'], ['ρ', 'θ']], jac: (u, v) => v, jtx: '\\rho\\,', dif: 'dz\\,d\\rho\\,d\\theta', pt: (u, v, w) => [v * Math.cos(u), v * Math.sin(u), w], ev: (u, v) => [0, 0, v, u, 0],
      inv: (x, y, z) => { const r = Math.hypot(x, y), t = Math.atan2(y, x); return [t, t + 2 * PI, t - 2 * PI].map((a) => [a, r, z]); } },
    esf: { u: '\\theta', v: ['\\varphi', '\\theta'], w: ['r', '\\theta;\\varphi'], ok: [['θ'], ['θ', 'φ']], jac: (u, v, w) => w * w * Math.sin(v), jtx: 'r^2\\operatorname{sen}\\varphi\\,', dif: 'dr\\,d\\varphi\\,d\\theta', pt: (u, v, w) => [w * Math.sin(v) * Math.cos(u), w * Math.sin(v) * Math.sin(u), w * Math.cos(v)], ev: (u, v) => [0, 0, 0, u, v],
      inv: (x, y, z) => { const r = Math.hypot(x, y, z), t = Math.atan2(y, x), ph = r > 1e-12 ? Math.acos(CM.clamp(z / r, -1, 1)) : 0; return [t, t + 2 * PI, t - 2 * PI].map((a) => [a, ph, r]); } },
  };
  const PADRAO = {
    cart: { ua: '0', ub: '1', lc: '0', ld: '1-x', le: '0', lh: '1-x-y' },
    cil: { ua: '0', ub: '2pi', lc: '0', ld: '1', le: 'rho^2', lh: '1' },
    esf: { ua: '0', ub: '2pi', lc: '0', ld: 'pi/4', le: '0', lh: '1' },
  };
  const SOLIDOS = [
    ['cone com tampa esférica', 'x^2+y^2 ≤ z^2 e x^2+y^2+z^2 ≤ 1 e z ≥ 0', Object.assign({ sis: 'esf' }, PADRAO.esf)],
    ['parabolóide até $z=1$', 'x^2+y^2 ≤ z e z ≤ 1', Object.assign({ sis: 'cil' }, PADRAO.cil)],
    ['tetraedro', 'x ≥ 0 e y ≥ 0 e z ≥ 0 e x+y+z ≤ 1', Object.assign({ sis: 'cart' }, PADRAO.cart)],
    ['bola furada por um cilindro', 'x^2+y^2+z^2 ≤ 1 e x^2+y^2 ≥ 0,25', { sis: 'cil', ua: '0', ub: '2pi', lc: '1/2', ld: '1', le: '-sqrt(1-rho^2)', lh: 'sqrt(1-rho^2)' }],
    ['cilindro cortado por um plano', 'x^2+y^2 ≤ 1 e z ≥ 0 e z ≤ 2-x', { sis: 'cil', ua: '0', ub: '2pi', lc: '0', ld: '1', le: '0', lh: '2 - rho cos(theta)' }],
    ['meia bola ($y\\ge0$)', 'x^2+y^2+z^2 ≤ 1 e y ≥ 0', { sis: 'esf', ua: '0', ub: 'pi', lc: '0', ld: 'pi', le: '0', lh: '1' }],
  ];
  const limites = {
    id: 'limites', nome: 'Sólido pelos limites',
    montar(M) {
      const cor = M.cores();
      const V = M.vista3d({ ext: 1.9, alvo: [0, 0, 0.2], yaw: -0.75, pitch: 0.45, dica: 'Arrasta para rodar' });
      M.escolha('sis', { rot: 'Coordenadas', opcoes: [['cart', 'Cartesianas'], ['cil', 'Cilíndricas'], ['esf', 'Esféricas']], valor: 'cil', aoMudar: (k) => Object.assign(M.S, PADRAO[k]) });
      Object.assign(M.S, PADRAO.cil);
      const wu = document.createElement('div'); wu.className = 'fbox'; M.ctl.appendChild(wu);
      const linhaU = CDI.intervalo(M, wu, 'ua', 'ub', '·');
      const wc = M.funcao('lc', { rot: '·', vars: VV, valor: PADRAO.cil.lc, ajuda: false });
      const wd = M.funcao('ld', { rot: '·', vars: VV, valor: PADRAO.cil.ld, ajuda: false });
      const we = M.funcao('le', { rot: '·', vars: VW, valor: PADRAO.cil.le, ajuda: false });
      const wh = M.funcao('lh', { rot: '·', vars: VW, valor: PADRAO.cil.lh });
      M.funcao('f', { rot: 'Integranda $f(x;y;z)=$', vars: ['x', 'y', 'z'], valor: '1', exemplos: [['$1$ (volume)', '1'], ['$z$', 'z'], ['$x^2+y^2$', 'x^2+y^2']] });
      M.funcao('ref', { rot: 'Sólido de referência (opcional): desigualdades em $x,y,z$', vars: ['x', 'y', 'z'], valor: SOLIDOS[1][1], condicao: true, opcional: true, ajuda: false, exemplos: SOLIDOS, exemplo: 'ex.: x^2+y^2 ≤ z e z ≤ 1' });
      M.caixa('dif', { rot: 'Mostrar onde os dois sólidos diferem', valor: true });
      M.sync.push(() => {
        const s = SIS[M.S.sis];
        linhaU.querySelector('span').innerHTML = tex('$' + s.u + '$ entre');
        wc.querySelector('.frot').innerHTML = tex('$' + s.v[0] + '$ de $c(' + s.v[1] + ')=$');
        wd.querySelector('.frot').innerHTML = tex('até $d(' + s.v[1] + ')=$');
        we.querySelector('.frot').innerHTML = tex('$' + s.w[0] + '$ de $e(' + s.w[1] + ')=$');
        wh.querySelector('.frot').innerHTML = tex('até $h(' + s.w[1] + ')=$');
      });
      let ck = null, R = null;
      const calc = (S) => {
        const k = JSON.stringify([S.sis, S.ua, S.ub, S.lc, S.ld, S.le, S.lh, S.f, S.ref]);
        if (k === ck) return R;
        const s = SIS[S.sis], a = CDI.valorConst(S.ua), b = CDI.valorConst(S.ub);
        const c = M.F.lc.f, d = M.F.ld.f, e = M.F.le.f, h = M.F.lh.f, f = M.F.f.f;
        const C_ = (u) => c(u, u), D_ = (u) => d(u, u), E_ = (u, v) => e(...s.ev(u, v)), H_ = (u, v) => h(...s.ev(u, v));
        const pt = (su, tv, rw) => { const u = a + (b - a) * su, v0 = C_(u), v = v0 + (D_(u) - v0) * tv, w0 = E_(u, v), w = w0 + (H_(u, v) - w0) * rw; return s.pt(u, v, w); };
        /* variáveis permitidas */
        const fora = [['lc', 0], ['ld', 0], ['le', 1], ['lh', 1]].filter(([id, i]) => M.F[id].usa.some((x) => !s.ok[i].includes(x)));
        /* integral (ponto médio) e verificação c ≤ d, e ≤ h */
        const n = 26; let I = 0, Vol = 0, troca = false;
        for (let i = 0; i < n; i++) {
          const u = a + ((b - a) * (i + 0.5)) / n, v0 = C_(u), v1 = D_(u); if (v1 < v0 - 1e-9) troca = true;
          for (let j = 0; j < n; j++) {
            const v = v0 + ((v1 - v0) * (j + 0.5)) / n, w0 = E_(u, v), w1 = H_(u, v); if (w1 < w0 - 1e-9) troca = true;
            for (let l = 0; l < n; l++) { const w = w0 + ((w1 - w0) * (l + 0.5)) / n, J = s.jac(u, v, w), dV = J * ((b - a) / n) * ((v1 - v0) / n) * ((w1 - w0) / n); const p = s.pt(u, v, w); Vol += dV; I += f(...p) * dV; }
          }
        }
        /* caixa que contém o sólido */
        let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
        for (let i = 0; i <= 12; i++) for (let j = 0; j <= 12; j++) for (let l = 0; l <= 2; l++) { const p = pt(i / 12, j / 12, l / 2); if (p.every(fin)) p.forEach((x, q) => { lo[q] = Math.min(lo[q], x); hi[q] = Math.max(hi[q], x); }); }
        if (!fin(lo[0])) { lo = [-1, -1, -1]; hi = [1, 1, 1]; }
        /* comparação com o sólido de referência (Monte Carlo com pontos de Halton) */
        let cmp = null;
        if (M.F.ref) {
          const Rf = M.F.ref.f;
          const dentro = (x, y, z) => s.inv(x, y, z).some(([u, v, w]) => { if (u < a - 1e-9 || u > b + 1e-9) return false; const v0 = C_(u), v1 = D_(u); if (v < v0 - 1e-9 || v > v1 + 1e-9) return false; const w0 = E_(u, v), w1 = H_(u, v); return w >= w0 - 1e-9 && w <= w1 + 1e-9; });
          let rlo = lo.slice(), rhi = hi.slice();
          for (let i = 1; i <= 6000; i++) { const p = [halton(i, 2), halton(i, 3), halton(i, 5)].map((x) => -3 + 6 * x); if (Rf(...p)) p.forEach((x, q) => { rlo[q] = Math.min(rlo[q], x - 0.1); rhi[q] = Math.max(rhi[q], x + 0.1); }); }
          const B0 = rlo.map((x, q) => Math.max(-3.2, x - 0.05)), B1 = rhi.map((x, q) => Math.min(3.2, x + 0.05)), volB = (B1[0] - B0[0]) * (B1[1] - B0[1]) * (B1[2] - B0[2]);
          let nA = 0, nB = 0, nAB = 0; const so = [], sr = []; const NP = 30000;
          for (let i = 1; i <= NP; i++) {
            const p = [halton(i, 2), halton(i, 3), halton(i, 5)].map((x, q) => B0[q] + (B1[q] - B0[q]) * x);
            const A = dentro(...p), Bq = !!Rf(...p);
            if (A) nA++; if (Bq) nB++; if (A && Bq) nAB++;
            if (A && !Bq && so.length < 900) so.push(p); if (Bq && !A && sr.length < 900) sr.push(p);
          }
          const uni = nA + nB - nAB;
          cmp = { volA: (nA / NP) * volB, volB: (nB / NP) * volB, dif: uni ? (uni - nAB) / uni : 0, so, sr, vazioRef: nB === 0 };
          [B0, B1].forEach((q) => q.forEach((x, j) => { lo[j] = Math.min(lo[j], x); hi[j] = Math.max(hi[j], x); }));
          if (cmp.vazioRef) { lo = lo.map((x) => Math.max(x, -2)); hi = hi.map((x) => Math.min(x, 2)); }
        }
        const m = Math.max(...lo.map(Math.abs), ...hi.map(Math.abs), 0.3);
        ck = k; R = { s, a, b, pt, I, Vol, troca, fora, cmp, esc: 1.5 / m };
        return R;
      };
      M.cena(V, (C, S) => {
        const r = calc(S), sc = r.esc;
        C.eixos({ x: [-1.7, 1.7], y: [-1.7, 1.7], z: [-1.6, 1.7], esc: [sc, sc, sc] });
        const face = (fn, nu, nv, o) => C.sup((p, q) => { const v = fn(p, q); return v.every(fin) ? v.map((x) => sc * x) : null; }, 0, 1, 0, 1, nu, nv, o);
        face((p, q) => r.pt(p, q, 1), 40, 30, { cor: cor.u, alfa: 0.62 });
        face((p, q) => r.pt(p, q, 0), 40, 30, { cor: cor.b, alfa: 0.62 });
        face((p, q) => r.pt(p, 0, q), 40, 8, { cor: cor.sup2, alfa: 0.4 });
        face((p, q) => r.pt(p, 1, q), 40, 8, { cor: cor.sup2, alfa: 0.4 });
        if (S.sis === 'cart' || Math.abs(r.b - r.a - 2 * PI) > 1e-6) { face((p, q) => r.pt(0, p, q), 20, 8, { cor: cor.v, alfa: 0.4 }); face((p, q) => r.pt(1, p, q), 20, 8, { cor: cor.v, alfa: 0.4 }); }
        if (r.cmp && S.dif) {
          const cruz = (lst) => { const e = 0.022 / sc, out = []; lst.forEach(([x, y, z]) => { out.push([[sc * (x - e), sc * y, sc * z], [sc * (x + e), sc * y, sc * z]], [[sc * x, sc * (y - e), sc * z], [sc * x, sc * (y + e), sc * z]], [[sc * x, sc * y, sc * (z - e)], [sc * x, sc * y, sc * (z + e)]]); }); return out; };
          C.segs(cruz(r.cmp.so), { cor: cor.r, larg: 1.8 });
          C.segs(cruz(r.cmp.sr), { cor: cor.ouro, larg: 1.8 });
        }
      });
      M.leituras('O teu integral', (S) => {
        const r = calc(S), s = r.s, t = (id) => M.F[id].tex;
        const rows = ['$$\\int_{' + tex0(S.ua) + '}^{' + tex0(S.ub) + '}\\int_{' + t('lc') + '}^{' + t('ld') + '}\\int_{' + t('le') + '}^{' + t('lh') + '}' + (S.f === '1' ? '' : '(' + M.F.f.tex + ')\\,') + s.jtx + s.dif + '$$',
          [S.f === '1' ? 'volume' : 'valor do integral', '$' + N(r.I, 4) + '$', 'forte']];
        if (S.f !== '1') rows.push(['volume', '$' + N(r.Vol, 4) + '$']);
        if (r.fora.length) rows.push('<b>Atenção:</b> ' + r.fora.map(([id]) => '$' + { lc: 'c', ld: 'd', le: 'e', lh: 'h' }[id] + '$').join(', ') + ' usa variáveis que ainda não estão fixas nesse integral. Os limites de dentro só podem depender das variáveis de fora.');
        if (r.troca) rows.push('<b>Atenção:</b> há pontos onde o limite de baixo é maior do que o de cima.');
        if (r.cmp) {
          if (r.cmp.vazioRef) rows.push('O sólido de referência está vazio (em $[-3;3]^3$).');
          else {
            rows.push('—', ['volume da referência (aprox.)', '$' + N(r.cmp.volB, 3) + '$'], ['volume do teu sólido (aprox.)', '$' + N(r.cmp.volA, 3) + '$'], ['pontos em só um dos dois', '$' + N(100 * r.cmp.dif, 1) + '\\,\\%$', r.cmp.dif < 0.02 ? 'forte' : 'mau']);
            rows.push(r.cmp.dif < 0.02 ? '<b>Certo:</b> os teus limites descrevem o sólido de referência.' : '<b>Ainda não coincidem.</b> Cruzes vermelhas: estão no teu sólido e não na referência. Douradas: estão na referência e faltam no teu.');
          }
        }
        return rows;
      });
      M.texto('<b class="t">Como ler os limites</b><p>O integral de fora percorre um intervalo fixo. O do meio, para cada valor de fora, vai de $c$ a $d$. O de dentro, para cada par já fixo, vai de $e$ a $h$: são as superfícies de baixo (azul) e de cima (laranja) do sólido.</p>', 'nota');
      M.legenda([[cor.b, 'limite de dentro: baixo'], [cor.u, 'limite de dentro: cima'], [cor.sup2, 'limites do meio'], [cor.v, 'limites de fora']]);
      function tex0(s) { try { return EX.ler(String(s), []).tex; } catch (e) { return '?'; } }
    },
  };

  CDI.modelosDe('novo2', { modelos: [escalar, trabalho, limites] });
})();
