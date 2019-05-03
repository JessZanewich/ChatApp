import * as WebSocket from 'ws';
import { IMessage } from '../interfaces'

export class MockClient {

    private ws: WebSocket;
    private messageHistory: IMessage[];
    
    constructor(serverUrl: string) {
        this.ws = new WebSocket(serverUrl);
        this.messageHistory = [];
        this.ws.on('open', (event) => {
            const msg = MockClientMessages.get("open");
            this.ws.send(msg);
            this.messageHistory.push(msg);
        });

        // this.ws.on("message", (incomingMessage) => {
        //    const msg: IMessage = incomingMessage.valueOf();
        // });
    }

    isConnected() {
        return this.ws.readyState == this.ws.OPEN;
    }
    
    getMessageHistory(){
        return this.messageHistory;
    }

}

export const MockClientMessages: Map<string, IMessage> = new Map([
    ["open",{
        sender: "MockClient",
        time: new Date(),
        chatroom: "general",
        content: "Hi"
    }],
    ["close", {
        sender: "MockClient",
        time: new Date(),
        chatroom: "general",
        content: "Bye"
    }]
]);