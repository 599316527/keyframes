/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('special.RollOut');
special.RollOut = function (dom, config) {
    special.RollOut.superClass.call(this, dom, config, special.RollOut.cf.init);
};

special.RollOut.cf = {
    init: {
        'name': 'rollOut',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'rollOut': {
            '0': {
                'opacity': 1
            },
            '100': {
                'translate3d': '100%, 0, 0',
                'rotate3d': '0, 0, 1, 120deg',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(special.RollOut);

