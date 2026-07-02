import { useState, useCallback, useReducer, useMemo } from 'react';
import MusicPlayer, { playerReducer, initialState, getNextIndex, getPrevIndex } from '../components/MusicPlayer';
import { MUSIC_TRACKS, CATEGORIES } from '../data/musicData';
import type { MusicTrack, MusicCategory } from '../types/music';

// ─── 曲目卡片 ──────────────────────────────────────────────
function TrackCard({
  track,
  isActive,
  isPlaying,
  onPlay,
}: {
  track: MusicTrack;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  return (
    <div
      onClick={onPlay}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 ${
        isActive ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20' : ''
      }`}
      style={{ background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(8px)' }}
    >
      {/* 封面 */}
      <div className="aspect-square overflow-hidden">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* 播放蒙层 */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isActive ? 'opacity-100 bg-black/40' : 'opacity-0 group-hover:opacity-100 bg-black/50'
        }`}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform ${
            isActive && isPlaying ? 'bg-cyan-400' : 'bg-white/90'
          }`}>
            {isActive && isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#0f172a">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#0f172a" style={{ marginLeft: 2 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* 信息区 */}
      <div className="p-4">
        <h3 className="text-sm md:text-base font-semibold text-white truncate mb-1">{track.title}</h3>
        <p className="text-xs text-white/50 mb-3">{track.artist}</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {track.genre.map((g) => (
            <span key={g} className="px-2 py-0.5 text-[10px] rounded-full text-cyan-300/80 border border-cyan-400/20"
              style={{ background: 'rgba(34,211,238,0.08)' }}>
              {g}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span>{track.releaseDate}</span>
          <span>{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MusicShare 主页面 ──────────────────────────────────────
interface MusicShareProps {
  /** 返回首页的回调 */
  onBack?: () => void;
}

export default function MusicShare({ onBack }: MusicShareProps) {
  const [playerState, dispatch] = useReducer(playerReducer, initialState);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState<MusicCategory | '全部'>('全部');

  // 筛选曲目
  const filteredTracks = useMemo(() => {
    if (activeCategory === '全部') return MUSIC_TRACKS;
    return MUSIC_TRACKS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  // 播放指定曲目
  const playTrack = useCallback((index: number) => {
    const track = filteredTracks[index];
    if (!track) return;
    setCurrentIndex(index);
    dispatch({ type: 'SET_TRACK', track, playlist: filteredTracks, index });
    // 下一帧自动播放
    requestAnimationFrame(() => dispatch({ type: 'PLAY' }));
  }, [filteredTracks]);

  // 上一首 / 下一首（由播放器按钮触发）
  const handlePrev = useCallback(() => {
    const idx = getPrevIndex(currentIndex, filteredTracks.length, playerState.playMode);
    playTrack(idx);
  }, [currentIndex, filteredTracks, playerState.playMode, playTrack]);

  const handleNext = useCallback(() => {
    const idx = getNextIndex(currentIndex, filteredTracks.length, playerState.playMode);
    playTrack(idx);
  }, [currentIndex, filteredTracks, playerState.playMode, playTrack]);

  const activeTrack = currentIndex >= 0 ? filteredTracks[currentIndex] : null;

  return (
    <div className="min-h-screen text-white" style={{ paddingTop: '40px', paddingBottom: playerState.currentTrack ? '100px' : '40px' }}>
      {/* 页面头部 */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.6) 100%)' }}>
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
          {/* 返回按钮 */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm"
              style={{ WebkitAppearance: 'none', appearance: 'none', border: 'none', background: 'none', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              返回个人空间
            </button>
          )}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            音乐分享
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-xl">
            这里收录了我的原创音乐作品和编曲创作，按单曲、专辑、EP 分类展示。
          </p>
        </div>
      </div>

      {/* 分类筛选 + 曲目列表 */}
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* 分类 Tab */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-1">
          {['全部', ...CATEGORIES].map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as MusicCategory | '全部')}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-cyan-400/20 border-cyan-400/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                }`}
                style={{ WebkitAppearance: 'none', appearance: 'none', cursor: 'pointer' }}>
                {cat}
                {cat !== '全部' && (
                  <span className="ml-2 text-xs opacity-60">
                    {MUSIC_TRACKS.filter((t) => t.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 曲目网格 */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredTracks.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                isActive={activeTrack?.id === track.id}
                isPlaying={activeTrack?.id === track.id && playerState.isPlaying}
                onPlay={() => playTrack(i)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mb-4 opacity-30">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <p>暂无作品</p>
          </div>
        )}
      </div>

      {/* 播放器 */}
      <MusicPlayer
        state={playerState}
        dispatch={dispatch}
        currentIndex={currentIndex}
        onPlayTrack={(idx) => playTrack(idx)}
      />

      {/* 页面底部间距（被播放器遮挡时） */}
      {playerState.currentTrack && <div className="h-24" />}

      {/* 当前播放曲目信息提示（无音频文件时） */}
      {activeTrack && !activeTrack.audioUrl && (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs text-amber-200 border border-amber-400/30"
          style={{ background: 'rgba(30,41,59,0.95)', backdropFilter: 'blur(8px)' }}>
          音频文件尚未上传，请将对应的 .mp3 文件放入 public 目录
        </div>
      )}
    </div>
  );
}
