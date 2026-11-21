/* Estrutura da app: lista de matérias, modos Explorar / Explicar / Testa-te, controlos e rotas.
   Cada matéria regista-se com CDI.materia({...}) num ficheiro em js/materias/. */
(function () {
  const CDI = (window.CDI = { materias: [] });
  CDI.materia = (m) => CDI.materias.push(m);

  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const GRUPOS = ['Cálculo diferencial', 'Cálculo integral', 'Geometria em ℝ³'];
  const MODOS = [['explorar', 'Explorar'], ['explicar', 'Explicar'], ['testa', 'Testa-te']];

  let atual = null; // { m, modelo, modo, passo, M }
  const pont = {}; // pontuação do Testa-te nesta sessão (não é guardada)

  /* ---------------- contexto de um modelo ---------------- */
  function criarContexto(palco, painel, legenda) {
    const ctl = el('div', 'ctl'), out = el('div', 'out'), info = el('div', 'info');
    const M = { S: {}, vistas: [], sync: [], leit: [], infos: [], loops: [], ctl, out, info, palco, legenda };

    M.vista3d = (o) => { const v = new Vista3D(palco, o); M.vistas.push(v); palco.dataset.n = M.vistas.length; return v; };
    M.plano = (o) => { const v = new Plano(palco, o); M.vistas.push(v); palco.dataset.n = M.vistas.length; return v; };
    M.cena = (v, fn) => v.definirCena((C) => fn(C, M.S));
    M.atualizar = () => {
      M.vistas.forEach((v) => v.pedir());
      M.sync.forEach((f) => f());
      M.leit.forEach((f) => f());
      M.infos.forEach((f) => f());
    };
    M.definir = (o) => { Object.assign(M.S, o); M.atualizar(); };

    M.grupo = (titulo) => { const g = el('div', 'grp'); if (titulo) g.appendChild(el('h3', null, esc(titulo))); ctl.appendChild(g); return g; };
    const alvo = (o) => (o && o.em) || ctl;

    M.barra = (id, o) => {
      const fmt = o.fmt || ((x) => CM.fmt(x, 2));
      M.S[id] = o.valor;
      const r = el('div', 'barra');
      r.innerHTML = `<label class="var" style="color:${o.cor || 'var(--ink)'}"></label><input type="range" min="${o.min}" max="${o.max}" step="${o.passo || 0.01}"><output class="mono"></output>`;
      r.querySelector('label').textContent = o.rot;
      const inp = r.querySelector('input'), sai = r.querySelector('output');
      inp.style.accentColor = o.cor || 'var(--accent)';
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
      if (o.dica) alvo(o).appendChild(el('p', 'dica', o.dica));
      return r;
    };

    M.escolha = (id, o) => {
      M.S[id] = o.valor;
      const w = el('div', 'escolha' + (o.mono ? ' emono' : ''));
      if (o.rot) w.appendChild(el('span', 'rot', esc(o.rot)));
      const bs = el('div', 'chips');
      o.opcoes.forEach(([v, t]) => {
        const b = el('button', 'chip');
        b.type = 'button';
        b.innerHTML = t;
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
      l.querySelector('span').innerHTML = o.rot;
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
      lista.forEach(([t, f, cls]) => { const b = el('button', 'btn' + (cls ? ' ' + cls : ''), t); b.type = 'button'; b.addEventListener('click', () => { M.parar(); f(); }); w.appendChild(b); });
      alvo(o).appendChild(w);
      return w;
    };

    /* leituras: fn(S) → [[rótulo, valor, classe?], …]; '—' como separador */
    M.leituras = (titulo, fn, o = {}) => {
      const c = el('div', 'card leit');
      if (titulo) c.appendChild(el('h3', null, titulo));
      const corpo = el('div', 'rows');
      c.appendChild(corpo);
      (o.em || out).appendChild(c);
      M.leit.push(() => {
        let rows;
        try { rows = fn(M.S); } catch (e) { console.error(e); rows = []; }
        corpo.innerHTML = rows.map((r) => (r === '—' ? '<hr>' : typeof r === 'string' ? `<p class="veredito">${r}</p>` : `<div class="row ${r[2] || ''}"><span>${r[0]}</span><b class="mono">${r[1]}</b></div>`)).join('');
      });
      return c;
    };

    /* caixa de texto (fixa ou dinâmica): tipo 'nota' | 'aviso' | 'chave' | 'ok' */
    M.texto = (conteudo, tipo = 'nota', o = {}) => {
      const c = el('div', 'box ' + tipo);
      (o.em || info).appendChild(c);
      if (typeof conteudo === 'function') M.infos.push(() => { const h = conteudo(M.S); c.innerHTML = h || ''; c.hidden = !h; });
      else c.innerHTML = conteudo;
      return c;
    };

    M.legenda = (itens) => {
      legenda.innerHTML = itens.map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('');
    };

    M.loop = (fn) => {
      let vivo = true, t0 = performance.now();
      const L = { parar: () => (vivo = false) };
      const passo = (t) => { if (!vivo) return; fn((t - t0) / 1000); t0 = t; requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
      M.loops.push(L);
      return L;
    };
    M.parar = () => { M.loops.forEach((l) => l.parar()); M.loops = []; };
    M.destruir = () => { M.parar(); M.vistas.forEach((v) => v.destruir()); };
    M.cores = () => {
      const g = (n, f) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || f;
      return { u: g('--c1', '#C25A16'), v: g('--c2', '#1F7A4D'), n: g('--c3', '#6A4BC4'), b: g('--c4', '#2F6FB5'), r: g('--bad', '#C2413A'), a: g('--accent', '#2E6B4F'), m: g('--muted', '#5c6661'), i: g('--ink', '#1b2420'), sup: g('--sup', '#5b8fd6'), sup2: g('--sup2', '#b39ddb') };
    };
    return M;
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
        a.innerHTML = `<span class="num">${CDI.materias.indexOf(m) + 1}</span><span>${esc(m.curto || m.titulo)}</span>`;
        nav.appendChild(a);
      });
    });
  }

  function rota() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [id, modelo, modo, passo] = h.split('/');
    return { id, modelo, modo: modo || 'explorar', passo: passo ? parseInt(passo, 10) - 1 : 0 };
  }
  function irPara(id, modelo, modo, passo) {
    let h = '#/' + id;
    if (modelo) h += '/' + modelo;
    if (modo && modo !== 'explorar') h += '/' + modo + (passo != null ? '/' + (passo + 1) : '');
    if (location.hash !== h) history.replaceState(null, '', h);
  }

  function inicio() {
    if (atual && atual.M) atual.M.destruir();
    atual = null;
    document.body.classList.add('home');
    document.querySelectorAll('#lista .item').forEach((a) => a.classList.toggle('on', a.classList.contains('ini')));
    $('#kicker').textContent = 'CDI II · Teóricas (Alameda)';
    $('#titulo').textContent = 'Modelos 3D interativos';
    $('#modos').hidden = true;
    $('#modelos').innerHTML = '';
    const corpo = $('#corpo');
    corpo.innerHTML = '';
    const w = el('div', 'home-w');
    w.innerHTML = `<p class="lead">Cada matéria tem modelos para mexer à vontade (<b>Explorar</b>), uma sequência de passos para mostrar a alguém (<b>Explicar</b>) e perguntas com correção (<b>Testa-te</b>). Roda as figuras com o dedo ou o rato; as contas mudam ao vivo.</p>`;
    GRUPOS.forEach((g) => {
      const ms = CDI.materias.filter((m) => m.grupo === g);
      if (!ms.length) return;
      w.appendChild(el('h2', 'gh', esc(g)));
      const grid = el('div', 'cards');
      ms.forEach((m) => {
        const a = el('a', 'mcard');
        a.href = '#/' + m.id;
        a.innerHTML = `<span class="num">${CDI.materias.indexOf(m) + 1}</span><b>${esc(m.titulo)}</b><span>${m.resumo}</span>`;
        grid.appendChild(a);
      });
      w.appendChild(grid);
    });
    w.appendChild(el('p', 'priv', '<b>Começa sempre do zero.</b> A app não tem contas nem servidor e não guarda nada no teu dispositivo. Podes partilhar o link de qualquer modelo ou passo: o endereço muda à medida que navegas.'));
    corpo.appendChild(w);
    fecharMenu();
    window.scrollTo(0, 0);
  }

  function abrir(r) {
    const m = CDI.materias.find((x) => x.id === r.id);
    if (!m) return inicio();
    document.body.classList.remove('home');
    document.querySelectorAll('#lista .item').forEach((a) => a.classList.toggle('on', a.dataset.id === m.id));
    $('#kicker').textContent = m.grupo + (m.paginas ? ' · ' + m.paginas : '');
    $('#titulo').textContent = m.titulo;
    const modos = $('#modos');
    modos.hidden = false;
    modos.innerHTML = '';
    const modoOk = MODOS.find(([k]) => k === r.modo && (k !== 'explicar' || (m.explicar || []).length) && (k !== 'testa' || (m.testa || []).length)) ? r.modo : 'explorar';
    MODOS.forEach(([k, t]) => {
      if (k === 'explicar' && !(m.explicar || []).length) return;
      if (k === 'testa' && !(m.testa || []).length) return;
      const b = el('button', null, t);
      b.type = 'button';
      b.setAttribute('aria-pressed', k === modoOk);
      b.addEventListener('click', () => { const md = k === 'explorar' ? (atual && atual.modelo) : null; abrir({ id: m.id, modelo: md, modo: k, passo: 0 }); });
      modos.appendChild(b);
    });

    let modeloId = r.modelo && m.modelos.find((x) => x.id === r.modelo) ? r.modelo : m.modelos[0].id;
    let passo = Math.max(0, r.passo || 0);
    if (modoOk === 'explicar') { passo = Math.min(passo, m.explicar.length - 1); modeloId = m.explicar[passo].modelo || modeloId; }
    if (modoOk === 'testa') { passo = Math.min(passo, m.testa.length - 1); modeloId = m.testa[passo].modelo || modeloId; }
    const mesmo = atual && atual.m === m && atual.modelo === modeloId && atual.modo === modoOk;
    if (!mesmo) montarModelo(m, modeloId, modoOk);
    atual.passo = passo;
    if (modoOk === 'explicar') aplicarPasso(m, passo);
    if (modoOk === 'testa') mostrarPergunta(m, passo);
    irPara(m.id, modeloId, modoOk, modoOk === 'explorar' ? null : passo);
    fecharMenu();
  }

  function montarModelo(m, modeloId, modo) {
    if (atual && atual.M) atual.M.destruir();
    const corpo = $('#corpo');
    corpo.innerHTML = '';
    // separadores de modelos (no Explorar)
    const ch = $('#modelos');
    ch.innerHTML = '';
    if (modo === 'explorar' && m.modelos.length > 1) {
      m.modelos.forEach((md) => {
        const b = el('button', 'chip', esc(md.nome));
        b.type = 'button';
        b.setAttribute('aria-pressed', md.id === modeloId);
        b.addEventListener('click', () => abrir({ id: m.id, modelo: md.id, modo: 'explorar' }));
        ch.appendChild(b);
      });
    }
    const palcoW = el('section', 'palco');
    const vistas = el('div', 'vistas');
    const leg = el('div', 'legenda');
    palcoW.append(vistas, leg);
    const painel = el('section', 'painel');
    corpo.append(palcoW, painel);
    const M = criarContexto(vistas, painel, leg);
    const md = m.modelos.find((x) => x.id === modeloId);
    atual = { m, modelo: modeloId, modo, passo: 0, M, painel };
    try { md.montar(M); } catch (e) { console.error(e); painel.appendChild(el('p', 'err', 'Erro ao montar o modelo: ' + esc(e.message))); }
    if (md.sobre) M.texto(md.sobre, 'nota');
    organizarPainel();
    M.atualizar();
    // as vistas leem o tamanho depois de entrar na página
    requestAnimationFrame(() => M.vistas.forEach((v) => v.tamanho()));
  }

  function organizarPainel() {
    const { M, painel, modo } = atual;
    painel.innerHTML = '';
    if (modo === 'explorar') {
      const c = el('div', 'card');
      c.appendChild(M.ctl);
      if (M.ctl.childElementCount) painel.appendChild(c);
      painel.append(M.out, M.info);
    } else {
      const topo = el('div', 'card passos');
      painel.appendChild(topo);
      atual.topo = topo;
      if (modo === 'testa') {
        const v = el('details', 'card mexer');
        v.innerHTML = '<summary>Ver os valores do modelo</summary>';
        v.appendChild(M.out);
        painel.appendChild(v);
      } else painel.appendChild(M.out);
      const d = el('details', 'card mexer');
      d.innerHTML = '<summary>Mexer nos controlos</summary>';
      d.appendChild(M.ctl);
      if (M.ctl.childElementCount) painel.appendChild(d);
      if (modo === 'explicar') painel.appendChild(M.info);
    }
  }

  /* ---------------- Explicar ---------------- */
  function aplicarPasso(m, k) {
    const ps = m.explicar, p = ps[k];
    const { M, topo } = atual;
    M.parar();
    if (p.vista && M.vistas[0] && M.vistas[0].vistaDe) M.vistas[0].vistaDe(p.vista[0], p.vista[1]);
    M.definir(Object.assign({ destaque: null }, p.estado || {}));
    topo.innerHTML = `<div class="ptopo"><span>Passo ${k + 1} de ${ps.length}</span></div>
      <ol class="plista">${ps.map((q, i) => `<li class="${i === k ? 'on' : i < k ? 'feito' : ''}"><button type="button" data-i="${i}"><span class="pn">${i + 1}</span><span>${esc(q.titulo)}</span></button>${i === k ? `<div class="ptexto">${q.texto}</div>` : ''}</li>`).join('')}</ol>
      <div class="pnav"><button type="button" class="btn" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Anterior</button><button type="button" class="btn pri" data-d="1" ${k === ps.length - 1 ? 'disabled' : ''}>Seguinte →</button></div>`;
    topo.onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const i = b.dataset.i != null ? +b.dataset.i : k + +b.dataset.d;
      if (i >= 0 && i < ps.length) abrir({ id: m.id, modelo: ps[i].modelo, modo: 'explicar', passo: i });
    };
  }

  /* ---------------- Testa-te ---------------- */
  function mostrarPergunta(m, k) {
    const qs = m.testa, q = qs[k];
    const { M, topo } = atual;
    const P = (pont[m.id] = pont[m.id] || { r: {} });
    M.parar();
    if (q.estado) M.definir(q.estado);
    const resp = P.r[k];
    const certas = Object.keys(P.r).filter((i) => P.r[i] === qs[i].certa).length;
    const feitas = Object.keys(P.r).length;
    topo.innerHTML = `<div class="ptopo"><span>Pergunta ${k + 1} de ${qs.length}</span><span class="mono">${certas}/${feitas} certas</span></div>
      <p class="perg">${q.p}</p>
      <div class="ops">${q.op.map((o, i) => `<button type="button" class="op ${resp == null ? '' : i === q.certa ? 'certa' : i === resp ? 'errada' : 'apagada'}" data-o="${i}" ${resp != null ? 'disabled' : ''}><span class="ol">${'ABCDE'[i]}</span><span>${o}</span></button>`).join('')}</div>
      ${resp != null ? `<div class="box ${resp === q.certa ? 'ok' : 'aviso'}"><b>${resp === q.certa ? 'Certo.' : 'Não é essa.'}</b> ${q.porque}</div>` : q.dica ? `<details class="dicaq"><summary>Dica</summary><p>${q.dica}</p></details>` : ''}
      <div class="pnav"><button type="button" class="btn" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Anterior</button>${k === qs.length - 1 ? `<button type="button" class="btn" data-rec>Recomeçar</button>` : `<button type="button" class="btn pri" data-d="1">Seguinte →</button>`}</div>`;
    topo.onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.o != null) { P.r[k] = +b.dataset.o; if (q.depois) M.definir(q.depois); mostrarPergunta(m, k); return; }
      if (b.dataset.rec != null) { pont[m.id] = { r: {} }; abrir({ id: m.id, modo: 'testa', passo: 0 }); return; }
      const i = k + +b.dataset.d;
      if (i >= 0 && i < qs.length) abrir({ id: m.id, modelo: qs[i].modelo, modo: 'testa', passo: i, manter: true });
    };
  }

  /* ---------------- menu no telemóvel e tema ---------------- */
  function fecharMenu() { document.body.classList.remove('menu'); }
  function iniciar() {
    CDI.materias.sort((a, b) => GRUPOS.indexOf(a.grupo) - GRUPOS.indexOf(b.grupo) || (a.ordem || 0) - (b.ordem || 0));
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
      if (atual) atual.M.atualizar();
    });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => atual && atual.M.atualizar());
    window.addEventListener('hashchange', () => { const r = rota(); if (!r.id) inicio(); else abrir(r); });
    const r = rota();
    if (!r.id) inicio(); else abrir(r);
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  document.addEventListener('DOMContentLoaded', iniciar);
})();
