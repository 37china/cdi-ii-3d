/* Expressões escritas pelo aluno: ler, calcular, escrever em TeX e passar a polares, cilíndricas ou esféricas.
   Aceita: sen/sin, cos, tg/tan, arcsen/asin, arctg/atan, ln, log, exp, sqrt/raiz/√, abs/|…|, sh/ch/th, pi/π, e,
   potências ^ ou ², multiplicação implícita (2x, xy, x(y+1)), vírgula ou ponto decimal, ; ou , a separar coordenadas. */
(function (raiz) {
  const FN = {
    sen: 'sin', sin: 'sin', cos: 'cos', tg: 'tan', tan: 'tan', cotg: 'cot', cot: 'cot', sec: 'sec', cosec: 'csc', csc: 'csc',
    arcsen: 'asin', arcsin: 'asin', asin: 'asin', arccos: 'acos', acos: 'acos', arctg: 'atan', arctan: 'atan', atan: 'atan',
    senh: 'sinh', sh: 'sinh', sinh: 'sinh', cosh: 'cosh', ch: 'cosh', tgh: 'tanh', th: 'tanh', tanh: 'tanh',
    ln: 'ln', log: 'ln', exp: 'exp', sqrt: 'sqrt', raiz: 'sqrt', abs: 'abs', sgn: 'sign', sinal: 'sign', max: 'max', min: 'min',
  };
  const GREGO = { theta: 'θ', teta: 'θ', phi: 'φ', fi: 'φ', rho: 'ρ', ro: 'ρ', lambda: 'λ', pi: 'π' };
  const TEXV = { 'θ': '\\theta', 'φ': '\\varphi', 'ρ': '\\rho', 'λ': '\\lambda', 'π': '\\pi' };
  const SUP = { '²': '^2', '³': '^3', '⁴': '^4', '¹': '^1', '⁰': '^0', '⁵': '^5' };
  class Erro extends Error {}

  /* ---------- tokens ---------- */
  function tokens(src, vars) {
    let s = String(src).replace(/[²³⁴¹⁰⁵]/g, (c) => SUP[c]).replace(/[·×∙]/g, '*').replace(/[−–]/g, '-').replace(/÷/g, '/')
      .replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/≠/g, '!=').replace(/√/g, ' sqrt ').replace(/\*\*/g, '^').replace(/\bϑ/g, 'θ').replace(/ϕ/g, 'φ');
    const out = [];
    let i = 0;
    const temCmp = /[<>=!]/.test(s);
    const isL = (c) => /[A-Za-zÀ-ÿθφρλπ_]/.test(c);
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
        let j = i; while (j < s.length && /[0-9]/.test(s[j])) j++;
        if ((s[j] === '.' || s[j] === ',') && /[0-9]/.test(s[j + 1] || '')) { j++; while (j < s.length && /[0-9]/.test(s[j])) j++; }
        out.push({ k: 'num', v: parseFloat(s.slice(i, j).replace(',', '.')) }); i = j; continue;
      }
      if (isL(c)) {
        let j = i; while (j < s.length && (isL(s[j]) || /[0-9]/.test(s[j]))) j++;
        /* «e» isolado numa condição é a conjunção (x ≥ 0 e y ≥ 0), não o número de Euler */
        if (s.slice(i, j) === 'e' && temCmp && /\s/.test(s[i - 1] || '') && /\s/.test(s[j] || '') && !vars.includes('e')) { out.push({ k: 'e' }); i = j; continue; }
        out.push(...palavra(s.slice(i, j), vars)); i = j; continue;
      }
      const dois = s.slice(i, i + 2);
      if (['<=', '>=', '!=', '=='].includes(dois)) { out.push({ k: 'cmp', v: dois === '==' ? '=' : dois }); i += 2; continue; }
      if ('<>='.includes(c)) { out.push({ k: 'cmp', v: c }); i++; continue; }
      if ('+-*/^(),;|'.includes(c)) { out.push({ k: c }); i++; continue; }
      if (c === '[' || c === '{') { out.push({ k: '(' }); i++; continue; }
      if (c === ']' || c === '}') { out.push({ k: ')' }); i++; continue; }
      if (c === '&') { while (s[i] === '&') i++; out.push({ k: 'e' }); continue; }
      throw new Erro(`Não percebi o símbolo «${c}».`);
    }
    return out;
  }
  /* uma palavra: função, constante, variável, «e»/«ou», ou várias variáveis juntas (xy → x·y) */
  function palavra(w, vars) {
    const lw = w.toLowerCase();
    if (lw === 'e' && !vars.includes('e')) return [{ k: 'const', v: 'e' }];
    if (lw === 'and') return [{ k: 'e' }];
    if (lw === 'ou' || lw === 'or') return [{ k: 'ou' }];
    if (FN[lw]) return [{ k: 'fn', v: FN[lw] }];
    if (lw === 'pi' || w === 'π') return [{ k: 'const', v: 'pi' }];
    if (GREGO[lw] && vars.includes(GREGO[lw])) return [{ k: 'var', v: GREGO[lw] }];
    if (vars.includes(w)) return [{ k: 'var', v: w }];
    /* partir: maior prefixo conhecido primeiro (sen, cos, …), senão letra a letra */
    const out = [];
    let r = w;
    while (r.length) {
      let achou = false;
      for (let L = Math.min(6, r.length); L >= 2; L--) {
        const p = r.slice(0, L), lp = p.toLowerCase();
        if (FN[lp]) { out.push({ k: 'fn', v: FN[lp] }); r = r.slice(L); achou = true; break; }
        if (lp === 'pi') { out.push({ k: 'const', v: 'pi' }); r = r.slice(L); achou = true; break; }
        if (GREGO[lp] && vars.includes(GREGO[lp])) { out.push({ k: 'var', v: GREGO[lp] }); r = r.slice(L); achou = true; break; }
      }
      if (achou) continue;
      const c = r[0];
      if (/[0-9]/.test(c)) { let j = 0; while (j < r.length && /[0-9]/.test(r[j])) j++; out.push({ k: 'num', v: +r.slice(0, j) }); r = r.slice(j); continue; }
      if (c === 'e' && !vars.includes('e')) out.push({ k: 'const', v: 'e' });
      else if (c === 'π') out.push({ k: 'const', v: 'pi' });
      else if (vars.includes(c)) out.push({ k: 'var', v: c });
      else throw new Erro(`«${w}»: só posso usar as variáveis ${vars.join(', ')}.`);
      r = r.slice(1);
    }
    return out;
  }

  /* ---------- análise sintática ---------- */
  function analisar(src, vars) {
    const T = tokens(src, vars);
    let p = 0;
    const ver = () => T[p], k = () => (T[p] ? T[p].k : null);
    const comer = (kk) => { if (k() !== kk) throw new Erro(kk === ')' ? 'Falta fechar um parêntesis.' : `Esperava «${kk}».`); return T[p++]; };
    const comecaPrimario = () => ['num', 'var', 'const', 'fn', '(', '|'].includes(k());
    function ou() { let a = e(); while (k() === 'ou') { p++; a = { t: 'ou', a, b: e() }; } return a; }
    function e() { let a = cmp(); while (k() === 'e') { p++; a = { t: 'e', a, b: cmp() }; } return a; }
    function cmp() {
      let a = soma();
      if (k() !== 'cmp') return a;
      let r = null;
      while (k() === 'cmp') { const o = T[p++].v, b = soma(); const c = { t: 'cmp', o, a, b }; r = r ? { t: 'e', a: r, b: c } : c; a = b; }
      return r;
    }
    function soma() {
      let a = prod();
      while (k() === '+' || k() === '-') { const o = T[p++].k; a = { t: o === '+' ? 'add' : 'sub', a, b: prod() }; }
      return a;
    }
    function prod() {
      let a = unario();
      for (;;) {
        if (k() === '*' || k() === '/') { const o = T[p++].k; a = { t: o === '*' ? 'mul' : 'div', a, b: unario() }; }
        else if (comecaPrimario() && !(k() === '|' && dentroAbs > 0)) a = { t: 'mul', a, b: potencia(), imp: true };
        else return a;
      }
    }
    function unario() { if (k() === '-') { p++; return { t: 'neg', a: unario() }; } if (k() === '+') { p++; return unario(); } return potencia(); }
    function potencia() {
      const b = primario();
      if (k() === '^') { p++; const ex = k() === '-' ? (p++, { t: 'neg', a: potencia() }) : potencia(); return { t: 'pow', a: b, b: ex }; }
      return b;
    }
    let dentroAbs = 0;
    function primario() {
      const t = ver();
      if (!t) throw new Erro('A expressão acaba a meio.');
      if (t.k === 'num') { p++; return { t: 'num', v: t.v }; }
      if (t.k === 'var') { p++; return { t: 'var', n: t.v }; }
      if (t.k === 'const') { p++; return { t: 'const', n: t.v }; }
      if (t.k === '|') { p++; dentroAbs++; const a = soma(); dentroAbs--; comer('|'); return { t: 'fn', f: 'abs', args: [a] }; }
      if (t.k === '(') {
        p++;
        const it = [ou()];
        while (k() === ',' || k() === ';') { p++; it.push(ou()); }
        comer(')');
        return it.length === 1 ? it[0] : { t: 'tup', it };
      }
      if (t.k === 'fn') {
        p++;
        let ex = null;
        if (k() === '^') { p++; ex = potenciaSimples(); } // sen^2 x
        let args;
        if (k() === '(') {
          p++; args = [soma()];
          while (k() === ',' || k() === ';') { p++; args.push(soma()); }
          comer(')');
        } else args = [argSemParentesis()];
        const n = { t: 'fn', f: t.v, args };
        return ex ? { t: 'pow', a: n, b: ex } : n;
      }
      throw new Erro(`Não esperava «${t.v || t.k}» aqui.`);
    }
    function potenciaSimples() { const t = ver(); if (t && t.k === 'num') { p++; return { t: 'num', v: t.v }; } return primario(); }
    /* «sen 2x» = sen(2x); «sen x cos y» = sen(x)·cos(y) */
    function argSemParentesis() {
      let a = potencia();
      while (comecaPrimario() && k() !== 'fn' && k() !== '|') a = { t: 'mul', a, b: potencia(), imp: true };
      return a;
    }
    if (!T.length) throw new Erro('Escreve uma expressão.');
    const r = ou();
    if (p < T.length) throw new Erro(k() === ')' ? 'Há um parêntesis a mais.' : `Não esperava «${T[p].v || T[p].k}» aqui.`);
    return r;
  }

  /* ---------- calcular ---------- */
  const JSF = { sin: 'Math.sin', cos: 'Math.cos', tan: 'Math.tan', asin: 'Math.asin', acos: 'Math.acos', atan: 'Math.atan', sinh: 'Math.sinh', cosh: 'Math.cosh', tanh: 'Math.tanh', ln: 'Math.log', exp: 'Math.exp', sqrt: 'Math.sqrt', abs: 'Math.abs', sign: 'Math.sign', max: 'Math.max', min: 'Math.min' };
  function js(n, nome) {
    switch (n.t) {
      case 'num': return '(' + n.v + ')';
      case 'var': return nome(n.n);
      case 'const': return n.n === 'pi' ? 'Math.PI' : 'Math.E';
      case 'add': return `(${js(n.a, nome)}+${js(n.b, nome)})`;
      case 'sub': return `(${js(n.a, nome)}-${js(n.b, nome)})`;
      case 'mul': return `(${js(n.a, nome)}*${js(n.b, nome)})`;
      case 'div': return `(${js(n.a, nome)}/${js(n.b, nome)})`;
      case 'neg': return `(-${js(n.a, nome)})`;
      case 'pow': return `_pw(${js(n.a, nome)},${js(n.b, nome)})`;
      case 'fn': {
        const a = n.args.map((x) => js(x, nome));
        if (n.f === 'cot') return `(1/Math.tan(${a[0]}))`;
        if (n.f === 'sec') return `(1/Math.cos(${a[0]}))`;
        if (n.f === 'csc') return `(1/Math.sin(${a[0]}))`;
        return `${JSF[n.f]}(${a.join(',')})`;
      }
      case 'cmp': { const A = js(n.a, nome), B = js(n.b, nome); return { '<': `(${A}<${B})`, '>': `(${A}>${B})`, '<=': `(${A}<=${B}+1e-12)`, '>=': `(${A}+1e-12>=${B})`, '=': `(Math.abs(${A}-${B})<1e-9)`, '!=': `(Math.abs(${A}-${B})>=1e-9)` }[n.o]; }
      case 'e': return `(${js(n.a, nome)}&&${js(n.b, nome)})`;
      case 'ou': return `(${js(n.a, nome)}||${js(n.b, nome)})`;
      case 'tup': return `[${n.it.map((x) => js(x, nome)).join(',')}]`;
    }
    throw new Erro('Expressão inválida.');
  }
  /* potência real: (−8)^(1/3) = −2, como se faz à mão */
  function _pw(a, b) {
    if (a >= 0 || Number.isInteger(b)) return Math.pow(a, b);
    for (const q of [3, 5, 7]) { const pq = b * q; if (Math.abs(pq - Math.round(pq)) < 1e-9) { const r = -Math.pow(-a, b); return Math.round(pq) % 2 ? r : -r; } }
    return NaN;
  }
  function compilar(ast, vars) {
    const idx = {}; vars.forEach((v, i) => (idx[v] = '_' + i));
    /* comparar tuplos: (x;y)=(0;0) */
    const fixa = (n) => {
      if (!n || typeof n !== 'object') return n;
      if (n.t === 'cmp' && n.a.t === 'tup' && n.b.t === 'tup' && (n.o === '=' || n.o === '!=')) {
        const iguais = n.a.it.map((x, i) => ({ t: 'cmp', o: '=', a: x, b: n.b.it[i] })).reduce((p, c) => ({ t: 'e', a: p, b: c }));
        return n.o === '=' ? iguais : { t: 'nao', a: iguais };
      }
      const c = {}; for (const kk in n) c[kk] = Array.isArray(n[kk]) ? n[kk].map(fixa) : typeof n[kk] === 'object' ? fixa(n[kk]) : n[kk]; return c;
    };
    const a2 = fixa(ast);
    const corpo = (function rec(n) { if (n.t === 'nao') return `(!${rec(n.a)})`; if (n.t === 'e' || n.t === 'ou') return `(${rec(n.a)}${n.t === 'e' ? '&&' : '||'}${rec(n.b)})`; return js(n, (v) => idx[v]); })(a2);
    // eslint-disable-next-line no-new-func
    const f = new Function('_pw', ...vars.map((v) => idx[v]), 'return ' + corpo + ';');
    return (...a) => f(_pw, ...a);
  }

  /* ---------- TeX ---------- */
  const TEXF = { sin: '\\operatorname{sen}', cos: '\\cos', tan: '\\operatorname{tg}', cot: '\\operatorname{cotg}', sec: '\\sec', csc: '\\operatorname{cosec}', asin: '\\operatorname{arcsen}', acos: '\\arccos', atan: '\\operatorname{arctg}', sinh: '\\operatorname{sh}', cosh: '\\operatorname{ch}', tanh: '\\operatorname{th}', ln: '\\ln', exp: '\\exp', sign: '\\operatorname{sgn}', max: '\\max', min: '\\min' };
  const PREC = { ou: 0, e: 1, cmp: 2, add: 3, sub: 3, mul: 4, div: 5, neg: 4, pow: 6, fn: 7, num: 8, var: 8, const: 8, tup: 8 };
  const numTex = (v) => { if (Number.isInteger(v)) return String(v); const s = String(+v.toFixed(6)); return s.replace('.', '{,}'); };
  function tex(n, pai = 0) {
    const pr = PREC[n.t];
    let s;
    switch (n.t) {
      case 'num': s = numTex(n.v); break;
      case 'var': s = TEXV[n.n] || n.n; break;
      case 'const': s = n.n === 'pi' ? '\\pi' : 'e'; break;
      case 'add': s = tex(n.a, 3) + '+' + tex(n.b, 3); break;
      case 'sub': s = tex(n.a, 3) + '-' + tex(n.b, 3.5); break;
      case 'neg': s = '-' + tex(n.a, 4.5); break;
      case 'mul': {
        const A = n.a.t === 'neg' ? par(tex(n.a)) : tex(n.a, 4), B = n.b.t === 'neg' ? par(tex(n.b)) : tex(n.b, 4);
        const pontos = /[0-9}]$/.test(A) && /^[0-9]/.test(B) || (n.b.t === 'num');
        s = A + (pontos ? '\\cdot ' : n.b.t === 'fn' || n.a.t === 'fn' || /\\[a-zA-Z]+$/.test(A) ? '\\,' : '') + B;
        if (n.b.t === 'num' && n.a.t !== 'num') s = tex(n.b, 4) + tex(n.a, 4);
        break;
      }
      case 'div': s = '\\frac{' + tex(n.a) + '}{' + tex(n.b) + '}'; break;
      case 'pow': {
        if (n.a.t === 'fn' && !['sqrt', 'abs', 'exp'].includes(n.a.f) && n.a.args.length === 1) { s = (TEXF[n.a.f] || '\\' + n.a.f) + '^{' + tex(n.b) + '}' + argTex(n.a.args[0]); break; }
        if (n.b.t === 'div' && n.b.a.t === 'num' && n.b.a.v === 1 && n.b.b.t === 'num' && n.b.b.v === 2) { s = '\\sqrt{' + tex(n.a) + '}'; break; }
        s = tex(n.a, 6.5) + '^{' + tex(n.b) + '}'; break;
      }
      case 'fn': {
        if (n.f === 'sqrt') { s = '\\sqrt{' + tex(n.args[0]) + '}'; break; }
        if (n.f === 'abs') { s = '\\left|' + tex(n.args[0]) + '\\right|'; break; }
        if (n.f === 'exp' && n.args.length === 1) { s = 'e^{' + tex(n.args[0]) + '}'; break; }
        if (n.args.length > 1) { s = TEXF[n.f] + '\\left(' + n.args.map((x) => tex(x)).join(';\\,') + '\\right)'; break; }
        s = TEXF[n.f] + argTex(n.args[0]); break;
      }
      case 'cmp': s = tex(n.a, 2.5) + { '<': '<', '>': '>', '<=': '\\le ', '>=': '\\ge ', '=': '=', '!=': '\\neq ' }[n.o] + tex(n.b, 2.5); break;
      case 'e': s = tex(n.a, 1) + ',\\ ' + tex(n.b, 1); break;
      case 'ou': s = tex(n.a, 0) + '\\ \\text{ou}\\ ' + tex(n.b, 0); break;
      case 'tup': s = '(' + n.it.map((x) => tex(x)).join(';\\,') + ')'; break;
      default: s = '?';
    }
    return pr < pai ? par(s) : s;
  }
  const par = (t) => (/\\frac|\\sum|\\int/.test(t) ? '\\left(' + t + '\\right)' : '(' + t + ')');
const argTex = (a) => (['var', 'num', 'const'].includes(a.t) || (a.t === 'mul' && a.imp && simples(a)) ? ' ' + tex(a, 4) : par(tex(a)));
  const simples = (a) => a.t !== 'mul' ? ['var', 'num', 'const'].includes(a.t) : simples(a.a) && simples(a.b);

  /* ---------- simplificação leve ---------- */
  const N = (v) => ({ t: 'num', v }), V = (n) => ({ t: 'var', n });
  const mul = (a, b) => ({ t: 'mul', a, b, imp: true }), pw = (a, e) => ({ t: 'pow', a, b: N(e) }), fn = (f, a) => ({ t: 'fn', f, args: [a] });
  function simp(n) {
    if (!n || typeof n !== 'object' || !n.t) return n;
    const c = Object.assign({}, n);
    if (c.a) c.a = simp(c.a); if (c.b) c.b = simp(c.b); if (c.args) c.args = c.args.map(simp); if (c.it) c.it = c.it.map(simp);
    const isN = (x, v) => x && x.t === 'num' && (v === undefined || x.v === v);
    switch (c.t) {
      case 'mul':
        if (isN(c.a, 0) || isN(c.b, 0)) return N(0);
        if (isN(c.a, 1)) return c.b; if (isN(c.b, 1)) return c.a;
        if (isN(c.a) && isN(c.b)) return N(c.a.v * c.b.v);
        if (c.a.t === 'neg') return simp({ t: 'neg', a: mul(c.a.a, c.b) });
        if (c.b.t === 'neg') return simp({ t: 'neg', a: mul(c.a, c.b.a) });
        return juntarPotencias(c);
      case 'add': if (isN(c.b, 0)) return c.a; if (isN(c.a, 0)) return c.b; if (c.b.t === 'neg') return { t: 'sub', a: c.a, b: c.b.a }; if (isN(c.a) && isN(c.b)) return N(c.a.v + c.b.v); return c;
      case 'sub': if (isN(c.b, 0)) return c.a; if (isN(c.a, 0)) return simp({ t: 'neg', a: c.b }); if (isN(c.a) && isN(c.b)) return N(c.a.v - c.b.v); return c;
      case 'neg': if (c.a.t === 'neg') return c.a.a; if (isN(c.a)) return N(-c.a.v); return c;
      case 'pow':
        if (isN(c.b, 1)) return c.a; if (isN(c.b, 0)) return N(1);
        if (c.a.t === 'pow' && isN(c.a.b) && isN(c.b)) return simp(pw(c.a.a, c.a.b.v * c.b.v));
        if (c.a.t === 'mul' && isN(c.b)) return simp(mul(pw(c.a.a, c.b.v), pw(c.a.b, c.b.v))); // (ρ cos θ)² = ρ² cos²θ
        if (c.a.t === 'neg' && isN(c.b) && c.b.v % 2 === 0) return simp(pw(c.a.a, c.b.v));
        return c;
      case 'fn':
        if (c.f === 'sqrt') {
          const a = c.args[0];
          if (a.t === 'pow' && isN(a.b, 2) && naoNeg(a.a)) return a.a;
          if (a.t === 'mul') { const ps = fatores(a); if (ps.every((x) => x.t === 'pow' && isN(x.b, 2) && naoNeg(x.a))) return simp(ps.map((x) => x.a).reduce(mul)); }
        }
        if (c.f === 'abs' && naoNeg(c.args[0])) return c.args[0];
        return c;
    }
    return c;
  }
  const fatores = (n) => (n.t === 'mul' ? fatores(n.a).concat(fatores(n.b)) : [n]);
  /* ρ, r ≥ 0; sen φ ≥ 0 porque φ ∈ [0, π] */
  const naoNeg = (a) => (a.t === 'var' && ['ρ', 'r'].includes(a.n)) || (a.t === 'fn' && a.f === 'sin' && a.args[0].t === 'var' && a.args[0].n === 'φ') || (a.t === 'num' && a.v >= 0) || (a.t === 'mul' && naoNeg(a.a) && naoNeg(a.b)) || (a.t === 'pow' && naoNeg(a.a));
  /* ρ·ρ² → ρ³ dentro de um produto */
  function juntarPotencias(m) {
    const fs = fatores(m);
    const chave = (x) => (x.t === 'pow' && x.b.t === 'num' ? JSON.stringify(x.a) : JSON.stringify(x));
    const ex = (x) => (x.t === 'pow' && x.b.t === 'num' ? x.b.v : 1);
    const ord = [], mapa = {};
    let k = 1;
    for (const f of fs) {
      if (f.t === 'num') { k *= f.v; continue; }
      const c = chave(f);
      if (!(c in mapa)) { mapa[c] = { base: f.t === 'pow' && f.b.t === 'num' ? f.a : f, e: 0 }; ord.push(c); }
      if (f.t === 'pow' && f.b.t !== 'num') { mapa[c + '#'] = { base: f, e: 1 }; ord.push(c + '#'); delete mapa[c]; ord.splice(ord.indexOf(c), 1); continue; }
      mapa[c].e += ex(f);
    }
    /* ordem bonita: números, depois r/ρ, depois funções */
    const peso = (b) => (b.t === 'var' && ['r', 'ρ'].includes(b.n) ? 0 : b.t === 'var' ? 1 : 2);
    ord.sort((a, b) => peso(mapa[a].base) - peso(mapa[b].base));
    let r = null;
    for (const c of ord) { const { base, e } = mapa[c]; const t = e === 1 ? base : pw(base, e); r = r ? mul(r, t) : t; }
    if (!r) return N(k);
    if (k === 1) return r;
    if (k === -1) return { t: 'neg', a: r };
    return mul(N(k), r);
  }

  /* ---------- polares, cilíndricas, esféricas ---------- */
  /* parcelas de uma soma com sinal */
  function parcelas(n, s = 1, out = []) {
    if (n.t === 'add') { parcelas(n.a, s, out); parcelas(n.b, s, out); }
    else if (n.t === 'sub') { parcelas(n.a, s, out); parcelas(n.b, -s, out); }
    else if (n.t === 'neg') parcelas(n.a, -s, out);
    else out.push({ s, n });
    return out;
  }
  /* c·v² → {c, v} */
  function quadrado(p) {
    let n = p.n, c = p.s;
    if (n.t === 'mul' && n.a.t === 'num') { c *= n.a.v; n = n.b; }
    if (n.t === 'pow' && n.a.t === 'var' && n.b.t === 'num' && n.b.v === 2) return { c, v: n.a.n };
    return null;
  }
  function montar(ps) {
    let r = null;
    for (const p of ps) {
      const t = p.n;
      if (!r) r = p.s < 0 ? { t: 'neg', a: t } : t;
      else r = { t: p.s < 0 ? 'sub' : 'add', a: r, b: t };
    }
    return r || N(0);
  }
  /* substitui grupos c(x²+y²[+z²]) por c·novo em todas as somas */
  function agrupar(n, nomes, novo) {
    if (!n || typeof n !== 'object' || !n.t) return n;
    const c = Object.assign({}, n);
    if (c.a) c.a = agrupar(c.a, nomes, novo); if (c.b) c.b = agrupar(c.b, nomes, novo); if (c.args) c.args = c.args.map((x) => agrupar(x, nomes, novo)); if (c.it) c.it = c.it.map((x) => agrupar(x, nomes, novo));
    if (!['add', 'sub'].includes(c.t)) return c;
    const ps = parcelas(c);
    const qs = ps.map(quadrado);
    for (const v0 of nomes) if (!qs.some((q) => q && q.v === v0)) return c;
    /* coeficiente comum: o menor em módulo com o mesmo sinal */
    const cs = nomes.map((v0) => qs.find((q) => q && q.v === v0).c);
    if (!cs.every((x) => Math.sign(x) === Math.sign(cs[0]))) return c;
    const k = cs.reduce((a, b) => (Math.abs(a) < Math.abs(b) ? a : b));
    const resto = [];
    ps.forEach((p, i) => {
      const q = qs[i];
      if (q && nomes.includes(q.v)) { const sobra = q.c - k; if (Math.abs(sobra) > 1e-12) resto.push({ s: Math.sign(sobra), n: Math.abs(sobra) === 1 ? pw(V(q.v), 2) : mul(N(Math.abs(sobra)), pw(V(q.v), 2)) }); }
      else resto.push(p);
    });
    const g = { s: Math.sign(k), n: Math.abs(k) === 1 ? novo : mul(N(Math.abs(k)), novo) };
    const pos = ps.findIndex((p, i) => qs[i] && nomes.includes(qs[i].v));
    const antes = ps.slice(0, pos).filter((p, i) => !(qs[i] && nomes.includes(qs[i].v))).length;
    resto.splice(antes, 0, g);
    return montar(resto);
  }
  function substituir(n, mapa) {
    if (!n || typeof n !== 'object' || !n.t) return n;
    if (n.t === 'var' && mapa[n.n]) return mapa[n.n];
    const c = Object.assign({}, n);
    if (c.a) c.a = substituir(c.a, mapa); if (c.b) c.b = substituir(c.b, mapa); if (c.args) c.args = c.args.map((x) => substituir(x, mapa)); if (c.it) c.it = c.it.map((x) => substituir(x, mapa));
    return c;
  }
  const temVar = (n, v) => !!n && typeof n === 'object' && ((n.t === 'var' && n.n === v) || ['a', 'b'].some((k) => n[k] && temVar(n[k], v)) || (n.args || n.it || []).some((x) => temVar(x, v)));
  const S = (v) => fn('sin', V(v)), Co = (v) => fn('cos', V(v));
  const SIST = {
    polares: { vars: ['x', 'y'], novas: ['r', 'θ'], grupos: [[['x', 'y'], pw(V('r'), 2), 'x^2+y^2=r^2']], mapa: { x: mul(V('r'), Co('θ')), y: mul(V('r'), S('θ')) }, subs: 'x=r\\cos\\theta,\\quad y=r\\operatorname{sen}\\theta', jac: 'r' },
    cilindricas: { vars: ['x', 'y', 'z'], novas: ['ρ', 'θ', 'z'], grupos: [[['x', 'y'], pw(V('ρ'), 2), 'x^2+y^2=\\rho^2']], mapa: { x: mul(V('ρ'), Co('θ')), y: mul(V('ρ'), S('θ')) }, subs: 'x=\\rho\\cos\\theta,\\quad y=\\rho\\operatorname{sen}\\theta,\\quad z=z', jac: '\\rho' },
    esfericas: { vars: ['x', 'y', 'z'], novas: ['r', 'θ', 'φ'], grupos: [[['x', 'y', 'z'], pw(V('r'), 2), 'x^2+y^2+z^2=r^2'], [['x', 'y'], mul(pw(V('r'), 2), pw(S('φ'), 2)), 'x^2+y^2=r^2\\operatorname{sen}^2\\varphi']], mapa: { x: mul(mul(V('r'), S('φ')), Co('θ')), y: mul(mul(V('r'), S('φ')), S('θ')), z: mul(V('r'), Co('φ')) }, subs: 'x=r\\operatorname{sen}\\varphi\\cos\\theta,\\quad y=r\\operatorname{sen}\\varphi\\operatorname{sen}\\theta,\\quad z=r\\cos\\varphi', jac: 'r^2\\operatorname{sen}\\varphi' },
  };
  /* devolve os passos da conversão, cada um com título e TeX */
  function converter(ast, sist) {
    const s = SIST[sist];
    const passos = [{ titulo: 'Expressão inicial', tex: tex(ast) }];
    let a = ast;
    for (const [nomes, novo, regra] of s.grupos) {
      const b = agrupar(a, nomes, novo);
      if (JSON.stringify(b) !== JSON.stringify(a)) { passos.push({ titulo: 'Agrupar: $' + regra + '$', tex: tex(b) }); a = b; }
    }
    const mapa = {};
    for (const v0 in s.mapa) if (temVar(a, v0)) mapa[v0] = s.mapa[v0];
    if (Object.keys(mapa).length) { a = substituir(a, mapa); passos.push({ titulo: 'Substituir: $' + s.subs + '$', tex: tex(a) }); }
    const b = simp(simp(a));
    if (tex(b) !== tex(a)) passos.push({ titulo: 'Simplificar', nota: sist === 'esfericas' ? '$r\\ge0$ e $\\operatorname{sen}\\varphi\\ge0$ (porque $0\\le\\varphi\\le\\pi$), logo $\\sqrt{r^2}=r$ e $\\sqrt{\\operatorname{sen}^2\\varphi}=\\operatorname{sen}\\varphi$.' : sist === 'cilindricas' ? '$\\rho\\ge0$, logo $\\sqrt{\\rho^2}=\\rho$.' : '$r\\ge0$, logo $\\sqrt{r^2}=r$.', tex: tex(b) });
    return { passos, final: b, jac: s.jac, novas: s.novas };
  }

  /* ---------- interface pública ---------- */
  /* ler(src, vars) → {ast, f, tex, n (componentes)} ou lança Erro com mensagem em português */
  function ler(src, vars, o = {}) {
    const ast = analisar(src, vars);
    if (o.condicao) { if (!['cmp', 'e', 'ou'].includes(ast.t)) throw new Erro('Uma condição precisa de <, >, ≤, ≥, = ou ≠.'); }
    else if (['cmp', 'e', 'ou'].includes(ast.t)) throw new Erro('Aqui é uma expressão, não uma condição.');
    const n = ast.t === 'tup' ? ast.it.length : 1;
    if (o.componentes && n !== o.componentes) throw new Erro(o.componentes === 1 ? 'Aqui é uma só expressão.' : `Precisa de ${o.componentes} componentes, separadas por ; (ex.: (x+y; x−y)).`);
    const f = compilar(ast, vars);
    return { ast, f, tex: tex(ast), n, src, usa: vars.filter((v) => temVar(ast, v)) };
  }
  /* função por ramos: ramos = [{expr, cond}], resto = expr do «caso contrário» */
  function ramos(lista, resto, vars, o = {}) {
    const R = lista.map((r) => ({ e: ler(r.expr, vars, o), c: ler(r.cond, vars, { condicao: true }) }));
    const Z = resto != null && String(resto).trim() !== '' ? ler(resto, vars, o) : null;
    const f = (...a) => { for (const r of R) if (r.c.f(...a)) return r.e.f(...a); return Z ? Z.f(...a) : NaN; };
    const linhas = R.map((r) => r.e.tex + ', & ' + r.c.tex);
    if (Z) linhas.push(Z.tex + ', & \\text{caso contrário}');
    const usa = vars.filter((v) => R.some((r) => r.e.usa.includes(v) || r.c.usa.includes(v)) || (Z && Z.usa.includes(v)));
    return { f, tex: R.length ? '\\begin{cases}' + linhas.join('\\\\') + '\\end{cases}' : Z.tex, R, Z, ast: R.length ? null : Z.ast, usa, n: Z ? Z.n : R[0].e.n };
  }

  const API = { ler, ramos, analisar, compilar, tex, converter, simp, Erro, SIST };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.EX = API;
})(typeof window !== 'undefined' ? window : globalThis);
