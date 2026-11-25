/* 6. Teoremas da função inversa e da função implícita. */
(function () {
  /* ---------- implícita: curvas F(x; y) = 0 ---------- */
  const IM = {
    circ: { tex: 'x^2+y^2=1', F: (x, y) => x * x + y * y - 1, Fx: (x) => 2 * x, Fy: (x, y) => 2 * y, p: [0.6, 0.8], j: [-1.8, 1.8, -1.5, 1.5], tx: '$y=\\sqrt{1-x^2}$ perto de pontos com $y>0$ e $y=-\\sqrt{1-x^2}$ com $y<0$.' },
    sen: { tex: 'x+y+\\sin(xy)=1', F: (x, y) => x + y + Math.sin(x * y) - 1, Fx: (x, y) => 1 + y * Math.cos(x * y), Fy: (x, y) => 1 + x * Math.cos(x * y), p: [0, 1], j: [-3, 3, -2.4, 2.6], tx: 'Não se consegue isolar $y$, mas o teorema garante que $y(x)$ existe perto de $(0;1)$.' },
    reta: { tex: 'x+y=1', F: (x, y) => x + y - 1, Fx: () => 1, Fy: () => 1, p: [0.4, 0.6], j: [-1.5, 2.5, -1.5, 2.5], tx: '$y=1-x$ e $x=1-y$: soluções globais.' },
    cusp: { tex: 'y^2=x^3', F: (x, y) => y * y - x ** 3, Fx: (x) => -3 * x * x, Fy: (x, y) => 2 * y, p: [1, 1], j: [-0.8, 2, -1.6, 1.6], tx: '$y=\\pm x^{3/2}$: na origem $\\frac{\\partial F}{\\partial x}=\\frac{\\partial F}{\\partial y}=0$ e a curva tem um bico.' },
  };
  /* projeta p na curva F = 0 (Newton na direção do gradiente) */
  function projetar(c, p) {
    let [x, y] = p;
    for (let i = 0; i < 30; i++) {
      const f = c.F(x, y), gx = c.Fx(x, y), gy = c.Fy(x, y), n = gx * gx + gy * gy;
      if (n < 1e-12) break;
      x -= (f * gx) / n; y -= (f * gy) / n;
      if (Math.abs(f) < 1e-12) break;
    }
    return [x, y];
  }
  /* ramo local y(x) a partir de (x0, y0), continuação passo a passo */
  function ramo(c, x0, y0, d, dir) {
    const pts = [[x0, y0]];
    let y = y0;
    const n = 40;
    for (let i = 1; i <= n; i++) {
      const x = x0 + (dir * d * i) / n;
      let yy = y;
      for (let k = 0; k < 20; k++) { const fy = c.Fy(x, yy); if (Math.abs(fy) < 1e-9) { yy = NaN; break; } const dy = c.F(x, yy) / fy; yy -= dy; if (Math.abs(dy) < 1e-12) break; }
      if (!isFinite(yy) || Math.abs(yy - y) > 0.25) break;
      y = yy; pts.push([x, y]);
    }
    return pts;
  }

  /* ---------- inversa: aplicações ℝ² → ℝ² ---------- */
  const MP = {
    aula: { tex: '(xy;\\,y/x)', g: (x, y) => [x * y, y / x], a: [2, 2], j: [-0.5, 3.5, -0.5, 3.5], det: '2y/x' },
    pol: { tex: '(r\\cos\\theta;\\,r\\sin\\theta)', g: (r, t) => [r * Math.cos(t), r * Math.sin(t)], a: [1, 0.8], j: [-0.5, 3, -0.5, 3.6], det: 'r' },
    exp: { tex: '(e^x\\cos y;\\,e^x\\sin y)', g: (x, y) => [Math.exp(x) * Math.cos(y), Math.exp(x) * Math.sin(y)], a: [0, 0.6], j: [-1.2, 1.2, -0.5, 7.2], det: 'e^{2x}>0' },
    dobra: { tex: '(x^2-y^2;\\,2xy)', g: (x, y) => [x * x - y * y, 2 * x * y], a: [0.8, 0.5], j: [-1.5, 1.5, -1.2, 1.2], det: '4(x^2+y^2)' },
  };

  CDI.materia({
    id: 'inversa', ordem: 6, grupo: 'Cálculo diferencial', curto: 'Inversa e implícita', titulo: 'Função inversa e função implícita', paginas: 'pp. 27–33',
    resumo: 'Quando se pode inverter uma função ou resolver $F(x;y)=0$ em ordem a $y$, e como derivar sem a fórmula.',
    modelos: [
      {
        id: 'implicita', nome: 'Função implícita',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 2, alvo: [0, 0, 0], yaw: -0.6, pitch: 0.5, dica: 'Gráfico de z = F(x; y) (à escala): F = 0 é o corte pelo plano z = 0' });
          const P = M.plano({ janela: IM.circ.j, dica: 'Arrasta P ao longo da curva' });
          M.S.p = IM.circ.p.slice();
          M.escolha('c', { rot: '$F(x;y)=0$', opcoes: Object.keys(IM).map((k) => [k, '$' + IM[k].tex + '$']), valor: 'circ', aoMudar: (k) => { M.S.p = IM[k].p.slice(); P.janela(IM[k].j); } });
          M.barra('d', { rot: '$\\delta$', cor: cor.n, min: 0.1, max: 1.2, valor: 0.45, nome: 'tamanho da vizinhança' });
          M.botoes([['$P=(1;0)$ na circunferência', () => { M.definir({ c: 'circ', p: [1, 0] }); P.janela(IM.circ.j); }], ['Exemplo da aula: $(0;1)$', () => { M.definir({ c: 'sen', p: [0, 1] }); P.janela(IM.sen.j); }]]);
          let esc = null;
          M.cena(V, (C, S) => {
            const c = IM[S.c], [a0, a1, b0, b1] = c.j;
            if (!esc || esc.c !== S.c) { let m = 0; for (let i = 0; i <= 16; i++) for (let j = 0; j <= 16; j++) m = Math.max(m, Math.abs(c.F(a0 + ((a1 - a0) * i) / 16, b0 + ((b1 - b0) * j) / 16))); esc = { c: S.c, k: 1.4 / m }; }
            const k = esc.k, [x0, y0] = S.p;
            C.eixos({ x: [a0, a1 + 0.2], y: [b0, b1 + 0.2], z: [-1.5, 1.6], nomes: ['x', 'y', 'F'] });
            C.grafico((x, y) => k * c.F(x, y), a0, a1, b0, b1, 48, { alfa: 0.55 });
            C.poli([[a0, b0, 0], [a1, b0, 0], [a1, b1, 0], [a0, b1, 0]], { cor: cor.m, alfa: 0.1, plano: 1 });
            C.segs(CM.contorno(c.F, a0, a1, b0, b1, 110, 110, 0).map(([p, q]) => [[...p, 0.004], [...q, 0.004]]), { cor: cor.m, larg: 2.4 });
            const fy = c.Fy(x0, y0);
            if (Math.abs(fy) > 1e-3) {
              const b = ramo(c, x0, y0, S.d, -1).reverse().concat(ramo(c, x0, y0, S.d, 1).slice(1)).filter((q) => Math.abs(q[1] - y0) <= S.d);
              C.curva(b.map((q) => [...q, 0.01]), { cor: cor.v, larg: 4.4 });
            }
            C.param((s) => [x0, y0 + s, k * c.F(x0, y0 + s)], -0.5, 0.5, 30, { cor: cor.ouro, larg: 2.6 });
            C.texto([x0, y0 + 0.55, k * c.F(x0, y0 + 0.5)], '$y\\mapsto F(x_0;y)$', { cor: cor.ouro });
            C.ponto([x0, y0, 0], { cor: cor.i, r: 5, rot: '$P$' });
          });
          M.cena(P, (G, S) => {
            const c = IM[S.c];
            G.eixos();
            G.nivel(c.F, 0, { cor: cor.m, larg: 2.2, n: 220 });
            const [x0, y0] = S.p, fy = c.Fy(x0, y0), fx = c.Fx(x0, y0);
            const ok = Math.abs(fy) > 1e-3;
            G.poli([[x0 - S.d, y0 - S.d], [x0 + S.d, y0 - S.d], [x0 + S.d, y0 + S.d], [x0 - S.d, y0 + S.d]], { cor: ok ? cor.v : cor.r, larg: 1.2, trac: [5, 4], encher: (ok ? cor.v : cor.r) + '14' });
            if (ok) {
              const b = ramo(c, x0, y0, S.d, -1).reverse().concat(ramo(c, x0, y0, S.d, 1).slice(1)).map((q) => (Math.abs(q[1] - y0) <= S.d ? q : null));
              G.curva(b, { cor: cor.v, larg: 4.5 });
              const s = -fx / fy;
              G.curva([[x0 - 1.4 * S.d, y0 - 1.4 * S.d * s], [x0 + 1.4 * S.d, y0 + 1.4 * S.d * s]], { cor: cor.ouro, larg: 2, trac: [7, 5] });
            } else if (Math.abs(fx) > 1e-3) {
              G.texto([x0, y0 + S.d + 0.1], 'dois valores de y para cada x', { cor: cor.r, tam: 12 });
            }
            const gn = Math.hypot(fx, fy);
            if (gn > 1e-6) G.seta(S.p, [(0.5 * fx) / gn, (0.5 * fy) / gn], { cor: cor.n, rot: '∇F' });
            G.ponto(S.p, { cor: cor.i, rot: 'P', arr: (x, y) => M.definir({ p: projetar(IM[M.S.c], [x, y]) }) });
          });
          M.leituras('Em $P$', (S) => {
            const c = IM[S.c], [x, y] = S.p, fx = c.Fx(x, y), fy = c.Fy(x, y);
            const ok = Math.abs(fy) > 1e-3;
            const r = [['$P$', '$' + TX.v(S.p, 3) + '$'], ['$F(P)$', '$' + TX.n(c.F(x, y), 4) + '$'], ['$\\frac{\\partial F}{\\partial x}(P)$', '$' + TX.n(fx, 3) + '$'], ['$\\frac{\\partial F}{\\partial y}(P)$', '$' + TX.n(fy, 3) + '$', ok ? 'forte' : 'mau']];
            if (ok) r.push(["$y'(x)=-\\frac{\\partial F/\\partial x}{\\partial F/\\partial y}$", '$' + TX.n(-fx / fy, 3) + '$', 'forte'], 'Existe $y(x)$, $C^1$, definida perto de $x=' + TX.n(x, 2) + '$, com $F(x;y(x))=0$ (a verde). Na vista 3D, a curva dourada $y\\mapsto F(x_0;y)$ corta o zero com declive não nulo.');
            else if (Math.abs(fx) > 1e-3) r.push('$\\frac{\\partial F}{\\partial y}(P)=0$: a curva dourada toca o zero sem o cortar. Perto de $P$ há dois $y$ para cada $x$ (ou nenhum). Mas $\\frac{\\partial F}{\\partial x}(P)\\ne0$, por isso existe $x=x(y)$.');
            else r.push('$\\nabla F(P)=0$: nenhuma das variáveis se escreve em função da outra perto de $P$.');
            return r;
          });
          M.texto((S) => '<b class="t">$' + IM[S.c].tex + '$</b><p>' + IM[S.c].tx + '</p>', 'chave');
          M.texto("<b class=\"t\">Teorema da função implícita</b><p>$F$ de classe $C^1$, $F(a;b)=0$ e $\\frac{\\partial F}{\\partial y}(a;b)\\ne0$ $\\Rightarrow$ existe $y=y(x)$, $C^1$, definida numa vizinhança de $a$, com $y(a)=b$ e $F(x;y(x))=0$.</p><p>Derivando $F(x;y(x))=0$ pela regra da cadeia: $\\frac{\\partial F}{\\partial x}+\\frac{\\partial F}{\\partial y}\\,y'(x)=0$, logo</p>$$y'(x)=-\\frac{\\partial F/\\partial x\\,(x;y(x))}{\\partial F/\\partial y\\,(x;y(x))}.$$<p>A solução é local: na circunferência, $y=\\sqrt{1-x^2}$ só serve para $y>0$.</p>", 'nota');
          M.legenda([[cor.v, 'ramo local $y=y(x)$'], [cor.ouro, "tangente, declive $y'(x)$; corte $y\\mapsto F(x_0;y)$"], [cor.n, '$\\nabla F(P)$']]);
        },
      },
      {
        id: 'inversa', nome: 'Função inversa em ℝ²',
        montar(M) {
          const cor = M.cores();
          const D1 = M.plano({ janela: MP.aula.j, dica: 'Domínio: arrasta a' });
          const D2 = M.plano({ janela: [-1, 6, -1, 3], dica: 'Imagem por g' });
          M.S.a = MP.aula.a.slice();
          M.escolha('m', { rot: '$g(x;y)$', opcoes: Object.keys(MP).map((k) => [k, '$' + MP[k].tex + '$']), valor: 'aula', aoMudar: (k) => { M.S.a = MP[k].a.slice(); D1.janela(MP[k].j); } });
          M.barra('s', { rot: 'lado', cor: cor.n, min: 0.05, max: 1.4, valor: 0.5, nome: 'lado do quadrado' });
          M.caixa('gemeo', { rot: 'Mostrar outro ponto com a mesma imagem', valor: false });
          M.botoes([['Exemplo da aula: $a=(2;2)$', () => { M.definir({ m: 'aula', a: [2, 2], s: 0.5 }); D1.janela(MP.aula.j); }]]);
          const quad = (a, s) => { const h = s / 2, L = []; for (let i = 0; i <= 4; i++) { const u = -h + (2 * h * i) / 4; L.push({ c: i % 4 ? 'm' : 'u', pts: Array.from({ length: 41 }, (_, k) => [a[0] + u, a[1] - h + (2 * h * k) / 40]) }); L.push({ c: i % 4 ? 'm' : 'v', pts: Array.from({ length: 41 }, (_, k) => [a[0] - h + (2 * h * k) / 40, a[1] + u]) }); } return L; };
          const gemeo = (S) => (S.m === 'exp' ? [S.a[0], S.a[1] + 2 * Math.PI] : S.m === 'dobra' ? [-S.a[0], -S.a[1]] : null);
          M.cena(D1, (P, S) => {
            P.eixos(S.m === 'pol' ? ['r', 'θ'] : ['x', 'y']);
            quad(S.a, S.s).forEach((l) => P.curva(l.pts, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: l.c === 'm' ? 1 : 2.2, alfa: l.c === 'm' ? 0.6 : 1 }));
            const gm = gemeo(S);
            if (S.gemeo && gm) { quad(gm, S.s).forEach((l) => P.curva(l.pts, { cor: cor.n, larg: 1.2, alfa: 0.7 })); P.ponto(gm, { cor: cor.n, rot: 'b' }); }
            P.ponto(S.a, { cor: cor.i, rot: 'a', arr: (x, y) => M.definir({ a: [x, y] }) });
          });
          M.cena(D2, (P, S) => {
            const mp = MP[S.m], ga = mp.g(...S.a);
            const L = quad(S.a, S.s).map((l) => ({ c: l.c, f: l.pts.map((p) => mp.g(...p)) }));
            let m = 0.4;
            L.forEach((l) => l.f.forEach((q) => { if (isFinite(q[0])) m = Math.max(m, Math.abs(q[0] - ga[0]), Math.abs(q[1] - ga[1])); }));
            D2.j0 = [ga[0] - 1.6 * m, ga[0] + 1.6 * m, ga[1] - 1.6 * m, ga[1] + 1.6 * m];
            D2.c = ga.slice();
            P.eixos(['u', 'v']);
            L.forEach((l) => P.curva(l.f, { cor: l.c === 'm' ? cor.m : cor[l.c], larg: l.c === 'm' ? 1 : 2.2, alfa: l.c === 'm' ? 0.6 : 1 }));
            const gm = gemeo(S);
            if (S.gemeo && gm) quad(gm, S.s).forEach((l) => P.curva(l.pts.map((p) => mp.g(...p)), { cor: cor.n, larg: 1.2, trac: [4, 4], alfa: 0.8 }));
            P.ponto(ga, { cor: cor.i, rot: 'g(a)' });
          });
          M.leituras('Em $a$', (S) => {
            const mp = MP[S.m], J = CM.jac((x, y) => mp.g(x, y), ...S.a), d = CM.det2(J), I = CM.inv2(J);
            const r = [['$a$', '$' + TX.v(S.a, 2) + '$'], ['$g(a)$', '$' + TX.v(mp.g(...S.a), 3) + '$'], ['$Dg(a)$', '$' + TX.m(J, 3) + '$'], ['$\\det Dg=' + mp.det + '$', '$' + TX.n(d, 3) + '$', Math.abs(d) > 1e-3 ? 'forte' : 'mau']];
            if (I) r.push(['$D(g^{-1})(g(a))=Dg(a)^{-1}$', '$' + TX.m(I, 3) + '$', 'forte'], '$\\det\\ne0$: $g$ é invertível numa vizinhança de $a$, e a inversa é $C^1$.');
            else r.push('$\\det Dg(a)=0$: o teorema não se aplica. Vê como o quadrado se dobra sobre si próprio.');
            const gm = gemeo(S);
            if (gm) r.push(['$g(b)$, $b=' + TX.v(gm, 2) + '$', '$' + TX.v(mp.g(...gm), 3) + '$']);
            return r;
          });
          M.texto('<b class="t">Teorema da função inversa</b><p>$g:\\mathbb R^n\\to\\mathbb R^n$ de classe $C^1$ e $\\det Dg(a)\\ne0$ $\\Rightarrow$ $g$ é invertível numa vizinhança de $a$, $g^{-1}$ é $C^1$ e</p>$$D(g^{-1})(g(a))=\\big(Dg(a)\\big)^{-1}.$$<p>Em CDI I: $g\'(a)\\ne0$. O resultado é <b>local</b>: $(e^x\\cos y;\\,e^x\\sin y)$ tem $\\det=e^{2x}\\ne0$ em todo o lado e não é injetiva, porque $g(x;y)=g(x;y+2\\pi)$. Liga «Mostrar outro ponto com a mesma imagem».</p>', 'nota');
          M.legenda([[cor.u, 'lados $x$ constante'], [cor.v, 'lados $y$ constante'], [cor.n, 'outro ponto com a mesma imagem']]);
        },
      },
      {
        id: 'uma', nome: 'Inversa em ℝ',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: [-2.2, 3.2, -2.2, 3.2], dica: 'f, f⁻¹ e a reta y = x' });
          const FN = {
            exp: { nome: '$e^x\\leftrightarrow\\ln y$', f: Math.exp, fi: Math.log, df: Math.exp, x: [-2.2, 1.15], dx: "f'(x)=e^x", di: "(f^{-1})'(y)=\\frac{1}{e^x}=\\frac1y" },
            sen: { nome: '$\\sin x\\leftrightarrow\\arcsin y$', f: Math.sin, fi: Math.asin, df: Math.cos, x: [-Math.PI / 2, Math.PI / 2], dx: "f'(x)=\\cos x", di: "(\\arcsin)'(y)=\\frac{1}{\\sqrt{1-y^2}}" },
            cubo: { nome: '$x^3\\leftrightarrow\\sqrt[3]{y}$', f: (x) => x ** 3, fi: Math.cbrt, df: (x) => 3 * x * x, x: [-1.4, 1.4], dx: "f'(x)=3x^2", di: "(f^{-1})'(y)=\\frac{1}{3x^2}" },
          };
          M.escolha('f', { rot: '$f\\leftrightarrow f^{-1}$', opcoes: Object.keys(FN).map((k) => [k, FN[k].nome]), valor: 'exp', aoMudar: (k) => { M.S.x = (FN[k].x[0] + FN[k].x[1]) / 2 + 0.3; } });
          M.barra('x', { rot: '$x$', cor: cor.u, min: -2.2, max: 1.15, valor: 0.5, nome: 'ponto x', dur: 6000 });
          M.sync.unshift(() => { const c = FN[M.S.f], b = M.ctl.querySelector('input[aria-label="ponto x"]'); if (b) { b.min = c.x[0]; b.max = c.x[1]; } M.S.x = CM.clamp(M.S.x, c.x[0], c.x[1]); });
          M.cena(P, (G, S) => {
            const c = FN[S.f];
            G.eixos();
            G.curva([[-5, -5], [5, 5]], { cor: cor.m, larg: 1, trac: [4, 4] });
            G.param((t) => [t, c.f(t)], c.x[0], c.x[1], 200, { cor: cor.u, larg: 2.6 });
            G.param((t) => [c.f(t), t], c.x[0], c.x[1], 200, { cor: cor.v, larg: 2.6 });
            const x = S.x, y = c.f(x), s = c.df(x);
            G.curva([[x - 0.8, y - 0.8 * s], [x + 0.8, y + 0.8 * s]], { cor: cor.ouro, larg: 2 });
            if (Math.abs(s) > 1e-6) G.curva([[y - 0.8 * s, x - 0.8], [y + 0.8 * s, x + 0.8]], { cor: cor.ouro, larg: 2, trac: [6, 4] });
            G.curva([[x, y], [y, x]], { cor: cor.m, larg: 1, trac: [2, 4] });
            G.ponto([x, y], { cor: cor.u, rot: '(x; f(x))' });
            G.ponto([y, x], { cor: cor.v, rot: '(y; f⁻¹(y))', dy: 14 });
          });
          M.leituras('Declives', (S) => {
            const c = FN[S.f], s = c.df(S.x);
            return [['$x$', '$' + TX.n(S.x, 3) + '$'], ['$y=f(x)$', '$' + TX.n(c.f(S.x), 3) + '$'], ['$' + c.dx + '$', '$' + TX.n(s, 3) + '$'], ['$' + c.di + '$', Math.abs(s) > 1e-6 ? '$' + TX.n(1 / s, 3) + '$' : 'não existe', 'forte'], 'O gráfico de $f^{-1}$ é o de $f$ refletido na reta $y=x$: os declives em pontos correspondentes são inversos.'];
          });
          M.texto("<b class=\"t\">Derivada da inversa</b><p>De $f^{-1}(f(x))=x$ e da regra da cadeia: $(f^{-1})'(f(x))\\,f'(x)=1$, logo</p>$$(f^{-1})'(y)=\\frac{1}{f'(x)},\\qquad y=f(x).$$<p>Em $\\mathbb R^n$ é igual, com matrizes: $D(f^{-1})(f(x))=(Df(x))^{-1}$. É preciso $f'(x)\\ne0$ ($\\det\\ne0$) e $f$ de classe $C^1$.</p>", 'nota');
          M.legenda([[cor.u, '$f$'], [cor.v, '$f^{-1}$'], [cor.ouro, 'tangentes (declives inversos)']]);
        },
      },
    ],
    explicar: [
      { modelo: 'uma', titulo: 'Em ℝ: a derivada da inversa', estado: { f: 'exp', x: 0.5 }, texto: "<p>$f(x)=e^x$ e $f^{-1}(y)=\\ln y$. Os gráficos são simétricos em relação a $y=x$.</p><p>$(f^{-1})'(y)=\\frac{1}{f'(x)}=\\frac{1}{e^x}=\\frac1y$: é a derivada de $\\ln y$.</p>" },
      { modelo: 'uma', titulo: 'arcsen sem decorar', estado: { f: 'sen', x: 0.6 }, texto: "<p>$y=\\sin x\\iff x=\\arcsin y$, com $x\\in[-\\pi/2,\\pi/2]$.</p>$$(\\arcsin)'(y)=\\frac{1}{\\cos x}=\\frac{1}{\\sqrt{1-\\sin^2x}}=\\frac{1}{\\sqrt{1-y^2}}.$$" },
      { modelo: 'inversa', titulo: 'Em ℝ²: det Dg(a) ≠ 0', estado: { m: 'aula', a: [2, 2], s: 0.5, gemeo: false }, texto: '<p>$g(x;y)=(xy;\\,y/x)$, $C^1$ para $x\\ne0$. $Dg=\\begin{bmatrix}y&x\\\\-y/x^2&1/x\\end{bmatrix}$.</p><p>Em $a=(2;2)$: $Dg=\\begin{bmatrix}2&2\\\\-1/2&1/2\\end{bmatrix}$, $\\det=2\\ne0$. Logo $g$ é invertível perto de $(2;2)$ e</p>$$D(g^{-1})(4;1)=\\tfrac12\\begin{bmatrix}1/2&-2\\\\1/2&2\\end{bmatrix}=\\begin{bmatrix}1/4&-1\\\\1/4&1\\end{bmatrix}.$$' },
      { modelo: 'inversa', titulo: 'Só local', estado: { m: 'exp', a: [0, 0.6], s: 0.6, gemeo: true }, texto: '<p>$g(x;y)=(e^x\\cos y;\\,e^x\\sin y)$: $\\det Dg=e^{2x}>0$ em todo o plano, por isso é invertível perto de qualquer ponto.</p><p>Mas o ponto $b=a+(0;2\\pi)$ tem a mesma imagem (roxo): $g$ não é injetiva em $\\mathbb R^2$. O teorema dá invertibilidade local, não global.</p>' },
      { modelo: 'inversa', titulo: 'det = 0: o quadrado dobra', estado: { m: 'dobra', a: [0, 0], s: 0.8, gemeo: false }, texto: '<p>$(x^2-y^2;\\,2xy)$ tem $\\det Dg=4(x^2+y^2)$, nulo na origem. Um quadrado à volta de $(0;0)$ é levado numa figura que dá duas voltas: perto da origem $g$ não é injetiva.</p>' },
      { modelo: 'implicita', titulo: 'Resolver F(x; y) = 0 em ordem a y', estado: { c: 'circ', p: [0.6, 0.8], d: 0.45 }, vista: [-0.6, 0.5], texto: "<p>$x^2+y^2=1$ é o corte do paraboloide $z=x^2+y^2-1$ pelo plano $z=0$. Em $P=(0.6;0.8)$: $\\frac{\\partial F}{\\partial y}=2y=1.6\\ne0$.</p><p>Perto de $P$ a curva é o gráfico de $y(x)=\\sqrt{1-x^2}$ (verde), e $y'(x)=-\\frac{F_x}{F_y}=-\\frac xy=-0.75$, sem precisar da fórmula.</p>" },
      { modelo: 'implicita', titulo: 'Onde falha', estado: { c: 'circ', p: [1, 0], d: 0.45 }, texto: '<p>Em $(1;0)$, $\\frac{\\partial F}{\\partial y}=0$: a curva dourada $y\\mapsto F(1;y)$ toca o zero sem o cortar. Para cada $x<1$ perto de $1$ há dois valores de $y$. Não há $y(x)$.</p><p>Como $\\frac{\\partial F}{\\partial x}=2\\ne0$, a curva é o gráfico de $x(y)=\\sqrt{1-y^2}$ perto de $(1;0)$.</p>' },
      { modelo: 'implicita', titulo: 'Quando não se consegue isolar y', estado: { c: 'sen', p: [0, 1], d: 0.6 }, texto: "<p>$x+y+\\sin(xy)=1$ não se resolve explicitamente. Em $(0;1)$: $\\frac{\\partial F}{\\partial y}=1+x\\cos(xy)=1\\ne0$, logo $y(x)$ existe perto de $x=0$.</p>$$y'(0)=-\\frac{1+y\\cos(xy)}{1+x\\cos(xy)}\\Big|_{(0;1)}=-2.$$<p>Sabe-se que a função existe e calcula-se a derivada, mesmo sem a fórmula.</p>" },
    ],
    testa: [
      { modelo: 'uma', estado: { f: 'exp', x: 0.5 }, p: "$f(x)=e^x$. Quanto vale $(f^{-1})'(y)$?", op: ['$e^y$', '$\\frac1y$', '$\\ln y$', '$\\frac{1}{e^y}$'], certa: 1, porque: "$(f^{-1})'(y)=\\frac{1}{f'(x)}=\\frac{1}{e^x}$, e $e^x=y$." },
      { modelo: 'inversa', estado: { m: 'aula', a: [2, 2], s: 0.5 }, p: '$g(x;y)=(xy;\\,y/x)$. Quanto vale $D(g^{-1})(4;1)$?', op: ['$\\begin{bmatrix}2&2\\\\-1/2&1/2\\end{bmatrix}$', '$\\begin{bmatrix}1/4&-1\\\\1/4&1\\end{bmatrix}$', '$\\begin{bmatrix}1/4&-1\\\\1/4&1/2\\end{bmatrix}$', 'Não existe'], certa: 1, porque: '$g(2;2)=(4;1)$ e $Dg(2;2)=\\begin{bmatrix}2&2\\\\-1/2&1/2\\end{bmatrix}$, com $\\det=2$. A inversa é $\\tfrac12\\begin{bmatrix}1/2&-2\\\\1/2&2\\end{bmatrix}$.' },
      { modelo: 'inversa', estado: { m: 'exp', a: [0, 0.6], s: 0.6, gemeo: true }, p: '$g$ de classe $C^1$ com $\\det Dg\\ne0$ em todo o $\\mathbb R^2$. Então:', op: ['$g$ é invertível em $\\mathbb R^2$', '$g$ é invertível numa vizinhança de cada ponto, mas pode não ser injetiva', '$g$ é linear', '$g$ não tem inversa em lado nenhum'], certa: 1, porque: 'O teorema é local. $(e^x\\cos y;\\,e^x\\sin y)$ é o contraexemplo: $\\det=e^{2x}$ e $g(x;y)=g(x;y+2\\pi)$.' },
      { modelo: 'implicita', estado: { c: 'circ', p: [1, 0] }, p: '$x^2+y^2=1$ perto de $(1;0)$. O que é verdade?', op: ['Existe $y=y(x)$', 'Existe $x=x(y)$, mas não $y=y(x)$', 'Não existe nenhuma das duas', 'Existem as duas'], certa: 1, porque: '$\\frac{\\partial F}{\\partial y}(1;0)=0$ e $\\frac{\\partial F}{\\partial x}(1;0)=2\\ne0$. Perto do ponto, $x=\\sqrt{1-y^2}$.' },
      { modelo: 'implicita', estado: { c: 'sen', p: [0, 1] }, p: "$x+y+\\sin(xy)=1$ define $y(x)$ perto de $(0;1)$. Quanto vale $y'(0)$?", op: ['$-1$', '$-2$', '$1$', '$0$'], certa: 1, porque: "$y'=-\\frac{1+y\\cos(xy)}{1+x\\cos(xy)}$. Em $(0;1)$: $-\\frac{1+1}{1+0}=-2$." },
    ],
  });
})();
