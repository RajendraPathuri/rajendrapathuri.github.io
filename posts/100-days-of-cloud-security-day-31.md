---
title: '100 Days of Cloud Security - Day 31: Hardening - `iam_privesc_by_key_rotation`'
date: '2025-12-10'
author: 'Venkata Pathuri'
excerpt: 'Day 31 of my cloud security journey - Hardening - `iam_privesc_by_key_rotation`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 31: Hardening - `iam_privesc_by_key_rotation`

## Overview
In our previous learning, we explored the vulnerabilities associated with IAM user permissions, particularly focusing on how privilege escalation can occur through improperly managed access keys. Today, we take a significant step forward by hardening the `iam_privesc_by_key_rotation` scenario. By implementing stricter access controls and enforcing best practices, we’ll ensure that our cloud environment is more secure against unauthorized access and potential breaches.

## Learning Objectives
Throughout today's session, you will master the art of hardening IAM policies and managing secrets in AWS. We will dive deep into the principles of least privilege and MFA-based access control, allowing you to confidently secure your cloud resources. By the end of this lesson, you will not only understand how to eliminate privilege escalation paths but also how to protect sensitive information stored in AWS Secrets Manager.

## Deep Dive
To effectively harden the `iam_privesc_by_key_rotation` scenario, we made several key updates to our Terraform configuration files. Each of these changes plays a crucial role in enhancing security.

### 1. Restricting IAM User Actions
In the `iam_manager.tf` file, we restricted actions related to managing access keys. Previously, the `manager` user had the ability to create and rotate access keys for any user, including the `admin`. By using `${aws:username}`, we ensured that the `manager` can only manage their own access keys. Here’s a sample of the updated policy:

```hcl
resource "aws_iam_policy" "manager_policy" {
  name = "ManagerPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iam:CreateAccessKey",
          "iam:EnableMFADevice"
        ]
        Resource = "arn:aws:iam::123456789012:user/${aws:username}"  # Replace with your actual ARN
      },
      {
        Effect = "Deny"
        Action = "iam:TagResources"
        Resource = "*"
      }
    ]
  })
}
```
This effectively prevents the `manager` from tagging or rotating keys for other users, thus closing the privilege escalation path.

### 2. Limiting Developer Permissions
In `iam_developer.tf`, we limited the developer's permissions to only view and get a specific secret used in this scenario. By removing broad permissions like `ListSecrets`, we significantly reduced the attack surface. Here’s how the policy looks:

```hcl
resource "aws_iam_policy" "developer_policy" {
  name = "DeveloperPolicy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:us-west-2:123456789012:secret:exampleSecret"  # Replace with your actual ARN
      }
    ]
  })
}
```

### 3. Protecting Secrets with Resource-Based Policies
In `secrets.tf`, we implemented a resource-based policy on the secret that allows only the `cg_secretsmanager` role to read it. Additionally, we enforced MFA requirements through conditions to ensure that only authenticated users can access sensitive information:

```hcl
resource "aws_secretsmanager_secret_policy" "example" {
  secret_arn = "arn:aws:secretsmanager:us-west-2:123456789012:secret:exampleSecret"  # Replace with your actual ARN

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::123456789012:role/cg_secretsmanager"  # Replace with your actual ARN
        }
        Action = "secretsmanager:GetSecretValue"
        Resource = "*"
        Condition = {
          "Bool" = {
            "aws:MultiFactorAuthPresent" = "true"
          }
        }
      }
    ]
  })
}
```

## Hands-On Practice
To put your learning into action, follow these steps:

1. **Update your Terraform files**: Implement the changes as described above in your `iam_manager.tf`, `iam_developer.tf`, and `secrets.tf` files.
   
2. **Apply the changes**: Run the following command to apply your Terraform configuration:
   ```bash
   terraform apply
   ```

3. **Verify access**: Test the permissions by attempting to access the secret with both the `manager` and `developer` users. The `manager` should be unable to access or manage other users' keys, while the `developer` should only have access to the specified secret.

### Common Troubleshooting Tips:
- If you encounter permission errors, double-check the ARN in your policies.
- Ensure that you are logged in with the appropriate IAM user when testing access.
- Make sure MFA is configured correctly for users who require it.

## Key Takeaways
Today, we solidified our understanding of IAM privilege management and the importance of least privilege and MFA in securing sensitive resources. By implementing tighter controls on user actions and protecting secrets with resource-based policies, we have significantly hardened our environment against potential threats.

## Real-World Applications
These hardening techniques are not just theoretical; they are essential in production environments where sensitive data is handled. For example, in a financial institution, ensuring that only authorized personnel can access sensitive client information is critical to maintaining trust and compliance with regulations. By applying the principles learned today, you can help safeguard your organization's most valuable assets in the cloud.

---
**Journey Progress:** 31/100 Days Complete 🚀