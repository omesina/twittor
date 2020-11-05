//Importar librerias
importScripts('js/sw-utils.js');

const STATIC_CACHE = "static-v3";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE  = "inmutable-v1";

const APP_SHELL = [
    //'/',    
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'    
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',    
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css'
];

function ClearCache( name, length ) {
    caches.open( name )
        .then( cache => {

            return cache.keys()
                .then( keys => {
                    
                    if ( keys.length > length ) {
                        cache.delete( keys[0] )
                            .then( ClearCache(name, length) );
                    }
                });
        });
}

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {
    const clearCache = caches.keys().then(keys => {
        keys.forEach(key =>{
            if(key != STATIC_CACHE && key.includes('static'))
            {
                return caches.delete(key);
            }
        });
    });
    
    e.waitUntil(clearCache);
});

self.addEventListener('fetch', e => {
    //2- Cache with Network Fallback
   const response = caches.match( e.request ).then( res => {
           if ( res )
           {
                return res;
           }else
           {                
                return fetch( e.request ).then( newResponse => {
                    return UpdateDynamicCache(DYNAMIC_CACHE, e.request, newResponse);
                });
           }           
           });       

       e.respondWith(response);
});