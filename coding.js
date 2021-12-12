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
	//free the SBnr BUFFERS
	free_SBnR(currentPlay)	
	showNav();	
};

function coding_respons_handler(respons) { // (respons_list)
	console.log('respons received for coding ' +respons)
	if (respons.includes('sensor') && codingWaitRespons[0] == true) {
		//it is a sensor respons - continue program
		//continueProgram()
//	}else if (respons.includes('rest') && codingWaitRespons[0] == true) {
	}else if (respons[0] == ':S1' && respons[1] == 'LEMO Coding' && respons[2] == 'rest') {
		//it is a S1 rest respons
		//look for eventlistener waiting for S1 rest
		const arrayLength = pzlEventListeners.length;
		for (var i = 0; i < arrayLength; i++) {
    		//look for a S1wait listener
   		if (pzlEventListeners[i][1] == 'S1wait') {
    			//the event occured - S1,LEMO Coding,rest
    			// notify loop that the condition is satisfied loop must brake
    			pzzlPieces[pzlEventListeners[i][0]][24][3] = 'break'
    			//remove eventListener from array
    			pzlEventListeners.splice(i,1)
    			resultHandled = true
    			break
    		}
		}	
	}else if (respons[0] == ':S2' && respons[1] == 'LEMO Coding' && respons[2] == 'rest') {
		//it is a S2 rest respons
		//look for eventlistener waiting for S2 rest
		const arrayLength = pzlEventListeners.length;
		for (var i = 0; i < arrayLength; i++) {
    		//look for S2wait listener
   		if (pzlEventListeners[i][1] == 'S2wait') {
    			//the event occured - S2,LEMO Coding,rest
    			// notify loop that the condition is satisfied loop must brake
    			pzzlPieces[pzlEventListeners[i][0]][24][3] = 'break'
    			//remove eventListener from array
    			pzlEventListeners.splice(i,1)
    			resultHandled = true
    			break
    		}
		}	
	}else if (respons[0] == ':FA' && respons[2] == 'sensor') {
		const arrayLength = pzlEventListeners.length;
		
/* ":FA/"+cmndr+"/300/"+String(FA_motor_mode)+"/"+String(FA_Flag_AClkw)+"/"+String(Asp)+"/"+String(digitalRead(FA_hall1))+"/"+"/;"; 
	
FA_sensor = 12	
*/				
		//it is a sensor change respons
		for (var i = 0; i < arrayLength; i++) {
    		//look for FA sensor listener
   		if (pzlEventListeners[i][1] == 'SensorFA') {
    			//the event occured - S2,LEMO Coding,rest
    			// notify loop that the condition is satisfied loop must brake
    			pzzlPieces[pzlEventListeners[i][0]][24][3] = 'break'
    			//remove eventListener from array
    			pzlEventListeners.splice(i,1)
    			resultHandled = true
    			break
    		}
		}			
	}else if (respons[0] == ':FB' && respons[2] == 'sensor') {
		const arrayLength = pzlEventListeners.length;			
		//it is a sensor change respons
		for (var i = 0; i < arrayLength; i++) {
    		//look for FA sensor listener
   		if (pzlEventListeners[i][1] == 'SensorFB') {
    			//the event occured - S2,LEMO Coding,rest
    			// notify loop that the condition is satisfied loop must brake
    			pzzlPieces[pzlEventListeners[i][0]][24][3] = 'break'
    			//remove eventListener from array
    			pzlEventListeners.splice(i,1)
    			resultHandled = true
    			break
    		}
		}	
		
	}
}
 	