//init the menu

var optionsMenu = [] //this is the reult of running through the menuItemsSpecs list 

function initMenu() {
	var first = true
	var optionsMenuIndex = 0
	var menuItemId
	var prevMenuId
	var entryPoint
	var drawTmpl
	var drawing
	//do for all in list menuItemsSpecs
	for (let i = 0; i < menuItemsSpecs.length; i++){	
	var thisMenuSpec = menuItemsSpecs[i]
	//get the menu template from specs
	var theMenuItem = thisMenuSpec[1].slice(0)
	//remember the menu id
	prevMenuId = menuItemId
	//get the menu ID from spec
	menuItemId = thisMenuSpec[0]
	//customise the theMenu Item 
	theMenuItem[1] = menuItemId //the id used to find this meneu item
	theMenuItem[3] = thisMenuSpec[3] //display txt
	theMenuItem[9] = thisMenuSpec[4] //fill clr
	theMenuItem[10] = thisMenuSpec[5] //line clr
	theMenuItem[14] = thisMenuSpec[7] //dialog txt
	theMenuItem[26] = thisMenuSpec[0] //pzl Type
	theMenuItem[23] = thisMenuSpec[8] //image file
	//save in optionsMenu
	optionsMenu[optionsMenuIndex] = theMenuItem
	optionsMenuIndex = optionsMenu.length
	//create new canvas
	//if first menu item (the list.length is 1) use default insert point
	var htmlString = '<canvas id='+menuItemId+' width="300" height="300"></canvas>'
	if (optionsMenu.length == 1) {
		//it is the first menu item - the first canvas to be created
		entryPoint = document.getElementById('optionBlks');
		entryPoint.insertAdjacentHTML('afterbegin', htmlString);			
	}else{
		//it is not the first menu item - use the ID of the previous one
		entryPoint = document.getElementById(prevMenuId);
		entryPoint.insertAdjacentHTML('afterend', htmlString);
	}
	
	//make the menu option
   var menuOp = document.getElementById(menuItemId);
   //make drawing array from template - use the template name in spec
   drawTmpl =  thisMenuSpec[2]
   drawing = makeDrawingArray(drawTmpl,1,1);
   theMenuItem[2] = drawing
  	//draw the menu item on its canvas
  	var menuCtx = document.getElementById(menuItemId).getContext("2d");
	drawPzzl(theMenuItem,false,false,menuCtx)
	menuOp.addEventListener('touchstart',pzOptionHandler)//,{passive: true})
	
	//add pzl imgage		
//	if (thisMenuSpec[0].includes('motor') || thisMenuSpec[3].includes('device') || thisMenuSpec[0].includes('lights')) {
	if (typeof thisMenuSpec[8] === 'object') {
		//pzl has an image file
		//get the img file name
		const pzlImg = thisMenuSpec[8]
		//var img = document.createElement('img');
		//var img = document.getElementById('pzlImg');
		//ajust the placement
		var imgY = thisMenuSpec[3].includes('device') ? 50 : 120
		//img.src = motorImg
		//img.onload = function () {
		//	console.log('image has loaded')}
		//menuCtx.drawImage(img, 10, imgY,130,130);
		menuCtx.drawImage(pzlImg, 10, imgY,130,130);
	}			
	//add the text
	addPuzTxt(theMenuItem[3],theMenuItem[4],theMenuItem[5],false,menuCtx);		
}
};


function findMenuItem(id) {
	menuItemIndex = 'none'
	for (let i = 0; i < optionsMenu.length; i++){
		//look for id
		if (optionsMenu[i][1] == id) {
			//the id is a match
			menuItemIndex=i
			break
		}
	}	
	return menuItemIndex
};


function addProgramPuzzel(program) {
	//make new array from template
	const programPuzzel = startStopBlkTemplate.slice(0)
	//find last item in optionsMenu - get last item in optionsMenui - get [0] of lastItem
	const thisIndex = optionsMenu.length
	const lastIndex = optionsMenu.length-1
	const lastId = optionsMenu[lastIndex][1]
		
	//make the drawing
	programPuzzel[2] = makeDrawingArray(startStopBlkTemplate[0],1,1);
	//custimise - name colour
	programPuzzel[1] = 'SP'+thisIndex //the id used to find this meneu item
	programPuzzel[3] = 'Program :'+program //display txt
	programPuzzel[9] =  'rgb(245, 152, 198)'//fill clr
	programPuzzel[10] =  'rgb(128, 83, 105)'//line clr
	programPuzzel[21] =  'savedProgram'
	
	//string to insert in menu list
	var htmlString = '<canvas id='+'SP'+thisIndex+' width="300" height="300"></canvas>'
	//get insertion point
	entryPoint = document.getElementById(lastId);
	//insert html
	entryPoint.insertAdjacentHTML('afterend', htmlString);	
	//make the menu option
	menuCtx = document.getElementById('SP'+thisIndex).getContext("2d");
   var menuOp=document.getElementById('SP'+thisIndex);  
  	//draw the menu item on its canvas
	drawPzzl(programPuzzel,false,false,menuCtx)
	menuOp.addEventListener('touchstart',pzOptionHandler)//,{passive: true})
	//add the text
	addPuzTxt(programPuzzel[3],programPuzzel[4],programPuzzel[5],false,menuCtx);
	//save the program puzzel in optionsMenu
	optionsMenu[lastIndex+1] = programPuzzel
	//the puzzels and the cmndSeq is in the programs Array - use the program name to find
	
}

function clearMenu() {
	var x = document.getElementById("optionBlks").childElementCount;
	var codeMenu = document.getElementById("optionBlks");
	while (codeMenu.firstChild) {
    codeMenu.removeChild(codeMenu.firstChild);
	}

}