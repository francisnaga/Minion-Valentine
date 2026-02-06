// Minion Love Laboratory - Final Boss Edition

// Asset Registry with Direct Giphy URLs (WebP)
const ASSETS = {
    waiting: 'https://media.tenor.com/tpsBa8JCKCoAAAAC/jojo-bizzare-adventure.gif', 
    shocked: 'https://media.tenor.com/WX1Q1ZLgKWkAAAAC/awesome-approve.gif',
    celebration: 'https://media.tenor.com/WZkN9icpKXAAAAAC/sytycd-fox.gif'
};

const NO_PHRASES = [
    "No",
    "Are you sure?",
    "Think of the bananas!",
    "Don't do this...",
    "I'm gonna cry!",
    "Error: Choice restricted",
    "Please?",
    "Broken Heart 💔"
];

class App {
    constructor() {
        this.initElements();
        this.initBackground();
        this.bindEvents();
        
        this.state = {
            noClicks: 0,
            yesScale: 1
        };

        this.typewrite("I've been calculating the data... Will you be my Valentine?");
    }

    initElements() {
        this.yesBtn = document.getElementById('yes-btn');
        this.noBtn = document.getElementById('no-btn');
        this.minionImg = document.getElementById('minion-gif');
        this.title = document.getElementById('typewriter-text');
        this.messageCard = document.getElementById('message-card');
        this.glassContainer = document.querySelector('.glass-container');
    }

    initBackground() {
        // Floating hearts using Canvas
        const canvas = document.getElementById('heartCanvas');
        const ctx = canvas.getContext('2d');
        let hearts = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            hearts = [];
            const count = window.innerWidth < 768 ? 30 : 60;
            for(let i=0; i<count; i++) hearts.push(new Heart(canvas.width, canvas.height));
        };
        
        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hearts.forEach(h => { h.update(); h.draw(ctx); });
            requestAnimationFrame(animate);
        };
        animate();
    }

    bindEvents() {
        this.noBtn.addEventListener('click', () => this.handleNo());
        this.yesBtn.addEventListener('click', () => this.handleYes());
        
        // Dodge logic for desktop and mobile
        ['mouseenter', 'touchstart'].forEach(evt => {
            this.noBtn.addEventListener(evt, () => {
                if(this.state.noClicks >= 6) this.moveNoButton(); 
            });
        });
    }

    typewrite(text, i=0) {
        if(i < text.length) {
            this.title.textContent += text.charAt(i);
            setTimeout(() => this.typewrite(text, i+1), 40);
        }
    }

    handleNo() {
        this.state.noClicks++;
        
        // 1. Cycle Text
        const textIdx = Math.min(this.state.noClicks, NO_PHRASES.length - 1);
        this.noBtn.textContent = NO_PHRASES[textIdx];

        // 2. Grow Yes Button (Scale 1.2x)
        // Maintain the initial translation separation and add scale
        const baseOffset = window.innerWidth < 768 ? -70 : -90;
        this.state.yesScale *= 1.2; // Controlled growth
        this.yesBtn.style.transform = `translate3d(${baseOffset}px, 0, 0) scale(${this.state.yesScale})`;

        // 3. Shocked Minion after 4 clicks
        if (this.state.noClicks === 4) {
             this.minionImg.src = ASSETS.shocked;
        }

        // 4. Dodge Logic is handled in bindEvents via moveNoButton() calls on hover/touch
    }

    moveNoButton() {
        // Calculate random position within visible viewport bounds
        // Subtract button dimensions (approx 120x60) to keep it fully on screen
        const maxX = window.innerWidth - 140;
        const maxY = window.innerHeight - 80;
        
        const x = Math.max(20, Math.random() * maxX);
        const y = Math.max(20, Math.random() * maxY);
        
        this.noBtn.style.position = 'fixed';
        this.noBtn.style.left = `${x}px`;
        this.noBtn.style.top = `${y}px`;
        this.noBtn.style.transform = 'none'; // Remove initial transform
    }

    handleYes() {
        // 1. Celebration Asset
        this.minionImg.src = ASSETS.celebration;

        // 2. Confetti
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 }
        });

        // 3. Visual Shift
        document.body.classList.add('celebration-mode');

        // 4. Hide Elements & Show Message
        this.noBtn.style.display = 'none';
        this.title.style.opacity = '0';
        
        // Finale state for Yes Button
        this.yesBtn.style.zIndex = '100';
        this.yesBtn.style.transform += ` scale(10)`;
        this.yesBtn.style.opacity = '0'; // Disappear into the background color
        
        setTimeout(() => {
            this.yesBtn.style.display = 'none';
            this.glassContainer.style.background = 'rgba(255,255,255, 0.8)'; // Make card clearer
            this.messageCard.classList.remove('hidden');
            setTimeout(() => this.messageCard.classList.add('visible'), 50);
        }, 600);
    }
}

// Simple Particle Class
class Heart {
    constructor(w, h) {
        this.w = w; 
        this.h = h;
        this.reset();
    }
    reset() {
        this.x = Math.random() * this.w;
        this.y = Math.random() * this.h + this.h; // Start below
        this.velY = Math.random() * -1 - 0.5;
        this.size = Math.random() * 15 + 5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.y += this.velY;
        if(this.y < -20) this.reset();
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(255, 182, 193, ${this.opacity})`;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText('❤', this.x, this.y);
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
