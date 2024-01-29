let canvas=document.getElementById("myCanvas");
canvas.height=window.innerHeight;
canvas.width=window.innerWidth*0.7;
let ctx=canvas.getContext("2d");

let branchesInput=document.getElementById("tree_length");
let divideBranchesInput=document.getElementById("branches");
let startBranchLenInput=document.getElementById("line_length");

let previousPoints=[{
    "x":0,
    "y":0,
    "t":0
}];
let points=[];
let branchDecreaseRate=0.7;
let lineWidthDecreaseRate=0.93;
let branches=10;
branchesInput.value=branches;
let divideBranches=2;
divideBranchesInput.value=divideBranches;
let offsetAngle=0;
let startBranchLen=100;
startBranchLenInput.value=startBranchLen;
ctx.lineWidth = 2;

let paused=false


let branchlen=startBranchLen;

function update(){
    ctx.fillStyle="rgb(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<branches;i++){
        branchlen*=branchDecreaseRate;
        ctx.lineWidth *=lineWidthDecreaseRate;
        ctx.fillStyle = `rgb(0,0,255)`;
        for(let p=0,len=previousPoints.length;p<len;p++){
            for(let b=0;b<divideBranches; b++){
                let angle=previousPoints[p].t-offsetAngle*(divideBranches-1)/2+offsetAngle*b;
                let x=previousPoints[p].x+Math.cos(angle)*branchlen;
                let y=previousPoints[p].y+Math.sin(angle)*branchlen;
                points.push({
                    "x":x,
                    "y":y,
                    "t":angle
                })
                ctx.strokeStyle = `hsl(${i*360/branches}, 80%, 50%)`;
                ctx.beginPath();
                ctx.moveTo(previousPoints[p].x, previousPoints[p].y);
                ctx.lineTo(x,y);
                ctx.stroke();
            }
        }
        previousPoints=JSON.parse(JSON.stringify(points));
        points=[];
    }
    offsetAngle+=Math.PI/2**10
    ctx.lineWidth = 2;
    branchlen=startBranchLen;
    previousPoints=[{
        "x":canvas.width/2,
        "y":canvas.height/2,
        "t":-Math.PI/2
    }];
    points=[];
}

branchesInput.addEventListener("change",()=>{
    branches=branchesInput.value;
    console.log(branches)
})
divideBranchesInput.addEventListener("change",()=>{
    divideBranches=divideBranchesInput.value;
})
startBranchLenInput.addEventListener("change",()=>{
    startBranchLen=startBranchLenInput.value;
})

window.addEventListener("keydown",(event)=>{
    console.log(event)
    if(event.key==" "){
        paused=!paused;
        console.log(paused)
    }
})

function main(){
    if(!paused){
        update()
    }
}

function animate(){
    main();
    requestAnimationFrame(animate);
}
animate()