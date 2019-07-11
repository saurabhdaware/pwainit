function isPresentInHead(headHtml,property,value){
    return headHtml.includes(`${property}="${value}"`) || headHtml.includes(`${property}='${value}'`)
}

class Content{
    constructor(projectName,ans){
        this.projectName = (projectName == '.')?ans.appName:projectName;
        this.ans = ans;
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
        
        ${this.ans.features.includes('Push API')?`
        <!-- Notification Permission Ask // Its better to have a banner with buttons in this case i am just lazy to write more HTML-->
        <br><br><b>Subscriber User for Push Service : </b>
        <br><button onclick="subscribeUser();" style="background-color:#f30;color:#fff;border:none;padding:10px 20px">Allow Notifications</button>
        `:''}
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
${this.ans.features.includes('Push API')?`
        
// NOTIFICATIONS

// Listens to push events from endpoints. Please go through https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#push_api to understand this properly
self.addEventListener('push', function(e) {
    const data = e.data.json();
    // e.data.json() holds the json sent from server. You can test this from developer tools -> Application -> Service Worker -> Push: []
    var options = {
      body: data.body,
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
      self.registration.showNotification(data.title, options)
    );
});
`:''}
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

    // To get firebaseWebPushKey, Go to your firebase project, Settings -> Project settings -> Cloud Messaging -> Web Configuration -> Generate Key Pair and copy paste the keypair here

    // If you dont want to use firebase in your project follow the documentations given here -> https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#identifying_your_service_with_vapid_auth 
    const firbaseWebPushKey = '< Firebase Web Push Certificate Key >'
    const applicationServerKey = urlB64ToUint8Array(firbaseWebPushKey);

    function subscribeUser() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(function(reg) {
                reg.pushManager.subscribe({userVisibleOnly: true,applicationServerKey:applicationServerKey})
                    .then(function(sub) {
                        console.log(sub);
                        console.log('Endpoint URL: ', sub.endpoint);
                    }).catch(function(e) {
                        if (Notification.permission === 'denied') {
                            console.warn('Permission for notifications was denied');
                        } else {
                            console.log("Please remember to change firebaseWebPushKey variable with your firebase web push key in index.html");
                            console.error('Unable to subscribe to push', e);
                            // console.log(e);
                        }
                    });
            })
        }
    }
    `
    }
    



}

module.exports = Content;