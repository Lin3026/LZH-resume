/** 音乐作品分类 */
export type MusicCategory = '单曲' | '专辑' | 'EP';

/** 播放模式 */
export type PlayMode = 'sequential' | 'loop' | 'shuffle';

/** 单首音乐作品 */
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  category: MusicCategory;
  genre: string[];
  releaseDate: string;
  duration: number; // 秒
  lyrics?: string; // LRC 格式或纯文本
  description?: string;
}

/** 播放器状态 */
export interface PlayerState {
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  showLyrics: boolean;
}
