/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('bounce.BounceInUp');
bounce.BounceInUp = function (dom, config) {
    bounce.BounceInUp.superClass.call(this, dom, config, bounce.BounceInUp.cf.init);
};

bounce.BounceInUp.cf = {
    init: {
        'name': 'bounceInUp',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'bounceInUp': {
            '0': {
                'opacity': 0,
                'translate3d': '0, 100%, 0'
            },
            '60': {
                'opacity': 1,
                'translate3d': '0, -20px, 0'
            },
            '75': {
                'translate3d': '0, 10px, 0'
            },
            '90': {
                'translate3d': '0, -5px, 0'
            },
            '100': {
                'translate3d': '0, 0, 0'
            }
        }
    }
};
Keyframe.pack(bounce.BounceInUp);

