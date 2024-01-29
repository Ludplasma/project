"use strict";
let space=document.getElementById("space");
space.width=window.innerWidth;
space.height=window.innerHeight;
let ctx=space.getContext("2d")

let framerate=100;
let Gconstant=-0.00000000001;

let mapx=0
let mapy=0
let speed=5

let createMasspoint=(x,y,mass)=>({x,y,mass,"vx":0,"vy":0});


function law(){
    for(let i=1;i<massPoints.length;i++){
        let fx=0;
        let fy=0;
        for(let j=1;j<massPoints.length;j++){
            if(j!=i){
                let dx=massPoints[i].x-massPoints[j].x;
                let dy=massPoints[i].y-massPoints[j].y;
                let d=Math.sqrt(dx*dx+dy*dy);
                if(massPoints[j].mass>0 && massPoints[i].mass>0){
                    if(d>Math.sqrt(massPoints[i].mass/Math.PI)){
                        let F=0;
                        if(massPoints[0]==0){
                            F=Gconstant*(massPoints[i].mass*massPoints[j].mass)/d**2
                        }else{
                            F=Gconstant*(massPoints[i].mass*massPoints[j].mass)/d
                        }
                        fx+=(F*dx)
                        fy+=(F*dy)
                    }
                    else{
                        if(massPoints[i].mass>=massPoints[j].mass){
                            massPoints[i].vx=((massPoints[i].vx+(massPoints[j].vx*(massPoints[j].mass/massPoints[i].mass)))/2)
                            massPoints[i].vy=((massPoints[i].vy+(massPoints[j].vy*(massPoints[j].mass/massPoints[i].mass)))/2)
                            massPoints[i].mass+=massPoints[j].mass
                            massPoints[j].mass=0
                        }
                    }
                }
            }
            massPoints[i].vx=(massPoints[i].vx+fx)
            massPoints[i].vy=(massPoints[i].vy+fy)
            massPoints[i].x+=massPoints[i].vx;
            massPoints[i].y+=massPoints[i].vy;
        }
    }   
}

function createUniverse(n){
    let array=[0]
    for(let i=1;i<n;i++){
        array[i]=createMasspoint(Math.random()*space.width*4,Math.random()*space.height*4,Math.random()*1000+500)
    }
    return array
}

let massPoints=createUniverse(25)
let scale=10

let interval=setInterval(() => {
    ctx.fillStyle="black";
    ctx.fillRect(0,0,space.width,space.height);
    ctx.strokeStyle="white";
    let above0Masses=[];
    for(let i=1;i<massPoints.length;i++){
        ctx.beginPath();
        let radius=Math.sqrt(massPoints[i].mass/Math.PI)/scale
        ctx.arc(massPoints[i].x/scale-mapx, massPoints[i].y/scale-mapy, radius, 0, radius * Math.PI*2);
        ctx.stroke()
        if(massPoints[i].mass>0){
            above0Masses.push(JSON.parse(JSON.stringify(massPoints[i])));
        }
    }
    massPoints=[massPoints[0],...above0Masses];
    law();
}, 1000/framerate);

space.addEventListener('click',(event)=>{
    massPoints[massPoints.length]=createMasspoint((event.offsetX+mapx)*scale,(event.offsetY+mapy)*scale,500)
})

window.addEventListener('keydown',(event)=>{
    if(event.keyCode==87){
        mapy-=speed
    }
    if(event.keyCode==83){
        mapy+=speed
    }
    if(event.keyCode==65){
        mapx-=speed
    }
    if(event.keyCode==68){
        mapx+=speed
    }
    if(event.key=='1'){
        massPoints[0]=0
    }
    if(event.key=='2'){
        massPoints[0]=1
    }
})
window.addEventListener('wheel',(event)=>{
    if(event.deltaY>0){
        scale*=1.2;
    }else{
        scale/=1.2;
    }
})