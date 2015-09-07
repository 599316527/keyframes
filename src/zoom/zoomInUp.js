/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomInUp');
zoom.ZoomInUp = function (dom, config) {
    zoom.ZoomInUp.superClass.call(this, dom, config, zoom.ZoomInUp.cf.init);
};

zoom.ZoomInUp.cf = {
    init: {
        'name': 'zoomInUp',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomInUp': {
            '0': {
                'scale3d': '.1, .1, .1',
                'translate3d': '0, 1000px, 0',
                'opacity': 0,
                'animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
            },
            '60': {
                'scale3d': '.475, .475, .475',
                'translate3d': '0, -60px, 0',
                'opacity': 1,
                'animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
            }
        }
    }
};
Keyframe.pack(zoom.ZoomInUp);

