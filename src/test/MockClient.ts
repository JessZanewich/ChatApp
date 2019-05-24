import * as WebSocket from 'ws';
import { IBaseMessage, IFromServerChatMessage, IServerRegistrationMessage } from '../interfaces'
import { NotImplementedError } from '../errors';
import { MockClientIntroductionMessage } from '../constants';

type chatroomName = string;
type ClientHandshakeState = "start" | "sentIntro" | "receivedIntroResponse" | "connected";

export class MockClient {

    private ws: WebSocket;
    // Stores sequential record of every message sent and received
    private messageHistory: IBaseMessage[];
    private clientId: number;
    // Stores record of CHAT messages sent/received in each chatroom separately
    private chatHistories: Map<chatroomName, IBaseMessage[]>; // Chatroom name, message list
    private state: ClientHandshakeState;
    private chatrooms: string[];
    
    constructor(serverUrl: string) {
        this.clientId = null;
        this.chatrooms = [];
        this.chatHistories = new Map<chatroomName, IBaseMessage[]>();
        this.ws = new WebSocket(serverUrl);
        this.messageHistory = [];
        this.ws.on('open', (event) => {
            console.log(`MockClient websocket is open`);
            this.ws.on("message", this.handleMessage);
            this.introduceMyselfToServer();
        });

        this.state = "start";
    }

    handleMessage = (ws: WebSocket, incomingMessage) => {
        const msg: IBaseMessage = incomingMessage.valueOf() as IBaseMessage;
        
        switch (this.state) {
            case "start":
                console.log(`MockClient ignoring message in "${this.state}" state`);
                break;
            case "sentIntro":
                this.handleIntroMessageResponse(msg as IServerRegistrationMessage);
            case "receivedIntroResponse":
                this.handleIntroMessageResponse
            case "connected":
                this.handleChatMessage(msg as IFromServerChatMessage);
                break;
        }

        switch (msg.messageType) {
            case "chatMessage":
                this.handleChatMessage(msg as IFromServerChatMessage);
                break;
            case "registration":
                this.handleIntroMessageResponse(msg as IServerRegistrationMessage);
            case "joinLeaveRequest":
            case "clientIntro":
            default:
                throw new Error(`Invalid message type received from server: ${msg.messageType}`);
        }
    }

    introduceMyselfToServer() {
        console.log(`MockClient introducing itself to server`);
        this.messageHistory.push(MockClientIntroductionMessage);
        this.ws.send(MockClientIntroductionMessage);
        this.state = "sentIntro";
    }

    getWebsocketState() {
        return this.ws.readyState;
    }
    
    getMessageHistory(){
        return this.messageHistory;
    }

    getClientId() {
        return this.clientId;
    }

    setClientId(newId: number) {
        this.clientId = newId;
    }

    getChatrooms() {
        return this.chatrooms;
    }

    handleChatMessage(msg: IFromServerChatMessage) {
        // Validate chatroom is one of the one's we're a member of
        if (!this.chatHistories.has(msg.chatroom)) {
            // I'm not a member of that chatroom. I must have just been added.
            this.chatHistories[msg.chatroom] = msg;
            return;
        }

        // Make sure this is the next one we expected to receive
        const previousMessageId = this.messageHistory[msg.chatroom].length;
        if (msg.messageId !== previousMessageId + 1) {
            this.askServerForMissingMessages(msg.chatroom, previousMessageId);
            return;
        }
    }

    // The server is (re)-assigning us a clientId
    handleIntroMessageResponse(msg: IServerRegistrationMessage) {
        this.clientId = msg.clientId;
        if (msg.chatrooms.length > 0) {
            // The server is also adding us to new chatroom(s)
            for (const chatroom of msg.chatrooms) {
                if (!this.chatHistories.has(chatroom)) {
                    this.chatHistories[chatroom] = [];
                }
            }
        }
    }

    askServerForMissingMessages(chatroom: string, previousMessageId: number) {
        throw new NotImplementedError();
    }

    

}