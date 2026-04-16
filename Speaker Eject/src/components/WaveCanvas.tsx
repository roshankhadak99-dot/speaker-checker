import { useEffect, useRef } from 'react';

interface Props {
  isPlaying: boolean;
  frequency: number;
}

export default function WaveCanvas({ isPlaying, frequency }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const W = canvas.width;
    const H = canvas.height;
    const cx = H / 2;

    const draw = (ts: number) => {
      rafRef.current = requestAnimationFrame(draw);
      timeRef.current = ts;

      ctx.clearRect(0, 0, W, H);

      if (!isPlaying) {
        // Flat idle line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,212,255,0.15)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, cx);
        ctx.lineTo(W, cx);
        ctx.stroke();
        return;
      }

      phaseRef.current += (frequency / 165) * 0.06;

      const layers = [
        { amp: 18, speed: 1.0, color: 'rgba(0,212,255,0.9)', width: 2.5 },
        { amp: 12, speed: 1.4, color: 'rgba(0,212,255,0.4)', width: 1.5 },
        { amp: 8,  speed: 0.7, color: 'rgba(124,58,237,0.5)', width: 1.5 },
        { amp: 22, speed: 0.5, color: 'rgba(0,212,255,0.15)', width: 3 },
      ];

      layers.forEach(({ amp, speed, color, width }) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0,212,255,0.4)';

        for (let x = 0; x <= W; x += 2) {
          const t = phaseRef.current * speed;
          const y = cx +
            amp * Math.sin((x / W) * Math.PI * 4 + t) *
            Math.sin((x / W) * Math.PI + t * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Frequency bars at bottom
      const barCount = 32;
      const barW = W / barCount - 1;
      for (let i = 0; i < barCount; i++) {
        const t = phaseRef.current;
        const h = 4 + Math.abs(Math.sin(i * 0.4 + t * 1.2) * Math.cos(i * 0.2 + t * 0.8)) * 14;
        const alpha = 0.3 + Math.abs(Math.sin(i * 0.3 + t)) * 0.4;
        ctx.fillStyle = `rgba(0,212,255,${alpha})`;
        ctx.fillRect(i * (barW + 1), H - h - 2, barW, h);
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, frequency]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={80}
      style={{
        width: '100%',
        height: 80,
        borderRadius: 12,
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(0,212,255,0.08)',
      }}
    />
  );
}
