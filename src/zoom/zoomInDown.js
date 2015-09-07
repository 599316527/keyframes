/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomInDown');
zoom.ZoomInDown = function (dom, config) {
    zoom.ZoomInDown.superClass.call(this, dom, config, zoom.ZoomInDown.cf.init);
};

zoom.ZoomInDown.cf = {
    init: {
        'name': 'zoomInDown',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomInDown': {
            '0': {
                'scale3d': '.1, .1, .1',
                'translate3d': '0, -1000px, 0',
                'opacity': 0
            },
            '60': {
                'scale3d': '.475, .475, .475',
                'translate3d': '0, 60px, 0',
                'opacity': 1,
                'animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
            }
        }
    }
};
Keyframe.pack(zoom.ZoomInDown);

