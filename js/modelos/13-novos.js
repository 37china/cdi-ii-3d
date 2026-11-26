/* Modelos novos (v3): tudo com funções escritas pelo aluno.
   desenhar · vetorial · limite · conversao · tvi · taylor · weierstrass */
(function () {
  const PI = Math.PI;
  const fin = (v) => typeof v === 'number' && isFinite(v);
  const dimDe = (F) => (F.usa.includes('z') ? 3 : F.usa.includes('y') ? 2 : 1);
  const mistura = (a, b, t, al = 255) => { const p = hexRgb(a), q = hexRgb(b); return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t, al]; };
  const pct = (vs) => {
    if (!vs.length) return [-1, 1];
    vs.sort((a, b) => a - b);
    let lo = vs[Math.floor(vs.length * 0.02)], hi = vs[Math.ceil(vs.length * 0.98) - 1];
    if (hi - lo < 0.4) { const m = (hi + lo) / 2; lo = m - 0.2; hi = m + 0.2; }
    const d = (hi - lo) * 0.08;
    return [lo - d, hi + d];
  };
  /* mapa de cores de f (azul = baixo, laranja = alto) e linhas de nível */
  function pintar(G, f, faixa, cor, alfa = 85) {
    const [lo, hi] = faixa;
    G.mapa((x, y) => { const v = f(x, y); if (!fin(v)) return null; return mistura(cor.b, cor.u, CM.clamp((v - lo) / (hi - lo || 1), 0, 1), alfa); }, 3);
  }
  function niveis(G, f, faixa, cor, n = 9) { for (let i = 1; i < n; i++) G.nivel(f, faixa[0] + ((faixa[1] - faixa[0]) * i) / n, { cor: cor.m, larg: 1, alfa: 0.5 }); }
  const N = (x, d = 3) => (fin(x) ? TX.n(x, d) : '\\text{—}');
  const matTex = (m, d = 3) => '\\begin{bmatrix}' + m.map((r) => r.map((x) => N(x, d)).join('&')).join('\\\\') + '\\end{bmatrix}';
  const vetTex = (v, d = 3) => '(' + v.map((x) => N(x, d)).join(';\\,') + ')';
  /* gradiente, divergência e rotacional numéricos de um campo com 3 componentes */
  const parcial = (F, p, i, j, h = 1e-5) => { const a = p.slice(), b = p.slice(); a[j] += h; b[j] -= h; return (F(...a)[i] - F(...b)[i]) / (2 * h); };

  /* ======================= desenhar ======================= */
  const EXD = [
    ['$x^3-x$ (em $\\mathbb R$)', 'x^3-x'], ['$\\operatorname{sen}x$', 'sen x'],
    ['$x^2+y^2$', 'x^2+y^2'], ['$x^2-y^2$', 'x^2-y^2'], ['$\\operatorname{sen}x\\cos y$', 'sen(x)cos(y)'], ['$xye^{-x^2-y^2}$', 'xy e^(-x^2-y^2)'],
    ['$x^2+y^2+z^2$ (em $\\mathbb R^3$)', 'x^2+y^2+z^2'], ['$x^2+y^2-z^2$', 'x^2+y^2-z^2'], ['$z-x^2-y^2$', 'z-x^2-y^2'],
  ];
  function superficieNivel(f, c, L, s) {
    const z = [], x = [], n = 16, m = 44;
    for (let k = 0; k <= n; k++) {
      const z0 = -L + (2 * L * k) / n;
      CM.contorno((a, b) => f(a, b, z0), -L, L, -L, L, m, m, c).forEach(([p, q]) => z.push([[s * p[0], s * p[1], s * z0], [s * q[0], s * q[1], s * z0]]));
      const x0 = z0;
      CM.contorno((a, b) => f(x0, a, b), -L, L, -L, L, m, m, c).forEach(([p, q]) => x.push([[s * x0, s * p[0], s * p[1]], [s * x0, s * q[0], s * q[1]]]));
    }
    return { z, x };
  }
  const desenhar = {
    id: 'desenhar', nome: 'Desenha a tua função',
    montar(M) {
      const cor = M.cores();
      const P = M.plano({ janela: [-1.6, 1.6, -1.6, 1.6], nomeVista: 'Vista 2D', dica: 'Arrasta o fundo para mover · roda ou pinça para zoom' });
      const V = M.vista3d({ ext: 2.2, alvo: [0, 0, 0], yaw: -0.75, pitch: 0.55, nomeVista: 'Vista 3D' });
      let ck = null, cv = null;
      const info = (S) => {
        const k = JSON.stringify([S.f, S.L]);
        if (k === ck && cv) return cv;
        const F = M.F.f, n = dimDe(F), L = S.L, f = F.f;
        let faixa;
        if (n === 3) { const vs = []; for (let i = 0; i <= 10; i++) for (let j = 0; j <= 10; j++) for (let l = 0; l <= 10; l++) { const v = f(-L + 0.2 * L * i, -L + 0.2 * L * j, -L + 0.2 * L * l); if (fin(v)) vs.push(v); } faixa = pct(vs); }
        else faixa = CDI.faixaZ((x, y) => f(x, n === 2 ? y : 0, 0), -L, L, -L, L);
        P.opts.livre = n === 1;
        P.janela(n === 1 ? [-L, L, faixa[0], faixa[1]] : [-L, L, -L, L]);
        ck = k; cv = { F, n, f, faixa, L, s: 1.5 / L, kz: 1.3 / Math.max(Math.abs(faixa[0]), Math.abs(faixa[1]), 1e-6), k3: null };
        return cv;
      };
      const valorC = (S, I) => (I.n === 1 ? -I.L + 2 * I.L * S.c : I.faixa[0] + (I.faixa[1] - I.faixa[0]) * S.c);
      const zc = (S, I) => S.z0 * I.L;
      M.funcao('f', { rot: '$f=$', vars: ['x', 'y', 'z'], valor: 'x^2-y^2', ramos: true, exemplos: EXD, dica: 'Só com $x$: função real de variável real. Com $x$ e $y$: $f:\\mathbb R^2\\to\\mathbb R$. Com $x$, $y$ e $z$: $f:\\mathbb R^3\\to\\mathbb R$. A app percebe sozinha.' });
      M.barra('c', { rot: '$c$', cor: cor.n, min: 0, max: 1, valor: 0.55, nome: 'nível c', fmt: (t) => CM.fmtC(valorC({ c: t }, info(M.S)), 2) });
      M.barra('z0', { rot: 'corte $z=$', cor: cor.b, min: -1, max: 1, valor: 0, nome: 'altura do corte (só em ℝ³)', fmt: (t) => CM.fmtC(t * M.S.L, 2) });
      M.barra('L', { rot: 'janela', cor: cor.m, min: 0.5, max: 5, valor: 1.6, nome: 'meia largura da janela' });
      M.caixa('niv', { rot: 'Várias linhas de nível', valor: true });
      M.cena(P, (G, S) => {
        const I = info(S), f = I.f, c = valorC(S, I);
        if (I.n === 1) {
          G.eixos(['x', 'y']);
          G.funcao((x) => f(x, 0, 0), { cor: cor.u, larg: 2.6 });
          const y0 = f(c, 0, 0), d = (f(c + 1e-5, 0, 0) - f(c - 1e-5, 0, 0)) / 2e-5;
          if (fin(y0)) {
            if (fin(d)) G.param((t) => [c + t, y0 + d * t], -I.L, I.L, 2, { cor: cor.n, larg: 1.5, alfa: 0.8 });
            G.ponto([c, y0], { cor: cor.n, rot: '$(c;\\,f(c))$', arr: (x) => M.definir({ c: CM.clamp((x + I.L) / (2 * I.L), 0, 1) }) });
          }
          return;
        }
        const g = I.n === 2 ? (x, y) => f(x, y, 0) : (x, y) => f(x, y, zc(S, I));
        pintar(G, g, I.faixa, cor);
        if (S.niv) niveis(G, g, I.faixa, cor);
        G.nivel(g, c, { cor: cor.n, larg: 3 });
        G.eixos();
      });
      M.cena(V, (C, S) => {
        const I = info(S), f = I.f, s = I.s, kz = I.kz, L = I.L, c = valorC(S, I), [lo, hi] = I.faixa;
        const dentro = (z) => fin(z) && z >= lo && z <= hi;
        if (I.n === 1) {
          C.eixos({ x: [-1.7, 1.7], y: [-1.7, 1.7], z: [-1.5, 1.6], esc: [s, s, kz] });
          C.sup((u, v) => { const x = -L + 2 * L * u, z = f(x, 0, 0); return dentro(z) ? [s * x, s * (-L + 2 * L * v), kz * z] : null; }, 0, 1, 0, 1, 90, 6, { alfa: 0.45 });
          C.param((u) => { const x = -L + 2 * L * u, z = f(x, 0, 0); return dentro(z) ? [s * x, 0, kz * z] : [NaN, NaN, NaN]; }, 0, 1, 240, { cor: cor.u, larg: 3 });
          C.texto([0, -1.6, 1.55], 'em $\\mathbb R^2$, $z=f(x)$ é um cilindro', { cor: cor.m });
          return;
        }
        if (I.n === 2) {
          C.eixos({ x: [-1.7, 1.7], y: [-1.7, 1.7], z: [-1.5, 1.6], esc: [s, s, kz] });
          C.sup((u, v) => { const x = -L + 2 * L * u, y = -L + 2 * L * v, z = f(x, y, 0); return dentro(z) ? [s * x, s * y, kz * z] : null; }, 0, 1, 0, 1, 60, 60, { alfa: 0.82, mapa: 'altura' });
          const sg = CM.contorno((x, y) => f(x, y, 0), -L, L, -L, L, 90, 90, c);
          C.segs(sg.map(([a, b]) => [[s * a[0], s * a[1], kz * c], [s * b[0], s * b[1], kz * c]]), { cor: cor.n, larg: 2.8 });
          C.segs(sg.map(([a, b]) => [[s * a[0], s * a[1], 0], [s * b[0], s * b[1], 0]]), { cor: cor.n, larg: 1.4, alfa: 0.55 });
          C.plano([0, 0, kz * c], [0, 0, 1], 1.55, { cor: cor.n, alfa: 0.1 });
          return;
        }
        C.eixos({ x: [-1.7, 1.7], y: [-1.7, 1.7], z: [-1.7, 1.7], esc: [s, s, s] });
        const k3 = JSON.stringify([S.f, S.L, c]);
        if (I.k3 !== k3) { I.k3 = k3; I.sup3 = superficieNivel(f, c, L, s); }
        C.segs(I.sup3.z, { cor: cor.u, larg: 1.5, alfa: 0.85 });
        C.segs(I.sup3.x, { cor: cor.v, larg: 1.1, alfa: 0.6 });
        const z0 = zc(S, I);
        C.plano([0, 0, s * z0], [0, 0, 1], 1.55, { cor: cor.b, alfa: 0.14 });
        C.segs(CM.contorno((x, y) => f(x, y, z0), -L, L, -L, L, 70, 70, c).map(([a, b]) => [[s * a[0], s * a[1], s * z0], [s * b[0], s * b[1], s * z0]]), { cor: cor.n, larg: 3.2 });
      });
      M.leituras('A tua função', (S) => {
        const I = info(S), c = valorC(S, I), f = I.f;
        const r = [['tipo', ['$f:\\mathbb R\\to\\mathbb R$', '$f:\\mathbb R^2\\to\\mathbb R$', '$f:\\mathbb R^3\\to\\mathbb R$'][I.n - 1]]];
        if (I.n === 1) {
          const d = (f(c + 1e-5, 0, 0) - f(c - 1e-5, 0, 0)) / 2e-5;
          r.push(['$c$', '$' + N(c) + '$'], ['$f(c)$', '$' + N(f(c, 0, 0)) + '$'], ["$f'(c)$", '$' + N(d) + '$', 'forte']);
          r.push('O gráfico de $f:\\mathbb R\\to\\mathbb R$ é uma curva em $\\mathbb R^2$. A reta roxa é a tangente em $c$. Na vista 3D vês a mesma fórmula como função de $(x;y)$ que não depende de $y$: um cilindro.');
        } else if (I.n === 2) {
          r.push(['nível $c$', '$' + N(c) + '$', 'forte'], ['valores na janela (aprox.)', '$[' + N(I.faixa[0], 2) + ';\\,' + N(I.faixa[1], 2) + ']$']);
          r.push('O gráfico $\\{(x;y;f(x;y))\\}$ é uma superfície em $\\mathbb R^3$. O conjunto de nível $\\{f=c\\}$ (roxo) é o corte do gráfico pelo plano $z=c$, visto de cima.');
        } else {
          r.push(['nível $c$', '$' + N(c) + '$', 'forte'], ['corte', '$z=' + N(zc(S, I), 2) + '$']);
          r.push('O gráfico de $f:\\mathbb R^3\\to\\mathbb R$ vive em $\\mathbb R^4$ e não se desenha. Desenha-se o <b>conjunto de nível</b> $\\{f=c\\}$, que é uma superfície; a vista 2D mostra o corte $z$ constante.');
        }
        return r;
      });
      M.legenda([[cor.u, 'gráfico / valores altos'], [cor.b, 'valores baixos'], [cor.n, 'conjunto de nível $f=c$']]);
    },
  };

  /* ======================= campo vetorial ======================= */
  const EXV = [
    ['$(-y;\\,x)$', '(-y; x)'], ['$(x;\\,y)$', '(x; y)'], ['$(2x;\\,-2y)=\\nabla(x^2-y^2)$', '(2x; -2y)'], ['$(y;\\,-\\operatorname{sen}x)$', '(y; -sen x)'],
    ['$(-y;\\,x;\\,0{,}3)$', '(-y; x; 0,3)'], ['$(x;\\,y;\\,z)$', '(x; y; z)'], ['$(yz;\\,xz;\\,xy)=\\nabla(xyz)$', '(yz; xz; xy)'],
  ];
  const vetorial = {
    id: 'vetorial', nome: 'Campo vetorial',
    montar(M) {
      const cor = M.cores();
      const P = M.plano({ janela: [-2, 2, -1.7, 1.7], nomeVista: 'Vista 2D', dica: 'Arrasta o ponto p' });
      const V = M.vista3d({ ext: 2.2, alvo: [0, 0, 0], yaw: -0.7, pitch: 0.45, nomeVista: 'Vista 3D' });
      M.S.p = [0.8, 0.4];
      M.funcao('F', { rot: '$F=$', vars: ['x', 'y', 'z'], valor: '(-y; x)', exemplos: EXV, dica: 'Duas componentes para um campo em $\\mathbb R^2$, três para $\\mathbb R^3$, separadas por $;$.' });
      M.barra('z0', { rot: '$p_3$ (corte $z=p_3$)', cor: cor.b, min: -1.2, max: 1.2, valor: 0, nome: 'terceira coordenada de p' });
      M.caixa('linha', { rot: 'Linha de campo por $p$', valor: true });
      const Fv = () => { const F = M.F.F; if (!F || F.n < 2) return () => [NaN, NaN, NaN]; return F.n === 2 ? (x, y) => { const v = F.f(x, y, 0); return [v[0], v[1], 0]; } : (x, y, z) => F.f(x, y, z); };
      /* linha de campo: segue a direção de F (passos de comprimento fixo), para a frente e para trás */
      const linha = (F, p0) => {
        const andar = (sgn) => { const pts = [p0.slice()]; let p = p0.slice(); for (let i = 0; i < 260; i++) { const d = (q) => { const v = F(...q), m = Math.hypot(...v); return m < 1e-9 || !fin(m) ? null : v.map((x) => (sgn * x) / m); }; const k1 = d(p); if (!k1) break; const k2 = d(p.map((x, j) => x + 0.0075 * k1[j])); if (!k2) break; p = p.map((x, j) => x + 0.015 * k2[j]); if (Math.max(...p.map(Math.abs)) > 2.4) break; pts.push(p); } return pts; };
        return andar(-1).reverse().concat(andar(1));
      };
      M.cena(P, (G, S) => {
        const F = Fv(), z0 = S.z0;
        G.eixos();
        G.campo((x, y) => { const v = F(x, y, z0); return [v[0], v[1]]; }, { n: 19, cor: cor.m });
        if (S.linha) G.curva(linha(F, [S.p[0], S.p[1], z0]).map((q) => [q[0], q[1]]), { cor: cor.n, larg: 2.4 });
        const v = F(S.p[0], S.p[1], z0), m = Math.hypot(v[0], v[1]);
        if (m > 1e-9 && fin(m)) G.seta(S.p, [(0.6 * v[0]) / Math.max(1, m), (0.6 * v[1]) / Math.max(1, m)], { cor: cor.u, larg: 3, rot: '$F(p)$' });
        G.ponto(S.p, { cor: cor.u, rot: '$p$', arr: (x, y) => M.definir({ p: [x, y] }) });
      });
      M.cena(V, (C, S) => {
        const F = Fv(), n = M.F.F ? M.F.F.n : 2, p = [S.p[0], S.p[1], n === 3 ? S.z0 : 0];
        C.eixos({ x: [-1.7, 1.7], y: [-1.7, 1.7], z: [-1.4, 1.5] });
        const pts = [];
        if (n === 2) { for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) pts.push([-1.4 + 0.35 * i, -1.4 + 0.35 * j, 0]); }
        else for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) for (let l = 0; l < 5; l++) pts.push([-1.2 + 0.6 * i, -1.2 + 0.6 * j, -1.2 + 0.6 * l]);
        let mx = 0; const vs = pts.map((q) => { const v = F(...q), m = Math.hypot(...v); if (fin(m) && m > mx && m < 1e3) mx = m; return v; });
        pts.forEach((q, i) => { const v = vs[i], m = Math.hypot(...v); if (!fin(m) || m < 1e-9) return; C.seta(q, CM.mul(v, (n === 2 ? 0.3 : 0.45) * Math.max(0.25, m / mx) / m), { cor: cor.m, larg: 1.3 }); });
        if (S.linha) C.curva(linha(F, p), { cor: cor.n, larg: 2.6 });
        const v = F(...p), m = Math.hypot(...v);
        if (fin(m) && m > 1e-9) C.seta(p, CM.mul(v, 0.6 / Math.max(1, m)), { cor: cor.u, larg: 3 });
        C.ponto(p, { cor: cor.u, r: 5, rot: '$p$' });
      });
      M.leituras('No ponto $p$', (S) => {
        const FF = M.F.F;
        if (!FF || FF.n < 2 || FF.n > 3) return ['Um campo vetorial em $\\mathbb R^2$ tem 2 componentes; em $\\mathbb R^3$, 3.'];
        const F = Fv(), n = FF.n, p = [S.p[0], S.p[1], n === 3 ? S.z0 : 0];
        const v = F(...p), dv = parcial(F, p, 0, 0) + parcial(F, p, 1, 1) + (n === 3 ? parcial(F, p, 2, 2) : 0);
        const r = [['$p$', '$' + vetTex(p.slice(0, n), 2) + '$'], ['$F(p)$', '$' + vetTex(v.slice(0, n)) + '$', 'forte'], ['$\\|F(p)\\|$', '$' + N(Math.hypot(...v)) + '$'], ['$\\operatorname{div}F(p)$', '$' + N(dv) + '$']];
        if (n === 2) r.push(['$\\frac{\\partial F_2}{\\partial x}-\\frac{\\partial F_1}{\\partial y}$', '$' + N(parcial(F, p, 1, 0) - parcial(F, p, 0, 1)) + '$']);
        else r.push(['$\\operatorname{rot}F(p)$', '$' + vetTex([parcial(F, p, 2, 1) - parcial(F, p, 1, 2), parcial(F, p, 0, 2) - parcial(F, p, 2, 0), parcial(F, p, 1, 0) - parcial(F, p, 0, 1)]) + '$']);
        r.push('A linha de campo (roxa) é tangente a $F$ em todos os pontos: é o caminho de uma partícula levada pelo campo.');
        return r;
      });
      M.legenda([[cor.m, 'campo $F$'], [cor.u, '$F(p)$'], [cor.n, 'linha de campo']]);
    },
  };

  /* ======================= limites por caminhos ======================= */
  const R0 = (e) => ({ r: [[e, '(x;y)≠(0;0)']], z: '0' });
  const EXL = [
    ['$\\frac{x^2y}{x^2+y^2}$', R0('x^2y/(x^2+y^2)'), { L: '0' }], ['$\\frac{xy}{x^2+y^2}$', R0('xy/(x^2+y^2)'), { L: '0' }], ['$\\frac{x^2y}{x^4+y^2}$', R0('x^2y/(x^4+y^2)'), { L: '0' }],
    ['$\\frac{x^2-y^2}{x^2+y^2}$', R0('(x^2-y^2)/(x^2+y^2)'), { L: '1' }], ['$\\frac{\\operatorname{sen}(x^2+y^2)}{x^2+y^2}$', { r: [['sen(x^2+y^2)/(x^2+y^2)', '(x;y)≠(0;0)']], z: '1' }, { L: '1' }],
  ];
  const limite = {
    id: 'limite', nome: 'Limites por caminhos',
    montar(M) {
      const cor = M.cores();
      const P = M.plano({ janela: [-1.2, 1.2, -1, 1], nomeVista: 'Caminhos', dica: 'Os caminhos chegam todos à origem' });
      const V = M.vista3d({ ext: 1.5, alvo: [0, 0, 0], yaw: -0.8, pitch: 0.5, nomeVista: 'Gráfico' });
      M.funcao('f', { vars: ['x', 'y'], valor: R0('x^2y/(x^2+y^2)'), ramos: true, exemplos: EXL, dica: 'O limite estuda-se em $(0;0)$. Para outro ponto $a$, muda de variáveis: $x\\to x-a_1$.' });
      M.funcao('L', { rot: 'Candidato a limite: $L=$', vars: [], valor: '0', ajuda: false });
      M.barra('th', { rot: 'reta: $\\theta$', cor: cor.b, min: 0, max: PI, valor: 0.6, fmt: CM.graus, nome: 'direção da reta' });
      M.barra('k', { rot: 'parábola $y=kx^2$: $k$', cor: cor.v, min: -3, max: 3, valor: 1, nome: 'k da parábola' });
      M.barra('d', { rot: '$\\delta$', cor: cor.n, min: 0.02, max: 1, valor: 0.5, nome: 'raio δ' });
      const f = () => M.F.f.f, Lv = () => (M.F.L ? M.F.L.f() : 0);
      const lim = (g) => { const v1 = f()(...g(1e-5)), v2 = f()(...g(-1e-5)); return Math.abs(v1 - v2) < 1e-3 ? (v1 + v2) / 2 : NaN; };
      const eps = (d) => { let m = 0; for (let i = 0; i < 360; i++) { const t = (2 * PI * i) / 360, v = f()(d * Math.cos(t + 0.003), d * Math.sin(t + 0.003)); m = Math.max(m, fin(v) ? Math.abs(v - Lv()) : Infinity); } return m; };
      let ck = null, faixa = [-1, 1];
      const fx = (S) => { const k = JSON.stringify(S.f); if (k !== ck) { ck = k; faixa = CDI.faixaZ(f(), -1.2, 1.2, -1.2, 1.2, 40); } return faixa; };
      M.cena(P, (G, S) => {
        pintar(G, f(), fx(S), cor, 70);
        G.eixos();
        G.disco([0, 0], S.d, { cor: cor.n, larg: 2 });
        const c = Math.cos(S.th), s = Math.sin(S.th);
        G.curva([[-2 * c, -2 * s], [2 * c, 2 * s]], { cor: cor.b, larg: 2.6 });
        G.param((t) => [t, S.k * t * t], -1.3, 1.3, 120, { cor: cor.v, larg: 2.6 });
        G.ponto([0, 0], { oco: true, cor: cor.i });
      });
      M.cena(V, (C, S) => {
        const fz = fx(S), k = 0.9 / Math.max(Math.abs(fz[0]), Math.abs(fz[1]), 1e-6), F = f();
        const ok = (z) => fin(z) && z >= fz[0] && z <= fz[1];
        C.eixos({ x: [-1.3, 1.3], y: [-1.3, 1.3], z: [-1.1, 1.2], esc: [1, 1, k] });
        C.sup((r, t) => { const x = r * Math.cos(t), y = r * Math.sin(t), z = F(x, y); return ok(z) ? [x, y, k * z] : null; }, 0.004, 1.15, 0, 2 * PI, 30, 96, { alfa: 0.6, mapa: 'altura' });
        const c = Math.cos(S.th), s = Math.sin(S.th);
        C.param((t) => { const z = F(t * c, t * s); return ok(z) ? [t * c, t * s, k * z] : [NaN, NaN, NaN]; }, -1.15, 1.15, 300, { cor: cor.b, larg: 3 });
        C.param((t) => { const y = S.k * t * t, z = F(t, y); return ok(z) && Math.abs(y) < 1.3 ? [t, y, k * z] : [NaN, NaN, NaN]; }, -1.15, 1.15, 300, { cor: cor.v, larg: 3 });
        C.param((t) => { const x = S.d * Math.cos(t), y = S.d * Math.sin(t), z = F(x, y); return ok(z) ? [x, y, k * z] : [NaN, NaN, NaN]; }, 0, 2 * PI, 240, { cor: cor.n, larg: 2.4 });
        C.ponto([0, 0, k * Lv()], { cor: cor.i, r: 4, rot: '$L$' });
      });
      M.leituras('Limite em $(0;0)$', (S) => {
        const c = Math.cos(S.th), s = Math.sin(S.th);
        const lr = lim((t) => [t * c, t * s]), lp = lim((t) => [t, S.k * t * t]);
        const retas = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8].map((a) => lim((t) => [t * Math.cos(a), t * Math.sin(a)]));
        const difRetas = retas.some((v) => !fin(v)) || Math.max(...retas) - Math.min(...retas) > 1e-3;
        const e1 = eps(S.d), e2 = eps(S.d / 10), e3 = eps(S.d / 100);
        const r = [['pela reta (azul)', '$' + N(lr) + '$'], ['pela parábola (verde)', '$' + N(lp) + '$'], '—',
          ['$\\sup_{\\|(x;y)\\|=\\delta}|f-L|$', '$' + N(e1) + '$'], ['o mesmo com $\\delta/10$', '$' + N(e2) + '$'], ['o mesmo com $\\delta/100$', '$' + N(e3) + '$', e3 < 1e-3 ? 'forte' : 'mau']];
        if (difRetas) r.push('<b>Retas diferentes dão limites diferentes:</b> o limite não existe.');
        else if (Math.abs(lp - retas[0]) > 1e-3 || !fin(lp)) r.push('<b>Todas as retas dão o mesmo, mas a parábola não:</b> o limite não existe. Retas não chegam!');
        else if (e3 < 1e-3 && e2 <= e1 + 1e-9) r.push('Os caminhos concordam e $|f-L|$ fica pequeno em bolas cada vez menores: <b>numericamente, $\\lim f=L$</b>. Para provar, majora $|f(x;y)-L|$ por algo que só dependa de $\\|(x;y)\\|$ e tenda para $0$.');
        else r.push('Os caminhos testados concordam, mas $|f-L|$ não fica pequeno em toda a bola: $L$ não é o limite, ou há um caminho que ainda não experimentaste.');
        return r;
      });
      M.texto((S) => {
        const F = M.F.f, ast = F.R ? F.R[0] && F.R[0].e.ast : F.ast;
        if (!ast) return '';
        try { const c = EX.converter(ast, 'polares'); return '<b class="t">Em polares</b><p>$x=r\\cos\\theta,\\ y=r\\operatorname{sen}\\theta$:</p>$$f=' + EX.tex(c.final) + '$$<p>Se isto se majorar por $g(r)\\to0$ (sem depender de $\\theta$), o limite existe.</p>'; } catch (e) { return ''; }
      }, 'nota');
      M.legenda([[cor.b, 'reta pela origem'], [cor.v, 'parábola $y=kx^2$'], [cor.n, 'circunferência de raio $\\delta$']]);
    },
  };

  /* ======================= mudança de coordenadas ======================= */
  const EXC = [['$x^2+y^2+z^2$', 'x^2+y^2+z^2'], ['$\\sqrt{x^2+y^2}$', 'sqrt(x^2+y^2)'], ['$z\\sqrt{x^2+y^2+z^2}$', 'z sqrt(x^2+y^2+z^2)'], ['$x+y+z$', 'x+y+z'], ['$\\frac{y}{x}$', 'y/x'], ['$xy$', 'xy']];
  const SN = { polares: ['r', '\\theta'], cilindricas: ['\\rho', '\\theta', 'z'], esfericas: ['r', '\\theta', '\\varphi'] };
  const conversao = {
    id: 'conversao', nome: 'Mudar de coordenadas',
    montar(M) {
      const cor = M.cores();
      const V = M.vista3d({ ext: 1.7, alvo: [0, 0, 0.15], yaw: -0.8, pitch: 0.45 });
      M.escolha('sis', { rot: 'Coordenadas', opcoes: [['polares', 'Polares $(r;\\theta)$'], ['cilindricas', 'Cilíndricas $(\\rho;\\theta;z)$'], ['esfericas', 'Esféricas $(r;\\theta;\\varphi)$']], valor: 'esfericas' });
      M.funcao('f', { rot: '$f(x;y;z)=$', vars: ['x', 'y', 'z'], valor: 'z sqrt(x^2+y^2+z^2)', exemplos: EXC });
      M.barra('q1', { rot: '$r$ ou $\\rho$', cor: cor.v, min: 0, max: 1.3, valor: 0.9, nome: 'distância' });
      M.barra('q2', { rot: '$\\theta$', cor: cor.u, min: 0, max: 2 * PI, valor: 0.8, fmt: CM.graus, nome: 'θ' });
      M.barra('q3', { rot: '$\\varphi$ ou $z$', cor: cor.n, min: 0, max: 1, valor: 0.3, nome: 'terceira coordenada', fmt: (t) => (M.S.sis === 'esfericas' ? CM.graus(PI * t) : M.S.sis === 'cilindricas' ? CM.fmtC(-1.2 + 2.4 * t, 2) : '—') });
      const ponto = (S) => {
        const a = S.q1, t = S.q2;
        if (S.sis === 'polares') return { q: [a, t], p: [a * Math.cos(t), a * Math.sin(t), 0] };
        if (S.sis === 'cilindricas') { const z = -1.2 + 2.4 * S.q3; return { q: [a, t, z], p: [a * Math.cos(t), a * Math.sin(t), z] }; }
        const ph = PI * S.q3; return { q: [a, t, ph], p: [a * Math.sin(ph) * Math.cos(t), a * Math.sin(ph) * Math.sin(t), a * Math.cos(ph)] };
      };
      let ck = null, cc = null;
      const conv = (S) => { const k = S.sis + '|' + JSON.stringify(S.f); if (k !== ck) { ck = k; try { const c = EX.converter(M.F.f.ast, S.sis); cc = Object.assign(c, { g: EX.compilar(c.final, c.novas.concat(S.sis === 'polares' ? ['z'] : [])) }); } catch (e) { cc = null; } } return cc; };
      M.cena(V, (C, S) => {
        const { p } = ponto(S), [x, y, z] = p, a = S.q1, t = S.q2;
        C.eixos({ x: [-1.4, 1.5], y: [-1.4, 1.5], z: [-1.3, 1.4] });
        if (S.sis === 'esfericas') {
          const ph = PI * S.q3;
          C.sup((u, v) => [a * Math.sin(v) * Math.cos(u), a * Math.sin(v) * Math.sin(u), a * Math.cos(v)], 0, 2 * PI, 0, PI, 36, 18, { alfa: 0.16, cor: cor.v });
          if (Math.abs(Math.sin(ph)) > 0.02) C.sup((u, v) => [v * Math.sin(ph) * Math.cos(u), v * Math.sin(ph) * Math.sin(u), v * Math.cos(ph)], 0, 2 * PI, 0, 1.4, 36, 6, { alfa: 0.14, cor: cor.n });
          C.linha([0, 0, 0], p, { cor: cor.v, larg: 2.4 });
          C.param((u) => [a * Math.sin(u) * Math.cos(t), a * Math.sin(u) * Math.sin(t), a * Math.cos(u)], 0, ph, 40, { cor: cor.n, larg: 2.4 });
        } else {
          if (S.sis === 'cilindricas') C.sup((u, v) => [a * Math.cos(u), a * Math.sin(u), v], 0, 2 * PI, -1.2, 1.2, 40, 6, { alfa: 0.15, cor: cor.v });
          C.linha([0, 0, z], p, { cor: cor.v, larg: 2.4 });
          C.param((u) => [a * Math.cos(u), a * Math.sin(u), z], 0, 2 * PI, 80, { cor: cor.v, larg: 1.2, alfa: 0.6 });
        }
        C.param((u) => [0.35 * Math.cos(u), 0.35 * Math.sin(u), 0], 0, t, 40, { cor: cor.u, larg: 2.4 });
        C.linha([0, 0, 0], [x, y, 0], { cor: cor.u, larg: 1.4, alfa: 0.8 });
        C.linha([x, y, 0], p, { cor: cor.m, larg: 1.2, alfa: 0.8 });
        C.ponto(p, { cor: cor.i, r: 5, rot: '$P$' });
      });
      M.leituras('No ponto $P$', (S) => {
        const { q, p } = ponto(S), c = conv(S), f = M.F.f.f;
        const v1 = f(...p), v2 = c ? c.g(...q, p[2]) : NaN;
        return [['$(x;y;z)$', '$' + vetTex(p, 3) + '$'], ['$(' + SN[S.sis].join(';') + ')$', '$' + vetTex(q, 3) + '$'], '—', ['$f(x;y;z)$', '$' + N(v1, 4) + '$'], ['a mesma conta nas novas', '$' + N(v2, 4) + '$', Math.abs(v1 - v2) < 1e-6 ? 'forte' : 'mau'], ['elemento de área/volume', '$' + (S.sis === 'polares' ? 'dx\\,dy=r\\,dr\\,d\\theta' : S.sis === 'cilindricas' ? 'dx\\,dy\\,dz=\\rho\\,d\\rho\\,d\\theta\\,dz' : 'dx\\,dy\\,dz=r^2\\operatorname{sen}\\varphi\\,dr\\,d\\theta\\,d\\varphi') + '$']];
      });
      M.texto((S) => {
        const c = conv(S);
        if (!c) return '';
        return '<b class="t">Passo a passo</b><ol class="conv">' + c.passos.map((p) => `<li><b>${p.titulo}</b>$$${p.tex}$$${p.nota ? '<p>' + p.nota + '</p>' : ''}</li>`).join('') + '</ol><p>Fator de mudança de variáveis: $|\\det Dg|=' + c.jac + '$.</p>';
      }, 'nota');
      M.legenda([[cor.v, 'distância ($r$ ou $\\rho$)'], [cor.u, 'ângulo $\\theta$'], [cor.n, 'ângulo $\\varphi$']]);
    },
  };

  /* ======================= teorema do valor intermédio ======================= */
  const EXT = [
    ['$x^2+y^2-1$', 'x^2+y^2-1', { D: '' }], ['$xy$', 'xy', { D: '' }], ['$\\operatorname{sen}(x+y)$', 'sen(x+y)', { D: '' }],
    ['$\\frac1x$ em $x\\ne0$', '1/x', { D: 'x ≠ 0', A: [-1.3, 0.4], B: [1.3, -0.3], K: [0, 1.2], c: 0.5 }],
    ['sinal de $x$ (descontínua)', { r: [['1', 'x > 0']], z: '-1' }, { D: '', A: [-1.3, 0.4], B: [1.3, -0.3], K: [0, 1.2], c: 0.5 }],
  ];
  const tvi = {
    id: 'tvi', nome: 'Valor intermédio num caminho',
    montar(M) {
      const cor = M.cores();
      const P = M.plano({ janela: [-2, 2, -1.6, 1.6], nomeVista: 'Domínio', dica: 'Arrasta A, B e o ponto que dobra o caminho' });
      const V = M.vista3d({ ext: 2, alvo: [0, 0, 0], yaw: -0.7, pitch: 0.5, nomeVista: 'Gráfico' });
      M.S.A = [-0.3, -0.4]; M.S.B = [1.3, 0.8]; M.S.K = [0.9, -0.9];
      M.funcao('f', { vars: ['x', 'y'], valor: 'x^2+y^2-1', ramos: true, exemplos: EXT });
      M.funcao('D', { rot: 'Domínio $D$ (vazio: $\\mathbb R^2$)', vars: ['x', 'y'], valor: '', condicao: true, opcional: true, exemplo: 'ex.: x ≠ 0', ajuda: false });
      M.barra('c', { rot: '$c$', cor: cor.n, min: 0, max: 1, valor: 0.5, nome: 'valor c entre f(A) e f(B)', fmt: (t) => CM.fmtC(cval(M.S, t), 2) });
      const f = () => M.F.f.f, Dm = () => (M.F.D ? M.F.D.f : () => true);
      const cam = (S) => (t) => { const u = 1 - t; return [u * u * S.A[0] + 2 * u * t * S.K[0] + t * t * S.B[0], u * u * S.A[1] + 2 * u * t * S.K[1] + t * t * S.B[1]]; };
      function cval(S, t = S.c) { const a = f()(...S.A), b = f()(...S.B); return a + (b - a) * t; }
      const analisar = (S) => {
        const g = cam(S), F = f(), D = Dm(), c = cval(S), n = 400;
        let fora = false, salto = false;
        const zs = [];
        let t0 = 0, h0 = F(...g(0)) - c;
        for (let i = 1; i <= n; i++) {
          const t = i / n, p = g(t), h = F(...p) - c;
          if (!D(...p) || !fin(h)) fora = true;
          if (fin(h) && fin(h0) && h0 * h <= 0 && !(h0 === 0 && i > 1)) {
            const r = CM.bissecao((s) => F(...g(s)) - c, t0, t, 60);
            const v = F(...g(r)) - c;
            if (fin(v) && Math.abs(v) < 1e-4 && D(...g(r))) zs.push(r); else salto = true;
          }
          t0 = t; h0 = h;
        }
        return { zs, fora, salto, c };
      };
      M.cena(P, (G, S) => {
        const F = f(), D = Dm(), R = analisar(S), c = R.c;
        G.mapa((x, y) => { if (!D(x, y)) return null; const v = F(x, y); if (!fin(v)) return null; return mistura(v > c ? cor.u : cor.b, v > c ? cor.u : cor.b, 0, 55); }, 3);
        if (M.F.D) G.regiao((x, y) => !D(x, y), cor.r, 0.3);
        G.eixos();
        G.nivel((x, y) => (D(x, y) ? F(x, y) : NaN), c, { cor: cor.n, larg: 2.6 });
        G.param(cam(S), 0, 1, 160, { cor: cor.i, larg: 3 });
        R.zs.forEach((t) => G.ponto(cam(S)(t), { cor: cor.n, r: 6 }));
        G.ponto(S.K, { cor: cor.m, r: 4, arr: (x, y) => M.definir({ K: [x, y] }) });
        G.ponto(S.A, { cor: cor.i, rot: 'A', arr: (x, y) => M.definir({ A: [x, y] }) });
        G.ponto(S.B, { cor: cor.i, rot: 'B', arr: (x, y) => M.definir({ B: [x, y] }) });
      });
      let ck = null, fz = [-1, 1];
      M.cena(V, (C, S) => {
        const F = f(), D = Dm(), R = analisar(S), g = cam(S);
        const k0 = JSON.stringify([S.f, S.D]); if (k0 !== ck) { ck = k0; fz = CDI.faixaZ((x, y) => (D(x, y) ? F(x, y) : NaN), -1.8, 1.8, -1.8, 1.8, 36); }
        const k = 1.2 / Math.max(Math.abs(fz[0]), Math.abs(fz[1]), 1e-6), ok = (z) => fin(z) && z >= fz[0] && z <= fz[1];
        C.eixos({ x: [-1.9, 1.9], y: [-1.9, 1.9], z: [-1.4, 1.5], esc: [1, 1, k] });
        C.sup((x, y) => { const z = F(x, y); return D(x, y) && ok(z) ? [x, y, k * z] : null; }, -1.8, 1.8, -1.8, 1.8, 54, 54, { alfa: 0.55, mapa: 'altura' });
        C.plano([0, 0, k * R.c], [0, 0, 1], 1.8, { cor: cor.n, alfa: 0.12 });
        C.param((t) => { const p = g(t), z = F(...p); return ok(z) ? [p[0], p[1], k * z] : [NaN, NaN, NaN]; }, 0, 1, 300, { cor: cor.i, larg: 3 });
        C.param((t) => [...g(t), 0.003], 0, 1, 120, { cor: cor.i, larg: 1.2, alfa: 0.5 });
        R.zs.forEach((t) => { const p = g(t); C.ponto([p[0], p[1], k * R.c], { cor: cor.n, r: 5 }); });
      });
      M.leituras('Ao longo do caminho', (S) => {
        const R = analisar(S), a = f()(...S.A), b = f()(...S.B);
        const r = [['$f(A)$', '$' + N(a) + '$'], ['$f(B)$', '$' + N(b) + '$'], ['$c$', '$' + N(R.c) + '$', 'forte'], ['pontos com $f=c$ no caminho', '$' + R.zs.length + '$']];
        if (R.fora) r.push('<b>O caminho sai do domínio</b> (ou passa onde $f$ não está definida). O teorema exige um caminho <b>dentro de $D$</b>: se $D$ não é conexo por arcos, pode não haver ponto com $f=c$.');
        else if (R.salto) r.push('<b>$f$ salta</b> por cima de $c$ sem passar por ele: $f$ não é contínua ao longo do caminho, e o teorema não se aplica.');
        else if (R.zs.length) r.push('$t\\mapsto f(\\gamma(t))$ é contínua em $[0;1]$ e $c$ está entre $f(A)$ e $f(B)$: pelo teorema de Bolzano há $t$ com $f(\\gamma(t))=c$. Os pontos roxos são esses.');
        return r;
      });
      M.texto('<b class="t">A ideia</b><p>Liga-se $A$ a $B$ por um caminho $\\gamma:[0;1]\\to D$ contínuo e aplica-se o teorema de Bolzano a $h(t)=f(\\gamma(t))$, que é contínua em $[0;1]$. Por isso o teorema precisa de $f$ contínua e de $D$ <b>conexo por arcos</b>.</p>', 'nota');
      M.legenda([[cor.u, '$f&gt;c$'], [cor.b, '$f&lt;c$'], [cor.n, '$\\{f=c\\}$ e pontos encontrados'], [cor.r, 'fora de $D$']]);
    },
  };

  /* ======================= Taylor ======================= */
  const EXTa = [['$e^x\\cos y$', 'e^x cos y'], ['$x^2y-y^3$', 'x^2y-y^3'], ['$\\ln(1+x^2+y^2)$', 'ln(1+x^2+y^2)'], ['$\\operatorname{sen}(x+2y)$', 'sen(x+2y)'], ['$\\sqrt{1+x+y}$', 'sqrt(1+x+y)']];
  const termo = (c, s, primeiro) => { if (Math.abs(c) < 5e-7) return ''; const n = TX.n(Math.abs(c), 3); return (c < 0 ? '-' : primeiro ? '' : '+') + (s && Math.abs(Math.abs(c) - 1) < 5e-7 ? '' : n) + s; };
  const taylor = {
    id: 'taylor', nome: 'Polinómio de Taylor',
    montar(M) {
      const cor = M.cores();
      const P = M.plano({ janela: [-1.6, 1.6, -1.3, 1.3], nomeVista: 'Linhas de nível', dica: 'Arrasta a e a+h' });
      const V = M.vista3d({ ext: 1.9, alvo: [0, 0, 0.1], yaw: -0.75, pitch: 0.5, nomeVista: 'Gráficos' });
      M.S.a = [0.3, 0.2];
      M.funcao('f', { vars: ['x', 'y'], valor: 'e^x cos y', exemplos: EXTa });
      M.escolha('ord', { rot: 'Ordem', opcoes: [['1', '1.ª (plano tangente)'], ['2', '2.ª (com a Hessiana)']], valor: '2' });
      M.barra('hn', { rot: '$\\|h\\|$', cor: cor.n, min: 0.01, max: 1.2, valor: 0.6, nome: 'comprimento de h' });
      M.barra('ha', { rot: '$\\alpha$', cor: cor.n, min: 0, max: 2 * PI, valor: 0.6, fmt: CM.graus, circular: true, nome: 'direção de h' });
      const dados = (S) => {
        const f = M.F.f.f, a = S.a, f0 = f(...a), g = CM.grad(f, ...a), H = CM.hess(f, ...a), o2 = S.ord === '2';
        const Pf = (x, y) => { const dx = x - a[0], dy = y - a[1]; return f0 + g[0] * dx + g[1] * dy + (o2 ? 0.5 * (H[0][0] * dx * dx + 2 * H[0][1] * dx * dy + H[1][1] * dy * dy) : 0); };
        const h = [S.hn * Math.cos(S.ha), S.hn * Math.sin(S.ha)];
        return { f, a, f0, g, H, o2, Pf, h, ah: [a[0] + h[0], a[1] + h[1]] };
      };
      let ck = null, fz = [-1, 1];
      const faixa = (S) => { const k = JSON.stringify(S.f); if (k !== ck) { ck = k; fz = CDI.faixaZ(M.F.f.f, -1.5, 1.5, -1.5, 1.5, 30); } return fz; };
      M.cena(P, (G, S) => {
        const D = dados(S), fx = faixa(S);
        pintar(G, D.f, fx, cor, 60);
        G.eixos();
        for (let i = 1; i < 8; i++) { const c = fx[0] + ((fx[1] - fx[0]) * i) / 8; G.nivel(D.f, c, { cor: cor.i, larg: 1.2, alfa: 0.7 }); G.nivel(D.Pf, c, { cor: cor.n, larg: 1.6, trac: [5, 4] }); }
        G.seta(D.a, D.h, { cor: cor.n, larg: 2 });
        G.ponto(D.ah, { cor: cor.n, rot: '$a+h$', arr: (x, y) => { const d = [x - S.a[0], y - S.a[1]]; M.definir({ hn: CM.clamp(Math.hypot(...d), 0.01, 1.2), ha: (Math.atan2(d[1], d[0]) + 2 * PI) % (2 * PI) }); } });
        G.ponto(D.a, { cor: cor.u, rot: '$a$', arr: (x, y) => M.definir({ a: [x, y] }) });
      });
      M.cena(V, (C, S) => {
        const D = dados(S), fx = faixa(S), k = 1.1 / Math.max(Math.abs(fx[0]), Math.abs(fx[1]), 1e-6);
        const ok = (z) => fin(z) && z >= fx[0] && z <= fx[1];
        C.eixos({ x: [-1.6, 1.6], y: [-1.6, 1.6], z: [-1.2, 1.3], esc: [1, 1, k] });
        C.sup((x, y) => { const z = D.f(x, y); return ok(z) ? [x, y, k * z] : null; }, -1.5, 1.5, -1.5, 1.5, 48, 48, { alfa: 0.75, mapa: 'altura' });
        C.sup((x, y) => { const z = D.Pf(x, y); return ok(z) ? [x, y, k * z] : null; }, -1.5, 1.5, -1.5, 1.5, 30, 30, { alfa: 0.38, cor: cor.n });
        const z1 = D.f(...D.ah), z2 = D.Pf(...D.ah);
        if (fin(z1) && fin(z2)) C.linha([D.ah[0], D.ah[1], k * z1], [D.ah[0], D.ah[1], k * z2], { cor: cor.r, larg: 3.4 });
        C.ponto([D.a[0], D.a[1], k * D.f0], { cor: cor.u, r: 5, rot: '$a$' });
      });
      M.leituras('Erro de Taylor', (S) => {
        const D = dados(S), ordem = D.o2 ? 2 : 1;
        const R = (h) => D.f(D.a[0] + h[0], D.a[1] + h[1]) - D.Pf(D.a[0] + h[0], D.a[1] + h[1]);
        const rac = (s) => { const h = CM.mul(D.h, s); return Math.abs(R(h)) / Math.pow(Math.hypot(...h), ordem); };
        return [['$f(a)$', '$' + N(D.f0) + '$'], ['$\\nabla f(a)$', '$' + vetTex(D.g) + '$'], ['$Hf(a)$', '$' + matTex(D.H) + '$'], '—',
          ['$R(h)=f(a+h)-P(a+h)$', '$' + N(R(D.h), 5) + '$', 'forte'],
          ['$|R(h)|/\\|h\\|^' + ordem + '$', '$' + N(rac(1), 4) + '$'], ['com $h/2$', '$' + N(rac(0.5), 4) + '$'], ['com $h/10$', '$' + N(rac(0.1), 4) + '$'],
          'O rácio vai para $0$ quando $h\\to0$: $R(h)=o(\\|h\\|^' + ordem + ')$.'];
      });
      M.texto((S) => {
        const D = dados(S), [a1, a2] = D.a, X = '(x' + (a1 >= 0 ? '-' : '+') + TX.n(Math.abs(a1), 2) + ')', Y = '(y' + (a2 >= 0 ? '-' : '+') + TX.n(Math.abs(a2), 2) + ')';
        let s = termo(D.f0, '', true) || '0';
        s += termo(D.g[0], X) + termo(D.g[1], Y);
        if (D.o2) s += termo(D.H[0][0] / 2, X + '^2') + termo(D.H[0][1], X + Y) + termo(D.H[1][1] / 2, Y + '^2');
        return '<b class="t">O polinómio</b>$$P(x;y)=' + s + '$$<p>' + (D.o2 ? '$P(a+h)=f(a)+\\nabla f(a)\\cdot h+\\tfrac12\\,h^{T}Hf(a)\\,h$.' : '$P(a+h)=f(a)+\\nabla f(a)\\cdot h$: o plano tangente.') + '</p>';
      }, 'nota');
      M.legenda([[cor.u, 'gráfico de $f$'], [cor.n, 'gráfico de $P$ (tracejado: níveis)'], [cor.r, 'erro $R(h)$']]);
    },
  };

  /* ======================= Weierstrass ======================= */
  const EXW = [['$x^2+xy-y$', 'x^2+xy-y'], ['$x$', 'x'], ['$xy$', 'xy'], ['$x^2-y^2$', 'x^2-y^2'], ['$\\frac{1}{x^2+y^2}$', '1/(x^2+y^2)']];
  const EXK = [['disco fechado', 'x^2+y^2 ≤ 1'], ['disco aberto', 'x^2+y^2 < 1'], ['triângulo', 'x ≥ 0 e y ≥ 0 e x+y ≤ 1'], ['quadrado', '|x| ≤ 1 e |y| ≤ 1'], ['faixa ilimitada', '|y| ≤ 0,8'], ['coroa', '0,25 ≤ x^2+y^2 e x^2+y^2 ≤ 1']];
  const weierstrass = {
    id: 'weierstrass', nome: 'Extremos num compacto',
    montar(M) {
      const cor = M.cores();
      const P = M.plano({ janela: [-1.8, 1.8, -1.45, 1.45], nomeVista: 'Conjunto K' });
      const V = M.vista3d({ ext: 1.9, alvo: [0, 0, 0.1], yaw: -0.75, pitch: 0.55, nomeVista: 'Gráfico' });
      M.funcao('f', { vars: ['x', 'y'], valor: 'x^2+xy-y', exemplos: EXW });
      M.funcao('K', { rot: 'Conjunto $K$:', vars: ['x', 'y'], valor: 'x^2+y^2 ≤ 1', condicao: true, exemplos: EXK });
      const W = [-1.7, 1.7, -1.4, 1.4];
      let ck = null, R = null;
      const calc = (S) => {
        const k = JSON.stringify([S.f, S.K]);
        if (k === ck) return R;
        const f = M.F.f.f, K = M.F.K.f, n = 170, m = 140;
        let mx = { v: -Infinity }, mn = { v: Infinity }, borda = false, sing = false, vazio = true;
        for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) {
          const x = W[0] + ((W[1] - W[0]) * i) / n, y = W[2] + ((W[3] - W[2]) * j) / m;
          if (!K(x, y)) continue;
          vazio = false;
          if (i === 0 || j === 0 || i === n || j === m) borda = true;
          const v = f(x, y);
          if (!fin(v)) { sing = true; continue; }
          if (v > mx.v) mx = { v, p: [x, y] };
          if (v < mn.v) mn = { v, p: [x, y] };
        }
        /* refinamento local, sempre dentro de K */
        const refinar = (o, s) => { if (!o.p) return o; let h = 0.02; for (let it = 0; it < 40; it++) { let melhor = o; for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]]) { const q = [o.p[0] + h * d[0], o.p[1] + h * d[1]]; if (!K(...q)) continue; const v = f(...q); if (fin(v) && s * v > s * melhor.v) melhor = { v, p: q }; } if (melhor === o) h /= 2; o = melhor; } return o; };
        mx = refinar(mx, 1); mn = refinar(mn, -1);
        const interior = (p) => p && [[1, 0], [-1, 0], [0, 1], [0, -1]].every((d) => K(p[0] + 0.03 * d[0], p[1] + 0.03 * d[1]));
        const src = String(S.K);
        const estrita = /<(?!=|≤)|>(?!=|≥)|≠/.test(src.replace(/≤|≥|<=|>=/g, ''));
        ck = k; R = { mx, mn, borda, sing, vazio, estrita, iMx: interior(mx.p), iMn: interior(mn.p) };
        return R;
      };
      let fz = [-1, 1], ckz = null;
      M.cena(P, (G, S) => {
        const r = calc(S), f = M.F.f.f, K = M.F.K.f;
        const kz = JSON.stringify(S.f); if (kz !== ckz) { ckz = kz; fz = [r.mn.v, r.mx.v].every(fin) ? [r.mn.v, r.mx.v] : CDI.faixaZ(f, ...W, 30); }
        pintar(G, (x, y) => (K(x, y) ? f(x, y) : NaN), fz, cor, 110);
        G.eixos();
        for (let i = 1; i < 9; i++) G.nivel((x, y) => (K(x, y) ? f(x, y) : NaN), fz[0] + ((fz[1] - fz[0]) * i) / 9, { cor: cor.i, larg: 1, alfa: 0.5 });
        if (r.mx.p) G.ponto(r.mx.p, { cor: cor.u, r: 7, rot: 'máx' });
        if (r.mn.p) G.ponto(r.mn.p, { cor: cor.b, r: 7, rot: 'mín', dy: 16 });
      });
      M.cena(V, (C, S) => {
        const r = calc(S), f = M.F.f.f, K = M.F.K.f;
        const lo = fin(r.mn.v) ? r.mn.v : -1, hi = fin(r.mx.v) ? r.mx.v : 1, k = 1.1 / Math.max(Math.abs(lo), Math.abs(hi), 1e-6);
        C.eixos({ x: [-1.8, 1.8], y: [-1.5, 1.5], z: [-1.2, 1.3], esc: [1, 1, k] });
        C.sup((x, y) => { if (!K(x, y)) return null; const z = f(x, y); return fin(z) && Math.abs(k * z) < 2.5 ? [x, y, k * z] : null; }, W[0], W[1], W[2], W[3], 70, 58, { alfa: 0.8, mapa: 'altura' });
        if (r.mx.p) C.ponto([...r.mx.p, k * r.mx.v], { cor: cor.u, r: 6, rot: 'máx' });
        if (r.mn.p) C.ponto([...r.mn.p, k * r.mn.v], { cor: cor.b, r: 6, rot: 'mín' });
      });
      M.leituras('Weierstrass', (S) => {
        const r = calc(S);
        if (r.vazio) return ['$K$ está vazio (nesta janela).'];
        const rows = [['máximo (aprox.)', '$' + N(r.mx.v) + '$ em $' + vetTex(r.mx.p || [NaN, NaN], 2) + '$', 'forte'], ['mínimo (aprox.)', '$' + N(r.mn.v) + '$ em $' + vetTex(r.mn.p || [NaN, NaN], 2) + '$', 'forte'], '—',
          ['$K$ limitado?', r.borda ? 'não (sai da janela)' : 'sim, na janela', r.borda ? 'mau' : ''], ['$K$ fechado?', r.estrita ? 'talvez não (desigualdade estrita)' : 'sim (só $\\le$, $\\ge$, $=$)', r.estrita ? 'mau' : ''], ['$f$ contínua em $K$?', r.sing ? 'não ($f$ explode em $K$)' : 'parece que sim', r.sing ? 'mau' : '']];
        if (!r.borda && !r.estrita && !r.sing) rows.push('<b>Weierstrass aplica-se:</b> $f$ contínua num compacto atinge máximo e mínimo. ' + (r.iMx && r.iMn ? 'Os dois estão no interior: aí $\\nabla f=0$.' : 'Um deles está na fronteira: procura-o com Lagrange ou parametrizando a fronteira.'));
        else rows.push('<b>Falha uma hipótese</b>: o supremo (ou o ínfimo) pode não ser atingido. Os valores acima são só os maiores e menores da grelha.');
        return rows;
      });
      M.texto('<b class="t">Método para extremos em $K$ compacto</b><p>1. Pontos críticos no interior ($\\nabla f=0$). 2. Candidatos na fronteira (Lagrange, ou parametrizar). 3. Cantos da fronteira. 4. Comparar os valores: o maior é o máximo, o menor é o mínimo.</p>', 'nota');
      M.legenda([[cor.u, 'máximo'], [cor.b, 'mínimo']]);
    },
  };

  CDI.modelosDe('novo', { modelos: [desenhar, vetorial, limite, conversao, tvi, taylor, weierstrass] });
})();
