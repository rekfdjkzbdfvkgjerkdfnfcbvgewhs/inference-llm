# Qwen CPU Inference

High-performance CPU-only inference using llama.cpp and GGUF quantization.

## Structure
- `app/`: FastAPI application and logic.
- `models/`: Location for your `.gguf` model files.

## Communication (Render)
```bash
curl -X POST "https://your-service.onrender.com/generate" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello Qwen!", "max_new_tokens": 100}'
```