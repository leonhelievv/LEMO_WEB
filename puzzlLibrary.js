
function restoreAllcanvasPzz() {
	//restore canvas height to default
	for (let i = 0; i < pzzlPieces.length; i++){
		//do for all pzzlPieces
		//pzlCtx = document.getElementById("pzlCanvas").getContext("2d");	
		drawPzzl(pzzlPieces[i],false,false,pzlCtx)
		var t = pzzlPieces[i][3]	
		if (t == 'OPTION') {
			//the pzzl is an option blk
			t = pzzlPieces[i][15]
		}			
		const txtX = pzzlPieces[i][4]+pzzlPieces[i][7]
		const txtY = pzzlPieces[i][5]+pzzlPieces[i][8]
		var ajustedY = pzzlPieces[i][3].includes('device') ? txtY-20 : txtY
		
		//add motor image		
		if (pzzlPieces[i][3].includes('motor') || pzzlPieces[i][3].includes('device') || pzzlPieces[i][3].includes('light')) {
			//it is a motor blk		
			//get the img and draw
				const pzlImg = pzzlPieces[i][23]
				pzlCtx.drawImage(pzlImg,txtX,ajustedY-20,130,130);
			}				
		addPuzTxt(t,txtX,ajustedY,false,pzlCtx)
			
	} //end of do for all pzzlPieces
}

function drawPzzl(specs,useHighlightClr,savePzl,theCtx) {
	
	var fClr = specs[9]
	const newDrawing = specs[2]
	//test if highligh colour
	if (useHighlightClr) {
		fClr=specs[11]
	}
	
// #path1705
	theCtx.beginPath();
	theCtx.fillStyle = fClr; //'rgb(255, 255, 0)'
	theCtx.strokeStyle = specs[10];

	theCtx.lineWidth = 0.417316;
	theCtx.lineCap = 'butt';
	theCtx.lineJoin = 'miter';
	theCtx.miterLimit = 4;
	
	//this is painting the puzzel onto the canvas
	for (let i = 0; i < newDrawing.length; i++) {	
		if (newDrawing[i][0]=='ctx.moveTo') {
			theCtx.moveTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0]=='ctx.lineTo') {
			theCtx.lineTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0]=='ctx.bezierCurveTo') {
			theCtx.bezierCurveTo(newDrawing[i][1],newDrawing[i][2],newDrawing[i][3],newDrawing[i][4],newDrawing[i][5],newDrawing[i][6]);
		}
	};	
	theCtx.fill();
	theCtx.stroke();

};

function addPuzTxt(t,txtX,txtY,save,theCtx) {	
// #text43239
	theCtx.fillStyle = 'rgb(5, 5, 5)';
	theCtx.lineWidth = 0.446741;
	theCtx.font = "normal normal 24px sans-serif";
	theCtx.fillText(t, txtX, txtY);
	if (save) {
	//save in canvas txt
	//canvasTxt.push([t,pzX,pzY])
	}
};

function addPuzImg(img,X,Y,imgWidth,imgHeight) {
	//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	pzlCtx.drawImage(img, X, Y,imgWidth,imgHeight);
};

function makeDrawingArray(pzp,newX,newY) {
	
	var newDrawing=[]
	//A1 is an array of pzlCtx instructions 
	var A1 = pzp.split(";")	
	//make 2d array
	A2d = []	
	//loop through A1 and populate A2d
	for (let i = 0; i < A1.length; i++) {
		A2d[i]=A1[i].split(",")
		}

	var firstI
	//console.log('test 1 is an array the first part of the instruction')
	firstI = A2d[0][0].split("(")
	//console.log(A2d)
	
	for (let i = 0; i < A2d.length; i++) {

	if (A2d[i][0].includes('ctx.moveTo') || A2d[i][0].includes('ctx.lineTo')) {

//		console.log('test 1 is an array the first part of the instruction')
		var mlTo = A2d[i][0].split("(")
//		console.log(mlTo)

		//make an array of converted values of Instruction
		var newFirstI = [mlTo[0],parseInt(mlTo[1])+newX,parseInt(A2d[i][1])+newY]

		newDrawing.push(newFirstI)
//		console.log(newDrawing)

	}else if (A1[i].includes('ctx.bezierCurveTo')) {
		//make an array of third instruction
		var newBzInstr = []
		//do the first part	
		//console.log('bzI is an array the first part of the bezier instruction')
		var bzI = A2d[i][0].split("(")
		//console.log(bzI)
		newBzInstr[0]=bzI[0]
		newBzInstr[1]=parseInt(bzI[1])+newX
		
		var px = false
		var aJust		
		for (let k = 1; k < A2d[i].length; k++) {
			if (px==true) {
				px=false
				aJust=newX
			}else{
				px=true
				aJust=newY
			}
			newBzInstr.push(parseInt(A2d[i][k])+aJust)
		}
		newDrawing.push(newBzInstr)
	}
}
//console.log('the new drawing instruction array ')
//console.log(newDrawing)
return newDrawing
};

function whatsHereTouch(touchX,touchY) {
	var whatsHere = ['noThing',0]
	for (let i = 0; i < pzzlPieces.length; i++){
		//get the move to x and Y
	var thisPiece = pzzlPieces[i]
	var pzzl_id = thisPiece[1]
	var pzzl_x = thisPiece[7]
	var pzzl_y = thisPiece[8]
	var pzzlWidth = thisPiece[12]
	var pzzlHeight = thisPiece[13]
	//console.log('this pzz is at _x '+pzzl_x+' at y '+pzzl_y)
	
	//test if there is a pzz piece under touch
		//add this: test if next position down is free
		
	if (touchX > pzzl_x && touchX < pzzl_x + pzzlWidth ) {
		//in the x zone , now test if in y zone
		if (touchY > pzzl_y && touchY < pzzl_y + pzzlHeight) {
			console.log('there is a pzl at touch id is no:'+pzzl_id)
			whatsHere = [pzzlPieces[i],i]
			//refine the search for whatsHere - if pzzl is combined (pzzl inside)
			if (!thisPiece[24].includes('no')) {
				//the pzzl may have another inside
				console.log('pzzl may have an inside pzzl')
				if (Number.isInteger(thisPiece[18])) {
					//there is a pzl on the inside
					//get the insidePzl
					const insidePzl = pzzlPieces.find(element => element[1] == thisPiece[18]);
					//get insidePzl X and Y
					const insideY = insidePzl[8]
					const insideHeight = insidePzl[12]					
					//was the touch on the inside pzl?				
					if (touchY > insideY && touchY < insideY + insideHeight) {
					//the touch was on the inside puzzel 
					console.log('touch was on inside pzzl')
					whatsHere = [insidePzl,thisPiece[18]]
					break
					}else {
					//found the pzzl at touch
					break
					}
				}
			}			
			
		}	
	}	
	
	}
	return whatsHere
};

function matchLemoBlock(hereIsThis,touchX,touchY) {
	var draw=false
	var xOfnew=0
	var yOfnew=0
	var option=0
	const hereIs = hereIsThis[21]
	const newPzzl = selectedPuzzel[21]
	const pzlX = hereIsThis[7]
	const pzlY = hereIsThis[8]
	const pzlWidth = hereIsThis[12]	
	var xAjust = hereIs == 'switchBlock' ? switchBlkOffset[2] : 0 //hereIs is a switchbLK ajust the x positioning for wider block
	var pzlPosition = 'none'
	
	if (hereIs == 'motorBlock') {
		if (newPzzl.includes('option')) {			
			//was the click in the options zone X band
//			if (touchX > pzlX + pzlWidth / 2 && touchX < pzlX + pzlWidth) {
			const halfWidth = pzlWidth / 2
			if (touchX > pzlX + halfWidth && touchX < pzlX + pzlWidth+halfWidth) {
				xOfnew=pzlX+mblkOpOffsets[0]
				//in which y band
				if (touchY > pzlY + mblkOpOffsets[1] && touchY < pzlY + mblkOpOffsets[2]) {
					console.log('it is a motor block touch is in option 1')
					draw=true					
					yOfnew=pzlY+mblkOptionsY[0]
					//record dialog text
					selectedPuzzel[14]=hereIsThis[1]+' Mblock option 1'
					option=1									
				}else if (touchY > pzlY + mblkOpOffsets[2] && touchY < pzlY + mblkOpOffsets[3]) {
					console.log('it is a motor block touch is in option 2')
					draw=true
					yOfnew=pzlY+mblkOptionsY[1]
					//record dialog text
					selectedPuzzel[14]=hereIsThis[1]+' Mblock option 2'
					option=2		
				}else if (touchY > pzlY + mblkOpOffsets[3] && touchY < pzlY + mblkOpOffsets[4]) {
					console.log('it is a motor block touch is in option 3')
					draw=true
					yOfnew=pzlY+mblkOptionsY[2]
					//record dialog text
					selectedPuzzel[14]=hereIsThis[1]+' Mblock option 3'
					option=3		
				}
			}else {
				//only for test - not in x zone
				console.log('not in X zone')
			}			
		}else {
		//any block will fit onto motorBlk
			draw=true
			const xReset = newPzzl.includes('switch') == true ? switchBlkOffset[2] : 0 //hereIs is a switchbLK ajust the x positioning for wider block
			xOfnew = hereIsThis[7] - xReset
			yOfnew = hereIsThis[8] + hereIsThis[13]-linkAjust
			
		}
	}else if (hereIs.includes('delay') && newPzzl.includes('option')) {
		//link the option onto delay block
		xOfnew=pzlX + delayBlkOffset[0]
		yOfnew=pzlY + delayBlkOffset[1]
		draw=true
		option=1	
	
	}else if (hereIs.includes('sensor') && newPzzl.includes('option')) {
		//link the option onto sensor block
		xOfnew=pzlX + delayBlkOffset[0]
		yOfnew=pzlY + delayBlkOffset[1]
		draw=true
		option=1	
		
	}else if (hereIs.includes('name') && newPzzl.includes('option')) {
		//link the option onto name block
		xOfnew=pzlX + delayBlkOffset[0]
		yOfnew=pzlY + delayBlkOffset[1]
		draw=true
		option=1	
	
	}else if (newPzzl.includes('switch') || hereIs.includes('switch')) {
		//if the newPzl is 'switch' 
		if (newPzzl.includes('switch')) {
			//newPzll is switch
			xOfnew = pzlX + switchBlkOffset[0]
			yOfnew = pzlY + switchBlkOffset[1]
		}
		if (hereIs.includes('switch')) {
			//hereIs pzl is switch - test zone touch - place inside or at bottom
			//touchY > pzlY + mblkOpOffsets[2] && touchY < pzlY + mblkOpOffsets[3])
			const z1 = pzlY + hereIsThis[13] / 2
			if (touchY > pzlY && touchY < z1) {
				//the touch was in zone 1
				if (touchX > pzlX + pzlWidth * switchBlkOffset[4] && newPzzl.includes('option')) {
					//the touch was in the option zone and the new to place is option
					console.log('switch touched in zone 1')
					xOfnew = pzlX + switchBlkOffset[5]
					yOfnew = pzlY + switchBlkOffset[6]
					draw=true
					option = 1
				}else {				
				//ajust placement for inside - use switchPzl offsets			
				xOfnew = pzlX + switchBlkOffset[2]
				yOfnew = pzlY + switchBlkOffset[3]
				draw=true
				//at this point we know that this new pzzl goes on inside of switch
				pzlPosition = 'switch,inside'
				}
			} else {
				//the touch was in zone 2 - place at bottom				
				if (!newPzzl.includes('switch')) {
					// it is not a switch on switch link
					xOfnew = hereIsThis[7] + xAjust
					yOfnew = hereIsThis[8] + hereIsThis[13]-linkAjust
					draw=true
				}else {
					//it is switch on switch link
					xOfnew = hereIsThis[7]
					yOfnew = hereIsThis[8] + hereIsThis[13]-linkAjust
					draw=true
			}
				
			}
		}

	}else{
		//any block will fit onto start - not start
		if (hereIs=='beginBlock' && newPzzl=='beginBlock') {
			console.log('begin block cant go onto begin block ',hereIs)
			draw=false
		}else {
			draw=true
			xOfnew = hereIsThis[7] + xAjust
			yOfnew = hereIsThis[8] + hereIsThis[13]-linkAjust
			console.log('any block will fit onto start ',hereIs)
		}
	}
	
	return [draw,xOfnew,yOfnew,option,pzlPosition]
};

function restoreCanvasTxt() {
	for (let i = 0; i < canvasTxt.length; i++){
		ctx.fillStyle = 'rgb(5, 5, 5)';
		ctx.lineWidth = 0.446741;
		ctx.font = "normal normal 18px sans-serif";
		ctx.fillText(canvasTxt[i][0], canvasTxt[i][1], canvasTxt[i][2]);
	}
};

function deleteProgram() {
	//clear the canvas by setting back to original size - will clear canvas
	document.getElementById('pzlCanvas').height = 1000	
	//document.getElementById('pzlCanvas').width = 1000	
	//insertCanvas()
	//delete the current puzzels in pzzlPieces
	pzzlPieces=[]
	//the X Y touch has reverted to default
	//also close dialog
	document.getElementById('pzlDialog').style.display = 'none'
	document.getElementById('listOfOptions').style.display = 'none'
	//also delete user created buttons - clear <ul id=switchButtonList>
	const userBtns = document.getElementById('switchButtonList')
	userBtns.innerHTML = ''
	buttonCount = 0
}

function makeOptionsList(theList) {
	const listContainer = document.getElementById('listOfOptions')
	//make the list empty
	while (listContainer.firstChild) {
    listContainer.removeChild(listContainer.firstChild);
	}
	var item
	for (let i = 0; i < theList.length; i++){
		entry = theList[i][0]
		item = '<li>'+entry+'</li>'
		listContainer.insertAdjacentHTML('afterbegin', item);
	}
	listContainer.style.display = 'block'
}

function coding_respons_handler(respons) { // (respons_list)
	console.log('respons received for coding ' +respons)
	if (respons.includes('sensor') && codingWaitRespons[0] == true) {
		//it is a sensor respons - continue program
		continueProgram()
	}else if (respons.includes('rest') && codingWaitRespons[0] == true) {
		//it is a stepper rest respons
		if (respons[0].includes(codingWaitRespons[1])) {
			//the one waiting for is the same as respons
			continueProgram()
		}
	}
}

var buttonCount = 0
//var img = "url('start.png')"
function makeBtn(pzlInside,nextCmnd) {
  //create userbutton elements in the <ul> element
  	var img = "url('start.png')"
  	const swName = nextCmnd[1]
  	const ubId = swName+'/'+pzlInside
  	
	//make minimal <l1> element with id with button and text - add other by code
	const newBtnHtml = '<li id="bli'+ubId+'"> <button id="'+ubId+'"></button><p id="btnTxt'+ubId+'"></p></li>'
	const pzlButtons = document.getElementById('switchButtonList')
	pzlButtons.insertAdjacentHTML('beforeend', newBtnHtml);
	//get button element
	const nBli = document.getElementById('bli'+ubId)
	const nBbutton = document.getElementById(ubId)
	const nBtxt = document.getElementById('btnTxt'+ubId)
	//ajust style
	nBli.style.paddingBottom = 40+'px'
	nBtxt.style.fontSize = 28+'px'
	nBbutton.style.width = 100+'px'
	nBbutton.style.height =100+'px'
	nBbutton.style.backgroundImage = img
	nBbutton.style.backgroundSize = 'cover'
	nBtxt.innerText = swName

//	const newPzlButton = '<li style="padding-bottom: 40%"><button id="'+
//	ubId+'" style="font-size: 40px;width:100px;height: 100px;background-image: '+
//	img+';background-size: cover;"></button></li>'
	
	//add button name - <p style="font-size: 24px"> Save <p/><p style="font-size: 24px">Program</p>
	
//	const pzlButtons = document.getElementById('switchButtonList')
//	pzlButtons.insertAdjacentHTML('beforeend', newPzlButton);
	//assign eventlisteners
	document.getElementById(ubId).addEventListener("click", function() {
  	userButtonHandler(ubId);
	});
	//increment the button count
	buttonCount+=1
}

function userButtonHandler(theInsidePzl) {
	//get userButton ID that was touched
	const btIdSt = theInsidePzl.split('/')[1]
	const btId = parseInt(btIdSt)
	//get the pzl on the inside of switchpzl
	const foundPzl = pzzlPieces.find(element => element[1] == btId);
	//get the device name from the pzl that is on insid
	const dvStr = foundPzl[3]	
	const deviceName = dvStr.split(':')[1].replace('/','') //S1/
	//get the current cmnd in the device cmnd buffer
	var cmnd = deviceCmndBuffer.find(element => element[0] == deviceName)[1]
	//change the img of the button
	const theBtn = document.getElementById(theInsidePzl)
	const theImg = theBtn.style.backgroundImage
	//test and change the img url of background
	if (theImg.includes('start')) {
		//the img url is start
		//change url to stop
		theBtn.style.backgroundImage = "url('stop.png')"
		//send to webSocet cmnd
		websocket.send(cmnd);
	}else {
		//the img url is stop
		//change url to start
		theBtn.style.backgroundImage = "url('start.png')"
		//send to webSocet cmnd
		cmnd = ':'+deviceName+'/'+currentPlay+'/199/;'
		websocket.send(cmnd);
	}
};


function drawSymbol(specs) {
	const newDrawing = specs[0]
	const fClr = specs[1]
	const sClr = specs[2]
	
// #path1705
	pzlCtx.beginPath();
	pzlCtx.fillStyle = fClr; //'rgb(255, 255, 0)'
	pzlCtx.strokeStyle = sClr

	pzlCtx.lineWidth = 0.417316;
	pzlCtx.lineCap = 'butt';
	pzlCtx.lineJoin = 'miter';
	pzlCtx.miterLimit = 4;
	
	//this is painting the puzzel onto the canvas
	for (let i = 0; i < newDrawing.length; i++) {	
		if (newDrawing[i][0]=='ctx.moveTo') {
			pzlCtx.moveTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0]=='ctx.lineTo') {
			pzlCtx.lineTo(newDrawing[i][1],newDrawing[i][2]);
		}else if (newDrawing[i][0]=='ctx.bezierCurveTo') {
			pzlCtx.bezierCurveTo(newDrawing[i][1],newDrawing[i][2],newDrawing[i][3],newDrawing[i][4],newDrawing[i][5],newDrawing[i][6]);
		}
	};	
	pzlCtx.fill();
	pzlCtx.stroke();
};

function testDs() {
	const drawing = makeDrawingArray(redX,100,100)
	ctx = document.getElementById("canvas").getContext("2d");
	const specs = [drawing,'rgb(207, 14, 0)','rgb(112, 22, 16)']
	drawSymbol(specs)
}

