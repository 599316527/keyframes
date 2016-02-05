/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */
var timeline = {
    'frame1': {
        '1': {
            'opacity': 1,
            'rotateZ':'0deg'
        },
        '7': {
            'opacity': 1,
            'rotateZ':'90deg'
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
    'frame4': {
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

/**
 * 使用炫动SDK
 * 使用方法：http://ecmc.bdimg.com/public01/lego-open/h5-page-upload/sdk-usage.html
 *
 * @type {BdAdSdk.Xuandong}
 */
var sdk = new BdAdSdk.Xuandong({
    /**
     * 调试开关
     * 正式提交时改成 false
     *
     * @type {boolean}
     */
    // debug: true,

    /**
     * 日志前缀
     * 用于通信时信息验证，一般默认即可
     *
     * @type {string}
     */
    msgPrefix: window.name || null
});

// 初始化 SDK
sdk.init(function () {
    // 动画结束时发送结束日志
    group.onEnd(function () {
        sdk.sendLog(BdAdSdk.Xuandong.LOG_TYPE.STOP);
    });
    // 动画开始时发送开始日志
    sdk.sendLog(BdAdSdk.Xuandong.LOG_TYPE.START);

    // 图片全部加载完成后开始动画
    group.start();
});

