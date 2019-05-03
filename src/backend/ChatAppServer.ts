import * as http from 'http';
import * as express from 'express';
import { IMessage } from '../interfaces';
import * as WebSocket from 'ws';


export class ChatAppServer {
    server: http.Server;
    app: Express.Application;

    constructor(portNumber: number) {
        // Configure the express server
        this.app = express();
        // app.use(bodyParser.json());

        // Initialize the WebSocket server instance
        const server = http.createServer(this.app);
        this.server = server;
        const webSocketServer = new WebSocket.Server({ server });

        webSocketServer.on('connection', (ws: WebSocket) => {
            // Connection established. Let's add simple event:
            ws.on('message', (message: string) => {
                const msg: IMessage = JSON.parse(message);
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
    }

    Activate() {
        // Turn on the server
        let portToUse = process.env.PORT || 8999; // env var used by Heroku, ifndef then use defined port number
        this.server.listen(portToUse, () => {
            console.log(`Server is running on port ${portToUse}`);
        });
    }
}