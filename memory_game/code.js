"use strict";
let guide=document.getElementById("guide");
let countdown=document.getElementById("countdown");
let levelDisplay=document.getElementById("level-display")
let input=document.getElementById("input");
let showScore=document.getElementById("score")
let highscore=0
if(localStorage.getItem('highscore')){
    highscore=parseInt(localStorage.getItem('highscore'))
}else{
    localStorage.setItem('highscore','0')
}

let score=0
showScore.innerText="highscore:"+highscore+"  score: "+score
function checkAnswer(answer){
    if(answer==memString){
        score+=1
        if(score>highscore){
            highscore=score
            localStorage.setItem('highscore',`${highscore}`)
        }
    }else{
        level=1
        levelcount=0
        score=0
        time=4
        memString=""
    }
    count=0
    levelcount+=1;
    if(levelcount>9){
        levelcount=0
        level+=1
    }
    showScore.innerText="highscore:"+highscore+"  score: "+score
    memString=''
}

let canSubmit=false
let memString=""
let count=0
let levelcount=0;
let level=1
let time=4
setInterval(()=>{
    countdown.innerText=count
    levelDisplay.innerText="level: "+level
    if(count<(time+level)){
        if(count==0){
            memString=''
            for(let i=0;i<level+3;i++){
                memString+=`${Math.round(Math.random()*9)}`
            }
        }
        guide.innerText="number to remember: "+memString;
        canSubmit=false;
        input.innerText=''
    }else{
        guide.innerText="type the number!";
        canSubmit=true;
    }
    count+=1
    if(count>(time+level)*2){
        checkAnswer(input.innerText)
    }
},1000)

window.addEventListener("keydown",(event)=>{
    console.log(event.key)
    if(canSubmit){
        if(!isNaN(event.key) && input.innerText.length<level+4){
            input.innerText+=event.key
        }
        if(event.key=='Backspace'){
            input.innerText=input.innerText.slice(0, -1)
        }
        if(event.key=='Enter'){
            checkAnswer(input.innerText)
        }
    }
})