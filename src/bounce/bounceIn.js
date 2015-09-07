/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceIn');
bounce.BounceIn = function (dom, config) {
    bounce.BounceIn.superClass.call(this, dom, config, bounce.BounceIn.cf.init);
};

bounce.BounceIn.cf = {
    init: {
        'name': 'bounceIn',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceIn': {
            '0 20 40 60 80 100': {
                'transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
            },
            '0': {
                'scale3d': '.3, .3, .3'
            },
            '20': {
                'scale3d': '1.1, 1.1, 1.1'
            },
            '40': {
                'scale3d': '.9, .9, .9'
            },
            '60': {
                'scale3d': '1.03, 1.03, 1.03'
            },
            '80': {
                'scale3d': '.97, .97, .97'
            },
            '100': {
                'scale3d': '1, 1, 1'
            }
        }
    }
};
Keyframe.pack(bounce.BounceIn);

