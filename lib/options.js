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
		}
	};
	
	function onRangeInput(event){
		var value = event.srcElement.valueAsNumber;
		var option = options[event.srcElement.title];
		option.object[option.property]= value;		
		option.afterChange();
	}
	
	var optionsBox = document.getElementById('options_box');
	for(var o in options){
		var input = document.createElement('input');
		var option  = options[o];
		input.type=option.type;
		if(option.type == 'range'){
			input.min = option.min;
			input.max = option.max;
			input.step = option.step;
			input.title = o;
			input.value = option.object[option.property];			
			input.addEventListener('input', onRangeInput);
		}
		optionsBox.appendChild(input);
	}
}
