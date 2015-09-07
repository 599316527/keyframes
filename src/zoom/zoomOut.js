/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomOut');
zoom.ZoomOut = function (dom, config) {
    zoom.ZoomOut.superClass.call(this, dom, config, zoom.ZoomOut.cf.init);
};

zoom.ZoomOut.cf = {
    init: {
        'name': 'zoomOut',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomOut': {
            '0': {
                'opacity': 1
            },
            '50': {
                'scale3d': '.3, .3, .3',
                'opacity': 0
            },
            '100': {
                'opacity': 0
            }
        }
    }
};
Keyframe.pack(zoom.ZoomOut);

