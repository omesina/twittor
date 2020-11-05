

//Guadar en le cache dinamico
function UpdateDynamicCache(cacheName, req, res) {
    if(res.ok)
    {
        return caches.open(cacheName).then(cache =>{
            cache.put(req, res.clone());
            return res.clone();
        });
    }
    else{
        return res;
    }
}

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