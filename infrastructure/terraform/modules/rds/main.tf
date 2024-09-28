# RDS Module for Mint Replica Application

# Provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# RDS instance
resource "aws_db_instance" "this" {
  identifier        = var.identifier
  engine            = "postgres"
  engine_version    = var.engine_version
  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage
  storage_type      = "gp2"
  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds.arn

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = 5432

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.rds.name
  parameter_group_name   = aws_db_parameter_group.rds.name

  backup_retention_period = 7
  multi_az               = var.multi_az
  skip_final_snapshot    = false
  final_snapshot_identifier = "${var.identifier}-final-snapshot"

  tags = {
    Name        = "MintReplica-RDS"
    Environment = var.environment
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "rds" {
  name       = "${var.identifier}-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "MintReplica-RDS-SubnetGroup"
    Environment = var.environment
  }
}

# RDS Parameter Group
resource "aws_db_parameter_group" "rds" {
  family = "postgres13"
  name   = "${var.identifier}-param-group"

  parameter {
    name  = "max_connections"
    value = "100"
  }

  parameter {
    name  = "shared_buffers"
    value = "{DBInstanceClassMemory/32768}"
  }

  tags = {
    Name        = "MintReplica-RDS-ParamGroup"
    Environment = var.environment
  }
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name   = "${var.identifier}-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
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
    Name        = "MintReplica-RDS-SG"
    Environment = var.environment
  }
}

# KMS Key for RDS encryption
resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 10

  tags = {
    Name        = "MintReplica-RDS-KMS"
    Environment = var.environment
  }
}

# Output values
output "rds_endpoint" {
  value       = aws_db_instance.this.endpoint
  description = "Endpoint of the RDS instance"
}

output "rds_port" {
  value       = aws_db_instance.this.port
  description = "Port of the RDS instance"
}

output "rds_username" {
  value       = aws_db_instance.this.username
  description = "Master username of the RDS instance"
}

output "rds_db_name" {
  value       = aws_db_instance.this.db_name
  description = "Database name"
}

# Variables
variable "identifier" {
  type        = string
  description = "Identifier for the RDS instance"
}

variable "engine_version" {
  type        = string
  description = "Version of PostgreSQL engine"
}

variable "instance_class" {
  type        = string
  description = "Instance class for the RDS instance"
}

variable "allocated_storage" {
  type        = number
  description = "Allocated storage in gigabytes"
}

variable "db_name" {
  type        = string
  description = "Name of the database to create"
}

variable "db_username" {
  type        = string
  description = "Username for the database"
}

variable "db_password" {
  type        = string
  description = "Password for the database"
}

variable "multi_az" {
  type        = bool
  description = "Specifies if the RDS instance is multi-AZ"
}

variable "environment" {
  type        = string
  description = "Environment (e.g., dev, staging, production)"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs for the RDS instance"
}

variable "vpc_id" {
  type        = string
  description = "ID of the VPC"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block of the VPC"
}