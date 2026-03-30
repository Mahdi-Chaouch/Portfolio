/* coi-serviceworker v0.1.7-1 — https://github.com/gzuidhof/coi-serviceworker */

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

function addCOIHeaders(response) {
  if (!response || response.status === 0) return response;
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  newHeaders.set("Cross-Origin-Embedder-Policy", "credentialless");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

self.addEventListener("fetch", function (event) {
  const req = event.request;
  // Skip non-GET and cross-origin requests
  if (req.method !== "GET") return;
  if (req.cache === "only-if-cached" && req.mode !== "same-origin") return;

  event.respondWith(
    fetch(req)
      .then(addCOIHeaders)
      .catch(function (e) {
        console.error("[coi-sw] fetch error:", e);
        throw e;
      })
  );
});
