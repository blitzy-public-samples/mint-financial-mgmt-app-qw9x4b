# ECS Module for Mint Replica Application

# Provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "mint_replica_cluster" {
  name = "${var.environment}-mint-replica-cluster"
  tags = {
    Name        = "${var.environment}-mint-replica-cluster"
    Environment = var.environment
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "mint_replica_task" {
  family                   = "${var.environment}-mint-replica-task"
  cpu                      = 256
  memory                   = 512
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "mint-replica-app"
      image = "${var.ecr_repository_url}:${var.app_version}"
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.environment}-mint-replica"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "mint_replica_service" {
  name            = "${var.environment}-mint-replica-service"
  cluster         = aws_ecs_cluster.mint_replica_cluster.id
  task_definition = aws_ecs_task_definition.mint_replica_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.mint_replica.arn
    container_name   = "mint-replica-app"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.mint_replica]
}

# Security Group for ECS Tasks
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.environment}-ecs-tasks-sg"
  description = "Allow inbound access from the ALB only"
  vpc_id      = var.vpc_id

  ingress {
    protocol        = "tcp"
    from_port       = 3000
    to_port         = 3000
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Application Load Balancer
resource "aws_alb" "mint_replica" {
  name               = "${var.environment}-mint-replica-alb"
  subnets            = var.private_subnets
  security_groups    = [aws_security_group.alb.id]
  internal           = false
  load_balancer_type = "application"
}

# ALB Target Group
resource "aws_lb_target_group" "mint_replica" {
  name        = "${var.environment}-mint-replica-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    healthy_threshold   = 3
    interval            = 30
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = 3
    path                = "/health"
    unhealthy_threshold = 2
  }
}

# ALB Listener
resource "aws_lb_listener" "mint_replica" {
  load_balancer_arn = aws_alb.mint_replica.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.mint_replica.id
  }
}

# Security Group for ALB
resource "aws_security_group" "alb" {
  name        = "${var.environment}-alb-sg"
  description = "Controls access to the ALB"
  vpc_id      = var.vpc_id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.environment}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  ]
}

# Output values
output "cluster_id" {
  value       = aws_ecs_cluster.mint_replica_cluster.id
  description = "The ID of the ECS cluster"
}

output "alb_dns_name" {
  value       = aws_alb.mint_replica.dns_name
  description = "The DNS name of the Application Load Balancer"
}

output "ecs_task_execution_role_arn" {
  value       = aws_iam_role.ecs_execution_role.arn
  description = "The ARN of the ECS task execution role"
}

# Variables
variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, production)"
}

variable "vpc_id" {
  type        = string
  description = "The ID of the VPC"
}

variable "private_subnets" {
  type        = list(string)
  description = "List of private subnet IDs"
}

variable "ecr_repository_url" {
  type        = string
  description = "The URL of the ECR repository containing the application image"
}

variable "app_version" {
  type        = string
  description = "The version tag of the application image to deploy"
}

variable "aws_region" {
  type        = string
  description = "The AWS region to deploy the ECS resources"
}

# TODO: Review and adjust the ECS task definition CPU and memory values based on application requirements
# TODO: Set up ECR repository and push the application image
# TODO: Configure environment-specific variables for the ECS task definition
# TODO: Review and adjust the desired count of ECS tasks based on expected load
# TODO: Set up HTTPS listener and SSL certificate for the ALB in production environment
# TODO: Review and adjust security group rules based on specific security requirements