keyframes & transform
========

#### JavaScript keyframes and transform library ####

The aim of the project is to create a lightweight CSS3 keyframes and transform library with a higher level of accessibility. The library provides &lt;keyframes&gt; and &lt;transform&gt; ways to create css animation.

[Examples](http://ecmc.bdimg.com/public01/keyframes/demo/doc.html)
![](https://github.com/tingkl/keyframes/raw/master/jpg/demo.JPG)
[Documentation](http://ecmc.bdimg.com/public01/keyframes/index.html)
![](https://github.com/tingkl/keyframes/raw/master/jpg/index.JPG)
[Effect](http://ecmc.bdimg.com/public01/keyframes/example/index.html)
![](https://github.com/tingkl/keyframes/raw/master/jpg/example.JPG)
[Migrating](https://github.com/tingkl/keyframes)


### Usage ###

Download the [minified library](http://ecma.bdimg.com/public01/keyframes/dist/lib/Keyframe.min.js) and include it in your html.

```html
<script src="keyframes/dist/lib/Keyframe.min.js"></script>
```
(Keyframes based animation group)
This code creates a timeline which binds the target dom element with the animation config. Finally it creates css3 keyframes and  animates the whole timeline.

```html
<script>
// 自动缩放
var defaultEntryWidth = 230;
var suposeScreenWidth = 600;
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
</script>
```
If everything went well you should see [this](http://ecma.bdimg.com/public01/keyframes/demo/middle/index.app.html).


(ClassProxy based animation group)
This code creates a 3D cube with css3 style created by Javascript. Finally it refresh css3 style to animates the whole transform.

```html
<script>
var config = {
    'class': {
        // safari浏览器必须包一层container，否则显示有问题，蛋疼，其他浏览器可以不包
        'container': {
            'perspective': '800px',
            'perspective-origin': '50% 40%'
        },
        'stage': {
            'transform-style': 'preserve-3d'
        },
        'box-3d': {
            'transform-style': 'preserve-3d',
            'perspective': '600px'
        },
        'hidden plane': {
            'backface-visibility': 'hidden'
        },
        'plane': {
            'position': 'absolute',
            'transition': 'all ease-in-out 2s',
            'text-align': 'center',
            'backface-visibility': 'visible',
            'width': '200px',
            'height': '200px',
            'border-radius': '10px',
            'font-size': '100px',
            'line-height': '200px',
            'opacity': 0.7
        }
    },
    'shape#infinite': {
        '0': {
            'transform': 'rotateY(0deg)'
        },
        '12': {
            'transform': 'rotateY(-360deg)'
        }
    }
};
var cpl = Compiler.instance();
function randomColor() {
    var map = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    var color = '#';
    var count = 6;
    while (count-- > 0) {
        color += map[Math.round(Math.random() * 14)]
    }
    return color;
}
var cube = new ClassProxy('cube', {
    'width': '200px',
    'height': '200px',
    'margin': '150px auto',
    'position': 'relative',
    'transform-style': 'preserve-3d'
});
function state1() {
    cube.selectors({
        'plane': {
            'background-color': randomColor(),
            'border': '1px solid ' + randomColor(),
            'color': randomColor()
        },
        'cube-1': {
            // 先scale之后，后面的translate都是放大的，比如translateZ 100px 其实是 120px,要对z面生效必须scale3d
            // rotateX(90deg)后 ，z面其实是原先的x面
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateX(90deg) translateZ(100px)'
        },
        'cube-2': {
            'transform': 'scale3d(1.2, 1.2, 1.2) translateZ(100px)'
        },
        'cube-3': {
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateY(90deg) translateZ(100px)'
        },
        'cube-4': {
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateY(180deg) translateZ(100px)'
        },
        'cube-5': {
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateY(-90deg) translateZ(100px)'
        },
        'cube-6': {
            'transform': 'scale3d(1.2, 1.2, 1.2) rotateX(-90deg) translateZ(100px) rotate(180deg)'
        },
        'cube-7': {
            // 先scale之后，后面的translate都是放大的，比如translateZ 100px 其实是 120px
            // rotateX(90deg)后 ，z面其实是原先的x面
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateX(90deg) translateZ(100px)'
        },
        'cube-8': {
            'transform': 'scale3d(0.8, 0.8, 0.8) translateZ(100px)'
        },
        'cube-9': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(90deg) translateZ(100px)'
        },
        'cube-10': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(180deg) translateZ(100px)'
        },
        'cube-11': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(-90deg) translateZ(100px)'
        },
        'cube-12': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateX(-90deg) translateZ(100px) rotate(180deg)'
        }
    });
    cpl.compile();
}
function state2() {
    cube.selectors({
        'plane': {
            'background-color': randomColor(),
            'border': '1px solid ' + randomColor(),
            'color': randomColor()
        },
        'cube-1': {
            'transform': 'scale3d(0.8, 0.8, 0.8)' + distance
        },
        'cube-2': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(30deg)' + distance
        },
        'cube-3': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(60deg)' + distance
        },
        'cube-4': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(90deg)' + distance
        },
        'cube-5': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(120deg)' + distance
        },
        'cube-6': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(150deg)' + distance
        },
        'cube-7': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(180deg)' + distance
        },
        'cube-8': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(210deg)' + distance
        },
        'cube-9': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(240deg)' + distance
        },
        'cube-10': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(270deg)' + distance
        },
        'cube-11': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(300deg)' + distance
        },
        'cube-12': {
            'transform': 'scale3d(0.8, 0.8, 0.8) rotateY(330deg)' + distance
        }
    });
    cpl.compile();
}
var distance = Math.ceil(200 / Math.tan(Math.PI / 6)) + 20;
distance = ' translateZ(' + distance + 'px)';
var shape = document.getElementById('shape');
var btn = document.getElementsByTagName('input');
Util.on(btn[0], 'change', function (e) {
    if (e.target.checked) {
        Util.addClass(shape, 'hidden');
    }
    else {
        Util.removeClass(shape, 'hidden');
    }
});
Util.on(btn[1], 'change', function (e) {
    if (e.target.checked) {
        state2();
    }
    else {
        state1();
    }
});

setTimeout(function () {
    state1();
    var group = Keyframe.group(config);
    group.start();
}, 500);


</script>
```
If everything went well you should see [this](http://localhost:63342/lib/keyframes/demo/3d-cube/index.app.html).

### Change log ###

[releases](https://github.com/mrdoob/three.js/releases)
