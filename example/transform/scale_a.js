/**
 * Created by dingguoliang01 on 2015/1/27.
 */
/**
 * Created by dingguoliang01 on 2014/11/24.
 */

goog.require('ad.animation.KeyFrames');

goog.provide('ad.animation.demo.ScaleA');

ad.animation.KeyFrames.defineKeyFrame('scale_a', [
    {
        'percent': 0,
        'scale': 2,
        'rotate': '0deg',
        'border-radius': '5px',
        'css': [
            {
                'key': 'opacity',
                'value': 0
            }
        ]
    },
    {
        'percent': 60,
        'scale': 0.7,
        'rotate': '10deg',
        'border-radius': '20px',
        // perspective: '-100px'
        'css': [
            {
                'key': 'opacity',
                'value': 0.7
            }
        ]
    },
    {
        'percent': 70,
        'scale': 1.5,
        'rotate': '0deg',
        'css': [
            {
                'key': 'opacity',
                'value': 0.8
            }
        ]
        // perspective: '-100px'
    },
    {
        'percent': 80,
        'scale': 0.8,
        'css': [
            {
                'key': 'opacity',
                'value': 0.9
            }
        ]
    },
    {
        'percent': 90,
        'scale': 1.2,
        'css': [
            {
                'key': 'opacity',
                'value': 0.95
            }
        ]
    },
    {
        'percent': 100,
        'scale': 1,
        'radius': '10px',
        'css': [
            {
                'key': 'opacity',
                'value': 1
            }
        ]/*,
     'linear-gradient': 'left,red,#0034ab'*/
    }
]);

ad.animation.demo.ScaleA = function (dom, config, classes) {
    config = ad.animation.KeyFrames._extend(config, ad.animation.demo.ScaleA._default);
    ad.animation.KeyFrames.call(this, dom,
        ad.animation.KeyFrames._json2Array(config),
        ad.animation.KeyFrames._arraylize(classes));
};
baidu.inherits(ad.animation.demo.ScaleA, ad.animation.KeyFrames);

ad.animation.demo.ScaleA._default = {
    'name': 'scale_a',
    'duration': '2s',
    'function': 'ease', // ease,linear,ease-in,ease-out,ease-in-out cub
    'delay': '0',
    'count': '1',
    'direction': 'alternate', // normal alternate
    'state': 'running', // paused
    'mode': 'forwards' // forwards backwards both,
};
