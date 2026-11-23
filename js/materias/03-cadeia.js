/* 3. Regra da cadeia: D(f∘g)(a) = Df(g(a)) Dg(a). */
(function () {
  const FN = {
    quad: { tex: 'x^2+y^2', f: (x, y) => x * x + y * y, z: [0, 2.6] },
    sela: { tex: 'x^2-y^2', f: (x, y) => x * x - y * y, z: [-1.7, 1.7] },
    xy: { tex: 'xy', f: (x, y) => x * y, z: [-1.7, 1.7] },
    sino: { tex: 'e^{-x^2-y^2}', f: (x, y) => Math.exp(-x * x - y * y), z: [0, 1.1] },
  };
  const CU = {
    circ: { tex: '(\\cos t;\\,\\sin t)', g: (t) => [Math.cos(t), Math.sin(t)], t: [0, 2 * Math.PI], t0: 1 },
    parab: { tex: '(t;\\,t^2)', g: (t) => [t, t * t], t: [-1.1, 1.1], t0: 0.6 },
    reta: { tex: 'A+t(B-A)', g: (t) => [-1 + 2 * t, -0.5 + 1.3 * t], t: [0, 1], t0: 0.4 },
  };
  const dg = (g, t, h = 1e-6) => { const a = g(t + h), b = g(t - h); return [(a[0] - b[0]) / (2 * h), (a[1] - b[1]) / (2 * h)]; };

  CDI.materia({
    id: 'cadeia', ordem: 3, grupo: 'Cálculo diferencial', curto: 'Regra da cadeia', titulo: 'Regra da cadeia', paginas: 'pp. 16–21',
    resumo: '$f\\circ g$ ao longo de uma curva e na forma matricial: a derivada da composta é o produto das Jacobianas.',
    modelos: [
      {
        id: 'curva', nome: 'Ao longo de uma curva',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.8, alvo: [0, 0, 0.3] });
          const G = M.plano({ janela: [-0.3, 6.6, -2, 2.6], livre: true, dica: 'h(t) = f(g(t)) e a reta tangente em t' });
          M.escolha('f', { rot: '$f(x;y)$', opcoes: Object.keys(FN).map((k) => [k, '$' + FN[k].tex + '$']), valor: 'sela' });
          M.escolha('c', { rot: '$g(t)$', opcoes: Object.keys(CU).map((k) => [k, '$' + CU[k].tex + '$']), valor: 'circ', aoMudar: (k) => (M.S.t = CU[k].t0) });
          M.barra('t', { rot: '$t$', cor: cor.n, min: 0, max: 2 * Math.PI, valor: 1, nome: 'parâmetro t', dur: 7000, fmt: (x) => CM.fmt(x, 2) });
          M.caixa('vet', { rot: "$\\nabla f$ e $g'(t)$ no plano", valor: true });
          const sync = () => { const c = CU[M.S.c], b = M.ctl.querySelector('input[aria-label="parâmetro t"]'); if (b) { b.min = c.t[0]; b.max = c.t[1]; } M.S.t = CM.clamp(M.S.t, c.t[0], c.t[1]); };
          M.sync.unshift(sync);
          const est = (S) => {
            const f = FN[S.f].f, c = CU[S.c], p = c.g(S.t), v = dg(c.g, S.t), gr = CM.grad(f, p[0], p[1]);
            const hp = CM.dot(gr, v);
            const num = (f(...c.g(S.t + 1e-5)) - f(...c.g(S.t - 1e-5))) / 2e-5;
            return { f, c, p, v, gr, hp, num };
          };
          M.cena(V, (C, S) => {
            const { f, c, p, v, gr, hp } = est(S);
            const zr = FN[S.f].z;
            C.eixos({ x: [-1.5, 1.5], y: [-1.5, 1.5], z: [Math.min(-0.2, zr[0]), Math.max(1.3, zr[1])] });
            C.sup((r, th) => { const x = r * Math.cos(th), y = r * Math.sin(th), z = f(x, y); return z < zr[0] || z > zr[1] ? null : [x, y, z]; }, 0, 1.12, 0, 2 * Math.PI, 20, 60, { alfa: 0.6 });
            C.param((t) => { const q = c.g(t); return [q[0], q[1], 0.003]; }, c.t[0], c.t[1], 120, { cor: cor.n, larg: 2, alfa: 0.7 });
            C.param((t) => { const q = c.g(t); return [q[0], q[1], f(q[0], q[1])]; }, c.t[0], c.t[1], 160, { cor: cor.n, larg: 3.6 });
            const P = [p[0], p[1], f(p[0], p[1])];
            C.linha([p[0], p[1], 0], P, { cor: cor.m, larg: 1, trac: [3, 4] });
            if (S.vet) {
              C.seta([p[0], p[1], 0], [0.45 * v[0], 0.45 * v[1], 0], { cor: cor.u, rot: "$g'(t)$" });
              const gn = Math.hypot(gr[0], gr[1]);
              if (gn > 1e-6) C.seta([p[0], p[1], 0], [(0.45 * gr[0]) / Math.max(1, gn), (0.45 * gr[1]) / Math.max(1, gn), 0], { cor: cor.v, rot: '$\\nabla f$' });
            }
            C.seta(P, CM.mul(CM.nrm([v[0], v[1], hp]), 0.55), { cor: cor.ouro, larg: 2.8 });
            C.ponto([p[0], p[1], 0], { cor: cor.n, r: 4 });
            C.ponto(P, { cor: cor.n, rot: '$f(g(t))$' });
          });
          M.cena(G, (P, S) => {
            const { f, c, hp } = est(S);
            G.j0 = [c.t[0] - 0.08 * (c.t[1] - c.t[0]), c.t[1] + 0.05 * (c.t[1] - c.t[0]), -2, 2.6];
            G.c = [(G.j0[0] + G.j0[1]) / 2, 0.3];
            P.eixos(['t', 'h']);
            P.param((t) => [t, f(...c.g(t))], c.t[0], c.t[1], 240, { cor: cor.n, larg: 2.6 });
            const h0 = f(...c.g(S.t)), d = 0.35 * (c.t[1] - c.t[0]);
            P.curva([[S.t - d, h0 - d * hp], [S.t + d, h0 + d * hp]], { cor: cor.ouro, larg: 2.4 });
            P.ponto([S.t, h0], { cor: cor.n, rot: "declive h′(t)", dy: -16 });
          });
          M.leituras('$h(t)=f(g(t))$', (S) => {
            const { p, v, gr, hp, num } = est(S);
            return [['$g(t)$', '$' + TX.v(p, 3) + '$'], ["$g'(t)$", '$' + TX.v(v, 3) + '$'], ['$\\nabla f(g(t))$', '$' + TX.v(gr, 3) + '$'], '—', ["$h'(t)=\\nabla f(g(t))\\cdot g'(t)$", '$' + TX.n(hp, 3) + '$', 'forte'], ['derivada numérica de $h$', '$' + TX.n(num, 3) + '$'], Math.abs(hp) < 1e-3 ? "$\\nabla f(g(t))\\perp g'(t)$: neste instante a curva segue uma linha de nível e $h$ não varia." : hp > 0 ? "O ângulo entre $\\nabla f$ e $g'(t)$ é agudo: $h$ está a crescer." : "O ângulo entre $\\nabla f$ e $g'(t)$ é obtuso: $h$ está a decrescer."];
          });
          M.texto("<b class=\"t\">Regra da cadeia ao longo de uma curva</b><p>Se $g:\\mathbb R\\to\\mathbb R^n$ e $f:\\mathbb R^n\\to\\mathbb R$ são diferenciáveis, $h=f\\circ g$ tem</p>$$h'(t)=Df(g(t))\\,Dg(t)=\\nabla f(g(t))\\cdot g'(t).$$<p>Matricialmente é uma linha ($1\\times n$) vezes uma coluna ($n\\times1$).</p>", 'nota');
          M.legenda([[cor.n, '$g(t)$ no plano e $f(g(t))$ na superfície'], [cor.u, "$g'(t)$"], [cor.v, '$\\nabla f(g(t))$'], [cor.ouro, "tangente: declive $h'(t)$"]]);
        },
      },
      {
        id: 'matriz', nome: 'Forma matricial',
        montar(M) {
          const cor = M.cores();
          const E = Math.E;
          const g = (x, y) => [x + y, Math.exp(x) - y];
          const FF = {
            aula: { tex: '3u+4v', nome: '$3u+4v$ (exemplo da aula)', f: (u, v) => 3 * u + 4 * v },
            uv: { tex: 'uv', nome: '$uv$', f: (u, v) => u * v },
            q: { tex: 'u^2+v^2', nome: '$u^2+v^2$', f: (u, v) => u * u + v * v },
          };
          const W = 1.5;
          const A = M.vista3d({ ext: 1.9, alvo: [0, 0, 0.4], yaw: -0.85, pitch: 0.5, dica: 'Gráfico de h = f∘g (altura à escala) · arrasta o ponto no chão' });
          const B = M.plano({ janela: [-2, 3, -1, 4.5], dica: '(u; v) = g(x; y), com as linhas de nível de f' });
          M.S.p = [1, -1];
          M.escolha('f', { rot: '$f(u;v)$', opcoes: Object.keys(FF).map((k) => [k, FF[k].nome]), valor: 'aula' });
          M.caixa('tp', { rot: 'Plano tangente ao gráfico de $h$', valor: true });
          M.botoes([['Exemplo da aula: $(x;y)=(1;-1)$', () => M.definir({ p: [1, -1], f: 'aula' })]]);
          const est = (S) => {
            const f = FF[S.f].f, q = g(...S.p), J = CM.jac((x, y) => g(x, y), ...S.p), gr = CM.grad(f, ...q);
            const Dh = [CM.dot(gr, [J[0][0], J[1][0]]), CM.dot(gr, [J[0][1], J[1][1]])];
            return { f, q, J, gr, Dh, h: (x, y) => f(...g(x, y)) };
          };
          let escala = null;
          M.cena(A, (C, S) => {
            const { h, Dh } = est(S);
            if (!escala || escala.f !== S.f) { let m = 0; for (let i = 0; i <= 16; i++) for (let j = 0; j <= 16; j++) m = Math.max(m, Math.abs(h(-W + (2 * W * i) / 16, -W + (2 * W * j) / 16))); escala = { f: S.f, k: 1.5 / m }; }
            const k = escala.k, [x0, y0] = S.p, z0 = k * h(x0, y0);
            C.eixos({ x: [-W - 0.1, W + 0.3], y: [-W - 0.1, W + 0.3], z: [-1.6, 1.8], nomes: ['x', 'y', 'h'] });
            C.grafico((x, y) => k * h(x, y), -W, W, -W, W, 40, { alfa: 0.62 });
            if (S.tp) {
              const L = 0.55, pl = (a, b) => [x0 + a, y0 + b, z0 + k * (Dh[0] * a + Dh[1] * b)];
              C.poli([pl(-L, -L), pl(L, -L), pl(L, L), pl(-L, L)], { cor: cor.ouro, alfa: 0.3, plano: 1 });
              C.curva([pl(-L, -L), pl(L, -L), pl(L, L), pl(-L, L), pl(-L, -L)], { cor: cor.ouro, larg: 1.2, alfa: 0.8 });
            }
            C.param((s) => [x0 + s, y0, k * h(x0 + s, y0)], -0.7, 0.7, 40, { cor: cor.u, larg: 2.2, alfa: 0.9 });
            C.param((s) => [x0, y0 + s, k * h(x0, y0 + s)], -0.7, 0.7, 40, { cor: cor.v, larg: 2.2, alfa: 0.9 });
            C.seta([x0, y0, z0], CM.mul(CM.nrm([1, 0, k * Dh[0]]), 0.6), { cor: cor.u, rot: '$\\partial_x h$' });
            C.seta([x0, y0, z0], CM.mul(CM.nrm([0, 1, k * Dh[1]]), 0.6), { cor: cor.v, rot: '$\\partial_y h$' });
            C.linha([x0, y0, 0], [x0, y0, z0], { cor: cor.m, larg: 1, trac: [3, 3] });
            C.ponto([x0, y0, z0], { cor: cor.i, r: 5 });
            C.ponto([x0, y0, 0], { cor: cor.i, r: 4, rot: '$(x;y)$', arr: (x, y) => M.definir({ p: [CM.clamp(x, -W, W), CM.clamp(y, -W, W)] }) });
          });
          M.cena(B, (P, S) => {
            const { f, q, J, gr } = est(S);
            B.c = q.slice();
            P.eixos(['u', 'v']);
            const [x0, x1, y0, y1] = P.limites();
            const vals = [];
            for (let i = 0; i < 14; i++) vals.push(f(x0 + ((x1 - x0) * i) / 13, y0 + ((y1 - y0) * ((i * 7) % 13)) / 13));
            const lo = Math.min(...vals), hi = Math.max(...vals);
            for (let i = 1; i < 12; i++) P.nivel(f, lo + ((hi - lo) * i) / 12, { cor: cor.m, larg: 1, alfa: 0.5 });
            P.nivel(f, f(...q), { cor: cor.n, larg: 2 });
            P.seta(q, [0.3 * J[0][0], 0.3 * J[1][0]], { cor: cor.u, rot: 'Dg e₁' });
            P.seta(q, [0.3 * J[0][1], 0.3 * J[1][1]], { cor: cor.v, rot: 'Dg e₂' });
            const gn = Math.hypot(...gr);
            P.seta(q, CM.mul(gr, Math.min(1.2, gn) / Math.max(gn, 1e-9)), { cor: cor.ouro, rot: '$∇f$' });
            P.ponto(q, { cor: cor.i, rot: 'g(x; y)' });
          });
          M.leituras('$h(x;y)=f(x+y;\\,e^x-y)$', (S) => {
            const { q, J, gr, Dh } = est(S);
            const aula = S.f === 'aula' && Math.abs(S.p[0] - 1) < 0.02 && Math.abs(S.p[1] + 1) < 0.02;
            return [['$(x;y)$', '$' + TX.v(S.p, 2) + '$'], ['$g(x;y)=(x+y;\\,e^x-y)$', '$' + TX.v(q, 3) + '$'], ['$Dg=\\begin{bmatrix}1&1\\\\e^x&-1\\end{bmatrix}$', '$' + TX.m(J, 3) + '$'], ['$Df(g(x;y))$', '$' + TX.m([gr], 3) + '$'], '—', ['$Dh=Df(g)\\,Dg$', '$' + TX.m([Dh], 3) + '$', 'forte'], aula ? 'Com $\\nabla f(0;e+1)=(3;4)$: $Dh(1;-1)=[\\,3+4e\\ \\ -1\\,]=[\\,' + TX.n(3 + 4 * E, 3) + '\\ \\ -1\\,]$.' : 'Cada entrada de $Dh$ é $\\nabla f\\cdot$ (uma coluna de $Dg$): $\\frac{\\partial h}{\\partial x}=\\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial x}+\\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial x}$. São os declives das setas laranja e verde no gráfico.'];
          });
          M.texto('<b class="t">Composição de Jacobianas</b><p>$\\mathbb R^n\\xrightarrow{g}\\mathbb R^p\\xrightarrow{f}\\mathbb R^m$, com $g$ diferenciável em $a$ e $f$ diferenciável em $g(a)$:</p>$$D(f\\circ g)(a)=Df(g(a))\\,Dg(a),\\qquad (m\\times p)(p\\times n)=m\\times n.$$<p>Na vista 3D, $Dh$ dá os declives do plano tangente ao gráfico de $h$: $\\frac{\\partial h}{\\partial x}$ na direção de $x$ (laranja) e $\\frac{\\partial h}{\\partial y}$ na de $y$ (verde).</p><p>Exemplo das teóricas: $t\\mapsto(t;t^2)\\mapsto f(t;t^2)$, com $Df(1;1)=\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}$ e $Dg(1)=\\begin{bmatrix}1\\\\2\\end{bmatrix}$: $D(f\\circ g)(1)=(5;11;17)$.</p>', 'nota');
          M.legenda([[cor.u, '$x$ a variar: $Dg\\,e_1$ e $\\partial h/\\partial x$'], [cor.v, '$y$ a variar: $Dg\\,e_2$ e $\\partial h/\\partial y$'], [cor.ouro, '$\\nabla f$ e plano tangente'], [cor.n, 'nível de $f$ por $g(x;y)$']]);
        },
      },
    ],
    explicar: [
      { modelo: 'curva', titulo: 'h = f∘g ao longo de uma curva', estado: { f: 'sela', c: 'circ', t: 0.6, vet: true }, texto: '<p>$g(t)=(\\cos t;\\sin t)$ percorre a circunferência no plano. Por cima, a curva roxa é $(g(t);f(g(t)))$ na superfície $z=x^2-y^2$.</p><p>$h(t)=f(g(t))=\\cos^2t-\\sin^2t=\\cos2t$, o gráfico de baixo.</p>' },
      { modelo: 'curva', titulo: "h′(t) = ∇f(g(t)) · g′(t)", estado: { f: 'sela', c: 'circ', t: 0.6 }, texto: "<p>$\\nabla f=(2x;-2y)$ e $g'(t)=(-\\sin t;\\cos t)$. O produto interno dá $-4\\sin t\\cos t=-2\\sin2t$, a derivada de $\\cos2t$. A reta dourada tem esse declive.</p>" },
      { modelo: 'curva', titulo: 'Perpendicular ⇒ h′ = 0', estado: { f: 'quad', c: 'circ', t: 1.2 }, texto: "<p>Com $f=x^2+y^2$, a circunferência é uma linha de nível: $h(t)=1$ é constante.</p><p>Em todos os pontos, $\\nabla f=2(x;y)$ é radial e $g'(t)$ é tangente: $\\nabla f\\cdot g'=0$. É o gradiente perpendicular às linhas de nível, já com a regra da cadeia.</p>" },
      { modelo: 'matriz', titulo: 'Forma matricial', estado: { f: 'uv', p: [0.3, 0.4], tp: true }, vista: [-0.85, 0.5], texto: '<p>$h(x;y)=f(u(x;y);v(x;y))$ com $(u;v)=g(x;y)=(x+y;\\,e^x-y)$.</p>$$Dh(x;y)=Df(g(x;y))\\,Dg(x;y)$$<p>Linha ($1\\times2$) vezes matriz ($2\\times2$) dá linha ($1\\times2$): as duas entradas são os declives do plano tangente ao gráfico de $h$, nas direções de $x$ e de $y$.</p>' },
      { modelo: 'matriz', titulo: 'O exemplo da aula', estado: { f: 'aula', p: [1, -1], tp: true }, texto: '<p>Dado $\\nabla f(0;e+1)=(3;4)$ e $(x;y)=(1;-1)$: $g(1;-1)=(0;e+1)$.</p>$$Dh(1;-1)=\\begin{bmatrix}3&4\\end{bmatrix}\\begin{bmatrix}1&1\\\\e&-1\\end{bmatrix}=\\begin{bmatrix}3+4e&-1\\end{bmatrix}.$$<p>Para se poder desenhar usa-se $f=3u+4v$, que tem esse gradiente. No gráfico, o plano tangente sobe a pique na direção de $x$ (declive $3+4e\\approx13.9$) e desce devagar na de $y$ (declive $-1$).</p>' },
    ],
    testa: [
      { modelo: 'curva', estado: { f: 'quad', c: 'circ', t: 2 }, p: "$f(x;y)=x^2+y^2$ e $g(t)=(\\cos t;\\sin t)$. Quanto vale $(f\\circ g)'(t)$?", op: ['$2$', '$0$', '$-2\\sin2t$', '$2t$'], certa: 1, porque: '$f(g(t))=\\cos^2t+\\sin^2t=1$, constante. Pela regra da cadeia: $(2\\cos t;2\\sin t)\\cdot(-\\sin t;\\cos t)=0$.' },
      { p: '$g:\\mathbb R^2\\to\\mathbb R^2$ e $f:\\mathbb R^2\\to\\mathbb R$. Que tamanho tem $D(f\\circ g)(a)$?', op: ['$2\\times2$', '$1\\times2$', '$2\\times1$', '$1\\times1$'], certa: 1, porque: '$Df(g(a))$ é $1\\times2$ e $Dg(a)$ é $2\\times2$; o produto é $1\\times2$. Faz sentido: $f\\circ g$ vai de $\\mathbb R^2$ para $\\mathbb R$.' },
      { modelo: 'matriz', estado: { f: 'aula', p: [1, -1], tp: true }, p: '$h(x;y)=f(x+y;\\,e^x-y)$ e $\\nabla f(0;e+1)=(3;4)$. Quanto vale $Dh(1;-1)$?', op: ['$[\\,3\\ \\ 4\\,]$', '$[\\,3+4e\\ \\ -1\\,]$', '$[\\,7\\ \\ -1\\,]$', '$[\\,3e+4\\ \\ 1\\,]$'], certa: 1, porque: '$Dg(1;-1)=\\begin{bmatrix}1&1\\\\e&-1\\end{bmatrix}$. $[3\\ 4]$ vezes essa matriz dá $[3+4e\\ \\ 3-4]$.' },
      { p: '$t\\mapsto(t;t^2)\\mapsto f(t;t^2)$, com $Df(1;1)=\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}$. Quanto vale $D(f\\circ g)(1)$?', op: ['$(1;3;5)$', '$(5;11;17)$', '$(3;7;11)$', 'Não dá para calcular'], certa: 1, porque: '$Dg(1)=(1;2)$. $\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}\\begin{bmatrix}1\\\\2\\end{bmatrix}=(5;11;17)$.' },
      { modelo: 'matriz', estado: { f: 'uv', p: [0.3, 0.4], tp: true }, p: 'O que representam as entradas de $Dh(x;y)$ no gráfico de $h$?', op: ['A altura do gráfico', 'Os declives do plano tangente nas direções de $x$ e de $y$', 'A curvatura', 'As coordenadas de $g(x;y)$'], certa: 1, porque: '$Dh=\\big[\\frac{\\partial h}{\\partial x}\\ \\ \\frac{\\partial h}{\\partial y}\\big]$: o plano tangente é $z=h(a)+\\frac{\\partial h}{\\partial x}(x-a_1)+\\frac{\\partial h}{\\partial y}(y-a_2)$.' },
    ],
  });
})();
