/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Flash');
attention.Flash = function (dom, config) {
    attention.Flash.superClass.call(this, dom, config, attention.Flash.cf.init);
};

attention.Flash.cf = {
    init: {
        'name': 'flash',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'flash': {
            '0 50 100': {
                'opacity': 1
            },
            '25 75': {
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(attention.Flash);

