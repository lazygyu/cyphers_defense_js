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

Character.prototype.initialize = function(img){
	var localSpriteSheet = new createjs.SpriteSheet({
				images:[img],
				frames:{width:60, height:60, regX:30, regY:60},
				animations:{
					stand_s:[0, 0],
					stand_sw:[13, 13],
					stand_w:[26, 26],
					stand_nw:[39,39],
					stand_n:[53,53],
					stand_ne:[65, 65],
					stand_e:[78,78],
					stand_se:[91,91],
					attack_s:[1,4,"stand_s",2],
					attack_sw:[14,17, "stand_sw", 2],
					attack_w:[26,29, "stand_w", 2],
					attack_nw:[40,43, "stand_nw", 2],
					attack_n:[53,56, "stand_n", 2],
					attack_ne:[66,69, "stand_ne", 2],
					attack_e:[79,82, "stand_e", 2],
					attack_se:[92,95, "stand_se", 2],
					walk_s:{
						frames:[0,5],
						frequency:5
					},
					walk_sw:{frames:[13,19], frequency:5},
					walk_w:{frames:[26,31], frequency:5},
					walk_nw:{frames:[39,44], frequency:5},
					walk_n:{frames:[53,57], frequency:5},
					walk_ne:{frames:[65,70], frequency:5},
					walk_e:{frames:[78,83], frequency:5},
					walk_se:{frames:[91,96], frequency:5}
				}
			});

	this.shadow = new createjs.Shadow("#000", 3, 2, 10);
	this.name = "Player";
	this.currentFrame = 0;
	this.BitmapAnimation_initialize(localSpriteSheet);
	//this.gotoAndPlay("stand_s");
	this.setDirection("s");
	//this.x = 100;
	//this.y = 300;

}

Character.prototype.state = 0;

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

Character.prototype.setDirection = function(d){
	this.direction = d;
	console.log("dir : " + d);
	this.gotoAndPlay("stand_" + d);
}

Character.prototype.draw_origin = Character.prototype.draw;

Character.prototype.draw = function(a, b){
	var c = this.spriteSheet.getFrame(this.currentFrame);
	var d=c.rect;
	// draw maxHp in red;
	if(this.selected){
		a.save();
		a.strokeStyle = '#0f0';
		drawEllipse(a, -(c.regX/3)*2, -(c.regY/2), (d.width/3)*2, 20);
		a.restore();
	}
	this._normalizeFrame();
	if(c!=null){
		a.drawImage(c.image,d.x,d.y,d.width,d.height,-c.regX,-c.regY,d.width,d.height);
		return true
	}
}

Character.prototype.tick = function(){
	if(this.state == 1){
		switch(this.direction){
			case 's':
				this.y+=2;
				break;
			case 'sw':
				this.y++;
				this.x--;
				break;
			case 'w':
				this.x-=2;
				break;
			case 'nw':
				this.y--;
				this.x--;
				break;
			case 'n':
				this.y-=2;
				break;
			case 'ne':
				this.x++;
				this.y--;
				break;
			case 'e':
				this.x+=2;
				break;
			case 'se':
				this.x++;
				this.y++;
				break;
		}
	}
}

