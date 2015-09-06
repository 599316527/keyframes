/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('custom.FlameOnHover');
custom.FlameOnHover = function (dom, config) {
    custom.FlameOnHover.superClass.call(this, dom, config, custom.FlameOnHover.cf.init);
    this.on(Event.beforeStart, function () {
        this.addClass('ec-flame-on-hover');
    });
    this.on(Event.stop, function () {
        this.removeClass('ec-flame-on-hover');
    });
};

custom.FlameOnHover.cf = {
    class: {
        'ec-flame-on-hover': {
            'background-color': 'black'
        },
        'ec-flame-on-hover:hover': {
            'animation': {
                'name': 'flame',
                'duration': '2s',
                'function': 'linear', // ease,linear,ease-in,ease-out,ease-in-out cub
                'count': 'infinite'
            }
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
Keyframe.pack(custom.FlameOnHover);

