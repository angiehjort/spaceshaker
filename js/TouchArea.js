function TouchArea(touchable) {
    this.touchable = touchable;

    this.explained = false;

    this.who = null;
    this.newDiv = null;
    this.newObj = null;

    this.timestamp=0;
    this.timeResolution = 100; //ms

    // attach listeners
    //Hammer(this.touchable).on('touch', this.iWannaTouch.bind(this));
    Hammer(this.touchable).on('release', this.iWannaRelease.bind(this));
    Hammer(this.touchable).on('pinch', this.iWannaPinch.bind(this));
    Hammer(this.touchable).on('drag', this.iWannaSwipe.bind(this));
};

//TouchArea.prototype.iWannaTouch = function () {}

TouchArea.prototype.iWannaPinch = function () {
    if (users[users.length - 1] == null) {
        explanation.setText('You do not exist! Dont touch the table! >__<');
        return;
    } else {
        if (this.who == null) this.who = users[users.length - 1];
    }

    if (this.who.carries == null && this.who.settingBaseOf == null && this.who.settingHeightOf == null) {
        explanation.setText(this.explained ? null : 'Yeees, like this you make a box base')


        switch (Math.round(Math.random() * 3)) {
        case 1: var c = 'green';break;
        case 2: var c = 'blue'; break;
        default: c = 'red'; // for cases 0 and 3
        }

        //console.log(event.gesture.center);

        var posX = Math.min(event.gesture.touches[0].pageX, event.gesture.touches[1].pageX);
        var posY = Math.min(event.gesture.touches[0].pageY, event.gesture.touches[1].pageY);

        var coords = {
        x: ((this.who.skeleton.LeftHand.three.position.x + this.who.skeleton.RightHand.three.position.x) / 2),
        y: ((this.who.skeleton.LeftHand.three.position.y + this.who.skeleton.RightHand.three.position.y) / 2),
        z: ((this.who.skeleton.LeftHand.three.position.z + this.who.skeleton.RightHand.three.position.z) / 2)
        };

        this.who.settingBaseOf = new HiddenObject(c, null, coords, {x: posX, y: posY })
        objects.push(this.who.settingBaseOf);
    }


    if (this.timestamp < Date.now() - this.timeResolution) {
        this.timestamp = Date.now();

        if (this.who != null && this.who.settingBaseOf != null) {

            var x0 = event.gesture.touches[0].pageX;
            var y0 = event.gesture.touches[0].pageY;
            var x1 = event.gesture.touches[1].pageX;
            var y1 = event.gesture.touches[1].pageY;

            var moveTo = {
            x: ((this.who.skeleton.LeftHand.three.position.x + this.who.skeleton.RightHand.three.position.x) / 2),
            y: ((this.who.skeleton.LeftHand.three.position.y + this.who.skeleton.RightHand.three.position.y) / 2),
            z: ((this.who.skeleton.LeftHand.three.position.z + this.who.skeleton.RightHand.three.position.z) / 2)
            };
            this.who.settingBaseOf.updatePosition3d(moveTo);

            //var scale = Math.round(event.gesture.scale * 100);
            this.who.settingBaseOf.updatePosition2d({x: Math.min(x0, x1), y: Math.min(y0, y1)});
            this.who.settingBaseOf.grow(Math.abs(x0-x1), null, Math.abs(y0-y1));
        }
    }

}

TouchArea.prototype.iWannaRelease = function () {
    if (this.who!=null && this.who.settingBaseOf!=null) {
        explanation.setText(this.explained?null:'Move one hand up to set the height. Then swipe to cut off the box');

        this.who.settingHeightOf = this.who.settingBaseOf;
        this.who.settingBaseOf = null;
    }
}

TouchArea.prototype.iWannaSwipe = function () {
    if (this.who!=null && this.who.settingHeightOf!=null){
    explanation.setText(this.explained?null:"Box created. Create more!");
    this.explained = true;

    this.who.settingHeightOf.bake();

    this.who.settingHeightOf = null;
    this.who = null;
    }
}
