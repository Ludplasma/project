let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let grid = {};
let colors = ["rgb(0,200,255)"];
let speed = 0.7;
let particles = createParticles(350);
let maxRadius = 70;

function createParticles(n) {
    return Array.from({ length: n }, () => {
        let angle = Math.PI * 2 * Math.random();
        return {
            x: canvas.width * Math.random(),
            y: canvas.height * Math.random(),
            vy: speed * Math.cos(angle),
            vx: speed * Math.sin(angle),
            color: 0,
        };
    });
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function update() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let tempGrid = {};

    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        let xCell = Math.floor(particle.x / maxRadius);
        let yCell = Math.floor(particle.y / maxRadius);

        for (let a = -1; a <= 1; a++) {
            for (let b = -1; b <= 1; b++) {
                let cellKey = `${xCell + a}#${yCell + b}`;
                if (grid[cellKey]) {
                    for (let p = 0; p < grid[cellKey].length; p++) {
                        let p2 = particles[grid[cellKey][p]];
                        let dx = p2.x - particle.x;
                        let dy = p2.y - particle.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance <= maxRadius) {
                            let hue = (distance / maxRadius) * 360;
                            let alpha = lerp(1, 0, distance / maxRadius);
                            ctx.strokeStyle = `hsla(${hue}, 80%, 50%, ${alpha})`;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(p2.x, p2.y);
                            ctx.lineTo(particle.x, particle.y);
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        let gridCellKey = `${xCell}#${yCell}`;
        if (!tempGrid[gridCellKey]) {
            tempGrid[gridCellKey] = [];
        }
        tempGrid[gridCellKey].push(i);

        particle.y += particle.vy;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        particle.x += particle.vx;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;

        ctx.fillStyle = colors[particle.color];
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    grid = tempGrid;
}

function animate() {
    if (canvas.height !== window.innerHeight || canvas.width !== window.innerWidth) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    update();
    requestAnimationFrame(animate);
}

animate();
