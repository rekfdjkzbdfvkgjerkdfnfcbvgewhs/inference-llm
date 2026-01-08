
export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  children?: FileNode[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export enum TabType {
  ARCHITECTURE = 'architecture',
  DEPLOYMENT = 'deployment',
  ASSISTANT = 'assistant'
}
