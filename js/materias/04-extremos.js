/* Programa · 4. Funções Cᵏ, lema de Schwarz. Extremos e pontos de sela. */
(function () {
  const R = String.raw, C = window.CDI;
  const R0 = (e) => ({ r: [[e, '(x;y)≠(0;0)']], z: '0' });
  C.materia({
    id: 'extremos', ordem: 4, grupo: 'Cálculo diferencial', curto: 'Cᵏ, Schwarz e extremos', paginas: 'pp. 24–27',
    titulo: 'Funções Cᵏ, lema de Schwarz, extremos e pontos de sela',
    resumo: R`Derivadas de ordem superior, a igualdade das derivadas cruzadas, pontos críticos e como decidir se são extremos ou pontos de sela.`,
    modelos: ['hessiana.schwarz', 'hessiana.criticos', 'novo.desenhar'],
    aprender: [
      { tipo: 'def', titulo: 'Derivadas de ordem superior', modelo: 'schwarz', estado: { f: 'x^2y^3', x0: 0.7, y0: 0.8 },
        texto: R`<p>Derivando as parciais de novo: $\frac{\partial^2 f}{\partial x\,\partial y}=\frac{\partial}{\partial x}\Big(\frac{\partial f}{\partial y}\Big)$, e assim por diante.</p><p>$f$ é de <b>classe $C^k$</b> num aberto $D$ se todas as derivadas parciais até à ordem $k$ existem e são contínuas em $D$. $C^\infty$: todas as ordens.</p>` },
      { tipo: 'teo', titulo: 'Lema de Schwarz', modelo: 'schwarz', estado: { f: 'e^(xy)+x^3y', x0: 0.5, y0: -0.4 },
        texto: R`<p>Se $f$ é de classe $C^2$ num aberto $D$, então em todo o ponto de $D$</p>$$\frac{\partial^2 f}{\partial x\,\partial y}=\frac{\partial^2 f}{\partial y\,\partial x}.$$<p>Consequência: a matriz Hessiana de uma função $C^2$ é simétrica.</p>`,
        demo: R`<p>Considera $\Delta(h)=f(a+h,b+h)-f(a+h,b)-f(a,b+h)+f(a,b)$. Aplicando duas vezes o teorema de Lagrange numa ordem, $\Delta(h)=h^2\frac{\partial^2f}{\partial y\partial x}(\xi)$; na outra ordem, $\Delta(h)=h^2\frac{\partial^2f}{\partial x\partial y}(\eta)$, com $\xi,\eta\to(a;b)$. Divide por $h^2$ e usa a continuidade das segundas derivadas.</p>` },
      { tipo: 'contra', titulo: 'Sem continuidade, Schwarz falha', modelo: 'schwarz', estado: { f: R0('xy(x^2-y^2)/(x^2+y^2)'), x0: 0, y0: 0 },
        texto: R`<p>$f=\frac{xy(x^2-y^2)}{x^2+y^2}$, $f(0;0)=0$. Pela definição: $\frac{\partial f}{\partial x}(0;y)=-y$ e $\frac{\partial f}{\partial y}(x;0)=x$, logo</p>$$\frac{\partial^2 f}{\partial y\,\partial x}(0;0)=-1\ne1=\frac{\partial^2 f}{\partial x\,\partial y}(0;0).$$<p>As segundas derivadas existem mas não são contínuas na origem.</p>` },
      { tipo: 'def', titulo: 'Extremos locais', modelo: 'criticos', estado: { f: 'x^3-3x+y^2', x0: 1, y0: 0 },
        texto: R`<p>$a\in D$ é <b>máximo local</b> de $f$ se existe $\varepsilon>0$ com $f(x)\le f(a)$ para todo o $x\in B_\varepsilon(a)\cap D$; <b>mínimo local</b> com $\ge$. Estrito se a desigualdade é estrita para $x\ne a$. Absoluto (ou global) se vale em todo o $D$.</p>` },
      { tipo: 'teo', titulo: 'Nos extremos interiores, ∇f = 0', modelo: 'criticos', estado: { f: '1-x^2-y^2', x0: 0, y0: 0 },
        texto: R`<p>Se $a\in\operatorname{int}D$ é extremo local de $f$ e $f$ tem derivadas parciais em $a$, então $\nabla f(a)=0$.</p><p>Os pontos com $\nabla f(a)=0$ chamam-se <b>pontos críticos</b> (ou estacionários). São os únicos candidatos no interior.</p>`,
        demo: R`<p>$g(t)=f(a+te_j)$ tem um extremo local em $t=0$ e é derivável aí; pelo resultado de CDI I, $g'(0)=\frac{\partial f}{\partial x_j}(a)=0$.</p>` },
      { tipo: 'def', titulo: 'Ponto de sela', modelo: 'criticos', estado: { f: 'x^2-y^2', x0: 0, y0: 0 },
        texto: R`<p>Um ponto crítico que não é extremo chama-se <b>ponto de sela</b>: em qualquer bola à volta de $a$ há pontos com $f>f(a)$ e pontos com $f<f(a)$.</p><p>$x^2-y^2$ na origem: sobe ao longo do eixo dos $x$ e desce ao longo do eixo dos $y$.</p>` },
      { tipo: 'met', titulo: 'Estudar o sinal de f(x) − f(a)', modelo: 'desenhar', estado: { f: 'x^2y^2-x^2', c: 0.5, L: 1.8 },
        texto: R`<p>Sem Hessiana: estuda o sinal de $f(a+h)-f(a)$ perto de $h=0$.</p><ul><li>Para provar uma <b>sela</b>: basta encontrar duas curvas por $a$ onde $f-f(a)$ tem sinais contrários.</li><li>Para provar um <b>extremo</b>: é preciso controlar o sinal em toda uma bola (fatorizar, completar quadrados, desigualdades).</li></ul><p>Aqui $f=x^2(y^2-1)$: todos os pontos $(0;y_0)$ são críticos; perto de $|y_0|<1$, $f\le0=f(0;y_0)$: máximos locais (não estritos).</p>` },
      { tipo: 'ex', titulo: 'Completar quadrados', modelo: 'criticos', estado: { f: 'x^2+y^4', x0: 0, y0: 0 },
        texto: R`<p>$f=x^2+y^4$: $\nabla f=(2x;4y^3)$ só se anula na origem, e $f(x;y)\ge0=f(0;0)$ com igualdade só na origem. <b>Mínimo absoluto estrito</b>, mesmo com uma segunda derivada nula.</p><p>Compara com $x^2-y^4$: mesmas segundas derivadas na origem, mas é sela ($f(0;y)=-y^4<0<x^2=f(x;0)$).</p>` },
    ],
    aquecimento: [
      { p: R`$f$ é de classe $C^2$ em $\mathbb R^2$ e $\frac{\partial^2 f}{\partial x\partial y}(1;2)=5$. Quanto vale $\frac{\partial^2 f}{\partial y\partial x}(1;2)$?`, op: [R`$5$`, R`$-5$`, R`Não se pode saber`, R`$0$`], certa: 0, porque: R`Lema de Schwarz: para $f\in C^2$ as derivadas cruzadas são iguais.` },
      { p: R`$\nabla f(a)=0$ garante que $a$ é extremo local?`, op: [R`Sim, sempre`, R`Não: pode ser ponto de sela`, R`Sim, se $f$ for $C^1$`, R`Só em $\mathbb R^2$`], certa: 1, porque: R`$x^2-y^2$ tem gradiente nulo na origem e não tem aí extremo.` },
      { p: R`Para provar que $a$ é ponto de sela, chega…`, op: [R`encontrar duas curvas por $a$ onde $f-f(a)$ tem sinais contrários`, R`mostrar que $f$ cresce numa direção`, R`mostrar que $\nabla f(a)\ne0$`, R`ver que $f(a)=0$`], certa: 0, porque: R`Em qualquer bola há então pontos acima e abaixo de $f(a)$: não é máximo nem mínimo (e, sendo crítico, é sela).` },
      { p: R`$f(x;y)=(x-y)^2$. Os pontos da reta $y=x$ são:`, op: [R`mínimos locais estritos`, R`mínimos locais (não estritos)`, R`pontos de sela`, R`máximos locais`], certa: 1, porque: R`$f\ge0$ e $f=0$ em toda a reta: são mínimos, mas não estritos (perto de cada um há outros pontos com o mesmo valor).` },
    ],
    exercicios: [
      { titulo: 'Verificar o lema de Schwarz', tipo: 'derivadas de 2.ª ordem', gerar: 'schwarz', modelo: 'schwarz', estado: { f: 'x^3y^2+e^(xy)' },
        enunciado: R`<p>Seja $f(x;y)=x^3y^2+e^{xy}$. Calcule $\frac{\partial^2 f}{\partial x\partial y}$ e $\frac{\partial^2 f}{\partial y\partial x}$ e confirme que são iguais. Porque é que isto tinha de acontecer?</p>`,
        dicas: [R`$\frac{\partial}{\partial x}e^{xy}=ye^{xy}$.`],
        passos: [R`$\frac{\partial f}{\partial x}=3x^2y^2+ye^{xy}$ e $\frac{\partial f}{\partial y}=2x^3y+xe^{xy}$.`, R`$\frac{\partial^2 f}{\partial y\partial x}=6x^2y+e^{xy}+xye^{xy}$.`, R`$\frac{\partial^2 f}{\partial x\partial y}=6x^2y+e^{xy}+xye^{xy}$.`, R`São iguais porque $f\in C^2(\mathbb R^2)$ (lema de Schwarz).`],
        solucao: R`<p>Ambas valem $6x^2y+(1+xy)e^{xy}$; $f$ é $C^2$.</p>` },
      { titulo: 'Derivadas cruzadas diferentes', tipo: 'contraexemplo', modelo: 'schwarz', estado: { f: R0('(x^3y-xy^3)/(x^2+y^2)'), x0: 0, y0: 0 },
        enunciado: R`<p>Seja $f(x;y)=\dfrac{x^3y-xy^3}{x^2+y^2}$ fora da origem e $f(0;0)=0$. Calcule $\frac{\partial^2 f}{\partial y\partial x}(0;0)$ e $\frac{\partial^2 f}{\partial x\partial y}(0;0)$. O que conclui sobre a continuidade das segundas derivadas?</p>`,
        dicas: [R`Calcula primeiro $\frac{\partial f}{\partial x}(0;y)$ para $y\ne0$, pela definição.`, R`$\frac{\partial^2 f}{\partial y\partial x}(0;0)=\lim_{y\to0}\frac{\frac{\partial f}{\partial x}(0;y)-\frac{\partial f}{\partial x}(0;0)}{y}$.`],
        passos: [R`$\frac{\partial f}{\partial x}(0;y)=\lim_{t\to0}\frac{f(t;y)}{t}=\lim\frac{t^2y-y^3}{t^2+y^2}=-y$ (também para $y=0$).`, R`$\frac{\partial f}{\partial y}(x;0)=\lim_{t\to0}\frac{f(x;t)}{t}=\lim\frac{x^3-xt^2}{x^2+t^2}=x$.`, R`$\frac{\partial^2 f}{\partial y\partial x}(0;0)=\frac{d}{dy}(-y)=-1$ e $\frac{\partial^2 f}{\partial x\partial y}(0;0)=\frac{d}{dx}(x)=1$.`, R`São diferentes: pelo lema de Schwarz, $f$ não é $C^2$ numa vizinhança da origem (as segundas derivadas não são contínuas em $(0;0)$).`],
        solucao: R`<p>$-1$ e $1$. As segundas derivadas não são contínuas na origem.</p>` },
      { titulo: 'Pontos críticos e sela por restrições', tipo: 'extremos', gerar: 'sela', modelo: 'criticos', estado: { f: 'x^3+y^3-3xy', x0: 0, y0: 0 },
        enunciado: R`<p>Seja $f(x;y)=x^3+y^3-3xy$. Determine os pontos críticos e mostre, sem usar a Hessiana, que $(0;0)$ é ponto de sela.</p>`,
        dicas: [R`$\nabla f=(3x^2-3y;\,3y^2-3x)$.`, R`Restringe $f$ às retas $y=x$ e $y=-x$.`],
        passos: [R`$x^2=y$ e $y^2=x$ dão $x^4=x$, logo $x=0$ ou $x=1$: pontos $(0;0)$ e $(1;1)$.`, R`Em $y=x$: $f(t;t)=2t^3-3t^2=t^2(2t-3)<0$ para $t$ pequeno, $t\ne0$.`, R`Em $y=-x$: $f(t;-t)=3t^2>0$ para $t\ne0$.`, R`Em qualquer bola à volta da origem há valores acima e abaixo de $f(0;0)=0$: sela.`],
        solucao: R`<p>Críticos: $(0;0)$ e $(1;1)$. $(0;0)$ é sela: $f(t;t)<0<f(t;-t)$ para $t\ne0$ pequeno.</p>` },
      { titulo: 'Uma linha de pontos críticos', tipo: 'extremos', modelo: 'desenhar', estado: { f: 'x^2y^2-x^2', c: 0.5, L: 1.8 },
        enunciado: R`<p>Seja $f(x;y)=x^2y^2-x^2$. Determine os pontos críticos e classifique-os.</p>`,
        dicas: [R`Fatoriza: $f=x^2(y^2-1)$.`, R`O sinal de $f$ perto de $(0;y_0)$ depende do sinal de $y^2-1$.`],
        passos: [R`$\nabla f=(2x(y^2-1);\,2x^2y)$. Se $x\ne0$ a 2.ª equação dá $y=0$ e a 1.ª dá $-2x=0$: impossível. Logo os críticos são $\{(0;y_0): y_0\in\mathbb R\}$, com $f=0$.`, R`$|y_0|<1$: perto, $y^2-1<0$ e $f=x^2(y^2-1)\le0$: máximos locais (não estritos).`, R`$|y_0|>1$: perto, $f\ge0$: mínimos locais (não estritos).`, R`$y_0=\pm1$: perto há pontos com $|y|<1$ ($f<0$ se $x\ne0$) e com $|y|>1$ ($f>0$): pontos de sela.`],
        solucao: R`<p>Críticos $(0;y_0)$: máximos locais se $|y_0|<1$, mínimos locais se $|y_0|>1$, selas em $(0;\pm1)$.</p>` },
      { titulo: 'Um mínimo sem Hessiana', tipo: 'extremos',
        enunciado: R`<p>Mostre que $f(x;y)=(x-y)^2+x^4$ tem um mínimo local estrito em $(0;0)$.</p>`,
        dicas: [R`Soma de quadrados.`],
        passos: [R`$f\ge0=f(0;0)$.`, R`$f(x;y)=0\iff x=y$ e $x=0$, isto é, só na origem.`, R`Logo $f(x;y)>f(0;0)$ para $(x;y)\ne(0;0)$: mínimo (absoluto) estrito.`],
        solucao: R`<p>$f\ge0$ com igualdade só na origem: mínimo estrito.</p>` },
    ],
    geradores: {
      schwarz() {
        const m = C.ri(2, 4), n = C.ri(2, 4), a = C.ri(2, 3);
        const xm = 'x^{' + m + '}', yn = 'y^{' + n + '}', cr = `${m * n}x^{${m - 1}}y^{${n - 1}}`.replace(/\^\{1\}/g, '');
        return { titulo: 'Verificar o lema de Schwarz', tipo: 'derivadas de 2.ª ordem', modelo: 'schwarz', estado: { f: `x^${m}y^${n}+sen(${a}xy)` },
          enunciado: R`<p>Seja $f(x;y)=${xm}${yn}+\operatorname{sen}(${a}xy)$. Calcule as duas derivadas cruzadas de 2.ª ordem e confirme que são iguais.</p>`,
          dicas: [R`$\frac{\partial}{\partial x}\operatorname{sen}(${a}xy)=${a}y\cos(${a}xy)$.`],
          passos: [R`$\frac{\partial f}{\partial x}=${m}x^{${m - 1}}${yn}+${a}y\cos(${a}xy)$.`, R`$\frac{\partial^2 f}{\partial y\partial x}=${cr}+${a}\cos(${a}xy)-${a * a}xy\operatorname{sen}(${a}xy)$.`, R`Pela outra ordem obtém-se o mesmo (lema de Schwarz: $f\in C^2$).`],
          solucao: R`<p>Ambas valem $${cr}+${a}\cos(${a}xy)-${a * a}xy\operatorname{sen}(${a}xy)$.</p>` };
      },
      sela() {
        const a = C.ri(1, 3);
        return { titulo: 'Pontos críticos e sela por restrições', tipo: 'extremos', modelo: 'criticos', estado: { f: `x^3+y^3-${3 * a}xy`, x0: 0, y0: 0 },
          enunciado: R`<p>Seja $f(x;y)=x^3+y^3-${3 * a}xy$. Determine os pontos críticos e mostre, sem a Hessiana, que $(0;0)$ é ponto de sela.</p>`,
          dicas: [R`$\nabla f=(3x^2-${3 * a}y;\,3y^2-${3 * a}x)$.`, R`Restringe às retas $y=\pm x$.`],
          passos: [R`$x^2=${a === 1 ? '' : a}y$ e $y^2=${a === 1 ? '' : a}x$: $(0;0)$ e $(${a};${a})$.`, R`$f(t;t)=2t^3-${3 * a}t^2<0$ para $t\ne0$ pequeno.`, R`$f(t;-t)=${3 * a}t^2>0$ para $t\ne0$.`, R`Logo $(0;0)$ é sela.`],
          solucao: R`<p>Críticos $(0;0)$ e $(${a};${a})$; $(0;0)$ é sela.</p>` };
      },
    },
  });
})();
