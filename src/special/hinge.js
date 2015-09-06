/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('special.Hinge');
special.Hinge = function (dom, config) {
    special.Hinge.superClass.call(this, dom, config, special.Hinge.cf.init);
};

special.Hinge.cf = {
    init: {
        'name': 'hinge',
        'duration': '2.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'hinge': {
            '0': {
                'transform-origin': 'top left',
                'animation-timing-function': 'ease-in-out'
            },
            '20 60': {
                'rotate3d': '0, 0, 1, 80deg',
                'transform-origin': 'top left',
                'animation-timing-function': 'ease-in-out'
            },
            '40 80': {
                'rotate3d': '0, 0, 1, 60deg',
                'transform-origin': 'top left',
                'animation-timing-function': 'ease-in-out',
                'opacity': 1
            },
            '100': {
                'percent': 100,
                'translate3d': '0, 700px, 0',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(special.Hinge);

