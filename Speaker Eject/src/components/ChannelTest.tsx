interface Props {
  channel: 'both' | 'left' | 'right';
  setChannel: (c: 'both' | 'left' | 'right') => void;
}

export default function ChannelTest({ channel, setChannel }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>Speaker Channel</p>
      <div className="flex gap-2">
        {(['left', 'both', 'right'] as const).map(ch => (
          <button
            key={ch}
            onClick={() => setChannel(ch)}
            className="channel-btn"
            style={{
              border: channel === ch ? '1px solid rgba(0,212,255,0.7)' : '1px solid rgba(255,255,255,0.06)',
              background: channel === ch ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.02)',
              color: channel === ch ? '#00d4ff' : '#475569',
              boxShadow: channel === ch ? '0 0 14px rgba(0,212,255,0.25)' : 'none',
            }}
          >
            {ch === 'left' && '◁ Left'}
            {ch === 'both' && '◁▷ Both'}
            {ch === 'right' && 'Right ▷'}
          </button>
        ))}
      </div>
      <p className="text-xs mt-2" style={{ color: '#334155' }}>Use headphones to test individual channels</p>
    </div>
  );
}
