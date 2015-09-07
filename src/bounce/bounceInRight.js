/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceInRight');
bounce.BounceInRight = function (dom, config) {
    bounce.BounceInRight.superClass.call(this, dom, config, bounce.BounceInRight.cf.init);
};

bounce.BounceInRight.cf = {
    init: {
        'name': 'bounceInRight',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceInRight': {
            '0': {
                'opacity': 0,
                'translate3d': '100%, 0, 0'
            },
            '60': {
                'opacity': 1,
                'translate3d': '-25px, 0, 0'
            },
            '75': {
                'opacity': 1,
                'translate3d': '10px, 0, 0'
            },
            '90': {
                'translate3d': '-5px, 0, 0'
            },
            '100': {
                'opacity': 1,
                'transform': 'none'
            }
        }
    }
};
Keyframe.pack(bounce.BounceInRight);

