#!/usr/bin/env node
'use strict'
const program = require('commander');
const configs = require('../package.json')
const fse = require('fs-extra');
const inquirer = require('inquirer');
const Content = require('../lib/content.js');
const logos = require('../lib/logos.js')
const {writeFile, getQuestions, setupBackend} = require('../lib/helper_functions.js');
const chalk = require('chalk');

let isErr = false;

// Main command line settings
program
    .version(configs.version)
    .option('-o, --overwrite',"Overwrite existing files by new files (May delete sw.js, manifest.json if already exists) (will not delete index.html).")
    .usage('[options] [projectName]')
    .arguments('[projectName]')
    .action(createProject)
    .parse(process.argv)


function createProject(projectName){
    if(!projectName){
        isErr = true;
        console.log("Err: Please enter project name (E.g 'pwainit coolproject' )");
        return;
    }

    inquirer.prompt(getQuestions(projectName)).then(async (ans)=>{
        if(ans.samedir == false){ // If user selects 'No' when asked for 'Are you sure you want to init in same directory'
            isErr = true;
            console.log("Terminating process..");
            return;
        }

        const content = new Content(projectName,ans); // Content class comes from ./lib/content.js
        console.log("\n"+chalk.bold.blue(".::") + " Your Progressive Web App is getting ready "+chalk.bold.blue("::."));
        
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
            try{
                publicKey = await setupBackend(projectName,content);
            }catch(err){
                isErr = true;
                console.log(chalk.red("Error occured while setting backend"));
                console.log(chalk.bold.red("Make sure you are connected to internet"));
                console.log("\n\nError log:"+err+"\n");
                console.log(chalk.bold.green(">>>")+chalk.bold(" Initiating without backend"));
            }
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

process.on('beforeExit',(code) => {
    if(!isErr) console.log("\n"+chalk.green.bold(">>>")+chalk.bold(" Boom... Magic!! Your Progressive Web App is Ready 🚀\n"));
})