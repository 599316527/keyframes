/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('flipper.FlipOutY');
flipper.FlipOutY = function (dom, config) {
    flipper.FlipOutY.superClass.call(this, dom, config, flipper.FlipOutY.cf.init);
};

flipper.FlipOutY.cf = {
    init: {
        'name': 'flipOutY',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'flipOutY': {
            '0': {
                'perspective': '400px'
            },
            '30': {
                'rotate3d': '0, 1, 0, -15deg',
                'opacity': 1
            },
            '100': {
                'rotate3d': '0, 1, 0, 90deg',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(flipper.FlipOutY);

