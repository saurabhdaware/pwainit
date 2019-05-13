#!/usr/bin/env node
'use strict'
const program = require('commander');
const fse = require('fs-extra');
const inquirer = require('inquirer');

let questions = [
    {
        type: 'checkbox',
        message: 'Select Features to add ',
        name: 'features',
        choices: [
        //   new inquirer.Separator(' = PWA FEATURES = '),
          {
            name: 'Service Worker',
            checked:true
          },
          {
            name: 'Manifest',
            checked:true
          }
        ]
    },
    {
        type:'input',
        message: 'Theme color of application (in #RRGGBB format) :',
        name:'color',
        default:'#0099ff',
        validate:function validateColor(color){
            return color.length == 7 && color.includes('#');
        }
    }
]

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
        <meta name="theme-color" content="${this.ans.color}" />
        <title>${this.projectName}</title>
        ${this.ans.features.includes('Manifest')?'<link rel="manifest" href="manifest.json">':''}
    </head>
    <body>
    <!-- YOUR HTML CONTENT GOES HERE -->

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

program
    .version('1.0.0')
    .usage('[options] [projectName]')
    .arguments('[projectName]')
    .action(createProject)
    .parse(process.argv)


// Functions
function createProject(projectName){
    if(!projectName){
        console.log("Err: Please enter project name (E.g 'pwainit coolproject' )");
        return;
    }
    if(projectName == '.'){
        questions = [
            {
                type:'confirm',
                name:'samedir',
                message:'Are you sure you want to init in same directory?',
                default:true,
                validate:function(value){
                    return value !== false;
                }
            },
            ...questions
        ]    
    }

    inquirer.prompt(questions).then((ans)=>{
        if(ans.samedir == false){
            console.log("Terminating process.."); 
            return;
        }

        // Main stuff goes here
        let content = new Content(projectName,ans);
        console.log(ans);
        fse.outputFile(`${projectName}/index.html`,content.index())
            .then(() => {
                console.log(`.....Created ${projectName}/index.html`)
            })
            .catch(console.error);

        if(ans.features.includes('Manifest')){
            fse.outputFile(`${projectName}/manifest.json`,content.manifest())
                .then(() => {
                    console.log(`.....Created ${projectName}/manifest.json`);
                })
                .catch(console.error);
        }

        if(ans.features.includes('Service Worker')){
            fse.outputFile(`${projectName}/sw.js`,content.serviceWorker())
                .then(() => {
                    console.log(`.....Created ${projectName}/sw.js`);
                })
                .catch(console.error);
        }

        
    })
}