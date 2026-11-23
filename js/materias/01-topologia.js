/* 1. Topologia em ℝⁿ: interior, exterior, fronteira, aberto, fechado, limitado, compacto, sucessões. */
(function () {
  const lin = (a, b, n = 200) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
  const PI = Math.PI;
  const C = {
    semi: {
      nome: '$y>x$', def: 'A=\\{(x;y)\\in\\mathbb R^2: y>x\\}',
      dentro: (x, y) => y > x,
      fr: () => [{ pts: lin(-8, 8, 2).map((x) => [x, x]), inc: false }],
      ab: true, fe: false, li: false,
      porque: '$y-x>0$ é uma desigualdade estrita com uma função contínua: o conjunto é aberto. A reta $y=x$ é a fronteira e não pertence a $A$, logo $A$ não é fechado. Contém pontos tão longe da origem quanto se queira, logo não é limitado.',
      int: 'A', front: '\\{y=x\\}', fecho: '\\{y\\ge x\\}', a: [-0.5, 0.6], j: [-2.5, 2.5, -2.2, 2.2],
    },
    meio: {
      nome: '$x>0$', def: 'A=\\{(x;y)\\in\\mathbb R^2: x>0\\}',
      dentro: (x) => x > 0,
      fr: () => [{ pts: [[0, -8], [0, 8]], inc: false }],
      ab: true, fe: false, li: false,
      porque: 'Para $a=(a_1;a_2)$ com $a_1>0$, a bola de raio $\\varepsilon=a_1$ fica toda em $A$: $A$ é aberto. O eixo $x=0$ é fronteira e não está em $A$.',
      int: 'A', front: '\\{x=0\\}', fecho: '\\{x\\ge0\\}', a: [1, 0.4], j: [-1.5, 3, -2, 2],
    },
    parab: {
      nome: '$y\\ge x^2$', def: 'A=\\{(x;y)\\in\\mathbb R^2: y\\ge x^2\\}',
      dentro: (x, y) => y >= x * x,
      fr: () => [{ pts: lin(-3, 3).map((x) => [x, x * x]), inc: true }],
      ab: false, fe: true, li: false,
      porque: '$f(x;y)=y-x^2$ é contínua e $A=\\{f\\ge0\\}$ é a pré-imagem do fechado $[0,+\\infty[$: $A$ é fechado. Os pontos da parábola estão em $A$ e são fronteira, logo $A$ não é aberto.',
      int: '\\{y>x^2\\}', front: '\\{y=x^2\\}', fecho: 'A', a: [1, 2], j: [-2.5, 2.5, -0.8, 3.4],
    },
    taca: {
      nome: '$y\\ge x^2,\\ y<1$', def: 'A=\\{(x;y)\\in\\mathbb R^2: y\\ge x^2,\\ y<1\\}',
      dentro: (x, y) => y >= x * x && y < 1,
      fr: () => [{ pts: lin(-1, 1).map((x) => [x, x * x]), inc: true }, { pts: [[-1, 1], [1, 1]], inc: false }],
      cantos: [[-1, 1, false], [1, 1, false]],
      ab: false, fe: false, li: true,
      porque: 'A parábola pertence a $A$ (não é aberto) e o segmento $y=1$ não pertence (não é fechado). Está dentro da bola $B_R(0)$ para $R\\ge\\sqrt2$, logo é limitado. Não sendo fechado, não é compacto.',
      int: '\\{x^2<y<1\\}', front: '\\{y=x^2,\\ |x|\\le1\\}\\cup\\{y=1,\\ |x|\\le1\\}', fecho: '\\{x^2\\le y\\le1\\}', a: [0.2, 0.5], j: [-1.8, 1.8, -0.6, 1.6],
    },
    hiper: {
      nome: '$x^2-y^2<1,\\ |y|<1$', def: 'A=\\{(x;y): x^2-y^2<1,\\ |y|<1\\}',
      dentro: (x, y) => x * x - y * y < 1 && Math.abs(y) < 1,
      fr: () => {
        const h = (s) => lin(-1, 1).map((y) => [s * Math.sqrt(1 + y * y), y]);
        return [{ pts: h(1), inc: false }, { pts: h(-1), inc: false }, { pts: [[-Math.SQRT2, 1], [Math.SQRT2, 1]], inc: false }, { pts: [[-Math.SQRT2, -1], [Math.SQRT2, -1]], inc: false }];
      },
      ab: true, fe: false, li: true,
      porque: 'As duas condições são desigualdades estritas com funções contínuas: $A$ é aberto. Como $x^2<1+y^2<2$, tem-se $|x|<\\sqrt2$ e $|y|<1$, logo $A$ é limitado. Não é fechado (falta-lhe a fronteira), logo não é compacto.',
      int: 'A', front: '\\text{ramos da hipérbole e } y=\\pm1,\\ |x|\\le\\sqrt2', fecho: '\\{x^2-y^2\\le1,\\ |y|\\le1\\}', a: [0.8, 0.3], j: [-2, 2, -1.6, 1.6],
    },
    disco: {
      nome: '$x^2+y^2\\le1$', def: 'A=\\{(x;y)\\in\\mathbb R^2: x^2+y^2\\le1\\}',
      dentro: (x, y) => x * x + y * y <= 1,
      fr: () => [{ pts: lin(0, 2 * PI).map((t) => [Math.cos(t), Math.sin(t)]), inc: true }],
      ab: false, fe: true, li: true,
      porque: 'Pré-imagem de $]-\\infty,1]$ pela função contínua $x^2+y^2$: fechado. Está contido em $B_2(0)$: limitado. Fechado e limitado: compacto.',
      int: '\\{x^2+y^2<1\\}', front: '\\{x^2+y^2=1\\}', fecho: 'A', a: [0.3, 0.2], j: [-1.8, 1.8, -1.5, 1.5],
    },
    furado: {
      nome: '$0<x^2+y^2\\le1$', def: 'A=\\{(x;y): 0<x^2+y^2\\le1\\}',
      dentro: (x, y) => { const r = x * x + y * y; return r > 0 && r <= 1; },
      fr: () => [{ pts: lin(0, 2 * PI).map((t) => [Math.cos(t), Math.sin(t)]), inc: true }],
      cantos: [[0, 0, false]],
      ab: false, fe: false, li: true,
      porque: 'A circunferência pertence a $A$ (não é aberto). A origem é fronteira e não pertence a $A$ (não é fechado): a sucessão $(1/k;0)$ está em $A$ e converge para $(0;0)\\notin A$. Limitado, mas não compacto.',
      int: '\\{0<x^2+y^2<1\\}', front: '\\{x^2+y^2=1\\}\\cup\\{(0;0)\\}', fecho: '\\{x^2+y^2\\le1\\}', a: [0.5, 0.3], j: [-1.8, 1.8, -1.5, 1.5],
    },
  };
  const OPC = Object.keys(C).map((k) => [k, C[k].nome]);

  /* conjuntos em ℝ³ */
  const r2 = (p) => Math.hypot(p[0], p[1]);
  const C3 = {
    bola: {
      nome: '$x^2+y^2+z^2\\le1$', dentro: (p) => CM.dot(p, p) <= 1, ab: false, fe: true, li: true,
      proj: (p) => { const n = CM.len(p); return n < 1e-9 ? [0, 0, 1] : CM.mul(p, 1 / n); },
      int: '\\{x^2+y^2+z^2<1\\}', front: '\\{x^2+y^2+z^2=1\\}', fecho: 'A', a: [0.3, 0.2, 0.3],
      porque: 'Pré-imagem de $]-\\infty,1]$ pela função contínua $x^2+y^2+z^2$: fechada. Limitada. Logo compacta.',
    },
    esfera: {
      nome: '$x^2+y^2+z^2=1$', dentro: (p) => Math.abs(CM.dot(p, p) - 1) < 1e-9, ab: false, fe: true, li: true, fina: true,
      proj: (p) => { const n = CM.len(p); return n < 1e-9 ? [0, 0, 1] : CM.mul(p, 1 / n); },
      int: '\\varnothing', front: 'A', fecho: 'A', a: [0, 0.6, 0.8],
      porque: 'É uma superfície: nenhuma bola, por mais pequena, cabe dentro dela, por isso $\\operatorname{int}(A)=\\varnothing$ e todos os pontos de $A$ são fronteira. É fechada (igualdade com função contínua) e limitada: compacta.',
    },
    cil: {
      nome: '$x^2+y^2<1$ (cilindro)', dentro: (p) => p[0] * p[0] + p[1] * p[1] < 1, ab: true, fe: false, li: false,
      proj: (p) => { const n = r2(p); return n < 1e-9 ? [1, 0, p[2]] : [p[0] / n, p[1] / n, p[2]]; },
      int: 'A', front: '\\{x^2+y^2=1\\}', fecho: '\\{x^2+y^2\\le1\\}', a: [0.3, -0.2, 0.4],
      porque: 'Desigualdade estrita com função contínua: aberto. Em $\\mathbb R^3$ não há restrição a $z$: o cilindro é infinito e não é limitado.',
    },
    semi: {
      nome: '$z>0$', dentro: (p) => p[2] > 0, ab: true, fe: false, li: false,
      proj: (p) => [p[0], p[1], 0],
      int: 'A', front: '\\{z=0\\}', fecho: '\\{z\\ge0\\}', a: [0.2, 0.3, 0.5],
      porque: 'Para $a$ com $a_3>0$, a bola de raio $a_3$ fica em $A$: aberto. O plano $z=0$ é a fronteira e não está em $A$. Não é limitado.',
    },
    cone: {
      nome: '$\\sqrt{x^2+y^2}\\le z\\le1$', dentro: (p) => r2(p) <= p[2] && p[2] <= 1, ab: false, fe: true, li: true,
      proj: (p) => {
        const r = r2(p), u = r < 1e-9 ? [1, 0] : [p[0] / r, p[1] / r];
        const s = CM.clamp((r + p[2]) / 2, 0, 1), q1 = [u[0] * s, u[1] * s, s], q2 = [u[0] * Math.min(r, 1), u[1] * Math.min(r, 1), 1];
        return CM.len(CM.sub(p, q1)) < CM.len(CM.sub(p, q2)) ? q1 : q2;
      },
      int: '\\{\\sqrt{x^2+y^2}<z<1\\}', front: '\\text{superfície cónica}\\cup\\text{tampa } z=1', fecho: 'A', a: [0.1, 0.1, 0.6],
      porque: 'Duas desigualdades largas com funções contínuas: fechado. Cabe em $B_2(0)$: limitado. Logo compacto (é o «gelado» das teóricas, sem a calote).',
    },
  };
  /* amostragem de uma bola em ℝ³ (pontos de Fibonacci em várias cascas) */
  const FIB = (() => { const out = []; const N = 90, g = PI * (3 - Math.sqrt(5)); for (let i = 0; i < N; i++) { const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), t = g * i; out.push([r * Math.cos(t), y, r * Math.sin(t)]); } return out; })();
  function bola3(A, a, e) {
    let dentro = 0, fora = 0;
    const testa = (p) => (A.dentro(p) ? dentro++ : fora++);
    testa(a);
    for (let k = 1; k <= 4; k++) FIB.forEach((d) => testa(CM.add(a, CM.mul(d, (e * k) / 4.0001))));
    return { soA: fora === 0, soAc: dentro === 0 };
  }

  /* classifica a com bolas de raio e (amostragem em vários círculos) */
  function bola(A, a, e) {
    let dentro = 0, fora = 0;
    const tests = [[a[0], a[1]]];
    for (let k = 1; k <= 5; k++) for (let i = 0; i < 48; i++) { const t = (2 * PI * i) / 48, r = (e * k) / 5.0001; tests.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]); }
    for (const p of tests) (A.dentro(p[0], p[1]) ? dentro++ : fora++);
    return { soA: fora === 0, soAc: dentro === 0 };
  }
  function tipo(A, a) {
    const b = bola(A, a, 1e-6);
    return b.soA ? 'interior' : b.soAc ? 'exterior' : 'fronteira';
  }
  function maisPerto(A, a) {
    let best = null, dm = Infinity;
    A.fr().forEach((c) => {
      const pts = c.pts;
      for (let i = 0; i < pts.length - 1; i++) {
        const p = pts[i], q = pts[i + 1];
        const v = [q[0] - p[0], q[1] - p[1]];
        const t = Math.max(0, Math.min(1, ((a[0] - p[0]) * v[0] + (a[1] - p[1]) * v[1]) / (v[0] * v[0] + v[1] * v[1] || 1)));
        const r = [p[0] + t * v[0], p[1] + t * v[1]];
        const d = Math.hypot(r[0] - a[0], r[1] - a[1]);
        if (d < dm) { dm = d; best = r; }
      }
    });
    return best;
  }

  function desenharConjunto(P, A, cor) {
    P.regiao(A.dentro, cor.a, 0.2);
    P.eixos();
    A.fr().forEach((c) => P.curva(c.pts, { cor: cor.a, larg: 2.4, trac: c.inc ? null : [7, 6] }));
    (A.cantos || []).forEach(([x, y, inc]) => P.ponto([x, y], { cor: cor.a, oco: !inc, r: 4.5 }));
  }
  const sn = (v) => (v ? 'sim' : 'não');
  const DEF = '<b class="t">Definições</b><p>$a\\in\\operatorname{int}(A)\\iff\\exists\\varepsilon>0: B_\\varepsilon(a)\\subset A$</p><p>$a\\in\\operatorname{ext}(A)\\iff\\exists\\varepsilon>0: B_\\varepsilon(a)\\subset A^c$</p><p>$a\\in\\operatorname{front}(A)\\iff\\forall\\varepsilon>0: B_\\varepsilon(a)\\cap A\\ne\\varnothing$ e $B_\\varepsilon(a)\\cap A^c\\ne\\varnothing$</p><p>$\\mathbb R^n=\\operatorname{int}(A)\\cup\\operatorname{ext}(A)\\cup\\operatorname{front}(A)$, uniões disjuntas. $A$ é aberto $\\iff A=\\operatorname{int}(A)$; fechado $\\iff A=\\overline A\\iff A^c$ é aberto. Compacto $\\iff$ fechado e limitado.</p>';

  CDI.materia({
    id: 'topologia', ordem: 1, grupo: 'Cálculo diferencial', curto: 'Topologia em ℝⁿ', titulo: 'Topologia em ℝⁿ', paginas: 'pp. 2–5',
    resumo: 'Bolas, interior, exterior e fronteira. Conjuntos abertos, fechados, limitados e compactos, em $\\mathbb R^2$ e em $\\mathbb R^3$.',
    modelos: [
      {
        id: 'bolas', nome: 'Bolas e pontos',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: C.parab.j });
          M.S.a = C.parab.a.slice();
          M.escolha('conj', { rot: 'Conjunto $A$', opcoes: OPC, valor: 'parab', aoMudar: (k) => { M.S.a = C[k].a.slice(); P.janela(C[k].j); } });
          M.barra('e', { rot: '$\\varepsilon$', cor: cor.n, min: 0.05, max: 1.2, passo: 0.01, valor: 0.4, nome: 'raio ε', dica: 'Arrasta o ponto a no plano. Encolhe ε para ver o que acontece perto da fronteira.' });
          M.caixa('mostrar', { rot: 'Mostrar $\\operatorname{int}(A)$, $\\operatorname{front}(A)$ e $\\overline A$', valor: false });
          M.botoes([['Pôr $a$ na fronteira', () => { const A = C[M.S.conj]; const r = maisPerto(A, M.S.a); if (r) M.definir({ a: r }); }], ['Exemplo da aula', () => { M.definir({ conj: 'parab', a: [1, 2], e: 0.3 }); P.janela(C.parab.j); }]]);
          M.cena(P, (G, S) => {
            const A = C[S.conj];
            desenharConjunto(G, A, cor);
            const b = bola(A, S.a, S.e);
            const cb = b.soA ? cor.v : b.soAc ? cor.r : cor.n;
            G.disco(S.a, S.e, { cor: cb, encher: cb + '22', larg: 2 });
            G.ponto(S.a, { cor: cor.u, rot: 'a', arr: (x, y) => M.definir({ a: [x, y] }) });
            G.texto([S.a[0] + S.e * 0.72, S.a[1] + S.e * 0.72], '$Bε(a)$', { cor: cb, tam: 13, dx: 18, dy: -6 });
          });
          M.leituras('Em $a$', (S) => {
            const A = C[S.conj];
            const b = bola(A, S.a, S.e);
            const t = tipo(A, S.a);
            return [
              ['$a$', '$' + TX.v(S.a, 2) + '$'],
              ['$a\\in A$?', A.dentro(S.a[0], S.a[1]) ? 'sim' : 'não'],
              ['$B_\\varepsilon(a)$, $\\varepsilon=' + TX.n(S.e, 2) + '$', b.soA ? '$\\subset A$' : b.soAc ? '$\\subset A^c$' : 'toca $A$ e $A^c$'],
              `$a$ é ponto <b>${t}</b> de $A$` + (t === 'fronteira' ? ': todas as bolas tocam $A$ e $A^c$, por mais pequenas que sejam.' : t === 'interior' ? ': existe $\\varepsilon>0$ com $B_\\varepsilon(a)\\subset A$.' : ': existe $\\varepsilon>0$ com $B_\\varepsilon(a)\\subset A^c$.'),
            ];
          });
          M.leituras('O conjunto', (S) => {
            const A = C[S.conj];
            const r = [['', '$' + A.def + '$'], ['Aberto', sn(A.ab), A.ab ? 'forte' : ''], ['Fechado', sn(A.fe), A.fe ? 'forte' : ''], ['Limitado', sn(A.li), A.li ? 'forte' : ''], ['Compacto', sn(A.fe && A.li), A.fe && A.li ? 'forte' : '']];
            if (S.mostrar) r.push('—', ['$\\operatorname{int}(A)$', '$' + A.int + '$'], ['$\\operatorname{front}(A)$', '$' + A.front + '$'], ['$\\overline A$', '$' + A.fecho + '$']);
            return r;
          });
          M.texto((S) => '<b class="t">Porquê</b><p>' + C[S.conj].porque + '</p>', 'chave');
          M.texto(DEF, 'nota');
          M.legenda([[cor.a, '$A$ (linha cheia: fronteira incluída; tracejada: excluída)'], [cor.v, 'bola dentro de $A$'], [cor.r, 'bola dentro de $A^c$'], [cor.n, 'bola toca os dois']]);
        },
      },
      {
        id: 'espaco', nome: 'Bolas em ℝ³',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7, alvo: [0, 0, 0.2], yaw: -0.8, pitch: 0.42, dica: 'Arrasta o ponto a (move-se na horizontal) · z na barra' });
          M.S.a = C3.bola.a.slice();
          M.escolha('conj', { rot: 'Conjunto $A\\subset\\mathbb R^3$', opcoes: Object.keys(C3).map((k) => [k, C3[k].nome]), valor: 'bola', aoMudar: (k) => (M.S.a = C3[k].a.slice()) });
          M.barra('e', { rot: '$\\varepsilon$', cor: cor.n, min: 0.05, max: 0.9, valor: 0.3, nome: 'raio ε' });
          M.barra('az', { rot: '$a_3$', cor: cor.u, min: -1.3, max: 1.5, valor: 0.3, nome: 'altura de a', animar: false, aoMudar: (v) => (M.S.a = [M.S.a[0], M.S.a[1], v]) });
          M.sync.unshift(() => { M.S.az = M.S.a[2]; });
          M.botoes([['Pôr $a$ na fronteira', () => M.definir({ a: C3[M.S.conj].proj(M.S.a) })], ['Encolher $\\varepsilon$', () => M.definir({ e: Math.max(0.05, M.S.e / 2) })]]);
          M.cena(V, (C, S) => {
            const A = C3[S.conj], a = S.a;
            C.eixos({ x: [-1.6, 1.7], y: [-1.6, 1.7], z: [-1.4, 1.7] });
            const inc = { cor: cor.a, alfa: 0.32, malha: false }, exc = { cor: cor.a, alfa: 0.14, alfaMalha: 0.6, passoMalha: 2 };
            if (S.conj === 'bola' || S.conj === 'esfera') C.sup((t, f) => [Math.sin(f) * Math.cos(t), Math.sin(f) * Math.sin(t), Math.cos(f)], 0, 2 * PI, 0, PI, 48, 24, S.conj === 'esfera' ? { cor: cor.a, alfa: 0.38, malha: false } : inc);
            if (S.conj === 'cil') {
              C.sup((t, z) => [Math.cos(t), Math.sin(t), z], 0, 2 * PI, -1.3, 1.5, 48, 14, exc);
              [-1.3, 1.5].forEach((z) => C.param((t) => [Math.cos(t), Math.sin(t), z], 0, 2 * PI, 60, { cor: cor.a, larg: 1.4, trac: [4, 4] }));
              C.texto([0, 0, 1.6], '$\\uparrow$ continua', { cor: cor.a });
            }
            if (S.conj === 'semi') {
              C.sup((x, y) => [x, y, 0], -1.5, 1.5, -1.5, 1.5, 12, 12, exc);
              C.caixa([-1.5, -1.5, 0], [1.5, 1.5, 1.5], { cor: cor.a, alfa: 0.05 });
            }
            if (S.conj === 'cone') {
              C.sup((t, r) => [r * Math.cos(t), r * Math.sin(t), r], 0, 2 * PI, 0, 1, 48, 10, inc);
              C.sup((t, r) => [r * Math.cos(t), r * Math.sin(t), 1], 0, 2 * PI, 0, 1, 48, 6, inc);
            }
            const b = bola3(A, a, S.e);
            const cb = b.soA ? cor.v : b.soAc ? cor.r : cor.n;
            C.sup((t, f) => CM.add(a, [S.e * Math.sin(f) * Math.cos(t), S.e * Math.sin(f) * Math.sin(t), S.e * Math.cos(f)]), 0, 2 * PI, 0, PI, 32, 16, { cor: cb, alfa: 0.4, malha: false });
            C.linha([a[0], a[1], 0], a, { cor: cor.m, larg: 1, trac: [3, 3] });
            C.ponto(a, { cor: cor.u, r: 4, rot: '$a$', arr: (x, y) => M.definir({ a: [x, y, a[2]] }) });
          });
          M.leituras('Em $a$', (S) => {
            const A = C3[S.conj], b = bola3(A, S.a, S.e), t0 = bola3(A, S.a, 1e-6);
            const t = t0.soA ? 'interior' : t0.soAc ? 'exterior' : 'fronteira';
            return [['$a$', '$' + TX.v(S.a, 2) + '$'], ['$a\\in A$?', A.dentro(S.a) ? 'sim' : 'não'], ['$B_\\varepsilon(a)$', b.soA ? '$\\subset A$' : b.soAc ? '$\\subset A^c$' : 'toca $A$ e $A^c$'], `$a$ é ponto <b>${t}</b> de $A$.`];
          });
          M.leituras('O conjunto', (S) => {
            const A = C3[S.conj];
            return [['Aberto', sn(A.ab), A.ab ? 'forte' : ''], ['Fechado', sn(A.fe), A.fe ? 'forte' : ''], ['Limitado', sn(A.li), A.li ? 'forte' : ''], ['Compacto', sn(A.fe && A.li), A.fe && A.li ? 'forte' : ''], '—', ['$\\operatorname{int}(A)$', '$' + A.int + '$'], ['$\\operatorname{front}(A)$', '$' + A.front + '$'], ['$\\overline A$', '$' + A.fecho + '$']];
          });
          M.texto((S) => '<b class="t">Porquê</b><p>' + C3[S.conj].porque + '</p>', 'chave');
          M.texto('<b class="t">Em ℝ³ as bolas são bolas</b><p>$B_\\varepsilon(a)=\\{x\\in\\mathbb R^3:\\|x-a\\|<\\varepsilon\\}$ é uma bola maciça sem a casca. As definições de interior, exterior e fronteira são as mesmas de $\\mathbb R^2$; só muda a forma das bolas.</p><p>Uma superfície (como a esfera) nunca tem pontos interiores em $\\mathbb R^3$: qualquer bola sai dela para cima e para baixo.</p>', 'nota');
          M.legenda([[cor.a, '$A$ (com malha: fronteira excluída)'], [cor.v, 'bola dentro de $A$'], [cor.r, 'bola dentro de $A^c$'], [cor.n, 'bola toca os dois']]);
        },
      },
      {
        id: 'sucessoes', nome: 'Sucessões e fecho',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: C.semi.j });
          M.S.a = [0.6, 0.6];
          M.escolha('conj', { rot: 'Conjunto $A$', opcoes: OPC, valor: 'semi', aoMudar: (k) => { const A = C[k]; M.S.a = maisPerto(A, A.a) || A.a.slice(); P.janela(A.j); } });
          M.barra('n', { rot: '$k\\le$', cor: cor.u, min: 1, max: 40, passo: 1, valor: 12, fmt: (x) => String(Math.round(x)), nome: 'número de termos' });
          M.barra('ang', { rot: '$\\alpha$', cor: cor.n, min: 0, max: 2 * PI, passo: 0.01, valor: 2.36, fmt: CM.graus, circular: true, nome: 'direção de aproximação' });
          M.botoes([['Pôr $a$ na fronteira', () => { const A = C[M.S.conj]; M.definir({ a: maisPerto(A, M.S.a) }); }]]);
          const xk = (S, k) => [S.a[0] + (0.9 / k) * Math.cos(S.ang), S.a[1] + (0.9 / k) * Math.sin(S.ang)];
          M.cena(P, (G, S) => {
            const A = C[S.conj];
            desenharConjunto(G, A, cor);
            const n = Math.round(S.n);
            for (let k = 1; k <= n; k++) { const p = xk(S, k); G.ponto(p, { cor: A.dentro(p[0], p[1]) ? cor.v : cor.r, r: k === 1 ? 5 : 3.5 }); }
            G.texto(xk(S, 1), '$x₁$', { cor: cor.v, dx: 12, dy: -10 });
            G.ponto(S.a, { cor: cor.u, rot: 'a = lim xₖ', arr: (x, y) => M.definir({ a: [x, y] }) });
          });
          M.leituras('$x_k=a+\\frac{0.9}{k}(\\cos\\alpha;\\sin\\alpha)$', (S) => {
            const A = C[S.conj];
            const n = Math.round(S.n);
            let todos = true;
            for (let k = 1; k <= n; k++) { const p = xk(S, k); if (!A.dentro(p[0], p[1])) todos = false; }
            const em = A.dentro(S.a[0], S.a[1]);
            return [
              ['$x_k\\in A$ para $k\\le' + n + '$?', todos ? 'sim' : 'não'],
              ['$\\lim x_k=a$', '$' + TX.v(S.a, 2) + '$'],
              ['$a\\in A$?', em ? 'sim' : 'não', em ? '' : 'mau'],
              todos && !em ? 'Uma sucessão de pontos de $A$ converge para um ponto fora de $A$: <b>$A$ não é fechado</b>, e $a\\in\\overline A$.' : todos ? 'O limite está em $A$, como tem de acontecer se $A$ for fechado.' : 'Escolhe uma direção $\\alpha$ em que os termos fiquem dentro de $A$.',
            ];
          });
          M.texto('<b class="t">Fechado com sucessões</b><p>$A$ é fechado $\\iff$ para toda a sucessão $(x_k)\\subset A$ convergente, $\\lim x_k\\in A$.</p><p>Todo o ponto de $\\overline A$ é limite de uma sucessão de pontos de $A$. Em $\\mathbb R^n$, basta somar a $a$ um vetor que tende para $0$, por exemplo $a+(\\varepsilon/k;0;\\dots;0)$.</p>', 'nota');
          M.legenda([[cor.v, '$x_k\\in A$'], [cor.r, '$x_k\\notin A$'], [cor.u, 'limite $a$']]);
        },
      },
    ],
    explicar: [
      { modelo: 'bolas', titulo: 'A bola $B_\\varepsilon(a)$', estado: { conj: 'parab', a: [1, 2], e: 0.6, mostrar: false }, texto: '<p>$B_\\varepsilon(a)$ é o conjunto dos pontos a distância menor que $\\varepsilon$ de $a$. Em $\\mathbb R^2$ é um disco aberto.</p><p>Toda a topologia desta matéria se decide perguntando onde cabem estas bolas.</p>' },
      { modelo: 'bolas', titulo: 'Ponto interior', estado: { conj: 'parab', a: [1, 2], e: 0.3 }, texto: '<p>$a=(1;2)$ está acima da parábola. Com $\\varepsilon=0.3$ a bola fica toda dentro de $A$ (a verde), por isso $a$ é <b>interior</b>.</p><p>Basta um $\\varepsilon$. Aqui serve qualquer $\\varepsilon$ menor que a distância de $a$ à parábola, cerca de $0.4$.</p>' },
      { modelo: 'bolas', titulo: 'Ponto de fronteira', estado: { conj: 'parab', a: [1, 1], e: 0.35 }, texto: '<p>$a=(1;1)$ está na parábola. A bola toca $A$ e $A^c$, e isso acontece para <b>todos</b> os $\\varepsilon$: experimenta encolher $\\varepsilon$.</p><p>$a\\in\\operatorname{front}(A)$ e, aqui, $a\\in A$.</p>' },
      { modelo: 'bolas', titulo: 'Conjunto aberto', estado: { conj: 'semi', a: [-0.5, 0.6], e: 0.3, mostrar: true }, texto: '<p>$A=\\{y>x\\}$: todos os pontos de $A$ são interiores, $A=\\operatorname{int}(A)$, logo $A$ é <b>aberto</b>.</p><p>Regra prática: desigualdades estritas com funções contínuas dão abertos.</p>' },
      { modelo: 'bolas', titulo: 'Conjunto fechado', estado: { conj: 'parab', a: [1, 1], e: 0.3, mostrar: true }, texto: '<p>$A=\\{y\\ge x^2\\}$ contém a fronteira: $A=\\overline A$, logo $A$ é <b>fechado</b>.</p><p>Justificação curta: $f(x;y)=y-x^2$ é contínua e $A=\\{f\\ge0\\}$. Igualdades e desigualdades largas com funções contínuas dão fechados.</p>' },
      { modelo: 'bolas', titulo: 'Nem aberto nem fechado', estado: { conj: 'taca', a: [0.5, 1], e: 0.25, mostrar: true }, texto: '<p>$A=\\{y\\ge x^2,\\ y<1\\}$: a parábola está em $A$ (não é aberto) e o segmento $y=1$ não está (não é fechado).</p><p>Aberto e fechado não são contrários: um conjunto pode não ser nenhum dos dois, e $\\mathbb R^n$ e $\\varnothing$ são os dois ao mesmo tempo.</p>' },
      { modelo: 'bolas', titulo: 'Compacto', estado: { conj: 'disco', a: [0.6, 0.8], e: 0.3, mostrar: true }, texto: '<p>O disco fechado é fechado e limitado (cabe em $B_2(0)$), logo é <b>compacto</b>.</p><p>Vai ser preciso nos extremos condicionados: uma função contínua num compacto atinge máximo e mínimo.</p>' },
      { modelo: 'espaco', titulo: 'Em ℝ³: bolas maciças', estado: { conj: 'bola', a: [0.3, 0.2, 0.3], e: 0.3 }, vista: [-0.8, 0.42], texto: '<p>Em $\\mathbb R^3$ a bola $B_\\varepsilon(a)$ é uma bola maciça. Com $a$ dentro da bola unitária e $\\varepsilon$ pequeno, $B_\\varepsilon(a)\\subset A$: $a$ é interior.</p>' },
      { modelo: 'espaco', titulo: 'A esfera não tem interior', estado: { conj: 'esfera', a: [0, 0.6, 0.8], e: 0.25 }, texto: '<p>A esfera $x^2+y^2+z^2=1$ é só a casca. Qualquer bola centrada num ponto dela tem pontos dentro e fora da casca: todos os pontos são fronteira.</p>$$\\operatorname{int}(S^2)=\\varnothing,\\qquad\\operatorname{front}(S^2)=S^2.$$<p>É fechada e limitada, logo compacta.</p>' },
      { modelo: 'espaco', titulo: 'O cilindro não é limitado', estado: { conj: 'cil', a: [0.3, -0.2, 0.4], e: 0.3 }, texto: '<p>Em $\\mathbb R^2$, $x^2+y^2<1$ é um disco limitado. Em $\\mathbb R^3$, a mesma condição não diz nada sobre $z$: é um cilindro infinito, aberto e <b>não limitado</b>.</p>' },
      { modelo: 'sucessoes', titulo: 'Fechado com sucessões', estado: { conj: 'semi', a: [0.6, 0.6], ang: 2.36, n: 14 }, texto: '<p>Os pontos $x_k$ estão todos em $A=\\{y>x\\}$ e convergem para $a=(0.6;0.6)$, que está na reta $y=x$, fora de $A$.</p><p>Logo $A$ não é fechado. Num fechado, o limite de qualquer sucessão convergente de pontos de $A$ está em $A$.</p>' },
    ],
    testa: [
      { modelo: 'bolas', estado: { conj: 'hiper', a: [0.8, 0.3], e: 0.3, mostrar: false }, p: '$A=\\{(x;y): x^2-y^2<1,\\ |y|<1\\}$. Qual é a classificação certa?', op: ['Aberto e limitado, não compacto', 'Fechado e limitado, logo compacto', 'Aberto e não limitado', 'Nem aberto nem fechado'], certa: 0, porque: 'As duas condições são desigualdades estritas com funções contínuas, logo $A$ é aberto. De $x^2<1+y^2<2$ vem $|x|<\\sqrt2$, por isso é limitado. Não contém a fronteira, logo não é fechado nem compacto.', depois: { mostrar: true } },
      { modelo: 'bolas', estado: { conj: 'semi', a: [0.3, 0.3], e: 0.3 }, p: 'Para $A=\\{y>x\\}$, quanto vale $\\operatorname{front}(A)$?', op: ['$\\varnothing$, porque $A$ é aberto', 'A reta $\\{y=x\\}$', 'O semiplano $\\{y\\ge x\\}$', 'O próprio $A$'], certa: 1, porque: 'Qualquer bola centrada num ponto da reta $y=x$ tem pontos acima (em $A$) e abaixo (em $A^c$). Ser aberto quer dizer que a fronteira não está em $A$, não que é vazia.' },
      { modelo: 'sucessoes', estado: { conj: 'furado', a: [0, 0], ang: 0, n: 16 }, p: 'O conjunto $0<x^2+y^2\\le1$ é fechado?', op: ['Sim, porque contém a circunferência $x^2+y^2=1$', 'Sim, porque é limitado', 'Não: $(1/k;0)\\in A$ converge para $(0;0)\\notin A$', 'Não, porque não é limitado'], certa: 2, porque: 'Basta um ponto de fronteira fora de $A$. A origem é limite de pontos de $A$ e não está em $A$, logo $A\\ne\\overline A$.' },
      { modelo: 'bolas', estado: { conj: 'parab', a: [1, 2], e: 0.4 }, p: 'Qual é a melhor justificação para $A=\\{y\\ge x^2\\}$ ser fechado?', op: ['Contém pontos com $y$ muito grande', '$f(x;y)=y-x^2$ é contínua e $A=f^{-1}([0,+\\infty[)$', 'O complementar $\\{y<x^2\\}$ é limitado', 'Toda a parábola é interior'], certa: 1, porque: 'A pré-imagem de um fechado por uma função contínua é fechada. O complementar $\\{y<x^2\\}$ é aberto pela mesma razão.' },
      { modelo: 'espaco', estado: { conj: 'esfera', a: [0, 0.6, 0.8], e: 0.25 }, p: 'Em $\\mathbb R^3$, qual é o interior da esfera $\\{x^2+y^2+z^2=1\\}$?', op: ['A bola aberta $\\{x^2+y^2+z^2<1\\}$', '$\\varnothing$', 'A própria esfera', '$\\mathbb R^3$'], certa: 1, porque: 'Nenhuma bola de $\\mathbb R^3$ cabe numa superfície. Cuidado: a bola aberta é o interior da <b>bola fechada</b>, não da esfera.' },
      { modelo: 'espaco', estado: { conj: 'cil', a: [0.3, -0.2, 0.4], e: 0.3 }, p: '$\\{(x;y;z): x^2+y^2<1\\}\\subset\\mathbb R^3$ é:', op: ['aberto e limitado', 'aberto e não limitado', 'fechado e limitado', 'compacto'], certa: 1, porque: 'Desigualdade estrita com função contínua: aberto. $z$ é livre: não é limitado.' },
      { modelo: 'bolas', estado: { conj: 'disco', a: [1, 0], e: 0.3 }, p: 'Um ponto pode ser ao mesmo tempo interior e de fronteira de $A$?', op: ['Sim, se estiver em $A$', 'Sim, nos conjuntos fechados', 'Não: $\\operatorname{int}(A)$, $\\operatorname{ext}(A)$ e $\\operatorname{front}(A)$ são disjuntos', 'Só em $\\mathbb R$'], certa: 2, porque: '$\\mathbb R^n=\\operatorname{int}(A)\\cup\\operatorname{ext}(A)\\cup\\operatorname{front}(A)$, e estes três conjuntos não se intersetam.' },
    ],
  });
})();
