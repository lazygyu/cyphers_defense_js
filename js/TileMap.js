var TileMap = function(opt){
	this.map = [];
	this.tiles = [];
	this.width = 0;
	this.height = 0;
	this.mapchip = new Image();
	this.sh = null;
	this.chipwidth = 16;
	this.chipheight = 16;
	this.z = opt.z;
	if(opt == undefined)opt = {};
	this.stage = opt.stage;
	if(opt.width) this.width = opt.width;
	if(opt.height) this.height = opt.height;

}

TileMap.prototype = new createjs.DisplayObject();

TileMap.prototype.setSize = function(w, h){
	this.width = w;
	this.height = h;
}

TileMap.prototype.fill = function(no){
	var f = this.sh.getFrame(no);
	for(var i=0;i<this.width;i++){
		for(var j=0;j<this.height;j++){
			this.map[i][j] = no;
			this.tiles[i + (j*this.width)].no = no;
		}
	}
	if( !f ) return;
	for(var t in this.tiles){
		this.tiles[t].sourceRect = f.rect;
	}
}

TileMap.prototype.createRandom = function(){
	for(var j = 0; j < this.height; j++){
		for(var i = 0; i < this.width; i++){
			if( typeof(this.map[i]) == "undefined" ) this.map[i] = [];
			this.map[i][j] = Math.round((Math.random() * 100) + 1);
			var tmpTile = new Tile(this.mapchip, null, i, j);
			var obj = this.sh.getFrame(this.map[i][j]);
			tmpTile.no = this.map[i][j];
			tmpTile.sourceRect = obj.rect;
			tmpTile.z = this.z;
			this.tiles[i + (j*this.width)] = tmpTile;
			this.stage.addChild(tmpTile);
		}
	}
}

TileMap.prototype.parseText = function(txt){
	var tmp = txt.replace(/\n/g, '').split(' ');
	for(var j=0;j<this.height;j++){
		for(var i=0;i<this.width;i++){
			if( typeof(this.map[i]) == "undefined" ) this.map[i] = [];
			this.map[i][j] = tmp[i + (j*this.width)]; 
			var tmpTile = new Tile(this.mapchip, null, i, j);
			var obj = this.sh.getFrame(this.map[i][j]);
			tmpTile.no = this.map[i][j];
			////console.log(this.map[i][j]);
			try{
				tmpTile.sourceRect = obj.rect;
				////console.log((i + (j*this.width)) + "i : " + i + " / j : " + j + " / map : " + this.map[i][j]);
			}catch(er){
				tmpTile.no = null;
				////console.log((i + (j*this.width)) + "i : " + i + " / j : " + j + " / map : " + this.map[i][j]);
			}
			tmpTile.z = this.z;
			this.tiles[i + (j*this.width)] = tmpTile;
			this.stage.addChild(tmpTile);
		}
	}
}

TileMap.prototype.setMapChip = function(uri){
	this.mapchip = new Image();
	this.mapchip.src = uri;
	var that = this;
	this.mapchip.onload = function(){
		//console.log("mapchip [" + uri + "] has loaded.");
		that.sh = new createjs.SpriteSheet({
				images:[that.mapchip],
				frames:{width:16, height:16, regX:0, regY:0}
			});
		that.sh.onComplete = function(){
			//console.log("SpriteSheet created.");
		}
	}
}

TileMap.prototype.setTile = function(x, y, no){
	this.map[x][y] = no;
	this.tiles[x + (y * this.width)].no = no;
	var c = this.sh.getFrame(no);
	this.tiles[x + (y * this.width)].sourceRect = c.rect;
}

TileMap.prototype.draw = function(a,b){
	////console.log(this.tiles.length);
	for(var i=0;i<this.tiles.length;i++){
		if(this.tiles[i].no == null ) continue;
		a.save();
		a.translate(this.tiles[i].x, this.tiles[i].y);
		this.tiles[i].draw(a,b);
		a.restore();
	}
	return true;
}

var Tile = function(texture, collision, x, y){
	this.initialize(texture, collision, x, y);
}

Tile.prototype = new createjs.Bitmap();
Tile.prototype.Bitmap_initialize = Tile.prototype.initialize;
Tile.prototype.no = 0;
Tile.prototype.regX = 8;
Tile.prototype.regY = 8;
Tile.prototype.tileX = 0;
Tile.prototype.tileY = 0;

Tile.prototype.initialize = function(texture, collision, x, y){
	if( texture != null ){
		this.Bitmap_initialize(texture);
		this.empty = false;
	}else{
		this.empty = true;
	}
	this.Collision = collision;
	this.tileX = x;
	this.tileY = y;
	this.x = x * this.Width;
	this.y = y * this.Height;
	this.snapToPixel = true;
}

Tile.prototype.getRect = function(){
	var x=this.x-this.regX, y=this.y-this.regY;
	var w=x+this.width, h=y+this.height;
	return {x:x,y:y,width:w,height:h};
}

Tile.prototype.draw_old = Tile.prototype.draw;

Tile.prototype.draw = function(a,b){
	if( this.no == null ){
		return true;
	}else{
		//this.draw_old(a,b);
		var c = this.sourceRect;
		a.drawImage(this.image, c.x, c.y, c.width, c.height, -this.regX, -this.regY, c.width, c.height);
		//a.fillText(this.y, 0, 0);
	}
}

Tile.prototype.Width = 16;
Tile.prototype.Height = 16;


