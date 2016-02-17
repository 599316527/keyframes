/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */
var spring = Keyframe.defineKeyframe({
    '0': {
        'translateZ': '0px'
    },
    '100': {
        'translateZ': '-200px'
    }
}).getName();
var timeline = {
    'class': {
        'stage': {
            'transform-style': 'preserve-3d',
            'perspective': '1000px',
            'transform': 'rotateX(70deg)'
        },
        'circle': {
            'margin': 'auto',
            'border-radius': '50% 50%',
            'border': '15px solid #ccd7d9',
            'border-color': '#ccd7d9 #d2dbde #d7e0e2 #d2dbde',
            'box-shadow': '0 1px 0 white, inset 0 5px 0px #aebfc4, inset 0 10px 0px #aebfc4, 0 5px 0 #bdcbce, 0 10px 0 #bdcbce'
        }
    },
    "frame1#infinite~2400ms>alternate_400@ease-in-out": spring,
    "frame2#infinite~2400ms>alternate_800@ease-in-out": spring,
    "frame3#infinite~2400ms>alternate_1200@ease-in-out": spring,
    "frame4#infinite~2400ms>alternate_1600@ease-in-out": spring,
    "frame5#infinite~2400ms>alternate_2000@ease-in-out": spring,
    "frame6#infinite~2400ms>alternate_2400@ease-in-out": spring,
    "frame7#infinite~2400ms>alternate_2800@ease-in-out": spring
};
var group = Keyframe.group(timeline);
group.start();