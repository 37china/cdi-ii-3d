/* 6. Teoremas da função inversa e da função implícita. */
(function () {
  const OURO = '#D9A21B';

  /* ---------- implícita: curvas F(x; y) = 0 ---------- */
  const IM = {
    circ: { nome: 'x² + y² = 1', F: (x, y) => x * x + y * y - 1, Fx: (x) => 2 * x, Fy: (x, y) => 2 * y, p: [0.6, 0.8], j: [-1.8, 1.8, -1.5, 1.5], tx: 'y = √(1 − x²) perto de pontos com y &gt; 0 e y = −√(1 − x²) com y &lt; 0' },
    sen: { nome: 'x + y + sen(xy) = 1', F: (x, y) => x + y + Math.sin(x * y) - 1, Fx: (x, y) => 1 + y * Math.cos(x * y), Fy: (x, y) => 1 + x * Math.cos(x * y), p: [0, 1], j: [-3, 3, -2.4, 2.6], tx: 'não se consegue isolar y, mas o teorema garante que y(x) existe perto de (0; 1)' },
    reta: { nome: 'x + y = 1', F: (x, y) => x + y - 1, Fx: () => 1, Fy: () => 1, p: [0.4, 0.6], j: [-1.5, 2.5, -1.5, 2.5], tx: 'y = 1 − x e x = 1 − y: soluções globais' },
    cusp: { nome: 'y² = x³', F: (x, y) => y * y - x ** 3, Fx: (x) => -3 * x * x, Fy: (x, y) => 2 * y, p: [1, 1], j: [-0.8, 2, -1.6, 1.6], tx: 'y = ±x^(3/2): na origem ∂F/∂y = ∂F/∂x = 0 e a curva tem um bico' },
  };
  /* projeta p na curva F = 0 (Newton na direção do gradiente) */
  function projetar(c, p) {
    let [x, y] = p;
    for (let i = 0; i < 30; i++) {
      const f = c.F(x, y), gx = c.Fx(x, y), gy = c.Fy(x, y), n = gx * gx + gy * gy;
      if (n < 1e-12) break;
      x -= (f * gx) / n; y -= (f * gy) / n;
      if (Math.abs(f) < 1e-12) break;
    }
    return [x, y];
  }
  /* ramo local y(x) a partir de (x0, y0), continuação passo a passo */
  function ramo(c, x0, y0, d, dir) {
    const pts = [[x0, y0]];
    let y = y0;
    const n = 40;
    for (let i = 1; i <= n; i++) {
      const x = x0 + (dir * d * i) / n;
      let yy = y;
      for (let k = 0; k < 20; k++) { const fy = c.Fy(x, yy); if (Math.abs(fy) < 1e-9) { yy = NaN; break; } const dy = c.F(x, yy) / fy; yy -= dy; if (Math.abs(dy) < 1e-12) break; }
      if (!isFinite(yy) || Math.abs(yy - y) > 0.25) break;
      y = yy; pts.push([x, y]);
    }
    return pts;
  }

  /* ---------- inversa: aplicações ℝ² → ℝ² ---------- */
  const MP = {
    aula: { nome: '(xy; y/x)', g: (x, y) => [x * y, y / x], a: [2, 2], j: [-0.5, 3.5, -0.5, 3.5], dom: (x) => Math.abs(x) > 1e-6, det: 'det = y/x + y/x = 2y/x' },
    pol: { nome: '(r cos θ; r sen θ)', g: (r, t) => [r * Math.cos(t), r * Math.sin(t)], a: [1, 0.8], j: [-0.5, 3, -0.5, 3.6], det: 'det = r' },
    exp: { nome: '(eˣ cos y; eˣ sen y)', g: (x, y) => [Math.exp(x) * Math.cos(y), Math.exp(x) * Math.sin(y)], a: [0, 0.6], j: [-1.2, 1.2, -0.5, 7.2], det: 'det = e²ˣ &gt; 0 em todo o ℝ²' },
    dobra: { nome: '(x² − y²; 2xy)', g: (x, y) => [x * x - y * y, 2 * x * y], a: [0.8, 0.5], j: [-1.5, 1.5, -1.2, 1.2], det: 'det = 4(x² + y²), nulo só na origem' },
  };

  CDI.materia({
    id: 'inversa', ordem: 6, grupo: 'Cálculo diferencial', curto: 'Inversa e implícita', titulo: 'Função inversa e função implícita', paginas: 'pp. 27–33',
    resumo: 'Quando se pode inverter uma função ou resolver F(x; y) = 0 em ordem a y, e como derivar sem a fórmula.',
    modelos: [
      {
        id: 'implicita', nome: 'Função implícita',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: IM.circ.j, dica: 'Arrasta P ao longo da curva' });
          M.S.p = IM.circ.p.slice();
          M.escolha('c', { rot: 'F(x; y) = 0', opcoes: Object.keys(IM).map((k) => [k, IM[k].nome]), valor: 'circ', mono: true, aoMudar: (k) => { M.S.p = IM[k].p.slice(); P.janela(IM[k].j); } });
          M.barra('d', { rot: 'δ', cor: cor.n, min: 0.1, max: 1.2, valor: 0.45, nome: 'tamanho da vizinhança' });
          M.botoes([['P = (1; 0) na circunferência', () => { M.definir({ c: 'circ', p: [1, 0] }); P.janela(IM.circ.j); }], ['Exemplo da aula: (0; 1)', () => { M.definir({ c: 'sen', p: [0, 1] }); P.janela(IM.sen.j); }]]);
          M.cena(P, (G, S) => {
            const c = IM[S.c];
            G.eixos();
            G.nivel(c.F, 0, { cor: cor.m, larg: 2.2, n: 220 });
            const [x0, y0] = S.p, fy = c.Fy(x0, y0), fx = c.Fx(x0, y0);
            const ok = Math.abs(fy) > 1e-3;
            G.poli([[x0 - S.d, y0 - S.d], [x0 + S.d, y0 - S.d], [x0 + S.d, y0 + S.d], [x0 - S.d, y0 + S.d]], { cor: ok ? cor.v : cor.r, larg: 1.2, trac: [5, 4], encher: (ok ? cor.v : cor.r) + '14' });
            if (ok) {
              const b = ramo(c, x0, y0, S.d, -1).reverse().concat(ramo(c, x0, y0, S.d, 1).slice(1)).map((q) => (Math.abs(q[1] - y0) <= S.d ? q : null));
              G.curva(b, { cor: cor.v, larg: 4.5 });
              const s = -fx / fy;
              G.curva([[x0 - 1.4 * S.d, y0 - 1.4 * S.d * s], [x0 + 1.4 * S.d, y0 + 1.4 * S.d * s]], { cor: OURO, larg: 2, trac: [7, 5] });
            } else if (Math.abs(fx) > 1e-3) {
              G.texto([x0, y0 + S.d + 0.1], 'dois valores de y para cada x', { cor: cor.r, tam: 12 });
            }
            const gn = Math.hypot(fx, fy);
            if (gn > 1e-6) G.seta(S.p, [(0.5 * fx) / gn, (0.5 * fy) / gn], { cor: cor.n, rot: '∇F' });
            G.ponto(S.p, { cor: cor.i, rot: 'P', arr: (x, y) => M.definir({ p: projetar(IM[M.S.c], [x, y]) }) });
          });
          M.leituras('Em P', (S) => {
            const c = IM[S.c], [x, y] = S.p, fx = c.Fx(x, y), fy = c.Fy(x, y);
            const ok = Math.abs(fy) > 1e-3;
            const r = [['P', CM.pt(S.p, 3)], ['F(P)', CM.fmt(c.F(x, y), 4)], ['∂F/∂x(P)', CM.fmt(fx, 3)], ['∂F/∂y(P)', CM.fmt(fy, 3), ok ? 'forte' : 'mau']];
            if (ok) r.push(["y′(x) = −(∂F/∂x)/(∂F/∂y)", CM.fmt(-fx / fy, 3), 'forte'], 'Existe uma função y(x), C¹, definida perto de x = ' + CM.fmt(x) + ', com F(x; y(x)) = 0 (a verde).');
            else if (Math.abs(fx) > 1e-3) r.push('∂F/∂y(P) = 0: o teorema não dá y(x). Perto de P há dois y para cada x (ou nenhum). Mas ∂F/∂x(P) ≠ 0, por isso existe x = x(y).');
            else r.push('∇F(P) = 0: nenhuma das variáveis se escreve em função da outra perto de P.');
            return r;
          });
          M.texto((S) => '<b class="t">' + IM[S.c].nome + '</b>' + IM[S.c].tx + '.', 'chave');
          M.texto('<b class="t">Teorema da função implícita</b><p>F de classe C¹, F(a; b) = 0 e ∂F/∂y(a; b) ≠ 0 ⇒ existe y = y(x), C¹, definida numa vizinhança de a, com y(a) = b e F(x; y(x)) = 0.</p><p>Derivando F(x; y(x)) = 0 pela regra da cadeia: ∂F/∂x + ∂F/∂y · y′(x) = 0, logo</p><p class="f">y′(x) = −∂F/∂x(x; y(x)) / ∂F/∂y(x; y(x)).</p><p>A solução é local: na circunferência, y = √(1 − x²) só serve para y &gt; 0.</p>', 'nota');
          M.legenda([[cor.v, 'ramo local y = y(x)'], [OURO, 'tangente, declive y′(x)'], [cor.n, '∇F(P)']]);
        },
      },
      {
        id: 'inversa', nome: 'Função inversa em ℝ²',
        montar(M) {
          const cor = M.cores();
          const D1 = M.plano({ janela: MP.aula.j, dica: 'Domínio: arrasta a' });
          const D2 = M.plano({ janela: [-1, 6, -1, 3], dica: 'Imagem por g' });
          M.S.a = MP.aula.a.slice();
          M.escolha('m', { rot: 'g(x; y)', opcoes: Object.keys(MP).map((k) => [k, MP[k].nome]), valor: 'aula', mono: true, aoMudar: (k) => { M.S.a = MP[k].a.slice(); D1.janela(MP[k].j); } });
          M.barra('s', { rot: 'lado', cor: cor.n, min: 0.05, max: 1.4, valor: 0.5, nome: 'lado do quadrado' });
          M.caixa('gemeo', { rot: 'Mostrar outro ponto com a mesma imagem', valor: false });
          M.botoes([['Exemplo da aula: a = (2; 2)', () => { M.definir({ m: 'aula', a: [2, 2], s: 0.5 }); D1.janela(MP.aula.j); }]]);
          const quad = (a, s) => { const h = s / 2, L = []; for (let i = 0; i <= 4; i++) { const u = -h + (2 * h * i) / 4; L.push({ c: i % 4 ? 'm' : 'u', pts: Array.from({ length: 41 }, (_, k) => [a[0] + u, a[1] - h + (2 * h * k) / 40]) }); L.push({ c: i % 4 ? 'm' : 'v', pts: Array.from({ length: 41 }, (_, k) => [a[0] - h + (2 * h * k) / 40, a[1] + u]) }); } return L; };
          const gemeo = (S) => (S.m === 'exp' ? [S.a[0], S.a[1] + 2 * Math.PI] : S.m === 'dobra' ? [-S.a[0], -S.a[1]] : null);
          M.cena(D1, (P, S) => {
            P.eixos(S.m === 'pol' ? ['r', 'θ'] : ['x', 'y']);
            quad(S.a, S.s).forEach((l) => P.curva(l.pts, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: l.c === 'm' ? 1 : 2.2, alfa: l.c === 'm' ? 0.6 : 1 }));
            const gm = gemeo(S);
            if (S.gemeo && gm) { quad(gm, S.s).forEach((l) => P.curva(l.pts, { cor: cor.n, larg: 1.2, alfa: 0.7 })); P.ponto(gm, { cor: cor.n, rot: 'b' }); }
            P.ponto(S.a, { cor: cor.i, rot: 'a', arr: (x, y) => M.definir({ a: [x, y] }) });
          });
          M.cena(D2, (P, S) => {
            const mp = MP[S.m], ga = mp.g(...S.a);
            const L = quad(S.a, S.s).map((l) => ({ c: l.c, f: l.pts.map((p) => mp.g(...p)) }));
            let m = 0.4;
            L.forEach((l) => l.f.forEach((q) => { if (isFinite(q[0])) m = Math.max(m, Math.abs(q[0] - ga[0]), Math.abs(q[1] - ga[1])); }));
            D2.j0 = [ga[0] - 1.6 * m, ga[0] + 1.6 * m, ga[1] - 1.6 * m, ga[1] + 1.6 * m];
            D2.c = ga.slice();
            P.eixos(['u', 'v']);
            L.forEach((l) => P.curva(l.f, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: l.c === 'm' ? 1 : 2.2, alfa: l.c === 'm' ? 0.6 : 1 }));
            const gm = gemeo(S);
            if (S.gemeo && gm) quad(gm, S.s).forEach((l) => P.curva(l.pts.map((p) => mp.g(...p)), { cor: cor.n, larg: 1.2, trac: [4, 4], alfa: 0.8 }));
            P.ponto(ga, { cor: cor.i, rot: 'g(a)' });
          });
          M.leituras('Em a', (S) => {
            const mp = MP[S.m], J = CM.jac((x, y) => mp.g(x, y), ...S.a), d = CM.det2(J), I = CM.inv2(J);
            const r = [['a', CM.pt(S.a)], ['g(a)', CM.pt(mp.g(...S.a))], ['Dg(a)', CM.mat(J, 3)], ['det Dg(a)', CM.fmt(d, 3) + '  (' + mp.det + ')', Math.abs(d) > 1e-3 ? 'forte' : 'mau']];
            if (I) r.push(['D(g⁻¹)(g(a)) = Dg(a)⁻¹', CM.mat(I, 3), 'forte'], 'det ≠ 0: g é invertível numa vizinhança de a, e a inversa é C¹.');
            else r.push('det Dg(a) = 0: o teorema não se aplica. Vê como o quadrado se dobra sobre si próprio.');
            const gm = gemeo(S);
            if (gm) r.push(['g(b), b = ' + CM.pt(gm), CM.pt(mp.g(...gm))]);
            return r;
          });
          M.texto('<b class="t">Teorema da função inversa</b><p>g : ℝⁿ → ℝⁿ de classe C¹ e det Dg(a) ≠ 0 ⇒ g é invertível numa vizinhança de a, g⁻¹ é C¹ e</p><p class="f">D(g⁻¹)(g(a)) = (Dg(a))⁻¹.</p><p>Em CDI I: g′(a) ≠ 0. O resultado é <b>local</b>: (eˣ cos y; eˣ sen y) tem det = e²ˣ ≠ 0 em todo o lado e não é injetiva, porque g(x; y) = g(x; y + 2π). Liga «Mostrar outro ponto com a mesma imagem».</p>', 'nota');
          M.legenda([[cor.u, 'lados x = constante'], [cor.v, 'lados y = constante'], [cor.n, 'outro ponto com a mesma imagem']]);
        },
      },
      {
        id: 'uma', nome: 'Inversa em ℝ',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.2, 3.2, -2.2, 3.2], dica: 'f, f⁻¹ e a reta y = x' });
          const FN = {
            exp: { nome: 'eˣ ↔ ln y', f: Math.exp, fi: Math.log, df: Math.exp, x: [-2.2, 1.15], dx: 'f′(x) = eˣ', di: '(f⁻¹)′(y) = 1/eˣ = 1/y' },
            sen: { nome: 'sen x ↔ arcsen y', f: Math.sin, fi: Math.asin, df: Math.cos, x: [-Math.PI / 2, Math.PI / 2], dx: 'f′(x) = cos x', di: '(arcsen)′(y) = 1/cos x = 1/√(1 − y²)' },
            cubo: { nome: 'x³ ↔ ∛y', f: (x) => x ** 3, fi: Math.cbrt, df: (x) => 3 * x * x, x: [-1.4, 1.4], dx: 'f′(x) = 3x²', di: '(f⁻¹)′(y) = 1/(3x²): não existe em y = 0' },
          };
          M.escolha('f', { rot: 'f ↔ f⁻¹', opcoes: Object.keys(FN).map((k) => [k, FN[k].nome]), valor: 'exp', mono: true, aoMudar: (k) => { M.S.x = (FN[k].x[0] + FN[k].x[1]) / 2 + 0.3; } });
          M.barra('x', { rot: 'x', cor: cor.u, min: -2.2, max: 1.15, valor: 0.5, nome: 'ponto x', dur: 6000 });
          M.sync.unshift(() => { const c = FN[M.S.f], b = M.ctl.querySelector('input[aria-label="ponto x"]'); if (b) { b.min = c.x[0]; b.max = c.x[1]; } M.S.x = CM.clamp(M.S.x, c.x[0], c.x[1]); });
          M.cena(P, (G, S) => {
            const c = FN[S.f];
            G.eixos();
            G.curva([[-5, -5], [5, 5]], { cor: cor.m, larg: 1, trac: [4, 4] });
            G.param((t) => [t, c.f(t)], c.x[0], c.x[1], 200, { cor: cor.u, larg: 2.6 });
            G.param((t) => [c.f(t), t], c.x[0], c.x[1], 200, { cor: cor.v, larg: 2.6 });
            const x = S.x, y = c.f(x), s = c.df(x);
            G.curva([[x - 0.8, y - 0.8 * s], [x + 0.8, y + 0.8 * s]], { cor: OURO, larg: 2 });
            if (Math.abs(s) > 1e-6) G.curva([[y - 0.8 * s, x - 0.8], [y + 0.8 * s, x + 0.8]], { cor: OURO, larg: 2, trac: [6, 4] });
            G.curva([[x, y], [y, x]], { cor: cor.m, larg: 1, trac: [2, 4] });
            G.ponto([x, y], { cor: cor.u, rot: '(x; f(x))' });
            G.ponto([y, x], { cor: cor.v, rot: '(y; f⁻¹(y))', dy: 14 });
          });
          M.leituras('Declives', (S) => {
            const c = FN[S.f], s = c.df(S.x);
            return [['x', CM.fmt(S.x, 3)], ['y = f(x)', CM.fmt(c.f(S.x), 3)], [c.dx, CM.fmt(s, 3)], [c.di, Math.abs(s) > 1e-6 ? CM.fmt(1 / s, 3) : 'não existe', 'forte'], 'O gráfico de f⁻¹ é o de f refletido na reta y = x: os declives em pontos correspondentes são inversos.'];
          });
          M.texto('<b class="t">Derivada da inversa</b><p>De f⁻¹(f(x)) = x e da regra da cadeia: (f⁻¹)′(f(x)) · f′(x) = 1, logo</p><p class="f">(f⁻¹)′(y) = 1 / f′(x), com y = f(x).</p><p>Em ℝⁿ é igual, com matrizes: D(f⁻¹)(f(x)) = (Df(x))⁻¹. A derivada da inversa é a inversa da derivada. É preciso f′(x) ≠ 0 (det ≠ 0) e f de classe C¹.</p>', 'nota');
          M.legenda([[cor.u, 'f'], [cor.v, 'f⁻¹'], [OURO, 'tangentes (declives inversos)']]);
        },
      },
    ],
    explicar: [
      { modelo: 'uma', titulo: 'Em ℝ: a derivada da inversa', estado: { f: 'exp', x: 0.5 }, texto: '<p>f(x) = eˣ e f⁻¹(y) = ln y. Os gráficos são simétricos em relação a y = x.</p><p>(f⁻¹)′(y) = 1/f′(x) = 1/eˣ = 1/y: é a derivada de ln y.</p>' },
      { modelo: 'uma', titulo: 'arcsen sem decorar', estado: { f: 'sen', x: 0.6 }, texto: '<p>y = sen x ⇔ x = arcsen y, com x ∈ [−π/2, π/2].</p><p class="f">(arcsen)′(y) = 1/cos x = 1/√(1 − sen²x) = 1/√(1 − y²).</p>' },
      { modelo: 'inversa', titulo: 'Em ℝ²: det Dg(a) ≠ 0', estado: { m: 'aula', a: [2, 2], s: 0.5, gemeo: false }, texto: '<p>g(x; y) = (xy; y/x), C¹ para x ≠ 0. Dg = [ y  x ; −y/x²  1/x ].</p><p>Em a = (2; 2): Dg = [ 2  2 ; −1/2  1/2 ], det = 1 + 1 = 2 ≠ 0. Logo g é invertível perto de (2; 2) e</p><p class="f">D(g⁻¹)(4; 1) = ½ [ 1/2  −2 ; 1/2  2 ] = [ 1/4  −1 ; 1/4  1 ].</p>' },
      { modelo: 'inversa', titulo: 'Só local', estado: { m: 'exp', a: [0, 0.6], s: 0.6, gemeo: true }, texto: '<p>g(x; y) = (eˣ cos y; eˣ sen y): det Dg = e²ˣ &gt; 0 em todo o plano, por isso é invertível perto de qualquer ponto.</p><p>Mas o ponto b = a + (0; 2π) tem a mesma imagem (roxo): g não é injetiva em ℝ². O teorema dá invertibilidade local, não global.</p>' },
      { modelo: 'inversa', titulo: 'det = 0: o quadrado dobra', estado: { m: 'dobra', a: [0, 0], s: 0.8, gemeo: false }, texto: '<p>(x² − y²; 2xy) tem det Dg = 4(x² + y²), nulo na origem. Um quadrado à volta de (0; 0) é levado numa figura que dá duas voltas: perto da origem g não é injetiva.</p>' },
      { modelo: 'implicita', titulo: 'Resolver F(x; y) = 0 em ordem a y', estado: { c: 'circ', p: [0.6, 0.8], d: 0.45 }, texto: '<p>x² + y² = 1 em P = (0.6; 0.8): ∂F/∂y = 2y = 1.6 ≠ 0. Perto de P a curva é o gráfico de y(x) = √(1 − x²) (verde).</p><p>y′(x) = −F_x/F_y = −x/y = −0.75, sem precisar da fórmula.</p>' },
      { modelo: 'implicita', titulo: 'Onde falha', estado: { c: 'circ', p: [1, 0], d: 0.45 }, texto: '<p>Em (1; 0), ∂F/∂y = 0: para cada x &lt; 1 perto de 1 há dois valores de y. Não há y(x).</p><p>Como ∂F/∂x = 2 ≠ 0, a curva é o gráfico de x(y) = √(1 − y²) perto de (1; 0).</p>' },
      { modelo: 'implicita', titulo: 'Quando não se consegue isolar y', estado: { c: 'sen', p: [0, 1], d: 0.6 }, texto: '<p>x + y + sen(xy) = 1 não se resolve explicitamente. Em (0; 1): ∂F/∂y = 1 + x cos(xy) = 1 ≠ 0, logo y(x) existe perto de x = 0.</p><p class="f">y′(0) = −(1 + y cos(xy))/(1 + x cos(xy)) = −2.</p><p>Sabe-se que a função existe e calcula-se a derivada, mesmo sem a fórmula.</p>' },
    ],
    testa: [
      { modelo: 'uma', estado: { f: 'exp', x: 0.5 }, p: 'f(x) = eˣ. Quanto vale (f⁻¹)′(y)?', op: ['eʸ', '1/y', 'ln y', '1/eʸ'], certa: 1, porque: '(f⁻¹)′(y) = 1/f′(x) = 1/eˣ, e eˣ = y.' },
      { modelo: 'inversa', estado: { m: 'aula', a: [2, 2], s: 0.5 }, p: 'g(x; y) = (xy; y/x). Quanto vale D(g⁻¹)(4; 1)?', op: ['[ 2  2 ; −1/2  1/2 ]', '[ 1/4  −1 ; 1/4  1 ]', '[ 1/4  −1 ; 1/4  1/2 ]', 'Não existe'], certa: 1, porque: 'g(2; 2) = (4; 1) e Dg(2; 2) = [ 2  2 ; −1/2  1/2 ], com det 2. A inversa é ½ [ 1/2  −2 ; 1/2  2 ]. Confirma: o produto pelas duas ordens dá a identidade.' },
      { modelo: 'inversa', estado: { m: 'exp', a: [0, 0.6], s: 0.6, gemeo: true }, p: 'g de classe C¹ com det Dg ≠ 0 em todo o ℝ². Então:', op: ['g é invertível em ℝ²', 'g é invertível numa vizinhança de cada ponto, mas pode não ser injetiva', 'g é linear', 'g não tem inversa em lado nenhum'], certa: 1, porque: 'O teorema é local. (eˣ cos y; eˣ sen y) é o contraexemplo: det = e²ˣ e g(x; y) = g(x; y + 2π).' },
      { modelo: 'implicita', estado: { c: 'circ', p: [1, 0] }, p: 'x² + y² = 1 perto de (1; 0). O que é verdade?', op: ['Existe y = y(x)', 'Existe x = x(y), mas não y = y(x)', 'Não existe nenhuma das duas', 'Existem as duas'], certa: 1, porque: '∂F/∂y(1; 0) = 0 e ∂F/∂x(1; 0) = 2 ≠ 0. Perto do ponto, x = √(1 − y²).' },
      { modelo: 'implicita', estado: { c: 'sen', p: [0, 1] }, p: 'x + y + sen(xy) = 1 define y(x) perto de (0; 1). Quanto vale y′(0)?', op: ['−1', '−2', '1', '0'], certa: 1, porque: 'y′ = −(1 + y cos(xy))/(1 + x cos(xy)). Em (0; 1): −(1 + 1)/(1 + 0) = −2.' },
    ],
  });
})();
