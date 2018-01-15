const {assert} = require('chai');
const {Recognizer} = require.main.require('index');

describe('Recognizer', function() {
    it('should be in INVALID state adding invalid digit at first (less than 0)', function() {
        assert.ok((new Recognizer()).add(-1).isInvalid);
    });
    it('should be in INVALID state adding invalid digit at first (more than 9)', function() {
        assert.ok((new Recognizer()).add(10).isInvalid);
    });
    it('should be in INVALID state adding non-integer digit at first', function() {
        assert.ok((new Recognizer()).add('x').isInvalid);
    });
    it('should detect length after adding 3rd element (non 978 prefix)', function() {
        assert.equal(10, (new Recognizer()).add(1).add(2).add(3).length);
    });
    it('should detect length after adding 3rd element (978 prefix)', function() {
        assert.equal(13, (new Recognizer()).add(9).add(7).add(8).length);
    });
    it('should be in INVALID state after prefix by adding invalid digit (ISBN-10 and less than 0)', function() {
        assert.ok((new Recognizer()).add(1).add(2).add(3).add(-1).isInvalid);
    });
    it('should be in INVALID state after prefix by adding invalid digit (ISBN-10 and more than 9)', function() {
        assert.ok((new Recognizer()).add(1).add(2).add(3).add(10).isInvalid);
    });
    it('should be in INVALID state after prefix by adding invalid digit (ISBN-13 and less than 0)', function() {
        assert.ok((new Recognizer()).add(9).add(7).add(8).add(-1).isInvalid);
    });
    it('should be in INVALID state after prefix by adding invalid digit (ISBN-13 and more than 9)', function() {
        assert.ok((new Recognizer()).add(9).add(7).add(8).add(10).isInvalid);
    });
    it('should be in INVALID state failing on check digit (ISBN 10)', function() {
        assert.ok((new Recognizer()).add(1).add(4).add(6).add(6).add(5).add(7).add(9).add(9).add(8).add(5).isInvalid);
    });
    it('should be in COMPLETE state on valid ISBN 10 digits', function() {
        assert.ok((new Recognizer()).add(1).add(4).add(6).add(6).add(5).add(7).add(9).add(9).add(8).add(6).isComplete);
    });
    it('should be in INVALID state failing on check digit (ISBN 13)', function() {
        assert.ok((new Recognizer()).add(9).add(7).add(8).add(1).add(4).add(6).add(6).add(5).add(7).add(9).add(9).add(8).add(6).isInvalid);
    });
    it('should be in INVALID state failing on check digit (ISBN 13)', function() {
        assert.ok((new Recognizer()).add(9).add(7).add(8).add(1).add(4).add(6).add(6).add(5).add(7).add(9).add(9).add(8).add(9).isComplete);
    });
    it('should not change the state after determining calculation', function() {
        assert.ok((new Recognizer()).add(9).add(7).add(8).add(1).add(4).add(6).add(6).add(5).add(7).add(9).add(9).add(8).add(9).add(1).isComplete);
    });
});