function User(kinectUser) {
	this.kinectUser = kinectUser;
	this.kinectUser.addEventListener('userupdate', this.updateFromKinect.bind(this));

	this.carries = null;
	material = new THREE.MeshLambertMaterial( { color: 0xff00ff } );
	this.skeleton = {
		Head: {
			three: new THREE.Mesh( new THREE.CubeGeometry(300,300,300), material )
		},
		Torso: {
			three: new THREE.Mesh( new THREE.CubeGeometry(450,600,300), new THREE.MeshLambertMaterial( { color: 0xff00ff } ) )
		},
		RightHand: {
			three: new THREE.Mesh( new THREE.CubeGeometry(200,200,200), new THREE.MeshLambertMaterial( { color: 0xffff00 } ) )
		},
		LeftHand: {
			three: new THREE.Mesh( new THREE.CubeGeometry(200,200,200), new THREE.MeshLambertMaterial( { color: 0xffff00 } ) )
		}
	};
	//this.skeleton.Head.three.geometry

	for(joint in this.skeleton) {
		scene.add(this.skeleton[joint].three);
	}

}

User.prototype.destruct = function() {
	for(joint in this.skeleton) {
		scene.remove(this.skeleton[joint].three);
	}	
	users.splice(users.indexOf(this), 1); // remove user from array
};

User.prototype.distanceToClosestObject = function() {
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
User.prototype.startCarrying = function(obj) {
	// user carries object
	this.carries = obj;
	// stop proximity audio
	audio.stop();	
	console.log('start carrying');
};
User.prototype.stopCarrying = function(obj) {
	this.carries = null;
	audio.start();
	console.log('stop carrying');
};
User.prototype.carry = function(obj) {
	
	// start carrying if necessary
	if (this.carries == null)
		this.startCarrying(obj);

	// audio feedback for carrying
	document.getElementById('audio_ping').play();
	
	// update carried object position to average of hands
	obj.mesh.position = 
	{
		x: ((this.skeleton.LeftHand.three.position.x + this.skeleton.RightHand.three.position.x) / 2),
		y: ((this.skeleton.LeftHand.three.position.y + this.skeleton.RightHand.three.position.y) / 2),
		z: ((this.skeleton.LeftHand.three.position.z + this.skeleton.RightHand.three.position.z) / 2)
	};	
};

/* UPDATE USER MODEL AND CARRIED OBJECTS */
User.prototype.updateFromKinect = function(user) {
	
	// update coordinates
	for(joint in this.skeleton) {
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
		audio.updateGain(Math.pow(Math.exp(-closestDist/150), (1/5)));		
	}
	
	// check hits with objects
	for (i in objects) {
		obj = objects[i]; 
		if (obj.collidesWith(this.skeleton.LeftHand.three) && obj.collidesWith(this.skeleton.RightHand.three)) 
		{
			if (this.carries == null || this.carries == obj)
				this.carry(obj);
		} 
		else 
		{
			if (this.carries == obj)
				this.stopCarrying();
			if (obj.collidesWith(this.skeleton.LeftHand.three) || obj.collidesWith(this.skeleton.RightHand.three)) 
			{
				obj.found();
			}
		}
	}
};
