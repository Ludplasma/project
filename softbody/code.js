"use strict";
let canvas=document.getElementById("canvas");
canvas.width=500;
canvas.height=500;
let ctx=canvas.getContext("2d");

let bodies=[];

function createbody(n,r,x,y){
    let l=Math.tan(Math.PI*2/n)*r*2;
    let points=[];
    for(let i=0;i<n;i++){
        points.push({
            "x":x+Math.cos(Math.PI*2*i/n)*r,
            "y":y+Math.sin(Math.PI*2*i/n)*r,
            "vy":0,
            "vx":0
        });
    }
    return {
        "len":l,
        "points":points,
        "middlepoint":[0,0]
    }
}
bodies.push(createbody(10,50,255,255));

let forceLoseFactor=0.98;
ctx.strokeStyle = `rgb(255,0,0)`;
ctx.lineWidth = 2;
let scale=4;

function update(){
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.height,canvas.width)
    for(let b=0,len=bodies.length;b<len;b++){
        for(let p=0,len1=bodies[b].points.length;p<len1;p++){
            
        }
    }       
}


function animate(){
    update() 
    requestAnimationFrame(animate);
}
animate();