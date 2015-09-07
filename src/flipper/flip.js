/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('flipper.Flip');
flipper.Flip = function (dom, config) {
    flipper.Flip.superClass.call(this, dom, config, flipper.Flip.cf.init);
};

flipper.Flip.cf = {
    init: {
        'name': 'flip',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'flip': {
            '0': {
                'perspective': '400px',
                'animation-timing-function': 'ease-out',
                'rotate3d': '0, 1, 0, -360deg'
            },
            '40': {
                'translate3d': '0, 0, 150px',
                'rotate3d': '0, 1, 0, -190deg'
            },
            '50': {
                'translate3d': '0, 0, 150px',
                'rotate3d': '0, 1, 0, -170deg',
                'animation-timing-function': 'ease-in'
            },
            '80': {
                'scale3d': '.95, .95, .95'
            }
        }
    }
};
Keyframe.pack(flipper.Flip);

