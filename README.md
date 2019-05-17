# pwainit
Initiate your Progressive Web App Development with npm i -g pwainit 🎉

[![NPM Version](https://badge.fury.io/js/pwainit.svg?style=flat)](https://npmjs.org/package/pwainit)

[![https://nodei.co/npm/pwainit.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/pwainit.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/pwainit)

pwainit lets you intialize your PWA development process without writing basic service worker manifest and index code.

Currently the module adds Service Workers and Manifest

## Usage
- `npm i -g pwainit`
- `pwainit <projectName>`  
- Select the features that you want in your PWA. 


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
- This project is open for contributions you can pick up a task from [Issues](https://github.com/saurabhdaware/pwainit/issues) or Work on a new feature.
- If you're planning to implement a new feature I will recommend you to discuss with me before you start coding so you won't end up working on something that I don't want to implement. Create an Issue with proper name and content for discussion. 
- You can email me on saurabhdaware99@gmail.com if you need any help understanding the code.
- For Contributing to this project
  1. Fork project.
  2. Create a branch with the name of feature that you're working on (e.g. 'push-api').
  3. Once you're done coding create a merge request from your new branch to my master.
  4. Wait till I merge. If I take too long to respond please mail me about the pull request.



## Screenshot
![command line screenshot](https://res.cloudinary.com/saurabhdaware/image/upload/v1557761681/npm/pwainit/pwainit.png)

