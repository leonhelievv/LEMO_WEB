
const programs=[]
var cmndSequince=[]
var executionProgress=[0,0]
const listLinkIndexs = []

//mod to return the result cmndSeq
function interpretBlocks() {
var beginBlock='none'
var blkAtBottom = false
var cmndSeq = []
var sqIndex = 0
//find begin block
var cmndString=''
for (let i = 0; i < pzzlPieces.length; i++){	
	if (pzzlPieces[i][26] == 'beginBlk') {	
	//it is the start of the cmnd sequence
	beginBlock = pzzlPieces[i]
		break		
	}
}
if (beginBlock!='none') {
//there is a begin blk
// is there a blk at the bottom of begin
var linkToBottom = beginBlock[16]
if (Number.isInteger(linkToBottom)) {
	//there is a block at the bottom of begin	
	blkAtBottom=true
	//cycle throug blks until no more blk connected to the bottom
	var noBlks = 0
	while (blkAtBottom==true) {
		blkAtBottom=false
  		//find the block linked to bottom of this blk
		for (let i = 0; i < pzzlPieces.length; i++){	
			if (pzzlPieces[i][1] == linkToBottom) {	
			//this is the blk connected to the bottom
			cmndBlock = pzzlPieces[i]
			if (!cmndBlock[21].includes('savedProgram')) {
			//the block is not a program name block
			//build the cmnd for this blk 
			cmndString = buildCmnd(cmndBlock)
			
			//store in the current array
				if (cmndString.includes('name')) {
					//the cmnd is the program name				
					cmndSeq[sqIndex]=cmndString
				}else {
					sqIndex += 1
					cmndSeq[sqIndex]=cmndString
				}
			
			}else {
			//the block is a program block
			//get the name of the program
			const pName = cmndBlock[3].split(':')
			//get the cmnd seq of this program
			for (let i = 0; i < programs.length; i++){
				if (pName[1] == programs[i][1][0]) {
					//the program name is a match
					//get the cmnd seq
					console.log('at this is the program block')
					//add the cmnds in the program after the last cmnd
					//sqIndex += 1
					//loop through the cmnds in the cmnd block an insert them in the cmnd seq
					//cmndSeq=programs[i][1].slice(0)
					for (let ic = 0; ic < programs[i][1].length; ic++){
						sqIndex += 1
						cmndSeq[sqIndex]=programs[i][1][ic]
					}
					break	
				}
			}
							
			}
			//is there a blk connected to the bottom of cmndBlock
			if (Number.isInteger(cmndBlock[16])) {
				//there is a nother blk connected at bottom of cmndBlock
				blkAtBottom=true
				noBlks+=1
				linkToBottom=cmndBlock[16]
			}else {
				//there is no block connected to the bottom of cmndBlock
				blkAtBottom=false
			}
			break		
			}
		}	
	}
}else{
//there is no begin blk
}
}
return cmndSeq
};

function buildCmnd(cmndBlock) {
//this builds the cmnd and saves it into the cmndSequence array 

const noOfBlocks = pzzlPieces.length
var cmndPart1
var cmndPart2
const owner = document.getElementById('title').innerText
//const listLinkIndexs = []
var sMotor = false
var cmndBufferIndex = 0
var cmnd
var symblX = cmndBlock[7] //find Pzzl X and Y
var symblY = cmndBlock[8]
var drawing = makeDrawingArray(redX,symblX,symblY)
var specs = [drawing,'rgb(207, 14, 0)','rgb(112, 22, 16)']

	//make list of index's of pzls connected to the cmndBlock
	findLinkedpzlsIndex(cmndBlock)
	
	if (cmndBlock[3].includes('motor')) {
	//this Block is a motor block
		//are all option for motor blocks in place
		if (listLinkIndexs[1] == 'none' || listLinkIndexs[2] == 'none' ||  listLinkIndexs[3] == 'none') {
			//all options are not in place
			console.log('all motor option not supplied')	
			//make the drawing
			drawSymbol(specs)
			//return error
			cmnd = 'error, all options not supplied'	
		}else{
			//all options are in place			
			if (cmndBlock[3]=='FA motor') {
			//it is Motor A
			cmndPart1=':FA/'
			}else if (cmndBlock[3]=='FB motor') {
			//it is Motor B
			cmndPart1=':FB/'
			cmndBufferIndex = 1
			}else if (cmndBlock[3]=='S1 motor') {
			//it is S1 motor
			cmndPart1=':S1/'
			cmndBufferIndex = 2
			sMotor=true
			}else if (cmndBlock[3]=='S2 motor') {
			//it is S2 motor
			cmndPart1=':S2/'
			cmndBufferIndex = 3
			sMotor=true	
			}
		//get the options from option blk connected R1 is second in the array
		var modeOrDgrs = pzzlPieces[listLinkIndexs[1]][15]	//flip here

		if (sMotor==false) {
		//it is a F type motor
			if (modeOrDgrs=='Spin') {
				//the mode is spin
				var speed = pzzlPieces[listLinkIndexs[2]][15] //flip here
				var clkw = pzzlPieces[listLinkIndexs[3]][15]	//flip here	
				cmnd = 'stored,'+cmndBufferIndex	
				deviceCmndBuffer[cmndBufferIndex][1] = cmndPart1+owner+'/'+clkw+'/'+speed+'/;'
			}else if (modeOrDgrs=='Shake') {
				//mode is shake 
				cmnd = 'stored,'+cmndBufferIndex
				//get the cmnd code from puzzelResorce, fMotorModes
				const cmndCode = fMotorModes[1][1]
				//remember the cmnd
				deviceCmndBuffer[cmndBufferIndex][1] = cmndPart1+owner+'/'+cmndCode+'/;'
			}else if (modeOrDgrs=='Metronome') {
				//mode is metronome
				cmnd = 'stored,'+cmndBufferIndex
				var speed = pzzlPieces[listLinkIndexs[2]][15]
				//get the cmnd code from puzzelResorce, fMotorModes
				const cmndCode = fMotorModes[2][1]
				//remember the cmnd
				deviceCmndBuffer[cmndBufferIndex][1] = cmndPart1+owner+'/'+cmndCode+'/'+speed+'/;'
			}else if (modeOrDgrs=='Sensor0') {
				//mode is sensor0
				cmnd = 'stored,'+cmndBufferIndex
				//get the cmnd code from puzzelResorce, fMotorModes
				const cmndCode = fMotorModes[3][1]
				//remember the cmnd
				deviceCmndBuffer[cmndBufferIndex][1] = cmndPart1+owner+'/'+cmndCode+'/;'
			}else if (modeOrDgrs=='Sensor1') {
				cmnd = 'stored,'+cmndBufferIndex
				//get the cmnd code from puzzelResorce, fMotorModes
				const cmndCode = fMotorModes[4][1]
				//remember the cmnd
				deviceCmndBuffer[cmndBufferIndex][1] = cmndPart1+owner+'/'+cmndCode+'/;'
			}

	}else{
		//it is a S type motor
		//note the options are no longer the same as for f motor - change them
		cmnd = 'stored,'+cmndBufferIndex
		const Ssteps = pzzlPieces[listLinkIndexs[1]][15]
		speed = pzzlPieces[listLinkIndexs[2]][15]
		clkw = pzzlPieces[listLinkIndexs[3]][15]		
		deviceCmndBuffer[cmndBufferIndex][1] = cmndPart1+owner+'/'+clkw+'/'+speed+'/'+Ssteps+'/;'
		}
	}
}else if (cmndBlock[3]=='START') {
	//record 'start' in the current cmndSequence
	cmnd = 'start'

}else if (cmndBlock[3]=='STOP') {
	//record stop
	cmnd = 'stop'
}else if (cmndBlock[3].includes('Delay')) {
	//it is a delay block
	//is the option delay supplied?
	if (listLinkIndexs[1] != 'none') {
		//there is a option block and the value in the option is type int
		//get the delay
		const delay = parseInt(pzzlPieces[listLinkIndexs[1]][15])
		cmnd = ['delay',delay]
	}else {
		//there is no option blk
		//mark block with red X
		drawSymbol(specs)
		//return error
		cmnd = 'error no delay'
	}
}else if (cmndBlock[3].includes('voice')) {
	//get the option value
	if (listLinkIndexs[1] != 'none') {
		//option is supplied
		codingPhrase = pzzlPieces[listLinkIndexs[1]][15]
		cmnd = ['voice',codingPhrase]
	} else {
		//option is not supplied - return error
		drawSymbol(specs)	
		cmnd = 'error no phrase'
	}
}else if (cmndBlock[3].includes('SensorFA')) {
	if (listLinkIndexs[1] != 'none') {
		//option is supplied  - get the option value
		const sensorType = parseInt(pzzlPieces[listLinkIndexs[1]][15])
		cmnd = ['SensorFA',sensorType]
	} else {
		//option is not supplied - return error
		drawSymbol(specs)	
		cmnd = 'error no sensor value'
	}
}else if (cmndBlock[3].includes('SensorFB')) {
	//record stop
	//get the option value
	if (listLinkIndexs[1] != 'none') {
		//option is supplied  - get the option value
		const sensorType = parseInt(pzzlPieces[listLinkIndexs[1]][15])
		cmnd = ['SensorFB',sensorType]
	} else {
		//option is not supplied - return error
		drawSymbol(specs)	
		cmnd = 'error no sensor value'
	}
}else if (cmndBlock[3].includes('Name')) {
	//is there a name blk
	if (listLinkIndexs[1] != 'none') {
		//there is a program name 
		//record name
		//get the option value
		const programName = pzzlPieces[listLinkIndexs[1]][15]
		cmnd = 'name,'+programName
	}else {
		//there is no program name
		console.log('error no program name')
		//place red X on blk
		drawSymbol(specs)
		//return error
		cmnd = 'error,no name'
	}
}else if (cmndBlock[21].includes('savedProgram')) {
	//it is a program block
	//????? what to do - with cmnd seq
	cmnd = 'name,???'+cmndBlock[3]
	
}else if (cmndBlock[3].includes('device')) {
	//it is a device selection block	
	//const cm = cmndBlock[3].split(' ')
	cmnd = cmndBlock[3]
	console.log(' the cmnd is '+cmnd)
}else if (cmndBlock[3].includes('S1wait')) {
	//it is a S1 wait block
	cmnd = cmndBlock[3]
	console.log(' the cmnd is '+cmnd)
}else if (cmndBlock[3].includes('S2wait')) {
	//it is a S1 wait block
	cmnd = cmndBlock[3]
	console.log(' the cmnd is '+cmnd)
}else if (cmndBlock[3].includes('Sound')) {
	//is the option delay supplied?
	if (listLinkIndexs[1] != 'none') {
		const dialogValue = pzzlPieces[listLinkIndexs[1]][15]
		//get the sound file from lemoSounds - use dialogValue
		const findI = (element) => element[0] == dialogValue	
		const inD = lemoSounds.findIndex(findI)	
		cmnd = 'sound,'+lemoSounds[inD][1]
	} else {
		//option is not supplied - return error
		drawSymbol(specs)	
		cmnd = 'error no sound file'
	}
}else if (cmndBlock[3].includes('switch')) {
	//get the option value
	if (listLinkIndexs[1] != 'none') {
		//the switch blk has a name
		const switchName = pzzlPieces[listLinkIndexs[1]][15]
		//is there a pzl inside?
		const insideLnk = cmndBlock[18]
		var errFlag = true
		//is the inside blk a device	
		if (Number.isInteger(insideLnk)) {
			//there is a blk inside
			const insidePzl = pzzlPieces.find(element => element[1] == insideLnk);
			if (insidePzl[3].includes('device')) {
				//the inside pzlz is a device
				//remember the cmnd
				errFlag = false
				cmnd = ['switch',switchName,'pzlId',cmndBlock[1],'insideId',cmndBlock[18]]
			}else{
				//the inside pzl is not a device
				cmnd = 'error,not device'
				symblX = insidePzl[7]
				symblY = insidePzl[8]
			}
		}else {
			//there is no blk on inside
			cmnd = 'error, no insideBlk'
			//use X Y of cmndBlk
			//symblX = cmndBlock[7] //find Pzzl X and Y
			//symblY = cmndBlock[8]
		}
		if (errFlag) {
			//the inside pzl is not a device or no inside pzl	
			drawing = makeDrawingArray(redX,symblX,symblY)
			specs = [drawing,'rgb(207, 14, 0)','rgb(112, 22, 16)']
			drawSymbol(specs)
		}
		
	}else {
		//the switch blk has no name
		drawSymbol(specs)
		cmnd = 'error,noName'
	}
}else if (cmndBlock[3].includes('light')) {
		//are all options for this light block are in place
		var lightFullCmnd
	if (listLinkIndexs[1] == 'none' || listLinkIndexs[2] == 'none' ||  listLinkIndexs[3] == 'none') {
		//all options are not in place
		console.log('all motor option not supplied')	
		//make the drawing
		drawSymbol(specs)
		//return error
		cmnd = 'error, all options not supplied'		
	}else{
		//all options are in place
		console.log('all good build cmnd')
		const lightNo = parseInt(pzzlPieces[listLinkIndexs[1]][15])
		const lightMode = pzzlPieces[listLinkIndexs[2]][15]	
		const blinkTempo = parseInt(pzzlPieces[listLinkIndexs[3]][15])
		const cmndP1 = ':S2/'+currentPlay+'/'
		var lightCmnd = 600
		if (lightMode == 'On') {
			lightCmnd +=1
			lightFullCmnd = cmndP1+lightCmnd+'/'+lightNo+'/;'		
		}else if (lightMode == 'Off') {
			lightFullCmnd = cmndP1+lightCmnd+'/'+lightNo+'/;'		
		}else if (lightMode == 'Blink on') {
			lightCmnd += 3
			lightFullCmnd = cmndP1+lightCmnd+'/'+lightNo+'/'+blinkTempo+'/50/;'
		}else if (lightMode == 'Blink off') {
			lightCmnd += 4
			lightFullCmnd = cmndP1+lightCmnd+'/'+lightNo+'/'+blinkTempo+'/50/;'
		}
		//put in cmndSeq
		cmndBufferIndex = 4 + lightNo
		cmnd = 'stored,'+cmndBufferIndex
		//load cmnd in cmnd buffer
		deviceCmndBuffer[cmndBufferIndex][1] = lightFullCmnd
	}
}
	//this function is inside buildCmnd
	function findLinkedpzlsIndex(thisPzl) {
		//find blocks linked to this block and return list of index's
		const pzlTop = 20 
		const pzlR1 = 17
		const pzlR2 = 18
		const pzlR3 = 19
		const pzlBottom = 16
		for (let pI = 0; pI < 5; pI++){
		//loop 5 times for 5 possible pzl connections
		listLinkIndexs[pI] = 'none'
		var lookFor = thisPzl[16+pI]
		for (let i = 0; i < pzzlPieces.length; i++){
			//loop through all the puzzels look for the pzl id 'lookFor'
			if (pzzlPieces[i][1] == lookFor) {	
			//this is the blk looked for
			 listLinkIndexs[pI] = i
			 break	
			}
		}	
	}
}

return cmnd
};

function loadProgram() {
	//this is the event handler for mouseDown on load program blue button
	console.log('at loadProgram')
	//clear the canvas
	var pzlCanvas = document.getElementById("canvas");
	var newCanvas = pzlCanvas.innerHTML
 	pzlCanvas.remove();	
 	var d1 = document.getElementById('delProgram'); 
	d1.insertAdjacentHTML('afterend', "<canvas id='canvas' width='600' height='1000' style='background-color: #d7de16'></canvas>");
	//re assign the event listeners
	ctx = document.getElementById("canvas").getContext("2d");
   canvas=document.getElementById('canvas');
   canvas.addEventListener('touchstart',tDown,{passive: true})
	canvas.addEventListener('touchmove',tMove,{passive: true})
	canvas.addEventListener('touchend',tUp,{passive: true})
	//display the list of stored programs
	listPrograms()
	//
	
}

function runProgram() {

	//run the program/blocks currently displayed on canvas
	console.log('at runProgram')
	//interpret the blocks - result is list of cmnds to execute
	cmndSequince = interpretBlocks()
	//run as default the last program that was stored
	//executionProgress[0] = thisProgramI
	//reset the cmnd execution counter
	executionProgress[1] = 0
	//run
	continueProgram()
}

var pzl1 = 55
var pzl2 = 66
function continueProgram() {
	console.log('at run Program')
	const owner = document.getElementById('title').innerText
	var fullCmnd = ''
	var devName = ''
	// get the next cmnd to do, by executionIndex [programIndex,seqIndex]
	//const theProgram = cmndSequinces[executionProgress[0]]
	const noOfCmnds = cmndSequince.length
	while (executionProgress[1] < noOfCmnds) {
		//there is another cmnd to send
	var nextCmnd = cmndSequince[executionProgress[1]]
	if (Array.isArray(nextCmnd)) {
		//the cmnd is an array - it has option block(s)
			if (nextCmnd[0] == 'delay') {
				//the cmnd is a delay
				var delay = nextCmnd[1] * 1000
				//execute the delay cmnd
				console.log('at start the delay timer '+delay)
				// increment the executionProgress [1]
				executionProgress[1] += 1
				//set delay timer
				//setTimeout(function(){ alert("Hello"); }, 3000);
				setTimeout(function(){ continueProgram(); }, delay);
				break
		} else if (nextCmnd[0] == 'voice') {
			//the cmnd is a voice cmnd
			//get the prhase
			var phrase = nextCmnd[1]
			//start voice to text recognition
			voiceCmnd()
			//set up the voice recognition handler for coding
			break
		} else if (nextCmnd[0] == 'SensorFA') {
			const sensCmnd = 180 + nextCmnd[1]
			//send the cmnd - assign FA as triger
			fullCmnd = ':FA/'+owner+'/'+sensCmnd+'/;'
			//fullCmnd = ':FA/'+owner+'/182/;'
			websocket.send(fullCmnd);
			//send the cmnd to store in the triger buffer - request info FA status
			//:SB1R/LEMO Coding/500/,S1/LEMO Tipper/201/100/50/;
			fullCmnd = ':SB1R/LEMO Coding/500/,FA/LEMO Coding/300/;'			websocket.send(fullCmnd);
			// raise the flag Coding waiting for respons
			codingWaitRespons[0] = true
			codingWaitRespons[1] = 'FA'
			// increment the executionProgress [1]
			executionProgress[1] += 1
			//it is a FA sensor block - stop until sensor is trigered
			break		
		}else if (nextCmnd[0] == 'SensorFB') {
			//it is a FB sensor block - stop until sensor is trigered
			const sensCmnd = 180 + nextCmnd[1]
			//send the cmnd - assign FA as triger
			fullCmnd = ':FB/'+owner+'/'+sensCmnd+'/;'
			websocket.send(fullCmnd);
			//send the cmnd to store in the triger buffer - request info FA status
			fullCmnd = ':SB2R/LEMO Coding/500/,FB/LEMO Coding/300/;'			websocket.send(fullCmnd);
			// raise the flag Coding waiting for respons
			codingWaitRespons[0] = true
			codingWaitRespons[1] = 'FB'
			// increment the executionProgress [1]
			executionProgress[1] += 1			
			break		
		}else if (nextCmnd[1].includes('Sound')) {
			//it is a sound cmnd
			console.log('cmnd is play sound - do only when next cmnd is start')
		}else if (nextCmnd[0].includes('switch')) {
			//it is a switch blk
			console.log('cmnd is switchBlk')
			//what is inside
			const pzlInside = nextCmnd[5]
			if (Number.isInteger(pzlInside)) {
				//there is a valid pzl on the inside
				console.log('it is a switchBlk - there is an inside blk')
				//if there is already a button of this ID do not create another
				//const isID = document.getElementById('pzlInside/'+pzlInside)	
				const uBli = document.getElementById('bli'+nextCmnd[1]+'/'+nextCmnd[5])	
				if (uBli == null) {
				//there is no button with this id
				makeBtn(pzlInside,nextCmnd)
			}
				
				//const pzlSwitch = document.getElementById('switchStart')
				//pzlSwitch.style.display = 'block'
				//pzlSwitch.style.width = 200+'px'
				//pzlSwitch.addEventListener('onmousedown',switchRun)
				//pzlSwitch.addEventListener('onmousedown', function() {switchRun(nextCmnd, pzlSwitch);});				
				//pzlSwitch.addEventListener('onmousedown', function() {
				//	switchRun(pzl1,pzl2);
				//	});
				//pzlSwitch.addEventListener('onclick',switchRun())
				//pzlSwitch.onmousedown = 'switchRun()'
				
			}else{
				//there is no valid pzl on the inside
				console.log('it is a switchBlk but no valid pzl on the inside')
			}
		}
	}else{
		//the cmnd has no option blocks		
		//if prevCmnd is valid send via websocket	
		var prevCmnd		
		//what was the previous cmnd		
		if (nextCmnd == 'start') {
			//the nextCmnd is  start
			//is there a prevCmnd and is it a valid Cmnd or a device id
			if (noOfCmnds > 1) {
				//there is a prevCmnmd
				prevCmnd = cmndSequince[executionProgress[1]-1]				
				if (prevCmnd.includes('stored')) {
					//the previous cmnd was stored for execution					
					const sA = prevCmnd.split(',')
					const buffIndex = sA[1]
			   		//get stored by index  and send the stored cmnd
			   		prevCmnd = deviceCmndBuffer[buffIndex][1]
						websocket.send(prevCmnd);
						console.log('send the cmnd simulation '+prevCmnd)					
				}else if (prevCmnd.includes('device')) {
					//it is a valid device id
					//get the current cmnd for the device in the cmnd buffer
					//get index
					const bufIndex = prevCmnd.slice(0,1)
					const curentCmnd = deviceCmndBuffer[bufIndex-1][1]
					websocket.send(curentCmnd);
				}else if (prevCmnd.includes('sound')){
					//it is a sound cmnd
					//get the sound required - entered by the user
					const theFileName = prevCmnd.split(',')[1]
					//function checkInclude(fileName) { return fileName.includes(theSoundName) }
					//const theFileName = lemoSounds.find(checkInclude)
					//now instruct user device to play the sound
					audio.src=theFileName //'truck_beep.mp3'
					audio.play(); 
				}
			}		
		}else if (nextCmnd == 'stop') {
			//the next cmnd is a stop cmnd - what must be stopped?
			if (noOfCmnds > 1) {
				//there is a prevCmnd
				prevCmnd = cmndSequince[executionProgress[1]-1]
				if (prevCmnd.includes('device')) {
					//prevCmnd is a device id
					//get the device name - it is the first part of the cmnd '1device :FA/'
					const dvI = prevCmnd.split(' ')
					const devName = dvI[1] //:FA/
					fullCmnd = devName+owner+'/199/;'
					websocket.send(fullCmnd);
				}else if (prevCmnd.includes('stored')) {
					//prevCmnd is stored cmnd
					const stored = prevCmnd.split(',')
					const sI = stored[1]
					const devName = deviceCmndBuffer[sI][0] //FA
					fullCmnd = ':'+devName+'/'+owner+'/199/;'
					websocket.send(fullCmnd);
				}		
				const devName = prevCmnd.slice(0, 4)
				if (devName.includes('F') || devName.includes('S')) {
					//the prev cmnd is valid device						
					//construct stop cmnd :S1/LEMO Spin/199/;
					fullCmnd = devName+owner+'/199/;'
					websocket.send(fullCmnd);
					console.log('the stop cmnd '+fullCmnd)						
				}
				
			}
		}else if (nextCmnd == 'S1wait') {
			//it is a S1wait block - stop until S1 stops
			// raise the flag Coding waiting for respons
			codingWaitRespons[0] = true
			codingWaitRespons[1] = 'S1'
			// increment the executionProgress [1]
			executionProgress[1] += 1			
			break
		}else if (nextCmnd == 'S2wait') {
			//it is a S1wait block - stop until S1 stops
			// raise the flag Coding waiting for respons
			codingWaitRespons[0] = true
			codingWaitRespons[1] = 'S2'
			// increment the executionProgress [1]
			executionProgress[1] += 1			
			break
		}
	}
	executionProgress[1] += 1
}
};

function listPrograms() {
	//loop through the number of programs
	var insertHere = document.getElementById('listP');
		
	for (let i = 0; i < programs.length; i++){
		//add a <p> into list
		var info = programs[i][1][0].split(',')
		var pName = info[1]
		const pListStyle = document.getElementById('listPrograms').style
		const programId = pName+i	
		//insertHere
		//insertHere.insertAdjacentHTML('afterend', '<p id="'"+pName+i+"'"> '+pName+'</p> ');
		//insertHere.insertAdjacentHTML('afterend', "<p id="program1" onmousedown = "runProgram()"> "+programId+"'</p>");
		insertHere.insertAdjacentHTML('afterend',  "<p id='"+programId+"' onmousedown = 'runProgram()' >" + programId + "</p>");
		
		document.getElementById(pName+i).addEventListener('onmousedown',buildPzlCanvas);
		document.getElementById(pName+i).value = i;
  		//ajust position
  		//pListStyle.left = 50+"px"
  		//pListStyle.top = 20+"px"
  		//pListStyle.zIndex = "1";
  		insertHere = document.getElementById(pName+i);
	}
  	
}

function buildPzlCanvas() {
	//from wich program ?
	console.log('at buildPzlCanvas ')
	//ctx = document.getElementById("canvas").getContext("2d");
	for (let i = 0; i < pzzlPieces.length; i++){		
		drawPzzl(pzzlPieces[i],false,false,pzlCtx)
		//calc text position X,Y
		const txtX = pzzlPieces[i][4] + pzzlPieces[i][7]
		const txtY = pzzlPieces[i][5] + pzzlPieces[i][8]
		//add the text
		addPuzTxt(pzzlPieces[i][3],txtX,txtY,false);		
	}
	
}

function saveProgram() {
	//respons handler if save program mouseDown
	//make the cmndSequince array
	const cmndSeq = interpretBlocks()
	//save the pzzlPieces and the cmndSequince for this program into the programs array	
	const pIndex = programs.length
	//record the index no of this program in programs array
	programs[pIndex] = [pzzlPieces.slice(0), cmndSeq.slice(0),'Program,'+pIndex]	
	console.log(programs)
	//create a menu pzl for the saved program
	//addProgramPuzzel(cmndSeq[0])
	addProgramPuzzel(cmndSeq[0])
}

function switchRun(a,b) {
	console.log('at switch run')
	//what to do if the switch icon is touched ?
	//get the device name in pzl that is inside
	
	//fullCmnd = devName+owner+'/199/;'
	//websocket.send(fullCmnd);
}


