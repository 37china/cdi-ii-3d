/* Programa · 6. Inversa e implícita. Aplicações. */
(function () {
  const R = String.raw, C = window.CDI, A = C.antigos;
  C.materia({
    id: 'inversa', ordem: 6, grupo: 'Cálculo diferencial', curto: 'Inversa e implícita', paginas: 'pp. 27–33',
    titulo: 'Teoremas da função inversa e da função implícita',
    resumo: R`Quando uma função se pode inverter localmente, quando uma equação define uma variável em função das outras, e como derivar sem fórmula explícita.`,
    modelos: ['inversa.uma', 'inversa.inversa', 'inversa.implicita'],
    aprender: [
      { tipo: 'obs', titulo: 'O caso de ℝ', modelo: 'uma', estado: { f: 'exp', x: 0.5 },
        texto: R`<p>Em CDI I: se $f$ é $C^1$ e $f'(a)\ne0$, $f$ é estritamente monótona perto de $a$, tem inversa aí e $(f^{-1})'(f(a))=\frac1{f'(a)}$. O gráfico da inversa é o simétrico em relação a $y=x$, e os declives das tangentes são inversos.</p>` },
      { tipo: 'teo', titulo: 'Teorema da função inversa', modelo: 'inversa', estado: { g: '(xy; x+y)', a: [1.2, 0.4], s: 0.5 },
        texto: R`<p>Seja $f:D\subset\mathbb R^n\to\mathbb R^n$ de classe $C^1$ num aberto $D$, e $a\in D$ com $\det Df(a)\ne0$. Então existem abertos $U\ni a$ e $V\ni f(a)$ tais que $f:U\to V$ é bijetiva, a inversa é $C^1$ e</p>$$D(f^{-1})(f(a))=\big(Df(a)\big)^{-1}.$$`,
        demo: R`<p>A parte difícil é a existência (um argumento de ponto fixo). A fórmula vem da regra da cadeia aplicada a $f^{-1}\circ f=\operatorname{id}$: $D(f^{-1})(f(a))\,Df(a)=I$.</p>`,
        experimenta: R`leva o quadrado para a reta $y=x$, onde $\det Dg=x-y$ se anula.` },
      { tipo: 'contra', titulo: 'Só local', modelo: 'inversa', estado: { g: '(e^x cos y; e^x sen y)', a: [0.2, 0.8], s: 0.5, gemeo: true },
        texto: R`<p>$f=(e^x\cos y;\,e^x\operatorname{sen}y)$ tem $\det Df=e^{2x}\ne0$ em todo o $\mathbb R^2$, mas $f(x;y+2\pi)=f(x;y)$: não é injetiva. O teorema dá inversas <b>locais</b>, nunca uma inversa global.</p>` },
      { tipo: 'contra', titulo: 'Quando o determinante se anula', modelo: 'inversa', estado: { g: '(x^2-y^2; 2xy)', a: [0.05, 0.05], s: 0.4, gemeo: true },
        texto: R`<p>$f=(x^2-y^2;\,2xy)$ (é $z\mapsto z^2$) tem $\det Df=4(x^2+y^2)$, nulo na origem. Qualquer vizinhança da origem é dobrada duas vezes sobre a imagem: $f(-p)=f(p)$. Não há inversa local.</p>` },
      { tipo: 'teo', titulo: 'Teorema da função implícita', modelo: 'implicita', estado: { F: 'x^2+y^2-1', p: [0.6, 0.8], d: 0.45 },
        texto: R`<p>Seja $F$ de classe $C^1$, $F(a;b)=0$ e $\frac{\partial F}{\partial y}(a;b)\ne0$. Então há vizinhanças de $a$ e de $b$ onde $F(x;y)=0\iff y=g(x)$, com $g$ de classe $C^1$ e</p>$$g'(x)=-\frac{\partial F/\partial x}{\partial F/\partial y}(x;g(x)).$$`,
        demo: R`<p>A existência sai do teorema da função inversa aplicado a $(x;y)\mapsto(x;F(x;y))$. A fórmula: derivar $F(x;g(x))=0$ pela regra da cadeia dá $F_x+F_y\,g'=0$.</p>` },
      { tipo: 'contra', titulo: 'Onde ∂F/∂y = 0', modelo: 'implicita', estado: { F: 'x^2+y^2-1', p: [1, 0], d: 0.45 },
        texto: R`<p>Em $(1;0)$, $\frac{\partial F}{\partial y}=2y=0$: perto de $(1;0)$, para cada $x<1$ há <b>dois</b> valores de $y$. Não se resolve em ordem a $y$. Mas $\frac{\partial F}{\partial x}=2\ne0$: resolve-se em ordem a $x$, $x=\sqrt{1-y^2}$.</p>` },
      { tipo: 'contra', titulo: 'Gradiente nulo', modelo: 'implicita', estado: { F: 'y^2-x^3', p: [0, 0], d: 0.45 },
        texto: R`<p>$y^2=x^3$ tem uma cúspide na origem, onde $\nabla F=0$. Nenhuma das variáveis se escreve como função $C^1$ da outra.</p>` },
      { tipo: 'teo', titulo: 'Caso geral e z = g(x;y)', modelo: 'implicita', estado: { F: 'x+y+sen(xy)-1', p: [0, 1], d: 0.5 },
        texto: R`<p>$F:\mathbb R^n\times\mathbb R^m\to\mathbb R^m$, $F(a;b)=0$, $D_yF(a;b)$ invertível $\Rightarrow$ $y=g(x)$ perto de $(a;b)$ e $Dg=-(D_yF)^{-1}D_xF$.</p><p>O caso mais usado: $F(x;y;z)=0$ com $F_z\ne0$ define $z=g(x;y)$, com $\frac{\partial g}{\partial x}=-\frac{F_x}{F_z}$ e $\frac{\partial g}{\partial y}=-\frac{F_y}{F_z}$.</p>` },
      { tipo: 'ex', titulo: 'Derivar sem resolver', modelo: 'implicita', estado: { F: 'x+y+sen(xy)-1', p: [0, 1], d: 0.5 },
        texto: R`<p>$x+y+\operatorname{sen}(xy)=1$ em $(0;1)$: $F_y=1+x\cos(xy)=1\ne0$. Logo $y=g(x)$ perto de $0$, com</p>$$g'(0)=-\frac{1+y\cos(xy)}{1+x\cos(xy)}\Big|_{(0;1)}=-2.$$<p>Não é preciso (nem possível) escrever $g$.</p>` },
    ],
    aquecimento: (A.inversa || {}).testa || [],
    exercicios: [
      { titulo: 'Jacobiana da inversa', tipo: 'função inversa', gerar: 'inversa', modelo: 'inversa', estado: { g: '(x+y^2; x^2-y)', a: [1, 1] },
        enunciado: R`<p>Seja $f(x;y)=(x+y^2;\,x^2-y)$. Mostre que $f$ é invertível numa vizinhança de $(1;1)$ e calcule $D(f^{-1})(2;0)$.</p>`,
        dicas: [R`$f(1;1)=(2;0)$.`, R`$D(f^{-1})(f(a))=(Df(a))^{-1}$.`],
        passos: [R`$Df=\begin{bmatrix}1&2y\\2x&-1\end{bmatrix}$, logo $Df(1;1)=\begin{bmatrix}1&2\\2&-1\end{bmatrix}$, com $\det=-5\ne0$.`, R`$f$ é $C^1$: pelo teorema da função inversa é invertível perto de $(1;1)$.`, R`$D(f^{-1})(2;0)=\frac1{-5}\begin{bmatrix}-1&-2\\-2&1\end{bmatrix}=\begin{bmatrix}\frac15&\frac25\\\frac25&-\frac15\end{bmatrix}$.`],
        solucao: R`<p>$D(f^{-1})(2;0)=\begin{bmatrix}\frac15&\frac25\\\frac25&-\frac15\end{bmatrix}$.</p>` },
      { titulo: 'Reta tangente a uma curva implícita', tipo: 'função implícita', gerar: 'implicita', modelo: 'implicita', estado: { F: 'x^2y+y^3-2', p: [1, 1] },
        enunciado: R`<p>Mostre que $x^2y+y^3=2$ define $y=g(x)$ numa vizinhança de $(1;1)$, calcule $g'(1)$ e escreva a reta tangente.</p>`,
        dicas: [R`$F=x^2y+y^3-2$; verifica $F_y(1;1)\ne0$.`],
        passos: [R`$F(1;1)=0$ e $F_y=x^2+3y^2$, $F_y(1;1)=4\ne0$: pelo teorema da função implícita existe $g$.`, R`$F_x=2xy$, $F_x(1;1)=2$, logo $g'(1)=-\frac24=-\frac12$.`, R`Reta: $y=1-\frac12(x-1)$.`],
        solucao: R`<p>$g'(1)=-\frac12$; reta $y=1-\frac12(x-1)$.</p>` },
      { titulo: 'z como função de x e y', tipo: 'função implícita',
        enunciado: R`<p>Mostre que $xz+yz^3+xy=3$ define $z=g(x;y)$ numa vizinhança de $(1;1;1)$ e calcule $\nabla g(1;1)$.</p>`,
        dicas: [R`$F=xz+yz^3+xy-3$; precisas de $F_z(1;1;1)\ne0$.`],
        passos: [R`$F(1;1;1)=0$ e $F_z=x+3yz^2=4\ne0$.`, R`$F_x=z+y=2$ e $F_y=z^3+x=2$ em $(1;1;1)$.`, R`$\frac{\partial g}{\partial x}=-\frac24=-\frac12$ e $\frac{\partial g}{\partial y}=-\frac24=-\frac12$.`],
        solucao: R`<p>$\nabla g(1;1)=\big(-\frac12;\,-\frac12\big)$.</p>` },
      { titulo: 'Onde se pode resolver em ordem a z', tipo: 'função implícita',
        enunciado: R`<p>Em que pontos da superfície $x^2+y^2-z^2=1$ se pode garantir, pelo teorema da função implícita, que $z$ é localmente função de $(x;y)$?</p>`,
        dicas: [R`Precisas de $F_z\ne0$.`],
        passos: [R`$F_z=-2z$.`, R`O teorema aplica-se em todos os pontos da superfície com $z\ne0$.`, R`Nos pontos com $z=0$ (a circunferência $x^2+y^2=1$) não se aplica; e de facto, perto deles, para cada $(x;y)$ com $x^2+y^2>1$ há dois valores $\pm\sqrt{x^2+y^2-1}$.`],
        solucao: R`<p>Em todos os pontos com $z\ne0$.</p>` },
      { titulo: 'Localmente invertível em todo o lado', tipo: 'função inversa', modelo: 'inversa', estado: { g: '(e^x cos y; e^x sen y)', gemeo: true },
        enunciado: R`<p>Seja $f(x;y)=(e^x\cos y;\,e^x\operatorname{sen}y)$. Mostre que $f$ é localmente invertível em todos os pontos, mas não é injetiva em $\mathbb R^2$.</p>`,
        dicas: [R`Calcula $\det Df$.`, R`Compara $f(x;y)$ com $f(x;y+2\pi)$.`],
        passos: [R`$Df=\begin{bmatrix}e^x\cos y&-e^x\operatorname{sen}y\\e^x\operatorname{sen}y&e^x\cos y\end{bmatrix}$, $\det Df=e^{2x}>0$.`, R`Pelo teorema da função inversa, $f$ é invertível numa vizinhança de qualquer ponto.`, R`$f(0;0)=f(0;2\pi)=(1;0)$: não é injetiva.`],
        solucao: R`<p>$\det Df=e^{2x}\ne0$ dá inversas locais; $f(0;0)=f(0;2\pi)$ mostra que não há inversa global.</p>` },
    ],
    geradores: {
      inversa() {
        const a = C.ri(1, 3), b = C.ri(1, 3), det = -b - 4 * a;
        const y2 = a === 1 ? 'y^2' : a + 'y^2', by = b === 1 ? 'y' : b + 'y';
        const inv = [[-b, -2 * a], [-2, 1]].map((r) => r.map((x) => C.frac(x, det)));
        return { titulo: 'Jacobiana da inversa', tipo: 'função inversa', modelo: 'inversa', estado: { g: `(x+${a}y^2; x^2-${b}y)`, a: [1, 1] },
          enunciado: R`<p>Seja $f(x;y)=(x+${y2};\,x^2-${by})$. Mostre que $f$ é invertível numa vizinhança de $(1;1)$ e calcule $D(f^{-1})(${1 + a};${1 - b})$.</p>`,
          dicas: [R`$f(1;1)=(${1 + a};${1 - b})$ e $D(f^{-1})(f(a))=(Df(a))^{-1}$.`],
          passos: [R`$Df(1;1)=\begin{bmatrix}1&${2 * a}\\2&-${b}\end{bmatrix}$, $\det=${det}\ne0$.`, R`Pelo teorema da função inversa, $f$ é invertível perto de $(1;1)$.`, R`$(Df)^{-1}=\frac1{${det}}\begin{bmatrix}-${b}&-${2 * a}\\-2&1\end{bmatrix}=\begin{bmatrix}${inv[0][0]}&${inv[0][1]}\\${inv[1][0]}&${inv[1][1]}\end{bmatrix}$.`],
          solucao: R`<p>$D(f^{-1})(${1 + a};${1 - b})=\begin{bmatrix}${inv[0][0]}&${inv[0][1]}\\${inv[1][0]}&${inv[1][1]}\end{bmatrix}$.</p>` };
      },
      implicita() {
        const a = C.ri(1, 4), k = a + 1, d = C.frac(-2 * a, a + 3);
        return { titulo: 'Reta tangente a uma curva implícita', tipo: 'função implícita', modelo: 'implicita', estado: { F: `${a}x^2y+y^3-${k}`, p: [1, 1] },
          enunciado: R`<p>Mostre que $${a === 1 ? '' : a}x^2y+y^3=${k}$ define $y=g(x)$ numa vizinhança de $(1;1)$, calcule $g'(1)$ e escreva a reta tangente.</p>`,
          dicas: [R`$F_y=${a === 1 ? '' : a}x^2+3y^2$.`],
          passos: [R`$F(1;1)=0$, $F_y(1;1)=${a + 3}\ne0$.`, R`$F_x=${2 * a}xy$, logo $g'(1)=-\frac{${2 * a}}{${a + 3}}=${d}$.`, R`Reta: $y=1+(${d})(x-1)$.`],
          solucao: R`<p>$g'(1)=${d}$; reta $y=1+(${d})(x-1)$.</p>` };
      },
    },
  });
})();
