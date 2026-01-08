from fastapi import FastAPI, HTTPException
from app.model import load_model, generate, is_model_loaded
from app.schemas import GenerateRequest, GenerateResponse

app = FastAPI(title="Qwen CPU Inference API")


@app.on_event("startup")
def startup_event():
    # Try loading model on boot, but don't crash the app if it fails
    try:
        load_model()
        print("✅ Model loaded successfully on startup")
    except Exception as e:
        print(f"⚠️ Model failed to load on startup: {e}")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": is_model_loaded(),
    }


@app.post("/generate", response_model=GenerateResponse)
def generate_text(req: GenerateRequest):
    if not is_model_loaded():
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        text = generate(req.prompt, req.max_new_tokens)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
