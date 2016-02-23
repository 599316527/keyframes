/**
 * Created by dingguoliang01 on 2016/2/23.
 */
Keyframe.defineKeyframe('zoomIn', {
    '0': {
        'scale3d': '.3, .3, .3',
        'opacity': 0
    },
    '50': {
        'opacity': 1
    }
});
var demo = new Keyframe(document.getElementById('demo'), {
    'name': 'zoomIn',
    'duration': '1.8s',
    'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out cub
    'count': 1, // 'infinite',
    'delay': '200ms',
    'direction': 'normal' // 'alternate'
});
Keyframe.defineKeyframe('zoomIn', {
    '0': {
        'scale3d': '.3, .3, .3',
        'opacity': 0
    },
    '50': {
        'opacity': 1
    }
});
Keyframe.defineKeyframe('speedIn', {
    '0': {
        'translate3d': '100%, 0, 0',
        'skewX': '-30deg',
        'opacity': 0
    },
    '60': {
        'skewX': '20deg',
        'opacity': 1
    },
    '80': {
        'skewX': '-5deg'
    },
    '100': {
        'transform': 'none'
    }
});
var ontToMany = new Keyframe(document.getElementById('demo'), [
    {
        'name': 'zoomIn',
        'duration': '1.8s',
        'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out
        'count': 1, // 'infinite',
        'delay': '200ms',
        'direction': 'normal' // 'alternate'
    },
    {
        'name': 'speedIn',
        'duration': '2s' // default 1s
    }
]);

ontToMany.on(Event.start, function () {});
ontToMany.on(Event.iteration, function () {});
ontToMany.on(Event.end, function () {});