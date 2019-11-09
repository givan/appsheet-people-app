const chai = require('chai');
const should = chai.should();

const PeopleClient = require('../../dataLayer/PeopleClient');
const PeopleListResult = require('../../dataLayer/PeopleListResult');
const PersonDetailResult = require('../../dataLayer/PersonDetailResult');

describe('PeopleClient suite', () => {

    it('will create a new PeopleClient instance using the factory', () => {
        const client = PeopleClient.createInstance();
        client.should.be.instanceOf(PeopleClient);
    });

    it('will call the /list endpoint without token and parse the results', (done) => {
        const peopleClient = PeopleClient.createInstance();
        peopleClient.list()
            .then(function(listResponse){
                should.exist(listResponse);
                listResponse.should.be.an.instanceOf(PeopleListResult);
                done();
            })
            .catch(err => {
                should.exist(err); // this is not expected case but it'll need to throw an error
                done(err);
            });
    });
    
    it('will call the /list endpoint with token and parse the results', (done) => {
        const peopleClient = PeopleClient.createInstance();

        peopleClient.list()
            .then(function(listResponse){
                should.exist(listResponse);
                listResponse.should.have.property('token')
                    .that.is.a('string')
                    .and.is.not.empty;

                peopleClient
                    .list(listResponse.token) // make a second call with the token from the first call response
                    .then(function(listResponseSecond){
                        should.exist(listResponseSecond);
                        listResponseSecond.should.be.an.instanceOf(PeopleListResult);

                        // now make sure the first list ids is not the same as the second
                        listResponseSecond.ids.should.not.include(listResponse.ids[0]); // at least 1 ids is not found in the second Ids array
                        listResponseSecond.token.should.not.be.equal(listResponse.token); // the tokens between the first and second calls must be different too

                        done();
                    })
                    .catch(err => {
                        should.exist(err);
                        done(err); // fail the test, not expected
                    });
            })
            .catch(err => {
                should.exist(err); 
                done(err); // fail the test, this is not expected
            });
    });

    it('will call the /details endpiont for a given person id and parse the results', (done) => {
        const peopleClient = PeopleClient.createInstance();

        peopleClient.list()
            .then(function(listResponse){
                should.exist(listResponse);
                listResponse.should.have.property('ids').that.is.not.empty;

                const testPersonId = listResponse.ids[0];
                peopleClient.detail(testPersonId)
                    .then((personDetail) => {
                        should.exist(personDetail);
                        personDetail.should.be.an.instanceOf(PersonDetailResult);

                        done();
                    })
                    .catch(err => {
                        should.exist(err);
                        done(err); // not expected to get an error so fail the test
                    })
            })
            .catch(function(err) {
                should.exist(err);
                done(err); // not expected to have an error, fail the test
            });
    });
})