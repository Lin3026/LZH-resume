import { useState, useEffect, useRef, useCallback } from 'react';
import './GameLoading.css';

// 首页关键图片资源 — import 拿到构建后 URL，用于后台预加载
import oceanBg from '../assets/终稿1.jpg';
import detailBg from '../assets/detail-bg.jpg';
import navbarBg from '../assets/navbar-bg.jpg';

// 方块颜色配置 — 编辑 src/config/gemSequence.ts 可自定义下落顺序
import { nextGemType, resetGemSequence, GEM_VALUES, GEM_NAMES } from '../config/gemSequence';

const RESOURCES = [oceanBg, detailBg, navbarBg];

const BOARD_SIZE = 4;
const GEM_TYPES = 3; // 红黄绿三色
const TARGET_SCORE = 100;

/* ===== 美术资源预留位 =====
 * 后续把美术切图放到 src/assets/gems/ 下，import 进来填入此数组即可自动替换占位渐变。
 * 数组索引 = 宝石类型 (0 ~ GEM_TYPES-1)，填 null 则继续用 CSS 渐变占位。
 *
 * 示例：
 *   import gemAsset0 from '../assets/gems/tile-cyan.png';
 *   import gemAsset1 from '../assets/gems/tile-indigo.png';
 *   const GEM_ASSETS = [gemAsset0, gemAsset1, null, null];
 */
const GEM_ASSETS: (string | null)[] = [null, null, null];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Gem = { id: number; type: number };
type Board = (Gem | null)[][];
type Pos = { r: number; c: number };

let gemIdCounter = 1;
// 不再需要 gemTypeSeq，使用配置文件中的 nextGemType()

const newGem = (): Gem => {
  // 从配置序列中读取下一个颜色类型
  const type = nextGemType();
  return { id: gemIdCounter++, type };
};

/** 生成棋盘 — 使用配置序列中的颜色 */
function createInitialBoard(): Board {
  // 重置序列索引，保证每次新游戏从序列开头开始
  resetGemSequence();
  
  const board: Board = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    board[r] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      let type: number;
      let tries = 0;
      do {
        // 从配置序列中读取下一个颜色
        type = nextGemType();
        tries++;
      } while (
        tries < 20 &&
        ((c >= 2 && board[r][c - 1]?.type === type && board[r][c - 2]?.type === type) ||
          (r >= 2 && board[r - 1][c]?.type === type && board[r - 2][c]?.type === type))
      );
      board[r][c] = { id: gemIdCounter++, type };
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

/** 重力下落 + 顶部补充新宝石（原地修改 board），返回新创建宝石的 id 集合 */
function applyGravityAndRefill(board: Board): Set<number> {
  const newIds = new Set<number>();
  for (let c = 0; c < BOARD_SIZE; c++) {
    // 从底往上收集存活宝石（保持原对象引用 → 颜色不变，仅位置改变触发下落动画）
    const survivors: Gem[] = [];
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (board[r][c]) survivors.push(board[r][c]!);
    }
    // 从底往上回填：存活宝石下沉，顶部空位补新宝石
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      const idx = BOARD_SIZE - 1 - r;
      if (idx < survivors.length) {
        board[r][c] = survivors[idx]; // 存活宝石：原色下落
      } else {
        const g = newGem(); // 固定序列循环取色（非随机）
        newIds.add(g.id);
        board[r][c] = g;
      }
    }
  }
  return newIds;
}

const isAdjacent = (a: Pos, b: Pos) =>
  (Math.abs(a.r - b.r) === 1 && a.c === b.c) || (Math.abs(a.c - b.c) === 1 && a.r === b.r);

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
  const [loadProgress, setLoadProgress] = useState(0);
  const [floatScore, setFloatScore] = useState<{ id: number; value: number } | null>(null);
  const floatIdRef = useRef(0);
  
  // 1920×1080 画布按视口等比缩放，居中显示
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // 每次进入游戏页，重置颜色序列
  useEffect(() => { 
    resetGemSequence(); 
  }, []);
  
  // 后台预加载首页资源
  useEffect(() => {
    let loaded = 0;
    RESOURCES.forEach((url) => {
      const img = new Image();
      const done = () => {
        loaded++;
        setLoadProgress(loaded / RESOURCES.length);
      };
      img.onload = done;
      img.onerror = done;
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

  /** 消除链：循环 消除→下落→再检查，直到无匹配 */
  const processChain = useCallback(async () => {
    const board = boardRef.current;
    let chain = 0;
    while (true) {
      const matches = findMatches(board);
      if (matches.size === 0) break;
      chain++;

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

      // 下落 + 补充：存活宝石保持原色下落，新宝石标记后从顶部滑入
      const newIds = applyGravityAndRefill(board);
      newGemIdsRef.current = newIds;
      render();
      await sleep(400); // 等下落 + 新宝石滑入动画完成
    }
    // 连锁结束，清除新宝石标记
    newGemIdsRef.current = new Set();
  }, [render]);

  const doSwap = useCallback(
    async (r1: number, c1: number, r2: number, c2: number) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      const board = boardRef.current;

      // 交换
      [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
      render();
      await sleep(160);

      const matches = findMatches(board);
      if (matches.size === 0) {
        // 无匹配，换回
        [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
        render();
        await sleep(160);
      } else {
        await processChain();
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

  const handleCellMouseDown = (e: React.MouseEvent, r: number, c: number) => {
    if (isProcessingRef.current) return;
    if (!boardRef.current[r][c]) return;
    e.preventDefault();
    const gemEl = e.currentTarget as HTMLElement;
    const boardEl = gemEl.parentElement;
    const cellSize = boardEl ? boardEl.offsetWidth / BOARD_SIZE : 160;
    dragStateRef.current = {
      from: { r, c },
      startX: e.clientX,
      startY: e.clientY,
      axis: null,
      gemEl,
      targetEl: null,
      cellSize,
      lastDx: 0,
      lastDy: 0,
    };
    setSelected({ r, c });
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const ds = dragStateRef.current;
      if (!ds) return;

      const rawDx = (e.clientX - ds.startX) / scale;
      const rawDy = (e.clientY - ds.startY) / scale;

      // 首次移动锁定轴（5px 死区）
      if (!ds.axis) {
        if (Math.abs(rawDx) < 5 && Math.abs(rawDy) < 5) return;
        ds.axis = Math.abs(rawDx) > Math.abs(rawDy) ? 'x' : 'y';
      }

      let dx = 0;
      let dy = 0;
      const { r, c } = ds.from;
      const max = ds.cellSize;
      const half = max * 0.5; // 半格阈值

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

      // 被拖方块：沿单轴滑动（放大由 CSS .selected 控制，不在 transform 里重复）
      if (ds.gemEl) {
        ds.gemEl.style.transition = 'none';
        ds.gemEl.style.transform = `translate(${dx}px, ${dy}px)`;
        ds.gemEl.style.zIndex = '20';
      }

      // 超过半格时：对面方块开始反向移动（交换动画）
      const absD = ds.axis === 'x' ? Math.abs(dx) : Math.abs(dy);
      const dir = ds.axis === 'x' ? Math.sign(dx) : Math.sign(dy);

      if (absD > half && dir !== 0) {
        // 找到目标方块
        if (!ds.targetEl) {
          const dr = ds.axis === 'y' ? dir : 0;
          const dc = ds.axis === 'x' ? dir : 0;
          ds.targetEl = findAdjacentEl(ds.from, dr, dc);
        }
        // 对面方块反向移动：被拖方块走了 d，对面方块走 -d（最多走满一格 = cellSize）
        if (ds.targetEl) {
          const reverseD = absD - max; // 从 0 → -max（即从原位移动到被拖方块的位置）
          let targetDx = 0;
          let targetDy = 0;
          if (ds.axis === 'x') {
            targetDx = -dir * (max - absD); // 反向，距离 = max - absD
          } else {
            targetDy = -dir * (max - absD);
          }
          ds.targetEl.style.transition = 'none';
          ds.targetEl.style.transform = `translate(${targetDx}px, ${targetDy}px)`;
        }
      } else {
        // 没超过半格：复位对面方块
        if (ds.targetEl) {
          ds.targetEl.style.transition = 'none';
          ds.targetEl.style.transform = '';
          ds.targetEl = null;
        }
      }
    };

    const handleUp = () => {
      const ds = dragStateRef.current;
      if (!ds) return;

      // 清除两个方块的 inline 样式
      if (ds.gemEl) {
        ds.gemEl.style.transition = '';
        ds.gemEl.style.transform = '';
        ds.gemEl.style.zIndex = '';
      }
      if (ds.targetEl) {
        ds.targetEl.style.transition = '';
        ds.targetEl.style.transform = '';
      }

      const { from, axis, lastDx, lastDy, cellSize } = ds;
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
        doSwap(from.r, from.c, target.r, target.c);
      }
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [doSwap, scale]);

  const board = boardRef.current;
  const scoreReady = score >= TARGET_SCORE;
  const resReady = loadProgress >= 1;
  const canEnter = scoreReady && resReady;
  const scorePct = Math.min(100, (score / TARGET_SCORE) * 100);

  return (
    <div className="game-loading-viewport">
      <div
        className="game-loading"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 1920, height: 1080 }}
      >
        <div className="game-loading-inner">
          <header className="game-header">
            <h1>欢迎来到我的空间</h1>
            <p>玩个三消小游戏，资源正在后台加载 — 达成 {TARGET_SCORE} 分即可进入</p>
          </header>

          <div className="game-body">
            {/* 棋盘 */}
            <div className="board-wrap">
              <div
                className="game-board"
                role="grid"
                aria-label="三消游戏棋盘"
              >
                {board.map((row, r) =>
                  row.map((gem, c) => {
                    if (!gem) return null;
                    const isSelected = selected?.r === r && selected?.c === c;
                    const isRemoving = removingRef.current.has(gem.id);
                    const isNew = newGemIdsRef.current.has(gem.id);
                    const isDragTarget =
                      !!dragTarget && dragTarget.r === r && dragTarget.c === c && !isSelected;
                    const asset = GEM_ASSETS[gem.type];
                    return (
                      <button
                        key={gem.id}
                        data-cell
                        data-r={r}
                        data-c={c}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className={`gem gem-${gem.type}${isSelected ? ' selected' : ''}${isRemoving ? ' removing' : ''}${isNew ? ' entering' : ''}${isDragTarget ? ' drag-target' : ''}${asset ? ' has-asset' : ''}`}
                        style={{
                          ['--r' as string]: r,
                          ['--c' as string]: c,
                          ...(asset ? { backgroundImage: `url(${asset})` } : {}),
                        }}
                        onMouseDown={(e) => handleCellMouseDown(e, r, c)}
                        aria-label={`方块 行${r + 1}列${c + 1}`}
                      >
                        {asset ? null : <span className="gem-inner" />}
                      </button>
                    );
                  }),
                )}
              </div>
              {floatScore && (
                <div key={floatScore.id} className="float-score">
                  +{floatScore.value}
                </div>
              )}
            </div>

            {/* 信息面板 */}
            <aside className="game-side">
              <div className="stat-card">
                <div className="stat-label">当前得分</div>
                <div className="stat-value">{score}</div>
                <div className="progress-track">
                  <div className="progress-fill score" style={{ width: `${scorePct}%` }} />
                </div>
                <div className="stat-hint">
                  {scoreReady ? '✓ 目标达成' : `还需 ${TARGET_SCORE - score} 分`}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">资源加载</div>
                <div className="stat-value">{Math.round(loadProgress * 100)}%</div>
                <div className="progress-track">
                  <div className="progress-fill load" style={{ width: `${loadProgress * 100}%` }} />
                </div>
                <div className="stat-hint">
                  {resReady ? '✓ 资源就绪' : '加载中…'}
                </div>
              </div>

              <div className="game-tips">
                <h3>玩法</h3>
                <ul>
                  <li>按住一个方块拖到相邻方块，松开互换位置</li>
                  <li>三个及以上同色连线即可消除</li>
                  <li>消除后上方方块下落，顶部补齐新方块</li>
                  <li>连锁消除得分翻倍</li>
                </ul>
                <div className="gem-values">
                  <h4>颜色数值</h4>
                  <div className="value-item">
                    <span className="value-dot red"></span>
                    <span>红色 = {GEM_VALUES[0]} 分</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot yellow"></span>
                    <span>黄色 = {GEM_VALUES[1]} 分</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot green"></span>
                    <span>绿色 = {GEM_VALUES[2]} 分</span>
                  </div>
                </div>
              </div>

              <button
                className={`enter-btn${canEnter ? ' ready' : ''}`}
                disabled={!canEnter}
                onClick={onComplete}
              >
                {canEnter
                  ? '进入个人空间 →'
                  : scoreReady
                    ? '资源加载中…'
                    : resReady
                      ? '继续消除达成目标'
                      : '努力消除中…'}
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
