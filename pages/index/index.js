import {location} from '../../libs/index';

Page({
    data: {},
    onLoad(query) {

    },

    onTapGetLocation(e) {
        console.log(location.getSync());
        location.authorize().then(res => {
            return location.get()
                .then(location => {
                    console.log(location);
                }).catch(err => {
                    console.error(err);
                });
        }).catch(e => {
            console.error('authorize', e, '应该提示用户打开设置面板去开启位置权限');
        });
    }
});
