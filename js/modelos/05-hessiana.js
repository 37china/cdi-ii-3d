/* 5. Derivadas de ordem superior, Hessiana e classificação de pontos críticos. */
(function () {
  const FN = {
    min: { tex: 'x^2+y^2', f: (x, y) => x * x + y * y, cr: [[0, 0]], z: [-0.3, 2.6] },
    max: { tex: '1-x^2-y^2', f: (x, y) => 1 - x * x - y * y, cr: [[0, 0]], z: [-1, 1.2] },
    sela: { tex: 'x^2-y^2', f: (x, y) => x * x - y * y, cr: [[0, 0]], z: [-1.6, 1.6] },
    xy4: { tex: 'x^2+y^4', f: (x, y) => x * x + y ** 4, cr: [[0, 0]], z: [-0.3, 2] },
    xmy4: { tex: 'x^2-y^4', f: (x, y) => x * x - y ** 4, cr: [[0, 0]], z: [-1.5, 1.5] },
    dois: { tex: 'x^3-3x+y^2', f: (x, y) => x ** 3 - 3 * x + y * y, cr: [[1, 0], [-1, 0]], z: [-2.5, 2.5], esc: 0.55 },
    macaco: { tex: 'x^3-3xy^2', f: (x, y) => x ** 3 - 3 * x * y * y, cr: [[0, 0]], z: [-1.6, 1.6] },
  };
  const H = (f, x, y) => CM.hess(f, x, y, 1e-3);
  function classe(l1, l2) {
    const e = 1e-6;
    if (l1 > e && l2 > e) return 'mínimo local';
    if (l1 < -e && l2 < -e) return 'máximo local';
    if (l1 > e && l2 < -e) return 'ponto de sela';
    return 'inconclusivo';
  }

  CDI.modelosDe('hessiana', {
    id: 'hessiana', ordem: 5, grupo: 'Cálculo diferencial', curto: 'Hessiana e extremos', titulo: 'Hessiana e extremos livres', paginas: 'pp. 24–27',
    resumo: 'Pontos críticos, a matriz $Hf$, valores próprios e a classificação: mínimo, máximo, sela ou inconclusivo.',
    modelos: [
      {
        id: 'criticos', nome: 'Pontos críticos',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.6, alvo: [0, 0, 0], yaw: 0.75, pitch: 0.45 });
          const G = M.plano({ janela: [-0.15, 3.3, -4.6, 4.6], livre: true, dica: 'curvatura vᵀHf(P)v nas direções v = (cos θ; sen θ)' });
          const SRC = { min: 'x^2+y^2', max: '1-x^2-y^2', sela: 'x^2-y^2', xy4: 'x^2+y^4', xmy4: 'x^2-y^4', dois: 'x^3-3x+y^2', macaco: 'x^3-3xy^2' };
          M.funcao('f', { vars: ['x', 'y'], valor: 'x^2-y^2', exemplos: Object.keys(FN).map((k) => ['$' + FN[k].tex + '$', SRC[k], { x0: FN[k].cr[0][0], y0: FN[k].cr[0][1] }]) });
          let cache = null;
          const info = (S) => {
            const ch = JSON.stringify(S.f);
            if (!cache || cache.ch !== ch) {
              const f = M.F.f.f, fx = CDI.faixaZ(f, -1.15, 1.15, -1.15, 1.15);
              cache = { ch, f, z: fx, esc: CDI.escalaZ(fx, 1.5), cr: CM.criticos(f, -1.1, 1.1, -1.1, 1.1) };
            }
            return cache;
          };
          M.barra('x0', { rot: '$x_0$', cor: cor.u, min: -1.1, max: 1.1, valor: 0, nome: 'x₀' });
          M.barra('y0', { rot: '$y_0$', cor: cor.v, min: -1.1, max: 1.1, valor: 0, nome: 'y₀' });
          M.caixa('dir', { rot: 'Direções próprias', valor: true });
          M.caixa('taylor', { rot: 'Aproximação de 2.ª ordem', valor: false });
          M.botoes([['Ir para um ponto crítico', () => { const c = info(M.S).cr; if (!c.length) return; const i = c.findIndex((p) => Math.hypot(p[0] - M.S.x0, p[1] - M.S.y0) < 1e-6); const q = c[(i + 1) % c.length]; M.definir({ x0: q[0], y0: q[1] }); }]]);
          const est = (S) => {
            const fn = info(S), f = fn.f, a = [S.x0, S.y0], gr = CM.grad(f, ...a), h = H(f, ...a), e = CM.eigSim2(h[0][0], h[0][1], h[1][1]);
            return { fn, f, a, gr, h, e, crit: Math.hypot(...gr) < 1e-4 };
          };
          M.cena(V, (C, S) => {
            const { fn, f, a, h, e, crit } = est(S);
            const k = fn.esc || 1, g = (x, y) => f(x, y) * k;
            C.eixos({ x: [-1.45, 1.45], y: [-1.45, 1.45], z: [-1.5, 1.7], esc: [1, 1, k] });
            C.sup((r, t) => { const x = r * Math.cos(t), y = r * Math.sin(t), z = g(x, y); return z < fn.z[0] * k || z > fn.z[1] * k ? null : [x, y, z]; }, 0, 1.15, 0, 2 * Math.PI, 28, 72, { alfa: S.taylor ? 0.5 : 0.94 });
            const P = [a[0], a[1], g(...a)];
            if (S.taylor) {
              const gr = CM.grad(f, ...a);
              const q = (x, y) => { const d = [x - a[0], y - a[1]]; return k * (f(...a) + CM.dot(gr, d) + 0.5 * CM.dot(d, CM.mxv(h, d))); };
              C.sup((r, t) => { const x = a[0] + 0.75 * r * Math.cos(t), y = a[1] + 0.75 * r * Math.sin(t); return [x, y, q(x, y)]; }, 0, 1, 0, 2 * Math.PI, 10, 40, { cor: cor.ouro, alfa: 0.55 });
            }
            if (S.dir) [[e.v1, e.l1], [e.v2, e.l2]].forEach(([v, l]) => {
              const c = l > 1e-6 ? cor.v : l < -1e-6 ? cor.r : cor.u;
              C.param((t) => { const x = a[0] + t * v[0], y = a[1] + t * v[1]; return [x, y, g(x, y) + 0.004]; }, -0.8, 0.8, 80, { cor: c, larg: 4 });
              C.seta([a[0], a[1], P[2]], [0.45 * v[0], 0.45 * v[1], 0], { cor: c, larg: 2 });
            });
            if (crit) C.plano(P, [0, 0, 1], 0.5, { cor: cor.m, alfa: 0.15 });
            fn.cr.forEach((p) => C.ponto([p[0], p[1], g(...p)], { cor: cor.i, r: 3.5 }));
            C.linha([a[0], a[1], 0], P, { cor: cor.m, larg: 1, trac: [3, 3] });
            C.ponto(P, { cor: crit ? cor.n : cor.u, rot: '$P$', arr: (x, y) => M.definir({ x0: CM.clamp(x, -1.1, 1.1), y0: CM.clamp(y, -1.1, 1.1) }) });
          });
          M.cena(G, (P, S) => {
            const { h, e } = est(S);
            P.eixos(['θ', '']);
            P.param((t) => { const v = [Math.cos(t), Math.sin(t)]; return [t, CM.dot(v, CM.mxv(h, v))]; }, 0, Math.PI, 200, { cor: cor.n, larg: 2.8 });
            P.curva([[0, e.l1], [Math.PI, e.l1]], { cor: cor.v, larg: 1.4, trac: [6, 5] });
            P.curva([[0, e.l2], [Math.PI, e.l2]], { cor: cor.r, larg: 1.4, trac: [6, 5] });
            P.texto([3.25, e.l1], 'λ₁', { cor: cor.v, dy: -11 });
            P.texto([3.25, e.l2], 'λ₂', { cor: cor.r, dy: 11 });
          });
          M.leituras('Em P', (S) => {
            const { f, a, gr, h, e, crit } = est(S);
            const c = classe(e.l1, e.l2);
            return [['$P$', '$' + TX.v(a) + '$'], ['$f(P)$', '$' + TX.n(f(...a), 3) + '$'], ['$\\nabla f(P)$', '$' + TX.v(gr, 3) + '$', crit ? 'forte' : ''], ['$Hf(P)$', '$' + TX.m(h, 2) + '$'], ['$\\lambda_1,\\ \\lambda_2$', '$' + TX.n(e.l1) + ',\\ ' + TX.n(e.l2) + '$'], ['$\\det Hf(P)=\\lambda_1\\lambda_2$', '$' + TX.n(CM.det2(h)) + '$'],
              crit ? `Ponto crítico: <b>${c}</b>.` : 'Não é crítico, porque $\\nabla f(P)\\neq 0$: não pode ser extremo.'];
          });
          M.texto((S) => {
            const { e, crit } = est(S);
            if (!crit || (Math.abs(e.l2) > 1e-6 && Math.abs(e.l1) > 1e-6)) return '';
            return '<b class="t">Teste inconclusivo</b><p>Com um valor próprio nulo, a 2.ª ordem não decide. $x^2+y^4$ e $x^2-y^4$ têm a mesma Hessiana na origem, $\\begin{bmatrix}2&0\\\\0&0\\end{bmatrix}$, e só a primeira tem lá um mínimo. É preciso olhar para $f$ diretamente, por exemplo ao longo do eixo $y$.</p>';
          }, 'aviso');
          M.texto('<b class="t">Classificação, com f de classe C²</b><p>Pontos críticos: $\\nabla f(a)=0$. Depois, os valores próprios de $Hf(a)$:</p><p>todos $\\lambda_i>0$ ⇒ mínimo local; todos $\\lambda_i<0$ ⇒ máximo local; algum $\\lambda_i>0$ e algum $\\lambda_j<0$ ⇒ sela; algum $\\lambda_i=0$ e os outros do mesmo sinal ⇒ inconclusivo.</p><p>Porquê: com $h(t)=f(a+tv)$, $h\'\'(0)=v^{T}Hf(a)\\,v$, e esta forma quadrática varia entre $\\lambda_2$ e $\\lambda_1$ nas direções unitárias (gráfico de baixo).</p>', 'nota');
          M.legenda([[cor.v, 'direção própria com $\\lambda>0$'], [cor.r, '$\\lambda<0$'], [cor.u, '$\\lambda=0$'], [cor.n, '$v^{T}Hf(P)\\,v$']]);
        },
      },
      {
        id: 'schwarz', nome: 'Derivadas de 2.ª ordem',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.5 });
          M.funcao('f', { vars: ['x', 'y'], valor: 'x^2y^3', exemplos: [['$x^2y^3$', 'x^2y^3'], ['$e^{xy}$', 'e^(xy)'], ['$\\operatorname{sen}(x)\\cos(y)$', 'sen(x)cos(y)'], ['$\\frac{xy(x^2-y^2)}{x^2+y^2}$', { r: [['xy(x^2-y^2)/(x^2+y^2)', '(x;y)≠(0;0)']], z: '0' }, { x0: 0, y0: 0 }]] });
          M.barra('x0', { rot: '$x_0$', cor: cor.u, min: -1, max: 1, valor: 0.7, nome: 'x₀' });
          M.barra('y0', { rot: '$y_0$', cor: cor.v, min: -1, max: 1, valor: 0.8, nome: 'y₀' });
          /* derivadas por diferenças finitas, cada uma com o seu passo */
          const dx = (g, h = 1e-4) => (x, y) => (g(x + h, y) - g(x - h, y)) / (2 * h);
          const dy = (g, h = 1e-4) => (x, y) => (g(x, y + h) - g(x, y - h)) / (2 * h);
          M.cena(V, (C, S) => {
            const f = M.F.f.f, fx = CDI.faixaZ(f, -1, 1, -1, 1), k = CDI.escalaZ(fx, 1.2), g = (x, y) => k * f(x, y);
            C.eixos({ x: [-1.35, 1.35], y: [-1.35, 1.35], z: [-1.2, 1.3], esc: [1, 1, k] });
            CDI.grafico(C, f, { k, faixa: fx, caixa: [-1, 1, -1, 1], n: 36, alfa: 0.92 });
            const a = [S.x0, S.y0];
            C.param((t) => [t, a[1], g(t, a[1]) + 0.004], -1, 1, 60, { cor: cor.u, larg: 3.5 });
            C.param((t) => [a[0], t, g(a[0], t) + 0.004], -1, 1, 60, { cor: cor.v, larg: 3.5 });
            C.ponto([a[0], a[1], g(...a)], { cor: cor.i, rot: '$P$', arr: (x, y) => M.definir({ x0: CM.clamp(x, -1, 1), y0: CM.clamp(y, -1, 1) }) });
          });
          M.leituras('Em $P$', (S) => {
            const f = M.F.f.f, x = S.x0, y = S.y0;
            const fxv = dx(f)(x, y), fyv = dy(f)(x, y);
            const fxy = dy(dx(f, 1e-4), 1e-3)(x, y), fyx = dx(dy(f, 1e-4), 1e-3)(x, y);
            const fxx = dx(dx(f, 1e-4), 1e-3)(x, y), fyy = dy(dy(f, 1e-4), 1e-3)(x, y);
            const igual = Math.abs(fxy - fyx) < 1e-3 * Math.max(1, Math.abs(fxy));
            return [['$\\frac{\\partial f}{\\partial x}(P)$', '$' + TX.n(fxv, 3) + '$'], ['$\\frac{\\partial f}{\\partial y}(P)$', '$' + TX.n(fyv, 3) + '$'], '—', ['$\\dfrac{\\partial^2 f}{\\partial y\\,\\partial x}(P)=\\dfrac{\\partial}{\\partial y}\\Big(\\dfrac{\\partial f}{\\partial x}\\Big)$', '$' + TX.n(fxy, 3) + '$', 'forte'], ['$\\dfrac{\\partial^2 f}{\\partial x\\,\\partial y}(P)=\\dfrac{\\partial}{\\partial x}\\Big(\\dfrac{\\partial f}{\\partial y}\\Big)$', '$' + TX.n(fyx, 3) + '$', igual ? 'forte' : 'mau'], ['$Hf(P)$', '$' + TX.m([[fxx, fxy], [fyx, fyy]], 3) + '$'], igual ? 'As derivadas cruzadas coincidem neste ponto.' : '<b>As derivadas cruzadas são diferentes!</b> Então $f$ não é de classe $C^2$ perto deste ponto: o teorema de Schwarz não se aplica.'];
          });
          M.texto('<b class="t">Classe Cᵏ e teorema de Schwarz</b><p>$f$ é de classe $C^1$ se $f$ e as derivadas parciais são contínuas, e $C^k$ se as derivadas até à ordem $k$ o são.</p><p>Se $f$ é $C^2$, então $\\dfrac{\\partial^2 f}{\\partial x\\,\\partial y}=\\dfrac{\\partial^2 f}{\\partial y\\,\\partial x}$. A Hessiana é simétrica: tem valores próprios reais e vetores próprios ortogonais.</p>', 'nota');
          M.legenda([[cor.u, 'corte $y=y_0$: derivar em $x$'], [cor.v, 'corte $x=x_0$: derivar em $y$']]);
        },
      },
    ],
    explicar: [
      { modelo: 'criticos', titulo: 'Ponto crítico', estado: { f: 'min', x0: 0.6, y0: 0.4, dir: false, taylor: false }, texto: '<p>Num extremo de uma função $C^1$ as derivadas direcionais são todas nulas, logo $\\nabla f(a)=0$. Aqui $P=(0.6;\\,0.4)$ não é crítico: $\\nabla f(P)=(1.2;\\,0.8)$.</p><p>Para $x^2+y^2$: $2x=0$ e $2y=0$ ⇒ o único candidato é $(0;0)$. Arrasta $P$ até lá.</p>' },
      { modelo: 'criticos', titulo: 'A 2.ª ordem decide', estado: { f: 'min', x0: 0, y0: 0, dir: true, taylor: true }, texto: '<p>Perto de um ponto crítico,</p>$$f(a+h)\\approx f(a)+\\tfrac12\\,h^{T}Hf(a)\\,h.$$<p>A superfície dourada é esta aproximação. Ao longo de $a+tv$, a curvatura é $v^{T}Hf(a)\\,v$.</p>' },
      { modelo: 'criticos', titulo: 'Valores próprios = curvaturas extremas', estado: { f: 'min', x0: 0, y0: 0, dir: true, taylor: false }, texto: '<p>$Hf(0;0)=\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$: $\\lambda_1=\\lambda_2=2>0$. Em todas as direções a superfície curva para cima: <b>mínimo local</b>.</p>' },
      { modelo: 'criticos', titulo: 'Sinais trocados: sela', estado: { f: 'sela', x0: 0, y0: 0, dir: true }, texto: '<p>$x^2-y^2$: $Hf=\\begin{bmatrix}2&0\\\\0&-2\\end{bmatrix}$. Na direção de $x$ sobe (verde), na de $y$ desce (vermelho): <b>ponto de sela</b>, não é extremo.</p>' },
      { modelo: 'criticos', titulo: 'Um λ = 0: o teste não decide', estado: { f: 'xy4', x0: 0, y0: 0, dir: true }, texto: '<p>$x^2+y^4$: $Hf(0;0)=\\begin{bmatrix}2&0\\\\0&0\\end{bmatrix}$, $\\lambda_1=2$, $\\lambda_2=0$. A origem é mínimo, porque $f\\ge 0=f(0;0)$, mas não é o teste que o diz.</p><p>Para o teste garantir um mínimo, os $\\lambda_i$ têm de ser todos <b>estritamente</b> positivos.</p>' },
      { modelo: 'criticos', titulo: 'Mesma Hessiana, sela', estado: { f: 'xmy4', x0: 0, y0: 0, dir: true }, texto: '<p>$x^2-y^4$ tem exatamente a mesma Hessiana na origem, mas ao longo do eixo $y$ vale $-y^4<0$: é <b>sela</b>.</p><p>Com algum $\\lambda_i=0$, chama-se inconclusivo.</p>' },
      { modelo: 'criticos', titulo: 'Vários pontos críticos', estado: { f: 'dois', x0: 1, y0: 0, dir: true }, texto: '<p>$f=x^3-3x+y^2$: $\\nabla f=(3x^2-3;\\,2y)=0$ ⇒ $(\\pm1;0)$, e $Hf=\\begin{bmatrix}6x&0\\\\0&2\\end{bmatrix}$.</p><p>Em $(1;0)$: $\\lambda=6,\\,2$ ⇒ mínimo local. Em $(-1;0)$: $\\lambda=-6,\\,2$ ⇒ sela. Usa «Ir para um ponto crítico».</p>' },
      { modelo: 'schwarz', titulo: 'Schwarz', estado: { x0: 0.7, y0: 0.8 }, texto: '<p>$f=x^2y^3$ é $C^2$ (é um polinómio). As duas derivadas cruzadas dão $6xy^2$: a ordem não importa e a Hessiana é simétrica.</p>' },
    ],
    testa: [
      { modelo: 'criticos', estado: { f: 'sela', x0: 0, y0: 0 }, p: 'Num ponto crítico, $Hf(a)=\\begin{bmatrix}2&0\\\\0&-2\\end{bmatrix}$. O ponto é:', op: ['mínimo local', 'máximo local', 'ponto de sela', 'inconclusivo'], certa: 2, porque: '$\\lambda_1=2>0$ e $\\lambda_2=-2<0$: sobe numa direção e desce noutra.' },
      { modelo: 'criticos', estado: { f: 'xy4', x0: 0, y0: 0 }, p: '$f(x,y)=x^2+y^4$. O que diz o teste da Hessiana em $(0;0)$?', op: ['Mínimo local, porque $\\lambda_1=2>0$ e $\\lambda_2=0\\ge 0$', 'Inconclusivo, porque $\\lambda_2=0$: é preciso outro argumento', 'Sela', 'Máximo local'], certa: 1, porque: '$Hf(0;0)=\\begin{bmatrix}2&0\\\\0&0\\end{bmatrix}$. Com um $\\lambda=0$ o teste não decide: $x^2-y^4$ tem a mesma Hessiana e é sela.' },
      { modelo: 'criticos', estado: { f: 'dois', x0: -1, y0: 0 }, p: 'Pontos críticos de $f=x^3-3x+y^2$ e a sua natureza:', op: ['$(0;0)$, mínimo', '$(1;0)$ mínimo e $(-1;0)$ sela', '$(1;0)$ sela e $(-1;0)$ máximo', '$(\\pm1;0)$, ambos mínimos'], certa: 1, porque: '$\\nabla f=(3x^2-3;\\,2y)=0$ ⇒ $x=\\pm1$, $y=0$. Com $Hf=\\begin{bmatrix}6x&0\\\\0&2\\end{bmatrix}$, os valores próprios são $6,2$ em $(1;0)$ e $-6,2$ em $(-1;0)$.' },
      { modelo: 'schwarz', estado: { x0: 0.7, y0: 0.8 }, p: '$f(x,y)=x^2y^3$. Quanto vale $\\dfrac{\\partial^2 f}{\\partial y\\,\\partial x}$?', op: ['$2y^3$', '$6xy^2$', '$6x^2y$', '$3x^2y^2$'], certa: 1, porque: '$\\partial f/\\partial x=2xy^3$ e $\\partial_y(2xy^3)=6xy^2$. Pelo teorema de Schwarz, a outra ordem dá o mesmo.' },
      { p: 'Num ponto crítico, os valores próprios da Hessiana são todos negativos. Então:', op: ['é mínimo local', 'é máximo local', 'é sela', 'não se sabe'], certa: 1, porque: '$v^{T}Hv\\le\\lambda_1\\|v\\|^2<0$ em todas as direções: a superfície curva para baixo.' },
    ],
  });
})();
