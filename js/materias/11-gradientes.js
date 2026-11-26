/* Programa · 11. Campos vetoriais gradientes de campos escalares. */
(function () {
  const R = String.raw, C = window.CDI;
  const VORT = '(-y/(x^2+y^2); x/(x^2+y^2))';
  C.materia({
    id: 'gradientes', ordem: 11, grupo: 'Cálculo integral', curto: 'Campos gradientes',
    titulo: 'Campos vetoriais gradientes de campos escalares',
    resumo: R`Quando é que $F=\nabla\varphi$: campos fechados, domínios simplesmente conexos, o vórtice e como calcular o potencial.`,
    modelos: ['novo2.trabalho', 'green.potencial', 'novo.vetorial'],
    aprender: [
      { tipo: 'def', titulo: 'Campo gradiente', modelo: 'vetorial', estado: { F: '(2x; -2y)', p: [0.8, 0.4], linha: true },
        texto: R`<p>$F:D\to\mathbb R^n$ é <b>gradiente</b> (ou conservativo) em $D$ se existe $\varphi\in C^1(D)$ com $F=\nabla\varphi$. As linhas de campo cruzam os conjuntos de nível de $\varphi$ em ângulo reto.</p><p>Aqui $F=(2x;-2y)=\nabla(x^2-y^2)$.</p>` },
      { tipo: 'prop', titulo: 'Condição necessária: F fechado', modelo: 'trabalho', estado: { F: '(2xy+z; x^2+2yz; x+y^2)', g: '(cos t; sen t; t/4)', ga: '0', gb: '2pi', phi: '', t: 1 },
        texto: R`<p>Se $F=\nabla\varphi$ é de classe $C^1$, então $\frac{\partial F_i}{\partial x_j}=\frac{\partial^2\varphi}{\partial x_j\partial x_i}=\frac{\partial F_j}{\partial x_i}$ (Schwarz): a Jacobiana $DF$ é <b>simétrica</b>. Um campo assim chama-se <b>fechado</b>.</p><p>Em $\mathbb R^2$: $\frac{\partial F_1}{\partial y}=\frac{\partial F_2}{\partial x}$. Em $\mathbb R^3$: $\operatorname{rot}F=0$.</p>` },
      { tipo: 'def', titulo: 'Simplesmente conexo', modelo: 'potencial', estado: { F: VORT, phi: '', mapa: true, A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.7] },
        texto: R`<p>Um aberto $D$ conexo por arcos é <b>simplesmente conexo</b> se toda a curva fechada em $D$ se pode deformar continuamente, dentro de $D$, até um ponto. Convexos e conjuntos em estrela são simplesmente conexos.</p><p>$\mathbb R^2\setminus\{0\}$ não é: uma circunferência à volta da origem não encolhe sem passar por ela.</p>` },
      { tipo: 'teo', titulo: 'Fechado em simplesmente conexo ⇒ gradiente', modelo: 'potencial', estado: { F: '(x+y; x+e^y+1)', phi: 'xy+x^2/2+e^y+y', mapa: true },
        texto: R`<p>Se $F$ é $C^1$ e fechado num aberto <b>simplesmente conexo</b> $D$, então $F$ é gradiente em $D$.</p>`,
        demo: R`<p>Num conjunto em estrela em relação a $0$, define-se $\varphi(x)=\int_0^1F(tx)\cdot x\,dt$ (o trabalho no segmento de $0$ a $x$). Derivando dentro do integral e usando a simetria de $DF$, $\frac{\partial\varphi}{\partial x_i}=\int_0^1\frac{d}{dt}\big(tF_i(tx)\big)dt=F_i(x)$. No caso geral usa-se Green (em $\mathbb R^2$) ou Stokes para mostrar que os integrais não dependem do caminho.</p>` },
      { tipo: 'contra', titulo: 'O vórtice', modelo: 'potencial', estado: { F: VORT, phi: '', mapa: true, A: [1.4, 0.2], B: [-1.2, 0.6], K: [0.2, -1.7] },
        texto: R`<p>$F=\frac{(-y;x)}{x^2+y^2}$ é fechado em $\mathbb R^2\setminus\{0\}$, mas $\oint F\cdot dr=2\pi$ na circunferência unitária: <b>não é gradiente</b>. O domínio não é simplesmente conexo.</p><p>Em $\{x>0\}$ (simplesmente conexo) já é: $F=\nabla\arctan\frac yx$.</p>` },
      { tipo: 'met', titulo: 'Calcular um potencial', modelo: 'trabalho', estado: { F: '(2xy+z; x^2+2yz; x+y^2)', g: '(t; t; t)', ga: '0', gb: '1', phi: 'x^2y+xz+y^2z', t: 1 },
        texto: R`<p>Para $F=(2xy+z;\,x^2+2yz;\,x+y^2)$:</p><ol><li>$\varphi=\int(2xy+z)\,dx=x^2y+xz+c(y;z)$.</li><li>$\frac{\partial\varphi}{\partial y}=x^2+\frac{\partial c}{\partial y}=x^2+2yz$, logo $c=y^2z+k(z)$.</li><li>$\frac{\partial\varphi}{\partial z}=x+y^2+k'(z)=x+y^2$, logo $k$ é constante.</li></ol><p>$\varphi=x^2y+xz+y^2z$. Escreve-o na caixa e a app confirma.</p>` },
      { tipo: 'obs', titulo: 'Em ℝ³ os buracos são outros', modelo: 'trabalho', estado: { F: '(-y/(x^2+y^2); x/(x^2+y^2); 0)', g: '(cos t; sen t; t/4)', ga: '0', gb: '2pi', phi: '', t: 1 },
        texto: R`<p>$\mathbb R^3\setminus\{0\}$ <b>é</b> simplesmente conexo (um laço desvia-se do ponto). $\mathbb R^3$ sem o eixo dos $z$ não é. O vórtice $\frac{(-y;x;0)}{x^2+y^2}$ é fechado neste último e o trabalho numa volta à volta do eixo é $2\pi$: não é gradiente.</p>` },
      { tipo: 'ex', titulo: 'Campos centrais', modelo: 'vetorial', estado: { F: '(x; y; z)', z0: 0.4, linha: true },
        texto: R`<p>$F(x)=h(\|x\|)\,x$ é gradiente em $\mathbb R^n\setminus\{0\}$: $F=\nabla H(\|x\|)$ com $H'(r)=r\,h(r)$. Exemplo: o campo gravítico $-\frac{x}{\|x\|^3}=\nabla\frac1{\|x\|}$.</p>` },
    ],
    aquecimento: [
      { p: R`$F=(P;Q)$ é $C^1$ em $\mathbb R^2$ e $\frac{\partial P}{\partial y}=\frac{\partial Q}{\partial x}$. Então $F$ é gradiente em $\mathbb R^2$?`, op: [R`Sim: $\mathbb R^2$ é simplesmente conexo`, R`Não necessariamente`, R`Só se $F$ for limitado`, R`Só se $P=Q$`], certa: 0, porque: R`Fechado num simplesmente conexo implica gradiente.` },
      { p: R`Qual destes conjuntos é simplesmente conexo?`, op: [R`$\mathbb R^2\setminus\{(0;0)\}$`, R`$\mathbb R^3\setminus\{(0;0;0)\}$`, R`$\mathbb R^3$ sem o eixo dos $z$`, R`uma coroa circular`], certa: 1, porque: R`Em $\mathbb R^3$, um laço pode sempre desviar-se de um ponto.` },
      { p: R`$F=\frac{(x;y)}{x^2+y^2}$ em $\mathbb R^2\setminus\{0\}$ é…`, op: [R`gradiente, de $\tfrac12\ln(x^2+y^2)$`, R`fechado mas não gradiente`, R`não fechado`, R`gradiente de $\arctan\frac yx$`], certa: 0, porque: R`$\nabla\tfrac12\ln(x^2+y^2)=\frac{(x;y)}{x^2+y^2}$. O domínio não ser simplesmente conexo não impede um campo de ser gradiente.` },
    ],
    exercicios: [
      { titulo: 'Escolher o parâmetro', tipo: 'potencial', gerar: 'parametro', modelo: 'trabalho', estado: { F: '(2xy+z^2; x^2+z; 2xz+y)', g: '(t; t; t)', ga: '0', gb: '1', phi: 'x^2y+xz^2+yz' },
        enunciado: R`<p>Determine $a$ para que $F=(axy+z^2;\,x^2+z;\,2xz+y)$ seja gradiente em $\mathbb R^3$ e calcule um potencial.</p>`,
        dicas: [R`$\mathbb R^3$ é simplesmente conexo: basta que $F$ seja fechado.`],
        passos: [R`$\frac{\partial F_1}{\partial y}=ax$ e $\frac{\partial F_2}{\partial x}=2x$: $a=2$.`, R`$\frac{\partial F_1}{\partial z}=2z=\frac{\partial F_3}{\partial x}$ e $\frac{\partial F_2}{\partial z}=1=\frac{\partial F_3}{\partial y}$.`, R`$\varphi=\int(2xy+z^2)\,dx=x^2y+xz^2+c(y;z)$; comparando com $F_2$ e $F_3$: $c=yz$.`],
        solucao: R`<p>$a=2$, $\varphi=x^2y+xz^2+yz$.</p>` },
      { titulo: 'Gradiente fora da origem', tipo: 'domínio', modelo: 'vetorial', estado: { F: '(x/(x^2+y^2); y/(x^2+y^2))' },
        enunciado: R`<p>Mostre que $F=\frac{(x;y)}{x^2+y^2}$ é gradiente em $\mathbb R^2\setminus\{0\}$, apesar de este conjunto não ser simplesmente conexo.</p>`,
        dicas: [R`Procura $\varphi$ que só dependa de $x^2+y^2$.`],
        passos: [R`$\varphi=\frac12\ln(x^2+y^2)$ está definida e é $C^1$ em $\mathbb R^2\setminus\{0\}$.`, R`$\nabla\varphi=\frac{(x;y)}{x^2+y^2}=F$.`, R`A condição «simplesmente conexo» é suficiente, não necessária.`],
        solucao: R`<p>$F=\nabla\frac12\ln(x^2+y^2)$.</p>` },
      { titulo: 'Fechado mas não gradiente em ℝ³', tipo: 'contraexemplo', modelo: 'trabalho', estado: { F: '(-y/(x^2+y^2); x/(x^2+y^2); 0)', g: '(cos t; sen t; 0)', ga: '0', gb: '2pi', phi: '' },
        enunciado: R`<p>Seja $F=\frac{(-y;\,x;\,0)}{x^2+y^2}$ em $D=\{(x;y;z): x^2+y^2>0\}$. Mostre que $F$ é fechado e que não é gradiente em $D$.</p>`,
        dicas: [R`Calcula $\operatorname{rot}F$.`, R`Calcula o trabalho na circunferência $x^2+y^2=1$, $z=0$.`],
        passos: [R`$\frac{\partial F_2}{\partial x}-\frac{\partial F_1}{\partial y}=\frac{y^2-x^2}{(x^2+y^2)^2}-\frac{y^2-x^2}{(x^2+y^2)^2}=0$; as outras componentes do rotacional são $0$ porque $F_3=0$ e $F_1,F_2$ não dependem de $z$.`, R`Na circunferência: $\oint F\cdot dr=\int_0^{2\pi}1\,dt=2\pi\ne0$.`, R`Um gradiente teria circulação nula: $F$ não é gradiente em $D$ (que não é simplesmente conexo).`],
        solucao: R`<p>$\operatorname{rot}F=0$ e $\oint F\cdot dr=2\pi$.</p>` },
      { titulo: 'Potencial e trabalho', tipo: 'potencial', gerar: 'exp', modelo: 'trabalho', estado: { F: '(e^x sen y; e^x cos y + 2y)', g: '(t; pi t/2)', ga: '0', gb: '1', phi: 'e^x sen y + y^2' },
        enunciado: R`<p>Determine um potencial de $F=(e^x\operatorname{sen}y;\,e^x\cos y+2y)$ e calcule o trabalho de $(0;0)$ a $\big(1;\frac\pi2\big)$.</p>`,
        dicas: [R`Integra a primeira componente em ordem a $x$.`],
        passos: [R`$\varphi=e^x\operatorname{sen}y+c(y)$; $\frac{\partial\varphi}{\partial y}=e^x\cos y+c'(y)$, logo $c=y^2$.`, R`Trabalho $=\varphi\big(1;\frac\pi2\big)-\varphi(0;0)=e+\frac{\pi^2}4$.`],
        solucao: R`<p>$\varphi=e^x\operatorname{sen}y+y^2$; trabalho $e+\frac{\pi^2}{4}$.</p>` },
      { titulo: 'O potencial que se anula na origem', tipo: 'potencial',
        enunciado: R`<p>Mostre que $F=(2xy;\,x^2+1)$ é gradiente em $\mathbb R^2$ e determine o potencial $\varphi$ com $\varphi(0;0)=0$.</p>`,
        dicas: [R`Fechado em $\mathbb R^2$ chega.`],
        passos: [R`$\frac{\partial F_1}{\partial y}=2x=\frac{\partial F_2}{\partial x}$, e $\mathbb R^2$ é simplesmente conexo.`, R`$\varphi=x^2y+c(y)$ e $\frac{\partial\varphi}{\partial y}=x^2+c'(y)=x^2+1$: $c=y+k$.`, R`$\varphi(0;0)=0$ dá $k=0$.`],
        solucao: R`<p>$\varphi=x^2y+y$.</p>` },
    ],
    geradores: {
      parametro() {
        const k = C.ri(1, 3), a = 2 * k;
        return { titulo: 'Escolher o parâmetro', tipo: 'potencial', modelo: 'trabalho', estado: { F: `(${a}xy+z^2; ${k}x^2+z; 2xz+y)`, g: '(t; t; t)', ga: '0', gb: '1', phi: `${k}x^2y+xz^2+yz` },
          enunciado: R`<p>Determine $a$ para que $F=(axy+z^2;\,${k === 1 ? '' : k}x^2+z;\,2xz+y)$ seja gradiente em $\mathbb R^3$ e calcule um potencial.</p>`,
          dicas: [R`Basta que as derivadas cruzadas coincidam.`],
          passos: [R`$\frac{\partial F_1}{\partial y}=ax$, $\frac{\partial F_2}{\partial x}=${2 * k}x$: $a=${a}$.`, R`As outras igualdades verificam-se ($2z$ e $1$).`, R`$\varphi=${k === 1 ? '' : k}x^2y+xz^2+yz$.`],
          solucao: R`<p>$a=${a}$, $\varphi=${k === 1 ? '' : k}x^2y+xz^2+yz$.</p>` };
      },
      exp() {
        const b = C.ri(1, 3);
        return { titulo: 'Potencial e trabalho', tipo: 'potencial', modelo: 'trabalho', estado: { F: `(e^x sen y; e^x cos y + ${2 * b}y)`, g: '(t; pi t/2)', ga: '0', gb: '1', phi: `e^x sen y + ${b}y^2` },
          enunciado: R`<p>Determine um potencial de $F=(e^x\operatorname{sen}y;\,e^x\cos y+${2 * b}y)$ e calcule o trabalho de $(0;0)$ a $\big(1;\frac\pi2\big)$.</p>`,
          dicas: [R`Integra a primeira componente em ordem a $x$.`],
          passos: [R`$\varphi=e^x\operatorname{sen}y+${b === 1 ? '' : b}y^2$.`, R`Trabalho $=e+${b === 1 ? '' : b}\frac{\pi^2}4$.`],
          solucao: R`<p>Trabalho $e+${C.frac(b, 4)}\pi^2$.</p>` };
      },
    },
  });
})();
