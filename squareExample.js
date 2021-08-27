

function initCoding() {
console.log('at init coding')
//cleanup nav
	navPlay.style.display='none';
	//init spin UI
	document.getElementById('play').style.display='block';
	currentPlay='LEMO Coding';
	document.getElementById('title').innerHTML=currentPlay;
	buildCallOut()
	instruct = document.getElementById('instruct')
	instruct.innerText='??????.';
	instruct.style.backgroundColor='#0eeb49'
	L1.src='coding.png'
	L1.style.display='block'
	
	//leave only play canvas
	clkwArea.parentNode.removeChild(clkwArea);
	playIcon.parentNode.removeChild(playIcon);
	playCanvas.style.display='block'
	
	//test draw puzzel
	var mType = 'rgb(0, 150, 203)'
  	var mText=['Blue','motor','1'] 
 	pzzMstart(mType,mText)
 	//pzzMstart('rgb(0, 150, 203)',['Blue','motor','1'])
 	
	
}

function codingCleanup() {
	console.log('at coding cleanup');
	free_S_motors(currentPlay);
	//restore motors
	motorsDisplay(99)
	
	initNav();	
};


function pzzMstart(mType,mText) {
	
   var ctx = document.getElementById("playCanvas").getContext("2d");
// #layer1
	ctx.save();
	//ctx.transform(1, 0, 0, 1, -76.332700, -149.268000);
	
// #path89259
	ctx.beginPath();
	ctx.strokeStyle = 'rgb(0, 1, 0)';
	ctx.lineWidth = 5;
	ctx.lineCap = 'butt';
	ctx.lineJoin = 'miter';
	ctx.miterLimit = 4;
	//vertical to the right
	ctx.moveTo(280,1);
	ctx.lineTo(280,150);
	//vertical to the left
	ctx.moveTo(5,1);
	ctx.lineTo(5,150);
	//horizontal top
	ctx.moveTo(5,1);
	ctx.lineTo(280,1);
	//horizontal bottom
	ctx.moveTo(5,150);
	ctx.lineTo(280,150);
	ctx.stroke();
	ctx.restore();
	
// #text80762
	ctx.save();
	//ctx.transform(1.011090, 0.000000, 0.000000, 0.989035, 0.000000, 0.000000);
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.lineWidth = 0.054219;
	ctx.font = "normal normal 20px sans-serif";
	ctx.fillText(mText[0], 100, 20);
	ctx.fillText(mText[1], 100, 40);
	ctx.fillText(mText[2], 100, 60);
	ctx.restore();
	//ctx.restore();
};

 	
 	