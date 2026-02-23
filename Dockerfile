# Dockerfile for Backend deployment
# This file is at the root level for Railway deployment

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy Backend requirements
COPY Backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend code
COPY Backend/ .

# Make start script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 8000

# Use the start script
CMD ["./start.sh"]

