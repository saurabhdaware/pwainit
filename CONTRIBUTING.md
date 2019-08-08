## Setting up local development
- Fork the project using fork button in the top right corner
- Clone the project to your device using `git clone https://github.com/{yourUsername}/pwainit.git`
- Type `npm link` to install the content in your global directory. (Your directory will be linked to your global node folder which means if you change anything in the directory it will change inside the global directory as well)
- Type `pwainit <project_name>` to test your code. 


## Directory Structure
There are two important folders that you should care about `lib` and `bin`
```
- lib
    -> content.js // Contains code that is written inside file after pwainit
    -> logos.js // base64 of assets
- bin
    -> index.js // Main file 
```

## Contribution Guidelines
- If you're planning to implement a new feature I will recommend you to discuss with me before you start coding so you won't end up working on something that I don't want to implement. Create an Issue with proper name and content for discussion. 
- You can email me on [saurabhdaware99@gmail.com](saurabhdaware99@gmail.com) or message on twitter/[@saurabhcodes](https://twitter.com/saurabhcodes) if you need any help understanding the code.
- For Contributing to this project
  1. Fork project.
  2. Create a branch with the name of feature that you're working on (e.g. 'push-api').
  3. Once you're done coding create a merge request from your new branch to my master. (Read the Local Development section below for local setup guidelines)
  4. That's it from ya side! wait till i merge :D


## Coding Guidelines
- Please write comments wherever necessary.
- If you create a new file that exports various functions, put it inside `lib` folder
- Please write proper commit messages explaining your changes clearly.
