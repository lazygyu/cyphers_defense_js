// 게임의 각 상태 정의

// 일단 인터페이스...를 만드는데 js 에서 이게 뭔 짓이람..
function IGameState(){
	
}
IGameState.prototype.cManager = null;

IGameState.prototype.init = function(ctx){
	// 초기화 코드
	this.cManager = ctx;
}

IGameState.prototype.destroy = function(){
	// 소멸자 코드
}

IGameState.prototype.tick = function(elapsed){
	// 업데이트 코드
}

IGameState.prototype.draw = function(a, b){
	// 렌더링 코드
}


// 인트로 로고 상태
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