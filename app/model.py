import os
from llama_cpp import Llama

MODEL_PATH = "models/qwen1.5-1.8b-chat-q4_k_m.gguf"

_llm: Llama | None = None


def is_model_loaded() -> bool:
    return _llm is not None


def load_model():
    global _llm

    if _llm is not None:
        return

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

    print("🔄 Loading Qwen GGUF model...")

    _llm = Llama(
        model_path=MODEL_PATH,
        n_ctx=2048,
        n_threads=os.cpu_count() or 4,
        n_batch=128,          # IMPORTANT: safer for Render CPU
        verbose=False,
    )

    print("✅ Qwen model loaded into memory")


def generate(prompt: str, max_new_tokens: int = 256) -> str:
    if _llm is None:
        load_model()

    output = _llm(
        prompt,
        max_tokens=max_new_tokens,
        temperature=0.7,
        top_p=0.9,
        stop=[
            "<|im_end|>",
            "<|endoftext|>",
            "</s>",
        ],
    )

    return output["choices"][0]["text"].strip()
