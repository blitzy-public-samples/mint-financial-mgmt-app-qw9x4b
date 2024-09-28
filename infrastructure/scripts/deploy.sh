#!/bin/bash

# Mint Replica Deployment Script
# This script is responsible for deploying the Mint Replica application to the specified environment.

# Set environment variables
ENV="${1:-production}"
SCRIPT_DIR="$(dirname "$0")"

# Source environment-specific variables
source "${SCRIPT_DIR}/../env/${ENV}.env"

# Function to check if required external tools are installed
check_dependencies() {
    local missing_deps=0
    
    command -v aws >/dev/null 2>&1 || { echo >&2 "aws-cli is required but not installed."; missing_deps=1; }
    command -v kubectl >/dev/null 2>&1 || { echo >&2 "kubectl is required but not installed."; missing_deps=1; }
    command -v docker >/dev/null 2>&1 || { echo >&2 "docker is required but not installed."; missing_deps=1; }
    
    return $missing_deps
}

# Function to load environment variables based on the deployment environment
load_env_vars() {
    local env=$1
    if [[ -f "${SCRIPT_DIR}/../env/${env}.env" ]]; then
        source "${SCRIPT_DIR}/../env/${env}.env"
    else
        echo "Error: Environment file for ${env} not found."
        exit 1
    fi
}

# Function to create a backup of the database before deployment
backup_database() {
    echo "Creating database backup..."
    if "${SCRIPT_DIR}/backup_database.sh"; then
        echo "Database backup created successfully."
        return 0
    else
        echo "Error: Database backup failed."
        return 1
    fi
}

# Function to build Docker images and push them to the container registry
build_and_push_images() {
    echo "Building and pushing Docker images..."
    
    # Build and push backend image
    docker build -t "${DOCKER_REGISTRY}/mint-replica-backend:${VERSION}" -f "${SCRIPT_DIR}/../docker/backend.Dockerfile" .
    docker push "${DOCKER_REGISTRY}/mint-replica-backend:${VERSION}"
    
    # Build and push frontend image
    docker build -t "${DOCKER_REGISTRY}/mint-replica-frontend:${VERSION}" -f "${SCRIPT_DIR}/../docker/frontend.Dockerfile" .
    docker push "${DOCKER_REGISTRY}/mint-replica-frontend:${VERSION}"
    
    # Add more services as needed
    
    if [ $? -eq 0 ]; then
        echo "Docker images built and pushed successfully."
        return 0
    else
        echo "Error: Failed to build and push Docker images."
        return 1
    fi
}

# Function to update Kubernetes manifests with new image tags and configurations
update_kubernetes_manifests() {
    echo "Updating Kubernetes manifests..."
    
    # Update image tags in deployment files
    sed -i "s|image: ${DOCKER_REGISTRY}/mint-replica-backend:.*|image: ${DOCKER_REGISTRY}/mint-replica-backend:${VERSION}|g" "${SCRIPT_DIR}/../kubernetes/backend-deployment.yaml"
    sed -i "s|image: ${DOCKER_REGISTRY}/mint-replica-frontend:.*|image: ${DOCKER_REGISTRY}/mint-replica-frontend:${VERSION}|g" "${SCRIPT_DIR}/../kubernetes/frontend-deployment.yaml"
    
    # Update ConfigMaps and Secrets if necessary
    # kubectl create configmap mint-replica-config --from-env-file="${SCRIPT_DIR}/../env/${ENV}.env" -o yaml --dry-run=client | kubectl apply -f -
    
    if [ $? -eq 0 ]; then
        echo "Kubernetes manifests updated successfully."
        return 0
    else
        echo "Error: Failed to update Kubernetes manifests."
        return 1
    fi
}

# Function to apply the updated Kubernetes manifests to the cluster
apply_kubernetes_manifests() {
    echo "Applying Kubernetes manifests..."
    
    kubectl apply -f "${SCRIPT_DIR}/../kubernetes/"
    
    if [ $? -eq 0 ]; then
        echo "Kubernetes manifests applied successfully."
        kubectl rollout status deployment/mint-replica-backend
        kubectl rollout status deployment/mint-replica-frontend
        return 0
    else
        echo "Error: Failed to apply Kubernetes manifests."
        return 1
    fi
}

# Function to execute database migrations if necessary
run_database_migrations() {
    echo "Running database migrations..."
    
    # Execute migrations using your preferred method (e.g., kubectl exec, job, etc.)
    kubectl exec -it $(kubectl get pods -l app=mint-replica-backend -o jsonpath="{.items[0].metadata.name}") -- npm run migrate
    
    if [ $? -eq 0 ]; then
        echo "Database migrations completed successfully."
        return 0
    else
        echo "Error: Database migrations failed."
        return 1
    fi
}

# Function to run basic smoke tests to verify deployment
perform_smoke_tests() {
    echo "Performing smoke tests..."
    
    # Add your smoke tests here
    # For example, checking if the services are responding:
    if curl -sSf "${APP_URL}/health" > /dev/null; then
        echo "Smoke tests passed successfully."
        return 0
    else
        echo "Error: Smoke tests failed."
        return 1
    fi
}

# Main function that orchestrates the deployment process
main() {
    echo "Starting deployment process for environment: ${ENV}"
    
    check_dependencies
    if [ $? -ne 0 ]; then
        echo "Error: Missing dependencies. Please install required tools and try again."
        exit 1
    fi
    
    load_env_vars "${ENV}"
    
    backup_database
    if [ $? -ne 0 ]; then
        echo "Error: Database backup failed. Aborting deployment."
        exit 1
    fi
    
    build_and_push_images
    if [ $? -ne 0 ]; then
        echo "Error: Failed to build and push images. Aborting deployment."
        exit 1
    fi
    
    update_kubernetes_manifests
    if [ $? -ne 0 ]; then
        echo "Error: Failed to update Kubernetes manifests. Aborting deployment."
        exit 1
    fi
    
    apply_kubernetes_manifests
    if [ $? -ne 0 ]; then
        echo "Error: Failed to apply Kubernetes manifests. Initiating rollback."
        "${SCRIPT_DIR}/rollback.sh"
        exit 1
    fi
    
    run_database_migrations
    if [ $? -ne 0 ]; then
        echo "Error: Database migrations failed. Initiating rollback."
        "${SCRIPT_DIR}/rollback.sh"
        exit 1
    fi
    
    perform_smoke_tests
    if [ $? -ne 0 ]; then
        echo "Error: Smoke tests failed. Initiating rollback."
        "${SCRIPT_DIR}/rollback.sh"
        exit 1
    fi
    
    echo "Deployment completed successfully!"
    return 0
}

# Execute the main function
main

# Exit with the status of the main function
exit $?