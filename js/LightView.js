function LightView(lmap) {
    this.initialize(lmap);
}

LightView.prototype = new createjs.DisplayObject();

LightView.prototype.DisplayObject_initialize = LightView.prototype.initialize;

// properties
//LightView.prototype.map = null;
LightView.prototype.canv = document.createElement("canvas");
LightView.prototype.context = null;

LightView.prototype.initialize = function (lmap) {
    this.DisplayObject_initialize();
    this.canv.width = 800;
    this.canv.height = 600;
    this.context = this.canv.getContext("2d");

}



LightView.prototype.draw = function (a, b) {
    var lmap = lightmap;
    if (!lmap) return true;
    this.context.clearRect(0, 0, 800, 600);
    this.context.fillStyle = 'rgba(0,0,0,0.3)';
    this.context.fillRect(0, 0, 800, 600);
    var rGradient = a.createRadialGradient(0, 0, 16, 0, 0, 20);
    rGradient.addColorStop(0, 'rgba(0,0,0,0)');
    rGradient.addColorStop(1, 'rgba(0,0,0,0.5)');

    for (var i = 0; i < 50; i++) {
        for (var j = 0; j < 37; j++) {
            if (lmap[i][j] != 0) {
                this.context.save();
                this.context.translate(i * 16 - 8, j * 16 - 8);
                this.context.fillStyle = rGradient;
                this.context.clearRect(-8, -8, 16, 16);
                this.context.restore();
            } else {
                
            }
        }
    }
    a.drawImage(this.canv, 0, 0);
}

LightView.prototype.tick = function (elapsed) {

}