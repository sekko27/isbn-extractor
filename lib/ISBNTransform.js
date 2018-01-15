const {Transform} = require('stream');
const Coordinator = require('./Coordinator');

class ISBNTransform extends Transform {
    constructor(coordinatorOptions = {}) {
        super({objectMode: true});
        this.coordinator = new Coordinator(coordinatorOptions);
    }

    _transform(chunk, encoding, cb) {
        for (let c of chunk) {
            const r = this.coordinator.add(c);
            if (r !== undefined) {
                this.push(r);
            }
        }
        cb(null);
    }
}

module.exports = ISBNTransform;