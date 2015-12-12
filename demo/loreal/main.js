/**
 * @file 动画文件
 * @author Xinlei Zhao (zhaoxinlei01@baidu.com)
 */

var getBigImageOffsetWidth = function (i) {
    return i * (335 / 2) * -1 + 'px';
};

var getMidImgOffsetX = function (i) {
    return i * 375 * -1 + 'px';
};
var getMidImgOffsetY = function (i) {
    return i * 204 * -1 + 'px';
};

var getPaperOffsetX = function (i) {
    return i * 375 * -1 + 'px';
};
// 自动缩放
var defaultEntryWidth = 375;
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
            'transform-origin': 'left top',
            'scale': suposeScreenWidth / defaultEntryWidth
        }
    },
    'highlight-image@step-end': {
        '0 4.8': {
            'transform-origin': 'left top'
        },
        '0 0.4 4.8': {
            opacity: 0
        },
        '0.7 4.6': {
            opacity: 1
        },
        '2.9': {
            translateY: '83.5px',
            translateX: '167px',
            scale: 0.5

        },
        '3.2': {
            translateY: '83.5px',
            translateX: '250.5px',
            //先translate后scale
            scale: 0.5
        },
        '3.7': {
            translateY: '0',
            translateX: '250.5px',
            scale: 0.5
        },
        '4.1 4.8': {
            translateY: '0',
            translateX: '167px',
            scale: 0.5
        }
    },
    'mask': {
        '0 8.1': {
            opacity: 0
        },
        '0.4 7.3': {
            opacity: .8
        }
    },
    'ret-img-1': {
        '1 2.85': {
            opacity: 1
        },
        '0 2.9': {
            opacity: .3
        }
    },
    'ret-img-1-r@step-start': {
        '1': {
            translateY: 0,
            translateX: 0
        },
        '1.1': {
            translateY: getBigImageOffsetWidth(0),
            translateX: getBigImageOffsetWidth(1)
        },
        '1.2': {
            translateY: getBigImageOffsetWidth(0),
            translateX: getBigImageOffsetWidth(2)
        },
        '1.3': {
            translateY: getBigImageOffsetWidth(0),
            translateX: getBigImageOffsetWidth(3)
        },
        '1.4': {
            translateY: getBigImageOffsetWidth(1),
            translateX: getBigImageOffsetWidth(0)
        },
        '1.5': {
            translateY: getBigImageOffsetWidth(1),
            translateX: getBigImageOffsetWidth(1)
        },
        '1.6': {
            translateY: getBigImageOffsetWidth(1),
            translateX: getBigImageOffsetWidth(2)
        },
        '1.7': {
            translateY: getBigImageOffsetWidth(1),
            translateX: getBigImageOffsetWidth(3)
        },
        '1.8': {
            translateY: getBigImageOffsetWidth(2),
            translateX: getBigImageOffsetWidth(0)
        },
        '1.9': {
            translateY: getBigImageOffsetWidth(2),
            translateX: getBigImageOffsetWidth(1)
        },
        '2': {
            translateY: getBigImageOffsetWidth(2),
            translateX: getBigImageOffsetWidth(2)
        },
        '2.1': {
            translateY: getBigImageOffsetWidth(2),
            translateX: getBigImageOffsetWidth(3)
        },
        '2.2': {
            translateY: getBigImageOffsetWidth(3),
            translateX: getBigImageOffsetWidth(0)
        },
        '2.3': {
            translateY: getBigImageOffsetWidth(3),
            translateX: getBigImageOffsetWidth(1)
        },
        '2.4': {
            translateY: getBigImageOffsetWidth(3),
            translateX: getBigImageOffsetWidth(2)
        },
        '2.5': {
            translateY: getBigImageOffsetWidth(3),
            translateX: getBigImageOffsetWidth(3)
        },
        '2.6': {
            translateY: getBigImageOffsetWidth(4),
            translateX: getBigImageOffsetWidth(0)
        },
        '2.7': {
            translateY: getBigImageOffsetWidth(4),
            translateX: getBigImageOffsetWidth(1)
        }
    },
    'ret-img-2': {
        '3.1 3.15': {
            opacity: 1
        },
        '0 2.9 3.2': {
            opacity: .3
        }
    },
    'ret-img-3': {
        '3.3 3.65': {
            opacity: 1
        },
        '0 3.2 3.7': {
            opacity: .3
        }
    },
    'ret-img-4': {
        '3.8 4.05': {
            opacity: 1
        },
        '0 3.7 4.1': {
            opacity: .3
        }
    },
    'ret-img-5': {
        '0 4.2 4.75': {
            opacity: 1
        },
        '0 4.1 4.8': {
            opacity: .3
        }
    },
    'mid-anim': {
        '0 4.8': {
            scale: .5,
            opacity: 0
        },
        '4.8': {
            translate: '39%, -177%'
        },
        '5.4': {
            scale: 1,
            translate: '0, 0',
            opacity: 1
        }
    },
    'mid-anim-img@step-start': {
        '5.1': {
            translateY: getMidImgOffsetY(0),
            translateX: getMidImgOffsetX(0)
        },
        '5.3': {
            translateY: getMidImgOffsetY(0),
            translateX: getMidImgOffsetX(1)
        },
        '5.5': {
            translateY: getMidImgOffsetY(0),
            translateX: getMidImgOffsetX(2)
        },
        '5.7': {
            translateY: getMidImgOffsetY(0),
            translateX: getMidImgOffsetX(3)
        },
        '5.9': {
            translateY: getMidImgOffsetY(1),
            translateX: getMidImgOffsetX(0)
        },
        '6.1': {
            translateY: getMidImgOffsetY(1),
            translateX: getMidImgOffsetX(1)
        },
        '6.3': {
            translateY: getMidImgOffsetY(1),
            translateX: getMidImgOffsetX(2)
        },
        '6.5': {
            translateY: getMidImgOffsetY(1),
            translateX: getMidImgOffsetX(3)
        },
        '6.7': {
            translateY: getMidImgOffsetY(2),
            translateX: getMidImgOffsetX(0)
        },
        '6.9': {
            translateY: getMidImgOffsetY(2),
            translateX: getMidImgOffsetX(1)
        },
        '7.1': {
            translateY: getMidImgOffsetY(2),
            translateX: getMidImgOffsetX(2)
        },
        '7.3': {
            opacity: 1
        },
        '7.5': {
            opacity: 0
        }
    },
    'container@step-start': {
        '7.3': {
            opacity: 1
        },
        '8.9': {
            opacity: 0
        }
    },
    'paper': {
        '0 7.1': {
            opacity: 0
        },
        '7.3': {
            opacity: 1
        }
    },
    'paper-img@step-start': {
        '7.3': {
            translateX: getPaperOffsetX(0)
        },
        '7.4': {
            translateX: getPaperOffsetX(1)
        },
        '7.5': {
            translateX: getPaperOffsetX(2)
        },
        '7.6': {
            translateX: getPaperOffsetX(3)
        },
        '7.7': {
            translateX: getPaperOffsetX(4)
        },
        '7.8': {
            translateX: getPaperOffsetX(5)
        },
        '7.9': {
            translateX: getPaperOffsetX(6)
        },
        '8': {
            translateX: getPaperOffsetX(7)
        },
        '8.1': {
            translateX: getPaperOffsetX(8)
        },
        '8.2': {
            translateX: getPaperOffsetX(9)
        },
        '8.3': {
            translateX: getPaperOffsetX(10)
        },
        '8.5': {
            translateX: getPaperOffsetX(11)
        },
        '8.6': {
            translateX: getPaperOffsetX(12)
        },
        '8.7': {
            translateX: getPaperOffsetX(13)
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
    debug: true,

    /**
     * 日志前缀
     * 用于通信时信息验证，一般默认即可
     *
     * @type {string}
     */
    msgPrefix: window.name || null
});

document.body.addEventListener('click', function (evt) {
    sdk.sendLog(BdAdSdk.Xuandong.LOG_TYPE.TRACE, '用户点击浮层');
}, false);

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



