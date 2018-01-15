const Promise = require('bluebird');
const chai  = require('chai');
const cap = require('chai-as-promised');

chai.use(cap);
chai.should();

const {Coordinator} = require.main.require('index');

function extract(input) {
    return Promise.fromCallback((cb) => {
        const result = [];
        const coordinator = new Coordinator();
        coordinator.on('isbn', (isbn) => result.push(isbn));
        coordinator.on('finish', () => cb(null, result));
        for (let c of input) {
            coordinator.add(c.charCodeAt(0));
        }
        coordinator.emit('finish');
    });

}
describe('Coordinator', function() {
    it('should extract (emit) valid ISBN-10', function() {
        return extract('1466579986').should.become(['1466579986']);
    });
    it('should extract (emit) multiple isbns', function() {
        const text = `Library of Congress Control Number: 2006926168
            ISBN-13: 978-0-470-03746-1
            ISBN-10: 0-470-03746-6
            Manufactured in the United States of America
            10 9 8 7 6 5 4 3 2 1`;
        return extract(text).should.become(['9780470037461', '0470037466']);
    });
});