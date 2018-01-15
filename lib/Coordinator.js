const _ = require('lodash');

const Recognizer = require('./Recognizer');
const {EventEmitter} = require('events');

const CODE_0 = '0'.charCodeAt(0);
const CODE_9 = '9'.charCodeAt(0);
const CODE_x = 'x'.charCodeAt(0);
const CODE_X = 'X'.charCodeAt(0);

const DEFAULT_OPTIONS = {
    glues: [45 /* minus */, 32 /* space */, 9 /* tab */]
};

class Coordinator extends EventEmitter {
    constructor(options = {}) {
        super();
        this.options = _.defaults({}, options, DEFAULT_OPTIONS);
        this.recognizers = new Set();
    }

    add(charCode) {
        // Check glues
        if (this.options.glues.indexOf(charCode) > -1) {
            return;
        }
        const digit = Coordinator.digit(charCode);
        if (digit < 0) {
            // Breaking char
            this.recognizers.clear();
            return;
        }
        // Valid digit
        if (Coordinator.isStartDigit(digit)) {
            this.recognizers.add(new Recognizer());
        }

        const result = [];
        for (let recognizer of this.recognizers) {
            recognizer.add(digit);

            // It's safe to remove set elements while iterating
            if (recognizer.isInvalid) {
                this.recognizers.delete(recognizer);
            } else if (recognizer.isComplete) {
                result.push(recognizer.isbn);
                this.recognizers.delete(recognizer);
            }
        }
        return result;
    }

    static digit(charCode) {
        if (charCode >= CODE_0 && charCode <= CODE_9) {
            return charCode - CODE_0;
        } else if (charCode === CODE_x || charCode === CODE_X) {
            return 10;
        } else {
            return -1;
        }
    }

    static isStartDigit(digit) {
        return digit >= 0 && digit <= 9;
    }
}

module.exports = Coordinator;