/* 3. Regra da cadeia: D(f∘g)(a) = Df(g(a)) Dg(a). */
(function () {
  const OURO = '#D9A21B';
  const FN = {
    quad: { nome: 'x² + y²', f: (x, y) => x * x + y * y, z: [0, 2.6] },
    sela: { nome: 'x² − y²', f: (x, y) => x * x - y * y, z: [-1.7, 1.7] },
    xy: { nome: 'xy', f: (x, y) => x * y, z: [-1.7, 1.7] },
    sino: { nome: 'e^(−x²−y²)', f: (x, y) => Math.exp(-x * x - y * y), z: [0, 1.1] },
  };
  const CU = {
    circ: { nome: '(cos t; sen t)', g: (t) => [Math.cos(t), Math.sin(t)], t: [0, 2 * Math.PI], t0: 1, tx: 'g(t) = (cos t; sen t), t ∈ [0, 2π]' },
    parab: { nome: '(t; t²)', g: (t) => [t, t * t], t: [-1.1, 1.1], t0: 0.6, tx: 'g(t) = (t; t²)' },
    reta: { nome: 'A + t(B − A)', g: (t) => [-1 + 2 * t, -0.5 + 1.3 * t], t: [0, 1], t0: 0.4, tx: 'g(t) = A + t(B − A), A = (−1; −0.5), B = (1; 0.8)' },
  };
  const dg = (g, t, h = 1e-6) => { const a = g(t + h), b = g(t - h); return [(a[0] - b[0]) / (2 * h), (a[1] - b[1]) / (2 * h)]; };

  CDI.materia({
    id: 'cadeia', ordem: 3, grupo: 'Cálculo diferencial', curto: 'Regra da cadeia', titulo: 'Regra da cadeia', paginas: 'pp. 16–21',
    resumo: 'f∘g ao longo de uma curva e na forma matricial: a derivada da composta é o produto das Jacobianas.',
    modelos: [
      {
        id: 'curva', nome: 'Ao longo de uma curva',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.8, alvo: [0, 0, 0.3] });
          const G = M.plano({ janela: [-0.3, 6.6, -2, 2.6], livre: true, dica: 'h(t) = f(g(t)) e a reta tangente em t' });
          M.escolha('f', { rot: 'f(x; y)', opcoes: Object.keys(FN).map((k) => [k, FN[k].nome]), valor: 'sela', mono: true });
          M.escolha('c', { rot: 'g(t)', opcoes: Object.keys(CU).map((k) => [k, CU[k].nome]), valor: 'circ', mono: true, aoMudar: (k) => (M.S.t = CU[k].t0) });
          M.barra('t', { rot: 't', cor: cor.n, min: 0, max: 2 * Math.PI, valor: 1, nome: 'parâmetro t', dur: 7000, fmt: (x) => CM.fmt(x, 2) });
          M.caixa('vet', { rot: '∇f e g′(t) no plano', valor: true });
          const sync = () => { const c = CU[M.S.c], b = M.ctl.querySelector('input[aria-label="parâmetro t"]'); if (b) { b.min = c.t[0]; b.max = c.t[1]; } M.S.t = CM.clamp(M.S.t, c.t[0], c.t[1]); };
          M.sync.unshift(sync);
          const est = (S) => {
            const f = FN[S.f].f, c = CU[S.c], p = c.g(S.t), v = dg(c.g, S.t), gr = CM.grad(f, p[0], p[1]);
            const hp = CM.dot(gr, v);
            const num = (f(...c.g(S.t + 1e-5)) - f(...c.g(S.t - 1e-5))) / 2e-5;
            return { f, c, p, v, gr, hp, num };
          };
          M.cena(V, (C, S) => {
            const { f, c, p, v, gr } = est(S);
            const zr = FN[S.f].z;
            C.eixos({ x: [-1.5, 1.5], y: [-1.5, 1.5], z: [Math.min(-0.2, zr[0]), Math.max(1.3, zr[1])] });
            C.sup((r, th) => { const x = r * Math.cos(th), y = r * Math.sin(th), z = f(x, y); return z < zr[0] || z > zr[1] ? null : [x, y, z]; }, 0, 1.12, 0, 2 * Math.PI, 18, 52, { cor: cor.sup, corTras: cor.sup2, alfa: 0.55 });
            C.param((t) => { const q = c.g(t); return [q[0], q[1], 0]; }, c.t[0], c.t[1], 120, { cor: cor.n, larg: 2, alfa: 0.7 });
            C.param((t) => { const q = c.g(t); return [q[0], q[1], f(q[0], q[1])]; }, c.t[0], c.t[1], 160, { cor: cor.n, larg: 3.4, vies: 0.03 });
            const P = [p[0], p[1], f(p[0], p[1])];
            C.linha([p[0], p[1], 0], P, { cor: cor.m, larg: 1, trac: [3, 4] });
            if (S.vet) {
              C.seta([p[0], p[1], 0], [0.45 * v[0], 0.45 * v[1], 0], { cor: cor.u, rot: 'g′(t)' });
              const gn = Math.hypot(gr[0], gr[1]);
              if (gn > 1e-6) C.seta([p[0], p[1], 0], [(0.45 * gr[0]) / Math.max(1, gn), (0.45 * gr[1]) / Math.max(1, gn), 0], { cor: cor.v, rot: '∇f' });
            }
            const hp = CM.dot(gr, v);
            C.seta(P, CM.mul(CM.nrm([v[0], v[1], hp]), 0.55), { cor: OURO, larg: 2.6 });
            C.ponto([p[0], p[1], 0], { cor: cor.n, r: 4 });
            C.ponto(P, { cor: cor.n, rot: 'f(g(t))' });
          });
          M.cena(G, (P, S) => {
            const { f, c, hp } = est(S);
            G.j0 = [c.t[0] - 0.08 * (c.t[1] - c.t[0]), c.t[1] + 0.05 * (c.t[1] - c.t[0]), -2, 2.6];
            G.c = [(G.j0[0] + G.j0[1]) / 2, 0.3];
            P.eixos(['t', 'h']);
            P.param((t) => [t, f(...c.g(t))], c.t[0], c.t[1], 240, { cor: cor.n, larg: 2.6 });
            const h0 = f(...c.g(S.t)), d = 0.35 * (c.t[1] - c.t[0]);
            P.curva([[S.t - d, h0 - d * hp], [S.t + d, h0 + d * hp]], { cor: OURO, larg: 2.4 });
            P.ponto([S.t, h0], { cor: cor.n, rot: "declive h′(t)", dy: -16 });
          });
          M.leituras('h(t) = f(g(t))', (S) => {
            const { p, v, gr, hp, num } = est(S);
            return [['g(t)', CM.pt(p)], ["g′(t)", CM.pt(v)], ['∇f(g(t))', CM.pt(gr)], '—', ["h′(t) = ∇f(g(t)) · g′(t)", CM.fmt(hp, 3), 'forte'], ['derivada numérica de h', CM.fmt(num, 3)], Math.abs(hp) < 1e-3 ? '∇f(g(t)) ⟂ g′(t): neste instante a curva segue uma linha de nível e h não varia.' : hp > 0 ? 'O ângulo entre ∇f e g′(t) é agudo: h está a crescer.' : 'O ângulo entre ∇f e g′(t) é obtuso: h está a decrescer.'];
          });
          M.texto('<b class="t">Regra da cadeia ao longo de uma curva</b><p>Se g : ℝ → ℝⁿ e f : ℝⁿ → ℝ são diferenciáveis, h = f∘g tem</p><p class="f">h′(t) = Df(g(t)) Dg(t) = ∇f(g(t)) · g′(t).</p><p>Matricialmente é uma linha (1 × n) vezes uma coluna (n × 1).</p>', 'nota');
          M.legenda([[cor.n, 'g(t) no plano e f(g(t)) na superfície'], [cor.u, "g′(t)"], [cor.v, '∇f(g(t))'], [OURO, 'tangente: declive h′(t)']]);
        },
      },
      {
        id: 'matriz', nome: 'Forma matricial',
        montar(M) {
          const cor = M.cores();
          const E = Math.E;
          const g = (x, y) => [x + y, Math.exp(x) - y];
          const FF = {
            aula: { nome: '3u + 4v (exemplo da aula)', f: (u, v) => 3 * u + 4 * v },
            uv: { nome: 'uv', f: (u, v) => u * v },
            q: { nome: 'u² + v²', f: (u, v) => u * u + v * v },
          };
          const A = M.plano({ janela: [-2.4, 2.4, -2.4, 2.4], dica: 'Domínio (x; y): arrasta o ponto' });
          const B = M.plano({ janela: [-2, 3, -1, 4.5], dica: '(u; v) = g(x; y), com as linhas de nível de f' });
          M.S.p = [1, -1];
          M.escolha('f', { rot: 'f(u; v)', opcoes: Object.keys(FF).map((k) => [k, FF[k].nome]), valor: 'aula', mono: true });
          M.botoes([['Exemplo da aula: (x; y) = (1; −1)', () => M.definir({ p: [1, -1], f: 'aula' })]]);
          M.cena(A, (P, S) => {
            P.eixos();
            P.seta(S.p, [0.6, 0], { cor: cor.u, rot: 'e₁' });
            P.seta(S.p, [0, 0.6], { cor: cor.v, rot: 'e₂' });
            P.ponto(S.p, { cor: cor.i, rot: '(x; y)', arr: (x, y) => M.definir({ p: [x, y] }) });
          });
          M.cena(B, (P, S) => {
            const f = FF[S.f].f, q = g(...S.p), J = CM.jac((x, y) => g(x, y), ...S.p), gr = CM.grad(f, ...q);
            B.c = q.slice();
            P.eixos(['u', 'v']);
            const [x0, x1, y0, y1] = P.limites();
            const vals = [];
            for (let i = 0; i < 14; i++) vals.push(f(x0 + ((x1 - x0) * i) / 13, y0 + ((y1 - y0) * ((i * 7) % 13)) / 13));
            const lo = Math.min(...vals), hi = Math.max(...vals);
            for (let i = 1; i < 12; i++) P.nivel(f, lo + ((hi - lo) * i) / 12, { cor: cor.m, larg: 1, alfa: 0.5 });
            P.nivel(f, f(...q), { cor: cor.n, larg: 2 });
            P.seta(q, [0.6 * J[0][0] * 0.5, 0.6 * J[1][0] * 0.5], { cor: cor.u, rot: 'Dg e₁' });
            P.seta(q, [0.6 * J[0][1] * 0.5, 0.6 * J[1][1] * 0.5], { cor: cor.v, rot: 'Dg e₂' });
            const gn = Math.hypot(...gr);
            P.seta(q, CM.mul(gr, Math.min(1.2, gn) / Math.max(gn, 1e-9)), { cor: '#D9A21B', rot: '∇f' });
            P.ponto(q, { cor: cor.i, rot: 'g(x; y)' });
          });
          M.leituras('h(x; y) = f(x + y; eˣ − y)', (S) => {
            const f = FF[S.f].f, q = g(...S.p), J = CM.jac((x, y) => g(x, y), ...S.p), gr = CM.grad(f, ...q);
            const Dh = [CM.dot(gr, [J[0][0], J[1][0]]), CM.dot(gr, [J[0][1], J[1][1]])];
            return [['(x; y)', CM.pt(S.p)], ['g(x; y) = (x + y; eˣ − y)', CM.pt(q)], ['Dg(x; y) = [ 1  1 ; eˣ  −1 ]', CM.mat(J, 3)], ['Df(g(x; y)) = ∇f', '[ ' + gr.map((x) => CM.fmtC(x)).join('  ') + ' ]'], '—', ['Dh = Df(g) · Dg (1×2 · 2×2)', '[ ' + Dh.map((x) => CM.fmtC(x)).join('  ') + ' ]', 'forte'], S.f === 'aula' && Math.abs(S.p[0] - 1) < 0.02 && Math.abs(S.p[1] + 1) < 0.02 ? `Com ∇f(0; e + 1) = (3; 4): Dh(1; −1) = [3 + 4e  −1] = [${CM.fmtC(3 + 4 * E)}  −1].` : 'Cada entrada de Dh é ∇f · (uma coluna de Dg): ∂h/∂x = ∂f/∂u ∂u/∂x + ∂f/∂v ∂v/∂x.'];
          });
          M.texto('<b class="t">Composição de Jacobianas</b><p>ℝⁿ →g ℝᵖ →f ℝᵐ, com g diferenciável em a e f diferenciável em g(a):</p><p class="f">D(f∘g)(a) = Df(g(a)) Dg(a), de tamanhos (m×p)(p×n) = m×n.</p><p>Exemplo das teóricas: ℝ → ℝ² → ℝ³, t ↦ (t; t²) ↦ f(t; t²), com Df(1; 1) = [ 1 2 ; 3 4 ; 5 6 ] e Dg(1) = (1; 2). D(f∘g)(1) = (5; 11; 17).</p>', 'nota');
          M.legenda([[cor.u, 'Dg(x; y)e₁'], [cor.v, 'Dg(x; y)e₂'], ['#D9A21B', '∇f em g(x; y)'], [cor.n, 'linha de nível de f por g(x; y)']]);
        },
      },
    ],
    explicar: [
      { modelo: 'curva', titulo: 'h = f∘g ao longo de uma curva', estado: { f: 'sela', c: 'circ', t: 0.6, vet: true }, texto: '<p>g(t) = (cos t; sen t) percorre a circunferência no plano. Por cima, a curva roxa é (g(t); f(g(t))) na superfície z = x² − y².</p><p>h(t) = f(g(t)) = cos²t − sen²t = cos 2t, o gráfico de baixo.</p>' },
      { modelo: 'curva', titulo: 'h′(t) = ∇f(g(t)) · g′(t)', estado: { f: 'sela', c: 'circ', t: 0.6 }, texto: '<p>∇f = (2x; −2y) e g′(t) = (−sen t; cos t). O produto interno dá −4 sen t cos t = −2 sen 2t, a derivada de cos 2t. A reta dourada tem esse declive.</p>' },
      { modelo: 'curva', titulo: 'Perpendicular ⇒ h′ = 0', estado: { f: 'quad', c: 'circ', t: 1.2 }, texto: '<p>Com f = x² + y², a circunferência é uma linha de nível: h(t) = 1 é constante.</p><p>Em todos os pontos, ∇f = 2(x; y) é radial e g′(t) é tangente: ∇f · g′ = 0. É o teorema do gradiente perpendicular às linhas de nível, já com a regra da cadeia.</p>' },
      { modelo: 'matriz', titulo: 'Forma matricial', estado: { f: 'uv', p: [0.3, 0.4] }, texto: '<p>h(x; y) = f(u(x; y); v(x; y)) com (u; v) = g(x; y) = (x + y; eˣ − y).</p><p class="f">Dh(x; y) = Df(g(x; y)) · Dg(x; y)</p><p>Linha (1 × 2) vezes matriz (2 × 2) dá linha (1 × 2): ∂h/∂x = ∂f/∂u ∂u/∂x + ∂f/∂v ∂v/∂x, e o mesmo para y.</p>' },
      { modelo: 'matriz', titulo: 'O exemplo da aula', estado: { f: 'aula', p: [1, -1] }, texto: '<p>Dado ∇f(0; e + 1) = (3; 4) e (x; y) = (1; −1): g(1; −1) = (0; e + 1).</p><p class="f">Dh(1; −1) = [3  4] [ 1  1 ; e  −1 ] = [3 + 4e  −1].</p><p>Usei f = 3u + 4v, que tem esse gradiente, para se poder desenhar.</p>' },
    ],
    testa: [
      { modelo: 'curva', estado: { f: 'quad', c: 'circ', t: 2 }, p: 'f(x; y) = x² + y² e g(t) = (cos t; sen t). Quanto vale (f∘g)′(t)?', op: ['2', '0', '−2 sen 2t', '2t'], certa: 1, porque: 'f(g(t)) = cos²t + sen²t = 1, constante. Pela regra da cadeia: (2 cos t; 2 sen t) · (−sen t; cos t) = 0.' },
      { p: 'g : ℝ² → ℝ² e f : ℝ² → ℝ. Que tamanho tem D(f∘g)(a)?', op: ['2 × 2', '1 × 2', '2 × 1', '1 × 1'], certa: 1, porque: 'Df(g(a)) é 1 × 2 e Dg(a) é 2 × 2; o produto é 1 × 2. Faz sentido: f∘g vai de ℝ² para ℝ.' },
      { modelo: 'matriz', estado: { f: 'aula', p: [1, -1] }, p: 'h(x; y) = f(x + y; eˣ − y) e ∇f(0; e + 1) = (3; 4). Quanto vale Dh(1; −1)?', op: ['[3  4]', '[3 + 4e  −1]', '[7  −1]', '[3e + 4  1]'], certa: 1, porque: 'Dg(1; −1) = [ 1  1 ; e  −1 ]. [3 4] vezes essa matriz dá [3·1 + 4·e  3·1 + 4·(−1)] = [3 + 4e  −1].' },
      { p: 't ↦ (t; t²) ↦ f(t; t²), com Df(1; 1) = [ 1 2 ; 3 4 ; 5 6 ]. Quanto vale D(f∘g)(1)?', op: ['(1; 3; 5)', '(5; 11; 17)', '(3; 7; 11)', 'Não dá para calcular'], certa: 1, porque: 'Dg(1) = (1; 2). [ 1 2 ; 3 4 ; 5 6 ] (1; 2) = (1 + 4; 3 + 8; 5 + 12) = (5; 11; 17).' },
    ],
  });
})();
