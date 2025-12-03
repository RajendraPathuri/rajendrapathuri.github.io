---
title: '100 Days of Cloud Security - Day 24: Hardening - `codebuild_secrets`'
date: '2025-12-03'
author: 'Venkata Pathuri'
excerpt: 'Day 24 of my cloud security journey - Hardening - `codebuild_secrets`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 24: Hardening - `codebuild_secrets`

## Overview
As we dive deeper into our cloud security journey, today’s focus on hardening the `codebuild_secrets` scenario emphasizes the critical need to secure sensitive information and prevent unauthorized access. Building upon the foundation we laid in Day 23, where we explored the importance of Infrastructure as Code (IaC) for security, today we will implement practical measures to safeguard our resources and credentials from potential threats.

## Learning Objectives
By the end of today’s session, you will master the skills necessary to secure AWS CodeBuild environments effectively. You will learn how to manage sensitive information using AWS Secrets Manager and SSM Parameter Store, implement least privilege access for users, and apply best practices for hardening your cloud infrastructure. This knowledge will empower you to create a more secure and resilient environment for your applications.

## Deep Dive

### Understanding the `codebuild_secrets` Scenario
The `codebuild_secrets` scenario represents a common challenge in cloud security: how to manage and protect sensitive data such as database credentials or API keys within your CI/CD pipelines. Without proper safeguards, these secrets can be exposed, leading to serious vulnerabilities.

### Step 1: Using SSM Parameter Store
In our Terraform configuration, we moved the SSH private key to the AWS Systems Manager (SSM) Parameter Store as a `SecureString`. This ensures that sensitive information is encrypted at rest and can only be accessed based on defined permissions. Here’s how you would define this in your `ssm-parameters.tf`:

```hcl
resource "aws_ssm_parameter" "ssh_private_key" {
  name  = "/codebuild/secrets/ssh_private_key"
  type  = "SecureString"
  value = "YOUR_PRIVATE_KEY_HERE" # Replace with your actual private key
  key_id = "alias/aws/ssm" # KMS key for encryption
}
```

### Step 2: Storing RDS Credentials
Next, we stored our RDS credentials using AWS Secrets Manager. This approach not only encrypts the credentials but also allows for automated rotation, reducing the risk of credential compromise. Here is an example of how we reference these credentials in our `rds.tf`:

```hcl
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "RDS_Credentials"
}

resource "aws_secretsmanager_secret_version" "db_credentials_version" {
  secret_id     = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "admin" # Replace with your actual username
    password = "YOUR_DB_PASSWORD" # Replace with your actual password
  })
}
```

### Step 3: Implementing IAM Policies
To further secure our environment, we defined IAM policies that restrict user permissions. By applying explicit deny rules for critical actions, we mitigate the risk of users inadvertently accessing or modifying sensitive resources. Here’s an example:

```hcl
resource "aws_iam_policy" "restrict_access" {
  name        = "RestrictSensitiveActions"
  description = "Deny access to critical RDS actions"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Deny"
        Action = [
          "ssm:GetParameter",
          "rds:ModifyDBInstance",
          "rds:RestoreDBInstanceFromDBSnapshot",
          "rds:CreateDBSnapshot"
        ]
        Resource = "*"
      }
    ]
  })
}
```

### Step 4: Hardening CodeBuild Environment
Finally, in our `codebuild.tf`, we removed any environment variables that could expose sensitive information and limited EC2-related permissions to specific resources only:

```hcl
resource "aws_codebuild_project" "my_project" {
  name          = "MySecureBuildProject"
  source        = ...
  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/standard:5.0"
    type         = "LINUX_CONTAINER"
    # Removed sensitive environment variables
  }
}
```

## Hands-On Practice
To implement these security measures, follow the steps outlined in your Terraform files. Start by updating your `ssm-parameters.tf`, `rds.tf`, `iam.tf`, and `codebuild.tf` files as demonstrated above. After making these changes, run the following commands in your terminal:

```bash
terraform init
terraform plan
terraform apply
```

**Expected Outcomes:** You should see your resources created or updated without exposing sensitive information. Verify that the RDS instance is correctly configured to use the credentials stored in Secrets Manager by checking the AWS Management Console.

**Common Troubleshooting Tips:**
- Ensure that your IAM roles have the necessary permissions to access SSM and Secrets Manager.
- If you encounter access denied errors, double-check your IAM policies and resource ARNs.

## Key Takeaways
Today’s focus on hardening the `codebuild_secrets` scenario has reinforced the importance of managing sensitive data securely. By leveraging AWS Secrets Manager and SSM Parameter Store, enforcing least privilege access, and eliminating exposure of sensitive information, we have significantly improved the security posture of our cloud infrastructure.

## Real-World Applications
In a production environment, these practices are crucial for maintaining compliance with industry standards such as GDPR and HIPAA, where sensitive information must be handled with care. Securing your CI/CD pipelines not only protects your applications but also builds trust with your users, ensuring that their data is secure.

---
**Journey Progress:** 24/100 Days Complete 🚀