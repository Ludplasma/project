let canvas=document.getElementById("myCanvas1");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let ctx=canvas.getContext("2d");
let audioSource;
let analyzer;
let files;
let audio;
let audioCTX;
let bufferArray;
let bufferLength;
const file=document.getElementById("file-input");
let searchInput=document.getElementById("find-input");
const fileName=document.getElementById("name");
let filesURL=localStorage.getItem("save");
let selectSong=document.getElementById("select-songs");
let colorRange1=document.getElementById("color-range1");
let colorRange2=document.getElementById("color-range2");
let audio1=document.getElementById("audio1");
let color1=0;
let color2=300;
colorRange1.value=color1;
colorRange2.value=color2;
let scaleRange=document.getElementById("scale-range");
scaleRange.value=1

class Microphone{
    constructor(){
        this.initialized =  false;
        navigator.mediaDevices.getUserMedia({audio:true})
        .then(function(stream){
            this.AudioContext=new AudioContext();
            this.microphone=this.AudioContext.createMediaStreamSource(stream);
            this.analyzer=this.AudioContext.createAnalyser();
            this.analyzer.fftSize=1024;
            this.bufferLength=this.analyzer.frequencyBinCount;
            this.dataArray=new Uint8Array(this.bufferLength);
            //this.analyzer.fftSize=this.analyzer.fftSize*2;
            this.microphone.connect(this.analyzer);
            this.initialized=true;
        }.bind(this))
        .catch((err)=>{
            alert(err)
        })
    }
    getSamples(){
        this.analyzer.getByteTimeDomainData(this.dataArray);
        let normsamples=[...this.dataArray];
        return normsamples;
    }
    getvolume(){
        this.analyzer.getByteTimeDomainData(this.dataArray);
        let normsamples=[...this.dataArray].map(e=>e/(128)-1);
        let sum=0;
        for(let i=0;i<normsamples.length;i++){
            sum+=normsamples[i]*normsamples[i];
        }
        return Math.sqrt(sum/normsamples.length)*255*4;
    }
}
let microphone=new Microphone();

let butL=document.getElementById("but1");
let butR=document.getElementById("but2");
let findBut=document.getElementById("find");
let findInput=document.getElementById("find-input");

let didcreate=false
audio=document.getElementById("audio1")
audio.load()
window.addEventListener('click',()=>{
if(!didcreate){
audioCTX = new AudioContext();
audioSource=audioCTX.createMediaElementSource(audio);
analyzer=audioCTX.createAnalyser()
audioSource.connect(analyzer)
analyzer.connect(audioCTX.destination)
analyzer.fftSize=1024;
bufferLength=analyzer.frequencyBinCount;
bufferArray=new Uint8Array(bufferLength)
analyzer.fftSize=Math.round(analyzer.fftSize*2);
didcreate=true
}
})
let candraw=false;
let drawFunc=1;
let isMic=false;
let canpause=true;

file.addEventListener('change',()=>{
    files=file.files;
    selectSong.innerHTML='';
    for(let i=0;i<files.length;i++){
        selectSong.innerHTML+=`<option>${files[i].name}</option>`
    }
    audio.src=URL.createObjectURL(files[0])
    fileName.innerText=files[0].name;
    audio.play()
})

let names=[];
let numFile=0;
let paused=false;
function resetFile(){
    if(typeof files[numFile]=='string'){
        audio.src=files[numFile];
        fileName.innerText= names[numFile];
    }else{
        audio.src=URL.createObjectURL(files[numFile]);
        fileName.innerText= files[numFile].name;
    }
    audio.play()
}
butL.addEventListener('click',()=>{
    numFile-=1
    if(numFile<0){
        numFile=file.files.length-1
    }
    resetFile()
})
butR.addEventListener('click',()=>{
    numFile+=1
    if(numFile>file.files.length-1){
        numFile=0
    }
    resetFile()
})

let middely=canvas.height/2
let scale=1;
if(canvas.width<canvas.height){
    scale=0.8
    document.getElementById("select-song").style.visibility="visible"
}
let middelx=canvas.width/2


let Fscale;
let maxcicle;
let mincircle;
let arrLength;
let angle;
let d;
let i;
let vol;

let previousPoints=[{
    "x":0,
    "y":0,
    "t":0
}];
let points=[];
let branchDecreaseRate=0.7;
let lineWidthDecreaseRate=0.93;
let branches=10;
let divideBranches=2;
let offsetAngle=0;
let startBranchLen=100;
let branchlen=startBranchLen;
ctx.lineWidth = 2;


let micArr=[];
for(let ii=0;ii<512;ii++){
    micArr.push(0);
}
let decreaseRate=5;

let maxCircle1=canvas.height*0.4;
let maxCircle3=canvas.height*0.4*0.7;
let draw={
    "1":(arr,frame)=>{
        ctx.lineCap="round";
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        let perimeter=maxCircle1*Math.PI*2*scale;
        let section=Math.floor(arr.length/3);
        if(isMic){
            vol=microphone.getvolume();
        }
        for(i=0;i<arr.length;i++){
            if(isMic){
                arr[i]=arr[i]*vol/255;
                if(micArr[i]<arr[i]){
                    micArr[i]=arr[i];
                }
                if(frame){
                    micArr[i]-=decreaseRate;
                }
                arr[i]=micArr[i];
            }
            angle=Math.PI*2*i/section;
            d=arr[i]*maxCircle1*scale/255;
            ctx.lineWidth=perimeter/section;
            ctx.strokeStyle=`hsl(${color1+((color2-color1)/255)*arr[i]},80%,50%)`
            ctx.beginPath();
            ctx.moveTo(middelx,middely);
            ctx.lineTo(middelx+(Math.sin(angle)*d),middely+(Math.cos(angle)*d));
            ctx.stroke();
        }
    },
    "2":(arr,frame)=>{
        ctx.lineCap="round";
        Fscale=1/scale;
        maxcicle=170/Fscale;
        mincircle=50/Fscale;
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle="lightblue"
        arrLength=arr.length;
        if(isMic){
            vol=microphone.getvolume();
        }
        for(i=0;i<arr.length;i++){
            if(isMic){
                arr[i]=arr[i]*vol/255;
                if(micArr[i]<arr[i]){
                    micArr[i]=arr[i];
                }
                if(frame){
                    micArr[i]-=decreaseRate;
                }
                arr[i]=micArr[i];
            }
            ctx.lineWidth = (maxcicle*2*Math.PI)/arrLength;
            ctx.strokeStyle=`hsl(${color1+(color2-color1)*arr[i]/255},80%,50%)`
            ctx.beginPath();
            angle=((Math.PI*2)*i/arrLength)
            ctx.moveTo(middelx+(Math.sin(angle)*maxcicle),middely+(Math.cos(angle)*maxcicle));
            d=maxcicle+arr[i]/(2*Fscale)
            ctx.lineTo(middelx+(Math.sin(angle)*d),middely+(Math.cos(angle)*d));
            ctx.stroke();
            ctx.lineWidth=1/Fscale;
            ctx.strokeStyle=`hsl(${color1+(color2-color1)*arr[i]/255},80%,50%)`
            ctx.beginPath()
            ctx.arc(middelx,middely,mincircle+((maxcicle-mincircle)/255)*arr[i],0,Math.PI*2)
            ctx.stroke()
        }
        ctx.beginPath()
        ctx.fillStyle=`hsl(${color1+(color2-color1)*arr[0]/255},80%,50%)`
        ctx.arc(middelx,middely,mincircle,0,Math.PI*2)
        ctx.fill()
    },
    "3":(arr,frame)=>{
        ctx.lineCap="round";
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        let fLen=canvas.width*0.8*scale;
        let barLen=fLen/2/arr.length;
        ctx.lineWidth=barLen;
        if(isMic){
            vol=microphone.getvolume();
        }
        for(i=0;i<arr.length;i++){
            if(isMic){
                arr[i]=arr[i]*vol/255;
                if(micArr[i]<arr[i]){
                    micArr[i]=arr[i];
                }
                if(frame){
                    micArr[i]-=decreaseRate;
                }
                arr[i]=micArr[i];
            }
            ctx.strokeStyle=`hsl(${color1+(color2-color1)*arr[i]/255},80%,50%)`
            ctx.beginPath();
            ctx.moveTo(middelx-i*barLen-barLen/2,middely-arr[i]*scale);
            ctx.lineTo(middelx-i*barLen-barLen/2,middely+arr[i]*scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(middelx+i*barLen+barLen/2,middely-arr[i]*scale);
            ctx.lineTo(middelx+i*barLen+barLen/2,middely+arr[i]*scale);
            ctx.stroke();
        }
    },
    "4":(arr,frame)=>{
        ctx.lineCap="round";
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        let section=Math.floor(arr.length/50);
        let totalWidth=canvas.width*0.8;
        ctx.lineWidth=10;
        if(isMic){
            vol=microphone.getvolume();
        }
        for(i=0;i<arr.length;i+=section){
            if(isMic){
                arr[i]=arr[i]*vol/255;
                if(micArr[i]<arr[i]){
                    micArr[i]=arr[i];
                }
                if(frame){
                    micArr[i]-=decreaseRate;
                }
                arr[i]=micArr[i];
            }
            if(i>0){
                ctx.strokeStyle=`hsl(${color1+((color2-color1)/255)*arr[i-Math.floor(section/2)]},80%,50%)`
                ctx.beginPath();
                ctx.moveTo(middelx-totalWidth/2+totalWidth*(i-section)/arr.length,middely-(arr[i-section]-128));
                ctx.lineTo(middelx-totalWidth/2+totalWidth*(i)/arr.length,middely-(arr[i]-128));
                ctx.stroke();
            }
            ctx.strokeStyle=`hsl(${color1+((color2-color1)/255)*arr[i]},80%,50%)`
            ctx.beginPath();
            ctx.moveTo(middelx-totalWidth/2+totalWidth*(i)/arr.length,middely+128);
            ctx.lineTo(middelx-totalWidth/2+totalWidth*(i)/arr.length,middely-(arr[i]-128));
            ctx.stroke();
        }
    },
    "5":(arr,frame)=>{
        ctx.lineCap="round";
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        let maxCircle2=maxCircle3*scale;
        let perimeter=Math.PI*maxCircle2*2;
        let section=Math.floor(arr.length/3);
        if(isMic){
            vol=microphone.getvolume();
        }
        for(i=0;i<arr.length;i++){
            if(isMic){
                arr[i]=arr[i]*vol/255;
                if(micArr[i]<arr[i]){
                    micArr[i]=arr[i];
                }
                if(frame){
                    micArr[i]-=decreaseRate;
                }
                arr[i]=micArr[i];
            }
            ctx.lineWidth=perimeter/arr.length/2;
            angle=Math.PI+Math.PI*i/arr.length;
            d=maxCircle2+arr[i]*maxCircle2/255/2;
            ctx.strokeStyle=`hsl(${color1+((color2-color1)/255)*arr[i]},80%,50%)`;
            ctx.beginPath();
            ctx.moveTo(middelx+Math.sin(angle)*maxCircle2,middely+Math.cos(angle)*maxCircle2);
            ctx.lineTo(middelx+Math.sin(angle)*d,middely+Math.cos(angle)*d);
            ctx.stroke();
            angle=Math.PI-Math.PI*i/arr.length;
            ctx.beginPath();
            ctx.moveTo(middelx+Math.sin(angle)*maxCircle2,middely+Math.cos(angle)*maxCircle2);
            ctx.lineTo(middelx+Math.sin(angle)*d,middely+Math.cos(angle)*d);
            ctx.stroke();
            angle=Math.PI*2*i/section;
            d=arr[i]*maxCircle2/255-10*scale;
            ctx.lineWidth=perimeter/section;
            ctx.strokeStyle=`hsl(${color1+((color2-color1)/255)*arr[i]},80%,50%)`
            ctx.beginPath();
            ctx.moveTo(middelx,middely);
            ctx.lineTo(middelx+(Math.sin(angle)*d),middely+(Math.cos(angle)*d));
            ctx.stroke();
        }
        ctx.beginPath()
        ctx.fillStyle=`hsl(${color1+((color2-color1)/255)*arr[0]},80%,50%)`
        ctx.arc(middelx,middely,maxCircle2*0.1,0,Math.PI*2)
        ctx.fill()
    },
}
draw[`${drawFunc}`]([0,0,0,0,0,0])
let time=new Date();
let frame;
function animate(){
    frame=false;
    if(new Date()-time>1000/60){
        time=new Date();
        frame=true;
        if(canvas.height!=window.innerHeight || canvas.width!=window.innerWidth){
            canvas=document.getElementById("myCanvas1");
            canvas.width=window.innerWidth;
            canvas.height=window.innerHeight;
            ctx=canvas.getContext("2d");
            maxCircle1=canvas.height*0.4;
            maxCircle3=canvas.height*0.4*0.7;
            middelx=canvas.width/2;
            middely=canvas.height/2;
        }
    }
    if(didcreate){
        if(isMic){
            if(microphone.initialized){
                draw[`${drawFunc}`](microphone.getSamples(),frame);
            }
        }else{
            analyzer.getByteFrequencyData(bufferArray);
            draw[`${drawFunc}`](bufferArray,frames);
        }
    }
    requestAnimationFrame(animate)
}
animate()

findBut.addEventListener('click',()=>{
    if(findInput.value.length>0){
        let keywords=findInput.value.toUpperCase().split(" ");
        let score=0;
        let findFile=0;
        for(let i=0;i<files.length;i++){
            let fileNameSearch=files[i].name.toUpperCase()
            let thisScore=0
            for(let j=0;j<keywords.length;j++){
                if(fileNameSearch.indexOf(keywords[j])>0){
                    thisScore+=1
                }
            }
            if(thisScore>score){
                score=thisScore
                findFile=i
            }
        }
        if(score>0){
            numFile=findFile
            resetFile()
        }
    }
})

let setting=document.querySelectorAll(".setting");
for(let c=0;c<setting.length;c++){
    setting[c].style.visibility="visible"
}
window.addEventListener('keydown',(event)=>{
    console.log(event.keyCode)
    if(event.keyCode==37){
        numFile-=1
        if(numFile<0){
            numFile=file.files.length-1
        }
    }
    if(event.keyCode==39){
        numFile+=1
        if(numFile>file.files.length-1){
            numFile=0
        }
    }
    if(event.keyCode==39 || event.keyCode==37){
        resetFile()
    }
    if(canpause){
        if(event.keyCode==32){
            paused=!paused
        }
        if(paused){
            audio.pause()
        }else{
            audio.play() 
        }
    }
    if(event.keyCode==16){
        if(settings.style.visibility=="visible"){
            settings.style.visibility="hidden";
        }
        for(let c=0;c<setting.length;c++){
            if(setting[c].style.visibility=="hidden"){
                setting[c].style.visibility="visible";
            }else{
                setting[c].style.visibility="hidden";
            }
        }
    }
})
window.addEventListener("wheel",(event)=>{
    if(event.deltaY>=0){
        numFile-=1
    }else{
        numFile+=1
    }
    if(numFile<0){
        numFile=file.files.length-1
    }
    if(numFile>file.files.length-1){
        numFile=0
    }
    resetFile()
})

document.getElementById("input-mode").addEventListener("change",()=>{
    if(document.getElementById("input-mode").value=="microphone"){
        isMic=true;
    }else{
        isMic=false;
    }
})
document.getElementById("vissualizer-mode").addEventListener("change",()=>{
    drawFunc=parseInt(document.getElementById("vissualizer-mode").value.split(" ")[1]);
})
selectSong.addEventListener("change",()=>{
    for(let s=0;s<files.length;s++){
        if(files[s].name.replaceAll(" ","")==selectSong.value.replaceAll(" ","")){
            numFile=s;
            resetFile()
        }
    }
})
let settings=document.getElementById("settings");
settings.style.visibility="hidden"
document.getElementById("setting-button").addEventListener("click",()=>{
    if(settings.style.visibility=="hidden"){
        settings.style.visibility="visible";
    }else{
        settings.style.visibility="hidden";
    }
})
audio.addEventListener('ended', function() { 
    numFile+=1
    if(numFile>file.files.length-1){
        numFile=0
    }
    resetFile()
    this.currentTime = 0; 
}, false);

colorRange1.addEventListener("change",()=>{
    if(colorRange1.value>360){
        colorRange1.value=360
    }
    if(colorRange1.value<0){
        colorRange1.value=0
    }
    color1=colorRange1.value
})
colorRange2.addEventListener("change",()=>{
    if(colorRange2.value>360){
        colorRange2.value=360
    }
    if(colorRange2.value<0){
        colorRange2.value=0
    }
    color2=colorRange2.value
})
scaleRange.addEventListener("change",()=>{
    if(scaleRange.value<0){
        scaleRange.value=1
    }
    scale=scaleRange.value
})

document.addEventListener("click", (evt) => {
    let targetEl = evt.target; // clicked element      
    if(targetEl == searchInput || targetEl == colorRange1 || targetEl == colorRange2 || targetEl == scaleRange) {
      // This is a click inside, does nothing, just return.
      canpause=false
      return;
    }
    // This is a click outside.      
    canpause=true;
  });