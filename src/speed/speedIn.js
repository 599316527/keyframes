/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('speed.SpeedIn');
speed.SpeedIn = function (dom, config) {
    speed.SpeedIn.superClass.call(this, dom, Util.extend(config, speed.SpeedIn.cf.init));
};

speed.SpeedIn.cf = {
    init: {
        'name': 'speedIn',
        'duration': '2.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'speedIn': {
            '0': {
                'translate3d': '100%, 0, 0',
                'skewX': '-30deg',
                'opacity': 0
            },
            '60': {
                'skewX': '20deg',
                'opacity': 1
            },
            '80': {
                'skewX': '-5deg'
            },
            '100': {
                'transform': 'none'
            }
        }
    }
};
Keyframe.pack(speed.SpeedIn);

