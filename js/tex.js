/* Fórmulas: $…$ em linha e $$…$$ em destaque, compostas com KaTeX (em vendor/katex). */
(function () {
  const cache = new Map();
  const ent = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  function render(s, display) {
    s = ent(s);
    const k = (display ? 'D' : 'I') + s;
    if (cache.has(k)) return cache.get(k);
    let h;
    try { h = katex.renderToString(s, { throwOnError: false, displayMode: display, strict: 'ignore' }); } catch (e) { h = s; }
    if (cache.size > 4000) cache.clear();
    cache.set(k, h);
    return h;
  }
  /* troca $$…$$ e $…$ por KaTeX; o resto do HTML fica como está */
  window.tex = function (html) {
    if (html == null) return '';
    html = String(html);
    if (html.indexOf('$') < 0 || !window.katex) return html;
    return html
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => render(m, true))
      .replace(/\$([^$]+?)\$/g, (_, m) => render(m, false));
  };
  /* ajudas para escrever números e matrizes em TeX */
  const n = (x, d = 2) => CM.fmtC(x, d).replace('−', '-').replace(',', '{,}');
  window.TX = {
    n,
    v: (v, d) => '(' + v.map((x) => n(x, d)).join(';\\,') + ')',
    m: (M, d) => '\\begin{bmatrix}' + M.map((r) => r.map((x) => n(x, d)).join(' & ')).join(' \\\\ ') + '\\end{bmatrix}',
  };
})();

/* Converte notação Unicode simples (x² + y², x₀, √(…), θ) em TeX, para rótulos curtos e escolhas. */
(function () {
  const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n', '⁻': '-', 'ˣ': 'x', 'ʸ': 'y' };
  const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₖ': 'k', 'ᵢ': 'i', 'ⱼ': 'j', 'ₙ': 'n', 'ₘ': 'm', 'ₓ': 'x', 'ᵧ': 'y' };
  const SIM = { 'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'δ': '\\delta ', 'ε': '\\varepsilon ', 'θ': '\\theta ', 'λ': '\\lambda ', 'μ': '\\mu ', 'π': '\\pi ', 'ρ': '\\rho ', 'σ': '\\sigma ', 'τ': '\\tau ', 'φ': '\\varphi ', 'ψ': '\\psi ', 'ω': '\\omega ', 'Δ': '\\Delta ', '∇': '\\nabla ', '∂': '\\partial ', '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '·': '\\cdot ', '×': '\\times ', '−': '-', '‖': '\\| ', '∞': '\\infty ', '∈': '\\in ', '⇒': '\\Rightarrow ', '→': '\\to ', '↦': '\\mapsto ', '↔': '\\leftrightarrow ', 'ℝ': '\\mathbb{R}', '∫': '\\int ', '∮': '\\oint ', '∬': '\\iint ', '≈': '\\approx ', '∘': '\\circ ', '∩': '\\cap ', '∪': '\\cup ', '∅': '\\varnothing ', '∛': '\\sqrt[3]', '<': '<', '>': '>' };
  function conv(s) {
    s = s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    // √(…) com parênteses equilibrados
    let out = '', i = 0;
    while (i < s.length) {
      if (s[i] === '√' && s[i + 1] === '(') {
        let d = 0, j = i + 1;
        for (; j < s.length; j++) { if (s[j] === '(') d++; else if (s[j] === ')') { d--; if (!d) break; } }
        out += '\\sqrt{' + conv(s.slice(i + 2, j)) + '}';
        i = j + 1;
        continue;
      }
      if (s[i] === '√') { out += '\\sqrt{' + (s[i + 1] || '') + '}'; i += 2; continue; }
      out += s[i++];
    }
    s = out;
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁻ˣʸ]+/g, (m) => '^{' + [...m].map((c) => SUP[c]).join('') + '}');
    s = s.replace(/[₀₁₂₃₄₅₆₇₈₉ₖᵢⱼₙₘₓᵧ]+/g, (m) => '_{' + [...m].map((c) => SUB[c]).join('') + '}');
    s = s.replace(/[αβγδεθλμπρστφψωΔ∇∂≤≥≠·×−‖∞∈⇒→↦↔ℝ∫∮∬≈∘∩∪∅∛]/g, (c) => SIM[c]);
    s = s.replace(/\barcsen\b/g, '\\operatorname{arcsen}').replace(/\bsen\b/g, '\\operatorname{sen}').replace(/\bcos\b/g, '\\cos').replace(/\barctan\b/g, '\\arctan').replace(/\bln\b/g, '\\ln').replace(/\bcosh\b/g, '\\cosh').replace(/\bsinh\b/g, '\\sinh');
    s = s.replace(/e\^\{/g, 'e^{');
    return s;
  }
  const PAL = /\b(?!(?:sen|cos|arcsen|arctan|cosh|sinh)\b)[A-Za-zÀ-ÿ]{4,}\b/;
  /* rótulo curto: converte só se não tiver palavras (para não estragar texto corrido) */
  window.autoTex = function (s) {
    if (s == null) return '';
    s = String(s);
    if (s.includes('$')) return tex(s);
    if (PAL.test(s)) return tex(s);
    try { return katex.renderToString(conv(s), { throwOnError: false, strict: 'ignore' }); } catch (e) { return s; }
  };
  window.uniTex = conv;
  window.ehFormula = (s) => !PAL.test(String(s));
})();
