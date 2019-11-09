/**
 * POJO class that parses the response from the LIST endpoint 
 */
class PeopleListResult {
    /**
     * Factory method to create an object from the /list endpoint response
     * @param {*} data The raw response from the /list endpoint
     */
    static createFrom(data) {
        return new PeopleListResult(data.result, data.token);
    }

    constructor(ids, token = null) {
        if (!ids || !Array.isArray(ids)) {
            throw new Error('ids param is required and must be a valid array of integers');
        }

        if(token && typeof(token) !== 'string') {
            throw new Error('token is optional but when specified must be a valid string');
        }

        this._ids = ids;
        this._token = token;
    }

    /**
     * Read only getter for the people ids. Returns an array of integers denoting the people ids
     */
    get ids() {
        return this._ids;
    }
    /**
     * The token parameter that can be passed into the next call to /list endpoint to continue reading from the people's list
     */
    get token() {
        return this._token;
    }
}

module.exports = PeopleListResult;