---
title: '100 Days of Cloud Security - Day 51: Cloud Security Journey'
date: '2025-12-30'
author: 'Venkata Pathuri'
excerpt: 'Day 51 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 51: Cloud Security Journey

## Overview
Welcome to Day 51 of our cloud security journey! Having laid the groundwork for securing our resources in previous lessons, today we pivot towards hardening our RDS (Relational Database Service) snapshots and associated IAM policies. This involves implementing best practices that not only secure our data but also reduce the attack surface by enforcing tight access controls. 

## Learning Objectives
Today, we will master the art of hardening our AWS environment by focusing on security configurations for Amazon S3 buckets and IAM policies. We’ll learn how to eliminate credential storage vulnerabilities, enforce encryption, and implement strict IAM permissions that minimize risks associated with RDS snapshots. By the end of this lesson, you will be equipped with the knowledge to enhance the security posture of your cloud infrastructure.

## Deep Dive

### Hardening S3 Buckets

**1. Remove Credential Storage**  
First and foremost, we must eliminate any instances of hard-coded credentials or sensitive information stored in our S3 buckets. For example, if we previously had an S3 object storing `access_keys.txt`, we should delete that resource. This is a vital step in preventing unauthorized access.

**2. Implement AWS Secrets Manager**  
Instead of storing sensitive credentials in S3, we can utilize AWS Secrets Manager. This service allows you to securely store and manage access to your secrets, such as database credentials. The configuration might look like this:

```hcl
resource "aws_secretsmanager_secret" "example" {
  name        = "MySecret"
  description = "This secret contains my database credentials"
}
```
*# Replace with your actual secret name and details*

**3. Enable Encryption**  
Data at rest should always be encrypted. We can add server-side encryption to our S3 bucket using a KMS key:

```hcl
resource "aws_s3_bucket_server_side_encryption_configuration" "example" {
  bucket = aws_s3_bucket.example.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
      kms_master_key_id = "arn:aws:kms:REGION:ACCOUNT_ID:key/KEY_ID"
    }
  }
}
```
*# Replace REGION, ACCOUNT_ID, and KEY_ID with actual values*

**4. Enable Versioning**  
To protect against accidental deletion or overwriting of objects, enable versioning:

```hcl
resource "aws_s3_bucket_versioning" "example" {
  bucket = aws_s3_bucket.example.id
  versioning_configuration {
    status = "Enabled"
  }
}
```

**5. Block Public Access**  
Prevent unauthorized access by ensuring that all public access settings are blocked:

```hcl
resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.example.id
  block_public_acls = true
  ignore_public_acls = true
  block_public_policy = true
  restrict_public_buckets = true
}
```

**6. Enforce HTTPS**  
To ensure secure communication, we can add a bucket policy that only allows HTTPS requests:

```hcl
resource "aws_s3_bucket_policy" "example" {
  bucket = aws_s3_bucket.example.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          "arn:aws:s3:::${aws_s3_bucket.example.id}",
          "arn:aws:s3:::${aws_s3_bucket.example.id}/*"
        ]
        Condition = {
          "Bool" = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}
```

**7. Enable Access Logging**  
Lastly, track access to your bucket by enabling logging:

```hcl
resource "aws_s3_bucket_logging" "example" {
  bucket = aws_s3_bucket.example.id
  target_bucket = aws_s3_bucket.logs.id
  target_prefix = "log/"
}
```

### Hardening IAM Policies

**1. Restrict S3 Permissions**  
In our IAM policy for EC2, we can replace broad permissions such as `s3:*` with more specific actions:

```hcl
resource "aws_iam_role_policy" "cg-ec2-admin-policy" {
  name   = "cg-ec2-admin-policy"
  role   = aws_iam_role.cg-ec2-role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "s3:ListBucket"
        Resource = "arn:aws:s3:::cg-data-s3-bucket-${var.cgid}"
      }
    ]
  })
}
```

**2. Remove Unnecessary Permissions**  
In the user policy for our IAM user, we should remove permissions that could lead to potential exploits, such as:

- `rds:RestoreDBInstanceFromDBSnapshot`
- `rds:ModifyDBInstance`
- `rds:AddTagsToResource`

Instead, retain only the necessary read-only actions:

```hcl
resource "aws_iam_user_policy" "cg-david-policy" {
  name   = "cg-david-policy"
  user   = aws_iam_user.cg-david.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds:DescribeDBSnapshots"
        ]
        Resource = "arn:aws:rds:${var.region}:${account_id}:db:cg-rds"
      }
    ]
  })
}
```

### Common Pitfalls to Avoid
- **Ignoring Encryption**: Always ensure that sensitive data is encrypted both at rest and in transit.
- **Over-permissioning IAM Roles**: Regularly review IAM roles and policies to ensure they adhere to the principle of least privilege.
- **Neglecting Logging and Monitoring**: Enable logging to keep track of access patterns and potential anomalies.

## Hands-On Practice
To put this into practice, follow these steps:

1. Update your Terraform files based on the configurations provided above.
2. Run `terraform plan` to see the changes that will be applied.
3. Execute `terraform apply` to implement the changes.
4. Verify that the S3 bucket settings reflect the security enhancements by checking the AWS Management Console.
5. Ensure that the IAM policies are restricted as intended by reviewing them in the IAM dashboard.

## Key Takeaways
In today's session, we fortified our cloud environment by removing sensitive data storage from S3, implementing AWS Secrets Manager, and enforcing strict IAM policies. By focusing on encryption, access control, and logging, we prepared our infrastructure to withstand potential security threats while adhering to best practices.

## Real-World Applications
These hardening techniques are critical in any production environment. For instance, an e-commerce platform handling customer data must ensure that payment information is never exposed and that only necessary personnel can access sensitive resources. By applying these principles, organizations can significantly reduce their risk exposure and enhance their overall security posture.

---
**Journey Progress:** 51/100 Days Complete 🚀