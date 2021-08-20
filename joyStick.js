    
var jStkCtx = joystkCanvas.getContext('2d');
var joyS;  
var joyStable;
var x1,y1,speed,angle_in_degrees
const joyLmotor = document.getElementById('leftMotor')
const joyRmotor = document.getElementById('rightMotor')
   
    function initJoyStick() {
    	//console.log('at init joy stick')	
    	currentPlay='LEMO joystick';  	
    	joystickArea = document.getElementById('joystickArea');
    	joystickCanvas = document.getElementById('joystkCanvas');
    	navPlay.style.display='none';
    	iconArea.style.display='none';
    	playL.style.display='none';
    	playR.style.display='none';
    	joystickArea.style.display='block';
    	joystickCanvas.style.display='block';
    	play.style.display='block';	
		title.innerHTML=currentPlay;    
      //only S motors
      motorsDisplay(99); //1 is only s motors        
      motorsDisplay(1); //1 is only s motors
      //assign eventListener to clkwIcons
      joyLmotor.addEventListener('touchend',joyL1Clkw)                 
      joyRmotor.addEventListener('touchend',joyR1Clkw)                 
      joystkCanvas.addEventListener('mousedown', startDrawing);
      joystkCanvas.addEventListener('mouseup', stopDrawing);
      joystkCanvas.addEventListener('mousemove', Draw);
      joystkCanvas.addEventListener('touchstart', startDrawing);
      joystkCanvas.addEventListener('touchend', stopDrawing);
      joystkCanvas.addEventListener('touchcancel', stopDrawing);
      joystkCanvas.addEventListener('touchmove', Draw);   
      window.addEventListener('resize', resize);	
		resize();
    };
    
    function joyStickCleanup(){ 
    	joystkCanvas.removeEventListener('mousedown', startDrawing);
      joystkCanvas.removeEventListener('mouseup', stopDrawing);
      joystkCanvas.removeEventListener('mousemove', Draw);
      joystkCanvas.removeEventListener('touchstart', startDrawing);
      joystkCanvas.removeEventListener('touchend', stopDrawing);
      joystkCanvas.removeEventListener('touchcancel', stopDrawing);
      joystkCanvas.removeEventListener('touchmove', Draw);     
      joystickArea.style.display='none';     
      navPlay.style.display='block';
    	iconArea.style.display='block';
    	playL.style.display='block';
    	playR.style.display='block';    
      window.removeEventListener('resize', resize);
      free_F_motors('LEMO joystick');
		free_S_motors('LEMO joystick');		
		motorsDisplay(99); //99 is display all
		joyLmotor.removeEventListener('touchend',joyL1Clkw)                 
      joyRmotor.removeEventListener('touchend',joyR1Clkw)  
		console.log('at joyStick cleanup');		
    };
 
        var width, height, radius, x_orig, y_orig;
        
        function resize() {
            //width = window.innerWidth;       
            //width = lemoW/4*2;           
            width = lemoW           
            //radius = 80;
            //radius = width/3.25;
            //radius = width/4
            radius = width/3
            height = radius * 6.5;      
            //jStkCtx.joystkCanvas.width = width;
            joystkCanvas.width = width;
            //jStkCtx.joystkCanvas.height = height;
            //joystkCanvas.height = height;
            joystkCanvas.height = width;
            background();
            //joystick(width / 2, height / 3);         
            joystick(width / 2, height / 4);         
        }

        function background() {
            x_orig = width / 2;
            //y_orig = height / 3;
            y_orig = height / 4;
            //y_orig = height/2 ;
            jStkCtx.beginPath();
            jStkCtx.arc(x_orig, y_orig, radius + 20, 0, Math.PI * 2, true);
            jStkCtx.fillStyle = '#050505';
            jStkCtx.strokeStyle = '#ff0000';
            jStkCtx.lineWidth = 5;
            jStkCtx.fill();
            jStkCtx.stroke();
        }

        function joystick(width, height) {
            jStkCtx.beginPath();
            jStkCtx.arc(width, height, radius/2, 0, Math.PI * 2, true);
            //jStkCtx.arc(width, height*1.5, radius/2, 0, Math.PI * 2, true);
            jStkCtx.fillStyle = '#ff0905';
            jStkCtx.fill();
            jStkCtx.strokeStyle = '#8a0c0a';
            jStkCtx.lineWidth = 8;
            jStkCtx.stroke();
        }

        let coord = { x: 0, y: 0 };
        let paint = false;

        function getPosition(event) {
            var mouse_x = event.clientX || event.touches[0].clientX;
            var mouse_y = event.clientY || event.touches[0].clientY;
            coord.x = mouse_x - joystkCanvas.offsetLeft;
            coord.y = mouse_y - joystkCanvas.offsetTop;
        }

        function is_it_in_the_circle() {
            var current_radius = Math.sqrt(Math.pow(coord.x - x_orig, 2) + Math.pow(coord.y - y_orig, 2));
            if (radius >= current_radius) return true
            else return false
        }

        function startDrawing(event) {
            paint = true;
            getPosition(event);
            if (is_it_in_the_circle()) {
                jStkCtx.clearRect(0, 0, joystkCanvas.width, joystkCanvas.height);
                background();
                joystick(coord.x, coord.y);
                Draw(event);
            }
        }

        function stopDrawing() {
            paint = false;
            jStkCtx.clearRect(0, 0, joystkCanvas.width, joystkCanvas.height);
            background();
            //joystick(width / 2, height / 3);
            joystick(width / 2, height / 4);
            //send stop cmnd
            websocket.send(':S1/LEMO joystick/199/;'); 
            websocket.send(':S2/LEMO joystick/199/;');
            motorsDisplay(3);
        }

        function Draw(event) {
            if (paint) {
                //jStkCtx.clearRect(0, 0, joystkCanvas.width, joystkCanvas.height);
                jStkCtx.clearRect(0, 0, joystkCanvas.width, joystkCanvas.height);
                background();
                
                var angle = Math.atan2((coord.y - y_orig), (coord.x - x_orig));

                if (Math.sign(angle) == -1) {
                    angle_in_degrees = Math.round(-angle * 180 / Math.PI);
                }
                else {
                    angle_in_degrees =Math.round( 360 - angle * 180 / Math.PI);
                }

                if (is_it_in_the_circle()) {
                    joystick(coord.x, coord.y);
                    x = coord.x;
                    y = coord.y;
                }
                else {
                    x = radius * Math.cos(angle) + x_orig;
                    y = radius * Math.sin(angle) + y_orig;
                    joystick(x, y);
                }
         
                getPosition(event);

                speed =  Math.round(100 * Math.sqrt(Math.pow(x - x_orig, 2) + Math.pow(y - y_orig, 2)) / radius);
                //var x_relative = Math.round(x - x_orig);
                x1 = Math.round(x - x_orig);
                y1 = Math.round(y - y_orig);
 
                clearTimeout(joyS);
                joyS=window.setTimeout(joystickHandler,100);
            }
        };
        
   function joystickHandler() { 	
    	var mSpdL=0;
   	var mSpdR=0;
   	var diffs=0;
   	var mapSpeed=0;
   	var qrtr='';
   	var angle=angle_in_degrees
   	var Lcmnd
   	var Rcmnd
   	const Lclkw = joyLmotor.src.includes('/clkw.png')
   	const Rclkw = joyRmotor.src.includes('/clkw.png')
   	const rightClkw = R1.src.includes('/clkw.png')
   	//calc mapSpeed
   	mapSpeed=speed.map(0,100,100,900); 
   	//console.log(speed.map(0,100,100,900)); 
   	
   	if (angle <= 180 && angle >= 90) {
   		//forward left
   		qrtr='forward left';
   		Lcmnd = (Lclkw==true) ? 201:200;
   		Rcmnd = (Rclkw==true) ? 201:200;
   		mSpdR=mapSpeed
   		if (angle != 180) {   			
   			diffs=(180-angle)/90
   			mSpdL=Math.trunc(mapSpeed*diffs);
   		}else {
   			mSpdL=0
   		}  		
   	}else if (angle<=90 && angle>=0 ) {
   		//forward right
   		qrtr='forward right';
   		Lcmnd = (Lclkw==true) ? 201:200;
   		Rcmnd = (Rclkw==true) ? 201:200;
   		mSpdL=mapSpeed
   		if (angle != 0) {
   			diffs=angle/90
   			mSpdR=Math.trunc(mapSpeed*diffs);
   		}else {
   			mSpdR=0;
   		}
   	}else if (angle<=270 && angle >=180) {
   		//backward left
   		qrtr='backward left';
   		Lcmnd = (Lclkw==true) ? 200:201;
   		Rcmnd = (Rclkw==true) ? 200:201;
   		mSpdR=mapSpeed
   		if (angle==270) {
   			mSpdL=mapSpeed
   			}else if(angle==180){
   				mSpdL=0
   			}else{
   				var d=(270-angle)/90
   				diffs=1-d
   				mSpdL=Math.trunc(mapSpeed*diffs);
   			}
   	}else if (angle>=270 && angle<=360) {
   		//backward right
   		qrtr='backward right';
   		mSpdL=mapSpeed
   		Lcmnd = (Lclkw==true) ? 200:201;
   		Rcmnd = (Rclkw==true) ? 200:201;
   		if (angle==360) {
   			mSpdR=0
   		}else{
   			diffs=(360-angle)/90
   			mSpdR=Math.trunc(mapSpeed*diffs);
   		}
   	}
   	websocket.send(':S1/LEMO joystick/'+Lcmnd+'/'+mSpdL+'/999/;');  
   	websocket.send(':S2/LEMO joystick/'+Rcmnd+'/'+mSpdR+'/999/;');
   	//update GUI mpotors
   	motorsDisplay(2);
   	console.log('cmnd was sent xxx > '+mSpdL+' R > '+mSpdR);
   };
        
        
  Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  };
  
  function joyL1Clkw() {  
  	  	var msg = 'turn around';
  	if (joyLmotor.src.includes("/aclkw.png")) { 		
  		joyLmotor.src='clkw.png';
  	}else {	
  		joyLmotor.src='aclkw.png';
  	} 	 
  };
  
  function joyR1Clkw() {  
  	  	var msg = 'turn around';
  	if (joyRmotor.src.includes("/aclkw.png")) { 		
  		joyRmotor.src='clkw.png';	
  	}else {	
  		joyRmotor.src='aclkw.png';
  	} 	 
  };




    
        
        
        