terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket         = "mint-replica-terraform-state-staging"
    key            = "mint-replica/staging/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "mint-replica-terraform-locks-staging"
  }
}

provider "aws" {
  region = "us-west-2"
  default_tags {
    Project     = "MintReplica"
    Environment = "staging"
  }
}

module "main" {
  source = "../../"

  environment = "staging"
  aws_region  = "us-west-2"
  vpc_cidr    = "10.1.0.0/16"

  domain_name  = "staging.mintreplica.com"
  db_name      = "mint_replica_staging"
  db_username  = "admin"
  db_password  = var.db_password
}

variable "db_password" {
  description = "Password for the RDS database"
  type        = string
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = module.main.vpc_id
}

output "db_endpoint" {
  description = "Endpoint of the RDS database"
  value       = module.main.db_endpoint
}

output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = module.main.api_gateway_url
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.main.cloudfront_distribution_id
}

# Human tasks:
# TODO: Set the correct S3 bucket name for Terraform state storage
# TODO: Configure the correct DynamoDB table name for state locking
# TODO: Review and adjust the VPC CIDR block if necessary
# TODO: Set up the correct domain name for the staging environment
# TODO: Ensure the db_password variable is securely stored and not committed to version control
# TODO: Review and customize module inputs based on staging environment requirements