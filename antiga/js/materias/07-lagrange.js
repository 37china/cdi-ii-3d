/* 7. Extremos condicionados: multiplicadores de Lagrange. */
(function () {
  const R2 = Math.SQRT2;
  const PI = Math.PI;

  /* curva do exemplo da aula: x² + y² = 2 e x + z = 1 */
  const curva = (t) => [R2 * Math.cos(t), R2 * Math.sin(t), 1 - R2 * Math.cos(t)];
  const dcurva = (t) => [-R2 * Math.sin(t), R2 * Math.cos(t), R2 * Math.sin(t)];
  const F3 = {
    z: { nome: '$f=z$ (exemplo da aula)', f: (p) => p[2], g: () => [0, 0, 1],
      pts: [{ t: PI, rot: 'A', tipo: 'máximo de $z$', txt: '$A=(-\\sqrt2;\\,0;\\,1+\\sqrt2)$, $z=1+\\sqrt2\\approx 2.41$' }, { t: 0, rot: 'B', tipo: 'mínimo de $z$', txt: '$B=(\\sqrt2;\\,0;\\,1-\\sqrt2)$, $z=1-\\sqrt2\\approx -0.41$' }] },
    d: { nome: '$f=x^2+y^2+z^2$', f: (p) => CM.dot(p, p), g: (p) => CM.mul(p, 2),
      pts: [{ t: PI, rot: 'A', tipo: 'máximo absoluto', txt: '$A$, $\\|A\\|=\\sqrt{5+2\\sqrt2}\\approx 2.80$' }, { t: PI / 4, rot: 'C_1', tipo: 'mínimo absoluto', txt: '$(1;\\,1;\\,0)$, distância $\\sqrt2\\approx1.41$' }, { t: -PI / 4, rot: 'C_2', tipo: 'mínimo absoluto', txt: '$(1;\\,-1;\\,0)$, distância $\\sqrt2$' }, { t: 0, rot: 'B', tipo: 'máximo local (não absoluto)', txt: '$B$, distância $\\sqrt{5-2\\sqrt2}\\approx 1.47$' }] },
    s: { nome: '$f=x+y+z$', f: (p) => p[0] + p[1] + p[2], g: () => [1, 1, 1],
      pts: [{ t: PI / 2, rot: 'M', tipo: 'máximo', txt: '$(0;\\,\\sqrt2;\\,1)$, $f=1+\\sqrt2$' }, { t: -PI / 2, rot: 'm', tipo: 'mínimo', txt: '$(0;\\,-\\sqrt2;\\,1)$, $f=1-\\sqrt2$' }] },
  };
  const F2 = {
    soma: { tex: 'x+y', f: (x, y) => x + y },
    prod: { tex: 'xy', f: (x, y) => x * y },
    elip: { tex: 'x^2+4y^2', f: (x, y) => x * x + 4 * y * y },
    dist: { tex: '(x-2)^2+(y-1)^2', f: (x, y) => (x - 2) ** 2 + (y - 1) ** 2 },
  };
  const G2 = {
    circ: { tex: 'x^2+y^2=1', g: (t) => [Math.cos(t), Math.sin(t)], G: (x, y) => x * x + y * y - 1, w: [-1.7, 1.7, -1.7, 1.7] },
    elip: { tex: '\\tfrac{x^2}{4}+y^2=1', g: (t) => [2 * Math.cos(t), Math.sin(t)], G: (x, y) => (x * x) / 4 + y * y - 1, w: [-2.5, 2.5, -1.5, 1.5] },
  };
  /* extremos de f sobre a restrição, achados numericamente em t */
  function candidatos(f, c) {
    const N = 1440, v = [];
    for (let i = 0; i < N; i++) v.push(f(...c.g((2 * PI * i) / N)));
    const out = [];
    for (let i = 0; i < N; i++) {
      const a = v[(i - 1 + N) % N], b = v[i], d = v[(i + 1) % N];
      if (b > a && b >= d) out.push({ t: (2 * PI * i) / N, max: true });
      else if (b < a && b <= d) out.push({ t: (2 * PI * i) / N, max: false });
    }
    // refinar por secção dourada
    return out.map((q) => {
      let lo = q.t - (2 * PI) / N, hi = q.t + (2 * PI) / N;
      const h = (t) => (q.max ? -1 : 1) * f(...c.g(t));
      for (let k = 0; k < 40; k++) { const m1 = lo + (hi - lo) * 0.382, m2 = lo + (hi - lo) * 0.618; if (h(m1) < h(m2)) hi = m2; else lo = m1; }
      const t = (((lo + hi) / 2) % (2 * PI) + 2 * PI) % (2 * PI);
      return { t, max: q.max, v: f(...c.g(t)) };
    });
  }

  CDI.materia({
    id: 'lagrange', ordem: 7, grupo: 'Cálculo diferencial', curto: 'Extremos condicionados', titulo: 'Extremos condicionados (Lagrange)', paginas: 'pp. 33–35',
    resumo: 'Máximos e mínimos de $f$ sobre uma curva ou superfície: $\\nabla f$ é combinação dos gradientes das restrições.',
    modelos: [
      {
        id: 'plano', nome: 'Uma restrição em ℝ²',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 2.1, alvo: [0, 0, 0.3], yaw: -0.75, pitch: 0.5, dica: 'Altura proporcional a f · arrasta para rodar' });
          const P = M.plano({ janela: [-2.6, 2.6, -1.9, 1.9] });
          M.escolha('f', { rot: 'Função $f(x;y)$', opcoes: Object.keys(F2).map((k) => [k, '$' + F2[k].tex + '$']), valor: 'soma' });
          M.escolha('g', { rot: 'Restrição $g=0$', opcoes: Object.keys(G2).map((k) => [k, '$' + G2[k].tex + '$']), valor: 'circ' });
          M.barra('t', { rot: '$t$', cor: cor.n, min: 0, max: 2 * PI, valor: 0.3, circular: true, nome: 'posição na restrição', dur: 9000 });
          M.caixa('np', { rot: 'Plano horizontal à altura $f(P)$', valor: true });
          M.botoes([['Ir para o extremo seguinte', () => { const cs = candidatos(F2[M.S.f].f, G2[M.S.g]).sort((a, b) => a.t - b.t); const q = cs.find((c) => c.t > M.S.t + 1e-3) || cs[0]; M.definir({ t: q.t }); }]]);
          let cache = null;
          const est = (S) => {
            const f = F2[S.f].f, c = G2[S.g], p = c.g(S.t), gf = CM.grad(f, ...p), gg = CM.grad(c.G, ...p);
            const par = Math.abs(gf[0] * gg[1] - gf[1] * gg[0]) / (Math.hypot(...gf) * Math.hypot(...gg) + 1e-12);
            const chave = S.f + S.g;
            if (!cache || cache.chave !== chave) {
              const [x0, x1, y0, y1] = c.w;
              let m = 0;
              for (let i = 0; i <= 20; i++) for (let j = 0; j <= 20; j++) m = Math.max(m, Math.abs(f(x0 + ((x1 - x0) * i) / 20, y0 + ((y1 - y0) * j) / 20)));
              cache = { chave, k: 1.5 / Math.max(m, 1e-9), cand: candidatos(f, c) };
            }
            return { f, c, p, gf, gg, par, k: cache.k, cand: cache.cand };
          };
          M.cena(V, (C, S) => {
            const { f, c, p, k, cand } = est(S);
            const [x0, x1, y0, y1] = c.w;
            C.eixos({ x: [x0 - 0.1, x1 + 0.2], y: [y0 - 0.1, y1 + 0.2], z: [-1.6, 1.9], nomes: ['x', 'y', 'f'] });
            C.grafico((x, y) => k * f(x, y), x0, x1, y0, y1, 44, { alfa: 0.5 });
            C.param((t) => [...c.g(t), 0.003], 0, 2 * PI, 160, { cor: cor.b, larg: 2, alfa: 0.8 });
            C.param((t) => [...c.g(t), k * f(...c.g(t))], 0, 2 * PI, 240, { cor: cor.b, larg: 3.6 });
            const z = k * f(...p);
            if (S.np) {
              C.poli([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], { cor: cor.ouro, alfa: 0.16, plano: 1 });
              C.segs(CM.contorno(f, x0, x1, y0, y1, 90, Math.round((90 * (y1 - y0)) / (x1 - x0)), f(...p)).map(([a, b]) => [[...a, z], [...b, z]]), { cor: cor.ouro, larg: 2.2 });
            }
            C.linha([...p, 0], [...p, z], { cor: cor.m, larg: 1.2, trac: [4, 3] });
            cand.forEach((q) => { const r = c.g(q.t); C.ponto([...r, k * q.v], { cor: q.max ? cor.r : cor.b, r: 3.6 }); });
            C.ponto([...p, z], { cor: cor.i, r: 5.5 });
            C.ponto([...p, 0], { cor: cor.i, r: 3 });
          });
          M.cena(P, (Gc, S) => {
            const { f, c, p, gf, gg, par } = est(S);
            Gc.eixos();
            const [x0, x1, y0, y1] = Gc.limites();
            const vs = []; for (let i = 0; i < 25; i++) vs.push(f(x0 + ((x1 - x0) * (i % 5)) / 4, y0 + ((y1 - y0) * Math.floor(i / 5)) / 4));
            const lo = Math.min(...vs), hi = Math.max(...vs);
            for (let i = 1; i < 16; i++) Gc.nivel(f, lo + ((hi - lo) * i) / 16, { cor: cor.m, larg: 1, alfa: 0.45 });
            Gc.param(c.g, 0, 2 * PI, 200, { cor: cor.b, larg: 3 });
            Gc.nivel(f, f(...p), { cor: cor.ouro, larg: 2 });
            const n1 = Math.hypot(...gf), n2 = Math.hypot(...gg);
            if (n1 > 1e-9) Gc.seta(p, CM.mul(gf, 0.6 / n1), { cor: cor.v, rot: '$∇f$' });
            if (n2 > 1e-9) Gc.seta(p, CM.mul(gg, 0.6 / n2), { cor: cor.n, rot: '$∇g$' });
            Gc.ponto(p, { cor: par < 0.02 ? cor.r : cor.i, r: par < 0.02 ? 7 : 5 });
          });
          M.leituras('No ponto $P$', (S) => {
            const { f, p, gf, gg, par } = est(S);
            const lam = CM.dot(gf, gg) / CM.dot(gg, gg);
            return [['$P=(x;y)$', '$' + TX.v(p, 3) + '$'], ['$f(P)$', '$' + TX.n(f(...p), 3) + '$'], ['$\\nabla f(P)$', '$' + TX.v(gf, 2) + '$'], ['$\\nabla g(P)$', '$' + TX.v(gg, 2) + '$'], ['$|\\sin\\angle(\\nabla f,\\nabla g)|$', '$' + TX.n(par, 3) + '$', par < 0.02 ? 'forte' : ''], par < 0.02 ? '<b>Candidato:</b> $\\nabla f=\\lambda\\nabla g$ com $\\lambda\\approx' + TX.n(lam, 3) + '$. O plano dourado toca a curva azul sem a cortar.' : 'O plano dourado corta a curva azul: andando sobre a restrição, $f$ sobe para um lado e desce para o outro.'];
          });
          M.texto('<b class="t">Ideia</b><p>Levantando a restrição até ao gráfico de $f$, a curva azul de cima mostra os valores de $f$ sobre $g=0$. Nos pontos mais altos e mais baixos dessa curva, o plano horizontal $z=f(P)$ <b>toca</b> a curva sem a cortar: lá em baixo, a linha de nível de $f$ é tangente à restrição e os gradientes são paralelos:</p>$$\\nabla f(a)=\\lambda\\,\\nabla g(a),\\qquad g(a)=0.$$', 'nota');
          M.legenda([[cor.b, 'restrição e a sua imagem no gráfico'], [cor.ouro, 'nível $f=f(P)$'], [cor.v, '$\\nabla f$'], [cor.n, '$\\nabla g$'], [cor.r, 'máximos']]);
        },
      },
      {
        id: 'espaco', nome: 'Duas restrições em ℝ³',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 2.2, alvo: [0, 0, 0.8] });
          const G = M.plano({ janela: [-0.2, 6.6, -1, 8.2], livre: true, dica: 'f ao longo da curva, em função de t' });
          M.escolha('f', { rot: 'Função a otimizar', opcoes: Object.keys(F3).map((k) => [k, F3[k].nome]), valor: 'z' });
          M.barra('t', { rot: '$t$', cor: cor.n, min: -PI, max: PI, valor: 2.2, circular: true, nome: 'posição na curva', dur: 9000 });
          M.caixa('sup', { rot: 'Cilindro e plano', valor: true });
          M.caixa('np', { rot: 'Plano de $\\nabla F_1$ e $\\nabla F_2$', valor: true });
          M.botoes([['Ir para o candidato seguinte', () => { const ps = F3[M.S.f].pts; const i = ps.findIndex((q) => Math.abs(Math.atan2(Math.sin(q.t - M.S.t), Math.cos(q.t - M.S.t))) < 1e-3); M.definir({ t: Math.atan2(Math.sin(ps[(i + 1) % ps.length].t), Math.cos(ps[(i + 1) % ps.length].t)) }); }]]);
          const est = (S) => {
            const fn = F3[S.f], p = curva(S.t), T = dcurva(S.t), gf = fn.g(p), g1 = [2 * p[0], 2 * p[1], 0], g2 = [1, 0, 1];
            return { fn, p, T, gf, g1, g2, proj: CM.dot(gf, T) / CM.len(T) };
          };
          M.cena(V, (C, S) => {
            const { fn, p, T, gf, g1, g2 } = est(S);
            C.eixos({ x: [-2, 2], y: [-2, 2], z: [-1, 3] });
            if (S.sup) {
              C.sup((u, v) => [R2 * Math.cos(u), R2 * Math.sin(u), v], 0, 2 * PI, -0.9, 2.9, 48, 8, { cor: cor.sup, alfa: 0.16, malha: false });
              C.sup((x, y) => [x, y, 1 - x], -1.8, 1.8, -1.8, 1.8, 6, 6, { cor: cor.n, alfa: 0.14, plano: 1, malha: false });
            }
            C.param(curva, 0, 2 * PI, 160, { cor: cor.b, larg: 3.4 });
            if (S.np) {
              const e1 = CM.nrm(g1), e2 = CM.nrm(CM.sub(g2, CM.mul(e1, CM.dot(g2, e1))));
              const q = (a, b) => CM.add(p, CM.add(CM.mul(e1, a), CM.mul(e2, b)));
              C.poli([q(-0.6, -0.6), q(0.6, -0.6), q(0.6, 0.6), q(-0.6, 0.6)], { cor: cor.n, alfa: 0.22, plano: 1 });
            }
            C.seta(p, CM.mul(CM.nrm(T), 0.6), { cor: cor.ouro, rot: '$T$' });
            C.seta(p, CM.mul(CM.nrm(g1), 0.6), { cor: cor.n, rot: '$\\nabla F_1$' });
            C.seta(p, CM.mul(CM.nrm(g2), 0.6), { cor: cor.u, rot: '$\\nabla F_2$' });
            const n = CM.len(gf);
            if (n > 1e-9) C.seta(p, CM.mul(gf, 0.8 / Math.max(n, 1)), { cor: cor.v, rot: '$\\nabla f$', larg: 3.2 });
            fn.pts.forEach((q) => C.ponto(curva(q.t), { cor: cor.r, r: 4.5, rot: '$' + q.rot + '$' }));
            C.ponto(p, { cor: cor.i });
          });
          M.cena(G, (Gc, S) => {
            const { fn } = est(S);
            G.j0 = [-PI - 0.2, PI + 0.2, -1, 8.2];
            G.c = [0, 3.6];
            Gc.eixos(['t', 'f']);
            Gc.param((t) => [t, fn.f(curva(t))], -PI, PI, 300, { cor: cor.b, larg: 2.4 });
            fn.pts.forEach((q) => { const t = Math.atan2(Math.sin(q.t), Math.cos(q.t)); Gc.ponto([t, fn.f(curva(t))], { cor: cor.r, r: 4, rot: q.rot.replace('_1', '₁').replace('_2', '₂') }); });
            Gc.ponto([S.t, fn.f(curva(S.t))], { cor: cor.i });
          });
          M.leituras('No ponto da curva', (S) => {
            const { fn, p, gf, proj } = est(S);
            const perto = fn.pts.find((q) => Math.abs(Math.atan2(Math.sin(q.t - S.t), Math.cos(q.t - S.t))) < 1e-3);
            const r = [['$(x;y;z)$', '$' + TX.v(p, 3) + '$'], ['$f$', '$' + TX.n(fn.f(p), 3) + '$'], ['$\\nabla f$', '$' + TX.v(gf, 2) + '$'], ['$\\nabla f\\cdot T$ (componente tangente)', '$' + TX.n(proj, 3) + '$', Math.abs(proj) < 1e-3 ? 'forte' : '']];
            r.push(perto ? `<b>$${perto.rot}$: ${perto.tipo}.</b> ${perto.txt}` : Math.abs(proj) < 1e-3 ? 'Candidato: $\\nabla f$ está no plano de $\\nabla F_1$ e $\\nabla F_2$.' : '$\\nabla f$ tem componente ao longo da curva: andando para um dos lados, $f$ aumenta. Não é extremo.');
            return r;
          });
          M.leituras('Candidatos (sistema de Lagrange)', (S) => F3[S.f].pts.map((q) => `<b>$${q.rot}$</b> · ${q.tipo}: ${q.txt}`));
          M.texto('<b class="t">Método dos multiplicadores de Lagrange</b><p>Extremos de $f:\\mathbb R^n\\to\\mathbb R$ ($C^1$) sujeitos a $F(x)=0$, $F:\\mathbb R^n\\to\\mathbb R^m$ ($C^1$, $m&lt;n$), com $\\nabla F_1(a),\\dots,\\nabla F_m(a)$ linearmente independentes:</p>$$\\nabla f(a)=\\lambda_1\\nabla F_1(a)+\\dots+\\lambda_m\\nabla F_m(a),\\qquad F(a)=0.$$<p>Exemplo das teóricas: $x^2+y^2=2$ e $x+z=1$, com $f=z$. O sistema $(0;0;1)=\\lambda_1(2x;2y;0)+\\lambda_2(1;0;1)$ dá $y=0$, $x=\\pm\\sqrt2$, $z=1\\mp\\sqrt2$. O conjunto é compacto e $f$ é contínua, por isso o máximo e o mínimo existem e estão entre os candidatos.</p>', 'nota');
          M.legenda([[cor.b, 'curva $x^2+y^2=2,\\ x+z=1$'], [cor.ouro, 'tangente $T$'], [cor.v, '$\\nabla f$'], [cor.n, '$\\nabla F_1=(2x;2y;0)$'], [cor.u, '$\\nabla F_2=(1;0;1)$']]);
        },
      },
    ],
    explicar: [
      { modelo: 'plano', titulo: 'O problema', estado: { f: 'soma', g: 'circ', t: 0.3, np: false }, vista: [-0.75, 0.5], texto: '<p>Máximo e mínimo de $f(x;y)=x+y$ sobre a circunferência $x^2+y^2=1$. Só contam os pontos da curva azul no chão.</p><p>Por cima está o gráfico de $f$. Levantando a circunferência até ao gráfico obtém-se uma curva fechada no espaço: o problema é encontrar o seu ponto mais alto e o mais baixo.</p>' },
      { modelo: 'plano', titulo: 'Não extremo: o nível corta', estado: { f: 'soma', g: 'circ', t: 0.3, np: true }, texto: '<p>O plano dourado $z=f(P)$ corta a curva levantada: há pontos da restrição acima e abaixo de $P$. Lá em baixo, a linha de nível de $f$ atravessa a circunferência e $\\nabla f$ não é paralelo a $\\nabla g$.</p>' },
      { modelo: 'plano', titulo: 'Extremo: tangência', estado: { f: 'soma', g: 'circ', t: PI / 4, np: true }, texto: '<p>Em $\\big(\\tfrac{\\sqrt2}{2};\\tfrac{\\sqrt2}{2}\\big)$ o plano $z=\\sqrt2$ só toca a curva levantada. A linha de nível $x+y=\\sqrt2$ é tangente à circunferência e $\\nabla f=(1;1)$ é paralelo a $\\nabla g=(\\sqrt2;\\sqrt2)$. Máximo: $f=\\sqrt2$.</p>$$\\nabla f=\\lambda\\nabla g,\\qquad g=0$$' },
      { modelo: 'plano', titulo: 'Funções com mais extremos', estado: { f: 'prod', g: 'elip', t: 0.6, np: true }, texto: '<p>$f=xy$ sobre a elipse $\\tfrac{x^2}{4}+y^2=1$: a curva levantada sobe e desce duas vezes. Há dois máximos ($f=1$, em $\\pm(\\sqrt2;\\tfrac{\\sqrt2}{2})$) e dois mínimos ($f=-1$). Usa «Ir para o extremo seguinte».</p>' },
      { modelo: 'espaco', titulo: 'Duas restrições: uma curva', estado: { f: 'z', t: 2.2, sup: true, np: true }, vista: [0.9, 0.35], texto: '<p>$x^2+y^2=2$ (cilindro) e $x+z=1$ (plano) cortam-se numa elipse. Queremos o ponto com $z$ maior.</p><p>$\\nabla F_1$ e $\\nabla F_2$ geram o plano roxo, perpendicular à curva.</p>' },
      { modelo: 'espaco', titulo: 'A condição de Lagrange', estado: { f: 'z', t: PI, np: true }, texto: '<p>Num extremo, $\\nabla f$ não pode ter componente ao longo da curva: $\\nabla f\\cdot T=0$, isto é, $\\nabla f$ fica no plano de $\\nabla F_1$ e $\\nabla F_2$:</p>$$\\nabla f=\\lambda_1\\nabla F_1+\\lambda_2\\nabla F_2.$$<p>Em $A=(-\\sqrt2;0;1+\\sqrt2)$, $\\nabla F_1=(-2\\sqrt2;0;0)$ e $\\nabla f=(0;0;1)=\\tfrac{1}{2\\sqrt2}\\nabla F_1+\\nabla F_2$. É o ponto com $z$ maior.</p>' },
      { modelo: 'espaco', titulo: 'Porque existem extremos', estado: { f: 'z', t: 0 }, texto: '<p>A curva é fechada e limitada (compacta) e $f$ é contínua: pelo teorema de Weierstrass, $f$ atinge máximo e mínimo. Como só há dois candidatos, $A$ é o máximo e $B=(\\sqrt2;0;1-\\sqrt2)$ é o mínimo de $z$.</p>' },
      { modelo: 'espaco', titulo: 'Mudar f muda os pontos', estado: { f: 'd', t: PI / 4 }, texto: '<p>Para a distância à origem, a função é $f=x^2+y^2+z^2$ e os candidatos são outros.</p><p>Na curva, $f=2+(1-x)^2$: mínimo em $x=1$, nos pontos $(1;\\pm1;0)$, à distância $\\sqrt2$. O ponto mais longe é $A$. $B$ não é o mais perto: é só um máximo local.</p>' },
    ],
    testa: [
      { modelo: 'espaco', estado: { f: 'z', t: 2 }, p: 'Na curva $x^2+y^2=2$, $x+z=1$, qual é o ponto com $z$ maior?', op: ['$(\\sqrt2;0;1-\\sqrt2)$', '$(-\\sqrt2;0;1+\\sqrt2)$', '$(0;\\sqrt2;1)$', '$(1;1;0)$'], certa: 1, porque: '$z=1-x$ é máximo quando $x$ é mínimo, $x=-\\sqrt2$ (e então $y=0$).' },
      { modelo: 'espaco', estado: { f: 'd', t: 1 }, p: 'E o ponto da mesma curva mais próximo da origem?', op: ['$(\\sqrt2;0;1-\\sqrt2)$', '$(1;\\pm1;0)$, à distância $\\sqrt2$', '$(0;0;1)$', '$(-\\sqrt2;0;1+\\sqrt2)$'], certa: 1, porque: 'Na curva, $x^2+y^2+z^2=2+(1-x)^2$, mínimo em $x=1$. $(\\sqrt2;0;1-\\sqrt2)$ dá $\\sqrt{5-2\\sqrt2}\\approx1.47&gt;\\sqrt2$.' },
      { p: 'Porque é que $f$ contínua tem máximo e mínimo sobre $\\{x^2+y^2=2,\\ x+z=1\\}$?', op: ['Porque $\\nabla f\\ne0$', 'Porque o conjunto é compacto (fechado e limitado)', 'Porque o conjunto é aberto', 'Porque há duas restrições'], certa: 1, porque: 'Teorema de Weierstrass: uma função contínua num compacto atinge máximo e mínimo. O método de Lagrange encontra os candidatos.' },
      { p: 'O método de Lagrange com duas restrições exige que:', op: ['$\\nabla f(a)=0$', '$\\nabla F_1(a)$ e $\\nabla F_2(a)$ sejam linearmente independentes', '$f$ seja linear', '$\\lambda_1=\\lambda_2$'], certa: 1, porque: '$DF(a)$ tem de ter característica máxima. Senão o conjunto pode não ser uma curva lisa perto de $a$.' },
      { modelo: 'plano', estado: { f: 'soma', g: 'circ', t: 0.785, np: true }, p: 'Máximo de $x+y$ sobre $x^2+y^2=1$:', op: ['$1$', '$2$', '$\\sqrt2$', '$\\tfrac{1}{\\sqrt2}$'], certa: 2, porque: '$(1;1)=\\lambda(2x;2y)\\Rightarrow x=y=\\pm\\tfrac{1}{\\sqrt2}$. O máximo é $\\tfrac{2}{\\sqrt2}=\\sqrt2$.' },
      { modelo: 'plano', estado: { f: 'soma', g: 'circ', t: 2, np: true }, p: 'No modelo 3D, como se reconhece um extremo de $f$ sobre $g=0$?', op: ['O gráfico de $f$ tem tangente horizontal', 'O plano $z=f(P)$ toca a curva levantada sem a cortar', 'A curva azul passa pela origem', '$\\nabla f=0$'], certa: 1, porque: 'Num máximo (mínimo) condicionado, todos os pontos da restrição perto de $P$ ficam abaixo (acima) do nível $f(P)$. $\\nabla f$ não precisa de ser $0$: aqui é sempre $(1;1)$.' },
    ],
  });
})();
