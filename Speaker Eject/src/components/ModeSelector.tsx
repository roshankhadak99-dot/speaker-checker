import type { SoundMode, PlayMode } from './SpeakerEject';

interface Props {
  soundMode: SoundMode;
  setSoundMode: (m: SoundMode) => void;
  playMode: PlayMode;
  setPlayMode: (m: PlayMode) => void;
}

const SOUND_MODES: { id: SoundMode; label: string; desc: string; icon: string }[] = [
  { id: 'normal', label: 'Normal', desc: '165Hz', icon: '💧' },
  { id: 'strong', label: 'Strong', desc: '200Hz', icon: '💦' },
  { id: 'deep', label: 'Deep', desc: '130Hz', icon: '🌊' },
];

const PLAY_MODES: { id: PlayMode; label: string; desc: string }[] = [
  { id: 'continuous', label: 'Continuous', desc: 'Steady tone' },
  { id: 'pulse', label: 'Pulse', desc: 'On/off burst' },
  { id: 'sweep', label: 'Sweep', desc: 'Freq scan' },
];

export default function ModeSelector({ soundMode, setSoundMode, playMode, setPlayMode }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>Sound Mode</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {SOUND_MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setSoundMode(m.id)}
            className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all"
            style={{
              border: soundMode === m.id ? '1px solid rgba(0,212,255,0.6)' : '1px solid rgba(255,255,255,0.06)',
              background: soundMode === m.id ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.02)',
              boxShadow: soundMode === m.id ? '0 0 16px rgba(0,212,255,0.2)' : 'none',
            }}
          >
            <span className="text-xl">{m.icon}</span>
            <span className="text-xs font-bold" style={{ color: soundMode === m.id ? '#00d4ff' : '#64748b' }}>{m.label}</span>
            <span className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono' }}>{m.desc}</span>
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>Play Pattern</p>
      <div className="flex gap-2">
        {PLAY_MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setPlayMode(m.id)}
            className="mode-btn flex-1"
            style={{
              border: playMode === m.id ? '1px solid rgba(0,212,255,0.6)' : '1px solid rgba(255,255,255,0.06)',
              background: playMode === m.id ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.02)',
              color: playMode === m.id ? '#00d4ff' : '#475569',
              boxShadow: playMode === m.id ? '0 0 12px rgba(0,212,255,0.2)' : 'none',
            }}
          >
            <div className="text-xs font-bold">{m.label}</div>
            <div className="text-xs mt-0.5" style={{ color: '#334155' }}>{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
