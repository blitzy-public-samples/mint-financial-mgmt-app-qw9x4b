# Main Terraform configuration file for the Mint Replica application infrastructure

# Specify the required Terraform version and providers
terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  # Configure the backend to store the Terraform state in an S3 bucket
  backend "s3" {
    bucket         = "${var.terraform_state_bucket}"
    key            = "mint-replica/terraform.tfstate"
    region         = "${var.aws_region}"
    encrypt        = true
    dynamodb_table = "${var.terraform_lock_table}"
  }
}

# Configure the AWS provider
provider "aws" {
  region = var.aws_region
  
  default_tags {
    Project     = "MintReplica"
    Environment = var.environment
  }
}

# Data source to fetch available AWS Availability Zones
data "aws_availability_zones" "available" {
  state = "available"
}

# VPC Module
module "vpc" {
  source      = "./modules/vpc"
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  azs         = data.aws_availability_zones.available.names
}

# ECS Module
module "ecs" {
  source          = "./modules/ecs"
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
}

# RDS Module
module "rds" {
  source          = "./modules/rds"
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  db_name         = var.db_name
  db_username     = var.db_username
  db_password     = var.db_password
}

# ElastiCache Module
module "elasticache" {
  source          = "./modules/elasticache"
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
}

# MongoDB Module
module "mongodb" {
  source          = "./modules/mongodb"
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
}

# API Gateway Module
module "api_gateway" {
  source      = "./modules/api_gateway"
  environment = var.environment
}

# Lambda Module
module "lambda" {
  source          = "./modules/lambda"
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
}

# S3 Module
module "s3" {
  source      = "./modules/s3"
  environment = var.environment
}

# CloudFront Module
module "cloudfront" {
  source       = "./modules/cloudfront"
  environment  = var.environment
  s3_bucket_id = module.s3.bucket_id
}

# Route53 Module
module "route53" {
  source                    = "./modules/route53"
  environment               = var.environment
  domain_name               = var.domain_name
  cloudfront_distribution_id = module.cloudfront.distribution_id
}

# Commented list of human tasks
# TODO: Review and adjust the CIDR block for the VPC
# TODO: Set up AWS credentials and configure AWS CLI
# TODO: Create S3 bucket for Terraform state and DynamoDB table for state locking
# TODO: Review and customize module configurations based on specific requirements
# TODO: Set up environment-specific variables in a tfvars file