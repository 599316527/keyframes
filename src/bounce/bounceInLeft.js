/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceInLeft');
bounce.BounceInLeft = function (dom, config) {
    bounce.BounceInLeft.superClass.call(this, dom, config, bounce.BounceInLeft.cf.init);
};

bounce.BounceInLeft.cf = {
    init: {
        'name': 'bounceInLeft',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceInLeft': {
            '0 60 75 90 100': {
                'transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
            },
            '0': {
                'opacity': 0,
                'translate3d': '-100%, 0, 0'
            },
            '60': {
                'opacity': 1,
                'translate3d': '25px, 0, 0'
            },
            '75': {
                'translate3d': '-10px, 0, 0'
            },
            '90': {
                'translate3d': '5px, 0, 0'
            },
            '100': {
                'transform': 'none'
            }
        }
    }
};
Keyframe.pack(bounce.BounceInLeft);

