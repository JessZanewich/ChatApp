import * as http from 'http';
import * as express from 'express';
import { IBaseMessage, IClientIntroductionMessage, IClientJoinLeaveRequest, IServerRegistrationMessage, IFromClientChatMessage, IFromServerChatMessage, clientId, chatroomName } from '../interfaces';
import * as wsWebSocket from 'ws';
import { isBaseMessage } from '../typeguards';
import { ServerStatusMessages, defaultChatroomName } from '../constants'
import { NotImplementedError, InvalidMessageError } from '../errors';
import { Client } from './Client';
import { Chatroom } from './Chatroom';

export class ChatAppServer {
    private server: http.Server;
    private app: Express.Application;
    private clients: Map<clientId, Client>;
    private chatrooms: Map<chatroomName, Chatroom>;

    numClients: number;
    
    constructor(portNumber: number) {
        // Configure the express server
        this.app = express();

        // Initialize the WebSocket server instance
        const server = http.createServer(this.app);
        this.server = server;
        const webSocketServer = new wsWebSocket.Server({ server });
        this.clients = new Map<clientId, Client>();
        this.numClients = 0;
        this.chatrooms = new Map<string, Chatroom>();
        this.chatrooms[defaultChatroomName] = new Chatroom(defaultChatroomName);
        
        webSocketServer.on('connection', this.handleConnection);
    }

    async activate() {
        // Turn on the server
        let portToUse = process.env.PORT || 8999; // env var used by Heroku, ifndef then use defined port number
        await this.server.listen(portToUse);
        console.log(`Server activated, now listening on port ${portToUse}`);
        
    }

    handleConnection(ws: wsWebSocket) {
        console.log(`Server: incoming connection!`);
        
        ws.on('close', (code, reason) => {
            // dissociate client ID and ws (by deleting the ws value associated with the clientId key in the map)
            console.log(`Client disconnected: ${code} reason = '${reason}'`);
        });

        // wait for client intro
        ws.on('message', (msg: IClientIntroductionMessage, ws: wsWebSocket) => {
            // TODO close any old connections with the same client ID 
            //      OR reject new connection and preserve old one
            // TODO add error flow that closes the connection, if null id e.g.
            
            let regMsg: IServerRegistrationMessage = {
                clientId: msg.clientId,
                chatrooms: Array.from(this.chatrooms.keys()), // For now, just subscribe them to all the chatrooms
                messageType: "registration"
            }

            if (msg.clientId == 0) {
                // Client doesn't have an ID so we must assign it one (which was already created at onConnection time)
                const thisClientId = this.numClients++;
                regMsg.clientId = thisClientId;
            }
            
            ws.send(regMsg);
            this.clients[msg.clientId] = new Client(ws);
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

    handleRawMessage = (rawMsg: wsWebSocket.Data, ws: wsWebSocket) => {
        const msg: IBaseMessage = rawMsg.valueOf() as IBaseMessage;

        if (msg.clientId == 0) {
            // new client, needs an ID assigned
        }

        // TODO add validation that the message type is actually what it claims to be.
        // TODO add handling of null fields - typeguards only handle undefined (i.e. structure)
        switch (msg.messageType) {
            case "chatMessage":
                this.handleChatMessage(msg as IFromClientChatMessage, ws);
                break;
            case "clientIntro":
                // TODO think of how we want to handle this.
                throw new Error("This client has already introduced itself");
            case "joinLeaveRequest":
                this.handleJoinLeaveRequest(msg as IClientJoinLeaveRequest);
                break;
            case "registration":
            case "baseMessage":
            case "serverChatMessage":
                throw new Error(`Invalid Message Type ${msg.messageType}`);
            default:
                throw new InvalidMessageError(msg.messageType);
        }

        if (!isBaseMessage(msg)) {
            ws.send(ServerStatusMessages.invalidMessageReceived);
            console.log(ServerStatusMessages.invalidMessageReceived);
            return;
        }
        ws.send(`Hello ${msg.clientId}.`);
        // console.log(`${msg.time}\t${msg.clientId} to ${msg.chatroom}: ${msg.content}`);
    }

    // TODO handle the case where the client impersonates someone else by making up the clientId (on a clientChatMessage)
    handleChatMessage(msg: IFromClientChatMessage, ws: wsWebSocket) {
        // For now we're just gunna echo the message back to the client, but as a IFromServerChatMessage
        this.chatrooms
        const echoMsg: IFromServerChatMessage = {
            messageType: "serverChatMessage",
            chatroom: msg.chatroom,
            clientId: msg.clientId,
            username: "Dummy Username",
            content: msg.content,
            messageId: this.chatrooms.get(msg.chatroom).getLastMessageId(),
            serverTimestamp: new Date()
        }
        ws.send(echoMsg);
    }
    // handleClientIntroMessage


    handleJoinLeaveRequest(msg: IClientJoinLeaveRequest) {
        throw new NotImplementedError();
    }

    getClientMessageHistory(clientId: number): IBaseMessage[] {
        // Look up the given client in the list and return the message history
        if (this.clients.has(clientId)) {
            let targetClient: Client = this.clients[clientId];
            return targetClient.messageHistory;
        }
        else {
            console.error(`Attempt was made to access nonexistent message history for client with clientId "${clientId}"`);
        }
    }
}