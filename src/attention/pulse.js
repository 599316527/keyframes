/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Pulse');
attention.Pulse = function (dom, config) {
    attention.Pulse.superClass.call(this, dom, config, attention.Pulse.cf.init);
};

attention.Pulse.cf = {
    init: {
        'name': 'pulse',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'pulse': {
            '50': {
                'scale3d': '1.05, 1.05, 1.05'
            },
            '100': {
                'scale3d': '1, 1, 1'
            }
        }
    }
};
Keyframe.pack(attention.Pulse);

