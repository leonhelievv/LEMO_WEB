var codingWaitRespons = [false,'S1']
const pzlCtx = document.getElementById("pzlCanvas").getContext("2d");

function initCoding() {
console.log('at init coding')
//cleanup nav
	navPlay.style.display='none';
	//init coding UI
	play.style.display='block';
	playL.style.display='none';
	playR.style.display='none';
	playIcon.style.display='none';
	clkwArea.style.display='none';
	callOut.style.display='none';
	document.getElementById('pzzl').style.display='block';
	currentPlay='LEMO Coding';
	title.innerHTML = currentPlay;
	//make motors not visible
	motors.style.display='none'	
	document.getElementById('optionBlks').style.width = lemoW+'px';
	iconArea.style.height = 98+'%' //push the toy box down
	//init vars
	codingWaitRespons[0] = false
	//make canvas visible
	pzlCanvasArea = document.getElementById('pzlCanvasArea')
	pzlCanvasArea.style.display = 'block'
	//what is canvas x an y beginning
	var pzlCanvas = document.getElementById('pzlCanvas')	
	console.log('canvas start X '+pzlCanvas.offsetLeft)
	console.log('canvas start Y '+pzlCanvas.offsetTop)
	//populate the fMotor modes list
	var modesNo = document.getElementById('listOfOptions').childElementCount;
	if (modesNo == 0) {
		//the list is empty
		makeOptionsList(fMotorModes)
	}
 	pzlPrep()
 	//init the window
 	getWindowSize()
 	
}

function codingCleanup() {
	console.log('at coding cleanup');
	//reset the options menu
	optionsMenu.splice(0, optionsMenu.length)
	//clear the menu canvases - children of optionBlocks
	clearMenu()
	//make not visible
	document.getElementById('pzzl').style.display='none'
	//restore
	playL.style.display='block'
	playR.style.display='block'
	iconArea.style.height = 70+'%'
	free_S_motors(currentPlay);
	document.getElementById('playIcon').style.display='block';
	//restore motors
	//motorsDisplay(99)
	free_F_motors('LEMO Coding');
	free_S_motors('LEMO Coding');
	//initNav();	
	showNav();	
};
 	