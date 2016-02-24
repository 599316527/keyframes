keyframes使用文档
========

 [1 前言](#1-preface)

 [2 起步](#2-start)

 [3 动态class和keyframes](#3-dynamic-classkeyframes)
                          
　　[3.1 生成class](#31-create-class)

　　[3.2 更新class](#32-update-class)

　　[3.3 生成keyframes](#33-create-keyframes)

　　[3.4 更新keyframes](#34-update-keyframes)

 [4 控制元素动画](#4-apply-animation)

　　[4.1 绑定元素与动画](#41-bind-domanimation)

　　[4.2 监听动画状态](#42-monitor-animation)

　　[4.3 控制动画](#43-control-animation)

[5 实战时间轴](#5-timeline-in-action)

　　[5.1 生成class](#51-create-class)

　　[5.2 生成keyframes](#52-create-keyframes)

　　[5.3 绑定元素与动画](#53-bind-domanimation)

## 1 preface

css3动画作为flash动画的一种替代方案，其开发方式是编写css样式文件，不具有动态性。keyframes类库致力于动态生成class和keyframes，同时支持进度轴和时间轴两种生成动画的途径，简化动画的的编写，透明动画的控制以及监听，使开发者将更多的精力投入到动画的创造。

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
// 也可以调用Keyframe.defineClass
var proxy = new ClassProxy('scene', {
        'width': '200px',
        'height': '200px',
        'margin': '150px auto',
        'position': 'relative',
        'transform-style': 'preserve-3d'
    });
cpl.compile();   // 也可以调用Keyframe.compile()
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
####伪类方法(hover, focus, before, after)
```js
proxy.hover({'color': 'red'});
cpl.compile();
```
```css
.scene:hover {
    color: red;
}
```
####子类方法(selector, selectors)
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
####类名混淆(不指定类名)
```js
var mixClass = new ClassProxy({
        'width': '200px',
        'height': '200px',
        'transform-style': 'preserve-3d'
    });
console.log(mixClass.getName()); // 随机类名，例如：Xn9gQ41e
cpl.compile();
```
```css
.Xn9gQ41e {
    width: 200px;
    height: 200px;
    -webkit-transform-style: preserve-3d;   // 自动适配浏览器前缀
}
```

###3.2 update class
####初始化样式
```js
var cpl = Compiler.instance();
// 也可以调用Keyframe.defineClass
var proxy = new ClassProxy({
        'width': '200px',
        'height': '200px',
        'margin': '150px auto',
        'position': 'relative',
        'transform-style': 'preserve-3d'
    });
proxy.hover({'color': 'red'});
cpl.compile();   // 也可以调用Keyframe.compile()
```
```css
.Xn9gQ41e {
    width: 200px;
    height: 200px;
    margin: 150px auto;
    position: relative;
    -webkit-transform-style: preserve-3d;  //自动适配浏览器前缀
}
.Xn9gQ41e:hover {
    color: red;
}
```
####更新后样式刷新
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
// 或者调用Keyframe.defineKeyframe
var proxy = cpl.defineKeyframe({
    '0 50': {
        'transform': 'rotateY(0)'
    },
    '100': {
        'transform': 'rotateY(360deg)'
    }
});
console.log(proxy.getName()); // P236bM6I随机
cpl.compile(); // 或者调用Keyframe.compile()
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
// 在3.3生成的proxy基础上更新
proxy.rewrite({
    '0': {
        'transform': 'rotateY(20deg)'
    },
    '100': {
        'transform': 'rotateY(360deg)'
    }
});
console.log(proxy.getName()); // P236bM6I保持不变
cpl.compile(); // 或者调用Keyframe.compile()
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
// 或者通过重定义覆盖
proxy = cpl.defineKeyframe(proxy.getName(), {
    '0': {
        'transform': 'rotateY(20deg)'
    },
    '100': {
        'transform': 'rotateY(360deg)'
    }
});
console.log(proxy.getName()); // P236bM6I保持不变
cpl.compile(); // 或者调用Keyframe.compile()
```
##4 apply animation

###4.1 bind dom&animation
####单对单
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
// 在dom上绑定一个动画
var oneToOne = new Keyframe(document.getElementById('demo'), {
    'name': 'zoomIn',
    'duration': '1.8s',
    'function': 'ease-in-out', // ease,linear,ease-in,ease-out,ease-in-out cub
    'count': 1, // 'infinite',
    'delay': '200ms',
    'direction': 'normal' // 'alternate'
});
```
####单对多
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
// 在dom上绑定多个动画
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
####开始
```js
oneToOne.start();
oneToMany.start();
```
####暂停
```js
oneToOne.pause();
oneToMany.pause(); // 暂停所有动画
oneToMany.pause('zoomIn'); // 暂停指定动画
```
####继续
```js
oneToOne.goon();
oneToMany.goon(); // 继续所有动画
oneToMany.goon('zoomIn'); // 继续指定动画
```
####重启
```js
oneToOne.restart();
oneToMany.restart(); // 继续所有动画
```
####清除
```js
oneToOne.clear();
oneToMany.clear(); // 清理所有动画
```
##5 timeline in action

###5.1 create class

###5.2 create keyframes

###5.3 bind dom&animation