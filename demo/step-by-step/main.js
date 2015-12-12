// 自动缩放
var defaultEntryWidth = 230;
var suposeScreenWidth = 600;
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
    "frame1@step-start#infinite": {
        "1": {
            "background-position": "0 0"
        },
        "1.3": {
            "background-position": "-180px 0"
        },
        "1.6": {
            "background-position": "-360px 0"
        },
        "1.9": {
            "background-position": "-540px 0"
        },
        "2.2": {
            "background-position": "-720px 0"
        },
        "2.5": {
            "background-position": "-900px 0"
        },
        "2.8": {
            "background-position": "-1080px 0"
        }
    }
};
var group = Keyframe.group(timeline);
group.start();