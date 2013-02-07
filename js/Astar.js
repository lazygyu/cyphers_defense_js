function Astar(){
}

function getNeighbor(arr, x, y){
	var ret = [];

	if( arr[x-1] && arr[x-1][y] ) ret.push(arr[x-1][y]);
	if( arr[x-1] && arr[x-1][y-1] ) ret.push(arr[x-1][y-1]);
	if( arr[x] && arr[x][y-1] ) ret.push(arr[x][y-1]);
	if( arr[x+1] && arr[x+1][y-1] ) ret.push(arr[x+1][y-1]);
	if( arr[x+1] && arr[x+1][y] ) ret.push(arr[x+1][y]);
	if( arr[x+1] && arr[x+1][y+1] ) ret.push(arr[x+1][y+1]);
	if( arr[x] && arr[x][y+1] ) ret.push(arr[x][y+1]);
	if( arr[x-1] && arr[x-1][y+1] ) ret.push(arr[x-1][y+1]);

	return ret;

}

Astar.prototype.search = function(opt){
	var width = opt.width;
	var height = opt.height;
	var openList =[];
	var closedList = [];
	var nodemap = [];

	var isclosed = opt.check || function(x,y){ return nodemap[x][y].no != 0; };
	
	
	for(var i=0;i<height;i++){
		nodemap[i] = [];
		for(var j=0; j<width;j++){
			nodemap[i][j] = { tileX:j, tileY:i, closed:isclosed(j,i), visited:false, };
		}

	}

}

Astar.prototype.getNeibogh = function(x,y){

}