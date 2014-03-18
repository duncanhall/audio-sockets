
/*
 * MULTI DIRECTION CONTROL
 */
var MultiDirectionControl = Class.extend({
	
	init: function (element) {

		this.element = element;
		this.touchSupported = 'ontouchstart' in this.element;
    this.createTouchPointer();
		this.getOrigin();
		this.addTouchListeners();

    this.onTouchStart = null;
    this.onTouchStart = null;
	},

  /**
   * Create a pointer to show the touch position
   */
  createTouchPointer: function () {

    this.touch = document.createElement('div');
    this.touch.className = 'touch';
    document.body.appendChild(this.touch);    
  },

  /**
   * Save reference to the control center origin
   */
	getOrigin: function () {

    var rect = this.element.getBoundingClientRect();
   	this.origin = {
   		x:rect.left + ((rect.right - rect.left) / 2), 
   		y:rect.top + ((rect.bottom - rect.top) / 2)};
	}, 

  /**
   * Add listeners for touch or mouse 
   */
	addTouchListeners: function () {

    var scope = this;

    if (this.touchSupported) {

        this.element.ontouchstart = function(event){ scope.touchStart(event); }; 
        this.element.ontouchend = function(event){ scope.touchEnd(event); };
      
    } else {

        scope.element.onmousedown = function(event){ scope.touchStart(event); };
    }
	},

  /**
   * Touch down
   */
	touchStart: function (event) {

    this.onTouchStart();

    var scope = this;

		this.setTouchPosition(event);
		this.touch.style.visibility = 'visible';

    if (this.touchSupported) {

      document.body.ontouchmove = function (event) { 
        scope.setTouchPosition(event);
        event.preventDefault();
      };

    } else {
        
      document.body.onmousemove = function(event){ scope.setTouchPosition(event); };
      document.body.onmouseup = function(event){ scope.touchEnd(event); };
    }		
	},
	
  /**
   * Touch up
   */  
	touchEnd: function (event) {
	
    this.onTouchEnd();
		this.touch.style.visibility = 'hidden';

    if (this.touchSupported) {

      document.body.ontouchmove = null;

    } else {
    
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    }
	},

  /**
   * Touch move
   */
	setTouchPosition: function (event) {

    var pageX = this.touchSupported ? event.touches[0].pageX : event.pageX;
    var pageY = this.touchSupported ? event.touches[0].pageY : event.pageY;

    var px = pageX - 40;
    var py = pageY - 40;            

    this.touch.style.margin = py + 'px 0 0 ' + px  + 'px';  
	}

});