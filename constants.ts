
export const QWEN_FILES = {
  main_py: `from fastapi import FastAPI
from app.model import load_model, generate
from app.schemas import GenerateRequest, GenerateResponse

app = FastAPI(title="Qwen CPU Inference API")

@app.on_event("startup")
def startup():
    # Model is initialized on boot
    load_model()

@app.get("/health")
def health():
    return {"status": "ok", "engine": "llama.cpp"}

@app.post("/generate", response_model=GenerateResponse)
def generate_text(req: GenerateRequest):
    text = generate(
        req.prompt,
        max_new_tokens=req.max_new_tokens
    )
    return {"text": text}`,

  model_py: `import os
from llama_cpp import Llama
from huggingface_hub import hf_hub_download

# Qwen-1.5-1.8B Quantized (GGUF)
MODEL_REPO = "Qwen/Qwen1.5-1.8B-Chat-GGUF"
MODEL_FILE = "qwen1_5-1_8b-chat-q4_k_m.gguf"

llm = None

def load_model():
    global llm
    
    if llm is not None:
        return

    # Download GGUF model from Hub
    model_path = hf_hub_download(
        repo_id=MODEL_REPO,
        filename=MODEL_FILE
    )

    # Initialize C++ backend
    llm = Llama(
        model_path=model_path,
        n_ctx=2048,           # Context window
        n_threads=os.cpu_count() or 4, # Maximize CPU usage
        n_gpu_layers=0,       # Force CPU-only
        verbose=False
    )

def generate(prompt: str, max_new_tokens: int = 256):
    # Formatted for Qwen Chat template
    formatted_prompt = f"<|im_start|>user\\n{prompt}<|im_end|>\\n<|im_start|>assistant\\n"
    
    response = llm(
        formatted_prompt,
        max_tokens=max_new_tokens,
        stop=["<|im_end|>", "<|endoftext|>"],
        echo=False,
        temperature=0.7,
        top_p=0.9
    )
    
    return response["choices"][0]["text"].strip()`,

  schemas_py: `from pydantic import BaseModel

class GenerateRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 256

class GenerateResponse(BaseModel):
    text: str`,

  requirements_txt: `fastapi
uvicorn[standard]
llama-cpp-python
huggingface_hub
pydantic`,

  dockerfile: `FROM python:3.11-slim-bookworm

# Build-time dependencies for C++ extensions
RUN apt-get update && apt-get install -y \\
    build-essential \\
    python3-dev \\
    cmake \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set environment to avoid PyTorch/CUDA bloat
ENV PIP_NO_CACHE_DIR=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`,

  render_yaml: `services:
  - type: web
    name: qwen-cpu-api
    runtime: docker
    plan: pro
    region: oregon
    envVars:
      - key: MODEL_ID
        value: Qwen/Qwen1.5-1.8B-Chat-GGUF`,

  dockerignore: `__pycache__/
.git
.env
*.gguf`,

  readme_md: `# Qwen CPU Inference Server

High-density C++ inference using llama-cpp-python.

## Specs
- **Engine**: llama.cpp (C++ core)
- **Quantization**: 4-bit (Q4_K_M)
- **RAM Target**: ~2.5GB
- **Backend**: FastAPI / Uvicorn

## Usage
\`\`\`bash
docker build -t qwen-cpu .
docker run -p 8000:8000 qwen-cpu
\`\`\``
};
