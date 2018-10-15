function InitMaterials(game){
	var materialBox = document.getElementById('material_box');
	var idPrefix = 'material-';
	
	function selectMaterial(materialName){
		var previous  = materialBox.getElementsByClassName('selected')[0];
		if(previous){
			previous.classList.remove('selected');
		}
		document.getElementById(idPrefix+materialName).classList.add('selected');		
		game.material=game.materialDefinitions[materialName];
	}
	
	function onMaterialClick(e){    
		selectMaterial(e.toElement.id.replace(idPrefix,''));
	}
  
  game.materialDefinitions = {
    nothing:{
	  id: 0,
      icon: 'img/material-nothing.png',
      tip:'nothing',
    },
    iron:{  
		id:1,
		transparency:0,
		reflectivity:0.8,
		color: '#434d4b',
      icon: 'img/material-iron.jpg',
      tip: 'iron'    
    },
	soil:{  
		id:2,
		transparency:0,
		reflectivity:0.1,
		color: '#9B7653',
      icon: 'img/material-soil.jpg',
      tip: 'soil'    
    },
	darkness:{  
		id:3,
		transparency:0,
		reflectivity:0,
		color: '#000000',
      icon: 'img/material-darkness.jpg',
      tip: 'darkness'    
    },
	water:{  
		id:4,
		transparency:0.3,
		reflectivity:0.3,
		color: '#5050FF',
      icon: 'img/material-water.png',
      tip: 'water'    
    }	
  };
  
  game.materials=[];
    
  
  for(var m in game.materialDefinitions){
	var material = game.materialDefinitions[m];	
    var img = document.createElement('img');
	
	game.materials[material.id] = material;
	
    img.src = material.icon;
    img.style.width= '30px';
    img.style.height= '30px';
    img.id = idPrefix+m;
	img.title = material.tip;
    img.addEventListener('click',onMaterialClick);  	
    materialBox.appendChild(img);
  }
  
  selectMaterial('iron');
};