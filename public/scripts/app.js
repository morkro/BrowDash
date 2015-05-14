/*!
 * Draggabilly PACKAGED v1.2.3
 * Make that shiz draggable
 * http://draggabilly.desandro.com
 * MIT license
 */

!function(t){function e(){}function n(t){function n(e){e.prototype.option||(e.prototype.option=function(e){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))})}function o(e,n){t.fn[e]=function(o){if("string"==typeof o){for(var s=i.call(arguments,1),a=0,p=this.length;p>a;a++){var u=this[a],d=t.data(u,e);if(d)if(t.isFunction(d[o])&&"_"!==o.charAt(0)){var c=d[o].apply(d,s);if(void 0!==c)return c}else r("no such method '"+o+"' for "+e+" instance");else r("cannot call methods on "+e+" prior to initialization; attempted to call '"+o+"'")}return this}return this.each(function(){var i=t.data(this,e);i?(i.option(o),i._init()):(i=new n(this,o),t.data(this,e,i))})}}if(t){var r="undefined"==typeof console?e:function(t){console.error(t)};return t.bridget=function(t,e){n(e),o(t,e)},t.bridget}}var i=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],n):n("object"==typeof exports?require("jquery"):t.jQuery)}(window),function(t){function e(t){return new RegExp("(^|\\s+)"+t+"(\\s+|$)")}function n(t,e){var n=i(t,e)?r:o;n(t,e)}var i,o,r;"classList"in document.documentElement?(i=function(t,e){return t.classList.contains(e)},o=function(t,e){t.classList.add(e)},r=function(t,e){t.classList.remove(e)}):(i=function(t,n){return e(n).test(t.className)},o=function(t,e){i(t,e)||(t.className=t.className+" "+e)},r=function(t,n){t.className=t.className.replace(e(n)," ")});var s={hasClass:i,addClass:o,removeClass:r,toggleClass:n,has:i,add:o,remove:r,toggle:n};"function"==typeof define&&define.amd?define("classie/classie",s):"object"==typeof exports?module.exports=s:t.classie=s}(window),function(t){function e(t){if(t){if("string"==typeof i[t])return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e,o=0,r=n.length;r>o;o++)if(e=n[o]+t,"string"==typeof i[e])return e}}var n="Webkit Moz ms Ms O".split(" "),i=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return e}):"object"==typeof exports?module.exports=e:t.getStyleProperty=e}(window),function(t){function e(t){var e=parseFloat(t),n=-1===t.indexOf("%")&&!isNaN(e);return n&&e}function n(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,n=s.length;n>e;e++){var i=s[e];t[i]=0}return t}function o(n){function o(){if(!h){h=!0;var i=t.getComputedStyle;if(u=function(){var t=i?function(t){return i(t,null)}:function(t){return t.currentStyle};return function(e){var n=t(e);return n||r("Style returned "+n+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),n}}(),d=n("boxSizing")){var o=document.createElement("div");o.style.width="200px",o.style.padding="1px 2px 3px 4px",o.style.borderStyle="solid",o.style.borderWidth="1px 2px 3px 4px",o.style[d]="border-box";var s=document.body||document.documentElement;s.appendChild(o);var a=u(o);c=200===e(a.width),s.removeChild(o)}}}function a(t){if(o(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var n=u(t);if("none"===n.display)return i();var r={};r.width=t.offsetWidth,r.height=t.offsetHeight;for(var a=r.isBorderBox=!(!d||!n[d]||"border-box"!==n[d]),h=0,f=s.length;f>h;h++){var l=s[h],g=n[l];g=p(t,g);var v=parseFloat(g);r[l]=isNaN(v)?0:v}var y=r.paddingLeft+r.paddingRight,m=r.paddingTop+r.paddingBottom,E=r.marginLeft+r.marginRight,b=r.marginTop+r.marginBottom,P=r.borderLeftWidth+r.borderRightWidth,x=r.borderTopWidth+r.borderBottomWidth,_=a&&c,w=e(n.width);w!==!1&&(r.width=w+(_?0:y+P));var S=e(n.height);return S!==!1&&(r.height=S+(_?0:m+x)),r.innerWidth=r.width-(y+P),r.innerHeight=r.height-(m+x),r.outerWidth=r.width+E,r.outerHeight=r.height+b,r}}function p(e,n){if(t.getComputedStyle||-1===n.indexOf("%"))return n;var i=e.style,o=i.left,r=e.runtimeStyle,s=r&&r.left;return s&&(r.left=e.currentStyle.left),i.left=n,n=i.pixelLeft,i.left=o,s&&(r.left=s),n}var u,d,c,h=!1;return a}var r="undefined"==typeof console?n:function(t){console.error(t)},s=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],o):"object"==typeof exports?module.exports=o(require("desandro-get-style-property")):t.getSize=o(t.getStyleProperty)}(window),function(t){function e(e){var n=t.event;return n.target=n.target||n.srcElement||e,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(t,e,n){t.addEventListener(e,n,!1)}:n.attachEvent&&(i=function(t,n,i){t[n+i]=i.handleEvent?function(){var n=e(t);i.handleEvent.call(i,n)}:function(){var n=e(t);i.call(t,n)},t.attachEvent("on"+n,t[n+i])});var o=function(){};n.removeEventListener?o=function(t,e,n){t.removeEventListener(e,n,!1)}:n.detachEvent&&(o=function(t,e,n){t.detachEvent("on"+e,t[e+n]);try{delete t[e+n]}catch(i){t[e+n]=void 0}});var r={bind:i,unbind:o};"function"==typeof define&&define.amd?define("eventie/eventie",r):"object"==typeof exports?module.exports=r:t.eventie=r}(window),function(){function t(){}function e(t,e){for(var n=t.length;n--;)if(t[n].listener===e)return n;return-1}function n(t){return function(){return this[t].apply(this,arguments)}}var i=t.prototype,o=this,r=o.EventEmitter;i.getListeners=function(t){var e,n,i=this._getEvents();if(t instanceof RegExp){e={};for(n in i)i.hasOwnProperty(n)&&t.test(n)&&(e[n]=i[n])}else e=i[t]||(i[t]=[]);return e},i.flattenListeners=function(t){var e,n=[];for(e=0;e<t.length;e+=1)n.push(t[e].listener);return n},i.getListenersAsObject=function(t){var e,n=this.getListeners(t);return n instanceof Array&&(e={},e[t]=n),e||n},i.addListener=function(t,n){var i,o=this.getListenersAsObject(t),r="object"==typeof n;for(i in o)o.hasOwnProperty(i)&&-1===e(o[i],n)&&o[i].push(r?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(t,e){return this.addListener(t,{listener:e,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(t){return this.getListeners(t),this},i.defineEvents=function(t){for(var e=0;e<t.length;e+=1)this.defineEvent(t[e]);return this},i.removeListener=function(t,n){var i,o,r=this.getListenersAsObject(t);for(o in r)r.hasOwnProperty(o)&&(i=e(r[o],n),-1!==i&&r[o].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(t,e){return this.manipulateListeners(!1,t,e)},i.removeListeners=function(t,e){return this.manipulateListeners(!0,t,e)},i.manipulateListeners=function(t,e,n){var i,o,r=t?this.removeListener:this.addListener,s=t?this.removeListeners:this.addListeners;if("object"!=typeof e||e instanceof RegExp)for(i=n.length;i--;)r.call(this,e,n[i]);else for(i in e)e.hasOwnProperty(i)&&(o=e[i])&&("function"==typeof o?r.call(this,i,o):s.call(this,i,o));return this},i.removeEvent=function(t){var e,n=typeof t,i=this._getEvents();if("string"===n)delete i[t];else if(t instanceof RegExp)for(e in i)i.hasOwnProperty(e)&&t.test(e)&&delete i[e];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(t,e){var n,i,o,r,s=this.getListenersAsObject(t);for(o in s)if(s.hasOwnProperty(o))for(i=s[o].length;i--;)n=s[o][i],n.once===!0&&this.removeListener(t,n.listener),r=n.listener.apply(this,e||[]),r===this._getOnceReturnValue()&&this.removeListener(t,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(t){var e=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,e)},i.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return o.EventEmitter=r,t},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return t}):"object"==typeof module&&module.exports?module.exports=t:o.EventEmitter=t}.call(this),function(t,e){"function"==typeof define&&define.amd?define("unipointer/unipointer",["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return e(t,n,i)}):"object"==typeof exports?module.exports=e(t,require("wolfy87-eventemitter"),require("eventie")):t.Unipointer=e(t,t.EventEmitter,t.eventie)}(window,function(t,e,n){function i(){}function o(){}o.prototype=new e,o.prototype.bindStartEvent=function(t){this._bindStartEvent(t,!0)},o.prototype.unbindStartEvent=function(t){this._bindStartEvent(t,!1)},o.prototype._bindStartEvent=function(e,i){i=void 0===i?!0:!!i;var o=i?"bind":"unbind";t.navigator.pointerEnabled?n[o](e,"pointerdown",this):t.navigator.msPointerEnabled?n[o](e,"MSPointerDown",this):(n[o](e,"mousedown",this),n[o](e,"touchstart",this))},o.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},o.prototype.getTouch=function(t){for(var e=0,n=t.length;n>e;e++){var i=t[e];if(i.identifier==this.pointerIdentifier)return i}},o.prototype.onmousedown=function(t){var e=t.button;e&&0!==e&&1!==e||this._pointerDown(t,t)},o.prototype.ontouchstart=function(t){this._pointerDown(t,t.changedTouches[0])},o.prototype.onMSPointerDown=o.prototype.onpointerdown=function(t){this._pointerDown(t,t)},o.prototype._pointerDown=function(t,e){this.isPointerDown||(this.isPointerDown=!0,this.pointerIdentifier=void 0!==e.pointerId?e.pointerId:e.identifier,this.pointerDown(t,e))},o.prototype.pointerDown=function(t,e){this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e])};var r={mousedown:["mousemove","mouseup"],touchstart:["touchmove","touchend","touchcancel"],pointerdown:["pointermove","pointerup","pointercancel"],MSPointerDown:["MSPointerMove","MSPointerUp","MSPointerCancel"]};return o.prototype._bindPostStartEvents=function(e){if(e){for(var i=r[e.type],o=e.preventDefault?t:document,s=0,a=i.length;a>s;s++){var p=i[s];n.bind(o,p,this)}this._boundPointerEvents={events:i,node:o}}},o.prototype._unbindPostStartEvents=function(){var t=this._boundPointerEvents;if(t&&t.events){for(var e=0,i=t.events.length;i>e;e++){var o=t.events[e];n.unbind(t.node,o,this)}delete this._boundPointerEvents}},o.prototype.onmousemove=function(t){this._pointerMove(t,t)},o.prototype.onMSPointerMove=o.prototype.onpointermove=function(t){t.pointerId==this.pointerIdentifier&&this._pointerMove(t,t)},o.prototype.ontouchmove=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerMove(t,e)},o.prototype._pointerMove=function(t,e){this.pointerMove(t,e)},o.prototype.pointerMove=function(t,e){this.emitEvent("pointerMove",[t,e])},o.prototype.onmouseup=function(t){this._pointerUp(t,t)},o.prototype.onMSPointerUp=o.prototype.onpointerup=function(t){t.pointerId==this.pointerIdentifier&&this._pointerUp(t,t)},o.prototype.ontouchend=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerUp(t,e)},o.prototype._pointerUp=function(t,e){this._pointerDone(),this.pointerUp(t,e)},o.prototype.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e])},o.prototype._pointerDone=function(){this.isPointerDown=!1,delete this.pointerIdentifier,this._unbindPostStartEvents(),this.pointerDone()},o.prototype.pointerDone=i,o.prototype.onMSPointerCancel=o.prototype.onpointercancel=function(t){t.pointerId==this.pointerIdentifier&&this._pointerCancel(t,t)},o.prototype.ontouchcancel=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerCancel(t,e)},o.prototype._pointerCancel=function(t,e){this._pointerDone(),this.pointerCancel(t,e)},o.prototype.pointerCancel=function(t,e){this.emitEvent("pointerCancel",[t,e])},o.getPointerPoint=function(t){return{x:void 0!==t.pageX?t.pageX:t.clientX,y:void 0!==t.pageY?t.pageY:t.clientY}},o}),function(t,e){"function"==typeof define&&define.amd?define("unidragger/unidragger",["eventie/eventie","unipointer/unipointer"],function(n,i){return e(t,n,i)}):"object"==typeof exports?module.exports=e(t,require("eventie"),require("unipointer")):t.Unidragger=e(t,t.eventie,t.Unipointer)}(window,function(t,e,n){function i(){}function o(t){t.preventDefault?t.preventDefault():t.returnValue=!1}function r(t){for(;t!=document.body;)if(t=t.parentNode,"A"==t.nodeName)return t}function s(){}function a(){return!1}s.prototype=new n,s.prototype.bindHandles=function(){this._bindHandles(!0)},s.prototype.unbindHandles=function(){this._bindHandles(!1)};var p=t.navigator;s.prototype._bindHandles=function(t){t=void 0===t?!0:!!t;var n;n=p.pointerEnabled?function(e){e.style.touchAction=t?"none":""}:p.msPointerEnabled?function(e){e.style.msTouchAction=t?"none":""}:function(){t&&d(s)};for(var i=t?"bind":"unbind",o=0,r=this.handles.length;r>o;o++){var s=this.handles[o];this._bindStartEvent(s,t),n(s),e[i](s,"click",this)}};var u="attachEvent"in document.documentElement,d=u?function(t){"IMG"==t.nodeName&&(t.ondragstart=a);for(var e=t.querySelectorAll("img"),n=0,i=e.length;i>n;n++){var o=e[n];o.ondragstart=a}}:i,c=s.allowTouchstartNodes={INPUT:!0,A:!0,BUTTON:!0,SELECT:!0};return s.prototype.pointerDown=function(t,e){this._dragPointerDown(t,e);var n=document.activeElement;n&&n.blur&&n.blur(),this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e])},s.prototype._dragPointerDown=function(t,e){this.pointerDownPoint=n.getPointerPoint(e);var i=t.target.nodeName,s="touchstart"==t.type&&(c[i]||r(t.target));s||"SELECT"==i||o(t)},s.prototype.pointerMove=function(t,e){var n=this._dragPointerMove(t,e);this.emitEvent("pointerMove",[t,e,n]),this._dragMove(t,e,n)},s.prototype._dragPointerMove=function(t,e){var i=n.getPointerPoint(e),o={x:i.x-this.pointerDownPoint.x,y:i.y-this.pointerDownPoint.y};return!this.isDragging&&this.hasDragStarted(o)&&this._dragStart(t,e),o},s.prototype.hasDragStarted=function(t){return Math.abs(t.x)>3||Math.abs(t.y)>3},s.prototype.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e]),this._dragPointerUp(t,e)},s.prototype._dragPointerUp=function(t,e){this.isDragging?this._dragEnd(t,e):this._staticClick(t,e)},s.prototype._dragStart=function(t,e){this.isDragging=!0,this.dragStartPoint=s.getPointerPoint(e),this.isPreventingClicks=!0,this.dragStart(t,e)},s.prototype.dragStart=function(t,e){this.emitEvent("dragStart",[t,e])},s.prototype._dragMove=function(t,e,n){this.isDragging&&this.dragMove(t,e,n)},s.prototype.dragMove=function(t,e,n){this.emitEvent("dragMove",[t,e,n])},s.prototype._dragEnd=function(t,e){this.isDragging=!1;var n=this;setTimeout(function(){delete n.isPreventingClicks}),this.dragEnd(t,e)},s.prototype.dragEnd=function(t,e){this.emitEvent("dragEnd",[t,e])},s.prototype.onclick=function(t){this.isPreventingClicks&&o(t)},s.prototype._staticClick=function(t,e){"INPUT"==t.target.nodeName&&"text"==t.target.type&&t.target.focus(),this.staticClick(t,e)},s.prototype.staticClick=function(t,e){this.emitEvent("staticClick",[t,e])},s.getPointerPoint=function(t){return{x:void 0!==t.pageX?t.pageX:t.clientX,y:void 0!==t.pageY?t.pageY:t.clientY}},s.getPointerPoint=n.getPointerPoint,s}),function(t,e){"function"==typeof define&&define.amd?define("draggabilly/draggabilly",["classie/classie","get-style-property/get-style-property","get-size/get-size","unidragger/unidragger"],function(n,i,o,r){return e(t,n,i,o,r)}):"object"==typeof exports?module.exports=e(t,require("desandro-classie"),require("desandro-get-style-property"),require("get-size"),require("unidragger")):t.Draggabilly=e(t,t.classie,t.getStyleProperty,t.getSize,t.Unidragger)}(window,function(t,e,n,i,o){function r(){}function s(t,e){for(var n in e)t[n]=e[n];return t}function a(t,e){this.element="string"==typeof t?d.querySelector(t):t,P&&(this.$element=P(this.element)),this.options=s({},this.constructor.defaults),this.option(e),this._create()}function p(t,e,n){return n=n||"round",e?Math[n](t/e)*e:t}for(var u,d=t.document,c=d.defaultView,h=c&&c.getComputedStyle?function(t){return c.getComputedStyle(t,null)}:function(t){return t.currentStyle},f="object"==typeof HTMLElement?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"==typeof t&&1==t.nodeType&&"string"==typeof t.nodeName},l=0,g="webkit moz ms o".split(" "),v=t.requestAnimationFrame,y=t.cancelAnimationFrame,m=0;m<g.length&&(!v||!y);m++)u=g[m],v=v||t[u+"RequestAnimationFrame"],y=y||t[u+"CancelAnimationFrame"]||t[u+"CancelRequestAnimationFrame"];v&&y||(v=function(e){var n=(new Date).getTime(),i=Math.max(0,16-(n-l)),o=t.setTimeout(function(){e(n+i)},i);return l=n+i,o},y=function(e){t.clearTimeout(e)});var E=n("transform"),b=!!n("perspective"),P=t.jQuery;s(a.prototype,o.prototype),a.defaults={},a.prototype.option=function(t){s(this.options,t)},a.prototype._create=function(){this.position={},this._getPosition(),this.startPoint={x:0,y:0},this.dragPoint={x:0,y:0},this.startPosition=s({},this.position);var t=h(this.element);"relative"!=t.position&&"absolute"!=t.position&&(this.element.style.position="relative"),this.enable(),this.setHandles()},a.prototype.setHandles=function(){this.handles=this.options.handle?this.element.querySelectorAll(this.options.handle):[this.element],this.bindHandles()},a.prototype.dispatchEvent=function(e,n,i){var o=[n].concat(i);this.emitEvent(e,o);var r=t.jQuery;if(r&&this.$element)if(n){var s=r.Event(n);s.type=e,this.$element.trigger(s,i)}else this.$element.trigger(e,i)},a.prototype._getPosition=function(){var t=h(this.element),e=parseInt(t.left,10),n=parseInt(t.top,10);this.position.x=isNaN(e)?0:e,this.position.y=isNaN(n)?0:n,this._addTransformPosition(t)},a.prototype._addTransformPosition=function(t){if(E){var e=t[E];if(0===e.indexOf("matrix")){var n=e.split(","),i=0===e.indexOf("matrix3d")?12:4,o=parseInt(n[i],10),r=parseInt(n[i+1],10);this.position.x+=o,this.position.y+=r}}},a.prototype.pointerDown=function(t,n){this._dragPointerDown(t,n);var i=d.activeElement;i&&i.blur&&i.blur(),this._bindPostStartEvents(t),e.add(this.element,"is-pointer-down"),this.dispatchEvent("pointerDown",t,[n])},a.prototype.pointerMove=function(t,e){var n=this._dragPointerMove(t,e);this.dispatchEvent("pointerMove",t,[e,n]),this._dragMove(t,e,n)},a.prototype.dragStart=function(t,n){this.isEnabled&&(this._getPosition(),this.measureContainment(),this.startPosition.x=this.position.x,this.startPosition.y=this.position.y,this.setLeftTop(),this.dragPoint.x=0,this.dragPoint.y=0,this.isDragging=!0,e.add(this.element,"is-dragging"),this.dispatchEvent("dragStart",t,[n]),this.animate())},a.prototype.measureContainment=function(){var t=this.options.containment;if(t){this.size=i(this.element);var e=this.element.getBoundingClientRect(),n=f(t)?t:"string"==typeof t?d.querySelector(t):this.element.parentNode;this.containerSize=i(n);var o=n.getBoundingClientRect();this.relativeStartPosition={x:e.left-o.left,y:e.top-o.top}}},a.prototype.dragMove=function(t,e,n){if(this.isEnabled){var i=n.x,o=n.y,r=this.options.grid,s=r&&r[0],a=r&&r[1];i=p(i,s),o=p(o,a),i=this.containDrag("x",i,s),o=this.containDrag("y",o,a),i="y"==this.options.axis?0:i,o="x"==this.options.axis?0:o,this.position.x=this.startPosition.x+i,this.position.y=this.startPosition.y+o,this.dragPoint.x=i,this.dragPoint.y=o,this.dispatchEvent("dragMove",t,[e,n])}},a.prototype.containDrag=function(t,e,n){if(!this.options.containment)return e;var i="x"==t?"width":"height",o=this.relativeStartPosition[t],r=p(-o,n,"ceil"),s=this.containerSize[i]-o-this.size[i];return s=p(s,n,"floor"),Math.min(s,Math.max(r,e))},a.prototype.pointerUp=function(t,n){e.remove(this.element,"is-pointer-down"),this.dispatchEvent("pointerUp",t,[n]),this._dragPointerUp(t,n)},a.prototype.dragEnd=function(t,n){this.isEnabled&&(this.isDragging=!1,E&&(this.element.style[E]="",this.setLeftTop()),e.remove(this.element,"is-dragging"),this.dispatchEvent("dragEnd",t,[n]))},a.prototype.animate=function(){if(this.isDragging){this.positionDrag();var t=this;v(function(){t.animate()})}};var x=b?function(t,e){return"translate3d( "+t+"px, "+e+"px, 0)"}:function(t,e){return"translate( "+t+"px, "+e+"px)"};return a.prototype.setLeftTop=function(){this.element.style.left=this.position.x+"px",this.element.style.top=this.position.y+"px"},a.prototype.positionDrag=E?function(){this.element.style[E]=x(this.dragPoint.x,this.dragPoint.y)}:a.prototype.setLeftTop,a.prototype.staticClick=function(t,e){this.dispatchEvent("staticClick",t,[e])},a.prototype.enable=function(){this.isEnabled=!0},a.prototype.disable=function(){this.isEnabled=!1,this.isDragging&&this.dragEnd()},a.prototype.destroy=function(){this.disable(),E&&(this.element.style[E]=""),this.element.style.left="",this.element.style.top="",this.element.style.position="",this.unbindHandles(),this.$element&&this.$element.removeData("draggabilly")},a.prototype._init=r,P&&P.bridget&&P.bridget("draggabilly",a),a});
/*!
 * Packery PACKAGED v1.4.1
 * bin-packing layout library
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://packery.metafizzy.co
 * Copyright 2015 Metafizzy
 */

(function(t){function e(){}function i(t){function i(e){e.prototype.option||(e.prototype.option=function(e){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))})}function o(e,i){t.fn[e]=function(o){if("string"==typeof o){for(var s=n.call(arguments,1),a=0,h=this.length;h>a;a++){var p=this[a],u=t.data(p,e);if(u)if(t.isFunction(u[o])&&"_"!==o.charAt(0)){var c=u[o].apply(u,s);if(void 0!==c)return c}else r("no such method '"+o+"' for "+e+" instance");else r("cannot call methods on "+e+" prior to initialization; "+"attempted to call '"+o+"'")}return this}return this.each(function(){var n=t.data(this,e);n?(n.option(o),n._init()):(n=new i(this,o),t.data(this,e,n))})}}if(t){var r="undefined"==typeof console?e:function(t){console.error(t)};return t.bridget=function(t,e){i(e),o(t,e)},t.bridget}}var n=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],i):"object"==typeof exports?i(require("jquery")):i(t.jQuery)})(window),function(t){function e(t){return RegExp("(^|\\s+)"+t+"(\\s+|$)")}function i(t,e){var i=n(t,e)?r:o;i(t,e)}var n,o,r;"classList"in document.documentElement?(n=function(t,e){return t.classList.contains(e)},o=function(t,e){t.classList.add(e)},r=function(t,e){t.classList.remove(e)}):(n=function(t,i){return e(i).test(t.className)},o=function(t,e){n(t,e)||(t.className=t.className+" "+e)},r=function(t,i){t.className=t.className.replace(e(i)," ")});var s={hasClass:n,addClass:o,removeClass:r,toggleClass:i,has:n,add:o,remove:r,toggle:i};"function"==typeof define&&define.amd?define("classie/classie",s):"object"==typeof exports?module.exports=s:t.classie=s}(window),function(t){function e(t){if(t){if("string"==typeof n[t])return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e,o=0,r=i.length;r>o;o++)if(e=i[o]+t,"string"==typeof n[e])return e}}var i="Webkit Moz ms Ms O".split(" "),n=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return e}):"object"==typeof exports?module.exports=e:t.getStyleProperty=e}(window),function(t){function e(t){var e=parseFloat(t),i=-1===t.indexOf("%")&&!isNaN(e);return i&&e}function i(){}function n(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,i=s.length;i>e;e++){var n=s[e];t[n]=0}return t}function o(i){function o(){if(!d){d=!0;var n=t.getComputedStyle;if(p=function(){var t=n?function(t){return n(t,null)}:function(t){return t.currentStyle};return function(e){var i=t(e);return i||r("Style returned "+i+". Are you running this code in a hidden iframe on Firefox? "+"See http://bit.ly/getsizebug1"),i}}(),u=i("boxSizing")){var o=document.createElement("div");o.style.width="200px",o.style.padding="1px 2px 3px 4px",o.style.borderStyle="solid",o.style.borderWidth="1px 2px 3px 4px",o.style[u]="border-box";var s=document.body||document.documentElement;s.appendChild(o);var a=p(o);c=200===e(a.width),s.removeChild(o)}}}function a(t){if(o(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var i=p(t);if("none"===i.display)return n();var r={};r.width=t.offsetWidth,r.height=t.offsetHeight;for(var a=r.isBorderBox=!(!u||!i[u]||"border-box"!==i[u]),d=0,l=s.length;l>d;d++){var f=s[d],y=i[f];y=h(t,y);var m=parseFloat(y);r[f]=isNaN(m)?0:m}var g=r.paddingLeft+r.paddingRight,v=r.paddingTop+r.paddingBottom,x=r.marginLeft+r.marginRight,E=r.marginTop+r.marginBottom,b=r.borderLeftWidth+r.borderRightWidth,w=r.borderTopWidth+r.borderBottomWidth,_=a&&c,T=e(i.width);T!==!1&&(r.width=T+(_?0:g+b));var z=e(i.height);return z!==!1&&(r.height=z+(_?0:v+w)),r.innerWidth=r.width-(g+b),r.innerHeight=r.height-(v+w),r.outerWidth=r.width+x,r.outerHeight=r.height+E,r}}function h(e,i){if(t.getComputedStyle||-1===i.indexOf("%"))return i;var n=e.style,o=n.left,r=e.runtimeStyle,s=r&&r.left;return s&&(r.left=e.currentStyle.left),n.left=i,i=n.pixelLeft,n.left=o,s&&(r.left=s),i}var p,u,c,d=!1;return a}var r="undefined"==typeof console?i:function(t){console.error(t)},s=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],o):"object"==typeof exports?module.exports=o(require("desandro-get-style-property")):t.getSize=o(t.getStyleProperty)}(window),function(t){function e(e){var i=t.event;return i.target=i.target||i.srcElement||e,i}var i=document.documentElement,n=function(){};i.addEventListener?n=function(t,e,i){t.addEventListener(e,i,!1)}:i.attachEvent&&(n=function(t,i,n){t[i+n]=n.handleEvent?function(){var i=e(t);n.handleEvent.call(n,i)}:function(){var i=e(t);n.call(t,i)},t.attachEvent("on"+i,t[i+n])});var o=function(){};i.removeEventListener?o=function(t,e,i){t.removeEventListener(e,i,!1)}:i.detachEvent&&(o=function(t,e,i){t.detachEvent("on"+e,t[e+i]);try{delete t[e+i]}catch(n){t[e+i]=void 0}});var r={bind:n,unbind:o};"function"==typeof define&&define.amd?define("eventie/eventie",r):"object"==typeof exports?module.exports=r:t.eventie=r}(window),function(){function t(){}function e(t,e){for(var i=t.length;i--;)if(t[i].listener===e)return i;return-1}function i(t){return function(){return this[t].apply(this,arguments)}}var n=t.prototype,o=this,r=o.EventEmitter;n.getListeners=function(t){var e,i,n=this._getEvents();if(t instanceof RegExp){e={};for(i in n)n.hasOwnProperty(i)&&t.test(i)&&(e[i]=n[i])}else e=n[t]||(n[t]=[]);return e},n.flattenListeners=function(t){var e,i=[];for(e=0;t.length>e;e+=1)i.push(t[e].listener);return i},n.getListenersAsObject=function(t){var e,i=this.getListeners(t);return i instanceof Array&&(e={},e[t]=i),e||i},n.addListener=function(t,i){var n,o=this.getListenersAsObject(t),r="object"==typeof i;for(n in o)o.hasOwnProperty(n)&&-1===e(o[n],i)&&o[n].push(r?i:{listener:i,once:!1});return this},n.on=i("addListener"),n.addOnceListener=function(t,e){return this.addListener(t,{listener:e,once:!0})},n.once=i("addOnceListener"),n.defineEvent=function(t){return this.getListeners(t),this},n.defineEvents=function(t){for(var e=0;t.length>e;e+=1)this.defineEvent(t[e]);return this},n.removeListener=function(t,i){var n,o,r=this.getListenersAsObject(t);for(o in r)r.hasOwnProperty(o)&&(n=e(r[o],i),-1!==n&&r[o].splice(n,1));return this},n.off=i("removeListener"),n.addListeners=function(t,e){return this.manipulateListeners(!1,t,e)},n.removeListeners=function(t,e){return this.manipulateListeners(!0,t,e)},n.manipulateListeners=function(t,e,i){var n,o,r=t?this.removeListener:this.addListener,s=t?this.removeListeners:this.addListeners;if("object"!=typeof e||e instanceof RegExp)for(n=i.length;n--;)r.call(this,e,i[n]);else for(n in e)e.hasOwnProperty(n)&&(o=e[n])&&("function"==typeof o?r.call(this,n,o):s.call(this,n,o));return this},n.removeEvent=function(t){var e,i=typeof t,n=this._getEvents();if("string"===i)delete n[t];else if(t instanceof RegExp)for(e in n)n.hasOwnProperty(e)&&t.test(e)&&delete n[e];else delete this._events;return this},n.removeAllListeners=i("removeEvent"),n.emitEvent=function(t,e){var i,n,o,r,s=this.getListenersAsObject(t);for(o in s)if(s.hasOwnProperty(o))for(n=s[o].length;n--;)i=s[o][n],i.once===!0&&this.removeListener(t,i.listener),r=i.listener.apply(this,e||[]),r===this._getOnceReturnValue()&&this.removeListener(t,i.listener);return this},n.trigger=i("emitEvent"),n.emit=function(t){var e=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,e)},n.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},n._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},n._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return o.EventEmitter=r,t},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return t}):"object"==typeof module&&module.exports?module.exports=t:o.EventEmitter=t}.call(this),function(t){function e(t){"function"==typeof t&&(e.isReady?t():s.push(t))}function i(t){var i="readystatechange"===t.type&&"complete"!==r.readyState;e.isReady||i||n()}function n(){e.isReady=!0;for(var t=0,i=s.length;i>t;t++){var n=s[t];n()}}function o(o){return"complete"===r.readyState?n():(o.bind(r,"DOMContentLoaded",i),o.bind(r,"readystatechange",i),o.bind(t,"load",i)),e}var r=t.document,s=[];e.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],o):"object"==typeof exports?module.exports=o(require("eventie")):t.docReady=o(t.eventie)}(window),function(t){function e(t,e){return t[s](e)}function i(t){if(!t.parentNode){var e=document.createDocumentFragment();e.appendChild(t)}}function n(t,e){i(t);for(var n=t.parentNode.querySelectorAll(e),o=0,r=n.length;r>o;o++)if(n[o]===t)return!0;return!1}function o(t,n){return i(t),e(t,n)}var r,s=function(){if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0,n=e.length;n>i;i++){var o=e[i],r=o+"MatchesSelector";if(t[r])return r}}();if(s){var a=document.createElement("div"),h=e(a,"div");r=h?e:o}else r=n;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return r}):"object"==typeof exports?module.exports=r:window.matchesSelector=r}(Element.prototype),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(t,require("doc-ready"),require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.docReady,t.matchesSelector)}(window,function(t,e,i){var n={};n.extend=function(t,e){for(var i in e)t[i]=e[i];return t},n.modulo=function(t,e){return(t%e+e)%e};var o=Object.prototype.toString;n.isArray=function(t){return"[object Array]"==o.call(t)},n.makeArray=function(t){var e=[];if(n.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0,o=t.length;o>i;i++)e.push(t[i]);else e.push(t);return e},n.indexOf=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,n=t.length;n>i;i++)if(t[i]===e)return i;return-1},n.removeFrom=function(t,e){var i=n.indexOf(t,e);-1!=i&&t.splice(i,1)},n.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"==typeof t&&1==t.nodeType&&"string"==typeof t.nodeName},n.setText=function(){function t(t,i){e=e||(void 0!==document.documentElement.textContent?"textContent":"innerText"),t[e]=i}var e;return t}(),n.getParent=function(t,e){for(;t!=document.body;)if(t=t.parentNode,i(t,e))return t},n.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},n.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},n.filterFindElements=function(t,e){t=n.makeArray(t);for(var o=[],r=0,s=t.length;s>r;r++){var a=t[r];if(n.isElement(a))if(e){i(a,e)&&o.push(a);for(var h=a.querySelectorAll(e),p=0,u=h.length;u>p;p++)o.push(h[p])}else o.push(a)}return o},n.debounceMethod=function(t,e,i){var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];t&&clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i||100)}},n.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var r=t.console;return n.htmlInit=function(i,o){e(function(){for(var e=n.toDashed(o),s=document.querySelectorAll(".js-"+e),a="data-"+e+"-options",h=0,p=s.length;p>h;h++){var u,c=s[h],d=c.getAttribute(a);try{u=d&&JSON.parse(d)}catch(l){r&&r.error("Error parsing "+a+" on "+c.nodeName.toLowerCase()+(c.id?"#"+c.id:"")+": "+l);continue}var f=new i(c,u),y=t.jQuery;y&&y.data(c,o,f)}})},n}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property","fizzy-ui-utils/utils"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof exports?module.exports=e(t,require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property"),require("fizzy-ui-utils")):(t.Outlayer={},t.Outlayer.Item=e(t,t.EventEmitter,t.getSize,t.getStyleProperty,t.fizzyUIUtils))}(window,function(t,e,i,n,o){function r(t){for(var e in t)return!1;return e=null,!0}function s(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}var a=t.getComputedStyle,h=a?function(t){return a(t,null)}:function(t){return t.currentStyle},p=n("transition"),u=n("transform"),c=p&&u,d=!!n("perspective"),l={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[p],f=["transform","transition","transitionDuration","transitionProperty"],y=function(){for(var t={},e=0,i=f.length;i>e;e++){var o=f[e],r=n(o);r&&r!==o&&(t[o]=r)}return t}();o.extend(s.prototype,e.prototype),s.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},s.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},s.prototype.getSize=function(){this.size=i(this.element)},s.prototype.css=function(t){var e=this.element.style;for(var i in t){var n=y[i]||i;e[n]=t[i]}},s.prototype.getPosition=function(){var t=h(this.element),e=this.layout.options,i=e.isOriginLeft,n=e.isOriginTop,o=parseInt(t[i?"left":"right"],10),r=parseInt(t[n?"top":"bottom"],10);o=isNaN(o)?0:o,r=isNaN(r)?0:r;var s=this.layout.size;o-=i?s.paddingLeft:s.paddingRight,r-=n?s.paddingTop:s.paddingBottom,this.position.x=o,this.position.y=r},s.prototype.layoutPosition=function(){var t=this.layout.size,e=this.layout.options,i={},n=e.isOriginLeft?"paddingLeft":"paddingRight",o=e.isOriginLeft?"left":"right",r=e.isOriginLeft?"right":"left",s=this.position.x+t[n];s=e.percentPosition&&!e.isHorizontal?100*(s/t.width)+"%":s+"px",i[o]=s,i[r]="";var a=e.isOriginTop?"paddingTop":"paddingBottom",h=e.isOriginTop?"top":"bottom",p=e.isOriginTop?"bottom":"top",u=this.position.y+t[a];u=e.percentPosition&&e.isHorizontal?100*(u/t.height)+"%":u+"px",i[h]=u,i[p]="",this.css(i),this.emitEvent("layout",[this])};var m=d?function(t,e){return"translate3d("+t+"px, "+e+"px, 0)"}:function(t,e){return"translate("+t+"px, "+e+"px)"};s.prototype._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=parseInt(t,10),r=parseInt(e,10),s=o===this.position.x&&r===this.position.y;if(this.setPosition(t,e),s&&!this.isTransitioning)return this.layoutPosition(),void 0;var a=t-i,h=e-n,p={},u=this.layout.options;a=u.isOriginLeft?a:-a,h=u.isOriginTop?h:-h,p.transform=m(a,h),this.transition({to:p,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},s.prototype.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},s.prototype.moveTo=c?s.prototype._transitionTo:s.prototype.goTo,s.prototype.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},s.prototype._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},s.prototype._transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return this._nonTransition(t),void 0;var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var g=u&&o.toDashed(u)+",opacity";s.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:g,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(l,this,!1))},s.prototype.transition=s.prototype[p?"_transition":"_nonTransition"],s.prototype.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},s.prototype.onotransitionend=function(t){this.ontransitionend(t)};var v={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};s.prototype.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,i=v[t.propertyName]||t.propertyName;if(delete e.ingProperties[i],r(e.ingProperties)&&this.disableTransition(),i in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[i]),i in e.onEnd){var n=e.onEnd[i];n.call(this),delete e.onEnd[i]}this.emitEvent("transitionEnd",[this])}},s.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(l,this,!1),this.isTransitioning=!1},s.prototype._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var x={transitionProperty:"",transitionDuration:""};return s.prototype.removeTransitionStyles=function(){this.css(x)},s.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},s.prototype.remove=function(){if(!p||!parseFloat(this.layout.options.transitionDuration))return this.removeElem(),void 0;var t=this;this.once("transitionEnd",function(){t.removeElem()}),this.hide()},s.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},s.prototype.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},s.prototype.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},s.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},s.prototype.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},s.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},s}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","eventEmitter/EventEmitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r,s){return e(t,i,n,o,r,s)}):"object"==typeof exports?module.exports=e(t,require("eventie"),require("wolfy87-eventemitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.eventie,t.EventEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o,r){function s(t,e){var i=o.getQueryElement(t);if(!i)return a&&a.error("Bad element for "+this.constructor.namespace+": "+(i||t)),void 0;this.element=i,h&&(this.$element=h(this.element)),this.options=o.extend({},this.constructor.defaults),this.option(e);var n=++u;this.element.outlayerGUID=n,c[n]=this,this._create(),this.options.isInitLayout&&this.layout()}var a=t.console,h=t.jQuery,p=function(){},u=0,c={};return s.namespace="outlayer",s.Item=r,s.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},o.extend(s.prototype,i.prototype),s.prototype.option=function(t){o.extend(this.options,t)},s.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),o.extend(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},s.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},s.prototype._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0,r=e.length;r>o;o++){var s=e[o],a=new i(s,this);n.push(a)}return n},s.prototype._filterFindItemElements=function(t){return o.filterFindElements(t,this.options.itemSelector)},s.prototype.getItemElements=function(){for(var t=[],e=0,i=this.items.length;i>e;e++)t.push(this.items[e].element);return t},s.prototype.layout=function(){this._resetLayout(),this._manageStamps();var t=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,t),this._isLayoutInited=!0},s.prototype._init=s.prototype.layout,s.prototype._resetLayout=function(){this.getSize()},s.prototype.getSize=function(){this.size=n(this.element)},s.prototype._getMeasurement=function(t,e){var i,r=this.options[t];r?("string"==typeof r?i=this.element.querySelector(r):o.isElement(r)&&(i=r),this[t]=i?n(i)[e]:r):this[t]=0},s.prototype.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},s.prototype._getItemsForLayout=function(t){for(var e=[],i=0,n=t.length;n>i;i++){var o=t[i];o.isIgnored||e.push(o)}return e},s.prototype._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){for(var i=[],n=0,o=t.length;o>n;n++){var r=t[n],s=this._getItemLayoutPosition(r);s.item=r,s.isInstant=e||r.isLayoutInstant,i.push(s)}this._processLayoutQueue(i)}},s.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},s.prototype._processLayoutQueue=function(t){for(var e=0,i=t.length;i>e;e++){var n=t[e];this._positionItem(n.item,n.x,n.y,n.isInstant)}},s.prototype._positionItem=function(t,e,i,n){n?t.goTo(e,i):t.moveTo(e,i)},s.prototype._postLayout=function(){this.resizeContainer()},s.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},s.prototype._getContainerSize=p,s.prototype._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},s.prototype._emitCompleteOnItems=function(t,e){function i(){o.emitEvent(t+"Complete",[e])}function n(){s++,s===r&&i()}var o=this,r=e.length;if(!e||!r)return i(),void 0;for(var s=0,a=0,h=e.length;h>a;a++){var p=e[a];p.once(t,n)}},s.prototype.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},s.prototype.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},s.prototype.stamp=function(t){if(t=this._find(t)){this.stamps=this.stamps.concat(t);for(var e=0,i=t.length;i>e;e++){var n=t[e];this.ignore(n)}}},s.prototype.unstamp=function(t){if(t=this._find(t))for(var e=0,i=t.length;i>e;e++){var n=t[e];o.removeFrom(this.stamps,n),this.unignore(n)}},s.prototype._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=o.makeArray(t)):void 0},s.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var t=0,e=this.stamps.length;e>t;t++){var i=this.stamps[t];this._manageStamp(i)}}},s.prototype._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},s.prototype._manageStamp=p,s.prototype._getElementOffset=function(t){var e=t.getBoundingClientRect(),i=this._boundingRect,o=n(t),r={left:e.left-i.left-o.marginLeft,top:e.top-i.top-o.marginTop,right:i.right-e.right-o.marginRight,bottom:i.bottom-e.bottom-o.marginBottom};return r},s.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},s.prototype.bindResize=function(){this.isResizeBound||(e.bind(t,"resize",this),this.isResizeBound=!0)},s.prototype.unbindResize=function(){this.isResizeBound&&e.unbind(t,"resize",this),this.isResizeBound=!1},s.prototype.onresize=function(){function t(){e.resize(),delete e.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var e=this;this.resizeTimeout=setTimeout(t,100)},s.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},s.prototype.needsResizeLayout=function(){var t=n(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},s.prototype.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},s.prototype.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},s.prototype.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},s.prototype.reveal=function(t){this._emitCompleteOnItems("reveal",t);for(var e=t&&t.length,i=0;e&&e>i;i++){var n=t[i];n.reveal()}},s.prototype.hide=function(t){this._emitCompleteOnItems("hide",t);for(var e=t&&t.length,i=0;e&&e>i;i++){var n=t[i];n.hide()}},s.prototype.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},s.prototype.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},s.prototype.getItem=function(t){for(var e=0,i=this.items.length;i>e;e++){var n=this.items[e];if(n.element===t)return n}},s.prototype.getItems=function(t){t=o.makeArray(t);for(var e=[],i=0,n=t.length;n>i;i++){var r=t[i],s=this.getItem(r);s&&e.push(s)}return e},s.prototype.remove=function(t){var e=this.getItems(t);if(this._emitCompleteOnItems("remove",e),e&&e.length)for(var i=0,n=e.length;n>i;i++){var r=e[i];r.remove(),o.removeFrom(this.items,r)}},s.prototype.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="";for(var e=0,i=this.items.length;i>e;e++){var n=this.items[e];n.destroy()}this.unbindResize();var o=this.element.outlayerGUID;delete c[o],delete this.element.outlayerGUID,h&&h.removeData(this.element,this.constructor.namespace)},s.data=function(t){t=o.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},s.create=function(t,e){function i(){s.apply(this,arguments)}return Object.create?i.prototype=Object.create(s.prototype):o.extend(i.prototype,s.prototype),i.prototype.constructor=i,i.defaults=o.extend({},s.defaults),o.extend(i.defaults,e),i.prototype.settings={},i.namespace=t,i.data=s.data,i.Item=function(){r.apply(this,arguments)},i.Item.prototype=new r,o.htmlInit(i,t),h&&h.bridget&&h.bridget(t,i),i},s.Item=r,s}),function(t,e){"function"==typeof define&&define.amd?define("packery/js/rect",e):"object"==typeof exports?module.exports=e():(t.Packery=t.Packery||{},t.Packery.Rect=e())}(window,function(){function t(e){for(var i in t.defaults)this[i]=t.defaults[i];for(i in e)this[i]=e[i]}var e=window.Packery=function(){};return e.Rect=t,t.defaults={x:0,y:0,width:0,height:0},t.prototype.contains=function(t){var e=t.width||0,i=t.height||0;return this.x<=t.x&&this.y<=t.y&&this.x+this.width>=t.x+e&&this.y+this.height>=t.y+i},t.prototype.overlaps=function(t){var e=this.x+this.width,i=this.y+this.height,n=t.x+t.width,o=t.y+t.height;return n>this.x&&e>t.x&&o>this.y&&i>t.y},t.prototype.getMaximalFreeRects=function(e){if(!this.overlaps(e))return!1;var i,n=[],o=this.x+this.width,r=this.y+this.height,s=e.x+e.width,a=e.y+e.height;return this.y<e.y&&(i=new t({x:this.x,y:this.y,width:this.width,height:e.y-this.y}),n.push(i)),o>s&&(i=new t({x:s,y:this.y,width:o-s,height:this.height}),n.push(i)),r>a&&(i=new t({x:this.x,y:a,width:this.width,height:r-a}),n.push(i)),this.x<e.x&&(i=new t({x:this.x,y:this.y,width:e.x-this.x,height:this.height}),n.push(i)),n},t.prototype.canFit=function(t){return this.width>=t.width&&this.height>=t.height},t}),function(t,e){if("function"==typeof define&&define.amd)define("packery/js/packer",["./rect"],e);else if("object"==typeof exports)module.exports=e(require("./rect"));else{var i=t.Packery=t.Packery||{};i.Packer=e(i.Rect)}}(window,function(t){function e(t,e,i){this.width=t||0,this.height=e||0,this.sortDirection=i||"downwardLeftToRight",this.reset()}e.prototype.reset=function(){this.spaces=[],this.newSpaces=[];var e=new t({x:0,y:0,width:this.width,height:this.height});this.spaces.push(e),this.sorter=i[this.sortDirection]||i.downwardLeftToRight},e.prototype.pack=function(t){for(var e=0,i=this.spaces.length;i>e;e++){var n=this.spaces[e];if(n.canFit(t)){this.placeInSpace(t,n);break}}},e.prototype.placeInSpace=function(t,e){t.x=e.x,t.y=e.y,this.placed(t)},e.prototype.placed=function(t){for(var e=[],i=0,n=this.spaces.length;n>i;i++){var o=this.spaces[i],r=o.getMaximalFreeRects(t);r?e.push.apply(e,r):e.push(o)}this.spaces=e,this.mergeSortSpaces()},e.prototype.mergeSortSpaces=function(){e.mergeRects(this.spaces),this.spaces.sort(this.sorter)},e.prototype.addSpace=function(t){this.spaces.push(t),this.mergeSortSpaces()},e.mergeRects=function(t){for(var e=0,i=t.length;i>e;e++){var n=t[e];if(n){var o=t.slice(0);o.splice(e,1);for(var r=0,s=0,a=o.length;a>s;s++){var h=o[s],p=e>s?0:1;n.contains(h)&&(t.splice(s+p-r,1),r++)}}}return t};var i={downwardLeftToRight:function(t,e){return t.y-e.y||t.x-e.x},rightwardTopToBottom:function(t,e){return t.x-e.x||t.y-e.y}};return e}),function(t,e){"function"==typeof define&&define.amd?define("packery/js/item",["get-style-property/get-style-property","outlayer/outlayer","./rect"],e):"object"==typeof exports?module.exports=e(require("desandro-get-style-property"),require("outlayer"),require("./rect")):t.Packery.Item=e(t.getStyleProperty,t.Outlayer,t.Packery.Rect)}(window,function(t,e,i){var n=t("transform"),o=function(){e.Item.apply(this,arguments)};o.prototype=new e.Item;var r=o.prototype._create;return o.prototype._create=function(){r.call(this),this.rect=new i,this.placeRect=new i},o.prototype.dragStart=function(){this.getPosition(),this.removeTransitionStyles(),this.isTransitioning&&n&&(this.element.style[n]="none"),this.getSize(),this.isPlacing=!0,this.needsPositioning=!1,this.positionPlaceRect(this.position.x,this.position.y),this.isTransitioning=!1,this.didDrag=!1},o.prototype.dragMove=function(t,e){this.didDrag=!0;var i=this.layout.size;t-=i.paddingLeft,e-=i.paddingTop,this.positionPlaceRect(t,e)},o.prototype.dragStop=function(){this.getPosition();var t=this.position.x!=this.placeRect.x,e=this.position.y!=this.placeRect.y;this.needsPositioning=t||e,this.didDrag=!1},o.prototype.positionPlaceRect=function(t,e,i){this.placeRect.x=this.getPlaceRectCoord(t,!0),this.placeRect.y=this.getPlaceRectCoord(e,!1,i)},o.prototype.getPlaceRectCoord=function(t,e,i){var n=e?"Width":"Height",o=this.size["outer"+n],r=this.layout[e?"columnWidth":"rowHeight"],s=this.layout.size["inner"+n];e||(s=Math.max(s,this.layout.maxY),this.layout.rowHeight||(s-=this.layout.gutter));var a;if(r){r+=this.layout.gutter,s+=e?this.layout.gutter:0,t=Math.round(t/r);var h;h=this.layout.options.isHorizontal?e?"ceil":"floor":e?"floor":"ceil";var p=Math[h](s/r);p-=Math.ceil(o/r),a=p}else a=s-o;return t=i?t:Math.min(t,a),t*=r||1,Math.max(0,t)},o.prototype.copyPlaceRectPosition=function(){this.rect.x=this.placeRect.x,this.rect.y=this.placeRect.y},o.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.layout.packer.addSpace(this.rect),this.emitEvent("remove",[this])},o}),function(t,e){"function"==typeof define&&define.amd?define(["classie/classie","get-size/get-size","outlayer/outlayer","packery/js/rect","packery/js/packer","packery/js/item"],e):"object"==typeof exports?module.exports=e(require("desandro-classie"),require("get-size"),require("outlayer"),require("./rect"),require("./packer"),require("./item")):t.Packery=e(t.classie,t.getSize,t.Outlayer,t.Packery.Rect,t.Packery.Packer,t.Packery.Item)}(window,function(t,e,i,n,o,r){function s(t,e){return t.position.y-e.position.y||t.position.x-e.position.x}function a(t,e){return t.position.x-e.position.x||t.position.y-e.position.y}n.prototype.canFit=function(t){return this.width>=t.width-1&&this.height>=t.height-1};var h=i.create("packery");return h.Item=r,h.prototype._create=function(){i.prototype._create.call(this),this.packer=new o,this.stamp(this.options.stamped);
var t=this;this.handleDraggabilly={dragStart:function(){t.itemDragStart(this.element)},dragMove:function(){t.itemDragMove(this.element,this.position.x,this.position.y)},dragEnd:function(){t.itemDragEnd(this.element)}},this.handleUIDraggable={start:function(e){t.itemDragStart(e.currentTarget)},drag:function(e,i){t.itemDragMove(e.currentTarget,i.position.left,i.position.top)},stop:function(e){t.itemDragEnd(e.currentTarget)}}},h.prototype._resetLayout=function(){this.getSize(),this._getMeasurements();var t=this.packer;this.options.isHorizontal?(t.width=Number.POSITIVE_INFINITY,t.height=this.size.innerHeight+this.gutter,t.sortDirection="rightwardTopToBottom"):(t.width=this.size.innerWidth+this.gutter,t.height=Number.POSITIVE_INFINITY,t.sortDirection="downwardLeftToRight"),t.reset(),this.maxY=0,this.maxX=0},h.prototype._getMeasurements=function(){this._getMeasurement("columnWidth","width"),this._getMeasurement("rowHeight","height"),this._getMeasurement("gutter","width")},h.prototype._getItemLayoutPosition=function(t){return this._packItem(t),t.rect},h.prototype._packItem=function(t){this._setRectSize(t.element,t.rect),this.packer.pack(t.rect),this._setMaxXY(t.rect)},h.prototype._setMaxXY=function(t){this.maxX=Math.max(t.x+t.width,this.maxX),this.maxY=Math.max(t.y+t.height,this.maxY)},h.prototype._setRectSize=function(t,i){var n=e(t),o=n.outerWidth,r=n.outerHeight;(o||r)&&(o=this._applyGridGutter(o,this.columnWidth),r=this._applyGridGutter(r,this.rowHeight)),i.width=Math.min(o,this.packer.width),i.height=Math.min(r,this.packer.height)},h.prototype._applyGridGutter=function(t,e){if(!e)return t+this.gutter;e+=this.gutter;var i=t%e,n=i&&1>i?"round":"ceil";return t=Math[n](t/e)*e},h.prototype._getContainerSize=function(){return this.options.isHorizontal?{width:this.maxX-this.gutter}:{height:this.maxY-this.gutter}},h.prototype._manageStamp=function(t){var e,i=this.getItem(t);if(i&&i.isPlacing)e=i.placeRect;else{var o=this._getElementOffset(t);e=new n({x:this.options.isOriginLeft?o.left:o.right,y:this.options.isOriginTop?o.top:o.bottom})}this._setRectSize(t,e),this.packer.placed(e),this._setMaxXY(e)},h.prototype.sortItemsByPosition=function(){var t=this.options.isHorizontal?a:s;this.items.sort(t)},h.prototype.fit=function(t,e,i){var n=this.getItem(t);n&&(this._getMeasurements(),this.stamp(n.element),n.getSize(),n.isPlacing=!0,e=void 0===e?n.rect.x:e,i=void 0===i?n.rect.y:i,n.positionPlaceRect(e,i,!0),this._bindFitEvents(n),n.moveTo(n.placeRect.x,n.placeRect.y),this.layout(),this.unstamp(n.element),this.sortItemsByPosition(),n.isPlacing=!1,n.copyPlaceRectPosition())},h.prototype._bindFitEvents=function(t){function e(){n++,2==n&&i.emitEvent("fitComplete",[t])}var i=this,n=0;t.on("layout",function(){return e(),!0}),this.on("layoutComplete",function(){return e(),!0})},h.prototype.resize=function(){var t=e(this.element),i=this.size&&t,n=this.options.isHorizontal?"innerHeight":"innerWidth";i&&t[n]==this.size[n]||this.layout()},h.prototype.itemDragStart=function(t){this.stamp(t);var e=this.getItem(t);e&&e.dragStart()},h.prototype.itemDragMove=function(t,e,i){function n(){r.layout(),delete r.dragTimeout}var o=this.getItem(t);o&&o.dragMove(e,i);var r=this;this.clearDragTimeout(),this.dragTimeout=setTimeout(n,40)},h.prototype.clearDragTimeout=function(){this.dragTimeout&&clearTimeout(this.dragTimeout)},h.prototype.itemDragEnd=function(e){var i,n=this.getItem(e);if(n&&(i=n.didDrag,n.dragStop()),!n||!i&&!n.needsPositioning)return this.unstamp(e),void 0;t.add(n.element,"is-positioning-post-drag");var o=this._getDragEndLayoutComplete(e,n);n.needsPositioning?(n.on("layout",o),n.moveTo(n.placeRect.x,n.placeRect.y)):n&&n.copyPlaceRectPosition(),this.clearDragTimeout(),this.on("layoutComplete",o),this.layout()},h.prototype._getDragEndLayoutComplete=function(e,i){var n=i&&i.needsPositioning,o=0,r=n?2:1,s=this;return function(){return o++,o!=r?!0:(i&&(t.remove(i.element,"is-positioning-post-drag"),i.isPlacing=!1,i.copyPlaceRectPosition()),s.unstamp(e),s.sortItemsByPosition(),n&&s.emitEvent("dragItemPositioned",[i]),!0)}},h.prototype.bindDraggabillyEvents=function(t){t.on("dragStart",this.handleDraggabilly.dragStart),t.on("dragMove",this.handleDraggabilly.dragMove),t.on("dragEnd",this.handleDraggabilly.dragEnd)},h.prototype.bindUIDraggableEvents=function(t){t.on("dragstart",this.handleUIDraggable.start).on("drag",this.handleUIDraggable.drag).on("dragstop",this.handleUIDraggable.stop)},h.Rect=n,h.Packer=o,h});
/**
 * @description	Initialise Brow object.
 * @type 			{Object}
 */
var Brow = window.Brow = {};

/**
 * @name				Brow.isEditMode
 * @description	Saves the current application state.
 * @public
 */
Brow.isEditMode = false;

/**
 * @name				Brow.activeCard
 * @description	Holds current state of an active card.
 * @public
 */
Brow.activeCard = null;

/**
 * @name				Brow.GUID
 * @description	Returns a Globally Unique Identifer as string
 * @public
 * @return			{String}
 */
Brow.GUID = (function () {
	'use strict';
	
	const s4 = function s4 () {
		return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16).substring(1);
	};

	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
	};
})();
/**
 * @name				Brow.Settings
 * @description	Stores all necessary HTMLElements, sets the theme and 
 *              	runs all other modules.	
 * @param			{Object} Brow
 * @return			{Function} setTheme
 * @return			{Function} useElements
 * @return			{Function} getElem
 * @return			{Function} start
 * @return			{String} BROW_KEY
 */
Brow.Settings = (function (Brow) {
	'use strict';

	/* Constants */
	const BROW_KEY				= 'BROW_THEME';
	const BROW_CARDS			= 'BROW_CARDS';
	const BROW_SETTINGS		= 'BROW_SETTINGS';

	/* Variables */
	var isSelectionState	= false;
	var browGrid			= null;
	var browTimer			= null;
	var browElements		= {
		onClickDialog : null,
		onClickNewCard : null,
		onClickSelectionList : null,
		SELECTION : null,
		CONTENT : null,
		CONTENT_OVERLAY : null,
		DIALOG : null,
		DIALOG_OVERLAY : null,
		TIMER : null
	};

	/**
	 * @description	Adds event listener.
	 * @private
	 */
	const _addEvents = function () {
		// Elements
		browElements.onClickSelectionList.addEventListener('mouseover', _showCardList);
		browElements.CONTENT_OVERLAY.addEventListener('click', _checkCardMode);
		browElements.SELECTION.addEventListener('mouseout', _closeCardList);
		[].forEach.call(browElements.onClickNewCard, function (item) {
			item.addEventListener('click', _addNewCard);
		});
	};

	/**
	 * @description	Calls the LayoutManager class.
	 * @private
	 */
	const _initLayoutManager = function () {
		browGrid = new BrowLayoutManager( browElements['CONTENT'] );
		browGrid.layout();
	};

	/**
	 * @description	Checks localStorage and loads the users cards
	 * @private
	 * @param			{Object} storage
	 */
	const _validateBrowCards = function (storage) {
		if (!localStorage[BROW_CARDS] || localStorage.length <= 1) {
			let defaultCard = new BrowCard({ type: 'text' });
			browElements['CONTENT'].appendChild( defaultCard );
		} else {
			for (let i = localStorage.length; i--;) {
				_parseCardsFromStorage(i);
			}
		}
	};

	/**
	 * @description	Gets localStorage, parses available cards and creates them.
	 * @private
	 * @param			{Number|String} index
	 */	
	const _parseCardsFromStorage = function (index) {
		let storageItem = JSON.parse( localStorage.getItem( localStorage.key(index) ) );
		if (storageItem['module']) {
			let browCard = new BrowCard({
				type: storageItem['type'],
				guid: storageItem['guid'],
				title: storageItem['title'],
				content: storageItem['content']
			});
			browElements['CONTENT'].appendChild( browCard );
		}
	};

	/**
	 * @description	Checks if custom key is set, if not: do it.
	 * @private
	 */
	const _checkIfCustomBrowCards = function () {
		if (!localStorage[BROW_CARDS]) {
			localStorage[BROW_CARDS] = true;
		}
	};

	/**
	 * @description	Displays list of cards.
	 * @private
	 * @param			{Object} event
	 */
	const _showCardList = function (event) {
		event.preventDefault();
		browElements.SELECTION.removeEventListener(_closeCardList);

		if (!Brow.isEditMode) {
			isSelectionState = true;
			browElements['SELECTION'].classList.add('show');
		}
	};

	/**
	 * @description	Hides list of cards on mouseout.
	 * @private
	 * @param			{Object} event
	 */
	const _closeCardList = function (event) {
		let selectionTopPosition	= browElements['SELECTION'].parentNode.getBoundingClientRect().top - 1;
		let selectionIsVisible		= browElements['SELECTION'].classList.contains('show');
		let movedOut					= event.clientY <= selectionTopPosition;

		if (movedOut && isSelectionState) {
			browElements.onClickSelectionList.removeEventListener(_showCardList);
			browElements['SELECTION'].classList.add('hide');
			setTimeout(function () {
				browElements['SELECTION'].classList.remove('show', 'hide');
			}, 300);
		}
	};

	/**
	 * @description	Checks clicked card type and appends it to the DOM.
	 * @private
	 * @param			{Object} event
	 */
	const _addNewCard = function (event) {
		event.preventDefault();

		let selectedCard	= this.getAttribute('data-create-card');
		let browCard		= new BrowCard({ type: `${selectedCard}` });

		browElements['CONTENT'].appendChild( browCard );
		browGrid.add( browCard );
	};

	/**
	 * @description	Saves state of active card.
	 * @private
	 * @param			{Object} event
	 */
	const _checkCardMode = function (event) {
		if (Brow.isEditMode && Brow.activeCard.isEditMode) {
			Brow.activeCard.saveState();
		}
	};

	/**
	 *	@description	Validates the users timer settings.
	 * @private
	 */
	const _validateBrowTimer = function ()  {
		browTimer = new BrowTimer( browElements['TIMER'] );
		let dateSettings = { dateFormat : null, abbreviations : false };

		if (!localStorage[BROW_SETTINGS]) {
			dateSettings['dateFormat'] = '24h';
			browTimer.setDateFormat({
				'format': dateSettings.dateFormat
			});
			localStorage.setItem(BROW_SETTINGS, JSON.stringify(dateSettings));
		}
		else {
			dateSettings = JSON.parse(localStorage[BROW_SETTINGS]);
			browTimer.setDateFormat({
				'format': dateSettings.dateFormat, 
				'abbreviations': dateSettings.abbreviations
			});
		}

		browTimer.run();
	};

	const _dialogSettingsCallback = function () {		
		let formatCheckbox	= this.dialogContent.querySelector('#settings--dateformat');
		let abbrCheckbox		= this.dialogContent.querySelector('#settings--ampm');
		let dateSettings		= JSON.parse(localStorage[BROW_SETTINGS]);

		// Validate date settings and update DOM
		if (dateSettings['dateFormat'] === '12h') {
			formatCheckbox.checked = false;
		}
		abbrCheckbox.checked = dateSettings['abbreviations'];
		abbrCheckbox.disabled = !dateSettings['abbreviations'];

		this.dialogContent.addEventListener('click', _updateDateFormat.bind(this));
	};

	const _updateDateFormat = function (event) {
		let formatCheckbox	= this.dialogContent.querySelector('#settings--dateformat');
		let abbrCheckbox		= this.dialogContent.querySelector('#settings--ampm');
		let timeFormat			= '24h';
		let dateSettings		= JSON.parse(localStorage[BROW_SETTINGS]);

		// If date format checkbox is clicked
		if (event.target.id === 'settings--dateformat') {
			if (!formatCheckbox.checked) {
				timeFormat = '12h';
				abbrCheckbox.disabled = false;	
			}
			else if (formatCheckbox.checked && !abbrCheckbox.disabled) {
				abbrCheckbox.disabled = true;
				abbrCheckbox.checked = false;
			}

			browTimer.setDateFormat({ 'format': timeFormat });
			dateSettings['dateFormat'] = timeFormat;
			dateSettings['abbreviations'] = abbrCheckbox.checked;
		}

		// If abbreviation checkbox is clicked
		if (!event.target.disabled && event.target.id === 'settings--ampm') {
			browTimer.setDateFormat({ 'abbreviations': abbrCheckbox.checked });
			dateSettings['abbreviations'] = abbrCheckbox.checked;
		}

		localStorage.setItem(BROW_SETTINGS, JSON.stringify(dateSettings));
	};

	/**
	 * @description	Adds all dialog.
	 * @private
	 */
	const _initDialogs = function () {
		let currentLocation = window.location.href.slice(0, -1);
		
		[].forEach.call(browElements['onClickDialog'], function (item) {
			let dialogContent		= item.getAttribute('data-dialog');
			let dialogCallback	= false;

			if (dialogContent === 'settings') {
				dialogCallback = _dialogSettingsCallback;
			}

			let browDialog = new BrowDialog({
				elem: item,
				content: `${currentLocation}/markup/dialog-${dialogContent}.html`,
				callback: dialogCallback
			});
		});
	};

	/**
	 * @name				Brow.Settings.useElements
	 *	@description	Assigns app specific elements for further usage.
	 * @private
	 * @param			{Object} config
	 */
	const useElements = function (config) {
		if (!config || typeof config !== 'object') {
			throw new Error('No valid options passed!');
		}

		browElements = {
			onClickDialog : config.onClickDialog,
			onClickNewCard : config.onClickNewCard,
			onClickSelectionList : config.onClickSelectionList,
			SELECTION : config.SELECTION,
			CONTENT : config.CONTENT,
			CONTENT_OVERLAY : config.CONTENT_OVERLAY,
			DIALOG : config.DIALOG,
			DIALOG_OVERLAY : config.DIALOG_OVERLAY,
			TIMER : config.TIMER
		};
	};

	/**
	 * @name				Brow.Settings.getElem
	 *	@description	Returns the elements object
	 * @public
	 * @return			{Object}
	 */
	const getElem = function () {
		return browElements;
	};

	/**
	 * @name				Brow.Settings.start
	 *	@description	Calls all necessary modules which are required to run the app.
	 * @public
	 */
	const initialiseAndStartApp = function () {
		_initDialogs();
		_validateBrowTimer();
		_validateBrowCards();
		_initLayoutManager();
		_addEvents();
	};
	
	/* Public API */
	return {
		//setTheme : setTheme,
		useElements : useElements,
		getElem : getElem,
		start : initialiseAndStartApp,
		checkCustom : _checkIfCustomBrowCards,
		BROW_KEY : BROW_KEY,
	};
})(Brow);
/**
 * @name				BrowDialog
 * @description	Shows/hides the dialog.
 * @param			{Object} Brow
 */
BrowDialog = (function (Brow) {
	'use strict';

	class BrowDialog {
		constructor (config) {
			this.elem				= config.elem;
			this.path				= config.content;
			this.callback			= config.callback;
			this.dialogOverlay	= Brow.Settings.getElem()['DIALOG_OVERLAY'];
			this.dialogElem		= Brow.Settings.getElem()['DIALOG'];
			this.dialogContainer	= this.dialogElem.querySelector('.dialog__inner');
			this.dialogContent	= null;

			this.addEvents();
		}

		/**
		 *	@description	Loads the content
		 * @private
		 * @param			{Object} event
		 */
		showContent (event) {
			let _self = this;
			event.preventDefault();
			
			fetch(this.path)
			.then(function (response) {
				return response.text();
			})
			.then(function (body) {
				_self.dialogContainer.innerHTML = body;
				_self.dialogContent = _self.dialogContainer.querySelector('.dialog__content');
				if (_self.callback) _self.callback(this);
			});

			this.dialogElem.classList.add('show');
			this.dialogOverlay.classList.add('show');
		}

		/**
		 *	@description	Closes the dialog
		 * @private
		 * @param			{Object} event
		 */
		closeDialog (event) {
			let _curTarget			= event.target;
			let _curKeyCode		= event.keyCode;
			let _dialogIsShown	= this.dialogElem.classList.contains('show');
			let _isCloseBtn		= _curTarget.classList.contains('dialog__close');
			let _isOutsideDialog	= _curTarget === this.dialogElem && _dialogIsShown;
			let _isESCKey			= _curKeyCode === 27;

			if (_isCloseBtn || _isOutsideDialog || _isESCKey && _dialogIsShown) {
				this.dialogContainer.innerHTML = null;
				this.dialogElem.classList.remove('show');
				this.dialogOverlay.classList.remove('show');
			}
		}

		/**
		 * @name				Brow.Dialog.start
		 *	@description	Adds events
		 * @private
		 */
		addEvents () {
			this.elem.addEventListener('click', this.showContent.bind(this) );
			this.dialogElem.addEventListener('click', this.closeDialog.bind(this) );
			window.addEventListener('keydown', this.closeDialog.bind(this) );
		}
	}

	return BrowDialog;
})(Brow);
BrowLayoutManager = (function (window, Brow) {
	'use strict';

	class BrowLayoutManager {
		constructor (container) {
			this.dragSelector = '.brow__content__module /deep/ .dragg-area';
			this.transition	= 0;
			this.pkrOptions	= {
				itemSelector: '.brow__content__module',
				transitionDuration: this.transition,
				columnWidth: '.brow__content--sizer',
				gutter: '.brow__content--gutter',
				stamp: '.is-stamp',
				isInitLayout: false
			};
			this.dragOptions	= { handle: this.dragSelector };
			this.packery		= new Packery(container, this.pkrOptions);
			this.addDraggabilly();
			this.addEvents();
		}

		/**
		 * Will initialise the Packery layout.
		 */
		layout () {
			this.packery.layout();
		}

		/**
		 * Adds a new item to the Packery layout.
		 * @param {NodeList|HTMLElement} elem
		 */
		add (elem) {
			this.packery.appended( elem );
			this.addDraggabilly();
		}

		/**
		 * Removes passed element from the Packery layout.
		 * @param {NodeList|HTMLElement} config
		 */
		remove (elem) {
			this.packery.remove( elem );
			this.layout();
		}

		/**
		 * Makes an element sticky
		 * @param {NodeList|HTMLElement} config
		 */
		stamp (elem) {
			this.packery.stamp( elem );
		}

		/**
		 * Initialises Draggabilly.
		 */
		addDraggabilly () {
			const _self = this;
			let cards = this.packery.getItemElements();
			cards.forEach(function (item) {
				let draggie = new Draggabilly(item, _self.dragOptions);
				_self.packery.bindDraggabillyEvents( draggie );
				draggie.on('pointerDown', _self.validateBrowMode.bind(draggie));
			});
		}

		/**
		 * Adds EventListener.
		 */
		addEvents () {
			window.addEventListener('card-edit', this.validateLayoutState.bind(this));
			window.addEventListener('card-save', this.validateLayoutState.bind(this));
			window.addEventListener('card-remove', this.validateLayoutState.bind(this));
		}

		/**
		 * Checks event type and validates the layout's state.
		 * @param  {Object} event
		 */
		validateLayoutState (event) {
			let elem = document.querySelector(`[data-module-guid="${event.detail}"]`);

			// activated editing mode
			if (event.type === 'card-edit') {
				Brow.isEditMode = true;
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.add('show');
			} 

			// saved card
			if (event.type === 'card-save') {
				this.layout();
				Brow.isEditMode = false;
				Brow.activeCard = null;
				Brow.Settings.checkCustom();
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
			}
			
			// card is removed
			if (event.type === 'card-remove') {
				this.remove(elem);
				Brow.isEditMode = false;
				localStorage.removeItem( event.detail );
				Brow.Settings.getElem()['CONTENT_OVERLAY'].classList.remove('show');
			}
		}

		/**
		 * Checks if editMode is active and weither disables or enables the dragging.
		 * @param  {Object} event
		 */
		validateBrowMode (event) {
			if (Brow.isEditMode && Brow.activeCard.isEditMode) {
				this.disable();
			} else {
				this.enable();
			}
		}
	}

	return BrowLayoutManager;
})(window, Brow);
/**
 * @name				BrowTimer
 * @description	Class which appends a time string to an element 
 *              	and updates it every second.
 */
BrowTimer = (function() {
	'use strict';

	class BrowTimer {
		constructor (elem) {
			if (!(elem && elem.nodeName)) {
				throw new Error('You haven\'t passed a valid HTMLElement!');
			}

			this.update	= 1000;
			this.elem	= elem;
			this.format = '24h';
			this.abbreviations = false;
		}

		/**
		 * @description	Creates a string with current time in HH:MM:SS
		 * @return			{String}
		 */
		getTime () {
			let date				= new Date();
			let dateHours		= date.getHours();
			let dateMinutes	= date.getMinutes();
			let dateSeconds	= date.getSeconds();
			let dateAbbr		= '';

			// If time format is set to 12h, use 12h-system.
			if (this.format === '12h' && dateHours >= 12) {
				if (dateHours > 12) {
					dateHours -= 12;
				}
				if (this.abbreviations) {
					dateAbbr = this.getAbbreviation(dateHours);
				}
				else {
					dateAbbr = '';
				}
			}

			// Add '0' if below 10
			if (dateHours < 10) dateHours = `0${dateHours}`;
			if (dateMinutes < 10) dateMinutes = `0${dateMinutes}`;
			if (dateSeconds < 10) dateSeconds = `0${dateSeconds}`;

			return `${dateHours}:${dateMinutes}:${dateSeconds} ${dateAbbr}`;
		}

		/**
		 * @description	Validates number and returns either AM or PM.
		 * @param 			{Number} time
		 * @return			{String}
		 */
		getAbbreviation (time) {
			if (typeof time !== 'number') {
				time = parseFloat(time);
			}

			return (time >= 12) ? 'AM' : 'PM';
		}

		/**
		 *	@description	Needs to be written.
		 * @param			{Object} config
		 */
		setDateFormat (config) {
			if (!config) {
				config = { 'format': '24h' };
			}

			if (config.format) {
				this.format = config.format;
			}

			this.abbreviations = config.abbreviations;
			this.run();
		}

		/**
		 * @name				BrowTimer.run
		 * @description	Sets the element in which the time should be displayed.
		 * @param			{Element} elem
		 * @return 			{HTMLElement}
		 */
		run () {
			let self = this;
			
			this.elem.textContent = this.getTime();
			setInterval(function () {
				self.elem.textContent = self.getTime();
			}, this.update);

			return this.elem;
		}
	}

	return BrowTimer;
})();
/**
 * @name				BrowCard
 * @description	/
 */
BrowCard = (function (Brow) {
	'use strict';

	class BrowCard {
		constructor (config) {
			if (!config) config = {};
			
			// initialisation
			this.type			= (config.type) ? config.type : 'text';
			this.guid			= (config.guid) ? config.guid : Brow.GUID();
			this.content		= (config.content) ? config.content : {};
			// settings
			this.isEditMode	= false;
			this.config			= { elem: null };
			this.saveState		= this.saveCardChanges;
			this.wrapper		= null;
			this.storage		= { 
				module: true, 
				type: this.type, 
				guid: this.guid, 
				content: this.content,
				style: { width: 1, stamp: false }
			};
			// events
			this.eventOption	= { 'detail': this.guid };
			this.editEvent		= new CustomEvent('card-edit', this.eventOption);
			this.saveEvent		= new CustomEvent('card-save', this.eventOption);
			this.removeEvent	= new CustomEvent('card-remove', this.eventOption);

			return this.createCard();
		}

		/**
		 * @name				BrowCard.createCard
		 * @description	Creates a new card module
		 * @public
		 */
		createCard () {
			switch (this.type) {
				case 'text':
					this.wrapper = new TextCard( this );
					break;
				case 'weather':
					this.wrapper = new WeatherCard( this );
					break;
				default:
					this.wrapper = new TextCard( this );
					break;
			}

			this.applyCardData();
			this.addEvents( this.wrapper.getContent );

			return this.wrapper.getContent;
		}

		/**
		 * @description	Applies classes and data-attributes to DOM element.
		 * @private
		 */
		applyCardData () {
			this.wrapper.getContent.classList.add('brow__content__module');
			this.wrapper.getContent.setAttribute('data-module-width', this.storage.style.width);
			this.wrapper.getContent.setAttribute('data-module-guid', this.guid);
			this.wrapper.getContent.setAttribute('data-module-type', this.type);
		}

		/**
		 * @description	Sets eventListener on current card element.
		 * @private
		 * @param			{Object} event
		 */
		addEvents (elem) {
			elem.addEventListener('settings', this.setCardEvents.bind(this) );
			elem.addEventListener('edit', this.activateEditMode.bind(this) );
			elem.addEventListener('save', this.saveCardChanges.bind(this) );
			elem.addEventListener('remove', this.removeCard.bind(this) );
		}

		/**
		 * @description	Stores event target into class.
		 * @private
		 * @param			{Object} event
		 */
		setCardEvents (event) {
			if (this.config.elem === null) {
				this.config.elem = event.target;
			}
		}

		/**
		 * @description	Shows the save button and makes editing possible.
		 * @private
		 * @param			{Object} event
		 */
		activateEditMode (event) {
			// config
			Brow.activeCard = this;
			this.isEditMode = true;
			this.wrapper.edit();
			// visual
			this.config.elem.classList.add('fx', 'is-edit');
			// fire custom event
			window.dispatchEvent( this.editEvent );
		}

		/**
		 * @description	Shows the edit button and saves the content to localStorage.
		 * @private
		 * @param			{Object} event
		 */
		saveCardChanges (event) {
			// config
			this.isEditMode = false;
			this.wrapper.save();
			// visual
			this.config.elem.classList.remove('fx', 'is-edit');
			// fire custom event
			window.dispatchEvent( this.saveEvent );
		}

		/**
		 * @description	Removes a card from localStorage.
		 * @private
		 * @param			{Object} event
		 */
		removeCard (event) {
			this.config.elem.classList.add('fx', 'is-delete');
			this.config.elem.addEventListener('transitionend', 
				function (event) {
					// Only listen to the last transition.
					if (event.propertyName === 'transform') {
						this.isEditMode = false;
						window.dispatchEvent( this.removeEvent );
					}
				}.bind(this)
			);
		}
	}

	return BrowCard;
})(Brow);
/**
 * @name				TextCard
 * @description	/
 */
TextCard = (function () {
	'use strict';

	class TextCard {
		constructor (card) {
			this.parent		= card;
			this.elem		= document.createElement('text-card');
			this.headline	= this.createHeadline();
			this.content	= this.previewContent();

			this.elem.appendChild( this.headline );
			this.elem.appendChild( this.content );
		}

		/**
		 * @description	Sets the preview content
		 * @public
		 * @return 			{HTMLElement}
		 */
		previewContent () {
			let textElem			= document.createElement('p');
			let defaultContent	= Brow.Data.Content('text')['default'];
			let storedContent		= this.parent.content.text;
			
			if (storedContent) {
				textElem.innerHTML = storedContent;
			}

			textElem.setAttribute('data-text-preview', defaultContent);
			return textElem;
		}

		/**
		 * @description	Creates the heading
		 * @private
		 * @return 			{HTMLElement}
		 */	
		createHeadline () {
			let headElem = document.createElement('h1');
			let cardHasTitle = this.parent.content.headline;
			headElem.innerHTML = (cardHasTitle) ? cardHasTitle : Brow.Data.Header('text');
			return headElem;
		}

		/**
		 * @description	Returns the entire module <text-card> element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		/**
		 * @description	Saves current content to localStorage.
		 * @public
		 */	
		updateStorage () {
			this.parent.storage['content'] = {
				text: this.content.innerHTML,
				headline: this.headline.innerHTML
			};
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}

		/**
		 * @description	Sets 'contenteditable="true"' to all elements.
		 * @public
		 */	
		edit () {
			this.content.setAttribute('contenteditable', true);
			this.headline.setAttribute('contenteditable', true);
		}

		/**
		 * @description	Removes attributes, updates Object and saves it to localStorage.
		 * @public
		 */	
		save () {
			this.content.removeAttribute('contenteditable');
			this.headline.removeAttribute('contenteditable');
			this.parent.content.headline = this.headline.innerHTML;
			this.updateStorage();
		}
	}

	return TextCard;
})();
/**
 * @name				WeatherCard
 * @description	/
 */
WeatherCard = (function () {
	'use strict';

	class WeatherCard {
		constructor (card) {
			this.parent		= card;
			this.elem		= document.createElement('weather-card');
			this.coord		= { 'latitude': 0, 'longitude': 0, 'accuracy': 0 };
			this.city		= null;
			this.degrees	= null;
			this.weather	= 'cloudy';

			this.elem.setAttribute('loading', '');
			this.elem.setAttribute('weather', `${this.weather}`);
			this.elem.setAttribute('time', 'day');
			this.getGeolocation();
		}

		/**
		 * @description	Returns the entire module wrapper element.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		get getContent () {
			return this.elem;
		}

		/**
		 * @description	Returns an element containing current degrees.
		 * @public
		 * @return 			{HTMLElement}
		 */	
		createTemperatur (degrees) {
			let degreeElem = document.createElement('span');
			degreeElem.classList.add('weather__degrees');
			degreeElem.innerText = `${degrees}°C`;

			return degreeElem;
		}

		createContent () {
			let city = document.createElement('h1');
			let location = document.createElement('h2');
			let temperatur = this.createTemperatur(this.degrees);
			// City
			city.classList.add('weather__city');
			city.innerText = this.city;
			// Location
			location.classList.add('weather__place');
			location.innerText = 'Current location';

			this.elem.appendChild( temperatur );
			this.elem.appendChild( city );
			this.elem.appendChild( location );
			this.elem.removeAttribute('loading');
		}

		/**
		 * @description	Gets current geolocation and saves the values.
		 * @private
		 * @todo 			Add error callback.
		 */	
		getGeolocation () {
			let self = this;
			navigator.geolocation.getCurrentPosition(
				// Success
				function (position) {
					self.coord['latitude']	= position.coords.latitude;
					self.coord['longitude']	= position.coords.longitude;
					self.coord['accuracy']	= position.coords.accuracy;
					self.getWeatherFromAPI();
				},
				// Error
				function (error) {
					console.log(error);
				}
			);
		}

		/**
		 * @description	Uses OpenWeatherMap.org to fetch the weather data.
		 * @private
		 */	
		getWeatherFromAPI () {
			let weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${this.coord.latitude}&lon=${this.coord.longitude}`;
			let self = this;

			fetch(weatherURL)
			.then(function (response) { return response.text(); })
			.then(function (response) {
				let weatherResponse = JSON.parse(response);
				console.log(weatherResponse);
				// Set values
				self.city = weatherResponse.name;
				self.kelvinCalculator( weatherResponse.main.temp );
				self.validateWeather( weatherResponse.weather[0].main );
				// Create content
				self.createContent();
			});
		}

		kelvinCalculator (temp) {
			let absZeroTempInC	= 273.15; // -273.15 °C
			let absZeroTempInF	= 459.67; // -459.67 °F
			let calcCelcius		= Math.floor(temp - absZeroTempInC);
			this.degrees = calcCelcius;
		}

		validateWeather (weather) {
			weather = weather.toString().toLowerCase();
			this.weather = weather;

			switch (weather) {
				case 'clear':
					this.elem.setAttribute('weather', `${this.weather}`);
					break;
			}
		}

		/**
		 * @description	Saves current content to localStorage.
		 * @public
		 */	
		updateStorage () {
			this.parent.storage['content'] = {};
			localStorage[this.parent.guid] = JSON.stringify(this.parent.storage);
		}

		edit () {}

		save () {
			this.updateStorage();
		}
	}

	return WeatherCard;
})();
/**
 * @name				Brow.Data
 * @description	Stores all module related data like default content.
 * @param			{Object} Brow
 * @return			{Function} Header
 * @return			{Function} Content
 */
Brow.Data = (function (Brow) {
	'use strict';

	/* Constants */
	const _cardDefaultTitles = {
		'text': 'Save any content you want.',
		'todo': 'Task list'
	};

	const _cardDefaultContents = {
		'text': {
			'default': `Just click the edit button and enter any content you want.
							It's possible to remove all styles of your copied text using the "unstyle"-button.`
		}
	};

	/**
	 * @name				BrowDash.Data.Header
	 * @description	Returns the default title of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultHeader = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultTitles[type];
	};

	/**
	 * @name				BrowDash.Data.Content
	 * @description	Returns the default content of each module
	 * @public
	 * @param			{String} type
	 */
	const _getDefaultContent = function (type) {
		if (typeof type !== 'string') return;
		return _cardDefaultContents[type];
	};	

	/* Public API */
	return {
		Header: _getDefaultHeader,
		Content: _getDefaultContent
	};
})(Brow);
(function (window) {
	'use strict';

	const BROW		= Brow.Settings;
	const SETTINGS	= BROW.useElements({
		onClickDialog : document.querySelectorAll('.open-dialog'),
		onClickNewCard : document.querySelectorAll('.trigger-newcard'),
		onClickSelectionList : document.querySelector('.trigger-selection'),
		SELECTION : document.querySelector('.trigger-cardlist'),
		CONTENT : document.querySelector('.trigger-content'),
		CONTENT_OVERLAY : document.querySelector('.content__overlay'),
		DIALOG : document.querySelector('.trigger-dialog'),
		DIALOG_OVERLAY: document.querySelector('#brow__overlay'),
		TIMER: document.querySelector('.trigger-timer')
	});

	//BROW.setTheme('blue-a400');
	BROW.start();

})(window);