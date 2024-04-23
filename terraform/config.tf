provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "air_label_bucket" {
  bucket = "air-label-bucket"

  lifecycle_rule {
    id      = "expire_objects"
    enabled = true

    expiration {
      days = 1
    }

    noncurrent_version_expiration {
      days = 1
    }
  }
}

resource "aws_iam_user" "s3_user" {
  name = "air-label-s3-user"
}

resource "aws_iam_policy" "s3_policy" {
  name        = "air-label-s3-access-policy"
  path        = "/"
  description = "Policy for S3 operations in air-label-bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.air_label_bucket.arn}/*",
          "${aws_s3_bucket.air_label_bucket.arn}"
        ]
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "user_policy_attachment" {
  user       = aws_iam_user.s3_user.name
  policy_arn = aws_iam_policy.s3_policy.arn
}
