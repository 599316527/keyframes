/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomOutLeft');
zoom.ZoomOutLeft = function (dom, config) {
    zoom.ZoomOutLeft.superClass.call(this, dom, config, zoom.ZoomOutLeft.cf.init);
};

zoom.ZoomOutLeft.cf = {
    init: {
        'name': 'zoomOutLeft',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomOutLeft': {
            '40': {
                'scale3d': '.475, .475, .475',
                'translate3d': '42px, 0, 0',
                'opacity': 1
            },
            '100': {
                'scale': '.1',
                'translate3d': '-2000px, 0, 0',
                'transform-origin': 'left center',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(zoom.ZoomOutLeft);

