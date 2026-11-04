import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize,
  Settings, PictureInPicture2, Loader2,
} from "lucide-react";

export type VideoPlayerHandle = { seek: (t: number) => void; currentTime: () => number };

type Props = {
  src: string;
  isHls: boolean;
  poster?: string;
  startAt?: number;
  onProgress?: (time: number, duration: number) => void;
  onEnded?: () => void;
};

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(function VideoPlayer(
  { src, isHls, poster, startAt = 0, onProgress, onEnded },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [levels, setLevels] = useState<{ i: number; h: number }[]>([]);
  const [level, setLevel] = useState(-1);
  const [menu, setMenu] = useState(false);
  const [fs, setFs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<{ x: number; t: number } | null>(null);
  const hlsRef = useRef<{ currentLevel: number; destroy: () => void } | null>(null);

  useImperativeHandle(ref, () => ({
    seek: (t) => {
      if (video.current) { video.current.currentTime = t; void video.current.play(); }
    },
    currentTime: () => video.current?.currentTime ?? 0,
  }));

  // Load source (HLS via hls.js, loaded only in the browser)
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let cancelled = false;
    setLoading(true); setError(null); setLevels([]); setLevel(-1); setPlaying(false);
    const applyStart = () => { if (startAt > 0 && startAt < v.duration - 2) v.currentTime = startAt; };
    v.addEventListener("loadedmetadata", applyStart, { once: true });

    if (isHls && !v.canPlayType("application/vnd.apple.mpegurl")) {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) { setError("Streaming not supported in this browser."); return; }
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
          setLevels(data.levels.map((l, i) => ({ i, h: l.height })).filter((l) => l.h));
        });
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) setError("This video could not be loaded. Please try again later.");
        });
      });
    } else {
      v.src = src;
    }
    return () => {
      cancelled = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
      v.removeEventListener("loadedmetadata", applyStart);
    };
  }, [src, isHls, startAt]);

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggle = useCallback(() => {
    const v = video.current; if (!v) return;
    if (v.paused) void v.play(); else v.pause();
  }, []);
  const skip = (d: number) => { const v = video.current; if (v) v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + d)); };
  const toggleFs = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrap.current?.requestFullscreen();
  };
  const pip = async () => {
    const v = video.current; if (!v) return;
    if (document.pictureInPictureElement) await document.exitPictureInPicture();
    else await v.requestPictureInPicture?.();
  };
  const setVol = (n: number) => {
    const v = video.current; if (!v) return;
    v.volume = n; v.muted = n === 0; setVolume(n); setMuted(n === 0);
  };
  const toggleMute = () => { const v = video.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); };
  const chooseRate = (r: number) => { if (video.current) video.current.playbackRate = r; setRate(r); };
  const chooseLevel = (l: number) => { if (hlsRef.current) hlsRef.current.currentLevel = l; setLevel(l); };

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === " " || k === "k") { e.preventDefault(); toggle(); }
    else if (k === "arrowright" || k === "l") skip(10);
    else if (k === "arrowleft" || k === "j") skip(-10);
    else if (k === "m") toggleMute();
    else if (k === "f") toggleFs();
  };

  const seekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration;
  };

  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={wrap}
      tabIndex={0}
      onKeyDown={onKey}
      className="group relative overflow-hidden rounded-lg bg-background outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <video
        ref={video}
        poster={poster}
        playsInline
        onClick={toggle}
        className="aspect-video w-full bg-background"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onPlaying={() => setLoading(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setTime(v.currentTime);
          if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
          onProgress?.(v.currentTime, v.duration);
        }}
        onEnded={() => { setPlaying(false); onEnded?.(); }}
      />

      {loading && !error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin text-gold" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-background/90 p-6 text-center text-sm">{error}</div>
      )}
      {!playing && !loading && !error && (
        <button
          onClick={toggle}
          aria-label="Play video"
          className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
        >
          <Play className="ml-1 h-7 w-7" />
        </button>
      )}

      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent px-4 pb-2.5 pt-6 transition-opacity ${playing ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : "opacity-100"}`}>
        <div
          className="relative mb-2 h-1.5 cursor-pointer rounded-full bg-secondary"
          onClick={(e) => { if (video.current) video.current.currentTime = seekFromEvent(e); }}
          onMouseMove={(e) => setHover({ x: e.clientX - e.currentTarget.getBoundingClientRect().left, t: seekFromEvent(e) })}
          onMouseLeave={() => setHover(null)}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
        >
          <div className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/40" style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${pct}%` }} />
          <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" style={{ left: `${pct}%` }} />
          {hover && (
            <span className="absolute -top-7 -translate-x-1/2 rounded bg-card px-1.5 py-0.5 text-xs" style={{ left: hover.x }}>{fmt(hover.t)}</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-foreground">
          <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
          <button onClick={() => skip(-10)} aria-label="Back 10 seconds"><RotateCcw className="h-4 w-4" /></button>
          <button onClick={() => skip(10)} aria-label="Forward 10 seconds"><RotateCw className="h-4 w-4" /></button>
          <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>{muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button>
          <input
            type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={(e) => setVol(Number(e.target.value))}
            aria-label="Volume"
            className="w-20 accent-primary"
          />
          <span className="text-xs tabular-nums text-muted-foreground">{fmt(time)} / {fmt(duration)}</span>
          <span className="flex-1" />
          <div className="relative">
            <button onClick={() => setMenu((m) => !m)} aria-label="Settings" className="flex items-center gap-1 text-xs">
              {rate}x <Settings className="h-4 w-4" />
            </button>
            {menu && (
              <div className="absolute bottom-8 right-0 w-44 rounded-md border border-border bg-card p-2 text-xs shadow-lg">
                <p className="px-2 pb-1 font-semibold text-muted-foreground">Speed</p>
                <div className="grid grid-cols-3 gap-1">
                  {speeds.map((s) => (
                    <button key={s} onClick={() => chooseRate(s)} className={`rounded px-2 py-1 ${s === rate ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{s}x</button>
                  ))}
                </div>
                {levels.length > 0 && (
                  <>
                    <p className="px-2 pb-1 pt-2 font-semibold text-muted-foreground">Quality</p>
                    <div className="grid grid-cols-2 gap-1">
                      <button onClick={() => chooseLevel(-1)} className={`rounded px-2 py-1 ${level === -1 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>Auto</button>
                      {levels.map((l) => (
                        <button key={l.i} onClick={() => chooseLevel(l.i)} className={`rounded px-2 py-1 ${level === l.i ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{l.h}p</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <button onClick={pip} aria-label="Picture in picture"><PictureInPicture2 className="h-4 w-4" /></button>
          <button onClick={toggleFs} aria-label="Fullscreen">{fs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}</button>
        </div>
      </div>
    </div>
  );
});
