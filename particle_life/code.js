"use strict";
let canvas=document.getElementById("myCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let ctx=canvas.getContext("2d");
let colors=["red","yellow","blue","green","brown"]

let mapx=0;
let mapy=0;
let scale=3;
let mapscale=3;
let copy=[];
let copy1=undefined;
let copy2=undefined;
let mousex=0;
let mousey=0;

function createParticles(n){
    let arr=[]
    for(let i=0;i<n;i++){
        arr.push({
            "x":Math.random()*canvas.width*mapscale,
            "y":Math.random()*canvas.height*mapscale,
            "vx":0,
            "vy":0,
            "color":Math.round(Math.random()*(colors.length-1))
        })
    }
    return arr;
}
function createMatrix(arr){
    let arr2=[];
    for(let i=0;i<arr.length;i++){
        let arr3=[];
        for(let j=0;j<arr.length;j++){
            arr3.push(Math.random()*2-1);
        }
        arr2.push(arr3);
    }
    return arr2;
}
let grid={};
let particles=createParticles(5000);
let lawMatrix=createMatrix(colors);

let Gconstant=1;
let fs=1;
let rMax=80;
let tempGrid;
let friction=0.5;
function update2(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    tempGrid={};
    if(typeof copy1!="undefined" && typeof copy2!="undefined"){
        ctx.fillStyle="lightblue";
        ctx.fillRect(copy1[0],copy1[1],copy2[0]-copy1[0],copy2[1]-copy1[1]);
    }
    for(let a=0;a<particles.length;a++){
        if(!paused){
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
                            let G=lawMatrix[p1.color][p2.color]*Gconstant;
                            let F=0;
                            if(d<rMax && d>0){
                                F=G/d;
                            }
                            fx+=F*dx*fs;
                            fy+=F*dy*fs;
                        }
                    }
                }
            }
            particles[a].vx=(particles[a].vx+fx)*friction;
            particles[a].vy=(particles[a].vy+fy)*friction;
            particles[a].x+=particles[a].vx;
            particles[a].y+=particles[a].vy;
            if(particles[a].x<0 || particles[a].x>canvas.width*mapscale){
                particles[a].vx*=-1;
            }
            if(particles[a].y<0 || particles[a].y>canvas.height*mapscale){
                particles[a].vy*=-1;
            }
        }
        ctx.fillStyle=colors[particles[a].color];
        ctx.beginPath();
        ctx.arc((particles[a].x/scale)-mapx,(particles[a].y/scale)-mapy,2/scale,0,Math.PI*2);
        ctx.fill();
        if(!tempGrid[`${Math.floor(particles[a].x/rMax)}#${Math.floor(particles[a].y/rMax)}`]){
            tempGrid[`${Math.floor(particles[a].x/rMax)}#${Math.floor(particles[a].y/rMax)}`]=[]
        }
        tempGrid[`${Math.floor(particles[a].x/rMax)}#${Math.floor(particles[a].y/rMax)}`].push(a);
    }
    grid=JSON.parse(JSON.stringify(tempGrid));
}

let fps=60;
let time=new Date();
let paused=false;
let up=false;
function animate(){
    if(new Date()-time>1000/fps){
        if(canvas.height!=window.innerHeight || canvas.width!=window.innerWidth){
            canvas=document.getElementById("myCanvas");
            canvas.width=window.innerWidth;
            canvas.height=window.innerHeight;
            ctx=canvas.getContext("2d");
        }
        update2()
        time=new Date()
    }
    requestAnimationFrame(animate)
}
animate()
let speed=5;
window.addEventListener("wheel",(event)=>{
    if(event.deltaY>0){
        scale*=1.2;
    }else{
        scale/=1.2;
    }
})
window.addEventListener("keydown",(event)=>{
    if(event.key=="w"){
        mapy-=speed;
    }
    if(event.key=="s"){
        mapy+=speed;
    }
    if(event.key=="a"){
        mapx-=speed;
    }
    if(event.key=="d"){
        mapx+=speed;
    }
    if(event.key=="p"){
        paused=!paused;
        console.log(paused)
    }
    if(event.key=="c"){
        if(typeof copy1!="undefined" && typeof copy2!="undefined"){
            copy=[];
            for(let i=0;i<particles.length;i++){
                if(particles[i].x>copy1[0]*scale+mapx*scale && particles[i].x<copy2[0]*scale+mapx*scale){
                    if(particles[i].y>copy1[1]*scale+mapy*scale && particles[i].y<copy2[1]*scale+mapy*scale){
                        let temp=JSON.parse(JSON.stringify(particles[i]));
                        temp.x-=copy1[0]*scale+mapx*scale;
                        temp.y-=copy1[1]*scale+mapy*scale;
                        copy.push(JSON.parse(JSON.stringify(temp)))
                    }
                }
            }
            copy1=undefined;
            copy2=undefined;
        }
    }
    if(event.key=="v"){
        for(let i=0;i<copy.length;i++){
            let temp=JSON.parse(JSON.stringify(copy[i]));
            temp.x+=mousex*scale+mapx*scale;
            temp.y+=mousey*scale+mapy*scale;
            particles.push(JSON.parse(JSON.stringify(temp)))
        }
    }
})
window.addEventListener("mousemove",(event)=>{
    mousex=event.offsetX;
    mousey=event.offsetY;
})
window.addEventListener("click",(event)=>{
    if(typeof copy1=="undefined"){
        copy1=[mousex,mousey];
    }else{
        copy2=[mousex,mousey];
    }
})