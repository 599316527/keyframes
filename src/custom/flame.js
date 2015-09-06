/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('custom.Flame');
custom.Flame = function (dom, config) {
    custom.Flame.superClass.call(this, dom, config, custom.Flame.cf.init);
    this.on(Event.beforeStart, function () {
        this.addClass('ec-flame');
    });
    this.on(Event.stop, function () {
        this.removeClass('ec-flame');
    });
};

custom.Flame.cf = {
    init: {
        'name': 'flame',
        'duration': '2.8s',
        'count': 'infinite',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    class: {
        'ec-flame': {
            'border-radius': '50% 50%',
            'width': '100%',
            'height': '100%',
            'position': 'absolute'
        }
    },
    frame: {
        'flame': {
            '0': {
                'background-color': 'white',
                'opacity': 1
            },
            '100': {
                'scale': '1.1, 1.1',
                'background-color': 'transparent'
            }
        }
    }
};
Keyframe.pack(custom.Flame);

