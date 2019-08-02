function isPresentInHead(headHtml,property,value){
    return headHtml.includes(`${property}="${value}"`) || headHtml.includes(`${property}='${value}'`)
}

class Content{
    constructor(projectName,ans){
        this.projectName = (projectName == '.')?ans.appName:projectName;
        this.ans = ans;
        this.swPushAPI = `// NOTIFICATIONS

// Listens to push events from endpoints. Please go through https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#push_api to understand this properly
self.addEventListener('push', function(e) {
    const data = e.data.text(); // or your can add e.data.json() and pass json data from server
    // e.data.text() holds the text sent from server. You can test this from developer tools -> Application -> Service Worker -> Push: []
    var options = {
        body: data,
        icon: 'images/example.png',
        vibrate: [100, 50, 100],
        data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
        },
        actions: [
        {action: 'explore', title: 'Explore this new world',
            icon: 'images/checkmark.png'},
        {action: 'close', title: 'Close',
            icon: 'images/xmark.png'},
        ]
    };
    e.waitUntil(
        self.registration.showNotification('Title text', options)
    );
});`
    }
    
    // content of index.html
    index(){
        return `<!DOCTYPE html>
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
        ${this.ans.features.includes('Manifest')?'<link rel="manifest" href="manifest.json">':''}
        <style>
            :root{
                --theme:${this.ans.color};
            }
            a{text-decoration:none;color:var(--theme)}
        </style>
    </head>
    <body>
    <!-- Replace this Div with your HTML content -->
    <div style="position:relative;margin-top:100px;font-family:arial,Cursive;padding-left:100px;text-align:center;">
        <img src="https://res.cloudinary.com/saurabhdaware/image/upload/v1557861561/saurabhdaware.in/projects/pwainit-portfolio.png" width=300 style="border-radius:50%;"><br>
        <img style="position:absolute;top:120px;left:0;right:0;margin:auto;" src="assets/logo-192.png" width='70'>
        <h2 style="color:var(--theme)">
            Your PWA ${this.projectName} is ready 🎉
        </h2>
        <div style="opacity:.8;color:#333;">
            This project is generated using <a href="https://saurabhdaware.github.io/pwainit">pwainit</a><br><br>
            <br><b>Useful Links</b><br>
            <a href="https://saurabhdaware.github.io/pwainit">Docs</a> <b>|</b> <a href="https://github.com/saurabhdaware/pwainit">Github</a> <b>|</b> <a href="https://medium.com/@saurabhdaware/turning-your-existing-website-to-pwa-using-pwainit-8c56c42abc4e">Medium Article</a>
            <br><br><b>The client generated following files</b><br>
            ${ this.ans.features.includes('Manifest')?`<a href="manifest.json">manifest.json</a>`:''} 
            ${ this.ans.features.includes('Service Worker')?`<b>|</b> <a href="sw.js">sw.js</a><br>`:''}
            ${this.ans.features.includes('Push API')?`<br><b>Confused about PUSH API? Read Docs for furthur setup <br><a href="https://saurabhdaware.github.io/pwainit/#setup">https://saurabhdaware.github.io/pwainit/#setup</a></b>
            <!-- Notification Permission Ask // Its better to have a banner with buttons in this case i am just lazy to write more HTML -->
            <br><br><b>Subscribe User for Push Service </b>
            <br><button onclick="subscribeUser();" style="background-color:#111;font-weight:bold;margin-top:10px;cursor:pointer;color:#fff;border:none;padding:10px 20px">Allow Notifications</button><br><small>Click and check the console</small>
            `:''}
        </div>
    </div>
    <script>
    ${this.serviceWorkerRegistrationCode()}
    ${this.pushApiCode()}
    </script>
    </body>
</html>
`
    }

    // This function is called when index.html is already present in the project.
    // This function would take the current content and will put PWA content into it without removing anything from the existing file.
    updatedIndexContent(html){
        let headContent = html.slice(html.indexOf('<head>'),html.indexOf('</head>'));
        return html.slice(0,html.indexOf('</head>')) +
`
    ${(this.ans.features.includes('Manifest') && !isPresentInHead(headContent,'rel','manifest'))?'<link rel="manifest" href="manifest.json">':''}
    ${!isPresentInHead(headContent,'name','theme-color')?`<meta name="theme-color" content="${this.ans.color}" />`:''}
`
+ html.slice(html.indexOf('</head>'), html.indexOf('</body>')) +
`
${this.ans.features.includes('Push API')?`
    <!-- Notification Permission Ask // Its better to have a banner with buttons -->
    <br><button onclick="subscribeUser();" style="background-color:#f30;color:#fff;border:none;padding:10px 20px;position:fixed;top:10px;left:10px;z-index:100000">Allow Push Notifications</button>
`:''}
<script>
${this.serviceWorkerRegistrationCode()}
${this.pushApiCode()}
</script>
`
+ html.slice(html.indexOf('</body>'))

    }


    manifest(){
        return `{
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
    ${this.ans.features.includes('Push API')?`"gcm_sender_id": "103953800507",`:''}
    "start_url":"index.html"
}
`
    }

    updatedServiceWorkerContent(js){
        if(!this.ans.features.includes("Push API")) return js;
        return js + this.swPushAPI
    }


    serviceWorker(){
        return `var CACHE_NAME = 'version-1'; // bump this version when you make changes.
// Put all your urls that you want to cache in this array
var urlsToCache = [
    'index.html',
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
${this.ans.features.includes('Push API')?this.swPushAPI:''}
`
    }

    serviceWorkerRegistrationCode(){
        if(!this.ans.features.includes('Service Worker')) return '';
        return `
    // ServiceWorker Registration
    if('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                ${this.ans.features.includes('Push API')?`
                // NOTIFICATION subscription
                registration.pushManager.getSubscription().then(function(sub) {
                    if (sub === null) {
                        // Update UI to ask user to register for Push
                        console.log('Not subscribed to push service!');
                    } else {
                        // We have a subscription, update the database
                        console.log('Subscription object: ', sub);
                    }
                });
                `:''}
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    `;
    }

    pushApiCode(){
        if(!this.ans.features.includes('Push API')) return '';
        return `
    
    // To get firebaseWebPushKey, Go to your firebase project, Settings -> Project settings -> Cloud Messaging -> Web Configuration -> Generate Key Pair and copy paste the keypair here

    // If you dont want to use firebase in your project follow the documentations given here -> https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#identifying_your_service_with_vapid_auth 
    const firbaseWebPushKey = 'Put Firebase Web Push Certificate Key Here'


    // NOTIFICATIONS
    // Ask permission
    if (Notification.permission === "granted") {
        displayNotification();
    } else if (Notification.permission === "blocked") {
        /* the user has previously denied push. Can't reprompt. */
    } else {
        /* show a prompt to the user */
        Notification.requestPermission(function(status) {
            console.log('Notification permission status:', status);
        });
    }

    // Call this function whenever you want to display notification (while the user is using application)
    // This way you can only show notification when user is on the web page
    function displayNotification() {
        navigator.serviceWorker.getRegistration().then(function(reg) {
            var options = {
                body: 'Welcome to the Progressive Web App!',
                icon: 'assets/logo-192.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                }
            };
            reg.showNotification('Hey There!', options);
        });
    }

    // Helper function to convert Base 64
    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\\-/g, '+')
            .replace(/_/g, '/')
        ;
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }


    // Subscribe user for push service, This returns us subscription object which can be used to send notifications from backend

    const applicationServerKey = urlB64ToUint8Array(firbaseWebPushKey);

    function subscribeUser() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function(reg) {
                reg.pushManager.subscribe({userVisibleOnly: true,applicationServerKey:applicationServerKey})
                    .then(function(sub) {
                        console.log(sub);
                        console.log('Endpoint URL: ', sub.endpoint);
                        console.log("post this data to your server and store in database, then use the endpoint to push notifications from server")
                        // Pass sub to Server and store it. You will be using these end points to push notifications from your server
                        // fetch('https://yourserver.com/store-notification-subscription',{body:sub})
                    }).catch(function(e) {
                        if (Notification.permission === 'denied') {
                            console.warn('Permission for notifications was denied');
                        } else {
                            console.warn("Please make sure you change firebaseWebPushKey variable with your firebase web push key in index.html.");
                            console.log("If you're using firebase Go to your firebase project, Settings -> Project settings -> Cloud Messaging -> Web Configuration -> Generate Key Pair and copy paste into the variable firebaseWebPushKey");
                            console.log("If not using firebase then follow https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#identifying_your_service_with_vapid_auth")
                            console.error('Unable to subscribe to push', e);
                        }
                    });
            }).catch(e => {
                console.error(e);
                console.warn("Please make sure you change firebaseWebPushKey variable with your firebase web push key in index.html.");
                console.log("If you're using firebase Go to your firebase project, Settings -> Project settings -> Cloud Messaging -> Web Configuration -> Generate Key Pair and copy paste into the variable firebaseWebPushKey");
                console.log("If not using firebase then follow https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#identifying_your_service_with_vapid_auth")
            })
        }
    }
    `
    }
    



}

module.exports = Content;