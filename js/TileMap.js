var TileMap = function(opt){
	this.map = [];
	this.tiles = [];
	this.width = 0;
	this.height = 0;
	this.mapchip = new Image();
	this.sh = null;
	this.chipwidth = 16;
	this.chipheight = 16;
	if(opt == undefined)opt = {};
	this.stage = opt.stage;
	if(opt.width) this.width = opt.width;
	if(opt.height) this.height = opt.height;

}

//TileMap.prototype = new DisplayObject();

TileMap.prototype.setSize = function(w, h){
	this.width = w;
	this.height = h;
}

TileMap.prototype.fill = function(no){
	var f = this.sh.getFrame(no);
	for(var i=0;i<this.width;i++){
		for(var j=0;j<this.height;j++){
			this.map[i][j] = no;

		}
	}
	for(var t in this.tiles){
		this.tiles[t].sourceRect = f.rect;
	}
}

TileMap.prototype.createRandom = function(){
	for(var i = 0; i < this.width; i++){
		if( typeof(this.map[i]) == "undefined" ) this.map[i] = [];
		for(var j = 0; j < this.height; j++){
			this.map[i][j] = Math.round((Math.random() * 100) + 1);
			var tmpTile = new Tile(this.mapchip, null, i, j);
			var obj = this.sh.getFrame(this.map[i][j]);
			tmpTile.sourceRect = obj.rect;
			this.stage.addChild(tmpTile);
			this.tiles.push(tmpTile);
		}
	}
}

TileMap.prototype.parseText = function(txt){
	var tmp = txt.replace(/\n/g, '').split(' ');
	for(var i=0;i<this.width;i++){
		if( typeof(this.map[i]) == "undefined" ) this.map[i] = [];
		for(var j=0;j<this.height;j++){
			this.map[i][j] = tmp[i + (j*this.width)]; 
			var tmpTile = new Tile(this.mapchip, null, i, j);
			var obj = this.sh.getFrame(this.map[i][j]);
			try{
				tmpTile.sourceRect = obj.rect;
			}catch(er){
				console.log("i : " + i + " / j : " + j + " / map : " + this.map[i][j]);
			}
			this.stage.addChild(tmpTile);
			this.tiles.push(tmpTile);
		}
	}
}

TileMap.prototype.setMapChip = function(uri){
	this.mapchip = new Image();
	this.mapchip.src = uri;
	var that = this;
	this.mapchip.onload = function(){
		console.log("mapchip [" + uri + "] has loaded.");
		that.sh = new createjs.SpriteSheet({
				images:[that.mapchip],
				frames:{width:16, height:16, regX:8, regY:8}
			});
		that.sh.onComplete = function(){
			console.log("SpriteSheet created.");
		}

	}
}

var Tile = function(texture, collision, x, y){
	this.initialize(texture, collision, x, y);
}

Tile.prototype = new createjs.Bitmap();
Tile.prototype.Bitmap_initialize = Tile.prototype.initialize;

Tile.prototype.initialize = function(texture, collision, x, y){
	if( texture != null ){
		this.Bitmap_initialize(texture);
		this.empty = false;
	}else{
		this.empty = true;
	}
	this.Collision = collision;
	this.x = x * this.Width;
	this.y = y * this.Height;
}

Tile.prototype.Width = 16;
Tile.prototype.Height = 16;


