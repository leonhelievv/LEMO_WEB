var gd_step_speed=500
var door_set_phase=1
var gd_steps_in_one=5
var gd_count_downs=0
var doorTravel


function initGarage() {
console.log('at init Garage')
//cleanup nav
	navPlay.style.display='none';
	//init spin UI
	document.getElementById('play').style.display='block';
	currentPlay='LEMO Garage';
	document.getElementById('title').innerHTML=currentPlay;
	playImg.src='garage.png';	
	buildCallOut()
	instruct = document.getElementById('instruct')
	instruct.innerText='Move the door to the open position, then set it.';
	instruct.style.backgroundColor='#0eeb49'
	
	gd_step_speed=500
	door_set_phase=1
	gd_steps_in_one=5
	gd_count_downs=0
	
	L1.src='door_up.png'
	L1.style.display='block'
	L1.addEventListener('click',door_up)
	R1.src='door_down.png'
	R1.style.display='block'
	R1.addEventListener('click',door_down)
	R2.src='repeat.png'
	R2.style.display='none'
	R2.addEventListener('click',garage_door_repeat)
	R3.src='tool.png'
	R3.style.display='none'
	R3.addEventListener('click',door_set)
	//prepare motors
	motorsDisplay(99)
	motorsDisplay(1)
};

function garageCleanup() {
	console.log('at garage cleanup');
	free_S_motors(currentPlay);
	//restore motors
	motorsDisplay(99)
	//remove the instruction area
	var co = document.getElementById('callOut')
	L1.removeEventListener('click',door_up)
	R1.removeEventListener('click',door_down)
	R2.removeEventListener('click',garage_door_repeat)
	R3.removeEventListener('click',door_set)
	co.remove();
	initNav();	
};

function door_up() {
	if (door_set_phase==3) {
		startDoorUp()		
	}else{
		var allCmnd = ':'+deviceSelected+'/'+currentPlay+'/200/'+gd_step_speed+'/'+gd_steps_in_one+'/;'
		websocket.send(allCmnd)
		R3.style.display='block'
	}
};

function startDoorUp() {
	var st = gd_steps_in_one * gd_count_downs
	doorTravel=st
	var allCmnd = ':'+deviceSelected+'/'+currentPlay+'/200/'+gd_step_speed+'/'+st+'/;'
	websocket.send(allCmnd)
	//if in phase 3 then replace with work
	if (door_set_phase==3) {
		L1.src='work1.png'
	}
	//R1.style.display='none'
	//R2.style.display='block'
	R1.src='space.png'
	};


function door_down() {
	if (door_set_phase==1) {
		var allCmnd = ':'+deviceSelected+'/'+currentPlay+'/201/'+gd_step_speed+'/'+gd_steps_in_one+'/;'
		websocket.send(allCmnd)
	}else if (door_set_phase==3) {
		startDoorDown()
	}else if (door_set_phase==2) {
		var allCmnd = ':'+deviceSelected+'/'+currentPlay+'/201/'+gd_step_speed+'/'+gd_steps_in_one+'/;'
		websocket.send(allCmnd)
		R3.style.display='block'
		gd_count_downs=gd_count_downs+1
		R1.src='work1.png'
	}
	//L1.style.display='none'
};

function startDoorDown() {
	var st = gd_steps_in_one * gd_count_downs
	var allCmnd = ':'+deviceSelected+'/'+currentPlay+'/201/'+gd_step_speed+'/'+st+'/;'
	websocket.send(allCmnd)
	R1.style.display='block'
	L1.style.display='none'
	R2.style.display='block'
	if (door_set_phase==3) {
		R1.src='work1.png'
	}
};

function door_set() {
	if (door_set_phase==1) {
		L1.style.display='none'
		R1.style.display='block'
		R3.style.display='none'
		door_set_phase=2
		instruct.innerText='Move the door to the closed position, then set'
		instruct.style.backgroundColor='#f2ee0f'
	}else if (door_set_phase==2) {
		L1.style.display='block'
		R1.style.display='none'
		R3.style.display='none'
		door_set_phase=3
		instruct.innerText='Open and close the door'
		instruct.style.backgroundColor='#07f03a'
	}else if (door_set_phase==3) {
	}
};

function garage_door_repeat() {
	if (R2.src.includes('/repeat.png')) {
		R2.src='repeat_active.png'
	}else {
		R2.src='repeat.png'
	}
};

function garage_door_respons_handler(respons) {
	if (R2.src.includes('/repeat_active.png')) {
		if (door_set_phase==3) {
			if (respons[0].includes(deviceSelected)) {
				if (respons[2]=='rest') {
					//if (R1.style.display=='block') {
					if (R1.src.includes('/door_down.png')) {
						var allCmnd = ':'+deviceSelected+'/'+currentPlay+'/200/'+gd_step_speed+'/'+doorTravel+'/;'
						websocket.send(allCmnd)
						//R1.style.display='none'
						//L1.style.display='block'
						R1.src='space.png'
						L1.src='door_up.png'
						L1.style.display='block'
					}else{
						var allCmnd = ':'+deviceSelected+'/'+currentPlay+'/201/'+gd_step_speed+'/'+doorTravel+'/;'
						websocket.send(allCmnd)
						//R1.style.display='block'
						//L1.style.display='none'
						L1.src='space.png'
						R1.src='door_down.png'
						R1.style.display='block'
					}
				}
			}
		}
				
	}else if (door_set_phase==2) {
		if (respons[0].includes(deviceSelected)) {
			if (respons[2]== 'rest') {
				L1.style.display='none'				
				R1.src='door_down.png'
				R1.style.display='block'
			}
		}
	}else if (door_set_phase==3) {
		if (respons[0].includes(deviceSelected)) {
			if (respons[2]== 'rest') {
				if (L1.style.display=='none') {
				L1.style.display='block'
				L1.src='door_up.png'
				//R1.style.display='none'
				R1.src='space.png'
				}else{
				R1.style.display='block'
				R1.src='door_down.png'
				L1.style.display='none'
			}			
			}
		}
	}
};

