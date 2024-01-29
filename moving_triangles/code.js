let canvas=document.getElementById("myCanvas")
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let ctx=canvas.getContext("2d")

let canvas2=document.getElementById("myCanvas2")
canvas2.width=window.innerWidth;
canvas2.height=window.innerHeight;
let ctx2=canvas2.getContext("2d")


let d=70;
let sx=-10;
let sy=-10;
let minD=Math.floor(d**2+d**2)

function calculatePos(x,y){
    if(y%2==1){
        x=sx+x*d+d/2
    }else{
        x=sx+x*d
    }
    return [x,sy+y*d]
}

ctx.fillRect(0,0,canvas.width,canvas.height)
ctx.strokeStyle=`rgb(0,100,170)`;
ctx.shadowBlur = 5;
ctx.shadowColor = ctx.strokeStyle;
let positions=[[-1,0],[-1,1],[1,0],[0,1],[0,-1],[-1,-1]];
let positions2=[[-1,0],[0,1],[1,0],[1,1],[0,-1],[1,-1]];
for(let x=0;x<canvas.width/d;x++){
    for(let y=0;y<canvas.height/d+1;y++){
        let pos=calculatePos(x,y)
        if(y%2==0){
            for(let i in positions){
                ctx.beginPath();
                ctx.moveTo(pos[0],pos[1]);
                let pos2=calculatePos(x+positions[i][0],y+positions[i][1])
                ctx.lineTo(pos2[0],pos2[1]);
                ctx.stroke();
            }
        }else{
            for(let i in positions2){
                ctx.beginPath();
                ctx.moveTo(pos[0],pos[1]);
                let pos2=calculatePos(x+positions2[i][0],y+positions2[i][1])
                ctx.lineTo(pos2[0],pos2[1]);
                ctx.stroke();
            }
        }
    }
}

ctx.fillStyle='rgb(0,200,255)'
ctx.shadowBlur = 10;
ctx.shadowColor = ctx.fillStyle;
for(let x=0;x<canvas.width/d;x++){
    for(let y=0;y<canvas.height/d+1;y++){
        ctx.beginPath();
        ctx.arc(calculatePos(x,y)[0], calculatePos(x,y)[1], 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function makeLines(n,l){
    let lines=[]
    for(let i=0;i<n;i++){
        let line=[]
        let x=Math.floor(Math.random()*canvas.width/d)
        let y=Math.floor(Math.random()*canvas.height/d)
        for(let j=0;j<l;j++){
            line.push([x+j,y,0])
        }
        lines.push(line)
    }
    return lines;
}

let lines=makeLines(10,6)

let c=0;
function update(){
    c+=1
    if(c>360){
        c=1
    }
    ctx2.srokeWidth=5
    ctx2.drawImage(canvas,0,0)
    ctx2.strokeStyle=`hsl(${c},80%,50%)`
    ctx2.shadowBlur = 20;
    ctx2.shadowColor = `hsl(${c},80%,50%)`;
    for(let l=0;l<lines.length;l++){
        let c=Math.random();
        for(let p=0;p<lines[l].length-1;p++){
            let fp=calculatePos(lines[l][p][0],lines[l][p][1])
            let lp=calculatePos(lines[l][p+1][0],lines[l][p+1][1])
            if(Math.floor((fp[0]-lp[0])**2+(fp[1]-lp[1])**2)<=minD){
            for(let i=0;i<5;i++){
                ctx2.beginPath();
                if(p==lines[l].length-2){
                    ctx2.moveTo(fp[0],fp[1]);
                    ctx2.lineTo(fp[0]+(lp[0]-fp[0])*lines[l][lines[l].length-1][2],fp[1]+(lp[1]-fp[1])*lines[l][lines[l].length-1][2]);
                }else if(p==0){
                    ctx2.moveTo(lp[0]+(fp[0]-lp[0])*(1-lines[l][lines[l].length-1][2]),lp[1]+(fp[1]-lp[1])*(1-lines[l][lines[l].length-1][2]));
                    ctx2.lineTo(lp[0],lp[1]);
                }else{
                    ctx2.moveTo(fp[0],fp[1]);
                    ctx2.lineTo(lp[0],lp[1]);
                }
                ctx2.stroke();
            }
            }
            if(lines[l][lines[l].length-1][2]>=1){
                lines[l][p][0]=lines[l][p+1][0]
                lines[l][p][1]=lines[l][p+1][1]
            }
        }
        if(lines[l][lines[l].length-1][2]>=1){
            let newPos=[...positions2]
            if(lines[l][lines[l].length-1][1]%2==0){
                newPos=[...positions]
            }
            newPos=newPos[Math.round((newPos.length-1)*Math.random())]
            lines[l][lines[l].length-1][0]+=newPos[0]
            lines[l][lines[l].length-1][1]+=newPos[1]
            lines[l][lines[l].length-1][2]=0
        }
        lines[l][lines[l].length-1][2]+=0.04
        if(lines[l][lines[l].length-1][0]<=-2){
            lines[l][lines[l].length-1][0]=Math.floor(canvas.width/d+2)-1
        }
        if(lines[l][lines[l].length-1][1]<=-2){
            lines[l][lines[l].length-1][1]=Math.floor(canvas.height/d+2)-1
        }
        if(lines[l][lines[l].length-1][0]>=Math.floor(canvas.width/d+2)){
            lines[l][lines[l].length-1][0]=-1
        }
        if(lines[l][lines[l].length-1][1]>=Math.floor(canvas.height/d+2)){
            lines[l][lines[l].length-1][1]=-1
        }
    }
}

let time=new Date()
let fps=60;
function animate(){
    if(new Date()-time>1000/fps){
        update()
        time=new Date()
    }
    requestAnimationFrame(animate)
}
animate()