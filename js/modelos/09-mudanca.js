/* 9. Mudança de variáveis: polares, elipse, translação; células cilíndricas e esféricas em 3D. */
(function () {
  const PI = Math.PI;
  const RG = {
    disco: {
      nome: 'Disco $x^2+y^2\\le R^2$', g: (r, t) => [r * Math.cos(t), r * Math.sin(t)], jac: (r) => r, jtx: '|\\det Dg(r;\\theta)|=r',
      r: (S) => [0, S.R], t: () => [0, 2 * PI], val: (S) => PI * S.R * S.R, vtx: (S) => '\\int_0^{2\\pi}\\!\\int_0^R r\\,dr\\,d\\theta=\\pi R^2=' + TX.n(PI * S.R * S.R, 3),
      jan: [-2.4, 2.4, -1.9, 1.9], dom: [-0.3, 2.3, -0.4, 6.8],
    },
    elipse: {
      nome: 'Elipse $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}\\le1$', g: (r, t, S) => [S.a * r * Math.cos(t), S.b * r * Math.sin(t)], jac: (r, t, S) => S.a * S.b * r, jtx: 'x=ar\\cos\\theta,\\ y=br\\sin\\theta:\\ |\\det Dg|=abr',
      r: () => [0, 1], t: () => [0, 2 * PI], val: (S) => PI * S.a * S.b, vtx: (S) => '\\int_0^{2\\pi}\\!\\int_0^1 abr\\,dr\\,d\\theta=\\pi ab=' + TX.n(PI * S.a * S.b, 3),
      jan: [-2.4, 2.4, -1.9, 1.9], dom: [-0.3, 1.5, -0.4, 6.8],
    },
    desl: {
      nome: '$(x-1)^2+(y-1)^2<1,\\ x+y>2$', g: (r, t) => [1 + r * Math.cos(t), 1 + r * Math.sin(t)], jac: (r) => r, jtx: 'u=x-1,\\ v=y-1\\ \\text{e polares}:\\ |\\det|=r',
      r: () => [0, 1], t: () => [-PI / 4, (3 * PI) / 4], val: () => PI / 2, vtx: () => '\\int_{-\\pi/4}^{3\\pi/4}\\!\\int_0^1 r\\,dr\\,d\\theta=\\tfrac{\\pi}{2}\\approx1.571',
      jan: [-0.5, 2.6, -0.4, 2.4], dom: [-0.3, 1.5, -1.2, 2.8],
    },
    anel: {
      nome: 'Anel $1\\le x^2+y^2\\le4$', g: (r, t) => [r * Math.cos(t), r * Math.sin(t)], jac: (r) => r, jtx: '|\\det Dg(r;\\theta)|=r',
      r: () => [1, 2], t: () => [0, 2 * PI], val: () => 3 * PI, vtx: () => '\\int_0^{2\\pi}\\!\\int_1^2 r\\,dr\\,d\\theta=3\\pi\\approx9.425',
      jan: [-2.6, 2.6, -2.2, 2.2], dom: [-0.3, 2.3, -0.4, 6.8],
    },
  };

  /* sistemas 3D: g(a, b, c) com a caixa do domínio */
  const SI = {
    cil: {
      nome: 'Cilíndricas $(\\rho;\\theta;z)$', nomes: ['\\rho', '\\theta', 'z'], cx: [0, 1.2], cy: [0, 2 * PI], cz: [0, 1.4],
      g: (r, t, z) => [r * Math.cos(t), r * Math.sin(t), z], jac: (r) => r, jtx: '\\rho',
      vol: (a0, a1, b0, b1, c0, c1) => ((a1 * a1 - a0 * a0) / 2) * (b1 - b0) * (c1 - c0),
      total: '\\int_0^{1.4}\\!\\int_0^{2\\pi}\\!\\int_0^{1.2} \\rho\\,d\\rho\\,d\\theta\\,dz=\\pi(1.2)^2(1.4)', tval: PI * 1.44 * 1.4,
    },
    esf: {
      nome: 'Esféricas $(r;\\theta;\\varphi)$', nomes: ['r', '\\theta', '\\varphi'], cx: [0, 1.2], cy: [0, 2 * PI], cz: [0, PI],
      g: (r, t, f) => [r * Math.sin(f) * Math.cos(t), r * Math.sin(f) * Math.sin(t), r * Math.cos(f)], jac: (r, t, f) => r * r * Math.sin(f), jtx: 'r^2\\sin\\varphi',
      vol: (a0, a1, b0, b1, c0, c1) => ((a1 ** 3 - a0 ** 3) / 3) * (b1 - b0) * (Math.cos(c0) - Math.cos(c1)),
      total: '\\int_0^{\\pi}\\!\\int_0^{2\\pi}\\!\\int_0^{1.2}r^2\\sin\\varphi\\,dr\\,d\\theta\\,d\\varphi=\\tfrac43\\pi(1.2)^3', tval: (4 / 3) * PI * 1.2 ** 3,
    },
  };
  /* as seis faces de uma célula g([a0,a1]×[b0,b1]×[c0,c1]) */
  function celula(C, g, [a0, a1, b0, b1, c0, c1], o) {
    const n = 10;
    C.sup((b, c) => g(a0, b, c), b0, b1, c0, c1, n, n, o); C.sup((b, c) => g(a1, b, c), b0, b1, c0, c1, n, n, o);
    C.sup((a, c) => g(a, b0, c), a0, a1, c0, c1, n, n, o); C.sup((a, c) => g(a, b1, c), a0, a1, c0, c1, n, n, o);
    C.sup((a, b) => g(a, b, c0), a0, a1, b0, b1, n, n, o); C.sup((a, b) => g(a, b, c1), a0, a1, b0, b1, n, n, o);
    const ar = [];
    for (const [p, q] of [[[a0, b0, c0], [a1, b0, c0]], [[a0, b1, c0], [a1, b1, c0]], [[a0, b0, c1], [a1, b0, c1]], [[a0, b1, c1], [a1, b1, c1]]]) ar.push([p, q, 0]);
    for (const [p, q] of [[[a0, b0, c0], [a0, b1, c0]], [[a1, b0, c0], [a1, b1, c0]], [[a0, b0, c1], [a0, b1, c1]], [[a1, b0, c1], [a1, b1, c1]]]) ar.push([p, q, 1]);
    for (const [p, q] of [[[a0, b0, c0], [a0, b0, c1]], [[a1, b0, c0], [a1, b0, c1]], [[a0, b1, c0], [a0, b1, c1]], [[a1, b1, c0], [a1, b1, c1]]]) ar.push([p, q, 2]);
    ar.forEach(([p, q, k]) => C.param((s) => g(...p.map((x, i) => x + (q[i] - x) * s)), 0, 1, 16, { cor: o.arestas[k], larg: 2.4 }));
  }

  CDI.modelosDe('mudanca', {
    id: 'mudanca', ordem: 9, grupo: 'Cálculo integral', curto: 'Mudança de variáveis', titulo: 'Mudança de variáveis', paginas: 'pp. 41–45',
    resumo: 'Polares, cilíndricas e esféricas: caixas no domínio, células curvas na imagem, e o fator $|\\det Dg|$.',
    modelos: [
      {
        id: 'polares', nome: 'Polares e o fator r',
        montar(M) {
          const cor = M.cores();
          const D = M.plano({ janela: RG.disco.dom, livre: true, dica: 'Domínio (r; θ): arrasta a célula' });
          const I = M.plano({ janela: RG.disco.jan, dica: 'Imagem (x; y) = g(r; θ)' });
          M.S.c = [1.1, 1.0];
          M.escolha('reg', { rot: 'Região', opcoes: Object.keys(RG).map((k) => [k, RG[k].nome]), valor: 'disco', aoMudar: (k) => { D.janela(RG[k].dom); I.janela(RG[k].jan); const R = RG[k]; const rr = R.r(M.S), tt = R.t(M.S); M.S.c = [(rr[0] + rr[1]) * 0.6, (tt[0] + tt[1]) / 2 + 0.3]; } });
          M.barra('R', { rot: '$R$', cor: cor.u, min: 0.4, max: 2, valor: 1.5, nome: 'raio R' });
          M.barra('a', { rot: '$a$', cor: cor.u, min: 0.4, max: 2.2, valor: 2, nome: 'semieixo a' });
          M.barra('b', { rot: '$b$', cor: cor.v, min: 0.4, max: 1.6, valor: 1, nome: 'semieixo b' });
          M.barra('n', { rot: '$n$', cor: cor.n, min: 2, max: 24, passo: 1, valor: 8, fmt: (x) => String(Math.round(x)), nome: 'divisões' });
          const vis = () => { const k = M.S.reg; M.ctl.querySelectorAll('.barra').forEach((el) => { const l = el.querySelector('input').getAttribute('aria-label'); el.hidden = (l === 'raio R' && k !== 'disco') || ((l === 'semieixo a' || l === 'semieixo b') && k !== 'elipse'); }); };
          M.sync.push(vis);
          const cel = (S) => { const R = RG[S.reg], rr = R.r(S), tt = R.t(S), n = Math.round(S.n); const dr = (rr[1] - rr[0]) / n, dt = (tt[1] - tt[0]) / n; const i = CM.clamp(Math.floor((S.c[0] - rr[0]) / dr), 0, n - 1), j = CM.clamp(Math.floor((S.c[1] - tt[0]) / dt), 0, n - 1); return { R, rr, tt, n, dr, dt, r0: rr[0] + i * dr, t0: tt[0] + j * dt }; };
          M.cena(D, (P, S) => {
            const { rr, tt, n, dr, dt, r0, t0 } = cel(S);
            P.eixos(['r', 'θ']);
            for (let i = 0; i <= n; i++) { P.curva([[rr[0] + i * dr, tt[0]], [rr[0] + i * dr, tt[1]]], { cor: cor.u, larg: i % n ? 1 : 2, alfa: 0.7 }); P.curva([[rr[0], tt[0] + i * dt], [rr[1], tt[0] + i * dt]], { cor: cor.v, larg: i % n ? 1 : 2, alfa: 0.7 }); }
            P.poli([[r0, t0], [r0 + dr, t0], [r0 + dr, t0 + dt], [r0, t0 + dt]], { cor: cor.n, larg: 2, encher: cor.n + '55' });
            P.ponto([r0 + dr / 2, t0 + dt / 2], { cor: cor.n, r: 4, arr: (x, y) => M.definir({ c: [x, y] }) });
          });
          M.cena(I, (P, S) => {
            const { R, rr, tt, n, dr, dt, r0, t0 } = cel(S);
            P.eixos();
            for (let i = 0; i <= n; i++) {
              P.param((t) => R.g(rr[0] + i * dr, t, S), tt[0], tt[1], 120, { cor: cor.u, larg: i % n ? 1 : 2, alfa: 0.7 });
              P.param((r) => R.g(r, tt[0] + i * dt, S), rr[0], rr[1], 20, { cor: cor.v, larg: i % n ? 1 : 2, alfa: 0.7 });
            }
            if (S.reg === 'desl') P.curva([[-1, 3], [3, -1]], { cor: cor.m, larg: 1.2, trac: [5, 4] });
            const pts = [];
            for (let k = 0; k <= 10; k++) pts.push(R.g(r0, t0 + (dt * k) / 10, S));
            for (let k = 0; k <= 10; k++) pts.push(R.g(r0 + (dr * k) / 10, t0 + dt, S));
            for (let k = 10; k >= 0; k--) pts.push(R.g(r0 + dr, t0 + (dt * k) / 10, S));
            for (let k = 10; k >= 0; k--) pts.push(R.g(r0 + (dr * k) / 10, t0, S));
            P.poli(pts, { cor: cor.n, larg: 2, encher: cor.n + '55' });
          });
          M.leituras('A célula', (S) => {
            const { R, dr, dt, r0, t0 } = cel(S);
            const rc = r0 + dr / 2, tc = t0 + dt / 2;
            const area = CM.simpson((r) => R.jac(r, 0, S), r0, r0 + dr, 20) * dt;
            return [['$(r;\\theta)$ no centro', '$' + TX.v([rc, tc], 3) + '$'], ['área no domínio $\\Delta r\\,\\Delta\\theta$', '$' + TX.n(dr * dt, 4) + '$'], ['área da imagem', '$' + TX.n(area, 4) + '$'], ['rácio $\\approx|\\det Dg|$', '$' + TX.n(area / (dr * dt), 3) + '$', 'forte'], ['', '$' + R.jtx + '$'], '—', ['$\\mathrm{Vol}_2$', '$' + R.vtx(S) + '$', 'forte']];
          });
          M.texto('<b class="t">Mudança de variáveis</b><p>Se $g:T\\to D$ é injetiva e $C^1$, com $\\det Dg\\ne0$ (exceto num conjunto de área nula):</p>$$\\iint_D f(x;y)\\,dx\\,dy=\\iint_T f(g(u;v))\\,|\\det Dg(u;v)|\\,du\\,dv.$$<p>Em CDI I era $\\int f(x)\\,dx=\\int f(g(t))\\,|g\'(t)|\\,dt$. Em polares, $(x;y)=(r\\cos\\theta;\\,r\\sin\\theta)$ e $|\\det Dg|=r$: as células longe da origem são maiores, e $r$ corrige isso.</p>', 'nota');
          M.legenda([[cor.u, '$r$ constante'], [cor.v, '$\\theta$ constante'], [cor.n, 'uma célula e a sua imagem']]);
        },
      },
      {
        id: 'celulas', nome: 'Células cilíndricas e esféricas',
        montar(M) {
          const cor = M.cores();
          const D = M.vista3d({ ext: 1.7, alvo: [0.6, 0.9, 0.7], yaw: -0.85, pitch: 0.38, dica: 'Domínio: uma caixa (ângulos à escala 1/π)' });
          const V = M.vista3d({ ext: 1.6, alvo: [0, 0, 0.5], yaw: -0.85, pitch: 0.38, dica: 'Imagem: a célula curva no sólido' });
          M.escolha('s', { rot: 'Coordenadas', opcoes: Object.keys(SI).map((k) => [k, SI[k].nome]), valor: 'esf' });
          M.barra('a', { rot: '$r$', cor: cor.u, min: 0, max: 0.999, valor: 0.75, nome: 'célula: 1.ª coordenada', fmt: () => '' });
          M.barra('b', { rot: '$\\theta$', cor: cor.v, min: 0, max: 0.999, valor: 0.1, nome: 'célula: 2.ª coordenada', fmt: () => '' });
          M.barra('c', { rot: '$\\varphi$', cor: cor.b, min: 0, max: 0.999, valor: 0.35, nome: 'célula: 3.ª coordenada', fmt: () => '' });
          M.barra('n', { rot: '$n$', cor: cor.n, min: 3, max: 12, passo: 1, valor: 5, nome: 'divisões', fmt: (x) => String(Math.round(x)) });
          M.caixa('grelha', { rot: 'Superfícies coordenadas', valor: true });
          M.sync.push(() => { const nm = SI[M.S.s].nomes; ['a', 'b', 'c'].forEach((k, i) => { const l = M.ctl.querySelector('input[aria-label="célula: ' + (i + 1) + '.ª coordenada"]'); if (l) l.parentNode.querySelector('label').innerHTML = tex('$' + nm[i] + '$'); }); });
          const cel = (S) => {
            const si = SI[S.s], n = Math.round(S.n);
            const f = (iv, u) => { const h = (iv[1] - iv[0]) / n, i = Math.min(n - 1, Math.floor(u * n)); return [iv[0] + i * h, iv[0] + (i + 1) * h]; };
            const [a0, a1] = f(si.cx, S.a), [b0, b1] = f(si.cy, S.b), [c0, c1] = f(si.cz, S.c);
            return { si, n, box: [a0, a1, b0, b1, c0, c1] };
          };
          const ar = () => [cor.i, cor.i, cor.i];
          M.cena(D, (C, S) => {
            const { si, n, box } = cel(S);
            const sy = 1 / PI, sz = si === SI.esf ? 1 / PI : 1;
            const q = (a, b, c) => [a, b * sy, c * sz];
            const A = [si.cx[1], si.cy[1] * sy, si.cz[1] * sz];
            C.eixos({ x: [0, A[0] + 0.3], y: [0, A[1] + 0.3], z: [0, A[2] + 0.3], nomes: si.nomes, chao: false });
            C.caixa([0, 0, 0], A, { cor: cor.sup, alfa: 0.08 });
            const seg = [];
            for (let i = 1; i < n; i++) {
              const a = si.cx[0] + ((si.cx[1] - si.cx[0]) * i) / n, b = (si.cy[1] * i) / n, c = (si.cz[1] * i) / n;
              seg.push([q(a, 0, 0), q(a, si.cy[1], 0)], [q(a, 0, 0), q(a, 0, si.cz[1])], [q(0, b, 0), q(si.cx[1], b, 0)], [q(0, b, 0), q(0, b, si.cz[1])], [q(0, 0, c), q(si.cx[1], 0, c)], [q(0, 0, c), q(0, si.cy[1], c)]);
            }
            C.segs(seg, { cor: cor.m, larg: 1, alfa: 0.5 });
            const [a0, a1, b0, b1, c0, c1] = box;
            celula(C, (a, b, c) => q(a, b, c), box, { cor: cor.n, alfa: 0.55, malha: false, arestas: ar() });
            C.texto(q(a1, (b0 + b1) / 2, c1), '$\\Delta ' + si.nomes[0] + '\\,\\Delta ' + si.nomes[1] + '\\,\\Delta ' + si.nomes[2] + '$', { cor: cor.n, dx: 30, dy: -16 });
          });
          M.cena(V, (C, S) => {
            const { si, n, box } = cel(S);
            C.eixos({ x: [-1.5, 1.6], y: [-1.5, 1.6], z: [si === SI.esf ? -1.4 : 0, 1.8] });
            if (si === SI.esf) C.sup((t, f) => si.g(1.2, t, f), 0, 2 * PI, 0, PI, 48, 24, { cor: cor.sup, alfa: 0.12, malha: false });
            else {
              C.sup((t, z) => si.g(1.2, t, z), 0, 2 * PI, 0, 1.4, 48, 4, { cor: cor.sup, alfa: 0.12, malha: false });
              C.sup((r, t) => si.g(r, t, 1.4), 0, 1.2, 0, 2 * PI, 4, 48, { cor: cor.sup, alfa: 0.08, malha: false });
            }
            if (S.grelha) {
              const [a0, a1, b0, b1, c0, c1] = box;
              const o = { alfa: 0.13, malha: false, plano: 1 };
              C.sup((b, c) => si.g(a1, b, c), 0, 2 * PI, si.cz[0], si.cz[1], 40, 20, Object.assign({ cor: cor.u }, o));
              C.sup((a, c) => si.g(a, b0, c), 0, 1.2, si.cz[0], si.cz[1], 4, 20, Object.assign({ cor: cor.v }, o));
              C.sup((a, b) => si.g(a, b, c0), 0, 1.2, 0, 2 * PI, 4, 40, Object.assign({ cor: cor.b }, o));
            }
            celula(C, si.g, box, { cor: cor.n, alfa: 0.75, malha: false, arestas: ar() });
          });
          M.leituras('A célula', (S) => {
            const { si, box } = cel(S);
            const [a0, a1, b0, b1, c0, c1] = box;
            const dV = (a1 - a0) * (b1 - b0) * (c1 - c0), vol = si.vol(...box), J = si.jac((a0 + a1) / 2, (b0 + b1) / 2, (c0 + c1) / 2);
            const nm = si.nomes;
            return [['$' + nm[0] + '$', '$[' + TX.n(a0, 2) + ',\\,' + TX.n(a1, 2) + ']$'], ['$' + nm[1] + '$', '$[' + TX.n(b0, 2) + ',\\,' + TX.n(b1, 2) + ']$'], ['$' + nm[2] + '$', '$[' + TX.n(c0, 2) + ',\\,' + TX.n(c1, 2) + ']$'], '—', ['volume no domínio', '$' + TX.n(dV, 4) + '$'], ['volume da célula curva', '$' + TX.n(vol, 4) + '$'], ['rácio', '$' + TX.n(vol / dV, 3) + '$', 'forte'], ['$|\\det Dg|=' + si.jtx + '$ no centro', '$' + TX.n(J, 3) + '$'], '—', ['volume total', '$' + si.total + '\\approx' + TX.n(si.tval, 3) + '$']];
          });
          M.texto('<b class="t">Em ℝ³ é igual</b><p>A caixa $\\Delta a\\,\\Delta b\\,\\Delta c$ do domínio vai para uma célula curva com volume $\\approx|\\det Dg|\\,\\Delta a\\,\\Delta b\\,\\Delta c$:</p>$$\\text{cilíndricas: }|\\det Dg|=\\rho,\\qquad\\text{esféricas: }|\\det Dg|=r^2\\sin\\varphi.$$<p>Em esféricas a célula tem arestas $\\Delta r$, $r\\,\\Delta\\varphi$ (meridiano) e $r\\sin\\varphi\\,\\Delta\\theta$ (paralelo): o produto dá $r^2\\sin\\varphi$. Perto do eixo dos $z$ ($\\varphi\\approx0$) as células ficam finas; longe da origem, grandes.</p>', 'nota');
          M.legenda([[cor.u, '$\\rho$ ou $r$ constante'], [cor.v, '$\\theta$ constante'], [cor.b, '$z$ ou $\\varphi$ constante'], [cor.n, 'a célula']]);
        },
      },
    ],
    explicar: [
      { modelo: 'polares', titulo: 'A primitiva difícil', estado: { reg: 'disco', R: 1.5, n: 8, c: [1.1, 1] }, texto: '<p>Em cartesianas, $\\mathrm{Vol}_2(\\text{disco})=\\int_{-R}^{R}\\!\\int_{-\\sqrt{R^2-x^2}}^{\\sqrt{R^2-x^2}}dy\\,dx=2\\int_{-R}^{R}\\sqrt{R^2-x^2}\\,dx$: precisa de uma substituição trigonométrica.</p><p>O disco é um retângulo em $(r;\\theta)$: $[0,R]\\times[0,2\\pi]$.</p>' },
      { modelo: 'polares', titulo: 'Retângulos viram setores', estado: { reg: 'disco', R: 1.5, n: 8, c: [0.3, 1] }, texto: '<p>$g(r;\\theta)=(r\\cos\\theta;\\,r\\sin\\theta)$ leva a grelha do domínio em círculos e raios. A célula roxa tem a mesma área $\\Delta r\\,\\Delta\\theta$ à esquerda em qualquer sítio, mas à direita cresce com $r$.</p>' },
      { modelo: 'polares', titulo: 'O fator r', estado: { reg: 'disco', R: 1.5, n: 8, c: [1.3, 1] }, texto: '<p>A área da imagem de uma célula é $\\approx r\\,\\Delta r\\,\\Delta\\theta$: o rácio nas leituras dá $r$. É $|\\det Dg(r;\\theta)|=|\\cos\\theta\\cdot r\\cos\\theta-(-r\\sin\\theta)\\sin\\theta|=r$.</p>$$\\mathrm{Vol}_2=\\int_0^{2\\pi}\\!\\int_0^R r\\,dr\\,d\\theta=\\pi R^2.$$' },
      { modelo: 'polares', titulo: 'Elipse', estado: { reg: 'elipse', a: 2, b: 1, n: 8, c: [0.6, 1] }, texto: '<p>$\\frac{x^2}{a^2}+\\frac{y^2}{b^2}\\le1$. Com $x=ar\\cos\\theta$, $y=br\\sin\\theta$, $|\\det Dg|=abr$.</p>$$\\mathrm{Vol}_2=\\int_0^{2\\pi}\\!\\int_0^1 abr\\,dr\\,d\\theta=\\pi ab.$$' },
      { modelo: 'polares', titulo: 'Região deslocada', estado: { reg: 'desl', n: 8, c: [0.5, 0.8] }, texto: '<p>$(x-1)^2+(y-1)^2&lt;1$ e $x+y&gt;2$. Primeiro $u=x-1$, $v=y-1$: disco unitário com $u+v&gt;0$. Em polares, $\\cos\\theta+\\sin\\theta&gt;0\\iff-\\tfrac\\pi4&lt;\\theta&lt;\\tfrac{3\\pi}4$.</p>$$\\mathrm{Vol}_2=\\int_{-\\pi/4}^{3\\pi/4}\\!\\int_0^1 r\\,dr\\,d\\theta=\\tfrac\\pi2.$$' },
      { modelo: 'celulas', titulo: 'Cilíndricas: o fator ρ', estado: { s: 'cil', a: 0.8, b: 0.1, c: 0.4, n: 5, grelha: true }, vista: [-0.85, 0.38], texto: '<p>Em cilíndricas, $(x;y;z)=(\\rho\\cos\\theta;\\,\\rho\\sin\\theta;\\,z)$: é polares no plano e $z$ fica igual. A caixa do domínio passa a um bocado de anel com altura $\\Delta z$, de volume $\\approx \\rho\\,\\Delta\\rho\\,\\Delta\\theta\\,\\Delta z$.</p>' },
      { modelo: 'celulas', titulo: 'Esféricas: r² sen φ', estado: { s: 'esf', a: 0.8, b: 0.1, c: 0.4, n: 5, grelha: true }, texto: '<p>Em esféricas, cada célula é limitada por duas esferas ($r$ constante, laranja), dois semiplanos ($\\theta$ constante, verde) e dois cones ($\\varphi$ constante, azul). Volume $\\approx r^2\\sin\\varphi\\,\\Delta r\\,\\Delta\\theta\\,\\Delta\\varphi$.</p>' },
      { modelo: 'celulas', titulo: 'Junto ao eixo', estado: { s: 'esf', a: 0.8, b: 0.1, c: 0, n: 5, grelha: true }, texto: '<p>Com $\\varphi$ perto de $0$, a mesma caixa do domínio dá uma célula muito fina: $\\sin\\varphi\\approx0$. Por isso, no polo, $\\det Dg=0$ e a mudança deixa de ser injetiva — mas isso é um conjunto de volume nulo e não estraga o integral.</p>' },
    ],
    testa: [
      { modelo: 'polares', estado: { reg: 'disco', R: 1.5, c: [1.2, 1] }, p: 'Em polares, $(x;y)=(r\\cos\\theta;\\,r\\sin\\theta)$. Quanto vale $|\\det Dg(r;\\theta)|$?', op: ['$1$', '$r$', '$r^2$', '$r\\sin\\theta$'], certa: 1, porque: '$Dg=\\begin{bmatrix}\\cos\\theta&-r\\sin\\theta\\\\\\sin\\theta&r\\cos\\theta\\end{bmatrix}$, $\\det=r\\cos^2\\theta+r\\sin^2\\theta=r$.' },
      { modelo: 'polares', estado: { reg: 'elipse', a: 2, b: 1 }, p: 'Área da elipse $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}\\le1$:', op: ['$\\pi a^2b^2$', '$\\pi ab$', '$2\\pi ab$', '$\\pi(a+b)$'], certa: 1, porque: '$x=ar\\cos\\theta$, $y=br\\sin\\theta$ dá $|\\det|=abr$, e $\\int_0^{2\\pi}\\!\\int_0^1 abr\\,dr\\,d\\theta=\\pi ab$.' },
      { modelo: 'polares', estado: { reg: 'desl' }, p: 'Para $(x-1)^2+(y-1)^2&lt;1$ com $x+y&gt;2$, depois de $u=x-1$, $v=y-1$, que $\\theta$ se usa?', op: ['$0&lt;\\theta&lt;\\pi$', '$-\\tfrac\\pi4&lt;\\theta&lt;\\tfrac{3\\pi}4$', '$\\tfrac\\pi4&lt;\\theta&lt;\\tfrac{5\\pi}4$', '$0&lt;\\theta&lt;\\tfrac\\pi2$'], certa: 1, porque: '$x+y&gt;2\\iff u+v&gt;0\\iff\\cos\\theta+\\sin\\theta&gt;0$, o semiplano acima da reta $v=-u$.' },
      { modelo: 'celulas', estado: { s: 'esf', a: 0.8, b: 0.1, c: 0.4, n: 5 }, p: 'Em esféricas $(r;\\theta;\\varphi)$, o fator de volume é:', op: ['$r$', '$r^2$', '$r^2\\sin\\varphi$', '$r\\sin\\varphi$'], certa: 2, porque: 'As arestas da célula são $\\Delta r$, $r\\,\\Delta\\varphi$ e $r\\sin\\varphi\\,\\Delta\\theta$.' },
      { modelo: 'celulas', estado: { s: 'cil', a: 0.5, b: 0.2, c: 0.5, n: 5 }, p: 'Volume do cilindro $\\rho\\le1$, $0\\le z\\le h$ em cilíndricas:', op: ['$\\int_0^h\\!\\int_0^{2\\pi}\\!\\int_0^1 d\\rho\\,d\\theta\\,dz$', '$\\int_0^h\\!\\int_0^{2\\pi}\\!\\int_0^1 \\rho\\,d\\rho\\,d\\theta\\,dz$', '$\\int_0^h\\!\\int_0^{\\pi}\\!\\int_0^1 \\rho^2\\,d\\rho\\,d\\theta\\,dz$', '$2\\pi h$'], certa: 1, porque: 'Com o fator $\\rho$: $2\\pi\\cdot\\tfrac12\\cdot h=\\pi h$.' },
      { p: 'Na fórmula de mudança de variáveis aparece:', op: ['$\\det Dg(u;v)$', '$|\\det Dg(u;v)|$', '$1/|\\det Dg(u;v)|$', '$Dg(u;v)$'], certa: 1, porque: 'Áreas e volumes são positivos: entra o valor absoluto do determinante, que mede quanto $g$ estica.' },
    ],
  });
})();
