export type IMessageType = "clientIntro" | "chatMessage" | "joinLeaveRequest" | "registration" | "baseMessage" | "serverChatMessage";

export interface IBaseMessage {
    messageType: IMessageType;
    clientId: number;
}

export interface IFromClientMessage extends IBaseMessage {
    previousMessageId: number;
}

export interface IFromClientChatMessage extends IFromClientMessage {
    messageType: "chatMessage";
    content: string; // string for the message content. should be sanitized by client before sending
    chatroom: string; // GUID for chat room
}

export interface IClientJoinLeaveRequest extends IBaseMessage {
    messageType: "joinLeaveRequest";
    isJoiningOrLeaving?: "joining" | "leaving";
    chatroom: string;   
}

// Sent by client immediately upon connecting to server
export interface IClientIntroductionMessage extends IFromClientMessage {
    messageType: "clientIntro";
}

// Response from the server to a client's first introduction message
export interface IServerRegistrationMessage extends IBaseMessage {
    messageType: "registration";
    chatrooms: string[];
}

// Broadcast by server to each client in a given chatroom
export interface IFromServerChatMessage extends IBaseMessage {
    messageType: "serverChatMessage";
    messageId: number;
    chatroom: string;
    serverTimestamp: Date;
    content: string;
    username: string;
}

export interface IServerBroadcastMissedMessages {
    missedMessages: IFromServerChatMessage[];
}

export type clientId = number;
export type chatroomName = string;