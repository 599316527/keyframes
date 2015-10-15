/**
 * Created by dingguoliang01 on 2014/11/24.
 */

goog.require('ad.animation.KeyFrames');

goog.provide('ad.animation.demo.Run');

ad.animation.KeyFrames.defineKeyFrame('run', [
    {
        'percent': 0,
        'css': [
            {
                'key': 'background-position',
                'value': '0 0'
            }
        ]
    },
    {
        'percent': 14.3,
        'css': [
            {
                'key': 'background-position',
                'value': '-180px 0'
            }
        ]
    },
    {
        'percent': 28.6,
        'css': [
            {
                'key': 'background-position',
                'value': '-360px 0'
            }
        ]
    },
    {
        'percent': 42.9,
        'css': [
            {
                'key': 'background-position',
                'value': '-540px 0'
            }
        ]
    },
    {
        'percent': 57.2,
        'css': [
            {
                'key': 'background-position',
                'value': '-720px 0'
            }
        ]
    },
    {
        'percent': 71.5,
        'css': [
            {
                'key': 'background-position',
                'value': '-900px 0'
            }
        ]
    },
    {
        'percent': 85.8,
        'css': [
            {
                'key': 'background-position',
                'value': '-1080px 0'
            }
        ]
    },
    {
        'percent': 100,
        'css': [
            {
                'key': 'background-position',
                'value': '0 0'
            }
        ]
    }
]);
ad.animation.KeyFrames.defineClass('ec-run', {
    'css': [
        {
            'key': 'width',
            'value': '180px!important'
        },
        {
            'key': 'height',
            'value': '300px!important'
        },
        {
            'key': 'background',
            'value': 'url(images/run.png) 0 0 no-repeat'
        }
    ]
});

ad.animation.demo.Run = function (dom, config, classes) {
    config = ad.animation.KeyFrames._extend(config, ad.animation.demo.Run._default);
    ad.animation.KeyFrames.call(this, dom,
        ad.animation.KeyFrames._json2Array(config),
        ad.animation.KeyFrames._arraylize('ec-run', classes));
};
baidu.inherits(ad.animation.demo.Run, ad.animation.KeyFrames);

ad.animation.demo.Run._default = {
    'name': 'run',
    'duration': '1s',
    'function': 'step-start', // ease,linear,ease-in,ease-out,ease-in-out cub
    'delay': '0s',
    'count': 'infinite',
    'state': 'running', // paused
    'mode': 'forwards' // forwards backwards both,
};
