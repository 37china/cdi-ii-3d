/* Confere a estrutura das matérias: modelos referidos existem, respostas certas válidas, ids únicos.
   Correr com: node testes/estrutura.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { console, Math, globalThis: null };
ctx.globalThis = ctx;
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/math.js'), 'utf8'), ctx);
ctx.CDI = { materias: [], materia(m) { this.materias.push(m); } };
const dir = path.join(__dirname, '../js/materias');
fs.readdirSync(dir).sort().forEach((f) => vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f }));
let erros = 0;
const err = (s) => { erros++; console.log('ERRO  ' + s); };
const ids = new Set();
for (const m of ctx.CDI.materias) {
  if (ids.has(m.id)) err('id repetido ' + m.id);
  ids.add(m.id);
  const mods = new Set(m.modelos.map((x) => x.id));
  (m.explicar || []).forEach((p, i) => { if (p.modelo && !mods.has(p.modelo)) err(`${m.id}: passo ${i + 1} usa modelo inexistente ${p.modelo}`); if (!p.titulo || !p.texto) err(`${m.id}: passo ${i + 1} incompleto`); });
  (m.testa || []).forEach((q, i) => {
    if (q.modelo && !mods.has(q.modelo)) err(`${m.id}: pergunta ${i + 1} usa modelo inexistente ${q.modelo}`);
    if (!(q.certa >= 0 && q.certa < q.op.length)) err(`${m.id}: pergunta ${i + 1} com resposta certa inválida`);
    if (new Set(q.op).size !== q.op.length) err(`${m.id}: pergunta ${i + 1} com opções repetidas`);
  });
  console.log(`ok    ${m.id}: ${m.modelos.length} modelos, ${(m.explicar || []).length} passos, ${(m.testa || []).length} perguntas`);
}
console.log(erros ? `\n${erros} erros` : '\nestrutura certa');
process.exit(erros ? 1 : 0);
