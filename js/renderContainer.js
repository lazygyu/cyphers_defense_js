var RenderContainer = function(){};

RenderContainer.prototype = new createjs.DisplayObject();
RenderContainer.prototype.layers = [];
RenderContainer.prototype.orderLayer = 1;
RenderContainer.prototype.visible = true;

RenderContainer.prototype.addChild = function(obj){
	console.log("add");
	if(obj == null) return obj;
	if( typeof(obj) == "array"){
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
	for(var i in this.layers){
		this.layers[i].draw(a,b);
	}
}

var sortFunc = function(a, b){
	return a.y - b.y;
}

RenderContainer.prototype.tick = function(){
	var t = null;
	for(var i in this.layers){
		if(i == this.orderLayer) this.layers[i].sortChildren(sortFunc);
		for(var j in this.layers[i].children){
			t = this.layers[i].children[j];
			if(t._tick){
				t._tick();
			}
			if(t.tick){
				t.tick();
			}
		}
	}
}


