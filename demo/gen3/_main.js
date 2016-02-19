/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */
var timeline = {
    'class': {
        'canvas': {
            'width': '100%',
            'height': '100%',
            'background': 'hsla(205, 95%, 15%, 1)',
            'background-image': 'radial-gradient(top, circle cover, hsla(205, 95%, 15%, 1) 0%, hsla(251, 20%, 17%,1) 80%)'
        },
        'stage': {
            'transform-style': 'preserve-3d',
            'position': 'relative',
            'top': '50%',
            'margin': '10px auto',
            'width': '100px',
            'height': '220px'
        },
        'gen': {
            'position': 'absolute',
            'width': '1px',
            'left': '49px',
            'top': '10px',
            'height': '200px',
            'display': 'inline-block',
            'background': 'hsla(243, 100%, 85%, 1)',
            'box-shadow': '1px 1px 1px 1px hsla(0,0%,0%,0.2)'
        },
        'gen:before': {
            'position': 'absolute',
            'left': '-2px',
            'border-radius': '50%',
            'width': '12px',
            'height': '10px',
            'box-shadow': '2px 2px 2px 2px hsla(0,0%,0%,0.25)',
            'background': 'hsla(243, 95%, 85%, 1)',
            'content': '""',
            'top': '-2px'
        },
        'gen:after': {
            'position': 'absolute',
            'left': '-2px',
            'border-radius': '50%',
            'width': '12px',
            'height': '10px',
            'box-shadow': '2px 2px 2px 2px hsla(0,0%,0%,0.25)',
            'background': 'red',
            'content': '""',
            'bottom': '-2px'
        }
    }
};
var perspective = {
    '0': {
        'perspective': '1px'
    }
};

var delay = 0;
for (var i = 0; i <= 36; i++) {
    delay -= 0.1;
    delay = delay.toFixed(2);
    perspective[(i * 2.5 + 1) + ''] = {
        'rotateZ': (i * 10) + 'deg',
        'perspective': (i * 6 + 2) + 'px',
        'perspective-origin': (50 + Math.sin(i/Math.PI) * 50 + 10).toFixed(2) + 'px ' + (110 - Math.cos(i/Math.PI) * 50 + 10).toFixed(2) + 'px'
    };
    timeline['class']['rot' + i] = {
        'transform': 'rotateZ(' + (i * 10) + 'deg) translateZ(' + (i * 5) + 'px)'
    };
}
perspective['91']['perspective-origin'] = perspective['88.5']['perspective-origin'];
perspective['100'] = {
    'perspective-origin': perspective['91']['perspective-origin'],
    'rotateZ': '360deg',
    'perspective': '230px'
};
var rot = Keyframe.defineKeyframe(perspective).getName();
timeline['stage#infinite~8s>alternate'] = rot;
var group = Keyframe.group(timeline);
group.start();