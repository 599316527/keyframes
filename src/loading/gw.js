/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define("loading.GW");
loading.GW = function (dom, config) {
    loading.GW.superClass.call(this, dom, Util.extend(config, loading.GW.cf.init));
    this.on(Event.beforeStart, function () {
        this.addClass('ec-gW');
    });
    this.on(Event.stop, function () {
        this.removeClass('ec-gW');
    });
};
// em单位名称为相对长度单位。相对于当前对象内文本的字体尺寸,会根据元素的字体大小而改变
loading.GW.cf = {
    init: [
        {
            'name': 'gW',
            'duration': '1s',
            'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out cub
            'delay': '0s',
            'count': 'infinite',
            'direction': 'normal', // normal alternate
            'state': 'running', // paused
            'mode': 'none' // none forwards backwards both,
        },
        {
            'name': 'rot',
            'duration': '2.8s',
            'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out cub
            'delay': '0s',
            'count': 'infinite',
            'direction': 'normal', // normal alternate
            'state': 'running', // paused
            'mode': 'none' // none forwards backwards both,
        }],
    class: {
        'ec-gW': {
            'box-shadow': '0.70711em 0.70711em 0 0em #2ecc71, ' +
            '-0.70711em 0.70711em 0 0.17678em #9b59b6, ' +
            '-0.70711em -0.70711em 0 0.25em #3498db, ' +
            '0.70711em -0.70711em 0 0.17678em #f1c40f'
        }
    },
    frame: {
        'gW': {
            '0': {
                'box-shadow': '0.70711em 0.70711em 0 0.125em #2ecc71, ' +
                '-0.70711em 0.70711em 0 0.39017em #9b59b6, ' +
                '-0.70711em -0.70711em 0 0.5em #3498db, ' +
                '0.70711em -0.70711em 0 0.39017em #f1c40f'
            },
            '25': {
                'box-shadow': '0.70711em 0.70711em 0 0.39017em #2ecc71, ' +
                '-0.70711em 0.70711em 0 0.5em #9b59b6, ' +
                '-0.70711em -0.70711em 0 0.39017em #3498db, ' +
                '0.70711em -0.70711em 0 0.125em #f1c40f'
            },
            '50': {
                'box-shadow': '0.70711em 0.70711em 0 0.5em #2ecc71, ' +
                '-0.70711em 0.70711em 0 0.39017em #9b59b6, ' +
                '-0.70711em -0.70711em 0 0.125em #3498db, ' +
                '0.70711em -0.70711em 0 0.39017em #f1c40f'
            },
            '75': {
                'box-shadow': '0.70711em 0.70711em 0 0.39017em #2ecc71, ' +
                '-0.70711em 0.70711em 0 0.125em #9b59b6, ' +
                '-0.70711em -0.70711em 0 0.39017em #3498db, ' +
                '0.70711em -0.70711em 0 0.5em #f1c40f'
            },
            '100': {
                'box-shadow': '0.70711em 0.70711em 0 0.125em #2ecc71, ' +
                '-0.70711em 0.70711em 0 0.39017em #9b59b6, ' +
                '-0.70711em -0.70711em 0 0.5em #3498db, ' +
                '0.70711em -0.70711em 0 0.39017em #f1c40f'
            }
        },
        'rot': {
            '100': {
                rotate: '360deg'
            }
        }
    }
};
Keyframe.pack(loading.GW);

