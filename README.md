# pwainit
Initiate your Progressive Web App Development with `npm i -g pwainit` 🎉

[![NPM Version](https://badge.fury.io/js/pwainit.svg?style=flat)](https://npmjs.org/package/pwainit)

[![https://nodei.co/npm/pwainit.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/pwainit.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/pwainit)

pwainit lets you intialize your PWA development process without writing basic service worker, manifest and index code.

Currently the module adds Service Workers and Manifest

## Usage
- `npm i -g pwainit`
- `pwainit <projectName>`  
- Select the features that you want in your PWA. 
- You can also update existing index.html by typing the name of existing folder
- To initialize into same directory use `pwainit .`


## What after pwainit?
- After completing above steps you will get files in following structure
```
<your project name>
    -> assets
        -> logo-192.png
        -> logo-512.png
    -> index.html
    -> sw.js
    -> manifest.json
```
- Service worker does not work over file:// protocol thus you will need http://localhost to test the service worker. You can do this using `npm i -g serve` and `serve <project name>`
- Open developer tools, Application -> Service Worker to see active Service Worker and Application -> Manifest to see manifest settings.
- Replace assets/logo-192.png and assets/logo-512.png with your website's logo of 192px and 512px respectively
- For furthur help in development of PWA you might consider reading [Manifest Docs](https://developers.google.com/web/fundamentals/web-app-manifest/) and [Service Worker Docs](https://developers.google.com/web/fundamentals/primers/service-workers/)



## Contribution 
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/saurabhdaware/pwainit/issues)

- This project is open for contributions you can pick up a task from [Issues](https://github.com/saurabhdaware/pwainit/issues) or Work on a new feature.
- Read [CONTRIBUTING.md](http://github.com/saurabhdaware/pwainit/blob/master/CONTRIBUTING.md) for complete guide of Contribution and Local Development.


## Screenshot
![command line screenshot](https://res.cloudinary.com/saurabhdaware/image/upload/v1557761681/npm/pwainit/pwainit.png)

