Number.prototype.between = function(a, b){
	return (this >= a && this < b);
}


function getDirection(ox, oy, tx, ty){
	var dx = tx - ox;
	var dy = ty - oy;
	var rad = Math.atan2(dx, dy);
	var degree = (rad*180)/Math.PI;
	if( degree < 0 ) degree += 360;
	if( degree.between(0, 22.5) || degree.between(337.5, 360) ){
		return 'n';
	}else if( degree.between(22.5, 67.5) ){
		return 'nw';
	}else if( degree.between(67.5, 112.5) ){
		return 'w';
	}else if( degree.between(112.5, 157.5) ){
		return 'sw';
	}else if( degree.between(157.5, 202.5) ){
		return 's';
	}else if( degree.between(202.5, 247.5) ){
		return 'se';
	}else if( degree.between(247.5, 292.5) ){
		return 'e';
	}else if( degree.between(292.5, 337.5) ){
		return 'ne';
	}


	return 'w';
}
