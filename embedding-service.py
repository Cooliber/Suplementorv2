"""
Embedding Service for Polish Supplement Recommendation System
Uses multilingual-e5-large model optimized for Polish text processing
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import numpy as np
from sentence_transformers import SentenceTransformer
import torch
import logging
import time
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model variable
model = None
device = "cuda" if torch.cuda.is_available() else "cpu"

class EmbeddingRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1, max_items=100)
    normalize: bool = True
    model_name: Optional[str] = None

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    model: str
    processing_time: float
    device: str

class HealthResponse(BaseModel):
    status: str
    model: str
    device: str
    memory_usage: Dict[str, Any]

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for model loading"""
    global model

    logger.info("Loading embedding model...")

    # Load the multilingual model optimized for Polish
    model_name = "intfloat/multilingual-e5-large"

    try:
        model = SentenceTransformer(model_name, device=device)
        logger.info(f"Model loaded successfully on {device}")
        logger.info(f"Model max sequence length: {model.get_max_seq_length()}")

        # Warm up the model
        _ = model.encode(["test"], convert_to_numpy=True)
        logger.info("Model warmed up")

    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise

    yield

    logger.info("Shutting down embedding service...")

# Create FastAPI app with lifespan
app = FastAPI(
    title="Polish Embedding Service",
    description="Multilingual embedding service optimized for Polish supplement and health data",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded"
        )

    # Get memory usage
    memory_usage = {}
    if torch.cuda.is_available():
        memory_usage = {
            "allocated": torch.cuda.memory_allocated() / 1024**2,  # MB
            "reserved": torch.cuda.memory_reserved() / 1024**2,   # MB
        }

    return HealthResponse(
        status="healthy",
        model=model.get_sentence_embedding_dimension(),
        device=device,
        memory_usage=memory_usage
    )

@app.post("/embed", response_model=EmbeddingResponse)
async def create_embeddings(request: EmbeddingRequest):
    """Generate embeddings for given texts"""
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded"
        )

    start_time = time.time()

    try:
        # Preprocess texts for multilingual-e5-large
        # The model expects a prefix for optimal performance
        processed_texts = []
        for text in request.texts:
            # Add prefix for better multilingual performance
            if text.startswith("query:") or text.startswith("passage:"):
                processed_texts.append(text)
            else:
                # For general text, add passage prefix
                processed_texts.append(f"passage: {text}")

        # Generate embeddings
        embeddings = model.encode(
            processed_texts,
            convert_to_numpy=True,
            normalize_embeddings=request.normalize,
            batch_size=32,
            show_progress_bar=False
        )

        processing_time = time.time() - start_time

        logger.info(f"Generated {len(request.texts)} embeddings in {processing_time".2f"}s")

        # Convert numpy arrays to lists for JSON serialization
        embedding_lists = embeddings.tolist()

        return EmbeddingResponse(
            embeddings=embedding_lists,
            model="intfloat/multilingual-e5-large",
            processing_time=processing_time,
            device=device
        )

    except Exception as e:
        logger.error(f"Error generating embeddings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Embedding generation failed: {str(e)}"
        )

@app.post("/similarity")
async def calculate_similarity(request: EmbeddingRequest):
    """Calculate cosine similarity between texts"""
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded"
        )

    if len(request.texts) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Need at least 2 texts for similarity calculation"
        )

    try:
        # Generate embeddings
        embeddings = model.encode(
            [f"passage: {text}" for text in request.texts],
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=False
        )

        # Calculate pairwise similarities
        similarities = []
        for i in range(len(embeddings)):
            row = []
            for j in range(len(embeddings)):
                if i == j:
                    row.append(1.0)
                else:
                    # Cosine similarity
                    similarity = np.dot(embeddings[i], embeddings[j])
                    row.append(float(similarity))
            similarities.append(row)

        return {
            "similarities": similarities,
            "texts": request.texts,
            "model": "intfloat/multilingual-e5-large"
        }

    except Exception as e:
        logger.error(f"Error calculating similarity: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Similarity calculation failed: {str(e)}"
        )

@app.get("/models")
async def list_models():
    """List available models (currently only one)"""
    return {
        "models": [
            {
                "name": "intfloat/multilingual-e5-large",
                "description": "Multilingual embedding model optimized for Polish text",
                "dimensions": 1024,
                "languages": ["Polish", "English", "German", "French", "Spanish", "Italian", "Dutch", "Russian", "Chinese", "Japanese"],
                "recommended_for": ["supplement descriptions", "health conditions", "medical terms", "user queries"]
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)