(function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const MAX_PARTICLES = 55;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y, size, speedY, rot, type, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedY = speedY;
            this.rot = rot;
            this.life = 1;
            this.type = type; // 'rose', 'sun', 'blueheart'
            this.color = color;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.globalAlpha = this.life;
            ctx.font = `${this.size}px "Segoe UI", "Arial"`;
            
            if (this.type === 'rose') {
                ctx.fillStyle = `rgba(255, 90, 120, ${this.life})`;
                ctx.fillText("🌹", -this.size/2, this.size/2);
            } 
            else if (this.type === 'sun') {
                ctx.fillStyle = `rgba(255, 200, 80, ${this.life})`;
                ctx.fillText("☀️", -this.size/2, this.size/2);
            }
            else if (this.type === 'blueheart') {
                ctx.fillStyle = `rgba(58, 134, 255, ${this.life})`;
                ctx.fillText("💙", -this.size/2, this.size/2);
            }
            else if (this.type === 'sparkle') {
                ctx.fillStyle = `rgba(100, 200, 255, ${this.life})`;
                ctx.fillText("✨", -this.size/2, this.size/2);
            }
            ctx.restore();
        }

        update() {
            this.y -= this.speedY;
            this.life -= 0.011;
            this.rot += 0.02;
            return this.y + this.size > 0 && this.life > 0;
        }
    }

    function addParticle(type, x, y) {
        if (particles.length > MAX_PARTICLES) return;
        let size = 18 + Math.random() * 30;
        let speed = 1.3 + Math.random() * 2.8;
        let rot = (Math.random() - 0.5) * 0.7;
        particles.push(new Particle(x, y, size, speed, rot, type));
    }

    function burst(type, count, centerX, centerY) {
        let limit = Math.min(count, 28);
        for (let i = 0; i < limit; i++) {
            let x = centerX + (Math.random() - 0.5) * 120;
            let y = centerY + (Math.random() - 0.5) * 90;
            addParticle(type, x, y);
        }
    }

    function rain(type, count) {
        let limit = Math.min(count, 35);
        for (let i = 0; i < limit; i++) {
            let x = Math.random() * canvas.width;
            let y = canvas.height - 10 + Math.random() * 50;
            addParticle(type, x, y);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length-1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i,1);
            } else {
                particles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Gentle auto blue hearts
    setInterval(() => {
        if (particles.length < MAX_PARTICLES - 10) {
            let x = Math.random() * canvas.width;
            let y = canvas.height - 5;
            addParticle('blueheart', x, y);
        }
    }, 1700);

    // Heart click
    const clickHeart = document.getElementById('clickHeart');
    const msgBox = document.getElementById('msgBox');
    const messages = [
        "💙 marilyn, you make me smile 💙",
        "🌹 roses bloom when i think of you 🌹",
        "☀️ you are my sunshine ☀️",
        "💙 blue like the deep sea for you 💙",
        "🌹 always roses for marilyn 🌹"
    ];
    let msgIndex = 0;

    clickHeart.addEventListener('click', (e) => {
        const rect = clickHeart.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        
        burst('blueheart', 20, cx, cy);
        burst('sparkle', 10, cx, cy);
        
        msgBox.innerHTML = `💙 ${messages[msgIndex % messages.length]} 💙`;
        msgIndex++;
        
        clickHeart.style.transform = "scale(1.25)";
        setTimeout(() => clickHeart.style.transform = "scale(1)", 120);
    });

    // Buttons
    document.getElementById('rosesBtn').addEventListener('click', () => {
        rain('rose', 35);
        msgBox.innerHTML = "🌹 roses for you, marilyn 🌹";
        resetMsg();
    });

    document.getElementById('sunBtn').addEventListener('click', () => {
        rain('sun', 30);
        for(let i=0;i<12;i++) {
            let x = Math.random() * canvas.width;
            let y = canvas.height - 10;
            addParticle('sparkle', x, y);
        }
        msgBox.innerHTML = "☀️ sunlight just for marilyn ☀️";
        resetMsg();
    });

    document.getElementById('blueHeartBtn').addEventListener('click', () => {
        rain('blueheart', 40);
        msgBox.innerHTML = "💙 blue hearts falling for marilyn 💙";
        resetMsg();
    });

    function resetMsg() {
        setTimeout(() => {
            if (msgIndex > 0) {
                msgBox.innerHTML = `💙 ${messages[(msgIndex-1) % messages.length]} 💙`;
            } else {
                msgBox.innerHTML = "❤️ touch the heart ❤️";
            }
        }, 2100);
    }
})();
