/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Shake');
attention.Shake = function (dom, config) {
    attention.Shake.superClass.call(this, dom, config, attention.Shake.cf.init);
};

attention.Shake.cf = {
    init: {
        'name': 'shake',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'shake': {
            '0 100': {
                'translate3d': '0, 0, 0'
            },
            '10 30 50 70 90': {
                'translate3d': '-10px, 0 , 0'
            },
            '20 40 60 80': {
                'translate3d': '10px, 0, 0'
            }
        }
    }
};
Keyframe.pack(attention.Shake);

