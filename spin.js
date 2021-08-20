
function initSpin() {
	
//var elem = document.getElementById("LEMO");
//openFullscreen(elem)	
		
	//cleanup nav
	navPlay.style.display='none';
	//init spin UI
	play.style.display='block';
	playIcon.style.display='block';
	currentPlay='LEMO Spin';
	title.innerHTML='LEMO Spin';
	playImg.src='spin.png';
		
	sliderArea.style.display='block';
	R1.src='start.png';
	R1.addEventListener('click',doSpin);
	R1.style.display='block'; 
	R2.src='not_listenning.png';
	R2.style.display='block';
	R2.addEventListener('click',R2TouchDown); //voice recognition
	L2.src='help_voice_off.png';		
	L2.addEventListener('click',spinHelp);
	L2.style.display='block';
	//buildClkwArea();
	clkw.src='clkw.png';
	clkw.addEventListener('click',doSpinClkw);
	clkw.style.display='block';
	toyBox.addEventListener('click',spinCleanup);
	spd.addEventListener('click',doSpinSlider);
	motors.style.display='block';
	motorsDisplay(99);
	console.log('done initSpin ');	
	};
	
	function spinCleanup() {
	console.log('at just step cleanup');
  	sliderArea.style.display='none';
	//clkw.style.display='none';
	clkw.remove();
	clkw.removeEventListener('click',doSpinClkw);
	L1.style.display='none';
	L2.style.display='none';
	L2.removeEventListener('click',spinHelp);
	L3.style.display='none';
	R1.style.display='none';
	R1.removeEventListener('click',doSpin);
	R2.style.display='none';
	//R2.removeEventListener('click',voiceCmnd);
	R2.removeEventListener('click',R2TouchDown);
	spd.removeEventListener('click',doSpinSlider);
	
	if (R2.src.includes('/listenning.png')) {
	//R2 listenning? then stop listen
	//R2.src='not_listenning.png';
	recognition.stop();
	}
	R3.style.display='none';
	free_F_motors('LEMO Spin');
	free_S_motors('LEMO Spin');	
  };
	
	//---------   spin play  -------
  function doSpin(FvoiceCmnd){
  //console.log(event);
  playImg.src='spin.gif';
  // ??? document.getElementById('icon').style.marginTop=600+'px';
  var cmnd = 0;
  var cmndEnd = '/;'
  var owner = document.getElementById('title').innerHTML;
  var picL1 = L1.src;
  //var R1 = document.getElementById('R1');
  //var spd = document.getElementById('spd').value;
  var msg ='starts the selected motor';
  
  if (clkw.src.includes("/clkw.png")) {cmnd+=1};
  
  if (deviceSelected.includes('S')) {
  	cmnd += 200;
  	cmndEnd = '/999/;';
  }
  
  if (R1.src.includes("start")) {
  	R1.src = "stop.png";
  	playImg.src='spin.gif';
  	websocket.send(':'+deviceSelected+'/'+owner+'/'+cmnd+'/'+spd.value+cmndEnd);
  	msg ='stops the selected motor';
  	//console.log('arrived here set to stop');
  }else {
  	R1.src = "start.png";
  	playImg.src='spin.png';
  	websocket.send(':'+deviceSelected+'/'+owner+'/199/;');
  }
  if (FvoiceCmnd!=true){spinSpeak(msg)}
  };
  
  function doSpinClkw(FvoiceCmnd) {  
  	  	var msg = 'turn around';
  	if (clkw.src.includes("/aclkw.png")) { 		
  		clkw.src='clkw.png';
  		console.log('at spin clkw');		
  	}else {	
  		clkw.src='aclkw.png';
  		console.log('at spin Aclkw');	
  	}
  	 if (FvoiceCmnd!=true){spinSpeak(msg)}	
  };
  
  function spinRspHnd(respons) {
  	var spinIcon = document.getElementById('icon');
  	var R1pic = 'start.png';
  	var IconPic = 'spin.gif';
  	var L1pic ='aclkw.png';
  	//console.log('???? -- '+respons[0]);
  	if (respons[0].includes ('valid cmnd')) {
  		//do nothing
  		//console.log('here ^^^^^ ');
  	}else {		
      	//update the LEMO Spin UI
      	if (respons[0].includes('S')) {
      //it is a S motor
      	//test for rest
      	if (respons[2]=='rest') {
      		//the S motor has come to rest
      		IconPic='spin.png';
      		R1pic='start.png';	
      	}else if (respons[2]==300) {
      		
      		if (respons[3]=='1') {
      		//the S motor is turning
      		R1pic='stop.png';
      		//set slider to spd
      		document.getElementById('spd').value=respons[4];
      		//set L1 to turn direction
      		if (respons[6]==1) {    		
      			L1pic='clkw.png';      			
      		};
      		}else {
      		//the S motor is standing
      		IconPic='spin.png';
      		R1pic='start.png';	
      		};  	
      	};
       
      	}else {
      //it is a F motor
      		if (respons[3]==5 || respons[3]==0) {
      		//the motor is parked or stopped      		
      		R1pic='start.png';
      		IconPic='spin.png';
      		}else {
      		//the motor is turning
      		R1pic='stop.png';
      			//set slider to spd of motor
      		document.getElementById('spd').value=respons[5];
      			//set the L1 to turn direction      		    		
      		if (respons[4]==0) {    		
      			L1pic='clkw.png';      			
      		};      		 
      		};    		  		
      }
      R1.src=R1pic;
      playImg.src=IconPic;
      L1.src=L1pic;
     	//console.log('respons 4  '+respons[4]+''+L1pic);    
      }    
  };
  
  function spinHelp() {
  	var L2=document.getElementById('L2');
  	var L2pic=L2.src;
  	 //console.log('at help '+L2pic);
  	if (L2pic.includes('help_voice_off.png')) {
  		L2.src='help_voice_on.png';
  	}else {
  		L2.src='help_voice_off.png';
  	}
  };
  
  function spinSpeak(msg) {
  	var L2pic = document.getElementById('L2').src;
  	if (L2pic.includes('help_voice_on')) {
  			let speech = new SpeechSynthesisUtterance();
                speech.lang = "en-GB";             
                speech.text = msg;
                speech.volume = 1;
                speech.rate = 1;
                speech.pitch = 1;              
                window.speechSynthesis.speak(speech);
  	} 	                           
  };
  
  function doSpinSlider(FvoiceCmnd) {
  	if (FvoiceCmnd!=true){spinSpeak('slower or faster')}	
  }
  
  function spinMotorHandler(device) {
	console.log('at spin motor select handler')	
};

function R2TouchDown() {
	//this is the event handler for R2 - voice recognition button
	//prep before calling the general voiceCmnd
	if (R2.src.includes('/listenning.png')) {
		//it is listening - now stop listening and display the not listening pic
		//Ix listenning? then make not listtening and stop listen
		R2.src='not_listenning.png';
		recognition.stop();
	}else {
		//it is not listening - setup the voice listener call the general voiceCmnd()
		voiceCmnd()
	}
}

  function spinVresult(transcript,confidence) {  
  	if (transcript.includes('start') || transcript.includes('stop')) {
  		doSpin(true); 	
  	}else if (transcript.includes('fast')) {
  		//var words = transcript.split(' ');
  		//var nw = words.length;
  		var count = (transcript.match(/fast/g) || []).length;
  		console.log('>>> '+count);  	
  		var spinSpd = parseInt(document.getElementById('spd').value);
  		document.getElementById('spd').value=spinSpd+count*100;
  	}else if (transcript.includes('slow')) {
  		var count = (transcript.match(/slow/g) || []).length;
  		var spinSpd = parseInt(document.getElementById('spd').value);
  		document.getElementById('spd').value=spinSpd-count*100;
  	}else if (transcript.includes('blue')) {
  	console.log('blue >>>> '+transcript);
  		if (transcript.includes('one')) {
  			motorHandler(1,true);
  		}else if (transcript.includes(2)) {
  			motorHandler(2,true);
  		};	
  	}else if(transcript.includes('yellow')){
  		if (transcript.includes('one')) {
  			motorHandler(3,true);
  		}else if (transcript.includes('two')) {
  			motorHandler(4,true);
  		};
  	}else if (transcript.includes('turn') || (transcript.includes('round'))) {
  		doSpinClkw(true);
	}  	
  };
   

function spinVstart() {
	//handles the event voice recognition started
	R2.src='listenning.png';
}

function spinVend() {
	//handles the event voice recognition stopped
	R2.src='not_listenning.png';
}
  
  
  
//^^^^^^^  end of spin play ^^^^^^^^  