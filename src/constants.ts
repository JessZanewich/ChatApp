import { IClientIntroductionMessage } from "./interfaces";

export const ServerStatusMessages = {
    invalidMessageReceived: "Message did not conform to expected JSON structure",
    connectionEstablished: "Connection Established"
}

export const MockClientIntroductionMessage: IClientIntroductionMessage = {
    clientId: 0,
    messageType: "clientIntro",
    previousMessageId: 0
}

export const defaultChatroomName = "general";