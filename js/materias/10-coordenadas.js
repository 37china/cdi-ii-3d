/* 10. Coordenadas esféricas e cilíndricas (modelo anterior, adaptado) e os sólidos das aulas. */
(function () {
  const PI = Math.PI, D = PI / 180, R2 = Math.SQRT2;
  const sph = (r, p, t) => [r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)];
  const cyl = (rho, t, z) => [rho * Math.cos(t), rho * Math.sin(t), z];
  const arco = (f, a, b, n = 40) => Array.from({ length: n + 1 }, (_, i) => f(a + ((b - a) * i) / n));

  /* sólidos das teóricas */
  const SO = {
    cil: {
      nome: 'Cilindro ρ &lt; r, 0 &lt; z &lt; h', dentro: (x, y, z) => x * x + y * y < 1 && z > 0 && z < 1.2, caixa: [-1, 1, -1, 1, 0, 1.2],
      int: 'Vol₃ = ∫₀^2π ∫₀^r ∫₀^h ρ dz dρ dθ = ∫₀^2π h r²/2 dθ = πr²h', val: 'π · 1² · 1.2 = 1.2π', num: 1.2 * PI, coord: 'cilíndricas: 0 &lt; θ &lt; 2π, 0 &lt; ρ &lt; r, 0 &lt; z &lt; h (aqui r = 1, h = 1.2)',
      desenhar(C, cor) {
        C.sup((t, z) => cyl(1, t, z), 0, 2 * PI, 0, 1.2, 40, 6, { cor: cor.sup, corTras: cor.sup, alfa: 0.35 });
        C.sup((r, t) => cyl(r, t, 1.2), 0, 1, 0, 2 * PI, 4, 40, { cor: cor.sup, alfa: 0.4 });
        C.sup((r, t) => cyl(r, t, 0), 0, 1, 0, 2 * PI, 4, 40, { cor: cor.sup, alfa: 0.2 });
      },
    },
    coneaula: {
      nome: '√(x² + y²) &lt; z &lt; 1, y &gt; x', dentro: (x, y, z) => Math.hypot(x, y) < z && z < 1 && y > x, caixa: [-1, 1, -1, 1, 0, 1],
      int: 'Vol₃ = ∫_π/4^(5π/4) ∫₀¹ ∫_ρ¹ ρ dz dρ dθ = π ∫₀¹ ρ(1 − ρ) dρ = π(1/2 − 1/3)', val: 'π/6 ≈ 0.524', num: PI / 6, coord: 'cilíndricas: o cone é z = ρ; y &gt; x ⇔ π/4 &lt; θ &lt; 5π/4; 0 &lt; ρ &lt; 1; ρ &lt; z &lt; 1',
      desenhar(C, cor) {
        C.sup((r, t) => cyl(r, t, r), 0, 1, PI / 4, (5 * PI) / 4, 8, 36, { cor: cor.sup, corTras: cor.sup, alfa: 0.45 });
        C.sup((r, t) => cyl(r, t, 1), 0, 1, PI / 4, (5 * PI) / 4, 4, 36, { cor: cor.sup, alfa: 0.35 });
        const a = cyl(1, PI / 4, 1), b = cyl(1, (5 * PI) / 4, 1);
        C.poli([[0, 0, 0], a, b], { cor: cor.n, alfa: 0.3, plano: 1 });
      },
    },
    cone: {
      nome: '√(x² + y²) &lt; z &lt; 1', dentro: (x, y, z) => Math.hypot(x, y) < z && z < 1, caixa: [-1, 1, -1, 1, 0, 1],
      int: 'Vol₃ = ∫₀^2π ∫₀¹ ∫_ρ¹ ρ dz dρ dθ = 2π ∫₀¹ ρ(1 − ρ) dρ', val: 'π/3 ≈ 1.047', num: PI / 3, coord: 'cilíndricas: 0 &lt; θ &lt; 2π, 0 &lt; ρ &lt; 1, ρ &lt; z &lt; 1. Em esféricas também dá, mas o limite r &lt; 1/cos φ torna-o mais difícil.',
      desenhar(C, cor) {
        C.sup((r, t) => cyl(r, t, r), 0, 1, 0, 2 * PI, 8, 48, { cor: cor.sup, corTras: cor.sup, alfa: 0.45 });
        C.sup((r, t) => cyl(r, t, 1), 0, 1, 0, 2 * PI, 4, 48, { cor: cor.sup, alfa: 0.35 });
      },
    },
    bola: {
      nome: 'Bola x² + y² + z² ≤ R²', dentro: (x, y, z) => x * x + y * y + z * z <= 1, caixa: [-1, 1, -1, 1, -1, 1],
      int: 'Vol₃ = ∫₀^2π ∫₀^π ∫₀^R r² sen φ dr dφ dθ = 2π · 2 · R³/3', val: '4πR³/3 (com R = 1, ≈ 4.189)', num: (4 * PI) / 3, coord: 'esféricas: 0 &lt; r &lt; R, 0 &lt; φ &lt; π, 0 &lt; θ &lt; 2π, com |det| = r² sen φ',
      desenhar(C, cor) { C.sup((t, p) => sph(1, p, t), 0, 2 * PI, 0, PI, 40, 20, { cor: cor.sup, corTras: cor.sup, alfa: 0.4 }); },
    },
    gelado: {
      nome: '√(x² + y²) &lt; z &lt; √(2 − x² − y²), y &gt; x', dentro: (x, y, z) => Math.hypot(x, y) < z && x * x + y * y + z * z < 2 && y > x, caixa: [-1, 1, -1, 1, 0, R2],
      int: 'Vol₃ = ∫_π/4^(5π/4) ∫₀^π/4 ∫₀^√2 r² sen φ dr dφ dθ = π · (1 − √2/2) · 2√2/3', val: '2π(√2 − 1)/3 ≈ 0.867', num: (2 * PI * (R2 - 1)) / 3, coord: 'esféricas: o cone z = ρ é φ = π/4 e a esfera é r = √2; y &gt; x ⇔ π/4 &lt; θ &lt; 5π/4',
      desenhar(C, cor) {
        C.sup((r, t) => cyl(r, t, r), 0, 1, PI / 4, (5 * PI) / 4, 8, 36, { cor: cor.sup, corTras: cor.sup, alfa: 0.45 });
        C.sup((p, t) => sph(R2, p, t), 0, PI / 4, PI / 4, (5 * PI) / 4, 8, 36, { cor: cor.sup, corTras: cor.sup, alfa: 0.4 });
        const s = (u) => [u / R2, u / R2];
        const pts = [[0, 0, 0]].concat(arco((u) => [...s(u), Math.sqrt(2 - u * u)], 1, -1, 30));
        C.poli(pts, { cor: cor.n, alfa: 0.3, plano: 1 });
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
    resumo: 'O ponto P em (ρ; θ; z) e (r; θ; φ), a caixinha de volume e os sólidos das teóricas.',
    modelos: [
      {
        id: 'esfericas', nome: 'Esféricas',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.45, yaw: 0.85, pitch: 0.35 });
          M.barra('r', { rot: 'r', cor: cor.v, min: 0, max: 1, valor: 0.8, nome: 'r', dur: 3500 });
          M.barra('ph', { rot: 'φ', cor: cor.n, min: 0, max: 180, passo: 1, valor: 50, fmt: (x) => Math.round(x) + '°', nome: 'φ', dur: 5000 });
          M.barra('th', { rot: 'θ', cor: cor.u, min: 0, max: 360, passo: 1, valor: 120, fmt: (x) => Math.round(x) + '°', nome: 'θ', circular: true, dur: 5000 });
          M.caixa('box', { rot: 'Caixinha de volume', valor: true });
          M.cena(V, (C, S) => {
            const mut = cor.m, r = S.r, ph = S.ph * D, th = S.th * D;
            for (let p = 30; p < 180; p += 30) C.curva(arco((t) => sph(1, p * D, t), 0, 2 * PI, 60), { cor: mut, larg: 0.6, alfa: 0.35 });
            for (let t = 0; t < 180; t += 30) C.curva(arco((p) => sph(1, p, t * D), 0, 2 * PI, 60), { cor: mut, larg: 0.6, alfa: 0.35 });
            C.eixos({ x: [-1.3, 1.3], y: [-1.3, 1.3], z: [-1.2, 1.3] });
            const P = sph(r, ph, th), Pp = [P[0], P[1], 0], A = [0, 0, P[2]];
            C.linha([0, 0, 0], Pp, { cor: mut, larg: 1, trac: [4, 3] });
            C.linha(P, Pp, { cor: mut, larg: 1, trac: [4, 3] });
            C.curva(arco((p) => sph(r, p, th), 0, PI, 60), { cor: cor.n, larg: 1.4, alfa: 0.8 });
            C.curva(arco((t) => sph(r, ph, t), 0, 2 * PI, 90), { cor: cor.u, larg: 1.2, trac: [3, 3], alfa: 0.9 });
            if (r > 0.05) { C.linha(A, P, { cor: cor.u, larg: 1.6, trac: [5, 3] }); C.texto(CM.mul(CM.add(A, P), 0.5), 'ρ = r sen φ', { cor: cor.u, tam: 12, dy: -12 }); }
            const ra = Math.max(0.35 * r, 0.1);
            C.curva(arco((p) => sph(ra, p, th), 0, ph, 30), { cor: cor.n, larg: 2 });
            C.texto(sph(ra + 0.13, ph / 2, th), 'φ', { cor: cor.n });
            const rho = r * Math.sin(ph);
            if (rho > 0.02) { C.linha(A, sph(r, ph, 0), { cor: cor.u, larg: 1.2 }); C.curva(arco((t) => sph(r, ph, t), 0, th, 60), { cor: cor.u, larg: 2.6 }); C.texto([0.6 * rho * Math.cos(th / 2), 0.6 * rho * Math.sin(th / 2), A[2]], 'θ', { cor: cor.u, dy: -8 }); }
            C.linha([0, 0, 0], P, { cor: cor.v, larg: 2.5 });
            if (r > 0.1) C.texto(sph(r * 0.5, ph, th), 'r', { cor: cor.v, dx: -12, dy: -6, tam: 15 });
            if (S.box) {
              const dR = 0.12, dP = 14 * D, dT = 24 * D, p2 = Math.min(ph + dP, PI), t2 = th + dT, r2 = r + dR;
              [ph, p2].forEach((j) => [th, t2].forEach((k) => C.linha(sph(r, j, k), sph(r2, j, k), { cor: cor.v, larg: 2.5, n: 2 })));
              [r, r2].forEach((i) => [th, t2].forEach((k) => C.curva(arco((p) => sph(i, p, k), ph, p2, 10), { cor: cor.n, larg: 2.5 })));
              [r, r2].forEach((i) => [ph, p2].forEach((j) => C.curva(arco((t) => sph(i, j, t), th, t2, 10), { cor: cor.u, larg: 2.5 })));
            }
            C.ponto(P, { cor: cor.v, rot: 'P' });
          });
          M.leituras('Coordenadas de P', (S) => {
            const r = S.r, ph = S.ph * D, th = S.th * D, P = sph(r, ph, th), rho = r * Math.sin(ph);
            return [['ρ = r sen φ (distância ao eixo z)', CM.fmt(rho)], ['x = r sen φ cos θ', CM.fmt(P[0])], ['y = r sen φ sen θ', CM.fmt(P[1])], ['z = r cos φ', CM.fmt(P[2])], '—', ['dr, para fora', '0.120'], ['r · dφ, no meridiano', CM.fmt(r * 14 * D, 3)], ['r sen φ · dθ, no paralelo', CM.fmt(rho * 24 * D, 3)], ['|det Dg| = r² sen φ', CM.fmt(r * r * Math.sin(ph), 3), 'forte']];
          });
          M.texto('<p><b class="cor2">r</b> ∈ [0, R]: distância à origem. Sozinho, P anda num raio.</p><p><b class="cor3">φ</b> ∈ [0, π]: ângulo a partir do eixo z positivo (latitude). Sozinho, P desce um meridiano.</p><p><b class="cor1">θ</b> ∈ [0, 2π]: ângulo à volta do eixo z, o das polares (longitude). Sozinho, P dá a volta num paralelo.</p><p>Caixinha: dr · r dφ · r sen φ dθ = r² sen φ dr dφ dθ.</p>', 'nota');
          M.legenda([[cor.v, 'r e dr'], [cor.n, 'φ e r dφ'], [cor.u, 'θ, ρ e r sen φ dθ']]);
        },
      },
      {
        id: 'cilindricas', nome: 'Cilíndricas',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.45, yaw: 0.85, pitch: 0.35 });
          M.barra('rho', { rot: 'ρ', cor: cor.v, min: 0, max: 1, valor: 0.7, nome: 'ρ', dur: 3500 });
          M.barra('th', { rot: 'θ', cor: cor.u, min: 0, max: 360, passo: 1, valor: 120, fmt: (x) => Math.round(x) + '°', nome: 'θ', circular: true, dur: 5000 });
          M.barra('z', { rot: 'z', cor: cor.n, min: -1, max: 1, valor: 0.4, nome: 'z', dur: 3500 });
          M.caixa('box', { rot: 'Caixinha de volume', valor: true });
          M.cena(V, (C, S) => {
            const mut = cor.m, rho = S.rho, th = S.th * D, z = S.z;
            for (const zz of [-1, -0.5, 0, 0.5, 1]) C.curva(arco((t) => cyl(1, t, zz), 0, 2 * PI, 72), { cor: mut, larg: 0.6, alfa: 0.35 });
            for (let t = 0; t < 360; t += 30) C.linha(cyl(1, t * D, -1), cyl(1, t * D, 1), { cor: mut, larg: 0.6, alfa: 0.35, n: 4 });
            C.eixos({ x: [-1.3, 1.3], y: [-1.3, 1.3], z: [-1.2, 1.3] });
            const P = cyl(rho, th, z), Pp = [P[0], P[1], 0], A = [0, 0, z];
            C.linha([0, 0, 0], Pp, { cor: mut, larg: 1, trac: [4, 3] });
            C.curva(arco((t) => cyl(rho, t, z), 0, 2 * PI, 90), { cor: cor.u, larg: 1.2, trac: [3, 3], alfa: 0.9 });
            C.linha(Pp, P, { cor: cor.n, larg: 2.4 });
            C.texto([Pp[0], Pp[1], z / 2], 'z', { cor: cor.n, dx: 12 });
            if (rho > 0.02) { C.linha(A, cyl(rho, 0, z), { cor: cor.u, larg: 1.2 }); C.curva(arco((t) => cyl(rho, t, z), 0, th, 60), { cor: cor.u, larg: 2.6 }); C.texto([0.6 * rho * Math.cos(th / 2), 0.6 * rho * Math.sin(th / 2), z], 'θ', { cor: cor.u, dy: -8 }); }
            C.linha(A, P, { cor: cor.v, larg: 2.5 });
            if (rho > 0.1) C.texto(CM.mul(CM.add(A, P), 0.5), 'ρ', { cor: cor.v, dy: -12, tam: 15 });
            if (S.box) {
              const dR = 0.12, dT = 24 * D, dZ = 0.16, r2 = rho + dR, t2 = th + dT, z2 = z + dZ;
              [th, t2].forEach((j) => [z, z2].forEach((k) => C.linha(cyl(rho, j, k), cyl(r2, j, k), { cor: cor.v, larg: 2.5, n: 2 })));
              [rho, r2].forEach((i) => [z, z2].forEach((k) => C.curva(arco((t) => cyl(i, t, k), th, t2, 10), { cor: cor.u, larg: 2.5 })));
              [rho, r2].forEach((i) => [th, t2].forEach((j) => C.linha(cyl(i, j, z), cyl(i, j, z2), { cor: cor.n, larg: 2.5, n: 2 })));
            }
            C.ponto(P, { cor: cor.v, rot: 'P' });
          });
          M.leituras('Coordenadas de P', (S) => {
            const P = cyl(S.rho, S.th * D, S.z);
            return [['x = ρ cos θ', CM.fmt(P[0])], ['y = ρ sen θ', CM.fmt(P[1])], ['z = z', CM.fmt(S.z)], ['ρ = √(x² + y²), θ = arctan(y/x)', CM.fmt(S.rho) + ', ' + Math.round(S.th) + '°'], '—', ['dρ', '0.120'], ['ρ · dθ', CM.fmt(S.rho * 24 * D, 3)], ['dz', '0.160'], ['|det Dg| = ρ', CM.fmt(S.rho, 3), 'forte']];
          });
          M.texto('<p><b class="cor2">ρ</b> ∈ [0, R]: distância ao eixo z. Sozinho, P anda num raio horizontal.</p><p><b class="cor1">θ</b> ∈ [0, 2π]: ângulo à volta do eixo z (o das polares).</p><p><b class="cor3">z</b>: a altura, igual à das cartesianas.</p><p>Caixinha: dρ · ρ dθ · dz = ρ dρ dθ dz. Ligação às esféricas: ρ = r sen φ e z = r cos φ.</p>', 'nota');
          M.legenda([[cor.v, 'ρ e dρ'], [cor.u, 'θ e ρ dθ'], [cor.n, 'z e dz']]);
        },
      },
      {
        id: 'solidos', nome: 'Sólidos das aulas',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.5, alvo: [0, 0, 0.45], yaw: 0.6, pitch: 0.42 });
          M.escolha('s', { rot: 'Sólido', opcoes: Object.keys(SO).map((k) => [k, SO[k].nome]), valor: 'coneaula', mono: true });
          M.cena(V, (C, S) => {
            C.eixos({ x: [-1.4, 1.4], y: [-1.4, 1.4], z: [S.s === 'bola' ? -1.3 : -0.2, 1.7] });
            SO[S.s].desenhar(C, cor);
            if (S.s === 'coneaula' || S.s === 'gelado') C.curva([[-1.3, -1.3, 0], [1.3, 1.3, 0]], { cor: cor.n, larg: 1.4, trac: [6, 4] });
          });
          M.leituras('Volume', (S) => {
            const s = SO[S.s];
            return [['Limites', s.coord], ['Integral', s.int], ['Valor', s.val, 'forte'], ['Verificação numérica (grelha 110³)', '≈ ' + CM.fmt(numerico(S.s), 3)]];
          });
          M.texto('<b class="t">Que coordenadas usar</b><p>Cilíndricas quando a região se descreve bem com a distância ao eixo z (cilindros, cones como z = ρ, paraboloides). Esféricas quando aparece x² + y² + z² (esferas) ou um cone a partir da origem (φ constante).</p><p>Condições como y &gt; x viram limites em θ: o semiplano acima da reta y = x é π/4 &lt; θ &lt; 5π/4.</p>', 'nota');
          M.legenda([[cor.sup, 'fronteira do sólido'], [cor.n, 'corte pelo plano y = x']]);
        },
      },
    ],
    explicar: [
      { modelo: 'cilindricas', titulo: 'Cilíndricas: polares + z', estado: { rho: 0.7, th: 120, z: 0.4, box: false }, texto: '<p>x = ρ cos θ, y = ρ sen θ, z = z. ρ = √(x² + y²) é a distância ao eixo Oz.</p><p>Carrega em ▶ ao lado de cada barra: ρ anda num raio, θ dá a volta, z sobe.</p>' },
      { modelo: 'cilindricas', titulo: 'A caixinha: ρ dρ dθ dz', estado: { rho: 0.7, th: 120, z: 0.4, box: true }, texto: '<p>Lados dρ, ρ dθ e dz: o volume é ρ dρ dθ dz. O fator ρ é |det Dg|, como nas polares.</p>' },
      { modelo: 'solidos', titulo: 'Cilindro de raio r e altura h', estado: { s: 'cil' }, texto: '<p>{x² + y² &lt; r², 0 &lt; z &lt; h} ⇒ 0 &lt; ρ &lt; r, 0 &lt; θ &lt; 2π, 0 &lt; z &lt; h.</p><p class="f">∫₀^2π ∫₀^r ∫₀^h ρ dz dρ dθ = πr²h</p>' },
      { modelo: 'solidos', titulo: 'O cone com y &gt; x', estado: { s: 'coneaula' }, texto: '<p>√(x² + y²) &lt; z &lt; 1 é ρ &lt; z &lt; 1. y &gt; x é o semiplano acima da reta y = x: π/4 &lt; θ &lt; 5π/4.</p><p class="f">∫_π/4^(5π/4) ∫₀¹ ∫_ρ¹ ρ dz dρ dθ = π ∫₀¹ ρ(1 − ρ) dρ = π/6</p>' },
      { modelo: 'esfericas', titulo: 'Esféricas', estado: { r: 0.8, ph: 50, th: 120, box: false }, texto: '<p>ρ = r sen φ e z = r cos φ. Juntando às polares: x = r sen φ cos θ, y = r sen φ sen θ, z = r cos φ.</p><p>φ mede-se a partir do eixo z positivo, de 0 a π.</p>' },
      { modelo: 'esfericas', titulo: 'A caixinha: r² sen φ', estado: { r: 0.8, ph: 50, th: 120, box: true }, texto: '<p>Lados dr, r dφ e r sen φ dθ: volume r² sen φ dr dφ dθ. |det Dg(r; θ; φ)| = r² sen φ.</p><p>Perto dos polos (φ ≈ 0) a caixinha achata: sen φ → 0.</p>' },
      { modelo: 'solidos', titulo: 'O gelado', estado: { s: 'gelado' }, texto: '<p>√(x² + y²) &lt; z &lt; √(2 − x² − y²) com y &gt; x. O cone z = ρ é φ = π/4 e a esfera x² + y² + z² = 2 é r = √2.</p><p class="f">∫_π/4^(5π/4) ∫₀^π/4 ∫₀^√2 r² sen φ dr dφ dθ = 2π(√2 − 1)/3</p>' },
      { modelo: 'solidos', titulo: 'O mesmo sólido, duas maneiras', estado: { s: 'cone' }, texto: '<p>ρ &lt; z &lt; 1. Em cilíndricas: 2π ∫₀¹ ρ(1 − ρ) dρ = π/3.</p><p>Em esféricas, o plano z = 1 é r cos φ = 1, ou r = 1/cos φ: o limite fica feio. Escolher as coordenadas certas poupa contas.</p>' },
    ],
    testa: [
      { modelo: 'esfericas', estado: { box: true }, p: 'Em esféricas, quanto vale |det Dg(r; θ; φ)|?', op: ['r', 'r² sen φ', 'r² cos φ', 'r sen φ'], certa: 1, porque: 'É o volume da caixinha: dr · r dφ · r sen φ dθ.' },
      { modelo: 'solidos', estado: { s: 'coneaula' }, p: 'Volume de {√(x² + y²) &lt; z &lt; 1, y &gt; x}:', op: ['π/3', 'π/6', 'π/2', '2π/3'], certa: 1, porque: 'Metade do cone ρ &lt; z &lt; 1, que tem volume π/3.' },
      { modelo: 'solidos', estado: { s: 'coneaula' }, p: 'A condição y &gt; x em coordenadas cilíndricas é:', op: ['0 &lt; θ &lt; π', 'π/4 &lt; θ &lt; 5π/4', '−π/4 &lt; θ &lt; 3π/4', 'ρ &gt; z'], certa: 1, porque: 'sen θ &gt; cos θ acontece entre π/4 e 5π/4.' },
      { modelo: 'solidos', estado: { s: 'gelado' }, p: 'No gelado, o cone z = √(x² + y²) em esféricas é:', op: ['r = 1', 'φ = π/4', 'θ = π/4', 'φ = π/2'], certa: 1, porque: 'z = ρ ⇔ r cos φ = r sen φ ⇔ tan φ = 1.' },
    ],
  });
})();
