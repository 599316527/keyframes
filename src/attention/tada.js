/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Tada');
attention.Tada = function (dom, config) {
    attention.Tada.superClass.call(this, dom, config, attention.Tada.cf.init);
};

attention.Tada.cf = {
    init: {
        'name': 'tada',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'tada': {
            '10 20': {
                'scale3d': '.9, .9, .9',
                'rotate3d': '0, 0, 1, -3deg'
            },
            '30 50 70 90': {
                'scale3d': '1.1, 1.1, 1.1',
                'rotate3d': '0, 0, 1, 3deg'
            },
            '40 60 80': {
                'scale3d': '1.1, 1.1, 1.1',
                'rotate3d': '0, 0, 1, -3deg'
            },
            '100': {
                'scale3d': '1, 1, 1',
                'rotate3d': '0, 0, 1, 0deg'
            }
        }
    }
};
Keyframe.pack(attention.Tada);

