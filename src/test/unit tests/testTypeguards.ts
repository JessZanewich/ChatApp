// Test framework dependencies
// const should = require('chai').should();
const expect = require('chai').expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
chai.use(require('chai-as-promised')); // Extension that defines the "eventually" keyword
chai.use(require('chai-string')); // Extension that provides the "string should contain" functionality

import { isMessage } from '../../typeguards'
import { IMessage } from '../../interfaces';

describe('TypeGuards', () => {
    
    describe('isMessage', () => {
        
        it("Is NOT when obj is totally different", () => {
            const notMsg = {
                stuff: "things"
            }
            expect(isMessage(notMsg)).to.equal(false);
        });

        it('Is, when obj is explicitly of interface type', () => {
            const msg: IMessage = {
                sender: "stuff",
                chatroom: "general",
                content: "would'nt you like to know",
                time: new Date()
            }
            expect(isMessage(msg)).to.equal(true);
        });

        it('Is, when obj matches interface implicitly', () => {
            const msg = {
                sender: "stuff",
                chatroom: "general",
                content: "would'nt you like to know",
                time: new Date()
            }
            expect(isMessage(msg)).to.equal(true);
        });
            
        it('Is NOT, when obj has all required fields but also extra fields', () => {
            const msg = {
                sender: "stuff",
                chatroom: "general",
                content: "would'nt you like to know",
                time: new Date(),
                extra: 'more'
            }
            expect(isMessage(msg)).to.equal(false);
        });
    });
});