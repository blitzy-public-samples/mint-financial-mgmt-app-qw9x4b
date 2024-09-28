# MongoDB Terraform module

# Provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# Random password generator for DocumentDB
resource "random_password" "docdb_password" {
  length  = 16
  special = false
}

# DocumentDB Cluster
resource "aws_docdb_cluster" "main" {
  cluster_identifier      = "${var.project_name}-${var.environment}-docdb-cluster"
  engine                  = "docdb"
  master_username         = var.docdb_master_username
  master_password         = random_password.docdb_password.result
  backup_retention_period = 7
  preferred_backup_window = "02:00-03:00"
  skip_final_snapshot     = false
  vpc_security_group_ids  = [aws_security_group.docdb_sg.id]
  db_subnet_group_name    = aws_docdb_subnet_group.docdb_subnet_group.name

  tags = {
    Name        = "${var.project_name}-${var.environment}-docdb-cluster"
    Environment = var.environment
  }
}

# DocumentDB Cluster Instance
resource "aws_docdb_cluster_instance" "cluster_instances" {
  count              = var.docdb_instance_count
  identifier         = "${var.project_name}-${var.environment}-docdb-instance-${count.index}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.docdb_instance_class

  tags = {
    Name        = "${var.project_name}-${var.environment}-docdb-instance-${count.index}"
    Environment = var.environment
  }
}

# Security Group for DocumentDB
resource "aws_security_group" "docdb_sg" {
  name        = "${var.project_name}-${var.environment}-docdb-sg"
  description = "Security group for DocumentDB cluster"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-docdb-sg"
    Environment = var.environment
  }
}

# Subnet group for DocumentDB
resource "aws_docdb_subnet_group" "docdb_subnet_group" {
  name       = "${var.project_name}-${var.environment}-docdb-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "${var.project_name}-${var.environment}-docdb-subnet-group"
    Environment = var.environment
  }
}

# Output values
output "docdb_cluster_endpoint" {
  value       = aws_docdb_cluster.main.endpoint
  description = "Endpoint of the DocumentDB cluster"
}

output "docdb_cluster_port" {
  value       = aws_docdb_cluster.main.port
  description = "Port of the DocumentDB cluster"
}

output "docdb_master_username" {
  value       = aws_docdb_cluster.main.master_username
  description = "Master username of the DocumentDB cluster"
}

output "docdb_master_password" {
  value       = random_password.docdb_password.result
  description = "Master password of the DocumentDB cluster"
  sensitive   = true
}

# Variables
variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "environment" {
  type        = string
  description = "Deployment environment (e.g., dev, staging, production)"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC where DocumentDB will be deployed"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block of the VPC"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for DocumentDB deployment"
}

variable "docdb_master_username" {
  type        = string
  description = "Master username for DocumentDB cluster"
}

variable "docdb_instance_count" {
  type        = number
  description = "Number of DocumentDB instances to create"
  default     = 1
}

variable "docdb_instance_class" {
  type        = string
  description = "Instance class for DocumentDB instances"
  default     = "db.t3.medium"
}

# Human tasks (commented)
# TODO: Review and adjust the security group rules to ensure they align with the project's security requirements
# TODO: Confirm the backup retention period and preferred backup window meet the project's data protection needs
# TODO: Verify that the chosen instance class (db.t3.medium) is appropriate for the expected workload
# TODO: Implement a secure method for storing and retrieving the DocumentDB master password