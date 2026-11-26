/* 4. Linhas, vetor tangente, gradiente, linhas e superfícies de nível, plano tangente. */
(function () {
  const PI = Math.PI;
  CDI.modelosDe('gradiente', {
    id: 'gradiente', ordem: 4, grupo: 'Cálculo diferencial', curto: 'Linhas e gradiente', titulo: 'Linhas, gradiente e plano tangente', paginas: 'pp. 18–24',
    resumo: 'Caminhos e vetor tangente; o gradiente é perpendicular às linhas e superfícies de nível.',
    modelos: [
      {
        id: 'linhas', nome: 'Linhas e vetor tangente',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2, 2, -1.6, 2.2] });
          M.S.A = [-1, -0.5]; M.S.B = [1.2, 1.4];
          const CU = {
            circ: { tex: '(r\\cos t;\\,r\\sin t)', g: (t, S) => [S.r * Math.cos(t), S.r * Math.sin(t)], d: (t, S) => [-S.r * Math.sin(t), S.r * Math.cos(t)], t: [0, 2 * PI], dg: "g'(t)=(-r\\sin t;\\,r\\cos t)" },
            parab: { tex: '(t;\\,t^2)', g: (t) => [t, t * t], d: (t) => [1, 2 * t], t: [-1.4, 1.4], dg: "g'(t)=(1;\\,2t)" },
            seg: { tex: 'A+t(B-A)', g: (t, S) => CM.add(S.A, CM.mul(CM.sub(S.B, S.A), t)), d: (t, S) => CM.sub(S.B, S.A), t: [0, 1], dg: "g'(t)=B-A" },
          };
          const cam = CDI.caminho(M, 'g', { valor: '(cos t; sen t)', a: '0', b: '2pi', exemplos: [['$(\\cos t;\\operatorname{sen}t)$', '(cos t; sen t)', '0', '2pi', { t: PI / 2 }], ['$(t;t^2)$', '(t; t^2)', '-1,4', '1,4', { t: 0.6 }], ['$(2\\cos t;\\operatorname{sen}t)$', '(2cos t; sen t)', '0', '2pi', { t: 1 }], ['$(t\\cos t;\\,t\\operatorname{sen}t)$', '(t cos t; t sen t)', '0', '4pi', { t: 3 }]] });
          const CUc = () => { const k = cam(); return { g: (t) => k.g(t), d: (t) => k.d(t), t: [k.a, k.b] }; };
          M.barra('t', { rot: '$t$', cor: cor.n, min: 0, max: 2 * PI, valor: PI / 2, nome: 'parâmetro t', dur: 6000 });
          M.caixa('reta', { rot: 'Reta tangente', valor: true });
          M.botoes([['Exemplo da aula: $(0;1)$ na circunferência', () => M.definir({ c: 'circ', r: 1, t: PI / 2, reta: true })]]);
          M.sync.unshift(() => { const c = CUc(), b = M.ctl.querySelector('input[aria-label="parâmetro t"]'); if (b) { b.min = c.t[0]; b.max = c.t[1]; } M.S.t = CM.clamp(M.S.t, c.t[0], c.t[1]); });
          M.cena(P, (G, S) => {
            const c = CUc();
            G.eixos();
            G.param((t) => c.g(t, S), c.t[0], c.t[1], 240, { cor: cor.n, larg: 2.6 });
            const p = c.g(S.t, S), v = c.d(S.t, S);
            if (S.reta) G.curva([CM.add(p, CM.mul(v, -5)), CM.add(p, CM.mul(v, 5))], { cor: cor.ouro, larg: 1.8, trac: [7, 5] });
            G.seta(p, CM.mul(v, 0.5), { cor: cor.u, rot: "g′(t)" });
            if (S.c === 'seg') { G.ponto(S.A, { cor: cor.v, rot: 'A = g(0)', arr: (x, y) => M.definir({ A: [x, y] }) }); G.ponto(S.B, { cor: cor.v, rot: 'B = g(1)', arr: (x, y) => M.definir({ B: [x, y] }) }); }
            G.ponto(p, { cor: cor.n, rot: 'g(t)' });
          });
          M.leituras('No instante $t$', (S) => {
            const c = CUc(), p = c.g(S.t, S), v = c.d(S.t, S);
            return [['$g(t)$', '$' + TX.v(p, 3) + '$'], ["$g'(t)$", '$' + TX.v(v, 3) + '$'], ["$\\|g'(t)\\|$ (rapidez)", '$' + TX.n(Math.hypot(...v), 3) + '$'], ['reta tangente', '$x=' + TX.v(p, 2) + '+\\lambda' + TX.v(v, 2) + '$']];
          });
          M.texto("<b class=\"t\">Linhas</b><p>Uma linha é a imagem de uma função contínua de uma variável, $g:\\mathbb R\\to\\mathbb R^n$ (um caminho). Se $g$ é diferenciável,</p>$$g'(t)=\\lim_{h\\to0}\\frac{g(t+h)-g(t)}{h}$$<p>é um vetor tangente à linha no ponto $g(t)$. A reta tangente é $x=g(t_0)+\\lambda g'(t_0)$.</p><p>Exemplo das teóricas: circunferência unitária no ponto $(0;1)=g(\\pi/2)$. $g'(\\pi/2)=(-1;0)$, e a reta tangente é $(x;y-1)=\\lambda(-1;0)$, ou seja, $y=1$.</p>", 'nota');
          M.legenda([[cor.n, 'linha descrita por $g$'], [cor.u, "vetor tangente $g'(t)$"], [cor.ouro, 'reta tangente']]);
        },
      },
      {
        id: 'nivel', nome: 'Gradiente e linhas de nível',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 2.1, alvo: [0, 0, 0.4], yaw: -0.8, pitch: 0.55, dica: 'Gráfico de f (altura à escala): a linha de nível é o corte horizontal' });
          const P = M.plano({ janela: [-2, 2, -2, 2] });
          M.S.p = [0.8, 0.6];
          const FN = {
            circ: { src: 'x^2+y^2', tex: 'x^2+y^2', f: (x, y) => x * x + y * y },
            elip: { src: 'x^2+4y^2', tex: 'x^2+4y^2', f: (x, y) => x * x + 4 * y * y },
            sela: { src: 'x^2-y^2', tex: 'x^2-y^2', f: (x, y) => x * x - y * y },
            xy: { src: 'xy', tex: 'xy', f: (x, y) => x * y },
            ondas: { src: 'sen x+cos y', tex: '\\sin x+\\cos y', f: (x, y) => Math.sin(x) + Math.cos(y) },
          };
          M.funcao('f', { vars: ['x', 'y'], valor: 'x^2+4y^2', exemplos: Object.keys(FN).map((k) => ['$' + FN[k].tex + '$', FN[k].src]) });
          M.barra('th', { rot: '$\\theta$', cor: cor.b, min: 0, max: 2 * PI, valor: 0.3, fmt: CM.graus, circular: true, nome: 'direção v', dur: 7000 });
          M.caixa('mapa', { rot: 'Cores por valor de $f$', valor: true });
          M.caixa('np', { rot: 'Plano $z=f(P)$ na vista 3D', valor: true });
          let esc = null;
          const k = (S) => { const ch = JSON.stringify(S.f); if (!esc || esc.f !== ch) { const fx = CDI.faixaZ(M.F.f.f, -1.8, 1.8, -1.8, 1.8); esc = { f: ch, k: 1.5 / Math.max(Math.abs(fx[0]), Math.abs(fx[1]), 1e-9) }; } return esc.k; };
          M.cena(V, (C, S) => {
            const f = M.F.f.f, kk = k(S), c = f(...S.p), z = kk * c;
            C.eixos({ x: [-1.9, 2], y: [-1.9, 2], z: [-1.6, 1.8], nomes: ['x', 'y', 'f'] });
            C.grafico((x, y) => kk * f(x, y), -1.8, 1.8, -1.8, 1.8, 44, { alfa: 0.6 });
            const lv = CM.contorno(f, -1.8, 1.8, -1.8, 1.8, 90, 90, c);
            C.segs(lv.map(([a, b]) => [[...a, z], [...b, z]]), { cor: cor.n, larg: 2.6 });
            C.segs(lv.map(([a, b]) => [[...a, 0.003], [...b, 0.003]]), { cor: cor.n, larg: 1.6, alfa: 0.7 });
            if (S.np) C.poli([[-1.8, -1.8, z], [1.8, -1.8, z], [1.8, 1.8, z], [-1.8, 1.8, z]], { cor: cor.n, alfa: 0.12, plano: 1 });
            const gr = CM.grad(f, ...S.p), gn = Math.hypot(...gr);
            if (gn > 1e-6) {
              const d = CM.mul(gr, 1 / gn);
              C.seta([...S.p, 0], [...CM.mul(d, 0.6), 0], { cor: cor.v, rot: '$\\nabla f(P)$' });
              C.seta([...S.p, z], CM.mul(CM.nrm([d[0], d[1], kk * gn]), 0.6), { cor: cor.v });
            }
            C.linha([...S.p, 0], [...S.p, z], { cor: cor.m, larg: 1, trac: [3, 3] });
            C.ponto([...S.p, z], { cor: cor.i, r: 5 });
            C.ponto([...S.p, 0], { cor: cor.i, r: 4, rot: '$P$', arr: (x, y) => M.definir({ p: [CM.clamp(x, -1.8, 1.8), CM.clamp(y, -1.8, 1.8)] }) });
          });
          M.cena(P, (G, S) => {
            const f = M.F.f.f;
            const [x0, x1, y0, y1] = G.limites();
            const vs = []; for (let i = 0; i < 25; i++) vs.push(f(x0 + ((x1 - x0) * (i % 5)) / 4, y0 + ((y1 - y0) * Math.floor(i / 5)) / 4));
            const lo = Math.min(...vs), hi = Math.max(...vs);
            if (S.mapa) {
              const a = hexRgb(cor.sup), b = hexRgb(cor.u);
              G.mapa((x, y) => { const t = CM.clamp((f(x, y) - lo) / (hi - lo || 1), 0, 1); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, 60]; }, 4);
            }
            G.eixos();
            for (let i = 1; i < 14; i++) G.nivel(f, lo + ((hi - lo) * i) / 14, { cor: cor.m, larg: 1, alfa: 0.55 });
            const c = f(...S.p);
            G.nivel(f, c, { cor: cor.n, larg: 2.4 });
            const gr = CM.grad(f, ...S.p), gn = Math.hypot(...gr);
            const v = [Math.cos(S.th), Math.sin(S.th)];
            if (gn > 1e-6) {
              const t = [-gr[1] / gn, gr[0] / gn];
              G.curva([CM.add(S.p, CM.mul(t, -3)), CM.add(S.p, CM.mul(t, 3))], { cor: cor.ouro, larg: 1.6, trac: [7, 5] });
              G.seta(S.p, CM.mul(gr, 0.7 / Math.max(1, gn)), { cor: cor.v, rot: '∇f(P)' });
            }
            G.seta(S.p, CM.mul(v, 0.6), { cor: cor.b, rot: '$v$' });
            G.ponto(S.p, { cor: cor.i, rot: 'P', arr: (x, y) => M.definir({ p: [x, y] }) });
          });
          M.leituras('Em $P$', (S) => {
            const f = M.F.f.f, gr = CM.grad(f, ...S.p), gn = Math.hypot(...gr), v = [Math.cos(S.th), Math.sin(S.th)];
            const r = [['$P$', '$' + TX.v(S.p, 2) + '$'], ['$f(P)=c$', '$' + TX.n(f(...S.p), 3) + '$'], ['$\\nabla f(P)$', '$' + TX.v(gr, 3) + '$'], ['$\\|\\nabla f(P)\\|$', '$' + TX.n(gn, 3) + '$'], '—', ['$\\frac{\\partial f}{\\partial v}(P)=\\nabla f(P)\\cdot v$', '$' + TX.n(CM.dot(gr, v), 3) + '$', 'forte']];
            if (gn > 1e-6) r.push(['ângulo entre $v$ e $\\nabla f$', CM.graus(Math.acos(CM.clamp(CM.dot(gr, v) / gn, -1, 1)))]);
            r.push(gn < 1e-6 ? '$\\nabla f(P)=0$: $P$ é ponto crítico, todas as derivadas direcionais são $0$.' : 'A derivada direcional é máxima com $v$ na direção de $\\nabla f$ (vale $\\|\\nabla f\\|$), mínima na direção oposta e nula na direção da linha de nível.');
            return r;
          });
          M.texto("<b class=\"t\">Gradiente</b>$$\\nabla f(a)=\\Big(\\frac{\\partial f}{\\partial x_1}(a);\\dots;\\frac{\\partial f}{\\partial x_n}(a)\\Big)$$<p>É a linha da Jacobiana de $f:\\mathbb R^n\\to\\mathbb R$ escrita como vetor. Teorema: $\\nabla f(a)$ é normal ao conjunto de nível $\\{f=c\\}$ que passa por $a$.</p><p>Porquê: se $g(t)$ anda sobre o nível, $f(g(t))=c$ e, pela regra da cadeia, $\\nabla f(g(t))\\cdot g'(t)=0$. Na vista 3D, a linha de nível é o corte do gráfico pelo plano horizontal $z=c$, e o gradiente aponta para onde o gráfico sobe a pique.</p>", 'nota');
          M.legenda([[cor.n, 'linha de nível $f=f(P)$'], [cor.v, '$\\nabla f(P)$ e a subida mais íngreme'], [cor.ouro, 'tangente à linha de nível'], [cor.b, 'direção $v$']]);
        },
      },
      {
        id: 'plano', nome: 'Plano tangente a uma superfície de nível',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7 });
          const SU = {
            esf: { tex: 'x^2+y^2+z^2=1', F: (p) => p[0] ** 2 + p[1] ** 2 + p[2] ** 2 - 1, g: (u, v) => [Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v)], v: [0, PI], gr: (p) => [2 * p[0], 2 * p[1], 2 * p[2]], gt: '(2x;\\,2y;\\,2z)' },
            elip: { tex: 'x^2+2y^2+4z^2=2', F: (p) => p[0] ** 2 + 2 * p[1] ** 2 + 4 * p[2] ** 2 - 2, g: (u, v) => [Math.SQRT2 * Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), (Math.SQRT2 / 2) * Math.cos(v)], v: [0, PI], gr: (p) => [2 * p[0], 4 * p[1], 8 * p[2]], gt: '(2x;\\,4y;\\,8z)' },
            hip: { tex: 'x^2+y^2-z^2=1', F: (p) => p[0] ** 2 + p[1] ** 2 - p[2] ** 2 - 1, g: (u, v) => [Math.cosh(v) * Math.cos(u), Math.cosh(v) * Math.sin(u), Math.sinh(v)], v: [-1, 1], gr: (p) => [2 * p[0], 2 * p[1], -2 * p[2]], gt: '(2x;\\,2y;\\,-2z)' },
          };
          M.escolha('s', { rot: 'Superfície $F(x;y;z)=0$', opcoes: Object.keys(SU).map((k) => [k, '$' + SU[k].tex + '$']), valor: 'esf', aoMudar: (k) => { M.S.v = k === 'hip' ? 0.4 : 0.7; } });
          M.barra('u', { rot: '$\\theta$', cor: cor.u, min: 0, max: 2 * PI, valor: 0.6, fmt: CM.graus, circular: true, nome: 'longitude' });
          M.barra('v', { rot: '$\\varphi$', cor: cor.v, min: 0, max: PI, valor: 0.7, fmt: (x) => CM.fmt(x, 2), nome: 'segundo parâmetro' });
          M.caixa('normal', { rot: 'Reta normal', valor: true });
          M.botoes([['Exemplo da aula: $(0;0;1)$', () => M.definir({ s: 'esf', v: 0, u: 0 })]]);
          M.sync.unshift(() => { const s = SU[M.S.s], b = M.ctl.querySelector('input[aria-label="segundo parâmetro"]'); if (b) { b.min = s.v[0]; b.max = s.v[1]; } M.S.v = CM.clamp(M.S.v, s.v[0], s.v[1]); });
          M.cena(V, (C, S) => {
            const s = SU[S.s];
            C.eixos({ x: [-1.6, 1.6], y: [-1.6, 1.6], z: [-1.4, 1.6] });
            C.sup(s.g, 0, 2 * PI, s.v[0], s.v[1], 48, 26, { alfa: 0.62 });
            const P = s.g(S.u, S.v), N = s.gr(P);
            C.plano(P, N, 0.65, { cor: cor.ouro, alfa: 0.34 });
            if (S.normal) C.linha(CM.sub(P, CM.mul(CM.nrm(N), 0.9)), CM.add(P, CM.mul(CM.nrm(N), 0.9)), { cor: cor.n, larg: 1.4, trac: [5, 4] });
            C.seta(P, CM.mul(CM.nrm(N), 0.6), { cor: cor.v, rot: '$\\nabla F(P)$' });
            C.ponto(P, { cor: cor.i, rot: '$P$' });
          });
          M.leituras('Em $P$', (S) => {
            const s = SU[S.s], P = s.g(S.u, S.v), N = s.gr(P);
            const d = CM.dot(N, P);
            const termo = (c, n, prim) => (Math.abs(c) < 5e-4 ? '' : (c < 0 ? '-' : prim ? '' : '+') + (Math.abs(Math.abs(c) - 1) < 5e-4 ? '' : TX.n(Math.abs(c), 2)) + n);
            let eq = termo(N[0], 'x', true); eq += termo(N[1], 'y', !eq); eq += termo(N[2], 'z', !eq);
            return [['$P$', '$' + TX.v(P, 2) + '$'], ['$F(P)$', '$' + TX.n(s.F(P), 4) + '$'], ['$\\nabla F=' + s.gt + '$', '$' + TX.v(N, 2) + '$'], '—', ['plano tangente', '$' + (eq || '0') + '=' + TX.n(d, 2) + '$', 'forte'], ['reta normal', '$X=' + TX.v(P, 2) + '+\\lambda' + TX.v(N, 2) + '$']];
          });
          M.texto('<b class="t">Plano tangente a $\\{F=0\\}$</b><p>Como $\\nabla F(P)$ é normal à superfície de nível, o plano tangente em $P$ é</p>$$\\nabla F(P)\\cdot(X-P)=0$$<p>e a reta normal é $X=P+\\lambda\\nabla F(P)$. Exemplo das teóricas: $F=x^2+y^2+z^2-1$ em $P=(0;0;1)$. $\\nabla F(P)=(0;0;2)$, e $(x;y;z-1)\\cdot(0;0;2)=0$ dá o plano $z=1$.</p>', 'nota');
          M.legenda([[cor.v, '$\\nabla F(P)$'], [cor.ouro, 'plano tangente'], [cor.n, 'reta normal']]);
        },
      },
    ],
    explicar: [
      { modelo: 'linhas', titulo: 'Uma linha é a imagem de um caminho', estado: { c: 'parab', t: 0.6, reta: false }, texto: '<p>$g(t)=(t;t^2)$ é uma função contínua $\\mathbb R\\to\\mathbb R^2$. A linha é a sua imagem: a parábola $y=x^2$.</p><p>$t$ funciona como «tempo»: carrega em ▶ ao lado de $t$ para ver o ponto a percorrer a linha.</p>' },
      { modelo: 'linhas', titulo: 'Vetor tangente', estado: { c: 'circ', r: 1, t: PI / 2, reta: true }, texto: "<p>$g(t)=(\\cos t;\\sin t)\\Rightarrow g'(t)=(-\\sin t;\\cos t)$. Em $t=\\pi/2$: $g=(0;1)$ e $g'=(-1;0)$.</p><p>Reta tangente: $(x;y-1)=\\lambda(-1;0)$, isto é, <b>$y=1$</b>.</p>" },
      { modelo: 'linhas', titulo: 'O segmento de A a B', estado: { c: 'seg', t: 0.3, A: [-1, -0.5], B: [1.2, 1.4], reta: true }, texto: "<p>$g(t)=A+t(B-A)$: $g(0)=A$, $g(1)=B$, e $g'(t)=B-A$ é constante.</p><p>Arrasta $A$ e $B$ no desenho.</p>" },
      { modelo: 'nivel', titulo: 'Linhas de nível são cortes', estado: { f: 'elip', p: [0.8, 0.6], th: 0.3, mapa: true, np: true }, vista: [-0.8, 0.55], texto: '<p>Em cima, o gráfico de $f=x^2+4y^2$. O plano horizontal $z=f(P)$ corta-o numa elipse: projetada no chão, é a linha de nível $f=f(P)$.</p>' },
      { modelo: 'nivel', titulo: 'Gradiente ⟂ linhas de nível', estado: { f: 'elip', p: [0.8, 0.6], th: 0.3, mapa: true, np: false }, texto: "<p>A linha roxa é a linha de nível $f=f(P)$. O gradiente (verde) é-lhe perpendicular e, no gráfico, aponta para a subida mais íngreme.</p><p>Se $g(t)$ anda na linha, $f(g(t))=c$; derivando, $\\nabla f(g(t))\\cdot g'(t)=0$.</p>" },
      { modelo: 'nivel', titulo: 'Direção de maior crescimento', estado: { f: 'elip', p: [0.8, 0.6], th: 0.97 }, texto: '<p>$\\frac{\\partial f}{\\partial v}(P)=\\nabla f(P)\\cdot v=\\|\\nabla f(P)\\|\\cos\\alpha$. É máxima quando $v$ aponta como $\\nabla f$ e vale $\\|\\nabla f(P)\\|$.</p><p>Roda $\\theta$ para ver a derivada direcional variar entre $-\\|\\nabla f\\|$ e $\\|\\nabla f\\|$, passando por $0$ na direção da linha de nível.</p>' },
      { modelo: 'plano', titulo: 'Plano tangente à esfera', estado: { s: 'esf', v: 0, u: 0, normal: true }, vista: [0.7, 0.35], texto: '<p>Esfera $x^2+y^2+z^2=1$ como nível de $F=x^2+y^2+z^2-1$. Em $P=(0;0;1)$, $\\nabla F=(0;0;2)$.</p><p>Plano: $(x;y;z-1)\\cdot(0;0;2)=0\\iff$ <b>$z=1$</b>. Reta normal: o eixo dos $z$.</p>' },
      { modelo: 'plano', titulo: 'Noutro ponto', estado: { s: 'hip', v: 0.4, u: 0.8, normal: true }, texto: '<p>Funciona em qualquer superfície de nível com $\\nabla F(P)\\ne0$. No hiperboloide $x^2+y^2-z^2=1$, $\\nabla F=(2x;2y;-2z)$.</p>' },
    ],
    testa: [
      { modelo: 'linhas', estado: { c: 'circ', r: 1, t: PI / 2, reta: true }, p: 'Reta tangente à circunferência $x^2+y^2=1$ no ponto $(0;1)$:', op: ['$x=1$', '$y=1$', '$y=x+1$', '$x=0$'], certa: 1, porque: "Com $g(t)=(\\cos t;\\sin t)$, $(0;1)=g(\\pi/2)$ e $g'(\\pi/2)=(-1;0)$, horizontal." },
      { modelo: 'plano', estado: { s: 'esf', u: 0, v: 0 }, p: 'Plano tangente a $x^2+y^2+z^2=1$ em $(0;0;1)$:', op: ['$z=0$', '$x+y+z=1$', '$z=1$', '$z=2$'], certa: 2, porque: '$\\nabla F(0;0;1)=(0;0;2)$, e $(x;y;z-1)\\cdot(0;0;2)=0\\iff z=1$.' },
      { modelo: 'nivel', estado: { f: 'circ', p: [1, 1], th: 0.785 }, p: 'Em que direção cresce $f$ mais depressa a partir de $P$?', op: ['Na direção da linha de nível', 'Na direção de $\\nabla f(P)$', 'Na direção de $-\\nabla f(P)$', 'Em todas por igual'], certa: 1, porque: '$\\frac{\\partial f}{\\partial v}=\\nabla f\\cdot v=\\|\\nabla f\\|\\cos\\alpha$, máximo para $\\alpha=0$. A taxa máxima é $\\|\\nabla f(P)\\|$.' },
      { modelo: 'nivel', estado: { f: 'elip', p: [0.8, 0.6], np: true }, p: 'No gráfico de $f$, o que é a linha de nível $\\{f=c\\}$?', op: ['A projeção no chão do corte pelo plano $z=c$', 'O corte pelo plano $x=c$', 'A reta tangente ao gráfico', 'O gradiente'], certa: 0, porque: 'Os pontos com $f(x;y)=c$ são os que, no gráfico, estão à altura $c$.' },
      { p: '$f:\\mathbb R^3\\to\\mathbb R$ diferenciável, $c$ constante, $\\nabla f(a)\\ne0$. $\\nabla f(a)$ é:', op: ['tangente ao nível $\\{f=c\\}$ que passa por $a$', 'normal ao nível $\\{f=c\\}$ que passa por $a$', 'sempre $(0;0;1)$', 'paralelo ao eixo $x$'], certa: 1, porque: "Para qualquer caminho $g$ no nível com $g(0)=a$: $f(g(t))=c\\Rightarrow\\nabla f(a)\\cdot g'(0)=0$." },
    ],
  });
})();
