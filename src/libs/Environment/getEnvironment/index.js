import Onyx from 'react-native-onyx';
import lodashGet from 'lodash/get';
import Config from 'react-native-config';
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
        if (CONFIG.IS_IN_STAGING && shouldUseStagingServer) {
            environment = CONST.ENVIRONMENT.STAGING;
            return resolve(environment);
        }

        return resolve(lodashGet(Config, 'ENVIRONMENT', CONST.ENVIRONMENT.DEV));
    });
}

export default getEnvironment;
