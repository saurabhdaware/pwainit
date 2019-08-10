#!/usr/bin/env node
'use strict'
const program = require('commander');
const configs = require('../package.json')
const fse = require('fs-extra');
const inquirer = require('inquirer');
const Content = require('../lib/content.js');
const logos = require('../lib/logos.js')
const {writeFile, getQuestions} = require('../lib/helper_functions.js');
const { execSync } = require('child_process');


// Main command line settings
program
    .version(configs.version)
    .option('-o, --overwrite',"Overwrite existing files by new files (May delete sw.js, manifest.json if already exists) (will not delete index.html).")
    .usage('[options] [projectName]')
    .arguments('[projectName]')
    .action(createProject)
    .parse(process.argv)

async function setupBackend(projectName,content){
    console.log(".:: Initiating Push API backend setup (This may take a while)::.");
    let stdout = execSync(`git clone https://github.com/saurabhdaware/pwainit-node-pushapi.git ${projectName}/pushapi-backend`,{ encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    console.log("Installing required packages...")
    let npmInstall = execSync(`cd ${projectName}/pushapi-backend && npm install && ./node_modules/.bin/web-push generate-vapid-keys`,{ encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }).toString();
    console.log("Setting up your keys...");
    let start = npmInstall.indexOf('Public Key');
    let k = npmInstall.slice(start,npmInstall.indexOf('==',start));
    k = k.replace(/=|\n/g,'').toString();

    let publicKeyIn = k.slice(11,k.indexOf('Private Key:')).trim();
    console.log("\nPush API Public Vapid Key: " +publicKeyIn);

    const privateKey = k.slice(k.indexOf('Private Key:')+12).trim();
    console.log("\nPush API Private Key: "+privateKey);

    writeFile(`${projectName}/pushapi-backend/.env`,content.dotEnv(publicKeyIn,privateKey));
    return publicKeyIn;
}


function createProject(projectName){
    if(!projectName){
        console.log("Err: Please enter project name (E.g 'pwainit coolproject' )");
        return;
    }

    inquirer.prompt(getQuestions(projectName)).then(async (ans)=>{
        if(ans.samedir == false){ // If user selects 'No' when asked for 'Are you sure you want to init in same directory'
            console.log("Terminating process..");
            return;
        }

        const content = new Content(projectName,ans); // Content class comes from ./lib/content.js
        
        // Main stuff goes here
        writeFile(`${projectName}/assets/logo-192.png`,logos.logo192, 'base64',program.overwrite);
        writeFile(`${projectName}/assets/logo-512.png`,logos.logo512, 'base64',program.overwrite);
    
        if(ans.features.includes('Manifest')){ 
            writeFile(`${projectName}/manifest.json`,content.manifest(),'',program.overwrite);
        }

        if(ans.features.includes('Service Worker')){
            writeFile(`${projectName}/sw.js`,content.serviceWorker(),'',program.overwrite);
        }

        let publicKey = '';
        
        if(ans.installBackend){
            publicKey = await setupBackend(projectName,content);
        }

        writeFile(`${projectName}/index.html`,content.index(publicKey?publicKey:'Your Public Vapid Key')).then((msg) => {
            if(msg == 'update'){
                fse.readFile(`${projectName}/index.html`,'utf8')
                    .then((html)=>{
                        return fse.outputFile(`${projectName}/index.html`,content.updatedIndexContent(html,publicKey?publicKey:'Your Public Vapid Key'));
                    })
                    .then(() => console.log(`.....Updated ${projectName}/index.html`))
            }
        })

    })
}