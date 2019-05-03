import * as http from 'http';
import * as express from 'express';
import { IMessage } from '../interfaces';
import * as WebSocket from 'ws';
import { isMessage } from '../typeguards';
import { ServerStatusMessages } from '../constants'

export class ChatAppServer {
    server: http.Server;
    app: Express.Application;

    constructor(portNumber: number) {
        // Configure the express server
        this.app = express();

        // Initialize the WebSocket server instance
        const server = http.createServer(this.app);
        this.server = server;
        const webSocketServer = new WebSocket.Server({ server });

        webSocketServer.on('connection', (ws: WebSocket) => {
            // Connection established. Let's add simple event:
            ws.on('message', (message: string) => {
                const msg: IMessage = JSON.parse(message);
                if (!isMessage(msg)) {
                    ws.send(ServerStatusMessages.invalidMessageReceived);
                    console.log(ServerStatusMessages.invalidMessageReceived);
                    return;
                }
                ws.send(`Hello ${msg.sender}.`);
                console.log(`${msg.time}\t${msg.sender} to ${msg.chatroom}: ${msg.content}`);
            });

            ws.on('close', (code, reason) => {
                console.log(`Client disconnected: ${code} ${reason}`);
            })

            // Upon establishing the connection, immediately send a success message to the incoming connection
            console.log(ServerStatusMessages.connectionEstablished);
            ws.send(ServerStatusMessages.connectionEstablished);
        });
    }

    Activate() {
        // Turn on the server
        let portToUse = process.env.PORT || 8999; // env var used by Heroku, ifndef then use defined port number
        this.server.listen(portToUse, () => {
            console.log(`Server is running on port ${portToUse}`);
        });
    }
}