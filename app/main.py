from fastapi import FastAPI
from app.model import load_model, generate
from app.schemas import GenerateRequest, GenerateResponse

app = FastAPI(title="Qwen CPU Inference API")

@app.on_event("startup")
def startup_event():
    # Model loads into memory once on boot
    load_model()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate", response_model=GenerateResponse)
def generate_text(req: GenerateRequest):
    text = generate(req.prompt, req.max_new_tokens)
    return {"text": text}
