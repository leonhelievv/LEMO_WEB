const service_uuid = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
const characteristic_uuid_RX = "beb5483e-36e1-4688-b7f5-ea07361b26a8"
const characteristic_uuid_TX = "beb5483e-36e1-4688-b7f5-ea07361b26a8"

const dBug = document.getElementById('dBug');

// Characteristic object cache
let characteristicCache = null;
// Selected device object cache
let deviceCache = null;
let lemoDevice = null;
//respons check flag
let responsCheckFlag = false;
//waiting on respons flag
let awaitRespons = false;

let previousRespons = 'none';
let nowRespons = 'none';

//Resolve 
let awaitTxResolve = false;
let awaitReadResolve = false;

//lemo cmnd
let appCmndToLemoFlag = false;
let newAppCmnd = 'none';

let txMitterFree = true;
// Get references to UI elements

async function findMyLemo() {
  try {
    console.log('Requesting any Bluetooth device...');
    document.getElementById('dBug').innerHTML = 'Requesting any Bluetooth device...'
    const device = await navigator.bluetooth.requestDevice({
     // filters: [...] <- Prefer filters to save energy & show relevant devices.
        acceptAllDevices: true});
    //console.log('> Requested ' + device.name);
    document.getElementById('dBug').innerHTML = '> Requested ' + device.name
    await device.watchAdvertisements;
    BLE_setup()
  } catch(error) {
    console.log('Argh! ' + error);
    document.getElementById('dBug').innerHTML = 'ERROR ! ' + error;
  }
}


function BLE_setup() {
	//alert("at BLE setUp")
	connect().then(function() {
  		console.log("device is connected");
  		dBug.innerText = "device is connected";
  		cleanupBLE();
	});
};

// Launch Bluetooth device chooser and connect to the selected
function connect() {
	return (deviceCache ? Promise.resolve(deviceCache) :
      requestBluetoothDevice()).
      then(device => connectDeviceAndCacheCharacteristic(device)).
      //catch(error => console.log('connect Error !! '+error))    
      catch(error => document.getElementById('dBug').innerHTML = 'connect Error !! '+error)    
}

function requestBluetoothDevice() {
  console.log('Requesting bluetooth device...');
  document.getElementById('dBug').innerHTML = 'Requesting bluetooth device...';
  
  return navigator.bluetooth.requestDevice({  
   //filters: [{services: [service_uuid]}],
   filters: [{name: 'LEMO nov21 18:45'}],
      //optionalServices: ['beb5483e-36e1-4688-b7f5-ea07361b26a8']
      optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
  }).
      then(device => {
        console.log('"' + device.name + '" bluetooth device selected');
        document.getElementById('dBug').innerHTML = '"' + device.name + '" bluetooth device selected';
        deviceCache = device;
        // Added line
        deviceCache.addEventListener('gattserverdisconnected',handleDisconnection);
        return deviceCache;
//      });
      }).
      catch(error => document.getElementById('dBug').innerHTML = 'connect Error !! '+error)   
}

// Connect to the device specified, get service and characteristic
function connectDeviceAndCacheCharacteristic(device) {
	
	if (device.gatt.connected && characteristicCache) {
  	//there is a client connected and there is a characteristicCache
    	return Promise.resolve(characteristicCache);
 	}

  console.log('try to Connecting to GATT server...')
  document.getElementById('dBug').innerHTML = 'try to Connecting to GATT server...'
  return device.gatt.connect().
      then(server => {
        console.log('GATT server connected, getting service...');
        document.getElementById('dBug').innerHTML = 'GATT server connected, getting service...'
        //return server.getPrimaryService(service2_uuid);
        return server.getPrimaryService(service_uuid);
      }).
      then(service => {
        console.log('Service found, getting characteristic...');
        document.getElementById('dBug').innerHTML = 'Service found, getting characteristic...'
        //const Characteristic = service.getCharacteristic(characteristic2_uuid);
        const Characteristic = service.getCharacteristic(characteristic_uuid_RX);
        
        return Characteristic
      }).
      then(characteristic => {
        console.log('Characteristic found' + characteristic);       
        document.getElementById('dBug').innerHTML = 'Characteristic found '+ characteristic
        characteristicCache = characteristic;
        //set event handler
        characteristicCache.addEventListener('characteristicvaluechanged',resultFromRead);       
        //characteristicCache.addEventListener('characteristicvaluechanged',valueChanged);       
        return characteristicCache;
      });
};


//do disconnect when lemo window close ??? - i think it is automatic
function disconnect() {
  if (deviceCache) {
  	//there is a lemo 
   if (deviceCache.gatt.connected) {
    //the lemo is connected
    //console.log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
    deviceCache.removeEventListener('gattserverdisconnected',handleDisconnection);
    deviceCache.gatt.disconnect();
    console.log(deviceCache.name + '"lemo disconnected');
    deviceCache = null;
    }
    else {
      console.log('"' + deviceCache.name +'" lemo is already disconnected');
    }
  } else {
  	console.log('nothing to disconnect');
  }
}

function appCmndToLemo(appCmnd) {
	if (txMitterFree == true) {
		//not busy sending a cmnd
		appCmndToLemoFlag = true;
		newAppCmnd = appCmnd;
		if (awaitRespons == true) {
			//some play is waiting for a response
			setTimeout(getResponse,100);
		}
		bleTransmit(appCmnd);
		newAppCmnd = 'none';
	}else {
		//busy sending cmnd
		console.log('Error still busy sending a cmnd !!!! ');
		document.getElementById('dBug').innerHTML = 'Error still busy sending a cmnd !!!! '
	}
};

function bleTransmit(data) {
	//test if lemo is and if connected
	if (deviceCache) {
  	//there is a lemo 
   	if (deviceCache.gatt.connected) {
    		//the lemo is connected
      	let buffer = new ArrayBuffer(data.length);
      	let dataView = new DataView(buffer);
      	for (var i = 0; i <data.length; i++) {
        		dataView.setUint8( i, data.charAt(i).charCodeAt() );
      	}
			if (txMitterFree == true){
      		console.log('accessing the device to send: '+data);
      		document.getElementById('dBug').innerHTML = 'accessing the device to send: '+data
      		txMitterFree = false;
      		//awaitTxResolve = true;
      		//return characteristicCache.writeValue(buffer)//.then(function() {
      		characteristicCache.writeValue(buffer).then(function() {
  					console.log("after done make transmitter flag free true");
  					txMitterFree = true;		
				})
			}else {
				console.log('error txMitter is not free');
				document.getElementById('dBug').innerHTML = 'error txMitter is not free'
			}
      }else{
      	//the lemo is not connected
      	console.log('the lemo is not connected');
      	document.getElementById('dBug').innerHTML = 'the lemo is not connected'
      }
   }else{
   	console.log('cant send - no lemo')
   	document.getElementById('dBug').innerHTML = 'cant send - no lemo'
   }
 };
 

const logDataView = (labelOfDataSource, key, valueDataView) => {
  const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
    return b.toString(16).padStart(2, '0');
  }).join(' ');
  const textDecoder = new TextDecoder('ascii');
  const asciiString = textDecoder.decode(valueDataView.buffer);
  console.log(`  ${labelOfDataSource} Data: ` + key +
      '\n    (Hex) ' + hexString +
      '\n    (ASCII) ' + asciiString);
};


function handleDisconnection(event) {
  let device = event.target;
  console.log('"' + device.name +'" bluetooth device disconnected, trying to reconnect...');
  //what does this do ???
  connectDeviceAndCacheCharacteristic(device).
      then(characteristic => startNotifications(characteristic)).
      catch(error => console.log(error));
} 
 

// Enable the characteristic changes notification
function startNotifications(characteristic) {
  console.log('Starting notifications...');

  return characteristic.startNotifications().
      then(() => {
        console.log('Notifications started');
      });
}


function valueChanged(event) {
	console.log('value changed >> ');
}

/* This function will be called when readValue resolves and
 * characteristic value changes since characteristicvaluechanged event
 * listener has been added. */
 
function resultFromRead(event) {
	//console.log('read or tx resolved ----');
  var theLength = event.currentTarget.value.byteLength;
  var readString = '';
	for (let i = 0; i < theLength; i++) {
  		var theValue = event.target.value.getUint8(i);
  		readString = readString + String.fromCharCode(theValue)
	}
	console.log('value Read >> '+readString);
	
	if (readString != previousRespons) {
		//the read string is not the same as previous response
		previousRespons = readString;

//	if (awaitRespons == true) {
		// await response is true
    	var respons_list = readString.split("/");   	  	 
      if (respons_list[1]=='LEMO Spin') {
      	spinRspHnd(respons_list)
      }else if (respons_list[1]=='LEMO just step') {     
	      js_LEMO_respons_handler(respons_list);
	      console.log('LEMO just step - handle respons');
      }else if (respons_list[1]=='LEMO Tipper') {
      	tipper_respons_handler(respons_list)
      }else if (respons_list[1]=='LEMO Garage') {
      	garage_door_respons_handler(respons_list)
      }else if (respons_list[1]=='LEMO Shake') {
      	shake_respons_handler(respons_list)
      }else if (respons_list[1]=='LEMO Metronome') {
      	mNome_respons_handler(respons_list)
      }else if (respons_list[1]=='LEMO Snail') {
      	snail_respons_handler(respons_list)
      }else if (respons_list[1]=='LEMO Coding') {
      	coding_respons_handler(respons_list)

   }else if (readString == 'cleared'){
   	//strange situation
   	console.log('no response now  -  >> '+readString);
   	
   }else {
   	console.log('strange situation - there is a respons - not cleared - no one whants it >> '+readString);
//   	bleTransmit('cleared');
   	 }
      responsCheckFlag = false;
      awaitRespons = false;	    	 
   }
};

function cleanupBLE() {
	//mute the BLE button
	document.getElementById('bleScanArea').style.display='none';
	initNav();
	//start a timer to poll for response
	setInterval(responsCheckTime, 2000);
};


function responsCheckTime() {
	console.log('poling timer fired - check for response - wait for read');
	if (awaitRespons != true) {
		//await response is not true
	responsCheckFlag = true;
	characteristicCache.readValue();
//	characteristicCache.readValue().then(function(dataView) { 
//   console.log('responsCheckTime - is this after read resolve ?');
// })
	}
};

function getResponse() {
	console.log('get respons timer fired - get the response - wait for read');
	responsCheckFlag = true;
	characteristicCache.readValue();//.then(function () {
		
	//});
};
