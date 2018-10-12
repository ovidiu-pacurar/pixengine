window.InitToolbox = function (game){
  
  function onToolClick(e){
    console.log(e.toElement.id);
    game.tool=game.tools[e.toElement.id];
  }
  
  game.tools = {
    draw:{
      icon: 'https://ovidiu-pacurar.github.io/gallery/brush-tool.jpg',
      tip:'draw',
      func: function(px,py,r){  
      for(var x=px-r;x<px+r;x++)
        for(var y=py-r; y<py+r; y++){
          if(x>=0 && x< game.space.w && y>=0 && y<game.space.h){
            game.space.points[x][y] = 1;
          }
        }  
    }},
    erase:{    
      icon: 'https://ovidiu-pacurar.github.io/gallery/tool-erase.png',
      tip: 'erase',
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
  game.tool = game.tools.draw;
  
  for(var t in game.tools){
    var img = document.createElement('img');
    img.src=game.tools[t].icon;
    img.style.width= '30px';
    img.style.height= '30px';
    img.id = t;
    img.addEventListener('click',onToolClick);  
    document.getElementById('toolbox').appendChild(img);
  }
}