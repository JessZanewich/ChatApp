// Test framework dependencies
// const should = require('chai').should();
const expect = require('chai').expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
chai.use(require('chai-as-promised')); // Extension that defines the "eventually" keyword
chai.use(require('chai-string')); // Extension that provides the "string should contain" functionality

// Testing dependencies/helpers/units under test
import { ChatAppServer } from '../../backend/ChatAppServer';
import { MockClient } from '../MockClient'
import * as WebSocket from 'ws';

describe('Single Client Tests', () => {
    const portNumber = 8999;
    let server: ChatAppServer;
    let client: MockClient;

    before(async () => {
        server = new ChatAppServer(portNumber);
        await server.activate();
        client = new MockClient(`ws://localhost:${portNumber}`);
    });

    it('Client Can Connect', () => {
        expect(client.getWebsocketState()).to.equal(WebSocket.OPEN);
    });

    it('Handshake proceeds correctly in ideal case', () => {
        const clientId = 1;
        const serverMessageHistoryForMockClient = server.getClientMessageHistory(clientId);
        
        expect(serverMessageHistoryForMockClient.length == 2);
        expect(serverMessageHistoryForMockClient[0].messageType == "clientIntro");
        expect(serverMessageHistoryForMockClient[1].messageType == "registration");
        
        expect(this.server.numConnectedClients).to.equal(1);
    });

});