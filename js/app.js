/* Estrutura da app CDI II IST.
   Cada matéria (uma linha do programa) regista-se com CDI.materia({...}) num ficheiro em js/materias/.
   Modos: Aprender (definições → teoremas → exemplos), Laboratório (modelos livres) e Exercícios (aquecimento + exercícios). */
(function () {
  const CDI = (window.CDI = { materias: [], modelos: {}, antigos: {} });
  CDI.materia = (m) => CDI.materias.push(m);
  /* modelos partilhados: registados por grupo e usados pelas matérias como 'grupo.modelo' */
  CDI.modelosDe = (grupo, obj) => { obj.modelos.forEach((md) => (CDI.modelos[grupo + '.' + md.id] = md)); CDI.antigos[grupo] = obj; };
  function resolverModelos(m) {
    m.modelos = m.modelos.map((x) => {
      if (typeof x === 'string') x = { de: x };
      if (!x.de) return x;
      const base = CDI.modelos[x.de];
      if (!base) { console.error('Modelo em falta: ' + x.de); return { id: x.id || x.de, nome: x.nome || x.de, montar: () => {} }; }
      return Object.assign({}, base, { id: x.id || x.de.split('.')[1], nome: x.nome || base.nome });
    });
  }

  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  CDI.esc = esc;

  const GRUPOS = ['Cálculo diferencial', 'Cálculo integral', 'Extra'];
  const MODOS = [['aprender', 'Aprender'], ['lab', 'Laboratório'], ['exercicios', 'Exercícios']];
  const TIPOS = { def: 'Definição', teo: 'Teorema', prop: 'Proposição', ex: 'Exemplo', contra: 'Contraexemplo', obs: 'Observação', met: 'Método', lema: 'Lema', cor: 'Corolário' };
  /* endereços da versão anterior */
  const ANTIGOS = { diferenciabilidade: 'campos', cadeia: 'campos', gradiente: 'campos', hessiana: 'taylor', lagrange: 'taylor', mudanca: 'integrais', coordenadas: 'integrais' };

  let atual = null; // { m, modo, modelo, passo, M, painel }
  const pont = {}; // respostas do aquecimento nesta sessão (não são guardadas)
  const exAbertos = {}; // estado dos exercícios abertos nesta sessão

  /* ---------------- funções escritas pelo aluno ---------------- */
  /* valor: texto, ou {r: [[expr, cond], …], z: expr} para funções por ramos */
  CDI.compilar = (valor, vars, o = {}) => {
    if (valor && typeof valor === 'object') return EX.ramos(valor.r.map(([e, c]) => ({ expr: e, cond: c })), valor.z, vars, o);
    return EX.ler(valor, vars, o);
  };

  /* ---------------- contexto de um modelo ---------------- */
  function criarContexto(palco, legenda) {
    const ctl = el('div', 'ctl'), out = el('div', 'out'), info = el('div', 'info');
    const M = { S: {}, F: {}, vistas: [], sync: [], leit: [], infos: [], loops: [], ctl, out, info, palco, legenda };

    M.vista3d = (o) => { const v = new Vista3D(palco, o); M.vistas.push(v); palco.dataset.n = M.vistas.length; return v; };
    M.plano = (o) => { const v = new Plano(palco, o); M.vistas.push(v); palco.dataset.n = M.vistas.length; return v; };
    M.cena = (v, fn) => v.definirCena((C) => fn(C, M.S));
    M.atualizar = () => {
      M.sync.forEach((f) => f());
      M.vistas.forEach((v) => v.pedir());
      M.leit.forEach((f) => f());
      M.infos.forEach((f) => f());
      guardarEstado();
    };
    M.definir = (o) => { Object.assign(M.S, o); M.atualizar(); };

    M.grupo = (titulo) => { const g = el('div', 'grp'); if (titulo) g.appendChild(el('h3', null, tex(titulo))); ctl.appendChild(g); return g; };
    const alvo = (o) => (o && o.em) || ctl;

    M.barra = (id, o) => {
      const fmt = o.fmt || ((x) => CM.fmt(x, 2));
      M.S[id] = o.valor;
      const r = el('div', 'barra');
      r.innerHTML = `<label class="var" style="color:${o.cor || 'var(--ink)'}"></label><input type="range" min="${o.min}" max="${o.max}" step="${o.passo || 0.01}"><output class="mono"></output>`;
      r.querySelector('label').innerHTML = autoTex(o.rot);
      const inp = r.querySelector('input'), sai = r.querySelector('output');
      inp.style.setProperty('--c', o.cor || 'var(--accent)');
      inp.setAttribute('aria-label', o.nome || o.rot);
      let anim = null;
      if (o.animar !== false) {
        const b = el('button', 'play', '▶');
        b.type = 'button';
        b.setAttribute('aria-label', 'Animar ' + (o.nome || o.rot));
        b.addEventListener('click', () => {
          if (anim) { anim.parar(); return; }
          const t0 = performance.now(), dur = o.dur || 4500, a0 = M.S[id];
          const mn = parseFloat(inp.min), mx = parseFloat(inp.max), L = mx - mn;
          let vivo = true;
          b.textContent = '■';
          const passo = (t) => {
            if (!vivo) return;
            const u = (t - t0) / dur;
            let v;
            if (o.circular) v = mn + ((((a0 - mn) + u * L) % L) + L) % L;
            else { const s = (a0 - mn) / L + u * 2; const f = s % 2; v = mn + L * (f <= 1 ? f : 2 - f); }
            M.S[id] = v;
            if (o.aoMudar) o.aoMudar(v);
            M.atualizar();
            requestAnimationFrame(passo);
          };
          anim = { parar: () => { vivo = false; anim = null; b.textContent = '▶'; } };
          M.loops.push(anim);
          requestAnimationFrame(passo);
        });
        r.appendChild(b);
        r.classList.add('com-play');
      }
      inp.addEventListener('input', () => { if (anim) anim.parar(); M.S[id] = parseFloat(inp.value); if (o.aoMudar) o.aoMudar(M.S[id]); M.atualizar(); });
      M.sync.push(() => { const v = M.S[id]; if (parseFloat(inp.value) !== v) inp.value = v; sai.textContent = fmt(v); });
      alvo(o).appendChild(r);
      if (o.dica) alvo(o).appendChild(el('p', 'dica', tex(o.dica)));
      return r;
    };

    M.escolha = (id, o) => {
      M.S[id] = o.valor;
      const w = el('div', 'escolha');
      if (o.rot) w.appendChild(el('span', 'rot', tex(o.rot)));
      const bs = el('div', 'chips');
      o.opcoes.forEach(([v, t]) => {
        const b = el('button', 'chip');
        b.type = 'button';
        b.innerHTML = tex(t);
        b.addEventListener('click', () => { M.S[id] = v; if (o.aoMudar) o.aoMudar(v); M.atualizar(); });
        b._v = v;
        bs.appendChild(b);
      });
      w.appendChild(bs);
      M.sync.push(() => bs.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', b._v === M.S[id])));
      alvo(o).appendChild(w);
      return w;
    };

    M.caixa = (id, o) => {
      M.S[id] = !!o.valor;
      const l = el('label', 'tog');
      l.innerHTML = '<input type="checkbox"><span></span>';
      l.querySelector('span').innerHTML = tex(o.rot);
      const c = l.querySelector('input');
      c.addEventListener('change', () => { M.S[id] = c.checked; M.atualizar(); });
      M.sync.push(() => { c.checked = !!M.S[id]; });
      let g = alvo(o).querySelector(':scope > .togs');
      if (!g) { g = el('div', 'togs'); alvo(o).appendChild(g); }
      g.appendChild(l);
      return l;
    };

    M.botoes = (lista, o) => {
      const w = el('div', 'btns');
      lista.forEach(([t, f, cls]) => { const b = el('button', 'btn' + (cls ? ' ' + cls : ''), tex(t)); b.type = 'button'; b.addEventListener('click', () => { M.parar(); f(); }); w.appendChild(b); });
      alvo(o).appendChild(w);
      return w;
    };

    /* caixa para escrever uma função: o.vars, o.ramos (permite ramos), o.componentes, o.exemplos [[rótulo, valor]], o.condicao */
    M.funcao = (id, o) => {
      M.S[id] = o.valor;
      const w = el('div', 'fbox');
      const vs = o.vars.map((v) => ({ 'θ': '\\theta', 'φ': '\\varphi', 'ρ': '\\rho' })[v] || v).join(';\\,');
      w.innerHTML = `<label class="frot">${tex(o.rot || '$f(' + vs + ')=$')}</label>
        <div class="fsimples"><input type="text" class="finp" spellcheck="false" autocomplete="off" autocapitalize="off" inputmode="text"></div>
        <div class="framos" hidden></div>
        <div class="fprev"></div><p class="ferr" hidden></p>
        <div class="facoes"></div>`;
      const inp = w.querySelector('.finp'), prev = w.querySelector('.fprev'), err = w.querySelector('.ferr'), ramosEl = w.querySelector('.framos'), simples = w.querySelector('.fsimples'), acoes = w.querySelector('.facoes');
      inp.setAttribute('aria-label', 'Escreve a função');
      inp.placeholder = o.exemplo || 'ex.: x^2 + y^2';
      let ultimo = null;
      const compilar = (v, mostrar = true) => {
        if (o.opcional && typeof v === 'string' && !v.trim()) { M.F[id] = null; err.hidden = true; w.classList.remove('mal'); prev.innerHTML = '<span class="fvazio">(vazio)</span>'; return true; }
        try {
          const r = CDI.compilar(v, o.vars, { componentes: o.componentes, condicao: o.condicao });
          M.F[id] = r;
          err.hidden = true;
          w.classList.remove('mal');
          prev.innerHTML = tex('$' + (o.prefixo || '') + r.tex + '$');
          return true;
        } catch (e) {
          if (mostrar) { err.textContent = e.message || 'Não percebi a expressão.'; err.hidden = false; w.classList.add('mal'); }
          return false;
        }
      };
      const lerUI = () => {
        if (ramosEl.hidden) return inp.value;
        const r = [...ramosEl.querySelectorAll('.framo')].map((d) => [d.querySelector('.fe').value, d.querySelector('.fc').value]);
        return { r, z: ramosEl.querySelector('.fz').value };
      };
      let t = null;
      const aoEscrever = () => {
        clearTimeout(t);
        t = setTimeout(() => {
          const v = lerUI();
          if (compilar(v)) { M.S[id] = v; ultimo = JSON.stringify(v); if (o.aoMudar) o.aoMudar(v); M.atualizar(); }
        }, 280);
      };
      const linhaRamo = (e = '', c = '') => {
        const d = el('div', 'framo');
        d.innerHTML = '<input type="text" class="finp fe" spellcheck="false" autocomplete="off" aria-label="Expressão do ramo"><span>se</span><input type="text" class="finp fc" spellcheck="false" autocomplete="off" aria-label="Condição do ramo"><button type="button" class="fx" aria-label="Apagar ramo">×</button>';
        d.querySelector('.fe').value = e; d.querySelector('.fc').value = c;
        d.querySelector('.fx').addEventListener('click', () => { d.remove(); if (!ramosEl.querySelector('.framo')) desligarRamos(); else aoEscrever(); });
        return d;
      };
      const desenharRamos = (v) => {
        ramosEl.innerHTML = '';
        v.r.forEach(([e, c]) => ramosEl.appendChild(linhaRamo(e, c)));
        const z = el('div', 'framo fresto');
        z.innerHTML = '<input type="text" class="finp fz" spellcheck="false" autocomplete="off" aria-label="Valor nos restantes pontos"><span>caso contrário</span>';
        z.querySelector('.fz').value = v.z || '';
        ramosEl.appendChild(z);
        const mais = el('button', 'btn fino', '+ ramo'); mais.type = 'button';
        mais.addEventListener('click', () => { ramosEl.insertBefore(linhaRamo(), z); });
        ramosEl.appendChild(mais);
      };
      const ligarRamos = (v) => { simples.hidden = true; ramosEl.hidden = false; desenharRamos(v); };
      const desligarRamos = () => { const z = ramosEl.querySelector('.fz'); inp.value = z ? z.value : inp.value; simples.hidden = false; ramosEl.hidden = true; aoEscrever(); };
      w.addEventListener('input', aoEscrever);
      if (o.ramos) {
        const b = el('button', 'btn fino', 'Definir por ramos'); b.type = 'button';
        b.addEventListener('click', () => { if (ramosEl.hidden) { ligarRamos({ r: [[inp.value, '(x;y)≠(0;0)']], z: '0' }); aoEscrever(); } else desligarRamos(); });
        acoes.appendChild(b);
        M.sync.push(() => { b.textContent = ramosEl.hidden ? 'Definir por ramos' : 'Uma só expressão'; });
      }
      if (o.exemplos && o.exemplos.length) {
        const ex = el('div', 'fex');
        ex.appendChild(el('span', null, 'Exemplos:'));
        o.exemplos.forEach(([rot, v, extra]) => {
          const b = el('button', 'chip mini'); b.type = 'button';
          b.innerHTML = tex(rot);
          b.addEventListener('click', () => { M.S[id] = v; if (extra) Object.assign(M.S, extra); if (o.aoMudar) o.aoMudar(v); M.atualizar(); });
          ex.appendChild(b);
        });
        w.appendChild(ex);
      }
      if (o.ajuda !== false) w.appendChild(el('p', 'fajuda', 'Escreve como no caderno: <code>2x</code>, <code>xy</code>, <code>x^2</code> ou <code>x²</code>, <code>sen</code>/<code>sin</code>, <code>√</code> ou <code>sqrt</code>, <code>|x|</code>, <code>pi</code>, <code>e</code>, decimais com vírgula ou ponto' + (o.componentes > 1 ? ', componentes separadas por <code>;</code>' : '') + '.'));
      /* quando o valor muda de fora (passos, exemplos, link) */
      M.sync.push(() => {
        const v = M.S[id], k = JSON.stringify(v);
        if (k === ultimo) return;
        ultimo = k;
        if (v && typeof v === 'object') ligarRamos(v);
        else { simples.hidden = false; ramosEl.hidden = true; if (document.activeElement !== inp) inp.value = v; }
        compilar(v);
      });
      compilar(o.valor);
      ultimo = null;
      alvo(o).appendChild(w);
      if (o.dica) alvo(o).appendChild(el('p', 'dica', tex(o.dica)));
      return w;
    };

    /* leituras: fn(S) → [[rótulo, valor, classe?], …]; '—' como separador */
    M.leituras = (titulo, fn, o = {}) => {
      const c = el('div', 'card leit');
      if (titulo) c.appendChild(el('h3', null, tex(titulo)));
      const corpo = el('div', 'rows');
      c.appendChild(corpo);
      (o.em || out).appendChild(c);
      M.leit.push(() => {
        let rows;
        try { rows = fn(M.S); } catch (e) { console.error(e); rows = []; }
        const h = rows.map((r) => (r === '—' ? '<hr>' : typeof r === 'string' ? `<p class="veredito">${tex(r)}</p>` : `<div class="row ${r[2] || ''}"><span>${tex(r[0])}</span><b>${tex(r[1])}</b></div>`)).join('');
        if (corpo._h !== h) { corpo.innerHTML = h; corpo._h = h; }
      });
      return c;
    };

    /* caixa de texto (fixa ou dinâmica): tipo 'nota' | 'aviso' | 'chave' | 'ok' */
    M.texto = (conteudo, tipo = 'nota', o = {}) => {
      const c = el('div', 'box ' + tipo);
      (o.em || info).appendChild(c);
      if (typeof conteudo === 'function') M.infos.push(() => { const h = conteudo(M.S); const t = tex(h || ''); if (c._h !== t) { c.innerHTML = t; c._h = t; } c.hidden = !h; });
      else c.innerHTML = tex(conteudo);
      return c;
    };

    M.legenda = (itens) => { legenda.innerHTML = itens.map(([c, t]) => `<span><i style="background:${c}"></i>${tex(t)}</span>`).join(''); };

    M.loop = (fn) => {
      let vivo = true, t0 = performance.now();
      const L = { parar: () => (vivo = false), fixo: true };
      const passo = (t) => { if (!vivo) return; fn((t - t0) / 1000); t0 = t; requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
      M.loops.push(L);
      return L;
    };
    /* pára as animações das barras (os laços fixos, como o fluido, continuam) */
    M.parar = () => { M.loops.filter((l) => !l.fixo).forEach((l) => l.parar()); M.loops = M.loops.filter((l) => l.fixo); };
    M.destruir = () => { M.loops.forEach((l) => l.parar()); M.loops = []; M.vistas.forEach((v) => v.destruir()); };
    M.cores = () => {
      const g = (n, f) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || f;
      return { u: g('--c1', '#FF9548'), v: g('--c2', '#34D399'), n: g('--c3', '#A78BFA'), b: g('--c4', '#60A5FA'), r: g('--st-bad', '#F87171'), a: g('--st-acc', '#F472B6'), m: g('--st-muted', '#8A97AD'), i: g('--st-ink', '#E8EDF5'), sup: g('--sup', '#4F8CF0'), sup2: g('--sup2', '#8B7CF6'), ouro: g('--ouro', '#F5C542'), ok: g('--st-ok', '#4ADE80') };
    };
    return M;
  }

  /* ---------------- estado no link ---------------- */
  let tGuardar = null, aAplicar = false;
  function estadoCompacto(S) {
    const o = {};
    for (const k in S) {
      if (k[0] === '_') continue;
      const v = S[k];
      if (typeof v === 'number') o[k] = +v.toFixed(4);
      else if (Array.isArray(v)) o[k] = v.map((x) => (typeof x === 'number' ? +x.toFixed(4) : x));
      else o[k] = v;
    }
    return o;
  }
  function guardarEstado() {
    if (aAplicar || !atual || atual.modo === 'exercicios') return;
    clearTimeout(tGuardar);
    tGuardar = setTimeout(() => { if (atual && atual.M) escreverRota(estadoCompacto(atual.M.S)); }, 350);
  }
  function escreverRota(estado) {
    const a = atual;
    let h = '#/' + a.m.id + '/' + a.modo;
    if (a.modo === 'aprender') h += '/' + (a.passo + 1);
    else if (a.modo === 'lab') h += '/' + a.modelo;
    if (estado && a.modo !== 'exercicios') h += '?s=' + encodeURIComponent(JSON.stringify(estado));
    if (location.hash !== h) history.replaceState(null, '', h);
  }

  /* ---------------- navegação ---------------- */
  function montarNav() {
    const nav = $('#lista');
    nav.innerHTML = '';
    const ini = el('a', 'item ini', 'Início');
    ini.href = '#/';
    nav.appendChild(ini);
    GRUPOS.forEach((g) => {
      const ms = CDI.materias.filter((m) => m.grupo === g);
      if (!ms.length) return;
      nav.appendChild(el('p', 'gtit', esc(g)));
      ms.forEach((m) => {
        const a = el('a', 'item');
        a.href = '#/' + m.id;
        a.dataset.id = m.id;
        a.innerHTML = `<span class="num">${m.extra ? '+' : m.ordem}</span><span>${esc(m.curto || m.titulo)}</span>`;
        nav.appendChild(a);
      });
    });
  }

  function rota() {
    const bruto = location.hash.replace(/^#\/?/, '');
    const [cam, q] = bruto.split('?');
    const partes = decodeURIComponent(cam || '').split('/');
    let [id, modo, arg] = partes;
    if (id && !CDI.materias.find((m) => m.id === id) && ANTIGOS[id]) { id = ANTIGOS[id]; modo = null; arg = null; }
    if (!MODOS.find(([k]) => k === modo)) { modo = 'aprender'; arg = null; }
    let estado = null;
    if (q) { const m = /(?:^|&)s=([^&]*)/.exec(q); if (m) { try { estado = JSON.parse(decodeURIComponent(m[1])); } catch (e) { estado = null; } } }
    return { id, modo, arg, estado };
  }

  function inicio() {
    if (atual && atual.M) atual.M.destruir();
    atual = null;
    document.body.classList.add('home');
    document.body.dataset.modo = '';
    document.querySelectorAll('#lista .item').forEach((a) => a.classList.toggle('on', a.classList.contains('ini')));
    $('#kicker').textContent = 'Cálculo Diferencial e Integral II · IST';
    $('#titulo').textContent = 'Aprender a partir das definições';
    $('#modos').hidden = true;
    $('#modelos').innerHTML = '';
    const corpo = $('#corpo');
    corpo.innerHTML = '';
    const w = el('div', 'home-w');
    w.innerHTML = `<p class="lead">Cada matéria segue uma linha do programa e tem três partes: <b>Aprender</b> parte das definições e avança para os teoremas, exemplos e contraexemplos, com um modelo ao lado em que mexes à vontade; o <b>Laboratório</b> deixa-te escrever as tuas próprias funções; os <b>Exercícios</b> têm um aquecimento e exercícios do tipo dos testes, com dicas, resolução passo a passo ou só a solução.</p>`;
    GRUPOS.forEach((g) => {
      const ms = CDI.materias.filter((m) => m.grupo === g);
      if (!ms.length) return;
      w.appendChild(el('h2', 'gh', esc(g)));
      const grid = el('div', 'cards');
      ms.forEach((m) => {
        const a = el('a', 'mcard');
        a.href = '#/' + m.id;
        a.innerHTML = `<span class="num">${m.extra ? '+' : m.ordem}</span><b>${tex(m.titulo)}</b><span>${tex(m.resumo)}</span>`;
        grid.appendChild(a);
      });
      w.appendChild(grid);
    });
    w.appendChild(el('p', 'priv', '<b>Começa sempre do zero.</b> A app não tem contas nem servidor e não guarda nada no teu dispositivo. Para partilhar o que estás a ver, copia o endereço: leva a matéria, o passo e as funções que escreveste.'));
    corpo.appendChild(w);
    fecharMenu();
    window.scrollTo(0, 0);
  }

  function abrir(r) {
    const m = CDI.materias.find((x) => x.id === r.id);
    if (!m) return inicio();
    document.body.classList.remove('home');
    document.querySelectorAll('#lista .item').forEach((a) => a.classList.toggle('on', a.dataset.id === m.id));
    $('#kicker').textContent = (m.extra ? 'Extra' : 'Programa · ' + m.ordem) + (m.paginas ? ' · ' + m.paginas : '');
    $('#titulo').innerHTML = tex(m.titulo);
    let modo = r.modo;
    if (modo === 'aprender' && !(m.aprender || []).length) modo = 'lab';
    document.body.dataset.modo = modo;
    const modos = $('#modos');
    modos.hidden = false;
    modos.innerHTML = '';
    MODOS.forEach(([k, t]) => {
      if (k === 'aprender' && !(m.aprender || []).length) return;
      if (k === 'exercicios' && !(m.aquecimento || []).length && !(m.exercicios || []).length) return;
      const b = el('button', null, t);
      b.type = 'button';
      b.setAttribute('aria-pressed', k === modo);
      b.addEventListener('click', () => abrir({ id: m.id, modo: k, arg: k === 'lab' && atual && atual.m === m ? atual.modelo : null }));
      modos.appendChild(b);
    });
    fecharMenu();
    if (modo === 'exercicios') return abrirExercicios(m);

    let passo = 0, modeloId;
    if (modo === 'aprender') {
      passo = CM.clamp((parseInt(r.arg, 10) || 1) - 1, 0, m.aprender.length - 1);
      modeloId = m.aprender[passo].modelo || m.modelos[0].id;
    } else modeloId = m.modelos.find((x) => x.id === r.arg) ? r.arg : m.modelos[0].id;

    const mesmo = atual && atual.m === m && atual.modelo === modeloId && atual.modo === modo && atual.M;
    if (!mesmo) montarModelo(m, modeloId, modo);
    atual.passo = passo;
    aAplicar = true;
    if (modo === 'aprender') aplicarPasso(m, passo, !!mesmo);
    if (r.estado) atual.M.definir(r.estado);
    aAplicar = false;
    escreverRota(r.estado ? estadoCompacto(atual.M.S) : null);
  }

  function montarModelo(m, modeloId, modo) {
    if (atual && atual.M) atual.M.destruir();
    const corpo = $('#corpo');
    corpo.innerHTML = '';
    corpo.className = '';
    const ch = $('#modelos');
    ch.innerHTML = '';
    if (modo === 'lab' && m.modelos.length > 1) {
      m.modelos.forEach((md) => {
        const b = el('button', 'chip', tex(md.nome));
        b.type = 'button';
        b.setAttribute('aria-pressed', md.id === modeloId);
        b.addEventListener('click', () => abrir({ id: m.id, modo: 'lab', arg: md.id }));
        ch.appendChild(b);
      });
    }
    const palcoW = el('section', 'palco');
    const vistas = el('div', 'vistas');
    const leg = el('div', 'legenda');
    const troca = el('div', 'vtroca');
    palcoW.append(troca, vistas, leg);
    const painel = el('section', 'painel');
    corpo.append(palcoW, painel);
    const M = criarContexto(vistas, leg);
    const md = m.modelos.find((x) => x.id === modeloId);
    atual = { m, modelo: modeloId, modo, passo: 0, M, painel };
    try { md.montar(M); } catch (e) { console.error(e); painel.appendChild(el('p', 'err', 'Erro ao montar o modelo: ' + esc(e.message))); }
    /* no telemóvel, com duas vistas, mostra-se uma de cada vez */
    if (M.vistas.length > 1) {
      vistas.dataset.sel = '0';
      M.vistas.forEach((v, i) => {
        const b = el('button', null, esc(v.opts && v.opts.nomeVista ? v.opts.nomeVista : v instanceof Plano ? 'Vista 2D' : 'Vista 3D'));
        b.type = 'button';
        b.setAttribute('aria-pressed', i === 0);
        b.addEventListener('click', () => { vistas.dataset.sel = String(i); troca.querySelectorAll('button').forEach((x, j) => x.setAttribute('aria-pressed', j === i)); requestAnimationFrame(() => M.vistas.forEach((q) => q.tamanho())); });
        troca.appendChild(b);
      });
    }
    organizarPainel();
    M.atualizar();
    requestAnimationFrame(() => M.vistas.forEach((v) => v.tamanho()));
  }

  function organizarPainel() {
    const { M, painel, modo } = atual;
    painel.innerHTML = '';
    if (modo === 'lab') {
      const c = el('div', 'card');
      c.appendChild(M.ctl);
      if (M.ctl.childElementCount) painel.appendChild(c);
      painel.append(M.out, M.info);
    } else {
      const topo = el('div', 'card passos');
      painel.appendChild(topo);
      atual.topo = topo;
      const d = el('details', 'card mexer');
      d.open = true;
      d.innerHTML = '<summary>Mexer no modelo</summary>';
      d.appendChild(M.ctl);
      if (M.ctl.childElementCount) painel.appendChild(d);
      painel.appendChild(M.out);
    }
  }

  /* ---------------- Aprender ---------------- */
  function aplicarPasso(m, k, mesmo) {
    const ps = m.aprender, p = ps[k];
    const { M, topo } = atual;
    M.parar();
    if (p.vista && M.vistas[0] && M.vistas[0].vistaDe) M.vistas[0].vistaDe(p.vista[0], p.vista[1]);
    M.definir(Object.assign({}, p.estado || {}));
    const tipo = TIPOS[p.tipo] || '';
    topo.innerHTML = `<div class="ptopo"><span>Passo ${k + 1} de ${ps.length}</span><span class="pprog"><i style="width:${(100 * (k + 1)) / ps.length}%"></i></span></div>
      ${tipo ? `<span class="tipo t-${p.tipo}">${tipo}</span>` : ''}
      <h2 class="ptit">${tex(p.titulo)}</h2>
      <div class="ptexto">${tex(p.texto)}</div>
      ${p.demo ? `<details class="demo"><summary>Esboço da demonstração</summary><div>${tex(p.demo)}</div></details>` : ''}
      ${p.experimenta ? `<p class="exp"><b>Experimenta:</b> ${tex(p.experimenta)}</p>` : ''}
      <div class="pnav"><button type="button" class="btn" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Anterior</button><button type="button" class="btn pri" data-d="1" ${k === ps.length - 1 ? 'disabled' : ''}>Seguinte →</button></div>
      <details class="indice"><summary>Todos os passos</summary><ol>${ps.map((q, i) => `<li class="${i === k ? 'on' : ''}"><button type="button" data-i="${i}"><span class="tp">${TIPOS[q.tipo] || ''}</span> ${tex(q.titulo)}</button></li>`).join('')}</ol></details>`;
    topo.onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const i = b.dataset.i != null ? +b.dataset.i : k + +b.dataset.d;
      if (i >= 0 && i < ps.length) { abrir({ id: m.id, modo: 'aprender', arg: String(i + 1) }); if (matchMedia('(max-width: 820px)').matches) topo.scrollIntoView({ block: 'start' }); }
    };
  }

  /* ---------------- Exercícios ---------------- */
  function abrirExercicios(m) {
    if (atual && atual.M) atual.M.destruir();
    atual = { m, modo: 'exercicios', M: null };
    escreverRota(null);
    $('#modelos').innerHTML = '';
    const corpo = $('#corpo');
    corpo.innerHTML = '';
    corpo.className = 'exs';
    const col = el('div', 'excol');
    corpo.appendChild(col);
    if ((m.aquecimento || []).length) {
      const aq = el('section', 'card aquec');
      col.appendChild(aq);
      mostrarAquecimento(m, aq, 0);
    }
    const lista = m.exercicios || [];
    const est = (exAbertos[m.id] = exAbertos[m.id] || {});
    lista.forEach((ex0, i) => {
      const c = el('section', 'card exc');
      col.appendChild(c);
      const desenhar = () => {
        const ex = est[i] && est[i].gerado ? est[i].gerado : ex0;
        const s = (est[i] = est[i] || { modo: null, passo: 0 });
        const gerador = ex0.gerar && m.geradores && m.geradores[ex0.gerar];
        const passos = ex.passos || [];
        let corpoRes = '';
        if (s.modo === 'dicas') corpoRes = `<div class="box chave"><b class="t">Dicas</b>${(ex.dicas || []).map((d) => `<p>${tex(d)}</p>`).join('') || '<p>Este exercício não tem dicas.</p>'}</div>`;
        if (s.modo === 'passos') corpoRes = `<ol class="exp-passos">${passos.slice(0, s.passo + 1).map((p) => `<li>${tex(p)}</li>`).join('')}</ol>${s.passo < passos.length - 1 ? '<button type="button" class="btn pri" data-a="mais">Próximo passo</button>' : `<div class="box ok"><b class="t">Solução</b>${tex(ex.solucao)}</div>`}`;
        if (s.modo === 'sol') corpoRes = `<div class="box ok"><b class="t">Solução</b>${tex(ex.solucao)}</div>`;
        c.innerHTML = `<div class="exh"><span class="exn">${i + 1}</span><div><h3 class="ext">${tex(ex.titulo)}</h3>${ex.tipo ? `<span class="extp">${esc(ex.tipo)}</span>` : ''}</div></div>
          <div class="exe">${tex(ex.enunciado)}</div>
          <div class="btns exb">
            <button type="button" class="btn" data-a="dicas" aria-pressed="${s.modo === 'dicas'}">Dicas</button>
            <button type="button" class="btn" data-a="passos" aria-pressed="${s.modo === 'passos'}">Passo a passo</button>
            <button type="button" class="btn" data-a="sol" aria-pressed="${s.modo === 'sol'}">Só a solução</button>
            ${ex.modelo ? '<button type="button" class="btn" data-a="modelo">Abrir no modelo</button>' : ''}
            ${gerador ? '<button type="button" class="btn pri" data-a="gerar">Gerar outro</button>' : ''}
          </div>${corpoRes}`;
        c.onclick = (e) => {
          const b = e.target.closest('button');
          if (!b) return;
          const a = b.dataset.a;
          if (a === 'dicas' || a === 'passos' || a === 'sol') { s.modo = s.modo === a ? null : a; s.passo = 0; desenhar(); }
          if (a === 'mais') { s.passo++; desenhar(); }
          if (a === 'gerar') { try { s.gerado = gerador(); } catch (er) { console.error(er); } s.modo = null; s.passo = 0; desenhar(); }
          if (a === 'modelo') abrir({ id: m.id, modo: 'lab', arg: ex.modelo, estado: ex.estado || null });
        };
      };
      desenhar();
    });
    if (!lista.length && !(m.aquecimento || []).length) col.appendChild(el('p', 'priv', 'Ainda sem exercícios nesta matéria.'));
    window.scrollTo(0, 0);
  }

  function mostrarAquecimento(m, c, k) {
    const qs = m.aquecimento, q = qs[k];
    const P = (pont[m.id] = pont[m.id] || { r: {} });
    const resp = P.r[k];
    const certas = Object.keys(P.r).filter((i) => P.r[i] === qs[i].certa).length;
    const feitas = Object.keys(P.r).length;
    c.innerHTML = `<div class="ptopo"><span>Aquecimento · ${k + 1} de ${qs.length}</span><span class="mono">${certas}/${feitas} certas</span></div>
      <p class="perg">${tex(q.p)}</p>
      <div class="ops">${q.op.map((o, i) => `<button type="button" class="op ${resp == null ? '' : i === q.certa ? 'certa' : i === resp ? 'errada' : 'apagada'}" data-o="${i}" ${resp != null ? 'disabled' : ''}><span class="ol">${'ABCDE'[i]}</span><span>${tex(o)}</span></button>`).join('')}</div>
      ${resp != null ? `<div class="box ${resp === q.certa ? 'ok' : 'aviso'}"><b>${resp === q.certa ? 'Certo.' : 'Não é essa.'}</b> ${tex(q.porque)}</div>` : ''}
      <div class="pnav"><button type="button" class="btn" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Anterior</button>${k === qs.length - 1 ? '<button type="button" class="btn" data-rec>Recomeçar</button>' : '<button type="button" class="btn pri" data-d="1">Seguinte →</button>'}</div>`;
    c.onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.o != null) { P.r[k] = +b.dataset.o; mostrarAquecimento(m, c, k); return; }
      if (b.dataset.rec != null) { pont[m.id] = { r: {} }; mostrarAquecimento(m, c, 0); return; }
      const i = k + +b.dataset.d;
      if (i >= 0 && i < qs.length) mostrarAquecimento(m, c, i);
    };
  }

  /* ---------------- menu, tema e modo apresentação ---------------- */
  function fecharMenu() { document.body.classList.remove('menu'); }
  function iniciar() {
    CDI.materias.sort((a, b) => (a.extra ? 1 : 0) - (b.extra ? 1 : 0) || (a.ordem || 0) - (b.ordem || 0));
    CDI.materias.forEach(resolverModelos);
    montarNav();
    $('#bmenu').addEventListener('click', () => document.body.classList.toggle('menu'));
    $('#veu').addEventListener('click', fecharMenu);
    const temas = ['auto', 'claro', 'escuro'];
    let t = 0;
    $('#btema').addEventListener('click', () => {
      t = (t + 1) % 3;
      const v = temas[t];
      if (v === 'auto') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', v === 'claro' ? 'light' : 'dark');
      $('#btema').textContent = 'Tema: ' + (v === 'auto' ? 'automático' : v);
      if (atual && atual.M) atual.M.atualizar();
    });
    $('#bapres').addEventListener('click', () => {
      const on = !document.body.classList.contains('apres');
      document.body.classList.toggle('apres', on);
      $('#bapres').setAttribute('aria-pressed', on);
      try { if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen(); } catch (e) { /* sem ecrã inteiro */ }
      setTimeout(() => atual && atual.M && atual.M.vistas.forEach((v) => v.tamanho()), 250);
    });
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('apres')) { document.body.classList.remove('apres'); $('#bapres').setAttribute('aria-pressed', false); setTimeout(() => atual && atual.M && atual.M.vistas.forEach((v) => v.tamanho()), 250); } });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => atual && atual.M && atual.M.atualizar());
    window.addEventListener('hashchange', () => { const r = rota(); if (!r.id) inicio(); else abrir(r); });
    const r = rota();
    if (!r.id) inicio(); else abrir(r);
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  CDI.abrir = (id, modo, arg, estado) => abrir({ id, modo, arg, estado });
  document.addEventListener('DOMContentLoaded', iniciar);
})();
