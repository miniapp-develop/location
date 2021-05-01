const vendor = require("@mini-dev/vendor");

const supportPromise = !!wx.getSystemInfo();

function promisify(fn_name) {
    const miniapp_fn = vendor[fn_name];
    return function _promisify(options) {
        if (supportPromise) {
            return miniapp_fn.call(vendor, options);
        } else {
            if (options && (options.success || options.fail || options.complete)) {
                return miniapp_fn.call(vendor, options);
            } else {
                return new Promise((resolve, reject) => {
                    miniapp_fn.call(vendor, {
                        ...options,
                        success: res => {
                            resolve(res);
                        },
                        fail: (e) => {
                            reject(e);
                        }
                    });
                });
            }
        }
    }
}

export default function wxx(fn_name) {
    if (!wxx[fn_name]) {
        wxx[fn_name] = promisify(fn_name);
    }
    return wxx[fn_name];
}

export {
    promisify
}