/* 12. Superfícies em ℝ³: parametrização, espaço tangente, normal, área. */
(function () {
  const PI = Math.PI;
  const gS = (t, p, R) => [R * Math.sin(p) * Math.cos(t), R * Math.sin(p) * Math.sin(t), R * Math.cos(p)];
  const gSt = (t, p, R) => [-R * Math.sin(p) * Math.sin(t), R * Math.sin(p) * Math.cos(t), 0];
  const gSp = (t, p, R) => [R * Math.cos(p) * Math.cos(t), R * Math.cos(p) * Math.sin(t), -R * Math.sin(p)];
  const FG = {
    hemi: { tex: '\\sqrt{1-x^2-y^2}', f: (x, y) => Math.sqrt(Math.max(0, 1 - x * x - y * y)), fx: 'f_x=\\frac{-x}{\\sqrt{1-x^2-y^2}}', fy: 'f_y=\\frac{-y}{\\sqrt{1-x^2-y^2}}' },
    parab: { tex: 'x^2+y^2', f: (x, y) => x * x + y * y, fx: 'f_x=2x', fy: 'f_y=2y' },
    sela: { tex: 'x^2-y^2', f: (x, y) => x * x - y * y, fx: 'f_x=2x', fy: 'f_y=-2y' },
  };
  const fmtK = (k) => CM.fmtPi((k * PI) / 24);
  const texK = (k) => { const s = fmtK(k).replace('π', '\\pi'); return s; };
  const sg = (x) => (x < 0 ? '-' : '+') + TX.n(Math.abs(x), 2);

  CDI.modelosDe('superficies', {
    id: 'superficies', ordem: 12, grupo: 'Geometria em ℝ³', curto: 'Superfícies em ℝ³', titulo: 'Superfícies em ℝ³', paginas: 'complemento',
    resumo: 'Parametrizações, vetores tangentes, normal, plano tangente e área como soma de paralelogramos.',
    modelos: [
      {
        id: 'esfera', nome: 'Esfera g(θ; φ)',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7 });
          M.barra('kt', { rot: '$\\theta_0$', cor: cor.u, min: 0, max: 48, passo: 1, valor: 6, fmt: fmtK, circular: true, nome: 'θ₀' });
          M.barra('kp', { rot: '$\\varphi_0$', cor: cor.v, min: 0, max: 24, passo: 1, valor: 6, fmt: fmtK, nome: 'φ₀' });
          M.barra('R', { rot: '$R$', cor: cor.m, min: 0.5, max: 1.5, valor: 1, nome: 'raio R' });
          M.caixa('curvas', { rot: 'Linhas coordenadas', valor: true });
          M.caixa('plano', { rot: 'Plano tangente', valor: true });
          M.botoes([['Exemplo da aula: $\\theta_0=\\varphi_0=\\pi/4$', () => M.definir({ kt: 6, kp: 6, R: 1 })]]);
          M.cena(V, (C, S) => {
            const t0 = (S.kt * PI) / 24, p0 = (S.kp * PI) / 24, R = S.R;
            C.eixos({ x: [-1.6, 1.6], y: [-1.6, 1.6], z: [-1.6, 1.7] });
            C.sup((t, p) => gS(t, p, R), 0, 2 * PI, 0, PI, 48, 24, { alfa: 0.6 });
            const P = gS(t0, p0, R), a = gSt(t0, p0, R), b = gSp(t0, p0, R), N = CM.cross(a, b);
            if (S.curvas) {
              C.param((t) => gS(t, p0, R * 1.003), 0, 2 * PI, 90, { cor: cor.u, larg: 2.2 });
              C.param((p) => gS(t0, p, R * 1.003), 0, PI, 60, { cor: cor.v, larg: 2.2 });
            }
            if (S.plano && CM.len(N) > 1e-6) C.plano(P, N, 0.55 * R, { cor: cor.ouro, alfa: 0.32 });
            C.seta(P, CM.mul(a, 0.6), { cor: cor.u, rot: '$\\partial_\\theta g$' });
            C.seta(P, CM.mul(b, 0.6), { cor: cor.v, rot: '$\\partial_\\varphi g$' });
            if (CM.len(N) > 1e-6) C.seta(P, CM.mul(CM.nrm(N), 0.6), { cor: cor.n, rot: '$N$' });
            C.ponto(P, { cor: cor.r, rot: '$P$' });
          });
          M.leituras('Em $P=g(\\theta_0;\\varphi_0)$', (S) => {
            const t0 = (S.kt * PI) / 24, p0 = (S.kp * PI) / 24, R = S.R;
            const P = gS(t0, p0, R), a = gSt(t0, p0, R), b = gSp(t0, p0, R), N = CM.cross(a, b);
            return [['$\\theta_0,\\ \\varphi_0$', '$' + texK(S.kt) + ',\\ ' + texK(S.kp) + '$'], ['$P$', '$' + TX.v(P, 2) + '$'], ['$\\frac{\\partial g}{\\partial\\theta}=(-R\\sin\\varphi\\sin\\theta;\\,R\\sin\\varphi\\cos\\theta;\\,0)$', '$' + TX.v(a, 2) + '$'], ['$\\frac{\\partial g}{\\partial\\varphi}=(R\\cos\\varphi\\cos\\theta;\\,R\\cos\\varphi\\sin\\theta;\\,-R\\sin\\varphi)$', '$' + TX.v(b, 2) + '$'], ['$N=\\frac{\\partial g}{\\partial\\theta}\\times\\frac{\\partial g}{\\partial\\varphi}$', '$' + TX.v(N, 2) + '$'], ['$\\|N\\|=R^2\\sin\\varphi$', '$' + TX.n(CM.len(N), 3) + '$', 'forte'], CM.len(N) < 1e-6 ? 'Nos polos ($\\varphi=0$ ou $\\pi$) $\\frac{\\partial g}{\\partial\\theta}=0$: a parametrização não é regular aí, embora a esfera seja lisa.' : '$N$ é perpendicular aos dois vetores tangentes e, com esta ordem $(\\theta,\\varphi)$, aponta para dentro: troca a ordem para apontar para fora.'];
          });
          M.texto('<b class="t">Parametrização da esfera</b>$$g(\\theta;\\varphi)=(R\\sin\\varphi\\cos\\theta;\\,R\\sin\\varphi\\sin\\theta;\\,R\\cos\\varphi),\\quad\\theta\\in[0,2\\pi],\\ \\varphi\\in[0,\\pi]$$<p>Os vetores $\\frac{\\partial g}{\\partial\\theta}$ e $\\frac{\\partial g}{\\partial\\varphi}$ geram o espaço tangente; o produto externo dá a normal. O plano tangente em $P$ é $N\\cdot(X-P)=0$.</p>', 'nota');
          M.legenda([[cor.u, '$\\varphi=\\varphi_0$ (paralelo) e $\\partial g/\\partial\\theta$'], [cor.v, '$\\theta=\\theta_0$ (meridiano) e $\\partial g/\\partial\\varphi$'], [cor.n, 'normal'], [cor.ouro, 'plano tangente']]);
        },
      },
      {
        id: 'grafico', nome: 'Gráfico z = f(x; y)',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.6, alvo: [0, 0, 0.3] });
          M.escolha('f', { rot: '$f(x;y)$', opcoes: Object.keys(FG).map((k) => [k, '$' + FG[k].tex + '$']), valor: 'hemi' });
          M.barra('x0', { rot: '$x_0$', cor: cor.u, min: -0.9, max: 0.9, valor: 0.3 });
          M.barra('y0', { rot: '$y_0$', cor: cor.v, min: -0.9, max: 0.9, valor: 0.2 });
          M.botoes([['Exemplo da aula: hemisfério, $(0;0)$', () => M.definir({ f: 'hemi', x0: 0, y0: 0 })]]);
          const pt = (S) => { let x = S.x0, y = S.y0; if (S.f === 'hemi') { const r = Math.hypot(x, y); if (r > 0.9) { x *= 0.9 / r; y *= 0.9 / r; } } return [x, y]; };
          M.cena(V, (C, S) => {
            const fg = FG[S.f], f = fg.f, [x, y] = pt(S);
            C.eixos({ x: [-1.4, 1.4], y: [-1.4, 1.4], z: [-1.2, 1.5] });
            if (S.f === 'hemi') C.sup((t, p) => gS(t, p, 1), 0, 2 * PI, 0, PI / 2 - 0.04, 48, 14, { alfa: 0.75 });
            else C.sup((r, t) => [r * Math.cos(t), r * Math.sin(t), f(r * Math.cos(t), r * Math.sin(t))], 0, 1.1, 0, 2 * PI, 14, 48, { alfa: 0.75 });
            const [fx, fy] = CM.grad(f, x, y), P = [x, y, f(x, y)], a = [1, 0, fx], b = [0, 1, fy], N = [-fx, -fy, 1];
            C.plano(P, N, 0.5, { cor: cor.ouro, alfa: 0.32 });
            const lim = S.f === 'hemi' ? (t, o) => Math.sqrt(Math.max(0, 0.98 - o * o)) : () => 0.95;
            const lx = lim(0, y), ly = lim(0, x);
            C.param((t) => [t, y, f(t, y) + 0.004], -lx, lx, 50, { cor: cor.u, larg: 2.2 });
            C.param((t) => [x, t, f(x, t) + 0.004], -ly, ly, 50, { cor: cor.v, larg: 2.2 });
            C.seta(P, CM.mul(CM.nrm(a), 0.55), { cor: cor.u, rot: '$(1;0;f_x)$' });
            C.seta(P, CM.mul(CM.nrm(b), 0.55), { cor: cor.v, rot: '$(0;1;f_y)$' });
            C.seta(P, CM.mul(CM.nrm(N), 0.55), { cor: cor.n, rot: '$N$' });
            C.ponto(P, { cor: cor.r, rot: '$P$' });
          });
          M.leituras('Em $P=(x_0;y_0;f(x_0;y_0))$', (S) => {
            const fg = FG[S.f], [x, y] = pt(S), [fx, fy] = CM.grad(fg.f, x, y), z = fg.f(x, y);
            return [['$P$', '$' + TX.v([x, y, z], 2) + '$'], ['$' + fg.fx + '$', '$' + TX.n(fx, 3) + '$'], ['$' + fg.fy + '$', '$' + TX.n(fy, 3) + '$'], ['$N=(-f_x;-f_y;1)$', '$' + TX.v([-fx, -fy, 1], 2) + '$'], ['plano tangente', `$z=${TX.n(z, 2)}${sg(fx)}(x${sg(-x)})${sg(fy)}(y${sg(-y)})$`, 'forte']];
          });
          M.texto('<b class="t">Gráfico como superfície</b><p>$g(x;y)=(x;y;f(x;y))$: $\\frac{\\partial g}{\\partial x}=(1;0;f_x)$, $\\frac{\\partial g}{\\partial y}=(0;1;f_y)$ e $N=(-f_x;-f_y;1)$. É o mesmo plano tangente da diferenciabilidade:</p>$$z=f(a)+f_x(a)(x-a_1)+f_y(a)(y-a_2).$$', 'nota');
          M.legenda([[cor.u, '$(1;0;f_x)$'], [cor.v, '$(0;1;f_y)$'], [cor.n, '$N$'], [cor.ouro, 'plano tangente']]);
        },
      },
      {
        id: 'area', nome: 'Área |S|',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.6 });
          M.barra('k1', { rot: '$\\theta_1$', cor: cor.u, min: 0, max: 48, passo: 1, valor: 0, fmt: fmtK, nome: 'θ₁' });
          M.barra('k2', { rot: '$\\theta_2$', cor: cor.u, min: 0, max: 48, passo: 1, valor: 12, fmt: fmtK, nome: 'θ₂' });
          M.barra('j1', { rot: '$\\varphi_1$', cor: cor.v, min: 0, max: 24, passo: 1, valor: 4, fmt: fmtK, nome: 'φ₁' });
          M.barra('j2', { rot: '$\\varphi_2$', cor: cor.v, min: 0, max: 24, passo: 1, valor: 12, fmt: fmtK, nome: 'φ₂' });
          M.barra('n', { rot: '$n$', cor: cor.n, min: 1, max: 24, passo: 1, valor: 6, fmt: (x) => String(Math.round(x)), nome: 'divisões' });
          M.botoes([['Esfera toda', () => M.definir({ k1: 0, k2: 48, j1: 0, j2: 24 })], ['Hemisfério norte', () => M.definir({ k1: 0, k2: 48, j1: 0, j2: 12 })], ['Calota $\\varphi\\le\\pi/3$', () => M.definir({ k1: 0, k2: 48, j1: 0, j2: 8 })]]);
          const ang = (S) => ({ t1: (Math.min(S.k1, S.k2) * PI) / 24, t2: (Math.max(S.k1, S.k2) * PI) / 24, p1: (Math.min(S.j1, S.j2) * PI) / 24, p2: (Math.max(S.j1, S.j2) * PI) / 24, n: Math.round(S.n) });
          M.cena(V, (C, S) => {
            const { t1, t2, p1, p2, n } = ang(S);
            C.eixos({ x: [-1.5, 1.5], y: [-1.5, 1.5], z: [-1.5, 1.6] });
            C.sup((t, p) => gS(t, p, 1), 0, 2 * PI, 0, PI, 48, 24, { cor: cor.sup, alfa: 0.16, malha: false });
            const dt = (t2 - t1) / n, dp = (p2 - p1) / n, seg = [];
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
              const t = t1 + i * dt, p = p1 + j * dp, P = gS(t, p, 1.005), a = CM.mul(gSt(t, p, 1), dt), b = CM.mul(gSp(t, p, 1), dp);
              const q = [P, CM.add(P, a), CM.add(P, CM.add(a, b)), CM.add(P, b)];
              C.poli(q, { cor: (i + j) % 2 ? cor.n : cor.sup2, alfa: 0.62, plano: 1 });
              seg.push([q[0], q[1]], [q[1], q[2]], [q[2], q[3]], [q[3], q[0]]);
            }
            C.segs(seg, { cor: cor.i, larg: 0.8, alfa: 0.45 });
          });
          M.leituras('Área da porção ($R=1$)', (S) => {
            const { t1, t2, p1, p2, n } = ang(S);
            const dt = (t2 - t1) / n, dp = (p2 - p1) / n;
            let soma = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) soma += Math.sin(p1 + j * dp) * dt * dp;
            const ex = (t2 - t1) * (Math.cos(p1) - Math.cos(p2));
            return [['soma de $' + n * n + '$ paralelogramos', '$' + TX.n(soma, 4) + '$'], ['$\\int\\!\\int\\sin\\varphi\\,d\\varphi\\,d\\theta=(\\theta_2-\\theta_1)(\\cos\\varphi_1-\\cos\\varphi_2)$', '$' + TX.n(ex, 4) + '$', 'forte'], ['esfera toda: $4\\pi$', '$' + TX.n(4 * PI, 4) + '$']];
          });
          M.texto('<b class="t">Área de uma superfície</b><p>Cada célula $\\Delta\\theta\\times\\Delta\\varphi$ do domínio é levada aproximadamente no paralelogramo de lados $\\frac{\\partial g}{\\partial\\theta}\\Delta\\theta$ e $\\frac{\\partial g}{\\partial\\varphi}\\Delta\\varphi$, de área $\\big\\|\\frac{\\partial g}{\\partial\\theta}\\times\\frac{\\partial g}{\\partial\\varphi}\\big\\|\\Delta\\theta\\,\\Delta\\varphi$.</p>$$|S|=\\iint_U\\Big\\|\\frac{\\partial g}{\\partial\\theta}\\times\\frac{\\partial g}{\\partial\\varphi}\\Big\\|\\,d\\theta\\,d\\varphi=\\iint R^2\\sin\\varphi\\,d\\theta\\,d\\varphi$$<p>É o mesmo raciocínio da mudança de variáveis, agora de $\\mathbb R^2$ para uma superfície em $\\mathbb R^3$.</p>', 'nota');
          M.legenda([[cor.n, 'paralelogramos tangentes']]);
        },
      },
    ],
    explicar: [
      { modelo: 'esfera', titulo: 'A esfera como g(θ; φ)', estado: { kt: 6, kp: 6, R: 1, curvas: true, plano: false }, texto: '<p>Cada $(\\theta;\\varphi)$ do retângulo $[0,2\\pi]\\times[0,\\pi]$ dá um ponto da esfera. Fixando $\\varphi$ obtém-se um paralelo (laranja); fixando $\\theta$, um meridiano (verde).</p>' },
      { modelo: 'esfera', titulo: 'Vetores tangentes e normal', estado: { kt: 6, kp: 6, R: 1, curvas: true, plano: true }, texto: '<p>$\\frac{\\partial g}{\\partial\\theta}$ e $\\frac{\\partial g}{\\partial\\varphi}$ são os vetores tangentes às duas linhas coordenadas. O produto externo é normal ao plano tangente, e $\\|N\\|=R^2\\sin\\varphi$.</p>' },
      { modelo: 'grafico', titulo: 'Gráficos são superfícies', estado: { f: 'hemi', x0: 0, y0: 0 }, texto: '<p>$z=\\sqrt{1-x^2-y^2}$ é o hemisfério norte. Em $(0;0)$, $f_x=f_y=0$: $N=(0;0;1)$ e o plano tangente é $z=1$.</p>' },
      { modelo: 'area', titulo: 'Área como soma de paralelogramos', estado: { k1: 0, k2: 48, j1: 0, j2: 12, n: 8 }, texto: '<p>Hemisfério norte: $\\int_0^{2\\pi}\\!\\int_0^{\\pi/2}\\sin\\varphi\\,d\\varphi\\,d\\theta=2\\pi$. Aumenta $n$ e a soma dos paralelogramos aproxima-se de $2\\pi$.</p>' },
    ],
    testa: [
      { modelo: 'esfera', estado: { kt: 6, kp: 6 }, p: 'Para a esfera de raio $R$, $\\big\\|\\frac{\\partial g}{\\partial\\theta}\\times\\frac{\\partial g}{\\partial\\varphi}\\big\\|=$', op: ['$R$', '$R^2\\sin\\varphi$', '$R^2\\cos\\varphi$', '$R\\sin\\theta$'], certa: 1, porque: 'É o mesmo fator do volume em esféricas, sem o $dr$: a área da caixinha na superfície.' },
      { modelo: 'grafico', estado: { f: 'hemi', x0: 0, y0: 0 }, p: 'Normal ao gráfico $z=f(x;y)$:', op: ['$(f_x;f_y;1)$', '$(-f_x;-f_y;1)$', '$(1;1;f)$', '$(f_x;f_y;0)$'], certa: 1, porque: '$(1;0;f_x)\\times(0;1;f_y)=(-f_x;-f_y;1)$. $(f_x;f_y;-1)$ também é normal, com o sentido oposto.' },
      { modelo: 'area', estado: { k1: 0, k2: 48, j1: 0, j2: 24 }, p: 'Área da esfera de raio $1$:', op: ['$\\pi$', '$2\\pi$', '$4\\pi$', '$\\tfrac43\\pi$'], certa: 2, porque: '$\\int_0^{2\\pi}\\!\\int_0^{\\pi}\\sin\\varphi\\,d\\varphi\\,d\\theta=2\\pi\\cdot2=4\\pi$.' },
    ],
  });
})();
