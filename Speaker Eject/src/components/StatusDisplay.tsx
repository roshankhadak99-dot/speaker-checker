import type { PlayMode } from './SpeakerEject';

interface Props {
  isPlaying: boolean;
  frequency: number;
  playMode: PlayMode;
}

const PLAY_MODE_LABELS: Record<PlayMode, string> = {
  continuous: 'CONTINUOUS',
  pulse: 'PULSE',
  sweep: 'SWEEP',
};

export default function StatusDisplay({ isPlaying, frequency, playMode }: Props) {
  return (
    <div className="w-full flex items-center justify-between px-1">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: isPlaying ? '#10b981' : '#334155',
              boxShadow: isPlaying ? '0 0 8px #10b981' : 'none',
              transition: 'all 0.3s',
            }}
          />
          <span className="text-xs font-bold tracking-widest" style={{ color: isPlaying ? '#10b981' : '#334155', fontFamily: 'JetBrains Mono, monospace', transition: 'color 0.3s' }}>
            {isPlaying ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>
        <span className="text-xs" style={{ color: '#1e3a5f', fontFamily: 'JetBrains Mono', marginLeft: 16 }}>
          {PLAY_MODE_LABELS[playMode]}
        </span>
      </div>

      <div className="text-right">
        <div className="text-2xl font-bold" style={{ color: isPlaying ? '#00d4ff' : '#1e3a5f', fontFamily: 'JetBrains Mono, monospace', textShadow: isPlaying ? '0 0 12px rgba(0,212,255,0.5)' : 'none', transition: 'all 0.3s' }}>
          {frequency}<span className="text-sm ml-0.5">Hz</span>
        </div>
        <div className="text-xs" style={{ color: '#334155', fontFamily: 'JetBrains Mono' }}>frequency</div>
      </div>
    </div>
  );
}
