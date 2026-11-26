/* Programa · 7. Integrais múltiplos e aplicações. */
(function () {
  const R = String.raw, C = window.CDI, A = C.antigos;
  const ESF = (ub, ld, lh) => ({ sis: 'esf', ua: '0', ub, lc: '0', ld, le: '0', lh });
  C.materia({
    id: 'integrais', ordem: 7, grupo: 'Cálculo integral', curto: 'Integrais múltiplos', paginas: 'pp. 35–49',
    titulo: 'Integrais múltiplos e aplicações',
    resumo: R`Somas de Riemann, Fubini, regiões elementares, trocar a ordem, integrais triplos, mudança de variáveis (polares, cilíndricas, esféricas), volumes, massas e centros de massa.`,
    modelos: ['integrais.volume', 'integrais.duplo', 'integrais.triplo', 'novo2.limites', 'mudanca.polares', 'mudanca.celulas', 'novo.conversao', 'coordenadas.cilindricas', 'coordenadas.esfericas', 'coordenadas.solidos'],
    aprender: [
      { tipo: 'def', titulo: 'Integral duplo: somas de Riemann', modelo: 'volume', estado: { f: '2-x^2-y^2', riem: true, fatia: false, n: 8 },
        texto: R`<p>Divide-se o retângulo $R=[a;b]\times[c;d]$ em retângulos $R_{ij}$ e escolhe-se um ponto $p_{ij}$ em cada um. A <b>soma de Riemann</b> é $\sum f(p_{ij})\,|R_{ij}|$: a soma dos volumes dos prismas.</p><p>$f$ é <b>integrável</b> se estas somas têm um limite quando as divisões ficam finas; esse limite é $\iint_R f$. Funções contínuas são integráveis. Numa região $D$ limitada, integra-se $f\cdot\mathbb 1_D$ num retângulo que contenha $D$.</p>`,
        experimenta: R`aumenta $n$ e compara a soma com o integral.` },
      { tipo: 'teo', titulo: 'Teorema de Fubini', modelo: 'volume', estado: { f: '2-x^2-y^2', riem: false, fatia: true },
        texto: R`<p>Se $f$ é contínua em $R=[a;b]\times[c;d]$,</p>$$\iint_R f=\int_a^b\Big(\int_c^d f(x;y)\,dy\Big)dx=\int_c^d\Big(\int_a^b f(x;y)\,dx\Big)dy.$$<p>O integral de dentro é a área de um corte; integrar as áreas dos cortes dá o volume.</p>` },
      { tipo: 'def', titulo: 'Regiões elementares', modelo: 'duplo', estado: { r: 'aula', o: 'yx', acum: true },
        texto: R`<p>Tipo I: $D=\{a\le x\le b,\ c(x)\le y\le d(x)\}$, e então $\iint_D f=\int_a^b\int_{c(x)}^{d(x)}f\,dy\,dx$.</p><p>Tipo II: $D=\{c\le y\le d,\ a(y)\le x\le b(y)\}$, com $\int_c^d\int_{a(y)}^{b(y)}f\,dx\,dy$.</p><p>Os limites de dentro podem depender da variável de fora; os de fora são números.</p>` },
      { tipo: 'met', titulo: 'Trocar a ordem de integração', modelo: 'duplo', estado: { r: 'entre', o: 'xy', acum: true },
        texto: R`<p>1. Desenha $D$ a partir dos limites que tens. 2. Lê-a na outra direção: para cada $y$ fixo, de onde a onde vai $x$? 3. Se a fronteira «da esquerda» ou «da direita» muda de fórmula, parte o integral em vários.</p>`,
        experimenta: R`troca entre $dy\,dx$ e $dx\,dy$ e vê os cortes mudarem de direção.` },
      { tipo: 'def', titulo: 'Integral triplo', modelo: 'triplo', estado: { s: 'tetra', z: 0.4 },
        texto: R`<p>O mesmo em $\mathbb R^3$: $\iiint_V f$, com Fubini a permitir as $3!=6$ ordens. $\iiint_V1=\operatorname{vol}(V)$.</p><p>Cortes com $z$ fixo: $\iiint_Vf=\int_{z_0}^{z_1}\Big(\iint_{V_z}f\,dx\,dy\Big)dz$, onde $V_z$ é a secção à altura $z$.</p>` },
      { tipo: 'met', titulo: 'Descrever um sólido pelos limites', modelo: 'limites', estado: { sis: 'cart', ua: '0', ub: '1', lc: '0', ld: '1-x', le: '0', lh: '1-x-y', f: '1', ref: 'x ≥ 0 e y ≥ 0 e z ≥ 0 e x+y+z ≤ 1' },
        texto: R`<p>Escreve tu os limites. A app desenha o sólido que eles descrevem e compara-o com o sólido de referência (escrito com desigualdades): se coincidirem, os limites estão certos.</p><p>Aqui: o tetraedro $x,y,z\ge0$, $x+y+z\le1$, com volume $\frac16$.</p>`,
        experimenta: R`muda o limite de cima de $z$ para $1-x$ e vê as cruzes vermelhas.` },
      { tipo: 'teo', titulo: 'Mudança de variáveis', modelo: 'celulas', estado: { s: 'esf', grelha: true },
        texto: R`<p>Seja $g:U\to g(U)$ de classe $C^1$, injetiva, com $\det Dg\ne0$ (salvo num conjunto de volume nulo). Então</p>$$\iiint_{g(U)}f=\iiint_U f(g(u))\,|\det Dg(u)|\,du.$$<p>$|\det Dg|$ corrige o volume: uma caixinha $du$ no domínio vai para uma célula curva de volume $\approx|\det Dg|\,du$.</p>`,
        demo: R`<p>Aproxima-se $g(U)$ pelas imagens das caixinhas de $U$. Cada imagem é quase o paralelepípedo $Dg(u)[\text{caixa}]$, de volume $|\det Dg(u)|\cdot\operatorname{vol}(\text{caixa})$. Somando, obtém-se uma soma de Riemann do lado direito.</p>` },
      { tipo: 'ex', titulo: 'Polares', modelo: 'polares', estado: { reg: 'disco', R: 1.5, n: 8 },
        texto: R`<p>$x=r\cos\theta$, $y=r\operatorname{sen}\theta$, $|\det Dg|=r$:</p>$$\iint_Df\,dx\,dy=\iint f(r\cos\theta;r\operatorname{sen}\theta)\,r\,dr\,d\theta.$$<p>As células junto à origem são mais pequenas: é o fator $r$.</p>` },
      { tipo: 'ex', titulo: 'Cilíndricas e esféricas', modelo: 'conversao', estado: { sis: 'esfericas', f: 'z sqrt(x^2+y^2+z^2)' },
        texto: R`<p>Cilíndricas $(\rho;\theta;z)$: $x=\rho\cos\theta$, $y=\rho\operatorname{sen}\theta$, fator $\rho$.</p><p>Esféricas $(r;\theta;\varphi)$, com $\varphi\in[0;\pi]$ medido a partir do eixo dos $z$: $x=r\operatorname{sen}\varphi\cos\theta$, $y=r\operatorname{sen}\varphi\operatorname{sen}\theta$, $z=r\cos\varphi$, fator $r^2\operatorname{sen}\varphi$.</p><p>Escreve uma função e vê a conversão passo a passo.</p>` },
      { tipo: 'ex', titulo: 'Um sólido em esféricas', modelo: 'limites', estado: Object.assign(ESF('2pi', 'pi/4', '1'), { f: '1', ref: 'x^2+y^2 ≤ z^2 e x^2+y^2+z^2 ≤ 1 e z ≥ 0' }),
        texto: R`<p>O «cone de gelado» $\{x^2+y^2\le z^2,\ x^2+y^2+z^2\le1,\ z\ge0\}$ é $\{0\le r\le1,\ 0\le\varphi\le\frac\pi4\}$:</p>$$\operatorname{vol}=\int_0^{2\pi}\int_0^{\pi/4}\int_0^1r^2\operatorname{sen}\varphi\,dr\,d\varphi\,d\theta=\frac{2\pi}3\Big(1-\frac{\sqrt2}2\Big).$$` },
      { tipo: 'def', titulo: 'Massa, centro de massa e inércia', modelo: 'limites', estado: { sis: 'cil', ua: '0', ub: '2pi', lc: '0', ld: '1', le: 'rho^2', lh: '1', f: 'x^2+y^2', ref: '' },
        texto: R`<p>Com densidade $\rho(x)$: massa $M=\iiint_V\rho$; centro de massa $\bar x_i=\frac1M\iiint_Vx_i\,\rho$; momento de inércia em relação ao eixo dos $z$: $I_z=\iiint_V(x^2+y^2)\rho$.</p><p>Na integranda da app escreve $(x^2+y^2)$ vezes a densidade para obter $I_z$.</p>` },
      { tipo: 'ex', titulo: 'Os sólidos das aulas', modelo: 'solidos', estado: {},
        texto: R`<p>Cilindros, cones, bolas e o cone de gelado: para cada um, escolhe as coordenadas que tornam os limites constantes.</p>` },
    ],
    aquecimento: [].concat((A.integrais || {}).testa || [], (A.mudanca || {}).testa || [], (A.coordenadas || {}).testa || []),
    exercicios: [
      { titulo: 'Trocar a ordem de integração', tipo: 'Fubini', gerar: 'ordem', modelo: 'duplo', estado: { r: 'entre', o: 'xy' },
        enunciado: R`<p>Inverta a ordem de integração em $\displaystyle\int_0^1\int_{x^2}^{x}f(x;y)\,dy\,dx$ e calcule a área da região.</p>`,
        dicas: [R`A região é $\{0\le x\le1,\ x^2\le y\le x\}$. Desenha-a.`, R`Para $y$ fixo em $[0;1]$, $x$ vai da reta $x=y$ até à parábola $x=\sqrt y$.`],
        passos: [R`$D=\{0\le x\le1,\ x^2\le y\le x\}$: entre a parábola e a reta.`, R`Para $y\in[0;1]$: $y\le x\le\sqrt y$.`, R`$\displaystyle\int_0^1\int_{y}^{\sqrt y}f\,dx\,dy$.`, R`Área $=\int_0^1(x-x^2)\,dx=\frac12-\frac13=\frac16$.`],
        solucao: R`<p>$\int_0^1\int_y^{\sqrt y}f\,dx\,dy$; área $\frac16$.</p>` },
      { titulo: 'Volume entre dois parabolóides', tipo: 'cilíndricas', gerar: 'parab', modelo: 'limites', estado: { sis: 'cil', ua: '0', ub: '2pi', lc: '0', ld: '1', le: 'rho^2', lh: '2-rho^2', f: '1', ref: 'x^2+y^2 ≤ z e z ≤ 2-x^2-y^2' },
        enunciado: R`<p>Calcule o volume do sólido limitado por $z=x^2+y^2$ e $z=2-x^2-y^2$.</p>`,
        dicas: [R`As superfícies cortam-se onde $x^2+y^2=1$.`, R`Em cilíndricas: $\rho^2\le z\le2-\rho^2$, $0\le\rho\le1$.`],
        passos: [R`Interseção: $\rho^2=2-\rho^2$, logo $\rho=1$.`, R`$V=\int_0^{2\pi}\int_0^1\int_{\rho^2}^{2-\rho^2}\rho\,dz\,d\rho\,d\theta$.`, R`$=2\pi\int_0^1(2-2\rho^2)\rho\,d\rho=2\pi\big(1-\frac12\big)=\pi$.`],
        solucao: R`<p>$V=\pi$.</p>` },
      { titulo: 'Cone de gelado', tipo: 'esféricas', gerar: 'gelado', modelo: 'limites', estado: Object.assign(ESF('2pi', 'pi/4', '1'), { f: '1', ref: 'x^2+y^2 ≤ z^2 e x^2+y^2+z^2 ≤ 1 e z ≥ 0' }),
        enunciado: R`<p>Calcule o volume de $V=\{(x;y;z):\ x^2+y^2\le z^2,\ x^2+y^2+z^2\le1,\ z\ge0\}$.</p>`,
        dicas: [R`O cone $x^2+y^2=z^2$ ($z\ge0$) é $\varphi=\frac\pi4$ em esféricas.`],
        passos: [R`$V=\{0\le r\le1,\ 0\le\varphi\le\frac\pi4,\ 0\le\theta\le2\pi\}$.`, R`$\operatorname{vol}=\int_0^{2\pi}\int_0^{\pi/4}\int_0^1r^2\operatorname{sen}\varphi\,dr\,d\varphi\,d\theta=2\pi\cdot\big[-\cos\varphi\big]_0^{\pi/4}\cdot\frac13$.`, R`$=\frac{2\pi}3\big(1-\frac{\sqrt2}2\big)$.`],
        solucao: R`<p>$\frac{2\pi}{3}\big(1-\frac{\sqrt2}{2}\big)$.</p>` },
      { titulo: 'O tetraedro em três coordenadas', tipo: 'limites de integração', modelo: 'limites', estado: { sis: 'esf', ua: '0', ub: 'pi/2', lc: '0', ld: 'pi/2', le: '0', lh: '1/(sen(phi)cos(theta)+sen(phi)sen(theta)+cos(phi))', f: '1', ref: 'x ≥ 0 e y ≥ 0 e z ≥ 0 e x+y+z ≤ 1' },
        enunciado: R`<p>Seja $T=\{x,y,z\ge0,\ x+y+z\le1\}$. Escreva $\operatorname{vol}(T)$ como integral triplo em coordenadas cartesianas e em esféricas, e calcule-o.</p>`,
        dicas: [R`Cartesianas: $0\le x\le1$, $0\le y\le1-x$, $0\le z\le1-x-y$.`, R`Esféricas: substitui no plano $x+y+z=1$ e resolve em ordem a $r$.`],
        passos: [R`Cartesianas: $\int_0^1\int_0^{1-x}\int_0^{1-x-y}dz\,dy\,dx=\int_0^1\frac{(1-x)^2}2dx=\frac16$.`, R`O primeiro octante é $0\le\theta\le\frac\pi2$, $0\le\varphi\le\frac\pi2$.`, R`$x+y+z=1$ fica $r(\operatorname{sen}\varphi\cos\theta+\operatorname{sen}\varphi\operatorname{sen}\theta+\cos\varphi)=1$.`, R`$\int_0^{\pi/2}\int_0^{\pi/2}\int_0^{1/(\operatorname{sen}\varphi\cos\theta+\operatorname{sen}\varphi\operatorname{sen}\theta+\cos\varphi)}r^2\operatorname{sen}\varphi\,dr\,d\varphi\,d\theta$ (difícil de calcular à mão; dá o mesmo $\frac16$).`],
        solucao: R`<p>$\operatorname{vol}(T)=\frac16$. Em esféricas, $0\le r\le\frac{1}{\operatorname{sen}\varphi(\cos\theta+\operatorname{sen}\theta)+\cos\varphi}$, $\theta,\varphi\in[0;\frac\pi2]$.</p>` },
      { titulo: 'Centro de massa de um semidisco', tipo: 'aplicações',
        enunciado: R`<p>Determine o centro de massa de $D=\{x^2+y^2\le R^2,\ y\ge0\}$ com densidade constante.</p>`,
        dicas: [R`Por simetria, $\bar x=0$.`, R`Em polares: $\iint_Dy=\int_0^\pi\int_0^Rr\operatorname{sen}\theta\cdot r\,dr\,d\theta$.`],
        passos: [R`Área $=\frac{\pi R^2}2$; $\bar x=0$ por simetria.`, R`$\iint_Dy=\int_0^\pi\operatorname{sen}\theta\,d\theta\int_0^Rr^2dr=2\cdot\frac{R^3}3$.`, R`$\bar y=\frac{2R^3/3}{\pi R^2/2}=\frac{4R}{3\pi}$.`],
        solucao: R`<p>$(\bar x;\bar y)=\big(0;\frac{4R}{3\pi}\big)$.</p>` },
      { titulo: 'Mudança de variáveis linear', tipo: 'mudança de variáveis',
        enunciado: R`<p>Calcule $\displaystyle\iint_D(x+y)\,e^{x-y}\,dx\,dy$ com $D=\{0\le x+y\le1,\ 0\le x-y\le1\}$.</p>`,
        dicas: [R`$u=x+y$, $v=x-y$. Calcula $\det\frac{\partial(u;v)}{\partial(x;y)}$ e inverte.`],
        passos: [R`$\frac{\partial(u;v)}{\partial(x;y)}=\begin{bmatrix}1&1\\1&-1\end{bmatrix}$, $\det=-2$, logo $dx\,dy=\frac12\,du\,dv$.`, R`$D$ passa a $[0;1]\times[0;1]$.`, R`$\int_0^1\int_0^1ue^v\cdot\frac12\,du\,dv=\frac12\cdot\frac12\cdot(e-1)$.`],
        solucao: R`<p>$\frac{e-1}{4}$.</p>` },
    ],
    geradores: {
      ordem() {
        const n = C.ri(2, 4), raiz = n === 2 ? '\\sqrt y' : '\\sqrt[' + n + ']{y}';
        return { titulo: 'Trocar a ordem de integração', tipo: 'Fubini', modelo: 'duplo', estado: { r: 'entre', o: 'xy' },
          enunciado: R`<p>Inverta a ordem de integração em $\displaystyle\int_0^1\int_{x^{${n}}}^{x}f(x;y)\,dy\,dx$ e calcule a área da região.</p>`,
          dicas: [R`Para $y$ fixo em $[0;1]$, $x$ vai da reta $x=y$ até $x=${raiz}$.`],
          passos: [R`$D=\{0\le x\le1,\ x^{${n}}\le y\le x\}$.`, R`Para $y\in[0;1]$: $y\le x\le${raiz}$.`, R`$\displaystyle\int_0^1\int_{y}^{${raiz}}f\,dx\,dy$.`, R`Área $=\int_0^1(x-x^{${n}})\,dx=\frac12-\frac1{${n + 1}}=${C.frac(n - 1, 2 * (n + 1))}$.`],
          solucao: R`<p>$\int_0^1\int_y^{${raiz}}f\,dx\,dy$; área $${C.frac(n - 1, 2 * (n + 1))}$.</p>` };
      },
      parab() {
        const a = C.ri(1, 3), b = 2 * a * C.ri(1, 2); /* b/(2a) inteiro */
        const R2 = b / (2 * a), V = C.frac(b * b, 4 * a);
        const ar = a === 1 ? '' : a;
        return { titulo: 'Volume entre dois parabolóides', tipo: 'cilíndricas', modelo: 'limites', estado: { sis: 'cil', ua: '0', ub: '2pi', lc: '0', ld: `sqrt(${R2})`, le: `${a}rho^2`, lh: `${b}-${a}rho^2`, f: '1', ref: `${a}(x^2+y^2) ≤ z e z ≤ ${b}-${a}(x^2+y^2)` },
          enunciado: R`<p>Calcule o volume do sólido limitado por $z=${ar}(x^2+y^2)$ e $z=${b}-${ar}(x^2+y^2)$.</p>`,
          dicas: [R`As superfícies cortam-se onde $\rho^2=${R2}$.`],
          passos: [R`Interseção: $2\cdot${ar || 1}\rho^2=${b}$, logo $\rho^2=${R2}$.`, R`$V=\int_0^{2\pi}\int_0^{\sqrt{${R2}}}(${b}-${2 * a}\rho^2)\rho\,d\rho\,d\theta$.`, R`$=2\pi\Big(\frac{${b}\cdot${R2}}2-\frac{${2 * a}\cdot${R2 * R2}}4\Big)=${V}\pi$.`],
          solucao: R`<p>$V=${V}\pi$.</p>` };
      },
      gelado() {
        const [al, c, ang] = C.escolher([['\\frac\\pi6', '\\frac{\\sqrt3}2', 'pi/6'], ['\\frac\\pi4', '\\frac{\\sqrt2}2', 'pi/4'], ['\\frac\\pi3', '\\frac12', 'pi/3']]), Rr = C.ri(1, 2);
        const t2 = { 'pi/6': '\\tfrac13', 'pi/4': '', 'pi/3': '3' }[ang], t2n = { 'pi/6': '1/3', 'pi/4': '1', 'pi/3': '3' }[ang];
        return { titulo: 'Cone de gelado', tipo: 'esféricas', modelo: 'limites', estado: Object.assign(ESF('2pi', ang, String(Rr)), { f: '1', ref: `x^2+y^2 ≤ ${t2n}z^2 e x^2+y^2+z^2 ≤ ${Rr * Rr} e z ≥ 0` }),
          enunciado: R`<p>Calcule o volume de $V=\{x^2+y^2\le ${t2}z^2,\ x^2+y^2+z^2\le${Rr * Rr},\ z\ge0\}$.</p>`,
          dicas: [R`O cone é $\varphi=${al}$ em esféricas.`],
          passos: [R`$V=\{0\le r\le${Rr},\ 0\le\varphi\le${al}\}$.`, R`$\operatorname{vol}=2\pi\cdot(1-\cos${al})\cdot\frac{${Rr}^3}{3}$.`, R`$=\frac{${2 * Rr * Rr * Rr}\pi}3\Big(1-${c}\Big)$.`],
          solucao: R`<p>$\frac{${2 * Rr * Rr * Rr}\pi}{3}\big(1-${c}\big)$.</p>` };
      },
    },
  });
})();
