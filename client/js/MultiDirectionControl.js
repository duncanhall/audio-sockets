
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

    var px = pageX;
    var py = pageY;            

    var dx = this.origin.x - px;
    var dy = this.origin.y - py;
    var dz = Math.sqrt((dx * dx) + (dy * dy));

    var rq = (this.origin.radius / dz);
    rq = rq > 1 ? 1 : rq;

    var r = rq;
    var rx = (r * px + (1 - r) * this.origin.x) - 46;
    var ry = (r * py + (1 - r) * this.origin.y) - 44;

    this.touch.style.margin = ry + 'px 0 0 ' + rx  + 'px';  
  }

});
