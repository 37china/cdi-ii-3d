/* Programa · 3. Teorema de valor intermédio. */
(function () {
  const R = String.raw, C = window.CDI;
  C.materia({
    id: 'tvi', ordem: 3, grupo: 'Cálculo diferencial', curto: 'Valor intermédio',
    titulo: 'Teorema do valor intermédio',
    resumo: R`Caminhos, conjuntos conexos por arcos e o teorema de Bolzano em $\mathbb R^n$: quando uma função contínua tem de passar por todos os valores intermédios.`,
    modelos: ['novo.tvi', 'novo.desenhar'],
    aprender: [
      { tipo: 'def', titulo: 'Caminho', modelo: 'tvi', estado: { f: 'x^2+y^2-1', D: '', A: [-0.3, -0.4], B: [1.3, 0.8], K: [0.9, -0.9], c: 0.5 },
        texto: R`<p>Um <b>caminho</b> em $D\subset\mathbb R^n$ é uma função contínua $\gamma:[a;b]\to D$. Liga $\gamma(a)$ a $\gamma(b)$.</p><p>Aqui o caminho (branco) é um arco de parábola que podes dobrar arrastando o ponto de controlo.</p>` },
      { tipo: 'def', titulo: 'Conjunto conexo por arcos', modelo: 'tvi', estado: { f: '1/x', D: 'x ≠ 0', A: [-1.3, 0.4], B: [1.3, -0.3], K: [0, 1.2], c: 0.5 },
        texto: R`<p>$D$ é <b>conexo por arcos</b> se quaisquer dois pontos de $D$ podem ser ligados por um caminho contido em $D$.</p><p>Exemplos: $\mathbb R^n$, bolas e qualquer conjunto convexo (o segmento $\gamma(t)=A+t(B-A)$ serve). Contraexemplo: $\{(x;y): x\ne0\}$, partido em dois pela reta $x=0$.</p>` },
      { tipo: 'teo', titulo: 'Teorema do valor intermédio', modelo: 'tvi', estado: { f: 'x^2+y^2-1', D: '', A: [-0.3, -0.4], B: [1.3, 0.8], K: [0.9, -0.9], c: 0.5 },
        texto: R`<p>Seja $f:D\subset\mathbb R^n\to\mathbb R$ <b>contínua</b>, com $D$ <b>conexo por arcos</b>. Se $A,B\in D$ e $c$ está entre $f(A)$ e $f(B)$, existe $x\in D$ com $f(x)=c$.</p>`,
        demo: R`<p>Seja $\gamma:[0;1]\to D$ um caminho de $A$ a $B$ e $h=f\circ\gamma$. $h$ é contínua em $[0;1]$ (composta de contínuas), $h(0)=f(A)$ e $h(1)=f(B)$. Pelo teorema de Bolzano existe $t$ com $h(t)=c$; o ponto é $x=\gamma(t)$.</p>`,
        experimenta: R`dobra o caminho: o número de pontos muda, mas nunca é $0$.` },
      { tipo: 'ex', titulo: 'Qualquer caminho atravessa a circunferência', modelo: 'tvi', estado: { f: 'x^2+y^2-1', D: '', A: [-0.3, -0.4], B: [1.3, 0.8], K: [-1.6, 1.4], c: 0.36 },
        texto: R`<p>Com $f=x^2+y^2-1$, $f(A)<0<f(B)$: qualquer caminho de $A$ a $B$ tem um ponto com $f=0$, isto é, cruza a circunferência unitária.</p>` },
      { tipo: 'contra', titulo: 'Se D não é conexo por arcos', modelo: 'tvi', estado: { f: '1/x', D: 'x ≠ 0', A: [-1.3, 0.4], B: [1.3, -0.3], K: [0, 1.2], c: 0.5 },
        texto: R`<p>$f=\frac1x$ é contínua em $D=\{x\ne0\}$, $f(A)<0<f(B)$, e no entanto nunca vale $0$. O teorema não se aplica porque não há caminho de $A$ a $B$ dentro de $D$.</p>` },
      { tipo: 'contra', titulo: 'Se f não é contínua', modelo: 'tvi', estado: { f: { r: [['1', 'x > 0']], z: '-1' }, D: '', A: [-1.3, 0.4], B: [1.3, -0.3], K: [0, 1.2], c: 0.5 },
        texto: R`<p>$f=1$ para $x>0$ e $f=-1$ para $x\le0$: $D=\mathbb R^2$ é conexo por arcos, mas $f$ só toma os valores $\pm1$. Falha a continuidade.</p>` },
      { tipo: 'cor', titulo: 'A imagem é um intervalo', modelo: 'desenhar', estado: { f: 'xy e^(-x^2-y^2)', c: 0.5, L: 2.2 },
        texto: R`<p>Se $f$ é contínua e $D$ é conexo por arcos, $f(D)$ é um intervalo. Juntando o teorema de Weierstrass (matéria 5): se $D$ também é compacto, $f(D)=[\min f;\max f]$.</p><p>Aqui $f=xye^{-x^2-y^2}$ em $\mathbb R^2$: toma todos os valores entre o mínimo $-\frac1{2e}$ e o máximo $\frac1{2e}$.</p>` },
      { tipo: 'met', titulo: 'Como se usa nos exercícios', modelo: 'tvi', estado: { f: 'x^3+y^3+xy-1', D: '', A: [0, 0], B: [1, 1], K: [0.5, 0.5], c: 0.333 },
        texto: R`<p>1. Escolhe dois pontos onde $f-c$ tem sinais contrários. 2. Escolhe um caminho entre eles dentro de $D$ (muitas vezes um segmento). 3. Verifica a continuidade de $h(t)=f(\gamma(t))$ e aplica Bolzano.</p><p>Aqui: $f(0;0)=-1<0<2=f(1;1)$, logo o segmento de $(0;0)$ a $(1;1)$ tem um ponto com $x^3+y^3+xy=1$.</p>` },
    ],
    aquecimento: [
      { p: R`$f$ é contínua em $D=\mathbb R^2\setminus\{(0;0)\}$, $f(1;0)=-2$ e $f(-1;0)=3$. Pode concluir-se que $f$ se anula em $D$?`, op: [R`Sim: $D$ é conexo por arcos`, R`Não: $D$ não é conexo por arcos`, R`Só se $f$ for diferenciável`, R`Só se $D$ for compacto`], certa: 0, porque: R`Tirar um ponto ao plano não o desliga: há sempre um caminho que contorna a origem. Pelo teorema do valor intermédio, $f$ anula-se em $D$.` },
      { p: R`Qual destes conjuntos <b>não</b> é conexo por arcos?`, op: [R`$\{x^2+y^2<1\}$`, R`$\{x^2+y^2\ne1\}$`, R`$\{y\ge x^2\}$`, R`$\mathbb R^3\setminus\{(0;0;0)\}$`], certa: 1, porque: R`Em $\{x^2+y^2\ne1\}$ um caminho de dentro para fora do círculo teria de atravessar a circunferência, que não está no conjunto.` },
      { p: R`Na demonstração do teorema do valor intermédio em $\mathbb R^n$, a que função se aplica o teorema de Bolzano?`, op: [R`a $f$`, R`a $f\circ\gamma$, com $\gamma$ um caminho de $A$ a $B$`, R`a $\nabla f$`, R`a $\|f\|$`], certa: 1, porque: R`$h=f\circ\gamma:[0;1]\to\mathbb R$ é uma função real de variável real contínua, onde Bolzano se aplica.` },
    ],
    exercicios: [
      { titulo: 'Uma equação com solução num segmento', tipo: 'valor intermédio', gerar: 'segmento', modelo: 'tvi', estado: { f: 'x^3+y^3+xy-1', D: '', A: [0, 0], B: [1, 1], K: [0.5, 0.5], c: 0.333 },
        enunciado: R`<p>Mostre que a equação $x^3+y^3+xy=1$ tem pelo menos uma solução no segmento de $(0;0)$ a $(1;1)$.</p>`,
        dicas: [R`Parametriza o segmento: $\gamma(t)=(t;t)$, $t\in[0;1]$.`, R`Aplica Bolzano a $h(t)=f(\gamma(t))-1$.`],
        passos: [R`$h(t)=t^3+t^3+t^2-1=2t^3+t^2-1$, contínua em $[0;1]$.`, R`$h(0)=-1<0$ e $h(1)=2>0$.`, R`Por Bolzano existe $t_0\in\,]0;1[$ com $h(t_0)=0$: o ponto $(t_0;t_0)$ é solução.`],
        solucao: R`<p>$h(t)=2t^3+t^2-1$ passa de $-1$ a $2$ em $[0;1]$: há $t_0$ com $h(t_0)=0$, e $(t_0;t_0)$ é solução.</p>` },
      { titulo: 'Dois zeros numa circunferência', tipo: 'valor intermédio',
        enunciado: R`<p>$f:\mathbb R^2\to\mathbb R$ é contínua, $f(1;0)=-1$ e $f(0;1)=3$. Mostre que $f$ se anula em pelo menos <b>dois</b> pontos da circunferência $x^2+y^2=1$.</p>`,
        dicas: [R`Há dois arcos da circunferência que ligam $(1;0)$ a $(0;1)$.`],
        passos: [R`Arco 1: $\gamma_1(t)=(\cos t;\operatorname{sen}t)$, $t\in[0;\frac\pi2]$. Arco 2: $\gamma_2(t)=(\cos t;\operatorname{sen}t)$, $t\in[\frac\pi2;2\pi]$ (dá a volta pelo outro lado).`, R`Em cada arco, $h_i=f\circ\gamma_i$ é contínua e muda de sinal entre $-1$ e $3$.`, R`Bolzano dá um zero em cada arco. Os arcos só se tocam em $(1;0)$ e $(0;1)$, onde $f\ne0$: os dois zeros são diferentes.`],
        solucao: R`<p>Um zero em cada um dos dois arcos que ligam $(1;0)$ a $(0;1)$; são distintos porque os arcos só partilham os extremos.</p>` },
      { titulo: 'Quando o domínio está partido', tipo: 'contraexemplo',
        enunciado: R`<p>Seja $f(x;y)=\dfrac{1}{x^2+y^2-1}$ em $D=\{(x;y): x^2+y^2\ne1\}$. Tem-se $f(0;0)=-1$ e $f(2;0)=\frac13$. Existe $(x;y)\in D$ com $f(x;y)=0$? Isto contradiz o teorema do valor intermédio?</p>`,
        dicas: [R`Uma fração com numerador $1$ pode anular-se?`, R`Verifica as hipóteses: $D$ é conexo por arcos?`],
        passos: [R`$f$ nunca se anula (o numerador é $1$).`, R`$f$ é contínua em $D$, mas $D$ não é conexo por arcos: um caminho de $(0;0)$ a $(2;0)$ tem de atravessar $x^2+y^2=1$ (aplica o TVI a $x^2+y^2$ ao longo do caminho).`, R`Não há contradição: falha uma hipótese.`],
        solucao: R`<p>Não existe; não há contradição porque $D$ não é conexo por arcos.</p>` },
      { titulo: 'Um valor atingido numa bola', tipo: 'valor intermédio', gerar: 'bola',
        enunciado: R`<p>Mostre que existe $(x;y)$ com $x^2+y^2<1$ e $xe^{y}-y=\frac12$.</p>`,
        dicas: [R`Procura dois pontos da bola onde $f-\frac12$ tenha sinais contrários.`],
        passos: [R`$f(0;0)=0<\frac12$ e $f(0{,}9;0)=0{,}9>\frac12$.`, R`O segmento entre eles está na bola, que é conexa por arcos; $f$ é contínua.`, R`Pelo teorema do valor intermédio há um ponto do segmento com $f=\frac12$.`],
        solucao: R`<p>Entre $(0;0)$ ($f=0$) e $(0{,}9;0)$ ($f=0{,}9$) há um ponto com $f=\frac12$.</p>` },
      { titulo: 'A imagem de uma função', tipo: 'imagem', modelo: 'desenhar', estado: { f: '(x+y+z)/(1+x^2+y^2+z^2)', c: 0.5, L: 2 },
        enunciado: R`<p>Determine a imagem de $f(x;y;z)=\dfrac{x+y+z}{1+x^2+y^2+z^2}$, $(x;y;z)\in\mathbb R^3$.</p>`,
        dicas: [R`Majora $|x+y+z|$ com Cauchy–Schwarz: $|x+y+z|\le\sqrt3\,\|p\|$.`, R`$\frac{r}{1+r^2}\le\frac12$ para $r\ge0$.`, R`A imagem é um intervalo (TVI). Vê se os extremos são atingidos.`],
        passos: [R`$|f(p)|\le\frac{\sqrt3\,r}{1+r^2}\le\frac{\sqrt3}{2}$, com $r=\|p\|$.`, R`Em $p=\big(\frac1{\sqrt3};\frac1{\sqrt3};\frac1{\sqrt3}\big)$: $f=\frac{\sqrt3}{1+1}=\frac{\sqrt3}2$. Com $-p$: $-\frac{\sqrt3}2$.`, R`$f$ é contínua em $\mathbb R^3$, que é conexo por arcos: a imagem é um intervalo que contém $\pm\frac{\sqrt3}2$ e está contido em $\big[-\frac{\sqrt3}2;\frac{\sqrt3}2\big]$.`],
        solucao: R`<p>$f(\mathbb R^3)=\big[-\frac{\sqrt3}{2};\frac{\sqrt3}{2}\big]$.</p>` },
    ],
    geradores: {
      segmento() {
        const a = C.ri(1, 3), b = C.ri(1, 3), c = C.ri(1, 2);
        const k = c + 1, hum = a + b + 1 - k;
        return { titulo: 'Uma equação com solução num segmento', tipo: 'valor intermédio', modelo: 'tvi', estado: { f: `${a}x^3+${b}y^3+xy-${k}`, D: '', A: [0, 0], B: [1, 1], K: [0.5, 0.5], c: k / (hum + k) },
          enunciado: R`<p>Mostre que a equação $${a === 1 ? '' : a}x^3+${b === 1 ? '' : b}y^3+xy=${k}$ tem pelo menos uma solução no segmento de $(0;0)$ a $(1;1)$.</p>`,
          dicas: [R`Parametriza o segmento: $\gamma(t)=(t;t)$.`],
          passos: [R`$h(t)=${a + b}t^3+t^2-${k}$, contínua em $[0;1]$.`, R`$h(0)=-${k}<0$ e $h(1)=${hum}>0$.`, R`Bolzano: existe $t_0\in\,]0;1[$ com $h(t_0)=0$, e $(t_0;t_0)$ é solução.`],
          solucao: R`<p>$h(t)=${a + b}t^3+t^2-${k}$ passa de $-${k}$ a $${hum}$: há solução $(t_0;t_0)$.</p>` };
      },
      bola() {
        const v = C.escolher([[1, 4], [1, 3], [1, 5], [2, 5]]);
        return { titulo: 'Um valor atingido numa bola', tipo: 'valor intermédio',
          enunciado: R`<p>Mostre que existe $(x;y)$ com $x^2+y^2<1$ e $xe^{y}-y=${C.frac(v[0], v[1])}$.</p>`,
          dicas: [R`Procura dois pontos da bola onde $f-${C.frac(v[0], v[1])}$ tenha sinais contrários.`],
          passos: [R`$f(0;0)=0<${C.frac(v[0], v[1])}$ e $f(0{,}9;0)=0{,}9>${C.frac(v[0], v[1])}$.`, R`O segmento entre eles está na bola; $f$ é contínua.`, R`Pelo TVI há um ponto do segmento com $f=${C.frac(v[0], v[1])}$.`],
          solucao: R`<p>Entre $(0;0)$ e $(0{,}9;0)$ há um ponto com $f=${C.frac(v[0], v[1])}$.</p>` };
      },
    },
  });
})();
