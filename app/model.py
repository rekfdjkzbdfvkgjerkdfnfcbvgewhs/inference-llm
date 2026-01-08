import os
from llama_cpp import Llama

# Assumes the GGUF file is placed in the /models directory
MODEL_PATH = "models/qwen1.5-1.8b-q4.gguf"
llm = None

def load_model():
    global llm
    if llm is not None:
        return
    
    # n_threads uses all available cores on Render's CPU instance
    llm = Llama(
        model_path=MODEL_PATH,
        n_ctx=2048,
        n_threads=os.cpu_count() or 4,
        n_batch=512,
        verbose=False
    )

def generate(prompt: str, max_new_tokens: int = 256):
    if llm is None:
        load_model()
        
    output = llm(
        prompt,
        max_tokens=max_new_tokens,
        temperature=0.7,
        top_p=0.9,
        stop=["<|endoftext|>", "</s>", "<|im_end|>"]
    )
    return output["choices"][0]["text"]
