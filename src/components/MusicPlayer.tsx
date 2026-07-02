import { useRef, useEffect, useCallback } from 'react';
import type { MusicTrack, PlayMode, PlayerState } from '../types/music';

// ─── Reducer ───────────────────────────────────────────────
type PlayerAction =
  | { type: 'SET_TRACK'; track: MusicTrack; playlist: MusicTrack[]; index: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_TIME'; time: number }
  | { type: 'SET_DURATION'; duration: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_PLAY_MODE'; mode: PlayMode }
  | { type: 'TOGGLE_LYRICS' }
  | { type: 'SEEK'; time: number };

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return { ...state, currentTrack: action.track, playlist: action.playlist, isPlaying: false, currentTime: 0, duration: 0 };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_TIME':
      return { ...state, currentTime: action.time };
    case 'SET_DURATION':
      return { ...state, duration: action.duration };
    case 'SET_VOLUME':
      return { ...state, volume: action.volume, isMuted: action.volume === 0 };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'SET_PLAY_MODE':
      return { ...state, playMode: action.mode };
    case 'TOGGLE_LYRICS':
      return { ...state, showLyrics: !state.showLyrics };
    case 'SEEK':
      return { ...state, currentTime: action.time };
    default:
      return state;
  }
}

const initialState: PlayerState = {
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
  playMode: 'sequential',
  showLyrics: false,
};

// ─── Helpers ───────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getNextIndex(current: number, total: number, mode: PlayMode): number {
  if (mode === 'shuffle') {
    let n: number;
    do { n = Math.floor(Math.random() * total); } while (n === current && total > 1);
    return n;
  }
  return (current + 1) % total;
}

function getPrevIndex(current: number, total: number, mode: PlayMode): number {
  if (mode === 'shuffle') {
    let n: number;
    do { n = Math.floor(Math.random() * total); } while (n === current && total > 1);
    return n;
  }
  return (current - 1 + total) % total;
}

// ─── Mode Icon ─────────────────────────────────────────────
const modeIcons: Record<PlayMode, { label: string; d: string }> = {
  sequential: {
    label: '顺序播放',
    d: 'M8 6h2v12H8V6zm6 0h2v12h-2V6zM3 18l4-4H4V8h3L3 4v14zm15-4h3v4h-3v-4z',
  },
  loop: {
    label: '循环播放',
    d: 'M17 17h-3v2l-4-3 4-3v2h3a4 4 0 0 0 0-8h-2v2h2a2 2 0 0 1 0 4zm-7-1.73V19l-4-3 4-3v2.73a5 5 0 0 0 0-9.46V4.27a7 7 0 0 1 0 13z',
  },
  shuffle: {
    label: '随机播放',
    d: 'M18 4l3 3-3 3v-2h-2.07a5 5 0 0 0-4.4 2.6l-2.26 3.77A3 3 0 0 1 6.47 16H4v-2h2.47a1 1 0 0 0 .88-.53l2.26-3.77A7 7 0 0 1 15.93 6H18V4zM4 8h2.47a1 1 0 0 1 .88.53l.52.87-1.72 2.86A3 3 0 0 1 3.47 14H2v2h1.47a5 5 0 0 0 4.4-2.6l.56-.93-1.08-1.8A3 3 0 0 0 4.87 10H4V8z',
  },
};

const nextMode: Record<PlayMode, PlayMode> = {
  sequential: 'loop',
  loop: 'shuffle',
  shuffle: 'sequential',
};

// ─── Component ─────────────────────────────────────────────
interface MusicPlayerProps {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
  currentIndex: number;
  onPlayTrack: (index: number) => void;
}

export default function MusicPlayer({ state, dispatch, currentIndex, onPlayTrack }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // ── Audio element sync ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state.isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [state.isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack?.audioUrl) return;
    audio.src = state.currentTrack.audioUrl;
    audio.load();
    if (state.isPlaying) audio.play().catch(() => {});
  }, [state.currentTrack?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.isMuted ? 0 : state.volume;
  }, [state.volume, state.isMuted]);

  // ── Event handlers ──
  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) dispatch({ type: 'SET_TIME', time: audio.currentTime });
  }, [dispatch]);

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) dispatch({ type: 'SET_DURATION', duration: audio.duration });
  }, [dispatch]);

  const onEnded = useCallback(() => {
    if (state.playMode === 'loop') {
      const audio = audioRef.current;
      if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
    } else {
      const next = getNextIndex(currentIndex, state.playlist.length, state.playMode);
      onPlayTrack(next);
    }
  }, [state.playMode, currentIndex, state.playlist.length, onPlayTrack]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !state.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * state.duration;
    dispatch({ type: 'SEEK', time: ratio * state.duration });
  }, [state.duration, dispatch]);

  const handlePrev = () => {
    const idx = getPrevIndex(currentIndex, state.playlist.length, state.playMode);
    onPlayTrack(idx);
  };
  const handleNext = () => {
    const idx = getNextIndex(currentIndex, state.playlist.length, state.playMode);
    onPlayTrack(idx);
  };

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const track = state.currentTrack;

  // 解析歌词（简单 LRC 格式）
  const lyricsLines: string[] = track?.lyrics
    ? track.lyrics.split('\n').filter(l => l.trim() && !l.startsWith('[ti:') && !l.startsWith('[ar:') && !l.startsWith('[al:'))
    : [];

  if (!track) return null;

  return (
    <>
      {/* 歌词面板 */}
      {state.showLyrics && lyricsLines.length > 0 && (
        <div className="fixed bottom-[88px] left-0 right-0 z-40 mx-auto max-w-[800px] px-6 py-4 rounded-t-2xl"
          style={{
            background: 'rgba(15,23,42,0.92)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
          <h4 className="text-xs text-white/50 mb-3 text-center tracking-wider">歌词</h4>
          <div className="max-h-[200px] overflow-y-auto space-y-1.5 text-center">
            {lyricsLines.map((line, i) => (
              <p key={i} className="text-sm text-white/70 leading-relaxed">{line.replace(/^\[\d{2}:\d{2}\.\d{2}\]/, '')}</p>
            ))}
          </div>
        </div>
      )}

      {/* 播放器底栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center h-[88px] px-4 md:px-8"
        style={{
          background: 'rgba(15,23,42,0.94)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
        <audio
          ref={audioRef}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onPlay={() => dispatch({ type: 'PLAY' })}
          onPause={() => dispatch({ type: 'PAUSE' })}
          preload="auto"
        />

        {/* 进度条（顶部细条） */}
        <div
          ref={progressRef}
          className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 cursor-pointer group"
          onClick={handleSeek}
        >
          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-150 group-hover:h-[5px] group-hover:-top-[1px] relative"
            style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* 左侧：封面 + 曲目信息 */}
        <div className="flex items-center gap-3 min-w-0 w-[220px] md:w-[280px]">
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
            <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{track.title}</p>
            <p className="text-xs text-white/50 truncate">{track.artist}</p>
          </div>
        </div>

        {/* 中间：播放控制 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-5">
            {/* 播放模式 */}
            <button
              onClick={() => dispatch({ type: 'SET_PLAY_MODE', mode: nextMode[state.playMode] })}
              className="text-white/50 hover:text-white transition-colors"
              title={modeIcons[state.playMode].label}
              style={{ WebkitAppearance: 'none', appearance: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d={modeIcons[state.playMode].d} />
              </svg>
            </button>

            {/* 上一首 */}
            <button onClick={handlePrev} className="text-white/70 hover:text-white transition-colors"
              style={{ WebkitAppearance: 'none', appearance: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            {/* 播放/暂停 */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-black/20"
              style={{ WebkitAppearance: 'none', appearance: 'none', border: 'none', cursor: 'pointer' }}>
              {state.isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1e293b">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1e293b" style={{ marginLeft: 2 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* 下一首 */}
            <button onClick={handleNext} className="text-white/70 hover:text-white transition-colors"
              style={{ WebkitAppearance: 'none', appearance: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z" />
              </svg>
            </button>

            {/* 歌词切换 */}
            {lyricsLines.length > 0 && (
              <button
                onClick={() => dispatch({ type: 'TOGGLE_LYRICS' })}
                className={`transition-colors ${state.showLyrics ? 'text-cyan-400' : 'text-white/50 hover:text-white'}`}
                title="歌词"
                style={{ WebkitAppearance: 'none', appearance: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM6 7h12v2H6V7zm0 4h12v2H6v-2zm0 4h8v2H6v-2z" />
                </svg>
              </button>
            )}
          </div>

          {/* 时间显示 */}
          <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
            <span>{formatTime(state.currentTime)}</span>
            <span>/</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* 右侧：音量控制 */}
        <div className="hidden md:flex items-center gap-2 w-[180px] justify-end">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
            className="text-white/50 hover:text-white transition-colors flex-shrink-0"
            style={{ WebkitAppearance: 'none', appearance: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
            {state.isMuted || state.volume === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.isMuted ? 0 : state.volume}
            onChange={(e) => dispatch({ type: 'SET_VOLUME', volume: parseFloat(e.target.value) })}
            className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
            style={{
              accentColor: '#22d3ee',
              WebkitAppearance: 'none',
              background: `linear-gradient(to right, #22d3ee ${(state.isMuted ? 0 : state.volume) * 100}%, rgba(255,255,255,0.2) ${(state.isMuted ? 0 : state.volume) * 100}%)`,
            }}
          />
        </div>
      </div>
    </>
  );
}

export type { PlayerAction };
export { initialState, playerReducer, getNextIndex, getPrevIndex };
