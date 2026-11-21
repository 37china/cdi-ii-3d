/* 11. Campos vetoriais: integral de linha, potencial, teorema de Green, conjuntos simplesmente conexos. */
(function () {
  const PI = Math.PI;
  const CA = {
    rot: { nome: '(−y; x)', F: (x, y) => [-y, x], rot: () => 2, rtx: '∂F₂/∂x − ∂F₁/∂y = 1 − (−1) = 2', pot: null },
    grad: { nome: '(x + y; x + eʸ + 1)', F: (x, y) => [x + y, x + Math.exp(y) + 1], rot: () => 0, rtx: '1 − 1 = 0 (campo fechado)', pot: (x, y) => x * y + (x * x) / 2 + Math.exp(y) + y, ptx: 'φ = xy + x²/2 + eʸ + y + C' },
    vort: { nome: '(−y; x)/(x² + y²)', F: (x, y) => { const r = x * x + y * y; return r < 1e-12 ? [NaN, NaN] : [-y / r, x / r]; }, rot: () => 0, rtx: '0 fora da origem; F não está definido em (0; 0)', pot: (x, y) => Math.atan2(y, x), ptx: 'θ(x; y), o ângulo polar: só é potencial em ℝ² sem uma semirreta', sing: true },
    cubo: { nome: '(−y³; x³)', F: (x, y) => [-(y ** 3), x ** 3], rot: (x, y) => 3 * x * x + 3 * y * y, rtx: '3x² + 3y²', pot: null },
    sep: { nome: '(x²; y³)', F: (x, y) => [x * x, y ** 3], rot: () => 0, rtx: '0 (campo fechado)', pot: (x, y) => (x ** 3) / 3 + (y ** 4) / 4, ptx: 'φ = x³/3 + y⁴/4 + C (soma das primitivas das coordenadas)' },
  };
  const CU = {
    circ: { nome: 'circunferência', g: (t, S) => [S.cx + S.R * Math.cos(t), S.cy + S.R * Math.sin(t)], t: [0, 2 * PI], dentro: (x, y, S) => (x - S.cx) ** 2 + (y - S.cy) ** 2 < S.R * S.R, area: (S) => PI * S.R * S.R },
    quad: { nome: 'quadrado', g: (t, S) => { const L = 2 * S.R, s = ((t % 4) + 4) % 4, x0 = S.cx - S.R, y0 = S.cy - S.R; return s < 1 ? [x0 + L * s, y0] : s < 2 ? [x0 + L, y0 + L * (s - 1)] : s < 3 ? [x0 + L * (3 - s), y0 + L] : [x0, y0 + L * (4 - s)]; }, t: [0, 4], dentro: (x, y, S) => Math.abs(x - S.cx) < S.R && Math.abs(y - S.cy) < S.R, area: (S) => 4 * S.R * S.R },
  };
  function linhaQuad(F, g, S, t0, t1) { // quadrado: somar lado a lado (a parametrização tem bicos)
    let s = 0;
    for (let k = Math.floor(t0); k < Math.ceil(t1); k++) { const a = Math.max(t0, k), b = Math.min(t1, k + 1); if (b > a) s += CM.linha(F, (t) => g(t, S), a, b, 400); }
    return s;
  }
  const circulacao = (S, t1) => { const c = CU[S.c], F = CA[S.f].F; const T = t1 == null ? c.t[1] : t1; return S.c === 'quad' ? linhaQuad(F, c.g, S, 0, T) : CM.linha(F, (t) => c.g(t, S), 0, T, 1200); };
  function duploRot(S) {
    const c = CU[S.c], r = CA[S.f].rot, n = 90;
    if (S.c === 'circ') return CM.simpson((rr) => CM.simpson((t) => r(S.cx + rr * Math.cos(t), S.cy + rr * Math.sin(t)) * rr, 0, 2 * PI, 60), 0, S.R, 60);
    return CM.riemann((x, y) => c.dentro(x, y, S), r, S.cx - S.R, S.cx + S.R, S.cy - S.R, S.cy + S.R, n);
  }

  CDI.materia({
    id: 'green', ordem: 11, grupo: 'Cálculo integral', curto: 'Campos e Green', titulo: 'Campos vetoriais e teorema de Green', paginas: 'pp. 49–53',
    resumo: 'Trabalho ao longo de uma curva, potenciais, campos fechados, o teorema de Green e conjuntos simplesmente conexos.',
    modelos: [
      {
        id: 'green', nome: 'Teorema de Green',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.4, 2.4, -2, 2], dica: 'Arrasta o centro da curva' });
          M.S.cx = 0; M.S.cy = 0;
          M.escolha('f', { rot: 'F(x; y)', opcoes: Object.keys(CA).map((k) => [k, CA[k].nome]), valor: 'rot', mono: true });
          M.escolha('c', { rot: 'Curva L = ∂D (sentido positivo)', opcoes: Object.keys(CU).map((k) => [k, CU[k].nome]), valor: 'circ' });
          M.barra('R', { rot: 'R', cor: cor.u, min: 0.2, max: 1.4, valor: 1, nome: 'tamanho' });
          M.barra('t', { rot: 't', cor: cor.n, min: 0, max: 1, valor: 1, nome: 'fração percorrida', dur: 5000, fmt: (x) => Math.round(x * 100) + '%', animar: true });
          M.caixa('rotm', { rot: 'Cores: ∂F₂/∂x − ∂F₁/∂y', valor: true });
          M.cena(P, (G, S) => {
            const ca = CA[S.f], c = CU[S.c];
            if (S.rotm) {
              const az = hexRgb(cor.b), lj = hexRgb(cor.u);
              G.mapa((x, y) => { const v = ca.rot(x, y); if (Math.abs(v) < 1e-9) return null; const k = Math.min(1, Math.abs(v) / 6); const c0 = v > 0 ? lj : az; return [c0[0], c0[1], c0[2], Math.round(22 + 60 * k)]; }, 5);
            }
            G.eixos();
            G.campo(ca.F, { n: 19, cor: cor.m });
            if (ca.sing) G.ponto([0, 0], { cor: cor.r, oco: true, r: 5 });
            G.param((t) => c.g(t, S), c.t[0], c.t[1], 240, { cor: cor.a, larg: 2.4, encher: cor.a + '14' });
            const T = c.t[0] + (c.t[1] - c.t[0]) * S.t;
            G.param((t) => c.g(t, S), c.t[0], T, 200, { cor: cor.n, larg: 4 });
            const p = c.g(Math.min(T, c.t[1] - 1e-6), S), q = c.g(Math.min(T, c.t[1] - 1e-6) + 1e-3, S);
            G.seta(p, CM.mul(CM.nrm(CM.sub(q, p)), 0.3), { cor: cor.n });
            const v = ca.F(...p);
            if (isFinite(v[0])) G.seta(p, CM.mul(v, 0.35 / Math.max(1, Math.hypot(...v))), { cor: cor.v, rot: 'F' });
            G.ponto([S.cx, S.cy], { cor: cor.a, r: 4, arr: (x, y) => M.definir({ cx: x, cy: y }) });
          });
          M.leituras('As duas contas', (S) => {
            const ca = CA[S.f], c = CU[S.c];
            const L = circulacao(S), D = duploRot(S), parc = circulacao(S, c.t[0] + (c.t[1] - c.t[0]) * S.t);
            const origemDentro = ca.sing && c.dentro(0, 0, S);
            const r = [['trabalho até agora', CM.fmt(parc, 4)], ['∮_L F · dr', CM.fmt(L, 4), 'forte'], ['∬_D (∂F₂/∂x − ∂F₁/∂y) dx dy', CM.fmt(D, 4), 'forte'], ['∂F₂/∂x − ∂F₁/∂y', ca.rtx]];
            if (S.f === 'rot') r.push(['= 2 · área de D', CM.fmt(2 * c.area(S), 4)]);
            r.push(origemDentro ? '<b>Green não se aplica:</b> F não é C¹ em D (falha na origem). A circulação é 2π, mas o integral duplo do rotacional, fora da origem, é 0.' : Math.abs(L - D) < 1e-2 ? 'As duas contas dão o mesmo: é o teorema de Green.' : 'Diferença numérica: aumenta a resolução.');
            return r;
          });
          M.texto('<b class="t">Teorema de Green</b><p>D ⊂ ℝ² aberto, limitado e com fronteira regular, F : ℝ² → ℝ² de classe C¹ num aberto que contém D e a fronteira, e ∂D percorrida no sentido positivo (D fica à esquerda):</p><p class="f">∮_∂D F · dr = ∬_D (∂F₂/∂x − ∂F₁/∂y) dx dy.</p><p>Consequência: se F é fechado (∂F₂/∂x = ∂F₁/∂y) e C¹ em D, ∮_∂D F = 0.</p>', 'nota');
          M.legenda([[cor.a, 'curva L = ∂D'], [cor.n, 'parte já percorrida'], [cor.u, 'rotacional &gt; 0'], [cor.b, 'rotacional &lt; 0']]);
        },
      },
      {
        id: 'potencial', nome: 'Potencial e caminhos',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.4, 2.4, -2, 2], dica: 'Arrasta A, B e o ponto de controlo C do caminho curvo' });
          M.S.A = [1.4, 0.2]; M.S.B = [-1.2, 0.6]; M.S.K = [0.2, 1.6];
          M.escolha('f', { rot: 'F(x; y)', opcoes: ['grad', 'sep', 'vort', 'rot'].map((k) => [k, CA[k].nome]), valor: 'vort', mono: true });
          M.caixa('mapa', { rot: 'Cores: potencial φ', valor: true });
          M.botoes([['Caminhos dos dois lados da origem', () => M.definir({ A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.7] })], ['Caminhos do mesmo lado', () => M.definir({ A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, 1.6] })]]);
          const reta = (S) => (t) => CM.add(S.A, CM.mul(CM.sub(S.B, S.A), t));
          const curvo = (S) => (t) => { const u = 1 - t; return [u * u * S.A[0] + 2 * u * t * S.K[0] + t * t * S.B[0], u * u * S.A[1] + 2 * u * t * S.K[1] + t * t * S.B[1]]; };
          M.cena(P, (G, S) => {
            const ca = CA[S.f];
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
          M.leituras('∫_L F · dr de A a B', (S) => {
            const ca = CA[S.f];
            const I1 = CM.linha(ca.F, reta(S), 0, 1, 1500), I2 = CM.linha(ca.F, curvo(S), 0, 1, 1500);
            const r = [['pelo segmento (azul)', CM.fmt(I1, 4)], ['pelo caminho curvo (roxo)', CM.fmt(I2, 4)], ['diferença', CM.fmt(I2 - I1, 4), Math.abs(I2 - I1) > 1e-3 ? 'mau' : 'forte']];
            if (ca.pot && S.f !== 'vort') r.push(['φ(B) − φ(A)', CM.fmt(ca.pot(...S.B) - ca.pot(...S.A), 4), 'forte'], ['potencial', ca.ptx]);
            if (S.f === 'vort') r.push(Math.abs(Math.abs(I2 - I1) - 2 * PI) < 1e-2 ? 'Os caminhos passam de lados diferentes da origem: diferem em 2π, a volta completa à volta do buraco. F não é gradiente em ℝ² \\ {0}.' : 'Do mesmo lado da origem os dois integrais coincidem: localmente, F é o gradiente do ângulo θ.');
            if (S.f === 'rot') r.push('(−y; x) não é fechado (rotacional 2): o integral depende do caminho, não há potencial.');
            return r;
          });
          M.texto('<b class="t">Campos gradientes</b><p>Se F = ∇φ, então ∫_L F · dr = φ(B) − φ(A) para qualquer caminho de A a B, e ∮ F = 0 em caminhos fechados.</p><p>F fechado (∂F₂/∂x = ∂F₁/∂y) num domínio <b>simplesmente conexo</b> ⇒ F é gradiente. Em ℝ² \\ {0} isso falha: o vórtice (−y; x)/(x² + y²) é fechado e dá ∮ = 2π na circunferência unitária.</p><p>Em ℝ³: ℝ³ \\ {0} é simplesmente conexo (um laço desvia-se pelo lado), mas ℝ³ sem uma reta não é (um laço à volta da reta não se encolhe).</p>', 'nota');
          M.legenda([[cor.b, 'segmento de A a B'], [cor.n, 'caminho curvo'], [cor.r, 'singularidade (e corte de θ)']]);
        },
      },
      {
        id: 'area', nome: 'Área com Green',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.4, 2.4, -1.8, 1.8] });
          const FO = {
            elipse: { nome: 'elipse', g: (t, S) => [S.a * Math.cos(t), S.b * Math.sin(t)], ex: (S) => PI * S.a * S.b, etx: 'πab' },
            card: { nome: 'cardioide', g: (t, S) => { const r = S.a * 0.5 * (1 + Math.cos(t)); return [r * Math.cos(t), r * Math.sin(t)]; }, ex: (S) => (3 * PI * (S.a * 0.5) ** 2) / 2, etx: '3πc²/2, com c = a/2' },
            estrela: { nome: 'astroide', g: (t, S) => [S.a * Math.cos(t) ** 3, S.b * Math.sin(t) ** 3], ex: (S) => (3 * PI * S.a * S.b) / 8, etx: '3πab/8' },
          };
          M.escolha('fo', { rot: 'Curva', opcoes: Object.keys(FO).map((k) => [k, FO[k].nome]), valor: 'elipse' });
          M.barra('a', { rot: 'a', cor: cor.u, min: 0.4, max: 2.2, valor: 1.8, nome: 'a' });
          M.barra('b', { rot: 'b', cor: cor.v, min: 0.4, max: 1.6, valor: 1, nome: 'b' });
          M.barra('t', { rot: 't', cor: cor.n, min: 0, max: 2 * PI, valor: 2.2, nome: 'parâmetro', dur: 6000 });
          M.cena(P, (G, S) => {
            const f = FO[S.fo];
            G.eixos();
            G.param((t) => f.g(t, S), 0, 2 * PI, 300, { cor: cor.a, larg: 2.4 });
            const n = 60;
            for (let i = 0; i < n; i++) { const t0 = (S.t * i) / n, t1 = (S.t * (i + 1)) / n; G.poli([[0, 0], f.g(t0, S), f.g(t1, S)], { cor: cor.n, larg: 0.6, alfa: 0.9, encher: cor.n + '40' }); }
            const p = f.g(S.t, S);
            G.curva([[0, 0], p], { cor: cor.n, larg: 1.6 });
            G.ponto(p, { cor: cor.n, rot: 'g(t)' });
          });
          M.leituras('Área = ½ ∮ (x dy − y dx)', (S) => {
            const f = FO[S.fo];
            const ar = (T) => 0.5 * CM.linha((x, y) => [-y, x], (t) => f.g(t, S), 0, T, 1500);
            return [['área varrida até t', CM.fmt(ar(S.t), 4)], ['½ ∮ (x dy − y dx), volta completa', CM.fmt(ar(2 * PI), 4), 'forte'], ['valor exato: ' + f.etx, CM.fmt(f.ex(S), 4)]];
          });
          M.texto('<b class="t">Área com o teorema de Green</b><p>Escolhe-se um campo com ∂F₂/∂x − ∂F₁/∂y = 1. Então ∬_D 1 dx dy = ∮_∂D F · dr. As escolhas habituais:</p><p class="f">F = (0; x): Área = ∮ x dy;  F = (−y; 0): Área = −∮ y dx;  F = ½(−y; x): Área = ½ ∮ (x dy − y dx).</p><p>A última é a soma dos triângulos finos varridos pelo vetor posição (a roxo). Elipse: ½ ∫₀^2π (ab cos²t + ab sen²t) dt = πab.</p>', 'nota');
          M.legenda([[cor.n, 'triângulos de área ½(x dy − y dx)']]);
        },
      },
    ],
    explicar: [
      { modelo: 'green', titulo: 'Integral de linha (trabalho)', estado: { f: 'rot', c: 'circ', R: 1, t: 0.35, cx: 0, cy: 0, rotm: false }, texto: '<p>Com L descrita por g(t), t ∈ [a, b]:</p><p class="f">∫_L F · dr = ∫ₐᵇ F(g(t)) · g′(t) dt.</p><p>É o trabalho de F ao longo de L. Carrega em ▶ ao lado de t para o ver acumular.</p>' },
      { modelo: 'green', titulo: 'Green no quadrado', estado: { f: 'cubo', c: 'quad', R: 0.5, cx: 0.5, cy: 0.5, t: 1, rotm: true }, texto: '<p>Em [0, 1]², percorrendo os quatro lados, os lados verticais dão ∫₀¹ (F₂(1; t) − F₂(0; t)) dt = ∬ ∂F₂/∂x, e os horizontais −∬ ∂F₁/∂y. Somando:</p><p class="f">∮_∂D F = ∬_D (∂F₂/∂x − ∂F₁/∂y) dx dy.</p>' },
      { modelo: 'green', titulo: 'Rotacional constante', estado: { f: 'rot', c: 'circ', R: 1, cx: 0.3, cy: -0.2, t: 1, rotm: true }, texto: '<p>F = (−y; x): ∂F₂/∂x − ∂F₁/∂y = 2. Então ∮ F = 2 · área(D), seja qual for a posição da curva. Arrasta o centro.</p>' },
      { modelo: 'green', titulo: 'Campo fechado: ∮ = 0', estado: { f: 'grad', c: 'circ', R: 1, cx: 0, cy: 0, t: 1, rotm: true }, texto: '<p>F = (x + y; x + eʸ + 1): ∂F₂/∂x = 1 = ∂F₁/∂y. Em ℝ² (simplesmente conexo), F é gradiente: φ = xy + x²/2 + eʸ + y. Logo ∮ F = 0 em qualquer curva fechada.</p>' },
      { modelo: 'green', titulo: 'O vórtice', estado: { f: 'vort', c: 'circ', R: 1, cx: 0, cy: 0, t: 1, rotm: false }, texto: '<p>F = (−y; x)/(x² + y²) também é fechado fora da origem, e no entanto ∮ F = 2π na circunferência unitária.</p><p>Não contradiz Green: F não é C¹ no disco, porque não está definido em (0; 0). Afasta a curva da origem e a circulação volta a 0.</p>' },
      { modelo: 'potencial', titulo: 'Independência do caminho', estado: { f: 'grad', A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.6], mapa: true }, texto: '<p>Para um campo gradiente, ∫_L F · dr = φ(B) − φ(A): os dois caminhos dão o mesmo, para qualquer C.</p>' },
      { modelo: 'potencial', titulo: 'ℝ² \\ {0} não é simplesmente conexo', estado: { f: 'vort', A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.7], mapa: true }, texto: '<p>No vórtice, com os caminhos de lados opostos da origem, os integrais diferem em 2π. Do mesmo lado, coincidem: localmente F = ∇θ.</p><p>O ângulo θ salta 2π na semirreta a vermelho: não há um potencial em todo o ℝ² \\ {0}.</p>' },
      { modelo: 'area', titulo: 'Área com Green', estado: { fo: 'elipse', a: 1.8, b: 1, t: 2.2 }, texto: '<p>Com F = ½(−y; x), o rotacional é 1, e Green dá Área(D) = ½ ∮ (x dy − y dx).</p><p>Para a elipse (a cos t; b sen t): ½ ∫₀^2π ab dt = πab.</p>' },
    ],
    testa: [
      { modelo: 'green', estado: { f: 'rot', c: 'circ', R: 1, cx: 0, cy: 0, t: 1 }, p: '∮ (−y; x) · dr na circunferência unitária, sentido positivo:', op: ['0', 'π', '2π', '4π'], certa: 2, porque: 'Rotacional 2 e área π: 2π. Direto: ∫₀^2π (sen²t + cos²t) dt = 2π.' },
      { modelo: 'green', estado: { f: 'vort', c: 'circ', R: 0.6, cx: 1.2, cy: 0.4, t: 1 }, p: 'Vórtice (−y; x)/(x² + y²), circunferência que <b>não</b> rodeia a origem:', op: ['2π', '0', '−2π', 'Não está definido'], certa: 1, porque: 'Aí F é C¹ no disco e fechado, por isso Green dá 0.' },
      { modelo: 'potencial', estado: { f: 'grad', mapa: true }, p: 'Potencial de F = (x + y; x + eʸ + 1):', op: ['xy + x²/2 + eʸ + y', 'x²/2 + eʸ', 'xy + eʸ', 'Não tem'], certa: 0, porque: '∂φ/∂x = y + x e ∂φ/∂y = x + eʸ + 1. Confirma derivando.' },
      { p: 'Qual destes conjuntos é simplesmente conexo?', op: ['ℝ² \\ {(0; 0)}', 'ℝ³ \\ {(0; 0; 0)}', 'ℝ³ sem o eixo dos z', 'um anel em ℝ²'], certa: 1, porque: 'Em ℝ³, um laço à volta de um ponto pode deslizar para o lado e encolher. À volta de uma reta ou de um buraco no plano, não.' },
      { modelo: 'area', estado: { fo: 'elipse' }, p: 'Que integral de linha dá a área de D?', op: ['∮ (x dx + y dy)', '½ ∮ (x dy − y dx)', '∮ (y dx)', '∮ (x dx − y dy)'], certa: 1, porque: 'F = ½(−y; x) tem ∂F₂/∂x − ∂F₁/∂y = ½ + ½ = 1.' },
    ],
  });
})();
