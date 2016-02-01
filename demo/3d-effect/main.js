var imgs = ['life', 'koi', 'peacock'];
var index = 0;
var next = 1;
var r = 4;
var c = 7;
var cpl = Compiler.instance();
var width = parseInt(document.body.clientWidth);
var scale = 1;
if (width < 600) {
    scale = (width / 800).toFixed(2);
}
cpl.defineClass('stage', {
    width: '800px',
    'transform-origin': '0 0',
    'transition': 'all linear 1s',
    'display': 'none',
    'opacity': 0,
    'transform': 'scale(' + scale + ')'
});
cpl.defineClass('fragment', {
    width: '100px',
    height: '100px',
    float: 'left'
});
var scene = new ClassProxy('scene', {
    width: '700px',
    height: '400px',
    'transform-style': 'preserve-3d',
    'perspective': '400px',
    'margin': '50px auto',
    'border-radius': '5px',
    'border': '6px solid white'
});
function init() {
    var innerHTML = '';
    for (var i = 0 ; i < r; i++) {
        for (var j = 0; j < c; j++) {
            innerHTML += '<div class="fragment ani-' + i + '-' + j +' pic-' + i + '-' + j + '"></div>';
        }
    }
    document.getElementById('container').innerHTML = innerHTML;
    initEffect();
}
function initEffect() {
    for (var i = 0 ; i < r; i++) {
        for (var j = 0; j < c; j++) {
            scene.selector('pic-' + i + '-' + j, {
                'background-image': 'url(images/' + imgs[index] + '.jpg)',
                'background-position': (- j * 100) + 'px ' + (- i * 100) + 'px'
            });
            scene.selector('ani-' + i + '-' + j, {
            });
        }
    }
    cpl.defineClass('canvas', {
        'background-image': 'url(images/' + imgs[next] +'.jpg)',
        'transition': 'all linear 1s'
    });
    index = (index + 1) % imgs.length;
    next = (next + 1) % imgs.length;
    cpl.compile();
}
init();
setTimeout(function () {
    Util.css(document.getElementsByClassName('stage')[0], {'opacity': 1, display: 'block'});
}, 1000);
var btn = document.getElementsByTagName('input');
Util.on(btn[0], 'click', function (e) {
    for (var i = 0 ; i < r; i++) {
        for (var j = 0; j < c; j++) {
            var x = Math.round(Math.random());
            if (Math.random() < 0.5) {
                x = -x;
            }
            var y = Math.round(Math.random());
            if (Math.random() < 0.5) {
                y = -y;
            }
            scene.selector('ani-' + i + '-' + j, {
                'transform': 'translateZ(260px) rotate3d(' + x +', ' + y + ', 0, 60deg)',
                'opacity': 0,
                'transition': 'all ease-in ' + Math.random().toFixed(2) + 's'
            });
        }
    }
    cpl.compile();
    setTimeout(initEffect, 1000);
});
