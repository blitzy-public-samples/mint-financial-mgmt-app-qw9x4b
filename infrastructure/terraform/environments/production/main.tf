terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

locals {
  environment = "production"
  common_tags = {
    Project     = "MintReplica"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = local.common_tags
  }
}

module "main" {
  source = "../../"

  aws_region             = var.aws_region
  environment            = local.environment
  vpc_cidr               = var.vpc_cidr
  terraform_state_bucket = var.terraform_state_bucket
  terraform_lock_table   = var.terraform_lock_table
  db_name                = var.db_name
  db_username            = var.db_username
  db_password            = var.db_password
  domain_name            = var.domain_name
}

variable "aws_region" {
  type        = string
  default     = "us-west-2"
  description = "The AWS region for the production environment"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "The CIDR block for the production VPC"
}

variable "terraform_state_bucket" {
  type        = string
  description = "The name of the S3 bucket to store Terraform state for production"
}

variable "terraform_lock_table" {
  type        = string
  description = "The name of the DynamoDB table for Terraform state locking in production"
}

variable "db_name" {
  type        = string
  default     = "mint_replica_prod"
  description = "The name of the production PostgreSQL database"
}

variable "db_username" {
  type        = string
  description = "The username for the production PostgreSQL database"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "The password for the production PostgreSQL database"
}

variable "domain_name" {
  type        = string
  description = "The domain name for the production Mint Replica application"
}

output "vpc_id" {
  description = "The ID of the production VPC"
  value       = module.main.vpc_id
}

output "public_subnets" {
  description = "List of IDs of public subnets in the production VPC"
  value       = module.main.public_subnets
}

output "private_subnets" {
  description = "List of IDs of private subnets in the production VPC"
  value       = module.main.private_subnets
}

output "ecs_cluster_name" {
  description = "Name of the production ECS cluster"
  value       = module.main.ecs_cluster_name
}

output "rds_endpoint" {
  description = "Endpoint of the production RDS instance"
  value       = module.main.rds_endpoint
}

output "api_gateway_url" {
  description = "URL of the production API Gateway"
  value       = module.main.api_gateway_url
}

output "cloudfront_domain_name" {
  description = "Domain name of the production CloudFront distribution"
  value       = module.main.cloudfront_domain_name
}

# Human tasks:
# TODO: Review and adjust the CIDR block for the production VPC
# TODO: Set up production-specific AWS credentials and configure AWS CLI
# TODO: Create production S3 bucket for Terraform state and DynamoDB table for state locking
# TODO: Review and customize production module configurations based on specific requirements
# TODO: Set up production-specific variables in a production.tfvars file
# TODO: Ensure that sensitive information like database credentials are stored securely (e.g., using AWS Secrets Manager)
# TODO: Set up proper IAM roles and policies for production environment
# TODO: Configure production-grade monitoring and alerting
# TODO: Set up proper backup and disaster recovery procedures for production data
# TODO: Implement additional security measures for production environment (e.g., WAF, GuardDuty)