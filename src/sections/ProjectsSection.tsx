import { useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { projects } from '../data/resumeData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Upload, Trash2 } from 'lucide-react';

type Project = (typeof projects)[0];

/** 本地视频上传 + 预览组件 */
function LocalVideoPlayer() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('请选择视频文件');
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoSrc((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
    setVideoName(file.name);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = () => {
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    setVideoSrc(null);
    setVideoName('');
  };

  return (
    <div className="mb-6">
      {videoSrc ? (
        /* 视频预览区 */
        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
          <video
            src={videoSrc}
            controls
            className="w-full max-h-[480px] object-contain bg-black"
            poster=""
            preload="metadata"
          />
          {/* 底部信息栏 */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700">
            <span className="text-slate-300 text-sm truncate flex-1 pr-2">📹 {videoName}</span>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-700 h-8"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                更换
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8"
                onClick={handleRemove}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                删除
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* 上传区域 */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            dragging
              ? 'border-purple-400 bg-purple-500/10 scale-[1.02]'
              : 'border-slate-600 hover:border-purple-500/50 hover:bg-slate-800/50'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              dragging ? 'bg-purple-500/30 scale-110' : 'bg-slate-700'
            }`}>
              {dragging ? (
                <Upload className="w-7 h-7 text-purple-400 animate-bounce" />
              ) : (
                <Plus className="w-7 h-7 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-slate-300 font-medium">拖拽视频到此处，或点击上传</p>
              <p className="text-slate-500 text-xs mt-1">支持 MP4 / MOV / WebM 等常见格式</p>
            </div>
          </div>
        </div>
      )}

      {/* 隐藏的 file input */}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function ProjectDetailModal({
  project,
  open,
  onClose,
}: {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!project) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{project.title}</DialogTitle>
        </DialogHeader>

        {/* 本地视频上传 + 预览 */}
        <LocalVideoPlayer />

        {/* 封面图（无视频时展示） */}
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full rounded-xl object-cover max-h-64 mb-4"
          />
        )}

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <Badge key={tag} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Markdown 内容 */}
        {project.markdownContent && (
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-cyan-300 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
            prose-blockquote:border-l-purple-500 prose-blockquote:text-slate-400
            prose-strong:text-white
            prose-table:text-slate-300
            prose-th:text-white prose-th:bg-slate-800
            prose-td:border-slate-700
            prose-li:text-slate-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.markdownContent}
            </ReactMarkdown>
          </div>
        )}

        {/* 外链 */}
        {project.link && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <Button
              className="bg-purple-600 hover:bg-purple-500"
              onClick={() => window.open(project.link, '_blank')}
            >
              🔗 查看项目
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          作品展示
        </h2>
        <p className="text-slate-400 text-center mb-16">点击卡片查看详情，支持上传本地视频预览</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
              onClick={() => setSelectedProject(project)}
            >
              {/* 封面 */}
              <div className="relative aspect-video bg-slate-800 overflow-hidden">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {/* 悬浮上传提示 */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-purple-600/90 rounded-full flex items-center justify-center shadow-2xl">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">点击上传视频</span>
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag}
                      className="text-xs bg-slate-800 text-slate-300 border-slate-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 详情弹窗 */}
      <ProjectDetailModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
