class Content{
    constructor(projectName,ans){
        this.projectName = projectName;
        this.ans = ans;
    }

    index(){
        return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <meta name="description" content="This is a PWA called ${this.projectName}">
        <meta name="keywords" content="pwa" >
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="author" content="" />
        <meta name="copyright" content="" />
        <meta name="robots" content="follow"/>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${this.projectName}">
        <meta property="og:url" content="">
        <meta property="og:image:secure_url" itemprop="image" content="">
        <meta property="og:image" itemprop="image" content="">
        <meta property="og:image:width" content="700" />
        <meta property="og:image:height" content="700" />
        <meta property="og:image:alt" content="OG image of ${this.projectName}" />
        <meta property="og:description" content="This is a PWA called ${this.projectName}">
        <meta property="og:site_name" content="${this.projectName}">
        <meta name="fragment" content="!">
        <link rel=icon sizes=192x192 href="assets/logo-192.png">
        <meta name="theme-color" content="${this.ans.color}" />
        <title>${this.projectName}</title>
        ${this.ans.features.includes('Manifest')?'<link rel="manifest" href="manifest.json"> <!- - -->':''}
    </head>
    <body>
    <!-- Replace this Div with your HTML content -->
    <div style="margin-top:100px;font-family:arial,Cursive;padding-left:100px">
        <img src="assets/logo-192.png" width='70'>
        <h2>
            Welcome to PWA '${this.projectName}'
            <div style="margin-left:20px;height:18px;width:30px;background-color:${this.ans.color};display:inline-block"></div>
        </h2>
        This project is generated using <a href="https://github.com/saurabhdaware/pwainit">pwainit</a><br><br>
        The client generated following files:<br>
        ${this.ans.features.includes('Manifest')?'- <a href="manifest.json">manifest.json</a><br>':''}
        ${this.ans.features.includes('Service Worker')?'- <a href="sw.js">sw.js</a><br>':''}
        <br><b>Note:</b> Service Workers dont work from file:// protocol so you will need to serve over http://localhost for them to work. You can do this using 'npm i -g serve' then 'serve dist'.<br><br>
        Check Application tab -> Manifest and Application tab -> Service Worker in developer tools to debug them.<br><br>
        If you have no idea what service workers and manifest are, you might consider reading following articles:<br>
        <a href="https://developers.google.com/web/fundamentals/web-app-manifest/">https://developers.google.com/web/fundamentals/web-app-manifest/</a> <br>
        <a href="https://developers.google.com/web/fundamentals/primers/service-workers/">https://developers.google.com/web/fundamentals/primers/service-workers/</a>
        <br><br>
        <br>If you liked this command line tool give it a star on <a href="https://github.com/saurabhdaware/pwainit">Github</a><br><br>
        Have fun building this PWA!
    </div>
    ${this.ans.features.includes('Service Worker')?`
    <script>
    // ServiceWorker Registration
    if('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    </script>
    `:''}
    </body>
</html>
`
    }


    manifest(){
        return `
{
    "name": "${this.projectName}",
    "short_name": "${this.projectName}",
    "icons": [
        {
            "src": "assets/logo-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "assets/logo-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "${this.ans.color}",
    "background_color": "${this.ans.color}",
    "display": "standalone",
    "start_url":"index.html"
}
`
    }


    serviceWorker(){
        return `
var CACHE_NAME = 'version-1';
// Put all your urls that you want to cache in this array
var urlsToCache = [
    '/',
    'assets/logo-192.png'
];

// Install the service worker and open the cache and add files mentioned in array to cache
self.addEventListener('install', function(event) {
    event.waitUntil(
    caches.open(CACHE_NAME)
        .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
        })
    );
});


// keep fetching the requests from the user
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
            return response;
            }
            return fetch(event.request);
        }
        )
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = []; // add cache names which you do not want to delete
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.map(function(cacheName) {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        );
        })
    );
});
        
`
    }



}

module.exports = Content;