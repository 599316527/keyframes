keyframes使用文档
========

 [1 前言](#1-preface)

 [2 起步](#2-start)

 [3 动态class和keyframes](#3-dynamic-classkeyframes)
                          
　　[3.1 生成class](#31-create-class)

　　[3.2 更新class](#32-update-class)

　　[3.3 生成keyframes](#33-create-keyframes)

　　[3.4 更新keyframes](#34-update-keyframes)

 [4 控制元素动画](#4-control-animation)

　　[4.1 绑定元素与动画](#41-bind-domanimation)

　　[4.2 监听动画状态](#42-monitor-animation)

　　[4.3 启动动画](#43-start-animation)

　　[4.4 暂停动画](#44-pause-animation)

　　[4.5 重启动画](#45-restart-animation)

　　[4.6 清理动画](#46-clear-animation)

[5 实战时间轴](#5-timeline-in-action)

　　[5.1 生成class](#51-create-class)

　　[5.2 生成keyframes](#52-create-keyframes)

　　[5.3 绑定元素与动画](#53-bind-domanimation)

## 1 preface

css3动画作为flash动画的一种替代方案，其开发方式是编写css样式文件，不具有动态性。keyframes类库致力于动态生成class和keyframes，为开发者提供一种友好的开发方式，简化动画的的编写，透明动画的控制以及监听，使开发者将更多的精力投入到动画的创造。

## 2 start

下载压缩后的代码文件，并将它包含到你的html文件中，或者使用cdn的文件地址。
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
    -webkit-transform-style: preserve-3d;  //自动适配浏览器前缀
}
```
伪类方法(hover, focus, before, after)
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