const logger = require('../common/logging');
const FetchAllPeopleWithDetails = require('./FetchAllPeopleWithDetails');

/**
 * Knows how to retrieve the youngest X persons with a valid US phone number
 */
class FindYoungestWithUSPhoneIterator {
    static createInstance(youngestCount = 5) {
        return new FindYoungestWithUSPhoneIterator(logger, youngestCount);
    }

    /**
     * It'll use the FetchAllPeopleWithDetails iterator to sort all people by age, then retrieve the ones who have US phone number and eventually return only the youngest X number of people details
     * @param {winston} logger Winston logger object
     * @param {number} youngestCount How many youngest people to retrieve
     */
    constructor(logger, youngestCount) {
        if (logger == null || typeof (logger) !== 'object') throw new Error('Must specify a valid winston logger object');
        if (typeof (youngestCount) !== 'number' || youngestCount < 1) throw new Error('youngestCount must be a positive number');

        this._logger = logger;
        this._youngestCount = youngestCount;
    }

    /**
     * Tests if the input phone number comforms to the US phone number format (10 digits). Returns true or false.
     * @param {string} phoneNumber The input phone number string to test
     */
    isUSPhoneNumber(phoneNumber) {
        // remove anything that is not a digit
        const normalizedPhone = phoneNumber.replace(/[^\d]/g, "");

        // a valid US phone number has 10 digits in it
        // we could improve further on it but for simplicity we'll keep it like that
        // we purposely will ignore phones with 7 digits (no local area code) because we 
        // only accept 10 digits number
        return normalizedPhone.length === 10;
    }

    /**
     * Uses the people iterator to iterate over the read person data as it goes and filters out the persons with a valid US number and then keeps track of only the _youngestCount number of Person objects found so far.
     * At the end, resolves the promise with the found up to _youngestCount objects
     * @param {FetchAllPeopleWithDetails} fetchAllPeopleIterator The generator that returns one by one the PersonDetailResult objects fetched through the API
     */
    executeAsync(fetchAllPeopleIterator) {
        return new Promise(async (resolve, reject) => {

            if (fetchAllPeopleIterator == null || !(fetchAllPeopleIterator instanceof FetchAllPeopleWithDetails)) {
                return reject(new Error('executeAsync() expects a valid instance of FetchAllPeopleWithDetails'));
            }

            // here we'll keep only an array with the youngest people found so far through iterating the generator
            // every time the previous generator retrieves one more person
            // we'll evaluate their age against the currently cached persons
            // and we'll re-sort the topYoungestPersons array making sure we 
            // don't have more than youngestCount elements into it
            let youngestPersons = []; // accumulates all people records read so far

            // this is where we chain all 3 iterators - reading the person data with every token
            // then filerting the persons with valid US number
            // and finally the youngest() keeping up to the _youngestCount records with the youngest Person data objects
            for await (let person of fetchAllPeopleIterator.fetchAllPeopleIter()) {
                if (person.number != null && this.isUSPhoneNumber(person.number)) {
                    if (person.age != null) {
                        youngestPersons.push(person);
                        youngestPersons.sort((person1, person2) => person1.age - person2.age);

                        if (youngestPersons.length > this._youngestCount) {
                            // select only the youngest Number of elements and drop the rest
                            youngestPersons = youngestPersons.slice(0, this._youngestCount);
                        }
                    } else {
                        this._logger.warn(`executeAsync() skipping person without age: ${JSON.stringify(person, null, " ")}`);
                    }
                } else {
                    this._logger.warn(`executeAsync() skipping person with no US number: ${JSON.stringify(person, null, " ")}`);
                }
            }

            // finally sort the array using the person name
            youngestPersons.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 

            resolve(youngestPersons);
        });
    }
}

module.exports = FindYoungestWithUSPhoneIterator;