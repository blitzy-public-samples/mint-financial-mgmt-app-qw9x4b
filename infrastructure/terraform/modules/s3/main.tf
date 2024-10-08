# Create the S3 bucket
resource "aws_s3_bucket" "main" {
  bucket = var.bucket_name
  tags   = var.tags

  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = true
  }
}

# Configure public access block for the S3 bucket
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for the S3 bucket
resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Configure server-side encryption for the S3 bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Define input variables
variable "bucket_name" {
  type        = string
  description = "Name of the S3 bucket to be created"
}

variable "tags" {
  type        = map(string)
  description = "Tags to be applied to the S3 bucket"
  default     = {}
}

# Define output values
output "bucket_id" {
  description = "The ID of the created S3 bucket"
  value       = aws_s3_bucket.main.id
}

output "bucket_arn" {
  description = "The ARN of the created S3 bucket"
  value       = aws_s3_bucket.main.arn
}