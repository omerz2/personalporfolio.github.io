// Set up the canvas and context
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
let particlesArray = [];

// Mouse object to store position and radius
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
};

// Function to handle window resizing
function handleResize() {
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 80) * (canvas.width / 80); // Recalculate mouse radius
    particlesArray = [];
    init(); // Reinitialize particles based on new size
}

// Event listener for mouse movement
window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Event listener for window resizing
window.addEventListener('resize', handleResize);

// Particle class to manage particle properties and behavior
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 5;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (distance < mouse.radius / 2) {
                let moveSpeed = 2;
                this.directionX = dx / distance * moveSpeed;
                this.directionY = dy / distance * moveSpeed;
            }
        }


        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();

        for (let i = 0; i < particlesArray.length; i++) {
            let otherParticle = particlesArray[i];
            let distanceToOther = Math.sqrt(
                (this.x - otherParticle.x) ** 2 + (this.y - otherParticle.y) ** 2
            );
            if (distanceToOther < 100) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();
            }
        }
    }
}

// Initialize the particles
function init() {
    particlesArray = [];
    let numberOfParticles = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = Math.random() * (canvas.width - size * 2) + size * 2;
        let y = Math.random() * (canvas.height - size * 2) + size * 2;
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = '#8C5523';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animate the particles
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    requestAnimationFrame(animate);
}

// Initialize and start the animation
handleResize(); // Set initial size and particles
animate();
