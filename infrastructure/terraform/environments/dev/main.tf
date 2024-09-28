# Terraform configuration for the development environment of the Mint Replica application

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
  environment  = "dev"
  project_name = "mint-replica"
}

module "main" {
  source = "../.."

  aws_region             = "us-west-2"
  environment            = local.environment
  vpc_cidr               = "10.0.0.0/16"
  terraform_state_bucket = "${local.project_name}-${local.environment}-tf-state"
  terraform_lock_table   = "${local.project_name}-${local.environment}-tf-lock"
  db_name                = "mint_replica_${local.environment}"
  db_username            = var.db_username
  db_password            = var.db_password
  domain_name            = "dev.mintreplica.com"
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

output "vpc_id" {
  description = "The ID of the VPC in the dev environment"
  value       = module.main.vpc_id
}

output "api_gateway_url" {
  description = "The URL of the API Gateway in the dev environment"
  value       = module.main.api_gateway_url
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution in the dev environment"
  value       = module.main.cloudfront_domain_name
}

# Human tasks:
# TODO: Review and adjust the VPC CIDR block for the dev environment
# TODO: Set up a secure method to provide database credentials (e.g., AWS Secrets Manager)
# TODO: Verify the domain name for the dev environment
# TODO: Create a dev.tfvars file with environment-specific variable values
# TODO: Ensure that the S3 bucket and DynamoDB table for Terraform state management are created for the dev environment