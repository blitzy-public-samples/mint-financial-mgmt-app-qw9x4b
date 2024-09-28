# ElastiCache module for Mint Replica application

# Create ElastiCache subnet group
resource "aws_elasticache_subnet_group" "mint_replica" {
  name       = "${var.environment}-mint-replica-cache-subnet-group"
  subnet_ids = var.private_subnets
}

# Create ElastiCache parameter group
resource "aws_elasticache_parameter_group" "mint_replica" {
  family      = "redis6.x"
  name        = "${var.environment}-mint-replica-cache-params"
  description = "ElastiCache parameter group for Mint Replica"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }
}

# Create ElastiCache cluster
resource "aws_elasticache_cluster" "mint_replica" {
  cluster_id           = "${var.environment}-mint-replica-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = aws_elasticache_parameter_group.mint_replica.name
  subnet_group_name    = aws_elasticache_subnet_group.mint_replica.name
  security_group_ids   = [aws_security_group.elasticache.id]
  port                 = 6379
}

# Create security group for ElastiCache
resource "aws_security_group" "elasticache" {
  name        = "${var.environment}-mint-replica-elasticache-sg"
  description = "Security group for Mint Replica ElastiCache"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Define input variables
variable "environment" {
  type        = string
  description = "The environment (dev, staging, prod)"
}

variable "vpc_id" {
  type        = string
  description = "The ID of the VPC"
}

variable "private_subnets" {
  type        = list(string)
  description = "List of private subnet IDs"
}

variable "vpc_cidr" {
  type        = string
  description = "The CIDR block of the VPC"
}

# Define output values
output "cache_endpoint" {
  value       = aws_elasticache_cluster.mint_replica.cache_nodes[0].address
  description = "The DNS name of the ElastiCache cluster"
}

output "cache_port" {
  value       = aws_elasticache_cluster.mint_replica.port
  description = "The port number of the ElastiCache cluster"
}

# Human tasks (commented)
# TODO: Review and adjust the ElastiCache node type based on expected load
# TODO: Consider implementing multi-AZ deployment for production environments
# TODO: Review and adjust security group rules based on specific network requirements
# TODO: Implement CloudWatch alarms for ElastiCache monitoring