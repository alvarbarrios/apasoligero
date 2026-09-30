import { useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";

const BARS = 56;

export default function Waveform({ className = "" }) {
  const canvasRef = useRef(null);
  const { analyserRef, playing, time, dur } = usePlayer();
  const progressRef = useRef(0);
  progressRef.current = dur ? time / dur : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let buf;
    let idle = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const an = analyserRef.current;
      if (an && !buf) buf = new Uint8Array(an.frequencyBinCount);
      if (an && playing) an.getByteFrequencyData(buf);
      idle += 0.05;

      const gap = 2;
      const bw = (w - gap * (BARS - 1)) / BARS;
      const prog = progressRef.current;
      for (let i = 0; i < BARS; i++) {
        let v;
        if (an && playing) {
          const idx = Math.floor(Math.pow(i / BARS, 1.6) * (buf.length * 0.7));
          v = buf[idx] / 255;
        } else {
          v = 0.08 + 0.05 * Math.sin(idle + i * 0.4);
        }
        const bh = Math.max(2, v * h);
        const x = i * (bw + gap);
        const played = i / BARS < prog;
        ctx.fillStyle = played ? "#D4A359" : an && playing ? "rgba(161,173,161,0.55)" : "rgba(104,117,104,0.5)";
        ctx.fillRect(x, (h - bh) / 2, bw, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [analyserRef, playing]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" data-testid="player-waveform" />;
}
