function getBlocklyStorageId(){
	return document.getElementById("projectName").value + "_blockly";
}

function loadStartupWorkspace(){
	var xmlText;
	
	fetch('js/blockly/custom/startupWorkspace.xml')
		.then(response => response.text())
		.then(text => {	xmlText = text; 
						Blockly.mainWorkspace.clear();
						xmlDom = Blockly.Xml.textToDom(xmlText);
						Blockly.Xml.domToWorkspace(xmlDom, Blockly.mainWorkspace);		
		})
}


function saveWorkspace() {
    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    localStorage.setItem( getBlocklyStorageId(), xmlText);
	
}

function loadWorkspace() {
    var xmlText = localStorage.getItem(getBlocklyStorageId());
    if (xmlText) {
        Blockly.mainWorkspace.clear();
        xmlDom = Blockly.Xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xmlDom, Blockly.mainWorkspace);
    }
}

function createButtons(){

	var saveButton = document.createElement("BUTTON");
	saveButton.innerHTML = "Save Blockly";

	var restoreButton = document.createElement("BUTTON");
	restoreButton.innerHTML = "Restore Blockly";

	var reloadButton = document.createElement("BUTTON");
	reloadButton.innerHTML = "Reset Blockly";
	
	var el = document.getElementById("save");
	el.appendChild(saveButton);
	el.appendChild(restoreButton);
	el.appendChild(reloadButton);
	
	saveButton.addEventListener ("click", function() {
		saveWorkspace();
		console.log('Blockly workspace saved to cache')
	});
	
	restoreButton.addEventListener ("click", function() {
		loadWorkspace();
		console.log('Blockly workspace restored from cache')
	})	
	
	reloadButton.addEventListener ("click", function() {
		loadStartupWorkspace();
		console.log('Blockly workspace reloaded from server')
	})		
}

$( document ).ready(function() {
	createButtons();
	loadStartupWorkspace();
	
});



	
	
