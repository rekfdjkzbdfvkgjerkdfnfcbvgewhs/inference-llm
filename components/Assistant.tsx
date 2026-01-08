
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Sparkles, Terminal } from 'lucide-react';
import { ChatMessage } from '../types';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I am your AI Architect. I can explain why this specific Qwen inference server is optimized for high uptime and GPU performance. Ask me about the Docker setup, model loading strategy, or how to scale this API!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const systemInstruction = `
        You are a World-Class ML Ops Engineer and Senior Backend Architect.
        Your expertise is deploying Large Language Models (LLMs) like Qwen on GPU infrastructure (Render, AWS, Lambda).
        
        CONTEXT:
        The user is viewing a Qwen Inference Server built with:
        - FastAPI
        - Transformers (HF)
        - NVIDIA CUDA 12.1 Runtime Docker image
        - device_map="auto" for multi-GPU or single-GPU optimization
        - torch.float16 for reduced VRAM usage
        - Pre-loading strategy: Model is loaded once on startup, not per request.
        
        GOAL:
        Explain the technical choices made in this repository. 
        Focus on:
        1. Performance (Hot-loading model)
        2. Reliability (FastAPI health checks)
        3. Portability (Docker with specific CUDA versions)
        4. Efficiency (float16 and inference_mode decorators)
        
        Keep answers concise but technically rigorous.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: [...messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })), { role: 'user', parts: [{ text: input }] }] as any,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const assistantMsg: ChatMessage = { role: 'assistant', content: response.text || 'Sorry, I couldn\'t generate a response.' };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'There was an error connecting to my core processing unit. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900/20">
      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-blue-400" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
              <Loader2 size={16} className="text-blue-400 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-2 items-center text-slate-500 text-sm">
              <Sparkles size={14} className="animate-pulse" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-3xl mx-auto flex gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800 focus-within:border-blue-500/50 transition-all shadow-xl shadow-black/20">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about the architecture..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-slate-200"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center transition-all text-white"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-3 text-slate-500 font-medium tracking-tight uppercase flex items-center justify-center gap-2">
          <Terminal size={10} /> Powered by Gemini-3-Flash for architectural insights
        </p>
      </div>
    </div>
  );
};

export default Assistant;
