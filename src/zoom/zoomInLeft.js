/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomInLeft');
zoom.ZoomInLeft = function (dom, config) {
    zoom.ZoomInLeft.superClass.call(this, dom, config, zoom.ZoomInLeft.cf.init);
};

zoom.ZoomInLeft.cf = {
    init: {
        'name': 'zoomInLeft',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomInLeft': {
            '0': {
                'scale3d': '.1, .1, .1',
                'translate3d': '-1000px, 0, 0',
                'opacity': 0,
                'animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
            },
            '60': {
                'scale3d': '.475, .475, .475',
                'translate3d': '10px, 0, 0',
                'animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)',
                'opacity': 1
            }
        }
    }
};
Keyframe.pack(zoom.ZoomInLeft);

