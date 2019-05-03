import { IMessage } from './interfaces'

export function isMessage(obj: any): obj is IMessage {

    return (obj.content !== undefined
        && obj.sender !== undefined
        && obj.time !== undefined
        && obj.chatroom !== undefined);
}