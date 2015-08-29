/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('loading.SpinDisc');
loading.SpinDisc = function (dom, config) {
    loading.SpinDisc.superClass.call(this, dom, Util.extend(config, loading.SpinDisc.cf.init));
    this.on(Event.beforeStart, function () {
        this.addClass('ec-spinDisc');
    });
    this.on(Event.stop, function () {
        this.removeClass('ec-spinDisc');
    });
};

loading.SpinDisc.cf = {
    init: {
        'name': 'spinDisc',
        'duration': '2.8s',
        'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out cub
        'delay': '0s',
        'count': 'infinite',
        'direction': 'normal', // normal alternate
        'state': 'running', // paused
        'mode': 'none' // none forwards backwards both,
    },
    class: {
        'ec-spinDisc': {
            'border-radius': '50%',
            'background-clip': 'content-box',
            'overflow': 'hidden',
            'padding': '0.5em',
            'border': 'solid 0.5em #9b59b6',
            'border-right-color': 'transparent',
            'border-left-color': 'transparent'
        }
    },
    frame: {
        'spinDisc': {
            '0': {
                'background-color': '#3498db'
            },
            '50': {
                'background-color': '#2ecc71',
                'border-bottom-color': '#3498db',
                'border-top-color': '#3498db'
            },
            '100': {
                'rotate': '1turn'
            }
        }
    }
};
Keyframe.pack(loading.SpinDisc);

