var r = 4;
var c = 7;
var innerHTML = '';
var cpl = Compiler.instance();
cpl.defineClass('fragment', {
    width: '100px',
    height: '100px',
    float: 'left'
});
var scene = new ClassProxy('scene', {
    width: '700px',
    height: '400px',
    position: 'relative',
    top: '50%',
    margin: '-200px auto'
});
for (var i = 0 ; i < r; i++) {
    for (var j = 0; j < c; j++) {
        innerHTML += '<div class="fragment pic-' + i + '-' + j + '"></div>';
        scene.selector('pic-' + i + '-' + j, {
            'background-image': 'url(images/life.jpg)',
            'background-position': (- j * 100) + 'px ' + (- i * 100) + 'px'
        });
    }
}
cpl.compile();
document.getElementById('container').innerHTML = innerHTML;
var btn = document.getElementsByTagName('input');
Util.on(btn[0], 'change', function (e) {
    if (e.target.checked) {
        Util.addClass(container, '');
    }
    else {
        Util.removeClass(container, 'hidden');
    }
});
