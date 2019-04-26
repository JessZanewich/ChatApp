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
import {Message} from '../interfaces';

async function main() {
    // Configure the express server
    const app = express();
    // app.use(bodyParser.json());

    // Initialize a simple http server
    const server = http.createServer(app);

    // Initialize the WebSocket server instance
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket) => {
        // Connection established. Let's add simple event:
        ws.on('message', (message: string) => {
            const msg: Message = JSON.parse(message);
            console.log('Received message: ' + msg + '\n');
            ws.send(msg.sender + ' says:\n' + msg.content);
        });

        // Upon establishing the connection, immediately send a success message to the incoming connection
        ws.send('Hi there, I\'ll be your chatroom server today.');
    });

    // Turn on the server
    let portToUse = process.env.PORT || 8999; // env var used by Heroku, ifndef then use defined port number
    server.listen(portToUse, () => {
        console.log(`Server is running on port ${portToUse}`);
    });
}

main();