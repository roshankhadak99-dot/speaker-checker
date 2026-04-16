interface Props {
  autoMode: boolean;
  setAutoMode: (v: boolean) => void;
  autoProgress: number;
  autoDuration: number;
  isPlaying: boolean;
}

export default function AutoTimer({ autoMode, setAutoMode, autoProgress, autoDuration, isPlaying }: Props) {
  const elapsed = Math.round((autoProgress / 100) * autoDuration);
  const remaining = autoDuration - elapsed;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>Auto Stop Timer</p>
          <p className="text-xs mt-0.5" style={{ color: '#334155' }}>Stops automatically after {autoDuration}s</p>
        </div>
        {/* Toggle switch */}
        <button
          onClick={() => setAutoMode(!autoMode)}
          className="relative w-12 h-6 rounded-full transition-all"
          style={{
            background: autoMode ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)',
            border: autoMode ? '1px solid rgba(0,212,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: autoMode ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
          }}
          aria-label="Toggle auto mode"
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
            style={{
              left: autoMode ? '24px' : '2px',
              background: autoMode ? '#00d4ff' : '#475569',
              boxShadow: autoMode ? '0 0 8px rgba(0,212,255,0.6)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Progress bar */}
      {isPlaying && autoMode && (
        <div className="mt-3">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs" style={{ color: '#475569', fontFamily: 'JetBrains Mono' }}>Elapsed: {elapsed}s</span>
            <span className="text-xs" style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono' }}>Remaining: {remaining}s</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <div className="progress-bar-fill" style={{ width: `${autoProgress}%` }} />
          </div>
        </div>
      )}

      {!isPlaying && autoMode && (
        <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
          <p className="text-xs" style={{ color: '#475569' }}>Press START — will auto-stop after {autoDuration} seconds</p>
        </div>
      )}
    </div>
  );
}
