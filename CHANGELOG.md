# Release Notes

## 1.0.0

Initial Release

## 1.0.4
Basic features Manifest/SW/Index file added

## 1.0.5 
Minor updates in internal structure

## 2.0.0
- Logos added (assets/logo-192.png & assets/logo-512.png)
- Internal structure update

## 2.0.4
- Ability to turn existing site to PWA using `pwainit .` inside the directory

## 2.0.5 
Bug fixes

## 2.1.0
- Ignoring the PWA tags if already present
- Documentation Update

## 2.1.1
Bug fixes

## 2.1.2
Prompt to ask for username when initiated with pwainit .

## 2.1.3
Bug fixes

## 2.1.4
Push API Beta

## 2.1.5
Push API final release!

## 2.1.6
- Home page UI changed
- `-o or --overwrite` flag added to overwrites the existing sw.js and manifest.json file

## 2.1.8
Service worker does not exist warning removed

## 2.2.0
- Major changes in internal structure
- No more dependent on Firebase
- Backend code written and published in repository [https://github.com/saurabhdaware/pwainit-node-pushapi](https://github.com/saurabhdaware/pwainit-node-pushapi)
- Error handling for invalid vapid key and initiating push api without service worker
- Bug Fixes
- Documentation cleanup
- Unnecessary code removed from Push API

## 2.3.0 - 2.9.0 [Unpublished Internal Releases]
- Wrote major code for v3.0.0
- Added other commands like 'create', 'add'

## 3.0.0
- Changed `pwainit <projectName>` to `pwainit create <projectName>`
- Added command `pwainit add` to turn existing site to PWA
- `pwainit add` also allows you to add PushAPI to existing service worker
- Added unit tests (mocha/chai)
- Zero configurations are needed to run PushAPI code when initialized with the backend.
- Integrated [github.com/saurabhdaware/pwainit-node-pushapi](https://github.com/saurabhdaware/pwainit-node-pushapi) into the main project
- Generating publicVapidKeys when pushAPI backend is initialized.
- Minor bug fixes.
- New documentations [https://saurabhdaware.github.io/pwainit](https://saurabhdaware.github.io/pwainit)