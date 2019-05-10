import * as WebSocket from 'ws';
import { IBaseMessage, IClientIntroductionMessage, IServerChatMessage, IServerRegistrationMessage } from '../interfaces'
import { NotImplementedError } from '../errors';
import { MockClientIntroductionMessage } from '../constants';

type chatroomName = string;

export class MockClient {

    private ws: WebSocket;
    private messageHistory: IBaseMessage[];
    private clientId: bigint;
    private chatHistories: Map<chatroomName, IBaseMessage[]>; // Chatroom name, message list
    
    constructor(serverUrl: string) {
        this.clientId = null;
        this.chatHistories = new Map<chatroomName, IBaseMessage[]>();

        this.ws = new WebSocket(serverUrl);
        
        this.ws.on('open', (event) => {
            this.messageHistory.push(MockClientIntroductionMessage);
            this.ws.send(MockClientIntroductionMessage);
        });

        this.ws.on("message", (incomingMessage) => {
            const msg: IBaseMessage = incomingMessage.valueOf() as IBaseMessage;

            switch(msg.messageType) {
                case "chatMessage":
                    this.handleChatMessage(msg as IServerChatMessage);
                    break;
                case "registration":
                    this.handleServerRegistrationMessage(msg as IServerRegistrationMessage);
                case "joinLeaveRequest":
                case "clientIntro":
                default:
                    throw new Error(`Invalid message type received from server: ${msg.messageType}`);
           }
        });
    }

    isConnected() {
        return this.ws.readyState == this.ws.OPEN;
    }
    
    getMessageHistory(){
        return this.messageHistory;
    }

    handleChatMessage(msg: IServerChatMessage) {
        // Validate chatroom is one of the one's we're a member of
        if (!this.chatHistories.has(msg.chatroom)) {
            // I'm not a member of that chatroom. I must have just been added.
            this.chatHistories[msg.chatroom] = msg;
            return;
        }

        // Make sure this is the next one we expected to receive
        const previousMessageId = this.messageHistory[msg.chatroom].length;
        if (msg.messageId !== BigInt(previousMessageId + 1)) {
            this.askServerForMissingMessages(msg.chatroom, previousMessageId);
            return;
        }

        
    }

    // The server is (re)-assigning us a clientId
    handleServerRegistrationMessage(msg: IServerRegistrationMessage) {
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

    askServerForMissingMessages(chatroom: string, previousMessageId: bigint) {
        throw new NotImplementedError();
    }

}