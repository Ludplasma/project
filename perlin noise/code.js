function seededRandomXY(x, y) {
    const seed = x.toString() + '-' + y.toString();
    const rng = new Math.seedrandom(seed);
    return rng();
}

class random{
    constructor(seed){
        this.seed=14356;
    }
    random1(x,y){
        let seed=(Math.abs(x)<< 16) * Math.abs(y)*this.seed
        let mod=972342342432313;
        let a=  48722345333;
        let c=  6921212533422;
        return Math.abs((1/(mod-1))*((a*(seed)+c)%mod))
    }
    random2(x,y){
        let seed=(Math.abs(x)<< 16) * Math.abs(y)*this.seed
        let mod=97253455467873;
        let a=  48722345768333;
        let c=  439890587384;
        return Math.abs((1/(mod-1))*((a*(seed)+c)%mod))
    }
    rand2D(x,y){
        let bucket=0;
        let num=0;
        for(let a=0;a<2;a++){
            for(let b=0;b<2;b++){
                let x3=Math.floor(x)+a
                let y3=Math.floor(y)+b
                let n1=this.random1(x3,y3)*Math.PI*2
                let n2=this.random2(x3,y3)
                let x2=n2*Math.cos(n1)+x3
                let y2=n2*Math.sin(n1)+y3
                let d=Math.sqrt((x-x2)**2+(y-y2)**2)
                if(d<1){
                    d=(1-d)
                    bucket+=d
                    num+=1
                }
            }
        }
        return bucket/num;
    }
}

class perlinNoise{
    constructor(seed){
        this.seed=seed;
    }
    random1(x,y){
        let seed=(Math.abs(x)<< 16) * Math.abs(y)*this.seed
        let mod=972342342432313;
        let a=  48722345333;
        let c=  6921212533422;
        return Math.abs((1/(mod-1))*((a*(seed)+c)%mod))
    }
    random2(x,y){
        let seed=(Math.abs(x)<< 16) * Math.abs(y)*this.seed
        let mod=97253455467873;
        let a=  48722345768333;
        let c=  439890587384;
        return Math.abs((1/(mod-1))*((a*(seed)+c)%mod))
    }
    perlin2D(x,y){
        let bucket=0;
        let num=0;
        for(let a=-1;a<3;a++){
            for(let b=-1;b<3;b++){
                let x3=Math.floor(x)+a
                let y3=Math.floor(y)+b
                let n1=this.random1(x3,y3)*Math.PI*2
                let n2=this.random2(x3,y3)
                let x2=n2*Math.cos(n1)+x3
                let y2=n2*Math.sin(n1)+y3
                let d=Math.sqrt((x-x2)**2+(y-y2)**2)
                    d=1-1/(1+Math.E**(-d*2.3))
                    bucket+=d
                    num+=1
            }
        }
        x=bucket/num
        return 1/(1+Math.E**(-((x*2-1)*12)-9))
    }
}

//testing

let canvas=document.getElementById("myCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let ctx=canvas.getContext("2d");

let randomN=new perlinNoise(2398443298)

let size=5;

let pos1=0;
let pos2=0;
let max=0;

function draw(){
    for(let i=0;i<500/size;i++){
        for(let j=0;j<500/size;j++){
            let pixel=randomN.perlin2D(pos1+i/10,pos2+j/10)*255
            if(pixel>max){
                max=pixel
            }
            ctx.fillStyle=`rgb(${pixel},${pixel},${pixel})`
            ctx.fillRect(i*size,j*size,size,size)
        }
    }
}
window.addEventListener("keydown",(event)=>{
    if(event.key=="w"){
        pos2-=1/10
    }
    if(event.key=="s"){
        pos2+=1/10
    }
    if(event.key=="d"){
        pos1-=1/10
    }
    if(event.key=="a"){
        pos1+=1/10
    }

})
setInterval(draw,100)