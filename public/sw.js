
importScripts("js/pouchdb-7.3.1.min.js");
importScripts("js/sw-db.js");

importScripts("js/sw-utils.js");

const CACHE_STATIC_NAME = "pwa-static-v1";
const CACHE_DYNAMIC_NAME = "pwa-dynamic-v1";
const CACHE_INMUTABLE_NAME = "pwa-inmutable-v1";

const APP_SHELL = [
    "/",
    "index.html",
    "images/icon-96x96.png",
    "css/styles.css",
    "productos.html",
    "sobre.html",
    "contacto.html",
    "images/avataaars.svg",
    "js/scripts.js",
    "js/camara-class.js",
    "js/app.js"


];

const APP_SHELL_INMUTABLE = [
    "https://use.fontawesome.com/releases/v6.1.0/js/all.js",
    "https://fonts.googleapis.com/css?family=Montserrat:400,700",
    "https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
    "js/pouchdb-7.3.1.min.js"
];

self.addEventListener("install", (evento) => {
    const cacheEstatico = caches.open(CACHE_STATIC_NAME).then((cache) => {
        return cache.addAll(APP_SHELL);
    });

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then((cache) => {
        return cache.addAll(APP_SHELL_INMUTABLE);
    });

    evento.waitUntil(Promise.all([cacheEstatico, cacheInmutable]));
});

self.addEventListener("activate", (evento) => {
    const respuesta = caches.keys().then((llaves) => {
        llaves.forEach((llave) => {
        if (llave !== CACHE_STATIC_NAME && llave.includes("static")) {
            return caches.delete(llave);
        }

        if (llave !== CACHE_DYNAMIC_NAME && llave.includes("dynamic")) {
            return caches.delete(llave);
        }
        });
    });

    evento.waitUntil(respuesta);
});

self.addEventListener("fetch", (evento) => {

    let respuesta;
    if( evento.request.url.includes("/api") ){

        respuesta = manejarPeticionesApi(CACHE_DYNAMIC_NAME, evento.request);

    }else{

        respuesta = caches.match(evento.request).then((res) => {
            if (res) {
                verificarCache(CACHE_STATIC_NAME, evento.request, APP_SHELL_INMUTABLE);
                return res;

            } else {
                return fetch(evento.request).then((newRes) => {
                    return actualizaCache(CACHE_DYNAMIC_NAME, evento.request, newRes);
                });
            } 
    });
    }

    evento.respondWith(respuesta);
});


self.addEventListener("sync", evento => {
    console.log("Sw: sync");

    if(evento.tag == "nuevo-mensaje"){
        const respuesta = enviarMensajes();
        evento.waitUntil(respuesta);
    }
});
