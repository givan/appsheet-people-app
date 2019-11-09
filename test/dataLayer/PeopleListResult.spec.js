const should = require('chai').should();

const PeopleListResult = require('../../dataLayer/PeopleListResult');

describe('PeopleListResult class', () => {
    /**
     * Sample response from the https://appsheettest1.azurewebsites.net/sample/list endpoint
     */
    const response = {
        "result": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10
        ],
        "token": "a35b4"
    };

    it('will provide a factory method that parses the response from list endpoint', () => {
        const peopleRes = PeopleListResult.createFrom(response);
        should.exist(peopleRes);
        peopleRes.should.be.an.instanceOf(PeopleListResult);
    });
    it('will provide two properties that will return the people ids and the token', () => {
        const peopleRes = PeopleListResult.createFrom(response);
        should.exist(peopleRes);
        peopleRes.should.have.property('ids').that.is.an('array');
        peopleRes.should.have.property('token').that.is.an('string');
    });
});