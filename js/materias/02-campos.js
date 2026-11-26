/* Programa · 2. Campos escalares e vetoriais. Limite e continuidade. Diferenciabilidade e gradiente. Aplicações. */
(function () {
  const R = String.raw, C = window.CDI;
  const R0 = (e) => ({ r: [[e, '(x;y)≠(0;0)']], z: '0' });
  const A = C.antigos;
  C.materia({
    id: 'campos', ordem: 2, grupo: 'Cálculo diferencial', curto: 'Campos, limites e derivadas', paginas: 'pp. 6–24',
    titulo: 'Campos escalares e vetoriais: limite, continuidade, diferenciabilidade e gradiente',
    resumo: R`Gráficos e conjuntos de nível, limites por caminhos, derivadas parciais e direcionais, a definição de diferenciável, regra da cadeia e gradiente.`,
    modelos: ['novo.desenhar', 'novo.vetorial', 'novo.limite', 'diferenciabilidade.definicao', 'diferenciabilidade.direcional', 'diferenciabilidade.jacobiana', 'cadeia.curva', 'cadeia.matriz', 'gradiente.nivel', 'gradiente.plano'],
    aprender: [
      { tipo: 'def', titulo: 'Campo escalar, gráfico e conjuntos de nível', modelo: 'desenhar', estado: { f: 'x^2-y^2', c: 0.62, L: 1.6 },
        texto: R`<p>Um <b>campo escalar</b> é $f:D\subset\mathbb R^n\to\mathbb R$. O <b>gráfico</b> é $\{(x;f(x)):x\in D\}\subset\mathbb R^{n+1}$ e o <b>conjunto de nível</b> $c$ é $\{x\in D: f(x)=c\}\subset\mathbb R^n$.</p><p>Para $n=2$ o gráfico é uma superfície e os conjuntos de nível são curvas: o corte do gráfico à altura $c$, visto de cima.</p>`,
        experimenta: R`escreve a tua função na caixa e mexe em $c$.` },
      { tipo: 'ex', titulo: 'Em ℝ³ só se veem os níveis', modelo: 'desenhar', estado: { f: 'x^2+y^2-z^2', c: 0.6, z0: 0, L: 1.6 },
        texto: R`<p>Para $f:\mathbb R^3\to\mathbb R$ o gráfico está em $\mathbb R^4$. Desenham-se as <b>superfícies de nível</b> $f=c$: aqui $x^2+y^2-z^2=c$ é um hiperboloide de uma folha ($c>0$), um cone ($c=0$) ou de duas folhas ($c<0$).</p>` },
      { tipo: 'def', titulo: 'Campo vetorial', modelo: 'vetorial', estado: { F: '(-y; x)', p: [0.8, 0.4], linha: true },
        texto: R`<p>Um <b>campo vetorial</b> é $F:D\subset\mathbb R^n\to\mathbb R^m$, $F=(F_1;\dots;F_m)$, com cada $F_i$ um campo escalar. Quando $m=n$ desenha-se pondo o vetor $F(x)$ com a origem no ponto $x$.</p><p>Limites, continuidade e derivadas de $F$ estudam-se componente a componente.</p>` },
      { tipo: 'def', titulo: 'Limite', modelo: 'limite', estado: { f: R0('x^2y/(x^2+y^2)'), L: '0', d: 0.5 },
        texto: R`<p>Seja $a$ um ponto de acumulação de $D$. Diz-se que $\lim_{x\to a}f(x)=L$ se</p>$$\forall\varepsilon>0\ \exists\delta>0:\ x\in D,\ 0<\|x-a\|<\delta\Rightarrow|f(x)-L|<\varepsilon.$$<p>Na vista: para cada $\delta$, $\sup|f-L|$ na circunferência de raio $\delta$ tem de ir para $0$.</p>`,
        experimenta: R`diminui $\delta$ e vê a última linha das leituras.` },
      { tipo: 'prop', titulo: 'Limites por caminhos', modelo: 'limite', estado: { f: R0('xy/(x^2+y^2)'), L: '0', th: 0.6 },
        texto: R`<p>Se $\lim_{x\to a}f(x)=L$, então a restrição de $f$ a qualquer conjunto que tenha $a$ como ponto de acumulação tem o mesmo limite $L$.</p><p>Por isso, <b>dois caminhos com limites diferentes provam que o limite não existe</b>. Aqui, na reta $y=mx$: $f=\frac{m}{1+m^2}$, que depende de $m$.</p>`,
        experimenta: R`roda a reta com $\theta$.` },
      { tipo: 'contra', titulo: 'As retas não chegam', modelo: 'limite', estado: { f: R0('x^2y/(x^4+y^2)'), L: '0', th: 0.6, k: 1 },
        texto: R`<p>$f=\frac{x^2y}{x^4+y^2}$ tende para $0$ ao longo de <b>todas</b> as retas pela origem, mas na parábola $y=x^2$ vale sempre $\frac12$. O limite não existe.</p><p>Concordar em muitos caminhos nunca prova que o limite existe.</p>`,
        experimenta: R`põe $k=1$ e depois $k=-1$.` },
      { tipo: 'met', titulo: 'Provar que existe: majorar', modelo: 'limite', estado: { f: R0('x^2y/(x^2+y^2)'), L: '0', d: 0.3 },
        texto: R`<p>Para provar $\lim f=L$, majora-se $|f(x)-L|$ por uma função de $\|x-a\|$ que tende para $0$. Aqui $\frac{x^2}{x^2+y^2}\le1$, logo</p>$$\Big|\frac{x^2y}{x^2+y^2}\Big|\le|y|\le\|(x;y)\|\to0.$$<p>Em polares é o mesmo: $f=r\cos^2\theta\operatorname{sen}\theta$ e $|f|\le r$.</p>` },
      { tipo: 'def', titulo: 'Continuidade', modelo: 'limite', estado: { f: { r: [['sen(x^2+y^2)/(x^2+y^2)', '(x;y)≠(0;0)']], z: '1' }, L: '1', d: 0.5 },
        texto: R`<p>$f$ é <b>contínua</b> em $a\in D$ se $\lim_{x\to a}f(x)=f(a)$ (ou se $a$ é ponto isolado de $D$). Somas, produtos, quocientes (onde o denominador não se anula) e composições de funções contínuas são contínuas.</p><p>Aqui, com $f(0;0)=1$: $\frac{\operatorname{sen}r^2}{r^2}\to1$, logo $f$ é contínua na origem.</p>` },
      { tipo: 'def', titulo: 'Derivadas parciais e direcionais', modelo: 'direcional', estado: { f: 'x^2+y^2', x0: 0.4, y0: 0.2, th: 1, pv: true },
        texto: R`<p>A <b>derivada direcional</b> de $f$ em $a$ segundo $v$ é</p>$$\frac{\partial f}{\partial v}(a)=\lim_{t\to0}\frac{f(a+tv)-f(a)}{t}.$$<p>Com $v=e_j$ obtêm-se as <b>derivadas parciais</b> $\frac{\partial f}{\partial x_j}(a)$: deriva-se em ordem a $x_j$ com as outras variáveis fixas.</p><p>Geometricamente: o declive da curva que o plano vertical na direção $v$ corta no gráfico.</p>` },
      { tipo: 'def', titulo: 'Diferenciabilidade', modelo: 'definicao', estado: { f: 'x^2+y^2', x0: 0.5, y0: 0.3, hn: 0.6, ha: 0.785, plano: true },
        texto: R`<p>$f:D\subset\mathbb R^n\to\mathbb R^m$ é <b>diferenciável</b> em $a\in\operatorname{int}D$ se existe uma aplicação linear $Df(a):\mathbb R^n\to\mathbb R^m$ tal que</p>$$\lim_{h\to0}\frac{\|f(a+h)-f(a)-Df(a)h\|}{\|h\|}=0.$$<p>A matriz de $Df(a)$ é a <b>Jacobiana</b> $\big[\frac{\partial f_i}{\partial x_j}(a)\big]$. Para $m=1$, $Df(a)h=\nabla f(a)\cdot h$ e o gráfico tem plano tangente $z=f(a)+\nabla f(a)\cdot(x-a)$.</p>`,
        experimenta: R`carrega em ▶ ao lado de $\|h\|$: o erro (vermelho) encolhe mais depressa do que $h$.` },
      { tipo: 'teo', titulo: 'O que a diferenciabilidade dá', modelo: 'direcional', estado: { f: 'x^2-y^2+xy', x0: 0.4, y0: -0.3, th: 0.5, pv: true },
        texto: R`<p>Se $f$ é diferenciável em $a$, então: $f$ é contínua em $a$; existem todas as derivadas direcionais e</p>$$\frac{\partial f}{\partial v}(a)=Df(a)v=\nabla f(a)\cdot v.$$`,
        demo: R`<p>Com $h=tv$: $\frac{f(a+tv)-f(a)}{t}-Df(a)v=\frac{f(a+tv)-f(a)-Df(a)(tv)}{t}$, que vai para $0$ pela definição (o denominador é $\pm\|tv\|/\|v\|$). Para a continuidade: $f(a+h)-f(a)=Df(a)h+o(\|h\|)\to0$.</p>` },
      { tipo: 'contra', titulo: 'Parciais não chegam', modelo: 'definicao', estado: { f: R0('xy/sqrt(x^2+y^2)'), x0: 0, y0: 0, hn: 0.5, ha: 0.785 },
        texto: R`<p>$f=\frac{xy}{\sqrt{x^2+y^2}}$ (com $f(0;0)=0$) é contínua e tem parciais nulas na origem. O candidato é $Df(0)=0$, mas na direção de $45^\circ$ o rácio vale sempre $\frac12$: <b>não é diferenciável</b>.</p><p>Teste rápido: se $\frac{\partial f}{\partial v}(a)\ne\nabla f(a)\cdot v$ para algum $v$, $f$ não é diferenciável.</p>` },
      { tipo: 'teo', titulo: 'Condição suficiente: C¹', modelo: 'definicao', estado: { f: 'x^2-y^2+xy', x0: 0.4, y0: -0.3, hn: 0.5, ha: 2.2 },
        texto: R`<p>Se as derivadas parciais existem numa vizinhança de $a$ e são <b>contínuas</b> em $a$, então $f$ é diferenciável em $a$. Polinómios, exponenciais, senos, e as suas somas, produtos e composições são $C^1$ onde estão definidos.</p>`,
        demo: R`<p>Em $\mathbb R^2$: $f(a+h)-f(a)=[f(a_1+h_1,a_2+h_2)-f(a_1,a_2+h_2)]+[f(a_1,a_2+h_2)-f(a_1,a_2)]$. Pelo teorema de Lagrange cada parcela é $\frac{\partial f}{\partial x_j}(\xi_j)h_j$; a continuidade das parciais em $a$ dá $\frac{\partial f}{\partial x_j}(\xi_j)=\frac{\partial f}{\partial x_j}(a)+o(1)$.</p>` },
      { tipo: 'obs', titulo: 'A Jacobiana lineariza', modelo: 'jacobiana', estado: { F: '(x cos y; x sen y)', a: [1.2, 0.6], s: 0.6 },
        texto: R`<p>Para $F:\mathbb R^2\to\mathbb R^2$, um quadradinho à volta de $a$ vai para uma figura curva; $DF(a)$ leva-o num paralelogramo gerado pelas colunas da Jacobiana. Quanto mais pequeno o quadrado, mais as duas figuras coincidem.</p>` },
      { tipo: 'teo', titulo: 'Regra da cadeia', modelo: 'curva', estado: { f: 'x^2-y^2', g: '(cos t; sen t)', ga: '0', gb: '2pi', t: 1, vet: true },
        texto: R`<p>Se $g$ é diferenciável em $a$ e $f$ é diferenciável em $g(a)$, então $f\circ g$ é diferenciável em $a$ e</p>$$D(f\circ g)(a)=Df(g(a))\,Dg(a).$$<p>Ao longo de uma curva: $(f\circ g)'(t)=\nabla f(g(t))\cdot g'(t)$.</p>`,
        demo: R`<p>$g(a+h)=g(a)+Dg(a)h+o(h)$ e $f(g(a)+k)=f(g(a))+Df(g(a))k+o(k)$. Com $k=g(a+h)-g(a)=O(\|h\|)$, compõe-se e os restos continuam a ser $o(\|h\|)$.</p>` },
      { tipo: 'ex', titulo: 'Forma matricial', modelo: 'matriz', estado: { g: '(x+y; e^x-y)', f: '3u+4v', p: [1, -1] },
        texto: R`<p>$h(x;y)=f(u;v)$ com $(u;v)=g(x;y)$:</p>$$\Big[\tfrac{\partial h}{\partial x}\ \ \tfrac{\partial h}{\partial y}\Big]=\Big[\tfrac{\partial f}{\partial u}\ \ \tfrac{\partial f}{\partial v}\Big]\begin{bmatrix}\frac{\partial u}{\partial x}&\frac{\partial u}{\partial y}\\\frac{\partial v}{\partial x}&\frac{\partial v}{\partial y}\end{bmatrix}.$$<p>Com $f$ abstrata (só se conhece $\nabla f$ num ponto) é exatamente isto que se usa nos testes.</p>` },
      { tipo: 'prop', titulo: 'O gradiente', modelo: 'nivel', estado: { f: 'x^2+4y^2', p: [0.8, 0.6], th: 0.3, mapa: true },
        texto: R`<p>Se $f$ é diferenciável e $\nabla f(a)\ne0$:</p><ul><li>$\frac{\partial f}{\partial v}(a)=\nabla f(a)\cdot v$ é máxima, entre vetores unitários, para $v=\frac{\nabla f(a)}{\|\nabla f(a)\|}$, e vale $\|\nabla f(a)\|$;</li><li>$\nabla f(a)$ é <b>perpendicular</b> ao conjunto de nível que passa em $a$.</li></ul>`,
        demo: R`<p>Cauchy–Schwarz: $|\nabla f(a)\cdot v|\le\|\nabla f(a)\|$ com igualdade quando $v$ é paralelo a $\nabla f(a)$. Se $g(t)$ é uma curva no nível, $f(g(t))=c$; derivando, $\nabla f(g(t))\cdot g'(t)=0$.</p>` },
      { tipo: 'met', titulo: 'Plano tangente a uma superfície de nível', modelo: 'plano', estado: { s: 'elip', normal: true },
        texto: R`<p>Se $S=\{F(x;y;z)=0\}$ e $\nabla F(p)\ne0$, o plano tangente a $S$ em $p$ é</p>$$\nabla F(p)\cdot(x-p)=0,$$<p>e a reta normal é $p+t\,\nabla F(p)$. Em $\mathbb R^2$, o mesmo dá a reta tangente a uma curva de nível.</p>` },
    ],
    aquecimento: [].concat((A.diferenciabilidade || {}).testa || [], (A.cadeia || {}).testa || [], (A.gradiente || {}).testa || []),
    exercicios: [
      { titulo: 'Continuidade e diferenciabilidade na origem', tipo: 'função por ramos', gerar: 'ramos', modelo: 'definicao', estado: { f: R0('xy^2/(x^2+y^2)'), x0: 0, y0: 0 },
        enunciado: R`<p>Seja $f(x;y)=\dfrac{xy^2}{x^2+y^2}$ se $(x;y)\ne(0;0)$ e $f(0;0)=0$.</p><p>a) Estude a continuidade de $f$ na origem. b) Calcule as derivadas parciais na origem pela definição. c) Calcule $\frac{\partial f}{\partial v}(0;0)$ para $v=(a;b)$ unitário. d) $f$ é diferenciável na origem?</p>`,
        dicas: [R`a) $\frac{y^2}{x^2+y^2}\le1$.`, R`b) $f(t;0)=0$ e $f(0;t)=0$.`, R`d) Compara $\frac{\partial f}{\partial v}(0;0)$ com $\nabla f(0;0)\cdot v$.`],
        passos: [R`a) $|f(x;y)|\le|x|\le\|(x;y)\|\to0=f(0;0)$: contínua.`, R`b) $\frac{\partial f}{\partial x}(0;0)=\lim\frac{f(t;0)-0}{t}=0$ e $\frac{\partial f}{\partial y}(0;0)=\lim\frac{f(0;t)-0}{t}=0$.`, R`c) $\frac{f(ta;tb)}{t}=\frac{t^3ab^2}{t\cdot t^2}=ab^2$, logo $\frac{\partial f}{\partial v}(0;0)=ab^2$.`, R`d) Se fosse diferenciável, $\frac{\partial f}{\partial v}=\nabla f\cdot v=0$ para todo o $v$. Mas com $a=b=\frac1{\sqrt2}$ dá $\frac1{2\sqrt2}\ne0$: não é diferenciável.`],
        solucao: R`<p>Contínua; $\nabla f(0;0)=(0;0)$; $\frac{\partial f}{\partial v}(0;0)=ab^2$; não é diferenciável.</p>` },
      { titulo: 'Um limite que não existe', tipo: 'limites', gerar: 'limite', modelo: 'limite', estado: { f: R0('(x^2-2y^2)/(x^2+y^2)'), L: '1' },
        enunciado: R`<p>Mostre que não existe $\displaystyle\lim_{(x;y)\to(0;0)}\frac{x^2-2y^2}{x^2+y^2}$.</p>`,
        dicas: [R`Experimenta as retas $y=mx$.`],
        passos: [R`Na reta $y=mx$ ($x\ne0$): $f=\frac{x^2-2m^2x^2}{x^2+m^2x^2}=\frac{1-2m^2}{1+m^2}$.`, R`Com $m=0$ dá $1$; com $m=1$ dá $-\frac12$.`, R`Dois caminhos com limites diferentes: o limite não existe.`],
        solucao: R`<p>Ao longo de $y=mx$ o valor é $\frac{1-2m^2}{1+m^2}$, que depende de $m$: o limite não existe.</p>` },
      { titulo: 'Regra da cadeia com f abstrata', tipo: 'regra da cadeia', gerar: 'cadeia',
        enunciado: R`<p>Seja $f:\mathbb R^2\to\mathbb R$ diferenciável com $\nabla f(0;1)=(2;-3)$ e $h(x;y)=f(x^2-y,\ xy)$. Calcule $\nabla h(1;1)$.</p>`,
        dicas: [R`Escreve $u=x^2-y$, $v=xy$ e vê em que ponto $(u;v)$ estás quando $(x;y)=(1;1)$.`, R`$\frac{\partial h}{\partial x}=\frac{\partial f}{\partial u}\frac{\partial u}{\partial x}+\frac{\partial f}{\partial v}\frac{\partial v}{\partial x}$.`],
        passos: [R`Em $(1;1)$: $(u;v)=(0;1)$, onde $\nabla f=(2;-3)$.`, R`$\frac{\partial u}{\partial x}=2x=2$, $\frac{\partial u}{\partial y}=-1$, $\frac{\partial v}{\partial x}=y=1$, $\frac{\partial v}{\partial y}=x=1$.`, R`$\frac{\partial h}{\partial x}(1;1)=2\cdot2+(-3)\cdot1=1$.`, R`$\frac{\partial h}{\partial y}(1;1)=2\cdot(-1)+(-3)\cdot1=-5$.`],
        solucao: R`<p>$\nabla h(1;1)=(1;\,-5)$.</p>` },
      { titulo: 'Plano tangente e reta normal', tipo: 'superfície de nível', gerar: 'plano',
        enunciado: R`<p>Determine o plano tangente e a reta normal à superfície $x^2+2y^2+z^2=4$ no ponto $(1;1;1)$.</p>`,
        dicas: [R`É o conjunto de nível $F=4$ de $F=x^2+2y^2+z^2$; o gradiente é normal.`],
        passos: [R`$\nabla F=(2x;\,4y;\,2z)$, logo $\nabla F(1;1;1)=(2;4;2)$.`, R`Plano: $2(x-1)+4(y-1)+2(z-1)=0$, isto é, $x+2y+z=4$.`, R`Reta normal: $(1;1;1)+t(1;2;1)$, $t\in\mathbb R$.`],
        solucao: R`<p>Plano $x+2y+z=4$; reta normal $(1+t;\,1+2t;\,1+t)$.</p>` },
      { titulo: 'Direção de maior crescimento', tipo: 'gradiente', gerar: 'direcao',
        enunciado: R`<p>Seja $f(x;y)=x^2+3xy$. Em $(1;1)$, qual é a direção de maior crescimento de $f$, e qual é essa taxa? Em que direções a derivada direcional é nula?</p>`,
        dicas: [R`$\frac{\partial f}{\partial v}=\nabla f\cdot v$ (porque $f$ é $C^1$).`],
        passos: [R`$\nabla f=(2x+3y;\,3x)$, logo $\nabla f(1;1)=(5;3)$.`, R`Maior crescimento: $v=\frac{(5;3)}{\sqrt{34}}$, com taxa $\|\nabla f(1;1)\|=\sqrt{34}$.`, R`Derivada nula: $v\perp(5;3)$, ou seja $v=\pm\frac{(3;-5)}{\sqrt{34}}$.`],
        solucao: R`<p>$v=\frac{(5;3)}{\sqrt{34}}$, taxa $\sqrt{34}$; derivada nula em $v=\pm\frac{(3;-5)}{\sqrt{34}}$.</p>` },
      { titulo: 'Reta tangente a uma curva de nível', tipo: 'gradiente', modelo: 'nivel', estado: { f: 'x^2-xy+y^2', p: [1, -1] },
        enunciado: R`<p>Determine a reta tangente à curva $x^2-xy+y^2=3$ no ponto $(1;-1)$.</p>`,
        dicas: [R`O gradiente de $f=x^2-xy+y^2$ é perpendicular à curva.`],
        passos: [R`$\nabla f=(2x-y;\,-x+2y)$, logo $\nabla f(1;-1)=(3;-3)$.`, R`Reta: $3(x-1)-3(y+1)=0$, isto é, $y=x-2$.`],
        solucao: R`<p>$y=x-2$.</p>` },
    ],
    geradores: {
      ramos() {
        const [p, q] = C.escolher([[1, 2], [2, 1], [2, 2], [1, 3], [3, 1]]);
        const deg = p + q, xp = p === 1 ? 'x' : 'x^{' + p + '}', yq = q === 1 ? 'y' : 'y^{' + q + '}', src = (p === 1 ? 'x' : 'x^' + p) + (q === 1 ? 'y' : 'y^' + q);
        const dif = deg >= 4;
        return { titulo: 'Continuidade e diferenciabilidade na origem', tipo: 'função por ramos', modelo: 'definicao', estado: { f: R0(src + '/(x^2+y^2)'), x0: 0, y0: 0 },
          enunciado: R`<p>Seja $f(x;y)=\dfrac{${xp}${yq}}{x^2+y^2}$ se $(x;y)\ne(0;0)$ e $f(0;0)=0$.</p><p>a) Estude a continuidade na origem. b) Calcule $\nabla f(0;0)$ pela definição. c) Calcule $\frac{\partial f}{\partial v}(0;0)$, $v=(a;b)$ unitário. d) $f$ é diferenciável na origem?</p>`,
          dicas: [R`a) $|x|,|y|\le\|(x;y)\|$, logo $|${xp}${yq}|\le\|(x;y)\|^{${deg}}$.`, R`d) ${dif ? 'Estuda diretamente o rácio da definição.' : 'Compara a derivada direcional com $\\nabla f\\cdot v$.'}`],
          passos: [R`a) $|f|\le\frac{\|(x;y)\|^{${deg}}}{\|(x;y)\|^2}=\|(x;y)\|^{${deg - 2}}\to0$: contínua.`, R`b) $f(t;0)=f(0;t)=0$, logo $\nabla f(0;0)=(0;0)$.`, R`c) $\frac{f(ta;tb)}{t}=t^{${deg - 3}}a^{${p}}b^{${q}}$, logo $\frac{\partial f}{\partial v}(0;0)=${dif ? '0' : 'a^{' + p + '}b^{' + q + '}'}$.`,
            dif ? R`d) $\frac{|f(h)-0-0|}{\|h\|}\le\|h\|^{${deg - 3}}\to0$: <b>é diferenciável</b>, com $Df(0;0)=0$.` : R`d) Se fosse diferenciável, a derivada direcional seria $\nabla f\cdot v=0$ para todo o $v$; com $a=b=\frac1{\sqrt2}$ não é. <b>Não é diferenciável.</b>`],
          solucao: R`<p>Contínua; $\nabla f(0;0)=(0;0)$; $\frac{\partial f}{\partial v}(0;0)=${dif ? '0' : 'a^{' + p + '}b^{' + q + '}'}$; ${dif ? 'diferenciável' : 'não diferenciável'}.</p>` };
      },
      limite() {
        let a = C.ri(-3, 3), b = C.ri(-3, 3); while (a === b) b = C.ri(-3, 3);
        const num = (C.termo(a, 'x^2', true) || '') + C.termo(b, 'y^2', !a) || '0', src = `(${a}x^2+${b}y^2)/(x^2+y^2)`.replace('+-', '-');
        return { titulo: 'Um limite que não existe', tipo: 'limites', modelo: 'limite', estado: { f: R0(src), L: String(a) },
          enunciado: R`<p>Mostre que não existe $\displaystyle\lim_{(x;y)\to(0;0)}\frac{${num}}{x^2+y^2}$.</p>`,
          dicas: [R`Experimenta as retas $y=mx$.`],
          passos: [R`Na reta $y=mx$: $f=\frac{${a}+${b}m^2}{1+m^2}$.`.replace(/\+-/g, '-'), R`$m=0$ dá $${a}$; $m\to\infty$ (eixo dos $y$) dá $${b}$.`, R`Valores diferentes: o limite não existe.`],
          solucao: R`<p>Ao longo de $y=mx$ dá $\frac{${a}+${b}m^2}{1+m^2}$, que depende de $m$: não existe.</p>`.replace(/\+-/g, '-') };
      },
      cadeia() {
        const a = C.ri(-4, 4), b = C.ri(-4, 4);
        return { titulo: 'Regra da cadeia com f abstrata', tipo: 'regra da cadeia',
          enunciado: R`<p>Seja $f:\mathbb R^2\to\mathbb R$ diferenciável com $\nabla f(0;1)=(${a};${b})$ e $h(x;y)=f(x^2-y,\ xy)$. Calcule $\nabla h(1;1)$.</p>`,
          dicas: [R`Em $(1;1)$, $(u;v)=(x^2-y;\,xy)=(0;1)$.`],
          passos: [R`$\frac{\partial h}{\partial x}=f_u\cdot2x+f_v\cdot y=${a}\cdot2+(${b})\cdot1=${2 * a + b}$.`, R`$\frac{\partial h}{\partial y}=f_u\cdot(-1)+f_v\cdot x=-(${a})+(${b})=${b - a}$.`],
          solucao: R`<p>$\nabla h(1;1)=(${2 * a + b};\,${b - a})$.</p>` };
      },
      plano() {
        const a = C.ri(1, 4), b = C.ri(1, 4), d = 1 + a + b;
        return { titulo: 'Plano tangente e reta normal', tipo: 'superfície de nível',
          enunciado: R`<p>Determine o plano tangente e a reta normal à superfície $x^2+${a === 1 ? '' : a}y^2+${b === 1 ? '' : b}z^2=${d}$ no ponto $(1;1;1)$.</p>`,
          dicas: [R`O gradiente de $F=x^2+${a === 1 ? '' : a}y^2+${b === 1 ? '' : b}z^2$ é normal à superfície.`],
          passos: [R`$\nabla F(1;1;1)=(2;\,${2 * a};\,${2 * b})$.`, R`Plano: $(x-1)+${a === 1 ? '' : a}(y-1)+${b === 1 ? '' : b}(z-1)=0$, isto é, $x+${a === 1 ? '' : a}y+${b === 1 ? '' : b}z=${d}$.`, R`Reta normal: $(1;1;1)+t(1;${a};${b})$.`],
          solucao: R`<p>Plano $x+${a === 1 ? '' : a}y+${b === 1 ? '' : b}z=${d}$; reta $(1+t;\,1+${a}t;\,1+${b}t)$.</p>` };
      },
      direcao() {
        const a = C.ri(1, 4), gx = 2 + a, gy = a, n2 = gx * gx + gy * gy;
        return { titulo: 'Direção de maior crescimento', tipo: 'gradiente',
          enunciado: R`<p>Seja $f(x;y)=x^2+${a === 1 ? '' : a}xy$. Em $(1;1)$, qual é a direção de maior crescimento de $f$ e qual é essa taxa? Em que direções a derivada direcional é nula?</p>`,
          dicas: [R`$\frac{\partial f}{\partial v}=\nabla f\cdot v$.`],
          passos: [R`$\nabla f=(2x+${a === 1 ? '' : a}y;\,${a === 1 ? '' : a}x)$, logo $\nabla f(1;1)=(${gx};${gy})$.`, R`Maior crescimento: $v=\frac{(${gx};${gy})}{\sqrt{${n2}}}$, taxa $\sqrt{${n2}}$.`, R`Derivada nula: $v=\pm\frac{(${gy};-${gx})}{\sqrt{${n2}}}$.`],
          solucao: R`<p>$v=\frac{(${gx};${gy})}{\sqrt{${n2}}}$, taxa $\sqrt{${n2}}$; nula em $\pm\frac{(${gy};-${gx})}{\sqrt{${n2}}}$.</p>` };
      },
    },
  });
})();
