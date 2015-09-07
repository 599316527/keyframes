/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('flipper.FlipInX');
flipper.FlipInX = function (dom, config) {
    flipper.FlipInX.superClass.call(this, dom, config, flipper.FlipInX.cf.init);
};

flipper.FlipInX.cf = {
    init: {
        'name': 'flipInX',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'flipInX': {
            '0': {
                'perspective': '400px',
                'transition-timing-function': 'ease-in',
                'rotate3d': '1, 0, 0, 90deg',
                'opacity': 0
            },
            '40': {
                'rotate3d': '1, 0, 0, -20deg'
            },
            '60': {
                'rotate3d': '1, 0, 0, 10deg',
                'opacity': 1
            },
            '80': {
                'rotate3d': '1, 0, 0, -5deg'
            },
            '100': {
                'rotate3d': '1, 0, 0, 0deg'
            }
        }
    }
};
Keyframe.pack(flipper.FlipInX);

