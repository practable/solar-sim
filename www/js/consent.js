var consentGiven = false;

function getConsentStorageId(){
	return document.getElementById("projectName").value + "_consent";
}


function checkConsentGiven(){
    var consent = localStorage.getItem(getConsentStorageId());
    if (consent == "given") {
      consentGiven = true;
      return true;
    }
  else return false;

}

function storeConsentGiven(){
  localStorage.setItem(getConsentStorageId(),"given");
  //log({"category":"alert","data":{"consent":"given"}});
}

$( document ).ready(function() { 

var consentPanel =  jsPanel.create({
    container:   document.body,
    id: 'consentPanel',
    maximizedMargin: 0,
    syncMargins: true,
    theme:       'primary',
    contentSize: {
      width: function() { return Math.max( 400, window.innerWidth*0.5);},
      height: function() { return Math.max(200, window.innerHeight*0.5);}
    },
    position:    'center 0 0',
    headerControls: "closeonly",
    animateIn:   'jsPanelFadeIn',
    headerTitle: 'Consent',
    content:     '<div id="consentPanelContent"></div>',
    onwindowresize: false
  });

  createConsentButtons();
  jQuery("#consent").detach().appendTo('#consentPanelContent')


  if(checkConsentGiven()){
    consentPanel.close();
  }
  else{
    setTimeout(function(){ consentPanel.front();}, 1000)
  }

});


function createConsentButtons(){

	var consentButton = document.createElement("BUTTON");
	consentButton.innerHTML = "I'll help!";
	
	var el = document.getElementById("consentButton");
	el.appendChild(consentButton);
	
	consentButton.addEventListener ("click", function() {
		consentGiven = true;
                storeConsentGiven();
                consentPanel.close();
	});
	
}

document.addEventListener('jspanelclosed', function (event) {
    if (event.detail === 'consentPanel') {
      log({"category":"alert","data":{"consent":consentGiven}});
    }
});

 
/*
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


*/
