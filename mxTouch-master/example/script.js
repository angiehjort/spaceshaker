var funcDomReady = '';
function onDomReady(func) {
        var oldonload = funcDomReady;
        if (typeof funcDomReady != 'function')
                funcDomReady = func;
        else {
                funcDomReady = function() {
                        oldonload();
                        func();
                }
        }
}

function init() {
    if (arguments.callee.done) return;

    arguments.callee.done = true;
    if(funcDomReady)funcDomReady();
};

/* Mozilla/Firefox/Opera 9 */
if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", init, false);

/* Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
document.write("<script id=\"__ie_onload\" defer=\"defer\" src=\"javascript:void(0)\"><\/script>");
var script = document.getElementById("__ie_onload");
script.onreadystatechange = function() {
    if (this.readyState == "complete")
	init();}; 
/*@end @*/

/* Safari, Chrome */
if (/WebKit/i.test(navigator.userAgent)) { // Safari, Chrome
    var _timer = setInterval(function() {
	if (/loaded|complete/.test(document.readyState)) {
	    clearInterval(_timer);
	    init(); 
	}
    }, 10);
}

/* для остальных браузеров */
window.onload = init;

onDomReady(function(){
	
	document.querySelector('#butt').addEventListener('touch', function(e)
	{
		alert(e.touches.length);
	}, 
	false);
	
	var firstDistance = 1;
	var scale = 1;
	var prevScale = 1;
	
	var angle = 0;
	var prevAngle = 0;
	
	function distance2d(points)
	{
		var lastPoint = points.length - 1;
		var x = (points[0].pageX - points[lastPoint].pageX);
		var y = (points[0].pageY - points[lastPoint].pageY);
		
		return Math.sqrt(x*x + y*y);
	}
	
	function angle2dRad(points)
	{
		var ab = (points[0].pageX - points[1].pageX) 
			   * (points[2].pageX  - points[1].pageX) 
			   + 
			     (points[0].pageY - points[1].pageY) 
			   * (points[2].pageY - points[1].pageY);
		
		var cosin = ab/(distance2d([points[1], points[0]]) * distance2d([points[1], points[2]]));
		
		return Math.acos(cosin)*180/Math.PI;
	}
	
	document.querySelector('#scroller').addEventListener('touchstart', function(e)
	{
		if(e.touches.length > 1)
		{
			firstDistance = distance2d(e.touches);
		}
		
	}, false);
	
	document.querySelector('#scroller').addEventListener('touchend', function(e)
	{
		prevScale = 1;
		prevAngle = 0;
	}, false);
	
	document.querySelector('#scroller').addEventListener('touchmove', function(e)
	{
		var child = this.querySelector(':first-child');
		if(e.touches.length > 1)
		{
			var vendor = 'webkit';
			child.style[vendor + 'TransitionProperty'] = '-' + vendor.toLowerCase() + '-transform';
			child.style[vendor + 'TransformOrigin'] = e.touches[0].pageX + 'px ' +  e.touches[0].pageY +'px';			
			child.style[vendor + 'TransitionDuration'] = '40ms';
			
		}
		
		if(e.touches.length == 2)
		{
			var newDistance = distance2d(e.touches);
			var newScale = newDistance / firstDistance;
			
			scale = scale - (prevScale - newScale);
			prevScale = newScale;
		}
		
		if(e.touches.length == 3)
		{
			var newAngle = angle2dRad(e.touches);
			prevAngle = prevAngle ? prevAngle : newAngle;
			child.style[vendor + 'TransformOrigin'] = e.touches[1].pageX + 'px ' +  e.touches[1].pageY +'px';		
			angle = angle - (prevAngle - newAngle);
			prevAngle = newAngle;
		}

		child.style[vendor + 'Transform'] = 'translate(0px,0px) scale(' + scale + ', ' + scale + ') rotate(' + angle + 'deg)';		
	}, false)
});