# CloudFront Distribution for Mint Replica Web Application

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

resource "aws_cloudfront_distribution" "main" {
  comment             = "CloudFront distribution for Mint Replica web application"
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = var.cloudfront_aliases

  origin {
    domain_name = var.s3_bucket_domain_name
    origin_id   = "S3-${var.s3_bucket_domain_name}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.s3_bucket_domain_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Enable logging
  logging_config {
    include_cookies = false
    bucket          = "${var.s3_bucket_domain_name}.s3.amazonaws.com"
    prefix          = "cloudfront_logs/"
  }

  # Add custom error response
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  tags = {
    Name        = "Mint Replica CloudFront Distribution"
    Environment = "Production"
  }
}

resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "Origin Access Identity for Mint Replica S3 bucket"
}

# Output values
output "cloudfront_distribution_id" {
  description = "ID of the created CloudFront distribution"
  value       = aws_cloudfront_distribution.main.id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.domain_name
}

# Variables
variable "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket hosting the web assets"
  type        = string
}

variable "cloudfront_aliases" {
  description = "List of domain aliases for the CloudFront distribution"
  type        = list(string)
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for SSL/TLS"
  type        = string
}