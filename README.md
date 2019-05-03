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

## Resources
* [Smart Websocket Client Chrome Extension](https://chrome.google.com/webstore/detail/smart-websocket-client/omalebghpgejjiaoknljcfmglgbpocdp)