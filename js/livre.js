/* Ajudas para modelos com funções escritas pelo aluno. */
(function () {
  const CDI = window.CDI;
  CDI.igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  /* exemplo pré-definido que coincide com o valor escrito (ou null) */
  CDI.preset = (lista, v) => lista.find((p) => CDI.igual(p.valor, v)) || null;
  /* faixa de alturas razoável para desenhar o gráfico de f numa caixa (ignora picos e singularidades) */
  CDI.faixaZ = (f, x0, x1, y0, y1, n = 26) => {
    const vs = [];
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) { const v = f(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * j) / n); if (isFinite(v)) vs.push(v); }
    if (!vs.length) return [-1, 1];
    vs.sort((a, b) => a - b);
    let lo = vs[Math.floor(vs.length * 0.02)], hi = vs[Math.ceil(vs.length * 0.98) - 1];
    if (hi - lo < 0.4) { const m = (hi + lo) / 2; lo = m - 0.2; hi = m + 0.2; }
    const d = (hi - lo) * 0.12;
    return [lo - d, hi + d];
  };
  /* fator de escala vertical para que o gráfico caiba numa altura h */
  CDI.escalaZ = (faixa, h = 1.6) => { const m = Math.max(Math.abs(faixa[0]), Math.abs(faixa[1])); return m > h ? h / m : 1; };
  /* desenha z = k·f(x, y) num disco ou retângulo, cortando fora da faixa */
  CDI.grafico = (C, f, o = {}) => {
    const k = o.k || 1, [lo, hi] = o.faixa || [-Infinity, Infinity];
    const g = (x, y) => { const z = f(x, y); return isFinite(z) && z >= lo && z <= hi ? [x, y, k * z] : null; };
    if (o.raio) C.sup((r, t) => g((o.c || [0, 0])[0] + r * Math.cos(t), (o.c || [0, 0])[1] + r * Math.sin(t)), 0.01, o.raio, 0, 2 * Math.PI, o.nr || 26, o.nt || 72, o);
    else { const [x0, x1, y0, y1] = o.caixa || [-1.2, 1.2, -1.2, 1.2]; C.sup(g, x0, x1, y0, y1, o.n || 44, o.n || 44, o); }
  };
})();
(function () {
  const CDI = window.CDI;
  /* caminho g(t), t ∈ [a, b], escrito pelo aluno. Guarda S[id] (expressão), S[id+'a'], S[id+'b'] (texto).
     Devolve uma função que dá {g, a, b, tex, d (derivada numérica)}. */
  CDI.caminho = (M, id, o) => {
    const dim = o.dim === 0 ? 0 : o.dim || 2; /* 0: qualquer número de componentes */
    const w = M.funcao(id, { rot: o.rot || `$g(t)=$`, vars: ['t'], componentes: dim || undefined, valor: o.valor, dica: o.dica, exemplos: (o.exemplos || []).map(([r, v, a, b, extra]) => [r, v, Object.assign({ [id + 'a']: a, [id + 'b']: b }, extra || {})]), em: o.em });
    M.S[id + 'a'] = o.a; M.S[id + 'b'] = o.b;
    CDI.intervalo(M, w, id + 'a', id + 'b', '$t$ entre');
    const val = CDI.valorConst;
    return () => {
      const F = M.F[id], a = val(M.S[id + 'a']), b = val(M.S[id + 'b']);
      const g = (t) => F.f(t);
      const d = (t, h = 1e-6) => { const p = g(t + h), q = g(t - h); return p.map((x, i) => (x - q[i]) / (2 * h)); };
      return { g, a: a == null ? 0 : a, b: b == null ? 1 : b, tex: F.tex, d };
    };
  };
})();
(function () {
  const CDI = window.CDI;
  /* curva G(x, y) = 0 numa janela w, percorrida por um parâmetro t ∈ [0, 2π) proporcional ao comprimento */
  CDI.curvaImplicita = (G, w, n = 160) => {
    const [x0, x1, y0, y1] = w;
    const comps = CM.cadeias(CM.contorno(G, x0, x1, y0, y1, n, Math.max(20, Math.round((n * (y1 - y0)) / (x1 - x0))), 0)).filter((c) => c.length > 3);
    const acum = [];
    let L = 0;
    comps.forEach((c, ci) => { for (let i = 0; i < c.length - 1; i++) { const d = Math.hypot(c[i + 1][0] - c[i][0], c[i + 1][1] - c[i][1]); acum.push({ ci, i, s0: L, d }); L += d; } });
    const g = (t) => {
      if (!acum.length) return [NaN, NaN];
      let s = (((t / (2 * Math.PI)) % 1) + 1) % 1 * L;
      let lo = 0, hi = acum.length - 1;
      while (lo < hi) { const m = (lo + hi + 1) >> 1; if (acum[m].s0 <= s) lo = m; else hi = m - 1; }
      const a = acum[lo], c = comps[a.ci], u = a.d > 0 ? (s - a.s0) / a.d : 0;
      return [c[a.i][0] + (c[a.i + 1][0] - c[a.i][0]) * u, c[a.i][1] + (c[a.i + 1][1] - c[a.i][1]) * u];
    };
    return { g, comps, G, w, vazia: !acum.length };
  };
})();

(function () {
  const CDI = window.CDI;
  /* valor numérico de uma expressão sem variáveis (ex.: 2pi, √2, 1/3) */
  CDI.valorConst = (s) => { try { const r = EX.ler(String(s), []); const v = r.f(); return isFinite(v) ? v : null; } catch (e) { return null; } };
  /* linha «x entre a e b» dentro de uma caixa de função; guarda o texto em S[ka] e S[kb] */
  CDI.intervalo = (M, w, ka, kb, rot) => {
    const linha = document.createElement('div');
    linha.className = 'fint';
    linha.innerHTML = '<span></span><input class="finp" aria-label="início do intervalo"><span>e</span><input class="finp" aria-label="fim do intervalo">';
    linha.querySelector('span').innerHTML = tex(rot);
    const [ia, ib] = linha.querySelectorAll('input');
    w.insertBefore(linha, w.querySelector('.fprev'));
    const ler = () => { const a = CDI.valorConst(ia.value), b = CDI.valorConst(ib.value); if (a != null && b != null && b > a) { M.S[ka] = ia.value; M.S[kb] = ib.value; linha.classList.remove('mal'); M.atualizar(); } else linha.classList.add('mal'); };
    let t = null;
    linha.addEventListener('input', (e) => { e.stopPropagation(); clearTimeout(t); t = setTimeout(ler, 300); });
    M.sync.push(() => { if (document.activeElement !== ia) ia.value = M.S[ka]; if (document.activeElement !== ib) ib.value = M.S[kb]; });
    return linha;
  };
})();

(function () {
  const CDI = window.CDI;
  /* ajudas para os geradores de exercícios */
  CDI.ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  CDI.escolher = (l) => l[Math.floor(Math.random() * l.length)];
  const mdc = (a, b) => (b ? mdc(b, a % b) : Math.abs(a));
  /* fração p/q simplificada, em TeX */
  CDI.frac = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const d = mdc(p, q) || 1; p /= d; q /= d; return q === 1 ? String(p) : (p < 0 ? '-' : '') + '\\frac{' + Math.abs(p) + '}{' + q + '}'; };
  /* termo c·s com sinal (o primeiro termo não leva «+») */
  CDI.termo = (c, s = '', primeiro = false) => { if (c === 0) return ''; const a = Math.abs(c); return (c < 0 ? '-' : primeiro ? '' : '+') + (s && a === 1 ? '' : String(a)) + s; };
})();
