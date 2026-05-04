(function() {
    const canvas = document.getElementById('effect-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let maxParticles = 45; // حد أقصى للجزيئات - هذا يمنع البطء تماماً
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class LoveParticle {
        constructor(x, y, size, speedY, rot, type) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedY = speedY;
            this.rot = rot;
            this.life = 1; // opacity/life
            this.type = type;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.globalAlpha = this.life;
            ctx.font = `${this.size}px "Segoe UI", "Arial"`;
            // no shadowBlur for performance
            if (this.type === 'heart') {
                ctx.fillStyle = `rgba(255, 80, 140, ${this.life})`;
                ctx.fillText("❤️", -this.size/2, this.size/2);
            } else if (this.type === 'rose') {
                ctx.fillStyle = `rgba(255, 70, 100, ${this.life})`;
                ctx.fillText("🌹", -this.size/2, this.size/2);
            } else if (this.type === 'sparkle') {
                ctx.fillStyle = `rgba(255, 220, 100, ${this.life})`;
                ctx.fillText("✨", -this.size/2, this.size/2);
            }
            ctx.restore();
        }

        update() {
            this.y -= this.speedY;
            this.life -= 0.012; // fade out faster
            this.rot += 0.02;
            return this.y + this.size > 0 && this.life > 0;
        }
    }

    function addParticle(type, x, y) {
        if (particles.length > maxParticles) return;
        let size = 18 + Math.random() * 28;
        let speed = 1.2 + Math.random() * 2.8;
        let rot = (Math.random() - 0.5) * 0.6;
        particles.push(new LoveParticle(x, y, size, speed, rot, type));
    }

    function burstEffect(type, count, centerX, centerY) {
        for (let i = 0; i < Math.min(count, 25); i++) { // limit burst
            let x = centerX + (Math.random() - 0.5) * 100;
            let y = centerY + (Math.random() - 0.5) * 80;
            addParticle(type, x, y);
        }
    }

    function rainEffect(type, count) {
        let limited = Math.min(count, 35);
        for(let i = 0; i < limited; i++) {
            let x = Math.random() * canvas.width;
            let y = canvas.height - 10 + Math.random() * 40;
            addParticle(type, x, y);
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length-1; i >= 0; i--) {
            const p = particles[i];
            const alive = p.update();
            if (!alive) {
                particles.splice(i,1);
            } else {
                p.draw();
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Very light auto falling - reduced frequency
    setInterval(() => {
        if (particles.length < maxParticles - 10) {
            let x = Math.random() * canvas.width;
            let y = canvas.height - 5;
            addParticle('heart', x, y);
        }
    }, 1800);

    // Typewriter - Same beautiful poem
    const loveVerses = [
        "✨ Marilyn, you are the pulse inside my veins ✨",
        "💗 Your name is my favorite melody, forever on repeat 💗",
        "🌹 Every moment without you is a starless night 🌹",
        "💘 If beauty were a dimension, you'd be infinite 💘",
        "💖 Loving you feels like flying through supernovas 💖",
        "🔥 Marilyn, my heart combusts whenever you breathe 🔥",
        "💞 You are the greatest poem the universe never wrote 💞"
    ];
    
    let verseIdx = 0, charIdx = 0;
    const typewriterDiv = document.getElementById('typewriterText');
    
    function typeNextVerse() {
        if (verseIdx >= loveVerses.length) {
            setTimeout(() => {
                verseIdx = 0; charIdx = 0;
                typewriterDiv.innerHTML = "";
                typeNextVerse();
            }, 3500);
            return;
        }
        const currentVerse = loveVerses[verseIdx];
        if (charIdx < currentVerse.length) {
            typewriterDiv.innerHTML += currentVerse.charAt(charIdx);
            charIdx++;
            setTimeout(typeNextVerse, 50);
        } else {
            verseIdx++; charIdx = 0;
            if (verseIdx < loveVerses.length) {
                typewriterDiv.innerHTML += "<br><br>";
                setTimeout(typeNextVerse, 600);
            } else {
                setTimeout(() => {
                    verseIdx = 0; charIdx = 0;
                    typewriterDiv.innerHTML = "";
                    typeNextVerse();
                }, 4000);
            }
        }
    }
    typeNextVerse();

    // Heart click
    const heartBtn = document.getElementById('clickHeart');
    const msgBox = document.getElementById('loveResponse');
    const romanticMessages = [
        "💖 MARILYN YOU IGNITE MY SOUL 💖",
        "💘 ETERNITY ISN'T ENOUGH FOR US 💘",
        "💗 YOUR SMILE DESTROYS ALL DARKNESS 💗",
        "🌹 QUEEN OF MY HEART, MARILYN 🌹",
        "💞 YOU ARE MY ONLY RELIGION 💞",
        "✨ MARILYN = MAGNIFICENT LOVE ✨"
    ];
    let msgCycle = 0;
    
    heartBtn.addEventListener('click', (e) => {
        const rect = heartBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width/2;
        const centerY = rect.top + rect.height/2;
        burstEffect('heart', 20, centerX, centerY);
        burstEffect('sparkle', 8, centerX, centerY);
        
        msgBox.innerHTML = `💋 ${romanticMessages[msgCycle % romanticMessages.length]} 💋`;
        msgCycle++;
        
        heartBtn.style.transform = "scale(1.25)";
        setTimeout(() => heartBtn.style.transform = "scale(1)", 130);
    });
    
    // Buttons actions
    const heartAvalancheBtn = document.getElementById('heartAvalancheBtn');
    const roseStormBtn = document.getElementById('roseStormBtn');
    
    heartAvalancheBtn.addEventListener('click', () => {
        rainEffect('heart', 35);
        msgBox.innerHTML = "💕 HEART AVALANCHE FOR MARILYN 💕";
        setTimeout(() => {
            if(msgCycle>0) msgBox.innerHTML = romanticMessages[(msgCycle-1) % romanticMessages.length];
            else msgBox.innerHTML = "❤️ tap the heart ❤️";
        }, 2000);
    });
    
    roseStormBtn.addEventListener('click', () => {
        rainEffect('rose', 30);
        rainEffect('sparkle', 10);
        msgBox.innerHTML = "🌹 THOUSAND ROSES FOR MARILYN 🌹";
        setTimeout(() => {
            if(msgCycle>0) msgBox.innerHTML = romanticMessages[(msgCycle-1) % romanticMessages.length];
            else msgBox.innerHTML = "❤️ tap the heart ❤️";
        }, 2000);
    });
})();