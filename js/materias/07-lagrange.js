/* 7. Extremos condicionados: multiplicadores de Lagrange. */
(function () {
  const OURO = '#D9A21B';
  const R2 = Math.SQRT2;

  /* curva do exemplo da aula: x² + y² = 2 e x + z = 1 */
  const curva = (t) => [R2 * Math.cos(t), R2 * Math.sin(t), 1 - R2 * Math.cos(t)];
  const dcurva = (t) => [-R2 * Math.sin(t), R2 * Math.cos(t), R2 * Math.sin(t)];
  const F3 = {
    z: { nome: 'f = z (exemplo da aula)', f: (p) => p[2], g: () => [0, 0, 1],
      pts: [{ t: Math.PI, rot: 'A', tipo: 'máximo de z', txt: 'A = (−√2; 0; 1 + √2), z = 1 + √2 ≈ 2.41' }, { t: 0, rot: 'B', tipo: 'mínimo de z', txt: 'B = (√2; 0; 1 − √2), z = 1 − √2 ≈ −0.41' }] },
    d: { nome: 'f = x² + y² + z² (distância² à origem)', f: (p) => CM.dot(p, p), g: (p) => CM.mul(p, 2),
      pts: [{ t: Math.PI, rot: 'A', tipo: 'máximo absoluto', txt: 'A = (−√2; 0; 1 + √2), ‖A‖ = √(5 + 2√2) ≈ 2.80' }, { t: Math.PI / 4, rot: 'C₁', tipo: 'mínimo absoluto', txt: '(1; 1; 0), distância √2 ≈ 1.41' }, { t: -Math.PI / 4, rot: 'C₂', tipo: 'mínimo absoluto', txt: '(1; −1; 0), distância √2 ≈ 1.41' }, { t: 0, rot: 'B', tipo: 'máximo local (não absoluto)', txt: 'B = (√2; 0; 1 − √2), distância √(5 − 2√2) ≈ 1.47' }] },
    s: { nome: 'f = x + y + z', f: (p) => p[0] + p[1] + p[2], g: () => [1, 1, 1],
      pts: [{ t: Math.PI / 2, rot: 'M', tipo: 'máximo', txt: '(0; √2; 1), f = 1 + √2' }, { t: -Math.PI / 2, rot: 'm', tipo: 'mínimo', txt: '(0; −√2; 1), f = 1 − √2' }] },
  };
  const F2 = {
    soma: { nome: 'x + y', f: (x, y) => x + y },
    prod: { nome: 'xy', f: (x, y) => x * y },
    elip: { nome: 'x² + 4y²', f: (x, y) => x * x + 4 * y * y },
    dist: { nome: '(x − 2)² + (y − 1)²', f: (x, y) => (x - 2) ** 2 + (y - 1) ** 2 },
  };
  const G2 = {
    circ: { nome: 'x² + y² = 1', g: (t) => [Math.cos(t), Math.sin(t)], G: (x, y) => x * x + y * y - 1 },
    elip: { nome: 'x²/4 + y² = 1', g: (t) => [2 * Math.cos(t), Math.sin(t)], G: (x, y) => (x * x) / 4 + y * y - 1 },
  };

  CDI.materia({
    id: 'lagrange', ordem: 7, grupo: 'Cálculo diferencial', curto: 'Extremos condicionados', titulo: 'Extremos condicionados (Lagrange)', paginas: 'pp. 33–35',
    resumo: 'Máximos e mínimos de f sobre uma curva ou superfície: ∇f é combinação dos gradientes das restrições.',
    modelos: [
      {
        id: 'plano', nome: 'Uma restrição em ℝ²',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.6, 2.6, -1.9, 1.9] });
          const G = M.plano({ janela: [-0.2, 6.6, -2, 6], livre: true, dica: 'f ao longo da restrição, em função de t' });
          M.escolha('f', { rot: 'f(x; y)', opcoes: Object.keys(F2).map((k) => [k, F2[k].nome]), valor: 'soma', mono: true });
          M.escolha('g', { rot: 'restrição', opcoes: Object.keys(G2).map((k) => [k, G2[k].nome]), valor: 'circ', mono: true });
          M.barra('t', { rot: 't', cor: cor.n, min: 0, max: 2 * Math.PI, valor: 0.3, circular: true, nome: 'posição na restrição', dur: 8000 });
          const est = (S) => {
            const f = F2[S.f].f, c = G2[S.g], p = c.g(S.t), gf = CM.grad(f, ...p), gg = CM.grad(c.G, ...p);
            const cr = gf[0] * gg[1] - gf[1] * gg[0];
            return { f, c, p, gf, gg, par: Math.abs(cr) / (Math.hypot(...gf) * Math.hypot(...gg) + 1e-12) };
          };
          M.cena(P, (Gc, S) => {
            const { f, c, p, gf, gg, par } = est(S);
            Gc.eixos();
            const [x0, x1, y0, y1] = Gc.limites();
            const vs = []; for (let i = 0; i < 25; i++) vs.push(f(x0 + ((x1 - x0) * (i % 5)) / 4, y0 + ((y1 - y0) * Math.floor(i / 5)) / 4));
            const lo = Math.min(...vs), hi = Math.max(...vs);
            for (let i = 1; i < 16; i++) Gc.nivel(f, lo + ((hi - lo) * i) / 16, { cor: cor.m, larg: 1, alfa: 0.45 });
            Gc.param(c.g, 0, 2 * Math.PI, 200, { cor: cor.b, larg: 3 });
            Gc.nivel(f, f(...p), { cor: OURO, larg: 2 });
            const n1 = Math.hypot(...gf), n2 = Math.hypot(...gg);
            if (n1 > 1e-9) Gc.seta(p, CM.mul(gf, 0.6 / n1), { cor: cor.v, rot: '∇f' });
            if (n2 > 1e-9) Gc.seta(p, CM.mul(gg, 0.6 / n2), { cor: cor.n, rot: '∇g' });
            Gc.ponto(p, { cor: par < 0.02 ? cor.r : cor.i, r: par < 0.02 ? 7 : 5 });
          });
          M.cena(G, (Gc, S) => {
            const { f, c } = est(S);
            Gc.eixos(['t', 'f']);
            Gc.param((t) => [t, f(...c.g(t))], 0, 2 * Math.PI, 300, { cor: cor.b, larg: 2.4 });
            Gc.ponto([S.t, f(...c.g(S.t))], { cor: cor.n });
          });
          M.leituras('No ponto', (S) => {
            const { f, p, gf, gg, par } = est(S);
            const lam = CM.dot(gf, gg) / CM.dot(gg, gg);
            return [['(x; y)', CM.pt(p)], ['f(x; y)', CM.fmt(f(...p), 3)], ['∇f', CM.pt(gf)], ['∇g', CM.pt(gg)], ['|sen do ângulo| entre ∇f e ∇g', CM.fmt(par, 3), par < 0.02 ? 'forte' : ''], par < 0.02 ? `∇f = λ∇g com λ ≈ ${CM.fmt(lam, 3)}: candidato a extremo. A linha de nível de f é tangente à restrição.` : 'Aqui a linha de nível dourada atravessa a restrição: andando sobre a curva, f ainda sobe para um lado e desce para o outro.'];
          });
          M.texto('<b class="t">Ideia</b><p>Num extremo de f sobre a curva g = 0, a linha de nível de f toca a curva sem a atravessar. As duas têm a mesma tangente, por isso os gradientes são paralelos:</p><p class="f">∇f(a) = λ ∇g(a), g(a) = 0.</p><p>Carrega em ▶ ao lado de t e repara que o ponto fica vermelho exatamente nos máximos e mínimos do gráfico de baixo.</p>', 'nota');
          M.legenda([[cor.b, 'restrição g = 0'], [OURO, 'linha de nível de f pelo ponto'], [cor.v, '∇f'], [cor.n, '∇g']]);
        },
      },
      {
        id: 'espaco', nome: 'Duas restrições em ℝ³',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 2.2, alvo: [0, 0, 0.8] });
          const G = M.plano({ janela: [-0.2, 6.6, -1, 8.2], livre: true, dica: 'f ao longo da curva, em função de t' });
          M.escolha('f', { rot: 'Função a otimizar', opcoes: Object.keys(F3).map((k) => [k, F3[k].nome]), valor: 'z' });
          M.barra('t', { rot: 't', cor: cor.n, min: -Math.PI, max: Math.PI, valor: 2.2, circular: true, nome: 'posição na curva', dur: 9000 });
          M.caixa('sup', { rot: 'Cilindro e plano', valor: true });
          M.caixa('np', { rot: 'Plano de ∇F₁ e ∇F₂', valor: true });
          M.botoes([['Ir para o candidato seguinte', () => { const ps = F3[M.S.f].pts; const i = ps.findIndex((q) => Math.abs(Math.atan2(Math.sin(q.t - M.S.t), Math.cos(q.t - M.S.t))) < 1e-3); M.definir({ t: Math.atan2(Math.sin(ps[(i + 1) % ps.length].t), Math.cos(ps[(i + 1) % ps.length].t)) }); }]]);
          const est = (S) => {
            const fn = F3[S.f], p = curva(S.t), T = dcurva(S.t), gf = fn.g(p), g1 = [2 * p[0], 2 * p[1], 0], g2 = [1, 0, 1];
            const N = CM.cross(g1, g2);
            const proj = CM.dot(gf, T) / CM.len(T);
            return { fn, p, T, gf, g1, g2, N, proj };
          };
          M.cena(V, (C, S) => {
            const { fn, p, T, gf, g1, g2 } = est(S);
            C.eixos({ x: [-2, 2], y: [-2, 2], z: [-1, 3] });
            if (S.sup) {
              C.sup((u, v) => [R2 * Math.cos(u), R2 * Math.sin(u), v], 0, 2 * Math.PI, -0.9, 2.9, 36, 6, { cor: cor.sup, corTras: cor.sup, alfa: 0.12, malha: false });
              C.sup((x, y) => [x, y, 1 - x], -1.8, 1.8, -1.8, 1.8, 6, 6, { cor: cor.n, alfa: 0.1, plano: 1, malha: false });
            }
            C.param(curva, 0, 2 * Math.PI, 160, { cor: cor.b, larg: 3.4 });
            if (S.np) {
              const e1 = CM.nrm(g1), e2 = CM.nrm(CM.sub(g2, CM.mul(e1, CM.dot(g2, e1))));
              const q = (a, b) => CM.add(p, CM.add(CM.mul(e1, a), CM.mul(e2, b)));
              C.poli([q(-0.6, -0.6), q(0.6, -0.6), q(0.6, 0.6), q(-0.6, 0.6)], { cor: cor.n, alfa: 0.18, plano: 1 });
            }
            C.seta(p, CM.mul(CM.nrm(T), 0.6), { cor: OURO, rot: 'T' });
            C.seta(p, CM.mul(CM.nrm(g1), 0.6), { cor: cor.n, rot: '∇F₁' });
            C.seta(p, CM.mul(CM.nrm(g2), 0.6), { cor: cor.u, rot: '∇F₂' });
            const n = CM.len(gf);
            if (n > 1e-9) C.seta(p, CM.mul(gf, 0.8 / Math.max(n, 1)), { cor: cor.v, rot: '∇f', larg: 3 });
            fn.pts.forEach((q) => C.ponto(curva(q.t), { cor: cor.r, r: 4.5, rot: q.rot }));
            C.ponto(p, { cor: cor.i });
          });
          M.cena(G, (Gc, S) => {
            const { fn } = est(S);
            G.j0 = [-Math.PI - 0.2, Math.PI + 0.2, -1, 8.2];
            G.c = [0, 3.6];
            Gc.eixos(['t', 'f']);
            Gc.param((t) => [t, fn.f(curva(t))], -Math.PI, Math.PI, 300, { cor: cor.b, larg: 2.4 });
            fn.pts.forEach((q) => { const t = Math.atan2(Math.sin(q.t), Math.cos(q.t)); Gc.ponto([t, fn.f(curva(t))], { cor: cor.r, r: 4, rot: q.rot }); });
            Gc.ponto([S.t, fn.f(curva(S.t))], { cor: cor.i });
          });
          M.leituras('No ponto da curva', (S) => {
            const { fn, p, gf, proj } = est(S);
            const perto = fn.pts.find((q) => Math.abs(Math.atan2(Math.sin(q.t - S.t), Math.cos(q.t - S.t))) < 1e-3);
            const r = [['(x; y; z)', CM.pt(p)], ['f', CM.fmt(fn.f(p), 3)], ['∇f', CM.pt(gf)], ['∇f · T (componente tangente)', CM.fmt(proj, 3), Math.abs(proj) < 1e-3 ? 'forte' : '']];
            r.push(perto ? `<b>${perto.rot}: ${perto.tipo}.</b> ${perto.txt}` : Math.abs(proj) < 1e-3 ? 'Candidato: ∇f está no plano de ∇F₁ e ∇F₂.' : '∇f tem componente ao longo da curva: andando para um dos lados, f aumenta. Não é extremo.');
            return r;
          });
          M.leituras('Candidatos (sistema de Lagrange)', (S) => F3[S.f].pts.map((q) => `<b>${q.rot}</b> · ${q.tipo}: ${q.txt}`));
          M.texto('<b class="t">Método dos multiplicadores de Lagrange</b><p>Extremos de f : ℝⁿ → ℝ (C¹) sujeitos a F(x) = 0, F : ℝⁿ → ℝᵐ (C¹, m &lt; n), com ∇F₁(a), …, ∇Fₘ(a) linearmente independentes:</p><p class="f">∇f(a) = λ₁∇F₁(a) + … + λₘ∇Fₘ(a), F(a) = 0.</p><p>Exemplo das teóricas: x² + y² = 2 e x + z = 1, com f = z. O sistema (0; 0; 1) = λ₁(2x; 2y; 0) + λ₂(1; 0; 1) dá y = 0, x = ±√2, z = 1 ∓ √2. O conjunto é fechado e limitado (compacto) e f é contínua, por isso o máximo e o mínimo existem e estão entre os candidatos.</p>', 'nota');
          M.legenda([[cor.b, 'curva: x² + y² = 2, x + z = 1'], [OURO, 'tangente T'], [cor.v, '∇f'], [cor.n, '∇F₁ = (2x; 2y; 0)'], [cor.u, '∇F₂ = (1; 0; 1)']]);
        },
      },
    ],
    explicar: [
      { modelo: 'plano', titulo: 'O problema', estado: { f: 'soma', g: 'circ', t: 0.3 }, texto: '<p>Máximo e mínimo de f(x; y) = x + y sobre a circunferência x² + y² = 1. Só contam os pontos da curva azul.</p><p>O gráfico de baixo é f ao longo da curva, com t como parâmetro.</p>' },
      { modelo: 'plano', titulo: 'Não extremo: a linha de nível atravessa', estado: { f: 'soma', g: 'circ', t: 0.3 }, texto: '<p>Neste ponto, a linha de nível de f (dourada) corta a circunferência. Andando sobre a curva para um lado f aumenta, para o outro diminui.</p><p>∇f e ∇g não são paralelos.</p>' },
      { modelo: 'plano', titulo: 'Extremo: tangência', estado: { f: 'soma', g: 'circ', t: Math.PI / 4 }, texto: '<p>Em (√2/2; √2/2) a linha de nível x + y = √2 toca a circunferência: ∇f = (1; 1) é paralelo a ∇g = (√2; √2). Máximo: f = √2.</p><p class="f">∇f = λ∇g, g = 0</p>' },
      { modelo: 'espaco', titulo: 'Duas restrições: uma curva', estado: { f: 'z', t: 2.2, sup: true, np: true }, vista: [0.9, 0.35], texto: '<p>x² + y² = 2 (cilindro) e x + z = 1 (plano) cortam-se numa elipse. Queremos o ponto com z maior.</p><p>∇F₁ e ∇F₂ geram o plano roxo, perpendicular à curva.</p>' },
      { modelo: 'espaco', titulo: 'A condição de Lagrange', estado: { f: 'z', t: Math.PI, np: true }, texto: '<p>Num extremo, ∇f não pode ter componente ao longo da curva: ∇f · T = 0, isto é, ∇f fica no plano de ∇F₁ e ∇F₂:</p><p class="f">∇f = λ₁∇F₁ + λ₂∇F₂.</p><p>Em A = (−√2; 0; 1 + √2), ∇F₁ = (−2√2; 0; 0) e ∇f = (0; 0; 1) = (1/(2√2))·∇F₁ + ∇F₂. É o ponto com z maior.</p>' },
      { modelo: 'espaco', titulo: 'Porque existem extremos', estado: { f: 'z', t: 0 }, texto: '<p>A curva é fechada e limitada (compacta) e f é contínua: pelo teorema de Weierstrass, f atinge máximo e mínimo. Como só há dois candidatos, A é o máximo e B = (√2; 0; 1 − √2) é o mínimo de z.</p>' },
      { modelo: 'espaco', titulo: 'Mudar f muda os pontos', estado: { f: 'd', t: Math.PI / 4 }, texto: '<p>Se a pergunta for a distância à origem, a função é f = x² + y² + z², e os candidatos são outros.</p><p>Na curva, f = 2 + (1 − x)²: mínimo em x = 1, nos pontos (1; ±1; 0), à distância √2. O ponto mais longe é A. B não é o mais perto: é só um máximo local.</p>' },
    ],
    testa: [
      { modelo: 'espaco', estado: { f: 'z', t: 2 }, p: 'Na curva x² + y² = 2, x + z = 1, qual é o ponto com z maior?', op: ['(√2; 0; 1 − √2)', '(−√2; 0; 1 + √2)', '(0; √2; 1)', '(1; 1; 0)'], certa: 1, porque: 'z = 1 − x é máximo quando x é mínimo, x = −√2 (e então y = 0).' },
      { modelo: 'espaco', estado: { f: 'd', t: 1 }, p: 'E o ponto da mesma curva mais próximo da origem?', op: ['(√2; 0; 1 − √2)', '(1; ±1; 0), à distância √2', '(0; 0; 1)', '(−√2; 0; 1 + √2)'], certa: 1, porque: 'Na curva, x² + y² + z² = 2 + (1 − x)², mínimo em x = 1. (√2; 0; 1 − √2) dá √(5 − 2√2) ≈ 1.47 &gt; √2.' },
      { p: 'Porque é que f contínua tem máximo e mínimo sobre {x² + y² = 2, x + z = 1}?', op: ['Porque ∇f ≠ 0', 'Porque o conjunto é compacto (fechado e limitado)', 'Porque o conjunto é aberto', 'Porque há duas restrições'], certa: 1, porque: 'Teorema de Weierstrass: uma função contínua num compacto atinge máximo e mínimo. O método de Lagrange encontra os candidatos.' },
      { p: 'O método de Lagrange com duas restrições exige que:', op: ['∇f(a) = 0', '∇F₁(a) e ∇F₂(a) sejam linearmente independentes', 'f seja linear', 'λ₁ = λ₂'], certa: 1, porque: 'É preciso DF(a) ter característica máxima (cada linha linearmente independente). Senão o conjunto pode não ser uma curva lisa perto de a.' },
      { modelo: 'plano', estado: { f: 'soma', g: 'circ', t: 0.785 }, p: 'Máximo de x + y sobre x² + y² = 1:', op: ['1', '2', '√2', '1/√2'], certa: 2, porque: '(1; 1) = λ(2x; 2y) ⇒ x = y = ±1/√2. O máximo é 2/√2 = √2.' },
    ],
  });
})();
