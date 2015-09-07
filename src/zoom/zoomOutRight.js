/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomOutRight');
zoom.ZoomOutRight = function (dom, config) {
    zoom.ZoomOutRight.superClass.call(this, dom, config, zoom.ZoomOutRight.cf.init);
};

zoom.ZoomOutRight.cf = {
    init: {
        'name': 'zoomOutRight',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomOutRight': {
            '40': {
                'scale3d': '.475, .475, .475',
                'translate3d': '-42px, 0, 0',
                'opacity': 1
            },
            '100': {
                'scale': '.1',
                'translate3d': '2000px, 0, 0',
                'transform-origin': 'right center',
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(zoom.ZoomOutRight);

