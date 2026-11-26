/* عامل خدمة نظام دروب — الشبكة أولاً (دائماً أحدث نسخة)، والنسخة المخزّنة عند انقطاع الإنترنت فقط */
var C='droob-shell-v1';
self.addEventListener('install',function(e){ self.skipWaiting(); e.waitUntil(caches.open(C).then(function(c){ return c.add('./').catch(function(){}); })); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==C; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch',function(e){
  var r=e.request, u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||/version\.json|sw\.js/.test(u.pathname)) return;
  var isPage=r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname);
  if(!isPage) return;
  e.respondWith(fetch(r).then(function(res){ if(res&&res.ok){ var cp=res.clone(); caches.open(C).then(function(c){ c.put('./',cp); }); } return res; })
    .catch(function(){ return caches.match('./').then(function(m){ return m||Response.error(); }); }));
});
