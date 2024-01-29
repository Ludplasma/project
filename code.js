let projects=document.getElementById('main')
let files=["fractalTree","softbody","speechCoder",'test','moving_triangles','abstract_constelations','grapher','gravity simulator','mandelbrot','memory_game','particles','sound_vissualizer','toInfiniteDecimalPlaces','particle_life','fluid_simulation','unknown','perlin noise']
let devfiles=['fire_simulator','Reaction_Diffusion_simulation']
for(let i=0;i<files.length;i++){
    if(files[i]!='node_modules'){
        projects.innerHTML=projects.innerHTML+`<div class="project-div"><a class="project" href="${files[i]}/index.html">${files[i]}</a><a class="instructions" href="info/${files[i]}.html">info</a></div>`
    }
}
let dev=()=>{
    for(let i=0;i<devfiles.length;i++){
        projects.innerHTML=projects.innerHTML+`<div class="project-div"><a class="project" href="${devfiles[i]}/index.html">${devfiles[i]}</a><a class="instructions" href="info/${devfiles[i]}.html">info</a></div>`
    }
}