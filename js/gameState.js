// ������ �� ���� ����

// �ϴ� �������̽�...�� ����µ� js ���� �̰� �� ���̶�..
function IGameState(){
	
}
IGameState.prototype.cManager = null;

IGameState.prototype.init = function(ctx){
	// �ʱ�ȭ �ڵ�
	this.cManager = ctx;
}

IGameState.prototype.destroy = function(){
	// �Ҹ��� �ڵ�
}

IGameState.prototype.tick = function(elapsed){
	// ������Ʈ �ڵ�
}

IGameState.prototype.draw = function(a, b){
	// ������ �ڵ�
}


// ��Ʈ�� �ΰ� ����
function IntroState(ctx){
	this.init(ctx);
}

IntroState.prototype.o_init = IntroState.prototype.init;

IntroState.prototype.init = function(ctx){
	this.o_init(ctx);

}

IntroState.prototype.startTime = 0;

IntroState.prototype.tick = function(elapsed){

}