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
            'margin': '-100px auto 0',
            'width': (63 * 19) + 'px',
            'height': '220px',
            'overflow': 'hidden',
            'perspective': '1000px'
        },
        'gen': {
            'position': 'relative',
            'width': '1px',
            'height': '200px',
             'display': 'inline-block',
            'margin': '10px 6px',
            'background': 'hsla(243, 100%, 85%, 1)',
            'box-shadow': '1px 1px 1px 1px hsla(0,0%,0%,0.2)',
            'transition': 'all 1s ease'
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
            'background': 'hsla(243, 95%, 85%, 1)',
            'content': '""',
            'bottom': '-2px'
}
}
};
var rot = Keyframe.defineKeyframe({
    40: { 'background': 'hsla(253, 85%, 25%, 1)'},
    100: { 'rotateX': '-360deg'}
}).getName();
var delay = 0;
for (var i = 630; i >= 0; i-=10) {
    delay -= 0.1;
    delay = delay.toFixed(2);
    timeline['.rot' + i + '#infinite~5s_' + delay + 's'] = rot;
}
var group = Keyframe.group(timeline);
group.start();