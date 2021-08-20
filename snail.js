
var snailT
var snailX= 200
var snailLeft = true
var snailImg = 'snail_left.png'
var garlicImg = 'garlic.png'
var glicX=120
var glicY=60
var glicDrag = false
const Sny=40
const sHeight=60
const gWidth=40
const gHeight=30
var restorePlayArea
var glicPos
var deviceIsmobile=true

function initSnail() {

//cleanup nav
	navPlay.style.display='none';
	//init spin UI
	document.getElementById('play').style.display='block';
	currentPlay='LEMO Snail';
	document.getElementById('title').innerHTML=currentPlay	
	motorsDisplay(99)
	//remove Left and right
	//copy and remember html for left and right
	restorePlayArea=play.innerHTML	
	playL.parentNode.removeChild(playL);
	playR.parentNode.removeChild(playR);
	//format iconArea - for canvas
	iconArea.style.height=lemoW+'px'
	iconArea.style.width=lemoW+'px'
	
	//build a canvas, 2 img snail and garlic
	//<canvas id="snailCanvas" name="snail" style="display: none;"></canvas>
	iconArea.innerHTML='<canvas id="snailCanvas" name="snail" style="display: block; width: 100%; height: 100%"></canvas>'
	
	//is the device a mobile
	deviceIsMobile = isMobileDevice()
	//document.getElementById('debug').innerText=' mobile ? '+deviceIsMobile
	
	if (!deviceIsMobile) {	
	//set eventlistener for canvas
	snailCanvas.addEventListener('mousedown',glicDown)
	snailCanvas.addEventListener('mousemove',glicMove)
	snailCanvas.addEventListener('mouseup',glicUp)
	}else {
	snailCanvas.addEventListener('touchstart',glicDown)
	snailCanvas.addEventListener('touchmove',glicMove)
	snailCanvas.addEventListener('touchend',glicUp)
	}
	
};

function snailCleanup() {
	//console.log('at snail cleanup');
	clearTimeout(snailT);
	//clear eventlistener for canvas
	if (!deviceIsMobile) {
	snailCanvas.removeEventListener('mousedown',glicDown)
	snailCanvas.removeEventListener('mousemove',glicMove)
	snailCanvas.removeEventListener('mouseup',glicUp)
	}else {
	snailCanvas.removeEventListener('touchstart',glicDown)
	snailCanvas.removeEventListener('touchmove',glicMove)
	snailCanvas.removeEventListener('touchend',glicUp)
	}
	
	//restore play area
	play.innerHTML=restorePlayArea
	globalVars()	
	document.getElementById('toyBox').addEventListener('click',exitHandler);  
	//stop motors
	websocket.send(':FA/'+currentPlay+'/199/;');
	websocket.send(':FB/'+currentPlay+'/199/;');
	free_F_motors(currentPlay);
	free_S_motors(currentPlay);
	motorsDisplay(99)
	title.innerText='LEMO'
	getWindowSize()
};

function snail_respons_handler(respons) {
	//console.log('at snail respons handler');
	
};

function snailMotorHandler() {
	//console.log('at snail motor handler')
	//
};

function snailReBuild() {
	//var cw = document.getElementById('IconArea').style.width.replace(/px$/, '')	
	//console.log('at snail canvas re build - snail Canvas width '+cw)
	var snailCanvas = document.getElementById('snailCanvas')
	var ctx = snailCanvas.getContext('2d');
	var snail = new Image();
	var gImg = new Image();
  	snail.src = snailImg;
  	gImg.src = garlicImg;
  	ctx.clearRect(0, 0, snailCanvas.width, snailCanvas.height);
  	//the source
  	const sx=1
  	const sy=1
  	const sourceWidth=269
  	const sourceHeight=280

  	//the destination
  	const Snx=snailX
  	var sWidth=80
  	
   ctx.drawImage(snail,sx,sy,sourceWidth,sourceHeight,Snx,Sny,sWidth,sHeight);
   
  	ctx.drawImage(gImg,glicX,glicY,gWidth,gHeight);	
};

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};


function snailMotorHandler(device) {
	//console.log('at snail motor select handler')
	//do snail walk with this motor
	//start snail timer
	clearTimeout(snailT);
	snailT=setTimeout(doSnailT, 200)
};

function doSnailT() {
	//if at left border or right border range 1 to 200
	var cmnd = 0
	var cmndEnd='/;'
	if (deviceSelected.includes('S')) {
			cmnd+=200
			cmndEnd='/400/;'			
		}else{
	}
	if (snailX==1 || snailX==200) {					
	if (snailX==1) {
		//turn around and increment
		cmnd+=1
		snailLeft=false
		snailImg='snail_right.png'
		websocket.send(':'+deviceSelected+'/'+currentPlay+'/'+cmnd+'/5'+cmndEnd);	
	}else if (snailX==200) {
		//turnaround and decrement
		snailLeft=true
		snailImg='snail_left.png'
		websocket.send(':'+deviceSelected+'/'+currentPlay+'/'+cmnd+'/5'+cmndEnd);
	}
	}
	//test if garlic in snail path
	if (glicY>Sny+sHeight || glicY+gHeight<Sny) {
	//outside crash zone
	}else {
	//in crash zone  - test if snail is at garlic
	cmnd = 0
	cmndEnd='/;'
	if (deviceSelected.includes('S')) {
			cmnd+=200
			cmndEnd='/400/;'			
	}
	if (snailLeft) {
		if (glicX < snailX) {
			const d1 = glicX+20
			if (d1 >= snailX) {
//				console.log('crash going left snailx '+snailX+' garlicX+20  '+glicX)
				//turn around go right
				snailImg='snail_right.png'
				cmnd+=1
				snailLeft=false
				websocket.send(':'+deviceSelected+'/'+currentPlay+'/'+cmnd+'/5'+cmndEnd);	
			}
		}
	}else {
		if (glicX>snailX){
			const d2 = snailX+60			
			if (glicX-d2 < 5) {
//				console.log('crash going right')
				//turn around go left
				snailLeft=true
				snailImg='snail_left.png'
				websocket.send(':'+deviceSelected+'/'+currentPlay+'/'+cmnd+'/5'+cmndEnd);
			}
		}
	}
		
	}
	if (snailLeft == true) {
		snailX-=1
	}else{
		snailX+=1
	}
	clearTimeout(snailT);
	snailT=setTimeout(doSnailT, 200)
	//re draw snail
	snailReBuild()
	//garlicReBuild()
};

function glicDown(xyStart) {
	//console.log('at glic Down offset X '+xyMove.offsetX+' Y '+xyMove.offsetY)
	glicDrag=true
	
	//test touch
	const cw = parseInt(document.getElementById('IconArea').style.width.replace(/px$/, ''))
	const ch = parseInt(document.getElementById('IconArea').style.height.replace(/px$/, ''))	
	
	if (deviceIsMobile) {
	glicPos = xyStart.changedTouches[0]
	const x = Math.trunc(glicPos.clientX)
	const y = Math.trunc(glicPos.clientY)
	 
	glicX = Math.trunc(scale(x,70,896,1,240))
	glicY = Math.trunc(scale(y,427,1300,1,120))
	
	//glicX = Math.trunc(scale(x,100,cw,1,240))
	//glicY = Math.trunc(scale(y,314,cw,1,120))
		  
	//document.getElementById('debug').innerText='start X '+Math.trunc(glicPos.clientX)+' Y '+Math.trunc(glicPos.clientY)+' icon area width '+cw+ ' height '+ch+' lemoW '+lemoW
	}
	//prevent default
	xyStart.preventDefault();	
};
	
function glicMove(xyMove) {
	const cw = parseInt(document.getElementById('IconArea').style.width.replace(/px$/, ''))
	if (glicDrag==true) {
		if (!deviceIsMobile) {
			//device is not mobile		
			const X=xyMove.offsetX
			const Y=xyMove.offsetY
			glicX = Math.trunc(scale(X,32,cw,1,240))
  			glicY = Math.trunc(scale(Y,32,cw,1,120))	
  			//console.log('at glic Move glic X '+glicX+' Y '+glicY+' canvas Width '+cw)
  	
  	//test touch 
	//const client = xyMove.changedTouches[0]  
	//const client = xyTouch.changedTouches[0]  
	//document.getElementById('debug').innerText='move X '+Math.trunc(client.clientX)+' Y '+Math.trunc(client.clientY)
  	//document.getElementById('debug').innerText='move '
  	
  	}else{
  	//device is mobile
	glicPos = xyMove.changedTouches[0]
	}
}
	//prevent default
  	xyMove.preventDefault();	
};

function glicUp(xyEnd) {
	//console.log('at glic Up')
	glicDrag=false
	snailReBuild()
	//garlicReBuild()
	//document.getElementById('debug').innerText='end '
	
	if (deviceIsMobile) {
		//test end
	glicPos = xyEnd.changedTouches[0]
	}
	 
	//document.getElementById('debug').innerText='end X '+Math.trunc(glicPos.clientX)+' Y '+Math.trunc(glicPos.clientY)
	xyEnd.preventDefault();
};
	
