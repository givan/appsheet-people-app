const should = require('chai').should();
const FetchAllPeopleWithDetails = require('../../businessLayer/FetchAllPeopleWithDetails');
const PeopleDetailResult = require('../../dataLayer/PersonDetailResult');

describe('FetchAllPeopleWithDetails class', () => {
    it('will expose a factory method', () => {
        const findAllPplBO = FetchAllPeopleWithDetails.createInstance();
        should.exist(findAllPplBO);
        findAllPplBO.should.be.an.instanceOf(FetchAllPeopleWithDetails);
    });

    it('will expose a method for reading the first batch of people along with their metadata', (done) => {
        const findAllPplBO = FetchAllPeopleWithDetails.createInstance();

        findAllPplBO.fetchPeopleWithDetails(null)
            .then((peopleDetails) => {
                should.exist(peopleDetails);

                peopleDetails.should.be.an('object');
                peopleDetails.should.have.property('token').that.is.a('string');
                peopleDetails.should.have.property('people').that.is.an('array').and.is.not.empty;

                peopleDetails.people[0].should.be.an.instanceOf(PeopleDetailResult);

                done();
            })
            .catch(err => {
                should.exist(err);
                done(err); // not expecting errors at for this test
            });
    }).timeout(5000);  // set the timeout to 5 secs since we're calling multiple APIs

    it('will fetch all people with details', (done) => {
        const findAllPplBO = FetchAllPeopleWithDetails.createInstance();

        findAllPplBO.fetchAllPeopleAsync()
            .then(peopleDetails => {
                should.exist(peopleDetails);
                
                peopleDetails.should.be.an('array').that.is.not.empty;
                peopleDetails[0].should.be.an.instanceOf(PeopleDetailResult);

                done();
            })
            .catch(err => {
                should.exist(err);
                done(err); // not expected to have an error here hence failing the test
            }) 
    }).timeout(15000); // set the timeout to 15 secs since this will be making many API calls
});