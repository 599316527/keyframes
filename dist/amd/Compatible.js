define(["Util","Event"],function(n,e){var i={prefix:function(){var n=navigator.userAgent,e=n.indexOf("Opera")>-1,i=n.indexOf("Maxthon")>-1,t=!e&&n.indexOf("compatible")>-1&&n.indexOf("MSIE")>-1||n.indexOf("Trident")>-1,r=n.indexOf("Firefox")>-1,o=n.indexOf("Safari")>-1&&n.indexOf("Chrome")<1,f=n.indexOf("Chrome")>-1,u=n.indexOf("WebKit")>-1;return t?"-ms-":u||o||f||i?"-webkit-":e?"-o-":r?"-moz-":""}(),requestAnimationFrame:function(){return window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(n){window.setTimeout(n,1e3/60)}}(),function(n){window.requestAnimationFrame(n)}}(),css:function(t,r,o,f){return o||""===o?void i.requestAnimationFrame(function(){n.css(t,r,o),f.emit(e.css,t,r,o)}):n.css(t,r)},reflow:function(n){i.requestAnimationFrame(function(){n.offsetWidth=n.offsetWidth})},parseEvent:function(n,e){var t=i.prefix.replace(/-/g,"");return"moz"===t?function(e){return n+e.toLowerCase()}:function(n){return t+e+n}}};return i});