FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
# TODO: Uncomment the following line once requirements.txt is populated
# COPY ../../src/ml/requirements.txt .

# Install the Python dependencies
# TODO: Uncomment the following line once requirements.txt is populated
# RUN pip install --no-cache-dir -r requirements.txt

# Copy the ML application code into the container
COPY ../../src/ml .

# Expose the port that the application will run on
EXPOSE 8000

# Start the ML API using Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "src.api.ml_api:app"]

# List of human tasks (commented)
# TODO: Verify that the Python version (3.8) is appropriate for all dependencies
# TODO: Ensure that the exposed port (8000) matches the port configured in the ML API
# TODO: Consider adding health check instructions for container orchestration
# TODO: Verify that the file paths for COPY instructions are correct relative to the Dockerfile's location
# TODO: Consider adding a .dockerignore file to exclude unnecessary files from the build context
# TODO: Populate the requirements.txt file with necessary dependencies