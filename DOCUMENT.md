keyframesʹ���ĵ�
========

 [1 ǰ��](#1-preface)

 [2 ��](#2-start)

 [3 ��̬class��keyframes](#3-dynamic-classkeyframes)
                          
����[3.1 ���class](#31-create-class)

����[3.2 ����class](#32-update-class)

����[3.3 ���keyframes](#33-create-keyframes)

����[3.4 ����keyframes](#34-update-keyframes)

 [4 ����Ԫ�ض���](#4-apply-animation)

����[4.1 ��Ԫ���붯��](#41-bind-domanimation)

����[4.2 ����״̬](#42-monitor-animation)

����[4.3 ���ƶ���](#43-control-animation)

[5 ʵսʱ����](#5-timeline-in-action)

����[5.1 ���class](#51-create-class)

����[5.2 ���keyframes](#52-create-keyframes)

����[5.3 ��Ԫ���붯��](#53-bind-domanimation)

����[5.4 ����](#54-demo)

## 1 preface

css3������Ϊflash������һ��������俪����ʽ�Ǳ�дcss��ʽ�ļ��������ж�̬�ԡ�keyframes��������ڶ�̬���class��keyframes��ͬʱ֧�ֽ�����ʱ����������ɶ�����;�����򻯶����ĵı�д��͸�������Ŀ����Լ�����ʹ�����߽����ľ���Ͷ�뵽�����Ĵ��졣

## 2 start

����ѹ����Ĵ����ļ�������������html�ļ��У�����ʹ��cdn���ļ���ַ��
```html
<script src="//static.leanote.top/keyframes/dist/lib/Keyframe.min.js"></script>
```
## 3 dynamic class&keyframes

###3.1 create class
```js
// by ClassProxy
var cpl = Compiler.instance();
// Ҳ���Ե���Keyframe.defineClass
var proxy = new ClassProxy('scene', {
        'width': '200px',
        'height': '200px',
        'margin': '150px auto',
        'position': 'relative',
        'transform-style': 'preserve-3d'
    });
cpl.compile();   // Ҳ���Ե���Keyframe.compile()
```
```css
.scene {
    width: 200px;
    height: 200px;
    margin: 150px auto;
    position: relative;
    -webkit-transform-style: preserve-3d;  //�Զ����������ǰ׺
}
```
####α�෽��(hover, focus, before, after)
```js
proxy.hover({'color': 'red'});
cpl.compile();
```
```css
.scene:hover {
    color: red;
}
```
####���෽��(selector, selectors)
```js
proxy.selector('init', {
        'background-color': randomColor(),
        'border': '1px solid ' + randomColor(),
        'color': randomColor()
    });
proxy.selectors({
        'big-cube': {
            'opacity': 0.5
        },
        'small-cube': {
            'width': '150px',
            'height': '150px',
        }
    });
cpl.compile();
```
```css
.scene .init {
    background-color: #xxx;
    border: 1px solid #xxx;
    color: #xxx;
}
.scene .big-cube {
    opacity: 0.5;
}
.scene .small-cube {
     width: 150px;
     height: 150px;
 }
```
####�������(��ָ������)
```js
var mixClass = new ClassProxy({
        'width': '200px',
        'height': '200px',
        'transform-style': 'preserve-3d'
    });
console.log(mixClass.getName()); // ����������磺Xn9gQ41e
cpl.compile();
```
```css
.Xn9gQ41e {
    width: 200px;
    height: 200px;
    -webkit-transform-style: preserve-3d;   // �Զ����������ǰ׺
}
```

###3.2 update class
####��ʼ����ʽ
```js
var cpl = Compiler.instance();
// Ҳ���Ե���Keyframe.defineClass
var proxy = new ClassProxy({
        'width': '200px',
        'height': '200px',
        'margin': '150px auto',
        'position': 'relative',
        'transform-style': 'preserve-3d'
    });
proxy.hover({'color': 'red'});
cpl.compile();   // Ҳ���Ե���Keyframe.compile()
```
```css
.Xn9gQ41e {
    width: 200px;
    height: 200px;
    margin: 150px auto;
    position: relative;
    -webkit-transform-style: preserve-3d;  //�Զ����������ǰ׺
}
.Xn9gQ41e:hover {
    color: red;
}
```
####���º���ʽˢ��
```js
proxy.rewrite({
        'width': '100px',
        'height': '100px'
    });
proxy.rewrite({'color': 'blue'}, 'hover');
cpl.compile();
```
```css
.Xn9gQ41e {
    width: 100px;
    height: 100px;
}
.Xn9gQ41e:hover {
    color: blue;
}
```
###3.3 create keyframes
```js
var cpl = Compiler.instance();
// ���ߵ���Keyframe.defineKeyframe
var proxy = cpl.defineKeyframe({
    '0 50': {
        'rotateY': '0'
    },
    '100': {
        'rotateY': '360deg'
    }
});
console.log(proxy.getName()); // P236bM6I���
cpl.compile(); // ���ߵ���Keyframe.compile()
```
```css
@-webkit-keyframes P236bM6I {
    0%, 50% {
        -webkit-transform: rotateY(0);
    }
    100% {
        -webkit-transform: rotateY(360deg);
    }
}
```
###3.4 update keyframes
```js
// ��3.3��ɵ�proxy���ϸ���
proxy.rewrite({
    '0': {
        'rotateY': '20deg'
    },
    '100': {
        'rotateY': '360deg'
    }
});
console.log(proxy.getName()); // P236bM6I���ֲ���
cpl.compile(); // ���ߵ���Keyframe.compile()
```
```css
@-webkit-keyframes P236bM6I {
    0% {
        -webkit-transform: rotateY(20deg);
    }
    100% {
        -webkit-transform: rotateY(360deg);
    }
}
```
```js
// ����ͨ���ض��帲��
proxy = cpl.defineKeyframe(proxy.getName(), {
    '0': {
        'rotateY': '20deg'
    },
    '100': {
        'rotateY': '360deg'
    }
});
console.log(proxy.getName()); // P236bM6I���ֲ���
cpl.compile(); // ���ߵ���Keyframe.compile()
```
##4 apply animation

###4.1 bind dom&animation
####���Ե�
```js
Keyframe.defineKeyframe('zoomIn', {
    '0': {
        'scale3d': '.3, .3, .3',
        'opacity': 0
    },
    '50': {
        'opacity': 1
    }
});
// ��dom�ϰ�һ������
var oneToOne = new Keyframe(document.getElementById('demo'), {
    'name': 'zoomIn',
    'duration': '1.8s',
    'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out cub
    'count': 1, // 'infinite',
    'delay': '200ms',
    'direction': 'normal' // 'alternate'
});
```
####���Զ�
```js
Keyframe.defineKeyframe('speedIn', {
    '0': {
        'translate3d': '100%, 0, 0',
        'skewX': '-30deg',
        'opacity': 0
    },
    '60': {
        'skewX': '20deg',
        'opacity': 1
    },
    '80': {
        'skewX': '-5deg'
    },
    '100': {
        'transform': 'none'
    }
});
// ��dom�ϰ󶨶������
var oneToMany = new Keyframe(document.getElementById('demo'), [
    {
        'name': 'zoomIn',
        'duration': '1.8s',
        'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out
        'count': 1, // 'infinite',
        'delay': '200ms',
        'direction': 'normal' // 'alternate'
    },
    {
        'name': 'speedIn',
        'duration': '2s' // default 1s
    }
]);
```
###4.2 monitor animation
```js
oneToMany.on(Event.start, function () {});
oneToMany.on(Event.iteration, function () {});
oneToMany.on(Event.end, function () {});
```
###4.3 control animation
####��ʼ
```js
oneToOne.start();
oneToMany.start();
```
####��ͣ
```js
oneToOne.pause();
oneToMany.pause(); // ��ͣ���ж���
oneToMany.pause('zoomIn'); // ��ָͣ������
```
####����
```js
oneToOne.goon();
oneToMany.goon(); // �������ж���
oneToMany.goon('zoomIn'); // ����ָ������
```
####����
```js
oneToOne.restart();
oneToMany.restart(); // �������ж���
```
####���
```js
oneToOne.clear();
oneToMany.clear(); // �������ж���
```
##5 timeline in action
ʹ��Keyframe��ɻ��ڽ����Ķ�����ʵ�ʿ����У���������������ض�dom��ʱ���ᶯ���������������group�������ڼ򻯶���������󶨡�

###5.1 create class
```js
var config = {
    // �����class��
    'class': {
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
    }
};
var group = Keyframe.group(config);
```
```css
.container {
    -webkit-perspective: 800px; // �Զ�����ǰ׺
    -webkit-perspective-origin: 50% 40%;
}

.stage {
    -webkit-transform-style: preserve-3d;
}

.box-3d {
    -webkit-transform-style: preserve-3d;
    -webkit-perspective: 600px;
}

.hidden .plane {
    -webkit-backface-visibility: hidden;
}

.plane {
    position: absolute;
    -webkit-transition: all ease-in-out 2s;
    text-align: center;
    -webkit-backface-visibility: visible;
    width: 200px;
    height: 200px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    font-size: 100px;
    line-height: 200px;
    opacity: 0.7;
}
```
###5.2 create keyframes
```js
var config = {
    'shape#infinite': {
                 '2.1': {
                     'rotateY': '0deg'
                 },
                 '12': {
                     'rotateY': '-360deg'
                 }
    }
};
var group = Keyframe.group(config);
```
```css
@-webkit-keyframes xV38lnYg
{
  0%
  {
    -webkit-transform: rotateY(0deg);
  }

  100%
  {
    -webkit-transform: rotateY(-360deg);
  }
}
```
###5.3 bind dom&animation

###��ʱ���ᶯ��
����Ҫ�����ӳٺͳ���ʱ�䣬�Ѱ�ʱ����������
```js
var config = {
    'shape#infinite': {
                 '2.1': {
                     'rotateY': '0deg'
                 },
                 '12': {
                     'rotateY': '-360deg'
                 }
    }
};
var group = Keyframe.group(config);
```
```css
@-webkit-keyframes xV38lnYg
{
  0%
  {
    -webkit-transform: rotateY(0deg);
  }

  100%
  {
    -webkit-transform: rotateY(-360deg);
  }
}
```
```html
// ͨ���������ã��Ѿ���Ԫ�غͶ����󶨣��Զ�����style
<div id="shape" style="animation: xV38lnYg 9.9s linear 2.1s infinite normal forwards;"></div>
```
###�󶨽���ᶯ��
```js
var rot = Keyframe.defineKeyframe({
    40: { 'background': 'hsla(253, 85%, 25%, 1)'},
    100: { 'rotateX': '-360deg'}
}).getName();
var timeline = {
    'class': {
        'gen': {
            'position': 'relative',
            'width': '1px',
            'height': '200px',
             'display': 'inline-block',
            'margin': '10px 6px',
            'background': 'hsla(243, 100%, 85%, 1)',
            'box-shadow': '1px 1px 1px 1px hsla(0,0%,0%,0.2)',
            'transition': 'all 1s ease'
        },
        'gen:after': {
            'position': 'absolute',
            'left': '-2px',
            'border-radius': '50%',
            'width': '12px',
            'height': '10px',
            'box-shadow': '2px 2px 2px 2px hsla(0,0%,0%,0.25)',
            'background': 'hsla(243, 95%, 85%, 1)',
            'content': '""',
            'bottom': '-2px'
        }
    },
    'idSelector#infinite~5s_2.1s@linear>alternate': rot  // �󶨽���ᶯ������Ҫ����ʱ�����ӳ�
};
timeline['.classSelector#infinite~5s_2.1s@linear>alternate'] = rot; // ֧��idѡ������classѡ����
var group = Keyframe.group(timeline);
group.start();
```
```css
.gen {
    position: relative;
    width: 1px;
    height: 200px;
    display: inline-block;
    margin: 10px 6px;
    background: hsla(243, 100%, 85%, 1);
    -webkit-box-shadow: 1px 1px 1px 1px hsla(0, 0%, 0%, 0.2);
    box-shadow: 1px 1px 1px 1px hsla(0, 0%, 0%, 0.2);
    -webkit-transition: all 1s ease;
}

.gen:before {
    position: absolute;
    left: -2px;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    width: 12px;
    height: 10px;
    -webkit-box-shadow: 2px 2px 2px 2px hsla(0, 0%, 0%, 0.25);
    box-shadow: 2px 2px 2px 2px hsla(0, 0%, 0%, 0.25);
    background: hsla(243, 95%, 85%, 1);
    content: "";
    top: -2px;
}

@-webkit-keyframes WuHfsn54 {
    40% {
        background: hsla(253, 85%, 25%, 1);
    }
    100% {
        -webkit-transform: rotateX(-360deg);
    }
}
```
```html
// ͨ���������ã��Ѿ���Ԫ�غͶ����󶨣��Զ�����style
<div id="idSelector" style="animation: xV38lnYg 9.9s linear 2.1s infinite normal forwards;"></div>
<div class="classSelector gen" style="animation: WuHfsn54 9.9s linear 2.1s infinite normal forwards;"></div>
<div class="classSelector gen" style="animation: WuHfsn54 9.9s linear 2.1s infinite normal forwards;"></div>
```
####��������
�﷨: (idѡ����|classѡ����)[#animation-count][@animation-timing-function][>animation-direction][_animation-delay][~animation-duration]

idSelector#infinite~5s_2.1s@linear>alternate

.classSelector#infinite~5s_2.1s@linear>alternate

<table>
<tr><td>ǰ׺��</td><td>ӳ������</td><td>Ĭ��ֵ</td><td>��ѡֵ</td><td>���÷�Χ</td></tr>
<tr><td>@</td><td>animation-timing-function</td><td>linear</td><td>linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n)</td><td>ʱ����&�����</td></tr>
<tr><td>#</td><td>animation-count</td><td>1</td><td>1,2,...|infinite</td><td>ʱ����&�����</td></tr>
<tr><td>></td><td>animation-direction</td><td>normal</td><td>normal|alternate</td><td>ʱ����&�����</td></tr>
<tr><td>_</td><td>animation-delay</td><td>0</td><td></td><td>�����</td></tr>
<tr><td>~</td><td>animation-duration</td><td></td><td></td><td>�����</td></tr>
</table>

###5.4 demo

[Examples](http://static.leanote.top/keyframes/demo/doc.html)
![http://static.leanote.top/keyframes/demo/doc.html](https://github.com/tingkl/keyframes/raw/master/gif/demo.gif)