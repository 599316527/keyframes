/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('{%domain%}');
{%domain%} = function (dom, config) {
    {%domain%}.superClass.call(this, dom, Util.extend(config, {%domain%}.cf.init));
    this.on(Event.beforeStart, function () {
        this.addClass('');
    });
    this.on(Event.stop, function () {
        this.removeClass('');
    });
};

{%domain%}.cf = {
    init: {
        'name': '{%camelCase%}',
        'duration': '2.8s',
        'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out cub
        'delay': '0s',
        'count': 'infinite',
        'direction': 'normal', // normal alternate
        'state': 'running', // paused
        'mode': 'none' // none forwards backwards both,
    },
    class: {
        'ec-{%camelCase%}': {
            'box-shadow': '-0.625em -0.625em 0 0.625em #9b59b6, ' +
            '0.625em -0.625em 0 0.625em #9b59b6, ' +
            '-0.625em 0.625em 0 0.625em #9b59b6, ' +
            '0.625em 0.625em 0 0.625em #9b59b6'
        }
    },
    frame: {
        '{%camelCase%}': {
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
Keyframe.pack({%domain%});

