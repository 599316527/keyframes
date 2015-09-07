/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceOutLeft');
bounce.BounceOutLeft = function (dom, config) {
    bounce.BounceOutLeft.superClass.call(this, dom, config, bounce.BounceOutLeft.cf.init);
};

bounce.BounceOutLeft.cf = {
    init: {
        'name': 'bounceOutLeft',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceOutLeft': {
            '20': {
                'translate3d': '20px, 0, 0',
                'opacity': 1
            },
            '100': {
                'translate3d': '-100%, 0, 0',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(bounce.BounceOutLeft);

