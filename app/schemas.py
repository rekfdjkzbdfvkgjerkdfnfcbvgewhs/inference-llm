from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    max_new_tokens: int = Field(256, ge=1, le=1024)


class GenerateResponse(BaseModel):
    text: str
