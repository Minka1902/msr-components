import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Waveform } from "../Waveform/Waveform";

export interface AudioPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  src: string;
  title?: React.ReactNode;
  /** Optional precomputed waveform peaks (0–1). Falls back to a progress bar. */
  peaks?: number[];
  /** Autoplay on mount (browser policies permitting). */
  autoPlay?: boolean;
}

function fmt(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

/** Custom-skinned audio player with waveform/scrubber and volume. */
export const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(function AudioPlayer(
  { src, title, peaks, autoPlay, className, ...rest },
  ref,
) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };

  const progress = duration ? current / duration : 0;

  const seek = (fraction: number) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = fraction * duration;
    setCurrent(a.currentTime);
  };

  return (
    <div ref={ref} className={cx("msr-AudioPlayer", className)} {...rest}>
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        className="msr-AudioPlayer__play"
        aria-label={playing ? "Pause" : "Play"}
        onClick={toggle}
      >
        <Icon name={playing ? "minus" : "play"} size={18} />
      </button>

      <div className="msr-AudioPlayer__body">
        {title && <div className="msr-AudioPlayer__title">{title}</div>}
        {peaks && peaks.length > 0 ? (
          <Waveform peaks={peaks} progress={progress} onSeek={seek} height={36} />
        ) : (
          <div
            className="msr-AudioPlayer__track"
            role="slider"
            aria-label="Seek"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - r.left) / r.width);
            }}
          >
            <span className="msr-AudioPlayer__fill" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
        <div className="msr-AudioPlayer__time">
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <label className="msr-AudioPlayer__volume" aria-label="Volume">
        <Icon name="activity" size={14} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);
            if (audioRef.current) audioRef.current.volume = v;
          }}
        />
      </label>
    </div>
  );
});
