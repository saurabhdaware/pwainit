const {Separator} = require('inquirer');
const fse = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');
const path = require('path');

// Functions
function writeFile(path,content,options = '',overwrite = false){
    if (fse.existsSync(path)) {
        if(path.slice(-10) == 'index.html'){
            // If the index file exists then we want to update it and add content to its existing content
            return Promise.resolve('update');
        }else if(path.slice(-3) == 'png'){
            console.log(`War: Skipping ${path}, Already exist.`)
            return;
        }else if(overwrite){
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

async function setupBackend(projectName,content){
    console.log(chalk.green(">>> ")+"Fetching required files..."+chalk.grey(" (This may take a while do not exit)\n"));
    let {stdout:gitOut,stderr:gitErr} = await exec(`git clone https://github.com/saurabhdaware/pwainit-node-pushapi.git ${projectName}/pushapi-backend`,{ encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    console.log(chalk.green("\n>>>") +" Initiating Push API backend setup");
    console.log(`\n.....Downloaded ${projectName}/pushapi-backend/\n`);


    console.log(chalk.green(">>>")+" Generating PushAPI Keys...");

    let {stdout,stderr} = await exec(`cd ${projectName}/pushapi-backend && npm install && ./node_modules/.bin/web-push generate-vapid-keys`,{ encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    
    let start = stdout.indexOf('Public Key');
    let k = stdout.slice(start,stdout.indexOf('==',start));
    k = k.replace(/=|\n/g,'').toString();

    const publicKeyIn = k.slice(11,k.indexOf('Private Key:')).trim();
    console.log(chalk.yellow("\n====================\n\n") + "Push API Public Vapid Key: " +chalk.grey(publicKeyIn));

    const privateKey = k.slice(k.indexOf('Private Key:')+12).trim();
    console.log("\nPush API Private Key: "+chalk.grey(`<< Written inside ${projectName}/pushapi-backend/.env file >>`) +chalk.yellow("\n\n====================\n"));
    
    writeFile(`${projectName}/pushapi-backend/.env`,content.dotEnv(publicKeyIn,privateKey));
    return publicKeyIn;
}

function getCreateQuestions(projectName){
    const questions = [{
            type:'confirm',
            name:'samedir',
            message:'Are you sure you want to init in same directory?',
            default:true,
            when: () => projectName == '.'
        },
        {
            type:'input',
            message:'You chose to not init in same directory\n try again with "pwainit <directory-name>"\n Press ENTER to exit',
            name:'closing',
            validate:() => {
                process.exit();
                return 'Press ctrl + z to close process'
            },
            when: (answers) => projectName == '.' && !answers.samedir
        },
        {
            type:'input',
            message: 'Name of your Application :',
            name:'appName',
            default:path.basename(process.cwd()).replace(/ /g,'-'),
            when: () => projectName == '.'
        },
        {
            type: 'checkbox',
            message: 'Select Features to add ',
            name: 'features',
            choices: [
                new Separator(` .:: PWA FEATURES ::. `),
                {
                    value:'sw',
                    name: 'Service Worker',
                    checked:true
                },
                {
                    value:'manifest',
                    name: 'Manifest',
                    checked:true
                },
                {
                    value:'pushapi',
                    name: 'Push API',
                    checked:false
                }
            ],
            validate:features => {
                const isValid = !(features.includes("pushapi") && !features.includes("sw"));
                return isValid || 'Err: You cannot initiate pushapi without a service worker. Try again with Service Worker selected';
            }

        },
        {
            type:'confirm',
            name:'installBackend',
            message:'Do you want to initate backend code of Push API?',
            default:true,
            when: (answers) => answers.features.includes('pushapi'),
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

    return questions;
}


function getAddQuestions(features){
    const hasFeature = (answers,featureToInclude) => (answers.features && answers.features.includes(featureToInclude)) || features.includes(featureToInclude);
    const questions = [
        {
            type:'input',
            message: 'Name of your Application :',
            name:'appName',
            default:path.basename(process.cwd()).replace(/ /g,'-')
        },
        {
            type: 'checkbox',
            message: 'Select Features to add ',
            name: 'features',
            choices: [
                new Separator(` .:: PWA FEATURES ::. `),
                {
                    value:'sw',
                    name: 'Service Worker',
                    checked:true
                },
                {
                    value:'manifest',
                    name: 'Manifest',
                    checked:true
                },
                {
                    value:'pushapi',
                    name: 'Push API',
                    checked:false
                }
            ],
            when: () => features.length == 0
        },
        {
            type:'confirm',
            name:'overwriteManifest',
            message:`file ${chalk.yellow('./manifest.json')} is already present. Do you want to overwrite the content?`,
            default:false,
            when: (answers) => hasFeature(answers,'manifest') && fse.existsSync('./manifest.json')
        },
        {
            type: 'input',
            name: 'swFileName',
            message: 'Enter name of your service worker file :',
            when: (answers) => hasFeature(answers,'pushapi') && !hasFeature(answers,'sw') && !fse.existsSync('./sw.js')
        },
        {
            type:'confirm',
            name:'overwriteSW',
            message:`file ${chalk.yellow('./sw.js')} is already present. Do you want to overwrite the content?`,
            default:false,
            when: (answers) => hasFeature(answers,'sw') && fse.existsSync('./sw.js')
        },
        {
            type:'confirm',
            name:'installBackend',
            message:'Do you want to initate backend code of Push API?',
            default:true,
            when: (answers) => hasFeature(answers,'pushapi'),
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
    ];
    return questions;
}

module.exports = {writeFile,getCreateQuestions,getAddQuestions ,setupBackend}