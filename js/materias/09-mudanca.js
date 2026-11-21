/* 9. Mudança de variáveis em ℝ²: polares, elipse, translação. */
(function () {
  const PI = Math.PI;
  const RG = {
    disco: {
      nome: 'Disco x² + y² ≤ R²', g: (r, t, S) => [r * Math.cos(t), r * Math.sin(t)], jac: (r) => r, jtx: '|det Dg(r; θ)| = r',
      r: (S) => [0, S.R], t: () => [0, 2 * PI], val: (S) => PI * S.R * S.R, vtx: (S) => `∫₀^2π ∫₀^R r dr dθ = 2π · R²/2 = πR² = ${CM.fmt(PI * S.R * S.R, 3)}`,
      int: '∫₀^2π ∫₀^R r dr dθ', jan: [-2.4, 2.4, -1.9, 1.9], dom: [-0.3, 2.3, -0.4, 6.8],
    },
    elipse: {
      nome: 'Elipse x²/a² + y²/b² ≤ 1', g: (r, t, S) => [S.a * r * Math.cos(t), S.b * r * Math.sin(t)], jac: (r, t, S) => S.a * S.b * r, jtx: 'x = ar cos θ, y = br sen θ: |det Dg| = abr',
      r: () => [0, 1], t: () => [0, 2 * PI], val: (S) => PI * S.a * S.b, vtx: (S) => `∫₀^2π ∫₀¹ abr dr dθ = πab = ${CM.fmt(PI * S.a * S.b, 3)}`,
      int: '∫₀^2π ∫₀¹ ab r dr dθ', jan: [-2.4, 2.4, -1.9, 1.9], dom: [-0.3, 1.5, -0.4, 6.8],
    },
    desl: {
      nome: '(x − 1)² + (y − 1)² < 1, x + y > 2', g: (r, t) => [1 + r * Math.cos(t), 1 + r * Math.sin(t)], jac: (r) => r, jtx: 'u = x − 1, v = y − 1 e depois polares: |det| = r',
      r: () => [0, 1], t: () => [-PI / 4, (3 * PI) / 4], val: () => PI / 2, vtx: () => '∫₋π/4^(3π/4) ∫₀¹ r dr dθ = π · 1/2 = π/2 ≈ 1.571',
      int: '∫₋π/4^(3π/4) ∫₀¹ r dr dθ', jan: [-0.5, 2.6, -0.4, 2.4], dom: [-0.3, 1.5, -1.2, 2.8],
    },
    anel: {
      nome: 'Anel 1 ≤ x² + y² ≤ 4', g: (r, t) => [r * Math.cos(t), r * Math.sin(t)], jac: (r) => r, jtx: '|det Dg(r; θ)| = r',
      r: () => [1, 2], t: () => [0, 2 * PI], val: () => 3 * PI, vtx: () => '∫₀^2π ∫₁² r dr dθ = 2π · 3/2 = 3π ≈ 9.425',
      int: '∫₀^2π ∫₁² r dr dθ', jan: [-2.6, 2.6, -2.2, 2.2], dom: [-0.3, 2.3, -0.4, 6.8],
    },
  };

  CDI.materia({
    id: 'mudanca', ordem: 9, grupo: 'Cálculo integral', curto: 'Mudança de variáveis', titulo: 'Mudança de variáveis', paginas: 'pp. 41–45',
    resumo: 'Polares e outras mudanças: retângulos no domínio, regiões curvas na imagem, e o fator |det Dg|.',
    modelos: [
      {
        id: 'polares', nome: 'Polares e o fator r',
        montar(M) {
          const cor = M.cores();
          const D = M.plano({ janela: RG.disco.dom, livre: true, dica: 'Domínio (r; θ): arrasta a célula' });
          const I = M.plano({ janela: RG.disco.jan, dica: 'Imagem (x; y) = g(r; θ)' });
          M.S.c = [1.1, 1.0];
          M.escolha('reg', { rot: 'Região', opcoes: Object.keys(RG).map((k) => [k, RG[k].nome]), valor: 'disco', mono: true, aoMudar: (k) => { D.janela(RG[k].dom); I.janela(RG[k].jan); const R = RG[k]; const rr = R.r(M.S), tt = R.t(M.S); M.S.c = [(rr[0] + rr[1]) * 0.6, (tt[0] + tt[1]) / 2 + 0.3]; } });
          M.barra('R', { rot: 'R', cor: cor.u, min: 0.4, max: 2, valor: 1.5, nome: 'raio R' });
          M.barra('a', { rot: 'a', cor: cor.u, min: 0.4, max: 2.2, valor: 2, nome: 'semieixo a' });
          M.barra('b', { rot: 'b', cor: cor.v, min: 0.4, max: 1.6, valor: 1, nome: 'semieixo b' });
          M.barra('n', { rot: 'n', cor: cor.n, min: 2, max: 24, passo: 1, valor: 8, fmt: (x) => String(Math.round(x)), nome: 'divisões' });
          const vis = () => { const k = M.S.reg; M.ctl.querySelectorAll('.barra').forEach((el) => { const l = el.querySelector('input').getAttribute('aria-label'); el.hidden = (l === 'raio R' && k !== 'disco') || ((l === 'semieixo a' || l === 'semieixo b') && k !== 'elipse'); }); };
          M.sync.push(vis);
          const cel = (S) => { const R = RG[S.reg], rr = R.r(S), tt = R.t(S), n = Math.round(S.n); const dr = (rr[1] - rr[0]) / n, dt = (tt[1] - tt[0]) / n; const i = CM.clamp(Math.floor((S.c[0] - rr[0]) / dr), 0, n - 1), j = CM.clamp(Math.floor((S.c[1] - tt[0]) / dt), 0, n - 1); return { R, rr, tt, n, dr, dt, r0: rr[0] + i * dr, t0: tt[0] + j * dt }; };
          M.cena(D, (P, S) => {
            const { rr, tt, n, dr, dt, r0, t0 } = cel(S);
            P.eixos(['r', 'θ']);
            for (let i = 0; i <= n; i++) { P.curva([[rr[0] + i * dr, tt[0]], [rr[0] + i * dr, tt[1]]], { cor: cor.u, larg: i % n ? 1 : 2, alfa: 0.7 }); P.curva([[rr[0], tt[0] + i * dt], [rr[1], tt[0] + i * dt]], { cor: cor.v, larg: i % n ? 1 : 2, alfa: 0.7 }); }
            P.poli([[r0, t0], [r0 + dr, t0], [r0 + dr, t0 + dt], [r0, t0 + dt]], { cor: cor.n, larg: 2, encher: cor.n + '55' });
            P.ponto([r0 + dr / 2, t0 + dt / 2], { cor: cor.n, r: 4, arr: (x, y) => M.definir({ c: [x, y] }) });
          });
          M.cena(I, (P, S) => {
            const { R, rr, tt, n, dr, dt, r0, t0 } = cel(S);
            P.eixos();
            for (let i = 0; i <= n; i++) {
              P.param((t) => R.g(rr[0] + i * dr, t, S), tt[0], tt[1], 120, { cor: cor.u, larg: i % n ? 1 : 2, alfa: 0.7 });
              P.param((r) => R.g(r, tt[0] + i * dt, S), rr[0], rr[1], 20, { cor: cor.v, larg: i % n ? 1 : 2, alfa: 0.7 });
            }
            if (S.reg === 'desl') P.curva([[-1, 3], [3, -1]], { cor: cor.m, larg: 1.2, trac: [5, 4] });
            const pts = [];
            for (let k = 0; k <= 10; k++) pts.push(R.g(r0, t0 + (dt * k) / 10, S));
            for (let k = 0; k <= 10; k++) pts.push(R.g(r0 + (dr * k) / 10, t0 + dt, S));
            for (let k = 10; k >= 0; k--) pts.push(R.g(r0 + dr, t0 + (dt * k) / 10, S));
            for (let k = 10; k >= 0; k--) pts.push(R.g(r0 + (dr * k) / 10, t0, S));
            P.poli(pts, { cor: cor.n, larg: 2, encher: cor.n + '55' });
          });
          M.leituras('A célula', (S) => {
            const { R, dr, dt, r0, t0 } = cel(S);
            const rc = r0 + dr / 2, tc = t0 + dt / 2;
            const area = CM.simpson((r) => R.jac(r, 0, S), r0, r0 + dr, 20) * dt;
            return [['(r; θ) no centro', CM.pt([rc, tc])], ['área no domínio dr·dθ', CM.fmt(dr * dt, 4)], ['área da imagem', CM.fmt(area, 4)], ['rácio (≈ |det Dg|)', CM.fmt(area / (dr * dt), 3), 'forte'], ['', R.jtx], '—', ['Vol₂', R.vtx(S), 'forte']];
          });
          M.texto('<b class="t">Mudança de variáveis</b><p>Se g : T → D é injetiva e C¹, com det Dg ≠ 0 (exceto num conjunto de área nula):</p><p class="f">∫∫_D f(x; y) dx dy = ∫∫_T f(g(u; v)) |det Dg(u; v)| du dv.</p><p>Em CDI I era ∫ f(x) dx = ∫ f(g(t)) |g′(t)| dt. Em polares, (x; y) = (r cos θ; r sen θ) e |det Dg| = r: as células longe da origem são maiores, e r corrige isso.</p>', 'nota');
          M.legenda([[cor.u, 'r = constante'], [cor.v, 'θ = constante'], [cor.n, 'uma célula e a sua imagem']]);
        },
      },
    ],
    explicar: [
      { modelo: 'polares', titulo: 'A primitiva difícil', estado: { reg: 'disco', R: 1.5, n: 8, c: [1.1, 1] }, texto: '<p>Em cartesianas, Vol₂(disco) = ∫₋ᵣʳ ∫₋√(r²−x²)^√(r²−x²) 1 dy dx = 2∫₋ᵣʳ √(r² − x²) dx: precisa de uma substituição trigonométrica.</p><p>O disco é um retângulo em (r; θ): [0, R] × [0, 2π].</p>' },
      { modelo: 'polares', titulo: 'Retângulos viram setores', estado: { reg: 'disco', R: 1.5, n: 8, c: [0.3, 1] }, texto: '<p>g(r; θ) = (r cos θ; r sen θ) leva a grelha do domínio em círculos e raios. A célula roxa tem a mesma área dr dθ à esquerda em qualquer sítio, mas à direita cresce com r.</p>' },
      { modelo: 'polares', titulo: 'O fator r', estado: { reg: 'disco', R: 1.5, n: 8, c: [1.3, 1] }, texto: '<p>A área da imagem de uma célula é ≈ r dr dθ: o rácio nas leituras dá r. É |det Dg(r; θ)| = |cos θ · r cos θ − (−r sen θ) sen θ| = r.</p><p class="f">Vol₂ = ∫₀^2π ∫₀^R r dr dθ = πR².</p>' },
      { modelo: 'polares', titulo: 'Elipse', estado: { reg: 'elipse', a: 2, b: 1, n: 8, c: [0.6, 1] }, texto: '<p>x²/a² + y²/b² ≤ 1. Com u = x/a e v = y/b vira u² + v² ≤ 1, e em polares x = ar cos θ, y = br sen θ, com |det Dg| = abr.</p><p class="f">Vol₂ = ∫₀^2π ∫₀¹ abr dr dθ = πab.</p>' },
      { modelo: 'polares', titulo: 'Região deslocada', estado: { reg: 'desl', n: 8, c: [0.5, 0.8] }, texto: '<p>(x − 1)² + (y − 1)² &lt; 1 e x + y &gt; 2. Primeiro u = x − 1, v = y − 1: disco unitário com u + v &gt; 0. Em polares, cos θ + sen θ &gt; 0 ⇔ −π/4 &lt; θ &lt; 3π/4.</p><p class="f">Vol₂ = ∫₋π/4^(3π/4) ∫₀¹ r dr dθ = π/2.</p>' },
    ],
    testa: [
      { modelo: 'polares', estado: { reg: 'disco', R: 1.5, c: [1.2, 1] }, p: 'Em polares, (x; y) = (r cos θ; r sen θ). Quanto vale |det Dg(r; θ)|?', op: ['1', 'r', 'r²', 'r sen θ'], certa: 1, porque: 'Dg = [ cos θ  −r sen θ ; sen θ  r cos θ ], det = r cos²θ + r sen²θ = r.' },
      { modelo: 'polares', estado: { reg: 'elipse', a: 2, b: 1 }, p: 'Área da elipse x²/a² + y²/b² ≤ 1:', op: ['πa²b²', 'πab', '2πab', 'π(a + b)'], certa: 1, porque: 'x = ar cos θ, y = br sen θ dá |det| = abr, e ∫₀^2π ∫₀¹ abr dr dθ = πab.' },
      { modelo: 'polares', estado: { reg: 'desl' }, p: 'Para (x − 1)² + (y − 1)² &lt; 1 com x + y &gt; 2, depois de u = x − 1, v = y − 1, que θ se usa?', op: ['0 &lt; θ &lt; π', '−π/4 &lt; θ &lt; 3π/4', 'π/4 &lt; θ &lt; 5π/4', '0 &lt; θ &lt; π/2'], certa: 1, porque: 'x + y &gt; 2 ⇔ u + v &gt; 0 ⇔ cos θ + sen θ &gt; 0, o semiplano acima da reta v = −u.' },
      { p: 'Na fórmula de mudança de variáveis aparece:', op: ['det Dg(u; v)', '|det Dg(u; v)|', '1/|det Dg(u; v)|', 'Dg(u; v)'], certa: 1, porque: 'Áreas são positivas: entra o valor absoluto do determinante, que mede quanto g estica as áreas.' },
    ],
  });
})();
