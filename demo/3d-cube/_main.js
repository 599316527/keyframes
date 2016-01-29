/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */
var config = {
    'class': {
        // safari浏览器必须包一层container，否则显示有问题，蛋疼，其他浏览器可以不包
        'container': {
            'perspective': '800px',
            'perspective-origin': '50% 40%'
            // 不要再设置transform-style了
            /*,
             'transform-style': 'preserve-3d'*/
        },
        'stage': {
            'transform-style': 'preserve-3d'
        },
        'box-3d': {
            'transform-style': 'preserve-3d',
            'perspective': '600px'
        },
        'hidden plane': {
            'backface-visibility': 'hidden'
        },
        'plane': {
            'position': 'absolute',
            'transition': 'all ease-in-out 2s',
            'text-align': 'center',
            'backface-visibility': 'visible',
            'width': '200px',
            'height': '200px',
            'border-radius': '10px',
            'font-size': '100px',
            'line-height': '200px',
            'opacity': 0.7
        }
    },
    'shape#infinite': {
        '0': {
            'transform': 'rotateY(0deg)'
        },
        '12': {
            'transform': 'rotateY(-360deg)'
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
var cube = new ClassProxy('cube', {
    'width': '200px',
    'height': '200px',
    'margin': '150px auto',
    'position': 'relative',
    'transform-style': 'preserve-3d'
});
function state1() {
    cube.selectors({
        'plane': {
            'background-color': randomColor(),
            'border': '1px solid ' + randomColor(),
            'color': randomColor()
        },
        'cube-1': {
            // 先scale之后，后面的translate都是放大的，比如translateZ 100px 其实是 120px,要对z面生效必须scale3d
            // rotateX(90deg)后 ，z面其实是原先的x面
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateX(90deg) translateZ(100px)'
        },
        'cube-2': {
            'transform': 'scale3d(1.2, 1.2, 1.2) translateZ(100px)'
        },
        'cube-3': {
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateY(90deg) translateZ(100px)'
        },
        'cube-4': {
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateY(180deg) translateZ(100px)'
        },
        'cube-5': {
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateY(-90deg) translateZ(100px)'
        },
        'cube-6': {
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateX(-90deg) translateZ(100px) rotate(180deg)'
        },
        'cube-7': {
            // 先scale之后，后面的translate都是放大的，比如translateZ 100px 其实是 120px
            // rotateX(90deg)后 ，z面其实是原先的x面
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateX(90deg) translateZ(100px)'
        },
        'cube-8': {
            'transform': 'scale3d(0.8, 0.8, 0.8) translateZ(100px)'
        },
        'cube-9': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(90deg) translateZ(100px)'
        },
        'cube-10': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(180deg) translateZ(100px)'
        },
        'cube-11': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(-90deg) translateZ(100px)'
        },
        'cube-12': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateX(-90deg) translateZ(100px) rotate(180deg)'
        }
    });
    cpl.compile();
}
function state2() {
    cube.selectors({
        'plane': {
            'background-color': randomColor(),
            'border': '1px solid ' + randomColor(),
            'color': randomColor()
        },
        'cube-1': {
            'transform': 'scale3d(0.8, 0.8, 0.8)' + distance
        },
        'cube-2': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(30deg)' + distance
        },
        'cube-3': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(60deg)' + distance
        },
        'cube-4': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(90deg)' + distance
        },
        'cube-5': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(120deg)' + distance
        },
        'cube-6': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(150deg)' + distance
        },
        'cube-7': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(180deg)' + distance
        },
        'cube-8': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(210deg)' + distance
        },
        'cube-9': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(240deg)' + distance
        },
        'cube-10': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(270deg)' + distance
        },
        'cube-11': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(300deg)' + distance
        },
        'cube-12': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(330deg)' + distance
        }
    });
    cpl.compile();
}
var distance = Math.ceil(200 / Math.tan(Math.PI / 6)) + 20;
distance = ' translateZ(' + distance + 'px)';
var shape = document.getElementById('shape');
var btn = document.getElementsByTagName('input');
Util.on(btn[0], 'change', function (e) {
    if (e.target.checked) {
        Util.addClass(shape, 'hidden');
    }
    else {
        Util.removeClass(shape, 'hidden');
    }
});
Util.on(btn[1], 'change', function (e) {
    if (e.target.checked) {
        state2();
    }
    else {
        state1();
    }
});

setTimeout(function () {
    state1();
    var group = Keyframe.group(config);
    group.start();
}, 500);

