function TouchArea(touchable) {
    this.touchable = touchable;

    this.explained = false;

    this.who = null;
    this.newDiv = null;
    this.newObj = null;

    this.timestamp=0;
    this.timeResolution = 100; //ms

    // attach listeners
    Hammer(this.touchable).on('touch', this.iWannaTouch.bind(this));
    Hammer(this.touchable).on('release', this.iWannaRelease.bind(this));
    Hammer(this.touchable).on('pinch', this.iWannaPinch.bind(this));
    Hammer(this.touchable).on('drag', this.iWannaSwipe.bind(this));
};

TouchArea.prototype.iWannaTouch = function () {
    if (users[users.length-1] == null) {
        explanation.setText('You do not exist! Dont touch the table! >__<');
        return;
    } else {
        if(this.who==null)this.who = users[users.length-1];
    }

    if (event.gesture.touches.length == 2 && this.who.settingBaseOf==null && this.who.settingHeightOf==null) {
        explanation.setText(this.explained?null:'Yeees, like this you make a box base')


        switch (Math.round(Math.random() * 3)) {
            case 1:var c = 'green';break;
            case 2:var c = 'blue';break;
            default:c = 'red'; // for cases 0 and 3
        }

        //console.log(event.gesture.center);

        var posX = Math.min(event.gesture.touches[0].pageX,event.gesture.touches[1].pageX);
        var posY = Math.min(event.gesture.touches[0].pageY,event.gesture.touches[1].pageY);

        this.who.settingBaseOf = new HiddenObject(c, null, null,{x:posX, y:posY} )
        objects.push(this.who.settingBaseOf);
    }
}

TouchArea.prototype.iWannaPinch = function () {
    if (this.timestamp < Date.now() - this.timeResolution) {
        this.timestamp = Date.now();

        if (this.who != null && this.who.settingBaseOf != null) {

            var scale = Math.round(event.gesture.scale * 100);
            var posX = Math.min(event.gesture.touches[0].pageX,event.gesture.touches[1].pageX);
            var posY = Math.min(event.gesture.touches[0].pageY,event.gesture.touches[1].pageY);

            this.who.settingBaseOf.moveTwoDeeTo(posX, posY);
            this.who.settingBaseOf.grow(scale, null, scale);
        }
    }

}

TouchArea.prototype.iWannaRelease = function () {
    if (this.who!=null &&  event.gesture.touches.length == 2 && this.who.settingBaseOf!=null) {
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
