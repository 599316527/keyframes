/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Keyframe.defineKeyframe('audioWave',
    {
        '25': {
            'background': 'linear-gradient(#3498db,#3498db) 0 50%,' +
            'linear-gradient(#9b59b6,#9b59b6) 0.625em 50%,' +
            'linear-gradient(#9b59b6, #9b59b6) 1.25em 50%,' +
            'linear-gradient(#9b59b6, #9b59b6) 1.875em 50%,' +
            'linear-gradient(#9b59b6,#9b59b6) 2.5em 50%',
            'background-repeat': 'no-repeat',
            'background-size': '0.5em 2em, 0.5em 0.25em, 0.5em 0.25em, 0.5em 0.25em, 0.5em 0.25em'
        },
        '37.5': {
            'background': 'linear-gradient(#9b59be,#9b59b6) 0 50%,' +
            'linear-gradient(#3498db,#3498db) 0.625em 50%,' +
            'linear-gradient(#9b59b6, #9b59b6) 1.25em 50%,' +
            'linear-gradient(#9b59b6, #9b59b6) 1.875em 50%,' +
            'linear-gradient(#9b59b6,#9b59b6) 2.5em 50%',
            'background-repeat': 'no-repeat',
            'background-size': '0.5em 0.25em, 0.5em 2em, 0.5em 0.25em, 0.5em 0.25em, 0.5em 0.25em'
        },
        '50': {
            'background': 'linear-gradient(#9b59b6, #9b59b6) 0 50%,' +
            'linear-gradient(#9b59b6,#9b59b6) 0.625em 50%,' +
            'linear-gradient(#3498db,#3498db) 1.25em 50%,' +
            'linear-gradient(#9b59b6, #9b59b6) 1.875em 50%,' +
            'linear-gradient(#9b59b6,#9b59b6) 2.5em 50%',
            'background-repeat': 'no-repeat',
            'background-size': '0.5em 0.25em, 0.5em 0.25em, 0.5em 2em, 0.5em 0.25em, 0.5em 0.25em'
        },
        '62.5': {
            'background': 'linear-gradient(#9b59b6, #9b59b6) 0 50%,' +
            'linear-gradient(#9b59b6,#9b59b6) 0.625em 50%,' +
            'linear-gradient(#9b59b6, #9b59b6) 1.25em 50%,' +
            'linear-gradient(#3498db,#3498db) 1.875em 50%,' +
            'linear-gradient(#9b59b6,#9b59b6) 2.5em 50%',
            'background-repeat': 'no-repeat',
            'background-size': '0.5em 0.25em, 0.5em 0.25em, 0.5em 0.25em, 0.5em 2em, 0.5em 0.25em'
        },
        '75': {
            'background': 'linear-gradient(#9b59b6,#9b59b6) 0 50%,' +
            'linear-gradient(#9b59b6,#9b59b6) 0.625em 50%,' +
            'linear-gradient(#9b59b6, #9b59b6) 1.25em 50%,' +
            'linear-gradient(#9b59b6, #9b59b6) 1.875em 50%,' +
            'linear-gradient(#3498db,#3498db) 2.5em 50%',
            'background-repeat': 'no-repeat',
            'background-size': '0.5em 0.25em, 0.5em 0.25em, 0.5em 0.25em, 0.5em 0.25em, 0.5em 2em'
        }
    }
);
Keyframe.defineClass('ec-audioWave:after', {
        'animation': {
            'name': 'audioWave',
            'duration': '2s',
            // 'animationTimingFunction': 'ease', // ease,linear,ease-in,ease-out,ease-in-out cub
            'delay': '0s',
            'count': 'infinite',
            'direction': 'normal', // normal alternate
            'state': 'running', // paused
            'mode': 'forwards' // forwards backwards both,
        },
        'background': 'linear-gradient(#9b59b6,#9b59b6) 0 50%,' +
        'linear-gradient(#9b59b6,#9b59b6) 0.625em 50%,' +
        'linear-gradient(#9b59b6, #9b59b6) 1.25em 50%,' +
        'linear-gradient(#9b59b6, #9b59b6) 1.875em 50%,' +
        'linear-gradient(#9b59b6,#9b59b6) 2.5em 50%',
        'width': '3em',
        'height': '2em',
        'font-size': '22px',
        'background-repeat': 'no-repeat',
        'background-size': '0.5em 0.25em, ' +
        '0.5em 0.25em, ' +
        '0.5em 0.25em, ' +
        '0.5em 0.25em, ' +
        '0.5em 0.25em',
        'content': '""',
        'position': 'absolute',
        'left': '50%',
        'top': '50%'
    }
);
function AudioWave (dom, config) {
    AudioWave.superClass.call(this, dom, config);
    this.on(Event.beforeStart, function () {
        this.addClass('ec-audioWave');
    });
    this.on(Event.stop, function () {
        this.removeClass('ec-audioWave');
    });
}
Util.inherit(AudioWave, Keyframe);
