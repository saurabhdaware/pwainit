#!/usr/bin/env node
'use strict'
const program = require('commander');
const configs = require('../package.json')
const fse = require('fs-extra');
const inquirer = require('inquirer');
const Content = require('../lib/content.js');
const logos = require('../lib/logos.js')
    

let questions = [
    {
        type: 'checkbox',
        message: 'Select Features to add ',
        name: 'features',
        choices: [
          new inquirer.Separator(' .:: PWA FEATURES ::. '),
          {
            name: 'Service Worker',
            checked:true
          },
          {
            name: 'Manifest',
            checked:true
          },
          {
            name: 'Push API',
            checked:false
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


// Main command line settings
program
    .version(configs.version)
    .option('-o, --overwrite',"Overwrite existing files by new files (May delete sw.js, manifest.json if already exists) (will not delete index.html).")
    .usage('[options] [projectName]')
    .arguments('[projectName]')
    .action(createProject)
    .parse(process.argv)


// Functions

function writeFile(path,content,options){
    if (fse.existsSync(path)) {
        if(path.slice(-10) == 'index.html'){
            // If the index file exists then we want to update it and add content to its existing content
            return Promise.resolve('update');
        }else if(path.slice(-3) == 'png'){
            console.log(`War: Skipping ${path}, Already exist.`)
            return;
        }else if(program.overwrite){
            return fse.outputFile(path,content,options)
                .then(() => {
                    console.log(`.....Overwrote ${path}`)
                })
                .catch(console.error);
        }else{
            console.log(`War: Skipping ${path}, Already exist.`)
            return;        
        }
    }

    return fse.outputFile(path,content,options)
        .then(() => {
            console.log(`.....Created ${path}`)
        })
        .catch(console.error);
}



function createProject(projectName){
    if(!projectName){
        console.log("Err: Please enter project name (E.g 'pwainit coolproject' )");
        return;
    }

    if(projectName == '.'){
        questions.unshift({
            type:'confirm',
            name:'samedir',
            message:'Are you sure you want to init in same directory?',
            default:true
        }, 
        {
            type:'input',
            message: 'Name of your Application :',
            name:'appName',
            default:'Hello World'
        })
    }

    inquirer.prompt(questions).then((ans)=>{
        if(ans.samedir == false){ // If user selects 'No' when asked for 'Are you sure you want to init in same directory'
            console.log("Terminating process.."); 
            return;
        }

        if(ans.features.includes("Push API") && !ans.features.includes("Service Worker")){
            console.log("Err: You cannot initiate pushapi without a service worker. Try again with Service Worker selected");
            console.log("Terminating process..");
            return;
        }

        // if(ans.features.includes('Push API') && !ans.features.includes("Service Worker") && !fse.existsSync(`${projectName}/sw.js`)){
        //     console.log("Warning: Service Worker not found. Push API will not work properly without a service worker");
        // }

        let content = new Content(projectName,ans); // Content class comes from ./content.js
        
        // Main stuff goes here
        writeFile(`${projectName}/index.html`,content.index()).then((msg) => {
            if(msg == 'update'){
                fse.readFile(`${projectName}/index.html`,'utf8')
                    .then((html)=>{
                        return fse.outputFile(`${projectName}/index.html`,content.updatedIndexContent(html))
                    })
                    .then(() => console.log(`.....Updated ${projectName}/index.html`))
            }
        })

        writeFile(`${projectName}/assets/logo-192.png`,logos.logo192, 'base64');
        writeFile(`${projectName}/assets/logo-512.png`,logos.logo512, 'base64');
    
        if(ans.features.includes('Manifest')){ 
            writeFile(`${projectName}/manifest.json`,content.manifest());
        }

        if(ans.features.includes('Service Worker')){
            writeFile(`${projectName}/sw.js`,content.serviceWorker());
        }


    })
}