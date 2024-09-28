# Import required providers
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# Define variables
variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, production)"
}

variable "lambda_invoke_arn" {
  type        = string
  description = "The ARN of the Lambda function to invoke"
}

# Create API Gateway
resource "aws_api_gateway_rest_api" "mint_replica_api" {
  name        = "MintReplicaAPI-${var.environment}"
  description = "API Gateway for Mint Replica application"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# Create API Gateway resource
resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.mint_replica_api.id
  parent_id   = aws_api_gateway_rest_api.mint_replica_api.root_resource_id
  path_part   = "{proxy+}"
}

# Create API Gateway method
resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.mint_replica_api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

# Create API Gateway integration
resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.mint_replica_api.id
  resource_id = aws_api_gateway_resource.proxy.id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# Create API Gateway deployment
resource "aws_api_gateway_deployment" "mint_replica" {
  depends_on = [aws_api_gateway_integration.lambda]

  rest_api_id = aws_api_gateway_rest_api.mint_replica_api.id
  stage_name  = var.environment
}

# Define outputs
output "api_gateway_id" {
  description = "ID of the created API Gateway"
  value       = aws_api_gateway_rest_api.mint_replica_api.id
}

output "api_gateway_stage_name" {
  description = "Name of the deployment stage"
  value       = aws_api_gateway_deployment.mint_replica.stage_name
}

output "api_endpoint" {
  description = "Endpoint URL of the API Gateway"
  value       = aws_api_gateway_deployment.mint_replica.invoke_url
}

# Human tasks (commented)
# TODO: Review and adjust the API Gateway configuration based on specific requirements
# TODO: Implement proper authorization for the API Gateway methods (Critical)
# TODO: Set up API Gateway models and request/response mappings if needed (Optional)
# TODO: Configure API Gateway stages for different environments
# TODO: Set up custom domain name for the API Gateway (Optional)
# TODO: Implement API Gateway usage plans and API keys if required (Optional)