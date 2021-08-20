
		
const linkAjust = 30
const beginBlock =  'ctx.moveTo(1.144105, 0.995375);'+
	'ctx.lineTo(202.932040, 0.775465);'+
	'ctx.bezierCurveTo(202.931490, 101.539940, 203.582190, 68.834470, 203.383040, 163.093900);'+
	'ctx.bezierCurveTo(175.745310, 163.056300, 119.111140, 153.741500, 120.469800, 162.981350);'+
	'ctx.bezierCurveTo(141.896790, 210.782850, 66.269715, 213.173700, 85.739625, 162.927050);'+
	'ctx.bezierCurveTo(86.644905, 154.802980, 29.097455, 163.201950, 0.776385, 163.339400);'
	
const beginBlkTemplate = [
beginBlock, 			//0 'puzzelName',pzzl raw data
'puzzelNo',				//1
'the drawing array', //2 'pzlDrawing',
'Begin here',			//3 'pzlTxt',
10,							//4 pzlTxt X
85,						//5 pzlTxt Y
"rgb('0, 0, 0')",		//6 'pzlTxtClr',
'pzlX',					//7
'pzlY',					//8
'fill color ',		 //9 'fillClr',
'line color',			 //10 'lineClr',
"",//11 'highlightClr'
200, 						 //12 block width
192, 							//13 block height
'dialogTxt',				//14
'dialogValue',				//15
'none linkedToBottom',	//16
'none linkedToR1',		//17
'none linkedToR2', 		//18
'none linkedToR3',		//19
'none linkedToTop',		//20
'beginBlock',				//21
'not used',					//22
'image file name - not used', //23
'no inside',				//24
'',							//25
'uniquePzlName'			//26
]

const motorBlock = 'ctx.moveTo(199.804780, 4.906330);'+
	'ctx.bezierCurveTo(172.838540, 3.120260, 148.344920, -0.917120, 121.536650, 2.070990);'+
	'ctx.bezierCurveTo(144.130390, 52.854970, 60.805922, 53.473040, 82.873112, 2.611580);'+
	'ctx.bezierCurveTo(58.887422, -0.994440, 29.610702, 3.638980, 1.002412, 5.421330);'+
	'ctx.lineTo(1.666722, 265.111880);'+
	'ctx.bezierCurveTo(1.666722, 265.111880, 94.745212, 254.067300, 89.574242, 267.298200);'+
	'ctx.bezierCurveTo(68.987572, 319.229350, 141.536650, 307.501000, 119.002440, 266.991000);'+
	'ctx.bezierCurveTo(112.792620, 253.234630, 203.559030, 265.421330, 203.559030, 265.421330);'+
	'ctx.lineTo(201.536660, 204.464190);'+
	'ctx.bezierCurveTo(171.842070, 222.151050, 171.556250, 171.606440, 201.301050, 191.928410);'+
	'ctx.lineTo(201.015890, 134.361700);'+
	'ctx.bezierCurveTo(171.667970, 152.108660, 171.581150, 103.605860, 200.953490, 121.916320);'+
	'ctx.lineTo(200.660540, 63.052750);'+
	'ctx.bezierCurveTo(171.857860, 81.607350, 171.669700, 31.440550, 200.605940, 51.747990);'
	
const mblkOptionsY = [28,100,170]
const mblkOpOffsets = [90*2,20*2,60*2,90*2,130*2]
const FmotorBlkSpec = ['rgb(104, 111, 252)','rgb(16, 41, 110)','FmotorBlock','speed','rotation','']
const SmotorBlkSpec= ['rgb(227, 242, 17)','rgb(149, 158, 14)','SmotorBlock','speed','rotation','steps']

const motorBlkTemplate = [
motorBlock, 			//0 'puzzelName',
'puzzelNo',				//1
'the drawing array', //2 'pzlDrawing',
'Fmotor Block',		//3 'pzlTxt',
10,							//4 pzlTxt X
120,					//5 pzlTxt Y
"rgb('0, 0, 0')",		//6 'pzlTxtClr',
'pzlX',					//7
'pzlY',					//8
'rgb(104, 111, 252)', //9 'fillClr',
"rgb(16, 41, 110)", //10 'lineClr',
"rgb(234, 252, 126)",//11 'highlightClr'
200, 						 //12 block width
292, 							//13 block height
'i am a motor block',				//14
'dialogValue',				//15
'none linkedToBottom',	//16
'none linkedToR1',		//17
'none linkedToR2', 		//18
'none linkedToR3',		//19
'none linkedToTop',		//20
'motorBlock',				//21
['cmndPart1','cmndPart2','cmndPart3','cmndPart4','/;'], //22
//'motorMode',
'image File Name', 		//23
'no inside',				//24
'motor state',				//25
'uniquePzlName'			//26
]

const startStopBlock = 'ctx.moveTo(1.132067, 5.844893);'+
	'ctx.bezierCurveTo(29.898507, 5.173163, 82.032287, -4.592797, 85.816467, 4.871573);'+
	'ctx.bezierCurveTo(62.418347, 55.597743, 144.334060, 51.992143, 119.140320, 4.341062);'+
	'ctx.bezierCurveTo(119.336340, -3.665097, 173.694040, 4.795042, 201.952890, 5.629742);'+
	'ctx.bezierCurveTo(201.952350, 104.207300, 202.599940, 72.211663, 202.401740, 164.425330);'+
	'ctx.bezierCurveTo(174.896480, 164.388630, 118.533730, 155.275920, 119.885880, 164.315210);'+
	'ctx.bezierCurveTo(141.210180, 211.079240, 65.945557, 213.418220, 85.322167, 164.262110);'+
	'ctx.bezierCurveTo(86.223097, 156.314370, 28.951447, 164.531060, 0.766107, 164.665520);'
	
const startBlkSpec = ['rgb(39, 196, 18)','rgb(37, 110, 27)','startBlock','START']
const stopBlkSpec = ['rgb(237, 9, 28)','rgb(120, 14, 23)','stopBlock','STOP']

const startStopBlkTemplate = [
startStopBlock, 			//0 'puzzelName',
'puzzelNo',				//1
'the drawing array', //2 'pzlDrawing',
'stop or start',			//3 'pzlTxt',
20,							//4 pzlTxt X
85,						//5 pzlTxt Y
"rgb('0, 0, 0')",		//6 'pzlTxtClr',
'pzlX',					//7
'pzlY',					//8
'rgb(242, 2, 250)', //9 'fillClr',
"rgb(197, 2, 106)", //10 'lineClr',
"rgb(234, 252, 126)",//11 'highlightClr'
200, 						 //12 block width
191, 							//13 block height
'dialogTxt',				//14
'dialogValue',				//15
'none linkedToBottom',				//16
'none linkedToR1',				//17
'none linkedToR2', 				//18
'none linkedToR3',				//19
'none linkedToTop',			//20
'startStopBlock',				//21
'not used',					//22
'image file name - not used', //23
'no inside',				//24
'',							//25
'uniquePzlName'			//26
]


const delayBlock = 'ctx.moveTo(1.112513, 5.715377);'+
	'ctx.bezierCurveTo(29.461393, 5.058887, 80.838443, -4.485473, 84.567703, 4.764147);'+
	'ctx.bezierCurveTo(61.509213, 54.339301, 142.235910, 50.815501, 117.407860, 4.245667);'+
	'ctx.bezierCurveTo(117.601030, -3.578823, 171.169720, 4.689357, 199.018420, 5.505117);'+
	'ctx.lineTo(199.617530, 77.996871);'+
	'ctx.bezierCurveTo(170.105200, 56.213771, 165.568660, 106.634840, 199.617530, 88.358201);'+
	'ctx.lineTo(199.460740, 160.697530);'+
	'ctx.bezierCurveTo(172.354710, 160.661630, 116.810070, 151.755720, 118.142590, 160.589970);'+
	'ctx.bezierCurveTo(139.157370, 206.292910, 64.985223, 208.578800, 84.080573, 160.537970);'+
	'ctx.bezierCurveTo(84.968423, 152.770570, 28.528083, 160.800800, 0.751863, 160.932230);'
//const delayBlkSpec =['237, 157, 9','135, 98, 30',130,85,'delayBlock']
const delayBlkOffset = [178,55]
// const dlBlkName = ['delay (sec)',5,delayBlkSpec[3]/2]

const delayBlkTemplate = [
delayBlock, 			//0 'puzzelName',
'puzzelNo',				//1
'the drawing array', //2 'pzlDrawing',
'delay (sec)',			//3 'pzlTxt',
20,							//4 pzlTxt X
85,						//5 pzlTxt Y
"rgb('0, 0, 0')",		//6 'pzlTxtClr',
'pzlX',					//7
'pzlY',					//8
'rgb(237, 157, 9)', //9 'fillClr',
"rgb(135, 98, 30)", //10 'lineClr',
"rgb(234, 252, 126)",//11 'highlightClr'
200, 						 //12 block width
191, 							//13 block height
'dialogTxt',				//14
'dialogValue',				//15
'none linkedToBottom',				//16
'none linkedToR1',				//17
'none linkedToR2', 				//18
'none linkedToR3',				//19
'none linkedToTop', 			//20
'delayBlock',				//21
'not used',					//22
'image file name - not used', //23
'no inside',				//24
'',							//25
'uniquePzlName'			//26
]

const nameBlkTemplate = [
delayBlock, 			//0 'puzzelName',
'puzzelNo',				//1
'the drawing array', //2 'pzlDrawing',
'Program Name',			//3 'pzlTxt',
10,							//4 pzlTxt X
85,						//5 pzlTxt Y
"rgb('0, 0, 0')",		//6 'pzlTxtClr',
'pzlX',					//7
'pzlY',					//8
'rgb(128, 255, 255)', //9 'fillClr',
"rgb(96, 120, 120)", //10 'lineClr',
"rgb(234, 252, 126)",//11 'highlightClr'
200, 						 //12 block width
190, 							//13 block height
'I am a name Block',				//14
'dialogValue',				//15
'none linkedToBottom',				//16
'none linkedToR1',				//17
'none linkedToR2', 				//18
'none linkedToR3',				//19
'none linkedToTop', 			//20
'nameBlock',				//21
'not used',					//22
'image file name - not used', //23
'no inside',					//24
'',							//25
'uniquePzlName'			//26
]

const optionBlock = 'ctx.moveTo(23.615215, 24.274215);'+
	'ctx.lineTo(23.701515, 0.736225);'+
	'ctx.lineTo(160.705630, 0.234485);'+
	'ctx.lineTo(160.705630, 55.055875);'+
	'ctx.lineTo(23.261815, 55.055875);'+
	'ctx.lineTo(23.279715, 31.788945);'+
	'ctx.bezierCurveTo(-8.581905, 51.665705, -6.401345, 1.044965, 23.615345, 24.274215);'
	
//const opt1BlkSpec=['5, 247, 231','35, 105, 100',120,36,'option1Block','215, 149, 237']
//const opt2BlkSpec=['249, 255, 163','120, 122, 82',120,36,'option2Block','215, 149, 237']
//const opt3BlkSpec=['245, 196, 242','125, 100, 123',120,36,'option3Block','215, 149, 237']
//const optBlkName = ['option',15,opt1BlkSpec[3]/2,'dialog text']

const optionBlkTemplate = [
optionBlock, 			//0 'puzzelName',
'puzzelNo',				//1
'the drawing array', //2 'pzlDrawing',
'option',			//3 'pzlTxt',
30,							//4 pzlTxt X
36,						//5 pzlTxt Y
"rgb('0, 0, 0')",		//6 'pzlTxtClr',
'pzlX',					//7
'pzlY',					//8
'rgb(5, 247, 231)', //9 'fillClr',
"rgb(35, 105, 100)", //10 'lineClr',
"rgb(215, 149, 237)",//11 'highlightClr'
200, 						 //12 block width
80, 							//13 block height
'dialogTxt',				//14
'dialogValue',				//15
'none linkedToBottom',		//16
'which port',	//17
'not used', 				//18
'not used ',				//19
'none linkedToTop', 			//20
'optionBlock',				//21
'not used',					//22
'image file name - not used', //23
'no inside',					//24
'',							//25
'uniquePzlName'			//26
]	


const motorSelectTemplate = [
startStopBlock, 			//0 'puzzelName',
'puzzelNo',				//1
'the drawing array', //2 'pzlDrawing',
'motor',				//3 'pzlTxt',
25,						//4 pzlTxt X
36/2,						//5 pzlTxt Y
"rgb('0, 0, 0')",		//6 'pzlTxtClr',
'pzlX',					//7
'pzlY',					//8
"rgb(104, 111, 252)", 	//9 'fillClr',
"rgb(35, 105, 100)", //10 'lineClr',
"rgb(215, 149, 237)",//11 'highlightClr'
200, 						//12 block width
190, 						//13 block height
'dialogTxt',			//14
'dialogValue',			//15
'none linkedToBottom',	//16
'not linked to any port',	//17
'not used', 				//18
'not used ',				//19
'none linkedToTop', 		//20
'motorSelect',				//21
'not used',					//22
'image file name', 		//23
'no inside',				//24
'',							//25
'uniquePzlName'			//26
]

const square = 'ctx.rect(4.471770, 4.969432, 92.713615, 101.800690);'


const switchBlock = 'ctx.moveTo(170.746100, 1.000503);'+
	'ctx.bezierCurveTo(164.258560, 1.014303, 157.702070, 1.321843, 151.000010, 2.068863);'+
	'ctx.bezierCurveTo(173.593750, 52.852843, 90.268745, 53.471343, 112.335940, 2.609883);'+
	'ctx.bezierCurveTo(88.350245, -0.996137, 59.073135, 3.636123, 30.464845, 5.418473);'+
	'ctx.lineTo(1.000005, 5.418473);'+
	'ctx.lineTo(1.000005, 348.270040);'+
	'ctx.lineTo(18.343745, 347.645040);'+
	'ctx.bezierCurveTo(18.343745, 347.645040, 119.517460, 336.364070, 114.346490, 349.594970);'+
	'ctx.bezierCurveTo(98.844725, 399.301270, 170.452270, 392.843150, 150.999210, 349.748400);'+
	'ctx.bezierCurveTo(144.789380, 335.992040, 230.999200, 348.548050, 230.999200, 348.548050);'+
	'ctx.lineTo(229.454230, 261.587320);'+
	'ctx.bezierCurveTo(228.078350, 267.130530, 151.021520, 254.076540, 150.068360, 264.863790);'+
	'ctx.bezierCurveTo(171.392660, 311.627820, 96.129245, 313.965210, 115.505860, 264.809090);'+
	'ctx.bezierCurveTo(116.406790, 256.861350, 59.134555, 265.078920, 30.949215, 265.213390);'+
	'ctx.lineTo(31.314455, 106.393070);'+
	'ctx.bezierCurveTo(60.080895, 105.721340, 112.215830, 95.954093, 116.000010, 105.418460);'+
	'ctx.bezierCurveTo(92.601875, 156.144630, 174.516010, 152.540250, 149.322270, 104.889170);'+
	'ctx.bezierCurveTo(149.514520, 97.037203, 201.666560, 104.984570, 230.337900, 106.082530);'+
	'ctx.lineTo(230.123050, 63.051283);'+
	'ctx.bezierCurveTo(201.320370, 81.605883, 201.132120, 31.439153, 230.068350, 51.746593);'+
	'ctx.lineTo(229.267570, 4.904793);'+
	'ctx.bezierCurveTo(209.042890, 3.565243, 190.208700, 0.959123, 170.746090, 1.000493);'
	
	const switchBlkOffset = [-30,157,28,102,0.8,210,30]
const switchBlkTemplate = [
switchBlock, 			//0 'puzzelName',
'puzzelNo',				//1
'the drawing array', //2 'pzlDrawing',
'option',			//3 'pzlTxt',
30,							//4 pzlTxt X
60,						//5 pzlTxt Y
"rgb('0, 0, 0')",		//6 'pzlTxtClr',
'pzlX',					//7
'pzlY',					//8
'rgb(5, 247, 231)', //9 'fillClr',
"rgb(35, 105, 100)", //10 'lineClr',
"rgb(215, 149, 237)",//11 'highlightClr'
240, 						 //12 block width
373, 							//13 block height
'dialogTxt',				//14
'dialogValue',				//15
'linkedToBottom',	//16
'switch name',				//17
'link inside top', 				//18
'link inside bottom',				//19
'linkedToTop', 			//20
'switchBlock',				//21
'not used',					//22
'image file name - not used', //23
'inside',			//24
'',							//25
'uniquePzlName'			//26
]


//test pre load img
blueMotorOff = new Image();
blueMotorOff.src = "blue_motor_off.png";
yellowMotorOff = new Image();
yellowMotorOff.src = "yellow_motor_off.png";
lightSelect = new Image();
lightSelect.src = "lamp_selected_on.png";

//these are the specifications for the puzzlels that go into the menu																															
const menuItemsSpecs = [
['beginBlk',
/*1*/beginBlkTemplate, //unique name for the pzl
/*2*/beginBlock,
/*3*/'Begin Here',
/*4*/'rgb(242, 2, 250)',
/*5*/'rgb(197, 2, 106)',
/*6*/'rgb(234, 252, 126)',
/*7*/'no text',
/*8*/'no img'
],
['nameBlk',
/*1*/nameBlkTemplate,
/*2*/delayBlock,
/*3*/'Program Name',
/*4*/'rgb(128, 255, 255)',
/*5*/'rgb(96, 120, 120)',
/*6*/'rgb(234, 252, 126)',
/*7*/'Give your program a name',
/*8*/'no image'
],
['FAmotorBlk',
/*1*/motorBlkTemplate,
/*2*/motorBlock,
/*3*/'FA motor',
/*4*/'rgb(104, 111, 252)',
/*5*/'rgb(16, 41, 110)',
/*6*/'',
/*7*/['Enter the speed (50-999)','Enter the turn direction (0 or 1)','Enter the Mode','Enter the Tempo (100 - 1000)'],
/*8*/blueMotorOff
],
['FBmotorBlk',
/*1*/motorBlkTemplate,
/*2*/motorBlock,
/*3*/'FB motor',
/*4*/'rgb(104, 111, 252)',
/*5*/'rgb(16, 41, 110)',
/*6*/'',
/*7*/['Enter the speed (50-999)','Enter the turn direction (0 or 1)','Enter the Mode','Enter the Tempo (100 - 1000)'],
/*8*/blueMotorOff
],
['S1motorBlk', //this indicates the shape of the pzl
/*1*/motorBlkTemplate,
/*2*/motorBlock,
/*3*/'S1 motor',
/*4*/'rgb(227, 242, 17)',
/*5*/'rgb(149, 158, 14)',
/*6*/'',
/*7*/['Enter the speed (1-800)','Enter the turn direction (200 or 201)','Enter the no of steps (1-999)'],
/*8*/yellowMotorOff
],
['S2motorBLk',
/*1*/motorBlkTemplate,
/*2*/motorBlock,
/*3*/'S2 motor',
/*4*/'rgb(227, 242, 17)',
/*5*/'rgb(149, 158, 14)',
/*6*/'',
/*7*/['Enter the speed (1-800)','Enter the turn direction (200 or 201)','Enter the no of steps (1-999)'],
/*8*/yellowMotorOff
],
['delayBlk',
/*1*/nameBlkTemplate,
/*2*/delayBlock,
/*3*/'Delay',
/*4*/'rgb(237, 157, 9)',
/*5*/'rgb(135, 98, 30)',
/*6*/'rgb(234, 252, 126)',
/*7*/'Enter the delay is seconds',
/*8*/''
],
['startBlk',
/*1*/startStopBlkTemplate,
/*2*/startStopBlock,
/*3*/'START',
/*4*/'rgb(39, 196, 18)',
/*5*/'rgb(37, 110, 27)',
/*6*/'',
/*7*/'',
/*8*/''
],
['stopBlk',
/*1*/startStopBlkTemplate,
/*2*/startStopBlock,
/*3*/'STOP',
/*4*/'rgb(237, 9, 28)',
/*5*/'rgb(120, 14, 23)',
/*6*/'',
/*7*/'',
/*8*/''
],
['FAselect',
/*1*/startStopBlkTemplate,
/*2*/startStopBlock,
/*3*/'1device :FA/',
/*4*/'rgb(104, 111, 252)',
/*5*/'rgb(16, 41, 110)',
/*6*/'',
/*7*/'',
/*8*/blueMotorOff
],
['FBselect',
/*1*/startStopBlkTemplate,
/*2*/startStopBlock,
/*3*/'2device :FB/',
/*4*/'rgb(104, 111, 252)',
/*5*/'rgb(16, 41, 110)',
/*6*/'',
/*7*/'',
/*8*/blueMotorOff
],
['S1select',
/*1*/startStopBlkTemplate,
/*2*/startStopBlock,
/*3*/'3device :S1/',
/*4*/'rgb(227, 242, 17)',
/*5*/'rgb(149, 158, 14)',
/*6*/'',
/*7*/'',
/*8*/yellowMotorOff
],
['S2select',
/*1*/startStopBlkTemplate,
/*2*/startStopBlock,
/*3*/'4device :S2/',
/*4*/'rgb(227, 242, 17)',
/*5*/'rgb(149, 158, 14)',
/*6*/'',
/*7*/'',
/*8*/yellowMotorOff
],
['optionBlk',
/*1*/optionBlkTemplate,
/*2*/optionBlock,
/*3*/'OPTION',
/*4*/'rgb(5, 247, 231)',
/*5*/'rgb(35, 105, 100)',
/*6*/'rgb(215, 149, 237)',
/*7*/'',
/*8*/'no img'
],
['FAsensor',
/*1*/nameBlkTemplate,
/*2*/delayBlock,
/*3*/'SensorFA',
/*4*/'rgb(255, 189, 252)',
/*5*/'rgb(114, 148, 1)',
/*6*/'rgb(255, 252, 168)',
/*7*/'Enter the sensor type (1 or 2)',
/*8*/'no img'
],
['FBsensor',
/*1*/nameBlkTemplate,
/*2*/delayBlock,
/*3*/'SensorFB',
/*4*/'rgb(255, 189, 252)',
/*5*/'rgb(114, 148, 1)',
/*6*/'rgb(255, 252, 168)',
/*7*/'Enter the sensor type (1 or 2)',
/*8*/'no img'
],
['S1wait',
/*1*/startStopBlkTemplate,
/*2*/startStopBlock,
/*3*/'S1wait',
/*4*/'rgb(169, 181, 0)',
/*5*/'rgb(93, 99, 2)',
/*6*/'rgb(255, 252, 168)',
/*7*/'wait for S1 to stop',
/*8*/'no img'
],
['S2wait',
/*1*/startStopBlkTemplate,
/*2*/startStopBlock,
/*3*/'S2wait',
/*4*/'rgb(169, 181, 0)',
/*5*/'rgb(93, 99, 2)',
/*6*/'rgb(255, 252, 168)',
/*7*/'wait for S2 to stop',
/*8*/'no img'
],
['Sound',
/*1*/nameBlkTemplate,
/*2*/delayBlock,
/*3*/'Play Sound',
/*4*/'rgb(172, 71, 255)',
/*5*/'rgb(83, 32, 125)',
/*6*/'rgb(255, 252, 168)',
/*7*/'Select a sound name',
/*8*/'no img'
],
['voice',
/*1*/nameBlkTemplate,
/*2*/delayBlock,
/*3*/'Wait for voice command',
/*4*/'rgb(138, 89, 26)',
/*5*/'rgb(255, 255, 255)',
/*6*/'rgb(255, 252, 168)',
/*7*/'Enter the Phrase or name to wait for',
/*8*/'no img'
],
['switch',
/*1*/switchBlkTemplate,
/*2*/switchBlock,
/*3*/'switch on/off',
/*4*/'rgb(163, 36, 40)',
/*5*/'rgb(0, 0, 0)',
/*6*/'rgb(124, 102, 138)',
/*7*/'give the switch a name',
/*8*/'no img',
/*9*/['x1',146,'x2',226],
],
['lightsBlk',
/*1*/motorBlkTemplate, //this is the pzl array
/*2*/motorBlock,		//this is the raw file for the drawing
/*3*/'light', //this is the txt displayed on pzl
/*4*/'rgb(255, 255, 168)',
/*5*/'rgb(115, 115, 80)',
/*6*/'rgb(255, 255, 0)',
/*7*/['Light Mode','Flash tempo (seconds)','Light number (1-4)'], //options prompts
/*8*/lightSelect
],
['lightSelect',
/*1*/nameBlkTemplate,
/*2*/delayBlock,
/*3*/'Light',
/*4*/'rgb(255, 255, 168)',
/*5*/'rgb(255, 255, 255)',
/*6*/'rgb(255, 252, 168)',
/*7*/'Enter the light number',
/*8*/lightSelect
],
] //end of puzzel specifications

const deviceCmndBuffer = [
['FA','none'],
['FB','none'],
['S1','none'],
['S2','none'],
['Sound','none'],
['light 1','none'],
['light 2','none'],
['light 3','none'],
['light 4','none'] //not used
]

/*is it a complex motor command of type B 
   * example :FA/XX/102/;
  102 shake
  103 crawl
  104 dance
  105 pendulum - change to 424 :/LEMO Metronome/424/605/;
  106 quarter step
  107 
  108 not used
  170 swing L
  171 swing R
  180 sensorR
  181 sensorA
  182 sensor no spring triger on rise and fall
  199 stop*/
  
const fMotorModes = [
['Spin',0],
['Shake',102],
['Metronome',424], //has a parameter cadance
['Sensor0',180],
['Sensor1',181]
]

const lemoSounds = [
['Beep','truck_beep.mp3'],
['Siren','siren.mp3'],
['none','']
]

const lightModes = [
['On',601],
['Off',600],
['Blink on',604],
['Blink off',603]
]

//symbols

const redX = 'ctx.moveTo(3.512017, 0.681720);'+
	'ctx.lineTo(19.281465, 26.140327);'+
	'ctx.lineTo(0.894308, 54.579684);'+
	'ctx.lineTo(10.281465, 54.979989);'+
	'ctx.lineTo(27.985547, 35.611976);'+
	'ctx.lineTo(45.790654, 55.351190);'+
	'ctx.lineTo(54.730151, 55.172186);'+
	'ctx.lineTo(37.811941, 26.223046);'+
	'ctx.lineTo(53.657312, 0.680884);'+
	'ctx.lineTo(44.630988, 0.504049);'+
	'ctx.lineTo(28.281466, 16.713575);'+
	'ctx.lineTo(12.835975, 0.601652);'+
	'ctx.lineTo(3.512017, 0.681722);'


	