function getScrollTop(){
  var id = 'scrollPanel';
  var dims = grid.getPanelDims(id);
  return noNaN(dims.h);
}

function scrollToTopOf(id){
  voff = 0;
  scrollPanels(); 
  var dims = grid.getPanelDims(id);
  voff = getScrollTop() - dims.t;
  //console.log("dims",dims, "scrollTop",voff, "t", dims.t )
  //console.log('voff for ' + id + ' set to ', voff);
  scrollPanels();
}

function createScrollButtons(){

	var renderButton = document.createElement("BUTTON");
	renderButton.innerHTML = "3D";

	var graphButton = document.createElement("BUTTON");
	graphButton.innerHTML = "Graph";

	var infoButton = document.createElement("BUTTON");
	infoButton.innerHTML = "Info";

	var blocklyButton = document.createElement("BUTTON");
	blocklyButton.innerHTML = "Blockly";

	var utilButton = document.createElement("BUTTON");
	utilButton.innerHTML = "Util";
	
	var el = document.getElementById("scroll");
	el.appendChild(renderButton);
	el.appendChild(graphButton);
	el.appendChild(infoButton);
	el.appendChild(blocklyButton);
	el.appendChild(utilButton);
	
	renderButton.addEventListener ("click", function() {     
          scrollToTopOf('renderPanel');
	});
	graphButton.addEventListener ("click", function() {     
          scrollToTopOf('graphPanel');
	});
	infoButton.addEventListener ("click", function() {     
          scrollToTopOf('sensorPanel');
	});	
	blocklyButton.addEventListener ("click", function() {     
          scrollToTopOf('blocklyPanel');
	});	
	utilButton.addEventListener ("click", function() {     
          scrollToTopOf('codePanel');
	});
}

$( document ).ready(function() {
	createScrollButtons();
	
});
