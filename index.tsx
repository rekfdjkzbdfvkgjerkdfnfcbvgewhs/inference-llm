import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <div style={{
      backgroundColor: '#000', 
      color: '#0f0', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'monospace'
    }}>
      <h1 style={{fontSize: '1.2rem', marginBottom: '1rem'}}>[ REPOSITORY READY ]</h1>
      <p style={{fontSize: '0.8rem', color: '#666'}}>qwen-cpu-inference backend structure initialized.</p>
      <div style={{marginTop: '2rem', textAlign: 'left', opacity: 0.8}}>
        <div style={{color: '#888'}}>$ ls -R</div>
        <div>.</div>
        <div>├── Dockerfile</div>
        <div>├── requirements.txt</div>
        <div>├── README.md</div>
        <div>├── app/</div>
        <div>│   ├── main.py</div>
        <div>│   ├── model.py</div>
        <div>│   └── schemas.py</div>
        <div>└── models/</div>
        <div>    └── qwen1.5-1.8b-q4.gguf</div>
      </div>
    </div>
  );
}