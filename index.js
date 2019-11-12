const logger = require('./common/logging');
const FetchAllPeopleWithDetails = require('./businessLayer/FetchAllPeopleWithDetails');
const FindYoungestWithUSPhoneIterator = require('./businessLayer/FindYoungestWithUSPhoneIterator');

const args = require('minimist')(process.argv.slice(2));
const youngestCount = args['yougest'] || 5;

const peopleFinder = FetchAllPeopleWithDetails.createInstance();
const youngestWithUsNumberFinder =
    FindYoungestWithUSPhoneIterator.createInstance(youngestCount);

youngestWithUsNumberFinder.executeAsync(peopleFinder)
    .then(results => {
        console.log(`Youngest ${youngestCount} people with a valid US number: \r\n${JSON.stringify(results, null, ' ')}`);
    })
    .catch(err => {
        logger.error(`index.js: error: ${JSON.stringify(err)}`);
    });
