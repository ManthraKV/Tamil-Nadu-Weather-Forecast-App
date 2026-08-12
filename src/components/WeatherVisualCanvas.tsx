import React, { useEffect, useRef } from 'react';
import { WeatherCondition } from '../types';

interface WeatherVisualCanvasProps {
  condition: WeatherCondition;
  isDay: boolean;
  className?: string;
}

export const WeatherVisualCanvas: React.FC<WeatherVisualCanvasProps> = ({
  condition,
  isDay,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setups
    const rainDrops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    const clouds: { x: number; y: number; radius: number; speed: number; opacity: number }[] = [];
    const stars: { x: number; y: number; radius: number; alpha: number; speed: number }[] = [];
    const sunRays: { angle: number; width: number; speed: number }[] = [];

    // Initialize particles
    if (condition.includes('Rain') || condition === 'Thunderstorm') {
      const dropCount = condition === 'Heavy Rain' || condition === 'Thunderstorm' ? 80 : 40;
      for (let i = 0; i < dropCount; i++) {
        rainDrops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: 12 + Math.random() * 18,
          speed: 8 + Math.random() * 8,
          opacity: 0.3 + Math.random() * 0.5,
        });
      }
    }

    if (condition === 'Partly Cloudy' || condition === 'Cloudy' || condition === 'Mist/Fog' || condition.includes('Rain')) {
      for (let i = 0; i < 5; i++) {
        clouds.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.5),
          radius: 30 + Math.random() * 40,
          speed: 0.2 + Math.random() * 0.3,
          opacity: condition === 'Mist/Fog' ? 0.35 : 0.2,
        });
      }
    }

    if (!isDay && (condition === 'Clear' || condition === 'Partly Cloudy')) {
      for (let i = 0; i < 35; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.8),
          radius: 0.8 + Math.random() * 1.5,
          alpha: Math.random(),
          speed: 0.01 + Math.random() * 0.02,
        });
      }
    }

    if (isDay && condition === 'Clear') {
      for (let i = 0; i < 6; i++) {
        sunRays.push({
          angle: (i * Math.PI) / 3,
          width: 0.15 + Math.random() * 0.1,
          speed: 0.002,
        });
      }
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Background gradient based on condition & time
      let bgGrad: CanvasGradient;
      if (!isDay) {
        bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(1, '#1e1b4b');
      } else if (condition === 'Thunderstorm' || condition === 'Heavy Rain') {
        bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#334155');
        bgGrad.addColorStop(1, '#475569');
      } else if (condition === 'Mist/Fog') {
        bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#e2e8f0');
        bgGrad.addColorStop(1, '#cbd5e1');
      } else if (condition.includes('Rain')) {
        bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#38bdf8');
        bgGrad.addColorStop(1, '#0284c7');
      } else {
        // Clear Day / Pleasant Tamil Nadu Sky
        bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#38bdf8');
        bgGrad.addColorStop(0.6, '#7dd3fc');
        bgGrad.addColorStop(1, '#e0f2fe');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Sun / Rays in Day Clear Sky
      if (isDay && condition === 'Clear') {
        const sunX = width * 0.8;
        const sunY = height * 0.3;

        ctx.fillStyle = 'rgba(253, 224, 71, 0.25)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 60 + Math.sin(frame * 0.03) * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Stars
      stars.forEach((star) => {
        star.alpha += star.speed;
        const opacity = Math.abs(Math.sin(star.alpha));
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.radius > width) cloud.x = -cloud.radius;

        ctx.fillStyle = isDay
          ? `rgba(255, 255, 255, ${cloud.opacity})`
          : `rgba(203, 213, 225, ${cloud.opacity * 0.7})`;

        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.radius * 0.7, cloud.y - cloud.radius * 0.2, cloud.radius * 0.8, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.radius * 0.7, cloud.y - cloud.radius * 0.1, cloud.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Lightning Flash for Thunderstorm
      if (condition === 'Thunderstorm' && frame % 120 < 4) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(0, 0, width, height);
      }

      // Render Rain
      if (rainDrops.length > 0) {
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        rainDrops.forEach((drop) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          drop.x -= 0.5;

          if (drop.y > height) {
            drop.y = -drop.length;
            drop.x = Math.random() * width;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [condition, isDay]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
