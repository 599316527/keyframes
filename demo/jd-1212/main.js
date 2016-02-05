/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */

var config = {
    'class': {
        'ticker': {
            'transform-origin': '50% 0%'
        },
        'pointer': {
            'transform-origin': '80% 97%'
        }
    },
    'container': {
        '0.2 5': {
            'opacity': 1
        },
        '0 5.2': {
            'opacity': 0
        }
    },
    'frame1': {
        '0 5': {
            'opacity': 1
        }
    },
    'frame2#infinite': {
        '0 1.875': {
            'rotate': '0deg',
            'opacity': 1
        },
        '0.375': {
            'rotate': '30deg'
        },
        '0.875': {
            'rotate': '0deg'
        },
        '1.375': {
            'rotate': '-30deg'
        }
    },
    'frame3': {
        '0 5': {
            'opacity': 1
        }
    },
    'frame4': {
        '0.0': {
            'opacity': 1,
            'rotate': '-30deg'
        },
        '0.2083': {
            'rotate': '-30deg'
        },
        '0.375': {
            'rotate': '-45deg'
        },
        '0.5': {
            'rotate': '45deg'
        },
        '0.625': {
            'rotate': '5deg'
        },
        '0.7083': {
            'rotate': '15deg'
        },
        '5.0': {
            'opacity': 1,
            'rotate': '15deg'
        }
    },
    'frame5': {
        '0 0.7083': {
            'opacity': 0,
            'scale': 0
        },
        '1.2083': {
            'opacity': 1,
            'scale': 1.486
        },
        '1.5417': {
            'scale': 1.073
        },
        '1.8333': {
            'scale': 1.287
        },
        '2.1667': {
            'scale': 1.092
        },
        '5': {
            'opacity': 1,
            'scale': 1.092
        }
    }
};


// 绑定动画参数
var group = Keyframe.group(config);

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
