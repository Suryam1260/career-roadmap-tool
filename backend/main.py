"""
FastAPI application for Career Roadmap Tool.
Handles session storage and retrieval for admin roadmap viewing.
"""
import logging
import os
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict

from database import save_session, get_session, get_session_stats

# Setup logging
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# Pydantic models
class QuizResponses(BaseModel):
    """Quiz responses from the frontend."""
    background: Optional[str] = None
    currentBackground: Optional[str] = None
    stepsTaken: Optional[str] = None
    targetRole: Optional[str] = None
    targetRoleLabel: Optional[str] = None
    yearsOfExperience: Optional[str] = None
    codeComfort: Optional[str] = None
    currentSkills: Optional[List[str]] = None
    timeline: Optional[str] = None
    currentRole: Optional[str] = None
    currentRoleLabel: Optional[str] = None
    targetCompany: Optional[str] = None
    targetCompanyLabel: Optional[str] = None

    model_config = ConfigDict(extra="allow")  # Allow extra fields


class SaveSessionRequest(BaseModel):
    """Request body for saving a session."""
    quiz_responses: Dict[str, Any]


class SaveSessionResponse(BaseModel):
    """Response after saving a session."""
    session_hash: str
    admin_url_path: str


class GetSessionResponse(BaseModel):
    """Response when retrieving a session."""
    quiz_responses: Dict[str, Any]
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# FastAPI app
app = FastAPI(
    title="Career Roadmap Tool API",
    description="Backend API for storing and retrieving roadmap sessions",
    version="1.0.0"
)

# CORS middleware for cross-origin requests
# In production, this is handled by nginx proxy, but useful for local dev
allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
api_router = APIRouter()


@api_router.get("/health")
@api_router.head("/health")
async def healthcheck() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok"}


@api_router.get("/stats")
async def stats() -> Dict[str, Any]:
    """Get session statistics."""
    return get_session_stats()


@api_router.post("/session", response_model=SaveSessionResponse)
async def create_session(request: SaveSessionRequest) -> SaveSessionResponse:
    """
    Save quiz responses and return session hash.
    
    The hash can be used to construct an admin URL for viewing the roadmap.
    """
    logger.info("Received session save request")
    
    try:
        session_hash = save_session(request.quiz_responses)
        admin_url_path = f"/admin/roadmap?h={session_hash}"
        
        logger.info(f"Session created with hash: {session_hash[:8]}...")
        
        return SaveSessionResponse(
            session_hash=session_hash,
            admin_url_path=admin_url_path
        )
    except Exception as exc:
        logger.exception("Failed to save session")
        raise HTTPException(
            status_code=500,
            detail="Failed to save session. Please try again."
        ) from exc


@api_router.get("/session/{session_hash}", response_model=GetSessionResponse)
async def retrieve_session(session_hash: str) -> GetSessionResponse:
    """
    Retrieve quiz responses by session hash.
    
    Used by admin page to load the roadmap data.
    """
    logger.info(f"Retrieving session: {session_hash[:8]}...")
    
    # Validate hash format (MD5 = 32 hex characters)
    if len(session_hash) != 32 or not all(c in '0123456789abcdef' for c in session_hash.lower()):
        raise HTTPException(
            status_code=400,
            detail="Invalid session hash format"
        )
    
    session_data = get_session(session_hash)
    
    if session_data is None:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    
    return GetSessionResponse(**session_data)


# Mount router with prefix
app.include_router(api_router, prefix="/career-roadmap-tool/api")


# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

