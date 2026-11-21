/* 4. Linhas, vetor tangente, gradiente, linhas e superfícies de nível, plano tangente. */
(function () {
  const OURO = '#D9A21B';
  CDI.materia({
    id: 'gradiente', ordem: 4, grupo: 'Cálculo diferencial', curto: 'Linhas e gradiente', titulo: 'Linhas, gradiente e plano tangente', paginas: 'pp. 18–24',
    resumo: 'Caminhos e vetor tangente; o gradiente é perpendicular às linhas e superfícies de nível.',
    modelos: [
      {
        id: 'linhas', nome: 'Linhas e vetor tangente',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2, 2, -1.6, 2.2] });
          M.S.A = [-1, -0.5]; M.S.B = [1.2, 1.4];
          const CU = {
            circ: { nome: '(r cos t; r sen t)', g: (t, S) => [S.r * Math.cos(t), S.r * Math.sin(t)], d: (t, S) => [-S.r * Math.sin(t), S.r * Math.cos(t)], t: [0, 2 * Math.PI], dg: "g′(t) = (−r sen t; r cos t)" },
            parab: { nome: '(t; t²)', g: (t) => [t, t * t], d: (t) => [1, 2 * t], t: [-1.4, 1.4], dg: "g′(t) = (1; 2t)" },
            seg: { nome: 'A + t(B − A)', g: (t, S) => CM.add(S.A, CM.mul(CM.sub(S.B, S.A), t)), d: (t, S) => CM.sub(S.B, S.A), t: [0, 1], dg: "g′(t) = B − A (constante)" },
          };
          M.escolha('c', { rot: 'g(t)', opcoes: Object.keys(CU).map((k) => [k, CU[k].nome]), valor: 'circ', mono: true, aoMudar: (k) => { M.S.t = k === 'circ' ? Math.PI / 2 : k === 'parab' ? 0.6 : 0.3; } });
          M.barra('t', { rot: 't', cor: cor.n, min: 0, max: 2 * Math.PI, valor: Math.PI / 2, nome: 'parâmetro t', dur: 6000 });
          M.barra('r', { rot: 'r', cor: cor.u, min: 0.3, max: 1.8, valor: 1, nome: 'raio' });
          M.caixa('reta', { rot: 'Reta tangente', valor: true });
          M.botoes([['Exemplo da aula: (0; 1) na circunferência', () => M.definir({ c: 'circ', r: 1, t: Math.PI / 2, reta: true })]]);
          M.sync.unshift(() => { const c = CU[M.S.c], b = M.ctl.querySelector('input[aria-label="parâmetro t"]'); if (b) { b.min = c.t[0]; b.max = c.t[1]; } M.S.t = CM.clamp(M.S.t, c.t[0], c.t[1]); });
          M.cena(P, (G, S) => {
            const c = CU[S.c];
            G.eixos();
            G.param((t) => c.g(t, S), c.t[0], c.t[1], 240, { cor: cor.n, larg: 2.6 });
            const p = c.g(S.t, S), v = c.d(S.t, S);
            if (S.reta) G.curva([CM.add(p, CM.mul(v, -5)), CM.add(p, CM.mul(v, 5))], { cor: OURO, larg: 1.8, trac: [7, 5] });
            G.seta(p, CM.mul(v, 0.5), { cor: cor.u, rot: "g′(t)" });
            if (S.c === 'seg') { G.ponto(S.A, { cor: cor.v, rot: 'A = g(0)', arr: (x, y) => M.definir({ A: [x, y] }) }); G.ponto(S.B, { cor: cor.v, rot: 'B = g(1)', arr: (x, y) => M.definir({ B: [x, y] }) }); }
            G.ponto(p, { cor: cor.n, rot: 'g(t)' });
          });
          M.leituras('No instante t', (S) => {
            const c = CU[S.c], p = c.g(S.t, S), v = c.d(S.t, S);
            return [['g(t)', CM.pt(p)], [c.dg, CM.pt(v)], ['‖g′(t)‖ (rapidez)', CM.fmt(Math.hypot(...v), 3)], ['Reta tangente', `x = ${CM.pt(p)} + λ${CM.pt(v)}, λ ∈ ℝ`]];
          });
          M.texto('<b class="t">Linhas</b><p>Uma linha é a imagem de uma função contínua de uma variável, g : ℝ → ℝⁿ (um caminho). Se g é diferenciável,</p><p class="f">g′(t) = lim h→0 [g(t + h) − g(t)]/h</p><p>é um vetor tangente à linha no ponto g(t). A reta tangente é x = g(t₀) + λ g′(t₀).</p><p>Exemplo das teóricas: circunferência de raio 1 centrada em (0; 0), no ponto (0; 1) = g(π/2). g′(π/2) = (−1; 0), e a reta tangente é (x; y − 1) = λ(−1; 0), ou seja, y = 1.</p>', 'nota');
          M.legenda([[cor.n, 'linha descrita por g'], [cor.u, 'vetor tangente g′(t)'], [OURO, 'reta tangente']]);
        },
      },
      {
        id: 'nivel', nome: 'Gradiente e linhas de nível',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2, 2, -2, 2] });
          M.S.p = [0.8, 0.6];
          const FN = {
            circ: { nome: 'x² + y²', f: (x, y) => x * x + y * y },
            elip: { nome: 'x² + 4y²', f: (x, y) => x * x + 4 * y * y },
            sela: { nome: 'x² − y²', f: (x, y) => x * x - y * y },
            xy: { nome: 'xy', f: (x, y) => x * y },
            ondas: { nome: 'sen x + cos y', f: (x, y) => Math.sin(x) + Math.cos(y) },
          };
          M.escolha('f', { rot: 'f(x; y)', opcoes: Object.keys(FN).map((k) => [k, FN[k].nome]), valor: 'elip', mono: true });
          M.barra('th', { rot: 'θ', cor: cor.b, min: 0, max: 2 * Math.PI, valor: 0.3, fmt: CM.graus, circular: true, nome: 'direção v', dur: 7000 });
          M.caixa('mapa', { rot: 'Cores por valor de f', valor: true });
          M.cena(P, (G, S) => {
            const f = FN[S.f].f;
            const [x0, x1, y0, y1] = G.limites();
            const vs = []; for (let i = 0; i < 25; i++) vs.push(f(x0 + ((x1 - x0) * (i % 5)) / 4, y0 + ((y1 - y0) * Math.floor(i / 5)) / 4));
            const lo = Math.min(...vs), hi = Math.max(...vs);
            if (S.mapa) {
              const a = hexRgb(cor.sup), b = hexRgb(cor.u);
              G.mapa((x, y) => { const t = CM.clamp((f(x, y) - lo) / (hi - lo || 1), 0, 1); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, 60]; }, 4);
            }
            G.eixos();
            for (let i = 1; i < 14; i++) G.nivel(f, lo + ((hi - lo) * i) / 14, { cor: cor.m, larg: 1, alfa: 0.55 });
            const c = f(...S.p);
            G.nivel(f, c, { cor: cor.n, larg: 2.4 });
            const gr = CM.grad(f, ...S.p), gn = Math.hypot(...gr);
            const v = [Math.cos(S.th), Math.sin(S.th)];
            if (gn > 1e-6) {
              const t = [-gr[1] / gn, gr[0] / gn];
              G.curva([CM.add(S.p, CM.mul(t, -3)), CM.add(S.p, CM.mul(t, 3))], { cor: OURO, larg: 1.6, trac: [7, 5] });
              G.seta(S.p, CM.mul(gr, 0.7 / Math.max(1, gn)), { cor: cor.v, rot: '∇f(P)' });
            }
            G.seta(S.p, CM.mul(v, 0.6), { cor: cor.b, rot: 'v' });
            G.ponto(S.p, { cor: cor.i, rot: 'P', arr: (x, y) => M.definir({ p: [x, y] }) });
          });
          M.leituras('Em P', (S) => {
            const f = FN[S.f].f, gr = CM.grad(f, ...S.p), gn = Math.hypot(...gr), v = [Math.cos(S.th), Math.sin(S.th)];
            const r = [['P', CM.pt(S.p)], ['f(P) = c', CM.fmt(f(...S.p), 3)], ['∇f(P)', CM.pt(gr, 3)], ['‖∇f(P)‖', CM.fmt(gn, 3)], '—', ['∂f/∂v(P) = ∇f(P) · v', CM.fmt(CM.dot(gr, v), 3), 'forte']];
            if (gn > 1e-6) r.push(['ângulo entre v e ∇f', CM.graus(Math.acos(CM.clamp(CM.dot(gr, v) / gn, -1, 1)))]);
            r.push(gn < 1e-6 ? '∇f(P) = 0: P é ponto crítico, todas as derivadas direcionais são 0.' : 'A derivada direcional é máxima com v na direção de ∇f (vale ‖∇f‖), mínima na direção oposta e nula na direção da linha de nível.');
            return r;
          });
          M.texto('<b class="t">Gradiente</b><p class="f">∇f(a) = (∂f/∂x₁(a); …; ∂f/∂xₙ(a))</p><p>É a linha da Jacobiana de f : ℝⁿ → ℝ escrita como vetor. Teorema: ∇f(a) é normal ao conjunto de nível {x : f(x) = c} que passa por a.</p><p>Porquê: se g(t) anda sobre o nível, f(g(t)) = c e, pela regra da cadeia, ∇f(g(t)) · g′(t) = 0. O gradiente é perpendicular a todos os vetores tangentes.</p>', 'nota');
          M.legenda([[cor.n, 'linha de nível f = f(P)'], [cor.v, '∇f(P)'], [OURO, 'tangente à linha de nível'], [cor.b, 'direção v']]);
        },
      },
      {
        id: 'plano', nome: 'Plano tangente a uma superfície de nível',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7 });
          const SU = {
            esf: { nome: 'x² + y² + z² = 1', F: (p) => p[0] ** 2 + p[1] ** 2 + p[2] ** 2 - 1, g: (u, v) => [Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v)], v: [0, Math.PI], gr: (p) => [2 * p[0], 2 * p[1], 2 * p[2]], gt: '(2x; 2y; 2z)' },
            elip: { nome: 'x² + 2y² + 4z² = 2', F: (p) => p[0] ** 2 + 2 * p[1] ** 2 + 4 * p[2] ** 2 - 2, g: (u, v) => [Math.SQRT2 * Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), (Math.SQRT2 / 2) * Math.cos(v)], v: [0, Math.PI], gr: (p) => [2 * p[0], 4 * p[1], 8 * p[2]], gt: '(2x; 4y; 8z)' },
            hip: { nome: 'x² + y² − z² = 1', F: (p) => p[0] ** 2 + p[1] ** 2 - p[2] ** 2 - 1, g: (u, v) => [Math.cosh(v) * Math.cos(u), Math.cosh(v) * Math.sin(u), Math.sinh(v)], v: [-1, 1], gr: (p) => [2 * p[0], 2 * p[1], -2 * p[2]], gt: '(2x; 2y; −2z)' },
          };
          M.escolha('s', { rot: 'Superfície F(x; y; z) = 0', opcoes: Object.keys(SU).map((k) => [k, SU[k].nome]), valor: 'esf', mono: true, aoMudar: (k) => { M.S.v = k === 'hip' ? 0.4 : 0.7; } });
          M.barra('u', { rot: 'θ', cor: cor.u, min: 0, max: 2 * Math.PI, valor: 0.6, fmt: CM.graus, circular: true, nome: 'longitude' });
          M.barra('v', { rot: 'φ', cor: cor.v, min: 0, max: Math.PI, valor: 0.7, fmt: (x) => CM.fmt(x, 2), nome: 'segundo parâmetro' });
          M.caixa('normal', { rot: 'Reta normal', valor: true });
          M.botoes([['Exemplo da aula: (0; 0; 1)', () => M.definir({ s: 'esf', v: 0, u: 0 })]]);
          M.sync.unshift(() => { const s = SU[M.S.s], b = M.ctl.querySelector('input[aria-label="segundo parâmetro"]'); if (b) { b.min = s.v[0]; b.max = s.v[1]; } M.S.v = CM.clamp(M.S.v, s.v[0], s.v[1]); });
          M.cena(V, (C, S) => {
            const s = SU[S.s];
            C.eixos({ x: [-1.6, 1.6], y: [-1.6, 1.6], z: [-1.4, 1.6] });
            C.sup(s.g, 0, 2 * Math.PI, s.v[0], s.v[1], 40, 22, { cor: cor.sup, corTras: cor.sup, alfa: 0.6 });
            const P = s.g(S.u, S.v), N = s.gr(P);
            C.plano(P, N, 0.65, { cor: OURO, alfa: 0.32 });
            if (S.normal) C.linha(CM.sub(P, CM.mul(CM.nrm(N), 0.9)), CM.add(P, CM.mul(CM.nrm(N), 0.9)), { cor: cor.n, larg: 1.4, trac: [5, 4] });
            C.seta(P, CM.mul(CM.nrm(N), 0.6), { cor: cor.v, rot: '∇F(P)', vies: 0.08 });
            C.ponto(P, { cor: cor.i, rot: 'P' });
          });
          M.leituras('Em P', (S) => {
            const s = SU[S.s], P = s.g(S.u, S.v), N = s.gr(P);
            const d = CM.dot(N, P);
            const termo = (c, n, prim) => (Math.abs(c) < 5e-4 ? '' : (c < 0 ? ' − ' : prim ? '' : ' + ') + (Math.abs(Math.abs(c) - 1) < 5e-4 ? '' : CM.fmtC(Math.abs(c))) + n);
            let eq = termo(N[0], 'x', true); eq += termo(N[1], 'y', !eq); eq += termo(N[2], 'z', !eq);
            return [['P', CM.ptC(P)], ['F(P)', CM.fmt(s.F(P), 4)], ['∇F = ' + s.gt, CM.ptC(N)], '—', ['Plano tangente ∇F(P)·(X − P) = 0', (eq || '0') + ' = ' + CM.fmtC(d), 'forte'], ['Reta normal', `X = ${CM.ptC(P)} + λ${CM.ptC(N)}`]];
          });
          M.texto('<b class="t">Plano tangente a {F = 0}</b><p>Como ∇F(P) é normal à superfície de nível, o plano tangente em P é</p><p class="f">∇F(P) · (X − P) = 0</p><p>e a reta normal é X = P + λ∇F(P). Exemplo das teóricas: F = x² + y² + z² − 1 em P = (0; 0; 1). ∇F(P) = (0; 0; 2), e (x; y; z − 1)·(0; 0; 2) = 0 dá o plano z = 1.</p>', 'nota');
          M.legenda([[cor.v, '∇F(P)'], [OURO, 'plano tangente'], [cor.n, 'reta normal']]);
        },
      },
    ],
    explicar: [
      { modelo: 'linhas', titulo: 'Uma linha é a imagem de um caminho', estado: { c: 'parab', t: 0.6, reta: false }, texto: '<p>g(t) = (t; t²) é uma função contínua ℝ → ℝ². A linha é a sua imagem: a parábola y = x².</p><p>t funciona como «tempo»: carrega em ▶ ao lado de t para ver o ponto a percorrer a linha.</p>' },
      { modelo: 'linhas', titulo: 'Vetor tangente', estado: { c: 'circ', r: 1, t: Math.PI / 2, reta: true }, texto: '<p>g(t) = (cos t; sen t) ⇒ g′(t) = (−sen t; cos t). Em t = π/2: g = (0; 1) e g′ = (−1; 0).</p><p>Reta tangente: (x; y − 1) = λ(−1; 0), isto é, <b>y = 1</b>.</p>' },
      { modelo: 'linhas', titulo: 'O segmento de A a B', estado: { c: 'seg', t: 0.3, A: [-1, -0.5], B: [1.2, 1.4], reta: true }, texto: '<p>g(t) = A + t(B − A): g(0) = A, g(1) = B, e g′(t) = B − A é constante.</p><p>Arrasta A e B em «Mexer nos controlos» (ou no próprio desenho).</p>' },
      { modelo: 'nivel', titulo: 'Gradiente ⟂ linhas de nível', estado: { f: 'elip', p: [0.8, 0.6], th: 0.3, mapa: true }, texto: '<p>A linha roxa é a linha de nível f = f(P). O gradiente (verde) é-lhe perpendicular.</p><p>Se g(t) anda na linha, f(g(t)) = c; derivando, ∇f(g(t)) · g′(t) = 0.</p>' },
      { modelo: 'nivel', titulo: 'Direção de maior crescimento', estado: { f: 'elip', p: [0.8, 0.6], th: 0.97 }, texto: '<p>∂f/∂v(P) = ∇f(P) · v = ‖∇f(P)‖ cos(ângulo). É máxima quando v aponta como ∇f e vale ‖∇f(P)‖.</p><p>Roda θ para ver a derivada direcional variar entre −‖∇f‖ e ‖∇f‖, passando por 0 na direção da linha de nível.</p>' },
      { modelo: 'plano', titulo: 'Plano tangente à esfera', estado: { s: 'esf', v: 0, u: 0, normal: true }, vista: [0.7, 0.35], texto: '<p>Esfera x² + y² + z² = 1 como nível de F = x² + y² + z² − 1. Em P = (0; 0; 1), ∇F = (0; 0; 2).</p><p>Plano: (x; y; z − 1)·(0; 0; 2) = 0 ⇔ <b>z = 1</b>. Reta normal: o eixo dos z.</p>' },
      { modelo: 'plano', titulo: 'Noutro ponto', estado: { s: 'hip', v: 0.4, u: 0.8, normal: true }, texto: '<p>Funciona em qualquer superfície de nível com ∇F(P) ≠ 0. No hiperboloide x² + y² − z² = 1, ∇F = (2x; 2y; −2z).</p>' },
    ],
    testa: [
      { modelo: 'linhas', estado: { c: 'circ', r: 1, t: Math.PI / 2, reta: true }, p: 'Reta tangente à circunferência x² + y² = 1 no ponto (0; 1):', op: ['x = 1', 'y = 1', 'y = x + 1', 'x = 0'], certa: 1, porque: 'Com g(t) = (cos t; sen t), (0; 1) = g(π/2) e g′(π/2) = (−1; 0), horizontal.' },
      { modelo: 'plano', estado: { s: 'esf', u: 0, v: 0 }, p: 'Plano tangente a x² + y² + z² = 1 em (0; 0; 1):', op: ['z = 0', 'x + y + z = 1', 'z = 1', 'z = 2'], certa: 2, porque: '∇F(0; 0; 1) = (0; 0; 2), e (x − 0; y − 0; z − 1)·(0; 0; 2) = 0 ⇔ z = 1.' },
      { modelo: 'nivel', estado: { f: 'circ', p: [1, 1], th: 0.785 }, p: 'Em que direção cresce f mais depressa a partir de P?', op: ['Na direção da linha de nível', 'Na direção de ∇f(P)', 'Na direção de −∇f(P)', 'Em todas por igual'], certa: 1, porque: '∂f/∂v = ∇f · v = ‖∇f‖ cos α, máximo para α = 0. A taxa máxima é ‖∇f(P)‖.' },
      { p: 'f : ℝ³ → ℝ diferenciável, c constante, ∇f(a) ≠ 0. ∇f(a) é:', op: ['tangente ao nível {f = c} que passa por a', 'normal ao nível {f = c} que passa por a', 'sempre (0; 0; 1)', 'paralelo ao eixo x'], certa: 1, porque: 'Para qualquer caminho g no nível com g(0) = a: f(g(t)) = c ⇒ ∇f(a) · g′(0) = 0.' },
    ],
  });
})();
