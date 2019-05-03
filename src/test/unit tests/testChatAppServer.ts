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

describe('Single Client Tests', () => {
    const portNumber = 8999;
    server: ChatAppServer;
    client: MockClient;

    before(() => {
        this.server = new ChatAppServer(portNumber);
        this.server.Activate();
        this.client = new MockClient(`ws://localhost:${portNumber}`);
    });

    it('Client Can Connect', () => {
        expect(this.client.isConnected()).to.equal(true);
    });

    it('Server recognizes when client has connected', () => {
        expect(this.server.numConnectedClients).to.equal(1);
    })

});

describe('Multi Client Tests', () => {
    before(() => {
        //Set up tests
    });

    it('does it all spectacularly', () => {
        expect()
    });
});