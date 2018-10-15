var camera={
  w:500,
  h:500
}
var space ={
  w:250,
  h:250,
  points:[],
  light:[]
};

var game={
  tools: [],
  space: space,
  camera: camera,
  tool: null
};

var light ={
  x:space.w/2,
  y:space.h/2,
  intensity:1,
  rays: space.w,
  rayLength: 100*space.w,
  minimumIntensity:0.01
}


var hasyness =0.1;

for(var x= 0; x< space.w;x++){
  var col = [];  
  space.points[x]=col;  
  for(var y = 0; y<space.h;y++){        
    if((x<space.w*0.25 && y<space.h*0.25)||
      (x>space.w*0.75 && y<space.h*0.25)||
      (x<space.w*0.25 && y>space.h*0.75)||
      (x>space.w*0.75 && y>space.h*0.75)){
      col.push(0);      
    }
    else{
      col.push(0);
    }
  }
}
//console.log(space);
var ctx;
function onLoad(){
  InitToolbox(game);
  InitMaterials(game);
  var canvas = document.getElementById('viewport');
  canvas.addEventListener('mousemove', onViewportMouseMove);

  canvas.width = space.w;
  canvas.height = space.h;  
  canvas.style.width = camera.w+'px';
  canvas.style.height = camera.h+'px';  
  ctx = canvas.getContext('2d');    
  ctx.imageSmoothingEnabled= false;
  ctx.translate(0.5, 0.5);
  ctx.lineWidth = 1;
  draw();
};

function onViewportMouseMove(event){
  //TODO account for scroll
  if(event.buttons !=1) return;
  var cx = Math.floor( event.offsetX * space.w /camera.w);
  var cy = Math.floor(event.offsetY * space.h /camera.h);

  if(game.tool) game.tool.func(cx,cy,5);
  draw();
}

function draw(){
  ctx.fillStyle = "#00BFFF";
  ctx.fillRect(0, 0, camera.w, camera.h);
  drawMass(ctx,0.1);
  drawLight(ctx, space.w/2,space.h/2,space.w,space.h,1000);
}

function drawLight(ctx){    
    var angle =0;
    var angleDelta = Math.PI/light.rays;
    
    for(var r = 0; r<light.rays; r++){      
      var intensity = light.intensity;
      var sourceX = px = px2 =light.x;
      var sourceY = py = py2 = light.y;
      var vx = Math.cos(angle);
      var vy = Math.sin(angle);

      ctx.strokeStyle= 'white';
      
      var count =0;
      for(var i=0; i<light.rayLength; i++){
        px+=vx;
        py+=vy;
        if(px<0 || py<0 || px>space.w || py>space.h || intensity<=light.minimumIntensity) break;

        if(Math.floor(px)!=px2 || Math.floor(py)!=py2){                    
          px2=Math.floor(px);
          py2=Math.floor(py);
          count++;
          if(space.points[px2] && space.points[px2][py2]){              
              ctx.strokeStyle= 'rgba(255,255,200, '+intensity*hasyness+')';
              ctx.beginPath();
              ctx.moveTo(px2,py2);          
              ctx.lineTo(sourceX,sourceY);
              ctx.stroke();
			  var transparency = game.materials[space.points[px2][py2]].transparency;
			  var reflectivity = game.materials[space.points[px2][py2]].reflectivity;
			  var absorbance = 1-transparency-reflectivity;			  
              
              ctx.strokeStyle= 'rgba('+255+', '+255+', '+255+','+(intensity*reflectivity)+')';
              ctx.beginPath();
              ctx.rect(px2,py2,1,1);          
              ctx.stroke();

              sourceX = px2;
              sourceY = py2;
              intensity= intensity*reflectivity;
              

              var cx = cy = 1;
              //  ---->
              if(vx>0 && vy<0 && !space.points[px2][py2+1]){
                cy=-1;
              }
              if(vx>0 && vy<0 ){
                if(!(space.points[px2-1] && space.points[px2-1][py2])) cx=-1;
              }

              if(vx>0 && vy>0 && !space.points[px2][py2-1]){
                cy=-1;
              }
              if(vx>0 && vy>0 && !space.points[px2-1][py2]){
                cx=-1;
              }
              //  <----
              if(vx<0 && vy<0 && !space.points[px2][py2+1]){
                cy=-1;
              }
              if(vx<0 && vy<0 ){
                if(!(space.points[px2+1] && space.points[px2+1][py2])) cx=-1;
              }

              if(vx<0 && vy>0 && !space.points[px2][py2-1]){
                cy=-1;
              }
              if(vx<0 && vy>0 && !space.points[px2+1][py2]){
                cx=-1;
              }
              vx*=cx;
              vy*=cy;
          }
        }
      }
      ctx.strokeStyle= 'rgba(255,255,200, '+(intensity*hasyness)+')';
      ctx.beginPath();
              ctx.moveTo(px2,py2);          
              ctx.lineTo(sourceX,sourceY);
              ctx.stroke();
      //console.log(toDegrees(angle)+' = '+ count);

      angle+=angleDelta;
    }    
}

function drawMass(ctx, opacity){  
  for(var x= 0; x< space.w;x++){    
    for(var y = 0; y<space.h;y++){  
      if(space.points[x][y])  {
		var color = game.materials[space.points[x][y]].color;
		ctx.strokeStyle = color;// 'rgba(0,255,0,'+opacity+')';		
        ctx.beginPath();
        ctx.rect(x,y,1,1);          
        ctx.stroke();
      }
    }
  }  
}

window.onload = onLoad;

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}



