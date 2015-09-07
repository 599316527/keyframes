/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('zoom.ZoomIn');
zoom.ZoomIn = function (dom, config) {
    zoom.ZoomIn.superClass.call(this, dom, config, zoom.ZoomIn.cf.init);
};

zoom.ZoomIn.cf = {
    init: {
        'name': 'zoomIn',
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    frame: {
        'zoomIn': {
            '0': {
                'scale3d': '.3, .3, .3',
                'opacity': 0
            },
            '50': {
                'opacity': 1
            }
        }
    }
};
Keyframe.pack(zoom.ZoomIn);

