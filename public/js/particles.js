// public/js/particles.js
function initParticles() {
    try {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas || typeof canvas.getContext !== 'function') {
            console.log('Canvas not available');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.log('Canvas context not available');
            return;
        }
        
        // Declarar variables dentro del scope
        let particles = [];
        let animationId = null;
        
        // Redimensionar canvas
        function resizeCanvas() {
            try {
                if (canvas) {
                    canvas.width = window.innerWidth || 800;
                    canvas.height = window.innerHeight || 600;
                }
            } catch (error) {
                console.log('Canvas resize error:', error);
            }
        }
        
        // Crear partícula
        function createParticle() {
            const canvasWidth = canvas.width || window.innerWidth || 800;
            const canvasHeight = canvas.height || window.innerHeight || 600;
            
            return {
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            };
        }
        
        // Inicializar partículas
        function initParticleSystem() {
            try {
                particles = [];
                for (let i = 0; i < 30; i++) {
                    particles.push(createParticle());
                }
            } catch (error) {
                console.log('Particle system init error:', error);
            }
        }
        
        // Animar partículas
        function animateParticles() {
            try {
                if (!ctx || !canvas) return;
                
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                
                particles.forEach((particle) => {
                    if (!particle) return;
                    
                    // Actualizar posición
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Rebotar en los bordes
                    if (particle.x < 0 || particle.x > canvasWidth) {
                        particle.vx *= -1;
                    }
                    if (particle.y < 0 || particle.y > canvasHeight) {
                        particle.vy *= -1;
                    }
                    
                    // Dibujar partícula
                    ctx.save();
                    ctx.globalAlpha = particle.opacity;
                    ctx.fillStyle = '#22c55e';
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
                
                animationId = requestAnimationFrame(animateParticles);
                
            } catch (error) {
                console.log('Animation error:', error);
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            }
        }
        
        // Función de limpieza
        function cleanup() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        
        // Inicializar
        resizeCanvas();
        initParticleSystem();
        animateParticles();
        
        // Redimensionar cuando cambie el tamaño de ventana
        const resizeHandler = () => {
            resizeCanvas();
            initParticleSystem();
        };
        
        window.addEventListener('resize', resizeHandler);
        
        // Cleanup cuando se oculte la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cleanup();
            } else {
                animateParticles();
            }
        });
        
    } catch (error) {
        console.log('Particles system error:', error);
    }
}

// Exportar para uso global
window.initParticles = initParticles;