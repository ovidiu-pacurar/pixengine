var camera={
  w:500,
  h:500,  
  zoom:1,
  x:0,
  y:0
}
var space ={
  w:500,
  h:500,
  gridSize: 10,
  gridW:1,
  gridH:1,
  points:[],
  grid:[],  
  light:[],
  set:setSpacePoint
};

var lightMaterialId= 5;

var light ={
  x:space.w/2,
  y:space.h/2,
  intensity:1,
  rays: 3,
  rayLength: 10*space.w,
  minimumIntensity:0.01
}

var game={
  tools: [],
  space: space,
  camera: camera,
  tool: null,
  draw: draw,
  hasyness: 0.3,
  light: light
};


camera.zoom = camera.w/space.h;
space.gridW=Math.floor(space.w/space.gridSize);
space.gridH=Math.floor(space.h/space.gridSize);

space.points.length = space.w;
for(var x= 0; x< space.w;x++){
  var buffer = new ArrayBuffer(space.h);
  var col = new Uint8ClampedArray(buffer);    
  space.points[x]=col;  
}

space.grid.length = space.gridW;
for(var x= 0; x< space.gridW;x++){
  var buffer = new ArrayBuffer(space.gridH);
  var col = new Uint8ClampedArray(buffer);    
  space.grid[x]=col;  
}

function setSpacePoint(x,y,value){
	var prev = space.points[x][y];
	space.points[x][y]=value;
	if(value && prev) return;
	if(!value && !prev) return;
	
	space.grid[Math.floor(x/space.gridSize)][Math.floor(y/space.gridSize)]+= value!=0?+1:-1;
}

var ctx;
function onLoad(){
  InitToolbox(game);
  InitMaterials(game);
  InitActions(game);
  InitOptions(game);
  var canvas = document.getElementById('viewport');
  canvas.addEventListener('mousemove', onViewportMouseMove);
  canvas.addEventListener('click', onViewportClick);
  canvas.addEventListener('wheel', onViewportWheel);

  canvas.width = camera.w;
  canvas.height = camera.h;  
  canvas.style.width = camera.w+'px';
  canvas.style.height = camera.h+'px';  
  ctx = canvas.getContext('2d');    
  ctx.imageSmoothingEnabled= true;  
  
  ctx.lineWidth = 1;
  draw();
};
var wheelWeight=0.001;

function onViewportWheel(event){
	
	camera.zoom+=event.wheelDelta*wheelWeight;
	console.log(event.wheelDelta+' : '+camera.zoom);
	draw();
}
var previous =null;
function onViewportMouseMove(event){
  //TODO account for scroll
  if(event.buttons !=1){
	previous = null;
	return;
  }
  var cx = Math.floor( event.offsetX * space.w /camera.w);
  var cy = Math.floor(event.offsetY * space.h /camera.h);

  if(game.tool){
	if(previous){
		game.tool.line(previous.x,previous.y, cx,cy,1);
	}else{	
		game.tool.point(cx,cy,1);
	}
	previous={x:cx,y:cy};
  }
  draw();
}

function onViewportClick(event){
  //TODO account for scroll
  
  var cx = Math.floor( event.offsetX * space.w /camera.w);
  var cy = Math.floor(event.offsetY * space.h /camera.h);

  if(game.tool) game.tool.point(cx,cy,1);
  draw();
}

function draw(){
	var time = new Date().getTime();
	ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle = "#00BFFF";
  ctx.fillRect(0, 0, camera.w, camera.h);
  ctx.setTransform(camera.zoom,0,0,camera.zoom,camera.x,camera.y);
  drawMass(ctx,1);
  drawLight(ctx, space.w/2,space.h/2,space.w,space.h,1000);
  drawGrid(ctx,0.5);
  time = new Date().getTime() - time;
  
  console.log(time);
}

function GetPrimaryRays(){
	var res=[];
	for(var x=0; x<space.w;x++)
		for(var y=0; y<space.h; y++){
			if(space.points[x][y]==lightMaterialId){
				var angle =0;
				var angleDelta = 2*Math.PI/light.rays;
				for(var r = 0; r<light.rays; r++){      
					var ray={x:x,y:y, angle: angle};
					res.push(ray);
					angle+=angleDelta;
				}
			}
		}	
		return res;
	
}

function findRayCollision(rx,ry,vx,vy){
	var x=rx;
	var y=ry;
	var gx=Math.floor(x/space.gridSize);
	var gy=Math.floor(y/space.gridSize);
	var dirX=Math.sign(vx);
	var dirY=Math.sign(vy);
}


function drawLight(ctx){    
	var stupidCount = 0;
	var notStupid =0;
	var rays = GetPrimaryRays();    
    for(var r = 0; r<rays.length; r++){      
      var intensity = light.intensity;
      var sourceX = px = px2 =rays[r].x;
      var sourceY = py = py2 = rays[r].y;
      var vx = Math.cos(rays[r].angle);
      var vy = Math.sin(rays[r].angle);

      ctx.strokeStyle= 'white';
            
      for(var i=0; i<light.rayLength; i++){
        px+=vx;
        py+=vy;
        if(px<0 || py<0 || px>space.w || py>space.h) break;

        if(Math.floor(px)!=px2 || Math.floor(py)!=py2){          
			notStupid++;
          px2=Math.floor(px);
          py2=Math.floor(py);
          
          if(space.points[px2] && space.points[px2][py2]){              
              if(game.hasyness){
				ctx.strokeStyle= 'rgba(255,255,200, '+intensity*game.hasyness+')';
				ctx.beginPath();
				ctx.moveTo(px2,py2);          
				ctx.lineTo(sourceX,sourceY);
				ctx.stroke();
			  }
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
              if( intensity<=light.minimumIntensity) break;

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
        } else {stupidCount++;}
      }
	  if(game.hasyness){
		ctx.strokeStyle= 'rgba(255,255,200, '+(intensity*game.hasyness)+')';
		ctx.beginPath();
        ctx.moveTo(px2,py2);          
        ctx.lineTo(sourceX,sourceY);
        ctx.stroke();
	  }            
    }    
	console.log('stupid: '+stupidCount);
	console.log('good: '+notStupid);
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

function drawGrid(ctx, opacity){  
	ctx.strokeStyle =  'rgba(0,0,0,'+opacity+')';		
  for(var x= 0; x< space.gridW;x++){    
    for(var y = 0; y<space.gridH;y++){  
      if(space.grid[x][y])  {
		var full = space.grid[x][y]/space.gridSize/space.gridSize;
		//ctx.strokeStyle =  'rgba(0,0,0,'+opacity*full+')';		
        ctx.beginPath();
        ctx.rect(x*space.gridSize,y*space.gridSize,space.gridSize,space.gridSize);          
        ctx.stroke();
      }
    }
  }  
}

window.onload = onLoad;

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}



