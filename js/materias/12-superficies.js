/* Extra · Superfícies em ℝ³ (complemento). */
(function () {
  const R = String.raw, C = window.CDI, A = C.antigos.superficies || {};
  const TIPOS = ['def', 'prop', 'ex', 'def'];
  C.materia({
    id: 'superficies', ordem: 12, extra: true, grupo: 'Extra', curto: 'Superfícies em ℝ³', paginas: 'complemento',
    titulo: 'Superfícies em ℝ³',
    resumo: R`Parametrizações, vetores tangentes, normal, plano tangente e área como soma de paralelogramos.`,
    modelos: ['superficies.esfera', 'superficies.grafico', 'superficies.area'],
    aprender: (A.explicar || []).map((p, i) => Object.assign({ tipo: TIPOS[i] || 'obs' }, p)),
    aquecimento: A.testa || [],
    exercicios: [
      { titulo: 'Área de uma esfera', tipo: 'área de superfície', modelo: 'esfera',
        enunciado: R`<p>Usando $g(\theta;\varphi)=(R\operatorname{sen}\varphi\cos\theta;\,R\operatorname{sen}\varphi\operatorname{sen}\theta;\,R\cos\varphi)$, calcule a área da esfera de raio $R$.</p>`,
        dicas: [R`$\operatorname{área}=\iint\Big\|\frac{\partial g}{\partial\theta}\times\frac{\partial g}{\partial\varphi}\Big\|\,d\theta\,d\varphi$.`],
        passos: [R`$\Big\|\frac{\partial g}{\partial\theta}\times\frac{\partial g}{\partial\varphi}\Big\|=R^2\operatorname{sen}\varphi$.`, R`$\int_0^{2\pi}\int_0^\pi R^2\operatorname{sen}\varphi\,d\varphi\,d\theta=2\pi R^2\cdot2=4\pi R^2$.`],
        solucao: R`<p>$4\pi R^2$.</p>` },
      { titulo: 'Plano tangente a um gráfico', tipo: 'plano tangente', gerar: 'grafico', modelo: 'grafico',
        enunciado: R`<p>Determine o plano tangente à superfície $z=x^2+y^2$ no ponto $(1;1;2)$.</p>`,
        dicas: [R`Num gráfico $z=f(x;y)$: $z=f(a)+\nabla f(a)\cdot(x-a)$.`],
        passos: [R`$\nabla f=(2x;2y)=(2;2)$ em $(1;1)$.`, R`$z=2+2(x-1)+2(y-1)$, isto é, $z=2x+2y-2$.`],
        solucao: R`<p>$z=2x+2y-2$.</p>` },
    ],
    geradores: {
      grafico() {
        const a = C.ri(-2, 2), b = C.ri(1, 2), c = a * a + b * b;
        const X = a < 0 ? `(x+${-a})` : a === 0 ? 'x' : `(x-${a})`, Y = `(y-${b})`;
        const plano = `${C.termo(2 * a, 'x', true)}${C.termo(2 * b, 'y', !a)}-${c}`;
        return { titulo: 'Plano tangente a um gráfico', tipo: 'plano tangente', modelo: 'grafico',
          enunciado: R`<p>Determine o plano tangente à superfície $z=x^2+y^2$ no ponto $(${a};${b};${c})$.</p>`,
          dicas: [R`$z=f(a)+\nabla f(a)\cdot(x-a)$.`],
          passos: [R`$\nabla f(${a};${b})=(${2 * a};${2 * b})$.`, R`$z=${c}${C.termo(2 * a, X)}${C.termo(2 * b, Y)}$, isto é, $z=${plano}$.`],
          solucao: R`<p>$z=${plano}$.</p>` };
      },
    },
  });
})();
