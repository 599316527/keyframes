// 自动缩放
var defaultEntryWidth = 230;
var suposeScreenWidth = 350;
/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */
var timeline = {
    'class': {
        'class-scale': {
            'scale': suposeScreenWidth / defaultEntryWidth
        }
    },
    "frame1": {
        "0.6": {
            "translateY": "0px"
        },
        "1.2": {
            "translateY": "55px",
            "opacity": 1
        },
        "1.8": {
            "translateY": "55px",
            "opacity" : 0
        }
    },
    "frame2": {
        "0": {
            "scale": 0.2
        },
        "1.18": {
            "opacity": 0
        },
        "1.2": {
            "opacity": 1,
            "scale": 0.2
        },
        "2.1": {
            "opacity": 0,
            "scale": 1
        }
    },
    "frame3": {
        "2.1": {
            "opacity": 0
        },
        "2.3": {
            "opacity": 0.1
        },
        "2.9": {
            "opacity": 0.5
        },
        "3.1": {
            "opacity": 1
        }
    },
    "frame4@ease-in-out#infinite": {
        "0": {
            "opacity": 0
        },
        "3.1": {
            "opacity": 0
        },
        "3.12": {
            "opacity": 1,
            "translateX":"0px",
            "rotateZ":"0deg"
        },
        "4.32": {
            "translateX": "-60px",
            "opacity": 1,
            "rotateZ":"360deg"
        }
    },
    "frame5": {
        "3.5": {
            "opacity": 0
        },
        "4.9": {
            "opacity": 1
        }
    }
};
var group = Keyframe.group(timeline);
group.start();