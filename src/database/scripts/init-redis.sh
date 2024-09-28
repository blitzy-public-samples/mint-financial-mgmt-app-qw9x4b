#!/bin/bash

# Source environment variables
source .env

# Check if Redis is installed
if ! command -v redis-cli &> /dev/null; then
    echo "Redis is not installed. Please install Redis before running this script."
    exit 1
fi

# Start Redis server
redis-server --daemonize yes

# Wait for Redis to start
sleep 2

# Configure Redis
redis-cli <<EOF
CONFIG SET requirepass ${REDIS_PASSWORD}
CONFIG SET maxmemory 100mb
CONFIG SET maxmemory-policy allkeys-lru
CONFIG REWRITE
EOF

# Verify Redis is running
if redis-cli ping > /dev/null 2>&1; then
    echo "Redis initialized and configured successfully."
else
    echo "Failed to initialize Redis. Please check the logs and try again."
    exit 1
fi

# Create necessary Redis keys and data structures
redis-cli -a ${REDIS_PASSWORD} <<EOF
SET app:config:version 1.0.0
SADD app:features feature1 feature2 feature3
EOF

echo "Redis initialization complete."

# Human tasks:
# TODO: Review and adjust Redis configuration settings (e.g., maxmemory, maxmemory-policy) based on production requirements
# TODO: Implement proper error handling and logging for Redis initialization failures
# TODO: Set up Redis persistence configuration (AOF or RDB) if required
# TODO: Configure Redis sentinel or cluster for high availability, if needed