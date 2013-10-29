/*!
 * mxTouch v1.a ~ Copyright (c) 2011 Dmitry Golovanev
 * Released under MIT license http://www.opensource.org/licenses/mit-license.php
 */
(function(){
	/**
	 *	Monkey patching O_0
	 */
	var addEventListener = Node.prototype.addEventListener;
	Node.prototype.addEventListener = function(event, callback, useCapture) 
	{
		/**
		 * Magic goes here, redefine event handler
		 */
		var handleEvents = {
			'touchstart' : 'mousedown',
			'touchend' : 'mouseup',
			'touchmove' : 'mousemove',
			'touch' : 'click'
		}
		
		if(handleEvents.hasOwnProperty(event))
		{
			addEventListener.call(this, handleEvents[event], MTouchEvents.getHandler(handleEvents[event], callback), useCapture);
		}
		else
		{
			addEventListener.call(this, event, callback, useCapture);
		}
	}

	/**
	 * Define custom event
	 */
	function MTouchEvent(e, type)
	{
		this.e = e;
		this.type = type;
		this.copyEvent(e);
	}

	MTouchEvent.prototype = {

		e : null,

		touches : [],
		
		type : '-',
		
		preventDefault : function()
		{
			this.e.preventDefault();
			this.copyEvent(this.e)
		},
		
		copyEvent : function(e)
		{
			for(var i in e) if(i != 'type' && typeof e[i] !== 'function')
			{
				this[i] = e[i];
			}
		},
		
		appendSelf : function()
		{
			var newTouches = [];
			for(var t = 0, l = MTouchEvents.touches.length; t < l; t++)
			{
				newTouches.push(MTouchEvents.touches[t]);
			}
			
			this.touches = newTouches;
			this.touches.push(this);
		},
		
		getEvent : function()
		{
			return this.e;
		}
	}

	
	function MTouchEvents(){}
	
	MTouchEvents = {
		
		mousedwn : false,
		
		touches : [],
		
		getHandler : function(event, calls)
		{
			return function(e)
			{	
				var callback = calls;
				if(!MTouchEvents.hasOwnProperty('on' + event) || MTouchEvents['on' + event].call(this, e))
				{	
					var parent = 'call' in callback ? this : callback;
					callback = 'call' in callback ? callback : callback.handleEvent;
					
					var handleEvents = {
						'mousedown' : 'touchstart',
						'mouseup' : 'touchend',
						'mousemove' : 'touchmove',
						'click' : 'touch'
					}
					
					var xe = MTouchEvents.copyEvent(e, handleEvents[e.type]);
					xe.appendSelf();
					return callback.call(parent, xe);
				}
				
				return false;
			}
		},
		
		removeTouch : function(e)
		{
			var newTouches = [];
			for(var t = 0, l = MTouchEvents.touches.length; t < l; t++)
			{
				if(MTouchEvents.touches[t] != e)
				{
					newTouches.push(MTouchEvents.touches[t]);
				}
			}
			
			MTouchEvents.touches = newTouches;
			MTouchEvent.prototype.touches = MTouchEvents.touches;
		},
		
		createPoint : function(e)
		{
			if(e.altKey)
			{	
				var xe = MTouchEvents.copyEvent(e, 'touch')
				var multiPoint = new MultiPoint({'top' : (e.pageY - 10) + 'px', 'left' : (e.pageX - 10) + 'px'}, xe);
				MTouchEvents.touches.push(xe);
				MTouchEvent.prototype.touches = MTouchEvents.touches;
				return false;
			}
		},
		
		copyEvent : function(e, type)
		{
			var xe = new MTouchEvent(e, type);
			return xe;
		},
		
		onmousedown : function(e)
		{
			MTouchEvents.mousedwn = true;
			return true;
		},	
		
		onmouseup : function(e)
		{
			MTouchEvents.mousedwn = false;
			return !e.altKey;
		},	
		
		onmousemove : function(e)
		{
			return MTouchEvents.mousedwn;
		},
	}

	function MultiPoint(config, event)
	{
		this.config = {
			'width' : '20px',
			'height' : '20px',
			'background-color' : 'rgba(10,100,100, 0.8)',
			'position' : 'absolute',
			'left' : '100px',
			'top' : '100px',
			'border-radius' : '10px',
			'box-shadow' : '1px 1px 3px rgba(10,100,100,0.5)'
		};
		
		this.options(config);
		this.element = document.createElement('div');
		this.setStyle(this.config);
		this.setEvent(event);
		
		var self = this;
		this.element.addEventListener('click', function(){
			MTouchEvents.removeTouch(self.getEvent());
			document.querySelector('body').removeChild(self.getElement());
		})
		
		document.querySelector('body').appendChild(this.getElement());
	}


	MultiPoint.prototype = {
		
		e : null,
		
		setEvent : function(e)
		{
			this.e = e;
			return this;
		},
		
		getEvent : function()
		{
			return this.e;
		},
		
		getElement : function()
		{
			return this.element;
		},
		
		setStyle : function(style)
		{
			var styleString = '';
			for(var i in style)
			{
				styleString += i + ':' + style[i] + ';'
			}
			
			this.getElement().setAttribute('style', styleString);
			
			return this;
		},
		
		options : function(config)
		{
			if(typeof config == 'object')
			{
				for(var i in config)
				{
					this.config[i] = config[i];
				}
			}
			
			return this.config;
		}
		
	}
	
	document.addEventListener('click', MTouchEvents.createPoint, true);
	document.addEventListener('mousedown', MTouchEvents.onmousedown, true);
	document.addEventListener('mouseup', MTouchEvents.onmouseup, true);
}());