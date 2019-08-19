# NodeJS PushAPI Example

## Local Installation and Generating Vapid Keys
- `git clone https://github.com/saurabhdaware/pwainit-node-pushapi`
- `cd pwainit-node-pushapi`
- `npm install`
- `./node_modules/.bin/web-push generate-vapid-keys`
- Create a .env file in root directory and copy paste following content and replace above generated keys with the values below 
```
PUBLIC_VAPID_KEY = "<Your public vapid key>"
PRIVATE_VAPID_KEY = "<Your private vapid key>"
EMAIL = "<Your email address>"
```
- `node index.js`

## Client side setup
**Checkout [pwainit](https://github.com/saurabhdaware/pwainit) to initate the client side part in one command**

- You will have to use generated public vapid key on client side to generate subscription.
- If you have used [PWAinit](https://github.com/saurabhdaware/pwainit) to generate PWA you will have to Paste the key in `publicVapidKey` variable in index.html script tag.
- Go through the [Push API docs](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications) to understand the code properly.
- Make sure you have following code in your service worker file.

### sw.js
```js
// NOTIFICATIONS
// Please go through https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#push_api to understand this properly

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
```