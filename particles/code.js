"use strict";
console.log("teleport to mous:t    gravity to mouse:left click   particle gravity:g")
let canvas=document.getElementById("myCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let ctx=canvas.getContext("2d");
let mouseX=0;
let mouseY=0;

let tailDis=80;
let numtails=2;
function createParticle(x,y){
    let startAngle=Math.random()*360
    let startSpeed=0.5
    return {x,y,"role":0,"vx":Math.cos(startAngle)*startSpeed,"vy":Math.sin(startAngle)*startSpeed}
}
function createParticles(n){
    let particles=[];
    for(let i=0;i<n;i++){
        particles.push(createParticle(Math.random()*canvas.width,Math.random()*canvas.height));
    }
    return particles;
}

let oMass=10;
let Gconstant=0.06
let gravityActive=false;
function law(){
    for(let i=0;i<particles.length;i++){
        let fx=0;
        let fy=0;
        if(activeMouse==true){
            let dx=particles[i].x-mouseX;
            let dy=particles[i].y-mouseY;
            let d=Math.sqrt(dx*dx+dy*dy);
                let F=Gconstant*-1*(oMass)/d
                fx=(F*dx)
                fy=(F*dy)
        }
        if(gravityActive==true){
            for(let j=0;j<particles.length;j++){
                if(j!=i){
                    let dx=particles[j].x-particles[i].x;
                    let dy=particles[j].y-particles[i].y;
                    let d=Math.sqrt(dx*dx+dy*dy);
                    if(d>1){
                    let F=Gconstant/d**2
                        fx+=(F*dx)
                        fy+=(F*dy)
                    }
                }
            }
        }
                particles[i].vx+=fx
        particles[i].vy+=fy
        if(Math.sqrt(particles[i].vx**2+particles[i].vy**2)>0.5){
            particles[i].vx*=0.995
            particles[i].vy*=0.995
        }else{
            let startAngle=Math.random()*360
            let startSpeed=0.5
            if(Math.random()*200<1){
                particles[i].vx,particles[i].vy=Math.cos(startAngle)*startSpeed,Math.sin(startAngle)*startSpeed
            }
        }
        particles[i].x+=particles[i].vx
        particles[i].y+=particles[i].vy
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[i].x-(particles[i].vx*5), particles[i].y-(particles[i].vy*5));
        ctx.strokeStyle = `rgb(0,50,100)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function calculateAngle(x,y){
    let angle=Math.atan2(x,y)*180/Math.PI
    if(x<0 && y>=0){
        angle=90-Math.abs(angle)
    }
    if(x<0 && y<0){
        angle=90-angle
    }
    if(x>=0 && y<0){
        angle=270+(180-angle)
    }
    return angle
}

let activeMouse=false;
let particles=createParticles(1000)
let lightnings=[[mouseX,mouseY,mouseX,mouseY]]
let framerate=60;
setInterval(()=>{
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    let color="rgb(0,100,200)"
    ctx.fillStyle= color;
    ctx.strokeStyle = color;
    law();
},1000/framerate);

canvas.addEventListener("click",()=>{
    activeMouse=!activeMouse;
})
window.addEventListener('keydown',(event)=>{
    console.log(event.key)
    if(event.key=="t" || event.key=="T"){
        let p=Math.round(Math.random()*(particles.length-1));
        particles[p].x=mouseX;
        particles[p].y=mouseY;
    }
    if(event.key=="g" || event.key=="G"){
        gravityActive=!gravityActive
    }
})
window.addEventListener('mousemove',(event)=>{
    mouseX=event.offsetX;
    mouseY=event.offsetY;
})