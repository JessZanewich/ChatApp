export class NotImplementedError extends Error {
    constructor() {
        super();
        this.name = "Not implemented error";
        this.message = "This functionality has not been implemented";
    }
}

export class InvalidMessageError extends Error {
    constructor(invalidMessageType: string) {
        super();
        this.name = "Invalid message error",
        this.message = `Invalid message type: "${invalidMessageType}"`
    }
}