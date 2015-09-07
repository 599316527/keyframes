/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceOutUp');
bounce.BounceOutUp = function (dom, config) {
    bounce.BounceOutUp.superClass.call(this, dom, config, bounce.BounceOutUp.cf.init);
};

bounce.BounceOutUp.cf = {
    init: {
        'name': 'bounceOutUp',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceOutUp': {
            '20': {
                'translate3d': '0, -10px, 0',
                'opacity': 1
            },
            '40 45': {
                'translate3d': '0, 20px, 0'
            },
            '100': {
                'translate3d': '0, -100%, 0',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(bounce.BounceOutUp);

