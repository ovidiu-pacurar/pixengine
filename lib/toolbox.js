function InitToolbox(game){
	var toolbox = document.getElementById('toolbox');
	var idPrefix = 'tool-';
	function selectTool(toolId){
		var previous  = toolbox.getElementsByClassName('selected')[0];
		if(previous){
			previous.classList.remove('selected');
		}
		document.getElementById(idPrefix+toolId).classList.add('selected');		
		game.tool=game.tools[toolId];
	}
	
	function onToolClick(e){
		selectTool(e.toElement.id.replace(idPrefix,''));
	}
  
  game.tools = {
    draw:{
      icon: 'img/tool-brush.jpg',
      tip:'draw',
      point: function(px,py,r){  	  
       for(var x=px-r;x<px+r;x++)
         for(var y=py-r; y<py+r; y++){
           if(x>=0 && x< game.space.w && y>=0 && y<game.space.h){
             game.space.points[x][y] = game.material.id;
           }
         }  
	  },
	  line: function(x1,y1,x2,y2,r){
		  game.actions.drawLine(x1,y1,x2,y2,r,game.material.id);
	  }
	},
    erase:{    
      icon: 'img/tool-erase.png',
      tip: 'erase',
      point: function(px,py,r){  
      for(var x=px-r;x<px+r;x++)
        for(var y=py-r; y<py+r; y++){
          if(x>=0 && x< game.space.w && y>=0 && y<game.space.h){
            game.space.points[x][y] = 0;
          }
        }  
      }
    }
  };
  
  
  
  for(var t in game.tools){
    var img = document.createElement('img');
    img.src=game.tools[t].icon;
    img.style.width= '30px';
    img.style.height= '30px';
    img.id = idPrefix+t;
	img.title = game.tools[t].tip;
    img.addEventListener('click',onToolClick);  	
    toolbox.appendChild(img);
  }
  
  selectTool('draw');
}