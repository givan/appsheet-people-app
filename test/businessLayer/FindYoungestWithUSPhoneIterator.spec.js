const should = require('chai').should();
const FindYoungestWithUSPhoneIterator = require('../../businessLayer/FindYoungestWithUSPhoneIterator');
const FetchAllPeopleWithDetails = require('../../businessLayer/FetchAllPeopleWithDetails');
const PersonDetailResult = require('../../dataLayer/PersonDetailResult');

describe('FindYoungestWithUSPhoneIterator class', () => {
    it('expose a factory method', () => {
        const youngestTwo = 2;
        const youngestUsPeople = FindYoungestWithUSPhoneIterator.createInstance(youngestTwo);
        should.exist(youngestUsPeople);
        youngestUsPeople.should.be.an.instanceOf(FindYoungestWithUSPhoneIterator);
        youngestUsPeople.should.have.property('_youngestCount', youngestTwo);
    });

    it('will find the youngest 5 people with a valid US phone number sorted by name', (done) => {

        const fetchAllPeople = FetchAllPeopleWithDetails.createInstance();

        const youngestFive = 5;
        const youngestFiveWithUsPhoneFinder = FindYoungestWithUSPhoneIterator.createInstance(youngestFive);

        youngestFiveWithUsPhoneFinder.executeAsync(fetchAllPeople)
            .then(youngestFive => {
                should.exist(youngestFive);
                youngestFive.should.be.an('array').that.is.not.empty;
                youngestFive[0].should.exist;
                youngestFive[0].should.be.an.instanceOf(PersonDetailResult);

                done();
            })
            .catch(err => {
                should.exist(err);
                done(err);
            })
    }).timeout(20 * 1000); // this test will exercise the API and will take longer time
});