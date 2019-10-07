//Create a knob as an output for the score value
var scoreDial = pureknob.createKnob(190, 190);
scoreDial.setProperty('units', '%');
scoreDial.setProperty('colorFG','#995BA6')
scoreDial.setProperty('colorBG','#A6A65B')
//'colorFG': '#ff8800',
var score = 0; //initial score
var running_actual = 0;
var running_theory = 0;


function updateScore(actual, theory){
    if (theory > 0){ 
		running_actual = running_actual + actual;
		running_theory = running_theory + theory;
		score = 100 * running_actual / running_theory;
		scoreDial.setValue(noNaN(score));
	}
}

function resetScore(){
	running_actual = 0;
	running_theory = 0;
	score = 0;
	//scoreDial.setValue(score);
}


$( document ).ready(function() {
	var node = scoreDial.node();
	var elem = document.getElementById('score');
	elem.appendChild(node);
	scoreDial.setValue(0);

});


