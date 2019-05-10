import { IBaseMessage, IClientIntroductionMessage } from './interfaces'

export function isMessage(obj: any): obj is IBaseMessage {

    return (
        obj.content !== undefined
        && obj.sender !== undefined
        && obj.time !== undefined
        && obj.chatroom !== undefined);
}

export function isClientIntroductionMessage(obj: any): obj is IClientIntroductionMessage {
    return (
        isMessage(obj) as boolean
        && obj.clientId !== undefined
        && obj.index !== undefined
        && obj.index >= 0
    );
}