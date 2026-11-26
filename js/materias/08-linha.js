/* Programa · 8. Curvas, caminhos e integrais de linha. Aplicações. */
(function () {
  const R = String.raw, C = window.CDI;
  C.materia({
    id: 'linha', ordem: 8, grupo: 'Cálculo integral', curto: 'Curvas e integrais de linha',
    titulo: 'Curvas, caminhos e integrais de linha',
    resumo: R`Caminhos e vetor tangente, comprimento, integrais de linha de campos escalares (massa, centro de massa) e de campos vetoriais (trabalho).`,
    modelos: ['gradiente.linhas', 'novo2.escalar', 'novo2.trabalho'],
    aprender: [
      { tipo: 'def', titulo: 'Caminho, curva e vetor tangente', modelo: 'linhas', estado: { g: '(1,2cos t; sen t)', ga: '0', gb: '2pi', t: 1, reta: true },
        texto: R`<p>Um <b>caminho</b> é $g:[a;b]\to\mathbb R^n$ contínuo; a <b>curva</b> é a sua imagem. Se $g$ é $C^1$, $g'(t)$ é o <b>vetor tangente</b> (a velocidade) e a reta tangente em $g(t_0)$ é $g(t_0)+s\,g'(t_0)$.</p><p>$g$ é <b>regular</b> se é $C^1$ e $g'(t)\ne0$ para todo o $t$.</p>` },
      { tipo: 'obs', titulo: 'A mesma curva, outro caminho', modelo: 'linhas', estado: { g: '(1,2cos(2t); sen(2t))', ga: '0', gb: 'pi', t: 0.5, reta: true },
        texto: R`<p>$h(s)=g(\phi(s))$, com $\phi$ bijetiva e $C^1$, é uma <b>reparametrização</b>: percorre a mesma curva a outra velocidade. Se $\phi'>0$ mantém o sentido; se $\phi'<0$ inverte-o.</p>` },
      { tipo: 'def', titulo: 'Comprimento', modelo: 'escalar', estado: { g: '(t - sen t; 1 - cos t)', ga: '0', gb: '2pi', rho: '1', n: 4 },
        texto: R`<p>O comprimento de um caminho $C^1$ é</p>$$L(g)=\int_a^b\|g'(t)\|\,dt.$$<p>É o supremo dos comprimentos das poligonais inscritas: cada segmento de $g(t_i)$ a $g(t_{i+1})$ tem comprimento $\approx\|g'(t_i)\|\,\Delta t$.</p>`,
        experimenta: R`aumenta o número de segmentos e compara a poligonal com $L$.` },
      { tipo: 'prop', titulo: 'Não depende da parametrização', modelo: 'escalar', estado: { g: '(cos(t^2); sen(t^2))', ga: '0', gb: 'sqrt(2pi)', rho: '1', n: 6 },
        texto: R`<p>Reparametrizações dão o mesmo comprimento: $\int_c^d\|g'(\phi(s))\|\,|\phi'(s)|\,ds=\int_a^b\|g'(t)\|\,dt$ (mudança de variável $t=\phi(s)$).</p><p>Aqui a circunferência é percorrida com velocidade variável e o comprimento continua a ser $2\pi$.</p>` },
      { tipo: 'def', titulo: 'Integral de linha de um campo escalar', modelo: 'escalar', estado: { g: '(cos t; sen t; t/4)', ga: '0', gb: '2pi', rho: 'z', n: 6 },
        texto: R`<p>Para $f$ contínua sobre a curva:</p>$$\int_g f\,ds=\int_a^b f(g(t))\,\|g'(t)\|\,dt.$$<p>Se $f$ é a densidade de um fio, é a <b>massa</b>. Para curvas no plano é a área da «cortina» entre a curva e o gráfico de $f$. Não depende da parametrização nem do sentido.</p>` },
      { tipo: 'ex', titulo: 'Centro de massa e inércia de um fio', modelo: 'escalar', estado: { g: '(cos t; sen t; t/4)', ga: '0', gb: '2pi', rho: '1+y', n: 6 },
        texto: R`<p>Massa $M=\int_g\rho\,ds$, centro de massa $\bar x_i=\frac1M\int_gx_i\,\rho\,ds$, momento de inércia em relação ao eixo dos $z$: $I_z=\int_g(x^2+y^2)\rho\,ds$.</p><p>Escreve a densidade e lê os três valores.</p>` },
      { tipo: 'def', titulo: 'Integral de linha de um campo vetorial', modelo: 'trabalho', estado: { F: '(-y; x; z)', g: '(cos t; sen t; t/4)', ga: '0', gb: '2pi', phi: '', t: 0.6, inv: false },
        texto: R`<p>O <b>trabalho</b> de $F$ ao longo de $g$ é</p>$$\int_gF\cdot dr=\int_a^bF(g(t))\cdot g'(t)\,dt.$$<p>Também se escreve $\int_gF_1\,dx+F_2\,dy+F_3\,dz$. Só conta a componente de $F$ na direção do movimento.</p>` },
      { tipo: 'prop', titulo: 'O sentido importa', modelo: 'trabalho', estado: { F: '(-y; x; z)', g: '(cos t; sen t; t/4)', ga: '0', gb: '2pi', phi: '', t: 1, inv: true },
        texto: R`<p>Reparametrizações que mantêm o sentido dão o mesmo trabalho; as que o invertem trocam-lhe o sinal: $\int_{-g}F\cdot dr=-\int_gF\cdot dr$.</p><p>Ao contrário do integral de um campo escalar, que não muda.</p>` },
      { tipo: 'ex', titulo: 'Circulação numa circunferência', modelo: 'trabalho', estado: { F: '(-y; x)', g: '(cos t; sen t)', ga: '0', gb: '2pi', phi: '', t: 1, inv: false },
        texto: R`<p>$F=(-y;x)$ e $g(t)=(\cos t;\operatorname{sen}t)$: $F(g(t))\cdot g'(t)=\operatorname{sen}^2t+\cos^2t=1$, logo $\oint F\cdot dr=2\pi$.</p><p>O campo é sempre tangente à circunferência e no sentido do movimento.</p>` },
    ],
    aquecimento: [
      { p: R`O comprimento da hélice $g(t)=(\cos t;\operatorname{sen}t;t)$, $t\in[0;2\pi]$, é:`, op: [R`$2\pi$`, R`$2\sqrt2\,\pi$`, R`$4\pi$`, R`$\sqrt2\,\pi$`], certa: 1, porque: R`$\|g'(t)\|=\|(-\operatorname{sen}t;\cos t;1)\|=\sqrt2$, logo $L=2\pi\sqrt2$.` },
      { p: R`Inverter o sentido de percurso…`, op: [R`muda o sinal de $\int_g f\,ds$ e de $\int_g F\cdot dr$`, R`muda o sinal de $\int_gF\cdot dr$ mas não de $\int_gf\,ds$`, R`não muda nenhum dos dois`, R`muda o sinal de $\int_gf\,ds$ mas não de $\int_gF\cdot dr$`], certa: 1, porque: R`$ds=\|g'\|dt$ é sempre positivo; $F\cdot g'$ troca de sinal com $g'$.` },
      { p: R`Se $F$ é sempre perpendicular a $g'(t)$ ao longo do caminho, então $\int_gF\cdot dr$…`, op: [R`é $0$`, R`é o comprimento`, R`é $\|F\|$`, R`não se pode saber`], certa: 0, porque: R`A integranda $F(g(t))\cdot g'(t)$ é identicamente nula.` },
    ],
    exercicios: [
      { titulo: 'Comprimento de uma hélice', tipo: 'comprimento', gerar: 'helice', modelo: 'escalar', estado: { g: '(3cos t; 3sen t; 4t)', ga: '0', gb: '2pi', rho: '1' },
        enunciado: R`<p>Calcule o comprimento de $g(t)=(3\cos t;\,3\operatorname{sen}t;\,4t)$, $t\in[0;2\pi]$.</p>`,
        dicas: [R`$L=\int\|g'(t)\|\,dt$.`],
        passos: [R`$g'(t)=(-3\operatorname{sen}t;\,3\cos t;\,4)$.`, R`$\|g'(t)\|=\sqrt{9+16}=5$.`, R`$L=\int_0^{2\pi}5\,dt=10\pi$.`],
        solucao: R`<p>$L=10\pi$.</p>` },
      { titulo: 'Comprimento de um arco de cicloide', tipo: 'comprimento', modelo: 'escalar', estado: { g: '(t - sen t; 1 - cos t)', ga: '0', gb: '2pi', rho: '1' },
        enunciado: R`<p>Calcule o comprimento de $g(t)=(t-\operatorname{sen}t;\,1-\cos t)$, $t\in[0;2\pi]$.</p>`,
        dicas: [R`$1-\cos t=2\operatorname{sen}^2\frac t2$.`],
        passos: [R`$g'(t)=(1-\cos t;\,\operatorname{sen}t)$, $\|g'\|^2=2-2\cos t=4\operatorname{sen}^2\frac t2$.`, R`$\|g'(t)\|=2\operatorname{sen}\frac t2$ em $[0;2\pi]$.`, R`$L=\int_0^{2\pi}2\operatorname{sen}\frac t2\,dt=\big[-4\cos\frac t2\big]_0^{2\pi}=8$.`],
        solucao: R`<p>$L=8$.</p>` },
      { titulo: 'Massa de um fio circular', tipo: 'campo escalar', gerar: 'massa', modelo: 'escalar', estado: { g: '(2cos t; 2sen t)', ga: '0', gb: '2pi', rho: 'x^2' },
        enunciado: R`<p>Um fio tem a forma da circunferência $x^2+y^2=4$ e densidade $\rho(x;y)=x^2$. Calcule a massa.</p>`,
        dicas: [R`$g(t)=(2\cos t;2\operatorname{sen}t)$, $\|g'\|=2$.`],
        passos: [R`$M=\int_0^{2\pi}(2\cos t)^2\cdot2\,dt=8\int_0^{2\pi}\cos^2t\,dt$.`, R`$\int_0^{2\pi}\cos^2t\,dt=\pi$.`, R`$M=8\pi$.`],
        solucao: R`<p>$M=8\pi$.</p>` },
      { titulo: 'Trabalho ao longo de uma hélice', tipo: 'campo vetorial', modelo: 'trabalho', estado: { F: '(y; -x; z)', g: '(cos t; sen t; t)', ga: '0', gb: '2pi', phi: '' },
        enunciado: R`<p>Calcule $\int_gF\cdot dr$ com $F(x;y;z)=(y;-x;z)$ e $g(t)=(\cos t;\operatorname{sen}t;t)$, $t\in[0;2\pi]$.</p>`,
        dicas: [R`$F(g(t))\cdot g'(t)$ com $g'(t)=(-\operatorname{sen}t;\cos t;1)$.`],
        passos: [R`$F(g(t))=(\operatorname{sen}t;-\cos t;t)$.`, R`$F\cdot g'=-\operatorname{sen}^2t-\cos^2t+t=t-1$.`, R`$\int_0^{2\pi}(t-1)\,dt=2\pi^2-2\pi$.`],
        solucao: R`<p>$2\pi^2-2\pi$.</p>` },
      { titulo: 'Trabalho numa parábola', tipo: 'campo vetorial', gerar: 'parabola', modelo: 'trabalho', estado: { F: '(x^2; xy)', g: '(t; t^2)', ga: '0', gb: '1', phi: '' },
        enunciado: R`<p>Calcule $\int_g x^2\,dx+xy\,dy$ ao longo da parábola $y=x^2$, de $(0;0)$ a $(1;1)$.</p>`,
        dicas: [R`$g(t)=(t;t^2)$, $t\in[0;1]$.`],
        passos: [R`$g'(t)=(1;2t)$, $F(g(t))=(t^2;t^3)$.`, R`$F\cdot g'=t^2+2t^4$.`, R`$\int_0^1(t^2+2t^4)\,dt=\frac13+\frac25=\frac{11}{15}$.`],
        solucao: R`<p>$\frac{11}{15}$.</p>` },
    ],
    geradores: {
      helice() {
        const [a, b, c] = C.escolher([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5]]);
        return { titulo: 'Comprimento de uma hélice', tipo: 'comprimento', modelo: 'escalar', estado: { g: `(${a}cos t; ${a}sen t; ${b}t)`, ga: '0', gb: '2pi', rho: '1' },
          enunciado: R`<p>Calcule o comprimento de $g(t)=(${a}\cos t;\,${a}\operatorname{sen}t;\,${b}t)$, $t\in[0;2\pi]$.</p>`,
          dicas: [R`$L=\int\|g'(t)\|\,dt$.`],
          passos: [R`$\|g'(t)\|=\sqrt{${a * a}+${b * b}}=${c}$.`, R`$L=${2 * c}\pi$.`],
          solucao: R`<p>$L=${2 * c}\pi$.</p>` };
      },
      massa() {
        const r = C.ri(1, 3), y = C.escolher(['x', 'y']);
        return { titulo: 'Massa de um fio circular', tipo: 'campo escalar', modelo: 'escalar', estado: { g: `(${r}cos t; ${r}sen t)`, ga: '0', gb: '2pi', rho: `${y}^2` },
          enunciado: R`<p>Um fio tem a forma da circunferência $x^2+y^2=${r * r}$ e densidade $\rho(x;y)=${y}^2$. Calcule a massa.</p>`,
          dicas: [R`$\|g'\|=${r}$ e $\int_0^{2\pi}${y === 'x' ? '\\cos' : '\\operatorname{sen}'}^2t\,dt=\pi$.`],
          passos: [R`$M=\int_0^{2\pi}${r * r}${y === 'x' ? '\\cos' : '\\operatorname{sen}'}^2t\cdot${r}\,dt=${r * r * r}\pi$.`],
          solucao: R`<p>$M=${r * r * r}\pi$.</p>` };
      },
      parabola() {
        const a = C.ri(1, 4);
        return { titulo: 'Trabalho numa parábola', tipo: 'campo vetorial', modelo: 'trabalho', estado: { F: `(x^2; ${a}xy)`, g: '(t; t^2)', ga: '0', gb: '1', phi: '' },
          enunciado: R`<p>Calcule $\int_g x^2\,dx+${a === 1 ? '' : a}xy\,dy$ ao longo de $y=x^2$, de $(0;0)$ a $(1;1)$.</p>`,
          dicas: [R`$g(t)=(t;t^2)$.`],
          passos: [R`$F\cdot g'=t^2+${2 * a}t^4$.`, R`$\int_0^1=\frac13+\frac{${2 * a}}5=${C.frac(5 + 6 * a, 15)}$.`],
          solucao: R`<p>$${C.frac(5 + 6 * a, 15)}$.</p>` };
      },
    },
  });
})();
