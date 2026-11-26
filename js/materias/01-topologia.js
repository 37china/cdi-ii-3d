/* Programa · 1. Noções básicas topológicas em ℝⁿ, sucessões. */
(function () {
  const R = String.raw, C = window.CDI;
  C.materia({
    id: 'topologia', ordem: 1, grupo: 'Cálculo diferencial', curto: 'Topologia e sucessões', paginas: 'pp. 2–5',
    titulo: 'Noções topológicas em ℝⁿ e sucessões',
    resumo: R`Norma, bolas, interior, fronteira, fecho; conjuntos abertos, fechados, limitados e compactos; sucessões e convergência.`,
    modelos: ['topologia.bolas', 'topologia.espaco', 'topologia.sucessoes'],
    aprender: [
      { tipo: 'def', titulo: 'Norma e distância', modelo: 'bolas', estado: { conj: 'disco', a: [0.3, 0.2], e: 0.4 },
        texto: R`<p>Para $x=(x_1;\dots;x_n)\in\mathbb R^n$, a <b>norma</b> é $\|x\|=\sqrt{x_1^2+\dots+x_n^2}$ e a <b>distância</b> entre $x$ e $y$ é $\|x-y\|$.</p><p>Propriedades: $\|x\|\ge0$ e $\|x\|=0\iff x=0$; $\|\lambda x\|=|\lambda|\,\|x\|$; $\|x+y\|\le\|x\|+\|y\|$ (desigualdade triangular).</p>` },
      { tipo: 'def', titulo: 'Bola aberta', modelo: 'espaco', estado: { conj: 'bola', e: 0.3 },
        texto: R`<p>A <b>bola aberta</b> de centro $a$ e raio $\varepsilon>0$ é</p>$$B_\varepsilon(a)=\{x\in\mathbb R^n:\ \|x-a\|<\varepsilon\}.$$<p>Em $\mathbb R$ é um intervalo $]a-\varepsilon;a+\varepsilon[$, em $\mathbb R^2$ um disco sem a circunferência, em $\mathbb R^3$ uma bola sem a esfera. Tudo o que se segue é definido com bolas.</p>`,
        experimenta: R`muda $\varepsilon$ e a altura $a_3$ do centro.` },
      { tipo: 'def', titulo: 'Interior, exterior e fronteira', modelo: 'bolas', estado: { conj: 'disco', a: [0.3, 0.2], e: 0.4, mostrar: false },
        texto: R`<p>Seja $A\subset\mathbb R^n$ e $a\in\mathbb R^n$.</p><ul><li>$a$ é <b>interior</b> a $A$ se existe $\varepsilon>0$ com $B_\varepsilon(a)\subset A$;</li><li>$a$ é <b>exterior</b> a $A$ se existe $\varepsilon>0$ com $B_\varepsilon(a)\subset\mathbb R^n\setminus A$;</li><li>$a$ é <b>fronteiro</b> se toda a bola $B_\varepsilon(a)$ tem pontos de $A$ e pontos fora de $A$.</li></ul><p>Notação: $\operatorname{int}A$, $\operatorname{ext}A$, $\partial A$. Os três conjuntos separam $\mathbb R^n$.</p>`,
        experimenta: R`arrasta $a$ para cima da circunferência: nenhuma bola, por mais pequena, cabe dentro ou fora.` },
      { tipo: 'def', titulo: 'Fecho; conjuntos abertos e fechados', modelo: 'bolas', estado: { conj: 'semi', a: [-0.5, 0.6], e: 0.4, mostrar: true },
        texto: R`<p>O <b>fecho</b> é $\overline A=\operatorname{int}A\cup\partial A$.</p><p>$A$ é <b>aberto</b> se $A=\operatorname{int}A$ (não contém pontos fronteiros) e <b>fechado</b> se $\partial A\subset A$, isto é, $A=\overline A$. Equivalente: $A$ é fechado se e só se $\mathbb R^n\setminus A$ é aberto.</p>` },
      { tipo: 'contra', titulo: 'Nem aberto nem fechado', modelo: 'bolas', estado: { conj: 'furado', a: [0.5, 0.3], e: 0.3, mostrar: true },
        texto: R`<p>$A=\{0<x^2+y^2\le1\}$ contém a circunferência (por isso não é aberto) mas não contém a origem, que é fronteira (por isso não é fechado).</p><p>Abertos e fechados não são opostos: $\emptyset$ e $\mathbb R^n$ são as duas coisas, e há conjuntos que não são nenhuma.</p>` },
      { tipo: 'def', titulo: 'Limitado e compacto', modelo: 'bolas', estado: { conj: 'taca', a: [0.2, 0.5], e: 0.3, mostrar: true },
        texto: R`<p>$A$ é <b>limitado</b> se existe $R>0$ com $A\subset B_R(0)$. $A$ é <b>compacto</b> se é fechado e limitado.</p><p>Os compactos são os conjuntos onde vale o teorema de Weierstrass (matéria 5): uma função contínua num compacto tem máximo e mínimo.</p>` },
      { tipo: 'def', titulo: 'Sucessões e convergência', modelo: 'sucessoes', estado: { n: 12 },
        texto: R`<p>Uma sucessão em $\mathbb R^n$ é $(x_k)_{k\in\mathbb N}$ com $x_k\in\mathbb R^n$. Converge para $a$ se</p>$$\forall\varepsilon>0\ \exists p\in\mathbb N:\ k>p\Rightarrow\|x_k-a\|<\varepsilon,$$<p>ou seja, a partir de certa ordem todos os termos estão em $B_\varepsilon(a)$.</p>` },
      { tipo: 'prop', titulo: 'Converge coordenada a coordenada', modelo: 'sucessoes', estado: { n: 30 },
        texto: R`<p>$x_k\to a$ em $\mathbb R^n$ se e só se cada coordenada converge: $x_{k,i}\to a_i$, $i=1,\dots,n$.</p>`,
        demo: R`<p>$|x_{k,i}-a_i|\le\|x_k-a\|$ dá uma implicação. Para a outra, $\|x_k-a\|\le|x_{k,1}-a_1|+\dots+|x_{k,n}-a_n|$, e uma soma de $n$ termos que tendem para $0$ tende para $0$.</p>` },
      { tipo: 'teo', titulo: 'Fecho por sucessões', modelo: 'sucessoes', estado: { n: 40 },
        texto: R`<p>$a\in\overline A$ se e só se existe uma sucessão de pontos de $A$ que converge para $a$.</p><p>Consequência: $A$ é fechado se e só se o limite de qualquer sucessão convergente de pontos de $A$ está em $A$.</p>`,
        demo: R`<p>Se $a\in\overline A$, cada bola $B_{1/k}(a)$ tem um ponto $x_k\in A$; então $\|x_k-a\|<1/k\to0$. Se $x_k\to a$ com $x_k\in A$, toda a bola de centro $a$ contém termos da sucessão, logo pontos de $A$: $a$ é interior ou fronteiro.</p>` },
      { tipo: 'teo', titulo: 'Bolzano–Weierstrass', modelo: 'sucessoes', estado: { n: 40 },
        texto: R`<p>Toda a sucessão limitada em $\mathbb R^n$ tem uma subsucessão convergente.</p><p>Por isso, $A$ é compacto se e só se toda a sucessão de pontos de $A$ tem uma subsucessão que converge para um ponto de $A$.</p>`,
        demo: R`<p>Em $\mathbb R$ é o teorema de CDI I. Em $\mathbb R^n$ aplica-se coordenada a coordenada: extrai-se uma subsucessão em que a 1.ª coordenada converge, dessa uma em que a 2.ª converge, e assim sucessivamente.</p>` },
      { tipo: 'ex', titulo: 'Um exemplo completo', modelo: 'bolas', estado: { conj: 'furado', a: [0.02, 0.02], e: 0.25, mostrar: true },
        texto: R`<p>$A=\{(x;y): 0<x^2+y^2\le1\}$: $\operatorname{int}A=\{0<x^2+y^2<1\}$, $\partial A=\{x^2+y^2=1\}\cup\{(0;0)\}$, $\overline A=\{x^2+y^2\le1\}$.</p><p>A sucessão $\big(\tfrac1k;0\big)$ está em $A$ e converge para $(0;0)\notin A$: confirma que $A$ não é fechado. É limitado, mas não é compacto.</p>` },
    ],
    aquecimento: (C.antigos.topologia || {}).testa || [],
    exercicios: [
      { titulo: 'Interior, fronteira e fecho', tipo: 'classificar um conjunto', gerar: 'coroa', modelo: 'bolas',
        enunciado: R`<p>Seja $A=\{(x;y)\in\mathbb R^2:\ 1<x^2+y^2\le4,\ y\ge0\}$. Determine $\operatorname{int}A$, $\partial A$ e $\overline A$. $A$ é aberto? Fechado? Limitado? Compacto?</p>`,
        dicas: [R`Desenha primeiro: é meia coroa circular.`, R`Desigualdades estritas dão o interior; trocá-las por $\le$ dá o fecho.`, R`Um ponto com $y=0$ e $1<x^2\le4$ está em $A$ mas não é interior.`],
        passos: [R`$A$ é a metade superior da coroa entre as circunferências de raios $1$ e $2$.`, R`$\operatorname{int}A=\{1<x^2+y^2<4,\ y>0\}$.`, R`$\overline A=\{1\le x^2+y^2\le4,\ y\ge0\}$.`, R`$\partial A=\overline A\setminus\operatorname{int}A$: os dois arcos de circunferência ($y\ge0$) e os segmentos $\{y=0,\ 1\le|x|\le2\}$.`, R`Não é aberto (contém, por exemplo, $(2;0)\in\partial A$). Não é fechado ($(1;0)\in\partial A$ e $(1;0)\notin A$). É limitado ($A\subset B_3(0)$). Não é compacto.`],
        solucao: R`<p>$\operatorname{int}A=\{1<x^2+y^2<4,\ y>0\}$, $\overline A=\{1\le x^2+y^2\le4,\ y\ge0\}$, $\partial A$ = arcos de raio $1$ e $2$ com $y\ge0$ e segmentos $\{y=0,\ 1\le|x|\le2\}$. Nem aberto nem fechado; limitado; não compacto.</p>` },
      { titulo: 'Limite de uma sucessão em ℝ²', tipo: 'sucessões', gerar: 'sucessao',
        enunciado: R`<p>Estude a convergência de $x_k=\Big(\dfrac{(-1)^k}{k}\,;\ \Big(1+\dfrac2k\Big)^{k}\Big)$.</p>`,
        dicas: [R`Converge em $\mathbb R^2$ se e só se cada coordenada converge.`, R`$\big(1+\tfrac ak\big)^k\to e^a$.`],
        passos: [R`1.ª coordenada: $\big|\tfrac{(-1)^k}{k}\big|=\tfrac1k\to0$.`, R`2.ª coordenada: $\big(1+\tfrac2k\big)^k\to e^2$.`, R`Logo $x_k\to(0;e^2)$.`],
        solucao: R`<p>$x_k\to(0;\,e^2)$.</p>` },
      { titulo: 'A bola aberta é um conjunto aberto', tipo: 'demonstração',
        enunciado: R`<p>Mostre que $B_r(a)$ é aberto em $\mathbb R^n$.</p>`,
        dicas: [R`Dado $x\in B_r(a)$, procura um raio $\varepsilon$ tal que $B_\varepsilon(x)\subset B_r(a)$.`, R`Experimenta $\varepsilon=r-\|x-a\|$ e usa a desigualdade triangular.`],
        passos: [R`Seja $x\in B_r(a)$ e $\varepsilon=r-\|x-a\|>0$.`, R`Se $y\in B_\varepsilon(x)$: $\|y-a\|\le\|y-x\|+\|x-a\|<\varepsilon+\|x-a\|=r$.`, R`Logo $B_\varepsilon(x)\subset B_r(a)$: todo o ponto de $B_r(a)$ é interior.`],
        solucao: R`<p>Com $\varepsilon=r-\|x-a\|$, a desigualdade triangular dá $B_\varepsilon(x)\subset B_r(a)$; portanto $B_r(a)=\operatorname{int}B_r(a)$.</p>` },
      { titulo: 'Um conjunto de pontos isolados', tipo: 'classificar um conjunto',
        enunciado: R`<p>Seja $A=\{(\tfrac1k;\,0):\ k\in\mathbb N\}$. Determine $\operatorname{int}A$, $\partial A$ e $\overline A$, e diga se $A$ é fechado. E $A\cup\{(0;0)\}$?</p>`,
        dicas: [R`Uma bola à volta de um ponto de $A$ tem sempre pontos fora de $A$.`, R`$(0;0)$ é limite de uma sucessão de pontos de $A$.`],
        passos: [R`Nenhuma bola cabe em $A$ (é um conjunto de pontos soltos): $\operatorname{int}A=\emptyset$.`, R`Cada ponto de $A$ é fronteiro; $(0;0)$ também, porque $(\tfrac1k;0)\to(0;0)$.`, R`$\partial A=\overline A=A\cup\{(0;0)\}$.`, R`$A$ não é fechado ($(0;0)\in\partial A\setminus A$). $A\cup\{(0;0)\}$ é fechado e limitado: compacto.`],
        solucao: R`<p>$\operatorname{int}A=\emptyset$, $\partial A=\overline A=A\cup\{(0;0)\}$. $A$ não é fechado; $A\cup\{(0;0)\}$ é compacto.</p>` },
      { titulo: 'Um sólido compacto', tipo: 'compacidade', gerar: 'solido',
        enunciado: R`<p>Mostre que $K=\{(x;y;z)\in\mathbb R^3:\ x^2+y^2\le z\le 1\}$ é compacto.</p>`,
        dicas: [R`Fechado: escreve $K$ com desigualdades não estritas entre funções contínuas.`, R`Limitado: de $z\le1$ e $x^2+y^2\le z$ tira-se $x^2+y^2\le1$ e $0\le z\le1$.`],
        passos: [R`$K=\{g_1\le0\}\cap\{g_2\le0\}$ com $g_1=x^2+y^2-z$ e $g_2=z-1$ contínuas: é fechado (o limite de uma sucessão em $K$ satisfaz as mesmas desigualdades).`, R`Em $K$: $0\le x^2+y^2\le z\le1$, logo $\|(x;y;z)\|^2\le1+1=2$.`, R`$K\subset B_2(0)$ é limitado. Fechado e limitado: compacto.`],
        solucao: R`<p>$K$ é fechado (desigualdades $\le$ com funções contínuas) e limitado ($\|p\|\le\sqrt2$): é compacto.</p>` },
    ],
    geradores: {
      coroa() {
        const r1 = C.ri(1, 3), r2 = r1 + C.ri(1, 2), lado = C.escolher([['y\\ge0', 'y>0', 'y=0', '|x|'], ['x\\ge0', 'x>0', 'x=0', '|y|']]);
        const [ge, gt, eq, abs] = lado;
        return { titulo: 'Interior, fronteira e fecho', tipo: 'classificar um conjunto', modelo: 'bolas',
          enunciado: R`<p>Seja $A=\{(x;y)\in\mathbb R^2:\ ${r1 * r1}<x^2+y^2\le${r2 * r2},\ ${ge}\}$. Determine $\operatorname{int}A$, $\partial A$ e $\overline A$. $A$ é aberto? Fechado? Limitado? Compacto?</p>`,
          dicas: [R`É meia coroa entre as circunferências de raios $${r1}$ e $${r2}$.`, R`Desigualdades estritas dão o interior; trocá-las por $\le$ dá o fecho.`],
          passos: [R`$\operatorname{int}A=\{${r1 * r1}<x^2+y^2<${r2 * r2},\ ${gt}\}$.`, R`$\overline A=\{${r1 * r1}\le x^2+y^2\le${r2 * r2},\ ${ge}\}$.`, R`$\partial A$: os dois arcos (raios $${r1}$ e $${r2}$, com $${ge}$) e os segmentos $\{${eq},\ ${r1}\le${abs}\le${r2}\}$.`, R`Não é aberto (contém pontos do arco de raio $${r2}$). Não é fechado (os pontos do arco de raio $${r1}$ são fronteiros e não estão em $A$). Limitado. Não compacto.`],
          solucao: R`<p>$\operatorname{int}A=\{${r1 * r1}<x^2+y^2<${r2 * r2},\ ${gt}\}$, $\overline A=\{${r1 * r1}\le x^2+y^2\le${r2 * r2},\ ${ge}\}$. Nem aberto nem fechado; limitado; não compacto.</p>` };
      },
      sucessao() {
        const a = C.ri(1, 4), b = C.ri(2, 5), s = C.escolher([1, -1]);
        return { titulo: 'Limite de uma sucessão em ℝ²', tipo: 'sucessões',
          enunciado: R`<p>Estude a convergência de $x_k=\Big(\dfrac{${b}k+(-1)^k}{k}\,;\ \Big(1${s > 0 ? '+' : '-'}\dfrac{${a}}{k}\Big)^{k}\Big)$.</p>`,
          dicas: [R`Converge em $\mathbb R^2$ se e só se cada coordenada converge.`, R`$\big(1+\tfrac ck\big)^k\to e^c$.`],
          passos: [R`1.ª coordenada: $${b}+\tfrac{(-1)^k}{k}\to${b}$.`, R`2.ª coordenada: $\big(1${s > 0 ? '+' : '-'}\tfrac{${a}}{k}\big)^k\to e^{${s > 0 ? '' : '-'}${a}}$.`, R`Logo $x_k\to(${b};\,e^{${s > 0 ? '' : '-'}${a}})$.`],
          solucao: R`<p>$x_k\to(${b};\,e^{${s > 0 ? '' : '-'}${a}})$.</p>` };
      },
      solido() {
        const a = C.ri(1, 3), h = C.ri(1, 4);
        return { titulo: 'Um sólido compacto', tipo: 'compacidade',
          enunciado: R`<p>Mostre que $K=\{(x;y;z)\in\mathbb R^3:\ ${a === 1 ? '' : a}(x^2+y^2)\le z\le ${h}\}$ é compacto.</p>`,
          dicas: [R`Fechado: desigualdades não estritas entre funções contínuas.`, R`Limitado: tira de $z\le${h}$ um majorante para $x^2+y^2$.`],
          passos: [R`$K=\{${a === 1 ? '' : a}(x^2+y^2)-z\le0\}\cap\{z-${h}\le0\}$, com funções contínuas: é fechado.`, R`Em $K$: $0\le z\le${h}$ e $x^2+y^2\le${C.frac(h, a)}$.`, R`$\|(x;y;z)\|^2\le${C.frac(h, a)}+${h * h}$: $K$ é limitado. Logo é compacto.`],
          solucao: R`<p>Fechado e limitado ($\|p\|^2\le${C.frac(h, a)}+${h * h}$): compacto.</p>` };
      },
    },
  });
})();
