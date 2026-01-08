
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Terminal, 
  FileCode, 
  Server, 
  Activity, 
  ChevronRight, 
  Copy, 
  Check, 
  Cpu, 
  Database,
  Globe,
  Lock,
  Box,
  CornerDownRight,
  ExternalLink
} from 'lucide-react';
import { QWEN_FILES } from './constants';
import { FileNode } from './types';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('app/main.py');
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'files' | 'api' | 'deploy'>('files');

  const fileTree: FileNode = useMemo(() => ({
    name: 'qwen-inference-server',
    type: 'directory',
    path: '',
    children: [
      {
        name: 'app',
        type: 'directory',
        path: 'app',
        children: [
          { name: 'main.py', type: 'file', path: 'app/main.py', content: QWEN_FILES.main_py },
          { name: 'model.py', type: 'file', path: 'app/model.py', content: QWEN_FILES.model_py },
          { name: 'schemas.py', type: 'file', path: 'app/schemas.py', content: QWEN_FILES.schemas_py },
        ]
      },
      { name: 'requirements.txt', type: 'file', path: 'requirements.txt', content: QWEN_FILES.requirements_txt },
      { name: 'Dockerfile', type: 'file', path: 'Dockerfile', content: QWEN_FILES.dockerfile },
      { name: '.dockerignore', type: 'file', path: '.dockerignore', content: QWEN_FILES.dockerignore },
      { name: 'README.md', type: 'file', path: 'README.md', content: QWEN_FILES.readme_md },
    ]
  }), []);

  const findFileContent = (tree: FileNode, path: string): string => {
    if (tree.path === path && tree.content) return tree.content;
    if (tree.children) {
      for (const child of tree.children) {
        const found = findFileContent(child, path);
        if (found) return found;
      }
    }
    return '';
  };

  const currentContent = useMemo(() => findFileContent(fileTree, selectedFile), [selectedFile, fileTree]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#d1d1d1] font-mono antialiased overflow-hidden">
      {/* Top Status Bar */}
      <div className="h-10 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between px-4 text-[11px] uppercase tracking-widest font-bold">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System: Operational
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <Activity size={12} />
            Inference: Ready
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#555]">
          <span>Qwen-1.5-1.8B-Chat</span>
          <span>CUDA 12.1.1</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-[#222] bg-[#0a0a0a] flex flex-col">
          <div className="p-4 border-b border-[#222]">
            <div className="text-[10px] text-[#555] mb-2 font-bold uppercase tracking-tighter">Navigation</div>
            <nav className="space-y-1">
              {[
                { id: 'files', icon: FileCode, label: 'Source Explorer' },
                { id: 'api', icon: Globe, label: 'API Reference' },
                { id: 'deploy', icon: Box, label: 'Infrastructure' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors ${activeView === item.id ? 'bg-[#1a1a1a] text-white' : 'text-[#666] hover:text-[#999]'}`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-[10px] text-[#555] px-2 mb-2 font-bold uppercase tracking-tighter">Workspace</div>
            <FileTree node={fileTree} selectedPath={selectedFile} onSelect={setSelectedFile} />
          </div>

          <div className="p-4 bg-[#0d0d0d] border-t border-[#222] space-y-3">
            <div className="flex justify-between items-center text-[10px] text-[#444]">
              <span>VRAM USAGE</span>
              <span>3.8GB / 8.0GB</span>
            </div>
            <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[48%]" />
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
          {activeView === 'files' && (
            <>
              <div className="h-10 border-b border-[#222] flex items-center justify-between px-4 bg-[#0a0a0a]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#888]">
                  <Terminal size={14} className="text-emerald-500" />
                  root@{selectedFile}
                </div>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase rounded border border-[#333] hover:bg-[#111] transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy Content'}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-8 selection:bg-blue-500/30">
                <pre className="text-sm leading-relaxed text-[#bbb]">
                  {currentContent}
                </pre>
              </div>
            </>
          )}

          {activeView === 'api' && (
            <div className="flex-1 overflow-y-auto p-12 max-w-4xl mx-auto w-full space-y-12">
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Globe className="text-blue-500" size={24} />
                  Endpoint Specification
                </h2>
                <div className="space-y-6">
                  <EndpointCard 
                    method="POST" 
                    path="/generate" 
                    description="Trigger LLM inference with prompt and generation parameters."
                    body={{
                      prompt: "string",
                      max_new_tokens: "int (default: 256)"
                    }}
                    response={{
                      text: "string"
                    }}
                  />
                  <EndpointCard 
                    method="GET" 
                    path="/health" 
                    description="System health check. Returns status: ok if model is loaded and GPU is accessible."
                    response={{
                      status: "ok"
                    }}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Terminal className="text-emerald-500" size={24} />
                  Test Execution (cURL)
                </h2>
                <div className="p-6 bg-[#0a0a0a] border border-[#222] rounded-lg">
                  <pre className="text-xs text-blue-400 leading-6">
                    {`curl -X POST "http://localhost:8000/generate" \\
     -H "Content-Type: application/json" \\
     -d '{"prompt": "What is the capital of France?", "max_new_tokens": 128}'`}
                  </pre>
                </div>
              </section>
            </div>
          )}

          {activeView === 'deploy' && (
            <div className="flex-1 overflow-y-auto p-12 max-w-4xl mx-auto w-full space-y-12">
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Box className="text-orange-500" size={24} />
                  Infrastructure Layout
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Cpu, label: "GPU Runtime", desc: "NVIDIA CUDA 12.1.1-CUDNN8" },
                    { icon: Database, label: "Memory Strategy", desc: "torch.float16 (Auto Device Map)" },
                    { icon: Lock, label: "Isolation", desc: "Dockerized Ubuntu 22.04 Container" },
                    { icon: Server, label: "Web Layer", desc: "FastAPI + Uvicorn (ASGI)" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 border border-[#222] bg-[#0a0a0a] rounded flex items-start gap-4">
                      <div className="p-2 rounded bg-[#111] border border-[#222]">
                        <item.icon size={18} className="text-[#666]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{item.label}</div>
                        <div className="text-xs text-[#555]">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <CornerDownRight className="text-purple-500" size={24} />
                  Standard Operating Procedures
                </h2>
                <div className="space-y-4">
                  <Step title="Build Container" cmd="docker build -t qwen-inference-server ." />
                  <Step title="Initialize Inference" cmd="docker run --gpus all -p 8000:8000 qwen-inference-server" />
                  <Step title="Verify Deployment" cmd="curl http://localhost:8000/health" />
                </div>
              </section>

              <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded flex items-center justify-between">
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">
                  Deployment Optimized for: Render GPU Clusters
                </div>
                <ExternalLink size={14} className="text-blue-400" />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer / Info */}
      <footer className="h-10 border-t border-[#222] bg-[#0a0a0a] flex items-center justify-between px-6 text-[10px] font-bold text-[#444] uppercase tracking-tighter">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Model: Qwen-1.8B</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Engine: PyTorch</span>
        </div>
        <div className="text-emerald-500/50">
          Inference Node 01 // [Latency: 42ms]
        </div>
      </footer>
    </div>
  );
};

const FileTree: React.FC<{ node: FileNode; selectedPath: string; onSelect: (path: string) => void; depth?: number }> = ({ node, selectedPath, onSelect, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedPath === node.path;

  if (node.type === 'directory') {
    return (
      <div className="w-full">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#111] text-[#777] transition-colors text-xs font-bold uppercase tracking-tighter"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <ChevronRight size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          {node.name}/
        </button>
        {isOpen && node.children && (
          <div className="mt-0.5">
            {node.children.map((child, idx) => (
              <FileTree key={idx} node={child} selectedPath={selectedPath} onSelect={onSelect} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button 
      onClick={() => onSelect(node.path)}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-xs ${isSelected ? 'text-blue-400 bg-blue-400/5' : 'text-[#555] hover:text-[#888]'}`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      {node.name}
    </button>
  );
};

const EndpointCard: React.FC<{ method: string; path: string; description: string; body?: any; response?: any }> = ({ method, path, description, body, response }) => (
  <div className="border border-[#222] bg-[#0a0a0a] rounded-lg overflow-hidden">
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[#222]">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${method === 'POST' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
        {method}
      </span>
      <span className="text-sm font-bold text-white">{path}</span>
    </div>
    <div className="p-4 space-y-4">
      <p className="text-xs text-[#666]">{description}</p>
      {body && (
        <div>
          <div className="text-[10px] font-bold text-[#444] mb-2 uppercase">Request Body</div>
          <pre className="p-3 bg-black rounded text-[11px] text-[#888]">{JSON.stringify(body, null, 2)}</pre>
        </div>
      )}
      {response && (
        <div>
          <div className="text-[10px] font-bold text-[#444] mb-2 uppercase">Success Response (200 OK)</div>
          <pre className="p-3 bg-black rounded text-[11px] text-[#888]">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  </div>
);

const Step: React.FC<{ title: string; cmd: string }> = ({ title, cmd }) => (
  <div className="p-4 border border-[#222] rounded bg-[#0a0a0a] group">
    <div className="text-[10px] font-bold text-[#444] mb-2 uppercase tracking-tight">{title}</div>
    <div className="flex items-center justify-between">
      <code className="text-xs text-emerald-500">$ {cmd}</code>
      <button onClick={() => navigator.clipboard.writeText(cmd)} className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Copy size={12} className="text-[#555]" />
      </button>
    </div>
  </div>
);

export default App;
