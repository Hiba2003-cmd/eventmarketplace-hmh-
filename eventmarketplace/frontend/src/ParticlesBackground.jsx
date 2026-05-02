import { useEffect, useRef } from 'react';

const COLORS = [
   [255, 255, 255],   // أبيض
 
  [245, 245, 250],   // فضي فاتح

  [230, 235, 245]   // فضي
];

const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId, particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const makeStar = () => {
      const W = canvas.width, H = canvas.height;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const spikes = [4, 5, 6][Math.floor(Math.random() * 3)];
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: 1.7 + Math.random() * 10,
        color, spikes,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: 1 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      };
    };

    const drawStar = (cx, cy, r, color, alpha, spikes, rotation) => {
      const [red, g, b] = color;
      const innerR = r * 0.4;
      let angle = rotation;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? r : innerR;
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        angle += Math.PI / spikes;
      }
      ctx.closePath();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(${red},${g},${b},1)`;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.pulse += p.pulseSpeed;
        p.rotation += p.rotationSpeed;
        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        drawStar(p.x, p.y, p.r, p.color, alpha, p.spikes, p.rotation);

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    particles = Array.from({ length: 150 }, makeStar);
    animId = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
    />
  );
};

export default ParticlesBackground;