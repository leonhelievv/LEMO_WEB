//all to do with the links between puzzels who is connected to who

//when a puzzle is deleted - update the links in puzzle's that is attached
function deleteUpdate(thisToDelete) {
	const whoAtTop = thisToDelete[20]
	const whoAtR1 = thisToDelete[17] //for option block this is the port to which it was connected
	const whoAtR2 = thisToDelete[18]
	const whoAtR3 = thisToDelete[19]
	const whoAtBottom = thisToDelete[16]
	var pzlFoundIndex = -1
	//test if thisToDelete is an option block
	if (thisToDelete[21] == 'optionBlock') {
		//the blk to delete is an option blk
		const lookFor = thisToDelete[20]
		pzlFoundIndex = getConnectedPzl(lookFor)
		if (pzlFoundIndex != -1) {
			//found a linked pzl connected to this option blk
			//delete the link in parent of this option at position
			//pzzlPieces[pzlFoundIndex][16+thisToDelete[17]]='deleted_link toR1'
			const foundPzl = pzzlPieces[pzlFoundIndex]
			if (foundPzl[21].includes('motor')) {
				//the optionBlock was connected to a motorBlk
				//delete the link in the motor blk
				foundPzl[16+whoAtR1] = 'deleted_link'
			}else if (foundPzl[21].includes('switch')) {
				//the option was connected to switchBlk
				//delete the link in switchBlk
				foundPzl[17] = 'deleted_link'
			}
		}	
		}else {
		//the blk to delete is not an option blk
		//if there is connected get the pzl
	if (Number.isInteger(whoAtTop)) {
		//there is a pzl connected to top
		const lookFor = thisToDelete[20]	 
		pzlFoundIndex = getConnectedPzl(lookFor) 
		//the search is done - result in pzlFoundIndex
		if (pzlFoundIndex != -1) {
			//found a linked pzl connected to top
			//delete the linked to the bottom of found pzl
			pzzlPieces[pzlFoundIndex][16]='deleted_bottom'
			
			//if pzzl found is a switchBlk - delete the [18] link
			if (pzzlPieces[pzlFoundIndex][3] == 'switch on/off') {
				//it is a switch blk
				//delete the [18] link
				pzzlPieces[pzlFoundIndex][18] = 'deleted link'
			}
		}	
	}
	
	if (Number.isInteger(whoAtR1)) {
		//there is a pzl connected at R1
		const lookFor = thisToDelete[17]	
		pzlFoundIndex = getConnectedPzl(lookFor)
		if (pzlFoundIndex != -1) {
			//found a linked pzl connected to R1
			//delete the link in option
			pzzlPieces[pzlFoundIndex][20]='deleted_parent_option1'
		}		
	}
	
	if (Number.isInteger(whoAtR2)) {
		//there is a pzl connected at R2
		const lookFor = thisToDelete[18]	
		pzlFoundIndex = getConnectedPzl(lookFor)
		if (pzlFoundIndex != -1) {
			//found a linked pzl connected to top
			//delete the linked to the bottom of found pzl
			pzzlPieces[pzlFoundIndex][20]='deleted_parent_option2'
		}	
	}
	
	if (Number.isInteger(whoAtR3)) {
		//there is a pzl connected at R3
		const lookFor = thisToDelete[19]	
		pzlFoundIndex = getConnectedPzl(lookFor)
		if (pzlFoundIndex != -1) {
			//found a linked pzl connected to top
			//delete the linked to the bottom of found pzl
			pzzlPieces[pzlFoundIndex][20]='deleted_parent_option3'
		}	
	}

		}
	
	if (Number.isInteger(whoAtBottom)) {
		//there is a pzl connected at bottom
		const lookFor = thisToDelete[16]	 
		pzlFoundIndex = getConnectedPzl(lookFor) 
		//the search is done - result in pzlFoundIndex
		if (pzlFoundIndex != -1) {
			//found a linked pzl connected to bottom
			//delete the linked to the top of found pzl
			pzzlPieces[pzlFoundIndex][20]='deleted_top'
		}			
	}
	
};

	function getConnectedPzl(lookFor) {
		//this returns the index into pzzzlPieces - lookFor is the ID of a pzzl
		for (let i = 0; i < pzzlPieces.length; i++) {	
			//find the pzl with ID 20 in pzlNo field
			if (pzzlPieces[i][1]==lookFor) {
				//the pzlNo looking for is this
				pzlFoundIndex = i
				break		
			}
		}
		return(pzlFoundIndex)
	};	
	

//when a space left by deletion is filled update the links data if there are puzzels there
function replaceUpdate(replacement) {
	if (replacement[21].includes('motor')) {
		//the replaced block is a motor block
		//calc the center of next down X , Y
		const nextDownY = replacement[8] + replacement[13] + 40
		const nextDownX = replacement[7] + replacement[12] / 2
		const nextResult = whatsHereTouch(nextDownX,nextDownY)		
		const nextDown = nextResult[0]			
		if (nextDown[0] == 'noThing') {
			//next position down is open
			//no update required
		}else {
			//next position down has a puzzel - update link data
			replacement[16] = nextDown[1]
			nextDown[20] = replacement[1]
		}
		//is there an option blk at R1
		const RX = replacement[7] + replacement[12] + optionBlkTemplate[12] / 2
		var RY = replacement[8] + mblkOpOffsets[1] + optionBlkTemplate[13]/2
		hereIs = whatsHereTouch(RX,RY)
		if (hereIs[0] != 'noThing') {
			//there is an option blk
			if (hereIs[0][21].includes('option')) {
				//there is an option blk in R1 - update link data	
				replacement[17] = hereIs[0][1]	
				hereIs[0][20] = replacement[1]
				hereIs[0][17] = 1
			}
		} 
		
		RY = replacement[8] + mblkOpOffsets[2] + optionBlkTemplate[13]/2
		hereIs = whatsHereTouch(RX,RY)
		if (hereIs[0] != 'noThing') {
			if (hereIs[0][21].includes('option')) {
				//there is an option blk in R2
				replacement[18] = hereIs[0][1]	
				hereIs[0][20] = replacement[1]
				hereIs[0][17] = 2
			}
		}
		
		RY = replacement[8] + mblkOpOffsets[3] + optionBlkTemplate[13]/2
		hereIs = whatsHereTouch(RX,RY)
		if (hereIs[0] != 'noThing') {
			if (hereIs[0][21].includes('option')) {
				//there is an option blk in R3
				replacement[19] = hereIs[0][1]	
				hereIs[0][20] = replacement[1]
				hereIs[0][17] = 3
			}
		}
		
	}else if (replacement[21].includes('delay')) {
		//the replaced block is a delay block
		
	}else{
		//the replaced block has no options - only update bottom link
	}
};
