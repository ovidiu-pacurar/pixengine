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
  gridSize: 50,
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
  rays: 1000,
  maxLength: 10*space.w,
  maxReflections: 5,
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

var stats={
	primaryRays:0,
	secondaryRays:0,
	raySteps:0,
	time:0,
	reset: function(reset){
		this.primaryRays=0;
		this.secondaryRays=0;
		this.raySteps=0;
		this.time= new Date().getTime();
	}
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
	stats.reset();
	ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle = "#00BFFF";
  ctx.fillRect(0, 0, camera.w, camera.h);
  ctx.setTransform(camera.zoom,0,0,camera.zoom,camera.x,camera.y);
  drawMass(ctx,1);
  drawLight(ctx, space.w/2,space.h/2,space.w,space.h,1000);
  drawGrid(ctx,0.5);
  stats.time = new Date().getTime() - stats.time;
  
  console.log(stats);
}

function GetPrimaryRays(){
	var res=[];
	for(var gx= 0; gx< space.grid.length;gx++){    
		var gridCol =space.grid[gx];
		for(var gy = 0; gy<gridCol.length;gy++){
			if(gridCol[gy]){
				for(var x= 0; x< space.gridSize;x++){    
					for(var y = 0; y<space.gridSize;y++){  
						px = gx*space.gridSize+x;
						py = gy*space.gridSize+y;
						if(space.points[px][py]==lightMaterialId){
							var angle =Math.PI/8;
							var angleDelta = 2*Math.PI/light.rays;
							for(var r = 0; r<light.rays; r++){      
								var ray={x:px,y:py, angle: angle};
								res.push(ray);
								angle+=angleDelta;
							}
						}
					}	
				}
			}
		}
	}
	return res;
	
}

function findRayCollision(ctx, rx,ry,vx,vy){	
	var sourceX = gx=Math.floor(rx/space.gridSize);
	var sourceY = gy=Math.floor(ry/space.gridSize);
	var dirX=Math.sign(vx);
	var dirY=Math.sign(vy);
	var limitY = vy<0? 0: space.h-1;
	var limitX = vx<0? 0: space.w-1;
	
	if(vx==0){		
		for(gy; gy!=limitY; gy+=dirY){
			ctx.strokeStyle='red';
			ctx.beginPath();
			ctx.rect(gx*space.gridSize,gy*space.gridSize,space.gridSize,space.gridSize);          
			ctx.stroke();
		}
		return;
	}
	
	if(vy==0){		
		for(gx; gx!=limitX; gx+=dirX){
			ctx.strokeStyle='red';
			ctx.beginPath();
			ctx.rect(gx*space.gridSize,gy*space.gridSize,space.gridSize,space.gridSize);          
			ctx.stroke();
		}
		return;
	}
	
	if(vx>0){
		var slope = vy/vx;
		var endX = limitX;
		var endY = Math.floor(ry+slope*(limitX-rx));
		gx=Math.floor(endX/space.gridSize);
		gy=Math.floor(endY/space.gridSize);
		ctx.strokeStyle='red';
			ctx.beginPath();
			ctx.rect(gx*space.gridSize,gy*space.gridSize,space.gridSize,space.gridSize);          
			ctx.stroke();
	}
	
	//for(gx; gx!=limitX;gx+=dirX){
		//var y = Math.floor(sourceY+(gx-sourceX)*slope);
		//for(lastY;lastY!=y+dirY;lastY+=dirY){			
			//if(space.grid[gx][gy]){
				// ctx.strokeStyle='red';
				// ctx.beginPath();
				// ctx.rect(gx*space.gridSize,y*space.gridSize,space.gridSize,space.gridSize);          
				// ctx.stroke();
			//}
		//}
		//lastY=y;
	//}
}


function drawLight(ctx){    
	var rays = GetPrimaryRays();    
	stats.primaryRays = rays.length;
    for(var r = 0; r<rays.length; r++){     
	  var reflectioCount=0;
      var intensity = light.intensity;
      var sourceX = px = px2 =rays[r].x;
      var sourceY = py = py2 = rays[r].y;
      var vx = Math.cos(rays[r].angle);
      var vy = Math.sin(rays[r].angle);

      findRayCollision(ctx,sourceX, sourceY, vx,vy);
            
      for(var i=0; i<light.maxLength; i++){
        px+=vx;
        py+=vy;
        if(px<0 || py<0 || px>space.w || py>space.h) break;

        if(Math.floor(px)!=px2 || Math.floor(py)!=py2){          
		  stats.raySteps++;
          px2=Math.floor(px);
          py2=Math.floor(py);
          
          if(space.points[px2] && space.points[px2][py2] && space.points[px2][py2]!=lightMaterialId){      			  			  
              if(game.hasyness){
				ctx.strokeStyle= 'rgba(255,255,200, '+intensity*game.hasyness+')';
				ctx.beginPath();
				ctx.moveTo(px2,py2);          
				ctx.lineTo(sourceX,sourceY);
				ctx.stroke();
			  }
			  reflectioCount++;
			  stats.secondaryRays++;
			  if(reflectioCount>light.maxReflections) break;
			  
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
        }
      }
	  if(game.hasyness){
		ctx.strokeStyle= 'rgba(255,255,200, '+(intensity*game.hasyness)+')';
		ctx.beginPath();
        ctx.moveTo(px2,py2);          
        ctx.lineTo(sourceX,sourceY);
        ctx.stroke();
	  }            
    }    	
}

function drawMass(ctx, opacity){  
	var px=0;
	var py=0;
	for(var gx= 0; gx< space.gridW;gx++){    
		for(var gy = 0; gy<space.gridH;gy++){
			if(space.grid[gx][gy]){
				for(var x= 0; x< space.gridSize;x++){    
					for(var y = 0; y<space.gridSize;y++){  
						px = gx*space.gridSize+x;
						py = gy*space.gridSize+y;
						if(space.points[px][py]){
							var color = game.materials[space.points[px][py]].color;
							ctx.strokeStyle = color;// 'rgba(0,255,0,'+opacity+')';		
							ctx.beginPath();
							ctx.rect(px,py,1,1);          
							ctx.stroke();
						}
					}
				}  
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



