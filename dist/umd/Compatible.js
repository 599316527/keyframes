!function(n,e){"function"==typeof define&&define.amd?define(["Util"],e):n.Compatible=e(n.Util)}(this,function(n){var e={prefix:function(){var n=navigator.userAgent,e="";return/WebKit|Chrome|Safari|Maxthon/.test(n)?e="-webkit-":n.indexOf("Opera")>-1?e="-o-":n.indexOf("Firefox")>-1?e="-moz-":(n.indexOf("compatible")>-1&&n.indexOf("MSIE")>-1||n.indexOf("Trident")>-1)&&(e="-ms-"),e}(),requestAnimationFrame:function(){for(var n=["ms","moz","webkit","o"],e=0,t=n.length;t>e&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[n[e]+"RequestAnimationFrame"];if(!window.requestAnimationFrame){var i=0;return function(n){var e=(new Date).getTime(),t=Math.max(0,(16-(e-i))%16),r=window.setTimeout(function(){n()},t);return i=e+t,r}}return function(n){window.requestAnimationFrame(n)}}(),css:function(t,i,r,o){return r||""===r?void e.requestAnimationFrame(function(){n.css(t,i,r),o&&o(t,i,r)}):n.css(t,i)},reflow:function(n){e.requestAnimationFrame(function(){n.offsetWidth=n.offsetWidth})},parseEvent:function(n,t){var i=e.prefix.replace(/-/g,"");return"moz ms".indexOf(i)>-1?function(e){return n+e.toLowerCase()}:function(n){return i+t+n}}};return e});