/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Bounce');
attention.Bounce = function (dom, config) {
    attention.Bounce.superClass.call(this, dom, config, attention.Bounce.cf.init);
    this.on(Event.beforeStart, function () {
        this.addClass('');
    });
    this.on(Event.stop, function () {
        this.removeClass('');
    });
};

attention.Bounce.cf = {
    init: {
        'name': 'bounce',
        'duration': '2.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    class: {
        'ec-bounce': {
            'box-shadow': '-0.625em -0.625em 0 0.625em #9b59b6, ' +
            '0.625em -0.625em 0 0.625em #9b59b6, ' +
            '-0.625em 0.625em 0 0.625em #9b59b6, ' +
            '0.625em 0.625em 0 0.625em #9b59b6'
        }
    },
    frame: {
        'bounce': {
            '50': {
                'border-radius': '50%',
                'rotate': '0.5turn',
                'width': '1.25em',
                'height': '1.25em',
                'box-shadow': '-2.5em 0 0 #2ecc71, ' +
                '2.5em 0 0 #e74c3c, ' +
                '-2.5em 0 0 #3498db, ' +
                '2.5em 0 0 #f1c40f'
            },
            '80 100': {
                'rotate': '1turn'
            }
        }
    }
};
Keyframe.pack(attention.Bounce);

