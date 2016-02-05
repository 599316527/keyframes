define("Util",function(){var t={forIn:function(t,n,e){for(var i in t)if(n.call(e,i,t[i])===!1)return!1;return!0},forKey:function(t,n,e){for(var i in t)if(n.call(e,i)===!1)return!1;return!0},rewrite:function(n,e){return e?(t.forIn(e,function(t,e){n[t]=e}),n):n},define:function(t){t=t.split(".");for(var n,e=window;n=t.shift();)n in e||(e[n]={}),e=e[n]},extend:function(n,e){return n?(e&&t.forIn(e,function(t,e){t in n||(n[t]=e)}),n):e},inherit:function(t,n){var e=new Function;e.prototype=n.prototype,t.prototype=new e,t.prototype.constructor=t,t.superClass=n},xInA:function(n,e){var i=-1;return t.each(e,function(t,e){return t===n?(i=e,!1):void 0}),i},arg2Ary:function(t){return Array.prototype.slice.call(t,0)},each:function(t,n,e){for(var i=0,r=t.length;r>i&&n.call(e,t[i],i,t)!==!1;i++);return i===t.length},random:{seed:[[48,9],[65,25],[97,25]],generator:function(t){return String.fromCharCode(t[0]+Math.round(t[1]*Math.random()))},word:function(t){var n;return n=0===t?Math.floor(2*Math.random())+1:Math.floor(3*Math.random()),this.generator(this.seed[n])},name:function(t){t=t||6;for(var n="",e=0;t>e;e++)n+=this.word(e);return n}},addClass:function(t,n){t.className.match(new RegExp("(\\s|^)"+n+"(\\s|$)"))||(t.className=(t.className+" "+n).trim())},removeClass:function(t,n){t.className=t.className.replace(new RegExp("(\\s|^)"+n+"(\\s|$)")," ").trim()},css:function(n,e,i){return"string"==typeof e?t.$css(n,e,i):void t.forIn(e,function(e,i){t.$css(n,e,i)})},stopPropagation:function(t){t.stopPropagation()},$css:function(t,n,e){if(void 0!==e)return t.style[n]=e,e;var i=window.getComputedStyle(t,null)[n];return i?i:t.style[n]},on:function(t,n,e){t.addEventListener(n,e,!1)},off:function(t,n,e){t.removeEventListener(n,e,!1)}};return t}),define("Checker",["Util"],function(t){function n(){this._list=t.arg2Ary(arguments)}return n.prototype.check=function(n){var e=this;if(n.length!==e._list.length)return!1;var i,r,o=t.each(n,function(t,n){if(i=e._list[n],r=typeof i,"string"===r){if(typeof t!==i)return!1}else if("function"===r&&!(t instanceof i))return!1});return o},n.stringObject=new n("string","object"),n.objectString=new n("object","string"),n.object=new n("object"),n.string=new n("string"),n.ssFunction=new n("string","string","function"),n.sFunction=new n("string","function"),n.array=new n(Array),n}),define("Pitch",["Checker"],function(t){function n(n,e,i){this._router=[],t.ssFunction.check(arguments)&&this.use(n,e,i)}return n.prototype.use=function(t,n,e){return this._router.push({name:t,keys:n+" ",handler:e}),this},n.prototype.next=function(t,n,e,i){var r=this._router[t];return r?"*"===r.keys.trim()?r.handler(n.trim(),e,i):r.keys.indexOf(n)>-1?r.handler(n.trim(),e,i):this.next(t+1,n,e,i):""},n.prototype["do"]=function(t,n,e){return this.next(0,t,n,e)},n}),define("Event",function(){var t={style:"Style",css:"CSS",clear:"Clear",beforeStart:"BeforeStart",pause:"Pause",start:"Start",iteration:"Iteration",end:"End",next:"Next",over:"Over",on:"On",off:"Off",stop:"Stop",goon:"Goon",once:"Once",all:"All",emit:"Emit"};return t}),define("EventEmitter",["Checker","Event","Util"],function(t,n,e){function i(){this._triggers={}}return i.type={once:"once",all:"all"},i.prototype.on=function(t,e,i){if(!t)throw new Error("undefined event!");t in this._triggers?this._triggers[t].push({fn:e,option:i}):this._triggers[t]=[{fn:e,option:i}],this.emit(n.on,t,i)},i.prototype.off=function(i,r){if(t.string.check(arguments))i in this._triggers&&(this._triggers[i]=[],this.emit(n.off,i));else{if(!t.sFunction.check(arguments))throw new Error("incorrect parameter!");if(i in this._triggers){var o=-1;e.each(this._triggers[i],function(t,n){return t.fn===r?(o=n,!1):void 0}),o>-1&&(this._triggers[i].splice(o,1),this.emit(n.off,i))}}},i.prototype.once=function(t,e,r){r||(r={}),r.type=i.type.once,this.emit(n.once,t,r),this.on(t,e,r)},i.prototype.callWithScope=function(t,n,e){e=e||[],n&&n.hasOwnProperty("scope")?t.apply(n.scope,e):t.apply(this,e)},i.prototype.all=function(t,r,o){var s={},a=[];if(0===t.length)return void this.callWithScope(r,o);var c=this,u=function(t){return function(n,i){n in s&&(s[n]=!0,a[t]=i);var u=e.forIn(s,function(t,n){return n===!1?!1:void 0});u&&c.callWithScope(r,o,a)}};e.each(t,function(t,n){s[t]=!1,this.on(t,u(n),{type:i.type.all})},c),this.emit(n.all,t,o)},i.prototype.emit=function(t){var n,i,r,o,s=this._triggers[t],a=[],c=arguments;if(s){var u=this;if(e.each(s,function(t){r=t.fn,o=t.option,o?(n=o.scope,i=o.type):(n=!1,i=!1),n?r.apply(n,e.arg2Ary(c)):r.apply(u,e.arg2Ary(c)),i&&a.push(t)}),a.length>0){var f,p,m=[],h=0,l=0,_=s.length,d=a.length;for(f=a[l];_>h;)p=s[h],p===f?(l++,f=d>l?a[l]:-1):m.push(p),h++;0===m.length?delete this._triggers[t]:this._triggers[t]=m}}},i}),define("Compatible",["Util","Event"],function(t,n){var e={prefix:function(){var t=navigator.userAgent,n=t.indexOf("Opera")>-1,e=t.indexOf("Maxthon")>-1,i=!n&&t.indexOf("compatible")>-1&&t.indexOf("MSIE")>-1||t.indexOf("Trident")>-1,r=t.indexOf("Firefox")>-1,o=t.indexOf("Safari")>-1&&t.indexOf("Chrome")<1,s=t.indexOf("Chrome")>-1,a=t.indexOf("WebKit")>-1;return i?"-ms-":a||o||s||e?"-webkit-":n?"-o-":r?"-moz-":""}(),requestAnimationFrame:function(){if(window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,!window.requestAnimationFrame){var n,e=[],i=function(){t.each(e,function(t){t()}),clearTimeout(n),n=!1,e=[]},r=function(t){e.push(t),n||(n=window.setTimeout(i,16))};window.requestAnimationFrame=r}return function(t){window.requestAnimationFrame(t)}}(),css:function(i,r,o,s){return o||""===o?void e.requestAnimationFrame(function(){t.css(i,r,o),s.emit(n.css,i,r,o)}):t.css(i,r)},reflow:function(t){e.requestAnimationFrame(function(){t.offsetWidth=t.offsetWidth})},parseEvent:function(t,n){var i=e.prefix.replace(/-/g,"");return"moz ms".indexOf(i)>-1?function(n){return t+n.toLowerCase()}:function(t){return i+n+t}}};return e}),define("KFCompatible",["Pitch","Util","Checker","Event","EventEmitter","Compatible"],function(t,n,e,i,r,o){function s(){s.superClass.call(this);var n=new t,e=this;n.use("prefixOnly","text-shadow backface-visibility transition transition-timing-function animation-timing-function transform-origin transform-style perspective-origin perspective background-clip background-origin",function(t,n){return"transform"===n&&(n=e.prefix+n),e.prefix+t+":"+n+";"}),n.use("needAll","box-shadow border-radius",function(t,n){return e.prefix+t+":"+n+";"+t+":"+n+";"}),n.use("extend","translateX translateY translateZ translate translate3d rotateX rotateY rotateZ rotate rotate3d skewX skewY skewZ skew scaleZ scaleX scaleY scale3d scale ",function(t,n,e){return"transform"in e?e.transform+=" "+t+"("+n+")":e.transform=t+"("+n+")",""}),n.use("transform","transform",function(t,n,e){return"transform"in e?e.transform+=" "+n:e.transform=n,""}),n.use("animation","animation",function(t,n){return e.prefix+t+":"+e.parseAnimation(n)+";"}),n.use("specialA","background",function(t,n){return t+":"+n.replace(/linear-gradient/g,e.prefix+"linear-gradient")+";"}),n.use("specialB","mask-image",function(t,n){return e.prefix+t+":"+n.replace(/linear-gradient/g,e.prefix+"linear-gradient")+";"}),n.use("rest","*",function(t,n){return t+":"+n+";"}),this._pitch=n,this._combine=new t("combine","transform",function(t,n){return e.prefix+t+":"+n+";"})}return n.inherit(s,r),s.prototype.prefix=o.prefix,s._keyMap={animation:["animation"],name:["animationName"],duration:["animationDuration","1s"],"function":["animationTimingFunction","linear"],delay:["animationDelay","0s"],count:["animationIterationCount",1],direction:["animationDirection","normal"],state:["animationPlayState","running"],mode:["animationFillMode","forwards"]},s.prototype.parseAnimation=function(t){function i(t,n){return n in r?r[n]:s._keyMap[n][1]}e.array.check(arguments)||(t=[t]);var r,o=[],a=this.animationTpl();return n.each(t,function(t){r=t,o.push(a.replace(/<(.*?)>/g,i))}),o.join(",")},s.prototype.animationTpl=function(){return this._animationTpl||("-moz-"===this.prefix?(this._animationTpl="<duration> <function> <delay> <direction> <mode> <count> <state> <name>",this._closeReg={start:"\\s",end:"(?:\\s*)$"}):(this._animationTpl="<name> <duration> <function> <delay> <count> <direction> <mode>",this._closeReg={start:"^(?:\\s*)",end:"\\s"})),this._animationTpl},s.prototype.regExp=function(t){return new RegExp(this._closeReg.start+t+this._closeReg.end)},s.prototype.keyframe=function(t){return"@"+this.prefix+"keyframes "+t},s.prototype.percent=function(t){t=(t+"").trim();var n=t.split(/\s+/);return n.join("%, ")+"%"},s.prototype.patchCombine=function(t,n){return this._combine["do"](t+" ",n)},s.prototype.patch=function(t,n,e){return this._pitch["do"](t+" ",n,e)},s.instance=function(){return s._compatible||(s._compatible=new s),s._compatible},s.prototype.css=function(t,n,e){return n=this.parseCSS(n),o.css(t,n,e,this)},s.prototype.parseCSS=function(t){var n=this.prefix.replace(/-/g,"");return s.prototype.parseCSS="moz"===n?function(t){return t in s._keyMap?s._keyMap[t][0]:t}:function(t){return t in s._keyMap?(t=s._keyMap[t][0],n+t[0].toUpperCase()+t.substr(1)):t},this.parseCSS(t)},s.prototype.parseEvent=o.parseEvent("animation","Animation"),s}),define("Compiler",["Checker","KFCompatible","Util","Event","EventEmitter"],function(t,n,e,i,r){function o(){o.superClass.call(this),this._classStore={},this._classMap={},this._keyframeMap={},this._keyframeStore={};var t=n.instance();this._compatible=t,this._classId=function(t){return"class("+t+")"},this._keyframeId=function(t){return"keyframe("+t+")"},this._classText=function(t,n){return"."+t.replace(/\s+/g," .")+" "+n},this._keyframeText=function(n,e){return t.keyframe(n)+e}}return e.inherit(o,r),o.prototype.defineClass=function(t,n){return t=t.trim(),this._classMap[t]=n,t},o.prototype.defineKeyframe=function(n,i){return t.object.check(arguments)&&(i=arguments[0],n=e.random.name(8)),this._keyframeMap[n]=i,n},o.prototype.compile=function(){var t={},n={};e.forIn(this._classMap,function(n,e){t[n]=this._compileClass(e)},this),e.forIn(this._keyframeMap,function(t,e){n[t]=this._compileKeyframe(e)},this),this._classMap={},this._keyframeMap={},this._effect(t,n)},o.prototype._absorb=function(t,n,i,r,o){var s,a;e.forIn(t,function(t,e){s=n(t),a=i(t,e),t in r?this._refreshSheet(a,s):o.appendChild(this._styleSheet(a,s)),r[t]=e},this),t=null},o.prototype._effect=function(t,n){var e=this._fragment();this._absorb(t,this._classId,this._classText,this._classStore,e),this._absorb(n,this._keyframeId,this._keyframeText,this._keyframeStore,e),e.effect()},o.prototype._fragment=function(){var t=document.createDocumentFragment();return t.effect=function(){document.querySelector("head").appendChild(t)},t},o.prototype._styleSheet=function(t,n){var e=document.createElement("style");return e.type="text/css",e.id=n,e.appendChild(document.createTextNode(t)),this.emit(i.style,n,t),e},o.prototype.clear=function(){e.forIn(this._classStore,function(t){this._clearSheet(this._classId(t))},this),e.forIn(this._keyframeStore,function(t){this._clearSheet(this._keyframeId(t))},this),this._classStore={},this._keyframeStore={},this._classMap={},this._keyframeMap={}},o.prototype._refreshSheet=function(t,n){document.getElementById(n).innerHTML=t,this.emit(i.style,n,t)},o.prototype._clearSheet=function(t){document.querySelector("head").removeChild(document.getElementById(t))},o.prototype._compileClass=function(t){return"{"+this._compileContent(t)+"}"},o.prototype._compileContent=function(t){var n={},i=[];return e.forIn(t,function(t,e){i.push(this._compatible.patch(t,e,n))},this),e.forIn(n,function(t,n){i.push(this._compatible.patchCombine(t,n))},this),i.join("")},o.prototype._compileKeyframe=function(t){var n="{";return e.forIn(t,function(t,e){n+=this._compileFrame(t,e)},this),n+="}"},o.prototype._compileFrame=function(t,n){return this._compatible.percent(t)+this._compileClass(n)},o.instance=function(){return o._compiler||(o._compiler=new o),o._compiler},o}),define("Group",["Util","Event","EventEmitter"],function(t,n,e){function i(t){i.superClass.call(this),this._frames=t}return t.inherit(i,e),i.prototype.onEnd=function(t,e){return this.on(n.end,t,e),this},i.prototype.start=function(){function e(t,e){i.push(e),i.length===r._frames.length&&r.emit(n.end,i)}var i=[],r=this;return t.each(this._frames,function(t){t.start(),t.on(n.over,e)}),this},i.prototype.clear=function(){return t.each(this._frames,function(t){t.stop()}),this},i}),define("ClassProxy",["Util","Checker","Compiler"],function(t,n,e){function i(t,n){n?this._define(t,n):this._className=t}return i.prototype._define=function(t,n){this._className=e.instance().defineClass(t,n)},i.prototype.hover=function(t){return this._pseudo("hover",t)},i.prototype.before=function(t){return this._pseudo("before",t)},i.prototype.after=function(t){return this._pseudo("after",t)},i.prototype.focus=function(t){return this._pseudo("focus",t)},i.prototype.selector=function(t,n){return e.instance().defineClass(this._className+" "+t,n),this},i.prototype.selectors=function(n){return t.forIn(n,function(t,n){this.selector(t,n)},this),this},i.prototype._name=function(t){return this._className+":"+t},i.prototype._pseudo=function(t,n){if(!n)throw new Error("incorrect parameter, metaData is required!");return e.instance().defineClass(this._name(t),n),this},i.prototype.rewrite=function(t,e){if(n.objectString.check(arguments))this._pseudo(e,t);else{if(!n.object.check(arguments))throw new Error("incorrect parameter!");this._define(this._className,t)}return this},i}),define("FrameProxy",["Checker","Util","Compiler"],function(t,n,e){function i(t,n,e){this._clazz=e,this._define(t,n)}return i.prototype._define=function(t,n){return this._frame=e.instance().defineKeyframe(t,n),this},i.prototype.getName=function(){return this._frame},i.prototype.rewrite=function(n){if(!t.object.check(arguments))throw new Error("incorrect parameter!");return this._define(this._frame,n),this},i.prototype.setConfig=function(t){return t.name=this._frame,this._config=t,this._configs=[t],this},i.prototype.getConfigs=function(){return this._configs},i.prototype.keyframe=function(t){var e={"@":"function","#":"count"},i={},r=t.replace(/([@#])([^@#]*)/g,function(t,n,e){return i[n]=e,""});return n.forIn(i,function(t,n){this._config[e[t]]=n},this),this._keyframe=new this._clazz(document.getElementById(r),this._configs),this._keyframe},i.prototype.combine=function(t){var n=t.getConfigs();return n&&(this._configs=this._configs.concat(n)),this},i}),define("Keyframe",["Checker","Util","Compiler","Group","ClassProxy","FrameProxy","Event","EventEmitter","Compatible","KFCompatible"],function(t,n,e,i,r,o,s,a,c,u){function f(i,r,o){f.superClass.call(this),this._compiler=e.instance(),this._compatible=u.instance(),this._dom=i,this._animationStatus={};var s=this;r=n.extend(r,o),r?t.array.check([r])?(n.each(r,function(t){s._animationStatus[t.name]={ko:!1,count:t.count,record:0}}),this._animations=r):(this._animations=[r],this._animationStatus[r.name]={ko:!1,count:r.count,record:0}):this._animations=[],this._listen()}return n.inherit(f,a),f.prototype._listen=function(){function t(t){return function(n){e.emit(t,n)}}var e=this;this.on(s.on,function(i,r){r===s.start?e._monitorStart||(e._monitorStart=t(r),n.on(e._dom,e._compatible.parseEvent(r),e._monitorStart)):r===s.end?e._monitorEnd||(e._monitorEnd=t(r),n.on(e._dom,e._compatible.parseEvent(r),e._monitorEnd)):r===s.iteration&&(e._monitorIteration||(e._monitorIteration=t(r),n.on(e._dom,e._compatible.parseEvent(r),e._monitorIteration)))}),this.on(s.end,function(t,i){if(i.animationName in e._animationStatus){e._animationStatus[i.animationName].ko=!0;var r=n.forIn(e._animationStatus,function(t){return e._animationStatus[t].ko?void 0:!1});r&&e.emit(s.over,e._animationStatus)}}),this.on(s.iteration,function(t,i){if(i.animationName in e._animationStatus){var r=e._animationStatus[i.animationName];if(r.record++,"infinite"===r.count&&!r.ko){r.ko=!0;var o=n.forIn(e._animationStatus,function(t){return e._animationStatus[t].ko?void 0:!1});o&&e.emit(s.over,e._animationStatus)}}})},f.prototype.start=function(){var t=this._compatible,n=t.parseAnimation(this._animations),e=this._filter();return this.emit(s.beforeStart),""!==e?""!==n.trim()?t.css(this._dom,"animation",e+", "+n):t.css(this._dom,"animation",n):""!==n.trim()&&t.css(this._dom,"animation",n),this},f.prototype.pause=function(t){return this._playState("paused",t),this.emit(s.pause),this},f.prototype._filter=function(){var t=this._compatible.css(this._dom,"animation"),e=[];if(t){t=t.split(",");var i=["(?:none)"];n.each(this._animations,function(t){i.push("(?:"+t.name+")")});var r=this._compatible.regExp(i.join("|"));n.each(t,function(t){r.test(t)||e.push(t)})}return e.join(",").trim()},f.prototype.reflow=function(){return c.reflow(this._dom),this},f.prototype.restart=function(){this.clear().reflow().start()},f.prototype.clear=function(){var t=this._compatible;return t.css(this._dom,"animation",this._filter()),n.forIn(this._animationStatus,function(t){this._animationStatus[t].ko=!1,this._animationStatus[t].record=0},this),this},f.prototype.stop=function(){this.clear();var t=this._compatible;return this._monitorStart&&(n.off(this._dom,t.parseEvent(s.start),this._monitorStart),this._monitorStart=!1),this._monitorEnd&&(n.off(this._dom,t.parseEvent(s.end),this._monitorEnd),this._monitorEnd=!1),this._monitorIteration&&(n.off(this._dom,t.parseEvent(s.iteration),this._monitorIteration),this._monitorIteration=!1),this.emit(s.stop),this},f.prototype.goon=function(t){return this._playState("running",t),this.emit(s.goon),this},f.prototype._c2A=function(t){var e=n.css(this._dom,this._compatible.parseCSS(t));return e.split(/,\s?/)},f.prototype._playState=function(t,e){var i,r=this._c2A("name"),o=this._c2A("state");if(e)i=n.xInA(e,r),i>-1&&(o[i]=t);else{var s;n.each(this._animations,function(e){s=e.name,i=n.xInA(s,r),i>-1&&(o[i]=t)})}return this._compatible.css(this._dom,"state",o.join(", ")),this},f.prototype.addClass=function(t){return n.addClass(this._dom,t),this},f.prototype.removeClass=function(t){return n.removeClass(this._dom,t),this},f.defineKeyframe=function(e,i){if(t.object.check(arguments))return i=arguments[0],e=n.random.name(8),new o(e,i,f);if(t.stringObject.check(arguments))return new o(e,i,f);throw new Error("incorrect parameters!")},f.defineClass=function(e,i){if(t.stringObject.check(arguments))return new r(e,i);if(t.string.check(arguments))return new r(e);if(t.object.check(arguments))return new r(n.random.name(8),e);throw new Error("incorrect parameters!")},f.pack=function(t){n.inherit(t,f);var e=t.cf["class"],i=t.cf.frame;n.forIn(e,function(t,n){f.defineClass(t,n)}),n.forIn(i,function(t,n){f.defineKeyframe(t,n)}),t.rewriteClass=function(i,r){e||(e=t.cf["class"]={}),i in e?n.rewrite(e[i],r):e[i]=r},t.rewriteFrame=function(e,r){i||(i=t.cf.frame={}),e in i?n.rewrite(i[e],r):i[e]=r}},f.compile=function(){e.instance().compile()},f.group=function(t){var e,r=[];return"class"in t&&(n.forIn(t["class"],function(t,n){f.defineClass(t,n)}),delete t["class"]),n.forIn(t,function(t,n){e=f.timeLine(n),r.push(e.keyframe(t))}),f.compile(),new i(r)},f.timeLine=function(t){var e,i=[],r={},o={};n.forIn(t,function(t){n.each(t.split(/\s+/),function(t){e=parseFloat(t),r[t]=e,i.push(e)})}),i.sort(function(t,n){return t>n?1:-1});var s,a=i[0],c=i[i.length-1],u=parseFloat(c-a).toFixed(3);n.forIn(r,function(t,n){for(s=(100*(n-a)/u).toFixed(2);s in o;)s+=.01;o[s]=!0,r[t]=String(s).replace(/\.?0+$/,"")});var p={};n.forIn(t,function(t,e){s=[],n.each(t.split(/\s+/),function(t){s.push(r[t])}),p[s.join(" ")]=e});var m=f.defineKeyframe(p);return m.setConfig({duration:u+"s",delay:a+"s"}),m},f});