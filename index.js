const logger = require('./common/logging');
const FetchAllPeopleWithDetails = require('./businessLayer/FetchAllPeopleWithDetails');

const peopleFinder = FetchAllPeopleWithDetails.createInstance();
peopleFinder.fetchAllPeopleAsync()
    .then(results => {
        logger.debug(`Results: ${JSON.stringify(results, null, ' ')}`);
    })
    .catch(err => {
        logger.error(`index.js: error: ${JSON.stringify(err)}`);
    });
