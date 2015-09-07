/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Swing');
attention.Swing = function (dom, config) {
    attention.Swing.superClass.call(this, dom, config, attention.Swing.cf.init);
    this.on(Event.beforeStart, function () {
        this.addClass('');
    });
    this.on(Event.stop, function () {
        this.removeClass('');
    });
};

attention.Swing.cf = {
    init: {
        'name': 'swing',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'swing': {
            '20': {
                'rotate3d': '0, 0, 1, 15deg'
            },
            '40': {
                'rotate3d': '0, 0, 1, -10deg'
            },
            '60': {
                'rotate3d': '0, 0, 1, 5deg'
            },
            '80': {
                'rotate3d': '0, 0, 1, -5deg'
            },
            '100': {
                'rotate3d': '0, 0, 1, 0deg'
            }
        }
    }
};
Keyframe.pack(attention.Swing);

