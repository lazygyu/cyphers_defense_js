function Trigger(){
}

Trigger.prototype.enable = false;
Trigger.prototype.inProcess = false;
Trigger.prototype.isEnd = false;
Trigger.prototype.isLoop = false;

Trigger.prototype.check = function(){
	return false;	
}

Trigger.prototype.tick = function(elapsed){

}
