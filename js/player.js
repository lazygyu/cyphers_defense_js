function Character(img){
	this.initialize(img);
}

Character.prototype = new createjs.BitmapAnimation();

Character.prototype.bounds = 0;
Character.prototype.alive = true;
Character.prototype.hp = 100;
Character.prototype.maxHp = 100;
Character.prototype.def = 1;
Character.prototype.atk = 1;
Character.prototype.direction = 's';
Character.prototype.selected = false;
Character.prototype.BitmapAnimation_initialize = Character.prototype.initialize;
Character.prototype.z = 1;

Character.prototype.initialize = function(img, stage){
	var localSpriteSheet = new createjs.SpriteSheet({
				images:[img],
				frames:{width:60, height:60, regX:30, regY:45},
				animations:{
					stand_s:[0, 0],
					stand_sw:[13, 13],
					stand_w:[26, 26],
					stand_nw:[39,39],
					stand_n:[53,53],
					stand_ne:[65, 65],
					stand_e:[78,78],
					stand_se:[91,91],
					attack_s:[1,4,"stand_s",1],
					attack_sw:[14,17, "stand_sw", 1],
					attack_w:[27,30, "stand_w", 1],
					attack_nw:[40,43, "stand_nw", 1],
					attack_n:[54,57, "stand_n", 1],
					attack_ne:[66,69, "stand_ne", 1],
					attack_e:[79,82, "stand_e", 1],
					attack_se:[92,95, "stand_se", 1],
					walk_s:{
						frames:[0,5],
						frequency:5
					},
					walk_sw:{frames:[14,18], frequency:3},
					walk_w:{frames:[26,31], frequency:3},
					walk_nw:{frames:[39,44], frequency:3},
					walk_n:{frames:[53,57], frequency:3},
					walk_ne:{frames:[65,70], frequency:3},
					walk_e:{frames:[78,83], frequency:3},
					walk_se:{frames:[91,96], frequency:3}
				}
			});

	//this.shadow = new createjs.Shadow("#000", 3, 2, 10);
	this.stage = stage;
	this.name = "Player";
	this.currentFrame = 0;
	this.BitmapAnimation_initialize(localSpriteSheet);
	//this.gotoAndPlay("stand_s");
	this.setDirection("s");
	//this.x = 100;
	//this.y = 300;
	this.snapToPixel = true;

	this.auraShadow = new createjs.Shadow("#FF0", 0, 0, 2);
}

Character.prototype.state = 0;
Character.prototype.path = [];
Character.prototype.movestate = 2;

function drawEllipse(ctx, x, y, w, h) {
  var kappa = .5522848;
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.closePath();
  ctx.stroke();
}

Character.prototype.getBound = function(){
	var c = this.spriteSheet.getFrame(this.currentFrame);
	return { x: this.x - c.regX, y: this.y - c.regY, width: c.rect.width, height:c.rect.height };
}

Character.prototype.setDirection = function(d, f){
	this.direction = d;
	if(f !== false ){ 
		this.gotoAndPlay("stand_" + d); //console.log("stop"); 
	}
	//else { //console.log("keep"); }
}

Character.prototype.draw_origin = Character.prototype.draw;

Character.prototype.draw = function(a, b){
	var c = this.spriteSheet.getFrame(this.currentFrame);
	var d=c.rect;
	// draw maxHp in red;
	
	if(this.selected){
		a.save();
		a.strokeStyle = '#0f0';
		drawEllipse(a, -(c.regX/3)*2, -(c.regY/3), (d.width/3)*2, 20);
		a.restore();
		/*
		a.save();
		a.strokeStyle = '#f00';
		a.beginPath();
		//a.moveTo(this.x, this.y);
		
		var tmpp = null;
		for(var i=0,l=this.path.length;i<l;i++){
				tmpp = this.globalToLocal(this.path[i].x, this.path[i].y);
				a.fillText(i, tmpp.x, tmpp.y);
				a.lineTo(tmpp.x, tmpp.y);
		}
		a.stroke();
		a.closePath();
		a.restore();
		*/
	}
	if(c!=null){
		a.save();
		
		a.drawImage(c.image,d.x,d.y,d.width,d.height,-c.regX,-c.regY,d.width,d.height);
		a.restore();
		//a.fillText(this.y, 5, 0);
		return true
	}
	this._normalizeFrame();
	
}

Character.prototype.isVisible = function(){
	return true;
}

Character.prototype.hitRect = function(rect){
	var c = this.spriteSheet.getFrame(this.currentFrame);
	var d = c.rect;
	
	var l1 = this.x - c.regX;
	var t1 = this.y - c.regY;
	var r1 = l1 + d.width;
	var b1 = t1 + d.height;

	var r2 = rect.x + rect.width;
	var b2 = rect.y + rect.height;

	if( b1 < rect.y || t1 > b2 ) return false;
	if( r1 < rect.x || l1 > r2 ) return false;
	return true;
}

/*
function rectHit(rect1, rect2){
	var r1 = rect1.x + rect1.width;
	var b1 = rect1.y + rect1.height;
	var r2 = rect2.x + rect2.width;
	var b2 = rect2.y + rect2.height;


	
	if( b1 < rect2.y ) return false;
	if( rect1.y > b2 ) return false;
	if( r1 < rect2.x ) return false;
	if( rect1.x > r2 ) return false;
	return true;
}
*/

Character.prototype.move_speed = 10; // pixel per second
Character.prototype.old_tick = Character.prototype.tick;
Character.prototype.curTar = null;
Character.prototype.hover = false;

Character.prototype.aura = function(onoff){
	
}

Character.prototype.refind_count = 0;
Character.prototype.wait_count = 0;

Character.prototype.tick = function(elapsed){
	var canmove = null;
	if( this.curTar == null && this.path.length > 0 ){
		var tmpTar = this.path[this.path.length - 1];
		canmove = canmovetile(tmpTar.tileX, tmpTar.tileY);
		if( canmove === null ){
			this.curTar = this.path.pop();
			this.state = 1;
			this.movestate = 1;
			this.wait_count = 0;
		}else if(canmove == 2){
			tmpTar = this.path[0];
			//console.log("re-finding");
			var r = astar(Math.floor(this.x /16), Math.floor(this.y / 16), tmpTar.tileX, tmpTar.tileY);
			if( r == null ){
				this.refind_count++;
				if( this.refind_count > 10 ){
					this.path = [];
					this.movestate = 2;
					this.state = 0;
					this.refind_count = 0;
					this.gotoAndPlay("stand_" + this.direction);
				}
				return true;
			}
			this.refind_count = 0;
			this.path = r;
			return true;
		}else if(canmove == 1){
			this.wait_count++;
			if( this.wait_count > 180 ){
				this.path = [];
				this.movestate = 2;
				this.state = 0;
				this.wait_count = 0;
				this.gotoAndPlay("stand_" + this.direction);
			}
		}
	}

	
	if( this.curTar ){
		var tmp = '';
		if( this.curTar.y  < this.y ){
			tmp += 'n';
		}else if(this.curTar.y  > this.y ){
			tmp += 's';
		}

		if( this.curTar.x < this.x ){
			tmp += 'w';
		}else if(this.curTar.x  > this.x){
			tmp += 'e';
		}
		
		if(tmp && this.direction != tmp){
			this.setDirection(tmp, false);
			this.gotoAndPlay('walk_' + tmp);
		}

	}



	if(this.state == 1 && canmove == null){
		switch(this.direction){
			case 's':
				this.y+=1;
				break;
			case 'sw':
				this.y++;
				this.x--;
				break;
			case 'w':
				this.x-=1;
				break;
			case 'nw':
				this.y--;
				this.x--;
				break;
			case 'n':
				this.y-=1;
				break;
			case 'ne':
				this.x++;
				this.y--;
				break;
			case 'e':
				this.x+=1;
				break;
			case 'se':
				this.x++;
				this.y++;
				break;
		}
	}

	if( this.curTar && this.curTar.x == this.x && this.curTar.y == this.y ){
		this.curTar = null;
		this.state = 0;
		if( this.path.length == 0 ){
			this.gotoAndPlay('stand_' + this.direction);
			this.movestate = 2;
		}
	}
	//this._tick();
}

Character.prototype.attack_start = function(){
	this.gotoAndPlay("attack_" + this.direction);
	this.onAnimationEnd = this.attack_end;
	this.state = 2;
}

Character.prototype.attack_end = function(){
	this.state = 0;
	this.gotoAndPlay("stand_" + this.direction);
	this.onAnimationEnd = null;
}

function Dimus(img){
	this.initialize(img);
}

Dimus.prototype = new Character('images/dimus.png');

function Rin(img){
	this.initialize(img);
}

Rin.prototype = new Character('images/rin.png');

Rin.prototype.initialize = function(img, stage){
	var localSpriteSheet = new createjs.SpriteSheet({
				images:[img],
				frames:{width:60, height:60, regX:30, regY:45},
				animations:{
					stand_s:[0, 0],
					stand_sw:[13, 13],
					stand_w:[26, 26],
					stand_nw:[39,39],
					stand_n:[52,52],
					stand_ne:[65, 65],
					stand_e:[78,78],
					stand_se:[91,91],
					walk_s:{
						frames:[0,1,0,2],
						frequency:6
					},
					walk_sw:{frames:[13,14,13,15], frequency:6},
					walk_w:{frames:[26,27,26,28], frequency:6},
					walk_nw:{frames:[39,40,39,41], frequency:6},
					walk_n:{frames:[52,53,52,54], frequency:6},
					walk_ne:{frames:[65,66,65,67], frequency:6},
					walk_e:{frames:[78,79,78,80], frequency:6},
					walk_se:{frames:[91,92,91,93], frequency:6}
				}
			});

	//this.shadow = new createjs.Shadow("#000", 3, 2, 10);
	this.stage = stage;
	this.name = "Player";
	this.currentFrame = 0;
	this.BitmapAnimation_initialize(localSpriteSheet);
	//this.gotoAndPlay("stand_s");
	this.setDirection("s");
	//this.x = 100;
	//this.y = 300;
	this.snapToPixel = true;

	this.auraShadow = new createjs.Shadow("#FF0", 0, 0, 2);
}

