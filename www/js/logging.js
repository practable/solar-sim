/*
 *    Logging
 *    
 *    we want to be able to process actions from the user, so we really
 *    need to just track the blockly.
 *    
 *    Meaningful changes in the eval'd code should give us the trigger
 *    
 *    We need to separate the categories out, and plan for a day when
 *    a heat map may be good too
 *    
 *    So POST will need to contain ....
 *    
 *    {"webapp":"solar",
 *     "uuid":<uuid>,
 *     "sessionCount":<sessionCount>,
 *     "datetime": new Date().getTime(), //time of report
 *     "payload"{
           "category":["blockly","mouse","data","display","utility","alerts"],
 *         "data":{ <specific to each category>}
 *      }
 *    }
 *    
 *    
 *    suggested categories (and example payload) - not can't use comments in real json but here for explanation
 *    
 *    1. blockly - updated blockly code - intact - sacrifice storage efficiency for certainty we have the right code
 *    
 *    {"xml":<xml string>}
 *    
 *    
 *    2. mouse - clicks, touches, moves, scrolls etc
 *    
 *    TBD
 *    
 *    3. data - the current time, date, solar panel setting in N sec chunks, where N is set to some sensible number.....
 *    
 *    {
 *    "datetimes"{actual":[],"virtual":[]}  //one per sample
 *    "location":{"lat":<float,[]>, "long":<float,[]>} //one per payload, or one per sample if moving location
 *    "sun":{"alt":[],"azi":[],"power":[]},
 *    "panel":{"alt":[], "azi":[], "power":{"max":[], "actual":[]}, "score":[]}
 *    }
 *    
 *    4. display
 *    
 *    {
 *    "activeGrid":<activeGrid>, //should contain the page size
 *    "voff":voff
 *    "panels":[{"id":<id>,"status":<status>,"width":<width>,"height":<height>,"pos":pos,"zIndex":z}]
 *    }
 *    
 *    5. utility
 *    
 *    { 
 *    "action":<["loadBlockly","saveBlockly","downloadCode","saveData","consent"]>
 *    "data":{"contents":<file or cache contents if data or blockly>}
 *    }
 *    
 *    6. alert
 *    {
 *    "message":"Inactivity alarm"
 *    }
 *       
 *    History
 *    Created Tim Drysdale 27 October 2018  
 */ 

var showLoggingDebug = false;

var url = 'https://edlablog.eng.ed.ac.uk/post';
var data = JSON.stringify({"webapp":"test","who":"jstest", "when":"docready foo 2"});
var contentType = 'application/json';
var uuid = undefined;
var webappName = undefined;
var sessionCount = undefined;
var solarDataLoggingIntervalMs = 1000; //1 seconds
//logging vars for solar panel webapp
var logOldCode

var solarDataArrayEmpty = {
  "panel":{
    "azimuth":[],
    "altitude":[],
    "power":{
      "theory":[],
      "actual":[],
      "score":[]
    }
  },
  "sun":{
    "altitude":[],
    "azimuth":[],
    "irradiance":[]
  },
  "location":{
    "latitude":lat,
    "longitude":lon,
  },
  "time":{
    "actual":[],
    "virtual":[]
  },
  "sensors":{
    "top":{
      "left":[],
      "right":[]
    },
    "bottom":{
      "left":[],
      "right":[]
    },
    "shadow":{
      "dx":[],
      "dy":[]
    }
  }
}
var solarDataArray = JSON.parse(JSON.stringify(solarDataArrayEmpty)); //clone, so we keep an empty copy
var solarDataValue; //individual values are put in this by solarpanel.js


/* 
 * modified from https://codepen.io/Jvsierra/pen/BNbEjW
 * random number string in uuid format
 */
function makeUuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() 
}

/*
 * @function doNotTrack
 * @description Checks if user has declared Do Not Track (DNT) in their browser
 * Ignores IE10: Read this for further explanation: https://en.wikipedia.org/wiki/Do_Not_Track#Internet_Explorer_10_default_setting_controversy
 * @returns {*}
 */
var doNotTrack = function () {

  if (!window.navigator.userAgent.match(/MSIE\s10\.0|trident\/6\.0/i)) {
    return window.navigator.doNotTrack || window.navigator.msDoNotTrack;
  }
};


/*
 * return uuid to report our usage to
 * check in cache to see if repeat user, 
 * unless user wants session-to-session anonymity
 */
function getUuid(){
  if(doNotTrack()){
    //generate a new uuid that we'll only use for this session
    return makeUuid();
  }
  else{
    //check localStorage for an existing uuid
    var uuid = localStorage.getItem(getUuidStorageId());
 
    if (!uuid){
      uuid = makeUuid();
      localStorage.setItem( getUuidStorageId(), uuid);
    }
    return uuid;
  }
}


/*
 * returns the name of the webapp
 */
function getWebappName(){
  var name = document.getElementById("projectName").value
  if (name === undefined){
    name =  window.location.href.replace(/[^a-zA-Z0-9]/g, '');
    loggingDebug("webapp name not defined, using", name);
  }
  return name;
}


/*
 * returns the id where we will store uuid in localStorage
 */
function getUuidStorageId(){
  return getWebappName + "_uuid";
}

/*
 * returns the id where we will store sessionCount in localStorage
 */
function getSessionCountId(){
  return getWebappName + "_sessionCount";
}

/*
 * returns the current session count
 */
function getSessionCount(){
    var sessionCount = noNaN(parseInt(localStorage.getItem(getSessionCountId()),10));
    sessionCount = sessionCount + 1;
    localStorage.setItem( getSessionCountId(), sessionCount);
    return sessionCount;

}

/*
 * puts the payload in a JSON object and POSTs to logger
 */
function log(payload){
  if(consentGiven){
    var data = {
      "webapp": webappName,
      "uuid": uuid,
      "sessionCount": sessionCount,
      "datetime": new Date().getTime(), 
      "payload":payload
    }
    
    $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(data),
      contentType : contentType 
    }); 
  }
}





function getBlocklyXml(){
   
    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    return xmlText;
}

/*
 * Log Blockly iff the evaluated code has changed
 * This will capture intermediate steps in tidying code, e.g. if a calculation is refactored
 * but it will miss trivial moves of blocks that don't change meaning
 */

function logBlockly(){
  if ("code" in window){
    if (codeHasChanged(code, logOldCode)){
      
      var payload = {
        "category":"blockly",
        "data":{
          "xml": getBlocklyXml(),
          "js": code
        }
      }

      log(payload);  

      logOldCode = code; //relies on assumption code is a primitive (string) 
      //see for more info https://hackernoon.com/javascript-reference-and-copy-variables-b0103074fdf0

    }
  }
}


/*
 * Merges single values and arrays from one object into another
 * useful if building an object that holds several arrays, each of which needs updating
 * from an object with the same structure
 */




function addValueToSubArray(obj, path, val){
  if (traverse(obj).has(path)){
    var theArray = traverse(obj).get(path);
    theArray.push(val) 
    traverse(obj).set(path,theArray);
  }
}

/*
 * push value(s) from new into old arrays, if oldObj path holds an array
 * TODO - improve API to add non-existent paths
 */
function updateSubArrays(objNew, objOld){

  traverse(objNew).forEach(function (val) {
    if (Array.isArray(traverse(objOld).get(this.path))){
      addValueToSubArray(objOld, this.path, noNaN(val));
    }
  });
}


function codeHasChanged(codeA, codeB){
 var hasChanged = (codeA !== codeB);
 if (hasChanged) loggingDebug("code hasChanged");
 return hasChanged; //we could do a diff here for more sanity....
}



function loggingDebug(){
  if (showLoggingDebug) console.log.apply(null,arguments)
}

function logPageReady(){

  log({"category":"alert",
       "data":{
         "message":"documentReady for logging"}
      });

}

function testDataLogging(){

   var objOld = {
     "a":{"b":[],"c":[],"d":"e"},
     "f":[]
   }

   var objNew = {
     "a":{"b":1,"c":3,"d":"e"},
     "f":5
   }

  console.log(objOld.a.b);
  updateSubArrays(objNew, objOld);
  console.log(objOld.a.b);
  
   objNew = {
     "a":{"b":2,"c":4,"d":"e"},
     "f":6
   }
  updateSubArrays(objNew, objOld);
  console.log(objOld.a.b);  

}


function updateSolarLoggingData(){
  updateSubArrays(solarDataValue, solarDataArray);
}

function sendSolarLoggingData(){
  loggingDebug("sent data",solarDataArray)
  log({"category":"data",
       "data": solarDataArray});
  solarDataArray =  JSON.parse(JSON.stringify(solarDataArrayEmpty));
}

function startLoggingData(){

setInterval(function(){ sendSolarLoggingData(); }, solarDataLoggingIntervalMs);

}


$( document ).ready(function() {
  webappName = getWebappName();
  sessionCount = getSessionCount();
  uuid = getUuid(); 
  loggingDebug("uuid",uuid, "sessionCount", sessionCount)
  logPageReady()
  startLoggingData();
});

