/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('custom.Blaze');
custom.Blaze = function (dom, config) {
    custom.Blaze.superClass.call(this, dom, config, custom.Blaze.cf.init);
    this.on(Event.beforeStart, function () {
        this.addClass('ec-blaze');
    });
    this.on(Event.stop, function () {
        this.removeClass('ec-blaze');
    });
};

custom.Blaze.cf = {
    class: {
        'ec-blaze': {
            'background-color': 'black'
        },
        'ec-blaze:after': {
            'animation': {
                'name': 'blaze',
                'duration': '2s',
                'function': 'linear',
                'count': 'infinite',
                'direction': 'normal',
                'state': 'running'
            },
            'position': 'absolute',
            'content': '""',
            'width': '100%',
            'height': '100%',
            'left': 0
        }
    },
    frame: {
        'blaze': {
            '0': {
                'background-color': 'white',
                'opacity': 1
            },
            '100': {
                'scale': '1.1, 1.2',
                'background-color': 'transparent'
            }
        }
    }
};
Keyframe.pack(custom.Blaze);

