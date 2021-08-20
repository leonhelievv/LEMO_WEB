
	//global var
	var selectedPuzzel = []  
   var specs =[]
   var pzlOptionDialog
   var pzlInDialog = 'none'
   var pzzlPieces=[]
   var pzzlpNo=0
   var touchMove = false
   var downX
   var downY
   var pzlCanvas = document.getElementById('canvas')
   
function pzlPrep() {   
   //store and remove options dialog
   //const pzlOp = document.getElementById('pzlDialog')
   //pzlOptionDialog = pzlDialog.innerHTML
   //pzlOp.remove();
   
   //draw on the available blocks canvases
   //var pzlType='beginBlk'
   //var ctx = document.getElementById(pzlType).getContext("2d");  
   var pzlType
   var ctx
   
   // build the menu 
   initMenu()

    
   //the canvas on which the pzls are drawn   
   var pzlCtx = document.getElementById("pzlCanvas").getContext("2d");
   const canvas=document.getElementById('pzlCanvas');
   canvas.addEventListener('touchstart',tDown,{passive: true})
	canvas.addEventListener('touchmove',tMove,{passive: true})
	canvas.addEventListener('touchend',tUp,{passive: true})
	   
    //var canvasTxt =[]
    
}
                         
function tDown(xyMove) {
		console.log('at down  - X '+xyMove.changedTouches[0].clientX+' Y '+xyMove.changedTouches[0].clientY)		
		touchMove=false
		pzlCanvas=document.getElementById('pzlCanvas');
		//ajust x an y touch with canvas offset		
		console.log('canvas start X '+pzlCanvas.offsetLeft)
		console.log('canvas start Y '+pzlCanvas.offsetTop)
		const pzlCnvStartX = pzlCanvas.offsetLeft
		const pzlCnvStartY = pzlCanvas.offsetTop
		
		const pzl = document.getElementById('pzzl')
		const pzlXoffset = pzl.offsetLeft
		const pzlYoffset = pzl.offsetTop
		console.log('pzzl offset '+pzl.offsetTop)
		
		//get scrollY
		const sTop = document.getElementById('pzlCanvasArea').scrollTop
		console.log('scroll Y is '+sTop)
	
		downX=xyMove.changedTouches[0].clientX - pzlXoffset
		downY=xyMove.changedTouches[0].clientY - pzlYoffset + sTop
		
		
};
	
function tMove(xyMove) {
		console.log('at move  - X '+xyMove.changedTouches[0].clientX+' Y '+xyMove.changedTouches[0].clientY)
		touchMove=true
};
	
function tUp(xyMove) {
	console.log('at up  - X '+xyMove.changedTouches[0].clientX+' Y '+xyMove.changedTouches[0].clientY)
	
	const hereResult = whatsHereTouch(downX,downY)
	const hereIsThis = hereResult[0]
	const hereIndex = hereResult[1]
	const pzlHeight = hereIsThis[13]
	var xOfnew=downX
	var yOfnew=downY
	var draw = false
	//pzlCtx = document.getElementById("pzlCanvas").getContext("2d");
	canvas = document.getElementById("pzlCanvas")
		
	if (touchMove==false) {
		 placeOrNot(hereIsThis,hereIndex,downX,downY) 
	
	}else {
		//touch and move - delete
		//if (hereIsThis != '') {
		if (hereIsThis != 'noThing') {
			//there is a pzzl at this spot
		console.log('the touch moved - delete if there is a pzl')
		//get the index into pzzlPiecs of hereIsThis
		const indexPzzl = pzzlPieces.indexOf(hereIsThis)
		//slice out of pzzlPiecesArray	
		//pzzlPieces.splice(hereIndex,1)	
		pzzlPieces.splice(indexPzzl,1)	
		//eraze
		//test first draw with no clr
		const blank = 'rgba(0, 0, 0, 0.6)'
		hereIsThis[9]=blank
		hereIsThis[10]=blank
		drawPzzl(hereIsThis,false,false,pzlCtx)
		//test second draw with backgroundColor
		const canvClr = canvas.style.backgroundColor
		hereIsThis[9]=canvClr
		hereIsThis[10]=canvClr
		drawPzzl(hereIsThis,false,false,pzlCtx)
		//if the pzl is in dialog mode hide dialog box and fMotorModes
		if (pzlInDialog == hereIndex) {
			//close dialog
			document.getElementById("pzlDialog").style.display = 'none';
			document.getElementById("optionInput").value = '';
			document.getElementById('fMotorModes').style.display='none';
			document.getElementById('listOfOptions').style.display='none';
  			pzlInDialog='none'
		}
		//update linked pzls - delete links to hereIsThis
		deleteUpdate(hereIsThis)
		} 
	}	
};
	
function pzOptionHandler(theOption) {	
	console.log('at pzOption handler'+theOption.currentTarget.id)
	//set as selected option to draw on main canvas
	//find the menuItem in menuItems array by ID
	const menuOptionsIndex = findMenuItem(theOption.currentTarget.id)
	selectedPuzzel =  optionsMenu[menuOptionsIndex]	
};

function handlePzlInput() {
	const val = document.getElementById('optionInput').value
	console.log('at handle pzl input was > ' + val)
	
  	//process the input - store in pzl
  	pzzlPieces[pzlInDialog][15]=val
  	
  	//if connected to R1 of motor block also store in motor mode [25]
  	const connectedTo = pzzlPieces[pzlInDialog][20]
  	//get the connected puzzel
  	const connectedPzl = getConnectedPzl(connectedTo)
  		if (pzzlPieces[connectedPzl][3].includes('motor') && pzzlPieces[pzlInDialog][17] == 1) {
  			//this option is connected to the motorBlock
  			//record input/motor state in motor pzl [25]
  			pzzlPieces[connectedPzl][25] = val //in what state is the motor
  		}
  	//display input on the option block

  	//calc where to add text x,y
  	const txtX = pzzlPieces[pzlInDialog][7] + pzzlPieces[pzlInDialog][4]
  	const txtY = pzzlPieces[pzlInDialog][8] + pzzlPieces[pzlInDialog][5]
 	
	//remove higLigh	
	drawPzzl(pzzlPieces[pzlInDialog],false,false,pzlCtx)
	
	//close dialog
	document.getElementById("pzlDialog").style.display = 'none';
	document.getElementById("optionInput").value = '';
	document.getElementById('listOfOptions').style.display='none';
  	pzlInDialog='none'

  	//add puzzel text 1
	addPuzTxt(val,txtX,txtY,true,pzlCtx)
};

function placeOrNot(hereIsThis,hereIndex,touchX,touchY) {
	var place = false
	var xOfnew=downX
	var yOfnew=downY
	var option
	var doDeletedUpdate = false
	const pzlHeight = hereIsThis[13]
	var blkMatch = [,,,,'none']

	if (hereIsThis != 'noThing') {
		//there is a pzzl at this spot	
	blkMatch = matchLemoBlock(hereIsThis,touchX,touchY)
	option = blkMatch[3]
		if (hereIsThis[21].includes('option')) {
		//hereIsThis is an option blk
		//make option list display none - as default
		const listOfOptions = document.getElementById('listOfOptions')
		listOfOptions.style.display = 'none'
		//do dialog
			//Highlight		
			drawPzzl(hereIsThis,true,false,pzlCtx)				
			//ajust dialog box position - this option block x,y plus text offset
  			const pStyle = document.getElementById('pzlDialog').style
  			//position of dialog box , compensate for scroll 
 			const sTop = document.getElementById('pzlCanvasArea').scrollTop
			const obX = hereIsThis[7] + hereIsThis[4]
  			const obY = hereIsThis[8] + hereIsThis[5] + 110 - sTop
  			pStyle.left = obX+"px" //X
  			pStyle.top = obY+"px" //Y - may be subtract dialog box height
  			//make visible
  			pStyle.display='block'
  			//text dialog
  			//who is this option connected to ? - get the dialog text from who
  			const conToI = getConnectedPzl(hereIsThis[20])
  			const who = pzzlPieces[conToI]
  			var infoTxt = who[14]
  			joyOptionInput.type ="number"		
  			//if who is a motor block to which port am i (optionBlock) connected to 17,18,19
  			//if (who[26].includes('motor') || who[26].includes('lights')) {
  			if (who[21] == 'motorBlock') {
  				//'who' is of pzl type motorBlk 			
  				//am i connected to 17,18 or 19 ?
  				const myId = hereIsThis[1]
  				if (myId == who[17]) {
  					//i am connected to 17
  					infoTxt = who[14][2]
  					if (who[26].includes('F')) {		
  						//who is a F type motor - populate list with options					
						makeOptionsList(fMotorModes)
						listOfOptions.style.display = 'block'									
  					}
  				}else if (myId == who[18]) {
  					//i am connected to 18
  					infoTxt = who[14][0]
  					
  					if (who[26].includes('light')) {
  						makeOptionsList(lightModes)
  						listOfOptions.style.display = 'block'
  					}	
  					if (who[25] == 'metronome') {
  						//the who puzzel state is metronome
  						infoTxt = who[14][3]
  					}  					
  				}else if (myId == who[19]) {
  					//i am connected to 19
  					infoTxt = who[14][1]
  				}
  			}else {
  				//who is not a motor block	or lightBlk
  				if (who[26] == 'Sound') {
  					//who - is a sound blk - populate options list
  					makeOptionsList(lemoSounds)
  					listOfOptions.style.display = 'block'
  				}
  			}
  			if (infoTxt.includes('Mode') || infoTxt.includes('name')) {
  				//info text is txt input
  				joyOptionInput.type ="text"	
  			}
  			//set dialog txt
  			document.getElementById('whatOption').innerText=who[3]
  			document.getElementById('optionInfo').innerText = infoTxt
  			//remember who is in dialog			
  			pzlInDialog = hereIndex
  			//make dialog box position absolute
  			pStyle.position = 'absolute'
  			//style the dialog box
  			pStyle.background = 'rgba(66, 153, 88, 0.8)';
  			//move cursor into input box
  			//document.getElementById('optionInput').focus();
				
		} else {
		//hereIsThis is not an option blk		
			if (selectedPuzzel[21].includes('option')) {
			//new pzl is an option blk
				if (hereIsThis[21].includes('motor')) {
					//hereIsThis is a motor blk - do zone check - block match
					//const blkMatch = matchLemoBlock(hereIsThis,touchX,touchY)
					const optIndex = option + 16 //16 + 1 gives option stored in 17				
					if (hereIsThis[optIndex].includes('none') || hereIsThis[optIndex].includes('linkedToR') || hereIsThis[optIndex].includes('deleted')) {
					//at this option position there is no option block
						if (option != 0) {
							//blk match returned option was not 0
							//the option on motor blk is open
							//make place true so that - create new pzl and draw - save in pzlPieces
							//record in option block the port no on motor block
							selectedPuzzel[17]=option
							place=true
							xOfnew=blkMatch[1]
							yOfnew=blkMatch[2]
							
						}else {
							//blkMatch returned option was a 0
							console.log('blkMatch returned - not in any option zone of motor block')
						}
											
					}else {
						//the option on motor blk is not open
						console.log('options on motor block is full')
					}
					
				}else if (hereIsThis[21]=='nameBlock') {
					//hereIsThis is a delay blk
					if (!Number.isInteger(hereIsThis[17])) { //linkedToR1 default txt
					//delay blk option is open
					place=true
					xOfnew=blkMatch[1]
					yOfnew=blkMatch[2]	
					} else {
					//delay blk option is not open
					console.log('delay blk option is full, can not place option')
					}//end
					
				}else if (hereIsThis[21]=='switchBlock') {
					//hereIsThis is a switch blk
					if (!Number.isInteger(hereIsThis[17])) { //linkedToR1 default txt
					//switch blk option is open
					place=true
					xOfnew=blkMatch[1]
					yOfnew=blkMatch[2]				
					} else {
					//delay blk option is not open
					console.log('switchBlock option is full, can not place option')
					}//end	\
											
				}
			
			} else {
			//new pzl, selected pzzl is not an option blk
			const nextResult = whatsHereTouch(touchX,touchY+pzlHeight)		
			const nextDown = nextResult[0]		
			if (nextDown == 'noThing') {
				//next position down is open
				//place the blk
				place=true		
				xOfnew=blkMatch[1]
				yOfnew=blkMatch[2]
				
				//if hereIsThis has deleted bottom
				if (!Number.isInteger(hereIsThis[16])) {
					if (hereIsThis[16].includes('deleted')) {
					//the hereIsThis blk has a deleted bottom - restore links
					doDeletedUpdate = true	
					}				
				}				
				}else {
					//next position down is full except it is a switch blk
					if (hereIsThis[21] == 'switchBlock') {
						//hereIsThis is a switch block - check if inside is open
						if (!Number.isInteger(hereIsThis[18])) {
							//the switchBlk inside is open Number.isInteger(hereIsThis[17])
							place=true
							xOfnew=blkMatch[1]
							yOfnew=blkMatch[2]
						}
					}else {
					console.log('next position down is full')
				}		
				}
		}	
		}
	
	} else {
		//there is nothing here
		//if (selectedPuzzel[3].includes('Program')) {
		//is there a selected pzl
		if (selectedPuzzel.length != 0) {
			//there is a selected pzl
			if (selectedPuzzel[3].includes('Program :')) {
				//the block to place is a program block - expand the program block
				//get the program name
				const programName = selectedPuzzel[3].split(':')[1]
				//find the program in programs by the name
				const isProgram = (element) => element[1][0] == programName;
				//find the proram by name
				const theProgram = programs.findIndex(isProgram)
				console.log('the found program is '+ theProgram);
				if (theProgram != -1) {
					//a program was found
					//make pzzlpieces (the current list of pzzls on canvs) a copy of the saved program
					pzzlPieces = programs[theProgram][0].slice(0)
					//do not redraw the program block
					place=false
					//adjust canvas height
					const cId = document.getElementById('pzlCanvas')
					const ch = cId.offsetHeight
					//calc the new length of canvas
					var newH = 1000
					//pzzlPieces.forEach(element => console.log('calc new height'+element[13]));
					pzzlPieces.forEach(element => newH = newH + element[13]);
					console.log('new height > '+newH)
					//const newH = ch+1000
					cId.height = newH //+'px'
					//rebuild the main canvas
					restoreAllcanvasPzz()
					}else {
						//no program found
						// what to do ?
					}
				}else {
					//if it is an option blk do not place
					//place the blk at xy
					place=true
					if (selectedPuzzel[21].includes('option')) {place = false}
				}
		}else{
			//there is no selected pzl
		}
	
			
	}//end
	
	if (place==true) {
	//this is the placing -the pzl must be placed	
			pzzlpNo+=1
			//build the new puzzle and store in pzlPieces
			const soManyPzls = pzzlPieces.length
			pzzlPieces[soManyPzls] = selectedPuzzel.slice(0) //make ne pzl
			pzzlPieces[soManyPzls][1] = pzzlpNo //new pzl id
			//mod the pzl x y
			pzzlPieces[soManyPzls][7] = xOfnew
			pzzlPieces[soManyPzls][8] = yOfnew
			const newDrawing=makeDrawingArray(selectedPuzzel[0],xOfnew,yOfnew);
			pzzlPieces[soManyPzls][2] = newDrawing.slice(0)
			//record links to in new pzl
			pzzlPieces[soManyPzls][20] = hereIsThis[1]
			//record links to in parent
			hereIsThis[16+option]= pzzlpNo
			drawPzzl(pzzlPieces[soManyPzls],false,false,pzlCtx)	//already saved, not highlight
			//test if new block is inside switch
			if (blkMatch[4].includes('switch')) {
				//the blkMatch returned - it is a block inside switch - record the link
				hereIsThis[18] = pzzlpNo //link inside top
			}	
			//calc text position X,Y
			const txtX = pzzlPieces[soManyPzls][4]+xOfnew
			const txtY = pzzlPieces[soManyPzls][5]+yOfnew
				
			//increase the canvas size by pzzl height
			const cId = document.getElementById('pzlCanvas')
			const cH = cId.offsetHeight		
			const newH = cH + pzzlPieces[soManyPzls][13] - 50
			cId.height = newH //+'px'
			console.log('pzlCanvas height '+cH+' add '+pzzlPieces[soManyPzls][13])
			//redraw all pzzls after re size
			restoreAllcanvasPzz()
			if (doDeletedUpdate == true) {
				//a pzzl was deleted do the links update
				replaceUpdate(pzzlPieces[soManyPzls])
			}						
		}	
};

function buildMenu() {
	//get list of menu items to build
	var allCanvases = document.getElementsByTagName('canvas');
	
	console.log(allCanvases)
	//cycle through all and build
}

function codingVresult(transcript,confidence) {
	//handles the event voice recognition recieved result
	console.log('at coding voice cmnd handler')
	// if transcrip includes the phrase in the cmnd - continue the run
	//what is the current cmnd
	const nowCmndIndex = executionProgress[1]
	const nowCmnd = cmndSequince[nowCmndIndex]
	const lookFor = nowCmnd[1]
	if (transcript.includes(lookFor)) {
		//the transcript includes the phrase looking for
		executionProgress[1] += 1
		//stop listening
		recognition.stop();
		continueProgram()
	}	
}

function codingVstart() {
	//handles the event voice recognition started
	//diplay the listening icon - in dialog
	const pzlListen = document.getElementById('pzlListening')
	pzlListen.style.display = 'block'
}

function codingVend() {
	//handles the event voice recognition stopped
	//diplay the listening icon - in dialog
	const pzlListen = document.getElementById('pzlListening')
	pzlListen.style.display = 'none'
}

<!-- pzl keyboard key key press handler -->

const msg = document.getElementById('optionInput')

msg.addEventListener("keydown", (event) => {
    // handle keydown
    
});

msg.addEventListener("keypress", (event) => {
    // handle keypress
});

msg.addEventListener("keyup", (event) => {
    // handle keyup
    //console.log('at key up  ??? which key  '+event.keyCode)
    //window.alert("the keyCode  "+event.keyCode)
    if (event.keyCode == 13) {
    	//the keyup was Enter
    	handlePzlInput()
    }
});



<!-- end of pzl keyBoard key handler -->
