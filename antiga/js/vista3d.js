/* Motor 3D em WebGL (three.js, guardado em vendor/). Mantém a API simples que as matérias usam:
   cada redesenho chama cena(C) e C.linha, C.sup, C.seta, … constroem a geometria.
   Rótulos em HTML por cima do canvas, com KaTeX quando o texto começa por $. */
(function () {
  const T = window.T3;
  const { add, sub, mul, cross, len, nrm, clamp } = CM;

  function cssVar(n, f) { const v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function hexRgb(h) {
    if (Array.isArray(h)) return h;
    h = String(h).trim();
    if (h.startsWith('rgb')) { const m = h.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2]]; }
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  window.hexRgb = hexRgb;
  const col = (c) => { const [r, g, b] = hexRgb(c); return new T.Color().setRGB(r / 255, g / 255, b / 255, T.SRGBColorSpace); };

  /* mapa de cores por altura: azul-escuro → azul → quase branco */
  const MAPA = [[46, 40, 120], [37, 99, 235], [34, 190, 230], [214, 250, 255]];
  function mapa(t) {
    t = clamp(t, 0, 1) * (MAPA.length - 1);
    const i = Math.min(MAPA.length - 2, Math.floor(t)), f = t - i;
    return MAPA[i].map((a, k) => a + (MAPA[i + 1][k] - a) * f);
  }
  window.mapaAltura = mapa;

  /* rótulos: «$…$» é TeX; o resto é texto com variáveis em itálico */
  function htmlRotulo(txt) {
    if (txt == null) return '';
    const s = String(txt);
    if (s.indexOf('$') >= 0 && window.tex) return window.tex(s.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  class Vista3D {
    constructor(host, opts = {}) {
      this.opts = Object.assign({ ext: 1.6, alvo: [0, 0, 0], yaw: 0.7, pitch: 0.42, dica: 'Arrasta para rodar · pinça ou Ctrl + roda para zoom · botão direito para deslocar' }, opts);
      this.el = document.createElement('div');
      this.el.className = 'vista v3';
      this.el.innerHTML = '<div class="vdica"></div><div class="vbtns"><button type="button" data-z="1" aria-label="Aproximar">+</button><button type="button" data-z="-1" aria-label="Afastar">−</button><button type="button" data-r aria-label="Repor a vista">↺</button></div>';
      this.el.querySelector('.vdica').textContent = this.opts.dica;
      host.appendChild(this.el);

      const r = (this.renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }));
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      r.outputColorSpace = T.SRGBColorSpace;
      r.toneMapping = T.NeutralToneMapping;
      r.toneMappingExposure = 1.05;
      r.domElement.className = 'gl';
      this.el.prepend(r.domElement);
      this.cv = r.domElement;
      this.lab = new T.CSS2DRenderer();
      this.lab.domElement.className = 'rotulos';
      this.el.appendChild(this.lab.domElement);

      this.scene = new T.Scene();
      this.camera = new T.PerspectiveCamera(30, 1, 0.01, 200);
      this.camera.up.set(0, 0, 1);
      this.scene.add(new T.HemisphereLight(0xdfe9ff, 0x1a2233, 1.25));
      const k1 = new T.DirectionalLight(0xffffff, 2.1); k1.position.set(3, -4, 6); this.scene.add(k1);
      const k2 = new T.DirectionalLight(0x9fb8ff, 0.7); k2.position.set(-5, 3, 2); this.scene.add(k2);
      this.dyn = new T.Group();
      this.scene.add(this.dyn);

      this.alcas = [];
      this.linhas = [];
      this.cena = null;
      this.sujo = true;
      this._arrastos();
      this.controls = new T.OrbitControls(this.camera, r.domElement);
      Object.assign(this.controls, { enableDamping: true, dampingFactor: 0.09, rotateSpeed: 0.75, zoomSpeed: 0.9, screenSpacePanning: true });
      this.controls.addEventListener('change', () => (this.sujo = true));
      // a roda do rato só faz zoom com Ctrl (ou na pinça do trackpad); senão deixa a página fazer scroll
      this.el.addEventListener('wheel', (e) => { if (!e.ctrlKey && !e.metaKey) e.stopPropagation(); }, { capture: true });
      this.el.querySelector('.vbtns').addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.r !== undefined) this.repor();
        else this._zoom(b.dataset.z === '1' ? 1 / 1.2 : 1.2);
      });
      this.repor();
      this.ro = new ResizeObserver(() => this.tamanho());
      this.ro.observe(this.el);
      this.tamanho();
      this.vivo = true;
      const tick = () => {
        if (!this.vivo) return;
        this.controls.update();
        if (this.sujo) { this.sujo = false; this.renderer.render(this.scene, this.camera); this.lab.render(this.scene, this.camera); }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    destruir() {
      this.vivo = false;
      this.ro.disconnect();
      this._limpar();
      this.controls.dispose();
      this.renderer.dispose();
      try { this.renderer.forceContextLoss(); } catch (e) { /* ignorar */ }
      this.el.remove();
    }
    _zoom(f) {
      const c = this.camera.position, t = this.controls.target;
      const d = c.clone().sub(t).multiplyScalar(f);
      c.copy(t).add(d);
      this.sujo = true;
    }
    repor() { this.vistaDe(this.opts.yaw, this.opts.pitch); }
    vistaDe(yaw, pitch) {
      const a = this.opts.alvo, d = this.opts.ext * (this.opts.dist || 3.9);
      this.controls.target.set(a[0], a[1], a[2]);
      this.camera.position.set(a[0] + d * Math.cos(pitch) * Math.cos(yaw), a[1] + d * Math.cos(pitch) * Math.sin(yaw), a[2] + d * Math.sin(pitch));
      this.camera.lookAt(this.controls.target);
      this.sujo = true;
    }
    get cam() { // compatibilidade com o código antigo
      const v = this.camera.position.clone().sub(this.controls.target);
      return { yaw: Math.atan2(v.y, v.x), pitch: Math.asin(v.z / v.length()), zoom: 1 };
    }
    tamanho() {
      const r = this.el.getBoundingClientRect();
      this.W = Math.max(50, r.width); this.H = Math.max(50, r.height);
      this.renderer.setSize(this.W, this.H, false);
      this.lab.setSize(this.W, this.H);
      this.camera.aspect = this.W / this.H;
      this.camera.updateProjectionMatrix();
      this.linhas.forEach((m) => m.resolution.set(this.W, this.H));
      this.sujo = true;
    }
    definirCena(fn) { this.cena = fn; this.pedir(); }
    pedir() {
      if (this.pend) return;
      this.pend = true;
      requestAnimationFrame(() => { this.pend = false; this.desenhar(); });
    }

    /* ---------- arrastar pontos no plano horizontal que passa por eles ---------- */
    _arrastos() {
      const cv = this.renderer.domElement, ray = new T.Raycaster(), ndc = new T.Vector2();
      let alca = null, plano = null, ini = null;
      const setNdc = (e) => { const r = cv.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, this.camera); };
      cv.addEventListener('pointerdown', (e) => { this.el.querySelector('.vdica').classList.add('fora');
        ini = [e.clientX, e.clientY];
        if (!this.alcas.length) return;
        setNdc(e);
        const hits = ray.intersectObjects(this.alcas.map((a) => a.mesh), false);
        if (!hits.length) return;
        alca = this.alcas.find((a) => a.mesh === hits[0].object);
        plano = new T.Plane(new T.Vector3(0, 0, 1), -alca.p[2]);
        this.controls.enabled = false;
        cv.setPointerCapture(e.pointerId);
        cv.style.cursor = 'grabbing';
        e.preventDefault();
      });
      cv.addEventListener('pointermove', (e) => {
        if (!alca) {
          if (!this.alcas.length || e.buttons) return;
          setNdc(e);
          cv.style.cursor = ray.intersectObjects(this.alcas.map((a) => a.mesh), false).length ? 'grab' : '';
          return;
        }
        setNdc(e);
        const q = new T.Vector3();
        if (ray.ray.intersectPlane(plano, q)) alca.arr(q.x, q.y);
      });
      const fim = (e) => {
        if (alca) { alca = null; this.controls.enabled = true; cv.style.cursor = ''; return; }
        if (ini && this.aoTocar && Math.hypot(e.clientX - ini[0], e.clientY - ini[1]) < 4) {
          setNdc(e);
          const q = new T.Vector3();
          if (ray.ray.intersectPlane(new T.Plane(new T.Vector3(0, 0, 1), 0), q)) this.aoTocar(q.x, q.y);
        }
        ini = null;
      };
      cv.addEventListener('pointerup', fim);
      cv.addEventListener('pointercancel', fim);
    }

    _limpar() {
      const lixo = [];
      this.dyn.traverse((o) => lixo.push(o));
      lixo.forEach((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        if (o.isCSS2DObject && o.element) o.element.remove();
      });
      this.dyn.clear();
      this.alcas = [];
      this.linhas = [];
    }

    /* ---------- API de construção ---------- */
    _c() {
      const V = this, G = this.dyn, ext = this.opts.ext;
      const ink = cssVar('--st-ink', '#e8edf5');
      const mat = (o, extra = {}) => {
        const a = o.alfa == null ? 1 : o.alfa;
        return new T.MeshStandardMaterial(Object.assign({ color: col(o.cor || cssVar('--sup', '#4f8cf0')), roughness: 0.5, metalness: 0.05, side: T.DoubleSide, transparent: a < 1, opacity: a, depthWrite: a > 0.8, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }, extra));
      };
      const lmat = (o) => {
        const m = new T.LineMaterial({ color: col(o.cor || ink), linewidth: (o.larg || 1.6) * 1.15, transparent: (o.alfa != null && o.alfa < 1) || !!o.trac, opacity: o.alfa == null ? 1 : o.alfa, dashed: !!o.trac, dashSize: o.trac ? o.trac[0] * 0.012 * ext : 1, gapSize: o.trac ? o.trac[1] * 0.012 * ext : 1, depthTest: o.sobre ? false : true, worldUnits: false });
        m.resolution.set(V.W || 800, V.H || 600);
        V.linhas.push(m);
        return m;
      };
      const linhaGeo = (pts, o) => {
        const g = new T.LineGeometry();
        g.setPositions(pts.flat());
        const m = lmat(o);
        const L = new T.Line2(g, m);
        if (o.trac) L.computeLineDistances();
        if (o.sobre) L.renderOrder = 10;
        G.add(L);
        return L;
      };
      const C = {
        ext,
        cor: (n, f) => cssVar(n, f),
        linha(a, b, o = {}) { linhaGeo([a, b], o); },
        curva(pts, o = {}) {
          let seg = [];
          const fl = () => { if (seg.length > 1) linhaGeo(seg, o); seg = []; };
          for (const p of pts) { if (!p || p.some((x) => !isFinite(x))) fl(); else seg.push(p); }
          fl();
        },
        /* muitos segmentos [[a, b], …] num só objeto */
        segs(lista, o = {}) {
          if (!lista.length) return;
          const g = new T.LineSegmentsGeometry();
          g.setPositions(lista.flat(2));
          const L = new T.LineSegments2(g, lmat(o));
          G.add(L);
        },
        param(g, a, b, n, o) { const pts = []; for (let i = 0; i <= n; i++) pts.push(g(a + ((b - a) * i) / n)); C.curva(pts, o); },
        poli(pts, o = {}) {
          if (pts.length < 3) return;
          const pos = [];
          for (let i = 1; i < pts.length - 1; i++) pos.push(...pts[0], ...pts[i], ...pts[i + 1]);
          const g = new T.BufferGeometry();
          g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
          g.computeVertexNormals();
          const m = new T.Mesh(g, mat(Object.assign({ alfa: 0.9 }, o), o.plano ? { roughness: 0.8, emissive: col(o.cor || '#888'), emissiveIntensity: 0.25 } : {}));
          G.add(m);
          if (o.contorno && o.contorno !== 'mesma') C.curva(pts.concat([pts[0]]), { cor: o.contorno, larg: 1, alfa: 0.7 });
        },
        ponto(p, o = {}) {
          const r = 0.03 * ext * ((o.r || 5) / 5);
          const m = new T.Mesh(new T.SphereGeometry(r, 20, 14), new T.MeshStandardMaterial({ color: col(o.cor || ink), roughness: 0.35, metalness: 0.1, emissive: col(o.cor || ink), emissiveIntensity: 0.25 }));
          m.position.set(...p);
          G.add(m);
          if (o.arr) {
            const anel = new T.Mesh(new T.SphereGeometry(r * 2.1, 20, 14), new T.MeshBasicMaterial({ color: col(o.cor || ink), transparent: true, opacity: 0.18, depthWrite: false }));
            anel.position.set(...p);
            G.add(anel);
            V.alcas.push({ mesh: anel, p, arr: o.arr });
          }
          if (o.rot) C.texto(p, o.rot, { cor: o.cor, dx: o.dx == null ? 14 : o.dx, dy: o.dy == null ? -14 : o.dy, tam: o.tam });
        },
        texto(p, txt, o = {}) {
          const d = document.createElement('div');
          d.className = 'rot3';
          const s = document.createElement('span');
          s.innerHTML = htmlRotulo(txt);
          s.style.color = o.cor || ink;
          if (o.tam) s.style.fontSize = o.tam + 'px';
          s.style.transform = `translate(${o.dx || 0}px, ${o.dy || 0}px)`;
          d.appendChild(s);
          const l = new T.CSS2DObject(d);
          l.position.set(...p);
          G.add(l);
        },
        seta(o0, v, o = {}) {
          const L = len(v);
          if (L < 1e-9) return;
          const w = (o.larg || 2.6) / 2.6;
          const hl = Math.min((o.cab || 0.11) * ext, 0.45 * L), rr = 0.011 * ext * w;
          const d = nrm(v), q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(...d));
          const m = new T.MeshStandardMaterial({ color: col(o.cor || ink), roughness: 0.4, emissive: col(o.cor || ink), emissiveIntensity: 0.2 });
          const haste = new T.Mesh(new T.CylinderGeometry(rr, rr, L - hl, 12), m);
          haste.quaternion.copy(q);
          haste.position.set(...add(o0, mul(d, (L - hl) / 2)));
          const cab = new T.Mesh(new T.ConeGeometry(rr * 3.2, hl, 18), m.clone());
          cab.quaternion.copy(q);
          cab.position.set(...add(o0, mul(d, L - hl / 2)));
          G.add(haste, cab);
          if (o.rot) C.texto(add(o0, mul(d, L + 0.08 * ext)), o.rot, { cor: o.cor, tam: o.tam });
        },
        eixos(o = {}) {
          const c = o.cor || cssVar('--st-eixo', '#6f7c93');
          const X = o.x || [-1.3, 1.3], Y = o.y || [-1.3, 1.3], Z = o.z || [-1.1, 1.4];
          const nm = o.nomes || ['x', 'y', 'z'];
          [[[X[0], 0, 0], [X[1], 0, 0]], [[0, Y[0], 0], [0, Y[1], 0]], [[0, 0, Z[0]], [0, 0, Z[1]]]].forEach(([a, b], i) => {
            C.seta(a, sub(b, a), { cor: c, larg: 1.3, cab: 0.07 });
            C.texto(add(b, mul(nrm(sub(b, a)), 0.08 * ext)), '$' + nm[i] + '$', { cor: c });
          });
          if (o.chao !== false) {
            const lim = Math.max(Math.abs(X[0]), X[1], Math.abs(Y[0]), Y[1]);
            const n = Math.round(lim / 0.25) * 2;
            const g = new T.GridHelper(lim * 2, n, col(c), col(c));
            g.rotation.x = Math.PI / 2;
            g.material.transparent = true; g.material.opacity = 0.13; g.material.depthWrite = false;
            G.add(g);
          }
        },
        /* superfície paramétrica g(u, v); o.mapa = 'altura' pinta por z; o.corF(u, v, p) → cor */
        sup(g, u0, u1, v0, v1, nu, nv, o = {}) {
          const P = [];
          for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) P.push(g(u0 + ((u1 - u0) * i) / nu, v0 + ((v1 - v0) * j) / nv));
          const id = (i, j) => i * (nv + 1) + j;
          const ok = (p) => p && p.every((x) => isFinite(x));
          const pos = new Float32Array(P.length * 3), cores = new Float32Array(P.length * 3);
          let zmin = Infinity, zmax = -Infinity;
          P.forEach((p, k) => { if (ok(p)) { pos.set(p, 3 * k); zmin = Math.min(zmin, p[2]); zmax = Math.max(zmax, p[2]); } });
          const base = hexRgb(o.cor || cssVar('--sup', '#4f8cf0'));
          P.forEach((p, k) => {
            let c = base;
            if (ok(p)) {
              if (o.corF) { const i = Math.floor(k / (nv + 1)), j = k % (nv + 1); c = hexRgb(o.corF(u0 + ((u1 - u0) * i) / nu, v0 + ((v1 - v0) * j) / nv, p)); }
              else if (o.mapa === 'altura' || (!o.cor && o.mapa !== false)) c = mapa(zmax > zmin ? (p[2] - zmin) / (zmax - zmin) : 0.5);
            }
            const cc = col(c);
            cores.set([cc.r, cc.g, cc.b], 3 * k);
          });
          const idx = [];
          for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
            const a = id(i, j), b = id(i + 1, j), c = id(i + 1, j + 1), d = id(i, j + 1);
            if (ok(P[a]) && ok(P[b]) && ok(P[c])) idx.push(a, b, c);
            if (ok(P[a]) && ok(P[c]) && ok(P[d])) idx.push(a, c, d);
          }
          const geo = new T.BufferGeometry();
          geo.setAttribute('position', new T.BufferAttribute(pos, 3));
          geo.setAttribute('color', new T.BufferAttribute(cores, 3));
          geo.setIndex(idx);
          geo.computeVertexNormals();
          const m = new T.Mesh(geo, mat(Object.assign({ alfa: 0.92 }, o, { cor: '#ffffff' }), { vertexColors: true, roughness: o.plano ? 0.85 : 0.45 }));
          G.add(m);
          // malha: linhas coordenadas finas
          if (o.malha !== false && !o.plano) {
            const passo = o.passoMalha || Math.max(1, Math.round(Math.max(nu, nv) / 16));
            const seg = [];
            const pushL = (a, b) => { if (ok(P[a]) && ok(P[b])) seg.push(...P[a], ...P[b]); };
            for (let i = 0; i <= nu; i += passo) for (let j = 0; j < nv; j++) pushL(id(i, j), id(i, j + 1));
            for (let j = 0; j <= nv; j += passo) for (let i = 0; i < nu; i++) pushL(id(i, j), id(i + 1, j));
            if (seg.length) {
              const lg = new T.BufferGeometry();
              lg.setAttribute('position', new T.Float32BufferAttribute(seg, 3));
              G.add(new T.LineSegments(lg, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: (o.alfaMalha || 0.16) * Math.min(1, (o.alfa == null ? 0.92 : o.alfa) + 0.2), depthWrite: false })));
            }
          }
          return m;
        },
        grafico(f, x0, x1, y0, y1, n, o = {}) {
          const zmin = o.zmin == null ? -Infinity : o.zmin, zmax = o.zmax == null ? Infinity : o.zmax;
          return C.sup((x, y) => {
            if (o.dom && !o.dom(x, y)) return null;
            const z = f(x, y);
            if (!isFinite(z) || z < zmin - 1e-9 || z > zmax + 1e-9) return null;
            return [x, y, z];
          }, x0, x1, y0, y1, n, n, Object.assign({ mapa: o.cor ? null : 'altura' }, o));
        },
        plano(p, N, h, o = {}) {
          const n = nrm(N);
          const e1 = Math.abs(n[2]) < 0.9 ? nrm(cross(n, [0, 0, 1])) : nrm(cross(n, [1, 0, 0]));
          const e2 = cross(n, e1);
          const pt = (a, b) => add(p, add(mul(e1, a), mul(e2, b)));
          const cs = [pt(-h, -h), pt(h, -h), pt(h, h), pt(-h, h)];
          C.poli(cs, Object.assign({ alfa: 0.3, plano: 1 }, o));
          C.curva(cs.concat([cs[0]]), { cor: o.cor, larg: 1.2, alfa: 0.7 });
        },
        caixa(a, b, o = {}) {
          const s = sub(b, a), c = mul(add(a, b), 0.5);
          const m = new T.Mesh(new T.BoxGeometry(...s), mat(Object.assign({ alfa: 0.3 }, o)));
          m.position.set(...c);
          G.add(m);
          const e = new T.LineSegments(new T.EdgesGeometry(m.geometry), new T.LineBasicMaterial({ color: col(o.cor || ink), transparent: true, opacity: 0.6 }));
          e.position.copy(m.position);
          G.add(e);
        },
        /* prismas da soma de Riemann: lista de [x0, x1, y0, y1, z0, z1] */
        prismas(lista, o = {}) {
          if (!lista.length) return;
          const im = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), mat(Object.assign({ alfa: 0.85 }, o)), lista.length);
          const M4 = new T.Matrix4(), q = new T.Quaternion();
          lista.forEach((b, i) => { M4.compose(new T.Vector3((b[0] + b[1]) / 2, (b[2] + b[3]) / 2, (b[4] + b[5]) / 2), q, new T.Vector3(Math.max(1e-4, b[1] - b[0]), Math.max(1e-4, b[3] - b[2]), Math.max(1e-4, Math.abs(b[5] - b[4])))); im.setMatrixAt(i, M4); });
          G.add(im);
          if (o.arestas !== false && lista.length <= 900) {
            const seg = [];
            lista.forEach(([x0, x1, y0, y1, z0, z1]) => {
              const v = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
              for (let k = 0; k < 4; k++) { const [a, b] = [v[k], v[(k + 1) % 4]]; seg.push(a[0], a[1], z1, b[0], b[1], z1, a[0], a[1], z0, a[0], a[1], z1); }
            });
            const lg = new T.BufferGeometry();
            lg.setAttribute('position', new T.Float32BufferAttribute(seg, 3));
            G.add(new T.LineSegments(lg, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false })));
          }
        },
        /* rodinha (para o rotacional): roda no plano z = c com ângulo a */
        rodinha(p, r, ang, o = {}) {
          const pts = [];
          for (let i = 0; i <= 32; i++) { const t = (2 * Math.PI * i) / 32; pts.push([p[0] + r * Math.cos(t), p[1] + r * Math.sin(t), p[2]]); }
          C.curva(pts, { cor: o.cor, larg: o.larg || 1.6 });
          for (let k = 0; k < 4; k++) { const t = ang + (k * Math.PI) / 2; C.linha(p, [p[0] + r * Math.cos(t), p[1] + r * Math.sin(t), p[2]], { cor: o.cor, larg: o.larg || 1.6 }); }
        },
      };
      return C;
    }

    desenhar() {
      if (!this.cena) return;
      this._limpar();
      try { this.cena(this._c()); } catch (e) { console.error(e); }
      this.sujo = true;
    }
  }
  window.Vista3D = Vista3D;
  window.htmlRotulo = htmlRotulo;
})();
