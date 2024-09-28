#!/bin/bash

# Mint Replica Database Restoration Script
# This script restores PostgreSQL and MongoDB databases from backups

# Function to restore PostgreSQL database
restore_postgresql() {
    local backup_file="$1"
    local db_host="$2"
    local db_port="$3"
    local db_name="$4"
    local db_user="$5"

    # Check if the backup file exists
    if [ ! -f "$backup_file" ]; then
        echo "Error: PostgreSQL backup file not found: $backup_file"
        return 1
    fi

    # Verify PostgreSQL client is installed
    if ! command -v psql &> /dev/null; then
        echo "Error: PostgreSQL client (psql) is not installed"
        return 1
    fi

    # Use psql to restore the database from the backup file
    if PGPASSWORD="$PGPASSWORD" psql -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" < "$backup_file"; then
        echo "PostgreSQL database restored successfully"
    else
        echo "Error: Failed to restore PostgreSQL database"
        return 1
    fi
}

# Function to restore MongoDB database
restore_mongodb() {
    local backup_file="$1"
    local db_host="$2"
    local db_port="$3"
    local db_name="$4"

    # Check if the backup file exists
    if [ ! -f "$backup_file" ]; then
        echo "Error: MongoDB backup file not found: $backup_file"
        return 1
    fi

    # Verify MongoDB tools are installed
    if ! command -v mongorestore &> /dev/null; then
        echo "Error: MongoDB tools (mongorestore) are not installed"
        return 1
    fi

    # Use mongorestore to restore the database from the backup file
    if mongorestore --host "$db_host" --port "$db_port" --db "$db_name" --archive="$backup_file" --gzip; then
        echo "MongoDB database restored successfully"
    else
        echo "Error: Failed to restore MongoDB database"
        return 1
    fi
}

# Function to download the latest backup from S3
download_backup_from_s3() {
    local s3_bucket="$1"
    local backup_prefix="$2"
    local local_path="$3"

    # Verify AWS CLI is installed and configured
    if ! command -v aws &> /dev/null; then
        echo "Error: AWS CLI is not installed or configured"
        return 1
    fi

    # List objects in the S3 bucket with the given prefix
    latest_backup=$(aws s3 ls "s3://$s3_bucket/$backup_prefix" | sort | tail -n 1 | awk '{print $4}')

    if [ -z "$latest_backup" ]; then
        echo "Error: No backup files found in S3 bucket"
        return 1
    fi

    # Download the latest backup file to the specified local path
    if aws s3 cp "s3://$s3_bucket/$latest_backup" "$local_path"; then
        echo "Latest backup downloaded successfully: $latest_backup"
    else
        echo "Error: Failed to download the latest backup from S3"
        return 1
    fi
}

# Main function to orchestrate the database restoration process
main() {
    # Parse command-line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --s3-bucket)
                S3_BUCKET="$2"
                shift 2
                ;;
            --backup-prefix)
                BACKUP_PREFIX="$2"
                shift 2
                ;;
            --pg-host)
                PG_HOST="$2"
                shift 2
                ;;
            --pg-port)
                PG_PORT="$2"
                shift 2
                ;;
            --pg-db)
                PG_DB="$2"
                shift 2
                ;;
            --pg-user)
                PG_USER="$2"
                shift 2
                ;;
            --mongo-host)
                MONGO_HOST="$2"
                shift 2
                ;;
            --mongo-port)
                MONGO_PORT="$2"
                shift 2
                ;;
            --mongo-db)
                MONGO_DB="$2"
                shift 2
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Validate input parameters
    if [ -z "$S3_BUCKET" ] || [ -z "$BACKUP_PREFIX" ] || [ -z "$PG_HOST" ] || [ -z "$PG_PORT" ] || [ -z "$PG_DB" ] || [ -z "$PG_USER" ] || [ -z "$MONGO_HOST" ] || [ -z "$MONGO_PORT" ] || [ -z "$MONGO_DB" ]; then
        echo "Error: Missing required parameters"
        exit 1
    fi

    # Create a temporary directory for backups
    TEMP_DIR=$(mktemp -d)
    PG_BACKUP="$TEMP_DIR/pg_backup.sql"
    MONGO_BACKUP="$TEMP_DIR/mongo_backup.archive"

    # Download the latest backup from S3
    if ! download_backup_from_s3 "$S3_BUCKET" "$BACKUP_PREFIX" "$TEMP_DIR"; then
        echo "Error: Failed to download backup from S3"
        rm -rf "$TEMP_DIR"
        exit 1
    fi

    # Restore PostgreSQL database
    if ! restore_postgresql "$PG_BACKUP" "$PG_HOST" "$PG_PORT" "$PG_DB" "$PG_USER"; then
        echo "Error: Failed to restore PostgreSQL database"
        rm -rf "$TEMP_DIR"
        exit 1
    fi

    # Restore MongoDB database
    if ! restore_mongodb "$MONGO_BACKUP" "$MONGO_HOST" "$MONGO_PORT" "$MONGO_DB"; then
        echo "Error: Failed to restore MongoDB database"
        rm -rf "$TEMP_DIR"
        exit 1
    fi

    # Clean up temporary files
    rm -rf "$TEMP_DIR"

    echo "Database restoration completed successfully"
}

# Run the main function
main "$@"

# Human tasks:
# TODO: Provide actual S3 bucket name and backup prefix for production use
# TODO: Ensure proper access credentials are set up for S3 and databases
# TODO: Test the script in a staging environment before using in production