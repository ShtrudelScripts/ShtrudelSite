// Shtrudels Products Site Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Shtrudels Products site loaded');
    
    // Smooth scrolling + grow on 1.2s hover
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        let wobbleTimer = null;

        link.addEventListener('mouseenter', function() {
            wobbleTimer = setTimeout(() => {
                this.classList.add('grow');
                const li = this.parentElement;
                const prev = li.previousElementSibling?.querySelector('a');
                const next = li.nextElementSibling?.querySelector('a');
                if (prev) { prev.classList.add('bleed-right'); prev.classList.add('shrink'); }
                if (next) { next.classList.add('bleed-left'); next.classList.add('shrink'); }
            }, 1200);
        });

        link.addEventListener('mouseleave', function() {
            clearTimeout(wobbleTimer);
            const li = this.parentElement;
            const prev = li.previousElementSibling?.querySelector('a');
            const next = li.nextElementSibling?.querySelector('a');
            [this, prev, next].forEach(el => {
                if (!el) return;
                if (el.classList.contains('grow') || el.classList.contains('bleed-left') || el.classList.contains('bleed-right') || el.classList.contains('shrink')) {
                    const ct = window.getComputedStyle(el).transform;
                    el.classList.remove('grow', 'bleed-left', 'bleed-right', 'shrink');
                    el.style.transform = ct;
                }
            });
            void this.offsetWidth;
            [this, prev, next].forEach(el => {
                if (el) el.style.transform = '';
            });
        });

        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const sidebar = document.querySelector('.sidebar');
                const sidebarContent = document.querySelector('.sidebar-content');
                const inSidebar = sidebarContent?.contains(targetSection);
                if (inSidebar) {
                    document.querySelectorAll('.sidebar-content section').forEach(s => s.classList.remove('active', 'pulse'));
                    targetSection.classList.add('active');
                    if (sidebar) sidebar.classList.add('expanded');
                    if (sidebarContent) {
                        sidebarContent.scrollTo({
                            top: targetSection.offsetTop - sidebarContent.offsetTop - 20,
                            behavior: 'instant'
                        });
                    }
                    setTimeout(() => {
                        targetSection.classList.add('pulse');
                        setTimeout(() => targetSection.classList.remove('pulse'), 800);
                    }, 350);
                } else {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Explore button smooth scroll
    document.querySelector('.explore-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });

    // Auto-close sidebar when mouse leaves
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('mouseleave', () => {
            sidebar.classList.remove('expanded');
            document.querySelectorAll('.sidebar-content section').forEach(s => s.classList.remove('active', 'pulse'));
        });
    }

    // Mouse tracking for nav-panel gradient border with smooth interpolation
    const navPanel = document.querySelector('.nav-panel');
    if (navPanel) {
        let curX = 50, tgtX = 50;
        let curY = 50, tgtY = 50;
        let curA = 0, tgtA = 0;

        navPanel.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            tgtX = ((e.clientX - rect.left) / rect.width * 100);
            tgtY = ((e.clientY - rect.top) / rect.height * 100);
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
            tgtA = rad * (180 / Math.PI);
        });

        function smoothGradient() {
            const speed = 0.1;
            curX += (tgtX - curX) * speed;
            curY += (tgtY - curY) * speed;
            let diff = tgtA - curA;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            curA += diff * speed;
            navPanel.style.setProperty('--mx', curX.toFixed(1) + '%');
            navPanel.style.setProperty('--my', curY.toFixed(1) + '%');
            navPanel.style.setProperty('--angle', curA.toFixed(1) + 'deg');
            requestAnimationFrame(smoothGradient);
        }
        smoothGradient();
    }

    // Enhanced header scroll effect with theme colors
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
            header.style.background = 'rgba(0, 0, 0, 0.9)';
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
            header.style.background = 'rgba(0, 0, 0, 0.8)';
        }
        lastScroll = currentScroll;
    });
    
    // Add floating animation to header title
    const headerTitle = document.querySelector('header h1');
    let floatOffset = 0;
    
    function floatTitle() {
        floatOffset += 0.01;
        headerTitle.style.transform = `translateY(${Math.sin(floatOffset) * 3}px)`;
        requestAnimationFrame(floatTitle);
    }
    
    floatTitle();
    
    // Antigravity particles
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let W, H;
    let mouseX = -1000, mouseY = -1000;
    
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });
    
    const colors = ['#ffffff', '#e0e0e0', '#c0c0c0', '#a0a0a0', '#ffffff'];
    const shapes = ['circle', 'triangle'];
    
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 5 + 2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.01;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = shapes[Math.floor(Math.random() * shapes.length)];
            this.alpha = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        update() {
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200 * 3;
                this.speedX += dx / dist * force * 0.05;
                this.speedY += dy / dist * force * 0.05;
            }
            this.speedX *= 0.99;
            this.speedY *= 0.99;
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotSpeed;
            this.alpha = 0.3 + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.15;
            if (this.x < -50) this.x = W + 50;
            if (this.x > W + 50) this.x = -50;
            if (this.y < -50) this.y = H + 50;
            if (this.y > H + 50) this.y = -50;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                const s = this.size * 1.5;
                ctx.moveTo(0, -s);
                ctx.lineTo(s * 0.87, s * 0.5);
                ctx.lineTo(-s * 0.87, s * 0.5);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }
    
    const particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Remove black background from hub icon and executor icons
    document.querySelectorAll('.hub-icon, .executor-icon').forEach(icon => {
        const c = document.createElement('canvas');
        const img = new Image();
        img.onload = function() {
            c.width = img.width;
            c.height = img.height;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const d = ctx.getImageData(0, 0, c.width, c.height);
            for (let i = 0; i < d.data.length; i += 4) {
                if (d.data[i+3] === 255 && d.data[i] < 40 && d.data[i+1] < 40 && d.data[i+2] < 40) {
                    d.data[i+3] = 0;
                }
            }
            ctx.putImageData(d, 0, 0);
            icon.src = c.toDataURL();
        };
        img.src = icon.src;
    });

    // 3D tilt effect on executor images with blur glow
    document.querySelectorAll('.executor-icon').forEach(img => {
        const row = img.closest('.executor-row');
        const isDremia = row && row.querySelector('.card-dremia');
        const glowColor = isDremia ? 'rgba(150, 50, 220, 0.5)' : 'rgba(180, 180, 180, 0.5)';
        const glowInset = isDremia ? 'rgba(150, 50, 220, 0.15)' : 'rgba(180, 180, 180, 0.15)';
        let curX = 0, curY = 0, tgtX = 0, tgtY = 0;
        let active = false;
        let raf = null;

        img.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            tgtX = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
            tgtY = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));
            if (!active) {
                active = true;
                curX = tgtX;
                curY = tgtY;
                if (!raf) {
                    raf = requestAnimationFrame(tick);
                }
            }
        });

        img.addEventListener('mouseleave', function() {
            active = false;
            tgtX = 0.5;
            tgtY = 0.5;
        });

        function tick() {
            const speed = 0.12;
            if (!active && Math.abs(curX - 0.5) < 0.001 && Math.abs(curY - 0.5) < 0.001) {
                img.style.transform = '';
                img.style.boxShadow = '';
                raf = null;
                return;
            }
            curX += (tgtX - curX) * speed;
            curY += (tgtY - curY) * speed;
            const rotY = (curX - 0.5) * 12;
            const rotX = (0.5 - curY) * 12;
            img.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
            img.style.boxShadow = !active && Math.abs(curX - 0.5) < 0.01 ? '' : `0 0 40px ${glowColor}, inset 0 0 30px ${glowInset}`;
            raf = requestAnimationFrame(tick);
        }
    });
});

function copyCode(btn) {
    const code = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

function openDownloadModal() {
    document.getElementById('download-modal').classList.add('open');
}

function closeDownloadModal(e) {
    if (e && e.target !== e.currentTarget) return;
    const m = document.getElementById('download-modal');
    m.classList.remove('open', 'downloaded');
    const btn = m.querySelector('.modal-download-btn');
    if (btn) btn.textContent = 'Download Now';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const m = document.getElementById('download-modal');
        if (m) {
            m.classList.remove('open', 'downloaded');
            const btn = m.querySelector('.modal-download-btn');
            if (btn) btn.textContent = 'Download Now';
        }
    }
});

function startDownload(e) {
    const overlay = document.getElementById('download-modal');
    overlay.classList.add('downloaded');
    const btn = e.currentTarget;
    btn.textContent = 'Download started';
}

function toggleTheme() {
    document.body.classList.toggle('light');
}