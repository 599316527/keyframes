/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceOut');
bounce.BounceOut = function (dom, config) {
    bounce.BounceOut.superClass.call(this, dom, config, bounce.BounceOut.cf.init);
};

bounce.BounceOut.cf = {
    init: {
        'name': 'bounceOut',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceOut': {
            '20': {
                'scale3d': '.9, .9, .9'
            },
            '50 55': {
                'scale3d': '1.1, 1.1, 1.1',
                'opacity': 1
            },
            '100': {
                'scale3d': '.3, .3, .3',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(bounce.BounceOut);

