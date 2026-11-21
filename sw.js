/* Funciona sem internet depois da primeira visita. A página vem da rede primeiro, para as atualizações chegarem. */
const C = "cdi-ii-3d-v1";
const A = ["./", "./index.html", "./css/app.css", "./js/math.js", "./js/vista3d.js", "./js/plano.js", "./js/app.js", "./manifest.webmanifest", "./icons/icon-180.png", "./icons/icon-192.png", "./js/materias/01-topologia.js", "./js/materias/02-diferenciabilidade.js", "./js/materias/03-cadeia.js", "./js/materias/04-gradiente.js", "./js/materias/05-hessiana.js", "./js/materias/06-inversa.js", "./js/materias/07-lagrange.js", "./js/materias/08-integrais.js", "./js/materias/09-mudanca.js", "./js/materias/10-coordenadas.js", "./js/materias/11-green.js", "./js/materias/12-superficies.js"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(C).then((c) => c.addAll(A)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res && res.status === 200 && res.type === "basic") { const cl = res.clone(); caches.open(C).then((c) => c.put(e.request, cl)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("./index.html")))
  );
});
