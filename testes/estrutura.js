/* Confere a estrutura das matérias (v3): modelos referidos existem, passos do Aprender completos,
   aquecimento com resposta certa válida, exercícios completos e geradores que funcionam.
   Correr com: node testes/estrutura.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { console, Math, JSON, globalThis: null };
ctx.globalThis = ctx;
ctx.window = ctx;
vm.createContext(ctx);
const ler = (f) => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, { filename: f });
ler('js/math.js');
ler('js/expr.js');
ctx.CDI = { materias: [], modelos: {}, antigos: {}, materia(m) { this.materias.push(m); }, modelosDe(g, o) { o.modelos.forEach((md) => (this.modelos[g + '.' + md.id] = md)); this.antigos[g] = o; } };
ler('js/livre.js');
const lista = (d) => fs.readdirSync(path.join(__dirname, '..', d)).filter((f) => f.endsWith('.js')).sort().map((f) => d + '/' + f);
lista('js/modelos').forEach(ler);
lista('js/materias').forEach(ler);
const C = ctx.CDI;
const TIPOS = ['def', 'teo', 'prop', 'ex', 'contra', 'obs', 'met', 'lema', 'cor'];
const ORDEM = ['topologia', 'campos', 'tvi', 'extremos', 'taylor', 'inversa', 'integrais', 'linha', 'tfc', 'green', 'gradientes'];
let erros = 0;
const err = (s) => { erros++; console.log('ERRO  ' + s); };
const ids = new Set();
const verEx = (m, ex, tag, mods) => {
  ['titulo', 'enunciado', 'solucao'].forEach((k) => { if (!ex[k]) err(`${tag}: falta ${k}`); });
  if (!(ex.passos || []).length) err(`${tag}: sem passos`);
  if (!(ex.dicas || []).length) err(`${tag}: sem dicas`);
  if (ex.modelo && !mods.has(ex.modelo)) err(`${tag}: modelo inexistente ${ex.modelo}`);
  const txt = [ex.enunciado, ex.solucao].concat(ex.passos || [], ex.dicas || []).join(' ');
  if ((txt.match(/\$/g) || []).length % 2) err(`${tag}: número ímpar de $`);
  if (/undefined|NaN/.test(txt)) err(`${tag}: texto com undefined/NaN`);
};
for (const m of C.materias) {
  if (ids.has(m.id)) err('id repetido ' + m.id);
  ids.add(m.id);
  const refs = m.modelos.map((x) => (typeof x === 'string' ? x : x.de));
  refs.forEach((r) => { if (r && !C.modelos[r]) err(`${m.id}: modelo ${r} não existe`); });
  const mods = new Set(m.modelos.map((x) => (typeof x === 'string' ? x.split('.')[1] : x.id || x.de.split('.')[1])));
  if (mods.size !== m.modelos.length) err(`${m.id}: dois modelos com o mesmo id`);
  (m.aprender || []).forEach((p, i) => {
    if (!TIPOS.includes(p.tipo)) err(`${m.id}: passo ${i + 1} com tipo ${p.tipo}`);
    if (p.modelo && !mods.has(p.modelo)) err(`${m.id}: passo ${i + 1} usa modelo inexistente ${p.modelo}`);
    if (!p.titulo || !p.texto) err(`${m.id}: passo ${i + 1} incompleto`);
    if (((p.texto + (p.demo || '')).match(/\$/g) || []).length % 2) err(`${m.id}: passo ${i + 1} com número ímpar de $`);
  });
  if (!m.extra && (m.aprender || [])[0] && !['def', 'obs'].includes(m.aprender[0].tipo)) err(`${m.id}: o Aprender não começa por uma definição`);
  (m.aquecimento || []).forEach((q, i) => {
    if (!(q.certa >= 0 && q.certa < q.op.length)) err(`${m.id}: aquecimento ${i + 1} com resposta certa inválida`);
    if (new Set(q.op).size !== q.op.length) err(`${m.id}: aquecimento ${i + 1} com opções repetidas`);
  });
  (m.exercicios || []).forEach((ex, i) => {
    verEx(m, ex, `${m.id}: exercício ${i + 1}`, mods);
    if (ex.gerar) {
      const g = m.geradores && m.geradores[ex.gerar];
      if (!g) err(`${m.id}: exercício ${i + 1} com gerador inexistente ${ex.gerar}`);
      else for (let k = 0; k < 40; k++) { try { verEx(m, g(), `${m.id}: gerador ${ex.gerar}`, mods); } catch (e) { err(`${m.id}: gerador ${ex.gerar} falhou: ${e.message}`); break; } }
    }
  });
  const ne = (m.exercicios || []).length;
  if (!m.extra && (ne < 5 || ne > 8)) err(`${m.id}: ${ne} exercícios (devem ser 5 a 8)`);
  console.log(`ok    ${m.id}: ${m.modelos.length} modelos, ${(m.aprender || []).length} passos, ${(m.aquecimento || []).length} de aquecimento, ${ne} exercícios`);
}
const prog = C.materias.filter((m) => !m.extra).sort((a, b) => a.ordem - b.ordem).map((m) => m.id);
if (prog.join() !== ORDEM.join()) err('as matérias não seguem as 11 linhas do programa: ' + prog.join(', '));
console.log(erros ? `\n${erros} erros` : '\nestrutura certa');
process.exit(erros ? 1 : 0);
