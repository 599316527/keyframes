define(function(){var n={forIn:function(n,t,r){for(var o in n)if(t.call(r,o,n[o])===!1)return!1;return!0},rewrite:function(t,r){return r?(n.forIn(r,function(n,r){t[n]=r}),t):t},define:function(n){n=n.split(".");for(var t,r=window;t=n.shift();)t in r||(r[t]={}),r=r[t]},extend:function(t,r){return t?(r&&n.forIn(r,function(n,r){n in t||(t[n]=r)}),t):r},inherit:function(n,t){var r=new Function;r.prototype=t.prototype,n.prototype=new r,n.prototype.constructor=n,n.superClass=t},xInA:function(t,r){var o=-1;return n.each(r,function(n,r){return n===t?(o=r,!1):void 0}),o},arg2Ary:function(n){return Array.prototype.slice.call(n,0)},each:function(n,t){for(var r=0,o=n.length;o>r&&t(n[r],r,n)!==!1;r++);return r===n.length},random:{generator:[function(){return String.fromCharCode(48+Math.round(9*Math.random()))},function(){return String.fromCharCode(65+Math.round(25*Math.random()))},function(){return String.fromCharCode(97+Math.round(25*Math.random()))}],word:function(t){var r;return r=0===t?Math.floor(2*Math.random())+1:Math.floor(3*Math.random()),n.random.generator[r]()},name:function(t){t=t||6;for(var r="",o=0;t>o;o++)r+=n.random.word(o);return r}},addClass:function(n,t){n.className.match(new RegExp("(\\s|^)"+t+"(\\s|$)"))||(n.className=(n.className+" "+t).trim())},removeClass:function(n,t){n.className=n.className.replace(new RegExp("(\\s|^)"+t+"(\\s|$)")," ").trim()},css:function(t,r,o){return"string"==typeof r?n.$css(t,r,o):void n.forIn(r,function(r,o){n.$css(t,r,o)})},stopPropagation:function(t){return n.stopPropagation=t.stopPropagation?function(n){n.stopPropagation()}:function(n){n.cancelBubble=!0},n.stopPropagation(t)},$css:function(t,r,o){return"undefined"!=typeof window.getComputedStyle?n.$css=function(n,t,r){if(void 0!==r)return n.style[t]=r,r;var o=window.getComputedStyle(n,null)[t];return o?o:n.style[t]}:"undefined"!=typeof t.currentStyle&&(n.$css=function(n,t,r){if(void 0!==r)return n.style[t]=r,r;var o=n.currentStyle[t];return o?o:n.style[t]}),this.$css(t,r,o)},on:function(t,r,o){return"addEventListener"in window?n.on=function(n,t,r){n.addEventListener(t,r,!1)}:"attachEvent"in window&&(n.on=function(n,t,r){n.attachEvent("on"+t,r)}),this.on(t,r,o)},off:function(t,r,o){"removeEventListener"in window?n.off=function(n,t,r){n.removeEventListener(t,r,!1)}:"detachEvent"in window&&(n.off=function(n,t,r){n.detachEvent("on"+t,r)}),this.off(t,r,o)}};return n});