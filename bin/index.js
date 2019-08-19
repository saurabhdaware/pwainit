#!/usr/bin/env node
'use strict'
const program = require('commander');
const configs = require('../package.json')
const Action = require('../lib/action.js')
const action = new Action();

// COMMANDS
program.version(configs.version)

program
    .command('create <projectName>')
    .description("Initiate a Progressive Web App")
    .action(action.createProject);

program
    .command('add [features...]')
    .alias('makepwa')
    .description("Turn existing site to PWA")
    .arguments('Features: manifest, sw, pushapi')
    .action(action.addFeature)

program    
    .usage('<command> [options]')
    .action(() => {
        console.log(chalk.red(">>>")+" Unknown command\n");
        console.log(`${chalk.yellow('pwainit create <projectName>')} to create project`);
        console.log(`${chalk.yellow('pwainit add')} to add PWA features into existing website\n`);
    })
      

program.option('-o, --overwrite',"overwrite files if exist.")
program.parse(process.argv)
    
process.on('beforeExit',action.exitMessageDisplay)