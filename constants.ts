
export const QWEN_FILES = {
  main_py: `from fastapi import FastAPI
from app.model import load_model, generate
from app.schemas import GenerateRequest, GenerateResponse

app = FastAPI(title="Qwen Inference API")

@app.on_event("startup")
def startup():
    load_model()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate", response_model=GenerateResponse)
def generate_text(req: GenerateRequest):
    text = generate(
        req.prompt,
        max_new_tokens=req.max_new_tokens
    )
    return {"text": text}`,

  model_py: `import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_ID = "Qwen/Qwen1.5-1.8B-Chat"

tokenizer = None
model = None

def load_model():
    global tokenizer, model

    if model is not None:
        return

    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_ID,
        trust_remote_code=True
    )

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True
    )

    model.eval()


@torch.inference_mode()
def generate(prompt: str, max_new_tokens: int = 256):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    output = model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=0.7,
        top_p=0.9
    )

    return tokenizer.decode(output[0], skip_special_tokens=True)`,

  schemas_py: `from pydantic import BaseModel

class GenerateRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 256

class GenerateResponse(BaseModel):
    text: str`,

  requirements_txt: `fastapi
uvicorn[standard]
torch
transformers
accelerate
sentencepiece
pydantic`,

  dockerfile: `FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \\
    python3 \\
    python3-pip \\
    git \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`,

  dockerignore: `__pycache__/
.git
.env`,

  readme_md: `# Qwen Inference Server

A high-performance FastAPI wrapper for the Qwen 1.5-1.8B-Chat model, optimized for GPU deployment.

## Features
- **FastAPI Core**: Low latency, high throughput.
- **GPU Optimized**: Uses NVIDIA CUDA 12.1.1 base image.
- **Efficient Inference**: Implements \`device_map="auto"\` and \`torch.float16\`.
- **Hot-loading**: Model stays in VRAM after first startup.

## Deployment
1. Build: \`docker build -t qwen-server .\`
2. Run: \`docker run --gpus all -p 8000:8000 qwen-server\``
};
