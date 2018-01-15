const _ = require('lodash');
const os = require('os');
const {ISBNTransform} = require('./index');

process.stdin.pipe(new ISBNTransform())
    .on('data', d => _.forEach(d, i => {
        process.stdout.write(i);
        process.stdout.write('\n');
    }))
    .on('finish', () => console.log(process.memoryUsage()));

console.log(os.totalmem());