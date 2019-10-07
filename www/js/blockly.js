var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv,
  {toolbox: document.getElementById('toolbox'), trashcan: true});
  
var blockly_onresize = function(e) {
// Compute the absolute coordinates and dimensions of blocklyArea.
var element = blocklyArea;
var x = 0;
var y = 0;
do {
  //x += element.offsetLeft;
  //y += element.offsetTop;
  element = element.offsetParent;
} while (element);
	// Position blocklyDiv over blocklyArea.
	blocklyDiv.style.left = x + 'px';
	blocklyDiv.style.top = y + 'px';
	blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
	blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
	Blockly.svgResize(workspace);
};

window.addEventListener('resize', blockly_onresize, false);
blockly_onresize();
Blockly.svgResize(workspace);

function myUpdateFunction(event) {
	code = Blockly.JavaScript.workspaceToCode(workspace);
	document.getElementById('blocklyTextArea').innerHTML = code.replace(";",";<br>"); //TODO better prettifying?
}

workspace.addChangeListener(myUpdateFunction);