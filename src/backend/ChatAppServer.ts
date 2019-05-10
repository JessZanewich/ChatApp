import * as http from 'http';
import * as express from 'express';
import { IBaseMessage, IClientChatMessage, IClientIntroductionMessage, IClientJoinLeaveRequest, IServerRegistrationMessage } from '../interfaces';
import * as WebSocket from 'ws';
import { isMessage } from '../typeguards';
import { ServerStatusMessages } from '../constants'
import { NotImplementedError } from '../errors';
import { Client } from './Client';

type clientId = number;

export class ChatAppServer {
    private server: http.Server;
    private app: Express.Application;
    private clients: Map<clientId, Client>;
    numClients: number;
    
    constructor(portNumber: number) {
        // Configure the express server
        this.app = express();

        // Initialize the WebSocket server instance
        const server = http.createServer(this.app);
        this.server = server;
        const webSocketServer = new WebSocket.Server({ server });
        this.clientWebsockets = new Map<clientId, WebSocket>();
        this.numClients = 0;

        
        webSocketServer.on('connection', this.handleConnection);
    }

    /*
    array O(1) random access, O(n) insertion/removal
    sets, maps O(n) random acces, O(1) specific access, O(1) insertion/removal
    linked lists O(n) random access, O(1) push/pop
    */

    activate() {
        // Turn on the server
        let portToUse = process.env.PORT || 8999; // env var used by Heroku, ifndef then use defined port number
        this.server.listen(portToUse, () => {
            console.log(`Server is running on port ${portToUse}`);
        });
    }

    handleConnection(ws: WebSocket) {
        ws.on('close', (code, reason) => {
            // dissociate client ID and ws (by deleting the ws value associated with the clientId key in the map)
            console.log(`Client disconnected: ${code} reason = '${reason}'`);
        });

        // wait for client intro
        ws.on('message', (msg: IClientIntroductionMessage, ws: WebSocket) => {
            // TODO close any old connections with the same client ID 
            //      OR reject new connection and preserve old one
            // TODO add error flow that closes the connection, if null id e.g.
            
            let regMsg: IServerRegistrationMessage = {
                clientId: msg.clientId,
                chatrooms: this.,
                messageType: "registration"
            }

            if (msg.clientId == 0) {
                // Client doesn't have an ID so we must assign it one (which was already created at onConnection time)
                const thisClientId = this.numClients++;
                regMsg.clientId = thisClientId; 
            }
            
            ws.send(regMsg);
            this.clientWebsockets[msg.clientId] = ws;
            ws.on('message', this.handleRawMessage);
        });
        
        // check if client intro contained a non-zero client ID
            // if so generate a new one
            // if not, look it up
        // save this ws for later, associate it with the client ID now that we know it

        //! WRONG
        // const thisClientId = this.numClients++;
        // this.clientWebsockets[thisClientId] = ws;
    }

    handleRawMessage = (rawMsg: WebSocket.Data) => {
        const msg: IBaseMessage = rawMsg.valueOf() as IBaseMessage;

        if (msg.clientId == 0) {
            // new client, needs an ID assigned
        }

        // TODO add validation that the message type is actually what it claims to be.
        // TODO add handling of null fields - typeguards only handle undefined (i.e. structure)
        switch (msg.messageType) {
            case "chatMessage":
                this.handleChatMessage(msg as IClientChatMessage);
                break;
            case "clientIntro":
                this.handleClientIntroMessage(msg as IClientIntroductionMessage);
                // parse message
                // do appropriate server things
                // send message
                break;
            case "joinLeaveRequest":
                this.handleJoinLeaveRequest(msg as IClientJoinLeaveRequest);
                break;
            case "registration":
            case "baseMessage":
            case "serverChatMessage":
                throw new Error(`Invalid Message Type ${msg.messageType}`);
            default:
                throw new NotImplementedError()
        }

        if (!isMessage(msg)) {
            ws.send(ServerStatusMessages.invalidMessageReceived);
            console.log(ServerStatusMessages.invalidMessageReceived);
            return;
        }
        ws.send(`Hello ${msg.clientId}.`);
        // console.log(`${msg.time}\t${msg.clientId} to ${msg.chatroom}: ${msg.content}`);
    }

    // TODO handle the case where the client impersonates someone else by making up the clientId (on a clientChatMessage)
    handleChatMessage(msg: IClientChatMessage) {
        throw new NotImplementedError();
    }

    // handleClientIntroMessage

    handleJoinLeaveRequest(msg: IClientJoinLeaveRequest) {
        throw new NotImplementedError();
    }
}