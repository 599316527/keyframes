keyframesʹ���ĵ�
========

 [1 ǰ��](#1-preface)

 [2 ��](#2-start)

 [3 ��̬class��keyframes](#3-dynamic-classkeyframes)
                          
����[3.1 ����class](#31-create-class)

����[3.2 ����class](#32-update-class)

����[3.3 ����keyframes](#33-create-keyframes)

����[3.4 ����keyframes](#34-update-keyframes)

 [4 ����Ԫ�ض���](#4-control-animation)

����[4.1 ��Ԫ���붯��](#41-bind-domanimation)

����[4.2 ��������״̬](#42-monitor-animation)

����[4.3 ��������](#43-start-animation)

����[4.4 ��ͣ����](#44-pause-animation)

����[4.5 ��������](#45-restart-animation)

����[4.6 ������](#46-clear-animation)

[5 ʵսʱ����](#5-timeline-in-action)

����[5.1 ����class](#51-create-class)

����[5.2 ����keyframes](#52-create-keyframes)

����[5.3 ��Ԫ���붯��](#53-bind-domanimation)

## 1 preface

css3������Ϊflash������һ������������俪����ʽ�Ǳ�дcss��ʽ�ļ��������ж�̬�ԡ�keyframes��������ڶ�̬����class��keyframes��Ϊ�������ṩһ���ѺõĿ�����ʽ���򻯶����ĵı�д��͸�������Ŀ����Լ�������ʹ�����߽�����ľ���Ͷ�뵽�����Ĵ��졣

## 2 start

����ѹ����Ĵ����ļ������������������html�ļ��У�����ʹ��cdn���ļ���ַ��
```html
<script src="//ecmc.bdimg.com/public01/keyframes/dist/lib/Keyframe.min.js"></script>
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
####��������(��ָ������)
```js
var mixClass = new ClassProxy({
        'width': '200px',
        'height': '200px',
        'transform-style': 'preserve-3d'
    });
console.log(mixClass.getName()); // ������������磺Xn9gQ41e
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
var rot = cpl.defineKeyframe({
    '0 50': {
        'transform': 'rotateY(0)'
    },
    '100': {
        'transform': 'rotateY(360deg)'
    }
});
console.log(rot); // P236bM6I���
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
// ��3.3���ɵ�rot�����ϸ���
var cpl = Compiler.instance();
rot = cpl.defineKeyframe(rot, {
    '0': {
        'transform': 'rotateY(20deg)'
    },
    '100': {
        'transform': 'rotateY(360deg)'
    }
});
console.log(rot); // P236bM6I���ֲ���
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
##4 control animation

###4.1 bind dom&animation

###4.2 monitor animation

###4.3 start animation

###4.4 pause animation

###4.5 restart animation

###4.6 clear animation

##5 timeline in action

###5.1 create class

###5.2 create keyframes

###5.3 bind dom&animation