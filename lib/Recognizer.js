const {AssertionError} = require('assert');

const CODE_0 = '0'.charCodeAt(0);

const INCOMPLETE    = 0;
const COMPLETE      = 1;
const INVALID       = 2;

class Recognizer {
    constructor() {
        this.buffer = Buffer.allocUnsafe(13);
        this.index = 0;
        this.length = 0;
        this.state = INCOMPLETE;
    }

    add(digit) {
        if (!this.isIncomplete) {
            return this;
        }
        if (!this.isValidDigit(digit)) {
            this.state = INVALID;
            return this;
        }

        this.calculateLength(digit);
        this.buffer.writeUInt8(digit, this.index++);
        if (this.index === this.length) {
            this.state = this.check();
        }
        return this;
    }

    isValidDigit(digit) {
        if (!Number.isInteger(digit) || digit < 0) {
            return false;
        }
        if ((this.length === 0) || (this.length === 13)) {
            return digit <= 9;
        } else {
            return (this.length === this.index - 1) ? (digit <= 10) : (digit <= 9);
        }
    }

    calculateLength(next) {
        if (this.index === 2) {
            this.length = (this.buffer[0] === 9 && this.buffer[1] === 7 && next === 8) ? 13 : 10;
        }
    }

    check() {
        if (this.length === 10) {
            const acc = {t:0, s:0};
            for (let i=0; i<10; i++) {
                acc.t += this.buffer[i];
                acc.s += acc.t;
            }
            return (acc.s % 11 === 0) ? COMPLETE : INVALID;
        } else if (this.length === 13) {
            const acc = {f:1, s:0};
            for (let i=0; i<13; i++) {
                acc.s += acc.f * this.buffer[i];
                acc.f = 4 - acc.f;
            }
            return (acc.s % 10 === 0) ? COMPLETE : INVALID;
        } else {
            return INVALID;
        }
    }

    get isbn() {
        if (this.length === 0) {
            throw new AssertionError('Invalid length');
        } else if (this.index !== this.length) {
            throw new AssertionError('Try to fetch isbn on invalid state');
        }
        const chars = [];
        for (let ix = 0; ix < this.length; ix++) {
            const b = this.buffer[ix];
            (b === 10) ? chars.push('x') : chars.push(String.fromCharCode(CODE_0 + b));
        }
        return chars.join('');
    }

    get isInvalid() {
        return this.state === INVALID;
    }

    get isComplete() {
        return this.state === COMPLETE;
    }

    get isIncomplete() {
        return this.state === INCOMPLETE;
    }
}

module.exports = Recognizer;