import wxx from './wxx';

function _getLocation(opts) {
    return wxx('getLocation')(opts).then(res => {
        return {
            type: opts.type,
            ...res
        };
    });
}

let LAST_CACHE = {
    time: 0,
    location: null
};

function checkThrottle(interval) {
    return Date.now() - LAST_CACHE.time >= interval;
}

function updateCache(location) {
    LAST_CACHE.time = Date.now();
    LAST_CACHE.location = location;
    return LAST_CACHE.location;
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

function get(opts) {
    return _getLocation({type: 'wgs84', ...opts})
        .then(updateCache);
}

function getSync() {
    return LAST_CACHE.location;
}

function getThrottle(opts = {}, interval = 60000) {
    if (checkThrottle(interval)) {
        return get(opts);
    } else {
        return Promise.resolve(getSync());
    }
}

export default {
    authorize,
    get,
    getSync,
    getThrottle
}