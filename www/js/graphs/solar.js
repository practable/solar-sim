var smoothie = new SmoothieChart({
  //maxValue:1.01,
  //minValue:-0.01, 
  millisPerPixel:72,
  grid:{
    verticalSections:4
  },
  labels:{disabled:false}
});
smoothie.streamTo(document.getElementById("graphHere"));

// Data
var lineGreen = new TimeSeries();
var lineBlue = new TimeSeries();
var lineRed = new TimeSeries();
var lineCyan = new TimeSeries();
var linePurple = new TimeSeries();
var lineYellow = new TimeSeries();

// Add to SmoothieChart
smoothie.addTimeSeries(lineGreen,{lineWidth:2,strokeStyle:'#74A65B'});
smoothie.addTimeSeries(lineBlue, {lineWidth:2,strokeStyle:'#5B74A6'});
smoothie.addTimeSeries(lineRed,  {lineWidth:2,strokeStyle:'#a65b5b'});
smoothie.addTimeSeries(lineCyan, {lineWidth:2,strokeStyle:'#5BA6A6'});

smoothie.addTimeSeries(lineYellow, {lineWidth:2,strokeStyle:'#A6A65B'}); //f4a442
smoothie.addTimeSeries(linePurple, {lineWidth:2,strokeStyle:'#995BA6'});

function createDataButtons(){

  var saveDataButton = document.createElement("BUTTON");
  saveDataButton.innerHTML = "Save data";

  var saveCodeButton = document.createElement("BUTTON");
  saveCodeButton.innerHTML = "Save code";
  
  var el = document.getElementById("data");
  el.appendChild(saveDataButton);
  el.appendChild(saveCodeButton);
  
  saveDataButton.addEventListener ("click", function() {
    saveData();
  });
  saveCodeButton.addEventListener ("click", function() {
    saveCode();
  });
}

$(document).ready(function(){
  createDataButtons();
  
});

function sanitise(val){
  if (val === undefined) return ['',''];
  else return [noNaN(val[0]),noNaN(val[1])];
  
}

function saveData(){
  const headings = ["time", "green", "time", "blue", "time", "red", "time", "cyan", "time", "yellow", "time", "purple"];
  var csvContentType = "data:text/csv;charset=utf-8"
  let csvContent = csvContentType +","; //"data:text/csv;charset=utf-8,";
  csvContent += headings.join(",") + "\r\n";
  
  var green = lineGreen.data;
  var red = lineRed.data;
  var cyan = lineCyan.data;
  var blue = lineBlue.data;
  var yellow = lineYellow.data;
  var purple = linePurple.data;
  
  var length = Math.max(green.length, red.length, cyan.length, blue.length, yellow.length, purple.length )
  
  var i;
  for (i = 0; i < length; i++) { 
    
    var rowData = [	sanitise(green[i])[0], 
			sanitise(green[i])[1], 
			sanitise(blue[i])[0], 
			sanitise(blue[i])[1],
			sanitise(red[i])[0], 
			sanitise(red[i])[1],	
			sanitise(cyan[i])[0], 
			sanitise(cyan[i])[1],	
			sanitise(yellow[i])[0], 
			sanitise(yellow[i])[1],
			sanitise(purple[i])[0], 
			sanitise(purple[i])[1] 					   
		        
		  ];
    //rowData.foreach(function(val){ val = val.toString()});
    csvContent += rowData.join(",") + "\r\n";
    
  }
  
  
  var encodedUri = encodeURI(csvContent);
  //window.open(encodedUri);	
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "solarPanel.csv");
  link.innerHTML= "Click Here to download";
  document.body.appendChild(link); 
  link.click();
  
  log({"category":"data",
       "data":{"source":"graph", 
               "contentType": csvContentType,
               "contentUri":encodedUri,
              "content":csvContent}
      }
     );

  
  

} 

/*
 * save js code to a file
 */

function saveCode(){
  let codeContentType = "data:text/js;charset=utf-8";
  let codeContent = codeContentType + ",";

  codeContent += code;
  var encodedUri = encodeURI(codeContent);
  //window.open(encodedUri);	
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "solarPanel.js");
  link.innerHTML= "Click Here to download";
  document.body.appendChild(link); 
  link.click();
  log({"category":"data",
       "data":{"source":"code", 
               "contentType": codeContentType,
               "contentUri":encodedUri,
               "content":codeContent}}
     );
  
}
