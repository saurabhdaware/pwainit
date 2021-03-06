function isPresentInHead(headHtml,property,value){
    return headHtml.includes(`${property}="${value}"`) || headHtml.includes(`${property}='${value}'`)
}

class Content{
    constructor(projectName,ans){
        this.projectName = (projectName == '.')?ans.appName:projectName;
        this.ans = ans;
        this.swPushAPI = `
// NOTIFICATIONS
// Please go through https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#push_api to understand this properly
// You can check https://github.com/saurabhdaware/pwainit-node-pushapi for server-side code

// Listens to push events from server.
self.addEventListener('push', function(e) {
    const dataFromServer = e.data.json(); // or your can add e.data.text() and pass text data from server

    var options = {
            body: dataFromServer.body,
            icon: 'assets/logo-512.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                // primaryKey: '2'
            },
            actions:[
                {action: 'github', title: 'Open Github Repo', icon: 'images/checkmark.png'},
                {action: 'close', title: 'Close notification', icon: 'images/xmark.png'},
            ]
    };
    e.waitUntil(
        self.registration.showNotification(dataFromServer.title, options)
    );
});

self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    }else if(action == 'github'){
        clients.openWindow('https://github.com/saurabhdaware/pwainit')
        notification.close();
    }else {
        console.log('..')
        notification.close();
    }
});`
    }
    
    // content of index.html
    index(publicKey = 'Your Public Vapid Key'){
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
        <meta name="theme-color" content="${this.ans.color || '#111111'}" />
        <title>${this.projectName}</title>
        ${this.ans.features.includes('manifest')?'<link rel="manifest" href="manifest.json">':''}
        <style>
            :root{
                --theme:${(this.ans.color && this.ans.color.toLowerCase() != '#ffffff')?this.ans.color:'#111111'};
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
            ${this.ans.features.includes('manifest')?`<a href="manifest.json">manifest.json</a>`:''} 
            ${this.ans.features.includes('sw')?`<b>|</b> <a href="sw.js">sw.js</a><br>`:''}
            ${this.ans.features.includes('pushapi')?`<br><b>Confused about setting PUSH API backend? Checkout example for furthur setup <br><a href="https://github.com/saurabhdaware/pwainit-node-pushapi">https://github.com/saurabhdaware/pwainit-node-pushapi</a></b>
            <!-- Notification Permission Ask // Its better to have a banner with buttons in this case i am just lazy to write more HTML -->
            <br><br><b>Subscribe User for Push Service </b>
            <br><button onclick="subscribeUser();" style="background-color:#111;font-weight:bold;margin-top:10px;cursor:pointer;color:#fff;border:none;padding:10px 20px">Allow Notifications</button><br><small>Click and check the console</small>
            `:''}
        </div>
    </div>
    <script>
    ${this.serviceWorkerRegistrationCode()}
    ${this.pushApiCode(publicKey)}
    </script>
    </body>
</html>
`
    }

    // This function is called when index.html is already present in the project.
    // This function would take the current content and will put PWA content into it without removing anything from the existing file.
    updatedIndexContent(html,publicKey = 'Your Public Vapid Key'){
        let headContent = html.slice(html.indexOf('<head>'),html.indexOf('</head>'));
        return html.slice(0,html.indexOf('</head>')) +
`    ${(this.ans.features.includes('manifest') && !isPresentInHead(headContent,'rel','manifest'))?'<link rel="manifest" href="manifest.json">\n':''}
    ${(!isPresentInHead(headContent,'name','theme-color') && this.ans.color)?`<meta name="theme-color" content="${this.ans.color}" />`:''}
`+ 
`    </head>
    <body>
`
+ `${this.ans.features.includes('pushapi')?`       <!-- Notification Permission Ask // Its better to have a banner with buttons -->
        <br><button onclick="subscribeUser();" style="background-color:#f30;cursor:pointer;color:#fff;border:none;padding:10px 20px;position:fixed;top:10px;left:10px;z-index:100000">Allow Push Notifications</button>
`:''}`
+ html.slice(html.indexOf('<body>') + 6,html.indexOf('</body>')) 
+ `<script>
${this.serviceWorkerRegistrationCode()}
${this.pushApiCode(publicKey)}
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
    ${this.ans.features.includes('pushapi')?`"gcm_sender_id": "103953800507",`:''}
    "start_url":"index.html"
}`
    }

    updatedServiceWorkerContent(js){
        if(!this.ans.features.includes("pushapi")) return js;
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
            if (response) return response;
            return fetch(event.request);
        })
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
${this.ans.features.includes('pushapi')?this.swPushAPI:''}
`
    }

    dotEnv(publicKey,privateKey){
        return `PUBLIC_VAPID_KEY = "${publicKey}"
PRIVATE_VAPID_KEY = "${privateKey}"
EMAIL = "youremail@something.com"`
    }

    serviceWorkerRegistrationCode(){
        if(!this.ans.features.includes('sw')) return '';
        return `
    // ServiceWorker Registration
    if('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                ${this.ans.features.includes('pushapi')?`
                // Push API read subscription
                registration.pushManager.getSubscription().then(function(sub) {
                    if (sub === null) {
                        // Update UI to ask user to register for Push
                        console.log('Not subscribed to push service!');
                    } else {
                        // We have a subscription, update the database
                        console.log('Subscription object: ', sub);
                        storeSubscription(sub);
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

    pushApiCode(publicKey){
        if(!this.ans.features.includes('pushapi')) return '';
        return `// PUSH API Subscription

    const publicVapidKey = '${publicKey}';  ${(publicKey == 'Your Public Vapid Key')?'// Checkout my github repository https://github.com/saurabhdaware/pwainit-node-pushapi for the backend setup code and generation of the vapid id.':''}

    function storeSubscription(sub){
        // Call your subscription API here. If you are using https://github.com/saurabhdaware/pwainit-node-pushapi then you can keep the code same here.
        fetch('http://localhost:3000/subscribe',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(sub)
        })
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.warn("Make sure you are running the pushapi-backend code... cd pushapi-backend and run node index.js"));
    }

    // Helper function to convert Base 64
    function urlB64ToUint8Array(base64String) {
        try{
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/-/g, '+')
                .replace(/_/g, '/');
                    const rawData = window.atob(base64);
                    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
        }catch(err){
            alert("Please add Vapid to publicVapidKey variable. Open console for more information");
            console.error("You have not set publicVapidKey. Open index.html and look for the line which defines publicVapidKey variable and paste your public vapid key in the value");
            console.log("If you dont have public vapid key yet checkout https://github.com/saurabhdaware/pwainit-node-pushapi for backend setup and generation of vapid keys");
            return err;
        }
    }

    // Subscribe user for push service, This returns us subscription object which can be used to send notifications from backend

    const applicationServerKey = urlB64ToUint8Array(publicVapidKey);

    function subscribeUser() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function(reg) {
                reg.pushManager.subscribe({userVisibleOnly: true,applicationServerKey:applicationServerKey})
                    .then(function(sub) {
                        console.log(sub);
                        console.log('Endpoint URL: ', sub.endpoint);
                        console.log("post this data to your server and store in database, then use the endpoint to push notifications from server")
                        
                        // Pass sub to Server and store it. You will be using it to push notifications from your server
                        storeSubscription(sub);

                    }).catch(function(e) {
                        if (Notification.permission === 'denied') {
                            alert("Notification permission was denied. Please click lock icon beside url bar and allow notifications");
                            console.warn('Permission for notifications was denied');
                        } else {
                            console.warn("Please make sure you change publicVapidKey variable with your public vapid key generated from your backend");
                            console.log("Checkout https://github.com/saurabhdaware/pwainit-node-pushapi for example code and generation of the public vapid key");
                            console.error('Unable to subscribe to push', e);
                        }
                    });
            }).catch(e => {
                console.warn("Please make sure you change publicVapidKey variable with your public vapid key generated from your backend");
                console.log("Checkout https://github.com/saurabhdaware/pwainit-node-pushapi for example code and generation of the public vapid key");
                console.error('Unable to subscribe to push', e);
            })
        }
    }`
    }
}

module.exports = Content;