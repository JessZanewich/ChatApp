import { clientId, IFromServerChatMessage } from '../interfaces';
import * as wsWebSocket from 'ws';

export class Chatroom {
    private users: Map<clientId, wsWebSocket>;
    chatroomName: string;
    private latestMessageId: number;
    messageHistory: IFromServerChatMessage[];

    constructor(chatroomName: string) {
        this.chatroomName = chatroomName;
        this.users = new Map<clientId, wsWebSocket>();
        this.latestMessageId = 0;
        this.messageHistory = [];
    }

    addUser(clientId: clientId, ws: wsWebSocket) {
        console.log(`Adding user ${clientId} to chatroom ${this.chatroomName}`);
        this.users[clientId] = ws;
    }

    removeUser(clientId: clientId) {
        if(this.users.delete(clientId)) {
            console.log(`Removed client ${clientId} from chatroom ${this.chatroomName}`);
        }
        else {
            console.log(`Can't remove client ${clientId} from chatroom ${this.chatroomName}, they're not a member.`);
        }
    }

    getLastMessageId(): number {
        return this.latestMessageId;
    }

    broadcastMessage(msg: IFromServerChatMessage) {
        this.messageHistory.push(msg);

        // TODO add error handling for failed .send
        for (const clientId in this.users) {
            if (this.users.hasOwnProperty(clientId)) {
                const ws: wsWebSocket = this.users[clientId];
                ws.send(JSON.stringify(msg));
            }
        }
    }
}