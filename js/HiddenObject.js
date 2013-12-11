function HiddenObject(color, size, position, position_twodee) {
    // HiddenObject constructor called every time to create the new HiddenObject

    // defaults
    if (color == null) color = 'pink';
    if (size == null) size = {width: 100, height: 100, depth: 100};
    if (position == null) position = {x: 0, y: -400, z: 1200};
    if (position_twodee == null) position_twodee = {x: 100, y: 100};

    // initialize HiddenObject in 3D
    this.color = color;
	this.material = new THREE.MeshLambertMaterial( { color: this.color, transparent: true } );
	this.material.opacity = 0.5;
	this.mesh = new THREE.Mesh( new THREE.CubeGeometry(size.width, size.height, size.depth), this.material );
	this.mesh.position = position;
    this.mesh.geometry.dynamic = true;
	scene.add(this.mesh);

    // initialize HiddenObject in 2D
    this.div = document.createElement('div');
    this.div.id = 'rect_'+color;
    this.div.classList.add('square');
    this.div.classList.add('newDiv');
    this.div.style.background = color;
    this.div.style.left = position_twodee.x + 'px';
    this.div.style.top = position_twodee.y + 'px';
    touchArea.touchable.appendChild(this.div);

    // set the scaling coefficients and limits
	this.growWFactor = 1.0;
    this.growHFactor = 1.0;
    this.growDFactor = 1.0;

    this.growWminLimit = 100;
    this.growHminLimit = 100;
    this.growDminLimit = 100;

    this.growWmaxLimit = 700;
    this.growHmaxLimit = 700;
    this.growDmaxLimit = 700;

    // initialize the sound feedback
    this.audioFound = document.getElementById('audio_' + color);
	this.audioFound.volume = 1;

    // attach a listener to a 2D HiddenObject
    Hammer(this.div).on('touch', this.checkDrop.bind(this));
}





HiddenObject.prototype.bake  = function()  {
    // this function is called to tell that the HiddenObject is now created and ready
    // it just sets the different appearence of the HiddenObject in 2D

    this.div.classList.remove('newDiv');
}





HiddenObject.prototype.destruct = function() {
    // this function is called when the HiddenObject needs to be removed
    // it deletes the HiddenObject from everywhere it is referenced

	scene.remove(this.mesh);
    touchArea.touchable.removeChild(this.div);
	objects.splice(objects.indexOf(this),1);
};




HiddenObject.prototype.checkDrop = function() {
    // this function is called when the user carries 3D HiddenObject and touches one of the 2D HiddenObjects

    // initialize the sound files and stop playing them to avoid overlaps
	var soundYe=document.getElementById("soundYe"); soundYe.pause();
	var soundNo=document.getElementById("soundNo"); soundNo.pause();

	for (i in users) {
		user = users[i];
		if (user != null && user.carries != null) {
			if (user.carries == this) {
                // if user carries the same HiddenObject in 3D as he touches in 2D
                // then we play a horse and destruct the HiddenObject. this is the only way to destruct them

                if(!mute)soundYe.play();
				this.destruct();
				user.stopCarrying();
			} else {
                // if the HiddenObjects in 3D and 2D do not match, then play a buzz
				if(!mute)soundNo.play();
			}
		}
	}//i
};




HiddenObject.prototype.found = function() {
    // this function plays the sound when the user hits the object

	if(!mute)this.audioFound.play();
};




HiddenObject.prototype.collidesWith = function(mesh) {
    // 3D supporting function. checks collisions. called from User class
	return this.mesh.collidesWith(mesh);
};
HiddenObject.prototype.distanceTo = function(mesh) {
    // 3D supporting function. measures distances. called from User class
	return this.mesh.distanceTo(mesh);
};




HiddenObject.generateObjects = function(c, b, s) {
    // this function is a demo HiddenObject generation
    // set the array of colors, 3d coordinate limits and size
    // example: c = ['red', 'green', 'blue'],
    // example: b = {x:{min:-500, max:500}, y:{min:0, max:700}, z:{min:1200, max:1600} }
    // example: s = {w:200, h:200, d:200}

	coords = {x: 0, y:0, z:0 };
	for (i in c) {
		color = c[i];

        // pick the random coordinates within the specified limits
		for (j in coords) {
			// random(0-1) * range + offset
			coords[j] = Math.random() * Math.abs(b[j].max - b[j].min) + b[j].min;
		}

        // create a new HiddenObject and set it to ready (bake)
        objects.push(new HiddenObject(color, {width: s.w, height: s.h, depth: s.d }, {x: coords.x, y: coords.y, z: coords.z}, {x:100, y:100}));
		objects[objects.length-1].bake();
        console.log(color + ' object generated: ', coords);
	}
};




HiddenObject.prototype.updatePosition3d = function (position) {
    // carrying the HiddenObject or creating a new one
    // update the position in 3D and next function same for 2D
    this.mesh.position = position;
}
HiddenObject.prototype.updatePosition2d = function (position) {
    this.div.style.left = position.x + 'px';
    this.div.style.top = position.y + 'px';
}




HiddenObject.prototype.grow = function (W, H, D) {
    // this function is called periodically when user makes a new HiddenObject
    // the function modifies the Width, Height and Depth of a newly created box
    // in both 3D and 2D spaces
    // by the scaling coefficients in relation to the current size of the box
    // it is possible to send NULL in the parameters if you do not want to update them


    // if calibration is done, overwrite the default scale coefficients
    if (calibration!=null) this.growWFactor = calibration.ratio.x;
    if (calibration!=null) this.growDFactor = calibration.ratio.z;


    // the size is bounded by the limits specified in constructor
    // if need to update W H or D and the new size is within the limits
    // then get the ratio of needed size to the current size and multiply it by scaling factors
    // otherwise set ratio to one = do nothing
    if (W == null || W * this.growWFactor < this.growWminLimit || W * this.growWFactor > this.growWmaxLimit) {
        ratioW = 1;
    } else {
        ratioW = W / this.mesh.geometry.width * this.growWFactor;
    }
    if (H == null || H * this.growHFactor < this.growHminLimit || H * this.growHFactor > this.growHmaxLimit) {
        ratioH = 1;
    } else {
        ratioH = H / this.mesh.geometry.height * this.growHFactor;
    }
    if (D == null || D * this.growDFactor < this.growDminLimit || D * this.growDFactor > this.growDmaxLimit) {
        ratioD = 1;
    } else {
        ratioD = D / this.mesh.geometry.depth * this.growDFactor;
    }


    // scale the vertex coordinates of the 3D HiddenObject and update the mesh
    // this is why working with ratios, not with absolute sizes
    for (point in this.mesh.geometry.vertices){
        this.mesh.geometry.vertices[point].x*=ratioW;
        this.mesh.geometry.vertices[point].y*=ratioH;
        this.mesh.geometry.vertices[point].z*=ratioD;
    }


    // separately we need to scale the size properties of the 3D model, since it is not automatically updated
    // this is why working with ratios, not with absolute sizes
    this.mesh.geometry.width*=ratioW;
    this.mesh.geometry.height*=ratioH;
    this.mesh.geometry.depth*=ratioD;


    // when modifying the height, the HiddenObject also needs to be shifted in 3D
    // to be properly places in relation to its center
    this.mesh.position.y += this.mesh.geometry.vertices[2].y*(1-ratioH)/ratioH;


    // update the size of the 2D HiddenObject
    this.div.style.width = W + 'px';
    this.div.style.height = D + 'px';


    // when modifying the height, update also the border of 2D HiddenObject
    this.div.style.border= H/20 + 'px inset grey';


    // schedule the asynchronous 3D HiddenObject update event and say bye
    this.mesh.geometry.verticesNeedUpdate = true;
    return 'object base updated';
};

