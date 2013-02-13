
// 유닛 상태 구현용 인터페이스
function iCharacState(p){
	this.initialize(p);
}

// 속성
iCharacState.prototype.pUnit = null;
iCharacState.prototype.lastTime = 0;
iCharacState.prototype.mustDestroy = false;
iCharacState.prototype.icon = null;
iCharacState.prototype.name = "normal";

// 메소드
iCharacState.prototype.initialize = function(p){
	this.pUnit = p;
}

iCharacState.prototype.tick = function(elapsed){
}

iCharacState.prototype.draw = function(a, b){
	if( this.icon ){
		a.save();
		a.translate(0, -50);
		a.drawImage(contentManager.imgBaloon, 0, 0);
		a.drawImage(contentManager.imgIcons, this.icon.x, this.icon.y, this.icon.width, this.icon.height, 4, 4, this.icon.width, this.icon.height);
		a.restore();
	}
}

iCharacState.prototype.destroy = function(){
	
}

iCharacState.prototype.msgProc = function(msg){
	// 기본적인 메시지 처리 부분을 작성하자
	switch(msg.type){
		case "damage":
			// 데미지 받는 경우
			if( this.pUnit.alive ){
				this.pUnit.hp -= Math.max(msg.params[0] - this.pUnit.def);
				if( this.pUnit.hp <= 0 ){
					this.pUnit.hp = 0;
					msg.sender.msgProc({"type":"kill", "params":[this.pUnit]});
				}
			}
			break;
		case "kill":
			// 다른 유닛을 죽였을 때
			if( this.pUnit.voices && this.pUnit.voices.kill ){
				this.pUnit.voices.kill.play();
			}
			this.pUnit.kill++;
			break;
	}
}


//모든 캐릭터가 공통으로 사용할 상태기계 정의
//대기 상태
function normalState(p){
	this.initialize(p);
}
normalState.prototype = new iCharacState();

normalState.prototype.tick = function(elapsed){
}

normalState.prototype.msgProc_origin = normalState.prototype.msgProc;
normalState.prototype.msgProc = function(msg){
	switch(msg.type){
		case "damage":	// 데미지를 받을 때
			if( this.pUnit.alive ){
				this.pUnit.hp -= Math.max(msg.params[0] - this.pUnit.def, 1);
				if( this.pUnit.hp <= 0 ){
					// 으앙 쥬금
					this.pUnit.hp = 0;
					//this.pUnit.alive = false;
					this.mustDestroy = true;
					// kill 수를 올려주자
					msg.sender.msgProc({"type":"kill", "params":[this.pUnit]});
				}else{
					// 때린놈을 때려주자!
					this.pUnit.msgProc({"type":"attack", "params":[msg.sender], "sender":null });
				}
			}
			break;
		default:
			this.msgProc_origin(msg);
			break;
	}
}
// 이동 상태
function moveState(p, r, isAtk){
	this.initialize(p);
	this.path = r;
	this.realX = p.x;
	this.realY = p.y;
	this.name = "move";
	this.atk = isAtk;
	this.icon = {x:0, y:0, width:20, height:20};
	if( isAtk ){
		this.icon = {x:20, y:0, width:20, height:20};
	}
	this.pUnit.gotoAndPlay("walk_" + this.pUnit.direction);
}
moveState.prototype = new iCharacState();

// 이동상태는 경로 정보를 가지고 있어야 한당
moveState.prototype.realX = 0;
moveState.prototype.realY = 0;
moveState.prototype.path = [];
moveState.prototype.curTar = null;
moveState.prototype.moving = 0;
moveState.prototype.wait_count = 0;
moveState.prototype.refind_count = 0;

// 매 tick 마다 이동 동작을 수행해줘야지
moveState.prototype.tick = function(elapsed){
	var canmove = null;
	if( this.curTar == null && this.path.length > 0 ){
		// 이동은 끝났지만 아직 경로가 남아있을 경우
		var tmpTar = this.path[this.path.length - 1];
		canmove = canmovetile(tmpTar.tileX, tmpTar.tileY);
		if( canmove === null){
			this.curTar = this.path.pop();
			this.moving = 1;
			this.wait_count = 0;
		}else if(canmove == 2){
			tmpTar = this.path[0];
			var r = astar(Math.floor(this.realX / 16), Math.floor(this.realY / 16), tmpTar.tileX, tmpTar.tileY);
			if( r == null ){
				this.refind_count++;
				if( this.refind_count > 10){
					this.path = [];
					this.moving = 2;
					this.mustDestroy = true;
					this.refind_count = 0;
				}
				return;
			}else{
				this.refind_count = 0;
				this.path = r;
			}
		}else if(canmove == 1){
			this.wait_count++;
			if( this.wait_count > 100 ){
				this.path = [];
				this.moving = 2;
				this.mustDestroy = true;
				this.wait_count = 0;
			}
			return;
		}
	}
	
	if( this.curTar ){
		var tmp = '';
		if( this.curTar.y < this.pUnit.y){
			tmp += 'n';
		}else if( this.curTar.y > this.pUnit.y ){
			tmp += 's';
		}
		if( this.curTar.x < this.pUnit.x ){
			tmp += 'w';
		}else if( this.curTar.x > this.pUnit.x ){
			tmp += 'e';
		}

		if( tmp && this.pUnit.direction != tmp ){
			this.pUnit.setDirection(tmp, false);
			this.pUnit.gotoAndPlay('walk_' + tmp);
		}
	}

	if( canmove == null ){
		var mDelta = Math.round(elapsed * this.pUnit.moveSpeed) / 10;
		var halfDelta = mDelta / 2;
		switch(this.pUnit.direction){
			case 's':
				this.realY += mDelta;
			break;
			case 'sw':
				this.realY += halfDelta; 
				this.realX -= halfDelta;
			break;
			case 'w':
				this.realX -= mDelta;
			break;
			case 'nw':
				this.realY -= halfDelta;
				this.realX -= halfDelta;
			break;
			case 'n':
				this.realY -= mDelta;
			break;
			case 'ne':
				this.realY -= halfDelta;
				this.realX += halfDelta;
			break;
			case 'e':
				this.realX += mDelta;
			break;
			case 'se':
				this.realX += halfDelta;
				this.realY += halfDelta;
			break;
		}
	}
	this.pUnit.x = Math.round(this.realX);
	this.pUnit.y = Math.round(this.realY);

	if( this.atk && this.path[0]  ){
		var tpx = Math.floor(this.pUnit.x / 16);
		var tpy = Math.floor(this.pUnit.y / 16);
		var dist = Math.sqrt(Math.pow(Math.abs(this.path[0].tileX - tpx), 2) + Math.pow(Math.abs(this.path[0].tileY - tpy), 2));
		//if( tpx != this.path[0].tileX && tpy != this.path[0].tileY ){
		//	console.log(dist);
		//}
		if( dist <= this.pUnit.atkRange + 1){
			this.curTar = null;
			this.path.length = 0;
			this.mustDestroy = true;
		}
	}

	if( this.curTar && Math.floor(this.pUnit.x / 16) == this.curTar.tileX && Math.floor(this.pUnit.y / 16) == this.curTar.tileY ){
		this.curTar = null;
		if( this.path.length == 0 ){
			this.mustDestroy = true;
		}
	}
}

moveState.prototype.destroy = function(){
	//끝날때 서있는 애니메이션으로 돌아가쟝
	this.pUnit.gotoAndPlay('stand_' + this.pUnit.direction);
}


// 공격 상태
function attackState(p, tar){
	this.initialize(p);
	this.targetUnit = tar;
	this.icon = { x: 20, y: 0, width: 20, height: 20 };
	this.name = "attack";
}
attackState.prototype = new iCharacState();
attackState.prototype.targetUnit = null;
attackState.prototype.state = 0; // 1 인 경우 후딜중
attackState.prototype.delay = 0; 

attackState.prototype.tick = function(elapsed){
	if( !this.targetUnit || !this.targetUnit.alive || this.targetUnit.hp <= 0 ){
		this.pUnit.gotoAndPlay("stand_" + this.pUnit.direction);
		this.mustDestroy = true;
		this.targetUnit = null;
		return;
	}
	if( this.state == 1 ){
		this.delay += elapsed;
		if( this.delay >= this.pUnit.atkDelay ){
			this.delay = 0;
			this.state = 0;
			return;
		}
	}else{
		var ox = Math.floor(this.pUnit.x / 16);
		var oy = Math.floor(this.pUnit.y / 16);
		var tx = Math.floor(this.targetUnit.x / 16);
		var ty = Math.floor(this.targetUnit.y / 16);

		var dx = tx - ox;
		var dy = ty - oy;
		var distance = Math.sqrt( Math.pow(Math.abs(dx),2) + Math.pow(Math.abs(dy),2) );
		
		var dr = getDirection(tx, ty, ox, oy);
		if( distance > this.pUnit.atkRange + 1 ){
			// 사정거리보다 멀 때는 이동하고
			// 걍 이동 상태를 끼워 넣는걸로 처리해보자
			this.pUnit.pushState(new moveState(this.pUnit, astar(Math.floor(this.pUnit.x/16), Math.floor(this.pUnit.y/16), Math.floor(this.targetUnit.x/16), Math.floor(this.targetUnit.y/16)), true)); 
		}else{
			// 사정거리보다 작을 때는 공격을 시도하자!

			this.pUnit.setDirection(dr);
			this.pUnit.gotoAndPlay("attack_" + dr);
			this.pUnit.onAnimationEnd = function(){
				this.gotoAndPlay("stand_" + dr);
				this.onAnimationEnd = null;
			}
			this.state = 1;
			if( this.pUnit.effectImage ){
				var ef = new Effect(this.pUnit.effectImage);
				ef.x = this.targetUnit.x;
				ef.y = this.targetUnit.y;
				ef.z = 2;
				rCont.addChild(ef);
			}
			if( this.pUnit.voices.attack ){
				this.pUnit.voices.attack.currentTime = 0;
				this.pUnit.voices.attack.play();
			}
			this.targetUnit.msgProc({"type":"damage", "params":[this.pUnit.atk], "sender":this.pUnit});
		}
	}
}

attackState.prototype.msgProc_origin = attackState.prototype.msgProc;
attackState.prototype.msgProc = function(msg){
	if( msg.type == "kill" ){
		this.mustDestroy = true;
		if( this.pUnit.voices && this.pUnit.voices.kill ){
			this.pUnit.voices.kill.play();
		}
	}
	this.msgProc_origin(msg);
}

function Character(img){
	this.initialize(img);
}

Character.prototype = new createjs.BitmapAnimation();
Character.prototype.states = [];
Character.prototype.currentState = null;
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
Character.prototype.level = 1;
Character.prototype.kill = 0;
Character.prototype.actions = [];
Character.prototype.atkRange = 1;
Character.prototype.atkDelay = 1000;
Character.prototype.moveSpeed = 1;
Character.prototype.sight = 10;

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
					attack_s:[1,4,"stand_s",2],
					attack_sw:[14,17, "stand_sw", 2],
					attack_w:[27,30, "stand_w", 2],
					attack_nw:[40,43, "stand_nw", 2],
					attack_n:[54,57, "stand_n", 2],
					attack_ne:[66,69, "stand_ne", 2],
					attack_e:[79,82, "stand_e", 2],
					attack_se:[92,95, "stand_se", 2],
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
	this.currentState = new normalState(this);
}


var EnumState = {
	"Normal":0,
	"Move":1,
	"Attack":2
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

		a.save();
		
		a.beginPath();
		a.moveTo(-(c.regX+1), -c.regY);
		a.strokeStyle = 'black';
		a.lineWidth = 4;
		a.lineTo(d.width-c.regX+2, -c.regY);
		a.stroke();
		a.closePath();
		a.beginPath();
		a.moveTo(-c.regX, -c.regY);
		a.strokeStyle = 'red';
		a.lineWidth = 2;
		a.lineTo(d.width - c.regX , -c.regY);
		a.stroke();
		a.closePath();
		a.beginPath();
		a.strokeStyle = 'yellowgreen';
		a.moveTo(-c.regX, -c.regY);
		a.lineTo( ((this.hp / this.maxHp) * d.width) - c.regX, -c.regY);
		a.stroke();
		a.closePath();
		a.restore();
		
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
		
	}
	if( this.currentState ){
		this.currentState.draw(a, b);
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

Character.prototype.old_tick = Character.prototype.tick;
Character.prototype.hover = false;
Character.prototype.destroy = false;

Character.prototype.aura = function(onoff){
	
}

Character.prototype.lastTime = null;
Character.prototype.tick = function(elapsed){
	if( this.currentState ){
		this.currentState.tick(elapsed);
		if(this.currentState.mustDestroy ){
			this.currentState.destroy();
			this.currentState = null;
			if( this.states.length == 0){
				this.currentState = new normalState(this);
			}else{
				this.currentState = this.states.pop();
				this.currentState.initialize(this);
			}
		}
	}else{
		
	}

	if( this.hp <= 0 && this.alive ){
		//console.log("[" + this.name + "] I'm dead!");
		this.alive = false;
		this.gotoAndPlay("destroy");
		this.onAnimationEnd = function(){ this.destroy = true; };
		//this.destroy = true;
	}
	
}

Character.prototype.setState = function(st){
	this.currentState = st;
}

Character.prototype.pushState = function(st){
	this.states.push(this.currentState);
	this.currentState = st;
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

Character.prototype.addDamage = function(atk){
	var dmg = Math.max(atk - this.def, 1);
	this.hp -= dmg;
	if( this.hp < 0 ) this.hp = 0;
}

Character.prototype.msgProc = function(msg){
	if( this.currentState ){
		this.currentState.msgProc(msg);
	}
}

Character.prototype.tryAttack = function(){

}

Character.prototype.getLightmap = function(lightmap){
	var tx = Math.floor(this.x / 16);
	var ty = Math.floor(this.y / 16);
	var px,py;
	var ang = 90 / this.sight;
	var tmp = null;
	lightmap[tx][ty] = 1;
	var dang = 0;
	switch(this.direction){
		case "se":
			dang = 0;
		break;
		case "s":
			dang = 45;
		break;
		case "sw":
			dang = 90;
		break;
		case "w":
			dang = 135;
		break;
		case "nw":
			dang = 180;
		break;
		case "n":
			dang = 225;
		break;
		case "ne":
			dang = 270;
		break;
		case "e":
			dang = 315;
		break;
	}
	
	for(var i=0;i<this.sight;i++){
		tmp = ((ang*i) + dang ) * Math.PI / 180;
		for(var j=0;j<this.sight;j++){
			px = Math.floor(j * Math.cos(tmp)) + tx;
			py = Math.floor(j * Math.sin(tmp)) + ty;
			if(px < 50 && py < 37 && lightmap[px]) lightmap[px][py] = 1;
		}
		
	}
}

function Dimus(img){
	this.initialize(img);
}

Dimus.prototype = new Character('images/dimus.png');

Dimus.prototype.Character_initialize = Dimus.prototype.initialize;
Dimus.prototype.initialize = function(img, stage){
	this.Character_initialize(img, stage);
	this.name = "태도 다이무스";
	this.actions = ["attack", "move", "stop"];
	this.thumb = contentManager.imgDimus_thumb;
	this.moveSpeed = 1.0;
	this.atk = 10;
	this.atkDelay = 500;
	this.voices = contentManager.dimusVoices;
	this.effectImage = contentManager.imgDimus_ef_attack;
}

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
					walk_se:{frames:[91,92,91,93], frequency:6},
					attack_s:{frames:[3,4,0], frequency:5},
					attack_sw:{frames:[16,17,13],frequency:5},
					attack_w:{frames:[29,30,26],frequency:5},
					attack_nw:{frames:[42,43,39],frequency:5},
					attack_n:{frames:[55,56,52],frequency:5},
					attack_ne:{frames:[68,69,65],frequency:5},
					attack_e:{frames:[81,82,78],frequency:5},
					attack_se:{frames:[94,95,91],frequency:5}

				}
			});

	//this.shadow = new createjs.Shadow("#000", 3, 2, 10);
	this.stage = stage;
	this.name = "신비의 린";
	this.currentFrame = 0;
	this.BitmapAnimation_initialize(localSpriteSheet);
	//this.gotoAndPlay("stand_s");
	this.setDirection("s");
	//this.x = 100;
	//this.y = 300;
	this.snapToPixel = true;
	this.actions = ["attack", "move", "stop"];
	this.thumb = contentManager.imgRin_thumb;
	this.atkRange = 8;
	this.atk = 8;
	this.moveSpeed = 0.90;
	this.voices = contentManager.rinVoices;
	this.effectImage = contentManager.imgRin_ef_attack;
}

Cain.prototype = new Character('images/cain.png');

function Cain(img){
	this.initialize(img);
}

Cain.prototype.initialize = function(img, stage){
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
	this.name = "숙명의 카인";
	this.currentFrame = 0;
	this.BitmapAnimation_initialize(localSpriteSheet);
	//this.gotoAndPlay("stand_s");
	this.setDirection("s");
	//this.x = 100;
	//this.y = 300;
	this.snapToPixel = true;
	this.actions = ["move", "stop"];
	this.thumb = contentManager.imgCain_thumb;
	this.attackDistance = 8;
	this.moveSpeed = 0.95;
	this.voices = contentManager.cainVoices;
}


// 센티넬 만들어보자
function Sentinel(img){
	this.initialize(img);
	this.name = '센티넬';
	this.type = 'enemy';
}

Sentinel.prototype = new Character('images/sentinel.png');
Sentinel.prototype.initialize_old = Sentinel.prototype.initialize;
Sentinel.prototype.initialize = function(img){
	this.initialize_old(img);
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
					walk_se:{frames:[91,92,91,93], frequency:6},
					destroy:{frames:[104,105,106,107],frequency:5}
				}
			});
	this.spriteSheet = localSpriteSheet;
}
Sentinel.prototype.draw_ch = Sentinel.prototype.draw;
Sentinel.prototype.draw = function(a, b){
	var tilex = Math.floor(this.x / 16);
	var tiley = Math.floor(this.y / 16);
	if( !lightmap[tilex][tiley] ) return true;
	var c = this.spriteSheet.getFrame(this.currentFrame);
	var d=c.rect;
	a.save();
	a.beginPath();
	a.moveTo(-(c.regX+1), -c.regY);
	a.strokeStyle = 'black';
	a.lineWidth = 4;
	a.lineTo(d.width-c.regX+2, -c.regY);
	a.stroke();
	a.closePath();
	a.beginPath();
	a.moveTo(-c.regX, -c.regY);
	a.strokeStyle = 'red';
	a.lineWidth = 2;
	a.lineTo(d.width - c.regX , -c.regY);
	a.stroke();
	a.closePath();
	a.beginPath();
	a.strokeStyle = 'yellowgreen';
	a.moveTo(-c.regX, -c.regY);
	a.lineTo( ((this.hp / this.maxHp) * d.width) - c.regX, -c.regY);
	a.stroke();
	a.closePath();
	a.restore();
	this.draw_ch(a, b);
}
