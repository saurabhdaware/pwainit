#!/usr/bin/env node
'use strict'
const program = require('commander');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const Content = require('./content.js');

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
        if(ans.samedir == false){ // If user selects 'No' when asked for 'Are you sure you want to init in same directory'
            console.log("Terminating process.."); 
            return;
        }

        // Main stuff goes here
        let content = new Content(projectName,ans); // Content class comes from ./content.js
        fse.outputFile(`${projectName}/index.html`,content.index())
            .then(() => {
                console.log(`.....Created ${projectName}/index.html`)
            })
            .catch(console.error);

      
        fse.copy('./dist/assets/logo-192.png', `${projectName}/assets/logo-192.png`)
            .then(() => console.log(`.....Created ${projectName}/assets/logo-192.png`))
            .catch(console.error);
        
        fse.copy('./dist/assets/logo-512.png', `${projectName}/assets/logo-512.png`)
            .then(() => console.log(`.....Created ${projectName}/assets/logo-512.png`))
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