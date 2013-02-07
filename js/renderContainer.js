var RenderContainer = function(){};

RenderContainer.prototype = new createjs.DisplayObject();
RenderContainer.prototype.layers = [];
RenderContainer.prototype.orderLayer = 1;
RenderContainer.prototype.visible = true;

RenderContainer.prototype.addChild = function(obj){
	//console.log("add");
	if(obj == null) return obj;
	if( typeof(obj.length) != "undefined"){
		for(var i in obj){
			if(obj[i].z == undefined || obj[i].z == null ) obj[i].z = 0;
			if( this.layers[obj[i].z] == undefined) this.layers[obj[i].z] = new createjs.Container();
			this.layers[obj[i].z].addChild(obj[i]);
		}
	}else{
		if(obj.z == undefined || obj.z == null)obj.z = 0;
		if(this.layers[obj.z] == undefined) this.layers[obj.z] = new createjs.Container();
		this.layers[obj.z].addChild(obj);
	}
}

RenderContainer.prototype.draw_old = RenderContainer.prototype.draw = RenderContainer.prototype.draw;

RenderContainer.prototype.draw = function(a, b){
	var obj=null;
	a.save();
	a.translate(this.x, this.y);

	for(var i in this.layers){
		if( this.layers[i].isOffscreen) {
			if( this.layers[i].offscreen ){
				a.drawImage(this.layers[i].offscreen, 0, 0);
			}else{
				this.layers[i].offscreen = document.createElement('canvas');
				this.layers[i].offscreen.width = 800; 
				this.layers[i].offscreen.height = 600; 
				var ctx = this.layers[i].offscreen.getContext('2d');
				this.layers[i].draw(ctx, b);
				a.drawImage(this.layers[i].offscreen, 0, 0);
			}
		}else{
			this.layers[i].draw(a,b);
		}
	}

	a.restore();
}

var sortFunc = function(a, b){
	return a.y - b.y;
}

RenderContainer.prototype.tick = function(elapsed){
	var t = null;
	for(var i in this.layers){
		if(i == this.orderLayer) this.layers[i].sortChildren(sortFunc);
		for(var j in this.layers[i].children){
			t = this.layers[i].children[j];
			if(t._tick){
				t._tick();
			}
			if(t.tick){
				t.tick(elapsed);
			}
		}
	}
}


