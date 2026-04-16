interface Props {
  onClose: () => void;
}

export default function Disclaimer({ onClose }: Props) {
  return (
    <div
      className="rounded-2xl p-4 animate-slide-up"
      style={{
        background: 'rgba(12,16,32,0.95)',
        border: '1px solid rgba(100,116,139,0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5" style={{ background: 'rgba(100,116,139,0.15)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2"/>
            <path d="M12 8v4m0 4h.01" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold mb-1" style={{ color: '#94a3b8' }}>Disclaimer</p>
          <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>
            SpeakerEject uses acoustic vibration to help displace water from speaker grills.
            This is <span style={{ color: '#94a3b8' }}>not a guaranteed fix</span> for hardware damage.
            Results may vary. Do not use at high volumes for extended periods.
            Stop immediately if you notice distortion or unusual behavior.
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(100,116,139,0.1)', color: '#475569' }}
          aria-label="Close disclaimer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
