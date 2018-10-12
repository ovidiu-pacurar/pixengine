function InitMaterials(game){
	var materialBox = document.getElementById('material_box');
	var idPrefix = 'material-';
	
	function selectMaterial(materialId){
		var previous  = materialBox.getElementsByClassName('selected')[0];
		if(previous){
			previous.classList.remove('selected');
		}
		document.getElementById(idPrefix+materialId).classList.add('selected');		
		game.material=game.materials[materialId];
	}
	
	function onMaterialClick(e){    
		selectMaterial(e.toElement.id.replace(idPrefix,''));
	}
  
  game.materials = {
    nothing:{
      icon: 'img/material-nothing.png',
      tip:'nothing',
      func: function(px,py,r){  
      for(var x=px-r;x<px+r;x++)
        for(var y=py-r; y<py+r; y++){
          if(x>=0 && x< game.space.w && y>=0 && y<game.space.h){
            game.space.points[x][y] = 1;
          }
        }  
    }},
    iron:{    
      icon: 'img/material-iron.jpg',
      tip: 'iron',
      func: function(px,py,r){  
      for(var x=px-r;x<px+r;x++)
        for(var y=py-r; y<py+r; y++){
          if(x>=0 && x< game.space.w && y>=0 && y<game.space.h){
            game.space.points[x][y] = 0;
          }
        }  
      }
    }
  };
  
  
  for(var m in game.materials){
    var img = document.createElement('img');
    img.src=game.materials[m].icon;
    img.style.width= '30px';
    img.style.height= '30px';
    img.id = idPrefix+m;
	img.title = game.materials[m].tip;
    img.addEventListener('click',onMaterialClick);  	
    materialBox.appendChild(img);
  }
  
  selectMaterial('iron');
};