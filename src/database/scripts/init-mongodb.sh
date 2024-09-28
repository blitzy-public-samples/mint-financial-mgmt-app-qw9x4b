#!/bin/bash

# Source environment variables
source .env

# Check if MongoDB URI is set
if [ -z "$MONGODB_URI" ]; then
    echo "Error: MONGODB_URI is not set. Please set it in the .env file."
    exit 1
fi

# Check if MongoDB database name is set
if [ -z "$MONGODB_DB_NAME" ]; then
    echo "Error: MONGODB_DB_NAME is not set. Please set it in the .env file."
    exit 1
fi

# Connect to MongoDB and create database
mongo "$MONGODB_URI" <<EOF
use $MONGODB_DB_NAME

# Create collections
db.createCollection("user_preferences")
db.createCollection("financial_insights")
db.createCollection("investment_portfolios")
db.createCollection("credit_scores")

# Create indexes
db.user_preferences.createIndex({ "user_id": 1 }, { unique: true })
db.financial_insights.createIndex({ "user_id": 1, "date": 1 })
db.investment_portfolios.createIndex({ "user_id": 1 })
db.credit_scores.createIndex({ "user_id": 1, "date": 1 })

# Set up any initial configurations or default documents
# (Add any necessary insert operations here)

print("MongoDB initialization completed successfully.")
EOF

# Check if the MongoDB initialization was successful
if [ $? -eq 0 ]; then
    echo "MongoDB initialization completed successfully."
else
    echo "Error: MongoDB initialization failed."
    exit 1
fi

# Human tasks (commented)
# TODO: Review and adjust MongoDB collection names and indexes based on final data model
# TODO: Implement proper error handling and logging for production use
# TODO: Set up appropriate authentication mechanism for MongoDB in production
# TODO: Create a separate script or process for seeding initial data if needed