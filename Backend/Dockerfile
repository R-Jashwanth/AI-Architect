# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY Backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend application code
COPY Backend/ .

# Expose port (Railway will set PORT env variable)
EXPOSE 8000

# Start command
CMD uvicorn routes:app --host 0.0.0.0 --port ${PORT:-8000}
