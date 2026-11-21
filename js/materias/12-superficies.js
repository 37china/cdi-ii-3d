/* 12. Superfícies em ℝ³ (modelo anterior, adaptado): parametrização, espaço tangente, normal, área. */
(function () {
  const PI = Math.PI, OURO = '#D9A21B';
  const gS = (t, p, R) => [R * Math.sin(p) * Math.cos(t), R * Math.sin(p) * Math.sin(t), R * Math.cos(p)];
  const gSt = (t, p, R) => [-R * Math.sin(p) * Math.sin(t), R * Math.sin(p) * Math.cos(t), 0];
  const gSp = (t, p, R) => [R * Math.cos(p) * Math.cos(t), R * Math.cos(p) * Math.sin(t), -R * Math.sin(p)];
  const FG = {
    hemi: { nome: '√(1 − x² − y²)', f: (x, y) => Math.sqrt(Math.max(0, 1 - x * x - y * y)), dom: (x, y) => x * x + y * y < 0.98, fx: 'fx = −x/√(1 − x² − y²)', fy: 'fy = −y/√(1 − x² − y²)' },
    parab: { nome: 'x² + y²', f: (x, y) => x * x + y * y, fx: 'fx = 2x', fy: 'fy = 2y' },
    sela: { nome: 'x² − y²', f: (x, y) => x * x - y * y, fx: 'fx = 2x', fy: 'fy = −2y' },
  };
  const fmtK = (k) => CM.fmtPi((k * PI) / 24);

  CDI.materia({
    id: 'superficies', ordem: 12, grupo: 'Geometria em ℝ³', curto: 'Superfícies em ℝ³', titulo: 'Superfícies em ℝ³', paginas: 'modelo anterior',
    resumo: 'Parametrizações, vetores tangentes, normal, plano tangente e área como soma de paralelogramos.',
    modelos: [
      {
        id: 'esfera', nome: 'Esfera g(θ; φ)',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.7 });
          M.barra('kt', { rot: 'θ₀', cor: cor.u, min: 0, max: 48, passo: 1, valor: 6, fmt: fmtK, circular: true, nome: 'θ₀' });
          M.barra('kp', { rot: 'φ₀', cor: cor.v, min: 0, max: 24, passo: 1, valor: 6, fmt: fmtK, nome: 'φ₀' });
          M.barra('R', { rot: 'R', cor: cor.m, min: 0.5, max: 1.5, valor: 1, nome: 'raio R' });
          M.caixa('curvas', { rot: 'Linhas coordenadas', valor: true });
          M.caixa('plano', { rot: 'Plano tangente', valor: true });
          M.botoes([['Exemplo da aula: θ₀ = φ₀ = π/4', () => M.definir({ kt: 6, kp: 6, R: 1 })]]);
          M.cena(V, (C, S) => {
            const t0 = (S.kt * PI) / 24, p0 = (S.kp * PI) / 24, R = S.R;
            C.eixos({ x: [-1.6, 1.6], y: [-1.6, 1.6], z: [-1.6, 1.7] });
            C.sup((t, p) => gS(t, p, R), 0, 2 * PI, 0, PI, 36, 18, { cor: cor.sup, corTras: cor.sup, alfa: 0.55 });
            const P = gS(t0, p0, R), a = gSt(t0, p0, R), b = gSp(t0, p0, R), N = CM.cross(a, b);
            if (S.curvas) {
              C.param((t) => gS(t, p0, R), 0, 2 * PI, 80, { cor: cor.u, larg: 2, vies: 0.02 });
              C.param((p) => gS(t0, p, R), 0, PI, 50, { cor: cor.v, larg: 2, vies: 0.02 });
            }
            if (S.plano && CM.len(N) > 1e-6) C.plano(P, N, 0.55 * R, { cor: OURO, alfa: 0.3 });
            C.seta(P, CM.mul(a, 0.6), { cor: cor.u, rot: '∂g/∂θ' });
            C.seta(P, CM.mul(b, 0.6), { cor: cor.v, rot: '∂g/∂φ' });
            if (CM.len(N) > 1e-6) C.seta(P, CM.mul(CM.nrm(N), 0.6), { cor: cor.n, rot: 'N' });
            C.ponto(P, { cor: cor.r, rot: 'P' });
          });
          M.leituras('Em P = g(θ₀; φ₀)', (S) => {
            const t0 = (S.kt * PI) / 24, p0 = (S.kp * PI) / 24, R = S.R;
            const P = gS(t0, p0, R), a = gSt(t0, p0, R), b = gSp(t0, p0, R), N = CM.cross(a, b);
            return [['θ₀, φ₀', fmtK(S.kt) + ', ' + fmtK(S.kp)], ['P', CM.ptC(P)], ['∂g/∂θ = (−R sen φ sen θ; R sen φ cos θ; 0)', CM.ptC(a)], ['∂g/∂φ = (R cos φ cos θ; R cos φ sen θ; −R sen φ)', CM.ptC(b)], ['N = ∂g/∂θ × ∂g/∂φ', CM.ptC(N)], ['‖N‖ = R² sen φ', CM.fmt(CM.len(N), 3), 'forte'], CM.len(N) < 1e-6 ? 'Nos polos (φ = 0 ou π) ∂g/∂θ = 0: a parametrização não é regular aí, embora a esfera seja lisa.' : 'N é perpendicular aos dois vetores tangentes e aponta para dentro com esta ordem (θ, φ): troca a ordem para apontar para fora.'];
          });
          M.texto('<b class="t">Parametrização da esfera</b><p class="f">g(θ; φ) = (R sen φ cos θ; R sen φ sen θ; R cos φ), θ ∈ [0, 2π], φ ∈ [0, π]</p><p>Os vetores ∂g/∂θ e ∂g/∂φ geram o espaço tangente; o produto externo dá a normal. O plano tangente em P é N · (X − P) = 0.</p>', 'nota');
          M.legenda([[cor.u, 'φ = φ₀ (paralelo) e ∂g/∂θ'], [cor.v, 'θ = θ₀ (meridiano) e ∂g/∂φ'], [cor.n, 'normal'], [OURO, 'plano tangente']]);
        },
      },
      {
        id: 'grafico', nome: 'Gráfico z = f(x; y)',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.6, alvo: [0, 0, 0.3] });
          M.escolha('f', { rot: 'f(x; y)', opcoes: Object.keys(FG).map((k) => [k, FG[k].nome]), valor: 'hemi', mono: true });
          M.barra('x0', { rot: 'x₀', cor: cor.u, min: -0.9, max: 0.9, valor: 0.3 });
          M.barra('y0', { rot: 'y₀', cor: cor.v, min: -0.9, max: 0.9, valor: 0.2 });
          M.botoes([['Exemplo da aula: hemisfério, (0; 0)', () => M.definir({ f: 'hemi', x0: 0, y0: 0 })]]);
          const pt = (S) => { let x = S.x0, y = S.y0; if (S.f === 'hemi') { const r = Math.hypot(x, y); if (r > 0.9) { x *= 0.9 / r; y *= 0.9 / r; } } return [x, y]; };
          M.cena(V, (C, S) => {
            const fg = FG[S.f], f = fg.f, [x, y] = pt(S);
            C.eixos({ x: [-1.4, 1.4], y: [-1.4, 1.4], z: [-1.2, 1.5] });
            if (S.f === 'hemi') C.sup((t, p) => gS(t, p, 1), 0, 2 * PI, 0, PI / 2 - 0.08, 36, 10, { cor: cor.sup, corTras: cor.sup2, alfa: 0.75 });
            else C.sup((r, t) => [r * Math.cos(t), r * Math.sin(t), f(r * Math.cos(t), r * Math.sin(t))], 0, 1.1, 0, 2 * PI, 12, 40, { cor: cor.sup, corTras: cor.sup2, alfa: 0.75 });
            const [fx, fy] = CM.grad(f, x, y), P = [x, y, f(x, y)], a = [1, 0, fx], b = [0, 1, fy], N = [-fx, -fy, 1];
            C.plano(P, N, 0.5, { cor: OURO, alfa: 0.3 });
            C.param((t) => [t, y, f(t, y)], -0.95, 0.95, 40, { cor: cor.u, larg: 2, vies: 0.02 });
            C.param((t) => [x, t, f(x, t)], -0.95, 0.95, 40, { cor: cor.v, larg: 2, vies: 0.02 });
            C.seta(P, CM.mul(CM.nrm(a), 0.55), { cor: cor.u, rot: '(1; 0; fx)' });
            C.seta(P, CM.mul(CM.nrm(b), 0.55), { cor: cor.v, rot: '(0; 1; fy)' });
            C.seta(P, CM.mul(CM.nrm(N), 0.55), { cor: cor.n, rot: 'N' });
            C.ponto(P, { cor: cor.r, rot: 'P' });
          });
          M.leituras('Em P = (x₀; y₀; f(x₀; y₀))', (S) => {
            const fg = FG[S.f], [x, y] = pt(S), [fx, fy] = CM.grad(fg.f, x, y), z = fg.f(x, y);
            return [['P', CM.ptC([x, y, z])], [fg.fx, CM.fmt(fx, 3)], [fg.fy, CM.fmt(fy, 3)], ['N = (−fx; −fy; 1)', CM.ptC([-fx, -fy, 1])], ['Plano tangente', `z = ${CM.fmtC(z)} ${fx < 0 ? '−' : '+'} ${CM.fmtC(Math.abs(fx))}(x − ${CM.fmtC(x)}) ${fy < 0 ? '−' : '+'} ${CM.fmtC(Math.abs(fy))}(y − ${CM.fmtC(y)})`, 'forte']];
          });
          M.texto('<b class="t">Gráfico como superfície</b><p>g(x; y) = (x; y; f(x; y)): ∂g/∂x = (1; 0; fx), ∂g/∂y = (0; 1; fy) e N = (−fx; −fy; 1). É o mesmo plano tangente da diferenciabilidade: z = f(a) + fx(a)(x − a₁) + fy(a)(y − a₂).</p>', 'nota');
          M.legenda([[cor.u, '(1; 0; fx)'], [cor.v, '(0; 1; fy)'], [cor.n, 'N'], [OURO, 'plano tangente']]);
        },
      },
      {
        id: 'area', nome: 'Área |S|',
        montar(M) {
          const cor = M.cores();
          const V = M.vista3d({ ext: 1.6 });
          M.barra('k1', { rot: 'θ₁', cor: cor.u, min: 0, max: 48, passo: 1, valor: 0, fmt: fmtK, nome: 'θ₁' });
          M.barra('k2', { rot: 'θ₂', cor: cor.u, min: 0, max: 48, passo: 1, valor: 12, fmt: fmtK, nome: 'θ₂' });
          M.barra('j1', { rot: 'φ₁', cor: cor.v, min: 0, max: 24, passo: 1, valor: 4, fmt: fmtK, nome: 'φ₁' });
          M.barra('j2', { rot: 'φ₂', cor: cor.v, min: 0, max: 24, passo: 1, valor: 12, fmt: fmtK, nome: 'φ₂' });
          M.barra('n', { rot: 'n', cor: cor.n, min: 1, max: 24, passo: 1, valor: 6, fmt: (x) => String(Math.round(x)), nome: 'divisões' });
          M.botoes([['Esfera toda', () => M.definir({ k1: 0, k2: 48, j1: 0, j2: 24 })], ['Hemisfério norte', () => M.definir({ k1: 0, k2: 48, j1: 0, j2: 12 })], ['Calota φ ≤ π/3', () => M.definir({ k1: 0, k2: 48, j1: 0, j2: 8 })]]);
          const ang = (S) => ({ t1: (Math.min(S.k1, S.k2) * PI) / 24, t2: (Math.max(S.k1, S.k2) * PI) / 24, p1: (Math.min(S.j1, S.j2) * PI) / 24, p2: (Math.max(S.j1, S.j2) * PI) / 24, n: Math.round(S.n) });
          M.cena(V, (C, S) => {
            const { t1, t2, p1, p2, n } = ang(S);
            C.eixos({ x: [-1.5, 1.5], y: [-1.5, 1.5], z: [-1.5, 1.6] });
            C.sup((t, p) => gS(t, p, 1), 0, 2 * PI, 0, PI, 36, 18, { cor: cor.sup, corTras: cor.sup, alfa: 0.18, malha: false });
            const dt = (t2 - t1) / n, dp = (p2 - p1) / n;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
              const t = t1 + i * dt, p = p1 + j * dp, P = gS(t, p, 1.005), a = CM.mul(gSt(t, p, 1), dt), b = CM.mul(gSp(t, p, 1), dp);
              C.poli([P, CM.add(P, a), CM.add(P, CM.add(a, b)), CM.add(P, b)], { cor: cor.n, alfa: 0.45, plano: 1, contorno: 'rgba(80,60,160,.6)' });
            }
          });
          M.leituras('Área da porção (R = 1)', (S) => {
            const { t1, t2, p1, p2, n } = ang(S);
            const dt = (t2 - t1) / n, dp = (p2 - p1) / n;
            let soma = 0;
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) soma += Math.sin(p1 + j * dp) * dt * dp;
            const ex = (t2 - t1) * (Math.cos(p1) - Math.cos(p2));
            return [['soma de ' + n * n + ' paralelogramos ‖∂g/∂θ × ∂g/∂φ‖ Δθ Δφ', CM.fmt(soma, 4)], ['∫ ∫ sen φ dφ dθ = (θ₂ − θ₁)(cos φ₁ − cos φ₂)', CM.fmt(ex, 4), 'forte'], ['esfera toda: 4π', CM.fmt(4 * PI, 4)]];
          });
          M.texto('<b class="t">Área de uma superfície</b><p>Cada célula Δθ × Δφ do domínio é levada aproximadamente no paralelogramo de lados ∂g/∂θ Δθ e ∂g/∂φ Δφ, de área ‖∂g/∂θ × ∂g/∂φ‖ Δθ Δφ.</p><p class="f">|S| = ∬_U ‖∂g/∂θ × ∂g/∂φ‖ dθ dφ = ∬ R² sen φ dθ dφ</p><p>É o mesmo raciocínio da mudança de variáveis, agora de ℝ² para uma superfície em ℝ³.</p>', 'nota');
          M.legenda([[cor.n, 'paralelogramos tangentes']]);
        },
      },
    ],
    explicar: [
      { modelo: 'esfera', titulo: 'A esfera como g(θ; φ)', estado: { kt: 6, kp: 6, R: 1, curvas: true, plano: false }, texto: '<p>Cada (θ; φ) do retângulo [0, 2π] × [0, π] dá um ponto da esfera. Fixando φ obtém-se um paralelo (laranja); fixando θ, um meridiano (verde).</p>' },
      { modelo: 'esfera', titulo: 'Vetores tangentes e normal', estado: { kt: 6, kp: 6, R: 1, curvas: true, plano: true }, texto: '<p>∂g/∂θ e ∂g/∂φ são os vetores tangentes às duas linhas coordenadas. O produto externo é normal ao plano tangente, e ‖N‖ = R² sen φ.</p>' },
      { modelo: 'grafico', titulo: 'Gráficos são superfícies', estado: { f: 'hemi', x0: 0, y0: 0 }, texto: '<p>z = √(1 − x² − y²) é o hemisfério norte. Em (0; 0), fx = fy = 0: N = (0; 0; 1) e o plano tangente é z = 1.</p>' },
      { modelo: 'area', titulo: 'Área como soma de paralelogramos', estado: { k1: 0, k2: 48, j1: 0, j2: 12, n: 8 }, texto: '<p>Hemisfério norte: ∫₀^2π ∫₀^π/2 sen φ dφ dθ = 2π. Aumenta n e a soma dos paralelogramos aproxima-se de 2π.</p>' },
    ],
    testa: [
      { modelo: 'esfera', estado: { kt: 6, kp: 6 }, p: 'Para a esfera de raio R, ‖∂g/∂θ × ∂g/∂φ‖ =', op: ['R', 'R² sen φ', 'R² cos φ', 'R sen θ'], certa: 1, porque: 'É o mesmo fator do volume em esféricas, sem o dr: a área da caixinha na superfície.' },
      { modelo: 'grafico', estado: { f: 'hemi', x0: 0, y0: 0 }, p: 'Normal ao gráfico z = f(x; y):', op: ['(fx; fy; 1)', '(−fx; −fy; 1)', '(1; 1; f)', '(fx; fy; −1)'], certa: 1, porque: '(1; 0; fx) × (0; 1; fy) = (−fx; −fy; 1). (fx; fy; −1) também é normal, com o sentido oposto.' },
      { modelo: 'area', estado: { k1: 0, k2: 48, j1: 0, j2: 24 }, p: 'Área da esfera de raio 1:', op: ['π', '2π', '4π', '4π/3'], certa: 2, porque: '∫₀^2π ∫₀^π sen φ dφ dθ = 2π · 2 = 4π.' },
    ],
  });
})();
