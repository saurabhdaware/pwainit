const {Separator} = require('inquirer');
const fse = require('fs-extra');

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


function getQuestions(projectName){
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
            default:'Hello World',
            when: () => projectName == '.'
        },
        {
            type: 'checkbox',
            message: 'Select Features to add ',
            name: 'features',
            choices: [
                new Separator(' .:: PWA FEATURES ::. '),
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
            ],
            validate:features => {
                let isValid = !(features.includes("Push API") && !features.includes("Service Worker"));
                return isValid || 'Err: You cannot initiate pushapi without a service worker. Try again with Service Worker selected';
            }

        },
        {
            type:'confirm',
            name:'installBackend',
            message:'Do you want to initate backend code of Push API?',
            default:true,
            when: (answers) => answers.features.includes('Push API'),
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

module.exports = {writeFile,getQuestions}