from pydantic import BaseModel

class GenerateRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 256

class GenerateResponse(BaseModel):
    text: str
