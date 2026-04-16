import { useState, useEffect, useRef, useCallback } from 'react';
import WaveCanvas from './WaveCanvas';
import FrequencySlider from './FrequencySlider';
import ModeSelector from './ModeSelector';
import AutoTimer from './AutoTimer';
import ChannelTest from './ChannelTest';
import StatusDisplay from './StatusDisplay';
import Disclaimer from './Disclaimer';

export type SoundMode = 'normal' | 'strong' | 'deep';
export type PlayMode = 'continuous' | 'pulse' | 'sweep';

const MODE_CONFIGS: Record<SoundMode, { freq: number; gain: number; label: string; desc: string }> = {
  normal: { freq: 165, gain: 0.7, label: 'Normal', desc: '165Hz – Gentle vibration' },
  strong: { freq: 200, gain: 0.9, label: 'Strong', desc: '200Hz – Deep resonance' },
  deep: { freq: 130, gain: 1.0, label: 'Deep Clean', desc: '130Hz – Max penetration' },
};

export default function SpeakerEject() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(165);
  const [soundMode, setSoundMode] = useState<SoundMode>('normal');
  const [playMode, setPlayMode] = useState<PlayMode>('continuous');
  const [autoMode, setAutoMode] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [autoDuration] = useState(45);
  const [channel, setChannel] = useState<'both' | 'left' | 'right'>('both');
  const [volume, setVolume] = useState(0.8);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [waterDrops, setWaterDrops] = useState<number[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const pulseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sweepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStartRef = useRef<number>(0);
  const sweepDirRef = useRef(1);
  const sweepFreqRef = useRef(frequency);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    if (pulseIntervalRef.current) { clearInterval(pulseIntervalRef.current); pulseIntervalRef.current = null; }
    if (sweepIntervalRef.current) { clearInterval(sweepIntervalRef.current); sweepIntervalRef.current = null; }
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch {}
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (pannerRef.current) {
      pannerRef.current.disconnect();
      pannerRef.current = null;
    }
  }, []);

  const stopAutoMode = useCallback(() => {
    if (autoTimerRef.current) { clearInterval(autoTimerRef.current); autoTimerRef.current = null; }
    setAutoProgress(0);
    setAutoMode(false);
  }, []);

  const startAudio = useCallback((freq: number, vol: number, pan: number) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    stopAudio();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    panner.pan.setValueAtTime(pan, ctx.currentTime);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    osc.start();

    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    pannerRef.current = panner;

    return { osc, gain, panner };
  }, [getAudioContext, stopAudio]);

  const getPan = (ch: typeof channel) => ch === 'left' ? -1 : ch === 'right' ? 1 : 0;

  const triggerPlay = useCallback((freq: number, vol: number, mode: PlayMode, ch: typeof channel) => {
    const pan = getPan(ch);
    const cfg = MODE_CONFIGS[soundMode];
    const finalVol = vol * cfg.gain;

    if (mode === 'continuous') {
      startAudio(freq, finalVol, pan);
    } else if (mode === 'pulse') {
      startAudio(freq, finalVol, pan);
      let on = true;
      pulseIntervalRef.current = setInterval(() => {
        if (!gainNodeRef.current) return;
        on = !on;
        const ctx = audioCtxRef.current!;
        gainNodeRef.current.gain.linearRampToValueAtTime(
          on ? finalVol : 0,
          ctx.currentTime + 0.05
        );
      }, 200);
    } else if (mode === 'sweep') {
      sweepFreqRef.current = freq;
      startAudio(freq, finalVol, pan);
      sweepIntervalRef.current = setInterval(() => {
        if (!oscillatorRef.current || !audioCtxRef.current) return;
        sweepFreqRef.current += sweepDirRef.current * 3;
        if (sweepFreqRef.current >= 350) sweepDirRef.current = -1;
        if (sweepFreqRef.current <= 100) sweepDirRef.current = 1;
        oscillatorRef.current.frequency.setValueAtTime(
          sweepFreqRef.current,
          audioCtxRef.current.currentTime
        );
      }, 80);
    }
  }, [soundMode, startAudio]);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      stopAudio();
      stopAutoMode();
      setIsPlaying(false);
      setWaterDrops([]);
    } else {
      triggerPlay(frequency, volume, playMode, channel);
      setIsPlaying(true);
      // spawn water drops
      setWaterDrops(Array.from({ length: 6 }, (_, i) => i));

      if (autoMode) {
        autoStartRef.current = Date.now();
        setAutoProgress(0);
        autoTimerRef.current = setInterval(() => {
          const elapsed = (Date.now() - autoStartRef.current) / 1000;
          const pct = Math.min((elapsed / autoDuration) * 100, 100);
          setAutoProgress(pct);
          if (pct >= 100) {
            stopAudio();
            stopAutoMode();
            setIsPlaying(false);
            setWaterDrops([]);
          }
        }, 100);
      }
    }
  }, [isPlaying, frequency, volume, playMode, channel, autoMode, autoDuration, triggerPlay, stopAudio, stopAutoMode]);

  // Update frequency live
  useEffect(() => {
    if (isPlaying && oscillatorRef.current && audioCtxRef.current && playMode !== 'sweep') {
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
    }
  }, [frequency, isPlaying, playMode]);

  // Update volume live
  useEffect(() => {
    if (isPlaying && gainNodeRef.current && audioCtxRef.current) {
      const cfg = MODE_CONFIGS[soundMode];
      gainNodeRef.current.gain.setValueAtTime(volume * cfg.gain, audioCtxRef.current.currentTime);
    }
  }, [volume, soundMode, isPlaying]);

  // Update pan live
  useEffect(() => {
    if (isPlaying && pannerRef.current && audioCtxRef.current) {
      pannerRef.current.pan.setValueAtTime(getPan(channel), audioCtxRef.current.currentTime);
    }
  }, [channel, isPlaying]);

  // Apply mode preset
  useEffect(() => {
    const cfg = MODE_CONFIGS[soundMode];
    setFrequency(cfg.freq);
  }, [soundMode]);

  // Cleanup
  useEffect(() => () => {
    stopAudio();
    stopAutoMode();
    if (audioCtxRef.current) audioCtxRef.current.close();
  }, [stopAudio, stopAutoMode]);

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,80,120,0.3) 0%, #050810 60%)' }}>
      {/* Header */}
      <header className="w-full max-w-md px-5 pt-8 pb-4 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.07 4.93a10 10 0 010 14.14" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15.54 8.46a5 5 0 010 7.07" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: '#e2e8f0' }}>
            Speaker<span className="neon-text">Eject</span>
          </h1>
        </div>
        <p className="text-xs text-center" style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>Water removal via acoustic resonance</p>
      </header>

      <main className="w-full max-w-md px-4 flex flex-col gap-4 pb-8">
        {/* Volume Warning */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Set your volume to maximum for best results</span>
        </div>

        {/* Main Button Area */}
        <div className="glass-card p-6 flex flex-col items-center gap-6">
          <StatusDisplay isPlaying={isPlaying} frequency={frequency} playMode={playMode} />

          {/* Central Button */}
          <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
            {/* Ripple rings when active */}
            {isPlaying && (
              <>
                <div className="ripple-ring" />
                <div className="ripple-ring" />
                <div className="ripple-ring" />
              </>
            )}

            {/* Water drops */}
            {isPlaying && waterDrops.map((i) => (
              <WaterDrop key={i} index={i} />
            ))}

            <button
              className={`btn-main flex flex-col items-center justify-center gap-2 ${isPlaying ? 'active animate-glow-active' : 'animate-glow-pulse'}`}
              onClick={handleToggle}
              aria-label={isPlaying ? 'Stop' : 'Start'}
            >
              <div style={{ color: isPlaying ? '#00d4ff' : '#94a3b8', transition: 'color 0.3s' }}>
                {isPlaying ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </div>
              <span className="text-sm font-bold tracking-widest uppercase" style={{ color: isPlaying ? '#00d4ff' : '#94a3b8', fontFamily: 'Syne, sans-serif', transition: 'color 0.3s' }}>
                {isPlaying ? 'STOP' : 'START'}
              </span>
            </button>
          </div>

          {/* Wave Canvas */}
          <WaveCanvas isPlaying={isPlaying} frequency={frequency} />
        </div>

        {/* Frequency Slider */}
        <div className="glass-card p-5">
          <FrequencySlider
            frequency={frequency}
            onChange={setFrequency}
            isPlaying={isPlaying}
          />
        </div>

        {/* Sound Mode */}
        <div className="glass-card p-5">
          <ModeSelector
            soundMode={soundMode}
            setSoundMode={setSoundMode}
            playMode={playMode}
            setPlayMode={setPlayMode}
          />
        </div>

        {/* Auto Timer */}
        <div className="glass-card p-5">
          <AutoTimer
            autoMode={autoMode}
            setAutoMode={setAutoMode}
            autoProgress={autoProgress}
            autoDuration={autoDuration}
            isPlaying={isPlaying}
          />
        </div>

        {/* Channel Test */}
        <div className="glass-card p-5">
          <ChannelTest channel={channel} setChannel={setChannel} />
        </div>

        {/* Volume */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: '#94a3b8' }}>Volume</span>
            <span className="text-sm font-bold" style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace' }}>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="slider-track"
            style={{ '--val': `${(volume - 0.1) / 0.9 * 100}%` } as any}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono' }}>10%</span>
            <span className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono' }}>100%</span>
          </div>
        </div>

        {/* Disclaimer */}
        {showDisclaimer && <Disclaimer onClose={() => setShowDisclaimer(false)} />}
      </main>
    </div>
  );
}

function WaterDrop({ index }: { index: number }) {
  const positions = [15, 30, 50, 65, 80, 45];
  const delays = [0, 0.3, 0.7, 0.1, 0.5, 0.9];
  const left = positions[index % positions.length];
  const delay = delays[index % delays.length];

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: '10%',
        width: 6,
        height: 8,
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
        boxShadow: '0 0 6px rgba(0,212,255,0.6)',
        animation: `water-drop 1.5s ease-in ${delay}s infinite`,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}
