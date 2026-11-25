/* 8. Integrais duplos e triplos: volume debaixo de um gráfico, cortes, Fubini, ordens de integração. */
(function () {
  const sq = (x) => Math.sqrt(Math.max(0, x));
  const R2 = Math.SQRT2;
  /* regiões: tipo I (c(x) ≤ y ≤ d(x)) e tipo II (a(y) ≤ x ≤ b(y)) */
  const RG = {
    aula: {
      nome: '$x^2+y^2\\le 2,\\ y\\ge x^2$', dentro: (x, y) => x * x + y * y <= 2 && y >= x * x, j: [-1.8, 1.8, -0.4, 1.7],
      x: [-1, 1], c: (x) => x * x, d: (x) => sq(2 - x * x), lim1: '\\int_{-1}^{1}\\int_{x^2}^{\\sqrt{2-x^2}} dy\\,dx',
      y: [0, R2], a: (y) => (y <= 1 ? -sq(y) : -sq(2 - y * y)), b: (y) => (y <= 1 ? sq(y) : sq(2 - y * y)),
      lim2: '\\int_{0}^{1}\\int_{-\\sqrt y}^{\\sqrt y} dx\\,dy+\\int_{1}^{\\sqrt2}\\int_{-\\sqrt{2-y^2}}^{\\sqrt{2-y^2}} dx\\,dy',
      exato: Math.PI / 2 + 1 / 3, exTxt: '\\tfrac{\\pi}{2}+\\tfrac13',
      conta: '$$\\int_{-1}^{1}\\!\\big(\\sqrt{2-x^2}-x^2\\big)dx=\\Big[\\tfrac{x\\sqrt{2-x^2}}{2}+\\arcsin\\tfrac{x}{\\sqrt2}\\Big]_{-1}^{1}-\\tfrac23=\\tfrac{\\pi}{2}+\\tfrac13\\approx 1.904$$',
      bordas: [{ g: (t) => [t, t * t], t: [-1, 1] }, { g: (t) => [R2 * Math.cos(t), R2 * Math.sin(t)], t: [Math.PI / 4, (3 * Math.PI) / 4] }],
    },
    quad: {
      nome: '$[0,1]\\times[0,1]$', dentro: (x, y) => x >= 0 && x <= 1 && y >= 0 && y <= 1, j: [-0.4, 1.4, -0.4, 1.3],
      x: [0, 1], c: () => 0, d: () => 1, lim1: '\\int_0^1\\int_0^1 dy\\,dx', y: [0, 1], a: () => 0, b: () => 1, lim2: '\\int_0^1\\int_0^1 dx\\,dy',
      exato: 1, exTxt: '1', conta: 'Num retângulo os limites são constantes e as duas ordens escrevem-se igual.',
      bordas: [{ g: (t) => [t, 0], t: [0, 1] }, { g: (t) => [1, t], t: [0, 1] }, { g: (t) => [1 - t, 1], t: [0, 1] }, { g: (t) => [0, 1 - t], t: [0, 1] }],
    },
    tri: {
      nome: '$0\\le y\\le x\\le 1$', dentro: (x, y) => y >= 0 && y <= x && x <= 1, j: [-0.3, 1.3, -0.3, 1.2],
      x: [0, 1], c: () => 0, d: (x) => x, lim1: '\\int_0^1\\int_0^x dy\\,dx', y: [0, 1], a: (y) => y, b: () => 1, lim2: '\\int_0^1\\int_y^1 dx\\,dy',
      exato: 0.5, exTxt: '\\tfrac12', conta: '$\\int_0^1 x\\,dx=\\tfrac12$. Pela outra ordem: $\\int_0^1(1-y)\\,dy=\\tfrac12$.',
      bordas: [{ g: (t) => [t, 0], t: [0, 1] }, { g: (t) => [1, t], t: [0, 1] }, { g: (t) => [t, t], t: [0, 1] }],
    },
    entre: {
      nome: '$x^2\\le y\\le x$', dentro: (x, y) => y >= x * x && y <= x, j: [-0.3, 1.3, -0.3, 1.2],
      x: [0, 1], c: (x) => x * x, d: (x) => x, lim1: '\\int_0^1\\int_{x^2}^{x} dy\\,dx', y: [0, 1], a: (y) => y, b: (y) => sq(y), lim2: '\\int_0^1\\int_{y}^{\\sqrt y} dx\\,dy',
      exato: 1 / 6, exTxt: '\\tfrac16', conta: '$\\int_0^1(x-x^2)\\,dx=\\tfrac12-\\tfrac13=\\tfrac16$.',
      bordas: [{ g: (t) => [t, t * t], t: [0, 1] }, { g: (t) => [t, t], t: [0, 1] }],
    },
    disco: {
      nome: '$x^2+y^2\\le 1$', dentro: (x, y) => x * x + y * y <= 1, j: [-1.5, 1.5, -1.3, 1.3],
      x: [-1, 1], c: (x) => -sq(1 - x * x), d: (x) => sq(1 - x * x), lim1: '\\int_{-1}^{1}\\int_{-\\sqrt{1-x^2}}^{\\sqrt{1-x^2}} dy\\,dx',
      y: [-1, 1], a: (y) => -sq(1 - y * y), b: (y) => sq(1 - y * y), lim2: '\\int_{-1}^{1}\\int_{-\\sqrt{1-y^2}}^{\\sqrt{1-y^2}} dx\\,dy',
      exato: Math.PI, exTxt: '\\pi', conta: '$2\\int_{-1}^{1}\\sqrt{1-x^2}\\,dx=\\pi$. A primitiva é difícil; em polares é imediato (ver «Mudança de variáveis»).',
      bordas: [{ g: (t) => [Math.cos(t), Math.sin(t)], t: [0, 2 * Math.PI] }],
    },
  };
  const FS = {
    um: { tex: '1', f: () => 1 },
    par: { tex: '2-x^2-y^2', f: (x, y) => 2 - x * x - y * y },
    soma: { tex: 'x+y+1', f: (x, y) => x + y + 1 },
    sela: { tex: '1+xy', f: (x, y) => 1 + x * y },
  };
  const volume = (R, f) => CM.duplo(f, R.x[0], R.x[1], R.c, R.d, 200);

  /* sólidos para os cortes em z */
  const SO = {
    aula: {
      nome: '$0\\le x,y\\le 1,\\ 0\\le z\\le x+y$', vol: 1, volTxt: '1', zmax: 2,
      sec: (z) => (z <= 1 ? [[z, 0], [1, 0], [1, 1], [0, 1], [0, z]] : [[z - 1, 1], [1, 1], [1, z - 1]]),
      A: (z) => (z <= 1 ? 1 - (z * z) / 2 : ((2 - z) ** 2) / 2),
      Atxt: (z) => (z <= 1 ? 'A(z)=1-\\tfrac{z^2}{2}' : 'A(z)=\\tfrac{(2-z)^2}{2}'),
      Aexp: (z) => (z <= 1 ? 'Para $0\\le z\\le 1$: o quadrado menos o triângulo $x+y<z$.' : 'Para $1\\le z\\le 2$: só sobra o triângulo $x+y\\ge z$.'),
      desenhar(C, cor) {
        C.grafico((x, y) => x + y, 0, 1, 0, 1, 10, { alfa: 0.55 });
        C.poli([[0, 0, 0], [1, 0, 0], [1, 0, 1]], { cor: cor.sup, alfa: 0.35 });
        C.poli([[0, 0, 0], [0, 1, 0], [0, 1, 1]], { cor: cor.sup, alfa: 0.35 });
        C.poli([[1, 0, 0], [1, 1, 0], [1, 1, 2], [1, 0, 1]], { cor: cor.sup, alfa: 0.35 });
        C.poli([[0, 1, 0], [1, 1, 0], [1, 1, 2], [0, 1, 1]], { cor: cor.sup, alfa: 0.35 });
        [[[0, 0, 0], [1, 0, 0]], [[1, 0, 0], [1, 1, 0]], [[1, 1, 0], [0, 1, 0]], [[0, 1, 0], [0, 0, 0]], [[1, 0, 0], [1, 0, 1]], [[1, 1, 0], [1, 1, 2]], [[0, 1, 0], [0, 1, 1]], [[0, 0, 1e-3], [0, 0, 0]]].forEach(([a, b]) => C.linha(a, b, { cor: cor.sup, larg: 1.2, alfa: 0.8 }));
      },
      ordens: [
        ['dz\\,dy\\,dx', '\\int_0^1\\!\\int_0^1\\!\\int_0^{x+y} dz\\,dy\\,dx'],
        ['dz\\,dx\\,dy', '\\int_0^1\\!\\int_0^1\\!\\int_0^{x+y} dz\\,dx\\,dy'],
        ['dx\\,dy\\,dz', '\\int_0^1\\!\\int_0^1\\!\\int_{\\max(0,z-y)}^1 dx\\,dy\\,dz+\\int_1^2\\!\\int_{z-1}^1\\!\\int_{z-y}^1 dx\\,dy\\,dz'],
        ['dy\\,dx\\,dz', '\\int_0^1\\!\\int_0^1\\!\\int_{\\max(0,z-x)}^1 dy\\,dx\\,dz+\\int_1^2\\!\\int_{z-1}^1\\!\\int_{z-x}^1 dy\\,dx\\,dz'],
        ['dx\\,dz\\,dy', '\\int_0^1\\!\\int_0^{1+y}\\!\\int_{\\max(0,z-y)}^1 dx\\,dz\\,dy'],
        ['dy\\,dz\\,dx', '\\int_0^1\\!\\int_0^{1+x}\\!\\int_{\\max(0,z-x)}^1 dy\\,dz\\,dx'],
      ],
    },
    tetra: {
      nome: '$x,y,z\\ge 0,\\ x+y+z\\le 1$', vol: 1 / 6, volTxt: '\\tfrac16', zmax: 1,
      sec: (z) => [[0, 0], [1 - z, 0], [0, 1 - z]],
      A: (z) => ((1 - z) ** 2) / 2, Atxt: () => 'A(z)=\\tfrac{(1-z)^2}{2}', Aexp: () => 'Triângulo de catetos $1-z$.',
      desenhar(C, cor) {
        const O = [0, 0, 0], X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
        [[O, X, Y], [O, X, Z], [O, Y, Z], [X, Y, Z]].forEach((t, i) => C.poli(t, { cor: cor.sup, alfa: i === 3 ? 0.5 : 0.25 }));
        [[X, Y], [Y, Z], [Z, X]].forEach(([a, b]) => C.linha(a, b, { cor: cor.sup, larg: 1.4 }));
      },
      ordens: [['dz\\,dy\\,dx', '\\int_0^1\\!\\int_0^{1-x}\\!\\int_0^{1-x-y} dz\\,dy\\,dx'], ['dx\\,dy\\,dz', '\\int_0^1\\!\\int_0^{1-z}\\!\\int_0^{1-y-z} dx\\,dy\\,dz']],
    },
    caixa: {
      nome: '$[0,1]\\times[0,1.5]\\times[0,0.8]$', vol: 1.2, volTxt: '1\\cdot1.5\\cdot0.8=1.2', zmax: 0.8,
      sec: () => [[0, 0], [1, 0], [1, 1.5], [0, 1.5]],
      A: () => 1.5, Atxt: () => 'A(z)=(b-a)(d-c)=1.5', Aexp: () => 'Igual para todos os $z$.',
      desenhar(C, cor) { C.caixa([0, 0, 0], [1, 1.5, 0.8], { cor: cor.sup, alfa: 0.28 }); },
      ordens: [['dx\\,dy\\,dz', '\\int_e^f\\!\\int_c^d\\!\\int_a^b dx\\,dy\\,dz'], ['…', '\\text{limites constantes: as } 3!=6 \\text{ ordens são iguais}']],
    },
  };

  CDI.materia({
    id: 'integrais', ordem: 8, grupo: 'Cálculo integral', curto: 'Integrais múltiplos', titulo: 'Integrais duplos e triplos', paginas: 'pp. 35–41',
    resumo: 'Volume debaixo de um gráfico, cortes, trocar a ordem, somas de Riemann e as $3!$ ordens.',
    modelos: [
      {
        id: 'volume', nome: 'Volume debaixo de f',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7, alvo: [0, 0.4, 0.55], yaw: -0.95, pitch: 0.42 });
          const G = M.plano({ janela: [-1.3, 1.3, -0.2, 3.4], livre: true, dica: 'Área do corte A(x) = ∫ f(x, y) dy: o volume é a área debaixo desta curva' });
          M.escolha('r', { rot: 'Região D', opcoes: Object.keys(RG).map((k) => [k, RG[k].nome]), valor: 'aula', aoMudar: (k) => (M.S.u = 0.45) });
          M.escolha('f', { rot: 'Função f', opcoes: Object.keys(FS).map((k) => [k, '$f=' + FS[k].tex + '$']), valor: 'par' });
          M.barra('u', { rot: '$x$', cor: cor.u, min: 0, max: 1, valor: 0.45, nome: 'posição do corte', dur: 6000, fmt: (t) => '' });
          M.caixa('fatia', { rot: 'Corte com $x$ fixo', valor: true });
          M.caixa('riem', { rot: 'Prismas da soma de Riemann', valor: false });
          M.barra('n', { rot: '$n$', cor: cor.n, min: 2, max: 40, passo: 1, valor: 8, fmt: (x) => String(Math.round(x)), nome: 'divisões da grelha' });
          const xc = (S) => { const R = RG[S.r]; return R.x[0] + (R.x[1] - R.x[0]) * S.u; };
          const Acorte = (R, f, x) => CM.simpson((y) => f(x, y), R.c(x), R.d(x), 120);
          M.cena(V, (C, S) => {
            const R = RG[S.r], f = FS[S.f].f;
            C.eixos({ x: [-1.6, 1.6], y: [-0.6, 1.8], z: [-0.2, 2.5] });
            // região no chão
            C.sup((x, t) => [x, R.c(x) + t * (R.d(x) - R.c(x)), 0.002], R.x[0], R.x[1], 0, 1, 40, 4, { cor: cor.a, alfa: 0.35, malha: false, plano: 1 });
            R.bordas.forEach((b) => C.param((t) => [...b.g(t), 0.004], b.t[0], b.t[1], 80, { cor: cor.a, larg: 2.4 }));
            if (S.riem) {
              const n = Math.round(S.n), [x0, x1] = R.x, ys = [], lista = [];
              for (let i = 0; i <= 8; i++) { const x = x0 + ((x1 - x0) * i) / 8; ys.push(R.c(x), R.d(x)); }
              const y0 = Math.min(...ys), y1 = Math.max(...ys), hx = (x1 - x0) / n, hy = (y1 - y0) / n;
              for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const cx = x0 + (i + 0.5) * hx, cy = y0 + (j + 0.5) * hy; if (R.dentro(cx, cy)) lista.push([cx - hx / 2, cx + hx / 2, cy - hy / 2, cy + hy / 2, 0, f(cx, cy)]); }
              C.prismas(lista, { cor: cor.n, alfa: 0.78 });
              C.sup((x, t) => { const y = R.c(x) + t * (R.d(x) - R.c(x)); return [x, y, f(x, y)]; }, R.x[0], R.x[1], 0, 1, 40, 20, { alfa: 0.35, malha: false });
            } else {
              C.sup((x, t) => { const y = R.c(x) + t * (R.d(x) - R.c(x)); return [x, y, f(x, y)]; }, R.x[0], R.x[1], 0, 1, 48, 24, { alfa: S.fatia ? 0.72 : 0.92 });
              // paredes laterais
              R.bordas.forEach((b) => C.sup((t, v) => { const p = b.g(t); return [p[0], p[1], v * f(p[0], p[1])]; }, b.t[0], b.t[1], 0, 1, 40, 2, { cor: cor.sup, alfa: 0.22, malha: false }));
            }
            if (S.fatia) {
              const x = xc(S), lo = R.c(x), hi = R.d(x), pts = [];
              for (let i = 0; i <= 40; i++) { const y = lo + ((hi - lo) * i) / 40; pts.push([x, y, f(x, y)]); }
              const pol = [[x, lo, 0]].concat(pts, [[x, hi, 0]]);
              C.poli(pol, { cor: cor.u, alfa: 0.8, plano: 1 });
              C.curva(pol.concat([pol[0]]), { cor: cor.u, larg: 2.2 });
              C.texto([x, (lo + hi) / 2, f(x, (lo + hi) / 2) + 0.18], '$A(x)$', { cor: cor.u });
            }
          });
          M.cena(G, (P, S) => {
            const R = RG[S.r], f = FS[S.f].f;
            const xs = []; let amax = 0.5;
            for (let i = 0; i <= 160; i++) { const x = R.x[0] + ((R.x[1] - R.x[0]) * i) / 160, a = Acorte(R, f, x); xs.push([x, a]); amax = Math.max(amax, a); }
            G.j0 = [R.x[0] - 0.15 * (R.x[1] - R.x[0]), R.x[1] + 0.1 * (R.x[1] - R.x[0]), -0.15 * amax, amax * 1.25];
            G.c = [(G.j0[0] + G.j0[1]) / 2, (G.j0[2] + G.j0[3]) / 2];
            P.eixos(['x', 'A(x)']);
            const x = xc(S);
            P.regiao((a, b) => a >= R.x[0] && a <= x && b >= 0 && b <= Acorte(R, f, a), cor.u, 0.28, 3);
            P.curva(xs, { cor: cor.u, larg: 2.6 });
            P.ponto([x, Acorte(R, f, x)], { cor: cor.u });
          });
          M.leituras('Volume', (S) => {
            const R = RG[S.r], fs = FS[S.f], f = fs.f, x = xc(S);
            const vol = volume(R, f);
            const r = [['$x$ do corte', '$' + TX.n(x, 3) + '$'], ['$A(x)=\\int_{c(x)}^{d(x)} f(x,y)\\,dy$', '$' + TX.n(Acorte(R, f, x), 4) + '$'], ['$\\int_{a}^{x}A(t)\\,dt$ (já varrido)', '$' + TX.n(CM.simpson((t) => Acorte(R, f, t), R.x[0], x, 120), 4) + '$'], '—', ['$\\iint_D f$', '$' + R.lim1.replace(' dy', ' (' + fs.tex + ')\\,dy') + '$'], ['valor', '$' + (S.f === 'um' ? R.exTxt + '\\approx ' : '') + TX.n(vol, 4) + '$', 'forte']];
            if (S.riem) {
              const n = Math.round(S.n), [x0, x1] = R.x, ys = [];
              for (let i = 0; i <= 8; i++) { const xx = x0 + ((x1 - x0) * i) / 8; ys.push(R.c(xx), R.d(xx)); }
              r.push(['soma de Riemann, $n=' + n + '$', '$' + TX.n(CM.riemann(R.dentro, f, x0, x1, Math.min(...ys), Math.max(...ys), n), 4) + '$']);
            }
            return r;
          });
          M.texto('<b class="t">Integral duplo = volume</b><p>Para $f\\ge 0$, $\\iint_D f\\,dx\\,dy$ é o volume entre $D$ e o gráfico de $f$. Corta-se com $x$ fixo: a fatia tem área $A(x)=\\int_{c(x)}^{d(x)} f(x,y)\\,dy$, e soma-se as fatias:</p>$$\\iint_D f=\\int_a^b A(x)\\,dx=\\int_a^b\\!\\int_{c(x)}^{d(x)} f(x,y)\\,dy\\,dx.$$<p>Com $f=1$ o volume é igual à área de $D$: é o caso das teóricas.</p>', 'nota');
          M.legenda([[cor.a, 'região $D$'], [cor.sup, 'gráfico de $f$'], [cor.u, 'fatia e $A(x)$'], [cor.n, 'prismas de Riemann']]);
        },
      },
      {
        id: 'duplo', nome: 'Área por cortes',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: RG.aula.j });
          M.escolha('r', { rot: 'Região', opcoes: Object.keys(RG).map((k) => [k, RG[k].nome]), valor: 'aula', aoMudar: (k) => P.janela(RG[k].j) });
          M.escolha('o', { rot: 'Ordem', opcoes: [['yx', '$dy\\,dx$: corte com $x$ fixo'], ['xy', '$dx\\,dy$: corte com $y$ fixo']], valor: 'yx' });
          M.barra('u', { rot: 'corte', cor: cor.u, min: 0, max: 1, valor: 0.35, nome: 'posição do corte', dur: 6000, fmt: () => '' });
          M.caixa('acum', { rot: 'Área acumulada até ao corte', valor: true });
          const pos = (S) => { const R = RG[S.r]; return S.o === 'yx' ? R.x[0] + (R.x[1] - R.x[0]) * S.u : R.y[0] + (R.y[1] - R.y[0]) * S.u; };
          M.cena(P, (G, S) => {
            const R = RG[S.r];
            G.eixos();
            G.regiao(R.dentro, cor.sup, 0.3);
            const t = pos(S);
            if (S.acum) G.regiao((x, y) => (S.o === 'yx' ? x <= t : y <= t) && R.dentro(x, y), cor.u, 0.35);
            R.bordas.forEach((b) => G.param(b.g, b.t[0], b.t[1], 120, { cor: cor.a, larg: 2.4 }));
            if (S.o === 'yx') {
              const lo = R.c(t), hi = R.d(t);
              G.curva([[t, lo], [t, hi]], { cor: cor.u, larg: 4 });
              G.ponto([t, lo], { cor: cor.u, r: 4, rot: 'c(x)', dx: 28, dy: 6 });
              G.ponto([t, hi], { cor: cor.u, r: 4, rot: 'd(x)', dx: 28, dy: -6 });
            } else {
              const lo = R.a(t), hi = R.b(t);
              G.curva([[lo, t], [hi, t]], { cor: cor.u, larg: 4 });
              G.ponto([lo, t], { cor: cor.u, r: 4, rot: 'a(y)', dx: -10, dy: -14 });
              G.ponto([hi, t], { cor: cor.u, r: 4, rot: 'b(y)', dx: 10, dy: -14 });
            }
          });
          M.leituras('Área', (S) => {
            const R = RG[S.r], t = pos(S);
            const acum = S.o === 'yx' ? CM.simpson((x) => Math.max(0, R.d(x) - R.c(x)), R.x[0], t, 300) : CM.simpson((y) => Math.max(0, R.b(y) - R.a(y)), R.y[0], t, 300);
            return [[S.o === 'yx' ? '$x$ fixo' : '$y$ fixo', '$' + TX.n(t, 3) + '$'], [S.o === 'yx' ? '$d(x)-c(x)$' : '$b(y)-a(y)$', '$' + TX.n(S.o === 'yx' ? R.d(t) - R.c(t) : R.b(t) - R.a(t), 3) + '$'], ['área acumulada', '$' + TX.n(acum, 4) + '$'], '—', ['$dy\\,dx$', '$' + R.lim1 + '$'], ['$dx\\,dy$', '$' + R.lim2 + '$'], ['$\\mathrm{Vol}_2(D)$', '$' + R.exTxt + '\\approx ' + TX.n(R.exato, 4) + '$', 'forte']];
          });
          M.texto((S) => '<b class="t">A conta</b>' + RG[S.r].conta, 'chave');
          M.texto('<b class="t">Trocar a ordem</b><p>O valor não muda (teorema de Fubini, com $f$ contínua), mas os <b>limites mudam</b>. Na região das teóricas, com $y$ fixo é preciso partir o integral em $y=1$: abaixo o corte é limitado pela parábola, acima pela circunferência.</p>', 'nota');
          M.legenda([[cor.sup, 'região'], [cor.u, 'corte e área acumulada']]);
        },
      },
      {
        id: 'triplo', nome: 'Integral triplo (cortes em z)',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.6, alvo: [0.5, 0.6, 0.7], yaw: -0.9, pitch: 0.4 });
          const G = M.plano({ janela: [-0.15, 2.2, -0.1, 1.7], livre: true, dica: 'A(z): o volume é a área debaixo da curva' });
          M.escolha('s', { rot: 'Sólido', opcoes: Object.keys(SO).map((k) => [k, SO[k].nome]), valor: 'aula', aoMudar: (k) => (M.S.z = Math.min(M.S.z, SO[k].zmax * 0.98)) });
          M.barra('z', { rot: '$z$', cor: cor.u, min: 0, max: 2, valor: 0.6, nome: 'altura do corte', dur: 6000 });
          M.sync.unshift(() => { const s = SO[M.S.s], b = M.ctl.querySelector('input[aria-label="altura do corte"]'); if (b) b.max = s.zmax; M.S.z = Math.min(M.S.z, s.zmax); });
          M.cena(V, (C, S) => {
            const so = SO[S.s];
            C.eixos({ x: [0, 1.5], y: [0, 1.9], z: [0, 2.3] });
            so.desenhar(C, cor);
            const pol = so.sec(Math.min(S.z, so.zmax - 1e-6));
            if (pol.length > 2) { const p3 = pol.map((p) => [p[0], p[1], S.z]); C.poli(p3, { cor: cor.u, alfa: 0.8, plano: 1 }); C.curva(p3.concat([p3[0]]), { cor: cor.u, larg: 2.2 }); }
            C.poli([[-0.2, -0.2, S.z], [1.4, -0.2, S.z], [1.4, 1.8, S.z], [-0.2, 1.8, S.z]], { cor: cor.u, alfa: 0.07, plano: 1 });
          });
          M.cena(G, (P, S) => {
            const so = SO[S.s];
            G.j0 = [-0.15, so.zmax + 0.2, -0.1, Math.max(1.6, so.A(0) * 1.15)];
            G.c = [(G.j0[0] + G.j0[1]) / 2, (G.j0[2] + G.j0[3]) / 2];
            P.eixos(['z', 'A(z)']);
            P.regiao((x, y) => x >= 0 && x <= S.z && y >= 0 && y <= so.A(x), cor.u, 0.3);
            P.param((t) => [t, so.A(t)], 0, so.zmax, 200, { cor: cor.u, larg: 2.6 });
            P.ponto([S.z, so.A(S.z)], { cor: cor.u });
          });
          M.leituras('Corte $z$ constante', (S) => {
            const so = SO[S.s];
            return [['$z$', '$' + TX.n(S.z, 3) + '$'], ['$' + so.Atxt(S.z) + '$', '$' + TX.n(so.A(S.z), 4) + '$'], so.Aexp(S.z), ['$\\int_0^z A(t)\\,dt$', '$' + TX.n(CM.simpson(so.A, 0, S.z, 400), 4) + '$'], ['$\\mathrm{Vol}_3$', '$' + so.volTxt + '$', 'forte']];
          });
          M.leituras('As ordens de integração', (S) => SO[S.s].ordens.map(([a, b]) => ['$' + a + '$', '$' + b + '$']));
          M.texto('<b class="t">Volume como integral triplo</b>$$\\mathrm{Vol}_3(X)=\\iiint_X 1\\,dx\\,dy\\,dz=\\int A(z)\\,dz$$<p>Fixa-se $z$, calcula-se a área do corte e integra-se em $z$. Há $3!=6$ ordens possíveis. No sólido das teóricas os cortes mudam de forma em $z=1$, por isso com $z$ por fora o integral parte-se em dois: $\\tfrac56+\\tfrac16=1$.</p>', 'nota');
          M.legenda([[cor.sup, 'sólido'], [cor.u, 'corte e $A(z)$']]);
        },
      },
    ],
    explicar: [
      { modelo: 'volume', titulo: 'Com f = 1, volume = área', estado: { r: 'aula', f: 'um', u: 0.45, fatia: true, riem: false }, vista: [-0.95, 0.42], texto: '<p>A região das teóricas: $D=\\{x^2+y^2\\le2,\\ y\\ge x^2\\}$. Com $f=1$, o sólido é um «bolo» de altura 1 e o volume é a área de $D$.</p>' },
      { modelo: 'volume', titulo: 'Somar fatias', estado: { r: 'aula', f: 'par', u: 0.3, fatia: true, riem: false }, texto: '<p>Com $f=2-x^2-y^2$ o teto é curvo. Cada fatia com $x$ fixo tem área $A(x)=\\int_{x^2}^{\\sqrt{2-x^2}} f(x,y)\\,dy$.</p><p>Carrega em ▶ no corte: a área debaixo de $A(x)$, no gráfico de baixo, é o volume já varrido.</p>' },
      { modelo: 'volume', titulo: 'Somas de Riemann', estado: { r: 'aula', f: 'par', riem: true, n: 6, fatia: false }, texto: '<p>Partindo $D$ em quadradinhos e pondo em cada um um prisma de altura $f(\\text{centro})$, a soma dos volumes aproxima o integral. Aumenta $n$ em «Mexer nos controlos».</p>' },
      { modelo: 'duplo', titulo: 'A área, pela conta', estado: { r: 'aula', o: 'yx', u: 1, acum: true }, texto: '$$\\int_{-1}^{1}\\!\\big(\\sqrt{2-x^2}-x^2\\big)dx=\\Big[\\tfrac{x\\sqrt{2-x^2}}{2}+\\arcsin\\tfrac{x}{\\sqrt2}\\Big]_{-1}^{1}-\\tfrac23$$<p>$=\\big(\\tfrac12+\\tfrac\\pi4\\big)-\\big(-\\tfrac12-\\tfrac\\pi4\\big)-\\tfrac23=\\boldsymbol{\\tfrac{\\pi}{2}+\\tfrac13}\\approx 1.904$.</p>' },
      { modelo: 'duplo', titulo: 'Trocar a ordem', estado: { r: 'aula', o: 'xy', u: 0.55, acum: true }, texto: '<p>Com $y$ fixo o corte é horizontal. Para $0\\le y\\le1$ vai de $-\\sqrt y$ a $\\sqrt y$ (parábola); para $1\\le y\\le\\sqrt2$, de $-\\sqrt{2-y^2}$ a $\\sqrt{2-y^2}$ (circunferência). O valor é o mesmo; os limites, não.</p>' },
      { modelo: 'triplo', titulo: 'O sólido das teóricas', estado: { s: 'aula', z: 0.6 }, vista: [-0.9, 0.4], texto: '<p>$X=\\{0\\le x,y\\le1,\\ 0\\le z\\le x+y\\}$. Com $x$ e $y$ por fora: $\\int_0^1\\!\\int_0^1 (x+y)\\,dy\\,dx=1$.</p><p>Com $z$ por fora, para $0\\le z\\le1$ o corte é o quadrado menos o triângulo $x+y<z$: $A(z)=1-z^2/2$.</p>' },
      { modelo: 'triplo', titulo: 'Os cortes mudam em z = 1', estado: { s: 'aula', z: 1.4 }, texto: '<p>Para $1\\le z\\le2$ sobra só o triângulo $x+y\\ge z$: $A(z)=(2-z)^2/2$.</p>$$\\int_0^1\\!\\Big(1-\\tfrac{z^2}{2}\\Big)dz+\\int_1^2\\!\\tfrac{(2-z)^2}{2}\\,dz=\\tfrac56+\\tfrac16=1.$$' },
    ],
    testa: [
      { modelo: 'duplo', estado: { r: 'aula', o: 'yx', u: 1, acum: true }, p: 'Área de $D=\\{x^2+y^2\\le2,\\ y\\ge x^2\\}$:', op: ['$\\tfrac\\pi2-\\tfrac13$', '$\\tfrac\\pi2+\\tfrac13$', '$\\tfrac{2\\sqrt2}{3}$', '$\\pi$'], certa: 1, porque: '$\\int_{-1}^1\\sqrt{2-x^2}\\,dx=1+\\tfrac\\pi2$ e $\\int_{-1}^1 x^2\\,dx=\\tfrac23$.' },
      { modelo: 'duplo', estado: { r: 'tri', o: 'xy', u: 0.4 }, p: 'Região $0\\le y\\le x\\le1$. Limites na ordem $dx\\,dy$:', op: ['$\\int_0^1\\!\\int_0^y dx\\,dy$', '$\\int_0^1\\!\\int_y^1 dx\\,dy$', '$\\int_0^1\\!\\int_0^1 dx\\,dy$', '$\\int_0^x\\!\\int_0^1 dx\\,dy$'], certa: 1, porque: 'Com $y$ fixo, $x$ vai da reta $x=y$ até $1$.' },
      { p: 'Trocar a ordem de integração de $f$ contínua numa região:', op: ['muda o valor do integral', 'não muda o valor, mas em geral muda os limites', 'só é possível em retângulos', 'troca o sinal'], certa: 1, porque: 'Teorema de Fubini. Os limites descrevem a mesma região de outra maneira.' },
      { modelo: 'volume', estado: { r: 'quad', f: 'soma', fatia: true, u: 0.5 }, p: 'Volume debaixo de $f=x+y+1$ sobre $[0,1]^2$:', op: ['$1$', '$\\tfrac32$', '$2$', '$3$'], certa: 2, porque: '$\\int_0^1\\!\\int_0^1(x+y+1)\\,dy\\,dx=\\tfrac12+\\tfrac12+1=2$.' },
      { modelo: 'triplo', estado: { s: 'aula', z: 1.5 }, p: '$X=\\{0\\le x,y\\le1,\\ 0\\le z\\le x+y\\}$. Área do corte para $1\\le z\\le2$:', op: ['$1-\\tfrac{z^2}{2}$', '$\\tfrac{(2-z)^2}{2}$', '$z-1$', '$1$'], certa: 1, porque: 'Sobra o triângulo $\\{x+y\\ge z\\}$ no quadrado, com catetos $2-z$.' },
      { p: 'Quantas ordens de integração tem um integral triplo?', op: ['3', '6', '9', '2'], certa: 1, porque: '$3!=6$ maneiras de ordenar $dx$, $dy$ e $dz$.' },
    ],
  });
})();
