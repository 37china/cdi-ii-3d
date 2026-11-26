/* Programa · 5. Weierstrass, Taylor, Hessiana, multiplicadores de Lagrange. */
(function () {
  const R = String.raw, C = window.CDI, A = C.antigos;
  C.materia({
    id: 'taylor', ordem: 5, grupo: 'Cálculo diferencial', curto: 'Weierstrass, Taylor, Lagrange', paginas: 'pp. 24–27 e 33–35',
    titulo: 'Weierstrass, Taylor, Hessiana e multiplicadores de Lagrange',
    resumo: R`Quando há máximo e mínimo garantidos, a fórmula de Taylor de 2.ª ordem, a classificação de pontos críticos pela Hessiana e extremos condicionados.`,
    modelos: ['novo.weierstrass', 'novo.taylor', 'hessiana.criticos', 'lagrange.plano', 'lagrange.espaco'],
    aprender: [
      { tipo: 'def', titulo: 'Máximo e mínimo absolutos', modelo: 'weierstrass', estado: { f: 'x^2+xy-y', K: 'x^2+y^2 ≤ 1' },
        texto: R`<p>$f:D\to\mathbb R$ tem <b>máximo absoluto</b> em $b\in D$ se $f(x)\le f(b)$ para todo o $x\in D$, e <b>mínimo absoluto</b> em $a$ se $f(x)\ge f(a)$ para todo o $x\in D$.</p><p>Esta matéria responde a três perguntas: quando é que estes extremos existem (Weierstrass), como se classificam os pontos críticos do interior (Taylor e Hessiana) e como se encontram os da fronteira (Lagrange).</p>` },
      { tipo: 'teo', titulo: 'Teorema de Weierstrass', modelo: 'weierstrass', estado: { f: 'x^2+xy-y', K: 'x^2+y^2 ≤ 1' },
        texto: R`<p>Se $K\subset\mathbb R^n$ é <b>compacto</b> (fechado e limitado) e $f:K\to\mathbb R$ é <b>contínua</b>, então $f$ tem máximo e mínimo em $K$: existem $a,b\in K$ com $f(a)\le f(x)\le f(b)$ para todo o $x\in K$.</p>`,
        demo: R`<p>Seja $M=\sup_K f$ (talvez $+\infty$) e $x_k\in K$ com $f(x_k)\to M$. Por Bolzano–Weierstrass há uma subsucessão $x_{k_j}\to b$, e $b\in K$ porque $K$ é fechado. Por continuidade, $f(b)=\lim f(x_{k_j})=M$: logo $M$ é finito e é atingido.</p>` },
      { tipo: 'contra', titulo: 'Cada hipótese faz falta', modelo: 'weierstrass', estado: { f: 'x', K: 'x^2+y^2 < 1' },
        texto: R`<p>$f=x$ no disco <b>aberto</b>: o supremo é $1$ mas não é atingido. Experimenta também uma faixa ilimitada ($K$ não limitado) e $f=\frac1{x^2+y^2}$ num disco que contém a origem ($f$ não contínua).</p>`,
        experimenta: R`usa os exemplos de $K$ «faixa ilimitada» e «disco fechado».` },
      { tipo: 'teo', titulo: 'Fórmula de Taylor de 2.ª ordem', modelo: 'taylor', estado: { f: 'e^x cos y', a: [0, 0], ord: '2', hn: 0.6, ha: 0.6 },
        texto: R`<p>Se $f$ é de classe $C^2$ numa vizinhança de $a$, então</p>$$f(a+h)=f(a)+\nabla f(a)\cdot h+\tfrac12\,h^{T}Hf(a)\,h+R(h),\qquad\frac{R(h)}{\|h\|^2}\to0.$$<p>$Hf(a)=\big[\frac{\partial^2f}{\partial x_i\partial x_j}(a)\big]$ é a <b>matriz Hessiana</b>. Aqui: $e^x\cos y\approx1+x+\frac{x^2-y^2}2$.</p>`,
        demo: R`<p>$g(t)=f(a+th)$ é $C^2$ e, pela regra da cadeia, $g'(0)=\nabla f(a)\cdot h$ e $g''(t)=h^THf(a+th)h$. Taylor em $\mathbb R$ com resto de Lagrange: $g(1)=g(0)+g'(0)+\frac12g''(\xi)$, e $g''(\xi)-h^THf(a)h=o(\|h\|^2)$ pela continuidade das segundas derivadas.</p>`,
        experimenta: R`muda para 1.ª ordem: o erro passa a ser $o(\|h\|)$, mas não $o(\|h\|^2)$.` },
      { tipo: 'teo', titulo: 'Classificação pela Hessiana', modelo: 'criticos', estado: { f: 'x^3-3x+y^2', x0: 1, y0: 0, dir: true },
        texto: R`<p>Seja $f\in C^2$ e $\nabla f(a)=0$.</p><ul><li>$Hf(a)$ definida positiva (valores próprios $>0$) $\Rightarrow$ mínimo local estrito;</li><li>definida negativa $\Rightarrow$ máximo local estrito;</li><li>indefinida (valores próprios de sinais contrários) $\Rightarrow$ ponto de sela;</li><li>semidefinida com valor próprio $0$ $\Rightarrow$ <b>nada se conclui</b>.</li></ul>`,
        demo: R`<p>Com $\nabla f(a)=0$, Taylor dá $f(a+h)-f(a)=\frac12h^THf(a)h+o(\|h\|^2)$. Se $Hf(a)$ é definida positiva, $h^THf(a)h\ge\lambda_{\min}\|h\|^2$ com $\lambda_{\min}>0$, e o resto não altera o sinal para $\|h\|$ pequeno.</p>` },
      { tipo: 'met', titulo: 'Em ℝ²: determinante e traço', modelo: 'criticos', estado: { f: 'x^3-3x+y^2', x0: -1, y0: 0, dir: true },
        texto: R`<p>Para $H=\begin{bmatrix}A&B\\B&C\end{bmatrix}$: $\det H=AC-B^2=\lambda_1\lambda_2$.</p><ul><li>$\det H>0$ e $A>0$: mínimo; $\det H>0$ e $A<0$: máximo;</li><li>$\det H<0$: sela;</li><li>$\det H=0$: inconclusivo.</li></ul><p>Aqui, em $(-1;0)$: $H=\operatorname{diag}(-6;2)$, $\det<0$: sela.</p>` },
      { tipo: 'contra', titulo: 'Quando a Hessiana não decide', modelo: 'criticos', estado: { f: 'x^2-y^4', x0: 0, y0: 0, dir: true },
        texto: R`<p>$x^2+y^4$ e $x^2-y^4$ têm a mesma Hessiana na origem, $\operatorname{diag}(2;0)$. A primeira tem mínimo, a segunda sela. Com $\det H=0$ é preciso estudar $f$ diretamente.</p>` },
      { tipo: 'teo', titulo: 'Multiplicadores de Lagrange', modelo: 'plano', estado: { f: 'x+y', g: 'x^2+y^2-1', t: 0.3, np: true },
        texto: R`<p>Sejam $f,g$ de classe $C^1$ e $M=\{g=0\}$ com $\nabla g\ne0$ em $M$. Se $a$ é extremo local de $f$ restrita a $M$, existe $\lambda\in\mathbb R$ com</p>$$\nabla f(a)=\lambda\,\nabla g(a).$$<p>Geometricamente: no extremo, a curva de nível de $f$ é tangente a $M$.</p>`,
        demo: R`<p>Seja $\gamma(t)$ uma curva em $M$ com $\gamma(0)=a$. $f\circ\gamma$ tem extremo em $0$, logo $\nabla f(a)\cdot\gamma'(0)=0$: $\nabla f(a)$ é perpendicular a todos os vetores tangentes a $M$ em $a$. Como $\nabla g(a)$ também é (e o espaço tangente tem dimensão $n-1$), são paralelos.</p>`,
        experimenta: R`anda com $P$ ao longo da curva e vê quando $\nabla f$ e $\nabla g$ ficam alinhados.` },
      { tipo: 'teo', titulo: 'Duas restrições', modelo: 'espaco', estado: { f: 'z', t: 2.2, sup: true, np: true },
        texto: R`<p>Com $M=\{g_1=0,\ g_2=0\}\subset\mathbb R^3$ e $\nabla g_1,\nabla g_2$ linearmente independentes em $M$: nos extremos de $f|_M$,</p>$$\nabla f=\lambda\nabla g_1+\mu\nabla g_2.$$<p>$M$ é uma curva (interseção de duas superfícies) e $\nabla f$ fica no plano normal.</p>` },
      { tipo: 'met', titulo: 'Extremos absolutos num compacto', modelo: 'weierstrass', estado: { f: 'x^2+xy-y', K: 'x ≥ 0 e y ≥ 0 e x+y ≤ 1' },
        texto: R`<p>1. Weierstrass garante que existem. 2. Candidatos no interior: $\nabla f=0$. 3. Candidatos na fronteira: Lagrange, ou parametrizar cada lado. 4. Cantos e pontos onde a fronteira não é regular. 5. Calcular $f$ em todos e comparar.</p>` },
    ],
    aquecimento: [].concat((A.hessiana || {}).testa || [], (A.lagrange || {}).testa || []),
    exercicios: [
      { titulo: 'Extremos absolutos num disco', tipo: 'Weierstrass', gerar: 'disco', modelo: 'weierstrass', estado: { f: 'x^2+y^2-2x', K: 'x^2+y^2 ≤ 4' },
        enunciado: R`<p>Justifique que $f(x;y)=x^2+y^2-2x$ tem máximo e mínimo em $K=\{x^2+y^2\le4\}$ e determine-os.</p>`,
        dicas: [R`Weierstrass: $f$ é contínua e $K$ é compacto.`, R`Na fronteira, $x^2+y^2=4$, logo $f=4-2x$ com $x\in[-2;2]$.`],
        passos: [R`Existem por Weierstrass ($f$ polinomial, $K$ fechado e limitado).`, R`Interior: $\nabla f=(2x-2;2y)=0$ dá $(1;0)$, com $f=-1$.`, R`Fronteira: $f=4-2x$, $x\in[-2;2]$: máximo $8$ em $(-2;0)$, mínimo $0$ em $(2;0)$.`, R`Comparando: máximo $8$ em $(-2;0)$; mínimo $-1$ em $(1;0)$.`],
        solucao: R`<p>$\max f=8$ em $(-2;0)$; $\min f=-1$ em $(1;0)$.</p>` },
      { titulo: 'Classificar pontos críticos', tipo: 'Hessiana', gerar: 'hessiana', modelo: 'criticos', estado: { f: 'x^3-3x+y^2-2y', x0: 1, y0: 1 },
        enunciado: R`<p>Determine e classifique os pontos críticos de $f(x;y)=x^3-3x+y^2-2y$.</p>`,
        dicas: [R`$\nabla f=(3x^2-3;\,2y-2)$.`, R`$Hf=\operatorname{diag}(6x;\,2)$.`],
        passos: [R`Críticos: $x=\pm1$, $y=1$.`, R`Em $(1;1)$: $H=\operatorname{diag}(6;2)$, definida positiva: mínimo local, $f=-3$.`, R`Em $(-1;1)$: $H=\operatorname{diag}(-6;2)$, indefinida: sela.`],
        solucao: R`<p>$(1;1)$ mínimo local; $(-1;1)$ ponto de sela.</p>` },
      { titulo: 'Polinómio de Taylor de 2.ª ordem', tipo: 'Taylor', gerar: 'taylor', modelo: 'taylor', estado: { f: 'ln(1+x+2y)', a: [0, 0], ord: '2' },
        enunciado: R`<p>Escreva o polinómio de Taylor de 2.ª ordem de $f(x;y)=\ln(1+x+2y)$ em $(0;0)$.</p>`,
        dicas: [R`$f$ só depende de $u=x+2y$: $\ln(1+u)\approx u-\frac{u^2}2$.`],
        passos: [R`$f(0;0)=0$, $\nabla f=\frac{(1;2)}{1+x+2y}$, logo $\nabla f(0;0)=(1;2)$.`, R`$Hf=-\frac1{(1+x+2y)^2}\begin{bmatrix}1&2\\2&4\end{bmatrix}$, logo $Hf(0;0)=-\begin{bmatrix}1&2\\2&4\end{bmatrix}$.`, R`$P_2=x+2y-\frac12(x^2+4xy+4y^2)=(x+2y)-\frac{(x+2y)^2}2$.`],
        solucao: R`<p>$P_2(x;y)=x+2y-\tfrac12(x+2y)^2$.</p>` },
      { titulo: 'Lagrange numa circunferência', tipo: 'Lagrange', gerar: 'lagrange', modelo: 'plano', estado: { f: 'xy', g: 'x^2+y^2-2' },
        enunciado: R`<p>Determine os extremos de $f(x;y)=xy$ na circunferência $x^2+y^2=2$.</p>`,
        dicas: [R`$\nabla f=\lambda\nabla g$ com $g=x^2+y^2-2$: $y=2\lambda x$, $x=2\lambda y$.`, R`A circunferência é compacta: os extremos existem.`],
        passos: [R`Das equações: $y=4\lambda^2y$. Se $y=0$ então $x=0$, que não está na circunferência; logo $\lambda=\pm\frac12$ e $y=\pm x$.`, R`Com $x^2+y^2=2$: $(1;1),(-1;-1)$ (com $y=x$) e $(1;-1),(-1;1)$ (com $y=-x$).`, R`$f=1$ nos dois primeiros e $f=-1$ nos outros.`, R`Weierstrass: máximo $1$ e mínimo $-1$.`],
        solucao: R`<p>Máximo $1$ em $(\pm1;\pm1)$ (mesmo sinal); mínimo $-1$ em $(1;-1)$ e $(-1;1)$.</p>` },
      { titulo: 'Distância a um plano', tipo: 'Lagrange', gerar: 'plano3',
        enunciado: R`<p>Determine o ponto do plano $x+2y+2z=9$ mais próximo da origem, usando multiplicadores de Lagrange.</p>`,
        dicas: [R`Minimiza $f=x^2+y^2+z^2$ (o quadrado da distância) com $g=x+2y+2z-9=0$.`],
        passos: [R`$\nabla f=\lambda\nabla g$: $(2x;2y;2z)=\lambda(1;2;2)$, logo $(x;y;z)=\frac\lambda2(1;2;2)$.`, R`Substituindo no plano: $\frac\lambda2(1+4+4)=9$, logo $\frac\lambda2=1$.`, R`Ponto $(1;2;2)$, à distância $3$. É mínimo porque $f\to\infty$ no plano quando $\|p\|\to\infty$.`],
        solucao: R`<p>$(1;2;2)$, distância $3$.</p>` },
      { titulo: 'Um supremo que não é atingido', tipo: 'Weierstrass', modelo: 'weierstrass', estado: { f: 'x+y', K: 'x^2+y^2 < 1' },
        enunciado: R`<p>Seja $f(x;y)=x+y$ em $A=\{x^2+y^2<1\}$. Determine $\sup_A f$. É atingido? Porque não contradiz Weierstrass?</p>`,
        dicas: [R`Cauchy–Schwarz: $x+y\le\sqrt2\,\|(x;y)\|$.`],
        passos: [R`$x+y\le\sqrt2\,\|(x;y)\|<\sqrt2$ em $A$.`, R`Com $p_k=(1-\frac1k)\big(\frac1{\sqrt2};\frac1{\sqrt2}\big)\in A$: $f(p_k)\to\sqrt2$. Logo $\sup_Af=\sqrt2$.`, R`Não é atingido ($<$ estrito). $A$ não é fechado, por isso Weierstrass não se aplica.`],
        solucao: R`<p>$\sup_Af=\sqrt2$, não atingido; $A$ não é compacto.</p>` },
    ],
    geradores: {
      disco() {
        const a = C.ri(1, 3), Rr = a + C.ri(1, 2), R2 = Rr * Rr;
        return { titulo: 'Extremos absolutos num disco', tipo: 'Weierstrass', modelo: 'weierstrass', estado: { f: `x^2+y^2-${2 * a}x`, K: `x^2+y^2 ≤ ${R2}` },
          enunciado: R`<p>Justifique que $f(x;y)=x^2+y^2-${2 * a}x$ tem máximo e mínimo em $K=\{x^2+y^2\le${R2}\}$ e determine-os.</p>`,
          dicas: [R`Na fronteira, $f=${R2}-${2 * a}x$ com $x\in[-${Rr};${Rr}]$.`],
          passos: [R`Existem por Weierstrass.`, R`Interior: $\nabla f=0$ em $(${a};0)$, $f=-${a * a}$.`, R`Fronteira: máximo $${R2 + 2 * a * Rr}$ em $(-${Rr};0)$, mínimo $${R2 - 2 * a * Rr}$ em $(${Rr};0)$.`, R`Máximo $${R2 + 2 * a * Rr}$; mínimo $-${a * a}$.`],
          solucao: R`<p>$\max f=${R2 + 2 * a * Rr}$ em $(-${Rr};0)$; $\min f=-${a * a}$ em $(${a};0)$.</p>` };
      },
      hessiana() {
        const a = C.ri(1, 3), b = C.ri(-2, 2);
        const yt = b === 0 ? 'y^2' : `y^2${C.termo(-2 * b, 'y')}`, fy = b;
        return { titulo: 'Classificar pontos críticos', tipo: 'Hessiana', modelo: 'criticos', estado: { f: `x^3-${3 * a * a}x+${yt}`, x0: a, y0: fy },
          enunciado: R`<p>Determine e classifique os pontos críticos de $f(x;y)=x^3-${3 * a * a}x+${yt}$.</p>`,
          dicas: [R`$Hf=\operatorname{diag}(6x;\,2)$.`],
          passos: [R`$\nabla f=(3x^2-${3 * a * a};\,2y${C.termo(-2 * b)})$: críticos $(\pm${a};${b})$.`, R`$(${a};${b})$: $H=\operatorname{diag}(${6 * a};2)$, mínimo local.`, R`$(-${a};${b})$: $H=\operatorname{diag}(-${6 * a};2)$, sela.`],
          solucao: R`<p>$(${a};${b})$ mínimo local; $(-${a};${b})$ sela.</p>` };
      },
      taylor() {
        const a = C.ri(1, 3), b = C.escolher([-3, -2, -1, 1, 2, 3]);
        const u = `${a === 1 ? '' : a}x${C.termo(b, 'y')}`;
        return { titulo: 'Polinómio de Taylor de 2.ª ordem', tipo: 'Taylor', modelo: 'taylor', estado: { f: `ln(1+${a}x+${b}y)`.replace('+-', '-'), a: [0, 0], ord: '2' },
          enunciado: R`<p>Escreva o polinómio de Taylor de 2.ª ordem de $f(x;y)=\ln(1+${u})$ em $(0;0)$.</p>`,
          dicas: [R`$\ln(1+u)\approx u-\frac{u^2}{2}$ com $u=${u}$.`],
          passos: [R`$\nabla f(0;0)=(${a};${b})$.`, R`$Hf(0;0)=-\begin{bmatrix}${a * a}&${a * b}\\${a * b}&${b * b}\end{bmatrix}$.`, R`$P_2=(${u})-\frac12(${u})^2$.`],
          solucao: R`<p>$P_2(x;y)=(${u})-\tfrac12(${u})^2$.</p>` };
      },
      lagrange() {
        const r = C.ri(1, 3), r2 = 2 * r * r;
        return { titulo: 'Lagrange numa circunferência', tipo: 'Lagrange', modelo: 'plano', estado: { f: 'xy', g: `x^2+y^2-${r2}` },
          enunciado: R`<p>Determine os extremos de $f(x;y)=xy$ na circunferência $x^2+y^2=${r2}$.</p>`,
          dicas: [R`$y=2\lambda x$ e $x=2\lambda y$ dão $y=\pm x$.`],
          passos: [R`$y=\pm x$ e $2x^2=${r2}$: pontos $(\pm${r};\pm${r})$.`, R`$f=${r * r}$ quando os sinais são iguais, $f=-${r * r}$ quando são contrários.`, R`Máximo $${r * r}$, mínimo $-${r * r}$ (Weierstrass garante que existem).`],
          solucao: R`<p>Máximo $${r * r}$ em $(${r};${r})$ e $(-${r};-${r})$; mínimo $-${r * r}$ em $(${r};-${r})$ e $(-${r};${r})$.</p>` };
      },
      plano3() {
        const [a, b, c, n] = C.escolher([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9]]), k = C.ri(1, 2), d = k * n * n;
        return { titulo: 'Distância a um plano', tipo: 'Lagrange',
          enunciado: R`<p>Determine o ponto do plano $${a === 1 ? '' : a}x+${b}y+${c}z=${d}$ mais próximo da origem, usando multiplicadores de Lagrange.</p>`,
          dicas: [R`Minimiza $x^2+y^2+z^2$ com a restrição do plano.`],
          passos: [R`$(2x;2y;2z)=\lambda(${a};${b};${c})$: o ponto é $t(${a};${b};${c})$.`, R`No plano: $t\cdot${n * n}=${d}$, logo $t=${k}$.`, R`Ponto $(${k * a};${k * b};${k * c})$, distância $${k * n}$.`],
          solucao: R`<p>$(${k * a};${k * b};${k * c})$, distância $${k * n}$.</p>` };
      },
    },
  });
})();
