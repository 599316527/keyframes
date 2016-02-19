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
var proxy = new ClassProxy('scene', {
        'width': '200px',
        'height': '200px',
        'margin': '150px auto',
        'position': 'relative',
        'transform-style': 'preserve-3d'
    });
cpl.compile();
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
α�෽��(hover, focus, before, after)
```js
var cpl = Compiler.instance();
var proxy.hover({'color': 'red'});
cpl.compile();
```
```css
.scene:hover {
    color: red;
}
```
###3.2 update class

###3.3 create keyframes

###3.4 update keyframes

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