var tipper_phase=1
var step_speed=500
var tipper_step_speed=100
var tipper_sensor_device
var tipper_count
var tipper_step_size=10
var tip_cmnd
var tip_reset_cmnd
var instruct
var tipper_respons_list=[]

function initTipper() {
console.log('at init tipper')
//cleanup nav
	navPlay.style.display='none';
	clkwArea.style.display='none';
	//init spin UI
	play.style.display='block';
	currentPlay='LEMO Tipper';
	title.innerHTML=currentPlay;
	playImg.src='tipper_up.png';
	playIcon.style.display='block';
	//buildCallOut()
	callOut.style.display='block';
	instruct.style.color='black';
	instrHead.style.color='yellow';
	instrHead.style.font='bold';
	//instruct = document.getElementById('instruct')
	instruct.innerText='Assign motor as tip sensor.';
	motors.style.display='block';
	motorsDisplay(99)
	motorsDisplay(4)
	L1.src='clkw.png'
	L1.style.display='none'
	L1.addEventListener('click',tipper_clkw)
	R1.src='aclkw.png'
	R1.style.display='none'
	R2.style.display='none'
	R1.addEventListener('click',tipper_Aclkw)
	R3.src='tool.png'
	R3.style.display='none'
	R3.addEventListener('click',tipper_tool)
	audio.src='truck_beep.mp3'
};

function tipperCleanup() {
	console.log('at tipper cleanup');
	L1.removeEventListener('click',tipper_clkw)
	R1.removeEventListener('click',tipper_Aclkw)
	R3.removeEventListener('click',tipper_tool)	
	//restore motors
	motorsDisplay(99)
	//remove the instruction area
	//var co = document.getElementById('callOut')
	callOut.style.display = 'none'
	//co.remove();
	free_F_motors(currentPlay);
	free_S_motors(currentPlay);
	//free the SBnr BUFFERS
	free_SBnR(currentPlay)
	audio.src=''
};

function tipper_clkw() {
	if (tipper_phase==3) {
		appCmndToLemo(':'+deviceSelected+'/'+currentPlay+'/'+201+'/'+tipper_step_speed+'/'+tipper_step_size+'/;');
		R3.style.display='block'
	}else if (tipper_phase==4) {
		tipper_count=tipper_count+1
		appCmndToLemo(':'+deviceSelected+'/'+currentPlay+'/'+201+'/'+tipper_step_speed+'/'+tipper_step_size+'/;');
		R3.style.display='block'
	}
};

function tipper_Aclkw() {
	if (tipper_phase==3) {
		appCmndToLemo(':'+deviceSelected+'/'+currentPlay+'/'+200+'/'+tipper_step_speed+'/'+tipper_step_size+'/;');
		R3.style.display='block'
	}else if (tipper_phase==4) {
		tipper_count=tipper_count-1
		appCmndToLemo(':'+deviceSelected+'/'+currentPlay+'/'+200+'/'+tipper_step_speed+'/'+tipper_step_size+'/;');
		R3.style.display='block'
	}
};

function tipper_tool() {
	if (tipper_phase==2) {
		
	}else if(tipper_phase==3){
		tipper_p4_format()
	}else if (tipper_phase==4) {
		if (tipper_count >0) {
			tip_cmnd=200
			tip_reset_cmnd=201
		}else {
			tip_cmnd=201
			tip_reset_cmnd=200
			tipper_count=tipper_count*-1
		}
		L1.style.display='none'
		R1.style.display='none'
		R3.style.display='none'
		instruct.innerText='Load the tipper.';
		playImg.src='tipper_down.png'
		instruct.style.backgroundColor='#f78a05'
		tipper_load_SB_buffer_tip_cmnd()
		//tipper sound stop
		tipper_phase=5
		}	
};

function tipper_load_SB_buffer_tip_cmnd() {
	var aCmnd=(tipper_sensor_device=='FA') ? ':SB1R/':':SB2R/';
	var s = tipper_count*tipper_step_size
	var allCmnd = aCmnd+currentPlay+'/500/,'+deviceSelected+'/'+currentPlay+'/'+tip_cmnd+'/100/'+s+'/;'
	appCmndToLemo(allCmnd)
};

function tipper_respons_handler(respons) {
	
	if (tipper_phase==1) {
		//if (respons[3]==5 || tipper_respons_list[3]==0) {
		if (respons[3]==5 || respons[3]==0) {
			appCmndToLemo(':'+tipper_sensor_device+'/'+currentPlay+'/182/;')
			tipper_p2_format()
		}
	}else if (tipper_phase==3) {
	}else if (tipper_phase==4) {
	}else if (tipper_phase==5) {
		if (respons[2]=='sensor') {
			instruct.innerText='Tipping in progress'
			tipper_phase=6
			//tipper sound - truck_beep.mp3
			 audio.play(); 
			playImg.src='tipper_up.png'
			//play sound
		}
	}else if (tipper_phase==6) {
		if (respons.includes('rest')) {
			const c = tipper_count*tipper_step_size
			appCmndToLemo(':'+deviceSelected+'/'+currentPlay+'/'+tip_reset_cmnd+'/100/'+c+'/;')
			tipper_phase=7
		}
	}else if (tipper_phase==7) {
		if (respons.includes('rest')) {
			tipper_phase=5
			tipper_load_SB_buffer_tip_cmnd()
			instruct.innerText='Load tipper next load'
			playImg.src='tipper_down.png'
			//stop the sound
			audio.pause();
		}
	}
};

function tipper_p2_format() {
	tipper_phase=2
	motorsDisplay(99) //only S motors
	motorsDisplay(1) //only S motors
	instruct.innerText='Select the tipper motor'
};

function tipper_p3_format() {
	tipper_phase=3
	instruct.innerText='Move the tipper to the tip position'
	motorsDisplay(1)
	motorsDisplay(4)
	L1.style.display='block'
	R1.style.display='block'
	R3.style.display='none'
};

function tipper_p4_format() {
	tipper_phase=4
	instruct.innerText='Move the tipper to the down position'
	tipper_count=0
	motorsDisplay(1)
	motorsDisplay(4)
	L1.style.display='block'
	R1.style.display='block'
	R3.style.display='none'
	playImg.src='tipper_down.png'
};


function tipper_handle_buttons(button_clicked) {
	if (tipper_phase==1) {
		if (button_clicked=='FA') {
			tiper_sensor_FA_click()
		}else if (button_clicked=='FB') {
			tiper_sensor_FB_click()
		}
	}else if (tipper_phase==2) {
		if (button_clicked=='S1') {
			//do_S1_click()
			tipper_p3_format()
		}else if (button_clicked=='S2') {
			//do_S2_click()
			tipper_p3_format()
		}
	}
};

function tiper_sensor_FA_click() {
	if (tipper_phase==1) {
		tipper_sensor_device='FA'
		appCmndToLemo(':'+tipper_sensor_device+'/'+currentPlay+'/199/;');
	}
};

function tiper_sensor_FB_click() {
	if (tipper_phase==1) {
		tipper_sensor_device='FB'
		appCmndToLemo(':'+tipper_sensor_device+'/'+currentPlay+'/199/;');
	}
};

