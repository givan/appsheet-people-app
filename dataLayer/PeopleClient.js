const logger = require('../common/logging');
const config = require('../config');
const rp = require('request-promise-native');
const URL = require('url').URL;
const PeopleListResult = require('./PeopleListResult');
const PersonDetailResult = require('./PersonDetailResult');

const LIST_ENDPOINT = '/sample/list';
const LIST_TOKEN_QUERY_PARAM = 'token';
const DETAIL_ENDPOINT = "/sample/detail";

/**
 * The HTTP client that provides access to the People service (list and detail endpoints)
 */
class PeopleClient {
    /**
     * Factory method to create a client initialized with the Winston logger instance and the configuraiton data based on the current NODE_ENV setting
     */
    static createInstance() {
        return new PeopleClient(logger, config.PeopleService.baseUrl);
    }

    /**
     * Constructs a new instance of the PeopleClient which knows how to talk to the People service
     * @param {winston} logger winston module instance object used for logging
     * @param {string} peopleBaseUrl the url to the people service base url (without the )
     * @param {number} timeoutMs the timeout in milliseconds beyond which the client will timeout the current API call 
     */
    constructor(logger, peopleBaseUrl, timeoutMs = 1000) {
        if (typeof(logger) !== 'object') {
            throw new Error('logger must be a valid winston library instance');
        }
        if (!this._isValidPeopleBaseUrl(peopleBaseUrl)) {
            throw new Error('peopleBaseUrl must be a valid base url object as read from the config json file');
        }
        if (typeof(timeoutMs) !== 'number' || timeoutMs < 0) {
            throw new Error('timeoutMs must be a non-negative number');
        }

        this._logger = logger;
        this._peopleBaseUrl = peopleBaseUrl;
        this._peopleListUri = new URL(LIST_ENDPOINT, peopleBaseUrl);
    }
    
    /**
     * Calls the /list endpoint on the People service
     * @param {string} token The token received from a previous call to /list endpoint (optional)
     */
    list(token) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'GET',
                uri: this._peopleListUri.toString(),
                json: true // Automatically parses the JSON string in the response
            };
    
            if (token) {
                options.qs = this._getListQueryString(token);
            }
             
            rp(options).then(listResponse => {
                const result = PeopleListResult.createFrom(listResponse);
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    detail(personId) {
        return new Promise((resolve, reject) => {
            if (!personId) {
                return reject(new Error('personId is required for calling detail endpoint'));
            }

            const detailUrl = new URL(`${DETAIL_ENDPOINT}/${personId}`, this._peopleBaseUrl).toString();
            let options = {
                uri: detailUrl,
                json: true // Automatically parses the JSON string in the response
            };

            rp(options).then(detailResponse => {
                const result = PersonDetailResult.createFrom(detailResponse);
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Determines if the provided base url is valid. Returns true if it is.
    * @param {string} peopleBaseUrl the base url as loaded from the application config file
     */
    _isValidPeopleBaseUrl(peopleBaseUrl) {
        return typeof(peopleBaseUrl) === 'string' && peopleBaseUrl.length > 0;
    }

    /**
     * Constructs the query string object containing the query param for the token of the /list endpoint
     * @param {string} token The token to be passed as a query param to the People API list endpoint
     */
    _getListQueryString(token) {
        let qs = {};
        qs[LIST_TOKEN_QUERY_PARAM] = token;
        return qs;
    }
}

module.exports = PeopleClient;