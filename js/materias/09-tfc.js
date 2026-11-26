/* Programa · 9. TFC para integrais de linha. */
(function () {
  const R = String.raw, C = window.CDI;
  const VORT = '(-y/(x^2+y^2); x/(x^2+y^2))';
  C.materia({
    id: 'tfc', ordem: 9, grupo: 'Cálculo integral', curto: 'TFC para integrais de linha',
    titulo: 'Teorema fundamental do cálculo para integrais de linha',
    resumo: R`Se $F=\nabla\varphi$, o trabalho de $A$ a $B$ é $\varphi(B)-\varphi(A)$ e não depende do caminho; e o recíproco.`,
    modelos: ['novo2.trabalho', 'green.potencial'],
    aprender: [
      { tipo: 'def', titulo: 'Campo gradiente e potencial', modelo: 'trabalho', estado: { F: '(yz; xz; xy)', g: '(cos t; sen t; t/4)', ga: '0', gb: '2pi', phi: 'xyz', t: 1, inv: false },
        texto: R`<p>$F:D\subset\mathbb R^n\to\mathbb R^n$ é um <b>campo gradiente</b> (ou conservativo) se existe $\varphi:D\to\mathbb R$ de classe $C^1$ com $F=\nabla\varphi$. A $\varphi$ chama-se <b>potencial</b> de $F$.</p><p>Aqui $F=(yz;xz;xy)=\nabla(xyz)$. Escreve outro potencial e a app verifica se $\nabla\varphi=F$.</p>` },
      { tipo: 'teo', titulo: 'Teorema fundamental', modelo: 'trabalho', estado: { F: '(yz; xz; xy)', g: '(cos t; sen t; t/4)', ga: '0', gb: '2pi', phi: 'xyz', t: 1 },
        texto: R`<p>Se $F=\nabla\varphi$ é contínuo em $D$ e $g:[a;b]\to D$ é um caminho $C^1$ (ou seccionalmente $C^1$) de $A=g(a)$ a $B=g(b)$, então</p>$$\int_gF\cdot dr=\varphi(B)-\varphi(A).$$`,
        demo: R`<p>Pela regra da cadeia, $(\varphi\circ g)'(t)=\nabla\varphi(g(t))\cdot g'(t)=F(g(t))\cdot g'(t)$. Então $\int_a^bF(g(t))\cdot g'(t)\,dt=\varphi(g(b))-\varphi(g(a))$ pelo teorema fundamental de CDI I.</p>` },
      { tipo: 'cor', titulo: 'Não depende do caminho', modelo: 'potencial', estado: { F: '(x+y; x+e^y+1)', phi: 'xy+x^2/2+e^y+y', mapa: true, A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, 1.6] },
        texto: R`<p>Para um campo gradiente: o trabalho entre dois pontos é o mesmo para todos os caminhos, e $\oint F\cdot dr=0$ em qualquer caminho <b>fechado</b>.</p><p>Na vista 3D: o trabalho é a diferença de alturas no gráfico de $\varphi$.</p>`,
        experimenta: R`arrasta o ponto $C$ e vê que os dois integrais não mudam.` },
      { tipo: 'teo', titulo: 'O recíproco', modelo: 'potencial', estado: { F: '(x^2; y^3)', phi: 'x^3/3+y^4/4', mapa: true },
        texto: R`<p>Se $F$ é contínuo num aberto $D$ conexo por arcos e $\int_gF\cdot dr$ só depende dos extremos de $g$, então $F$ é gradiente: fixado $x_0\in D$,</p>$$\varphi(x)=\int_{x_0}^{x}F\cdot dr$$<p>(por qualquer caminho) é um potencial.</p>`,
        demo: R`<p>Para calcular $\frac{\partial\varphi}{\partial x_1}(x)$, vai-se de $x_0$ a $x$ e depois pelo segmento de $x$ a $x+te_1$: $\varphi(x+te_1)-\varphi(x)=\int_0^tF_1(x+se_1)\,ds$. Dividindo por $t$ e fazendo $t\to0$ dá $F_1(x)$.</p>` },
      { tipo: 'contra', titulo: 'Um campo que não é gradiente', modelo: 'potencial', estado: { F: VORT, phi: '', mapa: true, A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.7] },
        texto: R`<p>O vórtice $F=\frac{(-y;x)}{x^2+y^2}$ em $\mathbb R^2\setminus\{0\}$: na circunferência unitária, $\oint F\cdot dr=2\pi\ne0$. Logo <b>não é gradiente</b> em $\mathbb R^2\setminus\{0\}$, apesar de, localmente, ser $\nabla\theta$.</p>` },
      { tipo: 'met', titulo: 'O truque dos caminhos feios', modelo: 'trabalho', estado: { F: '(2xy; x^2+z; y)', g: '(t; 2t^2; 3t^3)', ga: '0', gb: '1', phi: 'x^2y+yz', t: 1 },
        texto: R`<p>Se o caminho é complicado, verifica primeiro se $F$ é gradiente. Aqui $F=(2xy;\,x^2+z;\,y)=\nabla(x^2y+yz)$, e de $(0;0;0)$ a $(1;2;3)$ o trabalho é $\varphi(1;2;3)-\varphi(0;0;0)=2+6=8$, seja qual for o caminho.</p>` },
      { tipo: 'met', titulo: 'Separar a parte gradiente', modelo: 'trabalho', estado: { F: '(2x - y; x + 2y; 0)', g: '(cos t; sen t; 0)', ga: '0', gb: 'pi', phi: '', t: 1 },
        texto: R`<p>Se $F=\nabla\varphi+G$, então $\int_gF\cdot dr=\varphi(B)-\varphi(A)+\int_gG\cdot dr$. Aqui $F=\nabla(x^2+y^2)+(-y;x;0)$: a primeira parte dá $\varphi(B)-\varphi(A)=0$ (o raio não muda) e só sobra o trabalho do vórtice $(-y;x;0)$, que é $\pi$.</p>` },
    ],
    aquecimento: [
      { p: R`$F=\nabla\varphi$ com $\varphi=x^2y$. O trabalho de $F$ de $(0;0)$ a $(1;2)$ por um caminho qualquer é:`, op: [R`$2$`, R`$1$`, R`depende do caminho`, R`$0$`], certa: 0, porque: R`TFC: $\varphi(1;2)-\varphi(0;0)=2$.` },
      { p: R`Se $\oint_g F\cdot dr\ne0$ para algum caminho fechado $g$ em $D$, então:`, op: [R`$F$ não é gradiente em $D$`, R`$F$ não é contínuo`, R`$D$ não é aberto`, R`$F=0$`], certa: 0, porque: R`Um campo gradiente tem circulação nula em todos os caminhos fechados.` },
      { p: R`O TFC para integrais de linha resulta de…`, op: [R`regra da cadeia + TFC de CDI I`, R`teorema de Green`, R`lema de Schwarz`, R`teorema da função implícita`], certa: 0, porque: R`$(\varphi\circ g)'=\nabla\varphi(g)\cdot g'$, e integra-se em $[a;b]$.` },
    ],
    exercicios: [
      { titulo: 'Potencial e trabalho', tipo: 'TFC', gerar: 'potencial', modelo: 'trabalho', estado: { F: '(2xy^3; 3x^2y^2)', g: '(1+t; 1-2t)', ga: '0', gb: '1', phi: 'x^2y^3' },
        enunciado: R`<p>Mostre que $F(x;y)=(2xy^3;\,3x^2y^2)$ é um campo gradiente e calcule o trabalho de $F$ ao longo de qualquer caminho de $(1;1)$ a $(2;-1)$.</p>`,
        dicas: [R`Procura $\varphi$ com $\frac{\partial\varphi}{\partial x}=2xy^3$.`],
        passos: [R`$\varphi=\int2xy^3\,dx=x^2y^3+c(y)$.`, R`$\frac{\partial\varphi}{\partial y}=3x^2y^2+c'(y)=3x^2y^2$, logo $c$ é constante.`, R`$F=\nabla(x^2y^3)$. Trabalho $=\varphi(2;-1)-\varphi(1;1)=-4-1=-5$.`],
        solucao: R`<p>$\varphi=x^2y^3$; trabalho $-5$.</p>` },
      { titulo: 'Um caminho complicado', tipo: 'TFC', modelo: 'trabalho', estado: { F: '(e^y + z; x e^y; x)', g: '(t; sen(pi t/2); t^2)', ga: '0', gb: '1', phi: 'x e^y + x z' },
        enunciado: R`<p>Calcule $\int_gF\cdot dr$ com $F=(e^y+z;\,xe^y;\,x)$ e $g(t)=\big(t;\,\operatorname{sen}\frac{\pi t}2;\,t^2\big)$, $t\in[0;1]$.</p>`,
        dicas: [R`Não parametrizes: procura um potencial.`],
        passos: [R`$\varphi=xe^y+xz$ verifica $\nabla\varphi=(e^y+z;\,xe^y;\,x)=F$.`, R`$g(0)=(0;0;0)$ e $g(1)=(1;1;1)$.`, R`Trabalho $=\varphi(1;1;1)-\varphi(0;0;0)=e+1$.`],
        solucao: R`<p>$e+1$.</p>` },
      { titulo: 'Circulação nula', tipo: 'TFC',
        enunciado: R`<p>Mostre que $\oint_g\big(y\cos(xy)\,dx+x\cos(xy)\,dy\big)=0$ para qualquer caminho fechado $g$ em $\mathbb R^2$.</p>`,
        dicas: [R`Deriva $\operatorname{sen}(xy)$.`],
        passos: [R`$\nabla\operatorname{sen}(xy)=(y\cos(xy);\,x\cos(xy))$.`, R`O campo é gradiente em $\mathbb R^2$; num caminho fechado $A=B$, logo $\oint=\varphi(A)-\varphi(A)=0$.`],
        solucao: R`<p>É $\nabla\operatorname{sen}(xy)$; a circulação é $0$.</p>` },
      { titulo: 'Provar que não é gradiente', tipo: 'contraexemplo', gerar: 'naograd', modelo: 'trabalho', estado: { F: '(y; 2x)', g: '(cos t; sen t)', ga: '0', gb: '2pi', phi: '' },
        enunciado: R`<p>Mostre que $F(x;y)=(y;\,2x)$ não é um campo gradiente, de duas maneiras.</p>`,
        dicas: [R`Num gradiente $C^1$ as derivadas cruzadas são iguais.`, R`Calcula a circulação na circunferência unitária.`],
        passos: [R`$\frac{\partial F_1}{\partial y}=1\ne2=\frac{\partial F_2}{\partial x}$: se fosse $\nabla\varphi$, Schwarz daria igualdade.`, R`$g(t)=(\cos t;\operatorname{sen}t)$: $F\cdot g'=-\operatorname{sen}^2t+2\cos^2t$.`, R`$\oint=-\pi+2\pi=\pi\ne0$: não pode ser gradiente.`],
        solucao: R`<p>Derivadas cruzadas $1\ne2$; circulação $\pi\ne0$.</p>` },
      { titulo: 'O vórtice em dois caminhos', tipo: 'contraexemplo', modelo: 'potencial', estado: { F: VORT, phi: '' },
        enunciado: R`<p>Seja $F=\frac{(-y;x)}{x^2+y^2}$. Calcule $\oint F\cdot dr$ na circunferência unitária e na circunferência de centro $(3;0)$ e raio $1$. Explique a diferença.</p>`,
        dicas: [R`No semiplano $x>0$, $F=\nabla\arctan\frac yx$.`],
        passos: [R`Unitária: $F\cdot g'=\operatorname{sen}^2t+\cos^2t=1$, logo $\oint=2\pi$.`, R`A segunda circunferência está em $\{x>0\}$, onde $F=\nabla\arctan\frac yx$ é gradiente: $\oint=0$.`, R`$F$ é gradiente em $\{x>0\}$ mas não em $\mathbb R^2\setminus\{0\}$: o primeiro caminho dá a volta à singularidade.`],
        solucao: R`<p>$2\pi$ e $0$.</p>` },
    ],
    geradores: {
      potencial() {
        const m = C.ri(1, 3), n = C.ri(2, 3), v = Math.pow(2, m) * Math.pow(-1, n) - 1;
        const xm = m === 1 ? 'x' : `x^{${m}}`, yn = `y^{${n}}`;
        const F1 = `${m === 1 ? '' : m}${m - 1 > 1 ? `x^{${m - 1}}` : m - 1 === 1 ? 'x' : ''}${yn}`, F2 = `${n}${xm}${n - 1 > 1 ? `y^{${n - 1}}` : 'y'}`;
        return { titulo: 'Potencial e trabalho', tipo: 'TFC', modelo: 'trabalho', estado: { F: `(${m}x^${m - 1}y^${n}; ${n}x^${m}y^${n - 1})`, g: '(1+t; 1-2t)', ga: '0', gb: '1', phi: `x^${m}y^${n}` },
          enunciado: R`<p>Mostre que $F(x;y)=(${F1};\,${F2})$ é um campo gradiente e calcule o trabalho ao longo de qualquer caminho de $(1;1)$ a $(2;-1)$.</p>`,
          dicas: [R`Integra a primeira componente em ordem a $x$.`],
          passos: [R`$\varphi=${xm}${yn}+c(y)$ e $\frac{\partial\varphi}{\partial y}=F_2$ dá $c'=0$.`, R`Trabalho $=\varphi(2;-1)-\varphi(1;1)=${Math.pow(2, m) * Math.pow(-1, n)}-1=${v}$.`],
          solucao: R`<p>$\varphi=${xm}${yn}$; trabalho $${v}$.</p>` };
      },
      naograd() {
        const a = C.ri(2, 4);
        return { titulo: 'Provar que não é gradiente', tipo: 'contraexemplo', modelo: 'trabalho', estado: { F: `(y; ${a}x)`, g: '(cos t; sen t)', ga: '0', gb: '2pi', phi: '' },
          enunciado: R`<p>Mostre que $F(x;y)=(y;\,${a}x)$ não é um campo gradiente, de duas maneiras.</p>`,
          dicas: [R`Derivadas cruzadas; circulação na circunferência unitária.`],
          passos: [R`$\frac{\partial F_1}{\partial y}=1\ne${a}=\frac{\partial F_2}{\partial x}$.`, R`$\oint=\int_0^{2\pi}(-\operatorname{sen}^2t+${a}\cos^2t)\,dt=${a - 1}\pi\ne0$.`],
          solucao: R`<p>Derivadas cruzadas diferentes; circulação $${a - 1}\pi$.</p>` };
      },
    },
  });
})();
