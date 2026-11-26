/* Programa · 10. Green. */
(function () {
  const R = String.raw, C = window.CDI, A = C.antigos;
  const VORT = '(-y/(x^2+y^2); x/(x^2+y^2))';
  C.materia({
    id: 'green', ordem: 10, grupo: 'Cálculo integral', curto: 'Teorema de Green', paginas: 'pp. 49–53',
    titulo: 'Teorema de Green',
    resumo: R`A circulação na fronteira é o integral duplo do rotacional; áreas por integrais de linha; o que acontece com buracos e singularidades.`,
    modelos: ['green.green', 'green.area', 'novo2.trabalho'],
    aprender: [
      { tipo: 'def', titulo: 'Fronteira orientada positivamente', modelo: 'green', estado: { F: '(-y; x)', c: 'circ', R: 1, t: 0.6, cx: 0, cy: 0 },
        texto: R`<p>Seja $D\subset\mathbb R^2$ limitado, com fronteira formada por curvas fechadas seccionalmente $C^1$. A fronteira está <b>orientada positivamente</b> se, ao percorrê-la, $D$ fica sempre à esquerda: sentido direto na curva de fora, sentido horário nas curvas dos buracos.</p>` },
      { tipo: 'teo', titulo: 'Teorema de Green', modelo: 'green', estado: { F: '(-y^3; x^3)', c: 'circ', R: 1, t: 1, cx: 0, cy: 0 },
        texto: R`<p>Se $P,Q$ são de classe $C^1$ num aberto que contém $\overline D$ e $\partial D$ está orientada positivamente,</p>$$\oint_{\partial D}P\,dx+Q\,dy=\iint_D\Big(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\Big)dx\,dy.$$<p>As duas contas aparecem nas leituras.</p>`,
        demo: R`<p>Para $D=\{a\le x\le b,\ c(x)\le y\le d(x)\}$: $-\iint_D\frac{\partial P}{\partial y}=-\int_a^b\big[P(x;d(x))-P(x;c(x))\big]dx$, que é $\oint P\,dx$ (os lados verticais não contribuem para $\int P\,dx$). Do mesmo modo, com $D$ do tipo II, $\iint_D\frac{\partial Q}{\partial x}=\oint Q\,dy$. Regiões gerais partem-se em regiões destes tipos: as fronteiras interiores percorrem-se duas vezes em sentidos opostos e cancelam-se.</p>` },
      { tipo: 'ex', titulo: 'Circulação = 2 × área', modelo: 'green', estado: { F: '(-y; x)', c: 'quad', R: 0.8, t: 1, cx: 0.2, cy: 0.1 },
        texto: R`<p>Com $F=(-y;x)$: $\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}=2$, logo $\oint_{\partial D}F\cdot dr=2\,\operatorname{área}(D)$, para qualquer $D$.</p>` },
      { tipo: 'cor', titulo: 'Áreas com integrais de linha', modelo: 'area', estado: { fo: 'elipse', a: 1.8, b: 1 },
        texto: R`<p>Escolhendo $P,Q$ com $\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}=1$:</p>$$\operatorname{área}(D)=\oint_{\partial D}x\,dy=-\oint_{\partial D}y\,dx=\frac12\oint_{\partial D}x\,dy-y\,dx.$$<p>Elipse: $\frac12\int_0^{2\pi}ab(\cos^2t+\operatorname{sen}^2t)\,dt=\pi ab$.</p>` },
      { tipo: 'ex', titulo: 'Astroide e cardioide', modelo: 'area', estado: { fo: 'estrela', a: 1.8 },
        texto: R`<p>Para curvas parametrizadas, a fórmula da área evita escrever $D$ com desigualdades. Astroide $x=a\cos^3t$, $y=a\operatorname{sen}^3t$: $\frac12\oint x\,dy-y\,dx=\frac{3\pi a^2}{8}$.</p>` },
      { tipo: 'contra', titulo: 'A hipótese C¹ em D importa', modelo: 'green', estado: { F: VORT, c: 'circ', R: 1, t: 1, cx: 0, cy: 0 },
        texto: R`<p>Vórtice $F=\frac{(-y;x)}{x^2+y^2}$: o rotacional é $0$ fora da origem, mas a circulação na circunferência unitária é $2\pi$. Não há contradição: $F$ não é $C^1$ (nem está definido) na origem, que está em $D$.</p>`,
        experimenta: R`desloca a curva para que a origem fique de fora: a circulação passa a $0$.` },
      { tipo: 'teo', titulo: 'Regiões com buracos', modelo: 'trabalho', estado: { F: VORT, g: '(2cos t; sen t)', ga: '0', gb: '2pi', phi: '', t: 1 },
        texto: R`<p>Se $D$ tem buracos, $\partial D$ inclui as curvas dos buracos percorridas no sentido horário. Consequência: se $\frac{\partial Q}{\partial x}=\frac{\partial P}{\partial y}$ entre duas curvas $C_1$ e $C_2$ (ambas no sentido direto, uma dentro da outra), então $\oint_{C_1}=\oint_{C_2}$.</p><p>Por isso o vórtice dá $2\pi$ em <b>qualquer</b> curva simples à volta da origem: aqui, numa elipse.</p>` },
      { tipo: 'obs', titulo: 'O rotacional mede a rotação', modelo: 'green', estado: { F: '(-y^3; x^3)', c: 'circ', R: 1, t: 1, cx: 0, cy: 0, anim: true },
        texto: R`<p>Uma pequena roda de pás num fluido com velocidade $F$ gira com velocidade angular $\frac12\big(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\big)$. Green diz que somar estas rotações por toda a região dá a circulação à volta da fronteira.</p>` },
    ],
    aquecimento: (A.green || {}).testa || [],
    exercicios: [
      { titulo: 'Circulação numa circunferência', tipo: 'Green', gerar: 'circ', modelo: 'green', estado: { F: '(x^2-y; x+y^3)', c: 'circ', R: 1, t: 1 },
        enunciado: R`<p>Calcule $\oint_C(x^2-y)\,dx+(x+y^3)\,dy$, onde $C$ é a circunferência $x^2+y^2=4$ percorrida no sentido direto.</p>`,
        dicas: [R`Green: $\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}$ é constante.`],
        passos: [R`$P=x^2-y$, $Q=x+y^3$, ambos $C^1$ em $\mathbb R^2$.`, R`$\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}=1-(-1)=2$.`, R`$\oint=\iint_D2=2\cdot4\pi=8\pi$.`],
        solucao: R`<p>$8\pi$.</p>` },
      { titulo: 'Área debaixo de um arco de cicloide', tipo: 'área com Green',
        enunciado: R`<p>Use o teorema de Green para calcular a área da região limitada pelo eixo dos $x$ e pelo arco de cicloide $g(t)=(t-\operatorname{sen}t;\,1-\cos t)$, $t\in[0;2\pi]$.</p>`,
        dicas: [R`$\operatorname{área}=-\oint y\,dx$; no eixo dos $x$, $y=0$.`, R`A fronteira positiva percorre o eixo de $0$ a $2\pi$ e volta pela cicloide (de $t=2\pi$ para $t=0$).`],
        passos: [R`No segmento do eixo, $y=0$: contribui $0$.`, R`Na cicloide, percorrida de $t=2\pi$ a $0$: $-\int_{2\pi}^{0}(1-\cos t)(1-\cos t)\,dt=\int_0^{2\pi}(1-\cos t)^2dt$.`, R`$=\int_0^{2\pi}(1-2\cos t+\cos^2t)\,dt=2\pi+\pi=3\pi$.`],
        solucao: R`<p>$3\pi$.</p>` },
      { titulo: 'Área da astroide', tipo: 'área com Green', modelo: 'area', estado: { fo: 'estrela', a: 1.8 },
        enunciado: R`<p>Calcule a área limitada pela astroide $x^{2/3}+y^{2/3}=a^{2/3}$.</p>`,
        dicas: [R`Parametriza: $x=a\cos^3t$, $y=a\operatorname{sen}^3t$.`, R`$\operatorname{área}=\frac12\oint x\,dy-y\,dx$.`],
        passos: [R`$xy'-yx'=3a^2\cos^4t\operatorname{sen}^2t+3a^2\operatorname{sen}^4t\cos^2t=3a^2\cos^2t\operatorname{sen}^2t$.`, R`$\int_0^{2\pi}\cos^2t\operatorname{sen}^2t\,dt=\frac14\int_0^{2\pi}\operatorname{sen}^22t\,dt=\frac\pi4$.`, R`$\operatorname{área}=\frac12\cdot3a^2\cdot\frac\pi4=\frac{3\pi a^2}8$.`],
        solucao: R`<p>$\frac{3\pi a^2}{8}$.</p>` },
      { titulo: 'Vórtice numa elipse', tipo: 'Green com singularidade', modelo: 'trabalho', estado: { F: VORT, g: '(2cos t; sen t)', ga: '0', gb: '2pi', phi: '' },
        enunciado: R`<p>Calcule $\oint_E\frac{-y\,dx+x\,dy}{x^2+y^2}$, sendo $E$ a elipse $\frac{x^2}4+y^2=1$ no sentido direto.</p>`,
        dicas: [R`Não apliques Green diretamente: o campo não está definido na origem.`, R`Aplica Green à região entre a elipse e uma circunferência pequena de raio $\varepsilon$.`],
        passos: [R`Fora da origem, $\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}=0$.`, R`Na região entre $E$ e $C_\varepsilon$ (com $C_\varepsilon$ no sentido horário), Green dá $\oint_E-\oint_{C_\varepsilon}=0$.`, R`Em $C_\varepsilon$ (sentido direto): $\oint=\int_0^{2\pi}1\,dt=2\pi$.`],
        solucao: R`<p>$2\pi$.</p>` },
      { titulo: 'Verificar Green num quadrado', tipo: 'Green',
        enunciado: R`<p>Verifique o teorema de Green para $F=(xy;\,x^2)$ no quadrado $[0;1]^2$.</p>`,
        dicas: [R`Percorre os quatro lados no sentido direto: baixo, direita, cima, esquerda.`],
        passos: [R`$\iint(2x-x)\,dx\,dy=\int_0^1\int_0^1x\,dx\,dy=\frac12$.`, R`Baixo ($y=0$): $\int P\,dx=0$. Direita ($x=1$, $y:0\to1$): $\int Q\,dy=1$.`, R`Cima ($y=1$, $x:1\to0$): $\int_1^0x\,dx=-\frac12$. Esquerda ($x=0$): $Q=0$, dá $0$.`, R`Soma: $0+1-\frac12+0=\frac12$. Confere.`],
        solucao: R`<p>Os dois lados valem $\frac12$.</p>` },
    ],
    geradores: {
      circ() {
        const a = C.ri(1, 3), b = C.ri(1, 3), r = C.ri(1, 3);
        return { titulo: 'Circulação numa circunferência', tipo: 'Green', modelo: 'green', estado: { F: `(x^2-${a}y; ${b}x+y^3)`, c: 'circ', R: 1, t: 1 },
          enunciado: R`<p>Calcule $\oint_C(x^2-${a === 1 ? '' : a}y)\,dx+(${b === 1 ? '' : b}x+y^3)\,dy$, onde $C$ é $x^2+y^2=${r * r}$ no sentido direto.</p>`,
          dicas: [R`$\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}$ é constante.`],
          passos: [R`$\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}=${b}+${a}=${a + b}$.`, R`$\oint=${a + b}\cdot\pi\cdot${r * r}=${(a + b) * r * r}\pi$.`],
          solucao: R`<p>$${(a + b) * r * r}\pi$.</p>` };
      },
    },
  });
})();
