// Reqs for a basic server
import * as express from 'express';
import * as http from 'http';
// import * as bodyParser from 'body-parser';
import * as WebSocket from 'ws';
// import * as bcrypt from 'bcrypt-nodejs'; //! Don't need this yet
// import * as knex from 'knex'; //! Don't need this yet
// import { Request, Response } from 'express';
// import * as jsonfile from 'jsonfile';

// import {handleMessage} from './handlers';
import { Message } from '../interfaces';

async function main() {
    // Configure the express server
    const app = express();
    // app.use(bodyParser.json());

    // Initialize a simple http server
    const server = http.createServer(app);

    // Initialize the WebSocket server instance
    const webSocketServer = new WebSocket.Server({ server });

    webSocketServer.on('connection', (ws: WebSocket) => {
        // Connection established. Let's add simple event:
        ws.on('message', (message: string) => {
            const msg: Message = JSON.parse(message);
            ws.send(`Hello ${msg.sender}.`);
            console.log(`${msg.time}\t${msg.sender} to ${msg.chatroom}: ${msg.content}`);
        });

        ws.on('close', (code, reason) => {
            console.log(`Client disconnected: ${code} ${reason}`);
        })

        // Upon establishing the connection, immediately send a success message to the incoming connection
        const connectionEstablished = "Connection Established";
        console.log(connectionEstablished);
        ws.send(connectionEstablished);
    });

    // Turn on the server
    let portToUse = process.env.PORT || 8999; // env var used by Heroku, ifndef then use defined port number
    server.listen(portToUse, () => {
        console.log(`Server is running on port ${portToUse}`);
    });
}

main();