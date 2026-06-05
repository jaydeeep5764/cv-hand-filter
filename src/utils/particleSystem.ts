export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export class ParticleSystem {
  particles: Particle[] = [];

  addParticles(
    x: number,
    y: number,
    count: number,
    intensity: number
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3 * intensity;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 3 * intensity,
      });
    }
  }

  update(deltaTime: number): void {
    this.particles = this.particles.filter(p => p.life > 0);
    
    this.particles.forEach(particle => {
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.vy += 0.1; // Gravity
      particle.life -= deltaTime * 0.5;
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      
      ctx.fillStyle = `rgba(0, 255, 200, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow effect
      ctx.strokeStyle = `rgba(0, 255, 200, ${alpha * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  clear(): void {
    this.particles = [];
  }
}
