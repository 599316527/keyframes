/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('speed.SpeedOut');
speed.SpeedOut = function (dom, config) {
    speed.SpeedOut.superClass.call(this, dom, config, speed.SpeedOut.cf.init);
};

speed.SpeedOut.cf = {
    init: {
        'name': 'speedOut',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'speedOut': {
            '0': {
                'opacity': 1
            },
            '100': {
                'skewX': '30deg',
                'translateX': '100%',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(speed.SpeedOut);

