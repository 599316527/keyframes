define(["Pitch","Util","Checker","Event","EventEmitter"],function(n,t,e,i,r){function a(){a.superClass.call(this);var t=new n,e=this;t.use("prefixOnly","text-shadow backface-visibility transition transition-timing-function animation-timing-function transform-origin transform-style perspective-origin perspective",function(n,t){return"transform"===t&&(t=e.prefix+t),e.prefix+n+":"+t+";"}),t.use("needAll","box-shadow border-radius",function(n,t){return e.prefix+n+":"+t+";"+n+":"+t+";"}),t.use("extend","translateX translateY translateZ translate translate3d rotateX rotateY rotateZ rotate rotate3d skewX skewY skewZ skew scaleZ scaleX scaleY scale3d scale ",function(n,t,e){return"transform"in e?e.transform+=" "+n+"("+t+")":e.transform=n+"("+t+")",""}),t.use("transform","transform",function(n,t,e){return"transform"in e?e.transform+=" "+t:e.transform=t,""}),t.use("animation","animation",function(n,t){return e.prefix+n+":"+e.parseAnimation(t)+";"}),t.use("specialA","background",function(n,t){return n+":"+t.replace(/linear-gradient/g,e.prefix+"linear-gradient")+";"}),t.use("specialB","mask-image",function(n,t){return e.prefix+n+":"+t.replace(/linear-gradient/g,e.prefix+"linear-gradient")+";"}),t.use("rest","*",function(n,t){return n+":"+t+";"}),this._pitch=t,this._combine=new n("combine","transform",function(n,t){return e.prefix+n+":"+t+";"})}return t.inherit(a,r),a.prototype.prefix=function(){var n=navigator.userAgent,t=n.indexOf("Opera")>-1,e=n.indexOf("Maxthon")>-1,i=!t&&n.indexOf("compatible")>-1&&n.indexOf("MSIE")>-1||n.indexOf("Trident")>-1,r=n.indexOf("Firefox")>-1,a=n.indexOf("Safari")>-1&&n.indexOf("Chrome")<1,o=n.indexOf("Chrome")>-1,s=n.indexOf("WebKit")>-1;return i?"-ms-":s||a||o||e?"-webkit-":t?"-o-":r?"-moz-":""}(),a._keyMap={animation:["animation"],name:["animationName"],duration:["animationDuration","1s"],"function":["animationTimingFunction","linear"],delay:["animationDelay","0s"],count:["animationIterationCount",1],direction:["animationDirection","normal"],state:["animationPlayState","running"],mode:["animationFillMode","forwards"]},a.prototype.parseAnimation=function(n){function i(n,t){return t in r?r[t]:a._keyMap[t][1]}e.array.check(arguments)||(n=[n]);var r,o=[],s=this.animationTpl();return t.each(n,function(n){r=n,o.push(s.replace(/<(.*?)>/g,i))}),o.join(",")},a.prototype.animationTpl=function(){return this._animationTpl||("-moz-"===this.prefix?(this._animationTpl="<duration> <function> <delay> <direction> <mode> <count> <state> <name>",this._closeReg={start:"\\s",end:"(?:\\s*)$"}):(this._animationTpl="<name> <duration> <function> <delay> <count> <direction> <mode>",this._closeReg={start:"^(?:\\s*)",end:"\\s"})),this._animationTpl},a.prototype.regExp=function(n){return new RegExp(this._closeReg.start+n+this._closeReg.end)},a.prototype.keyframe=function(n){return"@"+this.prefix+"keyframes "+n},a.prototype.percent=function(n){n=(n+"").trim();var t=n.split(/\s+/);return t.join("%, ")+"%"},a.prototype.patchCombine=function(n,t){return this._combine["do"](n+" ",t)},a.prototype.patch=function(n,t,e){return this._pitch["do"](n+" ",t,e)},a.instance=function(){return a._compatible||(a._compatible=new a),a._compatible},a.prototype.css=function(n,e,r){e=this.parseCSS(e);var a=this;return r||""===r?void this.requestAnimationFrame(function(){t.css(n,e,r),a.emit(i.css,n,e,r)}):t.css(n,e)},a.prototype.parseCSS=function(n){var t=this.prefix.replace(/-/g,"");return a.prototype.parseCSS="moz"===t?function(n){return n in a._keyMap?a._keyMap[n][0]:n}:function(n){return n in a._keyMap?(n=a._keyMap[n][0],t+n[0].toUpperCase()+n.substr(1)):n},this.parseCSS(n)},a.prototype.parseEvent=function(n){var t=this.prefix.replace(/-/g,"");return a.prototype.parseEvent="moz"===t?function(n){return"animation"+n.toLowerCase()}:function(n){return t+"Animation"+n},this.parseEvent(n)},a.prototype.requestAnimationFrame=function(){return window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(n){window.setTimeout(n,1e3/60)}}(),function(n){window.requestAnimationFrame(n)}}(),a});