const fse = require('fs-extra');
const inquirer = require('inquirer');
const program = require('commander');
const Content = require('./content');
const logos = require('./logos.js')
const {writeFile, getCreateQuestions, getAddQuestions , setupBackend} = require('./helper_functions.js');
const chalk = require('chalk');

let isErr = false;
let done = false;

class Action {
    constructor() {}

    // ACTIONS
    createProject(projectName) {

        if (!projectName) {
            isErr = true;
            console.log("Err: Please enter project name (E.g 'pwainit create coolproject' )");
            return;
        }

        if (projectName == '.') { // This makes 'pwainit create .' equivalent to 'pwainit add'
            addFeature([]);
            return;
        }

        if (fse.existsSync(projectName)) {
            console.log(chalk.red("\n>>>") + ` Err: Directory ${projectName} already exists.`);
            console.log(chalk.blue(">>>") + ` If you want to add PWA to existing website try ${chalk.yellow("pwainit add")} inside the project folder\n`);
            return;
        }

        inquirer.prompt(getCreateQuestions(projectName)).then(async (ans) => {
            if (ans.samedir == false) { // If user selects 'No' when asked for 'Are you sure you want to init in same directory'
                isErr = true;
                console.log("Terminating process..");
                return;
            }

            const content = new Content(projectName, ans); // Content class comes from ./lib/content.js
            console.log("\n" + chalk.bold.blue(".::") + " Your Progressive Web App is getting ready " + chalk.bold.blue("::."));

            // Main stuff goes here
            writeFile(`${projectName}/assets/logo-192.png`, logos.logo192, 'base64', program.overwrite);
            writeFile(`${projectName}/assets/logo-512.png`, logos.logo512, 'base64', program.overwrite);

            if (ans.features.includes('manifest')) {
                writeFile(`${projectName}/manifest.json`, content.manifest(), '', program.overwrite);
            }

            if (ans.features.includes('sw')) {
                writeFile(`${projectName}/sw.js`, content.serviceWorker(), '', program.overwrite);
            }

            let publicKey = '';

            if (ans.installBackend) {
                try {
                    publicKey = await setupBackend(projectName, content);
                } catch (err) {
                    isErr = true;
                    console.log(chalk.red("Error occured while setting backend"));
                    console.log(chalk.bold.red("Make sure you are connected to internet"));
                    console.log("\n\nError log:" + err + "\n");
                    console.log(chalk.bold.green(">>>") + chalk.bold(" Initiating without backend\n"));
                }
            }

            writeFile(`${projectName}/index.html`, content.index(publicKey ? publicKey : 'Your Public Vapid Key'))
                .then((msg) => {
                    done = true;
                    if (msg == 'update') {
                        fse.readFile(`${projectName}/index.html`, 'utf8')
                            .then((html) => {
                                return fse.outputFile(`${projectName}/index.html`, content.updatedIndexContent(html, publicKey ? publicKey : 'Your Public Vapid Key'));
                            })
                            .then(() => console.log(`.....Updated ${projectName}/index.html`))
                    }
                })

        })
    }

    /*
    @param {feature} : answers from inquirer prompts.
    FUNCTION addFeature(features):
        Check if features are valid
        Check if index.html exists.. it doesnt? return 'error' saying could not find index.html.. if you meant to create a PWA please use command 'pwainit create appname'
        Only manifest -> done
        Only service worker -> done
        Only PushAPI -> Find sw.js - exists? cool just append pushapi code and done : doesnt exist? ask user where it does
    */

    addFeature(features) {
        let projectName = '.';

        if (features.find(feature => feature !== 'sw' && feature !== 'manifest' && feature !== 'pushapi')) { // If feature has value anything other than pushapi manifest and sw then throw error
            console.log(`${chalk.red("Err:")} Possible values of features are 'manifest', 'pushapi, 'sw' other values are not acceptable`);
            return;
        }

        if (!fse.existsSync(`${projectName}/index.html`)) {
            console.log(`${chalk.red("Err:")} Could not find '${projectName}/index' file\n\nMake sure you are in your project directory and run the command again\n\nIf you meant to create a PWA please try again with command ${chalk.bold.green('pwainit create <projectName>')}\n`);
            return;
        }


        inquirer.prompt(getAddQuestions(features))
            .then(async (ans) => {
                ans.features = (features.length == 0) ? ans.features : features; // Set the features from command line arguments if exist or set them from the inquirer answers

                const content = new Content(projectName, ans);

                if (ans.features.includes('manifest')) {
                    if (ans.overwriteManifest == false) { // We have to check specifically false because the value be undefined when manifest is not present so just if(!ans.overwriteManifest) wont work
                        console.log(`War: Skipping './manifest.json'`);
                    } else {
                        // Create manifest.json and write the content and also add manifest link tag in html head
                        writeFile(`${projectName}/manifest.json`, content.manifest(), '', true);
                    }
                }

                if (ans.features.includes('sw')) {
                    if (ans.overwriteSW == false) {
                        console.log("War: Skipping './sw.js'");
                    } else {
                        // Create sw.js and write the content and also add service worker register code in index.html
                        writeFile(`${projectName}/sw.js`, content.serviceWorker(), '', true);
                    }
                }

                // When PushAPI is selected and Service worker is not selected, we check for existing sw.js if not found we ask user the name of file
                if (ans.features.includes('pushapi') && !ans.features.includes('sw')) {
                    const swFileName = ans.swFileName || 'sw.js'
                    const pathToSW = projectName + '/' + swFileName;

                    if (!fse.existsSync(pathToSW)) {
                        console.log(chalk.bold.red(`Err: Failed to write pushapi code in service worker.\nFile ${projectName}/${swFileName} not found.\nIf you dont have service worker please run : ${chalk.bold.white('"pwainit add sw pushapi"')} in your project`))
                    } else {
                        // Append pushAPI code in existing service worker.
                        fse.appendFile(pathToSW, content.swPushAPI, 'utf8')
                            .then(() => console.log(`.....Updated ${pathToSW}`));

                        console.log("Appending PushAPI code in service worker");
                    }
                }

                let publicKey = '';

                if (ans.installBackend) {
                    try {
                        publicKey = await setupBackend(projectName, content);
                    } catch (err) {
                        isErr = true;
                        console.log(chalk.red("Error occured while setting backend"));
                        console.log(chalk.bold.red("Make sure you are connected to internet"));
                        console.log("\n\nError log:" + err + "\n");
                        console.log(chalk.bold.green(">>>") + chalk.bold(" Initiating without backend\n"));
                    }
                }

                writeFile(`${projectName}/index.html`, content.index(publicKey ? publicKey : 'Your Public Vapid Key'))
                    .then((msg) => {
                        done = true;
                        if (msg == 'update') {
                            fse.readFile(`${projectName}/index.html`, 'utf8')
                                .then((html) => {
                                    return fse.outputFile(`${projectName}/index.html`, content.updatedIndexContent(html, publicKey ? publicKey : 'Your Public Vapid Key'));
                                })
                                .then(() => console.log(`.....Updated ${projectName}/index.html`))
                        }
                    })

            })
    }

    exitMessageDisplay(code){
        if(!isErr && done) console.log("\n"+chalk.green.bold(">>>")+chalk.bold(" Boom... Magic!! Your Progressive Web App is Ready 🚀\n"));
    }
}

module.exports = Action;