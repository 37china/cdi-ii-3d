const EX = require('../js/expr.js');
let ok = 0, mal = 0;
const quase = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
function v(src, vars, args, esperado) {
  try { const r = EX.ler(src, vars); const got = r.f(...args); if (quase(got, esperado)) ok++; else { mal++; console.log('MAL', src, got, '≠', esperado); } }
  catch (e) { mal++; console.log('ERRO', src, e.message); }
}
const X = ['x', 'y', 'z'];
v('x^2+y^2', X, [1, 2, 0], 5);
v('2x y', X, [3, 4, 0], 24);
v('xy', X, [3, 4, 0], 12);
v('sen(xy)', X, [1, 2, 0], Math.sin(2));
v('sen x cos y', X, [1, 2, 0], Math.sin(1) * Math.cos(2));
v('sen^2 x + cos^2 x', X, [0.7, 0, 0], 1);
v('e^(x+y)', X, [1, 1, 0], Math.E ** 2);
v('2e^x', X, [1, 0, 0], 2 * Math.E);
v('0,5x', X, [4, 0, 0], 2);
v('1.5*x', X, [4, 0, 0], 6);
v('x²+y³', X, [2, 2, 0], 12);
v('√(x^2+y^2)', X, [3, 4, 0], 5);
v('|x-y|', X, [1, 4, 0], 3);
v('x/(x^2+y^2)', X, [1, 1, 0], 0.5);
v('-x^2', X, [3, 0, 0], -9);
v('2^-1', X, [0, 0, 0], 0.5);
v('x^(1/3)', X, [-8, 0, 0], -2);
v('ln(x)+arctg(y)', X, [Math.E, 1, 0], 1 + Math.PI / 4);
v('pi*x', X, [2, 0, 0], 2 * Math.PI);
v('(x+1)(x-1)', X, [3, 0, 0], 8);
v('x(y+1)', X, [2, 3, 0], 8);
v('3xyz', X, [1, 2, 3], 18);
v('sqrt(2-x^2-y^2)', X, [1, 0, 0], 1);
v('xy^2', X, [2, 3, 0], 18);
v('tg(x)', X, [0.3, 0, 0], Math.tan(0.3));
v('e', X, [0, 0, 0], Math.E);
v('cos(θ)', ['r', 'θ'], [1, Math.PI], -1);
v('r^2 sen(φ)', ['r', 'θ', 'φ'], [2, 0, Math.PI / 2], 4);
// tuplos
const T = EX.ler('(x+y; x-y)', ['x', 'y'], { componentes: 2 }); console.log('tuplo', T.f(3, 1), T.tex);
const T2 = EX.ler('(-y, x)', ['x', 'y'], { componentes: 2 }); console.log('tuplo,', T2.f(3, 1));
// ramos
const R = EX.ramos([{ expr: 'xy/(x^2+y^2)', cond: '(x;y)≠(0;0)' }], '0', ['x', 'y']);
console.log('ramos', R.f(1, 1), R.f(0, 0), R.tex);
const R2 = EX.ramos([{ expr: 'x+y^2 sen x', cond: 'xy<0' }, { expr: '(x^4+y^4)/(x^2+y^2)', cond: 'xy>0' }], '0', ['x', 'y']);
console.log('ramos2', R2.f(-1, 1), R2.f(1, 1), R2.f(0, 0));
// erros
for (const s of ['x+', '(x+1', 'w+1', 'x)', '']) { try { EX.ler(s, ['x', 'y']); console.log('SEM ERRO', s); mal++; } catch (e) { console.log('erro ok:', JSON.stringify(s), '→', e.message); ok++; } }
// TeX
for (const s of ['xy/(x^2+y^2)', 'sen(x)^2+2cos(xy)', 'e^(x^2)', 'sqrt(1-x^2-y^2)', '2x', 'x*2', '0,5x', 'sen^2 x', '-x^2+3', 'x-(y-z)', '(x+y)^2', '|x|']) console.log(s.padEnd(22), EX.ler(s, X).tex);
// conversões
for (const [s, sist] of [['x^2+y^2+z^2', 'esfericas'], ['sqrt(x^2+y^2)', 'cilindricas'], ['z*sqrt(x^2+y^2+z^2)', 'esfericas'], ['x^2+y^2', 'esfericas'], ['1-x^2-y^2', 'polares'], ['xy', 'polares'], ['2x^2+2y^2+z', 'cilindricas'], ['x+y+z', 'esfericas'], ['3x^2+y^2', 'polares'], ['sqrt(x^2+y^2)', 'esfericas'], ['x^2+y^2-z^2', 'esfericas']]) {
  const c = EX.converter(EX.analisar(s, ['x', 'y', 'z']), sist);
  console.log('\n' + s + ' → ' + sist); c.passos.forEach((p) => console.log('   ' + p.titulo.slice(0, 30).padEnd(30) + ' ' + p.tex));
}
console.log(`\n${ok} certos, ${mal} errados`);
