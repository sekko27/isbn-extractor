const _ = require('lodash');
const {assert} = require('chai');
const str = require('string-to-stream');
const {ISBNTransform} = require.main.require('index');

describe('ISBNTransform', function() {
    it('should extract isbn codes', function(cb) {

        const transform = new ISBNTransform();
        let result = [];
        str(`Library of Congress Control Number: 2006926168
            ISBN-13: 978-0-470-03746-1
            ISBN-10: 0-470-03746-6
            Manufactured in the United States of America
            10 9 8 7 6 5 4 3 2 1`)
                .pipe(transform)
                .on('data', r => result = result.concat(r))
                .on('end', () => {
                    assert.deepEqual(['0470037466'], _.uniq(result));
                    cb();
                });
    });
});