/* 8. Integrais duplos e triplos: Fubini, cortes, ordens de integração. */
(function () {
  const OURO = '#D9A21B';
  const sq = (x) => Math.sqrt(Math.max(0, x));
  /* regiões do tipo I (y entre c(x) e d(x)) e II (x entre a(y) e b(y)), cada uma com as duas ordens */
  const RG = {
    aula: {
      nome: 'x² + y² ≤ 2, y ≥ x²', dentro: (x, y) => x * x + y * y <= 2 && y >= x * x, j: [-1.8, 1.8, -0.4, 1.7],
      x: [-1, 1], c: (x) => x * x, d: (x) => sq(2 - x * x), lim1: '∫₋₁¹ ∫ₓ²^√(2−x²) 1 dy dx',
      y: [0, Math.SQRT2], a: (y) => (y <= 1 ? -sq(y) : -sq(2 - y * y)), b: (y) => (y <= 1 ? sq(y) : sq(2 - y * y)), lim2: '∫₀¹ ∫₋√y^√y 1 dx dy + ∫₁^√2 ∫₋√(2−y²)^√(2−y²) 1 dx dy',
      exato: Math.PI / 2 + 1 / 3, exTxt: 'π/2 + 1/3',
      conta: '∫₋₁¹ (√(2 − x²) − x²) dx. Com x = √2 sen u: ∫ √(2 − x²) dx = x√(2 − x²)/2 + arcsen(x/√2), que entre −1 e 1 dá 1 + π/2. E ∫₋₁¹ x² dx = 2/3. Área = π/2 + 1/3 ≈ 1.904.',
      bordas: [{ g: (t) => [t, t * t], t: [-1, 1] }, { g: (t) => [Math.SQRT2 * Math.cos(t), Math.SQRT2 * Math.sin(t)], t: [Math.PI / 4, (3 * Math.PI) / 4] }],
    },
    tri: {
      nome: '0 ≤ y ≤ x ≤ 1', dentro: (x, y) => y >= 0 && y <= x && x <= 1, j: [-0.3, 1.3, -0.3, 1.2],
      x: [0, 1], c: () => 0, d: (x) => x, lim1: '∫₀¹ ∫₀ˣ 1 dy dx',
      y: [0, 1], a: (y) => y, b: () => 1, lim2: '∫₀¹ ∫ᵧ¹ 1 dx dy',
      exato: 0.5, exTxt: '1/2', conta: '∫₀¹ x dx = 1/2. Pela outra ordem: ∫₀¹ (1 − y) dy = 1/2.',
      bordas: [{ g: (t) => [t, 0], t: [0, 1] }, { g: (t) => [1, t], t: [0, 1] }, { g: (t) => [t, t], t: [0, 1] }],
    },
    entre: {
      nome: 'x² ≤ y ≤ x', dentro: (x, y) => y >= x * x && y <= x, j: [-0.3, 1.3, -0.3, 1.2],
      x: [0, 1], c: (x) => x * x, d: (x) => x, lim1: '∫₀¹ ∫ₓ²ˣ 1 dy dx',
      y: [0, 1], a: (y) => y, b: (y) => sq(y), lim2: '∫₀¹ ∫ᵧ^√y 1 dx dy',
      exato: 1 / 6, exTxt: '1/6', conta: '∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6.',
      bordas: [{ g: (t) => [t, t * t], t: [0, 1] }, { g: (t) => [t, t], t: [0, 1] }],
    },
    disco: {
      nome: 'x² + y² ≤ 1', dentro: (x, y) => x * x + y * y <= 1, j: [-1.5, 1.5, -1.3, 1.3],
      x: [-1, 1], c: (x) => -sq(1 - x * x), d: (x) => sq(1 - x * x), lim1: '∫₋₁¹ ∫₋√(1−x²)^√(1−x²) 1 dy dx',
      y: [-1, 1], a: (y) => -sq(1 - y * y), b: (y) => sq(1 - y * y), lim2: '∫₋₁¹ ∫₋√(1−y²)^√(1−y²) 1 dx dy',
      exato: Math.PI, exTxt: 'π', conta: '2∫₋₁¹ √(1 − x²) dx = π. A primitiva é difícil: em polares é imediato (ver «Mudança de variáveis»).',
      bordas: [{ g: (t) => [Math.cos(t), Math.sin(t)], t: [0, 2 * Math.PI] }],
    },
  };

  /* sólidos para os cortes em ℝ³ */
  const SO = {
    aula: {
      nome: '0 ≤ x, y ≤ 1, 0 ≤ z ≤ x + y', vol: 1, volTxt: '1', zmax: 2,
      sec: (z) => { // polígono do corte z = c no quadrado [0,1]² com x + y ≥ z
        if (z <= 1) return [[z, 0], [1, 0], [1, 1], [0, 1], [0, z]];
        return [[z - 1, 1], [1, 1], [1, z - 1]];
      },
      A: (z) => (z <= 1 ? 1 - (z * z) / 2 : ((2 - z) ** 2) / 2),
      Atxt: (z) => (z <= 1 ? 'A(z) = 1 − z²/2  (0 ≤ z ≤ 1: o quadrado menos o triângulo x + y &lt; z)' : 'A(z) = (2 − z)²/2  (1 ≤ z ≤ 2: só o triângulo x + y ≥ z)'),
      desenhar(C, cor) {
        C.grafico((x, y) => x + y, 0, 1, 0, 1, 8, { cor: cor.sup, alfa: 0.55 });
        C.sup((x, z) => [x, 0, z], 0, 1, 0, 1, 6, 6, { cor: cor.sup, alfa: 0.25 });
        C.poli([[0, 0, 0], [1, 0, 0], [1, 0, 1]], { cor: cor.sup, alfa: 0.35 });
        C.poli([[0, 0, 0], [0, 1, 0], [0, 1, 1]], { cor: cor.sup, alfa: 0.35 });
        C.poli([[1, 0, 0], [1, 1, 0], [1, 1, 2], [1, 0, 1]], { cor: cor.sup, alfa: 0.35 });
        C.poli([[0, 1, 0], [1, 1, 0], [1, 1, 2], [0, 1, 1]], { cor: cor.sup, alfa: 0.35 });
        C.poli([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]], { cor: cor.sup, alfa: 0.2 });
      },
      ordens: [
        ['dz dy dx', '∫₀¹ ∫₀¹ ∫₀^(x+y) dz dy dx'],
        ['dz dx dy', '∫₀¹ ∫₀¹ ∫₀^(x+y) dz dx dy'],
        ['dx dy dz', '∫₀¹ ∫₀¹ ∫_max(0, z−y)^1 dx dy dz + ∫₁² ∫_(z−1)^1 ∫_(z−y)^1 dx dy dz'],
        ['dy dx dz', '∫₀¹ ∫₀¹ ∫_max(0, z−x)^1 dy dx dz + ∫₁² ∫_(z−1)^1 ∫_(z−x)^1 dy dx dz'],
        ['dx dz dy', '∫₀¹ ∫₀^(1+y) ∫_max(0, z−y)^1 dx dz dy'],
        ['dy dz dx', '∫₀¹ ∫₀^(1+x) ∫_max(0, z−x)^1 dy dz dx'],
      ],
    },
    tetra: {
      nome: 'x, y, z ≥ 0, x + y + z ≤ 1', vol: 1 / 6, volTxt: '1/6', zmax: 1,
      sec: (z) => [[0, 0], [1 - z, 0], [0, 1 - z]],
      A: (z) => ((1 - z) ** 2) / 2, Atxt: () => 'A(z) = (1 − z)²/2 (triângulo de catetos 1 − z)',
      desenhar(C, cor) {
        const O = [0, 0, 0], X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
        [[O, X, Y], [O, X, Z], [O, Y, Z], [X, Y, Z]].forEach((t, i) => C.poli(t, { cor: cor.sup, alfa: i === 3 ? 0.5 : 0.25 }));
      },
      ordens: [['dz dy dx', '∫₀¹ ∫₀^(1−x) ∫₀^(1−x−y) dz dy dx'], ['dx dy dz', '∫₀¹ ∫₀^(1−z) ∫₀^(1−y−z) dx dy dz'], ['…', 'as seis ordens têm a mesma forma, por simetria']],
    },
    caixa: {
      nome: '[0, 1] × [0, 1.5] × [0, 0.8]', vol: 1.2, volTxt: '(b − a)(d − c)(f − e) = 1 · 1.5 · 0.8 = 1.2', zmax: 0.8,
      sec: () => [[0, 0], [1, 0], [1, 1.5], [0, 1.5]],
      A: () => 1.5, Atxt: () => 'A(z) = (b − a)(d − c) = 1.5, igual para todos os z',
      desenhar(C, cor) { C.caixa([0, 0, 0], [1, 1.5, 0.8], { cor: cor.sup, alfa: 0.28 }); },
      ordens: [['dx dy dz', '∫ₑᶠ ∫_c^d ∫ₐᵇ 1 dx dy dz'], ['…', 'num intervalo os limites são todos constantes: as 3! = 6 ordens dão o mesmo, sem mexer nos limites']],
    },
  };

  CDI.materia({
    id: 'integrais', ordem: 8, grupo: 'Cálculo integral', curto: 'Integrais múltiplos', titulo: 'Integrais duplos e triplos', paginas: 'pp. 35–41',
    resumo: 'Área e volume como integrais iterados, cortes, trocar a ordem e somas de Riemann.',
    modelos: [
      {
        id: 'duplo', nome: 'Integral duplo (cortes)',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: RG.aula.j });
          M.escolha('r', { rot: 'Região', opcoes: Object.keys(RG).map((k) => [k, RG[k].nome]), valor: 'aula', mono: true, aoMudar: (k) => P.janela(RG[k].j) });
          M.escolha('o', { rot: 'Ordem', opcoes: [['yx', 'dy dx (corte com x fixo)'], ['xy', 'dx dy (corte com y fixo)']], valor: 'yx' });
          M.barra('u', { rot: 'corte', cor: cor.u, min: 0, max: 1, valor: 0.35, nome: 'posição do corte', dur: 6000, fmt: (x) => CM.fmt(x, 2) });
          M.caixa('acum', { rot: 'Área acumulada até ao corte', valor: true });
          M.caixa('riem', { rot: 'Soma de Riemann', valor: false });
          M.barra('n', { rot: 'n', cor: cor.n, min: 2, max: 60, passo: 1, valor: 8, fmt: (x) => String(Math.round(x)), nome: 'divisões da grelha' });
          const pos = (S) => { const R = RG[S.r]; return S.o === 'yx' ? R.x[0] + (R.x[1] - R.x[0]) * S.u : R.y[0] + (R.y[1] - R.y[0]) * S.u; };
          M.cena(P, (G, S) => {
            const R = RG[S.r];
            G.eixos();
            G.regiao(R.dentro, cor.sup, 0.18);
            if (S.riem) {
              const n = Math.round(S.n), [x0, x1, y0, y1] = [R.x[0], R.x[1], Math.min(R.y[0], ...[0, 1, 2, 3, 4].map((i) => R.c(R.x[0] + ((R.x[1] - R.x[0]) * i) / 4))), R.y[1]];
              const hx = (x1 - x0) / n, hy = (y1 - y0) / n;
              for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
                const cx = x0 + (i + 0.5) * hx, cy = y0 + (j + 0.5) * hy;
                if (R.dentro(cx, cy)) G.poli([[x0 + i * hx, y0 + j * hy], [x0 + (i + 1) * hx, y0 + j * hy], [x0 + (i + 1) * hx, y0 + (j + 1) * hy], [x0 + i * hx, y0 + (j + 1) * hy]], { cor: cor.n, larg: 0.8, encher: cor.n + '33' });
              }
            }
            const t = pos(S);
            if (S.acum) {
              if (S.o === 'yx') G.regiao((x, y) => x <= t && R.dentro(x, y), cor.u, 0.22);
              else G.regiao((x, y) => y <= t && R.dentro(x, y), cor.u, 0.22);
            }
            R.bordas.forEach((b) => G.param(b.g, b.t[0], b.t[1], 120, { cor: cor.a, larg: 2.4 }));
            if (S.o === 'yx') {
              const lo = R.c(t), hi = R.d(t);
              G.curva([[t, lo], [t, hi]], { cor: cor.u, larg: 4 });
              G.ponto([t, lo], { cor: cor.u, r: 4, rot: 'c(x)', dx: 26, dy: 6 });
              G.ponto([t, hi], { cor: cor.u, r: 4, rot: 'd(x)', dx: 26, dy: -6 });
            } else {
              const lo = R.a(t), hi = R.b(t);
              G.curva([[lo, t], [hi, t]], { cor: cor.u, larg: 4 });
              G.ponto([lo, t], { cor: cor.u, r: 4, rot: 'a(y)', dx: -10, dy: -14 });
              G.ponto([hi, t], { cor: cor.u, r: 4, rot: 'b(y)', dx: 10, dy: -14 });
            }
          });
          M.leituras('Área', (S) => {
            const R = RG[S.r], t = pos(S);
            const acum = S.o === 'yx' ? CM.simpson((x) => Math.max(0, R.d(x) - R.c(x)), R.x[0], t, 300) : CM.simpson((y) => Math.max(0, R.b(y) - R.a(y)), R.y[0], t, 300);
            const r = [[S.o === 'yx' ? 'x fixo' : 'y fixo', CM.fmt(t, 3)], [S.o === 'yx' ? 'comprimento d(x) − c(x)' : 'comprimento b(y) − a(y)', CM.fmt(S.o === 'yx' ? R.d(t) - R.c(t) : R.b(t) - R.a(t), 3)], ['área acumulada até ao corte', CM.fmt(acum, 4)], '—', ['dy dx', R.lim1], ['dx dy', R.lim2], ['Vol₂(A) exato', R.exTxt + ' ≈ ' + CM.fmt(R.exato, 4), 'forte']];
            if (S.riem) { const n = Math.round(S.n); const y0 = Math.min(R.y[0], R.c(R.x[0]), R.c((R.x[0] + R.x[1]) / 2)); r.push(['soma de Riemann, n = ' + n, CM.fmt(CM.riemann(R.dentro, () => 1, R.x[0], R.x[1], y0, R.y[1], n), 4)]); }
            return r;
          });
          M.texto((S) => '<b class="t">Conta</b>' + RG[S.r].conta, 'chave');
          M.texto('<b class="t">Integral duplo como soma de cortes</b><p>A área entre c(x) e d(x) para a ≤ x ≤ b é a «soma» dos comprimentos dos cortes:</p><p class="f">Vol₂(A) = ∫ₐᵇ (d(x) − c(x)) dx = ∫ₐᵇ ∫_c(x)^d(x) 1 dy dx.</p><p>Trocar a ordem dá o mesmo valor (teorema de Fubini, f contínua), mas os <b>limites mudam</b>: na região da aula, com y fixo é preciso partir o integral em y = 1.</p>', 'nota');
          M.legenda([[cor.sup, 'região A'], [cor.u, 'corte e área acumulada'], [cor.n, 'retângulos da soma de Riemann']]);
        },
      },
      {
        id: 'triplo', nome: 'Integral triplo (cortes em z)',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7, alvo: [0.5, 0.6, 0.7], yaw: 0.9, pitch: 0.38 });
          const G = M.plano({ janela: [-0.15, 2.2, -0.1, 1.7], livre: true, dica: 'Área do corte A(z): o volume é a área debaixo da curva' });
          M.escolha('s', { rot: 'Sólido', opcoes: Object.keys(SO).map((k) => [k, SO[k].nome]), valor: 'aula', mono: true, aoMudar: (k) => (M.S.z = Math.min(M.S.z, SO[k].zmax * 0.98)) });
          M.barra('z', { rot: 'z', cor: cor.u, min: 0, max: 2, valor: 0.6, nome: 'altura do corte', dur: 6000 });
          M.sync.unshift(() => { const s = SO[M.S.s], b = M.ctl.querySelector('input[aria-label="altura do corte"]'); if (b) b.max = s.zmax; M.S.z = Math.min(M.S.z, s.zmax); });
          M.cena(V, (C, S) => {
            const so = SO[S.s];
            C.eixos({ x: [0, 1.5], y: [0, 1.9], z: [0, 2.3] });
            so.desenhar(C, cor);
            const pol = so.sec(Math.min(S.z, so.zmax - 1e-6));
            if (pol.length > 2) C.poli(pol.map((p) => [p[0], p[1], S.z]), { cor: cor.u, alfa: 0.7, plano: 1, vies: 0.02 });
            C.sup((x, y) => [x, y, S.z], -0.2, 1.4, -0.2, 1.8, 2, 2, { cor: cor.u, alfa: 0.06, plano: 1, malha: false });
          });
          M.cena(G, (P, S) => {
            const so = SO[S.s];
            G.j0 = [-0.15, so.zmax + 0.2, -0.1, Math.max(1.6, so.A(0) * 1.15)];
            G.c = [(G.j0[0] + G.j0[1]) / 2, (G.j0[2] + G.j0[3]) / 2];
            P.eixos(['z', 'A(z)']);
            P.regiao((x, y) => x >= 0 && x <= S.z && y >= 0 && y <= so.A(x), cor.u, 0.25);
            P.param((t) => [t, so.A(t)], 0, so.zmax, 200, { cor: cor.u, larg: 2.4 });
            P.ponto([S.z, so.A(S.z)], { cor: cor.u });
          });
          M.leituras('Corte z = constante', (S) => {
            const so = SO[S.s];
            return [['z', CM.fmt(S.z, 3)], ['A(z)', CM.fmt(so.A(S.z), 4)], ['', so.Atxt(S.z)], ['volume até z = ∫₀ᶻ A(t) dt', CM.fmt(CM.simpson(so.A, 0, S.z, 400), 4)], ['Vol₃ total', so.volTxt, 'forte']];
          });
          M.leituras('Ordens de integração', (S) => SO[S.s].ordens.map(([a, b]) => [a, b]));
          M.texto('<b class="t">Volume como integral triplo</b><p class="f">Vol₃(X) = ∫∫∫_X 1 dx dy dz = ∫ A(z) dz</p><p>Fixa-se z, calcula-se a área do corte (um integral duplo) e integra-se em z. Há 3! = 6 ordens possíveis. No sólido da aula, os cortes em z mudam de forma em z = 1, por isso com z por fora o integral parte-se em dois: 5/6 + 1/6 = 1.</p>', 'nota');
          M.legenda([[cor.sup, 'sólido'], [cor.u, 'corte z = constante e A(z)']]);
        },
      },
    ],
    explicar: [
      { modelo: 'duplo', titulo: 'Integral em ℝ', estado: { r: 'tri', o: 'yx', u: 1, acum: false, riem: false }, texto: '<p>∫ₐᵇ 1 dx = b − a: o comprimento de [a, b], ou a área do retângulo de lados 1 e b − a.</p><p>Um integral é uma «soma» infinita e não contável: área é soma de comprimentos, volume é soma de áreas.</p>' },
      { modelo: 'duplo', titulo: 'Área por cortes', estado: { r: 'aula', o: 'yx', u: 0.3, acum: true, riem: false }, texto: '<p>A = {x² + y² ≤ 2, y ≥ x²}. Para cada x ∈ [−1, 1], o corte vai de c(x) = x² a d(x) = √(2 − x²).</p><p class="f">Vol₂(A) = ∫₋₁¹ ∫ₓ²^√(2−x²) 1 dy dx</p><p>Carrega em ▶ no corte para ver a área a acumular.</p>' },
      { modelo: 'duplo', titulo: 'A conta', estado: { r: 'aula', o: 'yx', u: 1, acum: true }, texto: '<p class="f">∫₋₁¹ (√(2 − x²) − x²) dx = [x√(2 − x²)/2 + arcsen(x/√2)]₋₁¹ − 2/3</p><p>= (1/2 + π/4) − (−1/2 − π/4) − 2/3 = <b>π/2 + 1/3 ≈ 1.904</b>.</p>' },
      { modelo: 'duplo', titulo: 'Trocar a ordem', estado: { r: 'aula', o: 'xy', u: 0.55, acum: true }, texto: '<p>Com y fixo, o corte é horizontal. Para 0 ≤ y ≤ 1 vai de −√y a √y (parábola); para 1 ≤ y ≤ √2 vai de −√(2 − y²) a √(2 − y²) (circunferência).</p><p>O valor é o mesmo; os limites não. Por isso ∫∫ dx dy e ∫∫ dy dx escrevem-se de maneira diferente para a mesma região.</p>' },
      { modelo: 'duplo', titulo: 'Somas de Riemann', estado: { r: 'aula', o: 'yx', u: 0, acum: false, riem: true, n: 6 }, texto: '<p>O integral é o limite das somas de áreas de retângulos dentro da região. Em «Mexer nos controlos», aumenta n e vê a soma aproximar-se de 1.904.</p>' },
      { modelo: 'triplo', titulo: 'Volume de uma caixa', estado: { s: 'caixa', z: 0.4 }, texto: '<p>I = [a, b] × [c, d] × [e, f]: todos os cortes em z têm área (b − a)(d − c).</p><p class="f">Vol₃(I) = ∫ₑᶠ (b − a)(d − c) dz = (b − a)(d − c)(f − e)</p>' },
      { modelo: 'triplo', titulo: 'O sólido da aula', estado: { s: 'aula', z: 0.6 }, vista: [0.9, 0.38], texto: '<p>X = {0 ≤ x, y ≤ 1, 0 ≤ z ≤ x + y}. Com x e y por fora: ∫₀¹ ∫₀¹ (x + y) dy dx = ∫₀¹ (1/2 + x) dx = <b>1</b>.</p><p>Com z por fora, para 0 ≤ z ≤ 1 o corte é o quadrado menos o triângulo x + y &lt; z: A(z) = 1 − z²/2.</p>' },
      { modelo: 'triplo', titulo: 'Os cortes mudam em z = 1', estado: { s: 'aula', z: 1.4 }, texto: '<p>Para 1 ≤ z ≤ 2 sobra só o triângulo x + y ≥ z dentro do quadrado: A(z) = (2 − z)²/2.</p><p class="f">∫₀¹ (1 − z²/2) dz + ∫₁² (2 − z)²/2 dz = 5/6 + 1/6 = 1.</p>' },
    ],
    testa: [
      { modelo: 'duplo', estado: { r: 'aula', o: 'yx', u: 1, acum: true }, p: 'Área de A = {x² + y² ≤ 2, y ≥ x²}:', op: ['π/2 − 1/3', 'π/2 + 1/3', '2√2/3', 'π'], certa: 1, porque: '∫₋₁¹ √(2 − x²) dx = 1 + π/2 e ∫₋₁¹ x² dx = 2/3. Área = 1 + π/2 − 2/3 = π/2 + 1/3.' },
      { modelo: 'duplo', estado: { r: 'tri', o: 'xy', u: 0.4 }, p: 'Região 0 ≤ y ≤ x ≤ 1. Limites na ordem dx dy:', op: ['∫₀¹ ∫₀ʸ dx dy', '∫₀¹ ∫ᵧ¹ dx dy', '∫₀¹ ∫₀¹ dx dy', '∫₀ˣ ∫₀¹ dx dy'], certa: 1, porque: 'Com y fixo, x vai de y (reta y = x) até 1.' },
      { p: 'Trocar a ordem de integração de f contínua numa região:', op: ['muda o valor do integral', 'não muda o valor, mas em geral muda os limites', 'só é possível em retângulos', 'troca o sinal'], certa: 1, porque: 'Teorema de Fubini. Os limites escrevem a mesma região de outra maneira.' },
      { modelo: 'triplo', estado: { s: 'aula', z: 1.5 }, p: 'X = {0 ≤ x, y ≤ 1, 0 ≤ z ≤ x + y}. Área do corte para 1 ≤ z ≤ 2:', op: ['1 − z²/2', '(2 − z)²/2', 'z − 1', '1'], certa: 1, porque: 'Sobra o triângulo {x + y ≥ z} no quadrado, com catetos 2 − z.' },
      { modelo: 'triplo', estado: { s: 'aula', z: 0.5 }, p: 'Volume desse sólido:', op: ['1/2', '1', '2', '3/2'], certa: 1, porque: '∫₀¹ ∫₀¹ (x + y) dy dx = ∫₀¹ (x + 1/2) dx = 1/2 + 1/2 = 1.' },
      { p: 'Quantas ordens de integração tem um integral triplo?', op: ['3', '6', '9', '2'], certa: 1, porque: '3! = 6 maneiras de ordenar dx, dy e dz.' },
    ],
  });
})();
