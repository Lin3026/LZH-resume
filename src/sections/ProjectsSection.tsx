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
        <div className="relative rounded-xl overflow-hidden bg-blue-50 border border-blue-200">
          <video
            src={videoSrc}
            controls
            className="w-full max-h-[480px] object-contain bg-black"
            poster=""
            preload="metadata"
          />
          {/* 底部信息栏 */}
          <div className="flex items-center justify-between px-4 py-2 bg-blue-50/80 backdrop-blur-sm border-t border-blue-200">
            <span className="text-blue-800 text-sm truncate flex-1 pr-2">📹 {videoName}</span>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-900 hover:bg-blue-100 h-8"
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
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02]'
              : 'border-blue-300 hover:border-cyan-500 hover:bg-blue-50'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              dragging ? 'bg-cyan-500/30 scale-110' : 'bg-blue-100'
            }`}>
              {dragging ? (
                <Upload className="w-7 h-7 text-cyan-400 animate-bounce" />
              ) : (
                <Plus className="w-7 h-7 text-blue-400" />
              )}
            </div>
            <div>
                <p className="text-blue-700 font-medium">拖拽视频到此处，或点击上传</p>
                <p className="text-blue-400 text-xs mt-1">支持 MP4 / MOV / WebM 等常见格式</p>
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-blue-200 text-blue-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">{project.title}</DialogTitle>
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
            <Badge key={tag} className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Markdown 内容 */}
        {project.markdownContent && (
          <div className="prose prose-sm max-w-none
            prose-headings:text-blue-900 prose-headings:font-bold
            prose-p:text-blue-800 prose-p:leading-relaxed
            prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
            prose-code:text-cyan-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-blue-50 prose-pre:border prose-pre:border-blue-200
            prose-blockquote:border-l-cyan-500 prose-blockquote:text-blue-600
            prose-strong:text-blue-900
            prose-table:text-blue-800
            prose-th:text-blue-900 prose-th:bg-blue-50
            prose-td:border-blue-200
            prose-li:text-blue-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.markdownContent}
            </ReactMarkdown>
          </div>
        )}

        {/* 外链 */}
        {project.link && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <Button
              className="bg-cyan-600 hover:bg-cyan-500"
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
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 tracking-tight">
          作品展示
        </h2>
        <p className="text-cyan-400 font-semibold text-lg text-center mb-16 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">点击卡片查看详情，支持上传本地视频预览</p>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white/85 border border-blue-200 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20 shadow-lg ocean-card"
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
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-cyan-600/90 rounded-full flex items-center justify-center shadow-2xl">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">点击上传视频</span>
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <div className="p-5">
                <h3 className="text-blue-900 font-bold text-lg mb-2 group-hover:text-cyan-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge
                      key={tag}
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
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
