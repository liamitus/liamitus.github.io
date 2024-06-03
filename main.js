/*! (c) Liam Howell - 06-02-2024 */

var app=angular.module("lgh",["prettyColors"]);function directive(t,e,n){e=e||t,app.directive(t,function(){return{restrict:"E",transclude:n,templateUrl:e+".html"}})}function getAge(t){var e=new Date,n=new Date(t),o=e.getFullYear()-n.getFullYear(),_=e.getMonth()-n.getMonth();return(_<0||0===_&&e.getDate()<n.getDate())&&o--,o}directive("liam","name"),directive("bizarroLiam","bizarro-name"),directive("mainContent","main-content",!0),directive("photo"),directive("about"),directive("cv"),directive("contact"),app.filter("age",function(){return function(t){return getAge(t)}}),console.log(" ___       ___  ________  _____ ______           ___  ___  ________  ___       __   _______   ___       ___          "),console.log("|\\  \\     |\\  \\|\\   __  \\|\\   _ \\  _   \\        |\\  \\|\\  \\|\\   __  \\|\\  \\     |\\  \\|\\  ___ \\ |\\  \\     |\\  \\         "),console.log("\\ \\  \\    \\ \\  \\ \\  \\|\\  \\ \\  \\\\\\__\\ \\  \\       \\ \\  \\\\\\  \\ \\  \\|\\  \\ \\  \\    \\ \\  \\ \\   __/|\\ \\  \\    \\ \\  \\        "),console.log(" \\ \\  \\    \\ \\  \\ \\   __  \\ \\  \\\\|__| \\  \\       \\ \\   __  \\ \\  \\\\\\  \\ \\  \\  __\\ \\  \\ \\  \\_|/_\\ \\  \\    \\ \\  \\       "),console.log("  \\ \\  \\____\\ \\  \\ \\  \\ \\  \\ \\  \\    \\ \\  \\       \\ \\  \\ \\  \\ \\  \\\\\\  \\ \\  \\|\\__\\_\\  \\ \\  \\_|\\ \\ \\  \\____\\ \\  \\____  "),console.log("   \\ \\_______\\ \\__\\ \\__\\ \\__\\ \\__\\    \\ \\__\\       \\ \\__\\ \\__\\ \\_______\\ \\____________\\ \\_______\\ \\_______\\ \\_______\\"),console.log("    \\|_______|\\|__|\\|__|\\|__|\\|__|     \\|__|        \\|__|\\|__|\\|_______|\\|____________|\\|_______|\\|_______|\\|_______|"),console.log("                                                                                                                     "),console.log("Hey friend! Enjoy picking apart my personal site thing: https://github.com/liamitus/liamhowell.com"),function(t){var e=["#17334a","#d1907a","#7b9e61","#7688a7","#575766","steelblue"],n=o;function o(){return n=function(t){var e,n,o=t.length;for(;0!==o;)n=Math.floor(Math.random()*o),e=t[o-=1],t[o]=t[n],t[n]=e;return t}(e.slice())}function a(){return n.length<=0&&o(),n.pop()}angular.module("prettyColors",[]).directive("prettyColor",function(){return{restrict:"A",link:function(t,e,n){var o=e[0],_=n.prettyColor,r=o.style.background,i=r;_&&(o.style.background=a()),e.on("click",function(){for(;r===i;)i=o.style.background=a();r=i})}}})}(document);var initialLeft,leftPercent,rightPercent,initialPosition,debuggingEnabled=!0;function getErrorObject(){try{throw Error("")}catch(t){return t}}function d(t){if(debuggingEnabled){var e=getErrorObject().stack.split("\n")[4],n=e.indexOf("at "),o=e.slice(n+2,e.length);if(1<arguments.length)console.warn(o,arguments);else switch(typeof t){case"undefined":console.debug(o);break;case"number":case"string":console.warn(t+o);break;case"object":t.__DEBUG_calledFrom__=o;default:console.dir(t)}}}function placeDebugDivs(t){for(var e=0;e<t.length;e++){var n='<div style="position:absolute;width:5px;height:5px;top:'+t[e][1]+"px;left:"+t[e][0]+'px;background:indigo;z-index:10;"></div>';document.body.innerHTML+=n}}function calculateSlope(t,e){var n=e[0]-t[0],o=(e[1]-t[1])/n;return o*=100}function getBackgroundLeftPoint(t){return[0,t.innerHeight*leftPercent]}function getBackgroundRightPoint(t){return[t.innerWidth,t.innerHeight*rightPercent]}function getBackgroundDegrees(t){return calculateSlope(getBackgroundLeftPoint(t),getBackgroundRightPoint(t))}function endsWithSemicolon(t){return";"==t.substr(t.length-1)}function extractStyleName(t){var e=t.indexOf(":");return e<1?-1:t.substr(0,e)}function getExistingStyle(t,e){extractStyleName(e)}function addToElementStyle(t,e){var n=t[0].style.cssText;getExistingStyle(t,e);var o=n.trim();endsWithSemicolon(o)||(o+=";"),o+=e,endsWithSemicolon(e)||(o+=";"),t[0].style.cssText=o}function applyCSSRotation(t,e){var n="-webkit-transform: rotate("+e+"deg);";n+="-o-transform: rotate("+e+"deg);",addToElementStyle(t,n+="transform: rotate("+e+"deg);")}function applyToChildren(t,e){for(var n=t.children(),o=0;o<n.length;o++)e(angular.element(n[o]))}function getCornerPoints(t){var e=t[0].getBoundingClientRect(),n=e.top,o=e.left,_=t[0].offsetWidth,r=t[0].offsetHeight;return[[o,n],[o+_,n],[o,n+r],[o+_,n+r]]}function calculateRotatedPoint(t,e,n){var o=-n,_=t[0],r=t[1],i=e[0],a=e[1];return[i+(_-i)*Math.cos(o)+(r-a)*Math.sin(o),a-(_-i)*Math.sin(o)+(r-a)*Math.cos(o)]}function getRotatedCoordinates(t,e,n){for(var o=[],_=0;_<t.length;_++)o.push(calculateRotatedPoint(t[_],e,n));return o}function applyRotation(t,e){applyCSSRotation(t,e),applyToChildren(t,function(t){applyCSSRotation(t,-e)})}function calculateLeftAdjustment(t,e){return t[0].offsetLeft-e[2][0]}function applyLeftAdjustment(t,e){addToElementStyle(t,"left: "+e+"px"),applyToChildren(t,function(t){addToElementStyle(t,"padding-left: "+-(e-=initialLeft)+"px")})}function leftAdjustment(t,e){var n=getCornerPoints(t);applyLeftAdjustment(t,calculateLeftAdjustment(t,getRotatedCoordinates(n,n[0],e)))}function applyWidthAdjustment(t,e){var n=getCornerPoints(e),o=getBackgroundDegrees(t)*(Math.PI/180),_=getRotatedCoordinates(n,n[0],o),r=t.innerWidth-_[1][0];addToElementStyle(e,"width: "+(e[0].offsetWidth+r)+"px")}function applyHeightAdjustment(t,e){var n=e[0],o=getCornerPoints(e);d(o);var _=o[0][1];0<_&&(d(n),n.style.top=0,n.style.paddingTop=_+"px")}function calculateWidthAdjustment(t,e,n){var o=t.innerWidth-n[1][0];return e[0].offsetWidth+o}function applyTransformation(t,e){var n=getBackgroundDegrees(t);leftAdjustment(e,n*(Math.PI/180)),applyWidthAdjustment(t,e),applyRotation(e,n)}function parsePercent(t,e){return t?parseFloat(t)/100:e}app.directive("rotatedBackground",["$window",function(o){return{restrict:"A",link:function(t,e,n){initialLeft=e[0].offsetLeft,leftPercent=1-parsePercent(n.leftpercent,1/3),rightPercent=parsePercent(n.rightpercent,1/3),initialPosition=getCornerPoints(e),applyTransformation(o,e),o.addEventListener("resize",function(){applyTransformation(o,e)})}}}]);