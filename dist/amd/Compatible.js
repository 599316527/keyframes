define(["Util","Event"],function(n,e){var i={prefix:function(){var n=navigator.userAgent,e=n.indexOf("Opera")>-1,i=n.indexOf("Maxthon")>-1,t=!e&&n.indexOf("compatible")>-1&&n.indexOf("MSIE")>-1||n.indexOf("Trident")>-1,r=n.indexOf("Firefox")>-1,o=n.indexOf("Safari")>-1&&n.indexOf("Chrome")<1,u=n.indexOf("Chrome")>-1,a=n.indexOf("WebKit")>-1;return t?"-ms-":a||o||u||i?"-webkit-":e?"-o-":r?"-moz-":""}(),requestAnimationFrame:function(){return window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(n){window.setTimeout(n,1e3/60)}}(),function(n){window.requestAnimationFrame(n)}}(),css:function(i,t,r,o){return r||""===r?void this.requestAnimationFrame(function(){n.css(i,t,r),o.emit(e.css,i,t,r)}):n.css(i,t)},parseEvent:function(n,e){var i=this.prefix.replace(/-/g,"");return"moz"===i?function(e){return n+e.toLowerCase()}:function(n){return i+e+n}}};return i});