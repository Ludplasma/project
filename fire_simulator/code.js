"use strict";
let canvas=document.getElementById("myCanvas");
let rangeF=document.getElementById("transferF");
let rangeC=document.getElementById("transferC");
let strokeSize=document.getElementById("strokeSize");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight-30;
let ctx=canvas.getContext("2d");
let pixelSize=8;
let mouseX=0;
let mouseY=0;
let click=false;

function createMap(){
    let map=[];
    for(let i=0;i<=Math.round(canvas.width/pixelSize);i++){
        let temp=[];
        for(let j=0;j<=Math.round(canvas.height/pixelSize);j++){
            temp.push(0)
        }
        map.push(temp)
    }
    return map;
}
let map=createMap();

let transferF=0.5;
let maxtemp=1000;
let transferC=0.5;
strokeSize.value=5;
let dis=5*5*pixelSize*pixelSize;
let v;
let ii;
let jj;
let temp;
let len1=map.length-1;
let len2=map[0].length-1;
let dx;
function update2(){
    for(let i=0;i<=len1;i++){
        dx=(i*pixelSize-mouseX)**2;
        for(let j=0;j<=len2;j++){
            if((dx+(j*pixelSize-mouseY)**2)<dis){
                if(click){
                    map[i][j]=maxtemp;
                }
            }
            if(j==0){
                //map[i][j-1]=0.0001;
            }
            if(map[i][j]<0.0001 || isNaN(map[i][j])){
                map[i][j]=0.0001;
            }
            if(map[i][j]>maxtemp){
                map[i][j]=maxtemp
            }
            try{
                    v=0;
                    if(Math.random()>0.5){
                        ii=(Math.round(Math.random()*2-1));
                        v=(map[i][j]-map[i+ii][j])*transferF;
                        map[i+ii][j]+=v;
                    }else{
                        jj=(Math.round(Math.random()*2-1));
                        v=(map[i][j]-map[i][j+jj])*transferF;
                        map[i][j+jj]+=v;
                    }
                    map[i][j]-=v;
                if(map[i][j-1]<map[i][j] && Math.random()<transferC){
                    temp=map[i][j];
                    map[i][j]=map[i][j-1];
                    map[i][j-1]=temp;
                }
            }catch(err){
                //console.log(err)
            }
        }
    }
}
function draw(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<=map.length-1;i++){
        for(let j=0;j<=map[i].length-1;j++){
            ctx.fillStyle=`hsl(${(330/maxtemp)*map[i][j]},80%,50%)`;
            ctx.fillRect(i*pixelSize,j*pixelSize,pixelSize,pixelSize);
        }
    }
}
let framerate=120;
setInterval(()=>{
    update2();
    draw();
},1000/framerate)

window.addEventListener('mousemove',(event)=>{
    mouseX=event.offsetX;
    mouseY=event.offsetY;
})
canvas.addEventListener("click",()=>{
click=!click;
})

rangeC.addEventListener('change',()=>{
    transferC=rangeC.value/rangeC.max;
})
rangeF.addEventListener('change',()=>{
    transferF=rangeF.value/rangeF.max;
})
strokeSize.addEventListener("change",()=>{
    dis=strokeSize.value*strokeSize.value*pixelSize*pixelSize;
})
document.getElementById("clear").addEventListener("click",()=>{
    map=createMap();
})