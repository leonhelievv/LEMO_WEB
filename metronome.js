
var mNomeT
var mNomeSpd

function initMnome() {
console.log('at init Metronome')
//cleanup nav
	navPlay.style.display='none';
	//init spin UI
	play.style.display='block';
	currentPlay='LEMO Metronome';
	//title.innerHTML=currentPlay;
	title.innerText = currentPlay;
	playImg.src='metronome.png';
	motorsDisplay(99) 
	motorsDisplay(4)
	MotorArea.style.display='block';
	
	R1.src='start.png'
	R1.style.display='block'
	R1.addEventListener('click',mNomeStartStop)
	
	spd.min="100";
	spd.max="1000";
	spd.value="250";
	spd.addEventListener('click',mNomeSpeed);
	sliderArea.style.display='block';	
};

function mNomeCleanup() {
	console.log('at metronome cleanup');
	R1.removeEventListener('click',mNomeStartStop)
	//remove stuff
	sliderArea.style.display = 'none'
	//restore motors
	appCmndToLemo(':FA/'+currentPlay+'/199/;');
	appCmndToLemo(':FB/'+currentPlay+'/199/;');
	free_F_motors(currentPlay);
	motorsDisplay(99)
	clearTimeout(mNomeT);
};

function mNomeStartStop() {
	var mNomeP1 = ':'+deviceSelected+'/'+title.innerHTML+'/';
	var mNomeCmnd='424/'
	mNomeSpd=scale(spd.value, 100, 1000, 1000, 100)
	var mNomeEnd='/;'
	if (R1.src.includes('start')) {
		appCmndToLemo(mNomeP1+mNomeCmnd+mNomeSpd+mNomeEnd)
		R1.src='stop.png'
		playImg.src='mNomeL.png'
		mNomeT=setTimeout(mNomeSwing, mNomeSpd)
	}else {
		appCmndToLemo(mNomeP1+'199/;')
		R1.src='start.png'
		clearTimeout(mNomeT);
	}
	
};

function mNome_respons_handler(respons) {
	console.log('at metronome respons handler');
	if (respons[3]==9) {
		//it is pulsing - display the stop
		R1.src='stop.png'
		playImg.src='mNomeL.png'
		//ask for the pulse rate set MNomeSpd
			appCmndToLemo(':'+deviceSelected+'/'+title.innerHTML+'/302/;')	
				
	}else if (respons[3]==5) {
		clearTimeout(mNomeT);
		R1.src='start.png'
		playImg.src='metronome.png'
	}else if (respons[3]==2) {
		//the motor is turning present stop
		R1.src='stop.png'
	}else if (respons[2]=='mNome_delay') {
		clearTimeout(mNomeT);
		mNomeSpd=parseInt(respons[3])
		//mNomeSpd=scale(mNomeSpd, 1000, 100, 100, 1000)
		mNomeT=setTimeout(mNomeSwing, mNomeSpd);
		R1.src='stop.png'
		playImg.src='mNomeL.png'		
		}
};

function mNomeSpeed() {	
	if (deviceSelected != '') {
		console.log('at metronome speed - device selected');
		
		if (R1.src.includes('stop')) {
			var mNomeP1 = ':'+deviceSelected+'/'+title.innerHTML+'/';
			var mNomeCmnd='424/'
			var mNomeEnd='/;'		
			console.log('input > '+mNomeSpd)
			mNomeSpd=scale(spd.value, 100, 1000, 1000, 100)
			console.log('2 the mapped value > '+mNomeSpd)
			//send new cmnd
			appCmndToLemo(mNomeP1+mNomeCmnd+mNomeSpd+mNomeEnd)
		}else{
			// do nothing
		}
	}else{
		console.log('at metronome speed no device');
	}
};

function mNomeSwing() {
	if (playImg.src.includes('/mNomeL')) {
		playImg.src='mNomeR.png'
	}else{
		playImg.src='mNomeL.png'
	}
	mNomeT=setTimeout(mNomeSwing, mNomeSpd);
};

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function mNomeMotorHandler() {
	console.log('at mNome motor handler')
	//
};


