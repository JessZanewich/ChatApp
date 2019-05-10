export type IMessageType = "clientIntro" | "chatMessage" | "joinLeaveRequest" | "registration" | "baseMessage" | "serverChatMessage";

export interface IBaseMessage {
    messageType: IMessageType;
    clientId: number; // TODO think of how this is a bad idea and then do something else
}

export interface IClientMessage extends IBaseMessage {
    previousMessageId: bigint;
}

export interface IClientChatMessage extends IClientMessage {
    messageType: "chatMessage";
    content: string; // string for the message content. should be sanitized by client before sending
    chatroom: string; // GUID for chat room
}

// Should never be sent or received
export interface ITimestampedClientMessage extends IClientMessage {
    time: Date;
}

export interface IClientJoinLeaveRequest extends IBaseMessage {
    messageType: "joinLeaveRequest";
    isJoiningOrLeaving?: "joining" | "leaving";
    chatroom: string;   
}

// Sent by client immediately upon connecting to server
export interface IClientIntroductionMessage extends IClientMessage {
    messageType: "clientIntro";
}

// Response from the server to a client's first introduction message
export interface IServerRegistrationMessage extends IBaseMessage {
    messageType: "registration";
    chatrooms: string[];
}

// Broadcast by server to each client in a given chatroom
export interface IServerChatMessage extends IBaseMessage {
    messageType: "serverChatMessage";
    messageId: bigint;
    chatroom: string;
    serverTimestamp: Date;
    content: string;
}

export interface IServerBroadcastMissedMessages {
    missedMessages: IServerChatMessage[];
}