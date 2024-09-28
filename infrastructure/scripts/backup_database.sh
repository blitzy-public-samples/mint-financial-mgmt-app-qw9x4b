#!/bin/bash

# Mint Replica Database Backup Script
# This script performs automated backups of PostgreSQL and MongoDB databases for the Mint Replica application.

# Set global variables
BACKUP_DIR="/tmp/mint_replica_backups"
S3_BUCKET="mint-replica-backups"
RETENTION_DAYS=30

# Function to check if required tools are installed
check_dependencies() {
    local missing_deps=0

    if ! command -v psql &> /dev/null; then
        echo "Error: postgresql-client is not installed."
        missing_deps=1
    fi

    if ! command -v mongodump &> /dev/null; then
        echo "Error: mongodump is not installed."
        missing_deps=1
    fi

    if ! command -v aws &> /dev/null; then
        echo "Error: aws-cli is not installed."
        missing_deps=1
    fi

    return $missing_deps
}

# Function to backup PostgreSQL databases
backup_postgresql() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${BACKUP_DIR}/postgresql_backup_${timestamp}.sql"

    echo "Backing up PostgreSQL databases..."
    pg_dumpall -f "$backup_file"

    if [ $? -eq 0 ]; then
        echo "PostgreSQL backup created successfully."
        gzip "$backup_file"
        echo "Backup compressed: ${backup_file}.gz"
        echo "${backup_file}.gz"
    else
        echo "Error: PostgreSQL backup failed."
        return 1
    fi
}

# Function to backup MongoDB databases
backup_mongodb() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="${BACKUP_DIR}/mongodb_backup_${timestamp}"

    echo "Backing up MongoDB databases..."
    mongodump --out "$backup_dir"

    if [ $? -eq 0 ]; then
        echo "MongoDB backup created successfully."
        tar -czf "${backup_dir}.tar.gz" -C "$backup_dir" .
        rm -rf "$backup_dir"
        echo "Backup compressed: ${backup_dir}.tar.gz"
        echo "${backup_dir}.tar.gz"
    else
        echo "Error: MongoDB backup failed."
        return 1
    fi
}

# Function to upload backup files to S3
upload_to_s3() {
    local file_path="$1"

    echo "Uploading $file_path to S3 bucket $S3_BUCKET..."
    aws s3 cp "$file_path" "s3://${S3_BUCKET}/"

    if [ $? -eq 0 ]; then
        echo "Upload successful."
        return 0
    else
        echo "Error: Upload failed."
        return 1
    fi
}

# Function to remove old backups from S3 based on retention policy
cleanup_old_backups() {
    echo "Cleaning up old backups..."
    local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%s)

    aws s3 ls "s3://${S3_BUCKET}/" | while read -r line; do
        local file_date=$(echo "$line" | awk '{print $1" "$2}')
        local file_name=$(echo "$line" | awk '{print $4}')
        local file_timestamp=$(date -d "$file_date" +%s)

        if [ "$file_timestamp" -lt "$cutoff_date" ]; then
            echo "Deleting old backup: $file_name"
            aws s3 rm "s3://${S3_BUCKET}/${file_name}"
        fi
    done

    return 0
}

# Main function to orchestrate the backup process
main() {
    echo "Starting Mint Replica database backup process..."

    # Check dependencies
    check_dependencies
    if [ $? -ne 0 ]; then
        echo "Error: Missing dependencies. Exiting."
        exit 1
    fi

    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_DIR"

    # Backup PostgreSQL
    pg_backup_file=$(backup_postgresql)
    if [ $? -ne 0 ]; then
        echo "PostgreSQL backup failed. Exiting."
        exit 1
    fi

    # Backup MongoDB
    mongo_backup_file=$(backup_mongodb)
    if [ $? -ne 0 ]; then
        echo "MongoDB backup failed. Exiting."
        exit 1
    fi

    # Upload PostgreSQL backup to S3
    upload_to_s3 "$pg_backup_file"
    if [ $? -ne 0 ]; then
        echo "Failed to upload PostgreSQL backup to S3. Exiting."
        exit 1
    fi

    # Upload MongoDB backup to S3
    upload_to_s3 "$mongo_backup_file"
    if [ $? -ne 0 ]; then
        echo "Failed to upload MongoDB backup to S3. Exiting."
        exit 1
    fi

    # Cleanup old backups
    cleanup_old_backups
    if [ $? -ne 0 ]; then
        echo "Warning: Failed to clean up old backups."
    fi

    # Clean up local backup files
    rm -f "$pg_backup_file" "$mongo_backup_file"

    echo "Mint Replica database backup process completed successfully."
    exit 0
}

# Run the main function
main

# Human tasks (commented out):
# TODO: Set up appropriate environment variables for database connections (PGHOST, PGUSER, PGPASSWORD, etc.)
# TODO: Configure AWS credentials for S3 access
# TODO: Review and adjust the RETENTION_DAYS value based on specific backup retention requirements
# TODO: Implement appropriate error handling and logging mechanisms
# TODO: Set up a scheduled job (e.g., cron) to run this script regularly