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
1. To debug the frontend, you can then use the Debug React in Chrome configuration in launch.json. Note that the port number in that config must match the port number that `npm start` launched the frontend on (defaults to 3000).
Note: if the server crashes in the debugger or is manually restarted that will break the WebSocket connection with the client, so for now you'll need to manually refresh the browser which will re-establish the connection.


## Order of operations when client and server connect
This is the ideal order of operations, we should really flow chart out all the possibilities so we know what cases we have to handle. State machine diagram would be helpful.

1. Server is instantiated
1. Server starts listening via `server.Activate()`
1. Server wires up all websocket event handlers (onMessage etc)
1. Client connects - (server gives a 10s window for the client to introduce before it shuts the connection down)
1. Client and Server each wire up their onMessage handlers
1. Client sends introduction message
1. Server receives introduction message and either:
    * If client already exists: server tell client "Here's a list of all the messages you missed while offline"
    * If client is new: server tells client "you are now a member of "general" chatroom"


when server receives a message from that client that identifies itself it exits the "waitingForIdentification" state and enters the "open" state

## Edge cases we may need to handle
|What if?|Sub-scenarios|Notes|
|-|-|-|
|What if a malicious client introduces itself as another client?| What if that client is currently online (easy to detect) vs current offline (harder)?|We should probably handle this via the eventual authentication system. Once they're authenticated, we will always know who they are.|

## Developer Resources
* [Material-UI](https://material-ui.com/)
    * [Google Material React Components](https://github.com/material-components/material-components-web-react)
    * [Textbox Demo](https://material-components.github.io/material-components-web-catalog/#/component/text-field?icons=&type=outlined)

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
=======
* [Smart Websocket Client Chrome Extension](https://chrome.google.com/webstore/detail/smart-websocket-client/omalebghpgejjiaoknljcfmglgbpocdp)
* [big-integer library](https://www.npmjs.com/package/big-integer)
