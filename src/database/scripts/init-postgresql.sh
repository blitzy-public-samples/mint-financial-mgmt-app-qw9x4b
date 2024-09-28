#!/bin/bash

# Source the environment variables
source .env

# PostgreSQL connection details
PGHOST=${DB_HOST}
PGPORT=${DB_PORT}
PGUSER=${DB_SUPERUSER}
PGPASSWORD=${DB_SUPERUSER_PASSWORD}

# Application database details
APP_DB_NAME=${DB_NAME}
APP_DB_USER=${DB_USER}
APP_DB_PASSWORD=${DB_PASSWORD}

# Function to check if a command was successful
check_command() {
    if [ $? -ne 0 ]; then
        echo "Error: $1"
        exit 1
    fi
}

# Create application database
psql -c "CREATE DATABASE $APP_DB_NAME;"
check_command "Failed to create database $APP_DB_NAME"

# Create application user
psql -c "CREATE USER $APP_DB_USER WITH ENCRYPTED PASSWORD '$APP_DB_PASSWORD';"
check_command "Failed to create user $APP_DB_USER"

# Grant privileges to application user
psql -c "GRANT ALL PRIVILEGES ON DATABASE $APP_DB_NAME TO $APP_DB_USER;"
check_command "Failed to grant privileges to $APP_DB_USER"

# Connect to the application database
psql -d $APP_DB_NAME << EOF
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS app_public;
CREATE SCHEMA IF NOT EXISTS app_private;

-- Set search path
ALTER DATABASE $APP_DB_NAME SET search_path TO app_public, app_private, public;

-- Grant usage on schemas
GRANT USAGE ON SCHEMA app_public TO $APP_DB_USER;
GRANT USAGE ON SCHEMA app_private TO $APP_DB_USER;

-- Grant privileges on future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA app_public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $APP_DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_public GRANT USAGE, SELECT ON SEQUENCES TO $APP_DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_private GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $APP_DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_private GRANT USAGE, SELECT ON SEQUENCES TO $APP_DB_USER;

EOF
check_command "Failed to execute SQL commands on $APP_DB_NAME"

echo "PostgreSQL database initialization completed successfully."

# Human tasks (commented)
: <<'HUMAN_TASKS'
Human tasks to be addressed:
1. Review and adjust database user permissions based on specific application requirements (Required)
2. Ensure that sensitive database credentials are properly secured and not exposed in the script (Critical)
3. Implement error handling and logging for each step of the initialization process (Required)
4. Consider adding a check to prevent accidental reinitialization of an existing database (Required)
HUMAN_TASKS