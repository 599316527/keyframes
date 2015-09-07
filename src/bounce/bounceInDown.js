/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceInDown');
bounce.BounceInDown = function (dom, config) {
    bounce.BounceInDown.superClass.call(this, dom, config, bounce.BounceInDown.cf.init);
};

bounce.BounceInDown.cf = {
    init: {
        'name': 'bounceDown',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceDown': {
            '0 60 75 90 100': {
                'transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
            },
            '0': {
                'opacity': 0,
                'translate3d': '0, -100%, 0'
            },
            '60': {
                'opacity': 1,
                'translate3d': '0, 25px, 0'
            },
            '75': {
                'opacity': 1,
                'translate3d': '0, -10px, 0'
            },
            '90': {
                'opacity': 1,
                'translate3d': '0, 5px, 0'
            },
            '100': {
                'transform': 'none'
            }
        }
    }
};
Keyframe.pack(bounce.BounceInDown);

