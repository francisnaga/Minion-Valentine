// Minion Love Laboratory - Redesigned Logic

const ASSETS = {
    waiting: 'https://media.tenor.com/tpsBa8JCKCoAAAAC/jojo-bizzare-adventure.gif', 
    shocked: 'https://media.tenor.com/WX1Q1ZLgKWkAAAAC/awesome-approve.gif',
    celebration: 'https://media.tenor.com/WZkN9icpKXAAAAAC/sytycd-fox.gif'
};

const PHRASES = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it a try!",
    "Have a heart!",
    "Don't be so cold!",
    "Change of heart?",
    "Wouldn't you reconsider?",
    "Is that your final answer?",
    "You're breaking my heart ;(",
];

class App {
    constructor() {
        this.yesBtn = document.getElementById('yes-btn');
        this.noBtn = document.getElementById('no-btn');
        this.minionImg = document.getElementById('minion-gif');
        this.title = document.getElementById('typewriter-text');
        this.messageCard = document.getElementById('message-card');
        this.buttonsWrapper = document.querySelector('.buttons-wrapper');
        this.minionWrapper = document.querySelector('.minion-wrapper');
        this.textWrapper = document.querySelector('.text-wrapper');

        this.noClicks = 0;
        this.yesScale = 1;
        this.canEvade = false;

        this.init();
    }

    init() {
        this.initBackground();
        this.typewrite("Will you be my Valentine?");
        
        this.noBtn.addEventListener('click', () => this.handleNo());
        this.yesBtn.addEventListener('click', () => this.handleYes());
        
        // Mobile & Desktop Evasion
        ['mouseenter', 'touchstart'].forEach(evt => {
            this.noBtn.addEventListener(evt, (e) => {
                if(this.canEvade) {
                    // Prevent default touch behavior on mobile to stop scrolling
                    if(e.type === 'touchstart') e.preventDefault(); 
                    this.evade();
                }
            });
        });
    }

    typewrite(text, i=0) {
        if(i < text.length) {
            this.title.textContent += text.charAt(i);
            setTimeout(() => this.typewrite(text, i+1), 50);
        }
    }

    handleNo() {
        this.noClicks++;
        
        // 1. Change Text
        const idx = Math.min(this.noClicks, PHRASES.length - 1);
        this.noBtn.textContent = PHRASES[idx];

        // 2. Controlled Growth (Max 1.4x to prevent layout breaks)
        // We grow it just enough to be annoying/noticeable but not destructive
        if (this.yesScale < 1.4) {
            this.yesScale += 0.1;
            this.yesBtn.style.transform = `scale(${this.yesScale})`;
        }

        // 3. Minion Reaction
        if(this.noClicks === 4) {
             this.minionImg.src = ASSETS.shocked;
        }

        // 4. Evasion Mode
        if(this.noClicks >= 6) {
            this.canEvade = true;
            // First evade immediately on click to signify the change
            this.evade(); 
        }
    }

    evade() {
        // Move "No" button randomly, but keep it fixed so it floats over everything
        // Constrain to viewport with padding
        const maxX = window.innerWidth - this.noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - this.noBtn.offsetHeight - 20;
        
        const x = Math.max(10, Math.random() * maxX);
        const y = Math.max(10, Math.random() * maxY);
        
        this.noBtn.style.position = 'fixed';
        this.noBtn.style.left = `${x}px`;
        this.noBtn.style.top = `${y}px`;
        this.noBtn.style.zIndex = '1000'; // Make sure it's untrappable
    }

    handleYes() {
        // 1. Assets
        this.minionImg.src = ASSETS.celebration;
        document.body.classList.add('celebration');
        
        // 2. Confetti
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

        // 3. Smooth Fade Out of Content
        [this.buttonsWrapper, this.minionWrapper, this.textWrapper].forEach(el => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.5s ease';
            el.style.pointerEvents = 'none';
        });

        // 4. Show Card after short delay
        setTimeout(() => {
            this.messageCard.classList.remove('hidden');
            // Force reflow
            void this.messageCard.offsetWidth;
            this.messageCard.classList.add('visible');
        }, 500);
    }

    initBackground() {
        const canvas = document.getElementById('heartCanvas');
        const ctx = canvas.getContext('2d');
        let hearts = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            hearts = [];
            const count = window.innerWidth < 768 ? 20 : 50;
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
}

class Heart {
    constructor(w, h) {
        this.w = w; this.h = h;
        this.reset();
    }
    reset() {
        this.x = Math.random() * this.w;
        this.y = Math.random() * this.h + this.h;
        this.velY = Math.random() * -1 - 0.5;
        this.size = Math.random() * 15 + 10;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.y += this.velY;
        if(this.y < -30) this.reset();
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText('❤', this.x, this.y);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
