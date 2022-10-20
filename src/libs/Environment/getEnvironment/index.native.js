import Onyx from 'react-native-onyx';
import lodashGet from 'lodash/get';
import Config from 'react-native-config';
import betaChecker from '../betaChecker';
import CONST from '../../../CONST';
import ONYXKEYS from '../../../ONYXKEYS';
import CONFIG from '../../../CONFIG';

let shouldUseStagingServer = false;

Onyx.connect({
    key: ONYXKEYS.USER,
    callback: val => shouldUseStagingServer = lodashGet(val, 'shouldUseStagingServer', true),
});

let environment = null;

/**
 * Returns a promise that resolves with the current environment string value
 *
 * @returns {Promise}
 */
function getEnvironment() {
    return new Promise((resolve) => {
        // If we've already set the environment, use the current value
        if (environment) {
            return resolve(environment);
        }

        if (lodashGet(Config, 'ENVIRONMENT', CONST.ENVIRONMENT.DEV) === CONST.ENVIRONMENT.DEV) {
            environment = CONST.ENVIRONMENT.DEV;
            return resolve(environment);
        }

        if (CONFIG.IS_IN_STAGING && shouldUseStagingServer) {
            environment = CONST.ENVIRONMENT.STAGING;
            resolve(environment);
        }

        // If we haven't set the environment yet and we aren't on dev, check to see if this is a beta build
        betaChecker.isBetaBuild()
            .then((isBeta) => {
                environment = isBeta ? CONST.ENVIRONMENT.STAGING : CONST.ENVIRONMENT.PRODUCTION;
                resolve(environment);
            });
    });
}

export default getEnvironment;
