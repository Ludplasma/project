let buttons=document.querySelectorAll(".btn");
let screen=document.querySelector(".result")

let expression=""
for(let i=0;i<buttons.length;i++){
    buttons[i].addEventListener("click",function (){
        let button=this.innerText;
        if (button=="ERASE"){
            expression=""
        }else if(button=="="){
            expression=expression.replace("sqrt", "Math.sqrt");
            expression=eval(expression)
            console.log(expression)
        }else{
            expression+=button
        }
        screen.innerText=expression
        if(button=="ERASE"){
            screen.innerText="0"
        }
    });
}