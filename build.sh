#!/usr/bin/env bash
set -e

echo "📦 Installing Python dependencies"
pip install --upgrade pip
pip install -r requirements.txt

echo "📥 Downloading Qwen model"
mkdir -p models

wget -O models/qwen1.5-1.8b-chat-q4_k_m.gguf \
  https://huggingface.co/Qwen/Qwen1.5-1.8B-Chat-GGUF/resolve/main/qwen1_5-1_8b-chat-q4_k_m.gguf

echo "✅ Build complete"
