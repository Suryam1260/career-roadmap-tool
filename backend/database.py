"""
Database connection pool and session storage for roadmap sessions.
Uses MD5 hashing for session identification.
"""
import hashlib
import json
import logging
import os
from typing import Any, Dict, Optional
from contextlib import contextmanager

import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor

logger = logging.getLogger(__name__)

_connection_pool: Optional[pool.SimpleConnectionPool] = None
_DB_DISABLED = False


def _get_database_url() -> str:
    """Get database URL from environment variable."""
    return os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/profile_cache"
    )


def _initialize_pool() -> Optional[pool.SimpleConnectionPool]:
    """Initialize the database connection pool."""
    global _connection_pool, _DB_DISABLED

    if _DB_DISABLED:
        return None

    if _connection_pool is not None:
        return _connection_pool

    try:
        database_url = _get_database_url()
        _connection_pool = pool.SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=database_url
        )

        # Test connection
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")

        logger.info("Database connection pool initialized successfully")
        return _connection_pool

    except Exception as exc:
        logger.warning(f"Database connection failed: {exc}")
        _DB_DISABLED = True
        return None


@contextmanager
def get_db_connection():
    """Context manager for database connections."""
    pool_instance = _initialize_pool()

    if pool_instance is None:
        raise RuntimeError("Database pool not initialized")

    conn = pool_instance.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        pool_instance.putconn(conn)


def make_session_hash(quiz_responses: Dict[str, Any]) -> str:
    """
    Create MD5 hash from quiz responses payload.
    
    Args:
        quiz_responses: Dictionary containing quiz response data
        
    Returns:
        32-character MD5 hash string
    """
    serialized = json.dumps(quiz_responses, sort_keys=True, separators=(",", ":"))
    return hashlib.md5(serialized.encode("utf-8")).hexdigest()


def save_session(quiz_responses: Dict[str, Any]) -> str:
    """
    Save quiz responses and return session hash.
    
    Args:
        quiz_responses: Dictionary containing quiz response data
        
    Returns:
        32-character MD5 hash for the session
        
    Raises:
        RuntimeError: If database is not available
    """
    session_hash = make_session_hash(quiz_responses)
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO roadmap_sessions (session_hash, quiz_responses)
                    VALUES (%s, %s)
                    ON CONFLICT (session_hash)
                    DO UPDATE SET
                        quiz_responses = EXCLUDED.quiz_responses,
                        updated_at = CURRENT_TIMESTAMP
                    RETURNING session_hash
                    """,
                    (session_hash, json.dumps(quiz_responses))
                )
                result = cur.fetchone()
                
        logger.info(f"Session saved with hash: {session_hash[:8]}...")
        return session_hash

    except Exception as exc:
        logger.error(f"Failed to save session: {exc}")
        raise


def get_session(session_hash: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve quiz responses by session hash.
    
    Args:
        session_hash: 32-character MD5 hash
        
    Returns:
        Dictionary containing quiz responses, or None if not found
    """
    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT quiz_responses, created_at, updated_at
                    FROM roadmap_sessions
                    WHERE session_hash = %s
                    """,
                    (session_hash,)
                )
                result = cur.fetchone()

                if result:
                    logger.info(f"Session found for hash: {session_hash[:8]}...")
                    quiz_responses = result['quiz_responses']
                    # Handle both dict and string responses
                    if isinstance(quiz_responses, str):
                        quiz_responses = json.loads(quiz_responses)
                    return {
                        "quiz_responses": quiz_responses,
                        "created_at": result['created_at'].isoformat() if result['created_at'] else None,
                        "updated_at": result['updated_at'].isoformat() if result['updated_at'] else None
                    }
                else:
                    logger.info(f"Session not found for hash: {session_hash[:8]}...")
                    return None

    except Exception as exc:
        logger.warning(f"Failed to get session: {exc}")
        return None


def get_session_stats() -> Dict[str, Any]:
    """Get statistics about stored sessions."""
    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT
                        COUNT(*) as total_sessions,
                        MAX(created_at) as latest_session,
                        MIN(created_at) as oldest_session
                    FROM roadmap_sessions
                    """
                )
                stats = cur.fetchone()
                return {
                    "enabled": True,
                    **dict(stats)
                }

    except Exception as exc:
        logger.warning(f"Failed to get session stats: {exc}")
        return {"enabled": False, "error": str(exc)}

