/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('special.RollIn');
special.RollIn = function (dom, config) {
    special.RollIn.superClass.call(this, dom, config, special.RollIn.cf.init);
};

special.RollIn.cf = {
    init: {
        'name': 'rollIn',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'rollIn': {
            '0': {
                'translate3d': '-100%, 0, 0',
                'rotate3d': '0, 0, 1, -120deg',
                'opacity': 0
            },
            '100': {
                'transform': 'none',
                'opacity': 1
            }
        }
    }
};
Keyframe.pack(special.RollIn);

