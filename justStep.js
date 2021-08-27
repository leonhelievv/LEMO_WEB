//---------   just step  -------

	var justStep_rec_phase =1;
	var js_time_stamp_previous=0;
	var just_step_rec=false;
	var just_step_rec_sq1=[];
	var S1_seq=[];
	var S2_seq=[];
	
	var just_step_spead=500;
	var js_repeat=false;
	var Flag_js_GUI_update = 0;
	var js_cmnd='';
	var respons_list=[];
	var tmrId;
	

function initjuststep() {
	//cleanup nav
	navPlay.style.display='none';
	
	//init justStep UI
	currentPlay='LEMO just step';
	playImg.src='justStep.png';
	playIcon.style.display='block';
	play.style.display='block';	
	title.innerHTML=currentPlay;
	sliderArea.style.display='block';
	clkwArea.style.display='block';
	callOut.style.display='none';
	
	//build the clkw area "clkwArea"
	//buildClkwArea()
	//clkw = document.getElementById('clkw');
	L1.src='stand_not_step.png';
	L1.style.display='block';
	L1.addEventListener('click',js_stand_step); 
	R1.src='record.png';
	R1.style.display='block';
	R1.addEventListener('click',just_step_r1);
	R2.src='play_recording.png';
	R2.style.display='none';
	R2.addEventListener('click',just_step_r2);
	R3.src='record_trash.png';
	R3.style.display='none';
	R3.addEventListener('click',just_step_r3);
	
	L2.src='back_pack_s1.png';
	L3.src='back_pack_s2.png';
	L2.style.display='none';
	L3.style.display='none';
	L2.addEventListener('click',js_l2_seq);
	L3.addEventListener('click',js_l3_seq);
	motors.style.display='block';
	motorsDisplay(99);

	clkw.src='clkw.png';
	clkwArea.style.display='block';
	clkw.style.display='block';
	clkw.addEventListener('click',clkwClick);
	
	spd.style.display='block';
	spd.min="50";
	spd.max="999";
	spd.value="470";
	spd.addEventListener('click',slider_event_handler);	
	Pack_vis();
	console.log('done just step init');
};

function justStepCleanup() {
	console.log('at just step cleanup');
	sliderArea.style.display='none';
	spd.removeEventListener('click',slider_event_handler);	
	clkw.style.display='none';
	clkw.removeEventListener('click',clkwClick);
	L1.style.display='none';
	L1.removeEventListener('click',js_stand_step); 
	L2.style.display='none';
	L2.removeEventListener('click',js_l2_seq); 
	L3.style.display='none';
	L3.removeEventListener('click',js_l3_seq); 
	R1.style.display='none';
	R1.removeEventListener('click',just_step_r1);
	R2.style.display='none';
	R2.removeEventListener('click',just_step_r2);
	R3.style.display='none';
	R3.removeEventListener('click',just_step_r3);
	//document.getElementById('clkw').remove();
	
	free_F_motors('LEMO just step');
	free_S_motors('LEMO just step');
	showNav();	
};

function slider_event_handler() {
	var jsClkw=0;
	var cmnd_part2="/;";
	var cmnd_rec='';
	just_step_spead=parseInt(spd.value);
	
	if (justStep_rec_phase!=4) {
		if (Flag_js_GUI_update!=0) {
			Flag_js_GUI_update=Flag_js_GUI_update-1;
		}else {
			if (L1.src.includes('step_not_stand.png')) {
								
				if (clkw.src.includes('/clkw.png')) {jsClkw+=1};
				if (deviceSelected.includes('S')) {
					jsClkw+=200
					cmnd_part2='/999/;'}
			}
		}
		cmnd_rec = ':'+deviceSelected+'/'+title.innerHTML+'/'+jsClkw+'/'+just_step_spead+cmnd_part2;
		//send the cmnd
		websocket.send(cmnd_rec);
		if (just_step_rec==true) {
			if (js_time_stamp_previous==0) {
				js_time_stamp_previous=Date.now();
				//add just the cmnd to list
				just_step_rec_sq1.push(cmnd_rec);
			}else{
				//add interval duration
				just_step_rec_sq1.push (Date.now()-js_time_stamp_previous);
				//add cmnd
				just_step_rec_sq1.push(cmnd_rec);
				js_time_stamp_previous=Date.now();
			}
		}
	}
	};
	
	function clkwClick() {	
		just_step_spead=spd.value;
		var cmnd_part2="/;";
		if (clkw.src.includes('/clkw')) {
			clkw.src='aclkw.png';
			jsClkw=0;
			console.log('at just step clkw click');
		}else {
			clkw.src='clkw.png';
			jsClkw=1;
		}
		if (L1.src.includes('/step_not_stand')) {
			//if (clkw.src.includes('/clkw.png')) {jsClkw+=1};
			if (deviceSelected.includes('S')) {
					jsClkw+=200
					cmnd_part2='/999/;'
					}
			cmnd_rec = ':'+deviceSelected+'/'+title.innerHTML+'/'+jsClkw+'/'+just_step_spead+cmnd_part2;
			websocket.send(cmnd_rec);
			if (just_step_rec==true) {
			if (js_time_stamp_previous==0) {
				js_time_stamp_previous=Date.now();
				//add just the cmnd to list
				just_step_rec_sq1.push(cmnd_rec);
			}else{
				//add interval duration
				just_step_rec_sq1.push (Date.now()-js_time_stamp_previous);
				//add cmnd
				just_step_rec_sq1.push(cmnd_rec);
				js_time_stamp_previous=Date.now();
			}
		}
		}
	};
	
	function just_step_play_back_interval() {		
		var playN="";
		var js_cmnd=[];
		var stop_cmnd=false;
		
		if (just_step_play_no <  just_step_rec_sq1.length) {
			var item_play_back=just_step_rec_sq1[just_step_play_no];
			var interval=just_step_rec_sq1[just_step_play_no+1];
			playN = just_step_rec_sq1[just_step_play_no];
						
			try {			
			js_cmnd = playN.split("/"); 		
			if (item_play_back.includes('199/;')) {stop_cmnd=true};
			if (item_play_back.charAt(0)==':' && item_play_back.charAt(item_play_back.length==';')) {				
				//test if interval is not an illegal number
				if (!isNaN(interval)) {
					websocket.send(item_play_back);
					//update GUI
					js_gui_format_playBack(stop_cmnd,item_play_back);
					//increment index
					just_step_play_no = just_step_play_no+2;
					//load the timer play back interval with interval
					clearTimeout(tmrId);
					tmrId=window.setTimeout(just_step_play_back_interval, interval);
				};			
			if (stop_cmnd) {L1.src='stand_not_step.png'};
			
			}else{ console.log('EROOR in play back cmnd')}
			}catch(err) {
				console.log('ERROR in playN - not an array '+err);
				console.log(just_step_rec_sq1);
				just_step_rec_sq1=[];
				}
					
		}else {			
			//reset play counter
			just_step_play_no=0
			//test if play must be repeated
			if (js_repeat) {					
					//tmrId=window.setTimeout(just_step_play_back_interval(), 100);
					clearTimeout(tmrId);
					just_step_play_back_interval();
				}else {
					//stop timer from firing again - srtTimeout fires only once
					
					clearTimeout(tmrId);
					js_p3_setup();
				}
		}
	
	};
	
	function Pack_vis() {
		if (S1_seq.length==0) {
			L2.style.display='none';
		}else {
			L2.style.display='block';
			}
		if (S2_seq.length==0) {
			L3.style.display='none';
		}else {
			L3.style.display='block';
			}
	};

	function js_p3_setup() {
		clearTimeout(tmrId);
		if (just_step_rec_sq1.length==0) {
			R1.src='record.png';
			justStep_rec_phase=1;
		}else{
			R1.src='play_recording.png';
			R3.style.display='block';
			just_step_rec=false;
			justStep_rec_phase=3;
			if (S1_seq.length==0 || S2_seq.length==0) {
				R2.src='save_rec.png';
				R2.style.display='block';
			}else {
				R2.style.display='none';
				}
		}
		//js_stand_step to visible ?<img src="joyStick.png" alt="" />?
	};
	
	function js_p4_setup() {
		//tmrId=window.setTimeout(just_step_play_back_interval(), 10);
		clearTimeout(tmrId);
		just_step_play_no=0;
		just_step_play_back_interval();	
		justStep_rec_phase=4;
		R1.src='stop.png';
		R3.style.display='none';
		if (js_repeat) {R2.src='repeat_active.png'}else {R2.src='repeat.png'};
		R2.style.display='block';
		//js_stand_step to visible ??		
	};
	
	function js_rec_p1() {
		justStep_rec_phase=2;
		R1.src='record_stop.png';
		just_step_rec=true;
	};
	
	function js_save_p3() {
		if (S1_seq.length==0) {
			S1_seq= Object.assign([], just_step_rec_sq1);
		}else if (S2_seq.length==0) {
			S2_seq= Object.assign([], just_step_rec_sq1);
		}
	};
	
	function just_step_r1() {
		//websocket.send('at just step r1');
		var jsStop = ':'+deviceSelected+'/'+title.innerHTML+'/199/;';
		if (justStep_rec_phase==1) {
			js_time_stamp_previous=0;
			js_rec_p1();
		}else if (justStep_rec_phase==2){
			if (just_step_rec_sq1.length==0) {
				Js_setupOpening();
			}else{
				just_step_rec_sq1.push(Date.now()-js_time_stamp_previous);
				just_step_rec_sq1.push(jsStop);
				just_step_rec_sq1.push(0);
				websocket.send(jsStop);
				js_p3_setup();
			}
		}else if (justStep_rec_phase==3) {
			js_p4_setup();
		}else if (justStep_rec_phase==4) {
			js_p3_setup();
			Pack_vis();
			js_repeat=false;
			//just_step_play_no=just_step_rec_sq1.length;
			just_step_play_no=0;
			//tmrId=window.setTimeout(just_step_play_back_interval(), 10);
			clearTimeout(tmrId);
			websocket.send(jsStop);
		}
	};
	
	function just_step_r2() {
		if (justStep_rec_phase==3) {
			js_save_p3();
			Pack_vis();
		}else if (justStep_rec_phase==4) {
			if (js_repeat) {
				js_repeat=false;
				R2.src='repeat.png';
			}else {
				js_repeat=true;
				R2.src='repeat_active.png';			
			}
		}
	};
	
	function just_step_r3() {
		if (R1.src.includes('play_s1.png')) {
			S1_seq=[];
			Js_setupOpening();
		}else if (R1.src.includes('play_s2.png')) {
			S2_seq='';
			Js_setupOpening();
		}else {
			if (justStep_rec_phase==3) {
				just_step_rec_sq1=[];
				just_step_rec=false;
				justStep_rec_phase=1;
				time_stamp_previous=0;
				R1.src='record.png';
				clearTimeout(just_step_rec_sq1);
				R2.style.display='none';
				R3.style.display='none';
				Pack_vis();
			}
		}
		if (justStep_rec_phase==3) {
			Js_setupOpening();
		}			
	};
	
	function Js_setupOpening() {
		just_step_rec_sq1=[];
		just_step_rec=false;
		justStep_rec_phase=1;
		just_step_play_no=0;
		time_stamp_previous=0;
		R1.src='record.png';
		R1.style.display='block';
		clearTimeout(just_step_rec_sq1);
		R2.style.display='none';
		R3.style.display='none';
		Pack_vis();
	};
	
	function js_l2_seq() {
		just_step_rec_sq1 = Object.assign([], S1_seq);
		R1.src='play_s1.png';
		R3.src='record_trash.png';
		just_step_rec=false;
		justStep_rec_phase=3;
		R3.style.display='block';
		R2.style.display='none';
	};
	
	function js_l3_seq() {
		just_step_rec_sq1 = Object.assign([], S2_seq);
		R1.src='play_s2.png';
		R3.src='record_trash.png';
		just_step_rec=false;
		justStep_rec_phase=3;
		R3.style.display='block';
		R2.style.display='none';
	};
	
	function js_gui_format(respons_list) {
		
		if (respons_list[0].includes(':S')) {
			
			if (respons_list[3]==1) {
				L1.src='step_not_stand.png';
			}else {
				L1.src='stand_not_step.png';
			}
			if (respons_list[6]==1) {
				clkw.src='clkw.png';
			}else{
				clkw.src='aclkw.png';
			}
			spd.value=respons_list[4];
		}else if (respons_list[0].includes(':F')) {
			if (respons_list[3]==2) {
				L1.src='step_not_stand.png';
			}else{
				L1.src='stand_not_step.png';
			}
			if (respons_list[4]==1) {
				clkw.src='aclkw.png';
			}else{
				clkw.src='clkw.png';
			}			
		}		
		spd.value=respons_list[4];
	};
		
		
  function js_stand_step() {
  var c=0;
  var c2='/;'
  var fullCmnd=[];
  var jsStop = ':'+deviceSelected+'/'+title.innerHTML+'/199/;';

  if (clkw.src.includes('/clkw.png')) {c=1};
  if (deviceSelected.includes('S')) {
  	c+=200;
  	c2='/999/;'};
  	fullCmnd=':'+deviceSelected+'/'+title.innerHTML+'/'+c+'/'+parseInt(spd.value)+c2;
  	if (justStep_rec_phase==1 || justStep_rec_phase==3) {
  		if (L1.src.includes('step_not_stand.png')) {
  			L1.src='stand_not_step.png';
  			websocket.send(jsStop);
  		}else {
  			L1.src='step_not_stand.png';
  			websocket.send(fullCmnd);
  		}
  	}else if(justStep_rec_phase==2){
  		if (L1.src.includes('step_not_stand.png')) {
  			L1.src='stand_not_step.png';
  			if (just_step_rec_sq1.length==0) {
  				just_step_rec_sq1.push(jsStop);
  			}else {
  				just_step_rec_sq1.push(Date.now()-js_time_stamp_previous);
  				just_step_rec_sq1.push(jsStop);
  			}
  			websocket.send(jsStop);
  			js_time_stamp_previous=Date.now();
  		}else {
  			L1.src='step_not_stand.png';
  			if (just_step_rec_sq1.length==0) {
  				just_step_rec_sq1.push(fullCmnd);
  			}else {
  				just_step_rec_sq1.push(Date.now()-js_time_stamp_previous);
  				just_step_rec_sq1.push(fullCmnd);
  			}
  			websocket.send(fullCmnd);
  			js_time_stamp_previous=Date.now();	
  		}
  	}
  };
  
  function js_LEMO_respons_handler(respons_list) {
  	
  	var rl0 = respons_list[0];
  	var rl2=respons_list[2];
  	if (respons_list.length==9 && rl2==300) {
  		js_gui_format(respons_list); 		
  		if (rl0==':FA') {
  			motorHandler(1,false,false);
  		}else if (rl0==':FB'){
  			motorHandler(2,false,false);
  		}else if (rl0==':S1') {
  			motorHandler(3,false,false);
  		}else if (rl0==':S2') {
  			motorHandler(4,false,false);
  		}
  	}else if (respons_list.length==4 && rl2=='rest') {
  		if (rl0.includes(deviceSelected)) {
  			L1.src='stand_not_step.png';
  		}
  	}
  };
  
  function js_gui_format_playBack(stopCmnd,playBackCmnd) {
  	var cmndAsList = playBackCmnd.split('/');
  	var item3 = cmndAsList[3];
  	if (playBackCmnd.includes(':S')) {
  		if (playBackCmnd.includes('S1')) {
  			motorHandler(3,false,false);
  			}else if (playBackCmnd.includes('S2')) {
  			motorHandler(4,false,false);
  			}
  			if (cmndAsList[2]==201) {
  				clkw.src='clkw.png';
  			}else {
  				clkw.src='aclkw.png';
  			} 			
  			if (!stopCmnd && !isNaN(item3)) {
  				//set slider value
  				spd.value=item3;
  				L1.src='step_not_stand.png';
  			}
  		}else if (playBackCmnd.includes(':F')) {
  			if (playBackCmnd.includes('FA')) {
  				motorHandler(1,false,false);
  			}else if (playBackCmnd.includes('FB')) {
  				motorHandler(2,false,false);
  			}
  			if (cmndAsList[2]==1) {
  				clkw.src='clkw.png';
  			}else {
  				clkw.src='aclkw.png';
  			}
  			if (!stopCmnd && !isNaN(item3)) {
  				spd.value=item3;
  				L1.src='step_not_stand.png';
  			}
  		}
  };
  
function  jStepVstart() {
	//handles the event voice recognition started
}

function  jStepVresult() {
	//handles the event voice recognition started
}

function jStepVend() {
	//handles the event voice recognition stopped
}