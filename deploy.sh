#!/bin/bash

# Deployment script for Punarmilan
# This script pulls the latest images and restarts the containers.

echo "Pulling latest images..."
docker compose pull

echo "Starting services..."
docker compose up -d

echo "Cleaning up old images..."
docker image prune -f

echo "Deployment complete!"
