function initKnockOff() {
console.log('at init knock off')
//cleanup nav
	navPlay.style.display='none';
	//init spin UI
	play.style.display='block';
	clkwArea.style.display='none';
	currentPlay='LEMO knock off';
	title.innerHTML=currentPlay;
	playImg.src='knock_off.png';	
	//buildCallOut()
	callOut.style.display = 'block'
	instruct.innerText='??????.';
	instruct.style.backgroundColor='#0eeb49'
}

function knockOffCleanup() {
	console.log('at knock off cleanup');
	free_S_motors(currentPlay);
	//restore motors
	motorsDisplay(99)
	//remove the instruction area
	//var co = document.getElementById('callOut')
	//L1.removeEventListener('click',)	
	//co.remove();
	callOut.style.display = 'none'
	initNav();	
};

