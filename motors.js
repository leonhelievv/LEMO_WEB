//-----------  motor stuff --------------
   
  
  function initMotors() {
  	const FAm = document.getElementById('FA');
  	const FBm = document.getElementById('FB');
  	const S1m = document.getElementById('S1');
  	const S2m = document.getElementById('S2'); 		
    //init the motor buttons
    FAm.addEventListener('click',FA);
    FBm.addEventListener('click',FB);
    S1m.addEventListener('click',S1);
    S2m.addEventListener('click',S2);
    //off
		FAm.src='blue_motor_off.png';
		FBm.src='blue_motor_off.png';
		S1m.src='yellow_motor_off.png';
		S2m.src='yellow_motor_off.png';  
  };
  
  function FA() {motorHandler(1,false,true)};
  function FB() {motorHandler(2,false,true)};
  function S1() {motorHandler(3,false,true)};
  function S2() {motorHandler(4,false,true)};
  
function motorHandler(motor,FvoiceCmnd,click) {
  	const FAm = document.getElementById('FA');
  	const FBm = document.getElementById('FB');
  	const S1m = document.getElementById('S1');
  	const S2m = document.getElementById('S2'); 	
  	//console.log('>>>> '+motor);
  	
  	FAm.src = "blue_motor_off.png";
  	FBm.src = "blue_motor_off.png";
  	S1m.src = "yellow_motor_off.png";
  	S2m.src = "yellow_motor_off.png";
  	var helpVoice ='';
  	
  	switch(motor) {
  case 1:
    FAm.src = "blue_motor_on.png";
    deviceSelected='FA';
    helpVoice='blue motor 1';
    break;
  case 2:
    FBm.src = "blue_motor_on.png";
    deviceSelected='FB';
    helpVoice='blue motor 2';
    break;
  case 3:
   S1m.src = "yellow_motor_on.png";
   deviceSelected='S1';
   helpVoice='yellow motor 1';
    break;
  case 4:
   S2m.src = "yellow_motor_on.png";
   deviceSelected='S2';
   helpVoice='yellow motor 2';
    break;
  default:
	}
	//hadle event per play
	if (currentPlay == 'LEMO Tipper') {
		tipper_handle_buttons(deviceSelected)
	}else if (currentPlay == 'LEMO Shake') {
		shakeMotorHandler(deviceSelected)
	}else if (currentPlay == 'LEMO Metronome') {
		mNomeMotorHandler(deviceSelected)
	}else if (currentPlay == 'LEMO Snail') {
		snailMotorHandler(deviceSelected)
	}else if (currentPlay == 'LEMO Spin') {
		spinMotorHandler(deviceSelected)
		//voice cmnd
		if (FvoiceCmnd!=true){spinSpeak(helpVoice)};
	}
	
	//get the status of motors' if it was a click
	if (click) {
		websocket.send(':'+deviceSelected+'/'+currentPlay+'/'+300+'/;');	 
	}
};

function free_F_motors(owner) {
	websocket.send(':FA/'+owner+'/399/;');
	websocket.send(':FB/'+owner+'/399/;');
};

function free_S_motors(owner) {
	websocket.send(':S1/'+owner+'/399/;');
	websocket.send(':S2/'+owner+'/399/;');
};

function motorsDisplay(instruct) {
	switch(instruct) {
  case 1://only s motors
   	document.getElementById('FA').style.display='none';
		document.getElementById('FB').style.display='none';
    break;
  case 2:// s motors on
   	document.getElementById('S1').src='yellow_motor_on.png';
   	document.getElementById('S2').src='yellow_motor_on.png';		
    break;
   case 3:// s motors off
   	document.getElementById('S1').src='yellow_motor_off.png';
   	document.getElementById('S2').src='yellow_motor_off.png';		
    break;
    case 4://only f motors off   	
		document.getElementById('S1').style.display='none';
		document.getElementById('S2').style.display='none';
    break;
  case 99://display all in off state   		
		var mx = '<div class="row"><img id="FA" src="blue_motor_off.png" class="motors"><img id="FB" src="blue_motor_off.png" class="motors"><img id="S1" src="yellow_motor_off.png" class="motors"><img id="S2" src="yellow_motor_off.png" class="motors"></div>';
		document.getElementById('MotorArea').innerHTML=mx;
		initMotors();		
    break;
 }
};
