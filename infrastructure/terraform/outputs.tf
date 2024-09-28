# VPC Outputs
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

# ECS Outputs
output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.ecs.service_name
}

# RDS Output
output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = module.rds.db_instance_endpoint
}

# ElastiCache Output
output "elasticache_endpoint" {
  description = "Endpoint of the ElastiCache cluster"
  value       = module.elasticache.cache_nodes
}

# MongoDB Output
output "mongodb_connection_string" {
  description = "Connection string for MongoDB"
  value       = module.mongodb.connection_string
  sensitive   = true
}

# API Gateway Output
output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = module.api_gateway.api_endpoint
}

# Lambda Output
output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = module.lambda.function_name
}

# S3 Output
output "s3_bucket_name" {
  description = "Name of the S3 bucket for static assets"
  value       = module.s3.bucket_name
}

# CloudFront Outputs
output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cloudfront.domain_name
}

# Route53 Output
output "route53_name_servers" {
  description = "Name servers for the Route53 hosted zone"
  value       = module.route53.name_servers
}

# Human tasks (commented)
# TODO: Review and adjust output values based on specific project requirements
# TODO: Ensure sensitive outputs are marked as sensitive to prevent their values from being displayed in console output
# TODO: Verify that all necessary information is being output for use in other parts of the infrastructure or for reference