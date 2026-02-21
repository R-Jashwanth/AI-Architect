#!/bin/bash
# Startup script for backend deployment

# Set default port if not provided
export PORT=${PORT:-8001}

# Set Python path
export PYTHONPATH=/app:$PYTHONPATH

# Run database initialization
python -c "import asyncio; from database import init_db; asyncio.run(init_db())" || echo "Database init skipped"

# Start the server
exec uvicorn routes:app --host 0.0.0.0 --port $PORT --workers 1 --log-level info
