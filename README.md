# ChatApp

## How to run the back end (node.js server)
Before starting, make sure you have the Smart Websocket Client (SWC) extension installed in Chrome.

1. In VS Code select the "Debug Server with ts-node" configuration, hit F5 to run the server
1. In SWC, set the url to ws://localhost:8999 and click Connect
1. In SWC, paste the contents of sampleMessage.json and click Send

## How to run the Front End (React web client)
1. ctrl+shift+B to start running the TypeScript compiler in watch mode, which will auto rebuild every time you save a .ts file
1. `cd ./src/chat-app-frontend`
1. `npm start` will start the react development server: it launches a local server, hosts your webpage, opens the page in your default browser, and will auto-refresh in the browser every time you make changes to the frontend files. Also any compilation errors will be displayed in both the VSCode terminal and in the browser.

Note: if the server crashes in the debugger or is manually restarted that will break the WebSocket connection with the client, so for now you'll need to manually refresh the browser which will re-establish the connection.

## Resources
* [Material-UI](https://material-ui.com/)
    * [Google Material React Components](https://github.com/material-components/material-components-web-react)
    * [Textbox Demo](https://material-components.github.io/material-components-web-catalog/#/component/text-field?icons=&type=outlined)
* 

## How to rebase and merge
Here's the full git workflow we'll be using.

``` sh
# START OF NEW FEATURE
git checkout master # Make sure you start from master
git checkout -b myNewFeatureBranch
# (do some work)
git commit -m "I have written SOLID code"

# FEATURE IS READY FOR REVIEW
git push -u origin myNewFeatureBranch # Push your local branch to github for the first time, using the same name as you gave the local branch

# (now people code review you)

# CODE REVIEWERS MADE SUGGESTIONS
git checkout myNewFeatureBranch
# (address their changes)
git commit -m "Guys, I fixed it"
git push

# FEATURE IS DONE AND REVIEWERS APPROVE. TIME TO SHARE IT WITH OTHERS
git checkout master # Switch to master branch from wherever you were
git pull # Pull to make sure you have the latest changes
# Now you can switch to your feature branch and rebase master into it
git checkout myNewFeatureBranch # This is where you've been working.
git rebase master # This will force you to merge every commit interactively. Please use VS Code to do the merging.
git checkout master # Switch back to the master branch
git merge --no-ff myNewFeatureBranch # Merge the now-up-to-date myNewFeatureBranch into master without fast-forward
```
> NOTE: It's very important that you NEVER work simultaneously with another dev on the same feature branch. If you need to collab, just have one of you do a live code share session through VS Code so that only one person actually has a local copy of the working branch.