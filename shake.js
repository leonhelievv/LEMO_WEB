
var shakeTime;

function initShake() {
console.log('at init Shake')
//cleanup nav
	navPlay.style.display='none';
	//init spin UI
	document.getElementById('play').style.display='block';
	currentPlay='LEMO Shake';
	document.getElementById('title').innerHTML=currentPlay;
	playImg.src='LEMOMan.png';
	
	R1.src='start.png'
	R1.style.display='block'
	R1.addEventListener('click',shakeStartStop)
	
	motorsDisplay(99) 
	motorsDisplay(4) 	
}

function shakeCleanup() {
	console.log('at shake cleanup');	
	//restore motors
	motorsDisplay(99)
	appCmndToLemo(':FA/'+currentPlay+'/199/;');
	appCmndToLemo(':FB/'+currentPlay+'/199/;');
	free_F_motors(currentPlay);
	clearTimeout(shakeTime);
	R1.removeEventListener('click',shakeStartStop)	
};

function shakeMotorHandler(device) {
	console.log('at shake motor select handler')
	
};

function shake_respons_handler(respons) {
	if (respons[3]==7) {
		if (playImg.src.includes('/LEMOMan.png')) {
		playImg.src='shakeLeft.png'
		shakeTime=setTimeout(shakeIcon, 100)
		R1.src='stop.png'
	}	
	}else if (respons[3]==5) {
		clearTimeout(shakeTime);
		R1.src='start.png'
		playImg.src='LEMOMan.png'
		}
};

function shakeIcon() {
	if (playImg.src.includes('Left')) {
		playImg.src='shakeRight.png'
	}else{
		playImg.src='shakeLeft.png'
	}
	//shakeTime=window.setTimeout(shakeIcon, 200);
	shakeTime=setTimeout(shakeIcon, 100);
};

function shakeStartStop() {
	if (R1.src.includes('start')) {
	appCmndToLemo(':'+deviceSelected+'/'+currentPlay+'/102/;');
	R1.src='stop.png'
	playImg.src='shakeLeft.png'
	shakeTime=setTimeout(shakeIcon, 100)
}else{
	appCmndToLemo(':'+deviceSelected+'/'+currentPlay+'/199/;');
	R1.src='start.png'
	clearTimeout(shakeTime);
	playImg.src='LEMOMan.png'
}
};



