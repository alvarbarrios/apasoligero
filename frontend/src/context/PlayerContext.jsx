import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerCtx = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    audioRef.current = a;
    const onTime = () => setTime(a.currentTime);
    const onDur = () => setDur(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onDur);
    a.addEventListener("ended", onEnd);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onDur);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const play = (t) => {
    const a = audioRef.current;
    if (!a) return;
    if (track && track.file === t.file) {
      toggle();
      return;
    }
    a.src = t.file;
    a.play().catch(() => {});
    setTrack(t);
    setPlaying(true);
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !track) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().catch(() => {});
      setPlaying(true);
    }
  };

  const seek = (s) => {
    if (audioRef.current) audioRef.current.currentTime = s;
  };

  const close = () => {
    const a = audioRef.current;
    if (a) a.pause();
    setTrack(null);
    setPlaying(false);
    setTime(0);
    setDur(0);
  };

  return (
    <PlayerCtx.Provider value={{ track, playing, time, dur, play, toggle, seek, close }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => useContext(PlayerCtx);
