"use strict";
let canvas=document.getElementById("myCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let ctx=canvas.getContext("2d");

let mousex=0;
let mousey=0;
let mouseActive=false;
let mouseRaduis=100;

let particles=[];
function createParticles(n){
    let arr=[]
    for(let i=0;i<n;i++){
        arr.push({"x":Math.random()*canvas.width,"y":Math.random()*canvas.height,"vx":0,"vy":0})
    }
    return arr;
}
particles=createParticles(3000);

let grid={};
let tempGrid;
let rMax=20;
let deGravity=30;
let friction=0.8;
let maxColor=300;
function update(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="white";
    if(mouseActive){
        ctx.beginPath();
        ctx.arc(mousex,mousey,mouseRaduis,0,Math.PI*2);
        ctx.stroke();
    }
    ctx.fillStyle="blue";
    tempGrid={};
    for(let a=0;a<particles.length;a++){
        let fx=0;
        let fy=0;
        for(let xx=-1;xx<2;xx++){
            for(let yy=-1;yy<2;yy++){
                if(grid[`${Math.floor(particles[a].x/rMax)+xx}#${Math.floor(particles[a].y/rMax)+yy}`]){
                    for(let p=0;p<grid[`${Math.floor(particles[a].x/rMax)+xx}#${Math.floor(particles[a].y/rMax)+yy}`].length;p++){
                        let p1=particles[a];
                        let p2=particles[grid[`${Math.floor(particles[a].x/rMax)+xx}#${Math.floor(particles[a].y/rMax)+yy}`][p]];
                        let dx=p1.x-p2.x;
                        let dy=p1.y-p2.y;
                        let d=Math.sqrt(dx*dx+dy*dy);
                        let F=0;
                        if(d<=rMax && d>0){
                            F=deGravity/d**2;
                        }
                        fx+=F*dx;
                        fy+=F*dy;
                    }
                }
            }
        }
        if(Math.sqrt((mousex-particles[a].x)**2+(mousey-particles[a].y)**2)<=mouseRaduis && mouseActive){
            let dx=(mousex-particles[a].x)
            let dy=(mousey-particles[a].y)
            let d=Math.sqrt(dx*dx+dy*dy);
            let G=-200;
            let F=0;
            if(d>0){
                F=G/d**2;
            }
            fx+=F*dx;
            fy+=F*dy;
        }
        particles[a].vx=((particles[a].vx+fx)*friction);
        particles[a].vy=((particles[a].vy+fy)*friction);
        particles[a].x+=particles[a].vx;
        particles[a].y+=particles[a].vy;
        let angle=Math.random()*Math.PI*2;
        if(particles[a].x<0){
            particles[a].x=0;
            particles[a].x+=Math.random()
        }
        if(particles[a].x>canvas.width){
            particles[a].x=canvas.width;
            particles[a].x-=Math.random()
        }
        if(particles[a].y<0){
            particles[a].y=0;
            particles[a].y+=Math.random()
        }
        if(particles[a].y>canvas.height){
            particles[a].y=canvas.height;
            particles[a].y-=Math.random()
        }
        ctx.beginPath();
        ctx.arc((particles[a].x),(particles[a].y),2,0,Math.PI*2);
        ctx.fill();
        if(!tempGrid[`${Math.floor(particles[a].x/rMax)}#${Math.floor(particles[a].y/rMax)}`]){
            tempGrid[`${Math.floor(particles[a].x/rMax)}#${Math.floor(particles[a].y/rMax)}`]=[]
        }
        tempGrid[`${Math.floor(particles[a].x/rMax)}#${Math.floor(particles[a].y/rMax)}`].push(a);
    }
    grid=JSON.parse(JSON.stringify(tempGrid));
}

let time=new Date();
let fps=60;
function animate(){
    if(new Date()-time>1000/fps){
        update()
        time=new Date()
    }
    requestAnimationFrame(animate)
}
animate()

window.addEventListener("click",(event)=>{
    mouseActive=!mouseActive;
})
window.addEventListener("mousemove",(event)=>{
    mousex=event.offsetX;
    mousey=event.offsetY;
})