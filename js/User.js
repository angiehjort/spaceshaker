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
        },
        Waist: {
            three: new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), new THREE.MeshLambertMaterial({
                color: 0xffff00, transparent: true, opacity: this.opacity
            }))
        }
    };
    //this.skeleton.Head.three.geometry

    for (joint in this.skeleton) {
        scene.add(this.skeleton[joint].three);
    }

    console.log('User: new user added successfully');
}

User.prototype.destruct = function () {
    for (joint in this.skeleton) {
        scene.remove(this.skeleton[joint].three);
    }
    users.splice(users.indexOf(this), 1); // remove user from array
};

User.prototype.distanceToClosestObject = function () {
    var closestDist = null;
    for (i in objects) {
        distance = objects[i].distanceTo(this.skeleton.RightHand.three);
        if (closestDist == null || closestDist > distance) {
            closestDist = distance;
        }
    }
    return closestDist;
};

/* OBJECT CARRYING */
User.prototype.startCarrying = function (obj) {
    // user carries object
    this.carries = obj;
    // stop proximity audio
    audio.stop();
    console.log('start carrying');
};

User.prototype.stopCarrying = function (obj) {
    this.carries = null;
    audio.start();
    console.log('stop carrying');
};


User.prototype.carry = function (obj) {
    // start carrying if necessary
    if (this.carries == null) this.startCarrying(obj);

    // audio feedback for carrying
    if(!mute)document.getElementById('audio_ping').play();

    // update carried object position to average of hands
    var moveTo = {
        x: ((this.skeleton.LeftHand.three.position.x + this.skeleton.RightHand.three.position.x) / 2),
        y: ((this.skeleton.LeftHand.three.position.y + this.skeleton.RightHand.three.position.y) / 2),
        z: ((this.skeleton.LeftHand.three.position.z + this.skeleton.RightHand.three.position.z) / 2)
    };
    obj.updatePosition3d(moveTo);
};


User.prototype.getPosition = function (joint) {
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

    if (this.timestamp < Date.now() - this.timeResolution) {
	    this.timestamp = Date.now();

	    // update coordinates
	    for (joint in this.skeleton) {
	        if (user.skeleton[zig.Joint[joint]]) {
	            this.skeleton[joint].three.position.x = user.skeleton[zig.Joint[joint]].position[0];
	            this.skeleton[joint].three.position.y = user.skeleton[zig.Joint[joint]].position[1];
	            this.skeleton[joint].three.position.z = user.skeleton[zig.Joint[joint]].position[2];
	        }
	    }

	    // update audio distance feedback
	    if (this.carries == null) {
	        closestDist = this.distanceToClosestObject();
	        //audio.updateFreq(250 * Math.pow(Math.exp(-closestDist/150), (1/5)));
	        audio.updateGain(Math.pow(Math.exp(-closestDist / 150), (1 / 5)));
	    }

	    // check hits with objects
	    if (this.settingHeightOf == null && this.settingBaseOf == null) {
		    for (i in objects) {
		        obj = objects[i];
		        if (obj.collidesWith(this.skeleton.LeftHand.three) && obj.collidesWith(this.skeleton.RightHand.three)) {
		            if (this.carries == null || this.carries == obj)
		                this.carry(obj);
		        } else {
		            if (this.carries == obj)
		                this.stopCarrying();
		            if (obj.collidesWith(this.skeleton.LeftHand.three) || obj.collidesWith(this.skeleton.RightHand.three)) {
		                obj.found();
		            }
		        }
		    }
	    }

	    // update height of newly created element
	    if (this.settingHeightOf != null) {
	        var delta = this.skeleton.LeftHand.three.position.y - this.skeleton.RightHand.three.position.y;
	        this.settingHeightOf.grow(null,Math.abs(delta),null);
	    }
    }
    
    
    // TEST FOR CALIBRATION 
    var caltest = document.getElementById('calTest');
    if (caltest !== null) {
	    caltest.style.top = ((this.skeleton['LeftHand'].three.position.z - calibration.offset.z) * calibration.ratio.z) + 'px';
	    caltest.style.left = ((this.skeleton['LeftHand'].three.position.x - calibration.offset.x) * calibration.ratio.x) + 'px';
	    console.log(caltest.style.top, caltest.style.left);
    }
};


