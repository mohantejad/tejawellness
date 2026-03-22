import requests
import os

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
API_URL = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{MODEL_ID}"

def get_embedding(text: str):
    """
    Get embeddings via Hugging Face Inference API (Free Tier).
    No local RAM used for heavy models.
    """
    headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}
    response = requests.post(API_URL, headers=headers, json={"inputs": text})
    
    if response.status_code == 200: # Corrected status_status to status_code
        return response.json()
    
    # Fallback/Error handling (Render might need a token for higher rate limits)
    raise Exception(f"HF API Error: {response.text}")
