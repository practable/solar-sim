Blockly.defineBlocksWithJsonArray(
[
{
  "type": "day",
  "message0": "day",
  "inputsInline": false,
  "output": null,
  "colour": 80,
  "tooltip": "Fraction of a day; 0 is just after midnight, 0.5 is noon, 1 is just before midnight",
  "helpUrl": ""
},
{
  "type": "sensorTL",
  "message0": "Sensor Top Left",
  "inputsInline": false,
  "output": null,
  "colour": 100,
  "tooltip": "Voltage from the upper left photo sensor",
  "helpUrl": ""
},
{
  "type": "sensorTR",
  "message0": "Sensor Top Right",
  "inputsInline": false,
  "output": null,
  "colour": 220,
  "tooltip": "Voltage from the upper right photo sensor",
  "helpUrl": ""
},
{
  "type": "sensorBL",
  "message0": "Sensor Bottom Left",
  "inputsInline": false,
  "output": null,
  "colour": 180,
  "tooltip": "Voltage from the lower left photo sensor",
  "helpUrl": ""
},
{
  "type": "sensorBR",
  "message0": "Sensor Bottom Right",
  "inputsInline": false,
  "output": null,
  "colour": 0,
  "tooltip": "Voltage from the lower right photo sensor",
  "helpUrl": ""
},
{
  "type": "power",
  "message0": "Panel Power",
  "inputsInline": false,
  "output": null,
  "colour": 290,
  "tooltip": "Power from the panel, in the range 0 - 1, 1 is max power",
  "helpUrl": ""
},
{
  "type": "maxpower",
  "message0": "Theoretical Maximum Panel Power",
  "inputsInline": false,
  "output": null,
  "colour": 60,
  "tooltip": "Theoretical maximum power from a properly aligned panel",
  "helpUrl": ""
},
{
  "type": "panelTurnIn",
  "message0": "Panel Turn",
  "inputsInline": false,
  "output": null,
  "colour": 235,
  "tooltip": "Panel angle around vertical axis",
  "helpUrl": ""
},
{
  "type": "panelTiltIn",
  "message0": "Panel Tilt",
  "inputsInline": false,
  "output": null,
  "colour": 135,
  "tooltip": "Panel angle around horizontal axis",
  "helpUrl": ""
},
{
  "type": "panelAzi",
  "message0": "set panelTurn to %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "panelAzi"
    }
  ],
  "colour": 235,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "panelAlt",
  "message0": "set panelTilt to%1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "panelAlt"
    }
  ],
  "colour": 135,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "panelAziRate",
  "message0": "set panelTurnRate to %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "panelAziRate"
    }
  ],
  "colour": 235,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "panelAltRate",
  "message0": "set panelTiltRate to%1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "panelAltRate"
    }
  ],
  "colour": 135,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "graph1",
  "message0": "graph %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "graph1"
    }
  ],
  "colour": 100,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "graph2",
  "message0": "graph %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "graph2"
    }
  ],
  "colour":220,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "graph3",
  "message0": "graph %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "graph3"
    }
  ],
  "colour":0,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "graph4",
  "message0": "graph %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "graph4"
    }
  ],
  "colour":180,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "graph5",
  "message0": "graph %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "graph5"
    }
  ],
  "colour":290,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "graph6",
  "message0": "graph %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "graph6"
    }
  ],
  "colour":60,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "setday",
  "message0": "day %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "setday"
    }
  ],
  "colour":80,
  "tooltip": "set the fraction of the day",
  "helpUrl": ""
},
{
  "type": "dayrate",
  "message0": "day rate %1",
  "previousStatement": null,
  "nextStatement": null,
  "args0": [
    {
      "type": "input_value",
      "name": "dayrate"
    }
  ],
  "colour":90,
  "tooltip": "set rate that the day advances",
  "helpUrl": ""
}
]);  
Blockly.JavaScript['day'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "effectController.day";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['sensorTL'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "sensorTopLeft";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['sensorTR'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "sensorTopRight";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['sensorBL'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "sensorBottomLeft";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['sensorBR'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "sensorBottomRight";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['power'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  
  var code = "actual_panel_power";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['maxpower'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "theoretical_max_panel_power";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};



Blockly.JavaScript['panelTiltIn'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "panelAlt";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['panelTurnIn'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "panelAzi";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['panelAzi'] = function(block) {
  var angle = Blockly.JavaScript.valueToCode(block, 'panelAzi', Blockly.JavaScript.ORDER_ADDITION) || '-0.8';
  var code = 'panelAzi = ' +  angle + ';\n';
  return code;
};

Blockly.JavaScript['panelAlt'] = function(block) {
  var angle = Blockly.JavaScript.valueToCode(block, 'panelAlt', Blockly.JavaScript.ORDER_ADDITION) || '0';
  var code = 'panelAlt = ' +  angle + ';\n';
  return code;
};

Blockly.JavaScript['panelAziRate'] = function(block) {
  var rate = Blockly.JavaScript.valueToCode(block, 'panelAziRate', Blockly.JavaScript.ORDER_ADDITION) || 0;
  var code = 'panelAzi = panelAzi + noNaN(Math.max(Math.min(1,' +  rate + '),-1)* maxAziRate);\n';
  return code;
};

Blockly.JavaScript['panelAltRate'] = function(block) {
  var rate = Blockly.JavaScript.valueToCode(block, 'panelAltRate', Blockly.JavaScript.ORDER_ADDITION) || 0;
  var code = 'panelAlt = panelAlt + noNaN(Math.max(Math.min(1,' +  rate + '),-1) * maxAltRate);\n';
  return code;
};

Blockly.JavaScript['graph1'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'graph1', Blockly.JavaScript.ORDER_ADDITION) || '0';
  var code = 'lineGreen.append(new Date().getTime(), ' + value + ');\n';
  return code;
};

Blockly.JavaScript['graph2'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'graph2', Blockly.JavaScript.ORDER_ADDITION) || '0';
  var code = 'lineBlue.append(new Date().getTime(), ' + value + ');\n';
  return code;
};

Blockly.JavaScript['graph3'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'graph3', Blockly.JavaScript.ORDER_ADDITION) || '0';
  var code = 'lineRed.append(new Date().getTime(), ' + value + ');\n';
  return code;
};

Blockly.JavaScript['graph4'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'graph4', Blockly.JavaScript.ORDER_ADDITION) || '0';
  var code = 'lineCyan.append(new Date().getTime(), ' + value + ');\n';
  return code;
};

Blockly.JavaScript['graph5'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'graph5', Blockly.JavaScript.ORDER_ADDITION) || '0';
  var code = 'linePurple.append(new Date().getTime(), ' + value + ');\n';
  return code;
};

Blockly.JavaScript['graph6'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'graph6', Blockly.JavaScript.ORDER_ADDITION) || '0';
  var code = 'lineYellow.append(new Date().getTime(), ' + value + ');\n';
  return code;
};

Blockly.JavaScript['setday'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'setday', Blockly.JavaScript.ORDER_ADDITION) || '0';
  var code = 'effectController.day = noNaN(' + value + ');\n';
  return code;
};

Blockly.JavaScript['dayrate'] = function(block) {
  var rate = Blockly.JavaScript.valueToCode(block, 'dayrate', Blockly.JavaScript.ORDER_ADDITION) || 0;
  var code = 'if (runClock){effectController.day = effectController.day + noNaN(Math.max(Math.min(1,' +  rate + '),0) * maxDayRate);}\n';
  return code;
};


