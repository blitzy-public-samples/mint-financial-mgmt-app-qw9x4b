#!/bin/bash

# Run migrations for PostgreSQL and MongoDB databases in the Mint Replica application

# Source environment variables
source .env

# Function to run PostgreSQL migrations
run_postgresql_migrations() {
    echo "Running PostgreSQL migrations..."
    for migration in ../migrations/postgresql/*.ts; do
        echo "Applying migration: $migration"
        psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f $migration
    done
}

# Function to run MongoDB migrations
run_mongodb_migrations() {
    echo "Running MongoDB migrations..."
    for migration in ../migrations/mongodb/*.js; do
        echo "Applying migration: $migration"
        mongo $MONGO_URI --eval "load('$migration')"
    done
}

# Run PostgreSQL migrations
run_postgresql_migrations

# Run MongoDB migrations
run_mongodb_migrations

echo "All migrations completed successfully."

# List of human tasks (commented)
# TODO: Ensure that the PostgreSQL and MongoDB client tools are installed on the system where this script will run
# TODO: Verify that the .env file contains all necessary database connection details (DB_HOST, DB_USER, DB_NAME, MONGO_URI)
# TODO: Test the script with sample migrations to ensure it works as expected