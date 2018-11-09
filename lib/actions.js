function InitActions(game){
	game.actions = {
		drawLine: drawLine,
		drawRectangle: drawRectangle,
		drawCircle: drawCircle
	};
	function drawLine(x1 , y1, x2, y2, lineWidth, materialId){
		var left = Math.min(x1,x2);
		var w = x2-x1;
		var top = Math.min(y1, y2);
		var h = y2-y1;
		
		if(w==0){
			h=Math.abs(h);
			for(var y = 0;y<=h;y++){
				game.space.set(left,top+y,materialId);
			}
			return;
		}
		
		if(h==0){
			w=Math.abs(w);
			for(var x = 0;x<=w;x++){
				game.space.set(left+x,top,materialId);
			}
			return;
		}
		
		var dirX = Math.sign(x2-x1);
		var dirY = Math.sign(y2-y1);
		var lastY= y1;
		var slope = h/w;
		for(var x=x1;x!=x2+dirX;x+=dirX){
			var y = Math.floor(y1+(x-x1)*slope);
			for(lastY;lastY!=y+dirY;lastY+=dirY){			
				game.space.set(x,lastY,materialId);
			}			
			lastY=y;
		}
	};
	function drawRectangle(x1,y1,x2,y2,lineWidth,materialId){
		drawLine(x1,y1,x1,y2,lineWidth,materialId);
		drawLine(x1,y2,x2,y2,lineWidth,materialId);
		drawLine(x2,y2,x2,y1,lineWidth,materialId);
		drawLine(x2,y1,x1,y1,lineWidth,materialId);
	};
	function drawCircle(x1,y1,x2,y2,lineWidth,materialId){
		var cx=x1;
		var cy=y1;
		var r=(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)));
		
		var steps=60;
		var angleDelta=2*Math.PI/steps;
		var angle=angleDelta;
		
		var x1=x2=cx+Math.floor(r);
		var y1=y2=cy;
		
		for(var i=0;i<steps;i++){
			x2=Math.floor(cx+r*Math.cos(angle));
			y2=Math.floor(cy+r*Math.sin(angle));
			drawLine(x1,y1,x2,y2,lineWidth,materialId);
			x1=x2;
			y1=y2;
			angle+=angleDelta;
		}
		
	};
};