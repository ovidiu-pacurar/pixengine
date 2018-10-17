function InitActions(game){
	game.actions = {
		drawLine: drawLine
	};
	function drawLine(x1 , y1, x2, y2, lineWidth, materialId){
		var left = Math.min(x1,x2);
		var w = Math.abs(x1-x2);
		var top = Math.min(y1, y2);
		var h = Math.abs(y1-y2);
		
		if(w==0){
			for(var y = 0;y<=h;y++){
				game.space.points[left][top+y]=materialId;
			}
			return;
		}
		
		if(h==0){
			for(var x = 0;x<=w;x++){
				game.space.points[left+x][top]=materialId;
			}
			return;
		}
		
		for(var x=0;x<=w;x++){
			var y = Math.floor(x*h/w);
			game.space.points[left+x][top+y]=materialId;
		}
	}	
};