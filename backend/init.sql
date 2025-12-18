-- Roadmap Sessions Table
-- Stores quiz responses keyed by MD5 hash for admin access
CREATE TABLE IF NOT EXISTS roadmap_sessions (
    id SERIAL PRIMARY KEY,
    session_hash VARCHAR(32) NOT NULL UNIQUE,
    quiz_responses JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_session_hash ON roadmap_sessions(session_hash);
CREATE INDEX IF NOT EXISTS idx_created_at ON roadmap_sessions(created_at DESC);

-- Comments for documentation
COMMENT ON TABLE roadmap_sessions IS 'Stores quiz responses keyed by MD5 hash for admin roadmap viewing';
COMMENT ON COLUMN roadmap_sessions.session_hash IS 'MD5 hash of the quiz responses payload';
COMMENT ON COLUMN roadmap_sessions.quiz_responses IS 'Full JSON quiz responses from the user';
COMMENT ON COLUMN roadmap_sessions.created_at IS 'Timestamp when session was first created';
COMMENT ON COLUMN roadmap_sessions.updated_at IS 'Timestamp when session was last updated';

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_roadmap_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_roadmap_sessions_updated_at ON roadmap_sessions;
CREATE TRIGGER update_roadmap_sessions_updated_at
    BEFORE UPDATE ON roadmap_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_roadmap_sessions_updated_at();

-- Statistics view
CREATE OR REPLACE VIEW roadmap_sessions_statistics AS
SELECT
    COUNT(*) as total_sessions,
    COUNT(DISTINCT DATE(created_at)) as days_active,
    MAX(created_at) as latest_session,
    MIN(created_at) as oldest_session,
    pg_size_pretty(pg_total_relation_size('roadmap_sessions')) as table_size
FROM roadmap_sessions;

COMMENT ON VIEW roadmap_sessions_statistics IS 'Provides overview statistics of roadmap sessions';

