import { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import Lightfall from '../components/Lightfall';
import BorderGlow from '../components/BorderGlow';
import './GameLoading.css';

// 首页关键图片资源 — import 拿到构建后 URL，用于后台预加载
import oceanBg from '../assets/终稿2.jpg';
import detailBg from '../assets/detail-bg.jpg';
import navbarBg from '../assets/navbar-bg.jpg';

// 方块颜色配置 — 编辑 src/config/gemSequence.ts 可自定义下落顺序
import { resetGemSequence } from '../config/gemSequence';

const RESOURCES = [oceanBg, detailBg, navbarBg];

const BOARD_SIZE = 6;

/* ===== 美术资源预留位 =====
 * 后续把美术切图放到 src/assets/gems/ 下，import 进来填入此数组即可自动替换占位渐变。
 * 数组索引 = 宝石类型 (0 ~ GEM_TYPES-1)，填 null 则继续用 CSS 渐变占位。
 *
 * 示例：
 *   import gemAsset0 from '../assets/gems/tile-cyan.png';
 *   import gemAsset1 from '../assets/gems/tile-indigo.png';
 *   const GEM_ASSETS = [gemAsset0, gemAsset1, null, null, null];
 */
const GEM_ASSETS: (string | null)[] = [null, null, null, null];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Gem = { id: number; type: number };
type Board = (Gem | null)[][];
type Pos = { r: number; c: number };
type Particle = { id: number; r: number; c: number; color: string; dx: number; dy: number; scale: number };

let gemIdCounter = 1;

/** 开局固定布局（0=红 1=黄 2=蓝 3=绿）— 6×6 四色纯色
 *  胜利目标：一步交换「(3,3) ↔ (4,3)」（第 4 列、第 4/5 行相邻两颗竖直互换），
 *  触发连锁消除 35/36 颗（不补新子），剩余 <= 8 颗即视为挑战成功（= 一步清掉 >=28 颗）。
 *  全扫描验证（与游戏内 findMatches + 重力算法完全一致，不补子）：
 *    初始 0 个 3 连；唯一胜利步 1 个（消 35 颗）；其余交换均清 <28 或为安全重试步。 */
const INITIAL_LAYOUT: number[][] = [
  [1, 2, 1, 2, 1, 2],
  [3, 1, 2, 0, 1, 2],
  [1, 2, 1, 1, 0, 0],
  [3, 2, 3, 0, 1, 2],
  [2, 3, 0, 3, 0, 0],
  [3, 1, 1, 2, 1, 2],
];

/** 胜利阈值：36 格中清掉 >=28 颗（剩余 <=8）即视为一步挑战成功（"超过27连消除"） */
const WIN_REMAINING = 8;

/** 唯一胜利步（0-indexed）：第4列、第4/5行两颗竖直互换 → 一步清 35 颗。
 *  提示框会高亮圈出这两个格子；若你想改成别的格子，改这里即可。 */
const WIN_MOVE = { from: { r: 3, c: 3 }, to: { r: 4, c: 3 } };

/** 棋子纯色（与 CSS .gem-{0..3} 对应），用于爆裂粒子配色 */
const GEM_COLORS = ['#ff4d4f', '#facc15', '#3b9cff', '#2bd96a'];

/** 真实音效资源（放在 public/sounds/ 下，Vite 构建会自动拷贝到 dist）
 *  - 连续消除：按连锁层级递进播放 sound.Eliminate1..6.mp3，层级超过文件数则复用最后一个
 *  - 移动棋子：每次交换开始播放 sound.switch.mp3
 *  路径用 import.meta.env.BASE_URL 拼接，兼容 GitHub Pages 子路径('./')部署 */
const SOUND_BASE = `${import.meta.env.BASE_URL}sounds/`;
const CLEAR_SOUND_FILES = [
  'sound.Eliminate1.mp3',
  'sound.Eliminate2.mp3',
  'sound.Eliminate3.mp3',
  'sound.Eliminate4.mp3',
  'sound.Eliminate5.mp3',
  'sound.Eliminate6.mp3',
];
const SWITCH_SOUND_FILE = 'sound.switch.mp3';

/** 把 #rrggbb 转成带透明度的 rgba，用于粒子渐变柔光晕（避免 transparent 渐变产生灰边） */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---- 音效：Web Audio 解码一次、即时播放 ----
// 用 AudioContext.decodeAudioData 把真实 mp3 预解码成 AudioBuffer，
// 播放时用 AudioBufferSourceNode 即时 start(0) —— 零解码延迟，
// 连锁多层叠加完美对齐节奏，通关那一刻弹窗渲染也不卡音效（音效跑在音频线程）。
const SOUND_FILES = [...CLEAR_SOUND_FILES, SWITCH_SOUND_FILE];

let _audioCtx: AudioContext | null = null;
let _audioUnlocked = false;
const _bufferCache = new Map<string, AudioBuffer>();

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_audioCtx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    _audioCtx = new AC();
  }
  return _audioCtx;
}

async function ensureBuffer(file: string): Promise<AudioBuffer | null> {
  const cached = _bufferCache.get(file);
  if (cached) return cached;
  const ctx = getCtx();
  if (!ctx) return null;
  try {
    const resp = await fetch(SOUND_BASE + file);
    const arr = await resp.arrayBuffer();
    const buf = await ctx.decodeAudioData(arr);
    _bufferCache.set(file, buf);
    return buf;
  } catch {
    return null;
  }
}

/** 静默预解码全部音效（组件挂载时调用，不阻塞交互） */
async function preloadAllBuffers() {
  const ctx = getCtx();
  if (!ctx) return;
  await Promise.all(SOUND_FILES.map((f) => ensureBuffer(f)));
}

// 浏览器自动播放策略：首个用户手势内 resume 音频上下文（覆盖 SPA 路由后首声不响）
async function unlockAudioOnce() {
  if (_audioUnlocked) return;
  _audioUnlocked = true;
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      /* ignore */
    }
  }
  // 顺手补解码（若挂载时还没好）
  preloadAllBuffers();
}

if (typeof window !== 'undefined') {
  const onFirst = () => void unlockAudioOnce();
  (['pointerdown', 'mousedown', 'touchstart', 'keydown'] as const).forEach((e) =>
    window.addEventListener(e, onFirst, { once: true, passive: true }),
  );
}

/** 即时播放（零延迟）。buffer 未就绪或 context 未 running 时降级用 HTMLAudioElement，保证首声不丢 */
function playBuffer(file: string) {
  const ctx = getCtx();
  const buf = _bufferCache.get(file);
  if (ctx && buf && ctx.state === 'running') {
    try {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      return;
    } catch {
      /* fallthrough to fallback */
    }
  }
  // 兜底： buffer 未解码好 / context 未 running，用 HTMLAudioElement 播放真实文件（首声不丢）
  try {
    const a = new Audio(SOUND_BASE + file);
    void a.play().catch(() => {});
  } catch {
    /* ignore */
  }
}

/** 连续消除音效：按连锁层级 1..N 递进播放对应文件，支持多声叠加 */
function playClearSound(level: number) {
  const idx = Math.min(Math.max(level, 1), CLEAR_SOUND_FILES.length) - 1;
  playBuffer(CLEAR_SOUND_FILES[idx]);
}

/** 移动棋子音效：每次交换开始播放 */
function playSwitchSound() {
  playBuffer(SWITCH_SOUND_FILE);
}

/** 生成棋盘 — 使用固定开局布局（保证一步可全清） */
function createInitialBoard(): Board {
  // 重置序列索引，保证消除后补充新子从序列开头开始
  resetGemSequence();

  const board: Board = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    board[r] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      board[r][c] = { id: gemIdCounter++, type: INITIAL_LAYOUT[r][c] };
    }
  }
  return board;
}

/** 查找所有 3+ 连线，返回 "r,c" 集合 */
function findMatches(board: Board): Set<string> {
  const matched = new Set<string>();
  // 横向
  for (let r = 0; r < BOARD_SIZE; r++) {
    let count = 1;
    for (let c = 1; c <= BOARD_SIZE; c++) {
      const prev = board[r][c - 1];
      const cur = c < BOARD_SIZE ? board[r][c] : null;
      if (cur && prev && cur.type === prev.type) {
        count++;
      } else {
        if (count >= 3) for (let k = c - count; k < c; k++) matched.add(`${r},${k}`);
        count = 1;
      }
    }
  }
  // 纵向
  for (let c = 0; c < BOARD_SIZE; c++) {
    let count = 1;
    for (let r = 1; r <= BOARD_SIZE; r++) {
      const prev = board[r - 1][c];
      const cur = r < BOARD_SIZE ? board[r][c] : null;
      if (cur && prev && cur.type === prev.type) {
        count++;
      } else {
        if (count >= 3) for (let k = r - count; k < r; k++) matched.add(`${k},${c}`);
        count = 1;
      }
    }
  }
  return matched;
}

/** 一次性重力：把每列存活棋子直接沉到最终位置（本项目为一步清盘模式，下落过程不补新子）。
 *  原地修改 board；配合 CSS 过渡 + 逐行错峰（见 .falling 态）呈现「一行行下落」而非整片瞬移。 */
function applyGravity(board: Board): void {
  for (let c = 0; c < BOARD_SIZE; c++) {
    const survivors: Gem[] = [];
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (board[r][c]) survivors.push(board[r][c]!);
    }
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      const idx = BOARD_SIZE - 1 - r;
      board[r][c] = idx < survivors.length ? survivors[idx] : null;
    }
  }
}

/** 下落节奏（以 60fps 的「帧」为单位，对齐你给的视频手感）：
 *  - FALL_STAGGER_MS：相邻行错峰间隔 = 2 帧
 *  - FALL_DURATION_MS：每颗棋子下落到位耗时 = 8 帧
 *  - FALL_TOTAL_MS：整段下落（含错峰）总时长，processChain 据此等待动画播完 */
const FRAME_MS = 1000 / 60;
const FALL_STAGGER_MS = 2 * FRAME_MS;
const FALL_DURATION_MS = 8 * FRAME_MS;
const FALL_TOTAL_MS = FALL_DURATION_MS + (BOARD_SIZE - 1) * FALL_STAGGER_MS;

interface GameLoadingProps {
  onComplete: () => void;
}

export default function GameLoading({ onComplete }: GameLoadingProps) {
  // 棋盘数据用 ref（async 流程中避免闭包旧值），配合 forceRender 触发渲染
  const boardRef = useRef<Board>(createInitialBoard());
  const removingRef = useRef<Set<number>>(new Set());
  const newGemIdsRef = useRef<Set<number>>(new Set()); // 本轮新补充的宝石（触发从顶部滑入动画）
  const isProcessingRef = useRef(false);
  const [, forceRender] = useState(0);
  const render = useCallback(() => forceRender((n) => n + 1), []);

  const [selected, setSelected] = useState<Pos | null>(null);
  const [dragTarget, setDragTarget] = useState<Pos | null>(null);
  const [score, setScore] = useState(0);
  const [floatScore, setFloatScore] = useState<{ id: number; value: number } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'won'>('playing');
  const [falling, setFalling] = useState(false); // 下落态：挂到 .game-board 上触发逐行错峰过渡
  const floatIdRef = useRef(0);

  // 提示框 / 爆裂粒子 / 轻提示 toast
  const [showHint, setShowHint] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const [toast, setToast] = useState<string | null>(null);

  // 每次进入游戏页，重置颜色序列
  useEffect(() => {
    resetGemSequence();
  }, []);

  // 挂载即静默预解码全部音效（Web Audio 解码一次，后续零延迟播放，连锁对齐节奏）
  useEffect(() => {
    preloadAllBuffers();
  }, []);

  // 后台预加载首页资源（静默预载，不展示进度）
  useEffect(() => {
    RESOURCES.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // 浮动得分自动消失
  useEffect(() => {
    if (floatScore) {
      const t = setTimeout(() => setFloatScore(null), 900);
      return () => clearTimeout(t);
    }
  }, [floatScore]);

  // 轻提示 toast 自动消失
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 1600);
      return () => clearTimeout(t);
    }
  }, [toast]);

  /** 在即将被清的格子位置生成爆裂粒子（颜色取该格棋子色） */
  const spawnParticles = useCallback((matches: Set<string>, board: Board) => {
    const next: Particle[] = [];
    matches.forEach((key) => {
      const [r, c] = key.split(',').map(Number);
      const g = board[r][c];
      const color = GEM_COLORS[g ? g.type : 0];
      const count = 7;
      for (let i = 0; i < count; i++) {
        const ang = (Math.PI * 2 * i) / count + Math.random() * 0.6;
        const dist = 22 + Math.random() * 38;
        const sc = 0.6 + Math.random() * 1.5; // 随机大小：0.6x~2.1x，模拟大火花+小星点
        next.push({
          id: ++particleIdRef.current,
          r,
          c,
          color,
          dx: Math.cos(ang) * dist,
          dy: Math.sin(ang) * dist,
          scale: sc,
        });
      }
    });
    if (next.length) setParticles((prev) => [...prev, ...next]);
  }, []);

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  /** 消除链：循环 消除→下落→再检查，直到无匹配。refill=false 时下落不补新子（用于一步清盘） */
  const processChain = useCallback(async () => {
    const board = boardRef.current;
    let chain = 0;
    while (true) {
      const matches = findMatches(board);
      if (matches.size === 0) break;
      chain++;

      // 音效（按连锁层级 1..7 递进）+ 爆裂粒子
      playClearSound(chain);
      spawnParticles(matches, board);

      // 标记移除 → 触发淡出动画
      matches.forEach((key) => {
        const [r, c] = key.split(',').map(Number);
        const g = board[r][c];
        if (g) removingRef.current.add(g.id);
      });
      render();
      await sleep(280);

      // 计分 + 浮动提示
      const gained = matches.size * 10 * chain;
      setScore((s) => s + gained);
      setFloatScore({ id: ++floatIdRef.current, value: gained });

      // 实际移除
      matches.forEach((key) => {
        const [r, c] = key.split(',').map(Number);
        board[r][c] = null;
      });
      removingRef.current.clear();

      // 下落：一次性算好最终位置，用 CSS 过渡 + 逐行错峰（2帧）实现「一行行下落」，每颗下落 8 帧
      newGemIdsRef.current = new Set();
      setFalling(true);
      applyGravity(board);
      render();
      await sleep(FALL_TOTAL_MS); // 等整段下落（含逐行错峰）播完
      setFalling(false);
    }
    // 连锁结束，清除新宝石标记
    newGemIdsRef.current = new Set();
  }, [render, spawnParticles]);

  /** 复原棋盘到固定开局 + 分数清零（失败后重来） */
  const resetGame = useCallback(() => {
    boardRef.current = createInitialBoard();
    removingRef.current = new Set();
    newGemIdsRef.current = new Set();
    setScore(0);
    setSelected(null);
    setDragTarget(null);
    setPhase('playing');
    setParticles([]);
    setToast(null);
    render();
  }, [render]);

  /** 棋盘剩余棋子是否 <= 胜利阈值（清掉 >=80% 即视为挑战成功） */
  const isClearedEnough = (b: Board): boolean => {
    let remaining = 0;
    for (const row of b) for (const g of row) if (g) remaining++;
    return remaining <= WIN_REMAINING;
  };

  const doSwap = useCallback(
    async (
      r1: number,
      c1: number,
      r2: number,
      c2: number,
      gemEl: HTMLElement | null,
      targetEl: HTMLElement | null,
    ) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      playSwitchSound(); // 移动棋子音效
      const board = boardRef.current;

      // 交换逻辑位置
      [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];

      // 关键修复：在同一同步任务内完成「逻辑归位 + 清除拖拽 transform」。
      // 先关掉 top/left 过渡（避免位置跳变触发动画），用 flushSync 同步提交新 --r/--c，
      // 此时棋子 top/left 已直接落到目标格；再清除拖拽位移 transform ——
      // 棋子直接「锁定」在目标位，不再出现「先弹回原点再滑过去」的回弹。
      if (gemEl) gemEl.style.transition = 'none';
      if (targetEl) targetEl.style.transition = 'none';
      flushSync(() => render());
      if (gemEl) {
        gemEl.style.transform = '';
        gemEl.style.zIndex = '';
        gemEl.classList.remove('dragging');
      }
      if (targetEl) {
        targetEl.style.transform = '';
        targetEl.style.zIndex = '';
        targetEl.classList.remove('drag-target');
      }
      if (gemEl) gemEl.style.transition = '';
      if (targetEl) targetEl.style.transition = '';

      await sleep(160);

      const matches = findMatches(board);
      if (matches.size === 0) {
        // 无匹配，换回（安全重试）
        [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
        render();
        await sleep(160);
        } else {
          // 有匹配：不补子跑连锁（落子不补新子）
          await processChain();
          // 胜利判定基于「棋盘实际剩余棋子数」：一步清掉 >=28 颗（剩余 <=8）即挑战成功，否则本局失败
          if (isClearedEnough(board)) {
            setPhase('won');
          } else {
            // 一步清掉不足 80%：先等最后一轮消除的动画与飞溅粒子彻底收尾（避免一消除完就弹窗），
            // 再弹出「挑战失败」，点「重新挑战」才复原棋盘
            await sleep(650);
            setShowFail(true);
          }
        }
      isProcessingRef.current = false;
    },
    [processChain, render],
  );

  // ===== 拖拽交互：按下放大 → 锁定单轴 → 最多滑一格 → 对面方块同步反向移动 → 松开判定 =====
  const dragStateRef = useRef<{
    from: Pos;
    startX: number;
    startY: number;
    axis: 'x' | 'y' | null;
    gemEl: HTMLElement | null;       // 被拖方块
    targetEl: HTMLElement | null;     // 对面相邻方块（超过半格时同步移动）
    cellSize: number;
    lastDx: number;
    lastDy: number;
    targetKey: string; // 当前对方块所在方向（'x+'/'x-'/...），用于检测方向翻转
  } | null>(null);

  /** 根据 from + 方向找相邻方块的 DOM 元素 */
  const findAdjacentEl = (from: Pos, dr: number, dc: number): HTMLElement | null => {
    const nr = from.r + dr;
    const nc = from.c + dc;
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) return null;
    const board = document.querySelector('.game-board');
    if (!board) return null;
    return board.querySelector(`[data-r="${nr}"][data-c="${nc}"]`) as HTMLElement | null;
  };

  /** 统一取指针坐标（兼容 Mouse / Touch 事件） */
  const getPoint = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    const me = e as MouseEvent;
    return { x: me.clientX, y: me.clientY };
  };

  /** 开始拖拽（鼠标 / 触摸共用）。dragStateRef 守卫避免 touch→mouse 模拟事件重复触发 */
  const beginDrag = (clientX: number, clientY: number, r: number, c: number) => {
    if (isProcessingRef.current || phase !== 'playing') return;
    if (dragStateRef.current) return; // 防 touch 抬起后浏览器模拟的 mousedown 重复
    if (!boardRef.current[r][c]) return;
    const gemEl = document.querySelector(
      `[data-r="${r}"][data-c="${c}"]`,
    ) as HTMLElement | null;
    if (!gemEl) return;
    const boardEl = gemEl.parentElement;
    const cellSize = boardEl ? boardEl.offsetWidth / BOARD_SIZE : 160;
    dragStateRef.current = {
      from: { r, c },
      startX: clientX,
      startY: clientY,
      axis: null,
      gemEl,
      targetEl: null,
      cellSize,
      lastDx: 0,
      lastDy: 0,
      targetKey: '',
    };
    gemEl.classList.add('dragging'); // 拖拽中：关掉选中放大，纯跟手
    setSelected({ r, c });
  };

  const handleCellMouseDown = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    beginDrag(e.clientX, e.clientY, r, c);
  };

  const handleCellTouchStart = (e: React.TouchEvent, r: number, c: number) => {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    beginDrag(t.clientX, t.clientY, r, c);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const ds = dragStateRef.current;
      if (!ds) return;
      // 触摸移动时阻止页面滚动/缩放，让手势归游戏控制
      if (e.type === 'touchmove') e.preventDefault();

      const { x: rawClientX, y: rawClientY } = getPoint(e);
      const rawDx = rawClientX - ds.startX;
      const rawDy = rawClientY - ds.startY;

      // 首次移动锁定轴（5px 死区）
      if (!ds.axis) {
        if (Math.abs(rawDx) < 5 && Math.abs(rawDy) < 5) return;
        ds.axis = Math.abs(rawDx) > Math.abs(rawDy) ? 'x' : 'y';
      }

      let dx = 0;
      let dy = 0;
      const { r, c } = ds.from;
      const max = ds.cellSize;

      if (ds.axis === 'x') {
        dx = rawDx;
        if (c === 0 && dx < 0) dx = 0;
        if (c === BOARD_SIZE - 1 && dx > 0) dx = 0;
        if (dx > max) dx = max;
        if (dx < -max) dx = -max;
      } else {
        dy = rawDy;
        if (r === 0 && dy < 0) dy = 0;
        if (r === BOARD_SIZE - 1 && dy > 0) dy = 0;
        if (dy > max) dy = max;
        if (dy < -max) dy = -max;
      }

      ds.lastDx = dx;
      ds.lastDy = dy;

      // 被拖方块：沿单轴滑动（放大由 .selected .gem-inner 控制，不占用外层 transform）
      if (ds.gemEl) {
        ds.gemEl.style.transition = 'none';
        ds.gemEl.style.transform = `translate(${dx}px, ${dy}px)`;
        ds.gemEl.style.zIndex = '20';
      }

      // 对方块：与被拖方块「镜像」同步移动 —— 整个拖拽过程都跟随，二者几乎同时位移
      const dir = ds.axis === 'x' ? Math.sign(dx) : Math.sign(dy);
      if (dir === 0) {
        // 无有效方向（贴边 / 回中）：复位对方块
        if (ds.targetEl) {
          ds.targetEl.classList.remove('drag-target');
          ds.targetEl.style.transition = '';
          ds.targetEl.style.transform = '';
          ds.targetEl.style.zIndex = '';
          ds.targetEl = null;
          ds.targetKey = '';
        }
      } else {
        const key = ds.axis + (dir > 0 ? '+' : '-');
        if (ds.targetKey !== key) {
          // 方向变化（或首次）：重置旧目标，重新定位相邻方块
          if (ds.targetEl) {
            ds.targetEl.classList.remove('drag-target');
            ds.targetEl.style.transition = '';
            ds.targetEl.style.transform = '';
            ds.targetEl.style.zIndex = '';
          }
          const dr = ds.axis === 'y' ? dir : 0;
          const dc = ds.axis === 'x' ? dir : 0;
          ds.targetEl = findAdjacentEl(ds.from, dr, dc);
          ds.targetKey = key;
        }
        if (ds.targetEl) {
          // 镜像：被拖方块走了 d，对方块走 -d，二者始终同步（拖到满格正好互换一格）
          const targetDx = ds.axis === 'x' ? -dx : 0;
          const targetDy = ds.axis === 'y' ? -dy : 0;
          ds.targetEl.classList.add('drag-target');
          ds.targetEl.style.transition = 'none';
          ds.targetEl.style.transform = `translate(${targetDx}px, ${targetDy}px)`;
          ds.targetEl.style.zIndex = '10';
        }
      }
    };

    const handleUp = () => {
      const ds = dragStateRef.current;
      if (!ds) return;

      const { from, axis, lastDx, lastDy, cellSize, gemEl, targetEl } = ds;
      dragStateRef.current = null;
      setSelected(null);
      setDragTarget(null);

      // 判定：位移超过半格 → 交换
      const threshold = cellSize * 0.5;
      let target: Pos | null = null;

      if (axis === 'x') {
        if (lastDx > threshold && from.c < BOARD_SIZE - 1) {
          target = { r: from.r, c: from.c + 1 };
        } else if (lastDx < -threshold && from.c > 0) {
          target = { r: from.r, c: from.c - 1 };
        }
      } else if (axis === 'y') {
        if (lastDy > threshold && from.r < BOARD_SIZE - 1) {
          target = { r: from.r + 1, c: from.c };
        } else if (lastDy < -threshold && from.r > 0) {
          target = { r: from.r - 1, c: from.c };
        }
      }

      if (target) {
        // 交给 doSwap：在同一同步任务内完成「逻辑归位 + 清除拖拽 transform」，避免回弹
        doSwap(from.r, from.c, target.r, target.c, gemEl, targetEl);
      } else {
        // 未达半格：恢复 CSS 过渡并清除拖拽偏移 → 平滑滑回原位
        if (gemEl) {
          gemEl.classList.remove('dragging');
          gemEl.style.transition = '';
          gemEl.style.transform = '';
          gemEl.style.zIndex = '';
        }
        if (targetEl) {
          targetEl.classList.remove('drag-target');
          targetEl.style.transition = '';
          targetEl.style.transform = '';
          targetEl.style.zIndex = '';
        }
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    // 移动端：触摸拖拽
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [doSwap]);

  const board = boardRef.current;

  return (
    <div className="game-loading-viewport">
      <div className="game-loading-bg">
        <Lightfall
          colors={['#22d3ee', '#818cf8', '#6366f1']}
          backgroundColor="#061521"
          speed={0.4}
          streakCount={3}
          streakWidth={0.8}
          streakLength={1.2}
          glow={0.7}
          density={0.5}
          twinkle={0.8}
          zoom={3.5}
          backgroundGlow={0.4}
          opacity={0.6}
          mouseInteraction={true}
          mouseStrength={0.3}
          mouseRadius={0.8}
          mouseDampening={0.2}
          mixBlendMode="screen"
        />
      </div>
      <div className="game-loading">
        <div className="game-loading-inner">
          <header className="game-header">
            <h1>一步极限连消</h1>
            <p>神之一手</p>
            <div className="game-hint-row">
              <p className="game-hint">一步之内 · 连消 28 颗</p>
              <button
                className="hint-trigger"
                onClick={() => setShowHint(true)}
                title="显示神之一手提示"
                disabled={showHint}
              >
                💡 提示
              </button>
            </div>
          </header>

          <div className="game-body">
            {/* 棋盘 */}
            <div className="board-wrap">
              <BorderGlow
                className="board-glow"
                edgeSensitivity={25}
                glowColor="190 85 65"
                backgroundColor="#0a1428"
                borderRadius={24}
                glowRadius={35}
                glowIntensity={0.8}
                coneSpread={20}
                animated
                colors={['#22d3ee', '#818cf8', '#6366f1']}
                fillOpacity={0.4}
              >
                <div
                  className={`game-board${falling ? ' falling' : ''}`}
                  role="grid"
                  aria-label="三消游戏棋盘"
                  style={{ ['--n' as string]: BOARD_SIZE }}
                >
                  {board.map((row, r) =>
                    row.map((gem, c) => {
                      if (!gem) return null;
                      const isSelected = selected?.r === r && selected?.c === c;
                      const isRemoving = removingRef.current.has(gem.id);
                      const isNew = newGemIdsRef.current.has(gem.id);
                      const isDragTarget =
                        !!dragTarget && dragTarget.r === r && dragTarget.c === c && !isSelected;
                      const isHint =
                        showHint &&
                        ((r === WIN_MOVE.from.r && c === WIN_MOVE.from.c) ||
                          (r === WIN_MOVE.to.r && c === WIN_MOVE.to.c));
                      const asset = GEM_ASSETS[gem.type];
                      return (
                        <button
                          key={gem.id}
                          data-cell
                          data-r={r}
                          data-c={c}
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                          className={`gem gem-${gem.type}${isSelected ? ' selected' : ''}${isRemoving ? ' removing' : ''}${isNew ? ' entering' : ''}${isDragTarget ? ' drag-target' : ''}${isHint ? ' hint-ring' : ''}${asset ? ' has-asset' : ''}`}
                          style={{
                            ['--r' as string]: r,
                            ['--c' as string]: c,
                            // 逐行错峰：底行先落(0)、顶行最后落，2帧递进 → 呈现「一行行下落」
                            ['--fd' as string]: `${(BOARD_SIZE - 1 - r) * FALL_STAGGER_MS}ms`,
                            ...(asset ? { backgroundImage: `url(${asset})` } : {}),
                          }}
                          onMouseDown={(e) => handleCellMouseDown(e, r, c)}
                          onTouchStart={(e) => handleCellTouchStart(e, r, c)}
                          aria-label={`方块 行${r + 1}列${c + 1}`}
                        >
                          {asset ? null : <span className="gem-inner" />}
                        </button>
                      );
                    }),
                  )}
                  {particles.map((p) => (
                    <span
                      key={p.id}
                      className="burst-particle"
                      onAnimationEnd={() => removeParticle(p.id)}
                      style={{
                        left: `calc(${(p.c + 0.5) * 100 / BOARD_SIZE}%)`,
                        top: `calc(${(p.r + 0.5) * 100 / BOARD_SIZE}%)`,
                        width: `${28 * p.scale}px`,
                        height: `${28 * p.scale}px`,
                        background: `radial-gradient(circle closest-side at 50% 50%, #ffffff 0%, #ffffff 5%, #ffffff 10%, ${p.color} 20%, ${hexToRgba(p.color, 0)} 30%)`,
                        boxShadow: 'none',
                        ['--dx' as string]: `${p.dx}px`,
                        ['--dy' as string]: `${p.dy}px`,
                      }}
                    />
                  ))}
                  {showHint && (
                    <div className="hint-overlay" role="alertdialog" aria-label="神之一手提示">
                      <div className="hint-modal">
                        <h2>神之一手在这里！</h2>
                        <div className="hint-actions">
                          <button
                            className="hint-btn"
                            autoFocus
                            onClick={() => {
                              setShowHint(false);
                              resetGame();
                            }}
                          >
                            重新挑战
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </BorderGlow>
              {floatScore && (
                <div key={floatScore.id} className="float-score">
                  +{floatScore.value}
                </div>
              )}
              {toast && (
                <div className="game-toast" role="status">
                  {toast}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 成功弹窗：一步清掉 >=80% 棋子后弹出，进入按钮在此 */}
      {phase === 'won' && (
        <div
          className="win-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-label="挑战成功"
        >
          <div className="win-modal">
            <div className="win-icon">✓</div>
            <h2>挑战成功</h2>
            <p>
              一步消除，已清空 {BOARD_SIZE * BOARD_SIZE - board.flat().filter((g) => g !== null).length}/
              {BOARD_SIZE * BOARD_SIZE} 颗棋子！
            </p>
            <p className="win-score">最终得分 {score}</p>
            <button className="win-btn" autoFocus onClick={onComplete}>
              进入个人简历 →
            </button>
          </div>
        </div>
      )}

      {/* 失败弹窗：一步消除后剩余仍 >=20%（清掉不足 80%）则弹出，点「重新挑战」复原棋盘 */}
      {showFail && (
        <div
          className="fail-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-label="挑战失败"
        >
          <div className="fail-modal">
            <div className="fail-icon">✕</div>
            <h2>挑战失败</h2>
            <p>这一步没能清空棋盘，再试一次吧</p>
            <button
              className="fail-btn"
              autoFocus
              onClick={() => {
                setShowFail(false);
                resetGame();
              }}
            >
              重新挑战
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
