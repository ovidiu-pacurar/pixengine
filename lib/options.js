function InitOptions(game){
	var options = {
		hasyness:{
			object: game,
			property: 'hasyness',
			type: 'range',
			min: 0,
			max: 1,
			step: 0.01,
			afterChange: game.draw
		},
		rays:{
			object: game.light,
			property: 'rays',
			type: 'range',
			min: 0,
			max: game.camera.w*4,
			step: 1,
			afterChange: game.draw
		},
		maxReflections:{
			object: game.light,
			property: 'maxReflections',
			type: 'range',
			min: 0,
			max: 20,
			step: 1,
			afterChange: game.draw
		},
		Z:{
			object: game.camera,
			property: 'zoom',
			type: 'range',
			min: 0.5,
			max: 2,
			step: 0.1,
			afterChange: game.draw
		},
		X:{
			object: game.camera,
			property: 'x',
			type: 'range',
			min: -game.camera.w,
			max: game.camera.w,
			step: 1,
			afterChange: game.draw
		},
		Y:{
			object: game.camera,
			property: 'y',
			type: 'range',
			min: -game.camera.h,
			max: game.camera.h,
			step: 1,
			afterChange: game.draw
		}
	};
	
	game.options = options;
	
	
	
	function onRangeInput(event){
		var value = event.srcElement.valueAsNumber;
		var option = options[event.srcElement.title];
		option.object[option.property]= value;		
		console.log(event.srcElement.title+' : '+value);
		option.afterChange();
	}
	
	var optionsTable = document.getElementById('options_table');	
	for(var o in options){
		var row = document.createElement('tr');
		var nameCell = document.createElement('td');
		var controlCell = document.createElement('td');
		var input = document.createElement('input');
		var option  = options[o];
		nameCell.innerHTML = o;
		input.type=option.type;
		if(option.type == 'range'){
			input.min = option.min;
			input.max = option.max;
			input.step = option.step;
			input.title = o;
			input.value = option.object[option.property];			
			input.addEventListener('input', onRangeInput);
		}
		controlCell.appendChild(input);
		row.appendChild(nameCell);
		row.appendChild(controlCell);
		optionsTable.appendChild(row);
	}
}
