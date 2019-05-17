const fse = require('fs-extra');

// THIS FILE IS LITERALLY JUST TO GIVE MYSELF A PRO DEVELOPER SATISFACTION OF TYPING 'NPM RUN BUILD'.

fse.copy('src', 'dist')
    .then(() => console.log("....Build success!"))
    .catch(console.error);