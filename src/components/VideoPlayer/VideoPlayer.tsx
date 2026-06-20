import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface VideoPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  src: string;
  poster?: string;
  title?: React.ReactNode;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

function fmt(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

/** Video player with a custom control bar overlaid on the native element. */
export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(function VideoPlayer(
  { src, poster, title, autoPlay, loop, muted = false, className, ...rest },
  ref,
) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(muted);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const progress = duration ? current / duration : 0;

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * duration;
  };

  const fullscreen = () => {
    const v = videoRef.current;
    if (v && "requestFullscreen" in v) void (v as HTMLVideoElement).requestFullscreen?.();
  };

  return (
    <div ref={ref} className={cx("msr-VideoPlayer", className)} {...rest}>
      <video
        ref={videoRef}
        className="msr-VideoPlayer__video"
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      {title && <div className="msr-VideoPlayer__title">{title}</div>}
      <div className="msr-VideoPlayer__controls">
        <button type="button" className="msr-VideoPlayer__btn" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>
          <Icon name={playing ? "minus" : "play"} size={18} />
        </button>
        <div className="msr-VideoPlayer__track" onClick={seek} role="slider" aria-label="Seek" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <span className="msr-VideoPlayer__fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="msr-VideoPlayer__time">{fmt(current)} / {fmt(duration)}</span>
        <button
          type="button"
          className="msr-VideoPlayer__btn"
          aria-label={isMuted ? "Unmute" : "Mute"}
          onClick={() => {
            const v = videoRef.current;
            if (v) v.muted = !v.muted;
            setIsMuted((m) => !m);
          }}
        >
          <Icon name={isMuted ? "eyeOff" : "activity"} size={16} />
        </button>
        <button type="button" className="msr-VideoPlayer__btn" aria-label="Fullscreen" onClick={fullscreen}>
          <Icon name="columns" size={16} />
        </button>
      </div>
    </div>
  );
});
