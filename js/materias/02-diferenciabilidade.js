/* 2. Diferenciabilidade: plano tangente, o(h), derivadas parciais e direcionais, Jacobiana. */
(function () {
  const OURO = '#D9A21B';
  const r2 = (x, y) => x * x + y * y;
  const F = {
    quad: { nome: 'x² + y²', f: (x, y) => x * x + y * y, txt: 'f(x; y) = x² + y²', a: [0.5, 0.3], z: [-0.2, 2.2] },
    sela: { nome: 'x² − y² + xy', f: (x, y) => x * x - y * y + x * y, txt: 'f(x; y) = x² − y² + xy', a: [0.4, -0.3], z: [-1.6, 1.8] },
    desc: { nome: 'xy / (x² + y²)', f: (x, y) => (r2(x, y) === 0 ? 0 : (x * y) / r2(x, y)), txt: 'f(x; y) = xy/(x² + y²) se (x; y) ≠ (0; 0), f(0; 0) = 0', a: [0, 0], z: [-0.8, 0.8] },
    raiz: { nome: 'xy / √(x² + y²)', f: (x, y) => (r2(x, y) === 0 ? 0 : (x * y) / Math.sqrt(r2(x, y))), txt: 'f(x; y) = xy/√(x² + y²) se (x; y) ≠ (0; 0), f(0; 0) = 0', a: [0, 0], z: [-0.9, 0.9] },
    cone: { nome: '√(x² + y²)', f: (x, y) => Math.sqrt(r2(x, y)), txt: 'f(x; y) = √(x² + y²) = ‖(x; y)‖', a: [0, 0], z: [-0.1, 1.7] },
  };
  const OPC = Object.keys(F).map((k) => [k, F[k].nome]);

  /* derivadas laterais na direção u (unitário): existem as duas e coincidem? */
  function lateral(f, a, u, t = 1e-6) {
    const f0 = f(a[0], a[1]);
    const dp = (f(a[0] + t * u[0], a[1] + t * u[1]) - f0) / t;
    const dm = (f0 - f(a[0] - t * u[0], a[1] - t * u[1])) / t;
    const ok = isFinite(dp) && isFinite(dm) && Math.abs(dp - dm) < 1e-3 * Math.max(1, Math.abs(dp)) && Math.abs(dp) < 1e4;
    return { dp, dm, ok, d: ok ? (dp + dm) / 2 : NaN };
  }
  function parciais(f, a) {
    const px = lateral(f, a, [1, 0]), py = lateral(f, a, [0, 1]);
    return { fx: px.d, fy: py.d, ok: px.ok && py.ok, px, py };
  }
  /* rácio |f(a+h) − f(a) − Df(a)h| / ‖h‖ */
  function racio(f, a, D, h) {
    const n = Math.hypot(h[0], h[1]);
    return Math.abs(f(a[0] + h[0], a[1] + h[1]) - f(a[0], a[1]) - D.fx * h[0] - D.fy * h[1]) / n;
  }
  /* diferenciável em a? (o rácio tem de ir para 0 em todas as direções) */
  function dif(f, a) {
    const D = parciais(f, a);
    if (!D.ok) return { D, dif: false };
    let m = 0;
    for (let i = 0; i < 24; i++) { const t = (Math.PI * i) / 12; m = Math.max(m, racio(f, a, D, [1e-4 * Math.cos(t), 1e-4 * Math.sin(t)])); }
    return { D, dif: m < 1e-2 };
  }

  function cenaSup(C, S, cor, f, zr) {
    C.eixos({ x: [-1.4, 1.4], y: [-1.4, 1.4], z: [Math.min(-0.3, zr[0]), Math.max(1.4, zr[1] + 0.2)] });
    C.sup((r, t) => { const x = r * Math.cos(t), y = r * Math.sin(t), z = f(x, y); return z < zr[0] || z > zr[1] ? null : [x, y, z]; }, 0.015, 1.15, 0, 2 * Math.PI, 20, 56, { cor: cor.sup, corTras: cor.sup2, alfa: 0.82 });
  }

  CDI.materia({
    id: 'diferenciabilidade', ordem: 2, grupo: 'Cálculo diferencial', curto: 'Diferenciabilidade', titulo: 'Diferenciabilidade', paginas: 'pp. 6–16',
    resumo: 'Plano tangente, a definição com o(h), derivadas parciais e direcionais, Jacobiana e contraexemplos.',
    modelos: [
      {
        id: 'definicao', nome: 'Plano tangente e o(h)',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7, alvo: [0, 0, 0.35] });
          const G = M.plano({ janela: [-0.08, 1.05, -0.12, 1.3], livre: true, dica: 'Rácio do erro em função de ‖h‖' });
          M.escolha('f', { rot: 'Função', opcoes: OPC, valor: 'quad', mono: true, aoMudar: (k) => { M.S.x0 = F[k].a[0]; M.S.y0 = F[k].a[1]; } });
          M.barra('x0', { rot: 'a₁', cor: cor.u, min: -1, max: 1, valor: 0.5, nome: 'primeira coordenada de a' });
          M.barra('y0', { rot: 'a₂', cor: cor.v, min: -1, max: 1, valor: 0.3, nome: 'segunda coordenada de a' });
          M.barra('hn', { rot: '‖h‖', cor: cor.n, min: 0.01, max: 0.9, valor: 0.5, nome: 'comprimento de h', dur: 5000 });
          M.barra('ha', { rot: 'α', cor: cor.n, min: 0, max: 2 * Math.PI, valor: 0.785, fmt: CM.graus, circular: true, nome: 'direção de h' });
          M.caixa('plano', { rot: 'Plano tangente', valor: true });
          const est = (S) => {
            const f = F[S.f].f, a = [S.x0, S.y0], h = [S.hn * Math.cos(S.ha), S.hn * Math.sin(S.ha)];
            const R = dif(f, a);
            return { f, a, h, R, D: R.D };
          };
          M.cena(V, (C, S) => {
            const { f, a, h, D } = est(S);
            cenaSup(C, S, cor, f, F[S.f].z);
            const P = [a[0], a[1], f(a[0], a[1])];
            if (D.ok && S.plano) C.plano(P, [-D.fx, -D.fy, 1], 0.6, { cor: OURO, alfa: 0.3 });
            const Q = [a[0] + h[0], a[1] + h[1], f(a[0] + h[0], a[1] + h[1])];
            C.linha([a[0], a[1], 0], [a[0], a[1], P[2]], { cor: cor.m, larg: 1, trac: [3, 4] });
            C.linha([Q[0], Q[1], 0], [Q[0], Q[1], Q[2]], { cor: cor.m, larg: 1, trac: [3, 4] });
            C.seta([a[0], a[1], 0], [h[0], h[1], 0], { cor: cor.n, rot: 'h', larg: 2.4 });
            if (D.ok) {
              const R = [Q[0], Q[1], P[2] + D.fx * h[0] + D.fy * h[1]];
              C.linha(Q, R, { cor: cor.r, larg: 4, vies: 0.05 });
              C.ponto(R, { cor: OURO, r: 4.5 });
            }
            C.ponto(P, { cor: cor.u, rot: 'P' });
            C.ponto(Q, { cor: cor.n, rot: 'f(a + h)', tam: 12 });
          });
          M.cena(G, (P, S) => {
            const { f, a, D } = est(S);
            P.eixos(['‖h‖', 'rácio']);
            if (!D.ok) { P.texto([0.48, 0.6], 'Df(a) não existe: não há plano', { cor: cor.r }); return; }
            const u = [Math.cos(S.ha), Math.sin(S.ha)];
            const pts = [];
            for (let i = 1; i <= 200; i++) { const t = i / 200; pts.push([t, Math.min(5, racio(f, a, D, [t * u[0], t * u[1]]))]); }
            P.curva(pts, { cor: cor.r, larg: 2.4 });
            const r = racio(f, a, D, [S.hn * u[0], S.hn * u[1]]);
            P.ponto([S.hn, Math.min(5, r)], { cor: cor.n });
            P.texto([0.04, 1.22], 'tem de → 0 quando ‖h‖ → 0', { cor: cor.m, al: 'left', tam: 12, peso: 400 });
          });
          M.leituras('Em a', (S) => {
            const { f, a, h, R, D } = est(S);
            const fa = f(a[0], a[1]);
            const rows = [['a', CM.pt(a)], ['f(a)', CM.fmt(fa, 3)]];
            rows.push(['∂f/∂x(a)', D.px.ok ? CM.fmt(D.fx, 3) : 'não existe', D.px.ok ? '' : 'mau'], ['∂f/∂y(a)', D.py.ok ? CM.fmt(D.fy, 3) : 'não existe', D.py.ok ? '' : 'mau']);
            if (D.ok) {
              rows.push(['Plano tangente', `z = ${CM.fmtC(fa)} ${D.fx < 0 ? '−' : '+'} ${CM.fmtC(Math.abs(D.fx))}(x − ${CM.fmtC(a[0])}) ${D.fy < 0 ? '−' : '+'} ${CM.fmtC(Math.abs(D.fy))}(y − ${CM.fmtC(a[1])})`]);
              rows.push('—', ['f(a+h) − f(a) − Df(a)h', CM.fmt(f(a[0] + h[0], a[1] + h[1]) - fa - D.fx * h[0] - D.fy * h[1], 4)], ['rácio ÷ ‖h‖', CM.fmt(racio(f, a, D, h), 4)]);
            }
            rows.push(R.dif ? '<b>Diferenciável em a</b>: o erro é o(h), o rácio vai para 0 em todas as direções.' : D.ok ? '<b>Não é diferenciável em a</b>: as parciais existem, mas o rácio não vai para 0 (experimenta α = 45°).' : '<b>Não é diferenciável em a</b>: falta pelo menos uma derivada parcial.');
            return rows;
          });
          M.texto((S) => '<b class="t">' + F[S.f].txt + '</b>' + ({
            quad: 'Polinómio: tem parciais contínuas em todo o ℝ² (é C¹), logo é diferenciável em todo o lado.',
            sela: 'Polinómio, logo C¹ e diferenciável. O plano tangente atravessa a superfície porque esta curva para cima numa direção e para baixo noutra.',
            desc: 'Não é contínua em (0; 0): ao longo de y = x vale sempre 1/2. Diferenciável ⇒ contínua, logo não é diferenciável na origem, apesar de ∂f/∂x(0; 0) = ∂f/∂y(0; 0) = 0.',
            raiz: 'É contínua e tem as duas parciais nulas na origem, mas o plano z = 0 não a aproxima: f(t; t)/‖(t; t)‖ = 1/2 não tende para 0. Existirem as parciais não chega para ser diferenciável.',
            cone: 'Na origem, ∂f/∂x(0; 0) = lim |t|/t não existe (dá +1 por um lado e −1 pelo outro). Sem parciais não há Jacobiana, logo não é diferenciável. Fora da origem é C¹.',
          })[S.f], 'chave');
          M.texto('<b class="t">Definição</b><p>f é diferenciável em a se existe uma transformação linear Df(a) com</p><p class="f">f(a + h) − f(a) − Df(a)h = o(h), isto é, lim‖h‖→0 |f(a + h) − f(a) − Df(a)h| / ‖h‖ = 0.</p><p>Diferenciável ⇒ contínua e com todas as derivadas parciais e direcionais. O recíproco é falso. Condição suficiente: parciais contínuas numa vizinhança de a (f de classe C¹).</p>', 'nota');
          M.legenda([[cor.u, 'P = (a; f(a))'], [OURO, 'plano tangente'], [cor.n, 'h e f(a + h)'], [cor.r, 'erro f(a+h) − f(a) − Df(a)h']]);
        },
      },
      {
        id: 'direcional', nome: 'Derivada direcional',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7, alvo: [0, 0, 0.35] });
          const G = M.plano({ janela: [-0.2, 6.6, -1.7, 1.7], livre: true, dica: 'Derivada na direção v em função do ângulo θ' });
          M.escolha('f', { rot: 'Função', opcoes: OPC, valor: 'raiz', mono: true, aoMudar: (k) => { M.S.x0 = F[k].a[0]; M.S.y0 = F[k].a[1]; } });
          M.barra('th', { rot: 'θ', cor: cor.b, min: 0, max: 2 * Math.PI, valor: 0.785, fmt: CM.graus, circular: true, nome: 'ângulo de v', dur: 7000 });
          M.barra('x0', { rot: 'a₁', cor: cor.u, min: -1, max: 1, valor: 0 });
          M.barra('y0', { rot: 'a₂', cor: cor.v, min: -1, max: 1, valor: 0 });
          const est = (S) => { const f = F[S.f].f, a = [S.x0, S.y0], v = [Math.cos(S.th), Math.sin(S.th)]; return { f, a, v, L: lateral(f, a, v), D: parciais(f, a) }; };
          M.cena(V, (C, S) => {
            const { f, a, v, L } = est(S);
            cenaSup(C, S, cor, f, F[S.f].z);
            const P = [a[0], a[1], f(a[0], a[1])];
            C.param((t) => [a[0] + t * v[0], a[1] + t * v[1], f(a[0] + t * v[0], a[1] + t * v[1])], -1, 1, 80, { cor: cor.b, larg: 3.2, vies: 0.02 });
            const tg = (s, d) => C.linha(P, [P[0] + s * 0.6 * v[0], P[1] + s * 0.6 * v[1], P[2] + s * 0.6 * d], { cor: OURO, larg: 3, vies: 0.04 });
            if (Math.abs(L.dp) < 50) tg(1, L.dp);
            if (Math.abs(L.dm) < 50) tg(-1, L.dm);
            C.seta([a[0], a[1], 0], [0.7 * v[0], 0.7 * v[1], 0], { cor: cor.b, rot: 'v' });
            C.ponto(P, { cor: cor.u, rot: 'P' });
          });
          M.cena(G, (P, S) => {
            const { f, a, D } = est(S);
            P.eixos(['θ', '']);
            const dp = [], dm = [], gv = [];
            for (let i = 0; i <= 240; i++) {
              const t = (2 * Math.PI * i) / 240, u = [Math.cos(t), Math.sin(t)];
              const l = lateral(f, a, u);
              dp.push([t, Math.abs(l.dp) < 10 ? l.dp : NaN]); dm.push([t, Math.abs(l.dm) < 10 ? l.dm : NaN]);
              if (D.ok) gv.push([t, D.fx * u[0] + D.fy * u[1]]);
            }
            P.curva(dm, { cor: cor.u, larg: 2, alfa: 0.8 });
            P.curva(dp, { cor: cor.b, larg: 2.4 });
            if (D.ok) P.curva(gv, { cor: OURO, larg: 2, trac: [6, 5] });
            const l = lateral(f, a, [Math.cos(S.th), Math.sin(S.th)]);
            if (Math.abs(l.dp) < 10) P.ponto([S.th, l.dp], { cor: cor.b, r: 5 });
            P.texto([0.15, 1.5], 'azul: t → 0⁺   laranja: t → 0⁻   tracejado: ∇f(a)·v', { cor: cor.m, al: 'left', tam: 11.5, peso: 400 });
          });
          M.leituras('Na direção v', (S) => {
            const { a, v, L, D } = est(S);
            const rows = [['v = (cos θ; sen θ)', CM.pt(v)], ['lim t→0⁺ [f(a + tv) − f(a)]/t', Math.abs(L.dp) < 1e4 ? CM.fmt(L.dp, 3) : '±∞'], ['lim t→0⁻ [f(a + tv) − f(a)]/t', Math.abs(L.dm) < 1e4 ? CM.fmt(L.dm, 3) : '±∞'], ['∂f/∂v(a)', L.ok ? CM.fmt(L.d, 3) : 'não existe', L.ok ? 'forte' : 'mau']];
            if (D.ok) rows.push(['∇f(a) · v', CM.fmt(D.fx * v[0] + D.fy * v[1], 3)]);
            const R = dif(F[S.f].f, a);
            rows.push(R.dif ? 'Diferenciável: ∂f/∂v(a) = Df(a)v para todo o v. As curvas coincidem.' : 'Não diferenciável em a: ∂f/∂v(a) não é Df(a)v em todas as direções.');
            return rows;
          });
          M.texto('<b class="t">Derivada direcional</b><p class="f">∂f/∂v(a) = lim t→0 [f(a + tv) − f(a)] / t</p><p>É o declive da curva azul (o corte da superfície pelo plano vertical na direção v). As parciais são os casos v = e₁ e v = e₂. Se f é diferenciável em a, ∂f/∂v(a) = Df(a)v = ∇f(a) · v.</p><p>Em xy/√(x² + y²) na origem, com v = (1; 1)/√2, o limite dá +1/2 por um lado e −1/2 pelo outro: não existe.</p>', 'nota');
          M.legenda([[cor.b, 'corte na direção v'], [OURO, 'retas tangentes laterais'], [cor.u, 'P']]);
        },
      },
      {
        id: 'jacobiana', nome: 'Jacobiana',
        montar(M) {
          const cor = M.cores();
          const MAP = {
            lin: { nome: '(x + y; x − 3y)', F: (x, y) => [x + y, x - 3 * y], J: '[ 1  1 ; 1  −3 ] (constante: F é linear)', a: [0.5, 0.5] },
            pol: { nome: '(x cos y; x sen y)', F: (x, y) => [x * Math.cos(y), x * Math.sin(y)], J: '[ cos y  −x sen y ; sen y  x cos y ]', a: [1.2, 0.6] },
            quad: { nome: '(x² − y²; 2xy)', F: (x, y) => [x * x - y * y, 2 * x * y], J: '[ 2x  −2y ; 2y  2x ]', a: [1, 0.5] },
            xy: { nome: '(xy; y/x)', F: (x, y) => [x * y, y / x], J: '[ y  x ; −y/x²  1/x ]', a: [1.5, 1] },
          };
          const D1 = M.plano({ janela: [-2.6, 2.6, -2, 2], dica: 'Domínio: arrasta a' });
          const D2 = M.plano({ janela: [-3, 3, -2.3, 2.3], dica: 'Imagem: F (cheio) e a aproximação linear (tracejado)' });
          M.S.a = [0.5, 0.5];
          M.escolha('m', { rot: 'F : ℝ² → ℝ²', opcoes: Object.keys(MAP).map((k) => [k, MAP[k].nome]), valor: 'lin', mono: true, aoMudar: (k) => (M.S.a = MAP[k].a.slice()) });
          M.barra('s', { rot: 'lado', cor: cor.n, min: 0.05, max: 1, valor: 0.6, nome: 'lado do quadrado', dica: 'Encolhe o quadrado: a imagem por F fica cada vez mais igual à imagem por Df(a), um paralelogramo.' });
          const quad = (S) => { const h = S.s / 2, a = S.a; const L = []; for (let i = 0; i <= 4; i++) { const u = -h + (2 * h * i) / 4; L.push({ c: i === 0 ? 'u' : i === 4 ? 'u' : 'm', pts: Array.from({ length: 41 }, (_, k) => [a[0] + u, a[1] - h + (2 * h * k) / 40]) }); L.push({ c: i === 0 || i === 4 ? 'v' : 'm', pts: Array.from({ length: 41 }, (_, k) => [a[0] - h + (2 * h * k) / 40, a[1] + u]) }); } return L; };
          M.cena(D1, (P, S) => {
            P.eixos();
            quad(S).forEach((l) => P.curva(l.pts, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: l.c === 'm' ? 1 : 2.2, alfa: l.c === 'm' ? 0.6 : 1 }));
            P.seta(S.a, [S.s / 2, 0], { cor: cor.u, rot: 'e₁' });
            P.seta(S.a, [0, S.s / 2], { cor: cor.v, rot: 'e₂' });
            P.ponto(S.a, { cor: cor.i, rot: 'a', arr: (x, y) => M.definir({ a: [x, y] }) });
          });
          M.cena(D2, (P, S) => {
            const mp = MAP[S.m], Fa = mp.F(S.a[0], S.a[1]), J = CM.jac(mp.F, S.a[0], S.a[1]);
            const L = quad(S).map((l) => ({ c: l.c, f: l.pts.map((p) => mp.F(p[0], p[1])), g: l.pts.map((p) => CM.add(Fa, CM.mxv(J, [p[0] - S.a[0], p[1] - S.a[1]]))) }));
            let m = 0.3;
            L.forEach((l) => l.f.concat(l.g).forEach((q) => { if (isFinite(q[0])) m = Math.max(m, Math.abs(q[0] - Fa[0]), Math.abs(q[1] - Fa[1])); }));
            D2.j0 = [Fa[0] - 1.5 * m, Fa[0] + 1.5 * m, Fa[1] - 1.5 * m, Fa[1] + 1.5 * m];
            D2.c = Fa.slice();
            P.eixos(['u', 'v']);
            L.forEach((l) => P.curva(l.g, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: 1.3, trac: [5, 4], alfa: 0.75 }));
            L.forEach((l) => P.curva(l.f, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: l.c === 'm' ? 1 : 2.2, alfa: l.c === 'm' ? 0.6 : 1 }));
            P.seta(Fa, [(J[0][0] * S.s) / 2, (J[1][0] * S.s) / 2], { cor: cor.u, rot: 'Df(a)e₁' });
            P.seta(Fa, [(J[0][1] * S.s) / 2, (J[1][1] * S.s) / 2], { cor: cor.v, rot: 'Df(a)e₂' });
            P.ponto(Fa, { cor: cor.i, rot: 'F(a)' });
          });
          M.leituras('Em a', (S) => {
            const mp = MAP[S.m], J = CM.jac(mp.F, S.a[0], S.a[1]);
            return [['a', CM.pt(S.a)], ['F(a)', CM.pt(mp.F(S.a[0], S.a[1]))], ['DF(x; y)', mp.J], ['DF(a)', CM.mat(J, 3)], ['1.ª coluna = DF(a)e₁', CM.ptC([J[0][0], J[1][0]])], ['2.ª coluna = DF(a)e₂', CM.ptC([J[0][1], J[1][1]])], ['det DF(a)', CM.fmt(CM.det2(J), 3)]];
          });
          M.texto('<b class="t">A Jacobiana coluna a coluna</b><p>A coluna j de DF(a) é DF(a)eⱼ = ∂F/∂xⱼ(a): deriva-se cada componente em ordem a xⱼ e põe-se em coluna. F : ℝⁿ → ℝᵐ dá uma matriz m × n (m linhas, uma por componente; n colunas, uma por variável).</p><p>Exemplo das teóricas: f(x; y) = (x; xy; x/y) dá Df(x; y) = [ 1  0 ; y  x ; 1/y  −x/y² ], com 3 linhas e 2 colunas. Para g(t) = (t; t²; arctan t), Dg(t) = g′(t) = (1; 2t; 1/(1 + t²)), uma coluna.</p>', 'nota');
          M.legenda([[cor.u, 'lados com x constante e DF(a)e₁'], [cor.v, 'lados com y constante e DF(a)e₂'], [cor.m, 'tracejado: F(a) + DF(a)(x − a)']]);
        },
      },
    ],
    explicar: [
      { modelo: 'definicao', titulo: 'Da reta ao plano tangente', estado: { f: 'quad', x0: 0.5, y0: 0.3, hn: 0.5, ha: 0.785, plano: true }, texto: '<p>Em CDI I: y = f′(a)(x − a) + f(a). Em ℝ² o gráfico de f é uma superfície e a melhor aproximação linear é o plano</p><p class="f">z = f(a) + ∂f/∂x(a)(x − a₁) + ∂f/∂y(a)(y − a₂).</p>' },
      { modelo: 'definicao', titulo: 'O erro é o(h)', estado: { f: 'quad', x0: 0.5, y0: 0.3, hn: 0.6, ha: 0.785 }, texto: '<p>O segmento vermelho é o erro f(a + h) − f(a) − Df(a)h. Ser diferenciável quer dizer que o erro vai para 0 <b>mais depressa do que ‖h‖</b>: o rácio no gráfico de baixo tende para 0.</p><p>Carrega em ▶ ao lado de ‖h‖ em «Mexer nos controlos» e vê o segmento encolher.</p>' },
      { modelo: 'definicao', titulo: 'Parciais = colunas de Df(a)', estado: { f: 'quad', x0: 0.5, y0: 0.3, hn: 0.5, ha: 0 }, texto: '<p>Com h = t·eⱼ, a definição dá lim t→0 [f(a + teⱼ) − f(a)]/t = Df(a)eⱼ = ∂f/∂xⱼ(a).</p><p>É a derivada em ordem a xⱼ com as outras variáveis fixas. Aqui h aponta na direção de x: Df(a)e₁ = ∂f/∂x(a) = 2a₁ = 1.</p>' },
      { modelo: 'definicao', titulo: 'Contraexemplo: não contínua', estado: { f: 'desc', x0: 0, y0: 0, hn: 0.4, ha: 0.785 }, texto: '<p>f = xy/(x² + y²) vale 1/2 em toda a reta y = x (fora da origem) e f(0; 0) = 0: não é contínua na origem.</p><p>Como diferenciável ⇒ contínua, não é diferenciável, mesmo tendo as duas parciais nulas.</p>' },
      { modelo: 'definicao', titulo: 'Contraexemplo: parciais existem e não chega', estado: { f: 'raiz', x0: 0, y0: 0, hn: 0.5, ha: 0.785 }, texto: '<p>f = xy/√(x² + y²) é contínua e ∂f/∂x(0; 0) = ∂f/∂y(0; 0) = 0. O candidato a plano é z = 0.</p><p>Mas na direção de 45° o rácio vale sempre 1/2: o erro não é o(h). <b>Existirem as parciais não implica ser diferenciável.</b> O que garante diferenciabilidade é as parciais serem contínuas (C¹).</p>' },
      { modelo: 'direcional', titulo: 'Derivada direcional', estado: { f: 'quad', x0: 0.4, y0: 0.2, th: 1 }, texto: '<p>Corta-se a superfície pelo plano vertical na direção v. O declive da curva em P é ∂f/∂v(a).</p><p>Se f é diferenciável, ∂f/∂v(a) = Df(a)v = ∇f(a)·v: a curva azul coincide com a tracejada para todos os θ.</p>' },
      { modelo: 'direcional', titulo: 'Quando não existe', estado: { f: 'raiz', x0: 0, y0: 0, th: 0.785 }, texto: '<p>Em xy/√(x² + y²) na origem, com v = (1; 1)/√2: [f(tv) − f(0)]/t = |t|/(2t), que vale +1/2 para t &gt; 0 e −1/2 para t &lt; 0. O limite não existe.</p><p>Só nos eixos (θ = 0°, 90°, …) os dois limites coincidem (dão 0).</p>' },
      { modelo: 'jacobiana', titulo: 'A Jacobiana lineariza', estado: { m: 'pol', a: [1.2, 0.6], s: 0.6 }, texto: '<p>Um quadradinho à volta de a é levado por F numa figura curva (cheio). DF(a) leva-o num paralelogramo (tracejado), gerado pelas colunas DF(a)e₁ e DF(a)e₂.</p><p>Quanto mais pequeno o quadrado, mais as duas figuras coincidem: é isso que diz F(a + h) = F(a) + DF(a)h + o(h).</p>' },
    ],
    testa: [
      { modelo: 'definicao', estado: { f: 'raiz', x0: 0, y0: 0, ha: 0.785, hn: 0.5 }, p: 'f(x; y) = xy/√(x² + y²), f(0; 0) = 0. Na origem:', op: ['é diferenciável, porque as parciais existem', 'as parciais existem e valem 0, mas f não é diferenciável', 'f não é contínua', 'as parciais não existem'], certa: 1, porque: 'f(t; 0) = f(0; t) = 0 dá parciais nulas. Mas |f(h)|/‖h‖ = |h₁h₂|/‖h‖² vale 1/2 na diagonal, não tende para 0. f é contínua, porque |f| ≤ ‖h‖/2.' },
      { p: 'Qual destas condições garante que f é diferenciável em a?', op: ['As derivadas parciais existem em a', 'f é contínua em a', 'As parciais existem numa vizinhança de a e são contínuas em a', 'Existem todas as derivadas direcionais em a'], certa: 2, porque: 'Parciais contínuas (f de classe C¹) é condição suficiente. As outras três são necessárias ou nem isso: há funções com todas as derivadas direcionais e que nem são contínuas.' },
      { modelo: 'jacobiana', estado: { m: 'lin', a: [0.5, 0.5], s: 0.6 }, p: 'Para f : ℝ² → ℝ³, a matriz Df(a) tem:', op: ['2 linhas e 3 colunas', '3 linhas e 2 colunas', '3 linhas e 3 colunas', '1 linha e 2 colunas'], certa: 1, porque: 'Uma linha por componente de f (3) e uma coluna por variável (2). Df(a)h tem de estar em ℝ³ para h ∈ ℝ².' },
      { p: 'f(x; y) = (x + y; x − 3y; x − y). Quanto vale Df(x; y)?', op: ['[ 1  1 ; 1  −3 ; 1  −1 ], igual em todos os pontos', '[ y  x ; −3y  x ; −1  x ]', '[ 1  1  1 ; 1  −3  −1 ]', 'Depende de (x; y)'], certa: 0, porque: 'f é linear, f(x) = Ax, e f(a + h) − f(a) = Ah exatamente, com erro 0. A derivada de uma função linear é a própria matriz A.' },
      { modelo: 'direcional', estado: { f: 'cone', x0: 0, y0: 0, th: 0 }, p: 'Para f(x; y) = √(x² + y²), quanto vale ∂f/∂x(0; 0)?', op: ['0', '1', 'Não existe', '+∞'], certa: 2, porque: '[f(t; 0) − f(0; 0)]/t = |t|/t vale 1 para t &gt; 0 e −1 para t &lt; 0. O cone tem um bico na origem.' },
      { p: 'g(t) = (t; t²; arctan t). Quanto vale Dg(t)?', op: ['(1; 2t; 1/(1 + t²)), em coluna', '[ 1  2t  1/(1 + t²) ] em linha', '(1; 2; 1)', '1 + 2t + 1/(1 + t²)'], certa: 0, porque: 'g : ℝ → ℝ³ dá uma matriz 3 × 1: deriva-se cada componente. É o vetor tangente à linha descrita por g.' },
    ],
  });
})();
