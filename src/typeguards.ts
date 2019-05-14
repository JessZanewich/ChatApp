import { IBaseMessage, IClientIntroductionMessage } from './interfaces'

export function isBaseMessage(obj: any): obj is IBaseMessage {

    return (
        obj.messageType !== undefined
        && obj.clientId !== undefined
    );
}

export function isClientIntroductionMessage(obj: any): obj is IClientIntroductionMessage {
    return (
        isBaseMessage(obj) as boolean
        && obj.clientId !== undefined
        && obj.index !== undefined
        && obj.index >= 0
    );
}