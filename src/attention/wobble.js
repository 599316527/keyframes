/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Wobble');
attention.Wobble = function (dom, config) {
    attention.Wobble.superClass.call(this, dom, config, attention.Wobble.cf.init);
};

attention.Wobble.cf = {
    init: {
        'name': 'wobble',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'wobble': {
            '15': {
                'translate3d': '-25%, 0, 0',
                'rotate3d': '0, 0, 1, -5deg'
            },
            '30': {
                'translate3d': '20%, 0, 0',
                'rotate3d': '0, 0, 1, 3deg'
            },
            '45': {
                'translate3d': '-15%, 0, 0',
                'rotate3d': '0, 0, 1, -3deg'
            },
            '60': {
                'translate3d': '10%, 0, 0',
                'rotate3d': '0, 0, 1, 2deg'
            },
            '75': {
                'translate3d': '-5%, 0, 0',
                'rotate3d': '0, 0, 1, -1deg'
            },
            '100': {
                'transform': 'none'
            }
        }
    }
};
Keyframe.pack(attention.Wobble);

