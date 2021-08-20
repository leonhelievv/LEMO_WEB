//lights data

var lights_state=[];
var light_current;
var voiceCmnd=false;

lights_state=[
[0,false,50,false,50,''],
[0,false,50,false,50,''],
[0,false,50,false,50,''],
[0,false,50,false,50,''],
];

function initLights() {	

//console.table(lights_state);
//console.log(lights_state[0][1]);

	//nav
	navPlay.style.display='none';
	//init lights UI
	currentPlay='LEMO lights';
	playImg.src='bulb.png';
	play.style.display='block';
	playIcon.style.display='block';
	title.innerText=currentPlay;
	//document.getElementById('clkw').style.display='none';		
	document.getElementById('sliderArea').style.display='none';
	
	makeLights();
	guiUpdateLights();
	//make slider visible and set new eventlistener
	sliderArea.style.display='block';
	spd.style.display='none';
	spd.min="1";
	spd.max="100";	
	spd.value="50";
	//spd.addEventListener('click',blinkSpd);
	spd.addEventListener('touchend',blinkSpd);
	//blink icon
	R3.src='blink_no.png';
	R3.style.display='none';
	R3.addEventListener('click',blinkClick);
	//blink mode
	L1.src='blink_on.png';
	L1.style.display='none';
	L1.addEventListener('click',blinkMode);
	//light on/off
	R1.src='on.png';
	R1.style.display='none';
	R1.addEventListener('click',lights_on_off);
	//voice cmnd listener
	L2.src='not_listenning.png';
	L2.style.display='block';
	L2.addEventListener('click',touchListenIcon);
	
	//var pad = '<div id="pad" class="div1"></div>';
	//document.getElementById('clkwArea').innerHTML=pad;
	//now set the pad height
	//document.getElementById('pad').height=lemoW/2+'px';
};

function lightsCleanup() {
	
	//console.log('at lights cleanup');
	//restore motors
	motorsDisplay(99) //display all in off state
	spd.removeEventListener('click',blinkSpd);
	R3.removeEventListener('click',blinkClick);
	R3.style.display='none';
	L1.removeEventListener('click',blinkMode);
	L1.style.display='none';
	L2.style.display='none';
	if (!L2.src.includes('not')) {
		recognition.stop();
		}
	free_S_motors(currentPlay);
};


function makeLights() {
	
	const l1 = document.getElementById('FA')
	const l2 = document.getElementById('FB')
	const l3 = document.getElementById('S1')
	const l4 = document.getElementById('S2')
	
	l1.removeEventListener('click', FA);
	l2.removeEventListener('click', FB);
	l3.removeEventListener('click', S1);
	l4.removeEventListener('click', S2);
	
	l1.src='light_select_false.png'
	l2.src='light_select_false.png'
	l3.src='light_select_false.png'
	l4.src='light_select_false.png'
	
	l1.addEventListener('click',l1c);
	l2.addEventListener('click',l2c);
	l3.addEventListener('click',l3c);
	l4.addEventListener('click',l4c);
	
	lights_state[0][5]=l1
	lights_state[1][5]=l2
	lights_state[2][5]=l3
	lights_state[3][5]=l4
	
};

function l1c() {
	//console.log('light 1 clicked')
	handle_lamp_select(true,1,0);
};
function l2c() {
	//console.log('light 2 clicked')
	handle_lamp_select(true,1,1);
};
function l3c() {
	//console.log('light 3 clicked')
	handle_lamp_select(true,1,2);
};
function l4c() {
	//console.log('light 4 clicked')
	handle_lamp_select(true,1,3);
};

function blinkSpd() {
	//console.log('blink slider clicked')
	var cm =603;
	if (lights_state[light_current][3]) {cm=604}	
	var stt = lights_state[light_current][0]
	var dl = 100-parseInt(spd.value)
	//only if state is blinking
	if (stt==2) {	
	//update the lights_state data
	lights_state[light_current][2]=dl
	var l = light_current+1
	//issue new cmnd to ajust the speed
	full_cmnd=':S2/LEMO lights/'+cm+'/'+l+'/'+lights_state[light_current][2]+'/'+lights_state[light_current][4]+'/;'
	websocket.send(full_cmnd);	
	}
};

function blinkClick() {
	//console.log('blink clicked')
	var Ln = lights_state[light_current][5]
	var cm=603
	if (R3.src.includes('/blink.png')) {		
		R3.src='blink_no.png';
		//remove options
		L1.style.display='none';
		spd.style.display='none';
		lights_state[light_current][0]=0
		R1.src='on.png'
		//update lights
		Ln.src='lamp_selected_off.png'
		//send off cmnd
		var l = light_current+1
		full_cmnd=':S2/LEMO lights/'+600+'/'+l+'/;'
		websocket.send(full_cmnd);
	
	}else{
		R3.src='blink.png';
		//display options
		L1.style.display='block';
		spd.style.display='block';
		lights_state[light_current][0]=2
		R1.src='off.png'
		Ln.src='lamp_selected_on.png'
		//send blink param from lights_state
		//send off cmnd
		var l = light_current+1
		if (lights_state[light_current][3]) {cm=604}
		full_cmnd=':S2/LEMO lights/'+cm+'/'+l+'/'+lights_state[light_current][2]+'/'+lights_state[light_current][4]+'/;'
		websocket.send(full_cmnd);	
	}		
};

function blinkMode() {
	//console.log('blink mode clicked')
	var cm = 604
	var l = light_current+1
	if (L1.src.includes('/blink_on.png')) {
		L1.src='blink_off.png'
		lights_state[light_current][3]=true
	}else{
		L1.src='blink_on.png'
		cm = 603
		lights_state[light_current][3]=false
	}
	//send cmnd
	full_cmnd=':S2/LEMO lights/'+cm+'/'+l+'/'+lights_state[light_current][2]+'/'+lights_state[light_current][4]+'/;'
	websocket.send(full_cmnd);	
};


function handle_lamp_select(update_actionButtons,lamp,lampNo) {
	//console.table(lights_state);
	var state =0;
	state=lights_state[lampNo][0];
	light_current=lampNo;
	const Ls = lights_state[lampNo][5];
	
	guiUpdateLights();
  	if (state==0) {
  		if (update_actionButtons) {
  			R3.src='blink_no.png';
  			R3.style.display='block';
  			R1.src='on.png';
  			R1.style.display='block';
  			L1.style.display='none';
  			spd.style.display='none';
  			//remove options
  			
  		}
  		Ls.src='lamp_selected_off.png'
  	}else if (state==1) {
  		if (update_actionButtons) {
  			R1.src='off.png'
  			R1.style.display='block';
  			R3.src='blink_no.png'
  			R3.style.display='block';
  		}
  		Ls.src='lamp_selected_on.png'
  	}else if (state==2) {
  		if (update_actionButtons) {
  			R3.src='blink.png'
  			R3.style.display='block';
  			R1.src='off.png'
  			R1.style.display='block';
  			L1.style.display='block';
  			spd.style.display='block';
  			spd.value=100-lights_state[lampNo][2]
  			L1.src=(lights_state[lampNo][3]) ? 'blink_off.png':'blink_on.png';
  		
  		}
  		Ls.src='lamp_selected_on.png'
  	}
  	spd.value=100-lights_state[lampNo][2];
	
};

function guiUpdateLights() {
	for (let number = 0; number < 4; number++) {
  	// Runs 4 times, with values of step 1 through 4.
  	var Lx = lights_state[number][5]; 	
  	if (lights_state[number][0]>0) {
  		Lx.src ='lamp_notselected_on.png'
  		}else{
  		Lx.src ='lamp_notselected_off.png'
  		} 	  		
  	}  	
};

function lights_on_off() {
	var state,cmnd,newState,full_cmnd	
	state = lights_state[light_current][0]
	var Lx=lights_state[light_current][5]
	
	if (state==0) {
		newState=1;
		cmnd=601;
		R1.src='off.png'	
		Lx.src='lamp_selected_on.png'
	}else if (state==1) {
		newState=0
		cmnd=600
		R1.src='on.png'
		Lx.src='lamp_selected_off.png'
	}else if (state==2) {
		R3.src='blink_no.png'
		newState=0
		cmnd=600
		R1.src='on.png'
		Lx.src='lamp_selected_off.png'
		L1.style.display='none'
		spd.style.display='none'
	}
	//ajust for 0
	var l = light_current+1
	lights_state[light_current][0]=newState
	full_cmnd=':S2/LEMO lights/'+cmnd+'/'+l+'/;'
	websocket.send(full_cmnd);
};

function lights_blink() {
	//select port not yet implemented
	var l = light_current+1
	var cmndPart1=':S1/LEMO lights/';
	var cmnd=603
	var fullCmnd
	Lx =lights_state[light_current][5]
	LxModeOn =lights_state[light_current][3]
	if (!LxModeOn) {cmnd=604}
	var dl = lights_state[light_current][2]
	var pw = lights_state[light_current][4]
	Lx.src='lamp_selected_on.png'
	R3.src='blink.png'
	R1.src='off.png'
	lights_state[light_current][0]=2
	var delay = 100-parseInt(spd.value)
	lights_state[light_current][2]=delay
	
	//pulse width not yet implemented
	//fullCmnd=cmndPart1+cmnd+'/'+l+'/'+dl+'/'+pw+'/;'
	//websocket.send(full_cmnd);
	//recording not yet implemented
};

function switchVoiceCmnd() {
	//console.log('at switch voice cmnd');
	if (L2.src.includes('/not_listenning.png')) {
		L2.src='listenning.png'
		voiceCmnd=true
	}else{
		L2.src='not_listenning.png'
		voiceCmnd=false
	}
};

function lightsVresult(script,confidence) {
	//handles the event voice recognition result
		if (!script.includes('bye-bye')) {
			
		var on = (script.includes('on')) ? true:false;
		var off = (script.includes('off')) ? true:false;
		var light = (script.includes('light')) ? true:false;
		var blink = (script.includes('blink')) ? true:false;
		var bModeOn = (script.includes('blink on')) ? true:false;
		var bModeOff = (script.includes('blink off')) ? true:false;
		var fast = (script.includes('fast')) ? true:false;
		var slow = (script.includes('slow')) ? true:false;
		var l1 = (script.includes('one') || script.includes(1)) ? true:false;
		var l2 = (script.includes('two') || script.includes(2)) ? true:false;
		var l3 = (script.includes('three') || script.includes(3)) ? true:false;
		var l4 = (script.includes('four') || script.includes(4)) ? true:false;
		
		if (l1==true) {l1c()}
		if (l2==true) {l2c()}
		if (l3==true) {l3c()}
		if (l4==true) {l4c()}
		
		if (on || off) {
			if (!bModeOn && !bModeOff) {lights_on_off()}			
			}
		
		if (blink) {
			if (!bModeOn && !bModeOff) {blinkClick()}				
			}
		
		if (fast) {
			//get value of spd
			var count = (script.match(/fast/g) || []).length;
			var s = parseInt(spd.value)
			//increment slider
			spd.value=s+count*10;
			blinkSpd()
			}
			
		if (slow) {
			//get value of spd
			var count = (script.match(/slow/g) || []).length;
			var s = parseInt(spd.value)
			//increment slider
			spd.value=s-count*10;
			blinkSpd()
			}
		
		if (bModeOn || bModeOff) {
			blinkMode()
		}
	}else{
		//do bye-bye
		recognition.stop();
		L2.src='not_listenning.png'
	}
};

function lightsVstart() {
	//handles the event voice recognition started
	L2.src='listenning.png';
}

function lightsVend() {
	//handles the event voice recognition stopped
	L2.src='not_listenning.png';
}

function touchListenIcon() {
	//handle the touch listeningIcon
	if (L2.src.includes('not')) {
		//not listening to commands
		voiceCmnd()
	}else {
		//are listenning to commands
		recognition.stop();
	}
}







