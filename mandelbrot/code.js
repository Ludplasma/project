let canvas=document.getElementById("myCanvas");
canvas.width=window.innerWidth/2;
canvas.height=window.innerHeight;
let ctx=canvas.getContext("2d");

let iterationsInput=document.getElementById("iterations");
let numWorkers=document.getElementById("workers");
let realNum=document.getElementById("realNum");
let imNum=document.getElementById("imNum");
let reload=document.getElementById("reload");
let drawDone=document.getElementById("drawDone");
let zoomSetting=document.getElementById("zoom_setting");
let creal=document.getElementById("creal");
let cim=document.getElementById("cim");
let showCA=document.getElementById("showCA");
let showCB=document.getElementById("showCB");
let addC=document.getElementById("addC");
let MJselect=document.getElementById("MJselect");
let reloadFrame=document.getElementById("reload_frame");

let canvas2=document.getElementById("myCanvas2");
canvas2.width=window.innerWidth/2;
canvas2.height=window.innerHeight;
let ctx2=canvas2.getContext("2d");

let workers={};

let colors=[
    [[54,51,254],[50,104,254],[124,51,255],[194,51,255],[96,51,255]],
    [[255,223,50],[240,255,52],[190,255,51],[50,255,56],[51,255,168],[51,141,255]],
    [[255,253,50],[255,138,51],[255,73,72],[255,90,92],[255,255,255],[200,200,200],[150,150,150],[159,50,255]]
]
    
let colorvalue=-1;

let power=2;
let ipower=0;
let iterations=300;
let start_x=-2;
let start_y=-2;
let scale=200;
let numWebworkers=32;

iterationsInput.value=iterations;
numWorkers.value=numWebworkers;
realNum.value=power;
imNum.value=ipower;

let loading=false;
let percentage=0;
creal.value=0
cim.value=0

function draw(){
    ctx.fillStyle=`rgb(255,255,255)`; //selects color based on namber of iterations
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<numWebworkers;i++){
        if(!workers[`${i}`]){
            workers[`${i}`]=new Worker("webWorker.js")
            workers[`${i}`].onmessage = function(event){
                let arr=event.data;
                for(let p=0;p<arr.length;p++){
                    if(colorvalue<0){
                        if(colorvalue==-1){
                            ctx.fillStyle=`hsl(${(330/iterations)*arr[p][2]},80%,50%)`; //selects color based on namber of iterations
                        }
                    }else{
                        let y=Math.floor(arr[p][2]*(colors[colorvalue].length-1)/(iterations+(1/(10000))));
                        let x1=y;
                        let x2=y+1;
                        let m=arr[p][2]*(colors[colorvalue].length-1)/(iterations+(1/(10000)))-y;
                        let r=colors[colorvalue][x1][0]+(colors[colorvalue][x2][0]-colors[colorvalue][x1][0])*m;
                        let g=colors[colorvalue][x1][1]+(colors[colorvalue][x2][1]-colors[colorvalue][x1][1])*m;
                        let b=colors[colorvalue][x1][2]+(colors[colorvalue][x2][2]-colors[colorvalue][x1][2])*m;
                        ctx.fillStyle=`rgb(${r},${g},${b})`;
                    }
                    ctx.fillRect(arr[p][0],arr[p][1],1,1);
                }
                percentage+=1;
                drawDone.innerText=`${Math.round(percentage*100/numWebworkers)}%`
                if(percentage==numWebworkers){
                    loading=false
                    percentage=0;
                    drawDone.innerText=="Done"
                }
            }; 
        }
        workers[`${i}`].postMessage({
            "n":i,
            "nw":numWebworkers,
            "w":canvas.width,
            "h":canvas.height,
            "iterations":iterations,
            "ipower":ipower,
            "power":power,
            "start_x":start_x,
            "start_y":start_y,
            "scale":scale,
            "MJselect":MJselect.value,
            "cim":cim.value,
            "creal":creal.value
        })
    }
    loading=true;
    drawDone.innerText="0%"
}
draw()
let mousex=0;
let mousey=0;
let select=false;
canvas2.style.visibility="hidden";
canvas.addEventListener("mousedown",(event)=>{
    console.log(event)
    canvas2.style.visibility="visible";
    mousex=event.offsetX;
    mousey=event.offsetY;
    select=true;
    showCA.innerText=`${start_x+mousex/scale}`;
    showCB.innerText=`${start_y+mousey/scale}`;
})

canvas2.addEventListener("mouseup",(event)=>{
    canvas2.style.visibility="hidden";
    select=false;
    if(!loading){
        if(event.offsetX-mousex>20){
            if(zoomSetting.value=="zoom in"){
                start_x=start_x+(canvas.width/scale)*mousex/canvas.width;
                start_y=start_y+(canvas.height/scale)*mousey/canvas.height;
                scale*=(canvas.width/(event.offsetX-mousex))
            }else{
                let a=mousex+(mousex*(event.offsetX-mousex)/canvas.width)
                for(let i=0;i<=10;i++){
                    a=mousex+(a*(event.offsetX-mousex)/canvas.width)
                }
                let x3=a-mousex;
                let s=a/x3
                start_x=start_x+(canvas.width/scale)*a/canvas.width-(canvas.width/scale)*a*s/canvas.width;
                let h=(event.offsetX-mousex)*canvas.height/canvas.width
                a=mousey+(mousey*h/canvas.height)
                for(let i=0;i<=10;i++){
                    a=mousey+(a*h/canvas.height)
                }
                x3=a-mousey;
                s=a/x3
                start_y=start_y+(canvas.height/scale)*a/canvas.height-(canvas.height/scale)*a*s/canvas.height;
                scale*=((event.offsetX-mousex)/canvas.width)
            }
            draw()
        }else{
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        }
    }
})
canvas2.addEventListener("mousemove",(event)=>{
    if(select){
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.lineWidth = `3`;
        ctx2.strokeStyle = "rgb(200, 200, 200)";
        ctx2.beginPath();
        let h=(event.offsetX-mousex)*canvas.height/canvas.width;
        ctx2.rect(mousex,mousey,event.offsetX-mousex,h);
        ctx2.stroke();
    }else{
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }
})
iterationsInput.addEventListener("change",()=>{
    if(iterationsInput.value<4){
        iterationsInput.value=4
    }
    iterations=parseInt(iterationsInput.value)
})
numWorkers.addEventListener("change",()=>{
    if(numWorkers.value<4){
        numWorkers.value=4
    }
    numWebworkers=parseInt(numWorkers.value);
})
realNum.addEventListener("change",(event)=>{
    power=realNum.value
})
imNum.addEventListener("change",(event)=>{
    ipower=imNum.value
})
reload.addEventListener("click",()=>{
    if(!loading){
        start_x=-2;
        start_y=-2;
        scale=200;
        draw()
    }
})
addC.addEventListener("click",()=>{
    creal.value=parseFloat(showCA.innerText)
    cim.value=parseFloat(showCB.innerText)
})
reloadFrame.addEventListener("click",()=>{
    if(!loading){
        draw()
    }
})
colorScheme.addEventListener("change",()=>{
    switch(colorScheme.value) {
        case "hsl":
            colorvalue=-1
            break;
        case "cold":
            colorvalue=0
            break;
        case "warm to cold":
            colorvalue=1
            break;
        case "white middle rainbow":
            colorvalue=2
            break;
      }
})