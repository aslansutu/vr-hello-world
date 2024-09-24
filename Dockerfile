# Use the official Python image from the Docker Hub
FROM python:3.12-slim

WORKDIR /app

# Copy custom Nginx config
COPY . /app

# Start Python server
CMD ["python", "-m", "http.server"]
