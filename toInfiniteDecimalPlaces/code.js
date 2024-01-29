let Dividend=document.getElementById("Dividend");
let Divisor=document.getElementById("Divisor");
let calculateButton=document.getElementById("calculateButton");
let stopCalculateButton=document.getElementById("stopCalculateButton");

let numberBox=document.getElementById("numberBox");

let numberString="";
let dividendNumber=0;
let divisorNumber=0;
let getToNumber=0;
let numberOfIntervals=0;
let interval;

calculateButton.addEventListener('click',function(){
    if(isNaN(Dividend.value)==false && isNaN(Divisor.value)==false){
        if(Dividend.value.length>0 && Divisor.value.length>0){
            dividendNumber=Dividend.value;
            divisorNumber=Divisor.value;
            let x;

            x=dividendNumber;
            if(Math.sqrt(x*x)-Math.floor(Math.sqrt(x*x))>0){
                let y=x.split('.');
                getToNumber=y[1].length;
            }else{
                getToNumber=0;
            }

            x=divisorNumber;
            if(Math.sqrt(x*x)-Math.floor(Math.sqrt(x*x))>0){
                let y=x.split('.');
                if(getToNumber<y[1].length){
                    getToNumber=y[1].length;
                }
            }
            console.log(getToNumber);

            dividendNumber=Number(dividendNumber)*(10**getToNumber);
            divisorNumber=Number(divisorNumber)*(10**getToNumber);
            if (numberOfIntervals==1){
                clearInterval(interval);
                numberBox.innerHTML=``;
                numberOfIntervals=0;
            }
            Z=dividendNumber;
            Y=divisorNumber;
            let X=Math.floor(Z/Y);
            numberBox.innerHTML=`${X}.`;
            let O=Z-(Y*X);
            Z=O*10;
            interval=setInterval(()=>{
                if(numberOfIntervals==0){
                    numberOfIntervals=1;
                }
                X=Math.floor(Z/Y);
                numberBox.innerHTML=numberBox.innerHTML+`${X}`;
                O=Z-(Y*X);
                Z=O*10;
            },10)
        }
    }
});
stopCalculateButton.addEventListener("click",()=>{
    clearInterval(interval)
})