/* 1. Topologia em ℝⁿ: interior, exterior, fronteira, aberto, fechado, limitado, compacto, sucessões. */
(function () {
  const lin = (a, b, n = 200) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
  const C = {
    semi: {
      nome: 'y &gt; x', def: 'A = {(x; y) ∈ ℝ² : y &gt; x}',
      dentro: (x, y) => y > x,
      fr: () => [{ pts: lin(-8, 8, 2).map((x) => [x, x]), inc: false }],
      ab: true, fe: false, li: false,
      porque: 'y − x &gt; 0 é uma desigualdade estrita com uma função contínua: o conjunto é aberto. A reta y = x é a fronteira e não pertence a A, logo A não é fechado. Contém pontos tão longe da origem quanto se queira, logo não é limitado.',
      int: 'A', front: '{y = x}', fecho: '{y ≥ x}', a: [-0.5, 0.6], j: [-2.5, 2.5, -2.2, 2.2],
    },
    meio: {
      nome: 'x &gt; 0', def: 'A = {(x; y) ∈ ℝ² : x &gt; 0}',
      dentro: (x) => x > 0,
      fr: () => [{ pts: [[0, -8], [0, 8]], inc: false }],
      ab: true, fe: false, li: false,
      porque: 'Para a = (a₁; a₂) com a₁ &gt; 0, a bola de raio ε = a₁ fica toda em A: A é aberto. O eixo x = 0 é fronteira e não está em A.',
      int: 'A', front: '{x = 0}', fecho: '{x ≥ 0}', a: [1, 0.4], j: [-1.5, 3, -2, 2],
    },
    parab: {
      nome: 'y ≥ x²', def: 'A = {(x; y) ∈ ℝ² : y ≥ x²}',
      dentro: (x, y) => y >= x * x,
      fr: () => [{ pts: lin(-3, 3).map((x) => [x, x * x]), inc: true }],
      ab: false, fe: true, li: false,
      porque: 'f(x; y) = y − x² é contínua (soma de funções contínuas) e A = {f ≥ 0} é a pré-imagem do fechado [0, +∞[: A é fechado. Os pontos da parábola estão em A e são fronteira, logo A não é aberto.',
      int: '{y &gt; x²}', front: '{y = x²}', fecho: 'A', a: [1, 2], j: [-2.5, 2.5, -0.8, 3.4],
    },
    taca: {
      nome: 'y ≥ x², y &lt; 1', def: 'A = {(x; y) ∈ ℝ² : y ≥ x², y &lt; 1}',
      dentro: (x, y) => y >= x * x && y < 1,
      fr: () => [{ pts: lin(-1, 1).map((x) => [x, x * x]), inc: true }, { pts: [[-1, 1], [1, 1]], inc: false }],
      cantos: [[-1, 1, false], [1, 1, false]],
      ab: false, fe: false, li: true,
      porque: 'A parábola pertence a A (não é aberto) e o segmento y = 1 não pertence (não é fechado). Está dentro da bola B_R(0) para R ≥ √2, logo é limitado. Não sendo fechado, não é compacto.',
      int: '{x² &lt; y &lt; 1}', front: '{y = x², |x| ≤ 1} ∪ {y = 1, |x| ≤ 1}', fecho: '{x² ≤ y ≤ 1}', a: [0.2, 0.5], j: [-1.8, 1.8, -0.6, 1.6],
    },
    hiper: {
      nome: 'x² − y² &lt; 1, |y| &lt; 1', def: 'A = {(x; y) ∈ ℝ² : x² − y² &lt; 1, |y| &lt; 1}',
      dentro: (x, y) => x * x - y * y < 1 && Math.abs(y) < 1,
      fr: () => {
        const h = (s) => lin(-1, 1).map((y) => [s * Math.sqrt(1 + y * y), y]);
        return [{ pts: h(1), inc: false }, { pts: h(-1), inc: false }, { pts: [[-Math.SQRT2, 1], [Math.SQRT2, 1]], inc: false }, { pts: [[-Math.SQRT2, -1], [Math.SQRT2, -1]], inc: false }];
      },
      ab: true, fe: false, li: true,
      porque: 'As duas condições são desigualdades estritas com funções contínuas: A é aberto. Como x² &lt; 1 + y² &lt; 2, tem-se |x| &lt; √2 e |y| &lt; 1, logo A é limitado. Não é fechado (falta-lhe a fronteira), logo não é compacto.',
      int: 'A', front: 'os dois ramos da hipérbole e os segmentos y = ±1, |x| ≤ √2', fecho: '{x² − y² ≤ 1, |y| ≤ 1}', a: [0.8, 0.3], j: [-2, 2, -1.6, 1.6],
    },
    disco: {
      nome: 'x² + y² ≤ 1', def: 'A = {(x; y) ∈ ℝ² : x² + y² ≤ 1}',
      dentro: (x, y) => x * x + y * y <= 1,
      fr: () => [{ pts: lin(0, 2 * Math.PI).map((t) => [Math.cos(t), Math.sin(t)]), inc: true }],
      ab: false, fe: true, li: true,
      porque: 'Pré-imagem de ]−∞, 1] pela função contínua x² + y²: fechado. Está contido em B_2(0): limitado. Fechado e limitado: compacto.',
      int: '{x² + y² &lt; 1}', front: '{x² + y² = 1}', fecho: 'A', a: [0.3, 0.2], j: [-1.8, 1.8, -1.5, 1.5],
    },
    furado: {
      nome: '0 &lt; x² + y² ≤ 1', def: 'A = {(x; y) ∈ ℝ² : 0 &lt; x² + y² ≤ 1}',
      dentro: (x, y) => { const r = x * x + y * y; return r > 0 && r <= 1; },
      fr: () => [{ pts: lin(0, 2 * Math.PI).map((t) => [Math.cos(t), Math.sin(t)]), inc: true }],
      cantos: [[0, 0, false]],
      ab: false, fe: false, li: true,
      porque: 'A circunferência pertence a A (não é aberto). A origem é fronteira e não pertence a A (não é fechado): a sucessão (1/k; 0) está em A e converge para (0; 0) ∉ A. Limitado, mas não compacto.',
      int: '{0 &lt; x² + y² &lt; 1}', front: '{x² + y² = 1} ∪ {(0; 0)}', fecho: '{x² + y² ≤ 1}', a: [0.5, 0.3], j: [-1.8, 1.8, -1.5, 1.5],
    },
  };
  const OPC = Object.keys(C).map((k) => [k, C[k].nome]);

  /* classifica a com bolas de raio e (amostragem em vários círculos) */
  function bola(A, a, e) {
    let dentro = 0, fora = 0;
    const tests = [[a[0], a[1]]];
    for (let k = 1; k <= 5; k++) for (let i = 0; i < 48; i++) { const t = (2 * Math.PI * i) / 48, r = (e * k) / 5.0001; tests.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]); }
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

  CDI.materia({
    id: 'topologia', ordem: 1, grupo: 'Cálculo diferencial', curto: 'Topologia em ℝⁿ', titulo: 'Topologia em ℝⁿ', paginas: 'pp. 2–5',
    resumo: 'Bolas, interior, exterior e fronteira. Conjuntos abertos, fechados, limitados e compactos.',
    modelos: [
      {
        id: 'bolas', nome: 'Bolas e pontos',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: C.parab.j });
          M.S.a = C.parab.a.slice();
          M.escolha('conj', { rot: 'Conjunto A', opcoes: OPC, valor: 'parab', mono: true, aoMudar: (k) => { M.S.a = C[k].a.slice(); P.janela(C[k].j); } });
          M.barra('e', { rot: 'ε', cor: cor.n, min: 0.05, max: 1.2, passo: 0.01, valor: 0.4, nome: 'raio ε', dica: 'Arrasta o ponto a no plano. Encolhe ε para ver o que acontece perto da fronteira.' });
          M.caixa('mostrar', { rot: 'Mostrar int(A), front(A) e Ā', valor: false });
          M.botoes([['Pôr a na fronteira', () => { const A = C[M.S.conj]; const r = maisPerto(A, M.S.a); if (r) M.definir({ a: r }); }], ['Exemplo da aula', () => { M.definir({ conj: 'parab', a: [1, 2], e: 0.3 }); P.janela(C.parab.j); }]]);
          M.cena(P, (G, S) => {
            const A = C[S.conj];
            desenharConjunto(G, A, cor);
            const b = bola(A, S.a, S.e);
            const cb = b.soA ? cor.v : b.soAc ? cor.r : cor.n;
            G.disco(S.a, S.e, { cor: cb, encher: cb + '22', larg: 2 });
            G.ponto(S.a, { cor: cor.u, rot: 'a', arr: (x, y) => M.definir({ a: [x, y] }) });
            G.texto([S.a[0] + S.e * 0.72, S.a[1] + S.e * 0.72], 'B_ε(a)', { cor: cb, tam: 13, dx: 18, dy: -6 });
          });
          M.leituras('Em a', (S) => {
            const A = C[S.conj];
            const b = bola(A, S.a, S.e);
            const t = tipo(A, S.a);
            return [
              ['a', CM.pt(S.a)],
              ['a ∈ A?', A.dentro(S.a[0], S.a[1]) ? 'sim' : 'não'],
              ['B_ε(a) com ε = ' + CM.fmt(S.e), b.soA ? '⊂ A' : b.soAc ? '⊂ Aᶜ' : 'toca A e Aᶜ'],
              `a é ponto <b>${t}</b> de A` + (t === 'fronteira' ? ': todas as bolas tocam A e Aᶜ, por mais pequenas que sejam.' : t === 'interior' ? ': existe ε &gt; 0 com B_ε(a) ⊂ A.' : ': existe ε &gt; 0 com B_ε(a) ⊂ Aᶜ.'),
            ];
          });
          M.leituras('O conjunto', (S) => {
            const A = C[S.conj];
            const sn = (v) => (v ? 'sim' : 'não');
            const r = [['', A.def], ['Aberto', sn(A.ab), A.ab ? 'forte' : ''], ['Fechado', sn(A.fe), A.fe ? 'forte' : ''], ['Limitado', sn(A.li), A.li ? 'forte' : ''], ['Compacto', sn(A.fe && A.li), A.fe && A.li ? 'forte' : '']];
            if (S.mostrar) r.push('—', ['int(A)', A.int], ['front(A)', A.front], ['Ā = int(A) ∪ front(A)', A.fecho]);
            return r;
          });
          M.texto((S) => '<b class="t">Porquê</b>' + C[S.conj].porque, 'chave');
          M.texto('<b class="t">Definições</b><p>a ∈ int(A) ⇔ ∃ε &gt; 0 : B_ε(a) ⊂ A</p><p>a ∈ ext(A) ⇔ ∃ε &gt; 0 : B_ε(a) ⊂ Aᶜ</p><p>a ∈ front(A) ⇔ ∀ε &gt; 0 : B_ε(a) ∩ A ≠ ∅ e B_ε(a) ∩ Aᶜ ≠ ∅</p><p>ℝⁿ = int(A) ∪ ext(A) ∪ front(A), uniões disjuntas. A é aberto ⇔ A = int(A); fechado ⇔ A = Ā ⇔ Aᶜ é aberto. Compacto ⇔ fechado e limitado.</p>', 'nota');
          M.legenda([[cor.a, 'A (linha cheia: fronteira incluída; tracejada: excluída)'], [cor.v, 'bola dentro de A'], [cor.r, 'bola dentro de Aᶜ'], [cor.n, 'bola toca os dois']]);
        },
      },
      {
        id: 'sucessoes', nome: 'Sucessões e fecho',
        montar(M) {
          const cor = M.cores();
          const P = M.plano({ janela: C.semi.j });
          M.S.a = [0.6, 0.6];
          M.escolha('conj', { rot: 'Conjunto A', opcoes: OPC, valor: 'semi', mono: true, aoMudar: (k) => { const A = C[k]; M.S.a = maisPerto(A, A.a) || A.a.slice(); P.janela(A.j); } });
          M.barra('n', { rot: 'k ≤', cor: cor.u, min: 1, max: 40, passo: 1, valor: 12, fmt: (x) => String(Math.round(x)), nome: 'número de termos' });
          M.barra('ang', { rot: 'α', cor: cor.n, min: 0, max: 2 * Math.PI, passo: 0.01, valor: 2.36, fmt: CM.graus, circular: true, nome: 'direção de aproximação' });
          M.botoes([['Pôr a na fronteira', () => { const A = C[M.S.conj]; M.definir({ a: maisPerto(A, M.S.a) }); }]]);
          const xk = (S, k) => [S.a[0] + (0.9 / k) * Math.cos(S.ang), S.a[1] + (0.9 / k) * Math.sin(S.ang)];
          M.cena(P, (G, S) => {
            const A = C[S.conj];
            desenharConjunto(G, A, cor);
            const n = Math.round(S.n);
            for (let k = 1; k <= n; k++) { const p = xk(S, k); G.ponto(p, { cor: A.dentro(p[0], p[1]) ? cor.v : cor.r, r: k === 1 ? 5 : 3.5 }); }
            G.texto(xk(S, 1), 'x₁', { cor: cor.v, dx: 12, dy: -10 });
            G.ponto(S.a, { cor: cor.u, rot: 'a = lim xₖ', arr: (x, y) => M.definir({ a: [x, y] }) });
          });
          M.leituras('A sucessão xₖ = a + (0.9/k)(cos α; sen α)', (S) => {
            const A = C[S.conj];
            const n = Math.round(S.n);
            let todos = true;
            for (let k = 1; k <= n; k++) { const p = xk(S, k); if (!A.dentro(p[0], p[1])) todos = false; }
            const em = A.dentro(S.a[0], S.a[1]);
            return [
              ['xₖ ∈ A para k ≤ ' + n + '?', todos ? 'sim' : 'não'],
              ['lim xₖ = a', CM.pt(S.a)],
              ['a ∈ A?', em ? 'sim' : 'não', em ? '' : 'mau'],
              todos && !em ? 'Uma sucessão de pontos de A converge para um ponto fora de A: <b>A não é fechado</b>, e a pertence a Ā.' : todos ? 'O limite está em A, como tem de acontecer se A for fechado.' : 'Escolhe uma direção α em que os termos fiquem dentro de A.',
            ];
          });
          M.texto('<b class="t">Fechado com sucessões</b><p>A é fechado ⇔ para toda a sucessão (xₖ) ⊂ A convergente, lim xₖ ∈ A.</p><p>Todo o ponto de Ā é limite de uma sucessão de pontos de A. Em ℝⁿ, basta somar a a um vetor que tende para 0, por exemplo a + (ε/k; 0; …; 0).</p>', 'nota');
          M.legenda([[cor.v, 'xₖ ∈ A'], [cor.r, 'xₖ ∉ A'], [cor.u, 'limite a']]);
        },
      },
    ],
    explicar: [
      { modelo: 'bolas', titulo: 'A bola B_ε(a)', estado: { conj: 'parab', a: [1, 2], e: 0.6, mostrar: false }, texto: '<p>B_ε(a) é o conjunto dos pontos a distância menor que ε de a. Em ℝ² é um disco aberto.</p><p>Toda a topologia desta matéria se decide perguntando onde cabem estas bolas.</p>' },
      { modelo: 'bolas', titulo: 'Ponto interior', estado: { conj: 'parab', a: [1, 2], e: 0.3 }, texto: '<p>a = (1; 2) está acima da parábola. Com ε = 0.3 a bola fica toda dentro de A (a verde), por isso a é <b>interior</b>.</p><p>Basta um ε. Aqui serve qualquer ε menor que a distância de a à parábola, cerca de 0.4. Com ε maior, a bola sai de A, mas isso não muda nada: a continua interior.</p>' },
      { modelo: 'bolas', titulo: 'Ponto de fronteira', estado: { conj: 'parab', a: [1, 1], e: 0.35 }, texto: '<p>a = (1; 1) está na parábola. A bola toca A e Aᶜ, e isso acontece para <b>todos</b> os ε: experimenta encolher ε em «Mexer nos controlos».</p><p>a ∈ front(A) e, aqui, a ∈ A.</p>' },
      { modelo: 'bolas', titulo: 'Conjunto aberto', estado: { conj: 'semi', a: [-0.5, 0.6], e: 0.3, mostrar: true }, texto: '<p>A = {y &gt; x}: todos os pontos de A são interiores, A = int(A), logo A é <b>aberto</b>.</p><p>Regra prática: desigualdades estritas com funções contínuas dão abertos.</p>' },
      { modelo: 'bolas', titulo: 'Conjunto fechado', estado: { conj: 'parab', a: [1, 1], e: 0.3, mostrar: true }, texto: '<p>A = {y ≥ x²} contém a fronteira: A = Ā, logo A é <b>fechado</b>.</p><p>Justificação curta: f(x; y) = y − x² é contínua e A = {f ≥ 0}. Igualdades e desigualdades largas com funções contínuas dão fechados.</p>' },
      { modelo: 'bolas', titulo: 'Nem aberto nem fechado', estado: { conj: 'taca', a: [0.5, 1], e: 0.25, mostrar: true }, texto: '<p>A = {y ≥ x², y &lt; 1}: a parábola está em A (não é aberto) e o segmento y = 1 não está (não é fechado).</p><p>Aberto e fechado não são contrários: um conjunto pode não ser nenhum dos dois, e ℝⁿ e ∅ são os dois ao mesmo tempo.</p>' },
      { modelo: 'bolas', titulo: 'Compacto', estado: { conj: 'disco', a: [0.6, 0.8], e: 0.3, mostrar: true }, texto: '<p>O disco fechado é fechado e limitado (cabe em B_2(0)), logo é <b>compacto</b>.</p><p>Vai ser preciso nos extremos condicionados: uma função contínua num compacto atinge máximo e mínimo.</p>' },
      { modelo: 'sucessoes', titulo: 'Fechado com sucessões', estado: { conj: 'semi', a: [0.6, 0.6], ang: 2.36, n: 14 }, texto: '<p>Os pontos xₖ estão todos em A = {y &gt; x} e convergem para a = (0.6; 0.6), que está na reta y = x, fora de A.</p><p>Logo A não é fechado. Num fechado, o limite de qualquer sucessão convergente de pontos de A está em A.</p>' },
    ],
    testa: [
      { modelo: 'bolas', estado: { conj: 'hiper', a: [0.8, 0.3], e: 0.3, mostrar: false }, p: 'A = {(x; y) : x² − y² &lt; 1, |y| &lt; 1}. Qual é a classificação certa?', op: ['Aberto e limitado, não compacto', 'Fechado e limitado, logo compacto', 'Aberto e não limitado', 'Nem aberto nem fechado'], certa: 0, porque: 'As duas condições são desigualdades estritas com funções contínuas, logo A é aberto. De x² &lt; 1 + y² &lt; 2 vem |x| &lt; √2, por isso é limitado. Não contém a fronteira, logo não é fechado nem compacto.', depois: { mostrar: true } },
      { modelo: 'bolas', estado: { conj: 'semi', a: [0.3, 0.3], e: 0.3 }, p: 'Para A = {y &gt; x}, quanto vale front(A)?', op: ['∅, porque A é aberto', 'A reta {y = x}', 'O semiplano {y ≥ x}', 'O próprio A'], certa: 1, porque: 'Qualquer bola centrada num ponto da reta y = x tem pontos acima (em A) e abaixo (em Aᶜ). Ser aberto quer dizer que a fronteira não está em A, não que é vazia.' },
      { modelo: 'sucessoes', estado: { conj: 'furado', a: [0, 0], ang: 0, n: 16 }, p: 'O conjunto 0 &lt; x² + y² ≤ 1 é fechado?', op: ['Sim, porque contém a circunferência x² + y² = 1', 'Sim, porque é limitado', 'Não: (1/k; 0) ∈ A converge para (0; 0) ∉ A', 'Não, porque não é limitado'], certa: 2, porque: 'Basta um ponto de fronteira fora de A. A origem é limite de pontos de A e não está em A, logo A ≠ Ā.' },
      { modelo: 'bolas', estado: { conj: 'parab', a: [1, 2], e: 0.4 }, p: 'Qual é a melhor justificação para A = {y ≥ x²} ser fechado?', op: ['Contém pontos com y muito grande', 'f(x; y) = y − x² é contínua e A = f⁻¹([0, +∞[) é a pré-imagem de um fechado', 'O complementar {y &lt; x²} é limitado', 'Toda a parábola é interior'], certa: 1, porque: 'A pré-imagem de um fechado por uma função contínua é fechada. O complementar {y &lt; x²} é aberto pela mesma razão.' },
      { modelo: 'bolas', estado: { conj: 'disco', a: [1, 0], e: 0.3 }, p: 'Um ponto pode ser ao mesmo tempo interior e de fronteira de A?', op: ['Sim, se estiver em A', 'Sim, nos conjuntos fechados', 'Não: int(A), ext(A) e front(A) são disjuntos', 'Só em ℝ'], certa: 2, porque: 'ℝⁿ = int(A) ∪ ext(A) ∪ front(A), e estes três conjuntos não se intersetam. Um ponto interior tem uma bola dentro de A, por isso não pode ter todas as bolas a tocar em Aᶜ.' },
    ],
  });
})();
