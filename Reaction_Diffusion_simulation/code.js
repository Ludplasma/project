let canvas=document.getElementById("myCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let ctx=canvas.getContext("2d");

let mousex=0;
let mousey=0;
let mouseACtive=false;

let pixelSize=5;
function createMap(){
    let rows=[];
    for(let i=0;i<Math.floor(canvas.width/pixelSize);i++){
        let row=[];
        for(let j=0;j<Math.floor(canvas.height/pixelSize);j++){
            row.push({
                "a":1,
                "b":0
            })
        }
        rows.push(row);
    }
    for(let i=10;i<20;i++){
        for(let j=10;j<20;j++){
            rows[i][j].b=1;
        }
    }
    return rows;
}

let grid=createMap();
let next=JSON.parse(JSON.stringify(grid));

let DA=1.0;
let DB=0.5;
let f=0.055;
let k=0.062;

function laplaceA(x,y){
    let sumA=0;
    sumA+=grid[x][y].a*-1;
    sumA+=grid[x-1][y].a*0.2;
    sumA+=grid[x+1][y].a*0.2;
    sumA+=grid[x][y-1].a*0.2;
    sumA+=grid[x][y+1].a*0.2;
    sumA+=grid[x-1][y-1].a*0.05;
    sumA+=grid[x+1][y-1].a*0.05;
    sumA+=grid[x+1][y+1].a*0.05;
    sumA+=grid[x-1][y+1].a*0.05;
    return sumA;
}
function laplaceB(x,y){
    let sumB=0;
    sumB+=grid[x][y].b*-1;
    sumB+=grid[x-1][y].b*0.2;
    sumB+=grid[x+1][y].b*0.2;
    sumB+=grid[x][y-1].b*0.2;
    sumB+=grid[x][y+1].b*0.2;
    sumB+=grid[x-1][y-1].b*0.05;
    sumB+=grid[x+1][y-1].b*0.05;
    sumB+=grid[x+1][y+1].b*0.05;
    sumB+=grid[x-1][y+1].b*0.05;
    return sumB;
}

let feedRate=Math.random();
let removeRate=Math.random();
let drawraduis=10;
let mapSizeX=Math.floor(canvas.width/pixelSize);
let mapSizeY=Math.floor(canvas.height/pixelSize);
function update(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=1;i<mapSizeX-1;i++){
        for(let j=1;j<mapSizeY-1;j++){
            //if(Math.sqrt((i*pixelSize-mousex)**2+(j*pixelSize-mousey)**2)<pixelSize*drawraduis && mouseACtive){
            //    grid[i][j].b=1;
            //}
            let a=grid[i][j].a;
            let b=grid[i][j].b;
            if(a>1){
                a=1;
            }
            if(a<0){
                a=0;
            }
            if(b>1){
                b=1;
            }
            if(b<0){
                b=0;
            }
            next[i][j].a=a+(DA*laplaceA(i,j)-a*b*b+f*(1-a));
            next[i][j].b=b+(DB*laplaceB(i,j)+a*b*b-(k+f)*b);
            ctx.fillStyle=`rgb(0,${next[i][j].a*255},${next[i][j].b*255})`;
            ctx.fillRect(i*pixelSize,j*pixelSize,pixelSize,pixelSize);
        }
    }
    let temp=grid;
    grid=next;
    next=temp;
}
let fps=60;
let time=new Date()
function animate(){
    if(new Date()-time>1000/fps){
        update()
        time=new Date()
    }
    requestAnimationFrame(animate);
}
animate()

window.addEventListener("click",()=>{
    mouseACtive=!mouseACtive;
})
window.addEventListener("mousemove",(event)=>{
    mousex=event.offsetX;
    mousey=event.offsetY;
})