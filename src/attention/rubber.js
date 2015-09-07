/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Rubber');
attention.Rubber = function (dom, config) {
    attention.Rubber.superClass.call(this, dom, config, attention.Rubber.cf.init);
};

attention.Rubber.cf = {
    init: {
        'name': 'rubber',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'rubber': {
            '30': {
                'scale3d': '1.25, 0.75, 1'
            },
            '40': {
                'scale3d': '0.75, 1.25, 1'
            },
            '50': {
                'scale3d': '1.15, 0.85, 1'
            },
            '65': {
                'scale3d': '0.95, 1.05, 1'
            },
            '75': {
                'scale3d': '1.05, 0.95, 1'
            },
            '100': {
                'scale3d': '1, 1, 1'
            }
        }
    }
};
Keyframe.pack(attention.Rubber);

