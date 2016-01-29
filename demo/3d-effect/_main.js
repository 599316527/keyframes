/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */
var config = {
    'class': {
        'box-3d': {
            'transform-style': 'preserve-3d',
            'perspective': '600px'
        },
        'hidden init': {
            'backface-visibility': 'hidden'
        }, 'init': {
            'position': 'absolute',
            'transition': 'all ease-in-out 2s',
            'text-align': 'center',
            'vertical-align': 'middle',
            'backface-visibility': 'visible'
        }
    },
    'container#infinite': {
        '0': {
            'transform': 'scale(0.8) rotateY(0deg)'
        },
        '12': {
            'transform': 'scale(0.8) rotateY(360deg)'
        }
    }
};
var cpl = Compiler.instance();
function randomColor() {
    var map = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    var color = '#';
    var count = 6;
    while (count-- > 0) {
        color += map[Math.round(Math.random() * 14)]
    }
    return color;
}
var scene = new ClassProxy('scene', {
    'width': '200px',
    'height': '200px',
    'margin': '150px auto',
    'position': 'relative',
    'transform-style': 'preserve-3d'
});
function state1() {
    scene.selectors({
        'init': {
            'background-color': randomColor(),
            'border': '1px solid ' + randomColor(),
            'color': randomColor()
        },
        'big-cube': {
            'width': '100%',
            'height': '100%',
            'border-radius': '10px',
            'font-size': '100px',
            'line-height': '200px',
            'left': 0,
            'top': 0,
            'opacity': 0.5
        },
        'small-cube': {
            'width': '50%',
            'height': '50%',
            'left': '25%',
            'top': '25%',
            'font-size': '50px',
            'line-height': '100px',
            'border-radius': '5px',
            'opacity': 0.5
        },
        'cube-1': {
            'transform-origin': '50% 50%',
            'transform': 'translateZ(-100px) rotateY(180deg)'
        },
        'cube-2': {
            'transform-origin': '0% 50%',
            'transform': 'translateZ(-100px) rotateY(-90deg)'
        },
        'cube-3': {
            'transform-origin': '0% 50%',
            'transform': 'translateZ(100px)'
        },
        'cube-4': {
            'transform-origin': '100% 50%',
            'transform': 'translateZ(-100px) rotateY(90deg)'
        },
        'cube-5': {
            'transform-origin': '0% 100%',
            'transform': 'translateZ(-100px) rotateX(-90deg)'
        },
        'cube-6': {
            'transform-origin': '0% 0%',
            'transform': 'translateZ(-100px) rotateX(90deg)'
        },
        'cube-7': {
            'transform-origin': '50% 50%',
            'transform': 'translateZ(-50px) rotateY(180deg)'
        },
        'cube-8': {
            'transform-origin': '0% 50%',
            'transform': 'translateZ(-50px) rotateY(-90deg)'
        },
        'cube-9': {
            'transform-origin': '0% 50%',
            'transform': 'translateZ(50px)'
        },
        'cube-10': {
            'transform-origin': '100% 50%',
            'transform': 'translateZ(-50px) rotateY(90deg)'
        },
        'cube-11': {
            'transform-origin': '0% 100%',
            'transform': 'translateZ(-50px) rotateX(-90deg)'
        },
        'cube-12': {
            'transform-origin': '0% 0%',
            'transform': 'translateZ(-50px) rotateX(90deg)'
        }
    });
    cpl.compile();
}
function state2() {
    scene.selectors({
        'init': {
            'background-color': randomColor(),
            'border': '1px solid ' + randomColor(),
            'color': randomColor()
        },
        'big-cube': {
            'width': '150px',
            'height': '150px',
            'border-radius': '10px',
            'font-size': '100px',
            'line-height': '150px',
            'left': '25px',
            'top': '25px',
            'opacity': 0.5
        },
        'small-cube': {
            'width': '150px',
            'height': '150px',
            'border-radius': '10px',
            'font-size': '100px',
            'line-height': '150px',
            'left': '25px',
            'top': '25px',
            'opacity': 0.5
        },
        'cube-1': {
            'transform': distance
        },
        'cube-2': {
            'transform': 'rotateY(30deg)' + distance
        },
        'cube-3': {
            'transform': 'rotateY(60deg)' + distance
        },
        'cube-4': {
            'transform': 'rotateY(90deg)' + distance
        },
        'cube-5': {
            'transform': 'rotateY(120deg)' + distance
        },
        'cube-6': {
            'transform': 'rotateY(150deg)' + distance
        },
        'cube-7': {
            'transform': 'rotateY(180deg)' + distance
        },
        'cube-8': {
            'transform': 'rotateY(210deg)' + distance
        },
        'cube-9': {
            'transform': 'rotateY(240deg)' + distance
        },
        'cube-10': {
            'transform': 'rotateY(270deg)' + distance
        },
        'cube-11': {
            'transform': 'rotateY(300deg)' + distance
        },
        'cube-12': {
            'transform': 'rotateY(330deg)' + distance
        }
    });
}
var distance = Math.ceil(150 / Math.tan(Math.PI / 6)) + 20;
distance = ' translateZ(' + distance + 'px)';
var container = document.getElementById('container');
var btn = document.getElementsByTagName('input');
Util.on(btn[0], 'change', function (e) {
    if (e.target.checked) {
        Util.addClass(container, 'hidden');
    }
    else {
        Util.removeClass(container, 'hidden');
    }
});
Util.on(btn[1], 'change', function (e) {
    if (e.target.checked) {
        state2();
        cpl.compile();
    }
    else {
        state1();
        cpl.compile();
    }
});
var group;
setTimeout(function() {
    state1();
    group = Keyframe.group(config);
    group.start();
}, 500);

