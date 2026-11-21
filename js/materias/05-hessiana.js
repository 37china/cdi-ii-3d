/* 5. Derivadas de ordem superior, Hessiana e classificação de pontos críticos. */
(function () {
  const OURO = '#D9A21B';
  const FN = {
    min: { nome: 'x² + y²', f: (x, y) => x * x + y * y, cr: [[0, 0]], z: [-0.3, 2.6] },
    max: { nome: '1 − x² − y²', f: (x, y) => 1 - x * x - y * y, cr: [[0, 0]], z: [-1, 1.2] },
    sela: { nome: 'x² − y²', f: (x, y) => x * x - y * y, cr: [[0, 0]], z: [-1.6, 1.6] },
    xy4: { nome: 'x² + y⁴', f: (x, y) => x * x + y ** 4, cr: [[0, 0]], z: [-0.3, 2] },
    xmy4: { nome: 'x² − y⁴', f: (x, y) => x * x - y ** 4, cr: [[0, 0]], z: [-1.5, 1.5] },
    dois: { nome: 'x³ − 3x + y²', f: (x, y) => x ** 3 - 3 * x + y * y, cr: [[1, 0], [-1, 0]], z: [-2.5, 2.5], esc: 0.6 },
    macaco: { nome: 'x³ − 3xy²', f: (x, y) => x ** 3 - 3 * x * y * y, cr: [[0, 0]], z: [-1.6, 1.6] },
  };
  /* Hessiana exata por diferenças finitas com passo moderado (as funções são polinómios) */
  const H = (f, x, y) => CM.hess(f, x, y, 1e-3);
  function classe(l1, l2) {
    const e = 1e-6;
    if (l1 > e && l2 > e) return ['mínimo local', 'cor2'];
    if (l1 < -e && l2 < -e) return ['máximo local', 'corr'];
    if (l1 > e && l2 < -e) return ['ponto de sela', 'cor3'];
    return ['inconclusivo (há um λ = 0)', 'cor1'];
  }

  CDI.materia({
    id: 'hessiana', ordem: 5, grupo: 'Cálculo diferencial', curto: 'Hessiana e extremos', titulo: 'Hessiana e extremos livres', paginas: 'pp. 24–27',
    resumo: 'Pontos críticos, matriz Hessiana, valores próprios e classificação: mínimo, máximo, sela ou inconclusivo.',
    modelos: [
      {
        id: 'criticos', nome: 'Pontos críticos',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7, alvo: [0, 0, 0.1] });
          const G = M.plano({ janela: [-0.15, 3.3, -4.6, 4.6], livre: true, dica: 'vᵀ Hf(P) v ao longo das direções v = (cos θ; sen θ)' });
          M.escolha('f', { rot: 'f(x; y)', opcoes: Object.keys(FN).map((k) => [k, FN[k].nome]), valor: 'sela', mono: true, aoMudar: (k) => { M.S.x0 = FN[k].cr[0][0]; M.S.y0 = FN[k].cr[0][1]; } });
          M.barra('x0', { rot: 'x₀', cor: cor.u, min: -1.2, max: 1.2, valor: 0 });
          M.barra('y0', { rot: 'y₀', cor: cor.v, min: -1.2, max: 1.2, valor: 0 });
          M.caixa('dir', { rot: 'Direções próprias', valor: true });
          M.caixa('taylor', { rot: 'Aproximação de 2.ª ordem', valor: false });
          M.botoes([['Ir para um ponto crítico', () => { const c = FN[M.S.f].cr; const i = c.findIndex((p) => Math.hypot(p[0] - M.S.x0, p[1] - M.S.y0) < 1e-6); const q = c[(i + 1) % c.length]; M.definir({ x0: q[0], y0: q[1] }); }]]);
          const est = (S) => {
            const fn = FN[S.f], f = fn.f, a = [S.x0, S.y0], gr = CM.grad(f, ...a), h = H(f, ...a), e = CM.eigSim2(h[0][0], h[0][1], h[1][1]);
            return { fn, f, a, gr, h, e, crit: Math.hypot(...gr) < 1e-4 };
          };
          M.cena(V, (C, S) => {
            const { fn, f, a, h, e, crit } = est(S);
            const k = fn.esc || 1;
            const g = (x, y) => f(x, y) * k;
            C.eixos({ x: [-1.5, 1.5], y: [-1.5, 1.5], z: [-1.4, 1.6] });
            C.sup((r, t) => { const x = r * Math.cos(t), y = r * Math.sin(t), z = g(x, y); return z < fn.z[0] * k || z > fn.z[1] * k ? null : [x, y, z]; }, 0, 1.12, 0, 2 * Math.PI, 20, 56, { cor: cor.sup, corTras: cor.sup2, alfa: S.taylor ? 0.45 : 0.8 });
            const P = [a[0], a[1], g(...a)];
            if (S.taylor) {
              const gr = CM.grad(f, ...a);
              const q = (x, y) => { const d = [x - a[0], y - a[1]]; return k * (f(...a) + CM.dot(gr, d) + 0.5 * CM.dot(d, CM.mxv(h, d))); };
              C.sup((r, t) => { const x = a[0] + 0.7 * r * Math.cos(t), y = a[1] + 0.7 * r * Math.sin(t); return [x, y, q(x, y)]; }, 0, 1, 0, 2 * Math.PI, 8, 36, { cor: OURO, alfa: 0.45, contorno: 'mesma' });
            }
            if (S.dir) [[e.v1, e.l1], [e.v2, e.l2]].forEach(([v, l]) => {
              const c = l > 1e-6 ? cor.v : l < -1e-6 ? cor.r : cor.u;
              C.param((t) => { const x = a[0] + t * v[0], y = a[1] + t * v[1]; return [x, y, g(x, y)]; }, -0.75, 0.75, 60, { cor: c, larg: 3.4, vies: 0.04 });
            });
            if (crit) C.plano(P, [0, 0, 1], 0.5, { cor: cor.m, alfa: 0.12, m: 4 });
            fn.cr.forEach((p) => C.ponto([p[0], p[1], g(...p)], { cor: cor.i, r: 3.5 }));
            C.ponto(P, { cor: crit ? cor.n : cor.u, rot: 'P' });
          });
          M.cena(G, (P, S) => {
            const { h, e } = est(S);
            P.eixos(['θ', '']);
            P.param((t) => { const v = [Math.cos(t), Math.sin(t)]; return [t, CM.dot(v, CM.mxv(h, v))]; }, 0, Math.PI, 200, { cor: cor.n, larg: 2.6 });
            P.curva([[0, e.l1], [Math.PI, e.l1]], { cor: cor.v, larg: 1.4, trac: [6, 5] });
            P.curva([[0, e.l2], [Math.PI, e.l2]], { cor: cor.r, larg: 1.4, trac: [6, 5] });
            P.texto([3.25, e.l1], 'λ₁', { cor: cor.v, dy: -10 });
            P.texto([3.25, e.l2], 'λ₂', { cor: cor.r, dy: 10 });
          });
          M.leituras('Em P', (S) => {
            const { f, a, gr, h, e, crit } = est(S);
            const [c, cl] = classe(e.l1, e.l2);
            return [['P', CM.pt(a)], ['f(P)', CM.fmt(f(...a), 3)], ['∇f(P)', CM.pt(gr, 3), crit ? 'forte' : ''], ['Hf(P)', CM.mat(h, 2)], ['λ₁, λ₂', CM.fmt(e.l1, 2) + ';  ' + CM.fmt(e.l2, 2)], ['det Hf(P) = λ₁λ₂', CM.fmt(CM.det2(h), 2)], crit ? `Ponto crítico: <span class="${cl}">${c}</span>` : 'Não é ponto crítico (∇f(P) ≠ 0): não pode ser extremo. Usa «Ir para um ponto crítico».'];
          });
          M.texto((S) => {
            const { e, crit } = est(S);
            if (!crit) return '';
            if (Math.abs(e.l2) < 1e-6 || Math.abs(e.l1) < 1e-6) return '<b class="t">Teste inconclusivo</b><p>Com um valor próprio nulo, a 2.ª ordem não decide. x² + y⁴ e x² − y⁴ têm a mesma Hessiana em (0; 0), [ 2 0 ; 0 0 ], e a primeira tem mínimo enquanto a segunda tem sela. É preciso olhar para f diretamente (por exemplo, ao longo do eixo y).</p>';
            return '';
          }, 'aviso');
          M.texto('<b class="t">Classificação (f de classe C²)</b><p>1) Pontos críticos: ∇f(a) = 0. 2) Hf(a). 3) Valores próprios λ₁, …, λₙ.</p><p>Todos λᵢ &gt; 0 ⇒ mínimo local. Todos λᵢ &lt; 0 ⇒ máximo local. Algum λᵢ &gt; 0 e algum λⱼ &lt; 0 ⇒ ponto de sela. Algum λᵢ = 0 e os restantes do mesmo sinal ⇒ inconclusivo.</p><p>Porquê: com h(t) = f(a + tv), h″(0) = vᵀ Hf(a) v, e o máximo e o mínimo desta forma quadrática nas direções unitárias são λ₁ e λ₂ (gráfico de baixo).</p>', 'nota');
          M.legenda([[cor.v, 'direção própria com λ &gt; 0 (curva para cima)'], [cor.r, 'λ &lt; 0 (para baixo)'], [cor.u, 'λ = 0'], [cor.n, 'vᵀ Hf(P) v']]);
        },
      },
      {
        id: 'schwarz', nome: 'Derivadas de 2.ª ordem',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.6 });
          const f = (x, y) => x * x * y ** 3;
          M.barra('x0', { rot: 'x₀', cor: cor.u, min: -1, max: 1, valor: 0.7 });
          M.barra('y0', { rot: 'y₀', cor: cor.v, min: -1, max: 1, valor: 0.8 });
          M.cena(V, (C, S) => {
            C.eixos({ x: [-1.4, 1.4], y: [-1.4, 1.4], z: [-1.2, 1.3] });
            C.grafico(f, -1, 1, -1, 1, 26, { cor: cor.sup, corTras: cor.sup2, alfa: 0.8 });
            const a = [S.x0, S.y0];
            C.param((t) => [t, a[1], f(t, a[1])], -1, 1, 50, { cor: cor.u, larg: 3, vies: 0.03 });
            C.param((t) => [a[0], t, f(a[0], t)], -1, 1, 50, { cor: cor.v, larg: 3, vies: 0.03 });
            C.ponto([a[0], a[1], f(...a)], { cor: cor.i, rot: 'P' });
          });
          M.leituras('f(x; y) = x²y³', (S) => {
            const x = S.x0, y = S.y0;
            return [['∂f/∂x = 2xy³', CM.fmt(2 * x * y ** 3, 3)], ['∂f/∂y = 3x²y²', CM.fmt(3 * x * x * y * y, 3)], '—', ['∂²f/∂x² = 2y³', CM.fmt(2 * y ** 3, 3)], ['∂²f/∂y∂x = ∂/∂y(2xy³) = 6xy²', CM.fmt(6 * x * y * y, 3), 'forte'], ['∂²f/∂x∂y = ∂/∂x(3x²y²) = 6xy²', CM.fmt(6 * x * y * y, 3), 'forte'], ['∂²f/∂y² = 6x²y', CM.fmt(6 * x * x * y, 3)], 'As derivadas cruzadas coincidem (teorema de Schwarz), por isso a Hessiana é simétrica.'];
          });
          M.texto('<b class="t">Classe Cᵏ e teorema de Schwarz</b><p>f é de classe C¹ se f e as derivadas parciais são contínuas; Cᵏ se as derivadas até à ordem k o são.</p><p>Se f : ℝ² → ℝ é C², então ∂²f/∂x∂y = ∂²f/∂y∂x. A Hessiana Hf(a) = [∂²f/∂xᵢ∂xⱼ(a)] é simétrica, por isso tem valores próprios reais e vetores próprios ortogonais.</p>', 'nota');
          M.legenda([[cor.u, 'corte y = y₀ (derivar em x)'], [cor.v, 'corte x = x₀ (derivar em y)']]);
        },
      },
    ],
    explicar: [
      { modelo: 'criticos', titulo: 'Ponto crítico', estado: { f: 'min', x0: 0.6, y0: 0.4, dir: false, taylor: false }, texto: '<p>Num extremo de uma função C¹, todas as derivadas direcionais são 0, logo ∇f(a) = 0. Aqui P = (0.6; 0.4) não é crítico: ∇f(P) = (1.2; 0.8) ≠ 0.</p><p>Os candidatos são as soluções de ∇f = 0. Para x² + y²: 2x = 0 e 2y = 0 ⇒ (0; 0).</p>' },
      { modelo: 'criticos', titulo: 'A 2.ª ordem decide', estado: { f: 'min', x0: 0, y0: 0, dir: true, taylor: true }, texto: '<p>Perto de um ponto crítico, f(a + h) ≈ f(a) + ½ hᵀ Hf(a) h. A superfície dourada é essa aproximação.</p><p>Ao longo de a + tv, h″(0) = vᵀ Hf(a) v: a curvatura na direção v.</p>' },
      { modelo: 'criticos', titulo: 'Valores próprios = curvaturas extremas', estado: { f: 'min', x0: 0, y0: 0, dir: true, taylor: false }, texto: '<p>Hf(0; 0) = [ 2 0 ; 0 2 ]: λ₁ = λ₂ = 2 &gt; 0. Em todas as direções a superfície curva para cima: <b>mínimo local</b>.</p><p>O gráfico de baixo mostra vᵀHv entre λ₂ e λ₁.</p>' },
      { modelo: 'criticos', titulo: 'Sinais trocados: sela', estado: { f: 'sela', x0: 0, y0: 0, dir: true }, texto: '<p>x² − y²: Hf = [ 2 0 ; 0 −2 ], λ₁ = 2 &gt; 0 e λ₂ = −2 &lt; 0. Numa direção sobe, na outra desce: <b>ponto de sela</b>, não é extremo.</p>' },
      { modelo: 'criticos', titulo: 'Um λ = 0: o teste não decide', estado: { f: 'xy4', x0: 0, y0: 0, dir: true }, texto: '<p>x² + y⁴: Hf(0; 0) = [ 2 0 ; 0 0 ]. λ₁ = 2, λ₂ = 0. A origem é mínimo (f ≥ 0 = f(0; 0)).</p><p>Para ter a certeza de um mínimo pelo teste, os λ têm de ser todos <b>estritamente</b> positivos. Passo seguinte: a mesma Hessiana com outra conclusão.</p>' },
      { modelo: 'criticos', titulo: 'Mesma Hessiana, sela', estado: { f: 'xmy4', x0: 0, y0: 0, dir: true }, texto: '<p>x² − y⁴ tem exatamente a mesma Hessiana na origem, mas ao longo do eixo y vale −y⁴ &lt; 0: é <b>sela</b>.</p><p>Logo, com algum λᵢ = 0, a Hessiana sozinha não chega: chama-se inconclusivo.</p>' },
      { modelo: 'criticos', titulo: 'Vários pontos críticos', estado: { f: 'dois', x0: 1, y0: 0, dir: true }, texto: '<p>f = x³ − 3x + y²: ∇f = (3x² − 3; 2y) = 0 ⇒ (1; 0) e (−1; 0). Hf = [ 6x 0 ; 0 2 ].</p><p>Em (1; 0): λ = 6 e 2, mínimo local. Usa «Ir para um ponto crítico» em «Mexer nos controlos»: em (−1; 0), λ = −6 e 2, sela.</p>' },
      { modelo: 'schwarz', titulo: 'Schwarz', estado: { x0: 0.7, y0: 0.8 }, texto: '<p>f = x²y³ é C² (é um polinómio). As duas derivadas cruzadas dão 6xy²: a ordem de derivação não importa e a Hessiana é simétrica.</p>' },
    ],
    testa: [
      { modelo: 'criticos', estado: { f: 'sela', x0: 0, y0: 0 }, p: 'Num ponto crítico, Hf(a) = [ 2 0 ; 0 −2 ]. O ponto é:', op: ['mínimo local', 'máximo local', 'ponto de sela', 'inconclusivo'], certa: 2, porque: 'λ₁ = 2 &gt; 0 e λ₂ = −2 &lt; 0: sobe numa direção e desce noutra.' },
      { modelo: 'criticos', estado: { f: 'xy4', x0: 0, y0: 0 }, p: 'f(x; y) = x² + y⁴. O que diz o teste da Hessiana em (0; 0)?', op: ['Mínimo local, porque λ₁ = 2 &gt; 0 e λ₂ = 0 ≥ 0', 'Inconclusivo, porque λ₂ = 0; é preciso outro argumento', 'Sela', 'Máximo local'], certa: 1, porque: 'Hf(0; 0) = [ 2 0 ; 0 0 ]. Com um λ = 0 o teste não decide: x² − y⁴ tem a mesma Hessiana e é sela. Aqui é mínimo, mas porque f ≥ 0 = f(0; 0), não pelo teste.' },
      { modelo: 'criticos', estado: { f: 'dois', x0: -1, y0: 0 }, p: 'Pontos críticos de f = x³ − 3x + y² e a sua natureza:', op: ['(0; 0), mínimo', '(1; 0) mínimo e (−1; 0) sela', '(1; 0) sela e (−1; 0) máximo', '(±1; 0), ambos mínimos'], certa: 1, porque: '∇f = (3x² − 3; 2y) = 0 ⇒ x = ±1, y = 0. Hf = [ 6x 0 ; 0 2 ]: em (1; 0) os λ são 6 e 2; em (−1; 0) são −6 e 2.' },
      { modelo: 'schwarz', estado: { x0: 0.7, y0: 0.8 }, p: 'f(x; y) = x²y³. Quanto vale ∂²f/∂y∂x?', op: ['2y³', '6xy²', '6x²y', '3x²y²'], certa: 1, porque: '∂f/∂x = 2xy³ e ∂/∂y(2xy³) = 6xy². Pelo teorema de Schwarz dá o mesmo pela outra ordem.' },
      { p: 'Num ponto crítico, os valores próprios da Hessiana são todos negativos. Então:', op: ['é mínimo local', 'é máximo local', 'é sela', 'não se sabe'], certa: 1, porque: 'vᵀHv ≤ λ₁‖v‖² &lt; 0 em todas as direções: a superfície curva para baixo.' },
    ],
  });
})();
