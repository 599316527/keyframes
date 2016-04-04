define("Util",function(){var t={forIn:function(t,e,n){for(var r in t)if(e.call(n,r,t[r])===!1)return!1;return!0},rewrite:function(e,n){return n?(t.forIn(n,function(t,n){e[t]=n}),e):e},define:function(t){t=t.split(".");for(var e,n=window;e=t.shift();)e in n||(n[e]={}),n=n[e]},extend:function(e,n){return e?(n&&t.forIn(n,function(t,n){t in e||(e[t]=n)}),e):n},inherit:function(t,e){var n=new Function;n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.superClass=e},xInA:function(e,n){var r=-1;return t.each(n,function(t,n){return t===e?(r=n,!1):void 0}),r},arg2Ary:function(t){return Array.prototype.slice.call(t,0)},each:function(t,e,n){for(var r=0,i=t.length;i>r&&e.call(n,t[r],r,t)!==!1;r++);return r===t.length},random:{seed:[[48,9],[65,25],[97,25]],generator:function(t){return String.fromCharCode(t[0]+Math.round(t[1]*Math.random()))},word:function(t){var e;return e=0===t?Math.floor(2*Math.random())+1:Math.floor(3*Math.random()),this.generator(this.seed[e])},name:function(t){t=t||6;for(var e="",n=0;t>n;n++)e+=this.word(n);return e}},addClass:function(t,e){t.className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))||(t.className=(t.className+" "+e).trim())},removeClass:function(t,e){t.className=t.className.replace(new RegExp("(\\s|^)"+e+"(\\s|$)")," ").trim()},css:function(e,n,r){return"string"==typeof n?t.$css(e,n,r):void t.forIn(n,function(n,r){t.$css(e,n,r)})},stopPropagation:function(t){t.stopPropagation()},$css:function(t,e,n){return void 0!==n?(t.style[e]=n,n):t.style[e]},on:function(t,e,n){t.addEventListener(e,n,!1)},off:function(t,e,n){t.removeEventListener(e,n,!1)}};return t}),define("Event",function(){var t={style:"Style",css:"CSS",clear:"Clear",beforeStart:"BeforeStart",pause:"Pause",start:"Start",iteration:"Iteration",end:"End",next:"Next",over:"Over",on:"On",off:"Off",stop:"Stop",goon:"Goon",once:"Once",all:"All",emit:"Emit"};return t}),define("Checker",["Util"],function(t){function e(){this._list=t.arg2Ary(arguments)}return e.prototype.check=function(e){var n=this;if(e.length!==n._list.length)return!1;var r,i,o=t.each(e,function(t,e){if(r=n._list[e],i=typeof r,"string"===i){if(typeof t!==r)return!1}else if("function"===i&&!(t instanceof r))return!1});return o},e.stringObject=new e("string","object"),e.objectString=new e("object","string"),e.object=new e("object"),e.string=new e("string"),e.ssFunction=new e("string","string","function"),e.sFunction=new e("string","function"),e.array=new e(Array),e}),define("EventEmitter",["Util","Event","Checker"],function(t,e,n){function r(){this._triggers={}}return r.type={once:"once",all:"all"},r.prototype.on=function(t,n,r){if(!t)throw new Error("undefined event!");t in this._triggers?this._triggers[t].push({fn:n,option:r}):this._triggers[t]=[{fn:n,option:r}],this.emit(e.on,t,r)},r.prototype.off=function(r,i){if(n.string.check(arguments))r in this._triggers&&(this._triggers[r]=[],this.emit(e.off,r));else{if(!n.sFunction.check(arguments))throw new Error("incorrect parameter!");if(r in this._triggers){var o=-1;t.each(this._triggers[r],function(t,e){return t.fn===i?(o=e,!1):void 0}),o>-1&&(this._triggers[r].splice(o,1),this.emit(e.off,r))}}},r.prototype.once=function(t,n,i){i||(i={}),i.type=r.type.once,this.emit(e.once,t,i),this.on(t,n,i)},r.prototype.callWithScope=function(t,e,n){n=n||[],e&&e.hasOwnProperty("scope")?t.apply(e.scope,n):t.apply(this,n)},r.prototype.all=function(n,i,o){var s={},a=[];if(0===n.length)return void this.callWithScope(i,o);var p=this,c=function(e){return function(n,r){n in s&&(s[n]=!0,a[e]=r);var c=t.forIn(s,function(t,e){return e===!1?!1:void 0});c&&p.callWithScope(i,o,a)}};t.each(n,function(t,e){s[t]=!1,this.on(t,c(e),{type:r.type.all})},p),this.emit(e.all,n,o)},r.prototype.emit=function(e){var n,r,i,o,s=this._triggers[e],a=[],p=arguments;if(s){var c=this;if(t.each(s,function(e){i=e.fn,o=e.option,o?(n=o.scope,r=o.type):(n=!1,r=!1),n?i.apply(n,t.arg2Ary(p)):i.apply(c,t.arg2Ary(p)),r&&a.push(e)}),a.length>0){var f,u,h=[],l=0,m=0,d=s.length,_=a.length;for(f=a[m];d>l;)u=s[l],u===f?(m++,f=_>m?a[m]:-1):h.push(u),l++;0===h.length?delete this._triggers[e]:this._triggers[e]=h}}},r}),define("Compatible",["Util","Event"],function(t,e){var n={prefix:function(){var t=navigator.userAgent,e="";return/WebKit|Chrome|Safari|Maxthon/.test(t)?e="-webkit-":t.indexOf("Opera")>-1?e="-o-":t.indexOf("Firefox")>-1?e="-moz-":(t.indexOf("compatible")>-1&&t.indexOf("MSIE")>-1||t.indexOf("Trident")>-1)&&(e="-ms-"),e}(),requestAnimationFrame:function(){for(var t=["ms","moz","webkit","o"],e=0,n=t.length;n>e&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[t[e]+"RequestAnimationFrame"];if(!window.requestAnimationFrame){var r=0;return function(t){var e=(new Date).getTime(),n=Math.max(0,(16-(e-r))%16),i=window.setTimeout(function(){t()},n);return r=e+n,i}}return function(t){window.requestAnimationFrame(t)}}(),css:function(e,r,i,o){return i||""===i?void n.requestAnimationFrame(function(){t.css(e,r,i),o&&o(e,r,i)}):t.css(e,r)},reflow:function(t){n.requestAnimationFrame(function(){t.offsetWidth=t.offsetWidth})},parseEvent:function(t,e){var r=n.prefix.replace(/-/g,"");return"moz ms".indexOf(r)>-1?function(e){return t+e.toLowerCase()}:function(t){return r+e+t}}};return n}),define("TFCompatible",["Util","Event","EventEmitter","Compatible"],function(t,e,n,r){function i(){i.superClass.call(this),this.convertMap={}}return t.inherit(i,n),i.prototype.prefix=r.prefix,i._keyMap={transform:["transform"],transition:["transition"],duration:["transitionDuration","1s"],"function":["transitionTimingFunction","linear"],delay:["transitionDelay","0s"]},i.prototype.parseCSS=function(t){t in i._keyMap&&(t=i._keyMap[t][0]);var e=document.getElementsByTagName("body")[0];if("undefined"!=typeof e.style[t])return t;var n=this.prefix.replace(/-/g,"");return n+t[0].toUpperCase()+t.substr(1)},i.prototype.cssMap=function(t){if(!(t in this.convertMap)){var e=document.getElementsByTagName("body")[0],n=t.replace(/[A-Z]/g,function(t){return"-"+t.toLowerCase()});"undefined"==typeof e.style[t]&&(n=this.prefix+n),this.convertMap[t]=n}return this.convertMap[t]},i.prototype.eventMap={"border-radius":["border-bottom-left-radius","border-top-left-radius","border-bottom-right-radius","border-top-right-radius"],border:["border-left-width","border-top-width","border-right-width","border-bottom-width","border-left-color","border-top-color","border-right-color","border-bottom-color"]},i.prototype.addStatus=function(t,e){var n=this.cssMap(e);return n in this.eventMap?t.add(n,this.eventMap[n]):t.add(n),n},i.prototype.peelMould=function(e){var n={};return t.forIn(i._keyMap,function(t){t in e&&(n[t]=e[t])}),n},i.prototype.clone=function(e,n){var r,o=i._keyMap;return e instanceof Array?(r=[],t.each(e,function(t){r.push(this.clone(t,n))},this)):"object"==typeof e?(r={},t.forIn(e,function(t,e){t in o?r[t]=this.clone(e,n):t in n&&("api"in r||(r.api={}),r.api[n[t]]=this.clone(e,n))},this)):r=e,r},i.prototype.parseTransition=function(t){function e(e,n){return n in t?t[n]:i._keyMap[n][1]}return"<property> <duration> <function> <delay>".replace(/<(.*?)>/g,e)},i.instance=function(){return i._compatible||(i._compatible=new i),i._compatible},i.prototype.parseEvent=r.parseEvent("transition","Transition"),i}),define("Status",["Util"],function(t){function e(){this.init(),this.size=0,this.store=[]}return e.sep="|",e.prototype.init=function(){this.all={},this.once={},this.addUp=0},e.prototype.add=function(t,n,r){this.all[t]=!1;var i=e.sep;n&&(this.once[t]=i+n.join(i+i)+i),r||(this.store.push({all:t,once:n}),this.size++)},e.prototype.reset=function(){this.init(),t.each(this.store,function(t){this.add(t.all,t.once,!0)},this)},e.prototype.isDone=function(){return this.size===this.addUp},e.prototype.digest=function(n){var r=this.all,i=this.once,o=e.sep;n in r?(r[n]=!0,delete i[n],this.addUp++):t.forIn(i,function(t,e){return e=e.replace(o+n+o,""),i[t]=e,""===e?(r[n]=!0,this.addUp++,delete i[n],!1):void 0},this)},e}),define("Transition",["Util","Event","EventEmitter","Compatible","TFCompatible","Status"],function(t,e,n,r,i,o){function s(t,e){s.superClass.call(this),this._dom=t,this._executeInTime=e,this._steps=[],this._store={},this._index=0,this._transformRecord="",this._firstRun=!0,this._compatible=i.instance(),this._listen()}return t.inherit(s,n),s.prototype._listen=function(){function n(t){return function(e){r.emit(t,e)}}var r=this,i=r._compatible;this.on(e.on,function(t,o){o===e.end&&(r._monitorEnd||(r._monitor=n(o),r._on(i.parseEvent(o),r._monitor)))}),this.on(e.end,function(n,o){if(r._index<r._steps.length){var s=r._steps[r._index],a=o.propertyName.replace(i.prefix,"");s.status.digest(a),s.status.isDone()&&(r._index++,s.next?(r.emit(e.next,s),s.next()):r.emit(e.over,s))}t.stopPropagation(o)})},s.prototype.setExecuteInTime=function(t){return this._executeInTime=t,this},s.prototype.reStore=function(){r.css(this._dom,this._store,"",this);for(var t;this._index>0;)this._index--,t=this._steps[this._index].status,t.reset();return this._transformRecord="",this},s.prototype.reflow=function(){return r.reflow(this._dom),this},s.prototype.execute=function(){if(this._firstRun||(this.reStore().reflow(),this._firstRun=!1),this._index<this._steps.length){var t=this._steps[this._index];"execute"in t&&t.execute()}return this},s._apiMap={changeTo:{c:"color",bc:"backgroundColor",fs:"fontSize",br:"borderRadius",bo:"border",o:"opacity",l:"left",r:"right",t:"top",b:"bottom",w:"width",h:"height"},moveTo:{t:"top",l:"left",b:"bottom",r:"right"},moveBy:{x:"translateX",y:"translateY",z:"translateZ","2d":"translate","3d":"translate3d"},scaleBy:{x:"scaleX",y:"scaleY",z:"scaleZ","2d":"scale","3d":"scale3d"},rotateBy:{x:"rotateX",y:"rotateY",z:"rotateZ","3d":"rotate3d"},skewBy:{x:"skewX",y:"skewY","2d":"skew"}},s.prototype._step=function(t,n,i){var o=this,s=o._compatible,a={},p=o._steps.length,c=function(t,n,r){o.emit(e.css,t,n,r)};if(p>0){var f=o._steps[p-1],u=f.next;u?(f.next=function(){u(),r.css(o._dom,s.parseCSS("transition"),t,c),r.css(o._dom,n(),"",c)},o._index===o._steps.length&&(r.css(o._dom,s.parseCSS("transition"),t,c),r.css(o._dom,n(),"",c))):(f.next=function(){r.css(o._dom,s.parseCSS("transition"),t,c),r.css(o._dom,n(),"",c)},o._index===o._steps.length&&f.next())}else a.execute=function(){r.css(o._dom,s.parseCSS("transition"),t,c),r.css(o._dom,n(),"",c)},this._executeInTime&&a.execute();a.status=i,a.next=!1,this._steps.push(a)},s.prototype._combineTransform=function(t){return this._transformRecord+=t.join(" "),this._transformRecord},s.prototype._fillTransformParams=function(e,n,r){var i=this._compatible,o=i.parseCSS("transform"),s=i.parseCSS("transition");e=i.clone(e,n);var a=e.api;if(!a)throw new Error("不健全的配置项！");t.forIn(a,function(t,e){r.push(t+"("+e+")")}),o in this._store||(this._store[o]=t.css(this._dom,o)),s in this._store||(this._store[s]=t.css(this._dom,s))},s.prototype._transform=function(t,e){var n=this,r=n._compatible,i=r.cssMap("transform"),s=[];this._fillTransformParams(t,e,s);var a=new o;a.add("transform"),t.property=i,this._step(r.parseTransition(t),function(){var t={},e=r.parseCSS("transform");return t[e]=n._combineTransform(s),t},a)},s.prototype._fillCSSParams=function(e,n,r,i,o){var s,a=this,p=a._compatible.parseCSS("transition");return e=a._compatible.clone(e,n),e instanceof Array||(e=[e]),t.each(e,function(e){if(!e.api)throw new Error("不健全的配置！");t.forIn(e.api,function(n,c){s=this._compatible.addStatus(o,n),i[n]=c,n in this._store||(this._store[n]=t.css(this._dom,n)),p in this._store||(this._store[p]=t.css(this._dom,p)),e.property=s,r.push(a._compatible.parseTransition(e))},a)}),e},s.prototype._css=function(t,e){var n=[],r={},i=new o;this._fillCSSParams(t,e,n,r,i),this._step(n.join(","),function(){return r},i)},s.prototype.moveTo=function(t){var e=s._apiMap.moveTo;return t=this._patchMoveTo(t,e),this._css(t,e),this},s.prototype._patchMoveTo=function(e,n){e instanceof Array||(e=[e]);var r,i,o=this._dom,s={};return t.each(e,function(e){t.forIn(e,function(e){e in n&&(i=n[e],r=t.css(o,i),r&&"auto"!==r||(s[i]=0))})}),t.forIn(s,function(e,n){t.css(o,e,n)}),e},s.prototype.changeTo=function(t){var e=s._apiMap.changeTo;return t=this._patchMoveTo(t,s._apiMap.moveTo),this._css(t,e),this},s.prototype.moveBy=function(t){var e=s._apiMap.moveBy;return this._transform(t,e),this},s.prototype.scaleBy=function(t){var e=s._apiMap.scaleBy;return this._transform(t,e),this},s.prototype.skewBy=function(t){var e=s._apiMap.skewBy;return this._transform(t,e),this},s.prototype.rotateBy=function(t){var e=s._apiMap.rotateBy;return this._transform(t,e),this},s.prototype.mock=function(e,n){var r=s._apiMap[e],i={},a=new o,p=[];if("moveTo changeTo".indexOf(e)>-1)return this._fillCSSParams(n,r,p,i,a),[p.join(","),i,a];var c=this._compatible,f=c.parseCSS("transform"),u=[],h=c.cssMap("transform");if("mix"===e){var l,m=this._compatible.peelMould(n),d=0;return t.forIn(s._apiMap,function(e,r){e in n&&(l=n[e],"moveTo"===e||"changeTo"===e?(l=this._patchMoveTo(l,s._apiMap.moveTo),t.each(l,function(e){t.extend(e,m)}),this._fillCSSParams(l,r,p,i,a)):(this._fillTransformParams(l,r,u),d++))},this),d>0&&(a.add("transform"),n.property=h,p.push(c.parseTransition(n))),d>0&&(f=c.parseCSS("transform"),i[f]="old+; "+u.join(" ")),[p.join(","),i,a]}return this._fillTransformParams(n,r,u),a.add("transform"),n.property=h,i[f]="old+; "+u.join(" "),[c.parseTransition(n),i,a]},s.prototype.mix=function(e){var n,r=this._compatible.peelMould(e),i=[],a={},p=new o,c=[],f=0;t.forIn(s._apiMap,function(o,u){o in e&&(n=e[o],"moveTo"===o||"changeTo"===o?(n=this._patchMoveTo(n,s._apiMap.moveTo),t.each(n,function(e){t.extend(e,r)}),this._fillCSSParams(n,u,i,a,p)):(this._fillTransformParams(n,u,c),f++))},this);var u=this,h=u._compatible;if(f>0){var l=h.cssMap("transform");p.add("transform"),e.property=l,i.push(h.parseTransition(e))}return this._step(i.join(","),function(){if(f>0){var t=h.parseCSS("transform");a[t]=u._combineTransform(c,t)}return a},p),this},s.prototype.then=function(t){var e=this._steps.length;if(e>0){var n=this._steps[e-1],r=n.next;n.next=r?function(){r(),t()}:t}else t();return this},s.prototype._on=function(e,n){t.on(this._dom,e,n)},s.prototype._off=function(e,n){t.off(this._dom,e,n)},s.prototype._unListen=function(){this._monitorEnd&&this._off(this._compatible.parseEvent(e.end),this._monitorEnd)},s.prototype.perspective=function(t){var e=this._compatible,n=this._dom.parentNode;return t===!1?r.css(n,e.parseCSS("transformStyle"),"flat",this):(r.css(n,e.parseCSS("transformStyle"),"preserve-3d",this),r.css(n,e.parseCSS("perspective"),t,this)),this},s});