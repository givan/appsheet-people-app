const logger = require('../common/logging');
const PeopleClient = require('../dataLayer/PeopleClient');
const PeopleListResult = require('../dataLayer/PeopleListResult');
const PeopleDetailResult = require('../dataLayer/PersonDetailResult');

require('../PromiseAllSettledPolyfill');

/**
 * Business entity which knows how to fetch all people with their detail data avaiable by reading through the list API and then fetching concurrently all person details
 */
class FetchAllPeopleWithDetails {
    /**
     * Factory method knowing how to construct a valid instance of this class
     */
    static createInstance() {
        const peopleClient = PeopleClient.createInstance();
        return new FetchAllPeopleWithDetails(logger, peopleClient);
    }

    /**
     * Constructs a new business layer object for fetching all people along with their details and keeps it into memory
     * @param {winstin} logger The shared winston logger for the whole app
     * @param {PeopleClient} peopleClient The People client encapsulating the People API
     */
    constructor(logger, peopleClient) {
        if (typeof (logger) !== 'object') {
            throw new Error('logger must be a valid winston library instance');
        }
        if (!logger || !(peopleClient instanceof PeopleClient)) {
            throw new Error('peopleClient must be a valid instance of PeopleClient class');
        }

        this._logger = logger;
        this._peopleClient = peopleClient;
    }

    /**
     * Reads the current set of people details based on the current position in the people iterator (as identified by the token param). 
     * The function returns a promise that is resolved when the current batch of people is read with all of its details.
     * @param {string} token Optional. The token to identify the current position in the People iterator.
     */
    fetchPeopleWithDetails(token) {
        return new Promise((resolve, reject) => {
            this._peopleClient.list(token)
                .then(listDetails => {
                    if (!listDetails || !(listDetails instanceof PeopleListResult)) {
                        return reject(new Error('PeopleClient.list must return an valid PeopleListResult instance from the promise'));
                    }

                    // for all found people ids, go find their details
                    // make parallel calls at the same time for fetching the details
                    let personDetailPromises = [];
                    for (const personId of listDetails.ids) {
                        personDetailPromises.push(this._peopleClient.detail(personId));
                    }

                    // this will wait for all person detail calls to success. allSettled() will run through all
                    // promises and the ones failed will be resolved with status "rejected"
                    Promise.allSettled(personDetailPromises)
                        .then((personDetails) => {

                            // only retrieve the resolved promise results which were fulfilled (not the rejected ones)
                            const peopleDetailsArray =
                                personDetails
                                    .filter(item => item.status === 'fulfilled')
                                    .map(item => item.value);

                            resolve({
                                token: listDetails.token, // return the next token from the list response
                                people: peopleDetailsArray // return the PersonDetails from all detail calls
                            });
                        })
                        .catch(err => {
                            this._logger.error(`Failed fetching person details(token=${token}): ${JSON.stringify(err)}`);
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    /**
     * Asyng generator to go fetch the user ids first and then to concurrently fire up parallel calls to the details API to fetch the detail for each batch of ids returned by the /list endpoint
     * @param {number} maxIteratorDepth The max number of iterator calls to make to fetch all people ids. Defaults to 100.
     */
    async * fetchAllPeopleIter(maxIteratorDepth = 100) {
        this._logger.info(`Starting an iterator for all people details with depth: ${maxIteratorDepth}`);

        let currentFetch = 0;
        let token = null;
        while (currentFetch < maxIteratorDepth) {
            try {
                this._logger.info(
                    `About to call fetchPeopleWithDetails(${token}, ${currentFetch})`
                );

                const peopleWithDetails = await this.fetchPeopleWithDetails(token);

                // yield store all the people found in this batch one by one
                // so we can hook up other generators to do more work on these entities
                for (let personDetail of peopleWithDetails.people) {
                    yield personDetail;
                }

                // if we find a new token in the response, we'll continue reading the next batch
                // else we'll stop the current iteration
                if (peopleWithDetails.token) {
                    token = peopleWithDetails.token; // update the newly generated token so it'll be used on next iteration
                    currentFetch++;
                } else {
                    break; // there is no token found for next iteration so we're leaving
                }
            }
            catch (err) {
                // log and swallow the error
                this._logger.error(`fetchAllPeopleIter(): error: ${err}`);
                break;
            }
        }
    }

    /**
     * Fetches all people from using a function generator that calls the People client to fetch all the people batches with their details
     */
    async fetchAllPeopleAsync() {
        return new Promise(async (resolve, reject) => {

            let fetchedPeople = []; // accumulates all people records read so far

            for await (let personDetail of this.fetchAllPeopleIter()) {
                fetchedPeople.push(personDetail);
            }

            resolve(fetchedPeople);
        });
    }
}

module.exports = FetchAllPeopleWithDetails;