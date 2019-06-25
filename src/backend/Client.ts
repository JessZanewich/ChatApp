import * as WebSocket from 'ws';
import { IBaseMessage } from '../interfaces';

export class Client {
    clientId: number;
    ws: WebSocket;
    chatrooms: string[];
    messageHistory: IBaseMessage[];

    constructor(ws: WebSocket) {
        this.ws = ws;
    }
}