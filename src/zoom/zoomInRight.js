/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomInRight');
zoom.ZoomInRight = function (dom, config) {
    zoom.ZoomInRight.superClass.call(this, dom, config, zoom.ZoomInRight.cf.init);
};

zoom.ZoomInRight.cf = {
    init: {
        'name': 'zoomInRight',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomInRight': {
            '0': {
                'scale3d': '.1, .1, .1',
                'translate3d': '1000px, 0, 0',
                'opacity': 0,
                'animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
            },
            '60': {
                'scale3d': '.475, .475, .475',
                'translate3d': '-10px, 0, 0',
                'opacity': 1,
                'animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
            }
        }
    }
};
Keyframe.pack(zoom.ZoomInRight);

