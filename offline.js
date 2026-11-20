const prefix='mangmang:'+new URL(self.registration.scope).pathname+':';
const version=prefix+'50369a28d4461b6b';
const urls=["./", "index.html", "manifest.webmanifest", "qr.png", "garden.html", "garden.js", "garden.pck", "garden.icon.png", "garden.apple-touch-icon.png", "garden.wasm.gz", "garden.audio.position.worklet.js", "garden.audio.worklet.js"];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(version);
    const requests=urls.map(name=>new Request(name,{cache:'reload'}));
    if(!('DecompressionStream' in self)) requests.push(new Request('garden.wasm',{cache:'reload'}));
    await cache.addAll(requests);
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const key of await caches.keys()) if(key.startsWith(prefix)&&key!==version) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'|| !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith((async()=>{
    const cached=await (await caches.open(version)).match(event.request,{ignoreSearch:true});
    return cached || fetch(event.request);
  })());
});
