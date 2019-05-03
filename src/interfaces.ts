export interface IMessage {
    sender: string; // GUID for the user which sent the message
    time: Date; // ISO 8601 time string, e.g. "2019-04-14T00:21:31+00:00"
    content: string; // string for the message content. should be sanitized by client before sending
    chatroom: string; // GUID for chat room
}