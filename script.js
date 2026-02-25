document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const greetBtn = document.getElementById('greetBtn');
    const greetingDisplay = document.getElementById('greetingDisplay');
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');

    // Resize canvas to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Store animation frame ID to easily clear previous animations
    let currentAnimationId = null;

    greetBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        
        if (name) {
            // Display dynamic greeting
            greetingDisplay.innerHTML = `<span class="greeting-text">Hello ${escapeHTML(name)}</span>`;
            greetingDisplay.classList.remove('hidden');
            
            // Trigger random animation
            triggerRandomAnimation();
        } else {
            // Prompt user if empty
            nameInput.focus();
            nameInput.classList.add('error-shake');
            setTimeout(() => nameInput.classList.remove('error-shake'), 400);
        }
    });

    // Optional: Allow pressing 'Enter' to trigger
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            greetBtn.click();
        }
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    function triggerRandomAnimation() {
        // Clear any ongoing custom canvas animation
        if (currentAnimationId) {
            cancelAnimationFrame(currentAnimationId);
            currentAnimationId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 3 Animations: 0 = Confetti, 1 = Party Popper, 2 = Glowing Burst
        const rand = Math.floor(Math.random() * 3);
        
        if (rand === 0) {
            playConfetti();
        } else if (rand === 1) {
            playPartyPopper();
        } else {
            playGlowingBurst();
        }
    }

    // Animation 1: Confetti (uses canvas-confetti library)
    function playConfetti() {
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#00f2fe', '#4facfe', '#ffffff', '#ff007f']
        });
    }

    // Animation 2: Party Popper (uses canvas-confetti from sides)
    function playPartyPopper() {
        const end = Date.now() + 1.5 * 1000;

        const colors = ['#00f2fe', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Animation 3: Glowing Burst (Custom Canvas animation)
    function playGlowingBurst() {
        const particles = [];
        const particleCount = 80;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: centerX,
                y: centerY,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 8 + 4,
                radius: Math.random() * 4 + 1,
                life: 1,
                decay: Math.random() * 0.02 + 0.015,
                hue: Math.random() * 60 + 180 // Cyan/Blue range
            });
        }

        function animateBurst() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let particlesAlive = false;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.life > 0) {
                    particlesAlive = true;
                    p.x += Math.cos(p.angle) * p.speed;
                    p.y += Math.sin(p.angle) * p.speed;
                    p.life -= p.decay;
                    p.speed *= 0.95; // friction

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.life})`;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
                    ctx.fill();
                }
            }

            if (particlesAlive) {
                currentAnimationId = requestAnimationFrame(animateBurst);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        animateBurst();
    }
});
