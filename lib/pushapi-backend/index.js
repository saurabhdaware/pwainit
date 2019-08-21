require('dotenv').config()
const webpush = require('web-push');

const app = require('express')();
app.use(require('body-parser').json());

// TO generate vapid keys type './node_modules/.bin/web-push generate-vapid-keys' after 'npm install'
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// Replace with your email
webpush.setVapidDetails('mailto:'+process.env.EMAIL, publicVapidKey, privateVapidKey);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  

app.post('/subscribe', (req, res) => {
    const subscription = req.body; // You should be storing this in database so that you can send notifications later

    const payload = JSON.stringify({
        title: 'Title Comming from backend!', 
        body: "Body coming from backend!!"
    });

    webpush.sendNotification(subscription, payload)
        .then(() => {
            res.json({success:true})
        })
        .catch(error => {
            console.error(error.stack);
        });
});

app.listen(process.env.PORT || 3000, () => console.log(`Server ready to send notifications on http://localhost:${process.env.PORT || 3000}! :D`));