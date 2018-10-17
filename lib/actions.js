function InitActions(game){
	game.actions = {
		drawLine: drawLine
	};
	function drawLine(x1 , y1, x2, y2, lineWidth, materialId){
		var left = Math.min(x1,x2);
		var w = x2-x1;
		var top = Math.min(y1, y2);
		var h = y2-y1;
		
		if(w==0){
			h=Math.abs(h);
			for(var y = 0;y<=h;y++){
				game.space.points[left][top+y]=materialId;
			}
			return;
		}
		
		if(h==0){
			w=Math.abs(w);
			for(var x = 0;x<=w;x++){
				game.space.points[left+x][top]=materialId;
			}
			return;
		}
		
		var dirX = Math.sign(x2-x1);
		var dirY = Math.sign(y2-y1);
		var lastY= y1;
		for(var x=x1;x!=x2+dirX;x+=dirX){
			var y = Math.floor(y1+(x-x1)*h/w);
			for(lastY;lastY!=y+dirY;lastY+=dirY){			
				game.space.points[x][lastY]=materialId;
			}			
			lastY=y;
		}
	}	
};