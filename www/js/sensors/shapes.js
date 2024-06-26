// Modified from shapes.js
//
// shapes.js was by Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Last update December 2011
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Shape(x, y, w, h, fill, draggable, z, fadeable) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.fill = fill || '#AAAAAA';
  this.draggable = draggable || false;
  this.z = z || 0; //0 is background
  this.fadeable = fadeable || false;
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx, brightness) {
  var scaleX = ctx.canvas.offsetWidth;
  var scaleY = ctx.canvas.offsetHeight;
 
  if (this.fadeable){
	  
      ctx.fillStyle = "rgba(0,0,0," + (1-brightness).toString() +")"
	  
  } 
  else { 
      ctx.fillStyle = this.fill;
  }
  ctx.fillRect(this.x * scaleX, this.y * scaleY, this.w * scaleX, this.h * scaleY);
  
}

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

function Poly(pointsArray, fillColor, strokeColor){
	this.pointsArray = pointsArray || [];
	this.fillColor = fillColor || '#bbb';
	this.strokeColor = strokeColor || '#bbb';

}

function Shadow(x, y, w, h, fillColor, strokeColor){
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.pointsArray = [[x,y], [x + w, y + h], [0,0], [0,0], [x,y]];
	this.fillColor = fillColor || '#bbb';
	this.strokeColor = strokeColor || '#bbb';

}

function FancyShadow(x, y, w, h, fillColor, strokeColor){
	
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 0;
	this.h = h || 0;
	this.east = this.w > 0;; //shadow can fall to east (right, plus x direction), not west
    this.north = this.h < 0;  //shadow can fall to north (up, minus y direction), not south
	this.pointsArray = [[x, y], [x,y+h], [0,0], [0,0], [0,0], [x+w,y], [x,y]];
	this.fillColor = fillColor;
	this.strokeColor = strokeColor;
	
	//if (this.east) console.log('east'); else console.log('west');
	//if (this.north) console.log('north'); else console.log('south');

}



Poly.prototype.draw = function(ctx){
	var scaleX = ctx.canvas.width;
	var scaleY = ctx.canvas.height;
	if (this.pointsArray.length <= 0) return;
    ctx.beginPath()

	ctx.moveTo(this.pointsArray[0][0] * scaleX, this.pointsArray[0][1] * scaleY);
    
	for (var i = 0; i < this.pointsArray.length; i++) {
        ctx.lineTo(this.pointsArray[i][0] * scaleX, this.pointsArray[i][1] * scaleY);
    }
    if (this.strokeColor != null && this.strokeColor != undefined)
        ctx.strokeStyle = this.strokeColor;

    if (this.fillColor != null && this.fillColor != undefined) {
        ctx.fillStyle = this.fillColor;
        ctx.fill();
    }
}


FancyShadow.prototype.draw = function(ctx, dx, dy){
	var scaleX = ctx.canvas.width;
	var scaleY = ctx.canvas.height;
    		
	if (this.pointsArray.length != 7) return;
	//move the three points that mark the shadow
	/*
	var pointsArray20 = this.pointsArray[1][0] + dx;
    var pointsArray21 = this.pointsArray[1][1] + dy;

	var pointsArray30 = this.pointsArray[0][0] + dx;
    var pointsArray31 = this.pointsArray[0][1] + dy;

	var pointsArray40 = this.pointsArray[5][0] + dx;
    var pointsArray41 = this.pointsArray[5][1] + dy;
	*/
	
	this.pointsArray[2][0] = this.pointsArray[1][0] + dx;
    this.pointsArray[2][1] = this.pointsArray[1][1] + dy;

	this.pointsArray[3][0] = this.pointsArray[0][0] + dx;
    this.pointsArray[3][1] = this.pointsArray[0][1] + dy;

	this.pointsArray[4][0] = this.pointsArray[5][0] + dx;
    this.pointsArray[4][1] = this.pointsArray[5][1] + dy;
    
	//now limit any points to staying on the drawn-side
	var east = dx > 0;
	var north = dy < 0;	
	
	var angle = Math.round((Math.atan(dy/dx) + Math.PI)*180/Math.PI,0); //North should be zero degrees
	if (debugShadow){
		if (  north &&  east) console.log('north east ', angle);
		if (  north && !east) console.log('north west ', angle);
		if ( !north &&  east) console.log('south east ', angle);
		if ( !north && !east) console.log('south west ', angle);
	}
	// limit moveable points to region of shadow
	minX = Math.min(this.pointsArray[0][0],this.pointsArray[5][0]);
	maxX = Math.max(this.pointsArray[0][0],this.pointsArray[5][0]);
	minY = Math.min(this.pointsArray[0][1],this.pointsArray[1][1]);
	maxY = Math.max(this.pointsArray[0][1],this.pointsArray[1][1]);
	
	this.pointsArray[2][0] = Math.max(minX, this.pointsArray[2][0]);
	this.pointsArray[3][0] = Math.max(minX, this.pointsArray[3][0]);
	this.pointsArray[4][0] = Math.max(minX, this.pointsArray[4][0]);
	
	this.pointsArray[2][0] = Math.min(maxX, this.pointsArray[2][0]);
	this.pointsArray[3][0] = Math.min(maxX, this.pointsArray[3][0]);
	this.pointsArray[4][0] = Math.min(maxX, this.pointsArray[4][0]);

	this.pointsArray[2][1] = Math.max(minY, this.pointsArray[2][1]);
	this.pointsArray[3][1] = Math.max(minY, this.pointsArray[3][1]);
	this.pointsArray[4][1] = Math.max(minY, this.pointsArray[4][1]);
	
	this.pointsArray[2][1] = Math.min(maxY, this.pointsArray[2][1]);
	this.pointsArray[3][1] = Math.min(maxY, this.pointsArray[3][1]);
	this.pointsArray[4][1] = Math.min(maxY, this.pointsArray[4][1]);
	

	/*
	if (this.east && !east){//eastern shadow zone with a west directed shadow
            //limit shadow points to western-most (-x) side of the box
			var minX = this.pointsArray[0][0]; 
			this.pointsArray[2][0] = Math.max(pointsArray20, minX);
			this.pointsArray[3][0] = Math.max(pointsArray30, minX);
			this.pointsArray[4][0] = Math.max(pointsArray40, minX);	
			
	}
	if (!this.east && east){//western shadow zone with an east directed shadow
		//limit shadow points to eastern-most (+x) side of the box
		var maxX = this.pointsArray[0][0]; 
		this.pointsArray[2][0] = Math.min(pointsArray20, maxX);
		this.pointsArray[3][0] = Math.min(pointsArray30, maxX);
		this.pointsArray[4][0] = Math.min(pointsArray40, maxX);			
	}
		
	if (!this.north && north){//southern shadow zone with a northern directed shadow
		//limit shadow points to northern-most (-y) most side of the box
		var minY = this.pointsArray[0][1]; 
		this.pointsArray[2][0] = Math.max(pointsArray21, minY);
		this.pointsArray[3][0] = Math.max(pointsArray31, minY);
		this.pointsArray[4][0] = Math.max(pointsArray41, minY);	
			
	}
	if (this.north && !north){//northern shadow zone with a southern directed shadow
            //limit shadow points to southern-most (+y) side of the box
			var maxY = this.pointsArray[0][1]; 
			this.pointsArray[2][0] = Math.min(pointsArray20, maxY);
			this.pointsArray[3][0] = Math.min(pointsArray30, maxY);
			this.pointsArray[4][0] = Math.min(pointsArray40, maxY);			
	}	

	*/		
    ctx.beginPath();
	ctx.moveTo(this.pointsArray[0][0] * scaleX, this.pointsArray[0][1] * scaleY);
    
	for (var i = 0; i < this.pointsArray.length; i++) {
        ctx.lineTo(this.pointsArray[i][0] * scaleX, this.pointsArray[i][1] * scaleY);
    }
	
    if (this.strokeColor != null && this.strokeColor != undefined)
        ctx.strokeStyle = this.strokeColor;

    if (this.fillColor != null && this.fillColor != undefined) {
        ctx.fillStyle = this.fillColor; 
        ctx.fill();
    }
	

}



Shadow.prototype.draw = function(ctx, dx, dy){
	var scaleX = ctx.canvas.width;
	var scaleY = ctx.canvas.height;
	if (this.pointsArray.length <= 0) return;
	
	this.pointsArray[2][0] = this.pointsArray[1][0] + dx;
    this.pointsArray[2][1] = this.pointsArray[1][1] + dy;
	this.pointsArray[3][0] = this.pointsArray[0][0] + dx;
    this.pointsArray[3][1] = this.pointsArray[0][1] + dy;	

	ctx.moveTo(this.pointsArray[0][0] * scaleX, this.pointsArray[0][1] * scaleY);
    
	for (var i = 0; i < this.pointsArray.length; i++) {
        ctx.lineTo(this.pointsArray[i][0] * scaleX, this.pointsArray[i][1] * scaleY);
    }
    if (this.strokeColor != null && this.strokeColor != undefined)
        ctx.strokeStyle = this.strokeColor;

    if (this.fillColor != null && this.fillColor != undefined) {
        ctx.fillStyle = this.fillColor;
        ctx.fill();
    }

}


function CanvasState(canvas) {
  // **** First some setup! ****
  
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  
  //this.ctx.globalCompositeOperation = 'destination-out'
  
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****
  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.polys = []; // the collection of filled polys to be drawn
  this.shadows = []; //the collection of shapes (distorting rects, drawn as polys) to be drawn
  this.fancyShadows = []; //the collection of FancyShadows to be drawn
  this.dragging = false; // Keep track of when we are dragging
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
  
  // **** Then events! ****
  
  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = myState.shapes;

    var l = shapes.length;
    for (var i = l-1; i >= 0; i--) {
      if ((shapes[i].contains(mx, my)) && shapes[i].draggable) {
        var mySel = shapes[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    if (myState.dragging){
      var mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;   
      myState.valid = false; // Something's dragging so we must redraw
    }
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
  }, true);
  // double click for making new shapes
  /*canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
  }, true);
  */
  // **** Options! ****
  
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;  
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

CanvasState.prototype.addPoly = function(poly) {
  this.polys.push(poly);
  this.valid = false;
}


CanvasState.prototype.addShadow = function(shadow) {
  this.shadows.push(shadow);
  this.valid = false;
}

CanvasState.prototype.addFancyShadow = function(fancyShadow) {
  this.fancyShadows.push(fancyShadow);
  this.valid = false;
}


CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  
  if (true){ //!this.valid) {force redraw
    var ctx = this.ctx;
    var shapes = this.shapes;
	var polys = this.polys;
	var shadows = this.shadows;
	var fancyShadows = this.fancyShadows;
	
	
    this.clear();
	ctx.beginPath()
    

    
    // draw all shapes with z == 0
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0 || shape.z > 0) continue;
      shapes[i].draw(ctx, sensor_irradiance);
    }
	
    var l = polys.length;
    for (var i = 0; i < l; i++) {
      polys[i].draw(ctx);
    }	

	
    // ** Add stuff you want drawn in the background all the time here **
    var l = shadows.length;
    for (var i = 0; i < l; i++) {
      shadows[i].draw(ctx, shadow_dx, shadow_dy);
    }
	


    // ** Add stuff you want drawn in the background all the time here **
    var l = fancyShadows.length;

    for (var i = 0; i < l; i++) {
      
      fancyShadows[i].draw(ctx, shadow_dx, shadow_dy);
	  

    }


    
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
    }
    
    // ** Add stuff you want drawn on top all the time here **
    
	// draw all shapes with z > 0
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0 || shape.z == 0) continue;
      shapes[i].draw(ctx, sensor_irradiance);
    }
	
    this.valid = false; //true;
  }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you want to be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}

 

function shapes_init() {
  var s = new CanvasState(document.getElementById('sensors'));
  s.addShape(new Shape(0.475,0,0.05,1, 'black', false, 1)); // The default is gray
  s.addShape(new Shape(0,0.475,1,0.05, 'black', false, 1));

  s.addShape(new Shape(0,0,0.475,0.475, '#74A65B', false, 0));
  s.addShape(new Shape(0.525,0,0.475,0.475, '#5B74A6', false, 0));
  s.addShape(new Shape(0.525,0.525,0.475,0.475, '#A65B5B', false, 0));
  s.addShape(new Shape(0,0.525,0.475,0.475, '#5BA6A6', false, 0));
 
  
  s.addFancyShadow(new FancyShadow(0.525,0.525,0.475,0.475,'rgba(0,0,0,0.7)','black'));
  s.addFancyShadow(new FancyShadow(0.525,0.475,0.475,-0.475,'rgba(0,0,0,0.7)','black'));
  s.addFancyShadow(new FancyShadow(0.475,0.525,-0.475,0.475,'rgba(0,0,0,0.7)','black'));
  s.addFancyShadow(new FancyShadow(0.475,0.475,-0.475,-0.475,'rgba(0,0,0,0.7)','black'));  
  
  /*
  s.addFancyShadow(new FancyShadow(0.5,0.5,0.5,0.5,'rgba(0,0,0,0.7)','black')); //Falls to the south, east
  s.addFancyShadow(new FancyShadow(0.5,0.5,0.5,-0.5,'rgba(0,0,0,0.7)','black'));
  s.addFancyShadow(new FancyShadow(0.5,0.5,-0.5,0.5,'rgba(0,0,0,0.7)','black'));
  s.addFancyShadow(new FancyShadow(0.5,0.5,-0.5,-0.5,'rgba(0,0,0,0.7)','black')); 
  */
  s.addShape(new Shape(0,0,1,1, 'black', false, 1, true));  //for darkening sensors at night

  

}



// Now go make something amazing!