/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('flipper.FlipInY');
flipper.FlipInY = function (dom, config) {
    flipper.FlipInY.superClass.call(this, dom, config, flipper.FlipInY.cf.init);
};

flipper.FlipInY.cf = {
    init: {
        'name': 'flipInY',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'flipInY': {
            '0': {
                'perspective': '400px',
                'transition-timing-function': 'ease-in',
                'rotate3d': '0, 1, 0, 90deg',
                'opacity': 0
            },
            '40': {
                'rotate3d': '0, 1, 0, -20deg',
            },
            '60': {
                'rotate3d': '0, 1, 0, 10deg',
                'opacity': 1
            },
            '80': {
                'rotate3d': '0, 1, 0, -5deg'
            },
            '100': {
                'rotate3d': '0, 1, 0, 0deg'
            }
        }
    }
};
Keyframe.pack(flipper.FlipInY);

