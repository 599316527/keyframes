/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomOutUp');
zoom.ZoomOutUp = function (dom, config) {
    zoom.ZoomOutUp.superClass.call(this, dom, config, zoom.ZoomOutUp.cf.init);
};

zoom.ZoomOutUp.cf = {
    init: {
        'name': 'zoomOutUp',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomOutUp': {
            '40': {
                'scale3d': '.475, .475, .475',
                'translate3d': '0, 60px, 0',
                'animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
                'opacity': 1
            },
            '100': {
                'scale3d': '.1, .1, .1',
                'translate3d': '0, -2000px, 0',
                'transform-origin': 'center bottom',
                'opacity': 0,
                'animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
            }
        }
    }
};
Keyframe.pack(zoom.ZoomOutUp);

