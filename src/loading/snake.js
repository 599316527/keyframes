/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('loading.Snake');
loading.Snake = function (dom, config) {
    loading.Snake.superClass.call(this, dom, config, loading.Snake.cf.init);
    this.on(Event.beforeStart, function () {
        this.addClass('ec-snake');
    });
    this.on(Event.stop, function () {
        this.removeClass('ec-snake');
    });
};

loading.Snake.cf = {
    init: {
        'name': 'snake',
        'duration': '2.8s',
        'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out cub
        'count': 'infinite'
    },
    class: {
        'ec-snake': {
            'border-radius': '50%',
            'box-shadow': '1.375em 0em #debf23, ' +
            '1.375em 0em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
            '2.75em 0.29721em #b8b64c, ' +
            '2.75em -0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
            '4.125em 0.18368em #92ae75, ' +
            '4.125em -0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
            '5.5em -0.18368em #6ca59d, ' +
            '5.5em 0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
            '6.875em -0.29721em #469cc6, ' +
            '6.875em 0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52)'
        }
    },
    frame: {
        'snake': {
            '0': {
                'box-shadow': '1.375em 0em #debf23, ' +
                '1.375em 0em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '2.75em 0.29721em #b8b64c, ' +
                '2.75em -0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '4.125em 0.18368em #92ae75, ' +
                '4.125em -0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '5.5em -0.18368em #6ca59d, ' +
                '5.5em 0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '6.875em -0.29721em #469cc6, ' +
                '6.875em 0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52)'
            },
            '20': {
                'box-shadow': '1.375em 0.29721em #b8b64c, ' +
                '1.375em -0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '2.75em 0.18368em #92ae75, ' +
                '2.75em -0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '4.125em -0.18368em #6ca59d, ' +
                '4.125em 0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '5.5em -0.29721em #469cc6, ' +
                '5.5em 0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '6.875em 0.0em #debf23, ' +
                '6.875em 0.0em 0.625em -0.3125em rgba(0, 0, 0, 0.52)'
            },
            '40': {
                'box-shadow': '1.375em 0.18368em #92ae75, ' +
                '1.375em -0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '2.75em -0.18368em #6ca59d, ' +
                '2.75em 0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '4.125em -0.29721em #469cc6, ' +
                '4.125em 0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '5.5em 0.0em #debf23, ' +
                '5.5em 0.0em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '6.875em 0.29721em #b8b64c, ' +
                '6.875em -0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52)'
            },
            '60': {
                'box-shadow': '1.375em -0.18368em #6ca59d, ' +
                '1.375em 0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '2.75em -0.29721em #469cc6, ' +
                '2.75em 0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '4.125em 0.0em #debf23, ' +
                '4.125em 0.0em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '5.5em 0.29721em #b8b64c, ' +
                '5.5em -0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '6.875em 0.18368em #92ae75, ' +
                '6.875em -0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52)'
            },
            '80': {
                'box-shadow': '1.375em -0.29721em #469cc6, ' +
                '1.375em 0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '2.75em 0.0em #debf23, ' +
                '2.75em 0.0em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '4.125em 0.29721em #b8b64c, ' +
                '4.125em -0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '5.5em 0.18368em #92ae75, ' +
                '5.5em -0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '6.875em -0.18368em #6ca59d, ' +
                '6.875em 0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52)'
            },
            '100': {
                'box-shadow': '1.375em 0.0em #debf23, ' +
                '1.375em 0.0em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '2.75em 0.29721em #b8b64c, ' +
                '2.75em -0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '4.125em 0.18368em #92ae75, ' +
                '4.125em -0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '5.5em -0.18368em #6ca59d, ' +
                '5.5em 0.18368em 0.625em -0.3125em rgba(0, 0, 0, 0.52), ' +
                '6.875em -0.29721em #469cc6, ' +
                '6.875em 0.29721em 0.625em -0.3125em rgba(0, 0, 0, 0.52)'
            }
        }
    }
};
Keyframe.pack(loading.Snake);

