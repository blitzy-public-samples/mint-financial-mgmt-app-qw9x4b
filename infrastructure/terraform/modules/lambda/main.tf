# AWS Lambda Function
resource "aws_lambda_function" "this" {
  function_name    = var.function_name
  handler          = var.handler
  runtime          = var.runtime
  filename         = var.filename
  source_code_hash = filebase64sha256(var.filename)
  role             = aws_iam_role.lambda_role.arn

  environment {
    variables = var.environment_variables
  }

  timeout     = var.timeout
  memory_size = var.memory_size

  vpc_config {
    subnet_ids         = var.vpc_config.subnet_ids
    security_group_ids = var.vpc_config.security_group_ids
  }

  tags = var.tags
}

# IAM Role for Lambda Function
resource "aws_iam_role" "lambda_role" {
  name = "${var.function_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# Attach necessary policies to the Lambda IAM role
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# CloudWatch Log Group for Lambda Function
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = 14
  tags              = var.tags
}

# Outputs
output "lambda_function_arn" {
  description = "ARN of the created Lambda function"
  value       = aws_lambda_function.this.arn
}

output "lambda_function_name" {
  description = "Name of the created Lambda function"
  value       = aws_lambda_function.this.function_name
}

output "lambda_function_invoke_arn" {
  description = "Invoke ARN of the created Lambda function"
  value       = aws_lambda_function.this.invoke_arn
}

# Variables
variable "function_name" {
  type        = string
  description = "Name of the Lambda function"
}

variable "handler" {
  type        = string
  description = "Handler for the Lambda function"
}

variable "runtime" {
  type        = string
  description = "Runtime for the Lambda function"
}

variable "filename" {
  type        = string
  description = "Path to the Lambda deployment package"
}

variable "environment_variables" {
  type        = map(string)
  description = "Environment variables for the Lambda function"
  default     = {}
}

variable "timeout" {
  type        = number
  description = "Timeout for the Lambda function in seconds"
  default     = 3
}

variable "memory_size" {
  type        = number
  description = "Memory size for the Lambda function in MB"
  default     = 128
}

variable "vpc_config" {
  type = object({
    subnet_ids         = list(string)
    security_group_ids = list(string)
  })
  description = "VPC configuration for the Lambda function"
  default = {
    subnet_ids         = []
    security_group_ids = []
  }
}

variable "tags" {
  type        = map(string)
  description = "Tags to be applied to the Lambda function and related resources"
  default     = {}
}

# Human tasks (commented)
# TODO: Review and adjust Lambda function configuration based on specific project requirements
# TODO: Ensure proper IAM policies are attached to the Lambda role based on function requirements
# TODO: Verify VPC configuration if Lambda needs to access VPC resources
# TODO: Set up appropriate CloudWatch log retention period