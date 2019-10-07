/* 

Start with the mobile design which is full width windows in order (top to bottom)

render
graph
sensors, clock - half width each
blockly



We want the blockly area to be as big as the screen can allow

idea - hide panels until they are the right size?


*/

//use this to track whether we should override panel positions
// on window size
var userHasNotModifiedLayout = true;

//extra height added to content area to prevent scrollbar appearing
var jspanelExtraHeight = 6; 
var jspanelExtraWidth = 6;

//amount to subtract from panel size to calculate content height after resize
var jspanelHeaderHeight = 29; 

/******************************************************************************


var panels = [{
	
	
	
}]

******************************************************************************/

/*
var gridBig = gridpanel.createGrid(16, 9);
gridBig.setProperty('sizeRule','showAll');

gridBig.addPanel('renderPanel',0,0,8,7);
gridBig.addPanel('graphPanel',8,0,5,3);
gridBig.addPanel('blocklyPanel',8,3,8,6.5);
gridBig.addPanel('sensorPanel',13,0,3,3);
gridBig.addPanel('clockPanel',0,7,2,2);
gridBig.addPanel('scorePanel',2,7,2,2);
gridBig.addPanel('codePanel',6,7,2,2);
gridBig.addPanel('dataPanel',4,7,2,2);
*/

var configuration = { grids:[
		{
			'id':'small',
			'cols':3,
			'rows':11,
			'minwidth':0,
			'sizeRule':'fullWidth'
		},
		{   'id':'big',
			'cols':16,
			'rows':9,
			'minwidth':680,
			'sizeRule':'showAll'
		}
	]
}

var grid = new MetaGrid('bigsmall');

grid.createGrid(configuration);

console.log(grid)

var useMasterPanel = false;

if (useMasterPanel){
 grid.addPanel('masterPanel',  0, 0, 0, 0, 'small');
 grid.addPanel('masterPanel',  0, 0, 0, 0, 'big');
}


grid.addPanel('renderPanel',  0, 0, 8, 7, 'big');
grid.addPanel('graphPanel',   8, 0, 5, 3, 'big');
grid.addPanel('blocklyPanel', 8, 3, 8, 6.5, 'big');
grid.addPanel('sensorPanel', 13, 0, 3, 3, 'big');
grid.addPanel('clockPanel',   0, 7, 2, 2, 'big');
grid.addPanel('scorePanel',   2, 7, 2, 2, 'big');
grid.addPanel('codePanel',    6, 7, 2, 2, 'big');
grid.addPanel('dataPanel',    4, 7, 2, 2, 'big');
grid.addPanel('scrollPanel',  0, 0, 0, 0, 'big');

grid.addPanel('scrollPanel',  0,   0, 3, 0.20, 'small', true);
grid.addPanel('renderPanel',  0,   0.20 , 3,   3, 'small');
grid.addPanel('graphPanel',   0,   3.20, 3,   2, 'small');
grid.addPanel('sensorPanel',  0,   5.20, 1,   1, 'small');
grid.addPanel('clockPanel',   1,   5.20, 1,   1, 'small');
grid.addPanel('scorePanel',   2,   5.20, 1,   1, 'small');
grid.addPanel('blocklyPanel', 0,   6.20, 3,   3, 'small');
grid.addPanel('codePanel',    0,   9.20, 1.5, 1, 'small');
grid.addPanel('dataPanel',    1.5, 9.20, 1.5, 1, 'small');




/******************************************************************************

Create jsPanels 
 
/*****************************************************************************/
$( document ).ready(function() { 

	//grid.setPageSize(window.innerWidth, window.innerHeight);
	grid.setPageSize($(window).innerWidth(), $(window).innerHeight());
        grid.setActiveGrid();

  if (useMasterPanel){
    var id = 'masterPanel'
    var dims = grid.getPanelDims(id) 

    var masterPanel = jsPanel.create({
      id: id,
      border:"0px",
      header: false,

      maximizedMargin: 0,
      syncMargins: true,
      theme:       'primary',
      contentOverflow: 'auto',
      contentSize: {
        width: dims.w,
        height: dims.h
      },
      position:    dims.p, 
      animateIn:   'jsPanelFadeIn',
      onwindowresize: false,
      content:     '<div id="masterPanelContent"></div>',
    });
    var panelContainer = masterPanel.content;
    jQuery("#master").detach().appendTo('#masterPanelContent');
  }

  else{
    var panelContainer = document.body
  }

	var id = 'scrollPanel'
	var dims = grid.getPanelDims(id) 

	var renderPanel =	jsPanel.create({
                container:   panelContainer,
		id: id,
		maximizedMargin: 0,
		syncMargins: true,
		theme:       'primary',
		contentSize: {
			width: dims.w - jspanelExtraWidth,
			height: dims.h
		},
		position:    dims.p, 
                header: false, 
		headerControls: "none",
		animateIn:   'jsPanelFadeIn',
		content:     '<div id="scrollPanelContent"></div>',
		onwindowresize: false
	});

	var id = 'renderPanel'
	var dims = grid.getPanelDims(id) 

	var renderPanel =	jsPanel.create({
                container:   panelContainer,
		id: id,
		maximizedMargin: 0,
		syncMargins: true,
		theme:       'primary',
		contentSize: {
			width: dims.w - jspanelExtraWidth,//function() { return renderInitialWidth},
			height: dims.h - jspanelHeaderHeight//function() { return renderInitialHeight + jspanelExtraHeight}
		},
		position:    dims.p, //'left-top 0 0',
		headerControls: "none",
		animateIn:   'jsPanelFadeIn',
		headerTitle: 'Location: 55.9231N 3.1879W; Season: summer', //TODO get from lat,lon vars
		content:     '<div id="renderPanelContent"></div>',
		onwindowresize: false
	});
  
	id = 'graphPanel'
	dims = grid.getPanelDims(id) 
	
	jsPanel.create({
                container:   panelContainer,
		id: id,
		maximizedMargin: 0,
		syncMargins: true,
		theme:       'primary',
		contentSize: {
			width: dims.w - jspanelExtraWidth, //function() { return 405;}, 
			height: dims.h - jspanelHeaderHeight //			function() { return 185;} 
		},
		position:    dims.p, //'right-top -190 0',
		headerControls: "none",
		animateIn:   'jsPanelFadeIn',
		headerTitle: 'Graph',
		content:     '<div id="graphPanelContent"></div>',
		onwindowresize: false
	});

	id = 'clockPanel'
	dims = grid.getPanelDims(id) 
	
	var clockPanel =	jsPanel.create({
                container:   panelContainer,
		id: id,
		maximizedMargin: 0,
		syncMargins: true,
		theme:       'primary',
		contentSize: {
			width: dims.w - jspanelExtraWidth, //function() { return 100}, 
			height: dims.h //function() { return 105} 
		},
		position:    dims.p,//'left-bottom 250 0',
		animateIn:   'jsPanelFadeIn',
		//header: 'auto-show-hide',
		headerControls: "none",
		headerTitle: 'Clock',
		content: '<div style="background-color:#333"'+
					 'id="clockPanelContent"></div>',
		onwindowresize: false,
		overflow: 'hidden',
		resizeit:{disable:true}
	});
		
	id = 'sensorPanel'	
	dims = grid.getPanelDims(id) 
	jsPanel.create({
                container:   panelContainer,
		id: id,
		maximizedMargin: 0,
		syncMargins: true,
		maximizedMargin: 0,
		syncMargins: true,
		theme:       'primary',
		contentSize: {
			width: dims.w - jspanelExtraWidth, //function() { return 185}, 
			height: dims.h - jspanelHeaderHeight //function() { return 185} 
		},
		position:    dims.p,//'right-top 0 0',
		headerControls: "none",
		animateIn:   'jsPanelFadeIn',
		headerTitle: 'Sensors',
		content:     '<div id="sensorPanelContent"></div>',
		onwindowresize: false,
	});

    id = 'blocklyPanel'
	dims = grid.getPanelDims(id) 
	jsPanel.create({
                container:   panelContainer,
		id: id,
		maximizedMargin: 0,
		syncMargins: true,
		theme:       'primary',
		contentSize: {
			width: dims.w - jspanelExtraWidth, //function() { return Math.min(595, window.innerWidth*0.9);},
			height: dims.h - jspanelHeaderHeight //function() { return Math.min(280, window.innerHeight*0.9);}
		},
		position:    dims.p,//'right-top 0 225',
		headerControls: "none",
		animateIn:   'jsPanelFadeIn',
		headerTitle: 'Blockly workspace',
		content:     '<div id="blocklyPanelContent"></div>',
		onwindowresize: false
	});
	
    id = 'codePanel'
	dims = grid.getPanelDims(id) 
	jsPanel.create({
                container:   panelContainer,
			id: id,
			maximizedMargin: 0,
			syncMargins: true,
			theme:       'primary',
			contentSize: {
				width: dims.w - jspanelExtraWidth, //function() { return Math.min(400, window.innerWidth*0.9);},
				height: dims.h//function() { return Math.min(200, window.innerHeight*0.9);}
			},
			position:    dims.p,//'right-top -475 200',
			headerControls: "none",
			animateIn:   'jsPanelFadeIn',
			headerTitle: 'Blockly',
			content:     '<div id="codePanelContent"></div>',
			onwindowresize: false
			//setStatus: "minimized"
	});

    id = 'dataPanel'
	dims = grid.getPanelDims(id) 
	jsPanel.create({
                container:   panelContainer,
			id: id,
			maximizedMargin: 0,
			syncMargins: true,
			theme:       'primary',
			contentSize: {
				width: dims.w - jspanelExtraWidth, //function() { return Math.min(400, window.innerWidth*0.9);},
				height: dims.h//function() { return Math.min(200, window.innerHeight*0.9);}
			},
			position:    dims.p,//'right-top -475 200',
			headerControls: "none",
			animateIn:   'jsPanelFadeIn',
			headerTitle: 'Utilities',
			content:     '<div id="dataPanelContent"></div>',
			onwindowresize: false,
			//setStatus: "minimized"
	});

    
	id = 'scorePanel'
         dims = grid.getPanelDims(id) 
	jsPanel.create({
                container:   panelContainer,
			id: id,
			maximizedMargin: 0,
			syncMargins: true,
			theme:       'primary',
			contentSize: {
				width: dims.w - jspanelExtraWidth, //function() { return Math.min(200, window.innerWidth*0.9);},
				height: dims.h //function() { return Math.min(200, window.innerHeight*0.9);}
			},
			position:    dims.p, //'right-top -475 200',
			animateIn:   'jsPanelFadeIn',
			headerTitle: 'Efficiency',
			//header: 'auto-show-hide',
			headerControls: "none",
			content:     '<div id="scorePanelContent"></div>',
			onwindowresize: false,
			setStatus: "normalized"
	});

		
	jQuery("#renderHere").detach().appendTo('#renderPanelContent')
	jQuery("#blocklyDOM").detach().appendTo('#blocklyPanelContent')
	jQuery("#clockAndControl").detach().appendTo('#clockPanelContent')
	jQuery("#graphHere").detach().appendTo('#graphPanelContent')	
	jQuery("#sensors").detach().appendTo('#sensorPanelContent')
	jQuery("#score").detach().appendTo('#scorePanelContent')
	jQuery("#save").detach().appendTo('#codePanelContent')	
	jQuery("#data").detach().appendTo('#dataPanelContent')
        jQuery("#scroll").detach().appendTo('#scrollPanelContent')




  document.addEventListener('jspanelresize', function (event) {
    
    //get dimensions of the resized panel (0th panel in array)
    var panelHeight = parseFloat(jsPanel.getPanels()[0].style.height).toFixed(0);
    var panelWidth = parseFloat(jsPanel.getPanels()[0].style.width).toFixed(0); 
    
    
    //adjust for the usable area
    var contentHeight = panelHeight - jspanelHeaderHeight;
    var contentWidth  = panelWidth - jspanelExtraWidth;
    console.log(event.detail, contentWidth, contentHeight)
    if (event.detail === 'renderPanel') {resizeRender(contentHeight, contentWidth);}
    if (event.detail === 'blocklyPanel') {resizeBlockly(contentHeight, contentWidth);}
    if (event.detail === 'graphPanel') {resizeGraph(contentHeight, contentWidth);}
    if (event.detail === 'sensorPanel') {resizeSensor(contentHeight, contentWidth);}
    if (event.detail === 'scorePanel') {resizeScore(contentHeight, contentWidth);}
  });

  document.addEventListener('jspanelresizestop', function (event) {

    log({"category":"display",
         "data":{
           "event":"panelResize",
           "id":event.detail,
           "size":{
             "width":jsPanel.getPanels()[0].style.width,
             "height":jsPanel.getPanels()[0].style.height,
             "left": jsPanel.getPanels()[0].style.left,
             "top": jsPanel.getPanels()[0].style.top,
             "zIndex": jsPanel.getPanels()[0].style.zIndex
           }
         }
        })

  });

  document.addEventListener('jspaneldragstop', function (event) {

    log({"category":"display",
         "data":{
           "event":"panelMove",
           "id":event.detail,
           "size":{
             "width":jsPanel.getPanels()[0].style.width,
             "height":jsPanel.getPanels()[0].style.height,
             "left": jsPanel.getPanels()[0].style.left,
             "top": jsPanel.getPanels()[0].style.top,
             "zIndex": jsPanel.getPanels()[0].style.zIndex
           }
         }
        })

  });


  
  setTimeout(function(){ layoutAllPanels(); }, 100);

}); //ready

document.addEventListener('jspanelresizestop', function (event) {
	userHasNotModifiedLayout = false;
});

document.addEventListener('jspaneldragstop', function (event) {
	userHasNotModifiedLayout = false;
});	

$( window ).resize(function() {
  console.log("window resize")
  if (true){   
    //console.log('laying out jspanels')
	grid.setPageSize($(window).innerWidth(), $(window).innerHeight());
        grid.setActiveGrid();
	layoutAllPanels();
  }
 
});

function scrollPanels(){
	grid.setPageSize($(window).innerWidth(), $(window).innerHeight());
        grid.setActiveGrid();
	layoutAllPanels();
        scrollPanel.front(); //keep scroll panel on top
}



function layoutAllPanels(){

  log({"category":"display",
       "data":{
         "event":"windowResize",
         "window":{
           "width":$(window).innerWidth(),
           "height":$(window).innerHeight()
         }
       }
      });

  for (const panel of jsPanel.getPanels()) {

    var dims = grid.getPanelDims(panel.id)
    panel.resize(dims.size)
    
    panel.reposition(dims.p)
    
    log({"category":"display",
         "data":{
           "event":"panelLayout",
           "panel":{
             "id":panel.id,
             "size":dims.size,
             "position":dims.p
           }
         }
        });
    
   
    var panelHeight = parseFloat(panel.style.height).toFixed(0);
    var panelWidth = parseFloat(panel.style.width).toFixed(0);
    var contentHeight = panelHeight - jspanelHeaderHeight;
    var contentWidth  = panelWidth;			
    if (panel.id === 'renderPanel') {resizeRender(contentHeight, contentWidth);}
    if (panel.id === 'blocklyPanel') {resizeBlockly(contentHeight, contentWidth);}
    if (panel.id === 'graphPanel') {resizeGraph(contentHeight, contentWidth);}
    if (panel.id === 'sensorPanel') {resizeSensor(contentHeight, contentWidth);}
    if (panel.id === 'scorePanel') {resizeScore(contentHeight, contentWidth);}
    if (panel.id === 'masterPanel') {resizeMaster(contentHeight, contentWidth);}
    
  }


}



function resizeCanvasById(id,height, width){
	var canvas = document.getElementById(id)
	canvas.width = width;
	canvas.height = height;	
	
}

function resizeScore(height, width){
	if (scoreDial !== undefined) scoreDial.setSize(height, width);
	
}

function resizeMaster(height, width){
	resizeCanvasById('master', height, width);
}

function resizeSensor(height, width){
	resizeCanvasById('sensors', height, width);
}

function resizeGraph(height, width){
	var graphArea = document.getElementById('graphHere')
	graphArea.width = width;
	graphArea.height = height;
}

function resizeBlockly(height, width){
	var blocklyArea = document.getElementById('blocklyArea')
	blocklyArea.offsetHeight = height;
	blocklyArea.offsetWidth = width; 
	blockly_onresize();
}

function resizeRender(height, width){
	renderer.setSize( width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();		
}
	
