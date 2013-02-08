function Dashboard(){
	this.initialize();
}

Dashboard.prototype = new createjs.DisplayObject();

// 초기화
Dashboard.prototype.DisplayObject_initialize = Dashboard.prototype.initialize;
Dashboard.prototype.initialize = function(){
	this.x = 0;
	this.y = 577;

	this.DisplayObject_initialize();
}

// 속성
Dashboard.prototype.selected = [];
Dashboard.prototype.actions = [];

Dashboard.prototype.update= function(chrs){
	this.selected.length = 0;
	this.actions.length = 0;
	var tmpActions = {};
	for(var i in chrs){
		if( chrs[i].selected ){
			this.selected.push(chrs[i]);
			for(var j in chrs[i].actions ){
				if( tmpActions[chrs[i].actions[j]] == undefined ) tmpActions[chrs[i].actions[j]] = 0;
				tmpActions[chrs[i].actions[j]]++;
			}
		}
	}

	

	for(var i in tmpActions){
		if( tmpActions[i] == this.selected.length ){
			this.actions.push(i);
		}
	}

}

// 메소드
Dashboard.prototype.draw = function(a, b){
	a.save();
	a.strokeStyle = "#000";
	a.fillStyle = "#eee";
	a.fillRect(0, 0, 800, 100);
	a.fillStyle = "#333";
	
	
	
	for(var i in this.selected ){
		if( this.selected[i].thumb ){
			a.drawImage(this.selected[i].thumb, 0, 0, 80, 80, i*90, 5, 80, 80);
		}else{		
			a.font = "bold 12px 맑은고딕";
			a.fillText(this.selected[i].name, i * 90 + 8, 20);
		}
		a.font = "bold 9px 맑은고딕";
		a.fillText(this.selected[i].hp + " / " + this.selected[i].maxHp, i * 90 + 8, 40);
		a.strokeRect(i*90, 5, 80, 90);
	}

	for(var i in this.actions){
		a.fillText(this.actions[i], 460, i * 12 + 20);
	}
	
	a.restore();

}

Dashboard.prototype.tick = function(){
}