/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceOutDown');
bounce.BounceOutDown = function (dom, config) {
    bounce.BounceOutDown.superClass.call(this, dom, config, bounce.BounceOutDown.cf.init);
};

bounce.BounceOutDown.cf = {
    init: {
        'name': 'bounceOutDown',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceOutDown': {
            '20': {
                'translate3d': '0, 10px, 0'
            },
            '40 45': {
                'translate3d': '0, -20px, 0',
                'opacity': 1
            },
            '100': {
                'translate3d': '0, 100%, 0',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(bounce.BounceOutDown);

