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

window.addEventListener('message', function (e) {
    for (var i = 0; i < e.data.length; i++) {
        var dom = document.getElementById('link_url' + (i + 1));
        if (dom) {
            dom.setAttribute('href', e.data[i]['rcv_url']);
        }
    }
});

var sdk = new BdAdSdk.Xuandong({
    debug: false,
    msgPrefix: window.name || null
});
sdk.sendLog('loaded');

Util.on(document.body, 'click', function (evt) {
    sdk.sendLog('trace', '点击 ' + evt.target.id);
});

function startXuandong() {
    setTimeout(function () {
        sdk.sendLog('stop');
    }, 7000);
    sdk.sendLog(BdAdSdk.Xuandong.LOG_TYPE.START);

    group.start();
}


var container = document.getElementById('container');
var containerW = 355;
var containerH = 355;

function getViewWidth() {
    var viewWidth = Math.min(window.screen.availWidth, window.screen.width);
    var doc = document;
    var client = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;

    return Math.min(client.clientWidth, viewWidth);
}
function getViewHeight() {
    var viewHeight = Math.min(window.screen.availHeight, window.screen.height);
    var doc = document;
    var client = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;

    return Math.min(client.clientHeight, viewHeight);
}
function calculateScale () {
    var bodyw = getViewWidth();
    var bodyh = getViewHeight();

    var scalex = bodyw / containerW;
    var scaley = (bodyh - 93) / containerH;
    var minscale = Math.min(scalex, scaley) * 0.9;
    var scale = 'scale(' + minscale + ')';

    container.style.top = ((bodyh - minscale * containerH - 93) / 2 + (minscale - 1) * containerH / 2) + 'px';
    container.style.left = ((bodyw - minscale * containerW) / 2 + (minscale - 1) * containerW / 2) + 'px';

    container.style.transform = scale;
    container.style.msTransform = scale;
    container.style.mozTransform = scale;
    container.style.webkitTransform = scale;
    container.style.oTransform = scale;
}

document.body.onresize = calculateScale;
calculateScale();

var imgs = document.getElementsByTagName('img');
var len = imgs.length;
var loaded = 0;
for (var i = 0; i < len; i++) {
    imgs[i].onload = function () {
        loaded++;
        if (loaded === len) {
            startXuandong();
        }
    };
}

