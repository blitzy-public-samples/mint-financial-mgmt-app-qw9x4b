FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port that the application will run on
EXPOSE 8000

# Command to run the application using Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "src.api.ml_api:app"]

# Human tasks (commented):
# TODO: Verify that the Python version (3.8) is appropriate for all dependencies
# TODO: Ensure that the exposed port (8000) matches the port configured in the ML API
# TODO (Optional): Consider adding health check instructions for container orchestration