function mandel(n,nw,w,h,iterations,ipower,power,start_x,start_y,scale,MJselect,cim,creal){
    let sy=Math.round(h/nw)*n
    let ey=Math.round(h/nw)*(n+1)
    let arr=[]
    for(let x=0;x<w;x++){
        for(let y=sy;y<ey;y++){
            let a=start_x+x/scale;
            let b=start_y+y/scale;
            let ca=0;
            let cb=0;
            if(MJselect=="mandelbrot"){
                ca=a;
                cb=b;
            }else{
                ca=parseFloat(creal);
                cb=parseFloat(cim);
            }

            let i=0;
            while(i<iterations){
                //mandel calculation begins
                
                let r=Math.sqrt(a*a+b*b);
                let t=Math.atan2(b,a);
                let p=(r**power)*(Math.E**(-1*ipower*t));
                let m=power*t+ipower*Math.log(r);
                a=p*Math.cos(m)+ca;
                b=p*Math.sin(m)+cb;
                
                //mandel calculation ends                    
                if(a*a+b*b>4){  
                    break;
                }
                i++;
            }
            arr.push([x,y,i])
        }
    }
    postMessage(arr);
}
self.addEventListener("message", function(e) {
    mandel(e.data.n,e.data.nw,e.data.w,e.data.h,e.data.iterations,e.data.ipower,e.data.power,e.data.start_x,e.data.start_y,e.data.scale,e.data.MJselect,e.data.cim,e.data.creal);
}, false);