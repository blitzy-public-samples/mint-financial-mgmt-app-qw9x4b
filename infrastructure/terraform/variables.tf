variable "aws_region" {
  type        = string
  description = "The AWS region where resources will be created"
  default     = "us-west-2"
}

variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, production)"
  default     = "dev"
}

variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "terraform_state_bucket" {
  type        = string
  description = "The name of the S3 bucket to store Terraform state"
}

variable "terraform_lock_table" {
  type        = string
  description = "The name of the DynamoDB table for Terraform state locking"
}

variable "db_name" {
  type        = string
  description = "The name of the PostgreSQL database"
  default     = "mint_replica"
}

variable "db_username" {
  type        = string
  description = "The username for the PostgreSQL database"
}

variable "db_password" {
  type        = string
  description = "The password for the PostgreSQL database"
  sensitive   = true
}

variable "domain_name" {
  type        = string
  description = "The domain name for the Mint Replica application"
}

# Additional variables for comprehensive infrastructure setup

variable "ecs_cluster_name" {
  type        = string
  description = "The name of the ECS cluster"
  default     = "mint-replica-cluster"
}

variable "ecs_task_cpu" {
  type        = number
  description = "The number of CPU units for the ECS task"
  default     = 256
}

variable "ecs_task_memory" {
  type        = number
  description = "The amount of memory (in MiB) for the ECS task"
  default     = 512
}

variable "rds_instance_class" {
  type        = string
  description = "The instance class for the RDS PostgreSQL database"
  default     = "db.t3.micro"
}

variable "redis_node_type" {
  type        = string
  description = "The node type for the ElastiCache Redis cluster"
  default     = "cache.t3.micro"
}

variable "mongodb_instance_type" {
  type        = string
  description = "The instance type for the MongoDB cluster"
  default     = "t3.micro"
}

variable "api_gateway_stage_name" {
  type        = string
  description = "The stage name for the API Gateway deployment"
  default     = "v1"
}

variable "lambda_runtime" {
  type        = string
  description = "The runtime for Lambda functions"
  default     = "nodejs14.x"
}

variable "s3_frontend_bucket" {
  type        = string
  description = "The name of the S3 bucket for frontend static files"
}

variable "cloudfront_price_class" {
  type        = string
  description = "The price class for CloudFront distribution"
  default     = "PriceClass_100"
}

variable "route53_zone_id" {
  type        = string
  description = "The Route 53 hosted zone ID for the domain"
}

# Tags for resource management
variable "tags" {
  type = map(string)
  description = "Tags to be applied to all resources"
  default = {
    Project     = "MintReplica"
    ManagedBy   = "Terraform"
  }
}