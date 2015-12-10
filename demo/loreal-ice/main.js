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

/**
 * 动画描述
 * 使用方法见：http://bs.baidu.com/public01/keyframes/index.html
 *
 * @type {Object}
 */
var timeline = {
    'class': {
        'class-origin': {
            'transform-origin': 'left top'
        }
    },
    'mask': {
        '0 6.4': {
            opacity: 0
        },
        '0.4 6.3': {
            opacity: .8
        }
    },
    'ret-img-1': {
        '0 1 2.7': {
            opacity: 1
        },
        '0.4 0.7 2.9': {
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
        '0': {
            opacity: 1
        },
        '0.4': {
            opacity: .3
        }
    },
    'ret-img-3': {
        '0 4.3 4.6': {
            opacity: 1
        },
        '0.4 4.1 4.8': {
            opacity: .3
        }
    },
    'ret-img-4': {
        '0 3.1 3.4': {
            opacity: 1
        },
        '0.4 2.9 3.6': {
            opacity: .3
        }
    },
    'ret-img-5': {
        '0 3.6 3.9': {
            opacity: 1
        },
        '0.4 3.4 4.1': {
            opacity: .3
        }
    },
    'highlight-image': {
        '0.4 4.8': {
            opacity: 0
        },
        '0.7 4.6': {
            opacity: 1
        }
    },
    'highlight-border@step-start': {
        '0 4.1': {
            'transform-origin': 'left top',
            rotateX: '180deg'
        },
        '2.9': {
            scale: 1,
            translateY: '0px',
            translateX: '0px'
        },
        '3.2': {
            translateY: '93px',
            translateX: '278px',
            //先translate后scale
            scale: 0.5
        },
        '3.7': {
            translateY: '93px',
            translateX: '362px',
            scale: 0.5
        },
        '4.1': {
            rotateX: '0',
            translateY: '9px',
            translateX: '362px',
            scale: 0.5
        }
    },
    'mid-anim': {
        '4.8': {
            scale: .5,
            translate: '39%, -177%',
            opacity: 0
        },
        '5.1': {
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
        '5.2': {
            translateY: getMidImgOffsetY(0),
            translateX: getMidImgOffsetX(1)
        },
        '5.3': {
            translateY: getMidImgOffsetY(0),
            translateX: getMidImgOffsetX(2)
        },
        '5.4': {
            translateY: getMidImgOffsetY(0),
            translateX: getMidImgOffsetX(3)
        },
        '5.5': {
            translateY: getMidImgOffsetY(1),
            translateX: getMidImgOffsetX(0)
        },
        '5.6': {
            translateY: getMidImgOffsetY(1),
            translateX: getMidImgOffsetX(1)
        },
        '5.7': {
            translateY: getMidImgOffsetY(1),
            translateX: getMidImgOffsetX(2)
        },
        '5.8': {
            translateY: getMidImgOffsetY(1),
            translateX: getMidImgOffsetX(3)
        },
        '5.9': {
            translateY: getMidImgOffsetY(2),
            translateX: getMidImgOffsetX(0)
        },
        '6': {
            translateY: getMidImgOffsetY(2),
            translateX: getMidImgOffsetX(1)
        },
        '6.1': {
            translateY: getMidImgOffsetY(2),
            translateX: getMidImgOffsetX(2)
        },
        '6.3': {
            opacity: 1
        },
        '6.4': {
            opacity: 0
        }
    },
    'container@step-start': {
        '6.3': {
            opacity: 1
        },
        '6.4': {
            opacity: 0
        }
    },
    'paper': {
        '6.1': {
            opacity: 0
        },
        '6.3': {
            opacity: 1
        }
    },
    'paper-img@step-start': {
        '6.3': {
            translateX: getPaperOffsetX(0)
        },
        '6.4': {
            translateX: getPaperOffsetX(1)
        },
        '6.5': {
            translateX: getPaperOffsetX(2)
        },
        '6.6': {
            translateX: getPaperOffsetX(3)
        },
        '6.7': {
            translateX: getPaperOffsetX(4)
        },
        '6.8': {
            translateX: getPaperOffsetX(5)
        },
        '6.9': {
            translateX: getPaperOffsetX(6)
        },
        '7': {
            translateX: getPaperOffsetX(7)
        },
        '7.1': {
            translateX: getPaperOffsetX(8)
        },
        '7.2': {
            translateX: getPaperOffsetX(9)
        },
        '7.3': {
            translateX: getPaperOffsetX(10)
        },
        '7.5': {
            translateX: getPaperOffsetX(11)
        },
        '7.6': {
            translateX: getPaperOffsetX(12)
        },
        '7.7': {
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

// 自动缩放
var defaultEntryWidth = 375;
var defaultEntryHeight = 614;
var minEntryHeight = 460;
var maxEntryWidth = 568;
var viewportWidth = document.body.clientWidth;
var viewportHeight = document.body.clientHeight;
var scaleRatio;
var useWidth = Math.min(maxEntryWidth, viewportWidth);
var useHeight = useWidth * defaultEntryHeight / defaultEntryWidth;
if (useHeight < minEntryHeight) {
    scaleRatio = useHeight / defaultEntryHeight;
}
else {
    scaleRatio = useWidth / defaultEntryWidth;
}
var $entryStyle = document.getElementById('entry').style;
['', 'moz', 'ms', 'webkit'].forEach(function (prefix) {
    $entryStyle[prefix ? prefix + 'Transform' : 'transform']
        = 'scale( ' + scaleRatio + ')';
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



