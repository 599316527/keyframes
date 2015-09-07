/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('{%domain%}');
{%domain%} = function (dom, config) {
    {%domain%}.superClass.call(this, dom, config, {%domain%}.cf.init);
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
        'duration': '1.8s',
        'function': 'ease-in-out' // ease,linear,ease-in,ease-out,ease-in-out cub
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
Keyframe.pack({%domain%});

