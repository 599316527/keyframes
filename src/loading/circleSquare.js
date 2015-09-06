/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('loading.CircleSquare');
loading.CircleSquare = function (dom, config) {
    loading.CircleSquare.superClass.call(this, dom, config, loading.CircleSquare.cf.init);
    this.on(Event.beforeStart, function () {
        this.addClass('ec-circleSquare');
    });
    this.on(Event.stop, function () {
        this.removeClass('ec-circleSquare');
    });
};

loading.CircleSquare.cf = {
    init: {
        'name': 'circleSquare',
        'duration': '2.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
    },
    class: {
        'ec-circleSquare': {
            'box-shadow': '-0.625em -0.625em 0 0.625em #9b59b6, ' +
            '0.625em -0.625em 0 0.625em #9b59b6, ' +
            '-0.625em 0.625em 0 0.625em #9b59b6, ' +
            '0.625em 0.625em 0 0.625em #9b59b6'
        }
    },
    frame: {
        'circleSquare': {
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
                'width': '0',
                'height': '0',
                'rotate': '1turn'
            }
        }
    }
};
Keyframe.pack(loading.CircleSquare);

