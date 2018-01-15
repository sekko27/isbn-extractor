const {assert} = require('chai');

const {Coordinator} = require.main.require('index');

function extract(input) {
    let result = [];
    const coordinator = new Coordinator();
    for (let c of input) {
        const r = coordinator.add(c.charCodeAt(0));
        if (r !== undefined) {
            result = result.concat(r);
        }
    }
    return result;
}
describe('Coordinator', function() {
    it('should extract (emit) valid ISBN-10', function() {
        assert.deepEqual(extract('1466579986'), ['1466579986']);
    });
    it('should extract (emit) multiple isbns', function() {
        const text = `Library of Congress Control Number: 2006926168
            ISBN-13: 978-0-470-03746-1
            ISBN-10: 0-470-03746-6
            Manufactured in the United States of America
            10 9 8 7 6 5 4 3 2 1`;
        return assert.deepEqual(extract(text), ['9780470037461', '0470037466']);
    });
});