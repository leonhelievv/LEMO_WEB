    
var canvas, ctx;
var joyS;  
var joyStable;
var x1,y1,speed,angle_in_degrees

   
    function initJoyStick() {
    		
    	currentPlay='LEMO joystick';
    	//document.getElementById('nav').style.display='none';
    	navPlay.style.display='none';
    	canvas = document.getElementById('joyStick')
    	document.getElementById('playIcon').style.display='none';
    	canvas.style.display='block';
    	document.getElementById('play').style.display='block';	
		title.innerHTML=currentPlay;
		sliderArea.style.display='none';
		clkw.style.display='block';
		clkw.src='joyStick.png'		
      ctx = canvas.getContext('2d');
      //clkw motors
      L1.src='clkw.png';
      L1.style.display='block'
      L1.addEventListener('click',joyL1Clkw);
      R1.src='clkw.png';
      R1.style.display='block'
      R1.addEventListener('click',joyR1Clkw);
     
      //only S motors
      motorsDisplay(1); //1 is only s motors        
            
       canvas.addEventListener('mousedown', startDrawing);
       canvas.addEventListener('mouseup', stopDrawing);
       canvas.addEventListener('mousemove', Draw);
       canvas.addEventListener('touchstart', startDrawing);
       canvas.addEventListener('touchend', stopDrawing);
       canvas.addEventListener('touchcancel', stopDrawing);
       canvas.addEventListener('touchmove', Draw);
       
       window.addEventListener('resize', resize);
		
		resize();
    };
    
    function joyStickCleanup(){
    	document.getElementById('playIcon').style.display='block';
    	document.getElementById('joyStick').style.display='none';
    	
    	canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mousemove', Draw);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
      canvas.removeEventListener('touchmove', Draw);
      
      window.removeEventListener('resize', resize);
      L1.style.display='none'
      L1.removeEventListener('click',joyL1Clkw);
      R1.style.display='none'
      L1.removeEventListener('click',joyL1Clkw);
      R1.removeEventListener('click',joyR1Clkw);
      free_F_motors('LEMO joystick');
		free_S_motors('LEMO joystick');
		
		motorsDisplay(99); //99 is display all
		console.log('at just step cleanup');
		initNav();	
    };
            
        //window.addEventListener('load', () => {   
        //});
    
        var width, height, radius, x_orig, y_orig;
        
        function resize() {
            //width = window.innerWidth;       
            width = lemoW/4*2;           
            //radius = 80;
            radius = width/3.25;
            height = radius * 6.5;      
            ctx.canvas.width = width;
            ctx.canvas.height = height;
            background();
            joystick(width, height);         
        }

        function background() {
            x_orig = width / 2;
            y_orig = height / 3;            
            ctx.beginPath();
            ctx.arc(x_orig, y_orig, radius + 20, 0, Math.PI * 2, true);
            ctx.fillStyle = '#050505';
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 5;
            ctx.fill();
            ctx.stroke();
        }

        function joystick(width, height) {
            ctx.beginPath();            
            ctx.arc(width, height, radius/2, 0, Math.PI * 2, true);
            ctx.arc(x_orig, y_orig, radius/2, 0, Math.PI * 2, true);
            ctx.fillStyle = '#ff0905';
            ctx.fill();
            ctx.strokeStyle = '#8a0c0a';
            ctx.lineWidth = 8;
            ctx.stroke();
        }

        let coord = { x: 0, y: 0 };
        let paint = false;

        function getPosition(event) {
            var mouse_x = event.clientX || event.touches[0].clientX;
            var mouse_y = event.clientY || event.touches[0].clientY;
            coord.x = mouse_x - canvas.offsetLeft;
            coord.y = mouse_y - canvas.offsetTop;
            
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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                background();
                joystick(coord.x, coord.y);
                Draw();
            }
        }

        function stopDrawing() {
            paint = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            background();
            joystick(width, height);
            //send stop cmnd
            websocket.send(':S1/LEMO joystick/199/;'); 
            websocket.send(':S2/LEMO joystick/199/;');
            motorsDisplay(3);
        }

        function Draw(event) {
            if (paint) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                //var y_relative = Math.round(y - y_orig);
                
                //console.log("x_coordinate"+x_relative);
                //console.log("y_coordinate"+y_relative);
                //console.log("speed"+speed);
                //console.log("angle")+angle_in_degrees;
                //document.getElementById('debug').innerHTML='X = '+x1+' Y = '+y1+' speed '+speed+' angle '+angle_in_degrees;
                //make desision when to send cmnd
                // if stable for 100ms send
                //joyS=window.setTimeout(send( x1,y1,speed,angle_in_degrees), 100);
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
   	const Lclkw = L1.src.includes('/clkw.png')
   	const Rclkw = R1.src.includes('/clkw.png')
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
   	console.log('cmnd was sent L > '+mSpdL+' R > '+mSpdR);
   };
        
        
  Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  };
  
  function joyL1Clkw() {  
  	  	var msg = 'turn around';
  	if (L1.src.includes("/aclkw.png")) { 		
  		L1.src='clkw.png';
  	}else {	
  		L1.src='aclkw.png';
  	} 	 
  };
  
  function joyR1Clkw() {  
  	  	var msg = 'turn around';
  	if (R1.src.includes("/aclkw.png")) { 		
  		R1.src='clkw.png';	
  	}else {	
  		R1.src='aclkw.png';
  	} 	 
  };




    
        
        
        