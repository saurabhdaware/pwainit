
## Contribution Guidelines
- If you're planning to implement a new feature I will recommend you to discuss with me before you start coding so you won't end up working on something that I don't want to implement. Create an Issue with proper name and content for discussion. 
- You can email me on saurabhdaware99@gmail.com if you need any help understanding the code.
- For Contributing to this project
  1. Fork project.
  2. Create a branch with the name of feature that you're working on (e.g. 'push-api').
  3. Once you're done coding create a merge request from your new branch to my master. (Read the Local Development section below for local setup guidelines)
  4. Wait till I merge. If I take too long to respond please mail me about the pull request.


## Setting up local development
- Clone the project to your device using `git clone https://github.com/saurabhdaware/pwainit.git` (If you want to make changes and contribute please fork the project first and clone the forked copy)
- Use `npm run dev` or `npm run pwainit` instead of `pwainit` so you can type `npm run dev <project-name>` to test project.


## Building the project
- THIS IS NOT REALLY NEEDED. This is only for your inner satisfaction of typing `pwainit` instead of `npm run dev`.
- Use `npm run build` this will create a `dist` folder with same content as `src`.
- Run `npm link` this will put your package into your global directory.
- Now you can run `pwainit <project-name>` tadaa! there you go with your inner satisfaction 🎉.
- Use `npm unlink` once you're done with your satisfaction thingy to remove package from global.


## Coding Guidelines
- Please write comments wherever necessary.
- Make changes only in src folder. Changes in dist folder will be overwritten after new build.
- Please write proper commit messages explaining your changes clearly.
