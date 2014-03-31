
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

    this.axisSpace = Math.floor(this.element.offsetWidth / 10);
    this.tx = 0;
    this.ty = 0;
    this.color = '';

    this.onTouchStart = null;
    this.onTouchEnd = null;
  },

  addEventListener: function (type, listener) {

    switch (type) {

      case MultiDirectionControl.TOUCH_START:
        this.onTouchStart = listener;
        break;

      case MultiDirectionControl.TOUCH_END:
        this.onTouchEnd = listener;
        break;

      case MultiDirectionControl.TOUCH_MOVE:
        this.onTouchMove = listener;
        break;

      default:
        console.warn('Unknown event type.');
        break;

    }

  },

  setColor: function (color) {

    this.color = color;
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

    var width = rect.right - rect.left;
    var height = rect.bottom - rect.top;
    var x = rect.left + (width / 2);
    var y = rect.top + (height / 2);
    var radius = width / 2;

    this.origin = {x:x, y:y, width:width, height:height, radius:radius};
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

    if (this.onTouchStart != null) 
      this.onTouchStart();

    this.setTouchPosition(event);
    this.touch.style.visibility = 'visible';
    this.element.style.backgroundColor = '#' + this.color;
    this.element.className = 'touchdown';
    
    var scope = this;

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

    if (this.onTouchEnd != null)
      this.onTouchEnd();

    this.touch.style.visibility = 'hidden';
    this.element.style.backgroundColor = '#000000';
    this.element.className = 'touchup';

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

    var px = pageX;
    var py = pageY;            

    var dx = this.origin.x - px;
    var dy = this.origin.y - py;
    var dz = Math.sqrt((dx * dx) + (dy * dy));

    var r = (this.origin.radius / dz);
    r = r > 1 ? 1 : r;

    var rx = (r * px + (1 - r) * this.origin.x) - 46;
    var ry = (r * py + (1 - r) * this.origin.y) - 44;

    this.touch.style.margin = ry + 'px 0 0 ' + rx  + 'px';  

    if (this.onTouchMove != null)
    {
      var zx = Math.abs(Math.abs(rx) - Math.abs(this.tx));
      var zy = Math.abs(Math.abs(ry) - Math.abs(this.ty));

      if (zx > this.axisSpace)
      {
        this.tx = rx;
        this.onTouchMove(dx, dy);
      }

      if (zy > this.axisSpace)
      {
        this.ty = ry;
        this.onTouchMove(dx, dy);
      }
    }
  }

});


MultiDirectionControl.TOUCH_START = 'mdc:touchStart';
MultiDirectionControl.TOUCH_END = 'mdc:touchEnd';
MultiDirectionControl.TOUCH_MOVE = 'mdc:touchMove';