interface Props {
  frequency: number;
  onChange: (v: number) => void;
  isPlaying: boolean;
}

const PRESETS = [
  { hz: 130, label: '130Hz' },
  { hz: 165, label: '165Hz' },
  { hz: 200, label: '200Hz' },
  { hz: 260, label: '260Hz' },
  { hz: 300, label: '300Hz' },
];

export default function FrequencySlider({ frequency, onChange, isPlaying }: Props) {
  const pct = ((frequency - 100) / (500 - 100)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold" style={{ color: '#94a3b8' }}>Frequency</span>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold neon-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{frequency}</span>
          <span className="text-sm" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>Hz</span>
          {isPlaying && (
            <div className="w-2 h-2 rounded-full ml-1" style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff', animation: 'glow-pulse 1s ease-in-out infinite' }} />
          )}
        </div>
      </div>

      <input
        type="range"
        min={100}
        max={500}
        step={1}
        value={frequency}
        onChange={e => onChange(parseInt(e.target.value))}
        className="slider-track"
        style={{
          background: `linear-gradient(to right, #00d4ff ${pct}%, #1e3a5f ${pct}%)`,
        }}
      />

      <div className="flex justify-between mt-1 mb-4">
        <span className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono' }}>100Hz</span>
        <span className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono' }}>500Hz</span>
      </div>

      {/* Presets */}
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p => (
          <button
            key={p.hz}
            onClick={() => onChange(p.hz)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              frequency === p.hz
                ? 'neon-text'
                : ''
            }`}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              border: frequency === p.hz ? '1px solid rgba(0,212,255,0.6)' : '1px solid rgba(255,255,255,0.06)',
              background: frequency === p.hz ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
              color: frequency === p.hz ? '#00d4ff' : '#475569',
              boxShadow: frequency === p.hz ? '0 0 10px rgba(0,212,255,0.2)' : 'none',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
