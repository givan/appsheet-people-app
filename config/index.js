/** loads up the config based on the environment variable ENV */
const logger = require('../common/logging');
const env = process.env.NODE_ENV || 'development';


const path = require('path');
const configFilePath = path.resolve(`config/appsheet-people-app-${env}.json`);

let config = {};

if (require('fs').existsSync(configFilePath)) {
    logger.info(`Loading config file: ${configFilePath}`);
    config = require(configFilePath);
} else {
    logger.error(`Cannot find config file: ${configFilePath}`);
}

module.exports = config;