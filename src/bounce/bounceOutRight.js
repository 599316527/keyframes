/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceOutRight');
bounce.BounceOutRight = function (dom, config) {
    bounce.BounceOutRight.superClass.call(this, dom, config, bounce.BounceOutRight.cf.init);
};

bounce.BounceOutRight.cf = {
    init: {
        'name': 'bounceOutRight',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceOutRight': {
            '20': {
                'translate3d': '-20px, 0, 0',
                'opacity': 1
            },
            '100': {
                'translate3d': '100%, 0, 0',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(bounce.BounceOutRight);

