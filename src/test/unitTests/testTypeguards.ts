// Test framework dependencies
// const should = require('chai').should();
const expect = require('chai').expect;
// const assert = require('chai').assert;
import * as chai from 'chai';
chai.use(require('chai-as-promised')); // Extension that defines the "eventually" keyword
chai.use(require('chai-string')); // Extension that provides the "string should contain" functionality

import { isBaseMessage } from '../../typeguards'
import { IBaseMessage } from '../../interfaces';

describe.skip('TypeGuards', () => {
    
    describe('isBaseMessage', () => {
        
        it("Is NOT when obj is totally different", () => {
            const notMsg = {
                stuff: "things"
            }
            expect(isBaseMessage(notMsg)).to.equal(false);
        });

        it('IBaseMessage IS', () => {
            const msg: IBaseMessage = {
                messageType: "baseMessage",
                clientId: 0
            }
            expect(isBaseMessage(msg)).to.equal(true);
        });
            
        it("Is, when obj has all required fields but also extra fields (that aren't defined on subtypes)", () => {
            let msg: IBaseMessage = {
                messageType: "baseMessage",
                clientId: 42,
            }
            msg["extraFieldThatIsNotDefinedOnTheClass"] = 'iAmAnExtraField';
            expect(isBaseMessage(msg)).to.equal(true);
        });
    });
});