"use strict";
let graph=document.getElementById("graph");
let size=600;
graph.width=size;
graph.height=size;
let ctx=graph.getContext("2d");
let expression=document.getElementById("expression");
let calButton=document.getElementById("cal-button");
let graphDiv=document.querySelector(".graph-div");
let expressionDiv=document.querySelector(".parent-expression-div");
expression.value="x";

function calCoodinates(x){
    x=x*(xrange[1]-xrange[0])/size+xrange[0];
    let y=eval(expression.value.replace("cos","Math.cos").replace("sin","Math.sin").replace("^","**").replace("e","Math.E").replace("pi","Math.PI").replace("tan","Math.tan"));
    let py=(y-yrange[0])*size/(yrange[1]-yrange[0]);
    return py;
}

let numIntervals=10;
let xrange=[-5,5];
let yrange=[5,-5];


function plot(){
    try {
    ctx.fillStyle="white";
    ctx.fillRect(0,0,600,600);
    ctx.fillStyle="black";
    ctx.font = "10px Arial";

    let axisX=(0-xrange[0])*size/(xrange[1]-xrange[0]);
    ctx.beginPath();
    ctx.moveTo(axisX,0);
    ctx.lineTo(axisX,size);
    ctx.strokeStyle="blue";
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.strokeStyle="red";
    let pos=size/numIntervals;
    for(let z=0;z<numIntervals;z++){    
        ctx.beginPath();
        ctx.arc(size/2, pos*z, 2, 0, 2 * Math.PI);
        ctx.stroke();
        if (z!=numIntervals/2){
            ctx.fillText(`${(yrange[0]+(yrange[1]-yrange[0])*z/numIntervals).toFixed(3)}`, size/2+10, pos*z);
        }
    }

    let axisY=(0-yrange[0])*size/(yrange[1]-yrange[0]);
    ctx.beginPath();
    ctx.moveTo(0,axisY);
    ctx.lineTo(size,axisY);
    ctx.strokeStyle="blue";
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.strokeStyle="red";
    for(let z=0;z<numIntervals;z++){
        ctx.beginPath();
        ctx.arc(pos*z, size/2, 2, 0, 2 * Math.PI);
        ctx.stroke();
        if (z!=numIntervals/2){
            ctx.fillText(`${(xrange[0]+(xrange[1]-xrange[0])*z/numIntervals).toFixed(3)}`, pos*z, size/2-10);
        }
    }

    let lastCoordinate=0;
    let x=0;
    let py=calCoodinates(x);
    lastCoordinate=py;

    for(x=1;x<size;x++){
        py=calCoodinates(x);

        ctx.beginPath();
        ctx.moveTo(x,py);
        ctx.lineTo(x-1,lastCoordinate);
        ctx.strokeStyle="yellow";
        ctx.lineWidth=3;
        ctx.stroke();
        lastCoordinate=py;
    }
    }
    catch(err){
        alert("syntax error");
    }
}
plot()


let changeGraph=false;
graphDiv.addEventListener("mouseover",(event)=>{
    changeGraph=true;
})
expressionDiv.addEventListener("mouseover",()=>{
    changeGraph=false;
})

window.addEventListener("keydown",(event)=>{
    if(changeGraph==true){
    let zoomNum=1;
    if (event.keyCode==38){
        xrange[0]+=zoomNum;
        xrange[1]-=zoomNum;
        yrange[0]-=zoomNum;
        yrange[1]+=zoomNum;
    }
    if (event.keyCode==40){
        xrange[0]-=zoomNum;
        xrange[1]+=zoomNum;
        yrange[0]+=zoomNum;
        yrange[1]-=zoomNum;
    }

    if (event.keyCode==83){
        yrange[0]-=zoomNum;
        yrange[1]-=zoomNum;
    }
    if (event.keyCode==87){
        yrange[0]+=zoomNum;
        yrange[1]+=zoomNum;
    }

    if (event.keyCode==65){
        xrange[0]-=zoomNum;
        xrange[1]-=zoomNum;
    }
    if (event.keyCode==68){
        xrange[0]+=zoomNum;
        xrange[1]+=zoomNum;
    }

    if (Math.sqrt((xrange[1]-xrange[0])**2)<=0 || Math.sqrt((yrange[1]-yrange[0])**2)<=0){
        xrange[0]=-zoomNum;
        xrange[1]=zoomNum;
        yrange[0]=zoomNum;
        yrange[1]=-zoomNum;
    }
    plot();
}
})
window.addEventListener("wheel",(event)=>{
    if(changeGraph==true){
        let zoomNum=1;
        if (event.deltaY>0){
            xrange[0]+=zoomNum;
            xrange[1]-=zoomNum;
            yrange[0]-=zoomNum;
            yrange[1]+=zoomNum;
        }else{
            xrange[0]-=zoomNum;
            xrange[1]+=zoomNum;
            yrange[0]+=zoomNum;
            yrange[1]-=zoomNum;
        }
    }
})

calButton.addEventListener("click",()=>{
    plot();
})