
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Terminal, 
  FileCode, 
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
  ExternalLink,
  ZapOff,
  Layers
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
      { name: 'render.yaml', type: 'file', path: 'render.yaml', content: QWEN_FILES.render_yaml },
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
          <div className="flex items-center gap-2 text-blue-400">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            CPU Engine: Active
          </div>
          <div className="flex items-center gap-2 text-emerald-500">
            <Layers size={12} />
            Quant: Q4_K_M (GGUF)
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#555]">
          <span>Llama-CPP-Python</span>
          <span>No-CUDA Mode</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-[#222] bg-[#0a0a0a] flex flex-col">
          <div className="p-4 border-b border-[#222]">
            <div className="text-[10px] text-[#555] mb-2 font-bold uppercase tracking-tighter">Manifest</div>
            <nav className="space-y-1">
              {[
                { id: 'files', icon: FileCode, label: 'Source Explorer' },
                { id: 'api', icon: Globe, label: 'API Reference' },
                { id: 'deploy', icon: Box, label: 'Infrastructure' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors ${activeView === item.id ? 'bg-[#1a1a1a] text-white shadow-inner' : 'text-[#666] hover:text-[#999]'}`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-[10px] text-[#555] px-2 mb-2 font-bold uppercase tracking-tighter">Filesystem</div>
            <FileTree node={fileTree} selectedPath={selectedFile} onSelect={setSelectedFile} />
          </div>

          <div className="p-4 bg-[#0d0d0d] border-t border-[#222] space-y-3">
            <div className="flex justify-between items-center text-[10px] text-[#444]">
              <span>SYSTEM RAM</span>
              <span>1.8GB / 4.0GB</span>
            </div>
            <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[45%]" />
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#050505]">
          {activeView === 'files' && (
            <>
              <div className="h-10 border-b border-[#222] flex items-center justify-between px-4 bg-[#0a0a0a]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#888]">
                  <Terminal size={14} className="text-blue-500" />
                  {selectedFile}
                </div>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase rounded border border-[#333] hover:bg-[#111] transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
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
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                  <Globe className="text-blue-500" size={24} />
                  CPU Endpoint Spec
                </h2>
                <div className="space-y-6">
                  <EndpointCard 
                    method="POST" 
                    path="/generate" 
                    description="Inference using GGUF 4-bit quantization. Cold boot optimized for CPU."
                    body={{
                      prompt: "string",
                      max_new_tokens: "int"
                    }}
                    response={{
                      text: "string"
                    }}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                  <Terminal className="text-emerald-500" size={24} />
                  Quick Test
                </h2>
                <div className="p-6 bg-[#0a0a0a] border border-[#222] rounded-lg">
                  <pre className="text-xs text-blue-400 leading-6">
                    {`curl -X POST "http://localhost:8000/generate" \\
     -H "Content-Type: application/json" \\
     -d '{"prompt": "Why use CPU for LLMs?", "max_new_tokens": 100}'`}
                  </pre>
                </div>
              </section>
            </div>
          )}

          {activeView === 'deploy' && (
            <div className="flex-1 overflow-y-auto p-12 max-w-4xl mx-auto w-full space-y-12">
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                  <ZapOff className="text-orange-500" size={24} />
                  CPU-Only Optimization
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Cpu, label: "SIMD Acceleration", desc: "Uses AVX/AVX2 instructions via llama.cpp" },
                    { icon: Database, label: "GGUF Q4_K_M", desc: "4-bit quantization for 3x less RAM usage" },
                    { icon: Lock, label: "No CUDA", desc: "Native C++ compilation (libllama.so)" },
                    { icon: Activity, label: "Multi-threading", desc: "Auto-detection of physical CPU cores" }
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
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                  <CornerDownRight className="text-purple-500" size={24} />
                  Build Commands
                </h2>
                <div className="space-y-4">
                  <Step title="Native Build" cmd="docker build -t qwen-cpu-native ." />
                  <Step title="Launch (No GPU required)" cmd="docker run -p 8000:8000 qwen-cpu-native" />
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="h-10 border-t border-[#222] bg-[#0a0a0a] flex items-center justify-between px-6 text-[10px] font-bold text-[#444] uppercase tracking-tighter">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Stack: Llama.cpp + FastAPI</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Format: GGUF</span>
        </div>
        <div className="text-blue-500/50">
          NODE: CPU_INSTANCE_01 // OPTIMIZED
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
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#111] text-[#777] transition-colors text-[11px] font-bold uppercase tracking-tighter"
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
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-[11px] ${isSelected ? 'text-blue-400 bg-blue-400/5' : 'text-[#555] hover:text-[#888]'}`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      {node.name}
    </button>
  );
};

const EndpointCard: React.FC<{ method: string; path: string; description: string; body?: any; response?: any }> = ({ method, path, description, body, response }) => (
  <div className="border border-[#222] bg-[#0a0a0a] rounded-lg overflow-hidden">
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[#222] bg-[#0d0d0d]">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${method === 'POST' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
        {method}
      </span>
      <span className="text-sm font-bold text-white tracking-tight">{path}</span>
    </div>
    <div className="p-4 space-y-4">
      <p className="text-xs text-[#777] leading-relaxed">{description}</p>
      {body && (
        <pre className="p-3 bg-black rounded text-[11px] text-blue-400/80 border border-[#1a1a1a]">{JSON.stringify(body, null, 2)}</pre>
      )}
      {response && (
        <pre className="p-3 bg-black rounded text-[11px] text-emerald-400/80 border border-[#1a1a1a]">{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  </div>
);

const Step: React.FC<{ title: string; cmd: string }> = ({ title, cmd }) => (
  <div className="p-4 border border-[#222] rounded bg-[#0a0a0a] group hover:border-[#333] transition-colors">
    <div className="text-[10px] font-bold text-[#444] mb-2 uppercase tracking-tight">{title}</div>
    <div className="flex items-center justify-between">
      <code className="text-xs text-emerald-500 font-mono tracking-tighter">$ {cmd}</code>
      <button onClick={() => navigator.clipboard.writeText(cmd)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#1a1a1a] rounded">
        <Copy size={12} className="text-[#555]" />
      </button>
    </div>
  </div>
);

export default App;
