function TouchArea(touchable) {
    // Touch area constructor called once, when the page is created

    this.touchable = touchable;

    this.explained = false;
    this.who = null;

    this.timestamp=0;
    this.timeResolution = 100; //ms

    // attach listeners
    Hammer(this.touchable).on('release', this.iWannaRelease.bind(this));
    Hammer(this.touchable).on('pinch', this.iWannaPinch.bind(this));
    Hammer(this.touchable).on('drag', this.iWannaSwipe.bind(this));
};





TouchArea.prototype.iWannaPinch = function () {
    // this function is called everytime on pinch
    // first, identify the interacting user from Kinect. if no users, then quit
    if (users[users.length - 1] == null) {
        explanation.setText('You do not exist! Dont touch the table! >__<');
        return;
    } else {
        // else - set the last user to be the controlling user
        if (this.who == null) this.who = users[users.length - 1];
    }

    // if the user is not currently creating the object then start creating!
    if (this.who.carries == null && this.who.settingBaseOf == null && this.who.settingHeightOf == null) {
        explanation.setText(this.explained ? null : 'Yeees, like this you make a box base')

        // generate random color out of 3 colors with equal probabilities
        switch (Math.round(Math.random() * 3)) {
        case 1: var c = 'green';break;
        case 2: var c = 'blue'; break;
        default: c = 'red'; // for cases 0 and 3
        }

        // get the top left corner of the touch event. this will tell where to create the box in 2D
        var posX = Math.min(event.gesture.touches[0].pageX, event.gesture.touches[1].pageX);
        var posY = Math.min(event.gesture.touches[0].pageY, event.gesture.touches[1].pageY);

        // get the average of two hands from kinect. this will tell where to create the box in 3D
        var coords = {
        x: ((this.who.skeleton.LeftHand.three.position.x + this.who.skeleton.RightHand.three.position.x) / 2),
        y: ((this.who.skeleton.LeftHand.three.position.y + this.who.skeleton.RightHand.three.position.y) / 2),
        z: ((this.who.skeleton.LeftHand.three.position.z + this.who.skeleton.RightHand.three.position.z) / 2)
        };

        // create a new instance of HiddenObject with the calculated coordinates
        this.who.settingBaseOf = new HiddenObject(c, null, coords, {x: posX, y: posY })
        objects.push(this.who.settingBaseOf);
    }


    // this part updates the size of the box, when you are creating it
    // it only works once in a 100 ms or so (can be set above), otherwise we have too many events called
    if (this.timestamp < Date.now() - this.timeResolution) {
        this.timestamp = Date.now();

        // so, if you are currently setting the base of the box
        if (this.who != null && this.who.settingBaseOf != null) {

            // we capure coordinates of touch event
            var x0 = event.gesture.touches[0].pageX;
            var y0 = event.gesture.touches[0].pageY;
            var x1 = event.gesture.touches[1].pageX;
            var y1 = event.gesture.touches[1].pageY;

            // we capure coordinates of the hands
            var moveTo = {
            x: ((this.who.skeleton.LeftHand.three.position.x + this.who.skeleton.RightHand.three.position.x) / 2),
            y: ((this.who.skeleton.LeftHand.three.position.y + this.who.skeleton.RightHand.three.position.y) / 2),
            z: ((this.who.skeleton.LeftHand.three.position.z + this.who.skeleton.RightHand.three.position.z) / 2)
            };

            // move the object in 3D accordingly
            this.who.settingBaseOf.updatePosition3d(moveTo);

            // move the object in 2D accordingly
            this.who.settingBaseOf.updatePosition2d({x: Math.min(x0, x1), y: Math.min(y0, y1)});

            // update the size of the HiddenObject in 2D ans 3D
            this.who.settingBaseOf.grow(Math.abs(x0-x1), null, Math.abs(y0-y1));
        }
    }

}






TouchArea.prototype.iWannaRelease = function () {
    // this function is called when you end touch event
    // switching from setting base of the object to setting its height

    if (this.who!=null && this.who.settingBaseOf!=null) {
        explanation.setText(this.explained?null:'Move one hand up to set the height. Then swipe to cut off the box');

        this.who.settingHeightOf = this.who.settingBaseOf;
        this.who.settingBaseOf = null;
    }
}






TouchArea.prototype.iWannaSwipe = function () {
    // this function is called during the swipe touch event (at the start of swipe)
    // if user is setting the height of the object now, then save the height

    if (this.who!=null && this.who.settingHeightOf!=null){
    explanation.setText(this.explained?null:"Box created. Create more!");
    this.explained = true;

    this.who.settingHeightOf.bake();
    this.who.settingHeightOf = null;
    this.who = null;
    }
}
