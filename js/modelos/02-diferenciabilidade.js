/* 2. Diferenciabilidade: plano tangente, o(h), derivadas parciais e direcionais, Jacobiana. */
(function () {
  const r2 = (x, y) => x * x + y * y;
  const R0 = (e) => ({ r: [[e, '(x;y)≠(0;0)']], z: '0' });
  /* exemplos das aulas (o aluno pode escrever qualquer outra função) */
  const F = {
    quad: { tex: 'x^2+y^2', valor: 'x^2+y^2', a: [0.5, 0.3] },
    sela: { tex: 'x^2-y^2+xy', valor: 'x^2-y^2+xy', a: [0.4, -0.3] },
    desc: { tex: '\\frac{xy}{x^2+y^2}', valor: R0('xy/(x^2+y^2)'), a: [0, 0] },
    raiz: { tex: '\\frac{xy}{\\sqrt{x^2+y^2}}', valor: R0('xy/sqrt(x^2+y^2)'), a: [0, 0] },
    cone: { tex: '\\sqrt{x^2+y^2}', valor: 'sqrt(x^2+y^2)', a: [0, 0] },
    teste: { tex: '|x-y|', valor: '|x-y|', a: [0, 0] },
  };
  const LISTA = Object.keys(F).map((k) => Object.assign({ k }, F[k]));
  const EXS = LISTA.map((p) => ['$' + p.tex + '$', p.valor, { x0: p.a[0], y0: p.a[1] }]);
  const qual = (v) => { const p = CDI.preset(LISTA, v); return p ? p.k : null; };
  CDI.exemplosDif = EXS;

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
  const sg = (x) => (x < 0 ? '-' : '+') + TX.n(Math.abs(x), 2);

  function cenaSup(C, S, cor, f, zr) {
    C.eixos({ x: [-1.4, 1.4], y: [-1.4, 1.4], z: [Math.min(-0.3, zr[0]), Math.max(1.4, zr[1] + 0.2)] });
    C.sup((r, t) => { const x = r * Math.cos(t), y = r * Math.sin(t), z = f(x, y); return z < zr[0] || z > zr[1] ? null : [x, y, z]; }, 0.015, 1.15, 0, 2 * Math.PI, 22, 64, { alfa: 0.82 });
  }

  CDI.modelosDe('diferenciabilidade', {
    id: 'diferenciabilidade', ordem: 2, grupo: 'Cálculo diferencial', curto: 'Diferenciabilidade', titulo: 'Diferenciabilidade', paginas: 'pp. 6–16',
    resumo: 'Plano tangente, a definição com $o(h)$, derivadas parciais e direcionais, Jacobiana e contraexemplos.',
    modelos: [
      {
        id: 'definicao', nome: 'Plano tangente e o(h)',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7, alvo: [0, 0, 0.35] });
          const G = M.plano({ janela: [-0.08, 1.05, -0.12, 1.3], livre: true, dica: 'Rácio do erro em função de ‖h‖' });
          M.funcao('f', { vars: ['x', 'y'], valor: F.quad.valor, ramos: true, exemplos: EXS });
          M.barra('x0', { rot: '$a_1$', cor: cor.u, min: -1, max: 1, valor: 0.5, nome: 'primeira coordenada de a' });
          M.barra('y0', { rot: '$a_2$', cor: cor.v, min: -1, max: 1, valor: 0.3, nome: 'segunda coordenada de a' });
          M.barra('hn', { rot: '$\\|h\\|$', cor: cor.n, min: 0.01, max: 0.9, valor: 0.5, nome: 'comprimento de h', dur: 5000 });
          M.barra('ha', { rot: '$\\alpha$', cor: cor.n, min: 0, max: 2 * Math.PI, valor: 0.785, fmt: CM.graus, circular: true, nome: 'direção de h' });
          M.caixa('plano', { rot: 'Plano tangente', valor: true });
          const est = (S) => {
            const f = M.F.f.f, a = [S.x0, S.y0], h = [S.hn * Math.cos(S.ha), S.hn * Math.sin(S.ha)];
            const R = dif(f, a);
            return { f, a, h, R, D: R.D };
          };
          M.cena(V, (C, S) => {
            const { f, a, h, D } = est(S);
            cenaSup(C, S, cor, f, CDI.faixaZ(f, -1.15, 1.15, -1.15, 1.15));
            const P = [a[0], a[1], f(a[0], a[1])];
            if (D.ok && S.plano) C.plano(P, [-D.fx, -D.fy, 1], 0.6, { cor: cor.ouro, alfa: 0.32 });
            const Q = [a[0] + h[0], a[1] + h[1], f(a[0] + h[0], a[1] + h[1])];
            C.linha([a[0], a[1], 0], [a[0], a[1], P[2]], { cor: cor.m, larg: 1, trac: [3, 4] });
            C.linha([Q[0], Q[1], 0], [Q[0], Q[1], Q[2]], { cor: cor.m, larg: 1, trac: [3, 4] });
            C.seta([a[0], a[1], 0], [h[0], h[1], 0], { cor: cor.n, rot: '$h$', larg: 2.4 });
            if (D.ok) {
              const R = [Q[0], Q[1], P[2] + D.fx * h[0] + D.fy * h[1]];
              C.linha(Q, R, { cor: cor.r, larg: 4.5 });
              C.ponto(R, { cor: cor.ouro, r: 4.5 });
            }
            C.ponto(P, { cor: cor.u, rot: '$P$' });
            C.ponto(Q, { cor: cor.n, rot: '$f(a+h)$', tam: 12 });
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
          M.leituras('Em $a$', (S) => {
            const { f, a, h, R, D } = est(S);
            const fa = f(a[0], a[1]);
            const rows = [['$a$', '$' + TX.v(a, 2) + '$'], ['$f(a)$', '$' + TX.n(fa, 3) + '$']];
            rows.push(['$\\frac{\\partial f}{\\partial x}(a)$', D.px.ok ? '$' + TX.n(D.fx, 3) + '$' : 'não existe', D.px.ok ? '' : 'mau'], ['$\\frac{\\partial f}{\\partial y}(a)$', D.py.ok ? '$' + TX.n(D.fy, 3) + '$' : 'não existe', D.py.ok ? '' : 'mau']);
            if (D.ok) {
              rows.push(['plano tangente', `$z=${TX.n(fa, 2)}${sg(D.fx)}(x${sg(-a[0])})${sg(D.fy)}(y${sg(-a[1])})$`]);
              rows.push('—', ['$f(a+h)-f(a)-Df(a)h$', '$' + TX.n(f(a[0] + h[0], a[1] + h[1]) - fa - D.fx * h[0] - D.fy * h[1], 4) + '$'], ['rácio $\\div\\|h\\|$', '$' + TX.n(racio(f, a, D, h), 4) + '$']);
            }
            rows.push(R.dif ? '<b>Diferenciável em $a$</b>: o erro é $o(h)$, o rácio vai para $0$ em todas as direções.' : D.ok ? '<b>Não é diferenciável em $a$</b>: as parciais existem, mas o rácio não vai para $0$ (experimenta $\\alpha=45^\\circ$).' : '<b>Não é diferenciável em $a$</b>: falta pelo menos uma derivada parcial.');
            return rows;
          });
          M.texto((S) => qual(S.f) && '<b class="t">$f=' + M.F.f.tex + '$</b><p>' + ({
            quad: 'Polinómio: tem parciais contínuas em todo o $\\mathbb R^2$ (é $C^1$), logo é diferenciável em todo o lado.',
            sela: 'Polinómio, logo $C^1$ e diferenciável. O plano tangente atravessa a superfície porque esta curva para cima numa direção e para baixo noutra.',
            desc: 'Não é contínua em $(0;0)$: ao longo de $y=x$ vale sempre $\\tfrac12$. Diferenciável $\\Rightarrow$ contínua, logo não é diferenciável na origem, apesar de $\\frac{\\partial f}{\\partial x}(0;0)=\\frac{\\partial f}{\\partial y}(0;0)=0$.',
            raiz: 'É contínua e tem as duas parciais nulas na origem, mas o plano $z=0$ não a aproxima: $f(t;t)/\\|(t;t)\\|=\\tfrac12$ não tende para $0$. Existirem as parciais não chega para ser diferenciável.',
            cone: 'Na origem, $\\frac{\\partial f}{\\partial x}(0;0)=\\lim\\frac{|t|}{t}$ não existe ($+1$ por um lado, $-1$ pelo outro). Sem parciais não há Jacobiana, logo não é diferenciável. Fora da origem é $C^1$.',
            teste: 'Exemplo do 1.º teste de 2024/25: é contínua na origem ($|x-y|\\le2\\|(x;y)\\|$), mas $\\frac{\\partial f}{\\partial x}(0;0)$ não existe ($-1$ e $+1$ pelos dois lados), logo não é diferenciável.',
          })[qual(S.f)] + '</p>', 'chave');
          M.texto('<b class="t">Definição</b><p>$f$ é diferenciável em $a$ se existe uma transformação linear $Df(a)$ com</p>$$\\lim_{\\|h\\|\\to0}\\frac{|f(a+h)-f(a)-Df(a)h|}{\\|h\\|}=0,$$<p>isto é, $f(a+h)-f(a)-Df(a)h=o(h)$. Diferenciável $\\Rightarrow$ contínua e com todas as derivadas parciais e direcionais. O recíproco é falso. Condição suficiente: parciais contínuas numa vizinhança de $a$ ($f$ de classe $C^1$).</p>', 'nota');
          M.legenda([[cor.u, '$P=(a;f(a))$'], [cor.ouro, 'plano tangente'], [cor.n, '$h$ e $f(a+h)$'], [cor.r, 'erro $f(a+h)-f(a)-Df(a)h$']]);
        },
      },
      {
        id: 'direcional', nome: 'Derivada direcional',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7, alvo: [0, 0, 0.35] });
          const G = M.plano({ janela: [-0.2, 6.6, -1.7, 1.7], livre: true, dica: 'Derivada na direção v em função do ângulo θ' });
          M.funcao('f', { vars: ['x', 'y'], valor: F.raiz.valor, ramos: true, exemplos: EXS });
          M.barra('th', { rot: '$\\theta$', cor: cor.b, min: 0, max: 2 * Math.PI, valor: 0.785, fmt: CM.graus, circular: true, nome: 'ângulo de v', dur: 7000 });
          M.barra('x0', { rot: '$a_1$', cor: cor.u, min: -1, max: 1, valor: 0 });
          M.barra('y0', { rot: '$a_2$', cor: cor.v, min: -1, max: 1, valor: 0 });
          M.caixa('pv', { rot: 'Plano vertical do corte', valor: true });
          const est = (S) => { const f = M.F.f.f, a = [S.x0, S.y0], v = [Math.cos(S.th), Math.sin(S.th)]; return { f, a, v, L: lateral(f, a, v), D: parciais(f, a) }; };
          M.cena(V, (C, S) => {
            const { f, a, v, L } = est(S);
            const zr = CDI.faixaZ(f, -1.15, 1.15, -1.15, 1.15);
            cenaSup(C, S, cor, f, zr);
            const P = [a[0], a[1], f(a[0], a[1])];
            if (S.pv) C.poli([[a[0] - 1.1 * v[0], a[1] - 1.1 * v[1], zr[0]], [a[0] + 1.1 * v[0], a[1] + 1.1 * v[1], zr[0]], [a[0] + 1.1 * v[0], a[1] + 1.1 * v[1], zr[1]], [a[0] - 1.1 * v[0], a[1] - 1.1 * v[1], zr[1]]], { cor: cor.b, alfa: 0.12, plano: 1 });
            C.param((t) => [a[0] + t * v[0], a[1] + t * v[1], f(a[0] + t * v[0], a[1] + t * v[1])], -1, 1, 100, { cor: cor.b, larg: 3.4 });
            const tg = (s, d, c) => C.linha(P, [P[0] + s * 0.6 * v[0], P[1] + s * 0.6 * v[1], P[2] + s * 0.6 * d], { cor: c, larg: 3.2 });
            if (Math.abs(L.dp) < 50) tg(1, L.dp, cor.ouro);
            if (Math.abs(L.dm) < 50) tg(-1, L.dm, L.ok ? cor.ouro : cor.u);
            C.seta([a[0], a[1], 0], [0.7 * v[0], 0.7 * v[1], 0], { cor: cor.b, rot: '$v$' });
            C.ponto(P, { cor: cor.u, rot: '$P$' });
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
            if (D.ok) P.curva(gv, { cor: cor.ouro, larg: 2, trac: [6, 5] });
            const l = lateral(f, a, [Math.cos(S.th), Math.sin(S.th)]);
            if (Math.abs(l.dp) < 10) P.ponto([S.th, l.dp], { cor: cor.b, r: 5 });
            P.texto([0.15, 1.5], 'azul: t → 0⁺   laranja: t → 0⁻   tracejado: ∇f(a)·v', { cor: cor.m, al: 'left', tam: 11.5, peso: 400 });
          });
          M.leituras('Na direção $v$', (S) => {
            const { a, v, L, D } = est(S);
            const lim = (x) => (Math.abs(x) < 1e4 ? '$' + TX.n(x, 3) + '$' : '$\\pm\\infty$');
            const rows = [['$v=(\\cos\\theta;\\sin\\theta)$', '$' + TX.v(v, 3) + '$'], ['$\\lim_{t\\to0^+}\\frac{f(a+tv)-f(a)}{t}$', lim(L.dp)], ['$\\lim_{t\\to0^-}\\frac{f(a+tv)-f(a)}{t}$', lim(L.dm)], ['$\\frac{\\partial f}{\\partial v}(a)$', L.ok ? '$' + TX.n(L.d, 3) + '$' : 'não existe', L.ok ? 'forte' : 'mau']];
            if (D.ok) rows.push(['$\\nabla f(a)\\cdot v$', '$' + TX.n(D.fx * v[0] + D.fy * v[1], 3) + '$']);
            const R = dif(M.F.f.f, a);
            rows.push(R.dif ? 'Diferenciável: $\\frac{\\partial f}{\\partial v}(a)=Df(a)v$ para todo o $v$. As curvas coincidem.' : 'Não diferenciável em $a$: $\\frac{\\partial f}{\\partial v}(a)$ não é $Df(a)v$ em todas as direções.');
            return rows;
          });
          M.texto('<b class="t">Derivada direcional</b>$$\\frac{\\partial f}{\\partial v}(a)=\\lim_{t\\to0}\\frac{f(a+tv)-f(a)}{t}$$<p>É o declive da curva azul (o corte da superfície pelo plano vertical na direção $v$). As parciais são os casos $v=e_1$ e $v=e_2$. Se $f$ é diferenciável em $a$, $\\frac{\\partial f}{\\partial v}(a)=Df(a)v=\\nabla f(a)\\cdot v$.</p><p>Em $\\frac{xy}{\\sqrt{x^2+y^2}}$ na origem, com $v=\\frac{(1;1)}{\\sqrt2}$, o limite dá $+\\tfrac12$ por um lado e $-\\tfrac12$ pelo outro: não existe.</p>', 'nota');
          M.legenda([[cor.b, 'corte na direção $v$'], [cor.ouro, 'tangente ($t\\to0^+$)'], [cor.u, 'tangente ($t\\to0^-$), quando difere']]);
        },
      },
      {
        id: 'jacobiana', nome: 'Jacobiana',
        montar(M) {
          const cor = M.cores();
          const MAP = {
            lin: { tex: '(x+y;\\,x-3y)', F: (x, y) => [x + y, x - 3 * y], J: '\\begin{bmatrix}1&1\\\\1&-3\\end{bmatrix}', a: [0.5, 0.5] },
            pol: { tex: '(x\\cos y;\\,x\\sin y)', F: (x, y) => [x * Math.cos(y), x * Math.sin(y)], J: '\\begin{bmatrix}\\cos y&-x\\sin y\\\\\\sin y&x\\cos y\\end{bmatrix}', a: [1.2, 0.6] },
            quad: { tex: '(x^2-y^2;\\,2xy)', F: (x, y) => [x * x - y * y, 2 * x * y], J: '\\begin{bmatrix}2x&-2y\\\\2y&2x\\end{bmatrix}', a: [1, 0.5] },
            xy: { tex: '(xy;\\,y/x)', F: (x, y) => [x * y, y / x], J: '\\begin{bmatrix}y&x\\\\-y/x^2&1/x\\end{bmatrix}', a: [1.5, 1] },
          };
          const D1 = M.plano({ janela: [-2.6, 2.6, -2, 2], dica: 'Domínio: arrasta a' });
          const D2 = M.plano({ janela: [-3, 3, -2.3, 2.3], dica: 'Imagem: F (cheio) e a aproximação linear (tracejado)' });
          M.S.a = [0.5, 0.5];
          const SRC = { lin: '(x+y; x-3y)', pol: '(x cos y; x sen y)', quad: '(x^2-y^2; 2xy)', xy: '(xy; y/x)' };
          Object.keys(MAP).forEach((k) => (MAP[k].valor = SRC[k]));
          M.funcao('F', { rot: '$F(x;y)=$', vars: ['x', 'y'], componentes: 2, valor: SRC.lin, exemplos: Object.keys(MAP).map((k) => ['$' + MAP[k].tex + '$', SRC[k], { a: MAP[k].a.slice() }]) });
          const mapa = () => { const f = M.F.F.f; return { F: (x, y) => f(x, y), J: (Object.values(MAP).find((q) => q.valor === M.S.F) || {}).J }; };
          M.barra('s', { rot: 'lado', cor: cor.n, min: 0.05, max: 1, valor: 0.6, nome: 'lado do quadrado', dica: 'Encolhe o quadrado: a imagem por F fica cada vez mais igual à imagem por DF(a), um paralelogramo.' });
          const quad = (S) => { const h = S.s / 2, a = S.a; const L = []; for (let i = 0; i <= 4; i++) { const u = -h + (2 * h * i) / 4; L.push({ c: i === 0 ? 'u' : i === 4 ? 'u' : 'm', pts: Array.from({ length: 41 }, (_, k) => [a[0] + u, a[1] - h + (2 * h * k) / 40]) }); L.push({ c: i === 0 || i === 4 ? 'v' : 'm', pts: Array.from({ length: 41 }, (_, k) => [a[0] - h + (2 * h * k) / 40, a[1] + u]) }); } return L; };
          M.cena(D1, (P, S) => {
            P.eixos();
            quad(S).forEach((l) => P.curva(l.pts, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: l.c === 'm' ? 1 : 2.2, alfa: l.c === 'm' ? 0.6 : 1 }));
            P.seta(S.a, [S.s / 2, 0], { cor: cor.u, rot: 'e₁' });
            P.seta(S.a, [0, S.s / 2], { cor: cor.v, rot: 'e₂' });
            P.ponto(S.a, { cor: cor.i, rot: 'a', arr: (x, y) => M.definir({ a: [x, y] }) });
          });
          M.cena(D2, (P, S) => {
            const mp = mapa(), Fa = mp.F(S.a[0], S.a[1]), J = CM.jac(mp.F, S.a[0], S.a[1]);
            const L = quad(S).map((l) => ({ c: l.c, f: l.pts.map((p) => mp.F(p[0], p[1])), g: l.pts.map((p) => CM.add(Fa, CM.mxv(J, [p[0] - S.a[0], p[1] - S.a[1]]))) }));
            let m = 0.3;
            L.forEach((l) => l.f.concat(l.g).forEach((q) => { if (isFinite(q[0])) m = Math.max(m, Math.abs(q[0] - Fa[0]), Math.abs(q[1] - Fa[1])); }));
            D2.j0 = [Fa[0] - 1.5 * m, Fa[0] + 1.5 * m, Fa[1] - 1.5 * m, Fa[1] + 1.5 * m];
            D2.c = Fa.slice();
            P.eixos(['u', 'v']);
            L.forEach((l) => P.curva(l.g, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: 1.3, trac: [5, 4], alfa: 0.75 }));
            L.forEach((l) => P.curva(l.f, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: l.c === 'm' ? 1 : 2.2, alfa: l.c === 'm' ? 0.6 : 1 }));
            P.seta(Fa, [(J[0][0] * S.s) / 2, (J[1][0] * S.s) / 2], { cor: cor.u, rot: 'DF(a)e₁' });
            P.seta(Fa, [(J[0][1] * S.s) / 2, (J[1][1] * S.s) / 2], { cor: cor.v, rot: 'DF(a)e₂' });
            P.ponto(Fa, { cor: cor.i, rot: 'F(a)' });
          });
          M.leituras('Em $a$', (S) => {
            const mp = mapa(), J = CM.jac(mp.F, S.a[0], S.a[1]);
            return [['$a$', '$' + TX.v(S.a, 2) + '$'], ['$F(a)$', '$' + TX.v(mp.F(S.a[0], S.a[1]), 3) + '$'], ].concat(mp.J ? [['$DF(x;y)$', '$' + mp.J + '$']] : []).concat([['$DF(a)$', '$' + TX.m(J, 3) + '$', 'forte'], ['$\\det DF(a)$', '$' + TX.n(CM.det2(J), 3) + '$']]);
          });
          M.texto('<b class="t">A Jacobiana coluna a coluna</b><p>A coluna $j$ de $DF(a)$ é $DF(a)e_j=\\frac{\\partial F}{\\partial x_j}(a)$: deriva-se cada componente em ordem a $x_j$ e põe-se em coluna. $F:\\mathbb R^n\\to\\mathbb R^m$ dá uma matriz $m\\times n$ (uma linha por componente, uma coluna por variável).</p><p>Exemplo das teóricas: $f(x;y)=(x;\\,xy;\\,x/y)$ dá</p>$$Df(x;y)=\\begin{bmatrix}1&0\\\\y&x\\\\1/y&-x/y^2\\end{bmatrix}.$$<p>Para $g(t)=(t;\\,t^2;\\,\\arctan t)$, $Dg(t)=g\'(t)=\\big(1;\\,2t;\\,\\frac{1}{1+t^2}\\big)$, uma coluna.</p>', 'nota');
          M.legenda([[cor.u, 'lados com $x$ constante e $DF(a)e_1$'], [cor.v, 'lados com $y$ constante e $DF(a)e_2$'], [cor.m, 'tracejado: $F(a)+DF(a)(x-a)$']]);
        },
      },
    ],
    explicar: [
      { modelo: 'definicao', titulo: 'Da reta ao plano tangente', estado: { f: 'quad', x0: 0.5, y0: 0.3, hn: 0.5, ha: 0.785, plano: true }, texto: "<p>Em CDI I: $y=f'(a)(x-a)+f(a)$. Em $\\mathbb R^2$ o gráfico de $f$ é uma superfície e a melhor aproximação linear é o plano</p>$$z=f(a)+\\frac{\\partial f}{\\partial x}(a)(x-a_1)+\\frac{\\partial f}{\\partial y}(a)(y-a_2).$$" },
      { modelo: 'definicao', titulo: 'O erro é o(h)', estado: { f: 'quad', x0: 0.5, y0: 0.3, hn: 0.6, ha: 0.785 }, texto: '<p>O segmento vermelho é o erro $f(a+h)-f(a)-Df(a)h$. Ser diferenciável quer dizer que o erro vai para $0$ <b>mais depressa do que $\\|h\\|$</b>: o rácio no gráfico de baixo tende para $0$.</p><p>Carrega em ▶ ao lado de $\\|h\\|$ e vê o segmento encolher.</p>' },
      { modelo: 'definicao', titulo: 'Parciais = colunas de Df(a)', estado: { f: 'quad', x0: 0.5, y0: 0.3, hn: 0.5, ha: 0 }, texto: '<p>Com $h=te_j$, a definição dá $\\lim_{t\\to0}\\frac{f(a+te_j)-f(a)}{t}=Df(a)e_j=\\frac{\\partial f}{\\partial x_j}(a)$.</p><p>É a derivada em ordem a $x_j$ com as outras variáveis fixas. Aqui $h$ aponta na direção de $x$: $\\frac{\\partial f}{\\partial x}(a)=2a_1=1$.</p>' },
      { modelo: 'definicao', titulo: 'Contraexemplo: não contínua', estado: { f: 'desc', x0: 0, y0: 0, hn: 0.4, ha: 0.785 }, texto: '<p>$f=\\frac{xy}{x^2+y^2}$ vale $\\tfrac12$ em toda a reta $y=x$ (fora da origem) e $f(0;0)=0$: não é contínua na origem.</p><p>Como diferenciável $\\Rightarrow$ contínua, não é diferenciável, mesmo tendo as duas parciais nulas.</p>' },
      { modelo: 'definicao', titulo: 'Contraexemplo: parciais existem e não chega', estado: { f: 'raiz', x0: 0, y0: 0, hn: 0.5, ha: 0.785 }, texto: '<p>$f=\\frac{xy}{\\sqrt{x^2+y^2}}$ é contínua e $\\frac{\\partial f}{\\partial x}(0;0)=\\frac{\\partial f}{\\partial y}(0;0)=0$. O candidato a plano é $z=0$.</p><p>Mas na direção de $45^\\circ$ o rácio vale sempre $\\tfrac12$: o erro não é $o(h)$. <b>Existirem as parciais não implica ser diferenciável.</b> O que garante diferenciabilidade é as parciais serem contínuas ($C^1$).</p>' },
      { modelo: 'direcional', titulo: 'Derivada direcional', estado: { f: 'quad', x0: 0.4, y0: 0.2, th: 1, pv: true }, texto: '<p>Corta-se a superfície pelo plano vertical na direção $v$. O declive da curva em $P$ é $\\frac{\\partial f}{\\partial v}(a)$.</p><p>Se $f$ é diferenciável, $\\frac{\\partial f}{\\partial v}(a)=\\nabla f(a)\\cdot v$: a curva azul coincide com a tracejada para todos os $\\theta$.</p>' },
      { modelo: 'direcional', titulo: 'Quando não existe', estado: { f: 'raiz', x0: 0, y0: 0, th: 0.785, pv: true }, texto: '<p>Em $\\frac{xy}{\\sqrt{x^2+y^2}}$ na origem, com $v=\\frac{(1;1)}{\\sqrt2}$: $\\frac{f(tv)-f(0)}{t}=\\frac{|t|}{2t}$, que vale $+\\tfrac12$ para $t&gt;0$ e $-\\tfrac12$ para $t&lt;0$. O limite não existe: as duas meias-tangentes (dourada e laranja) não estão alinhadas.</p><p>Só nos eixos ($\\theta=0^\\circ, 90^\\circ,\\dots$) os dois limites coincidem.</p>' },
      { modelo: 'jacobiana', titulo: 'A Jacobiana lineariza', estado: { m: 'pol', a: [1.2, 0.6], s: 0.6 }, texto: '<p>Um quadradinho à volta de $a$ é levado por $F$ numa figura curva (cheio). $DF(a)$ leva-o num paralelogramo (tracejado), gerado pelas colunas $DF(a)e_1$ e $DF(a)e_2$.</p><p>Quanto mais pequeno o quadrado, mais as duas figuras coincidem: é isso que diz $F(a+h)=F(a)+DF(a)h+o(h)$.</p>' },
    ],
    testa: [
      { modelo: 'definicao', estado: { f: 'raiz', x0: 0, y0: 0, ha: 0.785, hn: 0.5 }, p: '$f(x;y)=\\frac{xy}{\\sqrt{x^2+y^2}}$, $f(0;0)=0$. Na origem:', op: ['é diferenciável, porque as parciais existem', 'as parciais existem e valem $0$, mas $f$ não é diferenciável', '$f$ não é contínua', 'as parciais não existem'], certa: 1, porque: '$f(t;0)=f(0;t)=0$ dá parciais nulas. Mas $\\frac{|f(h)|}{\\|h\\|}=\\frac{|h_1h_2|}{\\|h\\|^2}$ vale $\\tfrac12$ na diagonal. $f$ é contínua, porque $|f|\\le\\|h\\|/2$.' },
      { p: 'Qual destas condições garante que $f$ é diferenciável em $a$?', op: ['As derivadas parciais existem em $a$', '$f$ é contínua em $a$', 'As parciais existem numa vizinhança de $a$ e são contínuas em $a$', 'Existem todas as derivadas direcionais em $a$'], certa: 2, porque: 'Parciais contínuas ($f$ de classe $C^1$) é condição suficiente. Há funções com todas as derivadas direcionais que nem são contínuas.' },
      { modelo: 'jacobiana', estado: { m: 'lin', a: [0.5, 0.5], s: 0.6 }, p: 'Para $f:\\mathbb R^2\\to\\mathbb R^3$, a matriz $Df(a)$ tem:', op: ['2 linhas e 3 colunas', '3 linhas e 2 colunas', '3 linhas e 3 colunas', '1 linha e 2 colunas'], certa: 1, porque: 'Uma linha por componente de $f$ (3) e uma coluna por variável (2). $Df(a)h$ tem de estar em $\\mathbb R^3$ para $h\\in\\mathbb R^2$.' },
      { p: '$f(x;y)=(x+y;\\,x-3y;\\,x-y)$. Quanto vale $Df(x;y)$?', op: ['$\\begin{bmatrix}1&1\\\\1&-3\\\\1&-1\\end{bmatrix}$, igual em todos os pontos', '$\\begin{bmatrix}y&x\\\\-3y&x\\\\-1&x\\end{bmatrix}$', '$\\begin{bmatrix}1&1&1\\\\1&-3&-1\\end{bmatrix}$', 'Depende de $(x;y)$'], certa: 0, porque: '$f$ é linear, $f(x)=Ax$, e $f(a+h)-f(a)=Ah$ exatamente. A derivada de uma função linear é a própria matriz $A$.' },
      { modelo: 'direcional', estado: { f: 'cone', x0: 0, y0: 0, th: 0 }, p: 'Para $f(x;y)=\\sqrt{x^2+y^2}$, quanto vale $\\frac{\\partial f}{\\partial x}(0;0)$?', op: ['$0$', '$1$', 'Não existe', '$+\\infty$'], certa: 2, porque: '$\\frac{f(t;0)-f(0;0)}{t}=\\frac{|t|}{t}$ vale $1$ para $t&gt;0$ e $-1$ para $t&lt;0$. O cone tem um bico na origem.' },
      { p: '$g(t)=(t;\\,t^2;\\,\\arctan t)$. Quanto vale $Dg(t)$?', op: ['$\\big(1;\\,2t;\\,\\frac{1}{1+t^2}\\big)$, em coluna', '$\\big[\\,1\\ \\ 2t\\ \\ \\frac{1}{1+t^2}\\,\\big]$ em linha', '$(1;2;1)$', '$1+2t+\\frac{1}{1+t^2}$'], certa: 0, porque: '$g:\\mathbb R\\to\\mathbb R^3$ dá uma matriz $3\\times1$: deriva-se cada componente. É o vetor tangente à linha descrita por $g$.' },
    ],
  });
})();
