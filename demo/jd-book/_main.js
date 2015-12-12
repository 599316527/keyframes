/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */
var timeline = {
    'container': {
        '0 7': {
            'translateX': '5px',
            'translateY': '5px'
        }
    },
    'frame1#infinite': {
        '1': {
            'opacity': 1,
            'rotateZ':'0deg'
        },
        '7': {
            'opacity': 1,
            'rotateZ':'180deg'
        }
    },
    'frame2': {
        '0 0.5': {
            'opacity': 1,
            'scale': 0
        },
        '0.8': {
            'opacity': 1,
            'scale': 1.1
        },
        '0.9': {
            'opacity': 1,
            'scale': 1
        }
    },
    'frame3': {
        '0.9': {
            'translateY': 0
        },
        '1.2': {
            'opacity': 1,
            'translateY': '212px'
        },
        '1.3': {
            'opacity': 1,
            'translateY': '197px'
        },
        '1.35': {
            'opacity': 1,
            'translateY': '208px'
        },
        '1.4': {
            'opacity': 1,
            'translateY': '203px'
        }
    },
    'frame4#infinite': {
        "1.1": {
            "translateY": 0
        },
        "1.4": {
            "opacity": 1,
            "translateY": "187px"
        },
        "1.5": {
            "opacity": 1,
            "translateY": "171px"
        },
        "1.55": {
            "opacity": 1,
            "translateY": "183px"
        },
        "1.6": {
            "opacity": 1,
            "translateY": "178px"
        },
        "3 3.2 3.3 3.5 5 5.2 5.3 5.5": {
            "scale": 1,
            "opacity": 1,
            "translateY": "178px"
        },
        "3.1 3.4 5.1 5.4": {
            "scale": 1.2,
            "opacity": 1,
            "translateY": "150px"
        }
    }
};
// 绑定动画参数
var group = Keyframe.group(timeline);
group.start();
