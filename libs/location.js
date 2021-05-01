import wxx from './wxx';

function _getLocation(opts) {
    return wxx('getLocation')(opts).then(res => {
        return {
            type: opts.type,
            ...res
        };
    });
}

function authorize(scope = 'userLocation') {
    return wxx('getSetting')().then(res => {
        if (res.authSetting[`scope.${scope}`]) {
            return Promise.resolve({status: 'ok'});
        } else {
            return wxx('authorize')({
                scope: `scope.${scope}`
            }).then(() => {
                return Promise.resolve({status: 'ok'});
            }).catch(e => {
                return Promise.reject({status: 'deny'});
            });
        }
    })
}

const DEFAULT_TYPE = 'wgs84';

let CACHE = {};

function checkThrottle(type, interval) {
    const cached = CACHE[type];
    if (!cached) {
        return true;
    }
    return Date.now() - cached.time >= interval;
}

function updateCache(location) {
    CACHE[location.type] = {
        time: Date.now(),
        location: location
    }
    return CACHE[location.type].location;
}

function get(opts = {}) {
    return _getLocation({type: DEFAULT_TYPE, ...opts})
        .then(updateCache);
}

function getSync(opts = {}) {
    const {type = DEFAULT_TYPE} = opts;
    const cached = CACHE[type];
    if (!cached) {
        return null;
    }
    return cached.location;
}

function getThrottle(opts = {}, interval = 60000) {
    const {type = DEFAULT_TYPE} = opts;
    if (checkThrottle(type, interval)) {
        return get(opts);
    } else {
        return Promise.resolve(getSync(opts));
    }
}

export default {
    authorize,
    get,
    getSync,
    getThrottle
}