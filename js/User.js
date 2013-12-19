function User(kinectUser) {
    this.id = kinectUser.id;
    this.kinectUser = kinectUser;
    this.kinectUser.addEventListener('userupdate', this.updateFromKinect.bind(this));

    this.timestamp=0;
    this.timeResolution = 100; //ms

    this.settingBaseOf = null;
    this.settingHeightOf = null;
    this.carries = null;

    this.opacity = 0.3;

    // create the skeleton and append the parts of the skeleton to a 3D scene
    this.skeleton = {
        Head: {
            three: new THREE.Mesh(new THREE.SphereGeometry(150,16,16), new THREE.MeshLambertMaterial({
                color: 0xff00ff, transparent: true, opacity: this.opacity
            }))
        },
        Torso: {
            three: new THREE.Mesh(new THREE.CubeGeometry(200, 600, 200), new THREE.MeshLambertMaterial({
                color: 0xff00ff, transparent: true, opacity: this.opacity
            }))
        },
        RightHand: {
            three: new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshLambertMaterial({
                color: 0xffff00, transparent: true, opacity: this.opacity
            }))
        },
        LeftHand: {
            three: new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshLambertMaterial({
                color: 0xffff00, transparent: true, opacity: this.opacity
            }))
        }
    };

    for (joint in this.skeleton) {
        scene.add(this.skeleton[joint].three);
    }

    console.log('User: new user added successfully');
}




User.prototype.destruct = function () {
    // destruct is called when user is lost by Kinect
    // remove parts of user from the 3D scene
    for (joint in this.skeleton) {
        scene.remove(this.skeleton[joint].three);
    }
    // remove user from array of users
    users.splice(users.indexOf(this), 1);
};




User.prototype.distanceToClosestObject = function (joint) {
    // the function returns the distance from user's specified joint
    // to a nearest HiddenObject in 3D
    // uses HiddenObject' helping method distanceTo

    var closestDist = null;
    if (typeof this.skeleton[joint] !== 'undefined') {
	    for (i in objects) {
	        distance = objects[i].distanceTo(this.skeleton[joint].three);
	        if (closestDist == null || closestDist > distance) {
	            closestDist = distance;
	        }
	    }//i
    }	
    return closestDist;
};




/* OBJECT CARRYING */
User.prototype.carry = function (obj) {
    // start carrying if necessary
    if (this.carries == null) this.startCarrying(obj);

    // audio feedback for carrying
    if(!mute)document.getElementById('audio_ping').play();

    // update carried HiddenObject position to average of hands
    var moveTo = {
        x: ((this.skeleton.LeftHand.three.position.x + this.skeleton.RightHand.three.position.x) / 2),
        y: ((this.skeleton.LeftHand.three.position.y + this.skeleton.RightHand.three.position.y) / 2),
        z: ((this.skeleton.LeftHand.three.position.z + this.skeleton.RightHand.three.position.z) / 2)
    };
    obj.updatePosition3d(moveTo);
};

User.prototype.startCarrying = function (obj) {
    // user grabs HiddenObject
    // stop proximity audio, update vibro feedback

    this.carries = obj;
    
    //audio.mute();
    //vibro.carryOn = true;
    //vibro.refresh();
    console.log('start carrying');
};

User.prototype.stopCarrying = function (obj) {
    // user releases HiddenObject
    // start proximity audio, update vibro feedback

    this.carries = null;
    //audio.unmute();
    //vibro.carryOn = false;
    //vibro.refresh();
    console.log('stop carrying');
};




User.prototype.getPosition = function (joint) {
    // helper function - get the coordinates of a joint in skeleton

	if (typeof this.skeleton[joint] === 'undefined') {
		console.log('User does not have joint ' + joint);
		return {};
	}
	else {
		return this.skeleton[joint].three.position;
	}
}




/* UPDATE USER MODEL AND CARRIED OBJECTS */
User.prototype.updateFromKinect = function (user) {
    // periodic update from Kinect
    // called separately for every user

	lpassOld = 0.5;

    // update coordinates of the skeleton
    for (joint in this.skeleton) {
        if (user.skeleton[zig.Joint[joint]]) {
            this.skeleton[joint].three.position.x = ((1-lpassOld) * user.skeleton[zig.Joint[joint]].position[0] + lpassOld * this.skeleton[joint].three.position.x);
            this.skeleton[joint].three.position.y = ((1-lpassOld) * user.skeleton[zig.Joint[joint]].position[1] + lpassOld * this.skeleton[joint].three.position.y);
            this.skeleton[joint].three.position.z = ((1-lpassOld) * user.skeleton[zig.Joint[joint]].position[2] + lpassOld * this.skeleton[joint].three.position.z);
        }
    }
    

    // update audio distance feedback, if not carrying the object now
    if (this.carries == null) {

        // lcase for system, ucase for kinect
        channelNames = { 'left': 'Left', 'right': 'Right' };
        
        // update each well-defined channel
        // future versions this should be done with event/handler/listener
        for (channel in channelNames) {
        	if (typeof audio.channels[channel] !== 'undefined') {
        		
        		// get distance of hand mapped to channel, 'LeftHand/RightHand' uppercase!
	        	closestDist = this.distanceToClosestObject(channelNames[channel] + 'Hand');
	        	
	        	// change each wave property if it's turned on
	        	for (waveType in audio.channels[channel].waveType) {
	        		if (audio.channels[channel].waveType[waveType]) {
			        	switch(waveType) {
					        case "frequency":
					        	audio.channels[channel].updateFreq(audio.channels[channel].freq * Math.pow(Math.exp(-closestDist/20), (1/10))); //100,5
					        	break;
					        	
					        case "amplitude":
					        	audio.channels[channel].updateGain(Math.pow(Math.exp(-closestDist/20), (1/10)));
					            break;    
					
					        case "pulseFrequency":
					        	audio.channels[channel].updateInterval(closestDist, 0.5);
					        	break;
					
					        case "pulseWidth":
					            if (closestDist<2000){
					            audio.channels[channel].updateInterval(500, (1-closestDist/2000)*Math.pow(Math.exp(-closestDist/20), (1/10)));
					            }
					            break;    	
			        	}
	        		}
	        	}
	        	
        	} // if channel is defined
        } // channel

	}// end updating audio distance feedback


    // check hits of hands with objects, if not creating a new one
    if (this.settingHeightOf == null && this.settingBaseOf == null) {
	    for (i in objects) {
	        obj = objects[i];
	        if (obj.collidesWith(this.skeleton.LeftHand.three) && obj.collidesWith(this.skeleton.RightHand.three)) {

                // if both hands collide with 3D HiddenObject than start carrying it
	            if (this.carries == null || this.carries == obj)
	                this.carry(obj);
	        } else {

                // if not then stop carrying
	            if (this.carries == obj)
	                this.stopCarrying();

                // if just one hand collides with HiddenObject than call its "found" method
	            if (obj.collidesWith(this.skeleton.LeftHand.three) || obj.collidesWith(this.skeleton.RightHand.three)) {
	                obj.found();
	            }
	        }
	    }//i
    }


    // update height of newly created element
    if (this.settingHeightOf != null) {
        var delta = this.skeleton.LeftHand.three.position.y - this.skeleton.RightHand.three.position.y;
        this.settingHeightOf.grow(null,Math.abs(delta),null);
    }

};


