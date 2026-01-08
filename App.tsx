
import React, { useState, useMemo } from 'react';
import { 
  Server, 
  Code2, 
  Rocket, 
  Cpu, 
  ChevronRight, 
  Folder, 
  FileJson, 
  Terminal, 
  Zap, 
  Activity,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';
import { QWEN_FILES } from './constants';
import { FileNode, TabType } from './types';
import Assistant from './components/Assistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.ARCHITECTURE);
  const [selectedFile, setSelectedFile] = useState<string>('app/main.py');
  const [copied, setCopied] = useState(false);

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
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Server size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Qwen Inference Server</h1>
            <p className="text-xs text-slate-400 font-medium">FASTAPI • TRANSFORMERS • CUDA 12.1</p>
          </div>
        </div>
        
        <nav className="flex gap-2">
          <button 
            onClick={() => setActiveTab(TabType.ARCHITECTURE)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === TabType.ARCHITECTURE ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <Code2 size={18} />
            Architecture
          </button>
          <button 
            onClick={() => setActiveTab(TabType.DEPLOYMENT)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === TabType.DEPLOYMENT ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <Rocket size={18} />
            Deployment
          </button>
          <button 
            onClick={() => setActiveTab(TabType.ASSISTANT)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === TabType.ASSISTANT ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <MessageSquare size={18} />
            AI Assistant
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <Activity size={12} />
            GPU Ready
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === TabType.ARCHITECTURE && (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar File Tree */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900/30 overflow-y-auto">
              <div className="p-4 uppercase text-[10px] font-bold text-slate-500 tracking-widest">Repository</div>
              <div className="px-2">
                <FileTree node={fileTree} selectedPath={selectedFile} onSelect={setSelectedFile} />
              </div>
            </aside>

            {/* Code Viewer */}
            <section className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
              <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/40">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <FileJson size={14} />
                  {selectedFile}
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 code-font text-sm leading-relaxed">
                <pre className="text-blue-300">
                  {currentContent}
                </pre>
              </div>
            </section>
          </div>
        )}

        {activeTab === TabType.DEPLOYMENT && (
          <div className="flex-1 overflow-y-auto p-12 bg-slate-950">
            <div className="max-w-4xl mx-auto space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Rocket size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Deploy to Production</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Zap size={18} className="text-yellow-400" />
                      Render GPU
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">Optimized for Render's GPU instances using the provided Dockerfile.</p>
                    <ul className="text-xs space-y-2 text-slate-500">
                      <li>• Docker environment: Ubuntu 22.04</li>
                      <li>• Runtime: Python 3.10+</li>
                      <li>• Base Image: NVIDIA CUDA 12.1</li>
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Cpu size={18} className="text-blue-400" />
                      Self Hosted
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">Run locally with NVIDIA Container Toolkit for maximum performance.</p>
                    <div className="p-3 bg-black rounded-lg code-font text-[10px] text-emerald-400 border border-emerald-900/30">
                      docker run --gpus all -p 8000:8000 qwen-server
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-xl font-semibold">Deployment Checklist</h3>
                <div className="space-y-4">
                  {[
                    { title: "GPU Availability", desc: "Ensure NVIDIA drivers and CUDA toolkit are installed on host." },
                    { title: "VRAM Capacity", desc: "Qwen 1.5-1.8B requires approx 4GB VRAM in FP16 mode." },
                    { title: "Network Access", desc: "Port 8000 must be exposed and accessible from client apps." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold mt-0.5">{i+1}</div>
                      <div>
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === TabType.ASSISTANT && (
          <div className="flex-1 flex overflow-hidden">
             <Assistant />
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-slate-800 bg-slate-900 px-4 flex items-center justify-between text-[10px] font-medium text-slate-500 uppercase tracking-tighter">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Terminal size={10}/> CLI: Ready</span>
          <span className="flex items-center gap-1 text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Server: Hot</span>
        </div>
        <div>Model ID: Qwen/Qwen1.5-1.8B-Chat</div>
      </footer>
    </div>
  );
};

interface FileTreeProps {
  node: FileNode;
  selectedPath: string;
  onSelect: (path: string) => void;
  depth?: number;
}

const FileTree: React.FC<FileTreeProps> = ({ node, selectedPath, onSelect, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedPath === node.path;

  if (node.type === 'directory') {
    return (
      <div className="w-full">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800/50 text-slate-300 transition-colors text-sm font-medium"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
          <Folder size={14} className="text-blue-400" />
          {node.name}
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
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-sm ${isSelected ? 'bg-blue-600/20 text-blue-400 font-medium' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'}`}
      style={{ paddingLeft: `${depth * 12 + 22}px` }}
    >
      <FileJson size={14} className={isSelected ? 'text-blue-400' : 'text-slate-500'} />
      {node.name}
    </button>
  );
};

export default App;
