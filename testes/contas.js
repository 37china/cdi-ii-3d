/* Verifica os valores exatos que a app mostra nas explicações e perguntas.
   Correr com: node testes/contas.js */
const CM = require('../js/math.js');
const PI = Math.PI, R2 = Math.SQRT2;
let falhas = 0, n = 0;
function igual(nome, obtido, esperado, tol = 1e-4) {
  n++;
  const ok = Math.abs(obtido - esperado) <= tol * Math.max(1, Math.abs(esperado));
  if (!ok) falhas++;
  console.log((ok ? 'ok   ' : 'FALHA') + '  ' + nome + ': ' + obtido.toFixed(6) + (ok ? '' : ' (esperado ' + esperado.toFixed(6) + ')'));
}

// Integrais duplos
igual('Área {x²+y² ≤ 2, y ≥ x²} = π/2 + 1/3', CM.duplo(() => 1, -1, 1, (x) => x * x, (x) => Math.sqrt(2 - x * x)), PI / 2 + 1 / 3);
igual('mesma área pela ordem dx dy', CM.simpson((y) => 2 * Math.sqrt(y), 0, 1, 400) + CM.simpson((y) => 2 * Math.sqrt(Math.max(0, 2 - y * y)), 1, R2, 4000), PI / 2 + 1 / 3, 1e-3);
igual('Área x² ≤ y ≤ x = 1/6', CM.duplo(() => 1, 0, 1, (x) => x * x, (x) => x), 1 / 6);
// Integral triplo do sólido da aula
igual('Vol {0≤x,y≤1, 0≤z≤x+y} = 1', CM.duplo((x, y) => x + y, 0, 1, () => 0, () => 1), 1);
igual('∫₀¹ (1 − z²/2) dz = 5/6', CM.simpson((z) => 1 - (z * z) / 2, 0, 1), 5 / 6);
igual('∫₁² (2 − z)²/2 dz = 1/6', CM.simpson((z) => ((2 - z) ** 2) / 2, 1, 2), 1 / 6);
// Mudança de variáveis
igual('Disco deslocado com x + y > 2 = π/2', CM.riemann((x, y) => (x - 1) ** 2 + (y - 1) ** 2 < 1 && x + y > 2, () => 1, 0, 2, 0, 2, 1500), PI / 2, 2e-3);
igual('Elipse a=2, b=1: πab', CM.riemann((x, y) => (x * x) / 4 + y * y <= 1, () => 1, -2, 2, -1, 1, 1500), 2 * PI, 2e-3);
// Cilíndricas e esféricas
igual('Cone ρ < z < 1, y > x = π/6', PI * CM.simpson((r) => r * (1 - r), 0, 1), PI / 6);
igual('Gelado com y > x = 2π(√2−1)/3', PI * (1 - Math.cos(PI / 4)) * (2 * R2) / 3, (2 * PI * (R2 - 1)) / 3);
// Lagrange (exemplo da aula): x² + y² = 2, x + z = 1
const curva = (t) => [R2 * Math.cos(t), R2 * Math.sin(t), 1 - R2 * Math.cos(t)];
let zmax = -1e9, dmin = 1e9, tdmin = 0;
for (let i = 0; i < 200000; i++) { const t = (2 * PI * i) / 200000, p = curva(t); zmax = Math.max(zmax, p[2]); const d = Math.hypot(...p); if (d < dmin) { dmin = d; tdmin = t; } }
igual('z máximo na curva = 1 + √2', zmax, 1 + R2);
igual('distância mínima à origem = √2', dmin, R2);
igual('ponto mais próximo tem x = 1', curva(tdmin)[0], 1, 1e-3);
igual('|B| = √(5 − 2√2) > √2', Math.hypot(...curva(0)), Math.sqrt(5 - 2 * R2));
// Função inversa: g(x; y) = (xy; y/x) em (2; 2)
const J = CM.jac((x, y) => [x * y, y / x], 2, 2), I = CM.inv2(J);
igual('det Dg(2; 2) = 2', CM.det2(J), 2);
igual('Dg⁻¹[0][0] = 1/4', I[0][0], 0.25); igual('Dg⁻¹[0][1] = −1', I[0][1], -1); igual('Dg⁻¹[1][0] = 1/4', I[1][0], 0.25); igual('Dg⁻¹[1][1] = 1', I[1][1], 1);
// Implícita: x + y + sen(xy) = 1 em (0; 1)
igual("y'(0) = −2", -(1 + 1 * Math.cos(0)) / (1 + 0), -2);
// Regra da cadeia: [3 4] · [1 1; e −1]
igual('Dh(1; −1) 1.ª entrada = 3 + 4e', 3 + 4 * Math.E, 13.873127, 1e-6);
// Hessiana de x³ − 3x + y² em (−1; 0)
const H = CM.hess((x, y) => x ** 3 - 3 * x + y * y, -1, 0, 1e-3), e = CM.eigSim2(H[0][0], H[0][1], H[1][1]);
igual('λ₁ em (−1; 0) = 2', e.l1, 2, 1e-3); igual('λ₂ em (−1; 0) = −6', e.l2, -6, 1e-3);
// Green
const circ = (t) => [Math.cos(t), Math.sin(t)];
igual('∮ (−y; x) circunferência unitária = 2π', CM.linha((x, y) => [-y, x], circ, 0, 2 * PI), 2 * PI);
igual('∮ vórtice à volta da origem = 2π', CM.linha((x, y) => [-y / (x * x + y * y), x / (x * x + y * y)], circ, 0, 2 * PI), 2 * PI);
igual('∮ vórtice longe da origem = 0', CM.linha((x, y) => [-y / (x * x + y * y), x / (x * x + y * y)], (t) => [2 + 0.5 * Math.cos(t), 0.5 * Math.sin(t)], 0, 2 * PI), 0);
igual('∮ (x+y; x+eʸ+1) = 0', CM.linha((x, y) => [x + y, x + Math.exp(y) + 1], circ, 0, 2 * PI), 0);
igual('Área elipse com Green = πab', 0.5 * CM.linha((x, y) => [-y, x], (t) => [1.8 * Math.cos(t), Math.sin(t)], 0, 2 * PI), PI * 1.8);
// Diferenciabilidade: xy/√(x²+y²) na diagonal
igual('|f(h)|/‖h‖ na diagonal = 1/2', ((0.001 * 0.001) / Math.hypot(0.001, 0.001)) / Math.hypot(0.001, 0.001), 0.5);
// Superfícies
igual('Área do hemisfério = 2π', CM.duplo((t, p) => Math.sin(p), 0, 2 * PI, () => 0, () => PI / 2), 2 * PI);

console.log(`\n${n - falhas}/${n} verificações certas`);
process.exit(falhas ? 1 : 0);
