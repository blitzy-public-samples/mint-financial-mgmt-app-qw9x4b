#!/bin/bash

# Mint Replica - Monitoring Setup Script
# This script sets up monitoring for the Mint Replica application infrastructure

# Ensure required tools are installed
command -v aws >/dev/null 2>&1 || { echo >&2 "AWS CLI is required but not installed. Aborting."; exit 1; }
command -v jq >/dev/null 2>&1 || { echo >&2 "jq is required but not installed. Aborting."; exit 1; }

# Function to set up CloudWatch alarms
setup_cloudwatch_alarms() {
    echo "Setting up CloudWatch alarms..."

    # Set up CPU utilization alarms for ECS services
    aws cloudwatch put-metric-alarm \
        --alarm-name "ECS-CPU-Utilization-High" \
        --alarm-description "Alarm when CPU exceeds 70% for 5 minutes" \
        --metric-name CPUUtilization \
        --namespace AWS/ECS \
        --statistic Average \
        --period 300 \
        --threshold 70 \
        --comparison-operator GreaterThanThreshold \
        --dimensions Name=ClusterName,Value=MintReplicaCluster \
        --evaluation-periods 2 \
        --alarm-actions arn:aws:sns:us-east-1:123456789012:MintReplicaAlerts \
        --unit Percent

    # Set up memory utilization alarms for ECS services
    aws cloudwatch put-metric-alarm \
        --alarm-name "ECS-Memory-Utilization-High" \
        --alarm-description "Alarm when Memory exceeds 80% for 5 minutes" \
        --metric-name MemoryUtilization \
        --namespace AWS/ECS \
        --statistic Average \
        --period 300 \
        --threshold 80 \
        --comparison-operator GreaterThanThreshold \
        --dimensions Name=ClusterName,Value=MintReplicaCluster \
        --evaluation-periods 2 \
        --alarm-actions arn:aws:sns:us-east-1:123456789012:MintReplicaAlerts \
        --unit Percent

    # Set up RDS database connection count alarms
    aws cloudwatch put-metric-alarm \
        --alarm-name "RDS-Connection-Count-High" \
        --alarm-description "Alarm when database connections exceed 80% of max for 5 minutes" \
        --metric-name DatabaseConnections \
        --namespace AWS/RDS \
        --statistic Average \
        --period 300 \
        --threshold 80 \
        --comparison-operator GreaterThanThreshold \
        --dimensions Name=DBInstanceIdentifier,Value=mint-replica-db \
        --evaluation-periods 2 \
        --alarm-actions arn:aws:sns:us-east-1:123456789012:MintReplicaAlerts \
        --unit Count

    # Set up ElastiCache memory usage alarms
    aws cloudwatch put-metric-alarm \
        --alarm-name "ElastiCache-Memory-High" \
        --alarm-description "Alarm when ElastiCache memory usage exceeds 80% for 5 minutes" \
        --metric-name DatabaseMemoryUsagePercentage \
        --namespace AWS/ElastiCache \
        --statistic Average \
        --period 300 \
        --threshold 80 \
        --comparison-operator GreaterThanThreshold \
        --dimensions Name=CacheClusterId,Value=mint-replica-cache \
        --evaluation-periods 2 \
        --alarm-actions arn:aws:sns:us-east-1:123456789012:MintReplicaAlerts \
        --unit Percent

    # Set up API Gateway 4xx and 5xx error rate alarms
    aws cloudwatch put-metric-alarm \
        --alarm-name "APIGateway-4XX-Errors-High" \
        --alarm-description "Alarm when 4XX errors exceed 5% for 5 minutes" \
        --metric-name 4XXError \
        --namespace AWS/ApiGateway \
        --statistic Average \
        --period 300 \
        --threshold 5 \
        --comparison-operator GreaterThanThreshold \
        --dimensions Name=ApiName,Value=MintReplicaAPI \
        --evaluation-periods 2 \
        --alarm-actions arn:aws:sns:us-east-1:123456789012:MintReplicaAlerts \
        --unit Percent

    aws cloudwatch put-metric-alarm \
        --alarm-name "APIGateway-5XX-Errors-High" \
        --alarm-description "Alarm when 5XX errors exceed 1% for 5 minutes" \
        --metric-name 5XXError \
        --namespace AWS/ApiGateway \
        --statistic Average \
        --period 300 \
        --threshold 1 \
        --comparison-operator GreaterThanThreshold \
        --dimensions Name=ApiName,Value=MintReplicaAPI \
        --evaluation-periods 2 \
        --alarm-actions arn:aws:sns:us-east-1:123456789012:MintReplicaAlerts \
        --unit Percent

    echo "CloudWatch alarms set up successfully."
}

# Function to set up log groups
setup_log_groups() {
    echo "Setting up CloudWatch Log Groups..."

    # Create log groups for backend services
    aws logs create-log-group --log-group-name "/mint-replica/backend"
    aws logs put-retention-policy --log-group-name "/mint-replica/backend" --retention-in-days 30

    # Create log groups for frontend services
    aws logs create-log-group --log-group-name "/mint-replica/frontend"
    aws logs put-retention-policy --log-group-name "/mint-replica/frontend" --retention-in-days 30

    # Set retention periods for log groups
    aws logs put-retention-policy --log-group-name "/aws/lambda/mint-replica-functions" --retention-in-days 90

    # Configure log group subscription filters if needed
    # aws logs put-subscription-filter \
    #     --log-group-name "/mint-replica/backend" \
    #     --filter-name "ErrorFilter" \
    #     --filter-pattern "ERROR" \
    #     --destination-arn "arn:aws:lambda:us-east-1:123456789012:function:log-processor" \
    #     --role-arn "arn:aws:iam::123456789012:role/CloudWatchLogsRole"

    echo "CloudWatch Log Groups set up successfully."
}

# Function to set up CloudWatch dashboard
setup_dashboard() {
    echo "Setting up CloudWatch dashboard..."

    # Create a new CloudWatch dashboard
    aws cloudwatch put-dashboard --dashboard-name "MintReplicaDashboard" --dashboard-body file://dashboard-config.json

    # Note: The dashboard-config.json file should be created separately with the desired widget configurations

    echo "CloudWatch dashboard created successfully."
    echo "Dashboard URL: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=MintReplicaDashboard"
}

# Function to set up custom metrics
setup_custom_metrics() {
    echo "Setting up custom CloudWatch metrics..."

    # Set up custom metric for user login rate
    aws cloudwatch put-metric-data \
        --namespace "MintReplica/UserActivity" \
        --metric-name "UserLoginRate" \
        --unit "Count/Second" \
        --value 0 \
        --dimensions Service=Authentication

    # Set up custom metric for transaction processing time
    aws cloudwatch put-metric-data \
        --namespace "MintReplica/Transactions" \
        --metric-name "TransactionProcessingTime" \
        --unit "Milliseconds" \
        --value 0 \
        --dimensions Service=TransactionProcessor

    # Set up custom metric for API response times
    aws cloudwatch put-metric-data \
        --namespace "MintReplica/API" \
        --metric-name "APIResponseTime" \
        --unit "Milliseconds" \
        --value 0 \
        --dimensions Service=APIGateway

    # Set up custom metric for error rates by service
    aws cloudwatch put-metric-data \
        --namespace "MintReplica/Errors" \
        --metric-name "ErrorRate" \
        --unit "Count/Second" \
        --value 0 \
        --dimensions Service=All

    echo "Custom CloudWatch metrics set up successfully."
}

# Main function to orchestrate the monitoring setup process
main() {
    echo "Starting Mint Replica monitoring setup..."

    setup_cloudwatch_alarms
    setup_log_groups
    setup_dashboard
    setup_custom_metrics

    echo "Mint Replica monitoring setup completed successfully."
}

# Run the main function
main

# Pending human tasks:
# TODO: Define specific threshold values for CloudWatch alarms based on application requirements and expected load
# TODO: Determine the appropriate log retention periods for different log groups
# TODO: Identify any additional custom metrics that may be needed for comprehensive monitoring