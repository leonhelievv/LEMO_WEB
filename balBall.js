
var balance_beam_count=0
var balance_beam_travel=0
var balance_ball_phase=0

function initBalBall() {
	console.log('at ballance init ball ');
	//cleanup nav
	navPlay.style.display='none';
	clkwArea.style.display='none';
	
	currentPlay='LEMO balance ball';
	playImg.src='balance_ball.png';
	playIcon.style.display='block';
	play.style.display='block';	
	title.innerHTML=currentPlay;
	
	balance_ball_phase=1
	balance_beam_count=0
	
	L1.src='roll_down.png'
	L1.style.display='block'
	L1.addEventListener('click',balance_ball_left_down)
	R1.src='roll_down.png'
	R1.style.display='block'
	R1.addEventListener('click',balance_ball_right_down)
	R2.src='ok.png'
	R2.style.display='block'
	R2.addEventListener('click',balance_ball_ok)
	
	//build instruction area
	//buildCallOut()
	callOut.style.display = 'block'
	instruct.style.display = 'block'
	instruct.style.fontSize = '50px'
	instruct.style.color = 'black'
	instruct.innerText='Set your balance beam level.'
	instruct.style.backgroundColor='#ebe134'
	//prepare motors
	motors.style.display='block'
	motorsDisplay(99)
	motorsDisplay(1)
};

function balBallCleanup() {
	console.log('at ballance ball cleanup');
	//restore motors
	motorsDisplay(99)
	//mute instruction area
	//var co = document.getElementById('callOut')
	//co.remove();
	callOut.style.display = 'none'
	free_S_motors('LEMO balance ball');
	L1.removeEventListener('click',balance_ball_left_down);
	R1.removeEventListener('click',balance_ball_right_down);
	R2.removeEventListener('click',balance_ball_ok);
	
};


function balance_ball_left_down() {
	if (balance_ball_phase == 1) {
		//clkw speed revs
		step_motor_1(false,100,1)
		R2.style.display='block'
	}else if (balance_ball_phase == 2) {
		balance_beam_count=balance_beam_count+1
		R2.style.display='block'
		step_motor_1(false,100,1)
	}else if (balance_ball_phase == 4) {
		if (balance_beam_count<balance_beam_travel) {
			step_motor_1(false,600,2)
			balance_beam_count=balance_beam_count+1
			instruct.innerText='Roll the ball.';
			instruct.style.backgroundColor='#1ab814'
		}else {
			instruct.innerText='Maximum travel reached.';
			instruct.style.backgroundColor='#e01d1d'
		}
	}
};

function balance_ball_right_down() {
	if (balance_ball_phase==1) {
		step_motor_1(true,100,1)
		R2.style.display='block'
	}else if (balance_ball_phase=4) {
		if (balance_beam_count>0-balance_beam_travel) {
			step_motor_1(true,600,2)
			balance_beam_count=balance_beam_count-1
			instruct.innerText='Roll the ball.';
			instruct.style.backgroundColor='#37e01d'			
	}else{
		instruct.innerText='Maximum travel reached.';
		instruct.style.backgroundColor='#e01d1d'
	}
	}
};

function balance_ball_ok() {
	if (balance_ball_phase==1) {
		balance_ball_do_P2()
		balance_ball_phase=2
	}else if (balance_ball_phase==2) {
		balance_beam_travel=balance_beam_count
		balance_ball_phase=3
		balance_ball_do_P3()
	}else if (balance_ball_phase==3) {
		balance_ball_do_P4()
	}
};

function balance_ball_do_P2() {
	balance_ball_phase=2
	instruct.innerText='Set the maximum travel of the balance beam.';
	instruct.style.backgroundColor='#e01d1d'
	L1.style.display='block'
	R1.style.display='none'
	R2.style.display='none'
};

function balance_ball_do_P3() {
	step_motor_1(false,999,balance_beam_count*1)
	balance_beam_count=0
	instruct.innerText='Place your ball on the balance beam.';
	instruct.style.backgroundColor='#e01d1d'
	L1.style.display='none'
	R1.style.display='none'
	R2.style.display='block'
};

function balance_ball_do_P4() {
	balance_ball_phase=4
	instruct.innerText='Roll the ball.';
	instruct.style.backgroundColor='#37e01d'
	L1.style.display='block'
	R1.style.display='block'
	R2.style.display='none'
};

function step_motor_1(clkw,speed,revs) {
	var cm =(clkw==true) ? '/201/':'/200/';
	var allCmnd = ':'+deviceSelected+'/'+currentPlay+cm+speed+'/'+revs+'/;'
	appCmndToLemo(allCmnd)
};
