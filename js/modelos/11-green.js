/* 11. Campos vetoriais: integral de linha, potencial, teorema de Green, conjuntos simplesmente conexos. */
(function () {
  const PI = Math.PI;
  const CA = {
    rot: { tex: '(-y;\\,x)', F: (x, y) => [-y, x], rot: () => 2, rtx: '1-(-1)=2', pot: null },
    grad: { tex: '(x+y;\\,x+e^y+1)', F: (x, y) => [x + y, x + Math.exp(y) + 1], rot: () => 0, rtx: '1-1=0', pot: (x, y) => x * y + (x * x) / 2 + Math.exp(y) + y, ptx: '\\varphi=xy+\\tfrac{x^2}{2}+e^y+y+C' },
    vort: { tex: '\\tfrac{(-y;\\,x)}{x^2+y^2}', F: (x, y) => { const r = x * x + y * y; return r < 1e-12 ? [NaN, NaN] : [-y / r, x / r]; }, rot: () => 0, rtx: '0\\ \\text{fora da origem}', pot: (x, y) => Math.atan2(y, x), ptx: '\\theta(x;y)\\ \\text{(ângulo polar)}', sing: true },
    cubo: { tex: '(-y^3;\\,x^3)', F: (x, y) => [-(y ** 3), x ** 3], rot: (x, y) => 3 * x * x + 3 * y * y, rtx: '3x^2+3y^2', pot: null },
    sep: { tex: '(x^2;\\,y^3)', F: (x, y) => [x * x, y ** 3], rot: () => 0, rtx: '0', pot: (x, y) => (x ** 3) / 3 + (y ** 4) / 4, ptx: '\\varphi=\\tfrac{x^3}{3}+\\tfrac{y^4}{4}+C' },
  };
  const CU = {
    circ: { nome: 'circunferência', g: (t, S) => [S.cx + S.R * Math.cos(t), S.cy + S.R * Math.sin(t)], t: [0, 2 * PI], dentro: (x, y, S) => (x - S.cx) ** 2 + (y - S.cy) ** 2 < S.R * S.R, area: (S) => PI * S.R * S.R,
      pd: (r, a, S) => [S.cx + r * S.R * Math.cos(a * 2 * PI), S.cy + r * S.R * Math.sin(a * 2 * PI)] },
    quad: { nome: 'quadrado', g: (t, S) => { const L = 2 * S.R, s = ((t % 4) + 4) % 4, x0 = S.cx - S.R, y0 = S.cy - S.R; return s < 1 ? [x0 + L * s, y0] : s < 2 ? [x0 + L, y0 + L * (s - 1)] : s < 3 ? [x0 + L * (3 - s), y0 + L] : [x0, y0 + L * (4 - s)]; }, t: [0, 4], dentro: (x, y, S) => Math.abs(x - S.cx) < S.R && Math.abs(y - S.cy) < S.R, area: (S) => 4 * S.R * S.R,
      pd: (u, v, S) => [S.cx - S.R + 2 * S.R * u, S.cy - S.R + 2 * S.R * v] },
  };

  /* campo escrito pelo aluno; se coincidir com um exemplo, usa as fórmulas exatas desse exemplo */
  const SRCF = { rot: '(-y; x)', grad: '(x+y; x+e^y+1)', vort: '(-y/(x^2+y^2); x/(x^2+y^2))', cubo: '(-y^3; x^3)', sep: '(x^2; y^3)' };
  const SRCP = { grad: 'xy+x^2/2+e^y+y', sep: 'x^3/3+y^4/4', vort: '' };
  const EXF = Object.keys(SRCF).map((k) => ['$' + CA[k].tex + '$', SRCF[k], { phi: SRCP[k] || '' }]);
  function campoDe(M, S) {
    const k = Object.keys(SRCF).find((q) => SRCF[q] === S.F);
    if (k) return Object.assign({ chave: k }, CA[k]);
    const F = M.F.F.f, h = 1e-4;
    const rot = (x, y) => (F(x + h, y)[1] - F(x - h, y)[1]) / (2 * h) - (F(x, y + h)[0] - F(x, y - h)[0]) / (2 * h);
    const v0 = F(0, 0);
    const phi = M.F.phi ? M.F.phi.f : null;
    return { chave: null, F, rot, rtx: '\\text{calculado numericamente}', pot: phi, ptx: M.F.phi ? '\\varphi=' + M.F.phi.tex : '', sing: !(isFinite(v0[0]) && isFinite(v0[1])) };
  }
  /* maior diferença entre ∇φ e F numa grelha (para verificar um potencial proposto) */
  function erroPotencial(F, phi) {
    let m = 0;
    for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) {
      const x = -2 + 0.5 * i + 0.013, y = -2 + 0.5 * j + 0.017, v = F(x, y), g = CM.grad(phi, x, y);
      if (isFinite(v[0]) && isFinite(g[0])) m = Math.max(m, Math.abs(v[0] - g[0]), Math.abs(v[1] - g[1]));
    }
    return m;
  }
  function linhaQuad(F, g, S, t0, t1) { // quadrado: somar lado a lado (a parametrização tem bicos)
    let s = 0;
    for (let k = Math.floor(t0); k < Math.ceil(t1); k++) { const a = Math.max(t0, k), b = Math.min(t1, k + 1); if (b > a) s += CM.linha(F, (t) => g(t, S), a, b, 400); }
    return s;
  }
  const circulacao = (S, t1) => { const c = CU[S.c], F = S._F || CA.rot.F; const T = t1 == null ? c.t[1] : t1; return S.c === 'quad' ? linhaQuad(F, c.g, S, 0, T) : CM.linha(F, (t) => c.g(t, S), 0, T, 1200); };
  function duploRot(S) {
    const c = CU[S.c], r = S._rot || CA.rot.rot;
    if (S.c === 'circ') return CM.simpson((rr) => CM.simpson((t) => r(S.cx + rr * Math.cos(t), S.cy + rr * Math.sin(t)) * rr, 0, 2 * PI, 60), 0, S.R, 60);
    return CM.riemann((x, y) => c.dentro(x, y, S), r, S.cx - S.R, S.cx + S.R, S.cy - S.R, S.cy + S.R, 90);
  }

  /* partículas a seguir o campo (fluido) e rodas de pás */
  function fluido(M, P, campoF, W) {
    const N = 70, ps = [];
    const novo = () => { const [x0, x1, y0, y1] = P.limites(); return { x: x0 + Math.random() * (x1 - x0), y: y0 + Math.random() * (y1 - y0), vida: 1.5 + Math.random() * 3, rasto: [] }; };
    for (let i = 0; i < N; i++) ps.push(novo());
    M.S._ang = 0;
    M.loop((dt) => {
      if (!M.S.anim) return;
      dt = Math.min(dt, 0.05);
      const F = campoF();
      const [x0, x1, y0, y1] = P.limites();
      const vel = (x, y) => { const v = F.F(x, y); if (!isFinite(v[0])) return [0, 0]; const n = Math.hypot(...v), k = n > 2.5 ? 2.5 / n : 1; return [v[0] * k * 0.45, v[1] * k * 0.45]; };
      for (let i = 0; i < N; i++) {
        const p = ps[i];
        const a = vel(p.x, p.y), b = vel(p.x + a[0] * dt * 0.5, p.y + a[1] * dt * 0.5);
        p.rasto.push([p.x, p.y]); if (p.rasto.length > 14) p.rasto.shift();
        p.x += b[0] * dt; p.y += b[1] * dt; p.vida -= dt;
        if (p.vida < 0 || p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1 || (F.sing && p.x * p.x + p.y * p.y < 0.01)) ps[i] = novo();
      }
      M.S._ang += 0.5 * F.rot(...W()) * dt * 0.45;
      P.pedir();
    });
    return (G, cor) => {
      ps.forEach((p) => { if (p.rasto.length > 1) G.curva(p.rasto.concat([[p.x, p.y]]), { cor: cor.i, larg: 1.3, alfa: 0.35 }); });
    };
  }
  function roda(G, c, ang, cor) {
    const r = 0.32;
    G.param((t) => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)], 0, 2 * PI, 48, { cor, larg: 2 });
    for (let k = 0; k < 4; k++) { const t = ang + (k * PI) / 2; G.curva([c, [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]], { cor, larg: 2 }); }
  }

  CDI.modelosDe('green', {
    id: 'green', ordem: 11, grupo: 'Cálculo integral', curto: 'Campos e Green', titulo: 'Campos vetoriais e teorema de Green', paginas: 'pp. 49–53',
    resumo: 'Trabalho ao longo de uma curva, potenciais, campos fechados, o teorema de Green e conjuntos simplesmente conexos.',
    modelos: [
      {
        id: 'green', nome: 'Teorema de Green',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.4, 2.4, -2, 2], dica: 'Arrasta o centro da curva e a roda de pás' });
          const V = M.vista3d({ ext: 2.2, alvo: [0, 0, 0.3], yaw: -0.8, pitch: 0.55, dica: 'Altura = rotacional · o volume com sinal sobre D é o integral duplo' });
          M.S.cx = 0; M.S.cy = 0; M.S.W = [-1.5, 1.2];
          M.funcao('F', { rot: '$F(x;y)=(P;Q)=$', vars: ['x', 'y'], componentes: 2, valor: SRCF.rot, exemplos: EXF.map((e) => e.slice(0, 2)) });
          M.sync.push(() => { const ca = campoDe(M, M.S); M.S._F = ca.F; M.S._rot = ca.rot; });
          M.escolha('c', { rot: 'Curva $L=\\partial D$ (sentido positivo)', opcoes: Object.keys(CU).map((k) => [k, CU[k].nome]), valor: 'circ' });
          M.barra('R', { rot: '$R$', cor: cor.u, min: 0.2, max: 1.4, valor: 1, nome: 'tamanho' });
          M.barra('t', { rot: '$t$', cor: cor.n, min: 0, max: 1, valor: 1, nome: 'fração percorrida', dur: 5000, fmt: (x) => Math.round(x * 100) + '%' });
          M.caixa('rotm', { rot: 'Cores: $\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}$', valor: true });
          M.caixa('anim', { rot: 'Fluido a correr (partículas e roda de pás)', valor: true });
          const desenharFluido = fluido(M, P, () => campoDe(M, M.S), () => M.S.W);
          M.cena(P, (G, S) => {
            const ca = campoDe(M, S), c = CU[S.c];
            if (S.rotm) {
              const az = hexRgb(cor.b), lj = hexRgb(cor.u);
              G.mapa((x, y) => { const v = ca.rot(x, y); if (Math.abs(v) < 1e-9) return null; const k = Math.min(1, Math.abs(v) / 6); const c0 = v > 0 ? lj : az; return [c0[0], c0[1], c0[2], Math.round(22 + 60 * k)]; }, 5);
            }
            G.eixos();
            G.campo(ca.F, { n: 19, cor: cor.m });
            if (S.anim) desenharFluido(G, cor);
            if (ca.sing) G.ponto([0, 0], { cor: cor.r, oco: true, r: 5 });
            G.param((t) => c.g(t, S), c.t[0], c.t[1], 240, { cor: cor.a, larg: 2.4, encher: cor.a + '14' });
            const T = c.t[0] + (c.t[1] - c.t[0]) * S.t;
            G.param((t) => c.g(t, S), c.t[0], T, 200, { cor: cor.n, larg: 4 });
            const p = c.g(Math.min(T, c.t[1] - 1e-6), S), q = c.g(Math.min(T, c.t[1] - 1e-6) + 1e-3, S);
            G.seta(p, CM.mul(CM.nrm(CM.sub(q, p)), 0.3), { cor: cor.n });
            const v = ca.F(...p);
            if (isFinite(v[0])) G.seta(p, CM.mul(v, 0.35 / Math.max(1, Math.hypot(...v))), { cor: cor.v, rot: '$F$' });
            roda(G, S.W, S._ang || 0, cor.ouro);
            G.ponto(S.W, { cor: cor.ouro, r: 4, arr: (x, y) => M.definir({ W: [x, y] }) });
            G.ponto([S.cx, S.cy], { cor: cor.a, r: 4, arr: (x, y) => M.definir({ cx: x, cy: y }) });
          });
          M.cena(V, (C, S) => {
            const ca = campoDe(M, S), c = CU[S.c];
            let m = 0.5;
            for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) m = Math.max(m, Math.abs(ca.rot(S.cx - S.R + (2 * S.R * i) / 8, S.cy - S.R + (2 * S.R * j) / 8)));
            const k = 1.3 / m, h = (x, y) => k * ca.rot(x, y);
            C.eixos({ x: [-2.2, 2.3], y: [-2.2, 2.3], z: [-0.3, 1.8], nomes: ['x', 'y', '\\operatorname{rot}F'] });
            C.grafico(h, -2.2, 2.2, -2.2, 2.2, 36, { alfa: 0.2, malha: false, zmax: 2.2 });
            const sgn = (u, v, p) => (p[2] >= 0 ? cor.u : cor.b);
            C.sup((u, v) => { const q = c.pd(u, v, S); return [...q, h(...q)]; }, 0, 1, 0, 1, 30, 40, { corF: sgn, alfa: 0.85 });
            C.sup((t, v) => { const q = c.g(t, S); return [...q, v * h(...q)]; }, c.t[0], c.t[1], 0, 1, S.c === 'quad' ? 80 : 90, 2, { corF: sgn, alfa: 0.3, malha: false });
            C.param((t) => [...c.g(t, S), 0.004], c.t[0], c.t[1], 160, { cor: cor.a, larg: 2.4 });
            const T = c.t[0] + (c.t[1] - c.t[0]) * S.t;
            C.param((t) => [...c.g(t, S), 0.006], c.t[0], T, 160, { cor: cor.n, larg: 3.6 });
            if (ca.sing) C.linha([0, 0, -0.3], [0, 0, 1.8], { cor: cor.r, larg: 2, trac: [3, 3] });
          });
          M.leituras('As duas contas', (S) => {
            const ca = campoDe(M, S), c = CU[S.c];
            const L = circulacao(S), D = duploRot(S), parc = circulacao(S, c.t[0] + (c.t[1] - c.t[0]) * S.t);
            const origemDentro = ca.sing && c.dentro(0, 0, S);
            const r = [['trabalho até agora', '$' + TX.n(parc, 4) + '$'], ['$\\oint_L F\\cdot dr$', '$' + TX.n(L, 4) + '$', 'forte'], ['$\\iint_D\\big(\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}\\big)\\,dx\\,dy$', '$' + TX.n(D, 4) + '$', 'forte'], ['$\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}$', '$' + ca.rtx + '$']];
            if (ca.chave === 'rot') r.push(['$=2\\cdot\\text{área}(D)$', '$' + TX.n(2 * c.area(S), 4) + '$']);
            r.push(origemDentro ? '<b>Green não se aplica:</b> $F$ não é $C^1$ em $D$ (falha na origem). A circulação é $2\\pi$, mas o integral duplo do rotacional, fora da origem, é $0$.' : Math.abs(L - D) < 1e-2 ? 'As duas contas dão o mesmo: é o teorema de Green.' : 'Diferença numérica: aumenta a resolução.');
            r.push(['roda de pás: $\\omega=\\tfrac12\\operatorname{rot}F$', '$' + TX.n(0.5 * ca.rot(...S.W), 3) + '$']);
            return r;
          });
          M.texto('<b class="t">Teorema de Green</b><p>$D\\subset\\mathbb R^2$ aberto, limitado e com fronteira regular, $F$ de classe $C^1$ num aberto que contém $\\overline D$, e $\\partial D$ percorrida no sentido positivo ($D$ fica à esquerda):</p>$$\\oint_{\\partial D}F\\cdot dr=\\iint_D\\Big(\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}\\Big)\\,dx\\,dy.$$<p>A roda de pás mede o rotacional: um fluido com velocidade $F$ fá-la girar com velocidade angular $\\tfrac12\\big(\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}\\big)$, no sentido direto quando é positivo. Na vista 3D, o volume com sinal debaixo do rotacional, sobre $D$, é o lado direito de Green.</p>', 'nota');
          M.legenda([[cor.a, 'curva $L=\\partial D$'], [cor.n, 'parte já percorrida'], [cor.u, 'rotacional $&gt;0$'], [cor.b, 'rotacional $&lt;0$'], [cor.ouro, 'roda de pás']]);
        },
      },
      {
        id: 'potencial', nome: 'Potencial e caminhos',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.4, 2.4, -2, 2], dica: 'Arrasta A, B e o ponto de controlo C do caminho curvo' });
          const V = M.vista3d({ ext: 2.3, alvo: [0, 0, 0.2], yaw: -0.7, pitch: 0.5, dica: 'Altura = potencial: o trabalho é a diferença de alturas' });
          M.S.A = [1.4, 0.2]; M.S.B = [-1.2, 0.6]; M.S.K = [0.2, 1.6];
          M.funcao('F', { rot: '$F(x;y)=$', vars: ['x', 'y'], componentes: 2, valor: SRCF.vort, exemplos: ['grad', 'sep', 'vort', 'rot'].map((k) => ['$' + CA[k].tex + '$', SRCF[k], { phi: SRCP[k] || '' }]) });
          M.funcao('phi', { rot: 'O teu potencial (opcional): $\\varphi(x;y)=$', vars: ['x', 'y'], valor: '', opcional: true, ajuda: false, exemplo: 'ex.: xy + x^2/2 + e^y + y' });
          M.sync.push(() => { const ca = campoDe(M, M.S); M.S._F = ca.F; });
          M.caixa('mapa', { rot: 'Cores: potencial $\\varphi$', valor: true });
          M.botoes([['Caminhos dos dois lados da origem', () => M.definir({ A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.7] })], ['Caminhos do mesmo lado', () => M.definir({ A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, 1.6] })]]);
          const reta = (S) => (t) => CM.add(S.A, CM.mul(CM.sub(S.B, S.A), t));
          const curvo = (S) => (t) => { const u = 1 - t; return [u * u * S.A[0] + 2 * u * t * S.K[0] + t * t * S.B[0], u * u * S.A[1] + 2 * u * t * S.K[1] + t * t * S.B[1]]; };
          /* caminho levantado: altura = potencial contínuo ao longo do caminho (para θ, desenrolado) */
          const levantar = (S, g, k, pot, vort) => {
            const pts = []; let th = pot(...g(0)), prev = th;
            for (let i = 0; i <= 160; i++) {
              const p = g(i / 160), v = pot(...p);
              if (vort) { let d = v - prev; d -= 2 * PI * Math.round(d / (2 * PI)); th += d; prev = v; pts.push([...p, k * th]); }
              else pts.push([...p, k * v]);
            }
            return pts;
          };
          M.cena(P, (G, S) => {
            const ca = campoDe(M, S);
            if (S.mapa && ca.pot) {
              const a = hexRgb(cor.sup), b = hexRgb(cor.u);
              const [x0, x1, y0, y1] = G.limites();
              const vs = []; for (let i = 0; i < 36; i++) vs.push(ca.pot(x0 + ((x1 - x0) * (i % 6)) / 5, y0 + ((y1 - y0) * Math.floor(i / 6)) / 5));
              const lo = Math.min(...vs), hi = Math.max(...vs);
              G.mapa((x, y) => { const t = CM.clamp((ca.pot(x, y) - lo) / (hi - lo || 1), 0, 1); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, 70]; }, 4);
            }
            G.eixos();
            G.campo(ca.F, { n: 19, cor: cor.m });
            if (ca.sing) { G.ponto([0, 0], { cor: cor.r, oco: true, r: 5 }); if (S.mapa) G.curva([[-5, 0], [0, 0]], { cor: cor.r, larg: 1.5, trac: [5, 4] }); }
            G.param(reta(S), 0, 1, 2, { cor: cor.b, larg: 3 });
            G.param(curvo(S), 0, 1, 120, { cor: cor.n, larg: 3 });
            G.ponto(S.K, { cor: cor.n, r: 4, rot: 'C', arr: (x, y) => M.definir({ K: [x, y] }) });
            G.ponto(S.A, { cor: cor.i, rot: 'A', arr: (x, y) => M.definir({ A: [x, y] }) });
            G.ponto(S.B, { cor: cor.i, rot: 'B', arr: (x, y) => M.definir({ B: [x, y] }) });
          });
          M.cena(V, (C, S) => {
            const ca = campoDe(M, S);
            C.eixos({ x: [-2.2, 2.3], y: [-2.2, 2.3], z: [-1.7, 1.9], nomes: ['x', 'y', '\\varphi'] });
            C.param((t) => [...reta(S)(t), 0.004], 0, 1, 2, { cor: cor.b, larg: 1.6, alfa: 0.6 });
            C.param((t) => [...curvo(S)(t), 0.004], 0, 1, 80, { cor: cor.n, larg: 1.6, alfa: 0.6 });
            if (!ca.pot) { C.texto([0, 0, 1.2], ca.chave === 'rot' ? 'sem potencial: $\\operatorname{rot}F=2\\ne0$' : 'escreve um potencial $\\varphi$ para o ver aqui', { cor: cor.r }); return; }
            let k;
            const vort = ca.chave === 'vort';
            if (vort) {
              k = 0.22;
              C.sup((r, a) => [r * Math.cos(a), r * Math.sin(a), k * a], 0.12, 2.2, -2 * PI, 2 * PI, 10, 160, { alfa: 0.5, passoMalha: 2 });
              C.linha([0, 0, -1.7], [0, 0, 1.7], { cor: cor.r, larg: 2, trac: [3, 3] });
            } else {
              let m = 0;
              for (let i = 0; i <= 12; i++) for (let j = 0; j <= 12; j++) m = Math.max(m, Math.abs(ca.pot(-2.2 + (4.4 * i) / 12, -2.2 + (4.4 * j) / 12)));
              k = 1.6 / m;
              C.grafico((x, y) => k * ca.pot(x, y), -2.2, 2.2, -2.2, 2.2, 40, { alfa: 0.55 });
            }
            const l1 = levantar(S, reta(S), k, ca.pot, vort), l2 = levantar(S, curvo(S), k, ca.pot, vort);
            C.curva(l1, { cor: cor.b, larg: 3.4 });
            C.curva(l2, { cor: cor.n, larg: 3.4 });
            [[l1[0], 'A'], [l1[160], 'B_1'], [l2[160], 'B_2']].forEach(([p, n]) => { C.linha([p[0], p[1], 0], p, { cor: cor.m, larg: 1, trac: [3, 3] }); });
            C.ponto(l1[0], { cor: cor.i, r: 4.5, rot: '$A$' });
            C.ponto(l1[160], { cor: cor.b, r: 4.5 });
            C.ponto(l2[160], { cor: cor.n, r: 4.5, rot: Math.abs(l1[160][2] - l2[160][2]) > 0.05 ? '$B$ (outro andar)' : '$B$' });
          });
          M.leituras('$\\int_L F\\cdot dr$ de $A$ a $B$', (S) => {
            const ca = campoDe(M, S);
            const I1 = CM.linha(ca.F, reta(S), 0, 1, 1500), I2 = CM.linha(ca.F, curvo(S), 0, 1, 1500);
            const r = [['pelo segmento (azul)', '$' + TX.n(I1, 4) + '$'], ['pelo caminho curvo (roxo)', '$' + TX.n(I2, 4) + '$'], ['diferença', '$' + TX.n(I2 - I1, 4) + '$', Math.abs(I2 - I1) > 1e-3 ? 'mau' : 'forte']];
            if (M.F.phi) {
              const e = erroPotencial(ca.F, M.F.phi.f);
              r.push(['o teu $\\varphi$: $\\max|\\nabla\\varphi-F|$', '$' + TX.n(e, 4) + '$', e < 1e-3 ? 'forte' : 'mau']);
              r.push(e < 1e-3 ? '<b>Certo:</b> $\\nabla\\varphi=F$ (verificado numa grelha de pontos).' : '<b>Ainda não:</b> $\\nabla\\varphi\\ne F$. Confirma: $\\partial_x\\varphi$ tem de dar $F_1$ e $\\partial_y\\varphi$ tem de dar $F_2$.');
            }
            if (!ca.chave) {
              let m = 0; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) { const v = ca.rot(-2 + 0.5 * i + 0.011, -2 + 0.5 * j + 0.019); if (isFinite(v)) m = Math.max(m, Math.abs(v)); }
              r.push(['$\\max\\big|\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}\\big|$', '$' + TX.n(m, 4) + '$']);
              r.push(m < 1e-3 ? 'O campo é <b>fechado</b>' + (ca.sing ? ', mas tem uma singularidade na origem: vê se os integrais pelos dois caminhos coincidem.' : ' num domínio simplesmente conexo: é gradiente.') : 'O campo <b>não é fechado</b>: não pode ser gradiente, e o integral depende do caminho.');
            }
            if (ca.pot && ca.chave !== 'vort') r.push(['$\\varphi(B)-\\varphi(A)$', '$' + TX.n(ca.pot(...S.B) - ca.pot(...S.A), 4) + '$', 'forte'], ['potencial', '$' + ca.ptx + '$']);
            if (ca.chave === 'vort') r.push(Math.abs(Math.abs(I2 - I1) - 2 * PI) < 1e-2 ? 'Os caminhos passam de lados diferentes da origem: diferem em $2\\pi$. Na vista 3D, sobem a «escada em caracol» $\\theta$ e chegam a $B$ em andares diferentes. $F$ não é gradiente em $\\mathbb R^2\\setminus\\{0\\}$.' : 'Do mesmo lado da origem os dois integrais coincidem: localmente, $F=\\nabla\\theta$.');
            if (ca.chave === 'rot') r.push('$(-y;x)$ não é fechado (rotacional $2$): o integral depende do caminho, não há potencial.');
            return r;
          });
          M.texto('<b class="t">Campos gradientes</b><p>Se $F=\\nabla\\varphi$, então $\\int_L F\\cdot dr=\\varphi(B)-\\varphi(A)$ para qualquer caminho de $A$ a $B$: na vista 3D, é a subida de $A$ até $B$ no gráfico de $\\varphi$, e não depende do caminho. Em caminhos fechados, $\\oint F=0$.</p><p>$F$ fechado ($\\frac{\\partial F_2}{\\partial x}=\\frac{\\partial F_1}{\\partial y}$) num domínio <b>simplesmente conexo</b> $\\Rightarrow$ $F$ é gradiente. Em $\\mathbb R^2\\setminus\\{0\\}$ isso falha: o vórtice é fechado, mas o seu «potencial» $\\theta$ é uma escada em caracol que sobe $2\\pi$ por volta.</p><p>Em $\\mathbb R^3$: $\\mathbb R^3\\setminus\\{0\\}$ é simplesmente conexo (um laço desvia-se pelo lado), mas $\\mathbb R^3$ sem uma reta não é.</p>', 'nota');
          M.legenda([[cor.b, 'segmento de $A$ a $B$'], [cor.n, 'caminho curvo'], [cor.r, 'singularidade (e corte de $\\theta$)']]);
        },
      },
      {
        id: 'area', nome: 'Área com Green',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.4, 2.4, -1.8, 1.8] });
          const FO = {
            elipse: { nome: 'elipse', g: (t, S) => [S.a * Math.cos(t), S.b * Math.sin(t)], ex: (S) => PI * S.a * S.b, etx: '\\pi ab' },
            card: { nome: 'cardioide', g: (t, S) => { const r = S.a * 0.5 * (1 + Math.cos(t)); return [r * Math.cos(t), r * Math.sin(t)]; }, ex: (S) => (3 * PI * (S.a * 0.5) ** 2) / 2, etx: '\\tfrac32\\pi c^2,\\ c=\\tfrac a2' },
            estrela: { nome: 'astroide', g: (t, S) => [S.a * Math.cos(t) ** 3, S.b * Math.sin(t) ** 3], ex: (S) => (3 * PI * S.a * S.b) / 8, etx: '\\tfrac38\\pi ab' },
          };
          M.escolha('fo', { rot: 'Curva', opcoes: Object.keys(FO).map((k) => [k, FO[k].nome]), valor: 'elipse' });
          M.barra('a', { rot: '$a$', cor: cor.u, min: 0.4, max: 2.2, valor: 1.8, nome: 'a' });
          M.barra('b', { rot: '$b$', cor: cor.v, min: 0.4, max: 1.6, valor: 1, nome: 'b' });
          M.barra('t', { rot: '$t$', cor: cor.n, min: 0, max: 2 * PI, valor: 2.2, nome: 'parâmetro', dur: 6000 });
          M.cena(P, (G, S) => {
            const f = FO[S.fo];
            G.eixos();
            G.param((t) => f.g(t, S), 0, 2 * PI, 300, { cor: cor.a, larg: 2.4 });
            const n = 60;
            for (let i = 0; i < n; i++) { const t0 = (S.t * i) / n, t1 = (S.t * (i + 1)) / n; G.poli([[0, 0], f.g(t0, S), f.g(t1, S)], { cor: cor.n, larg: 0.6, alfa: 0.9, encher: cor.n + '40' }); }
            const p = f.g(S.t, S);
            G.curva([[0, 0], p], { cor: cor.n, larg: 1.6 });
            G.ponto(p, { cor: cor.n, rot: '$g(t)$' });
          });
          M.leituras('$\\text{Área}=\\tfrac12\\oint(x\\,dy-y\\,dx)$', (S) => {
            const f = FO[S.fo];
            const ar = (T) => 0.5 * CM.linha((x, y) => [-y, x], (t) => f.g(t, S), 0, T, 1500);
            return [['área varrida até $t$', '$' + TX.n(ar(S.t), 4) + '$'], ['volta completa', '$' + TX.n(ar(2 * PI), 4) + '$', 'forte'], ['valor exato $' + f.etx + '$', '$' + TX.n(f.ex(S), 4) + '$']];
          });
          M.texto('<b class="t">Área com o teorema de Green</b><p>Escolhe-se um campo com $\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}=1$. Então $\\iint_D 1\\,dx\\,dy=\\oint_{\\partial D}F\\cdot dr$. As escolhas habituais:</p>$$F=(0;x):\\ \\oint x\\,dy,\\qquad F=(-y;0):\\ -\\oint y\\,dx,\\qquad F=\\tfrac12(-y;x):\\ \\tfrac12\\oint(x\\,dy-y\\,dx).$$<p>A última é a soma dos triângulos finos varridos pelo vetor posição (a roxo). Elipse: $\\tfrac12\\int_0^{2\\pi}(ab\\cos^2t+ab\\sin^2t)\\,dt=\\pi ab$.</p>', 'nota');
          M.legenda([[cor.n, 'triângulos de área $\\tfrac12(x\\,dy-y\\,dx)$']]);
        },
      },
    ],
    explicar: [
      { modelo: 'green', titulo: 'Integral de linha (trabalho)', estado: { f: 'rot', c: 'circ', R: 1, t: 0.35, cx: 0, cy: 0, rotm: false, anim: true }, texto: '<p>Com $L$ descrita por $g(t)$, $t\\in[a,b]$:</p>$$\\int_L F\\cdot dr=\\int_a^b F(g(t))\\cdot g\'(t)\\,dt.$$<p>É o trabalho de $F$ ao longo de $L$. Carrega em ▶ ao lado de $t$ para o ver acumular.</p>' },
      { modelo: 'green', titulo: 'A roda de pás', estado: { f: 'rot', c: 'circ', R: 1, t: 1, cx: 0, cy: 0, rotm: true, anim: true, W: [-1.4, 1.1] }, texto: '<p>Põe uma roda de pás num fluido com velocidade $F=(-y;x)$. Em qualquer sítio onde a ponhas, ela gira no sentido direto, sempre à mesma velocidade: o rotacional é $\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}=2$ em todo o lado.</p><p>Arrasta a roda dourada.</p>' },
      { modelo: 'green', titulo: 'Green no quadrado', estado: { f: 'cubo', c: 'quad', R: 0.5, cx: 0.5, cy: 0.5, t: 1, rotm: true }, texto: '<p>Em $[0,1]^2$, os lados verticais dão $\\int_0^1\\big(F_2(1;t)-F_2(0;t)\\big)dt=\\iint\\frac{\\partial F_2}{\\partial x}$ e os horizontais $-\\iint\\frac{\\partial F_1}{\\partial y}$. Somando:</p>$$\\oint_{\\partial D}F\\cdot dr=\\iint_D\\Big(\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}\\Big)dx\\,dy.$$<p>Na vista 3D, o lado direito é o volume debaixo do paraboloide $3x^2+3y^2$ sobre o quadrado.</p>' },
      { modelo: 'green', titulo: 'Rotacional constante', estado: { f: 'rot', c: 'circ', R: 1, cx: 0.3, cy: -0.2, t: 1, rotm: true }, texto: '<p>$F=(-y;x)$: o rotacional é $2$, por isso $\\oint F=2\\cdot\\text{área}(D)$, seja qual for a posição da curva. Na vista 3D, é um cilindro de altura constante. Arrasta o centro.</p>' },
      { modelo: 'green', titulo: 'Campo fechado: ∮ = 0', estado: { f: 'grad', c: 'circ', R: 1, cx: 0, cy: 0, t: 1, rotm: true, W: [1.2, -1.2] }, texto: '<p>$F=(x+y;\\,x+e^y+1)$: $\\frac{\\partial F_2}{\\partial x}=1=\\frac{\\partial F_1}{\\partial y}$. A roda de pás não gira em lado nenhum, e o volume na vista 3D é $0$.</p><p>Em $\\mathbb R^2$ (simplesmente conexo), $F$ é gradiente: $\\varphi=xy+\\tfrac{x^2}{2}+e^y+y$. Logo $\\oint F=0$ em qualquer curva fechada.</p>' },
      { modelo: 'green', titulo: 'O vórtice', estado: { f: 'vort', c: 'circ', R: 1, cx: 0, cy: 0, t: 1, rotm: false, W: [1.3, 1] }, texto: '<p>$F=\\frac{(-y;x)}{x^2+y^2}$ também é fechado fora da origem: as partículas dão voltas, mas a roda de pás, fora da origem, não gira. E no entanto $\\oint F=2\\pi$ na circunferência unitária.</p><p>Não contradiz Green: $F$ não é $C^1$ no disco, porque não está definido em $(0;0)$. Afasta a curva da origem e a circulação volta a $0$.</p>' },
      { modelo: 'potencial', titulo: 'Independência do caminho', estado: { f: 'grad', A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.6], mapa: true }, texto: '<p>Para um campo gradiente, $\\int_L F\\cdot dr=\\varphi(B)-\\varphi(A)$. Na vista 3D, os dois caminhos sobem o gráfico de $\\varphi$ e chegam ao mesmo ponto: a subida é a mesma, para qualquer $C$.</p>' },
      { modelo: 'potencial', titulo: 'ℝ² \\ {0} não é simplesmente conexo', estado: { f: 'vort', A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.7], mapa: true }, vista: [-0.7, 0.45], texto: '<p>No vórtice, o «potencial» é o ângulo $\\theta$, uma escada em caracol à volta da origem. Os dois caminhos, de lados opostos da origem, chegam a $B$ em andares que diferem $2\\pi$: os integrais diferem em $2\\pi$.</p><p>Do mesmo lado, coincidem: localmente $F=\\nabla\\theta$. Não há um potencial (de um só andar) em todo o $\\mathbb R^2\\setminus\\{0\\}$.</p>' },
      { modelo: 'area', titulo: 'Área com Green', estado: { fo: 'elipse', a: 1.8, b: 1, t: 2.2 }, texto: '<p>Com $F=\\tfrac12(-y;x)$, o rotacional é $1$, e Green dá $\\text{Área}(D)=\\tfrac12\\oint(x\\,dy-y\\,dx)$.</p><p>Para a elipse $(a\\cos t;\\,b\\sin t)$: $\\tfrac12\\int_0^{2\\pi}ab\\,dt=\\pi ab$.</p>' },
    ],
    testa: [
      { modelo: 'green', estado: { f: 'rot', c: 'circ', R: 1, cx: 0, cy: 0, t: 1 }, p: '$\\oint(-y;x)\\cdot dr$ na circunferência unitária, sentido positivo:', op: ['$0$', '$\\pi$', '$2\\pi$', '$4\\pi$'], certa: 2, porque: 'Rotacional $2$ e área $\\pi$: $2\\pi$. Direto: $\\int_0^{2\\pi}(\\sin^2t+\\cos^2t)\\,dt=2\\pi$.' },
      { modelo: 'green', estado: { f: 'vort', c: 'circ', R: 0.6, cx: 1.2, cy: 0.4, t: 1 }, p: 'Vórtice $\\frac{(-y;x)}{x^2+y^2}$, circunferência que <b>não</b> rodeia a origem:', op: ['$2\\pi$', '$0$', '$-2\\pi$', 'Não está definido'], certa: 1, porque: 'Aí $F$ é $C^1$ no disco e fechado, por isso Green dá $0$.' },
      { modelo: 'green', estado: { f: 'cubo', c: 'circ', R: 0.8, cx: 0, cy: 0, t: 1, W: [1.4, 0.4] }, p: 'Para $F=(-y^3;x^3)$, onde gira mais depressa a roda de pás?', op: ['Na origem', 'Longe da origem', 'Gira igual em todo o lado', 'Não gira'], certa: 1, porque: 'O rotacional é $3x^2+3y^2$: zero na origem e cresce com a distância.' },
      { modelo: 'potencial', estado: { f: 'grad', mapa: true }, p: 'Potencial de $F=(x+y;\\,x+e^y+1)$:', op: ['$xy+\\tfrac{x^2}{2}+e^y+y$', '$\\tfrac{x^2}{2}+e^y$', '$xy+e^y$', 'Não tem'], certa: 0, porque: '$\\frac{\\partial\\varphi}{\\partial x}=y+x$ e $\\frac{\\partial\\varphi}{\\partial y}=x+e^y+1$. Confirma derivando.' },
      { p: 'Qual destes conjuntos é simplesmente conexo?', op: ['$\\mathbb R^2\\setminus\\{(0;0)\\}$', '$\\mathbb R^3\\setminus\\{(0;0;0)\\}$', '$\\mathbb R^3$ sem o eixo dos $z$', 'um anel em $\\mathbb R^2$'], certa: 1, porque: 'Em $\\mathbb R^3$, um laço à volta de um ponto pode deslizar para o lado e encolher. À volta de uma reta ou de um buraco no plano, não.' },
      { modelo: 'area', estado: { fo: 'elipse' }, p: 'Que integral de linha dá a área de $D$?', op: ['$\\oint(x\\,dx+y\\,dy)$', '$\\tfrac12\\oint(x\\,dy-y\\,dx)$', '$\\oint y\\,dx$', '$\\oint(x\\,dx-y\\,dy)$'], certa: 1, porque: '$F=\\tfrac12(-y;x)$ tem $\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}=\\tfrac12+\\tfrac12=1$.' },
    ],
  });
})();
