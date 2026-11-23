/* 10. Coordenadas esféricas e cilíndricas e os sólidos das aulas. */
(function () {
  const PI = Math.PI, D = PI / 180, R2 = Math.SQRT2;
  const sph = (r, p, t) => [r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)];
  const cyl = (rho, t, z) => [rho * Math.cos(t), rho * Math.sin(t), z];
  const arco = (f, a, b, n = 40) => Array.from({ length: n + 1 }, (_, i) => f(a + ((b - a) * i) / n));

  /* sólidos das teóricas; sec = corte por um semiplano θ constante, em (ρ; z) */
  const SO = {
    cil: {
      nome: 'Cilindro $\\rho<r,\\ 0<z<h$', dentro: (x, y, z) => x * x + y * y < 1 && z > 0 && z < 1.2, caixa: [-1, 1, -1, 1, 0, 1.2],
      int: '\\int_0^{2\\pi}\\!\\int_0^r\\!\\int_0^h\\rho\\,dz\\,d\\rho\\,d\\theta=\\pi r^2h', val: '\\pi\\cdot1^2\\cdot1.2=1.2\\pi', coord: 'cilíndricas: $0<\\theta<2\\pi$, $0<\\rho<r$, $0<z<h$ (aqui $r=1$, $h=1.2$)',
      sec: [[0, 0], [1, 0], [1, 1.2], [0, 1.2]], th: [0, 2 * PI], stx: 'um retângulo $0<\\rho<1$, $0<z<1.2$',
      desenhar(C, cor) {
        C.sup((t, z) => cyl(1, t, z), 0, 2 * PI, 0, 1.2, 48, 6, { alfa: 0.38, malha: false, cor: cor.sup });
        C.sup((r, t) => cyl(r, t, 1.2), 0, 1, 0, 2 * PI, 4, 48, { cor: cor.sup, alfa: 0.4, malha: false });
        C.sup((r, t) => cyl(r, t, 0), 0, 1, 0, 2 * PI, 4, 48, { cor: cor.sup, alfa: 0.2, malha: false });
      },
    },
    coneaula: {
      nome: '$\\sqrt{x^2+y^2}<z<1,\\ y>x$', dentro: (x, y, z) => Math.hypot(x, y) < z && z < 1 && y > x, caixa: [-1, 1, -1, 1, 0, 1],
      int: '\\int_{\\pi/4}^{5\\pi/4}\\!\\int_0^1\\!\\int_\\rho^1\\rho\\,dz\\,d\\rho\\,d\\theta=\\pi\\!\\int_0^1\\!\\rho(1-\\rho)\\,d\\rho', val: '\\tfrac{\\pi}{6}\\approx0.524', coord: 'cilíndricas: o cone é $z=\\rho$; $y>x\\iff\\tfrac\\pi4<\\theta<\\tfrac{5\\pi}4$; $0<\\rho<1$; $\\rho<z<1$',
      sec: [[0, 0], [1, 1], [0, 1]], th: [PI / 4, (5 * PI) / 4], stx: 'o triângulo $0<\\rho<z<1$, para $\\tfrac\\pi4<\\theta<\\tfrac{5\\pi}4$',
      desenhar(C, cor) {
        C.sup((r, t) => cyl(r, t, r), 0, 1, PI / 4, (5 * PI) / 4, 8, 40, { cor: cor.sup, alfa: 0.45, malha: false });
        C.sup((r, t) => cyl(r, t, 1), 0, 1, PI / 4, (5 * PI) / 4, 4, 40, { cor: cor.sup, alfa: 0.35, malha: false });
        const a = cyl(1, PI / 4, 1), b = cyl(1, (5 * PI) / 4, 1);
        C.poli([[0, 0, 0], a, b], { cor: cor.sup2, alfa: 0.3, plano: 1 });
      },
    },
    cone: {
      nome: '$\\sqrt{x^2+y^2}<z<1$', dentro: (x, y, z) => Math.hypot(x, y) < z && z < 1, caixa: [-1, 1, -1, 1, 0, 1],
      int: '\\int_0^{2\\pi}\\!\\int_0^1\\!\\int_\\rho^1\\rho\\,dz\\,d\\rho\\,d\\theta=2\\pi\\!\\int_0^1\\!\\rho(1-\\rho)\\,d\\rho', val: '\\tfrac{\\pi}{3}\\approx1.047', coord: 'cilíndricas: $0<\\theta<2\\pi$, $0<\\rho<1$, $\\rho<z<1$. Em esféricas também dá, mas o limite $r<1/\\cos\\varphi$ é mais difícil.',
      sec: [[0, 0], [1, 1], [0, 1]], th: [0, 2 * PI], stx: 'o triângulo $0<\\rho<z<1$',
      desenhar(C, cor) {
        C.sup((r, t) => cyl(r, t, r), 0, 1, 0, 2 * PI, 8, 56, { cor: cor.sup, alfa: 0.45, malha: false });
        C.sup((r, t) => cyl(r, t, 1), 0, 1, 0, 2 * PI, 4, 56, { cor: cor.sup, alfa: 0.35, malha: false });
      },
    },
    bola: {
      nome: 'Bola $x^2+y^2+z^2\\le R^2$', dentro: (x, y, z) => x * x + y * y + z * z <= 1, caixa: [-1, 1, -1, 1, -1, 1],
      int: '\\int_0^{2\\pi}\\!\\int_0^{\\pi}\\!\\int_0^R r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta=2\\pi\\cdot2\\cdot\\tfrac{R^3}{3}', val: '\\tfrac43\\pi R^3\\ (R=1:\\ \\approx4.189)', coord: 'esféricas: $0<r<R$, $0<\\varphi<\\pi$, $0<\\theta<2\\pi$, com $|\\det|=r^2\\sin\\varphi$',
      sec: [[0, 1]].concat(arco((p) => [Math.sin(p), Math.cos(p)], 0, PI, 40)), th: [0, 2 * PI], stx: 'um semidisco: $0<r<1$, $0<\\varphi<\\pi$',
      desenhar(C, cor) { C.sup((t, p) => sph(1, p, t), 0, 2 * PI, 0, PI, 48, 24, { cor: cor.sup, alfa: 0.38, malha: false }); },
    },
    gelado: {
      nome: '$\\sqrt{x^2+y^2}<z<\\sqrt{2-x^2-y^2},\\ y>x$', dentro: (x, y, z) => Math.hypot(x, y) < z && x * x + y * y + z * z < 2 && y > x, caixa: [-1, 1, -1, 1, 0, R2],
      int: '\\int_{\\pi/4}^{5\\pi/4}\\!\\int_0^{\\pi/4}\\!\\int_0^{\\sqrt2}r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta=\\pi\\big(1-\\tfrac{\\sqrt2}{2}\\big)\\tfrac{2\\sqrt2}{3}', val: '\\tfrac{2\\pi(\\sqrt2-1)}{3}\\approx0.867', coord: 'esféricas: o cone $z=\\rho$ é $\\varphi=\\tfrac\\pi4$ e a esfera é $r=\\sqrt2$; $y>x\\iff\\tfrac\\pi4<\\theta<\\tfrac{5\\pi}4$',
      sec: [[0, 0]].concat(arco((p) => [R2 * Math.sin(p), R2 * Math.cos(p)], PI / 4, 0, 30)), th: [PI / 4, (5 * PI) / 4], stx: 'um setor circular: $0<r<\\sqrt2$, $0<\\varphi<\\tfrac\\pi4$',
      desenhar(C, cor) {
        C.sup((r, t) => cyl(r, t, r), 0, 1, PI / 4, (5 * PI) / 4, 8, 40, { cor: cor.sup, alfa: 0.45, malha: false });
        C.sup((p, t) => sph(R2, p, t), 0, PI / 4, PI / 4, (5 * PI) / 4, 8, 40, { cor: cor.sup, alfa: 0.4, malha: false });
        const s = (u) => [u / R2, u / R2];
        const pts = [[0, 0, 0]].concat(arco((u) => [...s(u), Math.sqrt(2 - u * u)], 1, -1, 30));
        C.poli(pts, { cor: cor.sup2, alfa: 0.3, plano: 1 });
      },
    },
  };
  const cacheNum = {};
  function numerico(k) {
    if (cacheNum[k] != null) return cacheNum[k];
    const s = SO[k], [x0, x1, y0, y1, z0, z1] = s.caixa, n = 110;
    let c = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let l = 0; l < n; l++) if (s.dentro(x0 + ((i + 0.5) * (x1 - x0)) / n, y0 + ((j + 0.5) * (y1 - y0)) / n, z0 + ((l + 0.5) * (z1 - z0)) / n)) c++;
    return (cacheNum[k] = (c / n ** 3) * (x1 - x0) * (y1 - y0) * (z1 - z0));
  }

  CDI.materia({
    id: 'coordenadas', ordem: 10, grupo: 'Cálculo integral', curto: 'Coordenadas cil. e esf.', titulo: 'Coordenadas cilíndricas e esféricas', paginas: 'pp. 45–49',
    resumo: 'O ponto $P$ em $(\\rho;\\theta;z)$ e $(r;\\theta;\\varphi)$, a caixinha de volume e os sólidos das teóricas.',
    modelos: [
      {
        id: 'esfericas', nome: 'Esféricas',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.45, yaw: 0.85, pitch: 0.35 });
          M.barra('r', { rot: '$r$', cor: cor.v, min: 0, max: 1, valor: 0.8, nome: 'r', dur: 3500 });
          M.barra('ph', { rot: '$\\varphi$', cor: cor.n, min: 0, max: 180, passo: 1, valor: 50, fmt: (x) => Math.round(x) + '°', nome: 'φ', dur: 5000 });
          M.barra('th', { rot: '$\\theta$', cor: cor.u, min: 0, max: 360, passo: 1, valor: 120, fmt: (x) => Math.round(x) + '°', nome: 'θ', circular: true, dur: 5000 });
          M.caixa('box', { rot: 'Caixinha de volume', valor: true });
          M.cena(V, (C, S) => {
            const mut = cor.m, r = S.r, ph = S.ph * D, th = S.th * D;
            C.sup((t, p) => sph(1, p, t), 0, 2 * PI, 0, PI, 36, 18, { cor: cor.sup, alfa: 0.07, malha: false });
            for (let p = 30; p < 180; p += 30) C.curva(arco((t) => sph(1, p * D, t), 0, 2 * PI, 60), { cor: mut, larg: 0.8, alfa: 0.35 });
            for (let t = 0; t < 180; t += 30) C.curva(arco((p) => sph(1, p, t * D), 0, 2 * PI, 60), { cor: mut, larg: 0.8, alfa: 0.35 });
            C.eixos({ x: [-1.3, 1.3], y: [-1.3, 1.3], z: [-1.2, 1.3] });
            const P = sph(r, ph, th), Pp = [P[0], P[1], 0], A = [0, 0, P[2]];
            C.linha([0, 0, 0], Pp, { cor: mut, larg: 1, trac: [4, 3] });
            C.linha(P, Pp, { cor: mut, larg: 1, trac: [4, 3] });
            C.curva(arco((p) => sph(r, p, th), 0, PI, 60), { cor: cor.n, larg: 1.4, alfa: 0.8 });
            C.curva(arco((t) => sph(r, ph, t), 0, 2 * PI, 90), { cor: cor.u, larg: 1.2, trac: [3, 3], alfa: 0.9 });
            if (r > 0.05) { C.linha(A, P, { cor: cor.u, larg: 1.6, trac: [5, 3] }); C.texto(CM.mul(CM.add(A, P), 0.5), '$\\rho=r\\sin\\varphi$', { cor: cor.u, tam: 12, dy: -12 }); }
            const ra = Math.max(0.35 * r, 0.1);
            C.curva(arco((p) => sph(ra, p, th), 0, ph, 30), { cor: cor.n, larg: 2.2 });
            C.texto(sph(ra + 0.13, ph / 2, th), '$\\varphi$', { cor: cor.n });
            const rho = r * Math.sin(ph);
            if (rho > 0.02) { C.linha(A, sph(r, ph, 0), { cor: cor.u, larg: 1.2 }); C.curva(arco((t) => sph(r, ph, t), 0, th, 60), { cor: cor.u, larg: 2.8 }); C.texto([0.6 * rho * Math.cos(th / 2), 0.6 * rho * Math.sin(th / 2), A[2]], '$\\theta$', { cor: cor.u, dy: -8 }); }
            C.linha([0, 0, 0], P, { cor: cor.v, larg: 2.8 });
            if (r > 0.1) C.texto(sph(r * 0.5, ph, th), '$r$', { cor: cor.v, dx: -12, dy: -6, tam: 15 });
            if (S.box) {
              const dR = 0.12, dP = 14 * D, dT = 24 * D, p2 = Math.min(ph + dP, PI), t2 = th + dT, r2 = r + dR;
              const g = (a, b, c) => sph(a, c, b);
              const o = { cor: cor.sup2, alfa: 0.35, malha: false };
              C.sup((b, c) => g(r2, b, c), th, t2, ph, p2, 6, 6, o); C.sup((b, c) => g(r, b, c), th, t2, ph, p2, 6, 6, o);
              [ph, p2].forEach((j) => [th, t2].forEach((k) => C.linha(sph(r, j, k), sph(r2, j, k), { cor: cor.v, larg: 2.6 })));
              [r, r2].forEach((i) => [th, t2].forEach((k) => C.curva(arco((p) => sph(i, p, k), ph, p2, 10), { cor: cor.n, larg: 2.6 })));
              [r, r2].forEach((i) => [ph, p2].forEach((j) => C.curva(arco((t) => sph(i, j, t), th, t2, 10), { cor: cor.u, larg: 2.6 })));
            }
            C.ponto(P, { cor: cor.v, rot: '$P$' });
          });
          M.leituras('Coordenadas de $P$', (S) => {
            const r = S.r, ph = S.ph * D, th = S.th * D, P = sph(r, ph, th), rho = r * Math.sin(ph);
            return [['$\\rho=r\\sin\\varphi$ (distância ao eixo $z$)', '$' + TX.n(rho, 2) + '$'], ['$x=r\\sin\\varphi\\cos\\theta$', '$' + TX.n(P[0], 2) + '$'], ['$y=r\\sin\\varphi\\sin\\theta$', '$' + TX.n(P[1], 2) + '$'], ['$z=r\\cos\\varphi$', '$' + TX.n(P[2], 2) + '$'], '—', ['$dr$, para fora', '$0.120$'], ['$r\\,d\\varphi$, no meridiano', '$' + TX.n(r * 14 * D, 3) + '$'], ['$r\\sin\\varphi\\,d\\theta$, no paralelo', '$' + TX.n(rho * 24 * D, 3) + '$'], ['$|\\det Dg|=r^2\\sin\\varphi$', '$' + TX.n(r * r * Math.sin(ph), 3) + '$', 'forte']];
          });
          M.texto('<p><b class="cor2">$r\\in[0,R]$</b>: distância à origem. Sozinho, $P$ anda num raio.</p><p><b class="cor3">$\\varphi\\in[0,\\pi]$</b>: ângulo a partir do eixo $z$ positivo. Sozinho, $P$ desce um meridiano.</p><p><b class="cor1">$\\theta\\in[0,2\\pi]$</b>: ângulo à volta do eixo $z$, o das polares. Sozinho, $P$ dá a volta num paralelo.</p>$$dr\\cdot r\\,d\\varphi\\cdot r\\sin\\varphi\\,d\\theta=r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta$$', 'nota');
          M.legenda([[cor.v, '$r$ e $dr$'], [cor.n, '$\\varphi$ e $r\\,d\\varphi$'], [cor.u, '$\\theta$, $\\rho$ e $r\\sin\\varphi\\,d\\theta$']]);
        },
      },
      {
        id: 'cilindricas', nome: 'Cilíndricas',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.45, yaw: 0.85, pitch: 0.35 });
          M.barra('rho', { rot: '$\\rho$', cor: cor.v, min: 0, max: 1, valor: 0.7, nome: 'ρ', dur: 3500 });
          M.barra('th', { rot: '$\\theta$', cor: cor.u, min: 0, max: 360, passo: 1, valor: 120, fmt: (x) => Math.round(x) + '°', nome: 'θ', circular: true, dur: 5000 });
          M.barra('z', { rot: '$z$', cor: cor.n, min: -1, max: 1, valor: 0.4, nome: 'z', dur: 3500 });
          M.caixa('box', { rot: 'Caixinha de volume', valor: true });
          M.cena(V, (C, S) => {
            const mut = cor.m, rho = S.rho, th = S.th * D, z = S.z;
            C.sup((t, zz) => cyl(1, t, zz), 0, 2 * PI, -1, 1, 36, 4, { cor: cor.sup, alfa: 0.07, malha: false });
            for (const zz of [-1, -0.5, 0, 0.5, 1]) C.curva(arco((t) => cyl(1, t, zz), 0, 2 * PI, 72), { cor: mut, larg: 0.8, alfa: 0.35 });
            C.segs(Array.from({ length: 12 }, (_, k) => [cyl(1, k * 30 * D, -1), cyl(1, k * 30 * D, 1)]), { cor: mut, larg: 0.8, alfa: 0.35 });
            C.eixos({ x: [-1.3, 1.3], y: [-1.3, 1.3], z: [-1.2, 1.3] });
            const P = cyl(rho, th, z), Pp = [P[0], P[1], 0], A = [0, 0, z];
            C.linha([0, 0, 0], Pp, { cor: mut, larg: 1, trac: [4, 3] });
            C.curva(arco((t) => cyl(rho, t, z), 0, 2 * PI, 90), { cor: cor.u, larg: 1.2, trac: [3, 3], alfa: 0.9 });
            C.linha(Pp, P, { cor: cor.n, larg: 2.6 });
            C.texto([Pp[0], Pp[1], z / 2], '$z$', { cor: cor.n, dx: 12 });
            if (rho > 0.02) { C.linha(A, cyl(rho, 0, z), { cor: cor.u, larg: 1.2 }); C.curva(arco((t) => cyl(rho, t, z), 0, th, 60), { cor: cor.u, larg: 2.8 }); C.texto([0.6 * rho * Math.cos(th / 2), 0.6 * rho * Math.sin(th / 2), z], '$\\theta$', { cor: cor.u, dy: -8 }); }
            C.linha(A, P, { cor: cor.v, larg: 2.8 });
            if (rho > 0.1) C.texto(CM.mul(CM.add(A, P), 0.5), '$\\rho$', { cor: cor.v, dy: -12, tam: 15 });
            if (S.box) {
              const dR = 0.12, dT = 24 * D, dZ = 0.16, r2 = rho + dR, t2 = th + dT, z2 = z + dZ;
              const o = { cor: cor.sup2, alfa: 0.35, malha: false };
              C.sup((t, zz) => cyl(r2, t, zz), th, t2, z, z2, 6, 2, o); C.sup((r, t) => cyl(r, t, z2), rho, r2, th, t2, 2, 6, o);
              [th, t2].forEach((j) => [z, z2].forEach((k) => C.linha(cyl(rho, j, k), cyl(r2, j, k), { cor: cor.v, larg: 2.6 })));
              [rho, r2].forEach((i) => [z, z2].forEach((k) => C.curva(arco((t) => cyl(i, t, k), th, t2, 10), { cor: cor.u, larg: 2.6 })));
              [rho, r2].forEach((i) => [th, t2].forEach((j) => C.linha(cyl(i, j, z), cyl(i, j, z2), { cor: cor.n, larg: 2.6 })));
            }
            C.ponto(P, { cor: cor.v, rot: '$P$' });
          });
          M.leituras('Coordenadas de $P$', (S) => {
            const P = cyl(S.rho, S.th * D, S.z);
            return [['$x=\\rho\\cos\\theta$', '$' + TX.n(P[0], 2) + '$'], ['$y=\\rho\\sin\\theta$', '$' + TX.n(P[1], 2) + '$'], ['$z$', '$' + TX.n(S.z, 2) + '$'], ['$\\rho=\\sqrt{x^2+y^2}$', '$' + TX.n(S.rho, 2) + '$'], '—', ['$d\\rho$', '$0.120$'], ['$\\rho\\,d\\theta$', '$' + TX.n(S.rho * 24 * D, 3) + '$'], ['$dz$', '$0.160$'], ['$|\\det Dg|=\\rho$', '$' + TX.n(S.rho, 3) + '$', 'forte']];
          });
          M.texto('<p><b class="cor2">$\\rho\\in[0,R]$</b>: distância ao eixo $z$. Sozinho, $P$ anda num raio horizontal.</p><p><b class="cor1">$\\theta\\in[0,2\\pi]$</b>: ângulo à volta do eixo $z$ (o das polares).</p><p><b class="cor3">$z$</b>: a altura, igual à das cartesianas.</p>$$d\\rho\\cdot\\rho\\,d\\theta\\cdot dz=\\rho\\,d\\rho\\,d\\theta\\,dz$$<p>Ligação às esféricas: $\\rho=r\\sin\\varphi$ e $z=r\\cos\\varphi$.</p>', 'nota');
          M.legenda([[cor.v, '$\\rho$ e $d\\rho$'], [cor.u, '$\\theta$ e $\\rho\\,d\\theta$'], [cor.n, '$z$ e $dz$']]);
        },
      },
      {
        id: 'solidos', nome: 'Sólidos das aulas',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.5, alvo: [0, 0, 0.45], yaw: 0.6, pitch: 0.42 });
          M.escolha('s', { rot: 'Sólido', opcoes: Object.keys(SO).map((k) => [k, SO[k].nome]), valor: 'coneaula', aoMudar: (k) => { const t = SO[k].th; M.S.t = ((t[0] + t[1]) / 2) / D; } });
          M.caixa('corte', { rot: 'Corte por um semiplano $\\theta$ constante', valor: true });
          M.barra('t', { rot: '$\\theta$', cor: cor.u, min: 0, max: 360, passo: 1, valor: 135, fmt: (x) => Math.round(x) + '°', nome: 'ângulo do corte', circular: true, dur: 7000 });
          M.cena(V, (C, S) => {
            const so = SO[S.s];
            C.eixos({ x: [-1.4, 1.4], y: [-1.4, 1.4], z: [S.s === 'bola' ? -1.3 : -0.2, 1.7] });
            so.desenhar(C, cor);
            if (S.s === 'coneaula' || S.s === 'gelado') C.curva([[-1.3, -1.3, 0], [1.3, 1.3, 0]], { cor: cor.sup2, larg: 1.4, trac: [6, 4] });
            if (S.corte) {
              const t = S.t * D, dentro = ((t - so.th[0]) % (2 * PI) + 2 * PI) % (2 * PI) <= so.th[1] - so.th[0] + 1e-9;
              const q = so.sec.map(([r, z]) => cyl(r, t, z));
              C.linha([0, 0, 0], cyl(1.35, t, 0), { cor: cor.u, larg: 1.4, trac: [4, 3] });
              if (dentro) { C.poli(q, { cor: cor.u, alfa: 0.75, plano: 1 }); C.curva(q.concat([q[0]]), { cor: cor.u, larg: 2.4 }); }
              else C.texto(cyl(0.9, t, 0.3), 'fora do sólido', { cor: cor.u });
            }
          });
          M.leituras('Volume', (S) => {
            const s = SO[S.s];
            return ['<b>Limites.</b> ' + s.coord + '.', '<b>Corte $\\theta$ constante:</b> ' + s.stx + '.',['$\\mathrm{Vol}_3$', '$' + s.int + '$'], ['valor', '$' + s.val + '$', 'forte'], ['verificação numérica (grelha $110^3$)', '$\\approx' + TX.n(numerico(S.s), 3) + '$']];
          });
          M.texto('<b class="t">Que coordenadas usar</b><p>Cilíndricas quando a região se descreve bem com a distância ao eixo $z$ (cilindros, cones como $z=\\rho$, paraboloides). Esféricas quando aparece $x^2+y^2+z^2$ (esferas) ou um cone a partir da origem ($\\varphi$ constante).</p><p>Truque: corta o sólido por um semiplano $\\theta$ constante (laranja). Se o corte é o mesmo para todos os $\\theta$ do intervalo, os limites de $\\rho$ e $z$ (ou de $r$ e $\\varphi$) não dependem de $\\theta$. Condições como $y>x$ viram limites em $\\theta$: $\\tfrac\\pi4<\\theta<\\tfrac{5\\pi}4$.</p>', 'nota');
          M.legenda([[cor.sup, 'fronteira do sólido'], [cor.u, 'corte $\\theta$ constante'], [cor.sup2, 'plano $y=x$']]);
        },
      },
    ],
    explicar: [
      { modelo: 'cilindricas', titulo: 'Cilíndricas: polares + z', estado: { rho: 0.7, th: 120, z: 0.4, box: false }, texto: '<p>$x=\\rho\\cos\\theta$, $y=\\rho\\sin\\theta$, $z=z$. $\\rho=\\sqrt{x^2+y^2}$ é a distância ao eixo $Oz$.</p><p>Carrega em ▶ ao lado de cada barra: $\\rho$ anda num raio, $\\theta$ dá a volta, $z$ sobe.</p>' },
      { modelo: 'cilindricas', titulo: 'A caixinha: ρ dρ dθ dz', estado: { rho: 0.7, th: 120, z: 0.4, box: true }, texto: '<p>Lados $d\\rho$, $\\rho\\,d\\theta$ e $dz$: o volume é $\\rho\\,d\\rho\\,d\\theta\\,dz$. O fator $\\rho$ é $|\\det Dg|$, como nas polares.</p>' },
      { modelo: 'solidos', titulo: 'Cilindro de raio r e altura h', estado: { s: 'cil', corte: true, t: 60 }, texto: '<p>$\\{x^2+y^2<r^2,\\ 0<z<h\\}$ $\\Rightarrow$ $0<\\rho<r$, $0<\\theta<2\\pi$, $0<z<h$. Qualquer corte $\\theta$ constante é o mesmo retângulo.</p>$$\\int_0^{2\\pi}\\!\\int_0^r\\!\\int_0^h\\rho\\,dz\\,d\\rho\\,d\\theta=\\pi r^2h$$' },
      { modelo: 'solidos', titulo: 'O cone com y > x', estado: { s: 'coneaula', corte: true, t: 135 }, texto: '<p>$\\sqrt{x^2+y^2}<z<1$ é $\\rho<z<1$: o corte é o triângulo laranja. $y>x$ é o semiplano acima da reta $y=x$: $\\tfrac\\pi4<\\theta<\\tfrac{5\\pi}4$. Roda $\\theta$ para ver o corte desaparecer fora deste intervalo.</p>$$\\int_{\\pi/4}^{5\\pi/4}\\!\\int_0^1\\!\\int_\\rho^1\\rho\\,dz\\,d\\rho\\,d\\theta=\\pi\\!\\int_0^1\\!\\rho(1-\\rho)\\,d\\rho=\\tfrac\\pi6$$' },
      { modelo: 'esfericas', titulo: 'Esféricas', estado: { r: 0.8, ph: 50, th: 120, box: false }, texto: '<p>$\\rho=r\\sin\\varphi$ e $z=r\\cos\\varphi$. Juntando às polares: $x=r\\sin\\varphi\\cos\\theta$, $y=r\\sin\\varphi\\sin\\theta$, $z=r\\cos\\varphi$.</p><p>$\\varphi$ mede-se a partir do eixo $z$ positivo, de $0$ a $\\pi$.</p>' },
      { modelo: 'esfericas', titulo: 'A caixinha: r² sen φ', estado: { r: 0.8, ph: 50, th: 120, box: true }, texto: '<p>Lados $dr$, $r\\,d\\varphi$ e $r\\sin\\varphi\\,d\\theta$: volume $r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta$. $|\\det Dg(r;\\theta;\\varphi)|=r^2\\sin\\varphi$.</p><p>Perto dos polos ($\\varphi\\approx0$) a caixinha achata: $\\sin\\varphi\\to0$.</p>' },
      { modelo: 'solidos', titulo: 'O gelado', estado: { s: 'gelado', corte: true, t: 135 }, texto: '<p>$\\sqrt{x^2+y^2}<z<\\sqrt{2-x^2-y^2}$ com $y>x$. O cone $z=\\rho$ é $\\varphi=\\tfrac\\pi4$ e a esfera $x^2+y^2+z^2=2$ é $r=\\sqrt2$: o corte é um setor circular.</p>$$\\int_{\\pi/4}^{5\\pi/4}\\!\\int_0^{\\pi/4}\\!\\int_0^{\\sqrt2}r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta=\\tfrac{2\\pi(\\sqrt2-1)}{3}$$' },
      { modelo: 'solidos', titulo: 'O mesmo sólido, duas maneiras', estado: { s: 'cone', corte: true, t: 30 }, texto: '<p>$\\rho<z<1$. Em cilíndricas: $2\\pi\\int_0^1\\rho(1-\\rho)\\,d\\rho=\\tfrac\\pi3$.</p><p>Em esféricas, o plano $z=1$ é $r\\cos\\varphi=1$, ou $r=1/\\cos\\varphi$: o limite fica feio. Escolher as coordenadas certas poupa contas.</p>' },
    ],
    testa: [
      { modelo: 'esfericas', estado: { box: true }, p: 'Em esféricas, quanto vale $|\\det Dg(r;\\theta;\\varphi)|$?', op: ['$r$', '$r^2\\sin\\varphi$', '$r^2\\cos\\varphi$', '$r\\sin\\varphi$'], certa: 1, porque: 'É o volume da caixinha: $dr\\cdot r\\,d\\varphi\\cdot r\\sin\\varphi\\,d\\theta$.' },
      { modelo: 'solidos', estado: { s: 'coneaula', corte: true, t: 135 }, p: 'Volume de $\\{\\sqrt{x^2+y^2}<z<1,\\ y>x\\}$:', op: ['$\\tfrac\\pi3$', '$\\tfrac\\pi6$', '$\\tfrac\\pi2$', '$\\tfrac{2\\pi}3$'], certa: 1, porque: 'Metade do cone $\\rho<z<1$, que tem volume $\\tfrac\\pi3$.' },
      { modelo: 'solidos', estado: { s: 'coneaula', corte: true, t: 135 }, p: 'A condição $y>x$ em coordenadas cilíndricas é:', op: ['$0<\\theta<\\pi$', '$\\tfrac\\pi4<\\theta<\\tfrac{5\\pi}4$', '$-\\tfrac\\pi4<\\theta<\\tfrac{3\\pi}4$', '$\\rho>z$'], certa: 1, porque: '$\\sin\\theta>\\cos\\theta$ acontece entre $\\tfrac\\pi4$ e $\\tfrac{5\\pi}4$.' },
      { modelo: 'solidos', estado: { s: 'gelado', corte: true, t: 135 }, p: 'No gelado, o cone $z=\\sqrt{x^2+y^2}$ em esféricas é:', op: ['$r=1$', '$\\varphi=\\tfrac\\pi4$', '$\\theta=\\tfrac\\pi4$', '$\\varphi=\\tfrac\\pi2$'], certa: 1, porque: '$z=\\rho\\iff r\\cos\\varphi=r\\sin\\varphi\\iff\\tan\\varphi=1$.' },
      { modelo: 'solidos', estado: { s: 'bola', corte: true, t: 30 }, p: 'O corte da bola unitária por um semiplano $\\theta$ constante é:', op: ['um disco', 'um semidisco', 'um quarto de disco', 'um segmento'], certa: 1, porque: 'Com $\\theta$ fixo, $r\\in[0,1]$ e $\\varphi\\in[0,\\pi]$: meio disco, do polo norte ao polo sul.' },
    ],
  });
})();
