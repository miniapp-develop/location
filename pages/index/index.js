const location = require('../../libs/index');

Page({
    data: {},
    onLoad(query) {

    },

    onTapGetLocationSync(e) {
        console.log('onTapGetLocationSync', location.getSync());
    },

    onTapGetLocation(e) {
        location.authorize().then(res => {
            return location.get()
                .then(location => {
                    console.log('onTapGetLocation', location);
                }).catch(err => {
                    console.error('onTapGetLocation', err);
                });
        }).catch(e => {
            console.error('authorize', e, '应该提示用户打开设置面板去开启位置权限');
        });
    },

    onTapGetThrottle(e) {
        location.getThrottle().then(loc => {
            console.log('onTapGetThrottle', loc);
        }).catch(err => {
            console.error('onTapGetThrottle', err);
        });
    },
    onTapGetThrottle_5s() {
        location.getThrottle({}, 5000).then(loc => {
            console.log('onTapGetThrottle_5s', loc);
        }).catch(err => {
            console.error('onTapGetThrottle_5s', err);
        });
    }
});
